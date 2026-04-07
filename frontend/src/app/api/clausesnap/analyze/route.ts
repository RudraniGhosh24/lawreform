import { NextRequest, NextResponse } from 'next/server'

// ─── ClauseSnap — Contract clause analysis & risk detection engine ───
// Ports: clausesnap_engine.py

const DISCLAIMER =
  'This analysis is for educational purposes only and does not constitute legal advice. ' +
  'Consult a qualified legal professional before signing any contract.'

// ─── Clause type detection patterns ───
const CLAUSE_PATTERNS: Record<string, RegExp[]> = {
  termination: [/terminat/i, /cancel/i, /end\s+(?:the|this)\s+agreement/i, /revoke/i, /dissolve/i],
  liability: [/liab(?:le|ility)/i, /indemnif/i, /hold\s+harmless/i, /not\s+responsible/i, /damages/i],
  payment: [/payment/i, /\bfee\b/i, /refund/i, /deposit/i, /compensat/i, /invoice/i, /charge/i],
  non_compete: [/non[\s-]?compete/i, /restraint\s+of\s+trade/i, /not\s+engage\s+in/i, /competitive\s+activit/i],
  confidentiality: [/confidential/i, /non[\s-]?disclosure/i, /proprietary/i, /trade\s+secret/i, /\bnda\b/i],
  data_use: [/\bdata\b/i, /personal\s+information/i, /privacy/i, /gdpr/i, /collect.*information/i, /share.*data/i],
  intellectual_property: [/intellectual\s+property/i, /copyright/i, /patent/i, /trademark/i, /work\s+product/i, /invention/i],
  arbitration: [/arbitrat/i, /dispute\s+resolution/i, /mediat/i, /waive.*(?:right|jury)/i, /binding/i],
  force_majeure: [/force\s+majeure/i, /act\s+of\s+god/i, /unforeseeable/i, /beyond.*control/i],
  warranty: [/warrant/i, /guarantee/i, /as[\s-]?is/i, /no\s+warranty/i, /disclaim/i],
  governing_law: [/governing\s+law/i, /jurisdiction/i, /venue/i, /applicable\s+law/i],
  assignment: [/assign/i, /transfer.*rights/i, /delegate/i, /successor/i],
  performance: [/obligation/i, /fulfill/i, /perform/i, /good\s+faith/i, /commercially\s+reasonable/i, /best\s+efforts/i],
  indemnification: [/indemnif/i, /hold\s+harmless/i, /defend.*against/i, /reimburse/i],
  limitation_of_liability: [/limit.*liab/i, /cap.*liab/i, /aggregate.*liab/i, /maximum.*liab/i, /consequential.*damage/i],
}

// ─── Surface-level red flag patterns ───
const RED_FLAG_PATTERNS: [RegExp, string][] = [
  [/sole\s+discretion/i, 'One party has sole discretion — this removes your ability to negotiate or challenge decisions.'],
  [/without\s+(?:prior\s+)?notice/i, 'Action can be taken without notice — you may not get a chance to respond.'],
  [/irrevocabl[ey]/i, 'This commitment is irrevocable — once agreed, you cannot undo it.'],
  [/waive.*(?:right|claim|remedy)/i, 'You may be waiving important legal rights.'],
  [/non[\s-]?refundable/i, 'Payments are non-refundable — you lose money even if the service is not delivered.'],
  [/unlimited\s+liab/i, 'Unlimited liability exposure — your financial risk has no cap.'],
  [/perpetual|in\s+perpetuity/i, 'This obligation lasts forever — no expiry or exit.'],
  [/at\s+any\s+time.*(?:terminat|cancel)/i, 'The other party can terminate at any time — but can you?'],
  [/shall\s+not\s+(?:sue|claim|seek)/i, 'You are giving up your right to legal action.'],
  [/exclusive\s+(?:right|license|ownership)/i, 'Exclusive rights transfer — you may lose control of your own work.'],
  [/automatic(?:ally)?\s+renew/i, 'Auto-renewal — you may be locked in without realizing.'],
  [/modify.*(?:at\s+any\s+time|without\s+notice|sole\s+discretion)/i, 'Terms can be changed unilaterally — what you sign today may not be what applies tomorrow.'],
  [/all\s+(?:intellectual\s+property|ip|work\s+product).*(?:belong|vest|assign|transfer)/i, 'All IP transfers to the other party — you may lose rights to your own creations.'],
  [/(?:no|zero|0)\s+(?:liability|responsibility)/i, 'Complete liability exclusion — the other party accepts no responsibility at all.'],
  [/binding\s+arbitration/i, 'Binding arbitration — you give up your right to go to court.'],
  [/(?:worldwide|global)\s+(?:license|right)/i, 'Worldwide rights granted — extremely broad scope.'],
]

