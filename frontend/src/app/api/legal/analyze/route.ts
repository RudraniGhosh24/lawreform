import { NextRequest, NextResponse } from 'next/server'

// ─── Situation Advisor — Rule-based legal analysis engine ───
// Ports: legal_engine.py + tort_rules.py + criminal_rules.py + family_rules.py + contract_rules.py

const DISCLAIMER =
  'This analysis is for educational purposes only and does not constitute legal advice. ' +
  'Laws vary and change. Consult a qualified legal professional for your specific situation.'

// ═══════════════════════════════════════════════════════════
// TORT RULES
// ═══════════════════════════════════════════════════════════

const TORT_LIMITATION: Record<string, Record<string, boolean>> = {
  india: { 'Less than 6 months': true, '6 months – 1 year': true, '1–3 years': true, 'More than 3 years': false },
  uk: { 'Less than 6 months': true, '6 months – 1 year': true, '1–3 years': true, 'More than 3 years': false },
  us: { 'Less than 6 months': true, '6 months – 1 year': true, '1–3 years': true, 'More than 3 years': false },
}

const TORT_JURISDICTION_NOTES: Record<string, string> = {
  india: 'Under Indian tort law (largely common law), you must establish duty, breach, causation, and damage. The Limitation Act 1963 generally allows 3 years for tort claims.',
  uk: 'UK tort law is primarily common law. The Limitation Act 1980 sets a 6-year limit for most torts, 3 years for personal injury. Contributory negligence reduces damages under the Law Reform (Contributory Negligence) Act 1945.',
  us: 'US tort law varies by state. Statutes of limitation range from 1–6 years. Comparative negligence rules differ — some states use pure comparative, others modified (51% bar rule).',
}

const TORT_LAWS: Record<string, Record<string, string[]>> = {
  india: {
    Negligence: ['Indian Contract Act 1872 (duty of care)', 'Limitation Act 1963', 'Motor Vehicles Act 1988 (road accidents)', 'Consumer Protection Act 2019'],
    'Defamation / Libel / Slander': ['BNS Section 356 (Defamation)', 'IT Act 2000 Section 66A (online)', 'Limitation Act 1963'],
    Nuisance: ['BNS Section 292 (Public Nuisance)', 'BNSS Section 172', 'Environment Protection Act 1986'],
    Trespass: ['BNS Section 329-334 (Criminal Trespass)', 'Specific Relief Act 1963'],
    'Product liability': ['Consumer Protection Act 2019', 'Sale of Goods Act 1930'],
    "Occupier's liability": ["Occupier's Liability (common law)", 'Factories Act 1948'],
    'Not sure': ['Indian Tort Law (Common Law)', 'Limitation Act 1963'],
  },
  uk: {
    Negligence: ['Donoghue v Stevenson [1932]', "Occupiers' Liability Act 1957/1984", 'Limitation Act 1980'],
    'Defamation / Libel / Slander': ['Defamation Act 2013', 'Limitation Act 1980'],
    Nuisance: ['Environmental Protection Act 1990', 'Noise Act 1996'],
    Trespass: ['Trespass to Land (Common Law)', 'Criminal Justice Act 1994'],
    'Product liability': ['Consumer Protection Act 1987', 'Sale of Goods Act 1979'],
    "Occupier's liability": ["Occupiers' Liability Act 1957", "Occupiers' Liability Act 1984"],
    'Not sure': ['Tort Law (Common Law)', 'Limitation Act 1980'],
  },
  us: {
    Negligence: ['Restatement (Second) of Torts', 'State Negligence Statutes', 'Good Samaritan Laws'],
    'Defamation / Libel / Slander': ['First Amendment considerations', 'State Defamation Laws', 'SPEECH Act'],
    Nuisance: ['Restatement (Second) of Torts §821', 'State Nuisance Statutes'],
    Trespass: ['Restatement (Second) of Torts §158', 'State Trespass Laws'],
    'Product liability': ['Restatement (Third) of Torts: Products Liability', 'State Product Liability Acts'],
    "Occupier's liability": ['Restatement (Second) of Torts §343', 'State Premises Liability Laws'],
    'Not sure': ['State Tort Law', 'Restatement of Torts'],
  },
}

