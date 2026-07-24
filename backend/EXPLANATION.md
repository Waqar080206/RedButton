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
| LLM (answer generation) | Anthropic Claude (`claude-opus-4-8`) | structured JSON output for reliable answer + citations |
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
    rag.py                  # confidence gate + Claude call + citations
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
   │  POST /chat  { question, machine_id? }
   ▼
routers/chat.py: chat()
   ▼
services/rag.py: answer_question()
   │
   ├─ services/retrieval.py: retrieve_chunks()
   │    Qdrant client.query() — embeds the question, does a similarity
   │    search against "manual_chunks", optionally filtered by machine_id
   │    (models.Filter + FieldCondition on the machine_id payload field)
   │
   ├─ CONFIDENCE GATE
   │    if no results OR top result's score < CONFIDENCE_THRESHOLD (0.35):
   │      -> return a fixed "not found in uploaded manuals" response,
   │         found_in_manuals=false, no Claude call made
   │      (this is what stops the system from hallucinating an answer)
   │
   └─ otherwise: build a context block from the retrieved chunks
        (filename + chunk_index + text of each), then call Claude
        (client.messages.create with output_config.format = a JSON
        schema for {answer, found_in_manuals, citations[]}) with a
        system prompt that says "answer only from the provided
        context, cite sources, say so if the answer isn't there"
   ▼
Response: ChatResponse { answer, found_in_manuals, citations[] }
```

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
