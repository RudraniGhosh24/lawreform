from fastapi import APIRouter
from pydantic import BaseModel
from engines.clausesnap_engine import analyze_clause

router = APIRouter()

class ClauseRequest(BaseModel):
    clause_text: str
    jurisdiction: str
    context_type: str

@router.post("/analyze")
async def analyze(req: ClauseRequest):
    result = analyze_clause(req.clause_text, req.jurisdiction, req.context_type)
    return result
