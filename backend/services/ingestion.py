import io
import uuid
from datetime import datetime, timezone
from pathlib import Path

from docx import Document as DocxDocument
from pypdf import PdfReader

from config import CHUNK_OVERLAP, CHUNK_SIZE, QDRANT_COLLECTION, UPLOADS_DIR
from db import get_conn
from services.retrieval import get_qdrant_client


def extract_text(data: bytes, filename: str) -> str:
    suffix = Path(filename).suffix.lower()
    if suffix == ".pdf":
        reader = PdfReader(io.BytesIO(data))
        return "\n".join(page.extract_text() or "" for page in reader.pages)
    if suffix == ".docx":
        doc = DocxDocument(io.BytesIO(data))
        return "\n".join(p.text for p in doc.paragraphs)
    return data.decode("utf-8", errors="ignore")


def chunk_text(text: str, size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> list[str]:
    text = text.strip()
    if not text:
        return []
    chunks = []
    start = 0
    while start < len(text):
        end = start + size
        chunks.append(text[start:end])
        start += size - overlap
    return chunks


def ingest_document(
    file_bytes: bytes,
    original_filename: str,
    uploaded_by: str | None,
    role: str | None,
    machine_id: str | None,
) -> dict:
    doc_id = uuid.uuid4().hex
    safe_name = f"{doc_id}_{Path(original_filename).name}"
    dest = UPLOADS_DIR / safe_name
    dest.write_bytes(file_bytes)

    text = extract_text(file_bytes, original_filename)
    chunks = chunk_text(text)

    client = get_qdrant_client()
    if chunks:
        client.add(
            collection_name=QDRANT_COLLECTION,
            documents=chunks,
            metadata=[
                {
                    "document_id": doc_id,
                    "filename": original_filename,
                    "chunk_index": i,
                    "machine_id": machine_id,
                }
                for i in range(len(chunks))
            ],
            ids=[str(uuid.uuid5(uuid.NAMESPACE_OID, f"{doc_id}_{i}")) for i in range(len(chunks))],
        )

    upload_time = datetime.now(timezone.utc).isoformat()
    with get_conn() as conn:
        conn.execute(
            "INSERT INTO documents (id, filename, uploaded_by, role, machine_id, "
            "upload_time, chunk_count, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            (doc_id, original_filename, uploaded_by, role, machine_id, upload_time, len(chunks), "ready"),
        )

    return {
        "id": doc_id,
        "filename": original_filename,
        "uploaded_by": uploaded_by,
        "role": role,
        "machine_id": machine_id,
        "upload_time": upload_time,
        "chunk_count": len(chunks),
        "status": "ready",
    }


def delete_document(doc_id: str) -> bool:
    with get_conn() as conn:
        cur = conn.execute("SELECT id FROM documents WHERE id = ?", (doc_id,))
        if cur.fetchone() is None:
            return False
        conn.execute("DELETE FROM documents WHERE id = ?", (doc_id,))

    from qdrant_client import models

    client = get_qdrant_client()
    client.delete(
        collection_name=QDRANT_COLLECTION,
        points_selector=models.FilterSelector(
            filter=models.Filter(
                must=[models.FieldCondition(key="document_id", match=models.MatchValue(value=doc_id))]
            )
        ),
    )
    return True
