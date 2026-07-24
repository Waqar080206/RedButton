from fastapi import APIRouter, Form, HTTPException, UploadFile, File

from db import get_conn
from models import DocumentOut
from services.ingestion import delete_document, ingest_document

router = APIRouter(prefix="/documents", tags=["documents"])


@router.post("/upload", response_model=DocumentOut)
def upload_document(
    file: UploadFile = File(...),
    uploaded_by: str | None = Form(None),
    role: str | None = Form(None),
    machine_id: str | None = Form(None),
):
    contents = file.file.read()
    result = ingest_document(
        file_bytes=contents,
        original_filename=file.filename,
        uploaded_by=uploaded_by,
        role=role,
        machine_id=machine_id,
    )
    return result


@router.get("", response_model=list[DocumentOut])
def list_documents():
    with get_conn() as conn:
        rows = conn.execute("SELECT * FROM documents ORDER BY upload_time DESC").fetchall()
    return [dict(row) for row in rows]


@router.delete("/{doc_id}")
def remove_document(doc_id: str):
    if not delete_document(doc_id):
        raise HTTPException(status_code=404, detail="Document not found")
    return {"status": "deleted", "id": doc_id}
