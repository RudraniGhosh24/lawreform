"""
ClauseSnap — Real-time contract clause analysis and risk detection engine.
Rule-based pattern matching + deep sentence-level critical analysis + jurisdiction-specific checks.
All logic server-side only.
"""
import re
from typing import Any

DISCLAIMER = (
    "This analysis is for educational purposes only and does not constitute legal advice. "
    "Consult a qualified legal professional before signing any contract."
)

# --- Clause type detection patterns ---
CLAUSE_PATTERNS = {
    "termination": [r"terminat", r"cancel", r"end\s+(?:the|this)\s+agreement", r"revoke", r"dissolve"],
    "liability": [r"liab(?:le|ility)", r"indemnif", r"hold\s+harmless", r"not\s+responsible", r"damages"],
    "payment": [r"payment", r"fee", r"refund", r"deposit", r"compensat", r"invoice", r"charge"],
    "non_compete": [r"non[\s-]?compete", r"restraint\s+of\s+trade", r"not\s+engage\s+in", r"competitive\s+activit"],
    "confidentiality": [r"confidential", r"non[\s-]?disclosure", r"proprietary", r"trade\s+secret", r"nda"],
    "data_use": [r"data", r"personal\s+information", r"privacy", r"gdpr", r"collect.*information", r"share.*data"],
    "intellectual_property": [r"intellectual\s+property", r"copyright", r"patent", r"trademark", r"work\s+product", r"invention"],
    "arbitration": [r"arbitrat", r"dispute\s+resolution", r"mediat", r"waive.*(?:right|jury)", r"binding"],
    "force_majeure": [r"force\s+majeure", r"act\s+of\s+god", r"unforeseeable", r"beyond.*control"],
    "warranty": [r"warrant", r"guarantee", r"as[\s-]?is", r"no\s+warranty", r"disclaim"],
    "governing_law": [r"governing\s+law", r"jurisdiction", r"venue", r"applicable\s+law"],
    "assignment": [r"assign", r"transfer.*rights", r"delegate", r"successor"],
    "severability": [r"severab", r"invalid.*provision", r"unenforceable.*provision"],
    "entire_agreement": [r"entire\s+agreement", r"supersede", r"merge", r"whole\s+agreement"],
    "performance": [r"obligation", r"fulfill", r"perform", r"good\s+faith", r"commercially\s+reasonable", r"best\s+efforts", r"reasonable\s+efforts"],
    "indemnification": [r"indemnif", r"hold\s+harmless", r"defend.*against", r"reimburse"],
    "limitation_of_liability": [r"limit.*liab", r"cap.*liab", r"aggregate.*liab", r"maximum.*liab", r"consequential.*damage"],
}

# --- Surface-level red flag patterns ---
RED_FLAG_PATTERNS = [
    (r"sole\s+discretion", "One party has sole discretion — this removes your ability to negotiate or challenge decisions."),
    (r"without\s+(?:prior\s+)?notice", "Action can be taken without notice — you may not get a chance to respond."),
    (r"irrevocabl[ey]", "This commitment is irrevocable — once agreed, you cannot undo it."),
    (r"waive.*(?:right|claim|remedy)", "You may be waiving important legal rights."),
    (r"non[\s-]?refundable", "Payments are non-refundable — you lose money even if the service is not delivered."),
    (r"unlimited\s+liab", "Unlimited liability exposure — your financial risk has no cap."),
    (r"perpetual|in\s+perpetuity", "This obligation lasts forever — no expiry or exit."),
    (r"at\s+any\s+time.*(?:terminat|cancel)", "The other party can terminate at any time — but can you?"),
    (r"shall\s+not\s+(?:sue|claim|seek)", "You are giving up your right to legal action."),
    (r"exclusive\s+(?:right|license|ownership)", "Exclusive rights transfer — you may lose control of your own work."),
    (r"automatic(?:ally)?\s+renew", "Auto-renewal — you may be locked in without realizing."),
    (r"modify.*(?:at\s+any\s+time|without\s+notice|sole\s+discretion)", "Terms can be changed unilaterally — what you sign today may not be what applies tomorrow."),
    (r"all\s+(?:intellectual\s+property|ip|work\s+product).*(?:belong|vest|assign|transfer)", "All IP transfers to the other party — you may lose rights to your own creations."),
    (r"(?:no|zero|0)\s+(?:liability|responsibility)", "Complete liability exclusion — the other party accepts no responsibility at all."),
    (r"binding\s+arbitration", "Binding arbitration — you give up your right to go to court."),
    (r"(?:worldwide|global)\s+(?:license|right)", "Worldwide rights granted — extremely broad scope."),
]