// ─── Deep sentence-level analysis patterns ───
type DeepPattern = [RegExp, string, string] // [pattern, category, explanation]

const DEEP_PATTERNS: DeepPattern[] = [
  // Vague / subjective standards
  [/good\s+faith/i, 'VAGUE_STANDARD', "'Good faith' is subjective and undefined — what counts as good faith is open to interpretation and dispute."],
  [/commercially\s+reasonable\s+efforts/i, 'VAGUE_STANDARD', "'Commercially reasonable efforts' is a lower bar than 'best efforts' — the party only needs to do what's convenient, not everything possible."],
  [/best\s+efforts/i, 'VAGUE_STANDARD', "'Best efforts' is the highest standard but still subjective — courts interpret this differently across jurisdictions."],
  [/reasonable\s+efforts/i, 'VAGUE_STANDARD', "'Reasonable efforts' is deliberately vague — it allows the performing party to define what's 'reasonable' after the fact."],
  [/as\s+(?:the\s+)?(?:party|company|employer)\s+(?:sees|deems)\s+fit/i, 'VAGUE_STANDARD', "The standard is entirely at one party's discretion — no objective measure exists."],
  [/industry\s+standards?\s+prevailing/i, 'VAGUE_STANDARD', "'Industry standards' are not codified — they vary, change, and are often disputed."],
  // Escape hatches
  [/deemed\s+to\s+have\s+fulfilled/i, 'ESCAPE_HATCH', "'Deemed to have fulfilled' means the obligation is considered met even if the actual result was not achieved — this is an escape hatch."],
  [/even\s+if\s+(?:the\s+)?(?:intended|expected|desired)\s+outcome\s+is\s+not\s+(?:fully\s+)?achieved/i, 'ESCAPE_HATCH', "The party can fail to deliver the intended outcome and still be considered compliant — this significantly weakens accountability."],
  [/provided\s+that.*not\s+the\s+result\s+of\s+gross\s+negligence/i, 'ESCAPE_HATCH', "Only 'gross negligence' is excluded — ordinary negligence, carelessness, and poor judgment are all protected."],
  [/not\s+(?:the\s+result\s+of|caused\s+by|attributable\s+to)\s+(?:gross\s+negligence|willful\s+misconduct)/i, 'ESCAPE_HATCH', "The exclusion only covers gross negligence and willful misconduct — everything below that threshold is excused."],
  [/foreseeable\s+and\s+avoidable\s+risk/i, 'ESCAPE_HATCH', "'Foreseeable AND avoidable' is a double requirement — the risk must be BOTH to trigger liability."],
  [/shall\s+not\s+be\s+(?:held\s+)?(?:liable|responsible)/i, 'ESCAPE_HATCH', "Direct liability exclusion — the party cannot be held responsible."],
  [/to\s+the\s+(?:maximum|fullest)\s+extent\s+(?:permitted|allowed)\s+by\s+law/i, 'ESCAPE_HATCH', "This phrase pushes liability exclusion to the legal limit."],
  // Burden of proof
  [/(?:consideration|account)\s+shall\s+be\s+given\s+to/i, 'BURDEN_SHIFT', "'Consideration shall be given to' is passive — it doesn't say WHO gives consideration or HOW MUCH weight each factor carries."],
  [/information\s+available\s+to\s+the\s+party\s+at\s+the\s+time/i, 'BURDEN_SHIFT', "Judging by 'information available at the time' means the party can claim ignorance."],
  [/whether\s+an\s+alternative.*would\s+have\s+materially\s+improved/i, 'BURDEN_SHIFT', "The 'alternative course of action' test puts the burden on YOU to prove a better option existed."],
  [/reasonably\s+apparent\s+under\s+similar\s+circumstances/i, 'BURDEN_SHIFT', "'Reasonably apparent under similar circumstances' is a hypothetical test — nearly impossible to prove in hindsight."],
  // Interpretation traps
  [/subjective\s+intent/i, 'INTERPRETATION_TRAP', "'Subjective intent' means the party's internal motivation matters — but intent is nearly impossible to prove or disprove."],
  [/objective\s+(?:commercial\s+)?standards?\s+and\s+subjective\s+intent/i, 'INTERPRETATION_TRAP', "Mixing objective AND subjective standards means neither is decisive — outcomes become unpredictable."],
  [/neither\s+(?:being\s+)?solely\s+determinative/i, 'INTERPRETATION_TRAP', "'Neither being solely determinative' means no single factor decides the outcome — this maximises ambiguity."],
  [/interpret.*(?:in\s+light\s+of|considering|taking\s+into\s+account)/i, 'INTERPRETATION_TRAP', "Open-ended interpretation language — the clause can be read differently depending on who's interpreting."],
  [/(?:may|might|could)\s+(?:be\s+)?(?:construed|interpreted|understood)/i, 'INTERPRETATION_TRAP', "Permissive interpretation language — leaves room for multiple readings."],
  // One-sided protections
  [/(?:the\s+)?(?:company|employer|provider|landlord|we)\s+(?:shall|may)\s+(?:not\s+be|be\s+deemed)/i, 'ONE_SIDED', "Protection language applies only to one party — check if you have equivalent protections."],
  [/(?:you|employee|tenant|user|contractor)\s+(?:shall|must|agree\s+to)\s+(?:indemnif|hold\s+harmless|defend)/i, 'ONE_SIDED', "You are required to indemnify/protect the other party — but do they indemnify you?"],
  // Scope creep
  [/any\s+and\s+all\s+(?:claims|disputes|matters|issues)/i, 'SCOPE_CREEP', "'Any and all' is the broadest possible scope — it captures everything."],
  [/including\s+(?:but\s+)?not\s+limited\s+to/i, 'SCOPE_CREEP', "'Including but not limited to' means the list is illustrative, not exhaustive — the actual scope is unlimited."],
  [/(?:any|all)\s+(?:direct|indirect|consequential|incidental|special|punitive)\s+damages/i, 'SCOPE_CREEP', "Broad damage categories — this could cover far more than you expect."],
  // Duration issues
  [/(?:survive|surviving)\s+(?:the\s+)?(?:termination|expiration|end)/i, 'DURATION_ISSUE', "This obligation survives after the contract ends — you're bound even after the relationship is over."],
  [/(?:indefinite|unlimited|no\s+(?:time\s+)?limit)/i, 'DURATION_ISSUE', "No time limit on this obligation — it could last forever."],
  // Remedy limitations
  [/sole\s+(?:and\s+exclusive\s+)?remedy/i, 'REMEDY_LIMIT', "'Sole remedy' means this is the ONLY thing you can do if something goes wrong — all other legal options are cut off."],
  [/(?:in\s+no\s+event|under\s+no\s+circumstances)\s+shall.*(?:exceed|be\s+greater)/i, 'REMEDY_LIMIT', "Hard cap on what you can recover — even if your actual losses are much higher."],
]

