from fastapi import APIRouter

from models import ChatRequest, ChatResponse
from services.rag import answer_question

router = APIRouter(tags=["chat"])


@router.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    return answer_question(req.question, machine_id=req.machine_id, session_id=req.session_id)
