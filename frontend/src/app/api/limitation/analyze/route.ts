import { NextRequest, NextResponse } from 'next/server'

interface LimitRule {
  id: string; category: string; subcategory: string; case_type: string
  period_years: number; period_days: number; starting_point: string
  governing_law: string; accrual_rule: string; extensions: string[]
  key_precedents: string[]; condonation: string; notes: string; jurisdiction: string
}

const RULES: LimitRule[] = [
  // India
  { id:'IN-CIV-01', category:'Civil', subcategory:'Contract', case_type:'Suit for breach of contract', period_years:3, period_days:0, starting_point:'Date of breach', governing_law:'Limitation Act 1963, Article 55', accrual_rule:'Limitation begins from the date the breach occurs.', extensions:['Section 5: Court may condone delay','Section 14: Time in bona fide proceedings excluded','Section 18: Written acknowledgment restarts limitation'], key_precedents:['State of MP v Bherulal (2020)','Balakrishna v Shrinivas (1959) AIR SC 798'], condonation:'Section 5 applies to appeals/applications, NOT to original suits.', notes:'', jurisdiction:'india' },
  { id:'IN-CIV-02', category:'Civil', subcategory:'Contract', case_type:'Suit for specific performance of contract', period_years:3, period_days:0, starting_point:'Date fixed for performance', governing_law:'Limitation Act 1963, Article 54', accrual_rule:'From date fixed for performance, or when refusal is known.', extensions:['Section 14: Exclusion of bona fide proceedings','Section 18: Acknowledgment restarts'], key_precedents:['Saradamani Kandappan v Rajalakshmi (2011) 12 SCC 18'], condonation:'No condonation under Section 5 for suits.', notes:'Specific performance is discretionary.', jurisdiction:'india' },
  { id:'IN-CIV-03', category:'Civil', subcategory:'Tort', case_type:'Suit for compensation for tort/negligence', period_years:3, period_days:0, starting_point:'Date of tortious act or damage', governing_law:'Limitation Act 1963, Article 72-73', accrual_rule:'From date of wrongful act. Continuing torts: each day is fresh cause.', extensions:['Section 6-8: Disability provisions','Section 14: Bona fide proceedings'], key_precedents:['MCD v Subhagwanti (1966) AIR SC 1750'], condonation:'Section 5 does not apply to suits.', notes:'Motor accident claims have separate limitation.', jurisdiction:'india' },
  { id:'IN-CIV-04', category:'Civil', subcategory:'Property', case_type:'Suit for possession of immovable property', period_years:12, period_days:0, starting_point:'Date of dispossession', governing_law:'Limitation Act 1963, Article 65', accrual_rule:'12 years from dispossession. After 12 years, adverse possession applies.', extensions:['Section 6-8: Disability','Section 27: Right extinguished after limitation'], key_precedents:['Hemaji Waghaji v Bhikhabhai (2009) 16 SCC 517'], condonation:'No condonation. Right extinguished under Section 27.', notes:'Government property: 30 years.', jurisdiction:'india' },
  { id:'IN-CIV-05', category:'Civil', subcategory:'Recovery', case_type:'Suit for recovery of money (debt/loan)', period_years:3, period_days:0, starting_point:'Date debt becomes due', governing_law:'Limitation Act 1963, Article 19-22', accrual_rule:'From date money becomes payable. Demand loans: from date of loan.', extensions:['Section 18: Written acknowledgment restarts','Section 19: Part payment restarts'], key_precedents:['Shapoor Freedom Mazda v Durga Prasad (2003) 4 SCC 619'], condonation:'No condonation for suits. Acknowledgment/part payment can restart.', notes:'', jurisdiction:'india' },
  { id:'IN-CRM-01', category:'Criminal', subcategory:'Complaint', case_type:'Criminal complaint — offence punishable up to 1 year', period_years:0, period_days:180, starting_point:'Date of offence', governing_law:'BNSS 2023, Section 468', accrual_rule:'6 months from date of offence.', extensions:['BNSS Section 470: Court may condone delay'], key_precedents:['Japani Sahoo v Chandra Sekhar Mohanty (2007) 7 SCC 394'], condonation:'Condonable under BNSS Section 470.', notes:'FIR-based cognizable offences have NO limitation.', jurisdiction:'india' },
  { id:'IN-CRM-02', category:'Criminal', subcategory:'Complaint', case_type:'Criminal complaint — offence punishable 1-3 years', period_years:1, period_days:0, starting_point:'Date of offence', governing_law:'BNSS 2023, Section 468', accrual_rule:'1 year from date of offence.', extensions:['BNSS Section 470: Condonation'], key_precedents:[], condonation:'Condonable.', notes:'Offences >3 years: NO limitation.', jurisdiction:'india' },
  { id:'IN-CRM-03', category:'Criminal', subcategory:'Cheque Bounce', case_type:'Cheque bounce complaint (NI Act Section 138)', period_years:0, period_days:30, starting_point:'Expiry of 15-day notice period after dishonour', governing_law:'NI Act 1881, Section 142(b)', accrual_rule:'30 days after cause of action (after 15-day notice expires).', extensions:['Section 142(b) proviso: Court may condone delay'], key_precedents:['Dashrath Rupsingh Rathod v State of Maharashtra (2014) 9 SCC 129'], condonation:'Condonable — court has discretion.', notes:'Strictest limitation in Indian law.', jurisdiction:'india' },
  { id:'IN-CRM-04', category:'Criminal', subcategory:'FIR', case_type:'FIR for cognizable offence (murder, robbery, rape, etc.)', period_years:0, period_days:0, starting_point:'No limitation', governing_law:'BNSS 2023; BNS 2023', accrual_rule:'No limitation for FIR. Delay is scrutinised for credibility.', extensions:[], key_precedents:['Thulia Kali v State of TN (1972) 3 SCC 393'], condonation:'Not applicable.', notes:'Delayed FIRs are scrutinised but not barred.', jurisdiction:'india' },
  { id:'IN-CON-01', category:'Consumer', subcategory:'Consumer Complaint', case_type:'Consumer complaint (Consumer Protection Act 2019)', period_years:2, period_days:0, starting_point:'Date of cause of action', governing_law:'Consumer Protection Act 2019, Section 69(1)', accrual_rule:'2 years from cause of action. Latent defects: from discovery.', extensions:['Section 69(2): Forum may condone delay'], key_precedents:['Kandimalla Raghavaiah v National Insurance (2009) 7 SCC 768'], condonation:'Condonable — wide discretion.', notes:'No court fee. E-filing available.', jurisdiction:'india' },
  { id:'IN-FAM-01', category:'Family', subcategory:'Divorce', case_type:'Divorce petition (Hindu Marriage Act)', period_years:0, period_days:0, starting_point:'No limitation — conditions apply', governing_law:'Hindu Marriage Act 1955, Sections 13-14', accrual_rule:'No limitation. Section 14 bars divorce within 1 year of marriage.', extensions:[], key_precedents:['Naveen Kohli v Neelu Kohli (2006) 4 SCC 558'], condonation:'Not applicable.', notes:'Mutual consent: 6-month cooling period.', jurisdiction:'india' },
  { id:'IN-MVA-01', category:'Motor Accident', subcategory:'Compensation', case_type:'Motor accident compensation claim', period_years:0, period_days:180, starting_point:'Date of accident', governing_law:'Motor Vehicles Act 1988, Section 166', accrual_rule:'6 months from accident. Tribunal may condone delay.', extensions:['Section 166(3): Tribunal may condone delay'], key_precedents:['Nagappa v Gurudayal Singh (2003) 2 SCC 274'], condonation:'Liberally condoned — victim-friendly.', notes:'No-fault liability for death/permanent disability.', jurisdiction:'india' },
  { id:'IN-ARB-01', category:'Arbitration', subcategory:'Challenge', case_type:'Challenge to arbitral award (Section 34)', period_years:0, period_days:90, starting_point:'Date of receipt of award', governing_law:'Arbitration Act 1996, Section 34(3)', accrual_rule:'3 months + 30 days max extension. After 120 days total: right EXTINGUISHED.', extensions:['30-day extension if sufficient cause — NO further extension'], key_precedents:['Union of India v Popular Construction (2001) 8 SCC 470'], condonation:'Only 30 days beyond 3 months. Section 5 does NOT apply.', notes:'Strictest limitation provision.', jurisdiction:'india' },
  // UK
  { id:'UK-CIV-01', category:'Civil', subcategory:'Contract', case_type:'Breach of contract (simple contract)', period_years:6, period_days:0, starting_point:'Date of breach', governing_law:'Limitation Act 1980, Section 5', accrual_rule:'6 years from breach. Contracts under deed: 12 years.', extensions:['Section 32: Fraud/concealment postpones limitation','Section 28: Disability'], key_precedents:['Pirelli v Oscar Faber [1983]'], condonation:'No general condonation. Strict.', notes:'Deed contracts: 12 years.', jurisdiction:'uk' },
  { id:'UK-CIV-02', category:'Civil', subcategory:'Tort', case_type:'Personal injury claim', period_years:3, period_days:0, starting_point:'Date of injury or knowledge', governing_law:'Limitation Act 1980, Section 11', accrual_rule:'3 years from injury OR date of knowledge (Section 14).', extensions:['Section 33: Court discretion to disapply','Section 28: Disability'], key_precedents:['A v Hoare [2008] UKHL 6'], condonation:'Section 33 gives wide discretion for PI cases.', notes:'Date of knowledge is crucial for clinical negligence.', jurisdiction:'uk' },
  { id:'UK-CIV-03', category:'Civil', subcategory:'Defamation', case_type:'Defamation claim', period_years:1, period_days:0, starting_point:'Date of publication', governing_law:'Limitation Act 1980, Section 4A', accrual_rule:'1 year from publication. Single publication rule applies online.', extensions:[], key_precedents:['Loutchansky v Times [2001]'], condonation:'Very limited.', notes:'Shortest limitation in UK law.', jurisdiction:'uk' },
  { id:'UK-CRM-01', category:'Criminal', subcategory:'Summary', case_type:'Summary offence prosecution', period_years:0, period_days:180, starting_point:'Date of offence', governing_law:'Magistrates Courts Act 1980, Section 127', accrual_rule:'6 months from offence for summary-only offences.', extensions:[], key_precedents:[], condonation:'No condonation. Absolute.', notes:'Indictable offences: no limitation.', jurisdiction:'uk' },
  { id:'UK-EMP-01', category:'Employment', subcategory:'Unfair Dismissal', case_type:'Unfair dismissal claim', period_years:0, period_days:90, starting_point:'Effective date of termination', governing_law:'Employment Rights Act 1996, Section 111', accrual_rule:'3 months minus 1 day from EDT. ACAS conciliation pauses clock.', extensions:['ACAS early conciliation pauses for up to 6 weeks'], key_precedents:['Palmer v Southend-on-Sea BC [1984]'], condonation:'Must show "not reasonably practicable" to file in time.', notes:'ACAS conciliation mandatory.', jurisdiction:'uk' },
  // US
  { id:'US-CIV-01', category:'Civil', subcategory:'Contract', case_type:'Breach of contract (written)', period_years:4, period_days:0, starting_point:'Date of breach', governing_law:'UCC § 2-725; State statutes (4-6 years)', accrual_rule:'Varies by state. UCC: 4 years for goods.', extensions:['Tolling for minority/incapacity','Discovery rule for fraud','Equitable tolling'], key_precedents:['Gabelli v SEC (2013)'], condonation:'No general condonation. Equitable tolling in limited cases.', notes:'CA: 4yr written, 2yr oral. NY: 6yr. TX: 4yr.', jurisdiction:'us' },
  { id:'US-CIV-02', category:'Civil', subcategory:'Tort', case_type:'Personal injury', period_years:2, period_days:0, starting_point:'Date of injury or discovery', governing_law:'State statutes (1-6 years, typically 2-3)', accrual_rule:'Most states: 2-3 years. Discovery rule for latent injuries.', extensions:['Tolling for minority','Discovery rule','Equitable tolling'], key_precedents:['Urie v Thompson (1949)'], condonation:'No condonation. Jurisdictional in some states.', notes:'CA: 2yr. NY: 3yr. TX: 2yr. FL: 4yr.', jurisdiction:'us' },
  { id:'US-CIV-03', category:'Civil', subcategory:'Employment', case_type:'Employment discrimination (Title VII)', period_years:0, period_days:180, starting_point:'Date of discriminatory act', governing_law:'Title VII, 42 U.S.C. § 2000e-5', accrual_rule:'180 days to EEOC (300 in deferral states). 90 days after right-to-sue.', extensions:['300 days in deferral states','Continuing violation doctrine'], key_precedents:['Ledbetter v Goodyear (2007)'], condonation:'Limited EEOC discretion.', notes:'Lilly Ledbetter Act resets clock per paycheck.', jurisdiction:'us' },
  { id:'US-CRM-01', category:'Criminal', subcategory:'Federal', case_type:'Federal crime (general)', period_years:5, period_days:0, starting_point:'Date of offence', governing_law:'18 U.S.C. § 3282', accrual_rule:'5 years from offence for most federal crimes.', extensions:['Tolling while defendant outside US'], key_precedents:['Toussie v US (1970)'], condonation:'No condonation. Constitutional protection.', notes:'Murder: no limitation. Tax: 6yr. Securities fraud: 5yr.', jurisdiction:'us' },
  { id:'US-CRM-02', category:'Criminal', subcategory:'Murder', case_type:'Murder / capital offence', period_years:0, period_days:0, starting_point:'No limitation', governing_law:'18 U.S.C. § 3281; State laws', accrual_rule:'No statute of limitations for murder in any US jurisdiction.', extensions:[], key_precedents:[], condonation:'Not applicable.', notes:'All 50 states: no limitation for murder.', jurisdiction:'us' },
]

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { case_type_query, jurisdiction, incident_date, description, has_disability, has_acknowledgment, apply_covid_extension } = body

  const incDate = new Date(incident_date)
  const today = new Date()
  if (isNaN(incDate.getTime())) return NextResponse.json({ error: 'Invalid date format.' })
  if (incDate > today) return NextResponse.json({ error: 'Incident date cannot be in the future.' })

  const query = (case_type_query + ' ' + (description || '')).toLowerCase()

  // Find matching rules
  const matches = RULES.filter(r => r.jurisdiction === jurisdiction).map(r => {
    let score = 0
    if (query.includes(r.case_type.toLowerCase())) score += 50
    if (r.category.toLowerCase().split(' ').some(w => query.includes(w))) score += 15
    if (r.subcategory.toLowerCase().split(' ').some(w => query.includes(w))) score += 20
    r.case_type.toLowerCase().split(' ').forEach(w => { if (w.length > 3 && query.includes(w)) score += 8 })
    return { ...r, _score: score }
  }).filter(r => r._score > 10).sort((a, b) => b._score - a._score).slice(0, 3)

  if (matches.length === 0) return NextResponse.json({ error: `No matching rules found for '${case_type_query}' in ${jurisdiction}.` })

  const analyses = matches.map(rule => {
    const periodDays = rule.period_years * 365 + rule.period_days
    if (periodDays === 0) {
      return { rule, has_limitation: false, deadline: null, days_remaining: null, status: 'No Limitation', urgency: 'None',
        explanation: `No statutory limitation for this case type. ${rule.accrual_rule}`, extensions_applied: [] as any[], timeline: [] as any[], condonation: rule.condonation, base_deadline: null, effective_deadline: null }
    }

    let baseDeadline = new Date(incDate.getTime() + periodDays * 86400000)
    let effectiveDeadline = new Date(baseDeadline)
    const extensionsApplied: any[] = []

    if (has_disability) {
      const ext = 365
      effectiveDeadline = new Date(effectiveDeadline.getTime() + ext * 86400000)
      extensionsApplied.push({ type: `Disability (${jurisdiction === 'india' ? 'Limitation Act S.6-8' : jurisdiction === 'uk' ? 'Limitation Act 1980 S.28' : 'State tolling'})`, days_added: ext, explanation: 'Limitation postponed during disability (minority/incapacity).' })
    }

    if (has_acknowledgment && jurisdiction === 'india') {
      effectiveDeadline = new Date(today.getTime() + periodDays * 86400000)
      extensionsApplied.push({ type: 'Acknowledgment (Limitation Act S.18)', days_added: periodDays, explanation: 'Written acknowledgment restarts the full limitation period.' })
    }

    if (apply_covid_extension && jurisdiction === 'india') {
      const covidDays = 714
      effectiveDeadline = new Date(effectiveDeadline.getTime() + covidDays * 86400000)
      extensionsApplied.push({ type: 'COVID-19 Extension (SC Suo Motu Order)', days_added: covidDays, explanation: 'Supreme Court extended all limitation periods from 15.03.2020 to 28.02.2022.', precedent: 'In Re: Cognizance for Extension of Limitation (2020)' })
    }

    const daysRemaining = Math.floor((effectiveDeadline.getTime() - today.getTime()) / 86400000)
    const fmt = (d: Date) => d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

    let urgency: string, status: string
    if (daysRemaining < 0) { urgency = 'EXPIRED'; status = 'Limitation Period Expired' }
    else if (daysRemaining <= 7) { urgency = 'CRITICAL'; status = 'Expires This Week' }
    else if (daysRemaining <= 30) { urgency = 'URGENT'; status = 'Expires Within 30 Days' }
    else if (daysRemaining <= 90) { urgency = 'WARNING'; status = 'Expires Within 3 Months' }
    else if (daysRemaining <= 180) { urgency = 'CAUTION'; status = 'Expires Within 6 Months' }
    else { urgency = 'SAFE'; status = 'Within Limitation Period' }

    const timeline = [
      { date: fmt(incDate), event: 'Incident / Cause of Action', type: 'start' },
      { date: fmt(baseDeadline), event: `Base Deadline (${rule.period_years}y ${rule.period_days}d)`, type: 'deadline' },
      ...extensionsApplied.map(e => ({ date: '', event: `Extension: ${e.type} (+${e.days_added}d)`, type: 'extension' })),
      { date: fmt(effectiveDeadline), event: 'Effective Deadline', type: 'final' },
      { date: fmt(today), event: `Today — ${Math.abs(daysRemaining)} days ${daysRemaining >= 0 ? 'remaining' : 'overdue'}`, type: 'today' },
    ]

    return { rule, has_limitation: true, base_deadline: fmt(baseDeadline), effective_deadline: fmt(effectiveDeadline),
      days_remaining: daysRemaining, status, urgency, explanation: `Limitation: ${rule.period_years}y ${rule.period_days}d under ${rule.governing_law}. ${rule.accrual_rule}`,
      extensions_applied: extensionsApplied, timeline, condonation: rule.condonation }
  })

  const primary = analyses[0]
  const forumMap: Record<string, Record<string, string>> = {
    india: { Civil: 'District Court / High Court', Criminal: 'Magistrate / Sessions Court. FIR at police station.', Consumer: 'District Forum (up to ₹1cr), State Commission (₹1-10cr), National Commission (>₹10cr)', Family: 'Family Court', 'Motor Accident': 'MACT', Arbitration: 'Court with jurisdiction (S.34)', Constitutional: 'High Court (Art.226) / Supreme Court (Art.32)' },
    uk: { Civil: 'County Court (<£100k) / High Court (>£100k)', Criminal: 'Magistrates / Crown Court', Employment: 'Employment Tribunal (ACAS mandatory)' },
    us: { Civil: 'State court / Federal court (diversity >$75k)', Criminal: 'State / Federal court' },
  }
  const forum = forumMap[jurisdiction]?.[primary.rule.category] || 'Consult a lawyer for appropriate forum.'

  const conflictMap: Record<string, string> = {
    india: 'Limitation governed by lex fori (forum court law). For international contracts, governing law clause determines limitation regime.',
    uk: 'Foreign Limitation Periods Act 1984 applies the limitation of the country whose law governs the claim.',
    us: 'State-specific. Borrowing statute may apply shorter limitation of state where cause arose.',
  }

  return NextResponse.json({
    primary_analysis: primary, alternative_analyses: analyses.slice(1),
    jurisdiction_info: { jurisdiction, appropriate_forum: forum, filing_requirements: jurisdiction === 'india' ? ['Court fee','Plaint/complaint','Vakalatnama','Document copies','Verification affidavit'] : jurisdiction === 'uk' ? ['Claim form (N1)','Particulars of claim','Court fee','Statement of truth'] : ['Complaint','Filing fee','Summons','Civil cover sheet'] },
    conflict_of_laws: conflictMap[jurisdiction] || '',
    methodology: 'Statutory period calculation with accrual date, disability tolling, acknowledgment restart (India S.18), COVID extension overlay, and urgency classification.',
    disclaimer: 'For educational purposes only. Limitation periods are complex and fact-specific. Consult a qualified advocate.',
  })
}