function analyzeTort(jurisdiction: string, answers: Record<string, any>) {
  const role = answers.role || ''
  const duty = !!answers.duty_existed
  const breach = !!answers.breach
  const causation = !!answers.causation
  const contributory = !!answers.contributory
  const harmType = answers.harm_type || ''
  const category = answers.harm_category || 'Not sure'
  const timeSince = answers.time_since || 'Less than 6 months'
  const evidence = !!answers.evidence

  const elementsMet = [duty, breach, causation, !!harmType].filter(Boolean).length
  const limitationOk = TORT_LIMITATION[jurisdiction]?.[timeSince] ?? true

  let classification: string
  let risk: string

  if (category === 'Negligence' || category === 'Not sure') {
    if (elementsMet === 4) { classification = 'Potential Negligence Claim — All Elements Present'; risk = 'High' }
    else if (elementsMet >= 2) { classification = 'Possible Negligence — Some Elements Established'; risk = 'Medium' }
    else { classification = 'Weak Negligence Claim — Key Elements Missing'; risk = 'Low' }
  } else if (category === 'Defamation / Libel / Slander') { classification = 'Potential Defamation Claim'; risk = 'Medium' }
  else if (category === 'Nuisance') { classification = 'Potential Nuisance Claim'; risk = 'Medium' }
  else if (category === 'Product liability') { classification = 'Potential Product Liability Claim'; risk = 'High' }
  else { classification = `Potential ${category} Claim`; risk = 'Medium' }

  if (!limitationOk) { classification += ' — LIMITATION PERIOD MAY HAVE EXPIRED'; risk = 'Low' }
  if (contributory && role === 'Claimant (victim)') classification += ' (Contributory Negligence May Reduce Damages)'

  let immediate_actions: string[], rights: string[], liabilities: string[], next_steps: string[]

  if (role === 'Claimant (victim)') {
    immediate_actions = [
      'Document all evidence immediately — photos, videos, witness details',
      'Seek medical attention if physically injured and obtain medical records',
      'Do not discuss the incident on social media',
      'Preserve all communications related to the incident',
      'Note the date, time, location, and all parties involved',
    ]
    rights = [
      'Right to seek compensation for proven damages',
      'Right to legal representation',
      'Right to file a civil suit within the limitation period',
      'Right to seek interim injunction if ongoing harm',
    ]
    liabilities = [
      'If contributory negligence is proven, damages may be reduced',
      'Costs may be awarded against you if the claim fails',
    ]
    next_steps = [
      'Consult a tort/civil lawyer within the limitation period',
      'Send a legal notice to the defendant before filing suit',
      'Gather and preserve all evidence',
      'Obtain expert reports if technical negligence is involved',
      'Consider mediation before litigation to save costs',
    ]
  } else {
    immediate_actions = [
      'Do not admit liability verbally or in writing',
      'Notify your insurer immediately',
      'Preserve all evidence and records',
      'Consult a defence lawyer immediately',
    ]
    rights = [
      'Right to legal representation',
      'Right to contest the claim',
      'Right to raise contributory negligence as a defence',
      'Right to challenge causation',
    ]
    liabilities = [
      'Potential liability for damages if negligence is proven',
      'Court costs if the claim succeeds',
      'Injunction to stop ongoing harmful conduct',
    ]
    next_steps = [
      'Engage a defence lawyer immediately',
      'Gather evidence to challenge the claimant\'s case',
      'Review your insurance coverage',
      'Consider settlement negotiations to avoid litigation costs',
    ]
  }

  if (!evidence) next_steps.unshift('Urgently gather evidence — lack of evidence significantly weakens any claim')

  const laws = TORT_LAWS[jurisdiction]?.[category] || TORT_LAWS[jurisdiction]?.['Not sure'] || []
  const limitNote = !limitationOk ? ' The limitation period may have expired — urgent legal advice is needed.' : ''
  const elemNote = elementsMet === 4 ? 'All four elements of negligence appear to be present.' : 'Not all elements of negligence are clearly established.'

  return {
    classification, risk_level: risk, immediate_actions, rights, liabilities, applicable_laws: laws,
    jurisdiction_notes: TORT_JURISDICTION_NOTES[jurisdiction] || '',
    recommended_next_steps: next_steps,
    summary: `Based on your inputs, this appears to be a ${category.toLowerCase()} matter under ${jurisdiction.toUpperCase()} tort law. ${elemNote}${limitNote}`,
  }
}

// ═══════════════════════════════════════════════════════════
// CRIMINAL RULES
// ═══════════════════════════════════════════════════════════

const CRIMINAL_JURISDICTION_NOTES: Record<string, string> = {
  india: 'Indian criminal law is governed by the Bharatiya Nyaya Sanhita (BNS) 2023, Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023, and Bharatiya Sakshya Adhiniyam (BSA) 2023 — which replaced the IPC, CrPC, and Indian Evidence Act respectively from July 1, 2024. FIR must be filed at the nearest police station. Bail rights depend on whether the offence is bailable or non-bailable under BNSS.',
  uk: 'UK criminal law is governed by common law and statutes including the Theft Act 1968, Sexual Offences Act 2003, and Serious Crime Act 2015. Police must caution suspects before questioning. Legal aid is available.',
  us: 'US criminal law varies by state. Federal crimes are prosecuted under the US Code. Miranda rights must be read upon arrest. The 4th, 5th, and 6th Amendments protect suspects. Public defenders are available for those who cannot afford counsel.',
}

