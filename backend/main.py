from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from db import init_db
from routers import chat, documents

app = FastAPI(title="Red Button RAG Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()

app.include_router(documents.router)
app.include_router(chat.router)

app.mount("/", StaticFiles(directory="static", html=True), name="static")
