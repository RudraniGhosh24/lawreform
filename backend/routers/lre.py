from fastapi import APIRouter
from pydantic import BaseModel
from engines.lre_engine import analyze_case, run_counterfactual

router = APIRouter()

class LRERequest(BaseModel):
    case_description: str
    sections: list[str]
    court: str
    state: str
    has_evidence: bool
    is_first_offence: bool
    accused_gender: str

class CounterfactualRequest(BaseModel):
    original_case_info: dict
    modified_sections: list[str]
    modified_court: str
    modified_state: str
    modified_evidence: bool
    modified_first_offence: bool

@router.post("/analyze")
async def analyze(req: LRERequest):
    return analyze_case(
        req.case_description, req.sections, req.court,
        req.state, req.has_evidence, req.is_first_offence, req.accused_gender
    )

@router.post("/counterfactual")
async def counterfactual(req: CounterfactualRequest):
    return run_counterfactual(
        {"case_info": req.original_case_info},
        req.modified_sections, req.modified_court,
        req.modified_state, req.modified_evidence, req.modified_first_offence
    )