const OFFENCE_LAWS: Record<string, Record<string, string[]>> = {
  india: {
    'Assault / Battery': ['BNS Section 130 (Assault)', 'BNS Section 131 (Criminal Force)', 'BNS Section 115-117 (Voluntarily Causing Hurt)'],
    'Theft / Robbery': ['BNS Section 303 (Theft)', 'BNS Section 309 (Robbery)', 'BNS Section 310 (Punishment for Robbery)'],
    'Fraud / Cheating': ['BNS Section 318 (Cheating)', 'BNS Section 316 (Cheating definition)', 'IT Act 2000 Section 66C/66D'],
    'Sexual offence': ['BNS Section 63-64 (Rape)', 'POCSO Act 2012', 'BNS Section 74 (Assault on Woman with Intent to Outrage Modesty)'],
    'Murder / Culpable homicide': ['BNS Section 101 (Murder)', 'BNS Section 105 (Culpable Homicide)', 'BNS Section 100 (Definition of Murder)'],
    'Drug offence': ['NDPS Act 1985', 'BNS Section 123 (Administering Stupefying Drug)'],
    Cybercrime: ['IT Act 2000 Section 66', 'BNS Section 318 (Cheating)', 'IT Act Section 43'],
    'Domestic violence': ['Protection of Women from DV Act 2005', 'BNS Section 85 (Cruelty by Husband/Relatives)'],
    Other: ['Bharatiya Nyaya Sanhita (BNS) 2023', 'Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023'],
  },
  uk: {
    'Assault / Battery': ['Offences Against the Person Act 1861', 'Criminal Justice Act 1988 s.39'],
    'Theft / Robbery': ['Theft Act 1968', 'Robbery Act 1968 s.8'],
    'Fraud / Cheating': ['Fraud Act 2006', 'Computer Misuse Act 1990'],
    'Sexual offence': ['Sexual Offences Act 2003', 'Protection of Children Act 1978'],
    'Murder / Culpable homicide': ['Homicide Act 1957', 'Murder (Abolition of Death Penalty) Act 1965'],
    'Drug offence': ['Misuse of Drugs Act 1971', 'Drug Trafficking Act 1994'],
    Cybercrime: ['Computer Misuse Act 1990', 'Fraud Act 2006'],
    'Domestic violence': ['Domestic Abuse Act 2021', 'Family Law Act 1996'],
    Other: ['Criminal Law (Common Law)', 'Serious Crime Act 2015'],
  },
  us: {
    'Assault / Battery': ['18 U.S.C. § 113 (Federal Assault)', 'State Assault Statutes'],
    'Theft / Robbery': ['18 U.S.C. § 2111 (Robbery)', 'State Theft Statutes'],
    'Fraud / Cheating': ['18 U.S.C. § 1341 (Mail Fraud)', '18 U.S.C. § 1343 (Wire Fraud)', 'State Fraud Laws'],
    'Sexual offence': ['18 U.S.C. § 2241 (Aggravated Sexual Abuse)', 'State Sexual Assault Laws', 'VAWA'],
    'Murder / Culpable homicide': ['18 U.S.C. § 1111 (Federal Murder)', 'State Homicide Statutes'],
    'Drug offence': ['Controlled Substances Act 21 U.S.C. § 841', 'State Drug Laws'],
    Cybercrime: ['Computer Fraud and Abuse Act 18 U.S.C. § 1030', 'State Cybercrime Laws'],
    'Domestic violence': ['Violence Against Women Act (VAWA)', 'State DV Statutes'],
    Other: ['Federal Criminal Code', 'State Penal Code'],
  },
}

const SENTENCES: Record<string, Record<string, string>> = {
  india: {
    'Murder / Culpable homicide': 'Life imprisonment or death penalty (BNS Section 101)',
    'Sexual offence': '10 years to life imprisonment (BNS Section 64)',
    'Assault / Battery': 'Up to 2 years (BNS Section 131)',
    'Theft / Robbery': 'Up to 10 years for robbery (BNS Section 310)',
    'Fraud / Cheating': 'Up to 7 years (BNS Section 318)',
  },
  uk: {
    'Murder / Culpable homicide': 'Mandatory life sentence',
    'Sexual offence': 'Up to life imprisonment (SOA 2003)',
    'Assault / Battery': 'Up to 6 months (common assault) to 5 years (GBH)',
    'Theft / Robbery': 'Up to 7 years (Theft Act 1968)',
    'Fraud / Cheating': 'Up to 10 years (Fraud Act 2006)',
  },
  us: {
    'Murder / Culpable homicide': 'Life imprisonment or death penalty (varies by state)',
    'Sexual offence': 'Varies by state — typically 5 years to life',
    'Assault / Battery': 'Varies — misdemeanor to felony',
    'Theft / Robbery': 'Up to 20 years federal (18 U.S.C. § 2111)',
    'Fraud / Cheating': 'Up to 20 years (wire/mail fraud)',
  },
}