const CATEGORY_SEVERITY: Record<string, string> = {
  VAGUE_STANDARD: 'Medium', ESCAPE_HATCH: 'High', BURDEN_SHIFT: 'High',
  INTERPRETATION_TRAP: 'High', ONE_SIDED: 'High', SCOPE_CREEP: 'Medium',
  DURATION_ISSUE: 'Medium', REMEDY_LIMIT: 'High',
}

const CATEGORY_LABEL: Record<string, string> = {
  VAGUE_STANDARD: '⚠️ Vague Standard', ESCAPE_HATCH: '🚪 Escape Hatch',
  BURDEN_SHIFT: '⚖️ Burden of Proof Issue', INTERPRETATION_TRAP: '🪤 Interpretation Trap',
  ONE_SIDED: '🔄 One-Sided Protection', SCOPE_CREEP: '📐 Scope Creep',
  DURATION_ISSUE: '⏰ Duration Issue', REMEDY_LIMIT: '🔒 Remedy Limitation',
}

// ─── Hidden implications by clause type ───
const HIDDEN_IMPLICATIONS: Record<string, string[]> = {
  termination: [
    'If only one party can terminate, you\'re locked in while they can walk away.',
    'Short notice periods may not give you enough time to find alternatives.',
    'Termination \'for convenience\' means they don\'t even need a reason.',
  ],
  liability: [
    'Liability caps that are too low may leave you uncompensated for real losses.',
    'Indemnification clauses can make YOU pay for THEIR mistakes.',
    "'Hold harmless' means you can't sue even if they cause you harm.",
  ],
  payment: [
    'Non-refundable deposits mean you pay even if they fail to deliver.',
    'Late payment penalties can compound quickly.',
    "Vague payment terms ('reasonable time') give the other party wiggle room.",
  ],
  non_compete: [
    'Overly broad non-competes can prevent you from working in your entire industry.',
    'Long non-compete periods (2+ years) may be unenforceable but still intimidating.',
    "Geographic scope matters — a 'worldwide' non-compete is often unreasonable.",
  ],
  data_use: [
    'Broad data sharing clauses may allow your data to be sold to third parties.',
    "'Anonymized' data can often be re-identified.",
    "Consent to data collection may be buried in terms you didn't read carefully.",
  ],
  confidentiality: [
    'One-sided NDAs protect them but not you.',
    "Overly broad definitions of 'confidential' can restrict your future work.",
    "No expiry on confidentiality means you're bound forever.",
  ],
  intellectual_property: [
    'Work-for-hire clauses mean you own nothing you create.',
    'IP assignment without compensation is essentially free transfer of your work.',
    'Moral rights waivers (where applicable) strip your right to be credited.',
  ],
  arbitration: [
    'Binding arbitration removes your right to a jury trial.',
    'The arbitration venue may be in a location inconvenient or expensive for you.',
    'Arbitration costs can be higher than small claims court.',
  ],
}

