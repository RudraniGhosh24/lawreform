"""Criminal law decision engine — India, UK, US"""
from typing import Any

JURISDICTION_NOTES = {
    "india": "Indian criminal law is governed by the Bharatiya Nyaya Sanhita (BNS) 2023, Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023, and Bharatiya Sakshya Adhiniyam (BSA) 2023 — which replaced the IPC, CrPC, and Indian Evidence Act respectively from July 1, 2024. FIR must be filed at the nearest police station. Bail rights depend on whether the offence is bailable or non-bailable under BNSS.",
    "uk": "UK criminal law is governed by common law and statutes including the Theft Act 1968, Sexual Offences Act 2003, and Serious Crime Act 2015. Police must caution suspects before questioning. Legal aid is available.",
    "us": "US criminal law varies by state. Federal crimes are prosecuted under the US Code. Miranda rights must be read upon arrest. The 4th, 5th, and 6th Amendments protect suspects. Public defenders are available for those who cannot afford counsel.",
}

OFFENCE_LAWS = {
    "india": {
        "Assault / Battery": ["BNS Section 130 (Assault)", "BNS Section 131 (Criminal Force)", "BNS Section 115-117 (Voluntarily Causing Hurt)"],
        "Theft / Robbery": ["BNS Section 303 (Theft)", "BNS Section 309 (Robbery)", "BNS Section 310 (Punishment for Robbery)"],
        "Fraud / Cheating": ["BNS Section 318 (Cheating)", "BNS Section 316 (Cheating definition)", "IT Act 2000 Section 66C/66D"],
        "Sexual offence": ["BNS Section 63-64 (Rape)", "POCSO Act 2012", "BNS Section 74 (Assault on Woman with Intent to Outrage Modesty)"],
        "Murder / Culpable homicide": ["BNS Section 101 (Murder)", "BNS Section 105 (Culpable Homicide)", "BNS Section 100 (Definition of Murder)"],
        "Drug offence": ["NDPS Act 1985", "BNS Section 123 (Administering Stupefying Drug)"],
        "Cybercrime": ["IT Act 2000 Section 66", "BNS Section 318 (Cheating)", "IT Act Section 43"],
        "Domestic violence": ["Protection of Women from DV Act 2005", "BNS Section 85 (Cruelty by Husband/Relatives)"],
        "Other": ["Bharatiya Nyaya Sanhita (BNS) 2023", "Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023"],
    },
    "uk": {
        "Assault / Battery": ["Offences Against the Person Act 1861", "Criminal Justice Act 1988 s.39"],
        "Theft / Robbery": ["Theft Act 1968", "Robbery Act 1968 s.8"],
        "Fraud / Cheating": ["Fraud Act 2006", "Computer Misuse Act 1990"],
        "Sexual offence": ["Sexual Offences Act 2003", "Protection of Children Act 1978"],
        "Murder / Culpable homicide": ["Homicide Act 1957", "Murder (Abolition of Death Penalty) Act 1965"],
        "Drug offence": ["Misuse of Drugs Act 1971", "Drug Trafficking Act 1994"],
        "Cybercrime": ["Computer Misuse Act 1990", "Fraud Act 2006"],
        "Domestic violence": ["Domestic Abuse Act 2021", "Family Law Act 1996"],
        "Other": ["Criminal Law (Common Law)", "Serious Crime Act 2015"],
    },
    "us": {
        "Assault / Battery": ["18 U.S.C. § 113 (Federal Assault)", "State Assault Statutes"],
        "Theft / Robbery": ["18 U.S.C. § 2111 (Robbery)", "State Theft Statutes"],
        "Fraud / Cheating": ["18 U.S.C. § 1341 (Mail Fraud)", "18 U.S.C. § 1343 (Wire Fraud)", "State Fraud Laws"],
        "Sexual offence": ["18 U.S.C. § 2241 (Aggravated Sexual Abuse)", "State Sexual Assault Laws", "VAWA"],
        "Murder / Culpable homicide": ["18 U.S.C. § 1111 (Federal Murder)", "State Homicide Statutes"],
        "Drug offence": ["Controlled Substances Act 21 U.S.C. § 841", "State Drug Laws"],
        "Cybercrime": ["Computer Fraud and Abuse Act 18 U.S.C. § 1030", "State Cybercrime Laws"],
        "Domestic violence": ["Violence Against Women Act (VAWA)", "State DV Statutes"],
        "Other": ["Federal Criminal Code", "State Penal Code"],
    },
}