function analyzeCriminal(jurisdiction: string, answers: Record<string, any>) {
  const role = answers.role || ''
  const offence = answers.offence_type || 'Other'
  const reported = !!answers.reported
  const inCustody = !!answers.in_custody
  const evidence = !!answers.evidence
  const witnesses = !!answers.witnesses
  const timeSince = answers.time_since || 'Within 24 hours'
  const selfDefence = !!answers.self_defence

  const isVictim = ['Victim', 'Family of victim'].includes(role)
  const highRisk = ['Murder / Culpable homicide', 'Sexual offence', 'Domestic violence']
  const medRisk = ['Assault / Battery', 'Robbery', 'Fraud / Cheating']

  let risk: string
  if (highRisk.includes(offence)) risk = 'Critical'
  else if (medRisk.includes(offence)) risk = 'High'
  else risk = 'Medium'
  if (!isVictim && inCustody) risk = 'Critical'

  const classification = `${offence} — ${isVictim ? 'Victim' : 'Accused'} Perspective`
  let immediate_actions: string[], rights: string[], liabilities: string[], next_steps: string[]

  if (isVictim) {
    immediate_actions = [
      'Ensure your immediate safety — move to a safe location if needed',
      'Call emergency services (100 in India / 999 in UK / 911 in US) if in immediate danger',
      'Do NOT clean up or disturb the scene — preserve evidence',
      'Seek medical attention if injured and request a medico-legal certificate',
      jurisdiction === 'india' ? 'File an FIR at the nearest police station immediately' : 'Report to police and request a crime reference number',
      'Write down everything you remember while it is fresh',
    ]
    rights = [
      'Right to file a complaint / FIR without delay',
      'Right to free legal aid if you cannot afford a lawyer',
      'Right to medical examination',
      'Right to be informed of the progress of the investigation',
      'Right to protection from the accused during proceedings',
      'Right to compensation under victim compensation schemes',
    ]
    liabilities = ['Filing a false complaint is itself a criminal offence', 'Tampering with evidence can harm your case']
    next_steps = [
      'File a formal complaint with police immediately',
      'Obtain a copy of the FIR / crime report',
      'Consult a criminal lawyer for guidance on the process',
      'Keep all evidence safe — do not share on social media',
      'Apply for victim protection order if threatened',
    ]
    if (!reported) next_steps.unshift('Report to police immediately — delay can affect the investigation')
    if (timeSince === 'Within 24 hours') next_steps.unshift('Act now — the first 24 hours are critical for evidence preservation')
  } else {
    immediate_actions = [
      'Do NOT make any statements to police without a lawyer present',
      'Exercise your right to remain silent',
      'Contact a criminal defence lawyer immediately',
      'Do not destroy or tamper with any evidence',
      'Do not contact the complainant or witnesses',
    ]
    rights = [
      'Right to remain silent (cannot be compelled to self-incriminate)',
      'Right to legal representation',
      'Right to know the charges against you',
      'Right to bail (for bailable offences)',
      'Right to a fair trial',
      'Right to free legal aid if you cannot afford a lawyer',
    ]
    const sentence = SENTENCES[jurisdiction]?.[offence] || 'Varies — consult a lawyer'
    liabilities = [
      `Potential imprisonment if convicted: ${sentence}`,
      'Criminal record affecting employment and travel',
      'Compensation orders to the victim',
    ]
    next_steps = [
      'Engage a criminal defence lawyer immediately',
      'Do not speak to police without your lawyer',
      'Apply for bail if arrested',
      'Gather alibi evidence and witness statements',
      'Review all evidence the prosecution intends to use',
    ]
    if (selfDefence) next_steps.splice(1, 0, 'Document your self-defence claim thoroughly — this is a valid legal defence')
  }

  const laws = OFFENCE_LAWS[jurisdiction]?.[offence] || OFFENCE_LAWS[jurisdiction]?.Other || []
  const evNote = evidence && witnesses ? 'Evidence and witnesses strengthen the case.' : 'Lack of evidence or witnesses may affect the outcome.'

  return {
    classification, risk_level: risk, immediate_actions, rights, liabilities, applicable_laws: laws,
    jurisdiction_notes: CRIMINAL_JURISDICTION_NOTES[jurisdiction] || '',
    recommended_next_steps: next_steps,
    summary: `This involves a ${offence.toLowerCase()} matter under ${jurisdiction.toUpperCase()} criminal law from the perspective of the ${role.toLowerCase()}. ${evNote}`,
  }
}