// ─── Jurisdiction-specific validity rules ───
const JURISDICTION_RULES: Record<string, Record<string, string>> = {
  india: {
    unfair_terms: 'Under the Indian Contract Act 1872, contracts obtained through coercion, undue influence, or fraud are voidable. The Consumer Protection Act 2019 prohibits unfair contract terms in consumer agreements.',
    non_compete: 'Non-compete clauses are generally unenforceable in India under Section 27 of the Indian Contract Act — any agreement in restraint of trade is void.',
    data_use: "India's Digital Personal Data Protection Act 2023 requires explicit consent for data collection and gives individuals the right to erasure.",
    liability: 'Exclusion clauses that are unconscionable may be struck down. Courts apply the doctrine of fundamental breach.',
    arbitration: 'The Arbitration and Conciliation Act 1996 governs. Arbitration clauses are generally enforceable but unconscionable terms can be challenged.',
    termination: 'Unilateral termination without notice may be challenged under principles of natural justice and fairness.',
  },
  uk: {
    unfair_terms: 'The Consumer Rights Act 2015 and Unfair Contract Terms Act 1977 provide strong protections. Unfair terms in consumer contracts are not binding.',
    non_compete: 'Non-compete clauses must be reasonable in scope, duration, and geography. Overly broad restrictions are unenforceable.',
    data_use: 'GDPR (UK GDPR) requires lawful basis for data processing, explicit consent for sensitive data, and grants data subjects extensive rights.',
    liability: "The Unfair Contract Terms Act 1977 prevents exclusion of liability for death/personal injury due to negligence. Other exclusions must be 'reasonable'.",
    arbitration: 'The Arbitration Act 1996 applies. Consumer arbitration clauses may be unfair under the Consumer Rights Act 2015.',
    termination: 'Employment contracts require statutory minimum notice periods. Unfair dismissal protections apply after 2 years of service.',
  },
  us: {
    unfair_terms: 'Unconscionability doctrine applies — courts can refuse to enforce contracts that are extremely one-sided. State consumer protection laws vary.',
    non_compete: 'Enforceability varies by state. California bans most non-competes. Other states require reasonableness in scope and duration.',
    data_use: 'No federal comprehensive privacy law. CCPA (California), state privacy laws, and sector-specific laws (HIPAA, COPPA) apply.',
    liability: 'Limitation of liability clauses are generally enforceable but cannot exclude liability for gross negligence or intentional misconduct in most states.',
    arbitration: 'The Federal Arbitration Act strongly favors arbitration. However, some states have carved out exceptions for employment and consumer contracts.',
    termination: 'At-will employment means either party can terminate without cause in most states. Contract termination clauses are generally enforceable.',
  },
}

