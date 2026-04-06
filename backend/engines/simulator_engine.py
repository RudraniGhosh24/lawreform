"""
Simulator evaluation engine.
All scoring and feedback logic is server-side only — never exposed to client.
"""
from typing import Any

CORRECT_ANSWERS: dict[str, list[str]] = {
    "road_accident":     ["a", "d", "a", "a"],
    "drowning":          ["a", "a", "a"],
    "fraud":             ["a", "a", "a"],
    "harassment":        ["c", "a", "a"],
    "sexual_assault":    ["a", "a", "a"],
    "domestic_violence": ["a", "a", "a"],
    "theft":             ["a", "a", "a"],
    "cybercrime":        ["a", "a", "a"],
}

CHOICE_LABELS: dict[str, list[list[str]]] = {
    "road_accident": [
        ["Stop your vehicle safely and assess the situation", "Drive past — it's not your problem", "Slow down, take a video, then drive on", "Call someone else to handle it"],
        ["Call emergency services immediately", "Try to move the person first", "Wait for someone more qualified", "Apply pressure and call simultaneously"],
        ["Note vehicle number and report to police", "Physically stop them from leaving", "Let them go", "Follow them in your car"],
        ["Give a full honest statement", "Say you didn't see anything", "Give a partial statement", "Refuse without a lawyer"],
    ],
    "drowning": [
        ["Shout for help and call emergency services", "Jump in immediately", "Look for flotation device first", "Wait to see if they recover"],
        ["Throw the life ring toward them", "Swim out directly", "Wait for lifeguards", "Find a stick or rope"],
        ["Begin CPR immediately", "Turn on side and wait", "Shake them vigorously", "Do nothing — not trained"],
    ],
    "fraud": [
        ["Hang up and call bank's official number", "Give the OTP", "Ask them to verify first", "Give partial information"],
        ["Call bank immediately to freeze account", "Wait to see if money returns", "Post on social media", "Contact scammer"],
        ["File police complaint with all evidence", "Do nothing — bank will handle it", "Hire private investigator", "Only report if amount is large"],
    ],
    "harassment": [
        ["Directly confront the harasser", "Call police and stay as witness", "Approach victim calmly and create distance", "Walk away"],
        ["Ask if okay, offer support, help report", "Leave now danger is over", "Take photos of victim", "Tell them to report later"],
        ["Offer to be a witness and give contact details", "Decline involvement", "Write down what you saw for victim", "Only help if asked by police"],
    ],
    "sexual_assault": [
        ["Listen without judgment, believe them", "Immediately tell them to go to police", "Ask what they were wearing", "Tell other friends"],
        ["Do not shower or change — preserve evidence", "Clean up first then report", "Take photos of injuries yourself", "Evidence doesn't matter if they know the person"],
        ["Go to hospital first then file FIR/report", "Post on social media to name person", "Contact lawyer before anything", "Report only if there are witnesses"],
    ],
    "domestic_violence": [
        ["Call police if someone is in immediate danger", "Knock on the door to check", "Mind your own business", "Talk to other neighbours first"],
        ["Help create a safety plan", "Tell them to confront the abuser", "Advise them to stay and work it out", "Call their family without asking"],
        ["Apply for protection/restraining order", "Only file if injuries are severe", "Wait to see if abuser changes", "Settle privately through family mediation"],
    ],
    "theft": [
        ["Note description and call police immediately", "Chase them yourself", "Post on social media", "Accept the loss"],
        ["Remotely lock/wipe phone, block SIM, report IMEI", "Wait for thief to contact you", "Only report if you have insurance", "Buy new phone and forget it"],
        ["Provide all evidence and pursue the case", "No — too much effort", "Only if item was expensive", "Ask for compensation from police"],
    ],
    "cybercrime": [
        ["Change password and enable 2FA immediately", "Delete suspicious emails", "Reply to suspicious emails", "Wait to see if it stops"],
        ["Document everything and report to cybercrime cell", "Only tell close friends", "Hire a hacker to find attacker", "Do nothing if no financial loss"],
        ["Do NOT pay — report to authorities immediately", "Pay the ransom", "Negotiate with attacker", "Ignore it"],
    ],
}