// ═══════════════════════════════════════════════════════════
// FAMILY RULES
// ═══════════════════════════════════════════════════════════

const FAMILY_JURISDICTION_NOTES: Record<string, string> = {
  india: 'Indian family law varies by religion. Hindu families are governed by the Hindu Marriage Act 1955. Muslims by Muslim Personal Law. Christians by the Indian Divorce Act. The Special Marriage Act 1954 applies to inter-religious marriages. The Protection of Women from Domestic Violence Act 2005 applies to all. Criminal aspects of family law now fall under the Bharatiya Nyaya Sanhita (BNS) 2023.',
  uk: "UK family law is governed by the Family Law Act 1996, Children Act 1989, and Matrimonial Causes Act 1973. Divorce requires 1 year of marriage. The court's primary concern in custody matters is the child's welfare.",
  us: "US family law is state-specific. No-fault divorce is available in all states. Child custody decisions are based on the 'best interests of the child' standard. Alimony and property division rules vary significantly by state.",
}

const FAMILY_LAWS: Record<string, Record<string, string[]>> = {
  india: {
    'Divorce / Separation': ['Hindu Marriage Act 1955 (Sections 13-14)', 'Special Marriage Act 1954', 'Muslim Personal Law (Shariat) Application Act 1937', 'Indian Divorce Act 1869 (Christians)'],
    'Child custody': ['Hindu Minority and Guardianship Act 1956', 'Guardians and Wards Act 1890', 'Hindu Marriage Act 1955 Section 26'],
    'Maintenance / Alimony': ['BNSS Section 144 (Maintenance)', 'Hindu Marriage Act Section 24-25', 'Hindu Adoption and Maintenance Act 1956'],
    'Domestic violence': ['Protection of Women from DV Act 2005', 'BNS Section 85 (Cruelty by Husband)', 'BNS Section 80 (Dowry Death)'],
    Adoption: ['Hindu Adoption and Maintenance Act 1956', 'Juvenile Justice Act 2015', 'CARA Guidelines'],
    'Inheritance / Succession': ['Hindu Succession Act 1956', 'Indian Succession Act 1925', 'Muslim Personal Law'],
    'Marriage validity': ['Hindu Marriage Act 1955 Section 5', 'Special Marriage Act 1954', 'Child Marriage Restraint Act 2006'],
  },
  uk: {
    'Divorce / Separation': ['Matrimonial Causes Act 1973', 'Divorce, Dissolution and Separation Act 2020', 'Family Law Act 1996'],
    'Child custody': ['Children Act 1989', 'Child Arrangements Order'],
    'Maintenance / Alimony': ['Matrimonial Causes Act 1973 s.23', 'Child Support Act 1991'],
    'Domestic violence': ['Domestic Abuse Act 2021', 'Family Law Act 1996 Part IV', 'Protection from Harassment Act 1997'],
    Adoption: ['Adoption and Children Act 2002'],
    'Inheritance / Succession': ['Inheritance (Provision for Family and Dependants) Act 1975', 'Wills Act 1837'],
    'Marriage validity': ['Marriage Act 1949', 'Matrimonial Causes Act 1973 s.11-12'],
  },
  us: {
    'Divorce / Separation': ['State Divorce Statutes', 'Uniform Marriage and Divorce Act', 'No-Fault Divorce Laws'],
    'Child custody': ['State Family Code', 'Uniform Child Custody Jurisdiction and Enforcement Act (UCCJEA)'],
    'Maintenance / Alimony': ['State Alimony Statutes', 'Uniform Marriage and Divorce Act s.308'],
    'Domestic violence': ['Violence Against Women Act (VAWA)', 'State DV Protection Order Laws'],
    Adoption: ['State Adoption Statutes', 'Interstate Compact on the Placement of Children'],
    'Inheritance / Succession': ['State Probate Code', 'Uniform Probate Code'],
    'Marriage validity': ['State Marriage Laws', 'Defense of Marriage Act (state level)'],
  },
}