# ============================================================
# DEEP SENTENCE-LEVEL ANALYSIS ENGINE
# Analyses each sentence for subtle legal issues
# ============================================================

DEEP_PATTERNS = [
    # --- Vague / subjective standards ---
    (r"good\s+faith", "VAGUE_STANDARD", "'Good faith' is subjective and undefined — what counts as good faith is open to interpretation and dispute."),
    (r"commercially\s+reasonable\s+efforts", "VAGUE_STANDARD", "'Commercially reasonable efforts' is a lower bar than 'best efforts' — the party only needs to do what's convenient, not everything possible."),
    (r"best\s+efforts", "VAGUE_STANDARD", "'Best efforts' is the highest standard but still subjective — courts interpret this differently across jurisdictions."),
    (r"reasonable\s+efforts", "VAGUE_STANDARD", "'Reasonable efforts' is deliberately vague — it allows the performing party to define what's 'reasonable' after the fact."),
    (r"as\s+(?:the\s+)?(?:party|company|employer)\s+(?:sees|deems)\s+fit", "VAGUE_STANDARD", "The standard is entirely at one party's discretion — no objective measure exists."),
    (r"industry\s+standards?\s+prevailing", "VAGUE_STANDARD", "'Industry standards' are not codified — they vary, change, and are often disputed. This gives wiggle room."),

    # --- Escape hatches / accountability shields ---
    (r"deemed\s+to\s+have\s+fulfilled", "ESCAPE_HATCH", "'Deemed to have fulfilled' means the obligation is considered met even if the actual result was not achieved — this is an escape hatch."),
    (r"even\s+if\s+(?:the\s+)?(?:intended|expected|desired)\s+outcome\s+is\s+not\s+(?:fully\s+)?achieved", "ESCAPE_HATCH", "The party can fail to deliver the intended outcome and still be considered compliant — this significantly weakens accountability."),
    (r"provided\s+that.*not\s+the\s+result\s+of\s+gross\s+negligence", "ESCAPE_HATCH", "Only 'gross negligence' is excluded — ordinary negligence, carelessness, and poor judgment are all protected. This is a very low accountability bar."),
    (r"not\s+(?:the\s+result\s+of|caused\s+by|attributable\s+to)\s+(?:gross\s+negligence|willful\s+misconduct)", "ESCAPE_HATCH", "The exclusion only covers gross negligence and willful misconduct — everything below that threshold (ordinary negligence, incompetence, poor planning) is excused."),
    (r"foreseeable\s+and\s+avoidable\s+risk", "ESCAPE_HATCH", "'Foreseeable AND avoidable' is a double requirement — the risk must be BOTH foreseeable AND avoidable to trigger liability. If it was foreseeable but arguably unavoidable, the party escapes responsibility."),
    (r"shall\s+not\s+be\s+(?:held\s+)?(?:liable|responsible)", "ESCAPE_HATCH", "Direct liability exclusion — the party cannot be held responsible."),
    (r"to\s+the\s+(?:maximum|fullest)\s+extent\s+(?:permitted|allowed)\s+by\s+law", "ESCAPE_HATCH", "This phrase pushes liability exclusion to the legal limit — they're excluding everything they legally can."),

    # --- Burden of proof issues ---
    (r"(?:consideration|account)\s+shall\s+be\s+given\s+to", "BURDEN_SHIFT", "'Consideration shall be given to' is passive — it doesn't say WHO gives consideration or HOW MUCH weight each factor carries. This creates ambiguity in disputes."),
    (r"information\s+available\s+to\s+the\s+party\s+at\s+the\s+time", "BURDEN_SHIFT", "Judging by 'information available at the time' means the party can claim ignorance — even if better information was easily obtainable."),
    (r"whether\s+an\s+alternative.*would\s+have\s+materially\s+improved", "BURDEN_SHIFT", "The 'alternative course of action' test puts the burden on YOU to prove a better option existed — this is extremely hard to prove after the fact."),
    (r"reasonably\s+apparent\s+under\s+similar\s+circumstances", "BURDEN_SHIFT", "'Reasonably apparent under similar circumstances' is a hypothetical test — it's nearly impossible to prove what was 'apparent' in hindsight."),

    # --- Interpretation traps ---
    (r"subjective\s+intent", "INTERPRETATION_TRAP", "'Subjective intent' means the party's internal motivation matters — but intent is nearly impossible to prove or disprove. This creates a he-said-she-said situation."),
    (r"objective\s+(?:commercial\s+)?standards?\s+and\s+subjective\s+intent", "INTERPRETATION_TRAP", "Mixing objective AND subjective standards means neither is decisive — a court must weigh both, making outcomes unpredictable."),
    (r"neither\s+(?:being\s+)?solely\s+determinative", "INTERPRETATION_TRAP", "'Neither being solely determinative' means no single factor decides the outcome — this maximises ambiguity and makes dispute resolution unpredictable."),
    (r"interpret.*(?:in\s+light\s+of|considering|taking\s+into\s+account)", "INTERPRETATION_TRAP", "Open-ended interpretation language — the clause can be read differently depending on who's doing the interpreting."),
    (r"(?:may|might|could)\s+(?:be\s+)?(?:construed|interpreted|understood)", "INTERPRETATION_TRAP", "Permissive interpretation language — leaves room for multiple readings."),

    # --- One-sided protections ---
    (r"(?:the\s+)?(?:company|employer|provider|landlord|we)\s+(?:shall|may)\s+(?:not\s+be|be\s+deemed)", "ONE_SIDED", "Protection language applies only to one party — check if you have equivalent protections."),
    (r"(?:you|employee|tenant|user|contractor)\s+(?:shall|must|agree\s+to)\s+(?:indemnif|hold\s+harmless|defend)", "ONE_SIDED", "You are required to indemnify/protect the other party — but do they indemnify you?"),

    # --- Scope creep ---
    (r"any\s+and\s+all\s+(?:claims|disputes|matters|issues)", "SCOPE_CREEP", "'Any and all' is the broadest possible scope — it captures everything, including things you might not anticipate."),
    (r"including\s+(?:but\s+)?not\s+limited\s+to", "SCOPE_CREEP", "'Including but not limited to' means the list is illustrative, not exhaustive — the actual scope is unlimited."),
    (r"(?:any|all)\s+(?:direct|indirect|consequential|incidental|special|punitive)\s+damages", "SCOPE_CREEP", "Broad damage categories — this could cover far more than you expect."),

    # --- Time / duration issues ---
    (r"(?:survive|surviving)\s+(?:the\s+)?(?:termination|expiration|end)", "DURATION_ISSUE", "This obligation survives after the contract ends — you're bound even after the relationship is over."),
    (r"(?:indefinite|unlimited|no\s+(?:time\s+)?limit)", "DURATION_ISSUE", "No time limit on this obligation — it could last forever."),

    # --- Remedy limitations ---
    (r"sole\s+(?:and\s+exclusive\s+)?remedy", "REMEDY_LIMIT", "'Sole remedy' means this is the ONLY thing you can do if something goes wrong — all other legal options are cut off."),
    (r"(?:in\s+no\s+event|under\s+no\s+circumstances)\s+shall.*(?:exceed|be\s+greater)", "REMEDY_LIMIT", "Hard cap on what you can recover — even if your actual losses are much higher."),
]