EXPLANATIONS: dict[str, list[list[str]]] = {
    "road_accident": [
        ["Correct — stopping safely is the first duty. Driving past may constitute an omission offence in some jurisdictions.", "Driving past an accident you witnessed may constitute criminal negligence by omission in India (BNS Section 106) and is morally indefensible.", "Taking a video and leaving is a serious ethical failure and may be an omission offence.", "Delegating to others when you are present and capable is an omission."],
        ["Calling emergency services is always the first priority.", "Moving an injured person without training can cause spinal injuries — never do this.", "Waiting wastes critical time — the first few minutes are life-or-death.", "Correct — applying pressure while calling is the ideal dual action."],
        ["Correct — note details and report. Do not physically intervene as this risks your safety.", "Physically stopping someone can escalate danger to you.", "Letting a hit-and-run driver flee is a failure to assist justice.", "Following in your car is dangerous and not your role."],
        ["Correct — an honest witness statement is a civic and sometimes legal duty.", "Lying to police is a criminal offence (BNS Section 229 / Perjury).", "Partial statements can mislead investigations.", "You can give a statement without a lawyer as a witness — only accused persons need one."],
    ],
    "drowning": [
        ["Correct — alert others and call for help before anything else.", "Jumping in without training is the leading cause of double drownings — never do this.", "Correct secondary action — but calling for help must come first.", "Waiting is never acceptable when someone is drowning."],
        ["Correct — throwing a flotation device is the safest rescue method.", "Swimming out directly risks your own life — untrained rescuers drown too.", "Waiting for lifeguards when you can act safely is an omission.", "A rope or stick is a good alternative if no ring is available."],
        ["Correct — CPR must begin immediately. Every minute without CPR reduces survival by 10%.", "Turning on side without CPR is wrong for a non-breathing person.", "Shaking can cause injury and wastes time.", "Inaction when CPR is needed is a critical failure — basic CPR can be performed by anyone."],
    ],
    "fraud": [
        ["Correct — banks never ask for OTPs. Hang up immediately.", "Giving an OTP to an unknown caller is the most common fraud mistake.", "Asking them to verify buys time but you should just hang up — scammers are trained to sound convincing.", "Giving any information to a suspected scammer is dangerous."],
        ["Correct — immediate bank contact is the only way to potentially reverse a transaction.", "Waiting allows the money to be moved further — act within minutes.", "Social media posts don't stop fraud and may alert the scammer.", "Contacting the scammer gives them more leverage over you."],
        ["Correct — a formal police/cybercrime complaint creates a legal record and enables investigation.", "Banks need a police complaint to process fraud claims in most jurisdictions.", "Private investigators cannot compel banks or police to act.", "All fraud should be reported regardless of amount — it helps track patterns."],
    ],
    "harassment": [
        ["Direct confrontation can escalate to violence — avoid unless trained.", "Calling police is good but staying as a passive witness may not help the victim immediately.", "Correct — the 'bystander intervention' method: approach the victim, not the harasser.", "Walking away is a moral and sometimes legal failure."],
        ["Correct — check on the victim, offer support, and help them report if they choose.", "Leaving immediately abandons the victim.", "Taking photos of the victim without consent is inappropriate.", "Telling them to report later dismisses their immediate need for support."],
        ["Correct — offering to be a witness is the most valuable thing a bystander can do.", "Declining to be a witness when you saw everything is a moral failure.", "Writing down what you saw is helpful but offering to be a formal witness is better.", "Waiting to be asked by police may mean you are never contacted."],
    ],
    "sexual_assault": [
        ["Correct — believing the victim and letting them lead is the most important first response.", "Forcing them to go to police immediately removes their agency and can cause further trauma.", "Asking about clothing is victim-blaming and deeply harmful.", "Telling others without consent violates the victim's privacy."],
        ["Correct — physical evidence is critical for prosecution. Preserve everything.", "Cleaning up destroys DNA and physical evidence permanently.", "Taking photos yourself is not a substitute for a proper medical examination.", "Evidence is crucial regardless of the relationship — most assaults are by known persons."],
        ["Correct — medical examination first preserves evidence and provides care; police report follows.", "Social media naming can compromise a legal case and expose you to defamation claims.", "A lawyer is helpful but medical evidence must be preserved first.", "Witnesses are rarely present in sexual assault cases — evidence and testimony are what matter."],
    ],
    "domestic_violence": [
        ["Correct — if you genuinely believe someone is in danger, call police. You could save a life.", "Knocking on the door can escalate the situation and put you at risk.", "Ignoring domestic violence when you have reason to believe it is occurring is a moral failure.", "Consulting neighbours delays action when someone may be in immediate danger."],
        ["Correct — a safety plan (documents, money, safe location) is the most practical immediate help.", "Confronting the abuser is extremely dangerous and can escalate violence.", "Advising them to stay enables continued abuse.", "Contacting family without the victim's consent can be dangerous — some family members side with the abuser."],
        ["Correct — a protection order is the primary legal tool and can be obtained quickly.", "Severity of injury does not determine the right to protection — all domestic violence is serious.", "Waiting for the abuser to change is a pattern that enables continued abuse.", "Family mediation is inappropriate and dangerous in domestic violence situations."],
    ],
    "theft": [
        ["Correct — note details and call police. Do not chase — this risks your safety.", "Chasing a thief puts you in physical danger and can lead to assault charges if you use force.", "Social media posts don't recover stolen property and waste critical time.", "Accepting the loss without reporting enables repeat offending."],
        ["Correct — remote lock/wipe, SIM block, and IMEI report are the three critical steps.", "Waiting for the thief to contact you is naive — they won't.", "Insurance claims require a police report anyway.", "Buying a new phone without reporting means the thief faces no consequences."],
        ["Correct — pursue the case with all available evidence.", "Even small thefts should be reported — it builds a pattern for police.", "The value of the item doesn't determine whether a crime occurred.", "Police cannot compensate you — only courts can order restitution."],
    ],
    "cybercrime": [
        ["Correct — secure your account immediately before anything else.", "Deleting emails destroys evidence.", "Replying to suspicious emails confirms your account is active and may install malware.", "Waiting allows the attacker to do more damage."],
        ["Correct — document, report, and notify. This is the correct sequence.", "Only telling friends does nothing to stop the attack or create a legal record.", "Hiring a hacker is illegal in most jurisdictions.", "Even without financial loss, data breaches must be reported — especially if personal data was accessed."],
        ["Correct — paying ransoms funds criminal organisations and rarely results in data deletion.", "Paying ransom encourages further attacks and rarely works.", "Negotiating with attackers gives them more time and information.", "Ignoring ransom threats is dangerous — report immediately so authorities can act."],
    ],
}

