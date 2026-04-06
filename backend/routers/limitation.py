from fastapi import APIRouter
from pydantic import BaseModel
from engines.limitation_engine import analyze_limitation

router = APIRouter()

class LimitationRequest(BaseModel):
    case_type_query: str
    jurisdiction: str
    incident_date: str
    description: str
    has_disability: bool
    has_acknowledgment: bool
    apply_covid_extension: bool

@router.post("/analyze")
async def analyze(req: LimitationRequest):
    return analyze_limitation(
        req.case_type_query, req.jurisdiction, req.incident_date,
        req.description, req.has_disability, req.has_acknowledgment,
        req.apply_covid_extension,
    )
