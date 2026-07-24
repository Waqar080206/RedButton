import json
import uuid

from config import (
    ANTHROPIC_API_KEY,
    ANTHROPIC_MODEL,
    CONFIDENCE_THRESHOLD,
    GROQ_API_KEY,
    GROQ_MODEL,
    LLM_PROVIDER,
)
from services.memory import get_history, save_message
from services.retrieval import retrieve_chunks

ANSWER_SCHEMA = {
    "type": "object",
    "properties": {
        "answer": {"type": "string"},
        "found_in_manuals": {"type": "boolean"},
        "citations": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "filename": {"type": "string"},
                    "snippet": {"type": "string"},
                    "chunk_index": {"type": "integer"},
                },
                "required": ["filename", "snippet", "chunk_index"],
                "additionalProperties": False,
            },
        },
    },
    "required": ["answer", "found_in_manuals", "citations"],
    "additionalProperties": False,
}

SYSTEM_PROMPT = (
    "You answer questions from industrial machine manuals and instructions. "
    "Answer only using the provided context chunks. Cite every fact you use by "
    "referencing the source filename and chunk. If the context does not contain "
    "the answer, set found_in_manuals to false and say so plainly instead of guessing. "
    "Prior turns in this conversation are included for context (e.g. to resolve "
    "follow-up questions like 'what about the second one') but must not themselves "
    "be treated as source material — only the provided context chunks are citable."
)

NOT_FOUND_ANSWER = {
    "answer": "I could not find this in the uploaded manuals. Please escalate to a supervisor.",
    "found_in_manuals": False,
    "citations": [],
}

GROQ_SCHEMA_INSTRUCTIONS = (
    "Respond with ONLY a JSON object, no markdown fences, no commentary, matching "
    'exactly this shape: {"answer": string, "found_in_manuals": boolean, '
    '"citations": [{"filename": string, "snippet": string, "chunk_index": integer}]}.'
)


def _build_context(results) -> str:
    context_blocks = []
    for r in results:
        meta = r.metadata or {}
        context_blocks.append(
            f"[filename: {meta.get('filename')}, chunk_index: {meta.get('chunk_index')}]\n{r.document}"
        )
    return "\n\n---\n\n".join(context_blocks)


def _call_anthropic(history: list[dict], context: str, question: str) -> dict:
    from anthropic import Anthropic

    client = Anthropic(api_key=ANTHROPIC_API_KEY) if ANTHROPIC_API_KEY else Anthropic()
    messages = history + [
        {"role": "user", "content": f"Context:\n{context}\n\nQuestion: {question}"}
    ]
    response = client.messages.create(
        model=ANTHROPIC_MODEL,
        max_tokens=1024,
        system=SYSTEM_PROMPT,
        output_config={"format": {"type": "json_schema", "schema": ANSWER_SCHEMA}},
        messages=messages,
    )
    text = next((b.text for b in response.content if b.type == "text"), "{}")
    return json.loads(text)


def _call_groq(history: list[dict], context: str, question: str) -> dict:
    from groq import Groq

    client = Groq(api_key=GROQ_API_KEY)
    messages = (
        [{"role": "system", "content": f"{SYSTEM_PROMPT} {GROQ_SCHEMA_INSTRUCTIONS}"}]
        + history
        + [{"role": "user", "content": f"Context:\n{context}\n\nQuestion: {question}"}]
    )
    response = client.chat.completions.create(
        model=GROQ_MODEL,
        response_format={"type": "json_object"},
        messages=messages,
    )
    return json.loads(response.choices[0].message.content)


def answer_question(question: str, machine_id: str | None = None, session_id: str | None = None) -> dict:
    session_id = session_id or uuid.uuid4().hex
    history = get_history(session_id)

    results = retrieve_chunks(question, machine_id=machine_id)

    if not results or results[0].score < CONFIDENCE_THRESHOLD:
        result = dict(NOT_FOUND_ANSWER)
    else:
        context = _build_context(results)
        if LLM_PROVIDER == "groq":
            result = _call_groq(history, context, question)
        else:
            result = _call_anthropic(history, context, question)

    save_message(session_id, "user", question)
    save_message(session_id, "assistant", result["answer"])

    result["session_id"] = session_id
    return result
