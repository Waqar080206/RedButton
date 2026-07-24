from datetime import datetime, timezone

from db import get_conn

MAX_HISTORY_TURNS = 6  # last N user+assistant pairs included as context


def get_history(session_id: str) -> list[dict]:
    with get_conn() as conn:
        rows = conn.execute(
            "SELECT role, content FROM messages WHERE session_id = ? ORDER BY id ASC",
            (session_id,),
        ).fetchall()
    history = [{"role": row["role"], "content": row["content"]} for row in rows]
    return history[-(MAX_HISTORY_TURNS * 2):]


def save_message(session_id: str, role: str, content: str):
    with get_conn() as conn:
        conn.execute(
            "INSERT INTO messages (session_id, role, content, created_at) VALUES (?, ?, ?, ?)",
            (session_id, role, content, datetime.now(timezone.utc).isoformat()),
        )