const CONTEXT_RISK_BOOST: Record<string, string[]> = {
  employment: ['non_compete', 'termination', 'intellectual_property', 'confidentiality'],
  rental: ['termination', 'payment', 'liability', 'force_majeure'],
  freelance: ['payment', 'intellectual_property', 'termination', 'liability'],
  privacy: ['data_use', 'confidentiality'],
  general: [],
}

// ─── Analysis helper functions ───

function detectClauseType(text: string): string {
  const scores: Record<string, number> = {}
  for (const [ctype, patterns] of Object.entries(CLAUSE_PATTERNS)) {
    const score = patterns.filter(p => p.test(text)).length
    if (score > 0) scores[ctype] = score
  }
  if (!Object.keys(scores).length) return 'general'
  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0]
}

function detectRedFlags(text: string): string[] {
  const flags: string[] = []
  for (const [pattern, desc] of RED_FLAG_PATTERNS) {
    if (pattern.test(text)) flags.push(desc)
  }
  // One-sidedness check
  const oblB = (text.match(/\b(?:you\s+(?:shall|must|agree|will)|employee\s+(?:shall|must))\b/gi) || []).length
  const oblA = (text.match(/\b(?:company\s+(?:shall|must|will)|we\s+(?:shall|must|will))\b/gi) || []).length
  if (oblB > 0 && oblA === 0) flags.push('One-sided obligations — only you have duties, the other party has none.')
  // Vagueness check
  const vague = (text.match(/\b(?:reasonable|appropriate|adequate|as\s+needed|from\s+time\s+to\s+time|may)\b/gi) || []).length
  if (vague >= 3) flags.push(`Excessive vague language (${vague} vague terms found) — this gives the other party room to interpret terms in their favour.`)
  return flags
}

function deepAnalyzeSentences(text: string) {
  const sentences = text.trim().split(/(?<=[.;])\s+/)
  const findings: { sentence: string; issues: { category: string; explanation: string; severity: string }[]; issue_count: number }[] = []
  for (const raw of sentences) {
    const s = raw.trim()
    if (s.length < 15) continue
    const issues: { category: string; explanation: string; severity: string }[] = []
    for (const [pattern, category, explanation] of DEEP_PATTERNS) {
      if (pattern.test(s)) issues.push({ category, explanation, severity: CATEGORY_SEVERITY[category] || 'Medium' })
    }
    if (issues.length) {
      findings.push({ sentence: s.length > 150 ? s.slice(0, 150) + '...' : s, issues, issue_count: issues.length })
    }
  }
  return findings
}

function checkValidity(clauseType: string, jurisdiction: string, totalFlags: number): [string, string] {
  const rules = JURISDICTION_RULES[jurisdiction] || {}
  const specificRule = rules[clauseType] || rules.unfair_terms || ''
  if (totalFlags >= 6) return ['Possibly unenforceable', specificRule]
  if (totalFlags >= 3) return ['Questionable', specificRule]
  return ['Likely enforceable', specificRule]
}

