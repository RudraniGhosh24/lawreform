from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import legal, simulator, clausesnap, lre, limitation
import os

app = FastAPI(title="LawReformer API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://lawreformer.com", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(legal.router, prefix="/legal")
app.include_router(simulator.router, prefix="/simulator")
app.include_router(clausesnap.router, prefix="/clausesnap")
app.include_router(lre.router, prefix="/lre")
app.include_router(limitation.router, prefix="/limitation")

@app.get("/health")
def health():
    return {"status": "ok"}