def _deep_analyze_sentences(text: str) -> list[dict]:
    """Analyze each sentence for subtle legal issues."""
    # Split into sentences
    sentences = re.split(r'(?<=[.;])\s+', text.strip())
    if len(sentences) <= 1:
        sentences = [text.strip()]

    findings = []
    for sentence in sentences:
        sentence = sentence.strip()
        if len(sentence) < 15:
            continue
        sentence_findings = []
        for pattern, category, explanation in DEEP_PATTERNS:
            if re.search(pattern, sentence, re.IGNORECASE):
                sentence_findings.append({
                    "category": category,
                    "explanation": explanation,
                    "severity": _category_severity(category),
                })
        if sentence_findings:
            # Truncate long sentences for display
            display = sentence[:150] + "..." if len(sentence) > 150 else sentence
            findings.append({
                "sentence": display,
                "issues": sentence_findings,
                "issue_count": len(sentence_findings),
            })
    return findings


def _category_severity(category: str) -> str:
    return {
        "VAGUE_STANDARD": "Medium",
        "ESCAPE_HATCH": "High",
        "BURDEN_SHIFT": "High",
        "INTERPRETATION_TRAP": "High",
        "ONE_SIDED": "High",
        "SCOPE_CREEP": "Medium",
        "DURATION_ISSUE": "Medium",
        "REMEDY_LIMIT": "High",
    }.get(category, "Medium")