function filterRelevantImplications(clauseType: string, deepAnalysis: ReturnType<typeof deepAnalyzeSentences>): string[] {
  const all = HIDDEN_IMPLICATIONS[clauseType] || []
  const cats = new Set<string>()
  for (const f of deepAnalysis) for (const i of f.issues) cats.add(i.category)

  const deep: string[] = []
  if (cats.has('ESCAPE_HATCH')) deep.push("This clause contains escape hatches that allow the performing party to claim compliance even when they haven't delivered the expected result.")
  if (cats.has('VAGUE_STANDARD')) deep.push("Vague performance standards ('good faith', 'reasonable efforts') give the performing party significant room to underperform without consequence.")
  if (cats.has('BURDEN_SHIFT')) deep.push('The burden of proving non-compliance falls on you — and the tests used are subjective and hard to satisfy.')
  if (cats.has('INTERPRETATION_TRAP')) deep.push('Dispute resolution under this clause is deliberately ambiguous — outcomes will be unpredictable and expensive to litigate.')
  if (cats.has('ONE_SIDED')) deep.push('Protections in this clause apply asymmetrically — one party is shielded while the other bears the risk.')
  if (cats.has('SCOPE_CREEP')) deep.push("The scope of this clause is broader than it appears — 'any and all' or 'including but not limited to' language captures more than you might expect.")

  const combined = [...deep, ...all.slice(0, 2)]
  return combined.length ? combined : ['Review this clause carefully with a legal professional.']
}

function calculateRisk(redFlags: string[], validity: string, clauseType: string, contextType: string, deepAnalysis: ReturnType<typeof deepAnalyzeSentences>): [string, number] {
  let score = redFlags.length * 10
  for (const f of deepAnalysis) for (const i of f.issues) score += i.severity === 'High' ? 12 : 6
  if (validity === 'Possibly unenforceable') score += 20
  else if (validity === 'Questionable') score += 10
  if ((CONTEXT_RISK_BOOST[contextType] || []).includes(clauseType)) score += 15
  score = Math.min(score, 100)
  if (score >= 50) return ['High', Math.min(score + 5, 95)]
  if (score >= 25) return ['Medium', Math.min(score + 10, 85)]
  return ['Low', Math.max(score + 20, 40)]
}

function generatePlainEnglish(clauseType: string, deepAnalysis: ReturnType<typeof deepAnalyzeSentences>, redFlags: string[]): string {
  const base: Record<string, string> = {
    termination: 'This clause defines how and when the agreement can be ended.',
    liability: 'This clause limits or assigns responsibility for losses or damages.',
    payment: 'This clause covers payment terms, fees, or refund conditions.',
    non_compete: 'This clause restricts your ability to work for competitors or start a competing business.',
    confidentiality: 'This clause requires you to keep certain information secret.',
    data_use: 'This clause describes how your personal data will be collected, used, or shared.',
    intellectual_property: 'This clause determines who owns the work or ideas created under this agreement.',
    arbitration: 'This clause requires disputes to be resolved through arbitration instead of court.',
    force_majeure: 'This clause excuses performance when extraordinary events occur.',
    warranty: 'This clause defines guarantees (or lack thereof) about the product or service.',
    governing_law: "This clause specifies which jurisdiction's laws apply to the contract.",
    assignment: 'This clause covers whether rights under this contract can be transferred to someone else.',
    performance: 'This clause defines what counts as fulfilling an obligation under the agreement.',
  }
  let text = base[clauseType] || 'This clause sets out specific terms of the agreement.'
  if (deepAnalysis.length) {
    const total = deepAnalysis.reduce((s, f) => s + f.issue_count, 0)
    const high = deepAnalysis.reduce((s, f) => s + f.issues.filter(i => i.severity === 'High').length, 0)
    text += ` Deep analysis found ${total} issue(s) across ${deepAnalysis.length} sentence(s)`
    text += high > 0 ? `, including ${high} high-severity concern(s).` : '.'
  } else if (redFlags.length) {
    text += ` ${redFlags.length} potential issue(s) were detected.`
  }
  return text
}