OMISSION_LAWS: dict[str, dict[str, str]] = {
    "road_accident": {
        "india": "Under BNS Section 106, causing death by negligent act is punishable. Failure to assist an accident victim when you are capable may constitute criminal negligence. The Motor Vehicles Act also imposes duties on witnesses.",
        "uk": "UK law does not impose a general duty to rescue strangers. However, if you created the danger, you have a duty to assist. The Road Traffic Act 1988 requires drivers involved in accidents to stop and give information.",
        "us": "Most US states have no general duty to rescue. However, 'duty to rescue' laws exist in Vermont, Minnesota, and others. Good Samaritan laws protect those who do assist from liability.",
    },
    "drowning": {
        "india": "BNS Section 105 (culpable homicide) may apply if a person with a duty of care (e.g., lifeguard, parent) fails to act. General bystanders have no strict legal duty but moral obligation is strong.",
        "uk": "No general duty to rescue in UK law. However, those with a special relationship (parent, employer) have a duty. The Occupiers' Liability Act may apply at swimming pools.",
        "us": "No federal duty to rescue. Some states (e.g., Vermont) impose criminal liability for failure to rescue when you can do so without risk to yourself.",
    },
    "sexual_assault": {
        "india": "Under BNSS Section 173, a public servant who fails to record an FIR for a sexual offence commits an offence. Bystanders who witness an assault and fail to report may face moral but not strict legal liability.",
        "uk": "No general duty to report crimes in the UK. However, withholding information about serious crimes can constitute 'misprision' in some circumstances.",
        "us": "Mandatory reporting laws apply to professionals (teachers, doctors). Some states have bystander duty laws. Failure to report child sexual abuse is a criminal offence in all states.",
    },
}

