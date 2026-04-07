import { NextRequest, NextResponse } from 'next/server'

// Simulator evaluation — scores user choices from branching scenarios
// Correct sequence and what-not-to-do are stored server-side

const CORRECT_SEQUENCES: Record<string, string[]> = {
  road_accident: ['Stop your vehicle safely', 'Call emergency services', 'Apply first aid if trained', 'Note fleeing driver details and report', 'Give honest witness statement'],
  drowning: ['Shout for help and call emergency services', 'Use a flotation device — throw, don\'t go', 'Begin CPR if not breathing', 'Continue until help arrives'],
  fraud: ['Hang up — never give OTPs', 'Call bank\'s official number', 'File cybercrime/police complaint', 'Monitor accounts and change passwords'],
  harassment: ['Approach victim calmly — not the harasser', 'Call police if dangerous', 'Stay with victim until safe', 'Offer to be a formal witness'],
  sexual_assault: ['Believe the victim, let them lead', 'Preserve evidence — do not shower/change', 'Hospital first for medical exam', 'File FIR/police report'],
  domestic_violence: ['Call police if immediate danger', 'Help create a safety plan', 'Access shelter or safe location', 'Apply for protection order'],
  theft: ['Note description and call police', 'Lock/wipe phone, block SIM', 'File formal police report', 'Pursue the case with evidence'],
  cybercrime: ['Change passwords and enable 2FA', 'Document all evidence', 'Report to cybercrime authorities', 'Notify affected services'],
  fire_emergency: ['Alert others and activate alarm', 'Call fire department', 'Evacuate via stairs — never elevator', 'Do NOT go back inside'],
  child_abuse: ['Document signs with dates', 'Report to child protective services', 'Follow up with authorities', 'Provide formal statement'],
  medical_emergency: ['Check responsiveness, call emergency services', 'Begin CPR if not breathing', 'Use AED if available', 'Brief paramedics on arrival'],
  stalking: ['Document every incident', 'Report to police', 'Apply for restraining order', 'Share location with trusted contacts'],
  hit_and_run: ['Stay still, assess injuries, call emergency services', 'Get witness details and vehicle info', 'Do NOT chase the vehicle', 'File police report from hospital'],
  workplace_injury: ['Call emergency services, do NOT move person', 'Secure the area', 'File official accident report', 'Ensure workers\' compensation rights known'],
  kidnapping: ['Call police immediately with vehicle details', 'Note plate, colour, direction', 'Share all details with police', 'Provide formal eyewitness statement'],
  poisoning: ['Call emergency services, recovery position, do NOT induce vomiting', 'Begin CPR if breathing stops', 'Show paramedics the substance/bottles', 'Do not hide evidence'],
  earthquake: ['Drop, Cover, Hold On under sturdy furniture', 'Evacuate via stairs after shaking stops', 'Move to open area away from buildings', 'Prepare for aftershocks'],
  dog_attack: ['Stand still, avoid eye contact, back away slowly', 'If bitten: wash wound, go to hospital', 'Report to animal control', 'Get rabies assessment within 24 hours'],
  gas_leak: ['Do NOT switch anything on/off', 'Open windows, evacuate immediately', 'Call gas company from outside', 'Alert other residents'],
  wrongful_arrest: ['Stay calm, ask if detained, ask for reason', 'Do not resist physically', 'State clearly: I want a lawyer', 'Document everything after release'],
  elder_abuse: ['Speak to elderly person privately', 'Document signs and report to authorities', 'Ensure immediate safety', 'Provide formal statement'],
  blackmail: ['Do NOT pay', 'Screenshot everything', 'Report to cybercrime police', 'Do not engage with the blackmailer'],
}

