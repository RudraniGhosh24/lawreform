from fastapi import APIRouter
from pydantic import BaseModel
from engines.simulator_engine import evaluate_simulation

router = APIRouter()

class SimRequest(BaseModel):
    scenario_id: str
    jurisdiction: str
    choices: list[dict]

@router.post("/evaluate")
async def evaluate(req: SimRequest):
    result = evaluate_simulation(req.scenario_id, req.jurisdiction, req.choices)
    return result