def _category_label(category: str) -> str:
    return {
        "VAGUE_STANDARD": "⚠️ Vague Standard",
        "ESCAPE_HATCH": "🚪 Escape Hatch",
        "BURDEN_SHIFT": "⚖️ Burden of Proof Issue",
        "INTERPRETATION_TRAP": "🪤 Interpretation Trap",
        "ONE_SIDED": "🔄 One-Sided Protection",
        "SCOPE_CREEP": "📐 Scope Creep",
        "DURATION_ISSUE": "⏰ Duration Issue",
        "REMEDY_LIMIT": "🔒 Remedy Limitation",
    }.get(category, "⚠️ Issue")

# --- Hidden implications by clause type ---
HIDDEN_IMPLICATIONS = {
    "termination": [
        "If only one party can terminate, you're locked in while they can walk away.",
        "Short notice periods may not give you enough time to find alternatives.",
        "Termination 'for convenience' means they don't even need a reason.",
    ],
    "liability": [
        "Liability caps that are too low may leave you uncompensated for real losses.",
        "Indemnification clauses can make YOU pay for THEIR mistakes.",
        "'Hold harmless' means you can't sue even if they cause you harm.",
    ],
    "payment": [
        "Non-refundable deposits mean you pay even if they fail to deliver.",
        "Late payment penalties can compound quickly.",
        "Vague payment terms ('reasonable time') give the other party wiggle room.",
    ],
    "non_compete": [
        "Overly broad non-competes can prevent you from working in your entire industry.",
        "Long non-compete periods (2+ years) may be unenforceable but still intimidating.",
        "Geographic scope matters — a 'worldwide' non-compete is often unreasonable.",
    ],
    "data_use": [
        "Broad data sharing clauses may allow your data to be sold to third parties.",
        "'Anonymized' data can often be re-identified.",
        "Consent to data collection may be buried in terms you didn't read carefully.",
    ],
    "confidentiality": [
        "One-sided NDAs protect them but not you.",
        "Overly broad definitions of 'confidential' can restrict your future work.",
        "No expiry on confidentiality means you're bound forever.",
    ],
    "intellectual_property": [
        "Work-for-hire clauses mean you own nothing you create.",
        "IP assignment without compensation is essentially free transfer of your work.",
        "Moral rights waivers (where applicable) strip your right to be credited.",
    ],
    "arbitration": [
        "Binding arbitration removes your right to a jury trial.",
        "The arbitration venue may be in a location inconvenient or expensive for you.",
        "Arbitration costs can be higher than small claims court.",
    ],
}