function analyzeFamily(jurisdiction: string, answers: Record<string, any>) {
  const matter = answers.matter_type || 'Divorce / Separation'
  const children = !!answers.children
  const childrenMinor = !!answers.children_age
  const violence = !!answers.violence
  const mutual = !!answers.mutual_consent
  const duration = answers.duration || '1–3 years'

  let risk: string
  if (violence) risk = 'Critical'
  else if (matter === 'Domestic violence' || (children && childrenMinor)) risk = 'High'
  else if (['Divorce / Separation', 'Child custody'].includes(matter)) risk = 'Medium'
  else risk = 'Low'

  let classification: string
  if (matter === 'Divorce / Separation') {
    if (mutual) classification = 'Mutual Consent Divorce — Streamlined Process Available'
    else if (violence) classification = 'Contested Divorce with Domestic Violence — Urgent Legal Action Required'
    else classification = 'Contested Divorce — Grounds Must Be Established'
  } else if (matter === 'Child custody') classification = 'Child Custody Dispute — Best Interests of Child Standard Applies'
  else if (matter === 'Domestic violence') classification = 'Domestic Violence — Immediate Protection Order Required'
  else classification = `${matter} — Legal Proceedings Required`

  let durationWarning = ''
  if (matter === 'Divorce / Separation') {
    if (jurisdiction === 'india' && duration === 'Less than 1 year')
      durationWarning = 'In India, divorce cannot be filed within 1 year of marriage (with limited exceptions for exceptional hardship).'
    else if (jurisdiction === 'uk' && duration === 'Less than 1 year')
      durationWarning = 'In the UK, you cannot petition for divorce until you have been married for at least 1 year.'
  }

  let immediate_actions: string[], rights: string[], liabilities: string[], next_steps: string[]

  if (violence) {
    immediate_actions = [
      'Ensure your immediate safety — leave if you are in danger',
      'Call emergency services if in immediate danger',
      'Go to a shelter or trusted person\'s home',
      'Apply for an emergency protection order / restraining order immediately',
      'Document all injuries with photos and medical records',
    ]
  } else if (matter === 'Divorce / Separation') {
    immediate_actions = [
      'Do not make any major financial decisions or transfers',
      'Secure important documents — marriage certificate, financial records, property papers',
      'Open a personal bank account if you don\'t have one',
      'Consult a family lawyer before taking any formal steps',
    ]
  } else if (matter === 'Child custody') {
    immediate_actions = [
      'Do not remove children from their current residence without court order',
      'Document the child\'s current living situation and welfare',
      'Consult a family lawyer immediately',
      'Do not speak negatively about the other parent in front of the children',
    ]
  } else {
    immediate_actions = ['Gather all relevant documents', 'Consult a family lawyer', 'Do not take unilateral action without legal advice']
  }

  if (matter === 'Divorce / Separation') {
    rights = ['Right to petition for divorce on valid grounds', 'Right to maintenance/alimony during and after proceedings', 'Right to equitable share of marital property', 'Right to legal representation', 'Right to custody/access to children']
    liabilities = ['Maintenance obligations may continue post-divorce', 'Property division may affect your financial position', 'Legal costs can be significant in contested divorces']
    next_steps = ['Consult a family lawyer to understand grounds and process', 'Attempt mediation if both parties are willing — faster and cheaper', 'File petition in the appropriate family court', 'Apply for interim maintenance if financially dependent']
    if (durationWarning) next_steps.unshift(`Note: ${durationWarning}`)
    if (mutual) next_steps.unshift('Mutual consent divorce is faster — typically 6–18 months in India, 6 months in UK')
  } else if (matter === 'Child custody') {
    rights = ['Right to apply for custody or visitation', 'Right to be heard in custody proceedings', 'Right to legal representation']
    liabilities = ['Child support obligations regardless of custody outcome', 'Violation of custody orders is contempt of court']
    next_steps = ['File for custody in the family court', 'Prepare evidence of your involvement in the child\'s life', 'Consider a parenting plan to present to the court', 'Prioritise the child\'s welfare in all decisions']
  } else if (matter === 'Domestic violence') {
    rights = ['Right to emergency protection order', 'Right to remain in the matrimonial home (in many jurisdictions)', 'Right to maintenance and compensation', 'Right to free legal aid']
    liabilities = []
    next_steps = ['Apply for protection order at the magistrate court / family court immediately', 'File a police complaint (FIR in India)', 'Seek shelter at a government or NGO shelter if needed', 'Contact a domestic violence helpline']
  } else {
    rights = ['Right to legal representation']; liabilities = []; next_steps = ['Consult a family lawyer']
  }

  const laws = FAMILY_LAWS[jurisdiction]?.[matter] || []
  let summary = `This is a ${matter.toLowerCase()} matter under ${jurisdiction.toUpperCase()} family law.`
  if (durationWarning) summary += ` ${durationWarning}`
  if (violence) summary += ' Domestic violence is present — immediate legal protection is strongly advised.'
  if (children && childrenMinor) summary += " Minor children are involved — their welfare will be the court's primary consideration."

  return {
    classification, risk_level: risk, immediate_actions, rights, liabilities, applicable_laws: laws,
    jurisdiction_notes: FAMILY_JURISDICTION_NOTES[jurisdiction] || '',
    recommended_next_steps: next_steps, summary,
  }
}

// ═══════════════════════════════════════════════════════════
// CONTRACT RULES
// ═══════════════════════════════════════════════════════════

