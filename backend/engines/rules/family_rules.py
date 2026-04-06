"""Family law decision engine — India, UK, US"""
from typing import Any

JURISDICTION_NOTES = {
    "india": "Indian family law varies by religion. Hindu families are governed by the Hindu Marriage Act 1955. Muslims by Muslim Personal Law. Christians by the Indian Divorce Act. The Special Marriage Act 1954 applies to inter-religious marriages. The Protection of Women from Domestic Violence Act 2005 applies to all. Criminal aspects of family law now fall under the Bharatiya Nyaya Sanhita (BNS) 2023.",
    "uk": "UK family law is governed by the Family Law Act 1996, Children Act 1989, and Matrimonial Causes Act 1973. Divorce requires 1 year of marriage. The court's primary concern in custody matters is the child's welfare.",
    "us": "US family law is state-specific. No-fault divorce is available in all states. Child custody decisions are based on the 'best interests of the child' standard. Alimony and property division rules vary significantly by state.",
}

APPLICABLE_LAWS = {
    "india": {
        "Divorce / Separation": ["Hindu Marriage Act 1955 (Sections 13-14)", "Special Marriage Act 1954", "Muslim Personal Law (Shariat) Application Act 1937", "Indian Divorce Act 1869 (Christians)"],
        "Child custody": ["Hindu Minority and Guardianship Act 1956", "Guardians and Wards Act 1890", "Hindu Marriage Act 1955 Section 26"],
        "Maintenance / Alimony": ["BNSS Section 144 (Maintenance)", "Hindu Marriage Act Section 24-25", "Hindu Adoption and Maintenance Act 1956"],
        "Domestic violence": ["Protection of Women from DV Act 2005", "BNS Section 85 (Cruelty by Husband)", "BNS Section 80 (Dowry Death)"],
        "Adoption": ["Hindu Adoption and Maintenance Act 1956", "Juvenile Justice Act 2015", "CARA Guidelines"],
        "Inheritance / Succession": ["Hindu Succession Act 1956", "Indian Succession Act 1925", "Muslim Personal Law"],
        "Marriage validity": ["Hindu Marriage Act 1955 Section 5", "Special Marriage Act 1954", "Child Marriage Restraint Act 2006"],
    },
    "uk": {
        "Divorce / Separation": ["Matrimonial Causes Act 1973", "Divorce, Dissolution and Separation Act 2020", "Family Law Act 1996"],
        "Child custody": ["Children Act 1989", "Child Arrangements Order"],
        "Maintenance / Alimony": ["Matrimonial Causes Act 1973 s.23", "Child Support Act 1991"],
        "Domestic violence": ["Domestic Abuse Act 2021", "Family Law Act 1996 Part IV", "Protection from Harassment Act 1997"],
        "Adoption": ["Adoption and Children Act 2002"],
        "Inheritance / Succession": ["Inheritance (Provision for Family and Dependants) Act 1975", "Wills Act 1837"],
        "Marriage validity": ["Marriage Act 1949", "Matrimonial Causes Act 1973 s.11-12"],
    },
    "us": {
        "Divorce / Separation": ["State Divorce Statutes", "Uniform Marriage and Divorce Act", "No-Fault Divorce Laws"],
        "Child custody": ["State Family Code", "Uniform Child Custody Jurisdiction and Enforcement Act (UCCJEA)"],
        "Maintenance / Alimony": ["State Alimony Statutes", "Uniform Marriage and Divorce Act s.308"],
        "Domestic violence": ["Violence Against Women Act (VAWA)", "State DV Protection Order Laws"],
        "Adoption": ["State Adoption Statutes", "Interstate Compact on the Placement of Children"],
        "Inheritance / Succession": ["State Probate Code", "Uniform Probate Code"],
        "Marriage validity": ["State Marriage Laws", "Defense of Marriage Act (state level)"],
    },
}

