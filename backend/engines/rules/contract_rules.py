"""Contract law decision engine — India, UK, US"""
from typing import Any

JURISDICTION_NOTES = {
    "india": "Indian contract law is governed by the Indian Contract Act 1872. A valid contract requires offer, acceptance, consideration, capacity, and free consent. The Limitation Act 1963 allows 3 years to sue for breach of contract.",
    "uk": "UK contract law is primarily common law. A valid contract requires offer, acceptance, consideration, and intention to create legal relations. The Limitation Act 1980 allows 6 years for breach of contract claims.",
    "us": "US contract law is governed by state common law and the Uniform Commercial Code (UCC) for goods. The statute of limitations varies by state (typically 4–6 years). The Restatement (Second) of Contracts is widely followed.",
}

APPLICABLE_LAWS = {
    "india": {
        "Employment": ["Indian Contract Act 1872", "Industrial Disputes Act 1947", "Payment of Wages Act 1936"],
        "Sale of goods": ["Sale of Goods Act 1930", "Indian Contract Act 1872", "Consumer Protection Act 2019"],
        "Service agreement": ["Indian Contract Act 1872", "Specific Relief Act 1963"],
        "Lease / Rental": ["Transfer of Property Act 1882", "Rent Control Acts (State-specific)"],
        "Loan / Finance": ["Indian Contract Act 1872", "SARFAESI Act 2002", "RBI Guidelines"],
        "Business partnership": ["Indian Partnership Act 1932", "Indian Contract Act 1872"],
        "Online / E-commerce": ["IT Act 2000", "Consumer Protection (E-Commerce) Rules 2020", "Indian Contract Act 1872"],
        "Other": ["Indian Contract Act 1872", "Specific Relief Act 1963", "Limitation Act 1963"],
    },
    "uk": {
        "Employment": ["Employment Rights Act 1996", "Equality Act 2010", "Contract of Employment"],
        "Sale of goods": ["Sale of Goods Act 1979", "Consumer Rights Act 2015"],
        "Service agreement": ["Supply of Goods and Services Act 1982", "Consumer Rights Act 2015"],
        "Lease / Rental": ["Landlord and Tenant Act 1985", "Housing Act 1988"],
        "Loan / Finance": ["Consumer Credit Act 1974", "Financial Services and Markets Act 2000"],
        "Business partnership": ["Partnership Act 1890", "Limited Liability Partnerships Act 2000"],
        "Online / E-commerce": ["Consumer Contracts Regulations 2013", "Electronic Commerce Regulations 2002"],
        "Other": ["Contract Law (Common Law)", "Limitation Act 1980"],
    },
    "us": {
        "Employment": ["Fair Labor Standards Act", "State Employment Laws", "At-Will Employment Doctrine"],
        "Sale of goods": ["UCC Article 2", "State Sales Laws"],
        "Service agreement": ["Restatement (Second) of Contracts", "State Service Laws"],
        "Lease / Rental": ["State Landlord-Tenant Laws", "Uniform Residential Landlord and Tenant Act"],
        "Loan / Finance": ["Truth in Lending Act (TILA)", "State Usury Laws"],
        "Business partnership": ["Uniform Partnership Act", "State Partnership Laws"],
        "Online / E-commerce": ["Electronic Signatures in Global and National Commerce Act (E-SIGN)", "State E-Commerce Laws"],
        "Other": ["Restatement (Second) of Contracts", "UCC", "State Contract Law"],
    },
}

LIMITATION_PERIODS = {
    "india": "3 years from the date of breach (Limitation Act 1963)",
    "uk": "6 years from the date of breach (Limitation Act 1980)",
    "us": "Varies by state — typically 4–6 years",
}

