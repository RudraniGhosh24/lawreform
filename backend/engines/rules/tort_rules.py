"""Tort law decision engine — India, UK, US"""
from typing import Any

LIMITATION = {
    "india": {"Less than 6 months": True, "6 months – 1 year": True, "1–3 years": True, "More than 3 years": False},
    "uk": {"Less than 6 months": True, "6 months – 1 year": True, "1–3 years": True, "More than 3 years": False},
    "us": {"Less than 6 months": True, "6 months – 1 year": True, "1–3 years": True, "More than 3 years": False},
}

JURISDICTION_NOTES = {
    "india": "Under Indian tort law (largely common law), you must establish duty, breach, causation, and damage. The Limitation Act 1963 generally allows 3 years for tort claims.",
    "uk": "UK tort law is primarily common law. The Limitation Act 1980 sets a 6-year limit for most torts, 3 years for personal injury. Contributory negligence reduces damages under the Law Reform (Contributory Negligence) Act 1945.",
    "us": "US tort law varies by state. Statutes of limitation range from 1–6 years. Comparative negligence rules differ — some states use pure comparative, others modified (51% bar rule).",
}

APPLICABLE_LAWS = {
    "india": {
        "Negligence": ["Indian Contract Act 1872 (duty of care)", "Limitation Act 1963", "Motor Vehicles Act 1988 (road accidents)", "Consumer Protection Act 2019"],
        "Defamation / Libel / Slander": ["BNS Section 356 (Defamation)", "IT Act 2000 Section 66A (online)", "Limitation Act 1963"],
        "Nuisance": ["BNS Section 292 (Public Nuisance)", "BNSS Section 172", "Environment Protection Act 1986"],
        "Trespass": ["BNS Section 329-334 (Criminal Trespass)", "Specific Relief Act 1963"],
        "Product liability": ["Consumer Protection Act 2019", "Sale of Goods Act 1930"],
        "Occupier's liability": ["Occupier's Liability (common law)", "Factories Act 1948"],
        "Not sure": ["Indian Tort Law (Common Law)", "Limitation Act 1963"],
    },
    "uk": {
        "Negligence": ["Donoghue v Stevenson [1932]", "Occupiers' Liability Act 1957/1984", "Limitation Act 1980"],
        "Defamation / Libel / Slander": ["Defamation Act 2013", "Limitation Act 1980"],
        "Nuisance": ["Environmental Protection Act 1990", "Noise Act 1996"],
        "Trespass": ["Trespass to Land (Common Law)", "Criminal Justice Act 1994"],
        "Product liability": ["Consumer Protection Act 1987", "Sale of Goods Act 1979"],
        "Occupier's liability": ["Occupiers' Liability Act 1957", "Occupiers' Liability Act 1984"],
        "Not sure": ["Tort Law (Common Law)", "Limitation Act 1980"],
    },
    "us": {
        "Negligence": ["Restatement (Second) of Torts", "State Negligence Statutes", "Good Samaritan Laws"],
        "Defamation / Libel / Slander": ["First Amendment considerations", "State Defamation Laws", "SPEECH Act"],
        "Nuisance": ["Restatement (Second) of Torts §821", "State Nuisance Statutes"],
        "Trespass": ["Restatement (Second) of Torts §158", "State Trespass Laws"],
        "Product liability": ["Restatement (Third) of Torts: Products Liability", "State Product Liability Acts"],
        "Occupier's liability": ["Restatement (Second) of Torts §343", "State Premises Liability Laws"],
        "Not sure": ["State Tort Law", "Restatement of Torts"],
    },
}

