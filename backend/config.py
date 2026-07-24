import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

BACKEND_DIR = Path(__file__).resolve().parent
STORAGE_DIR = BACKEND_DIR / "storage"
UPLOADS_DIR = STORAGE_DIR / "uploads"
QDRANT_DIR = STORAGE_DIR / "qdrant_data"
DB_PATH = STORAGE_DIR / "app.db"

UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
QDRANT_DIR.mkdir(parents=True, exist_ok=True)

LLM_PROVIDER = os.environ.get("LLM_PROVIDER", "anthropic")  # "anthropic" or "groq"

ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")
ANTHROPIC_MODEL = "claude-opus-4-8"

GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")
GROQ_MODEL = "openai/gpt-oss-120b"

QDRANT_COLLECTION = "manual_chunks"

CHUNK_SIZE = 800
CHUNK_OVERLAP = 100
RETRIEVAL_TOP_K = 5
CONFIDENCE_THRESHOLD = 0.35