# --- Jurisdiction-specific validity rules ---
JURISDICTION_RULES = {
    "india": {
        "unfair_terms": "Under the Indian Contract Act 1872, contracts obtained through coercion, undue influence, or fraud are voidable. The Consumer Protection Act 2019 prohibits unfair contract terms in consumer agreements.",
        "non_compete": "Non-compete clauses are generally unenforceable in India under Section 27 of the Indian Contract Act — any agreement in restraint of trade is void.",
        "data_use": "India's Digital Personal Data Protection Act 2023 requires explicit consent for data collection and gives individuals the right to erasure.",
        "liability": "Exclusion clauses that are unconscionable may be struck down. Courts apply the doctrine of fundamental breach.",
        "arbitration": "The Arbitration and Conciliation Act 1996 governs. Arbitration clauses are generally enforceable but unconscionable terms can be challenged.",
        "termination": "Unilateral termination without notice may be challenged under principles of natural justice and fairness.",
    },
    "uk": {
        "unfair_terms": "The Consumer Rights Act 2015 and Unfair Contract Terms Act 1977 provide strong protections. Unfair terms in consumer contracts are not binding.",
        "non_compete": "Non-compete clauses must be reasonable in scope, duration, and geography. Overly broad restrictions are unenforceable.",
        "data_use": "GDPR (UK GDPR) requires lawful basis for data processing, explicit consent for sensitive data, and grants data subjects extensive rights.",
        "liability": "The Unfair Contract Terms Act 1977 prevents exclusion of liability for death/personal injury due to negligence. Other exclusions must be 'reasonable'.",
        "arbitration": "The Arbitration Act 1996 applies. Consumer arbitration clauses may be unfair under the Consumer Rights Act 2015.",
        "termination": "Employment contracts require statutory minimum notice periods. Unfair dismissal protections apply after 2 years of service.",
    },
    "us": {
        "unfair_terms": "Unconscionability doctrine applies — courts can refuse to enforce contracts that are extremely one-sided. State consumer protection laws vary.",
        "non_compete": "Enforceability varies by state. California bans most non-competes. Other states require reasonableness in scope and duration.",
        "data_use": "No federal comprehensive privacy law. CCPA (California), state privacy laws, and sector-specific laws (HIPAA, COPPA) apply.",
        "liability": "Limitation of liability clauses are generally enforceable but cannot exclude liability for gross negligence or intentional misconduct in most states.",
        "arbitration": "The Federal Arbitration Act strongly favors arbitration. However, some states have carved out exceptions for employment and consumer contracts.",
        "termination": "At-will employment means either party can terminate without cause in most states. Contract termination clauses are generally enforceable.",
    },
}

CONTEXT_RISK_BOOST = {
    "employment": ["non_compete", "termination", "intellectual_property", "confidentiality"],
    "rental": ["termination", "payment", "liability", "force_majeure"],
    "freelance": ["payment", "intellectual_property", "termination", "liability"],
    "privacy": ["data_use", "confidentiality"],
    "general": [],
}

def analyze_clause(clause_text: str, jurisdiction: str, context_type: str) -> dict:
    """Main analysis function."""
    text_lower = clause_text.lower().strip()
    if len(text_lower) < 10:
        return {"error": "Clause text is too short to analyze."}

    # 1. Classify clause type
    clause_type = _detect_clause_type(text_lower)

    # 2. Detect surface-level red flags
    red_flags = _detect_red_flags(text_lower)

    # 3. Deep sentence-level analysis
    deep_analysis = _deep_analyze_sentences(clause_text)

    # Merge deep findings into red flags for risk calculation
    deep_red_flags = []
    for finding in deep_analysis:
        for issue in finding["issues"]:
            deep_red_flags.append(issue["explanation"])

    all_flags = red_flags + [f for f in deep_red_flags if f not in red_flags]

    # 4. Check legal validity
    legal_validity, validity_notes = _check_validity(clause_type, jurisdiction, text_lower, len(all_flags))

    # 5. Get hidden implications
    relevant_implications = _filter_relevant_implications(text_lower, clause_type, deep_analysis)

    # 6. Calculate risk level
    risk_level, confidence = _calculate_risk(all_flags, legal_validity, clause_type, context_type, deep_analysis)

    # 7. Generate plain English explanation
    plain_english = _generate_plain_english(clause_type, text_lower, all_flags, deep_analysis)

    # 8. Generate suggested fix
    suggested_fix = _generate_fix(clause_type, all_flags, text_lower, deep_analysis)

    # 9. Why this matters
    why_matters = _why_this_matters(clause_type, risk_level, context_type)

    # 10. Brutal honesty mode
    brutal = _brutal_honesty(clause_type, risk_level, all_flags, deep_analysis)

    # Format deep analysis for frontend
    formatted_deep = []
    for finding in deep_analysis:
        formatted_deep.append({
            "sentence": finding["sentence"],
            "issues": [{"category": _category_label(i["category"]), "explanation": i["explanation"], "severity": i["severity"]} for i in finding["issues"]],
        })

    return {
        "clause_type": clause_type.replace("_", " ").title(),
        "plain_english": plain_english,
        "risk_level": risk_level,
        "red_flags": all_flags,
        "deep_analysis": formatted_deep,
        "hidden_implications": relevant_implications,
        "legal_validity": legal_validity,
        "validity_notes": validity_notes,
        "why_this_matters": why_matters,
        "suggested_fix": suggested_fix,
        "confidence": confidence,
        "tone_mode": {
            "normal": plain_english,
            "brutal_honesty": brutal,
        },
        "disclaimer": DISCLAIMER,
    }


