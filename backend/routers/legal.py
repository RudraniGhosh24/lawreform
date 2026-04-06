from fastapi import APIRouter
from pydantic import BaseModel
from typing import Any
from engines.legal_engine import analyze_legal_scenario

router = APIRouter()

class LegalRequest(BaseModel):
    jurisdiction: str
    area: str
    answers: dict[str, Any]

@router.post("/analyze")
async def analyze(req: LegalRequest):
    result = analyze_legal_scenario(req.jurisdiction, req.area, req.answers)
    return result