CORRECT_SEQUENCES: dict[str, list[str]] = {
    "road_accident": ["Stop your vehicle safely", "Call emergency services (ambulance + police)", "Apply first aid if trained — do not move the victim", "Note the fleeing driver's details and report to police", "Give a full honest witness statement to police"],
    "drowning": ["Shout for help and call emergency services immediately", "Use a flotation device — throw, don't go", "If the person is out of water and not breathing, begin CPR immediately", "Continue CPR until emergency services arrive"],
    "fraud": ["Hang up immediately — never give OTPs or passwords", "Call your bank's official number to freeze the account", "File a cybercrime/police complaint with all evidence", "Monitor your accounts and change all passwords"],
    "harassment": ["Approach the victim calmly — not the harasser", "Call police if the situation is dangerous", "Stay with the victim until they are safe", "Offer to be a formal witness if they choose to report"],
    "sexual_assault": ["Believe the victim and let them lead", "Do not shower, change, or clean up — preserve evidence", "Go to hospital for medical examination first", "File FIR/police report with medical evidence"],
    "domestic_violence": ["Call police if someone is in immediate danger", "Help the victim create a safety plan", "Help them access a shelter or safe location", "Assist them in applying for a protection order"],
    "theft": ["Note the thief's description and direction", "Call police immediately", "Remotely lock/wipe your phone and block your SIM", "File a formal police report and pursue the case"],
    "cybercrime": ["Change passwords and enable 2FA immediately from a secure device", "Document all evidence of the attack", "Report to cybercrime authorities", "Notify affected services and monitor accounts"],
    "fire_emergency": ["Alert others and activate the fire alarm", "Call the fire department", "Evacuate via stairs — never use elevators", "Do NOT go back inside for any reason"],
    "child_abuse": ["Document signs of abuse with dates and details", "Report to child protective services or police", "Follow up with authorities", "Provide a formal statement if asked"],
    "medical_emergency": ["Check responsiveness and call emergency services", "Begin CPR immediately if not breathing", "Use an AED if available — it gives voice instructions", "Brief paramedics on what happened when they arrive"],
    "stalking": ["Document every incident with photos, times, and locations", "Report to police immediately", "Apply for a restraining/protection order", "Share your location with trusted contacts and vary your routine"],
    "hit_and_run": ["Stay still and assess injuries — call emergency services", "Get witness details and vehicle information", "Do NOT chase the vehicle", "File a police report with all evidence from hospital"],
    "workplace_injury": ["Call emergency services — do NOT move the person if spinal injury is possible", "Secure the area to prevent further injuries", "File an official accident report", "Ensure the injured person knows their right to workers' compensation"],
}

