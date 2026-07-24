# Red Button RAG Backend — Explanation & Flow

## What this is

A FastAPI backend implementing a RAG (retrieval-augmented generation) pipeline for
industrial machine manuals/SOPs. Admins/supervisors upload documents; workers ask
questions and get answers grounded in those documents, with citations and a
confidence gate that refuses to guess when nothing relevant was found.

## Stack

| Concern | Choice | Why |
|---|---|---|
| API framework | FastAPI | async routes, auto docs, typed request/response models |
| LLM (answer generation) | Anthropic Claude (`claude-opus-4-8`), swappable to Groq (`openai/gpt-oss-120b`) via `LLM_PROVIDER` env var | structured JSON output for reliable answer + citations; Groq is a free fallback for testing without API credits |
| Embeddings | `fastembed` (via `qdrant-client[fastembed]`) | free, local, ONNX-based — no API key, no torch |
| Vector store | Qdrant, embedded/local mode (`QdrantClient(path=...)`) | no server/docker needed for a mini/test deployment |
| Document metadata | SQLite (`storage/app.db`) | filename, uploader, role, machine_id, chunk count |
| File storage | Local disk (`storage/uploads/`) | original files kept for reference |

## Directory map

```
backend/
  main.py                # FastAPI app: CORS, routers, static mount
  config.py               # env vars, paths, tunables (chunk size, top_k, confidence threshold)
  db.py                    # SQLite connection + schema
  models.py                # Pydantic request/response schemas
  services/
    ingestion.py           # extract -> chunk -> embed+store -> record metadata
    retrieval.py            # Qdrant query, optional machine_id filter
    rag.py                  # confidence gate + Claude/Groq call + citations
    memory.py                # per-session conversation history (SQLite "messages" table)
  routers/
    documents.py            # POST /documents/upload, GET /documents, DELETE /documents/{id}
    chat.py                  # POST /chat
  static/index.html         # mini test chatbot UI (served at /)
  storage/                  # gitignored: uploads/, qdrant_data/, app.db
```

## Flow 1 — Admin/supervisor uploads a document

```
Browser (static/index.html)
   │  POST /documents/upload  (file, role, uploaded_by, machine_id?)
   ▼
routers/documents.py: upload_document()
   │  reads file bytes once
   ▼
services/ingestion.py: ingest_document()
   ├─ writes original bytes to storage/uploads/<uuid>_<filename>
   ├─ extract_text(): pypdf (.pdf) / python-docx (.docx) / plain decode (.txt)
   ├─ chunk_text(): ~800 chars per chunk, ~100 char overlap
   ├─ Qdrant client.add(): embeds each chunk (fastembed) and upserts into
   │  the "manual_chunks" collection with payload:
   │    { document_id, filename, chunk_index, machine_id }
   │  point IDs are uuid5(doc_id + chunk_index) — Qdrant requires UUID/int IDs
   └─ SQLite INSERT into documents table (id, filename, uploaded_by, role,
      machine_id, upload_time, chunk_count, status)
   ▼
Response: DocumentOut (id, filename, chunk_count, status, ...)
```

## Flow 2 — Worker asks a question

```
Browser (static/index.html)
   │  POST /chat  { question, machine_id?, session_id? }
   │  session_id comes from localStorage; null on a brand-new conversation
   ▼
routers/chat.py: chat()
   ▼
services/rag.py: answer_question()
   │
   ├─ session_id = session_id or uuid4()  — first turn mints a new one
   ├─ services/memory.py: get_history(session_id)
   │    loads prior turns (last 6 user+assistant pairs) from SQLite "messages"
   │
   ├─ services/retrieval.py: retrieve_chunks()
   │    Qdrant client.query() — embeds the CURRENT question only (history is
   │    not used for retrieval), does a similarity search against
   │    "manual_chunks", optionally filtered by machine_id
   │
   ├─ CONFIDENCE GATE
   │    if no results OR top result's score < CONFIDENCE_THRESHOLD (0.35):
   │      -> return a fixed "not found in uploaded manuals" response,
   │         found_in_manuals=false, no Claude call made
   │      (this runs BEFORE history is used — see "Memory + confidence gate"
   │      note below)
   │
   ├─ otherwise: build a context block from the retrieved chunks, then call
   │    Claude/Groq with `history + [current question+context]` as the
   │    messages array, so follow-ups like "what about the second one?"
   │    resolve correctly
   │
   └─ services/memory.py: save_message() — the question and the answer text
        (not the full JSON) are appended to SQLite "messages" under session_id
   ▼
Response: ChatResponse { answer, found_in_manuals, citations[], session_id }
```