def _detect_clause_type(text: str) -> str:
    scores: dict[str, int] = {}
    for ctype, patterns in CLAUSE_PATTERNS.items():
        score = sum(1 for p in patterns if re.search(p, text, re.IGNORECASE))
        if score > 0:
            scores[ctype] = score
    if not scores:
        return "general"
    return max(scores, key=scores.get)


def _detect_red_flags(text: str) -> list[str]:
    flags = []
    for pattern, description in RED_FLAG_PATTERNS:
        if re.search(pattern, text, re.IGNORECASE):
            flags.append(description)
    # Check for one-sidedness
    party_a = len(re.findall(r"\b(?:company|employer|landlord|provider|we|us|our)\b", text, re.IGNORECASE))
    party_b = len(re.findall(r"\b(?:employee|tenant|user|you|your|contractor|freelancer)\b", text, re.IGNORECASE))
    obligations_on_b = len(re.findall(r"\b(?:you\s+(?:shall|must|agree|will)|employee\s+(?:shall|must))\b", text, re.IGNORECASE))
    obligations_on_a = len(re.findall(r"\b(?:company\s+(?:shall|must|will)|we\s+(?:shall|must|will))\b", text, re.IGNORECASE))
    if obligations_on_b > 0 and obligations_on_a == 0:
        flags.append("One-sided obligations — only you have duties, the other party has none.")
    # Check for vagueness
    vague_terms = re.findall(r"\b(?:reasonable|appropriate|adequate|as\s+needed|from\s+time\s+to\s+time|may)\b", text, re.IGNORECASE)
    if len(vague_terms) >= 3:
        flags.append(f"Excessive vague language ({len(vague_terms)} vague terms found) — this gives the other party room to interpret terms in their favour.")
    return flags


def _check_validity(clause_type: str, jurisdiction: str, text: str, total_flags: int) -> tuple[str, str]:
    rules = JURISDICTION_RULES.get(jurisdiction, {})
    specific_rule = rules.get(clause_type, rules.get("unfair_terms", ""))

    if total_flags >= 6:
        return "Possibly unenforceable", specific_rule
    elif total_flags >= 3:
        return "Questionable", specific_rule
    else:
        return "Likely enforceable", specific_rule


def _filter_relevant_implications(text: str, clause_type: str, deep_analysis: list) -> list[str]:
    all_implications = HIDDEN_IMPLICATIONS.get(clause_type, [])
    # Add implications derived from deep analysis
    deep_implications = []
    categories_found = set()
    for finding in deep_analysis:
        for issue in finding["issues"]:
            categories_found.add(issue["category"])

    if "ESCAPE_HATCH" in categories_found:
        deep_implications.append("This clause contains escape hatches that allow the performing party to claim compliance even when they haven't delivered the expected result.")
    if "VAGUE_STANDARD" in categories_found:
        deep_implications.append("Vague performance standards ('good faith', 'reasonable efforts') give the performing party significant room to underperform without consequence.")
    if "BURDEN_SHIFT" in categories_found:
        deep_implications.append("The burden of proving non-compliance falls on you — and the tests used are subjective and hard to satisfy.")
    if "INTERPRETATION_TRAP" in categories_found:
        deep_implications.append("Dispute resolution under this clause is deliberately ambiguous — outcomes will be unpredictable and expensive to litigate.")
    if "ONE_SIDED" in categories_found:
        deep_implications.append("Protections in this clause apply asymmetrically — one party is shielded while the other bears the risk.")
    if "SCOPE_CREEP" in categories_found:
        deep_implications.append("The scope of this clause is broader than it appears — 'any and all' or 'including but not limited to' language captures more than you might expect.")

    combined = deep_implications + all_implications[:2]
    return combined if combined else ["Review this clause carefully with a legal professional."]