const CONTRACT_JURISDICTION_NOTES: Record<string, string> = {
  india: 'Indian contract law is governed by the Indian Contract Act 1872. A valid contract requires offer, acceptance, consideration, capacity, and free consent. The Limitation Act 1963 allows 3 years to sue for breach of contract.',
  uk: 'UK contract law is primarily common law. A valid contract requires offer, acceptance, consideration, and intention to create legal relations. The Limitation Act 1980 allows 6 years for breach of contract claims.',
  us: 'US contract law is governed by state common law and the Uniform Commercial Code (UCC) for goods. The statute of limitations varies by state (typically 4–6 years). The Restatement (Second) of Contracts is widely followed.',
}

const CONTRACT_LAWS: Record<string, Record<string, string[]>> = {
  india: {
    Employment: ['Indian Contract Act 1872', 'Industrial Disputes Act 1947', 'Payment of Wages Act 1936'],
    'Sale of goods': ['Sale of Goods Act 1930', 'Indian Contract Act 1872', 'Consumer Protection Act 2019'],
    'Service agreement': ['Indian Contract Act 1872', 'Specific Relief Act 1963'],
    'Lease / Rental': ['Transfer of Property Act 1882', 'Rent Control Acts (State-specific)'],
    'Loan / Finance': ['Indian Contract Act 1872', 'SARFAESI Act 2002', 'RBI Guidelines'],
    'Business partnership': ['Indian Partnership Act 1932', 'Indian Contract Act 1872'],
    'Online / E-commerce': ['IT Act 2000', 'Consumer Protection (E-Commerce) Rules 2020', 'Indian Contract Act 1872'],
    Other: ['Indian Contract Act 1872', 'Specific Relief Act 1963', 'Limitation Act 1963'],
  },
  uk: {
    Employment: ['Employment Rights Act 1996', 'Equality Act 2010', 'Contract of Employment'],
    'Sale of goods': ['Sale of Goods Act 1979', 'Consumer Rights Act 2015'],
    'Service agreement': ['Supply of Goods and Services Act 1982', 'Consumer Rights Act 2015'],
    'Lease / Rental': ['Landlord and Tenant Act 1985', 'Housing Act 1988'],
    'Loan / Finance': ['Consumer Credit Act 1974', 'Financial Services and Markets Act 2000'],
    'Business partnership': ['Partnership Act 1890', 'Limited Liability Partnerships Act 2000'],
    'Online / E-commerce': ['Consumer Contracts Regulations 2013', 'Electronic Commerce Regulations 2002'],
    Other: ['Contract Law (Common Law)', 'Limitation Act 1980'],
  },
  us: {
    Employment: ['Fair Labor Standards Act', 'State Employment Laws', 'At-Will Employment Doctrine'],
    'Sale of goods': ['UCC Article 2', 'State Sales Laws'],
    'Service agreement': ['Restatement (Second) of Contracts', 'State Service Laws'],
    'Lease / Rental': ['State Landlord-Tenant Laws', 'Uniform Residential Landlord and Tenant Act'],
    'Loan / Finance': ['Truth in Lending Act (TILA)', 'State Usury Laws'],
    'Business partnership': ['Uniform Partnership Act', 'State Partnership Laws'],
    'Online / E-commerce': ['Electronic Signatures in Global and National Commerce Act (E-SIGN)', 'State E-Commerce Laws'],
    Other: ['Restatement (Second) of Contracts', 'UCC', 'State Contract Law'],
  },
}

const LIMITATION_PERIODS: Record<string, string> = {
  india: '3 years from the date of breach (Limitation Act 1963)',
  uk: '6 years from the date of breach (Limitation Act 1980)',
  us: 'Varies by state — typically 4–6 years',
}