function generateFix(redFlags: string[], deepAnalysis: ReturnType<typeof deepAnalyzeSentences>): string {
  const fixes: string[] = []
  if (redFlags.some(f => f.includes('sole discretion'))) fixes.push("Replace 'sole discretion' with 'mutual agreement' or 'reasonable discretion with written notice'.")
  if (redFlags.some(f => f.toLowerCase().includes('without notice'))) fixes.push('Add a minimum notice period (e.g., 30 days written notice).')
  if (redFlags.some(f => f.toLowerCase().includes('irrevocab'))) fixes.push('Add a revocation mechanism with reasonable conditions.')
  if (redFlags.some(f => f.toLowerCase().includes('waiv'))) fixes.push('Remove or limit the waiver — preserve your right to legal remedies.')
  if (redFlags.some(f => f.toLowerCase().includes('non-refundable'))) fixes.push('Negotiate a partial refund clause or pro-rata refund based on services delivered.')
  if (redFlags.some(f => f.toLowerCase().includes('perpetual') || f.toLowerCase().includes('forever'))) fixes.push('Add a reasonable time limit (e.g., 2-3 years) with option to renew.')
  if (redFlags.some(f => f.toLowerCase().includes('auto') && f.toLowerCase().includes('renew'))) fixes.push('Add a clear opt-out mechanism with advance notice before auto-renewal.')
  if (redFlags.some(f => f.toLowerCase().includes('ip') || f.toLowerCase().includes('intellectual'))) fixes.push('Retain ownership of pre-existing IP. Limit assignment to work created specifically under this contract.')
  if (redFlags.some(f => f.toLowerCase().includes('arbitration'))) fixes.push('Negotiate the right to choose the arbitration venue, or add a small claims court exception.')
  if (redFlags.some(f => f.toLowerCase().includes('one-sided'))) fixes.push('Add mutual obligations — both parties should have equivalent duties and rights.')

  const cats = new Set<string>()
  for (const f of deepAnalysis) for (const i of f.issues) cats.add(i.category)
  if (cats.has('VAGUE_STANDARD')) fixes.push("Replace vague standards ('good faith', 'commercially reasonable') with specific, measurable performance criteria and deadlines.")
  if (cats.has('ESCAPE_HATCH')) fixes.push("Remove 'deemed to have fulfilled' language. Require actual delivery of the intended outcome, not just effort. Lower the negligence threshold from 'gross negligence' to 'ordinary negligence'.")
  if (cats.has('BURDEN_SHIFT')) fixes.push("Clarify who bears the burden of proof. Replace subjective tests ('information available at the time') with objective, documented standards.")
  if (cats.has('INTERPRETATION_TRAP')) fixes.push("Remove 'subjective intent' as a factor. Use only objective, measurable standards for dispute resolution.")
  if (cats.has('SCOPE_CREEP')) fixes.push("Replace 'any and all' with specific, enumerated items. Remove 'including but not limited to' and list exact scope.")
  if (cats.has('REMEDY_LIMIT')) fixes.push("Negotiate a higher liability cap or remove 'sole remedy' language to preserve your right to full compensation.")

  if (!fixes.length) fixes.push('This clause appears relatively standard. Consider having a lawyer review the full contract for context.')
  return fixes.join(' ')
}

function whyThisMatters(clauseType: string, riskLevel: string): string {
  const matters: Record<string, string> = {
    termination: "If this clause is unfair, you could be locked into a contract you can't exit, or terminated without warning.",
    liability: 'A bad liability clause means you could end up paying for damages that aren\'t your fault.',
    payment: 'Unfair payment terms can leave you out of pocket with no recourse.',
    non_compete: 'An overly broad non-compete can prevent you from earning a living in your field.',
    confidentiality: 'One-sided confidentiality can restrict your future career while the other party faces no such limits.',
    data_use: 'Broad data clauses can mean your personal information is sold, shared, or used in ways you never intended.',
    intellectual_property: 'You could lose ownership of work you created — including the right to use it in your own portfolio.',
    arbitration: 'You give up your right to go to court. Arbitration can be expensive and the process favours repeat players (companies).',
  }
  let text = matters[clauseType] || 'This clause affects your rights and obligations under the contract.'
  if (riskLevel === 'High') text += ' Given the high risk level, you should NOT sign this without modification or legal advice.'
  return text
}