const WHAT_NOT_TO_DO: Record<string, string[]> = {
  road_accident: ['Do not drive past without stopping', 'Do not move an injured person unless in immediate danger', 'Do not take videos instead of helping', 'Do not lie to police'],
  drowning: ['Never jump in without training', 'Do not waste time — every second counts', 'Do not leave a rescued person unattended'],
  fraud: ['Never give OTPs or passwords to anyone', 'Do not contact the scammer', 'Do not delay calling your bank'],
  harassment: ['Do not directly confront an aggressive harasser', 'Do not ignore it — bystander inaction enables it', 'Do not pressure the victim to report'],
  sexual_assault: ['Do not shower or change before medical exam', 'Do not pressure the victim', 'Do not ask victim-blaming questions', 'Do not share identity publicly'],
  domestic_violence: ['Do not advise to "work it out"', 'Do not contact the abuser without consent', 'Do not suggest family mediation in DV'],
  theft: ['Do not chase the thief', 'Do not accept the loss without reporting', 'Do not post thief\'s photo without police'],
  cybercrime: ['Never pay a ransom', 'Do not delete evidence', 'Do not use compromised device', 'Do not ignore the breach'],
  fire_emergency: ['Never use elevators', 'Never open a hot door', 'Never go back inside for belongings'],
  child_abuse: ['Do not confront the abuser directly', 'Do not ignore signs', 'Do not take the child yourself'],
  medical_emergency: ['Do not waste time looking for a doctor', 'Do not shake an unconscious person', 'Do not stop CPR until paramedics arrive'],
  stalking: ['Do not confront the stalker alone', 'Do not respond to their messages', 'Do not share location publicly'],
  hit_and_run: ['Do not chase the vehicle', 'Do not move if you suspect fracture', 'Do not delay calling emergency services'],
  workplace_injury: ['Do not move someone with spinal injury', 'Do not agree to cover up the accident', 'Do not let employer pressure you'],
  kidnapping: ['Do not chase the vehicle yourself', 'Do not delay calling police', 'Do not assume it\'s a family matter'],
  poisoning: ['Do not induce vomiting', 'Do not give food or water', 'Do not hide the substance from paramedics'],
  earthquake: ['Never use elevators during earthquake', 'Do not run outside during shaking', 'Do not light candles after — gas leaks possible'],
  dog_attack: ['Do not run from an aggressive dog', 'Do not ignore a bite — rabies is fatal', 'Do not try to catch the dog'],
  gas_leak: ['Do NOT switch on/off any electrical device', 'Do not light matches', 'Do not use phone inside gas-filled room'],
  wrongful_arrest: ['Do not run', 'Do not resist physically', 'Do not argue aggressively'],
  elder_abuse: ['Do not ignore signs', 'Do not confront the caretaker without reporting first', 'Do not return the person to the abuser'],
  blackmail: ['Never pay — it only leads to more demands', 'Do not threaten back', 'Do not delete messages — they are evidence'],
}

const APPLICABLE_LAWS: Record<string, Record<string, string[]>> = {
  road_accident: { india: ['BNS Section 106 (Negligence causing death)', 'Motor Vehicles Act 1988', 'BNS Section 281 (Rash driving)'], uk: ['Road Traffic Act 1988', 'Offences Against the Person Act 1861'], us: ['State Hit-and-Run Statutes', 'Good Samaritan Laws'] },
  drowning: { india: ['BNS Section 105 (Culpable Homicide)', 'BNS Section 106 (Negligence)'], uk: ['Occupiers\' Liability Act 1957', 'Health and Safety at Work Act 1974'], us: ['State Duty to Rescue Laws', 'Good Samaritan Laws'] },
  fraud: { india: ['BNS Section 318 (Cheating)', 'IT Act 2000 Section 66C/66D'], uk: ['Fraud Act 2006', 'Computer Misuse Act 1990'], us: ['18 U.S.C. § 1343 (Wire Fraud)', 'Computer Fraud and Abuse Act'] },
  harassment: { india: ['BNS Section 74 (Assault on Woman)', 'BNS Section 79 (Word/Gesture)', 'POSH Act 2013'], uk: ['Protection from Harassment Act 1997', 'Equality Act 2010'], us: ['State Harassment Statutes', 'Title VII (Workplace)'] },
  sexual_assault: { india: ['BNS Section 63-64 (Rape)', 'POCSO Act 2012', 'BNS Section 74'], uk: ['Sexual Offences Act 2003', 'Domestic Abuse Act 2021'], us: ['18 U.S.C. § 2241', 'VAWA', 'State Sexual Assault Laws'] },
  domestic_violence: { india: ['Protection of Women from DV Act 2005', 'BNS Section 85', 'BNS Section 80 (Dowry Death)'], uk: ['Domestic Abuse Act 2021', 'Family Law Act 1996'], us: ['VAWA', 'State DV Protection Order Laws'] },
  theft: { india: ['BNS Section 303 (Theft)', 'BNS Section 309 (Robbery)'], uk: ['Theft Act 1968', 'Fraud Act 2006'], us: ['18 U.S.C. § 2111 (Robbery)', 'State Theft Statutes'] },
  cybercrime: { india: ['IT Act 2000 Section 66', 'BNS Section 318 (Cheating)'], uk: ['Computer Misuse Act 1990', 'Data Protection Act 2018'], us: ['Computer Fraud and Abuse Act 18 U.S.C. § 1030'] },
  fire_emergency: { india: ['National Building Code', 'BNS Section 106 (Negligence)'], uk: ['Fire Safety Order 2005', 'Fire and Rescue Services Act 2004'], us: ['State Fire Codes', 'OSHA Fire Safety'] },
  child_abuse: { india: ['POCSO Act 2012', 'Juvenile Justice Act 2015'], uk: ['Children Act 1989', 'Children Act 2004'], us: ['CAPTA', 'State Mandatory Reporting Laws'] },
  medical_emergency: { india: ['BNS Section 106', 'Good Samaritan Guidelines (SC 2016)'], uk: ['Social Action Act 2015', 'Common Law Duty of Care'], us: ['Good Samaritan Laws', 'EMTALA'] },
  stalking: { india: ['BNS Section 78 (Stalking)', 'IT Act 2000'], uk: ['Protection from Harassment Act 1997', 'Stalking Protection Act 2019'], us: ['18 U.S.C. § 2261A', 'State Anti-Stalking Laws'] },
  hit_and_run: { india: ['Motor Vehicles Act 1988 Section 161', 'BNS Section 106'], uk: ['Road Traffic Act 1988 Section 170'], us: ['State Hit-and-Run Statutes'] },
  workplace_injury: { india: ['Factories Act 1948', 'Employees\' Compensation Act 1923'], uk: ['Health and Safety at Work Act 1974', 'RIDDOR 2013'], us: ['OSHA', 'State Workers\' Compensation Laws'] },
  kidnapping: { india: ['BNS Section 137 (Kidnapping)', 'BNS Section 140 (Abduction)'], uk: ['Child Abduction Act 1984', 'Offences Against the Person Act 1861'], us: ['18 U.S.C. § 1201 (Federal Kidnapping)', 'State Kidnapping Statutes'] },
  poisoning: { india: ['BNS Section 117 (Grievous Hurt)', 'NDPS Act 1985'], uk: ['Offences Against the Person Act 1861'], us: ['State Poisoning/Assault Statutes'] },
  earthquake: { india: ['Disaster Management Act 2005', 'National Building Code'], uk: ['Civil Contingencies Act 2004'], us: ['Stafford Act', 'State Emergency Management Laws'] },
  dog_attack: { india: ['BNS Section 289 (Negligent Animal Keeping)', 'Municipal Corporation Acts'], uk: ['Dangerous Dogs Act 1991', 'Animals Act 1971'], us: ['State Dog Bite Statutes', 'One Bite Rule'] },
  gas_leak: { india: ['Gas Cylinder Rules 2004', 'BNS Section 285 (Negligent Conduct)'], uk: ['Gas Safety Regulations 1998', 'Health and Safety at Work Act 1974'], us: ['State Gas Safety Codes', 'OSHA'] },
  wrongful_arrest: { india: ['Article 21-22 (Constitutional Rights)', 'BNSS Section 47 (Arrest Procedure)'], uk: ['PACE 1984', 'Human Rights Act 1998'], us: ['4th Amendment', '14th Amendment', '42 U.S.C. § 1983'] },
  elder_abuse: { india: ['Maintenance and Welfare of Parents and Senior Citizens Act 2007', 'BNS Section 85'], uk: ['Care Act 2014', 'Safeguarding Vulnerable Groups Act 2006'], us: ['Elder Justice Act', 'State Adult Protective Services Laws'] },
  blackmail: { india: ['BNS Section 308 (Extortion)', 'IT Act 2000 Section 66E'], uk: ['Theft Act 1968 Section 21 (Blackmail)'], us: ['18 U.S.C. § 873 (Blackmail)', 'State Extortion Laws'] },
}