WHAT_NOT_TO_DO: dict[str, list[str]] = {
    "road_accident": ["Do not drive past without stopping", "Do not move an injured person unless they are in immediate danger (fire, traffic)", "Do not take videos for social media instead of helping", "Do not physically chase a fleeing driver", "Do not lie to police"],
    "drowning": ["Never jump into water to rescue someone unless you are a trained lifeguard", "Do not waste time — every second counts", "Do not attempt to rescue alone — shout for help first", "Do not leave a rescued person unattended"],
    "fraud": ["Never give OTPs, passwords, or PINs to anyone over the phone", "Do not pay ransom or 'release fees'", "Do not contact the scammer", "Do not post about it on social media before reporting to police"],
    "harassment": ["Do not directly confront an aggressive harasser", "Do not ignore harassment — bystander inaction enables it", "Do not take photos of the victim without consent", "Do not pressure the victim to report if they are not ready"],
    "sexual_assault": ["Do not shower, bathe, or change clothes before medical examination", "Do not pressure the victim to report immediately", "Do not ask victim-blaming questions", "Do not share the victim's identity publicly"],
    "domestic_violence": ["Do not advise the victim to 'work it out' with the abuser", "Do not contact the abuser on the victim's behalf without their consent", "Do not suggest family mediation in DV situations", "Do not call the victim's family without their permission"],
    "theft": ["Do not chase the thief — your safety comes first", "Do not handle stolen items if recovered — preserve as evidence", "Do not accept the loss without reporting", "Do not post the thief's photo online without police involvement"],
    "cybercrime": ["Never pay a ransom", "Do not delete evidence — preserve all logs and messages", "Do not use the compromised device until it is secured", "Do not ignore the breach — report it"],
    "fire_emergency": ["Never use elevators during a fire", "Never open a hot door — backdraft can kill", "Never go back inside a burning building for belongings", "Never ignore smoke — even small amounts can indicate a serious fire"],
    "child_abuse": ["Do not confront the abuser directly — it can escalate danger to the child", "Do not ignore signs of abuse — silence enables it", "Do not take the child away yourself — let authorities handle it", "Do not promise the child you won't tell anyone — their safety comes first"],
    "medical_emergency": ["Do not waste time looking for a doctor — start CPR yourself", "Do not shake or slap an unconscious person", "Do not put anything in their mouth", "Do not stop CPR until paramedics take over or the person starts breathing"],
    "stalking": ["Do not confront the stalker alone", "Do not ignore escalating behaviour", "Do not respond to the stalker's messages", "Do not share your location publicly on social media"],
    "hit_and_run": ["Do not chase the vehicle — you could worsen your injuries", "Do not move if you suspect a fracture or spinal injury", "Do not leave the scene without filing a report", "Do not delay calling emergency services"],
    "workplace_injury": ["Do not move someone with a potential spinal injury", "Do not agree to cover up a workplace accident", "Do not let the employer pressure you into not reporting", "Do not administer medication you're not qualified to give"],
}