function brutalHonesty(clauseType: string, riskLevel: string, redFlags: string[], deepAnalysis: ReturnType<typeof deepAnalyzeSentences>): string {
  const opener = riskLevel === 'High' ? 'This clause is a problem.' : riskLevel === 'Medium' ? 'This clause needs attention.' : 'This clause is mostly fine.'
  if (!redFlags.length && !deepAnalysis.length) return `${opener} No major red flags detected, but always read the full contract.`

  const parts = [opener]
  if (deepAnalysis.length) {
    const total = deepAnalysis.reduce((s, f) => s + f.issue_count, 0)
    const high = deepAnalysis.reduce((s, f) => s + f.issues.filter(i => i.severity === 'High').length, 0)
    parts.push(`Line-by-line analysis found ${total} issues (${high} high-severity).`)
    const cats = new Set<string>()
    for (const f of deepAnalysis) for (const i of f.issues) cats.add(i.category)
    if (cats.has('ESCAPE_HATCH')) parts.push("It contains escape hatches — the other party can fail to deliver and still claim they fulfilled their obligation.")
    if (cats.has('VAGUE_STANDARD')) parts.push("Performance standards are deliberately vague — 'good faith' and 'reasonable efforts' mean whatever the other party wants them to mean.")
    if (cats.has('INTERPRETATION_TRAP')) parts.push('Dispute resolution is a trap — mixing subjective and objective standards makes outcomes unpredictable and expensive.')
    if (cats.has('BURDEN_SHIFT')) parts.push('The burden of proof is on you, and the tests are designed to be nearly impossible to satisfy.')
  } else if (redFlags.length) {
    parts.push(`Issues found: ${redFlags.slice(0, 3).map(f => `• ${f}`).join(' ')}`)
  }
  return parts.join(' ')
}

// ─── Main POST handler ───

export async function POST(req: NextRequest) {
  try {
    const { clause_text, jurisdiction = 'india', context_type = 'general' } = await req.json()
    if (!clause_text || clause_text.trim().length < 10) {
      return NextResponse.json({ error: 'Clause text is too short to analyze.' }, { status: 400 })
    }

    const textLower = clause_text.toLowerCase().trim()
    const clauseType = detectClauseType(textLower)
    const redFlags = detectRedFlags(textLower)
    const deepAnalysis = deepAnalyzeSentences(clause_text)

    const deepRedFlags = deepAnalysis.flatMap(f => f.issues.map(i => i.explanation))
    const allFlags = [...redFlags, ...deepRedFlags.filter(f => !redFlags.includes(f))]

    const [legalValidity, validityNotes] = checkValidity(clauseType, jurisdiction, allFlags.length)
    const relevantImplications = filterRelevantImplications(clauseType, deepAnalysis)
    const [riskLevel, confidence] = calculateRisk(allFlags, legalValidity, clauseType, context_type, deepAnalysis)
    const plainEnglish = generatePlainEnglish(clauseType, deepAnalysis, allFlags)
    const suggestedFix = generateFix(allFlags, deepAnalysis)
    const why = whyThisMatters(clauseType, riskLevel)
    const brutal = brutalHonesty(clauseType, riskLevel, allFlags, deepAnalysis)

    const formattedDeep = deepAnalysis.map(f => ({
      sentence: f.sentence,
      issues: f.issues.map(i => ({ category: CATEGORY_LABEL[i.category] || '⚠️ Issue', explanation: i.explanation, severity: i.severity })),
    }))

    return NextResponse.json({
      clause_type: clauseType.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      plain_english: plainEnglish,
      risk_level: riskLevel,
      red_flags: allFlags,
      deep_analysis: formattedDeep,
      hidden_implications: relevantImplications,
      legal_validity: legalValidity,
      validity_notes: validityNotes,
      why_this_matters: why,
      suggested_fix: suggestedFix,
      confidence,
      tone_mode: { normal: plainEnglish, brutal_honesty: brutal },
      disclaimer: DISCLAIMER,
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