def analyze_criminal(jurisdiction: str, answers: dict[str, Any]) -> dict:
    role = answers.get("role", "")
    offence = answers.get("offence_type", "Other")
    reported = answers.get("reported", False)
    arrested = answers.get("arrested", False)
    in_custody = answers.get("in_custody", False)
    evidence = answers.get("evidence", False)
    witnesses = answers.get("witnesses", False)
    time_since = answers.get("time_since", "Within 24 hours")
    self_defence = answers.get("self_defence", False)

    is_victim = role in ["Victim", "Family of victim"]
    is_accused = role in ["Accused / Suspect", "Family of accused"]

    # Risk assessment
    high_risk_offences = ["Murder / Culpable homicide", "Sexual offence", "Domestic violence"]
    medium_risk = ["Assault / Battery", "Robbery", "Fraud / Cheating"]

    if offence in high_risk_offences:
        risk = "Critical"
    elif offence in medium_risk:
        risk = "High"
    else:
        risk = "Medium"

    if is_accused and in_custody:
        risk = "Critical"

    classification = f"{offence} — {'Victim' if is_victim else 'Accused'} Perspective"

    if is_victim:
        immediate_actions = [
            "Ensure your immediate safety — move to a safe location if needed",
            "Call emergency services (100 in India / 999 in UK / 911 in US) if in immediate danger",
            "Do NOT clean up or disturb the scene — preserve evidence",
            "Seek medical attention if injured and request a medico-legal certificate",
            f"{'File an FIR at the nearest police station immediately' if jurisdiction == 'india' else 'Report to police and request a crime reference number'}",
            "Write down everything you remember while it is fresh",
        ]
        rights = [
            "Right to file a complaint / FIR without delay",
            "Right to free legal aid if you cannot afford a lawyer",
            "Right to medical examination",
            "Right to be informed of the progress of the investigation",
            "Right to protection from the accused during proceedings",
            "Right to compensation under victim compensation schemes",
        ]
        liabilities = [
            "Filing a false complaint is itself a criminal offence",
            "Tampering with evidence can harm your case",
        ]
        next_steps = [
            "File a formal complaint with police immediately",
            "Obtain a copy of the FIR / crime report",
            "Consult a criminal lawyer for guidance on the process",
            "Keep all evidence safe — do not share on social media",
            "Apply for victim protection order if threatened",
        ]
        if not reported:
            next_steps.insert(0, "Report to police immediately — delay can affect the investigation")
        if time_since == "Within 24 hours":
            next_steps.insert(0, "Act now — the first 24 hours are critical for evidence preservation")

    else:  # accused
        immediate_actions = [
            "Do NOT make any statements to police without a lawyer present",
            "Exercise your right to remain silent",
            "Contact a criminal defence lawyer immediately",
            "Do not destroy or tamper with any evidence",
            "Do not contact the complainant or witnesses",
        ]
        rights = [
            "Right to remain silent (cannot be compelled to self-incriminate)",
            "Right to legal representation",
            "Right to know the charges against you",
            "Right to bail (for bailable offences)",
            "Right to a fair trial",
            f"{'Right to free legal aid if you cannot afford a lawyer' if jurisdiction in ['india', 'uk', 'us'] else ''}",
        ]
        liabilities = [
            f"Potential imprisonment if convicted: {_get_sentence(offence, jurisdiction)}",
            "Criminal record affecting employment and travel",
            "Compensation orders to the victim",
        ]
        next_steps = [
            "Engage a criminal defence lawyer immediately",
            "Do not speak to police without your lawyer",
            "Apply for bail if arrested",
            "Gather alibi evidence and witness statements",
            "Review all evidence the prosecution intends to use",
        ]
        if self_defence:
            next_steps.insert(1, "Document your self-defence claim thoroughly — this is a valid legal defence")

    laws = OFFENCE_LAWS.get(jurisdiction, {}).get(offence, OFFENCE_LAWS.get(jurisdiction, {}).get("Other", []))

    return {
        "classification": classification,
        "summary": f"This involves a {offence.lower()} matter under {jurisdiction.upper()} criminal law from the perspective of the {role.lower()}. {'Evidence and witnesses strengthen the case.' if evidence and witnesses else 'Lack of evidence or witnesses may affect the outcome.'}",
        "risk_level": risk,
        "immediate_actions": immediate_actions,
        "rights": [r for r in rights if r],
        "liabilities": liabilities,
        "applicable_laws": laws,
        "jurisdiction_notes": JURISDICTION_NOTES.get(jurisdiction, ""),
        "recommended_next_steps": next_steps,
    }

def _get_sentence(offence: str, jurisdiction: str) -> str:
    sentences = {
        "india": {
            "Murder / Culpable homicide": "Life imprisonment or death penalty (BNS Section 101)",
            "Sexual offence": "10 years to life imprisonment (BNS Section 64)",
            "Assault / Battery": "Up to 2 years (BNS Section 131)",
            "Theft / Robbery": "Up to 10 years for robbery (BNS Section 310)",
            "Fraud / Cheating": "Up to 7 years (BNS Section 318)",
        },
        "uk": {
            "Murder / Culpable homicide": "Mandatory life sentence",
            "Sexual offence": "Up to life imprisonment (SOA 2003)",
            "Assault / Battery": "Up to 6 months (common assault) to 5 years (GBH)",
            "Theft / Robbery": "Up to 7 years (Theft Act 1968)",
            "Fraud / Cheating": "Up to 10 years (Fraud Act 2006)",
        },
        "us": {
            "Murder / Culpable homicide": "Life imprisonment or death penalty (varies by state)",
            "Sexual offence": "Varies by state — typically 5 years to life",
            "Assault / Battery": "Varies — misdemeanor to felony",
            "Theft / Robbery": "Up to 20 years federal (18 U.S.C. § 2111)",
            "Fraud / Cheating": "Up to 20 years (wire/mail fraud)",
        },
    }
    return sentences.get(jurisdiction, {}).get(offence, "Varies — consult a lawyer")