def analyze_tort(jurisdiction: str, answers: dict[str, Any]) -> dict:
    role = answers.get("role", "")
    harm_type = answers.get("harm_type", "")
    duty = answers.get("duty_existed", False)
    breach = answers.get("breach", False)
    causation = answers.get("causation", False)
    contributory = answers.get("contributory", False)
    category = answers.get("harm_category", "Not sure")
    time_since = answers.get("time_since", "Less than 6 months")
    evidence = answers.get("evidence", False)

    # Core negligence test: duty + breach + causation + damage
    elements_met = sum([duty, breach, causation, bool(harm_type)])
    limitation_ok = LIMITATION.get(jurisdiction, {}).get(time_since, True)

    # Classification
    if category == "Negligence" or category == "Not sure":
        if elements_met == 4:
            classification = "Potential Negligence Claim — All Elements Present"
            risk = "High"
        elif elements_met >= 2:
            classification = "Possible Negligence — Some Elements Established"
            risk = "Medium"
        else:
            classification = "Weak Negligence Claim — Key Elements Missing"
            risk = "Low"
    elif category == "Defamation / Libel / Slander":
        classification = "Potential Defamation Claim"
        risk = "Medium"
    elif category == "Nuisance":
        classification = "Potential Nuisance Claim"
        risk = "Medium"
    elif category == "Product liability":
        classification = "Potential Product Liability Claim"
        risk = "High"
    else:
        classification = f"Potential {category} Claim"
        risk = "Medium"

    if not limitation_ok:
        classification += " — LIMITATION PERIOD MAY HAVE EXPIRED"
        risk = "Low"

    if contributory and role == "Claimant (victim)":
        classification += " (Contributory Negligence May Reduce Damages)"

    # Build output
    immediate_actions = []
    rights = []
    liabilities = []
    next_steps = []

    if role == "Claimant (victim)":
        immediate_actions = [
            "Document all evidence immediately — photos, videos, witness details",
            "Seek medical attention if physically injured and obtain medical records",
            "Do not discuss the incident on social media",
            "Preserve all communications related to the incident",
            "Note the date, time, location, and all parties involved",
        ]
        rights = [
            "Right to seek compensation for proven damages",
            "Right to legal representation",
            "Right to file a civil suit within the limitation period",
            "Right to seek interim injunction if ongoing harm",
        ]
        liabilities = [
            "If contributory negligence is proven, damages may be reduced",
            "Costs may be awarded against you if the claim fails",
        ]
        next_steps = [
            "Consult a tort/civil lawyer within the limitation period",
            "Send a legal notice to the defendant before filing suit",
            "Gather and preserve all evidence",
            "Obtain expert reports if technical negligence is involved",
            "Consider mediation before litigation to save costs",
        ]
    else:
        immediate_actions = [
            "Do not admit liability verbally or in writing",
            "Notify your insurer immediately",
            "Preserve all evidence and records",
            "Consult a defence lawyer immediately",
        ]
        rights = [
            "Right to legal representation",
            "Right to contest the claim",
            "Right to raise contributory negligence as a defence",
            "Right to challenge causation",
        ]
        liabilities = [
            "Potential liability for damages if negligence is proven",
            "Court costs if the claim succeeds",
            "Injunction to stop ongoing harmful conduct",
        ]
        next_steps = [
            "Engage a defence lawyer immediately",
            "Gather evidence to challenge the claimant's case",
            "Review your insurance coverage",
            "Consider settlement negotiations to avoid litigation costs",
        ]

    if not evidence:
        next_steps.insert(0, "Urgently gather evidence — lack of evidence significantly weakens any claim")

    laws = APPLICABLE_LAWS.get(jurisdiction, {}).get(category, APPLICABLE_LAWS.get(jurisdiction, {}).get("Not sure", []))

    return {
        "classification": classification,
        "summary": f"Based on your inputs, this appears to be a {category.lower()} matter under {jurisdiction.upper()} tort law. {'All four elements of negligence appear to be present.' if elements_met == 4 else 'Not all elements of negligence are clearly established.'} {'The limitation period may have expired — urgent legal advice is needed.' if not limitation_ok else ''}",
        "risk_level": risk,
        "immediate_actions": immediate_actions,
        "rights": rights,
        "liabilities": liabilities,
        "applicable_laws": laws,
        "jurisdiction_notes": JURISDICTION_NOTES.get(jurisdiction, ""),
        "recommended_next_steps": next_steps,
    }