def analyze_contract(jurisdiction: str, answers: dict[str, Any]) -> dict:
    role = answers.get("role", "")
    contract_type = answers.get("contract_type", "Other")
    written = answers.get("written", False)
    signed = answers.get("signed", False)
    breach_type = answers.get("breach_type", "Other")
    loss = answers.get("loss_suffered", False)
    notice_given = answers.get("notice_given", False)
    time_since = answers.get("time_since", "Less than 1 month")
    consideration = answers.get("consideration", True)

    is_enforcer = role == "Party who wants to enforce the contract"
    is_breacher = role == "Party accused of breach"

    # Validity check
    validity_issues = []
    if not written:
        validity_issues.append("Oral contracts are harder to prove but may still be enforceable")
    if not signed:
        validity_issues.append("Unsigned contracts may lack clear evidence of agreement")
    if not consideration:
        validity_issues.append("Lack of consideration may render the contract void")

    # Risk
    if breach_type in ["Misrepresentation / Fraud", "Non-payment"] and loss:
        risk = "High"
    elif breach_type == "Non-performance" and loss:
        risk = "Medium"
    elif time_since == "More than 2 years":
        risk = "Low"
    else:
        risk = "Medium"

    # Classification
    if breach_type == "Misrepresentation / Fraud":
        classification = "Potential Fraudulent Misrepresentation — Contract May Be Voidable"
    elif breach_type == "Non-payment":
        classification = "Breach of Contract — Non-Payment"
    elif breach_type == "Non-performance":
        classification = "Breach of Contract — Non-Performance"
    elif breach_type == "Termination dispute":
        classification = "Wrongful Termination / Repudiation of Contract"
    elif breach_type == "Unfair terms":
        classification = "Potentially Unfair Contract Terms — May Be Unenforceable"
    elif breach_type == "Force majeure claim":
        classification = "Force Majeure Claim — Performance Excused by Extraordinary Event"
    else:
        classification = f"Contract Dispute — {contract_type}"

    if time_since == "More than 2 years":
        classification += " — LIMITATION PERIOD MAY BE APPROACHING"

    if is_enforcer:
        immediate_actions = [
            "Gather all contract documents, emails, and communications",
            "Calculate the exact financial loss suffered",
            "Send a formal legal notice / demand letter to the other party",
            "Do not accept partial performance as full settlement without written agreement",
            "Preserve all evidence of the breach",
        ]
        rights = [
            "Right to sue for damages (compensatory, consequential)",
            "Right to seek specific performance (court orders the other party to perform)",
            "Right to rescind the contract if misrepresentation occurred",
            "Right to claim interest on unpaid amounts",
            "Right to seek injunction to prevent further breach",
        ]
        liabilities = [
            "Duty to mitigate your losses — you cannot claim avoidable losses",
            "Legal costs if the claim fails",
        ]
        next_steps = [
            "Send a formal legal notice giving 15–30 days to remedy the breach",
            "Attempt negotiation or mediation before litigation",
            "File a civil suit in the appropriate court if no resolution",
            "Consider arbitration if the contract has an arbitration clause",
            f"Act within the limitation period: {LIMITATION_PERIODS.get(jurisdiction, '')}",
        ]
        if not notice_given:
            next_steps.insert(0, "Send a formal breach notice immediately — this is required before most legal action")
        if validity_issues:
            for issue in validity_issues:
                next_steps.insert(0, f"Note: {issue}")
    else:
        immediate_actions = [
            "Do not admit breach in writing without legal advice",
            "Review the contract carefully for your obligations",
            "Check if any force majeure or frustration clause applies",
            "Consult a contract lawyer immediately",
            "Gather evidence of your performance or reasons for non-performance",
        ]
        rights = [
            "Right to contest the breach allegation",
            "Right to raise defences (frustration, force majeure, misrepresentation)",
            "Right to negotiate a settlement",
            "Right to legal representation",
        ]
        liabilities = [
            "Potential damages for proven breach",
            "Specific performance order requiring you to fulfil the contract",
            "Legal costs if the claim succeeds against you",
        ]
        next_steps = [
            "Review the contract for any defences available to you",
            "Respond to any legal notice within the specified time",
            "Engage a contract lawyer to assess your position",
            "Consider settlement to avoid litigation costs",
            "Check if the contract has an arbitration clause",
        ]

    laws = APPLICABLE_LAWS.get(jurisdiction, {}).get(contract_type, APPLICABLE_LAWS.get(jurisdiction, {}).get("Other", []))

    return {
        "classification": classification,
        "summary": f"This is a {breach_type.lower()} dispute involving a {contract_type.lower()} contract under {jurisdiction.upper()} law. {'The contract is written and signed, which strengthens enforceability.' if written and signed else 'The contract may have enforceability issues.'} {' '.join(validity_issues)}",
        "risk_level": risk,
        "immediate_actions": immediate_actions,
        "rights": rights,
        "liabilities": liabilities,
        "applicable_laws": laws,
        "jurisdiction_notes": JURISDICTION_NOTES.get(jurisdiction, ""),
        "recommended_next_steps": next_steps,
    }
