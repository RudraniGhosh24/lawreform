"""
Lawreformer AI — FastAPI Backend
Built by Rudrani Ghosh · lawreformer.com · © 2026 Rudrani Ghosh. All rights reserved.
Kaggle Gemma 4 Good Hackathon · Digital Equity Track
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sse_starlette.sse import EventSourceResponse
from pydantic import BaseModel
from typing import Optional
import json
import os

from rag import retrieve_context
from gemma_client import stream_gemma_response

app = FastAPI(title="Lawreformer AI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://ai.lawreformer.com",
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AskRequest(BaseModel):
    question: str
    language: str = "English"


SYSTEM_PROMPT = (
    "You are Lawreformer AI, created by Rudrani Ghosh (lawreformer.com). "
    "You help people in India understand their legal rights in plain, simple language. "
    "Never give legal advice — always frame answers as 'you may have the right to...' "
    "Cite the specific law you are drawing from. Respond in {language}. "
    "Be warm, clear, and non-intimidating. "
    "After your explanation, suggest 2-3 concrete next steps the person can take. "
    "Format law citations in square brackets like [Right to Information Act, 2005]."
)


@app.get("/health")
def health():
    return {"status": "ok", "service": "lawreformer-ai"}


@app.post("/ask")
async def ask(req: AskRequest):
    """Stream a Gemma 4 response grounded in Indian legal knowledge via RAG."""
    context_chunks = retrieve_context(req.question, top_k=3)
    context_text = "\n\n".join(
        [f"[Source: {c['source']}]\n{c['text']}" for c in context_chunks]
    )

    system = SYSTEM_PROMPT.format(language=req.language)
    user_message = (
        f"Legal context (use these to ground your answer):\n{context_text}\n\n"
        f"User's question: {req.question}"
    )

    async def event_generator():
        full_response = ""
        async for token in stream_gemma_response(system, user_message):
            full_response += token
            yield {"event": "token", "data": json.dumps({"token": token})}
        yield {
            "event": "done",
            "data": json.dumps({"full_response": full_response}),
        }

    return EventSourceResponse(event_generator())


@app.post("/ask-sync")
async def ask_sync(req: AskRequest):
    """Non-streaming fallback for environments that don't support SSE."""
    context_chunks = retrieve_context(req.question, top_k=3)
    context_text = "\n\n".join(
        [f"[Source: {c['source']}]\n{c['text']}" for c in context_chunks]
    )

    system = SYSTEM_PROMPT.format(language=req.language)
    user_message = (
        f"Legal context (use these to ground your answer):\n{context_text}\n\n"
        f"User's question: {req.question}"
    )

    full_response = ""
    async for token in stream_gemma_response(system, user_message):
        full_response += token

    return JSONResponse({"response": full_response})