def _calculate_risk(red_flags: list, validity: str, clause_type: str, context_type: str, deep_analysis: list) -> tuple[str, int]:
    score = len(red_flags) * 10

    # Deep analysis severity scoring
    for finding in deep_analysis:
        for issue in finding["issues"]:
            if issue["severity"] == "High":
                score += 12
            else:
                score += 6

    if validity == "Possibly unenforceable":
        score += 20
    elif validity == "Questionable":
        score += 10

    boosted = CONTEXT_RISK_BOOST.get(context_type, [])
    if clause_type in boosted:
        score += 15

    score = min(score, 100)
    if score >= 50:
        return "High", min(score + 5, 95)
    elif score >= 25:
        return "Medium", min(score + 10, 85)
    else:
        return "Low", max(score + 20, 40)


def _generate_plain_english(clause_type: str, text: str, red_flags: list, deep_analysis: list) -> str:
    base = {
        "termination": "This clause defines how and when the agreement can be ended.",
        "liability": "This clause limits or assigns responsibility for losses or damages.",
        "payment": "This clause covers payment terms, fees, or refund conditions.",
        "non_compete": "This clause restricts your ability to work for competitors or start a competing business.",
        "confidentiality": "This clause requires you to keep certain information secret.",
        "data_use": "This clause describes how your personal data will be collected, used, or shared.",
        "intellectual_property": "This clause determines who owns the work or ideas created under this agreement.",
        "arbitration": "This clause requires disputes to be resolved through arbitration instead of court.",
        "force_majeure": "This clause excuses performance when extraordinary events occur.",
        "warranty": "This clause defines guarantees (or lack thereof) about the product or service.",
        "governing_law": "This clause specifies which jurisdiction's laws apply to the contract.",
        "assignment": "This clause covers whether rights under this contract can be transferred to someone else.",
        "performance": "This clause defines what counts as fulfilling an obligation under the agreement.",
    }.get(clause_type, "This clause sets out specific terms of the agreement.")

    if deep_analysis:
        total_issues = sum(f["issue_count"] for f in deep_analysis)
        high_issues = sum(1 for f in deep_analysis for i in f["issues"] if i["severity"] == "High")
        base += f" Deep analysis found {total_issues} issue(s) across {len(deep_analysis)} sentence(s)"
        if high_issues > 0:
            base += f", including {high_issues} high-severity concern(s)."
        else:
            base += "."
    elif red_flags:
        base += f" {len(red_flags)} potential issue(s) were detected."
    return base


def _generate_fix(clause_type: str, red_flags: list, text: str, deep_analysis: list) -> str:
    fixes = []
    # Surface-level fixes
    if any("sole discretion" in f for f in red_flags):
        fixes.append("Replace 'sole discretion' with 'mutual agreement' or 'reasonable discretion with written notice'.")
    if any("without notice" in f.lower() for f in red_flags):
        fixes.append("Add a minimum notice period (e.g., 30 days written notice).")
    if any("irrevocab" in f.lower() for f in red_flags):
        fixes.append("Add a revocation mechanism with reasonable conditions.")
    if any("waiv" in f.lower() for f in red_flags):
        fixes.append("Remove or limit the waiver — preserve your right to legal remedies.")
    if any("non-refundable" in f.lower() for f in red_flags):
        fixes.append("Negotiate a partial refund clause or pro-rata refund based on services delivered.")
    if any("perpetual" in f.lower() or "forever" in f.lower() for f in red_flags):
        fixes.append("Add a reasonable time limit (e.g., 2-3 years) with option to renew.")
    if any("auto" in f.lower() and "renew" in f.lower() for f in red_flags):
        fixes.append("Add a clear opt-out mechanism with advance notice before auto-renewal.")
    if any("ip" in f.lower() or "intellectual" in f.lower() for f in red_flags):
        fixes.append("Retain ownership of pre-existing IP. Limit assignment to work created specifically under this contract.")
    if any("arbitration" in f.lower() for f in red_flags):
        fixes.append("Negotiate the right to choose the arbitration venue, or add a small claims court exception.")
    if any("one-sided" in f.lower() for f in red_flags):
        fixes.append("Add mutual obligations — both parties should have equivalent duties and rights.")

    # Deep analysis fixes
    categories_found = set()
    for finding in deep_analysis:
        for issue in finding["issues"]:
            categories_found.add(issue["category"])

    if "VAGUE_STANDARD" in categories_found:
        fixes.append("Replace vague standards ('good faith', 'commercially reasonable') with specific, measurable performance criteria and deadlines.")
    if "ESCAPE_HATCH" in categories_found:
        fixes.append("Remove 'deemed to have fulfilled' language. Require actual delivery of the intended outcome, not just effort. Lower the negligence threshold from 'gross negligence' to 'ordinary negligence'.")
    if "BURDEN_SHIFT" in categories_found:
        fixes.append("Clarify who bears the burden of proof. Replace subjective tests ('information available at the time') with objective, documented standards.")
    if "INTERPRETATION_TRAP" in categories_found:
        fixes.append("Remove 'subjective intent' as a factor. Use only objective, measurable standards for dispute resolution. Specify a clear dispute resolution mechanism.")
    if "SCOPE_CREEP" in categories_found:
        fixes.append("Replace 'any and all' with specific, enumerated items. Remove 'including but not limited to' and list exact scope.")
    if "REMEDY_LIMIT" in categories_found:
        fixes.append("Negotiate a higher liability cap or remove 'sole remedy' language to preserve your right to full compensation.")

    if not fixes:
        fixes.append("This clause appears relatively standard. Consider having a lawyer review the full contract for context.")
    return " ".join(fixes)