function analyzeContract(jurisdiction: string, answers: Record<string, any>) {
  const role = answers.role || ''
  const contractType = answers.contract_type || 'Other'
  const written = !!answers.written
  const signed = !!answers.signed
  const breachType = answers.breach_type || 'Other'
  const loss = !!answers.loss_suffered
  const noticeGiven = !!answers.notice_given
  const timeSince = answers.time_since || 'Less than 1 month'
  const consideration = answers.consideration !== false

  const isEnforcer = role === 'Party who wants to enforce the contract'
  const validityIssues: string[] = []
  if (!written) validityIssues.push('Oral contracts are harder to prove but may still be enforceable')
  if (!signed) validityIssues.push('Unsigned contracts may lack clear evidence of agreement')
  if (!consideration) validityIssues.push('Lack of consideration may render the contract void')

  let risk: string
  if (['Misrepresentation / Fraud', 'Non-payment'].includes(breachType) && loss) risk = 'High'
  else if (breachType === 'Non-performance' && loss) risk = 'Medium'
  else if (timeSince === 'More than 2 years') risk = 'Low'
  else risk = 'Medium'

  let classification: string
  if (breachType === 'Misrepresentation / Fraud') classification = 'Potential Fraudulent Misrepresentation — Contract May Be Voidable'
  else if (breachType === 'Non-payment') classification = 'Breach of Contract — Non-Payment'
  else if (breachType === 'Non-performance') classification = 'Breach of Contract — Non-Performance'
  else if (breachType === 'Termination dispute') classification = 'Wrongful Termination / Repudiation of Contract'
  else if (breachType === 'Unfair terms') classification = 'Potentially Unfair Contract Terms — May Be Unenforceable'
  else if (breachType === 'Force majeure claim') classification = 'Force Majeure Claim — Performance Excused by Extraordinary Event'
  else classification = `Contract Dispute — ${contractType}`
  if (timeSince === 'More than 2 years') classification += ' — LIMITATION PERIOD MAY BE APPROACHING'

  let immediate_actions: string[], rights: string[], liabilities: string[], next_steps: string[]

  if (isEnforcer) {
    immediate_actions = [
      'Gather all contract documents, emails, and communications',
      'Calculate the exact financial loss suffered',
      'Send a formal legal notice / demand letter to the other party',
      'Do not accept partial performance as full settlement without written agreement',
      'Preserve all evidence of the breach',
    ]
    rights = [
      'Right to sue for damages (compensatory, consequential)',
      'Right to seek specific performance (court orders the other party to perform)',
      'Right to rescind the contract if misrepresentation occurred',
      'Right to claim interest on unpaid amounts',
      'Right to seek injunction to prevent further breach',
    ]
    liabilities = ['Duty to mitigate your losses — you cannot claim avoidable losses', 'Legal costs if the claim fails']
    next_steps = [
      'Send a formal legal notice giving 15–30 days to remedy the breach',
      'Attempt negotiation or mediation before litigation',
      'File a civil suit in the appropriate court if no resolution',
      'Consider arbitration if the contract has an arbitration clause',
      `Act within the limitation period: ${LIMITATION_PERIODS[jurisdiction] || ''}`,
    ]
    if (!noticeGiven) next_steps.unshift('Send a formal breach notice immediately — this is required before most legal action')
    for (const issue of validityIssues) next_steps.unshift(`Note: ${issue}`)
  } else {
    immediate_actions = [
      'Do not admit breach in writing without legal advice',
      'Review the contract carefully for your obligations',
      'Check if any force majeure or frustration clause applies',
      'Consult a contract lawyer immediately',
      'Gather evidence of your performance or reasons for non-performance',
    ]
    rights = [
      'Right to contest the breach allegation',
      'Right to raise defences (frustration, force majeure, misrepresentation)',
      'Right to negotiate a settlement',
      'Right to legal representation',
    ]
    liabilities = [
      'Potential damages for proven breach',
      'Specific performance order requiring you to fulfil the contract',
      'Legal costs if the claim succeeds against you',
    ]
    next_steps = [
      'Review the contract for any defences available to you',
      'Respond to any legal notice within the specified time',
      'Engage a contract lawyer to assess your position',
      'Consider settlement to avoid litigation costs',
      'Check if the contract has an arbitration clause',
    ]
  }

  const laws = CONTRACT_LAWS[jurisdiction]?.[contractType] || CONTRACT_LAWS[jurisdiction]?.Other || []
  const enforceNote = written && signed ? 'The contract is written and signed, which strengthens enforceability.' : 'The contract may have enforceability issues.'

  return {
    classification, risk_level: risk, immediate_actions, rights, liabilities, applicable_laws: laws,
    jurisdiction_notes: CONTRACT_JURISDICTION_NOTES[jurisdiction] || '',
    recommended_next_steps: next_steps,
    summary: `This is a ${breachType.toLowerCase()} dispute involving a ${contractType.toLowerCase()} contract under ${jurisdiction.toUpperCase()} law. ${enforceNote} ${validityIssues.join(' ')}`,
  }
}

// ═══════════════════════════════════════════════════════════
// MAIN POST HANDLER
// ═══════════════════════════════════════════════════════════

export async function POST(req: NextRequest) {
  try {
    const { jurisdiction, area, answers } = await req.json()
    if (!jurisdiction || !area || !answers) {
      return NextResponse.json({ error: 'Missing required fields: jurisdiction, area, answers' }, { status: 400 })
    }

    const handlers: Record<string, (j: string, a: Record<string, any>) => any> = {
      tort: analyzeTort,
      criminal: analyzeCriminal,
      family: analyzeFamily,
      contract: analyzeContract,
    }

    const handler = handlers[area]
    if (!handler) return NextResponse.json({ error: 'Unknown area of law' }, { status: 400 })

    const result = handler(jurisdiction, answers)
    result.disclaimer = DISCLAIMER
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
