from typing import Optional

from pydantic import BaseModel


class DocumentOut(BaseModel):
    id: str
    filename: str
    uploaded_by: Optional[str] = None
    role: Optional[str] = None
    machine_id: Optional[str] = None
    upload_time: str
    chunk_count: int
    status: str


class ChatRequest(BaseModel):
    question: str
    machine_id: Optional[str] = None
    session_id: Optional[str] = None


class Citation(BaseModel):
    filename: str
    snippet: str
    chunk_index: int


class ChatResponse(BaseModel):
    answer: str
    found_in_manuals: bool
    citations: list[Citation]
    session_id: str