### Memory + confidence gate interaction (known limitation)

The confidence gate scores retrieval on the **current question alone**, before
the LLM (and its conversation history) is ever consulted. This means:

- Follow-ups that still relate to manual content ("what about docx files?")
  work correctly — they retrieve well on their own and the LLM sees prior
  turns too.
- Pure meta-questions about the conversation itself ("what did I just ask
  you?", "which one did I mention first?") get blocked by the gate and never
  reach the LLM, because they don't semantically match any manual chunk.

This is a byproduct of keeping the "never hallucinate safety content" gate
simple. If conversational meta-questions need to work, the gate would need to
check for existing history before requiring a retrieval match — not
implemented, since the core requirement was grounded manual Q&A, not general
chat memory.

## Flow 3 — Deleting a document

```
DELETE /documents/{id}
   ▼
routers/documents.py -> services/ingestion.py: delete_document()
   ├─ SQLite: verify the id exists, then DELETE FROM documents
   └─ Qdrant: client.delete() with a Filter on payload.document_id
      (removes every chunk belonging to that document — no need to
      track individual point IDs)
```

## Key design decisions worth knowing

- **Confidence gate before calling Claude.** Cheap and prevents hallucinated
  safety-relevant answers — if retrieval finds nothing good, the LLM is never
  invoked.
- **Structured output over prompt-engineered JSON.** The Claude call uses
  `output_config.format` with a JSON schema instead of asking for JSON in
  prose and `json.loads()`-parsing it — more reliable, no markdown-fence or
  trailing-commentary parsing failures.
- **`machine_id` is optional, not enforced.** The full Red Button product
  scopes retrieval to a scanned machine; this mini backend supports the same
  filter field but doesn't require it, since machine-scoping UI wasn't part of
  this build.
- **No real auth.** `role`/`uploaded_by` are plain form fields, matching the
  current app's unwired login screen. Fine for a test/demo backend, not for
  production.
- **Qdrant runs embedded (no server).** `QdrantClient(path=...)` persists to
  `storage/qdrant_data/` directly — good for a mini backend, but it takes an
  exclusive file lock. Don't run `uvicorn --reload` against it (see below).

## Known gotchas

- **Don't use `uvicorn --reload`.** Embedded Qdrant locks its storage
  directory; the reloader's subprocess model can leave a stale `.lock` file.
  If you see a "storage folder is already accessed" error, stop all Python
  processes and delete `storage/qdrant_data/.lock`.
- **Single worker only.** Embedded Qdrant's file lock means only one process
  can hold `storage/qdrant_data/` at a time. Run with a single uvicorn worker
  (the default — don't pass `--workers > 1`, and don't put this behind
  gunicorn with multiple worker processes). If you outgrow this, run a real
  Qdrant server (Docker or Qdrant Cloud) and switch the client from
  `QdrantClient(path=...)` to `QdrantClient(url=...)`.
- **First upload is slow.** `fastembed` downloads its embedding model
  (`BAAI/bge-small-en-v1.5`) from Hugging Face on first use and caches it
  locally — expect a one-time delay of roughly a minute.
- **`/chat` needs `ANTHROPIC_API_KEY`.** Copy `.env.example` to `.env` and
  set it, or every chat request fails at the Claude call (retrieval and the
  confidence gate still run fine without it).

## Running it

```
cd backend
python -m venv .venv
.venv/Scripts/pip install -r requirements.txt   # .venv/bin/pip on macOS/Linux
copy .env.example .env   # then fill in ANTHROPIC_API_KEY
uvicorn main:app --host 127.0.0.1 --port 8000   # no --reload
```

Open `http://127.0.0.1:8000/` for the test chatbot UI, or hit the API directly:

- `POST /documents/upload` — multipart form: `file`, `role`, `uploaded_by`, `machine_id` (optional)
- `GET /documents` — list uploaded documents
- `DELETE /documents/{id}` — remove a document and its vectors
- `POST /chat` — JSON body: `{ "question": "...", "machine_id": "..." }` (machine_id optional)