def analyze_family(jurisdiction: str, answers: dict[str, Any]) -> dict:
    matter = answers.get("matter_type", "Divorce / Separation")
    married = answers.get("married", True)
    duration = answers.get("duration", "1–3 years")
    children = answers.get("children", False)
    children_minor = answers.get("children_age", False)
    violence = answers.get("violence", False)
    mutual = answers.get("mutual_consent", False)
    property_involved = answers.get("property", False)

    # Risk assessment
    if violence:
        risk = "Critical"
    elif matter in ["Domestic violence"] or (children and children_minor):
        risk = "High"
    elif matter in ["Divorce / Separation", "Child custody"]:
        risk = "Medium"
    else:
        risk = "Low"

    # Classification
    if matter == "Divorce / Separation":
        if mutual:
            classification = "Mutual Consent Divorce — Streamlined Process Available"
        elif violence:
            classification = "Contested Divorce with Domestic Violence — Urgent Legal Action Required"
        else:
            classification = "Contested Divorce — Grounds Must Be Established"
    elif matter == "Child custody":
        classification = "Child Custody Dispute — Best Interests of Child Standard Applies"
    elif matter == "Domestic violence":
        classification = "Domestic Violence — Immediate Protection Order Required"
    else:
        classification = f"{matter} — Legal Proceedings Required"

    # Duration check for divorce
    duration_warning = ""
    if matter == "Divorce / Separation":
        if jurisdiction == "india" and duration == "Less than 1 year":
            duration_warning = "In India, divorce cannot be filed within 1 year of marriage (with limited exceptions for exceptional hardship)."
        elif jurisdiction == "uk" and duration == "Less than 1 year":
            duration_warning = "In the UK, you cannot petition for divorce until you have been married for at least 1 year."

    immediate_actions = []
    rights = []
    liabilities = []
    next_steps = []

    if violence:
        immediate_actions = [
            "Ensure your immediate safety — leave if you are in danger",
            "Call emergency services if in immediate danger",
            "Go to a shelter or trusted person's home",
            "Apply for an emergency protection order / restraining order immediately",
            "Document all injuries with photos and medical records",
        ]
    elif matter == "Divorce / Separation":
        immediate_actions = [
            "Do not make any major financial decisions or transfers",
            "Secure important documents — marriage certificate, financial records, property papers",
            "Open a personal bank account if you don't have one",
            "Consult a family lawyer before taking any formal steps",
        ]
    elif matter == "Child custody":
        immediate_actions = [
            "Do not remove children from their current residence without court order",
            "Document the child's current living situation and welfare",
            "Consult a family lawyer immediately",
            "Do not speak negatively about the other parent in front of the children",
        ]
    else:
        immediate_actions = [
            "Gather all relevant documents",
            "Consult a family lawyer",
            "Do not take unilateral action without legal advice",
        ]

    if matter == "Divorce / Separation":
        rights = [
            "Right to petition for divorce on valid grounds",
            "Right to maintenance/alimony during and after proceedings",
            "Right to equitable share of marital property",
            "Right to legal representation",
            "Right to custody/access to children",
        ]
        liabilities = [
            "Maintenance obligations may continue post-divorce",
            "Property division may affect your financial position",
            "Legal costs can be significant in contested divorces",
        ]
        next_steps = [
            "Consult a family lawyer to understand grounds and process",
            "Attempt mediation if both parties are willing — faster and cheaper",
            "File petition in the appropriate family court",
            "Apply for interim maintenance if financially dependent",
        ]
        if duration_warning:
            next_steps.insert(0, f"Note: {duration_warning}")
        if mutual:
            next_steps.insert(0, "Mutual consent divorce is faster — typically 6–18 months in India, 6 months in UK")
    elif matter == "Child custody":
        rights = [
            "Right to apply for custody or visitation",
            "Right to be heard in custody proceedings",
            "Right to legal representation",
        ]
        liabilities = [
            "Child support obligations regardless of custody outcome",
            "Violation of custody orders is contempt of court",
        ]
        next_steps = [
            "File for custody in the family court",
            "Prepare evidence of your involvement in the child's life",
            "Consider a parenting plan to present to the court",
            "Prioritise the child's welfare in all decisions",
        ]
    elif matter == "Domestic violence":
        rights = [
            "Right to emergency protection order",
            "Right to remain in the matrimonial home (in many jurisdictions)",
            "Right to maintenance and compensation",
            "Right to free legal aid",
        ]
        liabilities = []
        next_steps = [
            "Apply for protection order at the magistrate court / family court immediately",
            "File a police complaint (FIR in India)",
            "Seek shelter at a government or NGO shelter if needed",
            "Contact a domestic violence helpline",
        ]

    laws = APPLICABLE_LAWS.get(jurisdiction, {}).get(matter, [])

    summary = f"This is a {matter.lower()} matter under {jurisdiction.upper()} family law."
    if duration_warning:
        summary += f" {duration_warning}"
    if violence:
        summary += " Domestic violence is present — immediate legal protection is strongly advised."
    if children and children_minor:
        summary += " Minor children are involved — their welfare will be the court's primary consideration."

    return {
        "classification": classification,
        "summary": summary,
        "risk_level": risk,
        "immediate_actions": immediate_actions,
        "rights": rights,
        "liabilities": liabilities,
        "applicable_laws": laws,
        "jurisdiction_notes": JURISDICTION_NOTES.get(jurisdiction, ""),
        "recommended_next_steps": next_steps,
    }