APPLICABLE_LAWS_SIM: dict[str, dict[str, list[str]]] = {
    "road_accident": {
        "india": ["BNS Section 106 (Negligence causing death)", "Motor Vehicles Act 1988", "BNS Section 281 (Rash driving)"],
        "uk": ["Road Traffic Act 1988", "Offences Against the Person Act 1861", "Health and Safety at Work Act 1974"],
        "us": ["State Hit-and-Run Statutes", "Good Samaritan Laws", "State Negligence Laws"],
    },
    "drowning": {
        "india": ["BNS Section 105 (Culpable Homicide)", "BNS Section 106 (Negligence)", "Disaster Management Act 2005"],
        "uk": ["Occupiers' Liability Act 1957", "Health and Safety at Work Act 1974", "Common Law Duty of Care"],
        "us": ["State Duty to Rescue Laws (Vermont, Minnesota)", "Good Samaritan Laws", "Occupier's Liability"],
    },
    "fraud": {
        "india": ["BNS Section 318 (Cheating)", "IT Act 2000 Section 66C/66D", "RBI Cybercrime Guidelines"],
        "uk": ["Fraud Act 2006", "Computer Misuse Act 1990", "Consumer Fraud Protection"],
        "us": ["18 U.S.C. § 1343 (Wire Fraud)", "Computer Fraud and Abuse Act", "FTC Act Section 5"],
    },
    "harassment": {
        "india": ["BNS Section 74 (Assault on Woman)", "BNS Section 79 (Word/Gesture to Insult Modesty)", "POSH Act 2013 (Workplace)"],
        "uk": ["Protection from Harassment Act 1997", "Equality Act 2010", "Public Order Act 1986"],
        "us": ["State Harassment Statutes", "Title VII (Workplace)", "Civil Rights Act 1964"],
    },
    "sexual_assault": {
        "india": ["BNS Section 63-64 (Rape)", "POCSO Act 2012", "BNS Section 74 (Assault on Woman)"],
        "uk": ["Sexual Offences Act 2003", "Protection of Children Act 1978", "Domestic Abuse Act 2021"],
        "us": ["18 U.S.C. § 2241 (Aggravated Sexual Abuse)", "VAWA", "State Sexual Assault Laws"],
    },
    "domestic_violence": {
        "india": ["Protection of Women from DV Act 2005", "BNS Section 85 (Cruelty by Husband)", "BNS Section 80 (Dowry Death)"],
        "uk": ["Domestic Abuse Act 2021", "Family Law Act 1996 Part IV", "Protection from Harassment Act 1997"],
        "us": ["Violence Against Women Act (VAWA)", "State DV Protection Order Laws", "18 U.S.C. § 2261"],
    },
    "theft": {
        "india": ["BNS Section 303 (Theft)", "BNS Section 309 (Robbery)", "IT Act 2000 (Cybertheft)"],
        "uk": ["Theft Act 1968", "Fraud Act 2006", "Computer Misuse Act 1990"],
        "us": ["18 U.S.C. § 2111 (Robbery)", "State Theft Statutes", "Computer Fraud and Abuse Act"],
    },
    "cybercrime": {
        "india": ["IT Act 2000 Section 66", "BNS Section 318 (Cheating)", "IT Act Section 43 (Data Theft)"],
        "uk": ["Computer Misuse Act 1990", "Fraud Act 2006", "Data Protection Act 2018"],
        "us": ["Computer Fraud and Abuse Act 18 U.S.C. § 1030", "Identity Theft Enforcement Act", "State Cybercrime Laws"],
    },
    "fire_emergency": {
        "india": ["National Building Code of India", "Fire Prevention and Fire Safety Act (State-specific)", "BNS Section 106 (Negligence causing death)"],
        "uk": ["Regulatory Reform (Fire Safety) Order 2005", "Fire and Rescue Services Act 2004", "Health and Safety at Work Act 1974"],
        "us": ["State Fire Codes", "OSHA Fire Safety Standards", "International Fire Code (IFC)"],
    },
    "child_abuse": {
        "india": ["POCSO Act 2012", "Juvenile Justice Act 2015", "BNS Section 75 (Sexual Harassment)", "Right to Education Act 2009"],
        "uk": ["Children Act 1989", "Children Act 2004", "Safeguarding Vulnerable Groups Act 2006"],
        "us": ["Child Abuse Prevention and Treatment Act (CAPTA)", "State Mandatory Reporting Laws", "VAWA"],
    },
    "medical_emergency": {
        "india": ["BNS Section 106 (Negligence)", "Good Samaritan Guidelines (Supreme Court 2016)", "Motor Vehicles Act 1988"],
        "uk": ["Social Action, Responsibility and Heroism Act 2015", "Common Law Duty of Care", "Health and Safety at Work Act 1974"],
        "us": ["Good Samaritan Laws (State-specific)", "Emergency Medical Treatment and Labor Act (EMTALA)", "State Negligence Laws"],
    },
    "stalking": {
        "india": ["BNS Section 78 (Stalking)", "IT Act 2000 Section 66A", "Protection of Women from DV Act 2005"],
        "uk": ["Protection from Harassment Act 1997", "Stalking Protection Act 2019", "Domestic Abuse Act 2021"],
        "us": ["18 U.S.C. § 2261A (Federal Stalking)", "State Anti-Stalking Laws", "Violence Against Women Act (VAWA)"],
    },
    "hit_and_run": {
        "india": ["Motor Vehicles Act 1988 Section 161", "BNS Section 106 (Negligence causing death)", "BNS Section 281 (Rash driving)"],
        "uk": ["Road Traffic Act 1988 Section 170", "Offences Against the Person Act 1861", "Motor Insurance Bureau (MIB) Claims"],
        "us": ["State Hit-and-Run Statutes", "Uninsured Motorist Coverage Laws", "State Personal Injury Laws"],
    },
    "workplace_injury": {
        "india": ["Factories Act 1948", "Employees' Compensation Act 1923", "Occupational Safety, Health and Working Conditions Code 2020"],
        "uk": ["Health and Safety at Work Act 1974", "Employers' Liability (Compulsory Insurance) Act 1969", "RIDDOR 2013"],
        "us": ["OSHA (Occupational Safety and Health Act)", "State Workers' Compensation Laws", "Federal Employers' Liability Act"],
    },
}