const OMISSION_LAWS: Record<string, Record<string, string>> = {
  road_accident: { india: 'Under BNS Section 106, causing death by negligent act is punishable. Failure to assist may constitute criminal negligence.', uk: 'UK law does not impose a general duty to rescue. Road Traffic Act 1988 requires drivers involved to stop.', us: 'Most states have no duty to rescue. Good Samaritan laws protect those who assist.' },
  drowning: { india: 'BNS Section 105 may apply if a person with duty of care fails to act.', uk: 'No general duty to rescue. Occupiers\' Liability Act may apply at pools.', us: 'Some states impose criminal liability for failure to rescue when safe to do so.' },
  sexual_assault: { india: 'Under BNSS Section 173, failure to record FIR for sexual offence is an offence.', uk: 'No general duty to report crimes.', us: 'Mandatory reporting laws apply to professionals.' },
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { scenario_id, jurisdiction, choices } = body

  let score = 0
  const maxScore = choices.length
  const stepFeedback = choices.map((c: any) => {
    const isCorrect = c.was_correct === true
    if (isCorrect) score++
    return {
      step: 0, situation: c.situation || '', your_choice: c.choice_text || '',
      correct_choice: c.correct_choice_text || '', was_correct: isCorrect,
      explanation: '', legal_consequence: '', ethical_note: '',
    }
  })

  const pct = maxScore > 0 ? (score / maxScore) * 100 : 0
  let grade: string, summary: string
  if (pct >= 90) { grade = 'Excellent'; summary = 'Outstanding — you made the right calls.' }
  else if (pct >= 70) { grade = 'Good'; summary = 'Good instincts, but review the feedback.' }
  else if (pct >= 50) { grade = 'Needs Improvement'; summary = 'Several critical mistakes. Review carefully.' }
  else { grade = 'Dangerous'; summary = 'Most decisions were incorrect — these could be life-threatening.' }

  return NextResponse.json({
    score, max_score: maxScore, grade, step_feedback: stepFeedback,
    omission_liability: OMISSION_LAWS[scenario_id]?.[jurisdiction] || null,
    applicable_laws: APPLICABLE_LAWS[scenario_id]?.[jurisdiction] || [],
    correct_sequence: CORRECT_SEQUENCES[scenario_id] || [],
    what_not_to_do: WHAT_NOT_TO_DO[scenario_id] || [],
    summary,
  })
}
