"""
Rule-based legal decision engine.
All logic is server-side — never exposed to the client.
"""
from typing import Any
from .rules.tort_rules import analyze_tort
from .rules.criminal_rules import analyze_criminal
from .rules.family_rules import analyze_family
from .rules.contract_rules import analyze_contract

DISCLAIMER = (
    "This analysis is for educational purposes only and does not constitute legal advice. "
    "Laws vary and change. Consult a qualified legal professional for your specific situation."
)

def analyze_legal_scenario(jurisdiction: str, area: str, answers: dict[str, Any]) -> dict:
    handlers = {
        "tort": analyze_tort,
        "criminal": analyze_criminal,
        "family": analyze_family,
        "contract": analyze_contract,
    }
    handler = handlers.get(area)
    if not handler:
        return {"error": "Unknown area of law"}

    result = handler(jurisdiction, answers)
    result["disclaimer"] = DISCLAIMER
    return result