def _why_this_matters(clause_type: str, risk_level: str, context_type: str) -> str:
    matters = {
        "termination": "If this clause is unfair, you could be locked into a contract you can't exit, or terminated without warning.",
        "liability": "A bad liability clause means you could end up paying for damages that aren't your fault.",
        "payment": "Unfair payment terms can leave you out of pocket with no recourse.",
        "non_compete": "An overly broad non-compete can prevent you from earning a living in your field.",
        "confidentiality": "One-sided confidentiality can restrict your future career while the other party faces no such limits.",
        "data_use": "Broad data clauses can mean your personal information is sold, shared, or used in ways you never intended.",
        "intellectual_property": "You could lose ownership of work you created — including the right to use it in your own portfolio.",
        "arbitration": "You give up your right to go to court. Arbitration can be expensive and the process favours repeat players (companies).",
    }.get(clause_type, "This clause affects your rights and obligations under the contract.")

    if risk_level == "High":
        matters += " Given the high risk level, you should NOT sign this without modification or legal advice."
    return matters


def _brutal_honesty(clause_type: str, risk_level: str, red_flags: list, deep_analysis: list) -> str:
    if risk_level == "High":
        opener = "This clause is a problem."
    elif risk_level == "Medium":
        opener = "This clause needs attention."
    else:
        opener = "This clause is mostly fine."

    if not red_flags and not deep_analysis:
        return f"{opener} No major red flags detected, but always read the full contract."

    parts = [opener]
    if deep_analysis:
        total = sum(f["issue_count"] for f in deep_analysis)
        high = sum(1 for f in deep_analysis for i in f["issues"] if i["severity"] == "High")
        parts.append(f"Line-by-line analysis found {total} issues ({high} high-severity).")

        categories = set()
        for f in deep_analysis:
            for i in f["issues"]:
                categories.add(i["category"])
        if "ESCAPE_HATCH" in categories:
            parts.append("It contains escape hatches — the other party can fail to deliver and still claim they fulfilled their obligation.")
        if "VAGUE_STANDARD" in categories:
            parts.append("Performance standards are deliberately vague — 'good faith' and 'reasonable efforts' mean whatever the other party wants them to mean.")
        if "INTERPRETATION_TRAP" in categories:
            parts.append("Dispute resolution is a trap — mixing subjective and objective standards makes outcomes unpredictable and expensive.")
        if "BURDEN_SHIFT" in categories:
            parts.append("The burden of proof is on you, and the tests are designed to be nearly impossible to satisfy.")
    elif red_flags:
        flag_summary = " ".join([f"• {f}" for f in red_flags[:3]])
        parts.append(f"Issues found: {flag_summary}")

    return " ".join(parts)