def evaluate_simulation(scenario_id: str, jurisdiction: str, choices: list[dict]) -> dict:
    """
    Evaluate branching simulation results.
    choices is a list of dicts: { node_id, choice_id, choice_text, was_correct, situation }
    """
    score = 0
    max_score = len(choices)
    step_feedback = []

    for i, c in enumerate(choices):
        is_correct = c.get("was_correct", False)
        if is_correct:
            score += 1

        step_feedback.append({
            "step": i + 1,
            "situation": c.get("situation", f"Situation {i + 1}"),
            "your_choice": c.get("choice_text", ""),
            "correct_choice": c.get("correct_choice_text", ""),
            "was_correct": is_correct,
            "explanation": "",
            "legal_consequence": "",
            "ethical_note": "",
        })

    pct = (score / max_score * 100) if max_score > 0 else 0

    if pct >= 90:
        grade = "Excellent"
        summary = "Outstanding. You made the right calls — you could genuinely save lives and protect rights."
    elif pct >= 70:
        grade = "Good"
        summary = "Good instincts overall, but a few decisions could have serious consequences. Review the feedback."
    elif pct >= 50:
        grade = "Needs Improvement"
        summary = "Several critical mistakes were made. In a real situation, these could cause harm or legal liability."
    else:
        grade = "Dangerous"
        summary = "Most decisions were incorrect. In a real emergency, these choices could be life-threatening or illegal."

    omission = OMISSION_LAWS.get(scenario_id, {}).get(jurisdiction)

    return {
        "score": score,
        "max_score": max_score,
        "grade": grade,
        "step_feedback": step_feedback,
        "omission_liability": omission,
        "applicable_laws": APPLICABLE_LAWS_SIM.get(scenario_id, {}).get(jurisdiction, []),
        "correct_sequence": CORRECT_SEQUENCES.get(scenario_id, []),
        "what_not_to_do": WHAT_NOT_TO_DO.get(scenario_id, []),
        "summary": summary,
    }


def _get_legal_consequence(scenario_id: str, step: int, choice: str, jurisdiction: str) -> str:
    bad_consequences: dict[str, dict[int, dict[str, str]]] = {
        "road_accident": {
            0: {"b": "Driving past an accident may constitute criminal negligence (BNS Section 106 in India). Hit-and-run is a criminal offence.", "c": "Filming and leaving may be considered omission of duty in some jurisdictions."},
            3: {"b": "Giving false information to police is perjury — BNS Section 229 in India, up to 7 years imprisonment."},
        },
        "fraud": {
            0: {"b": "Sharing an OTP makes you partially liable — banks may not refund if you voluntarily shared credentials."},
            2: {"b": "Failure to report fraud means the bank may not process your claim."},
        },
        "cybercrime": {
            2: {"b": "Paying ransom may be illegal in some jurisdictions and funds criminal organisations."},
        },
    }
    consequence = bad_consequences.get(scenario_id, {}).get(step, {}).get(choice, "")
    return consequence


def _get_ethical_note(scenario_id: str, step: int, choice: str) -> str:
    notes: dict[str, dict[int, dict[str, str]]] = {
        "road_accident": {
            0: {"b": "Driving past someone in need when you could help is widely considered a serious moral failure.", "c": "Prioritising content creation over human life reflects a dangerous shift in values."},
        },
        "sexual_assault": {
            0: {"c": "Victim-blaming is harmful, re-traumatising, and factually wrong — clothing does not cause assault."},
        },
        "domestic_violence": {
            1: {"b": "Telling a DV victim to confront their abuser shows a fundamental misunderstanding of abuse dynamics."},
        },
        "harassment": {
            0: {"d": "Bystander inaction is one of the primary reasons harassment continues — silence is complicity."},
        },
    }
    return notes.get(scenario_id, {}).get(step, {}).get(choice, "")
