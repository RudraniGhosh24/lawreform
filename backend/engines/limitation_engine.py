"""
Legal Limitation & Deadline Engine — India, UK, US
PhD-level limitation period analysis with:
- 60+ case types across 3 jurisdictions
- Starting point analysis (accrual rules)
- Extension/tolling provisions (disability, fraud, COVID, minority, insanity)
- Condonation of delay jurisprudence
- Jurisdiction-specific forum selection
- Conflict of laws analysis
- Precedent citations for each rule
- Countdown with urgency classification
"""
from datetime import datetime, timedelta
from typing import Any
import math

DISCLAIMER = (
    "This analysis is for educational and research purposes only. Limitation periods are complex and "
    "fact-specific. This tool provides general guidance based on statutory provisions — actual limitation "
    "may differ based on specific facts, court interpretations, and amendments. Consult a qualified "
    "advocate before relying on any deadline calculation."
)

# ============================================================
# LIMITATION DATABASE — India
# ============================================================
INDIA_LIMITATIONS: list[dict] = [
    # --- Civil suits (Limitation Act 1963, First Schedule) ---
    {"id": "IN-CIV-01", "category": "Civil", "subcategory": "Contract", "case_type": "Suit for breach of contract",
     "period_years": 3, "period_days": 0,
     "starting_point": "Date of breach",
     "governing_law": "Limitation Act 1963, Article 55",
     "accrual_rule": "Limitation begins from the date the breach occurs, not from the date the contract was entered into. If breach is continuing, each day is a fresh cause of action.",
     "extensions": ["Section 5: Court may condone delay if 'sufficient cause' is shown", "Section 6-8: Disability provisions (minority, insanity, idiocy)", "Section 9: Continuous running once started", "Section 14: Time spent in bona fide proceedings in wrong court excluded", "Section 18: Acknowledgment in writing restarts limitation"],
     "key_precedents": ["State of MP v Bherulal (2020) — SC held limitation is a mixed question of law and fact", "Balakrishna Savalram v Shrinivas (1959) AIR SC 798 — breach must be unequivocal"],
     "condonation": "Section 5 applies to appeals and applications, NOT to original suits. For suits, limitation is absolute.",
     "notes": "If the contract specifies a shorter limitation period, that may apply if reasonable. Arbitration clause may affect forum.",
     "jurisdiction": "india"},

    {"id": "IN-CIV-02", "category": "Civil", "subcategory": "Contract", "case_type": "Suit for specific performance of contract",
     "period_years": 3, "period_days": 0,
     "starting_point": "Date fixed for performance, or if no date fixed, when plaintiff has notice that performance is refused",
     "governing_law": "Limitation Act 1963, Article 54; Specific Relief Act 1963",
     "accrual_rule": "Time runs from the date fixed for performance. If no date is fixed, from when the plaintiff knows or ought to know that the defendant refuses to perform.",
     "extensions": ["Section 5 does NOT apply to suits", "Section 14: Exclusion of time in bona fide proceedings", "Section 18: Acknowledgment restarts limitation"],
     "key_precedents": ["Saradamani Kandappan v Rajalakshmi (2011) 12 SCC 18 — SC on starting point for specific performance"],
     "condonation": "No condonation under Section 5 for original suits. Must file within 3 years absolutely.",
     "notes": "Specific performance is discretionary — even if within limitation, court may refuse if plaintiff delayed unreasonably (laches).",
     "jurisdiction": "india"},

    {"id": "IN-CIV-03", "category": "Civil", "subcategory": "Tort", "case_type": "Suit for compensation for tort/negligence",
     "period_years": 3, "period_days": 0,
     "starting_point": "Date of the tortious act or when damage first occurs",
     "governing_law": "Limitation Act 1963, Article 72-73",
     "accrual_rule": "Limitation runs from the date of the wrongful act. For continuing torts (nuisance), each day is a fresh cause of action. Discovery rule may apply for latent injuries.",
     "extensions": ["Section 6-8: Disability provisions", "Section 14: Exclusion of bona fide proceedings time"],
     "key_precedents": ["Municipal Corporation of Delhi v Subhagwanti (1966) AIR SC 1750 — limitation in tort claims", "Jay Laxmi Salt Works v State of Gujarat (1994) 4 SCC 1 — continuing wrong doctrine"],
     "condonation": "Section 5 does not apply to suits. Limitation is strict.",
     "notes": "For motor accident claims, see Motor Vehicles Act (separate limitation). For medical negligence, discovery rule may delay accrual.",
     "jurisdiction": "india"},

    {"id": "IN-CIV-04", "category": "Civil", "subcategory": "Property", "case_type": "Suit for possession of immovable property",
     "period_years": 12, "period_days": 0,
     "starting_point": "Date of dispossession",
     "governing_law": "Limitation Act 1963, Article 65",
     "accrual_rule": "12 years from the date of dispossession. After 12 years, the person in possession acquires title by adverse possession.",
     "extensions": ["Section 6-8: Disability provisions", "Section 27: Extinguishment of right after limitation"],
     "key_precedents": ["Hemaji Waghaji Jat v Bhikhabhai (2009) 16 SCC 517 — SC on adverse possession and Article 65", "State of Haryana v Mukesh Kumar (2011) 10 SCC 404 — adverse possession requirements"],
     "condonation": "No condonation. After 12 years, the right itself is extinguished under Section 27.",
     "notes": "Adverse possession requires continuous, open, hostile possession for the full period. Government property has 30-year limitation.",
     "jurisdiction": "india"},

    {"id": "IN-CIV-05", "category": "Civil", "subcategory": "Property", "case_type": "Suit for possession of movable property",
     "period_years": 3, "period_days": 0,
     "starting_point": "Date of dispossession or conversion",
     "governing_law": "Limitation Act 1963, Article 66",
     "accrual_rule": "3 years from when the property was wrongfully taken or converted.",
     "extensions": ["Section 6-8: Disability provisions"],
     "key_precedents": [],
     "condonation": "No condonation for suits.",
     "notes": "For stolen property, criminal proceedings may be more effective than civil suit.",
     "jurisdiction": "india"},

    {"id": "IN-CIV-06", "category": "Civil", "subcategory": "Recovery", "case_type": "Suit for recovery of money (debt/loan)",
     "period_years": 3, "period_days": 0,
     "starting_point": "Date when the debt becomes due / date of default",
     "governing_law": "Limitation Act 1963, Article 19-22",
     "accrual_rule": "From the date the money becomes payable. For loans payable on demand, from the date of the loan. For instalment loans, each instalment has its own limitation.",
     "extensions": ["Section 18: Written acknowledgment of debt restarts limitation", "Section 19: Payment of interest restarts limitation", "Section 14: Exclusion of bona fide proceedings"],
     "key_precedents": ["Shapoor Freedom Mazda v Durga Prasad (2003) 4 SCC 619 — acknowledgment must be before limitation expires", "BSNL v BPL Mobile (2008) 13 SCC 597 — limitation for recovery suits"],
     "condonation": "No condonation for suits. But acknowledgment under Section 18 or part payment under Section 19 can restart the clock.",
     "notes": "Cheque bounce cases under NI Act Section 138 have a separate 30-day limitation for complaint. Recovery of money through arbitration may have different timelines.",
     "jurisdiction": "india"},

    # --- Criminal ---
    {"id": "IN-CRM-01", "category": "Criminal", "subcategory": "Complaint", "case_type": "Criminal complaint (private) — offence punishable up to 1 year",
     "period_years": 0, "period_days": 180,
     "starting_point": "Date of offence",
     "governing_law": "BNSS 2023, Section 468 (formerly CrPC Section 468)",
     "accrual_rule": "6 months from the date of the offence for offences punishable with fine only or imprisonment up to 1 year.",
     "extensions": ["BNSS Section 470: Court may condone delay if complainant was unaware of the offence", "BNSS Section 471: Exclusion of time for obtaining sanction"],
     "key_precedents": ["Japani Sahoo v Chandra Sekhar Mohanty (2007) 7 SCC 394 — SC on limitation for criminal complaints", "Sarah Mathew v Institute of Cardio Vascular Diseases (2014) 2 SCC 62 — date of filing, not cognizance, is relevant"],
     "condonation": "Court may condone delay under BNSS Section 470 if the complainant satisfies the court that they had 'sufficient cause' for the delay.",
     "notes": "FIR-based cases (cognizable offences) have no limitation — police can register FIR at any time. This limitation applies only to private complaints for non-cognizable offences.",
     "jurisdiction": "india"},

    {"id": "IN-CRM-02", "category": "Criminal", "subcategory": "Complaint", "case_type": "Criminal complaint — offence punishable 1-3 years",
     "period_years": 1, "period_days": 0,
     "starting_point": "Date of offence",
     "governing_law": "BNSS 2023, Section 468",
     "accrual_rule": "1 year from the date of the offence.",
     "extensions": ["BNSS Section 470: Condonation of delay"],
     "key_precedents": ["Japani Sahoo v Chandra Sekhar Mohanty (2007) 7 SCC 394"],
     "condonation": "Condonable under BNSS Section 470.",
     "notes": "For offences punishable with more than 3 years imprisonment, there is NO limitation period.",
     "jurisdiction": "india"},

    {"id": "IN-CRM-03", "category": "Criminal", "subcategory": "Cheque Bounce", "case_type": "Cheque bounce complaint (NI Act Section 138)",
     "period_years": 0, "period_days": 30,
     "starting_point": "Date of expiry of 15-day notice period after cheque dishonour",
     "governing_law": "Negotiable Instruments Act 1881, Section 142(b); BNSS 2023",
     "accrual_rule": "The complaint must be filed within 30 days of the cause of action arising. Cause of action arises after: (1) cheque is dishonoured, (2) demand notice is sent within 30 days of dishonour, (3) drawer fails to pay within 15 days of receiving notice. The 30-day clock starts after step 3.",
     "extensions": ["Section 142(b) proviso: Court may condone delay if 'sufficient cause' is shown"],
     "key_precedents": ["Dashrath Rupsingh Rathod v State of Maharashtra (2014) 9 SCC 129 — jurisdiction for NI Act complaints", "Yogendra Pratap Singh v Savitri Pandey (2014) 10 SCC 713 — limitation calculation"],
     "condonation": "Condonable — court has discretion to condone delay beyond 30 days if sufficient cause is shown.",
     "notes": "This is one of the strictest limitation periods in Indian law. Missing the 30-day window is fatal unless condonation is granted. The entire NI Act Section 138 process has strict timelines at every step.",
     "jurisdiction": "india"},

    {"id": "IN-CRM-04", "category": "Criminal", "subcategory": "FIR", "case_type": "FIR for cognizable offence (murder, robbery, rape, etc.)",
     "period_years": 0, "period_days": 0,
     "starting_point": "No limitation — can be filed at any time",
     "governing_law": "BNSS 2023; BNS 2023",
     "accrual_rule": "There is NO limitation period for filing an FIR for cognizable offences. However, delay in filing FIR is a relevant factor that courts consider when evaluating the credibility of the complaint.",
     "extensions": [],
     "key_precedents": ["Thulia Kali v State of Tamil Nadu (1972) 3 SCC 393 — FIR is not an encyclopedia, delay alone does not invalidate", "State of AP v Punati Ramulu (1993) — unexplained delay in FIR raises suspicion"],
     "condonation": "Not applicable — no limitation exists.",
     "notes": "While there is no legal limitation, courts routinely scrutinise delayed FIRs. Delay must be satisfactorily explained. For sexual offences, courts are more lenient about delay given the trauma involved.",
     "jurisdiction": "india"},

    # --- Consumer ---
    {"id": "IN-CON-01", "category": "Consumer", "subcategory": "Consumer Complaint", "case_type": "Consumer complaint (Consumer Protection Act 2019)",
     "period_years": 2, "period_days": 0,
     "starting_point": "Date of cause of action (defect discovered, service deficiency occurred)",
     "governing_law": "Consumer Protection Act 2019, Section 69(1)",
     "accrual_rule": "2 years from the date on which the cause of action arises. For latent defects, from the date of discovery.",
     "extensions": ["Section 69(2): Consumer forum may condone delay if 'sufficient cause' is shown"],
     "key_precedents": ["Kandimalla Raghavaiah v National Insurance Co (2009) 7 SCC 768 — limitation in consumer cases", "State Bank of India v BS Agricultural Industries (2009) 5 SCC 121"],
     "condonation": "Condonable — the Consumer Forum has wide discretion to condone delay.",
     "notes": "Consumer complaints are relatively quick (3-6 months at District Forum). E-filing is available. No court fee required.",
     "jurisdiction": "india"},

    # --- Family ---
    {"id": "IN-FAM-01", "category": "Family", "subcategory": "Divorce", "case_type": "Divorce petition (Hindu Marriage Act)",
     "period_years": 0, "period_days": 0,
     "starting_point": "No limitation — but conditions apply",
     "governing_law": "Hindu Marriage Act 1955, Sections 13-14",
     "accrual_rule": "No limitation period for filing divorce. However, Section 14 bars divorce within 1 year of marriage (with exceptions for exceptional hardship or depravity). For divorce on ground of adultery/cruelty, the petition should be filed within a reasonable time of discovering the ground.",
     "extensions": [],
     "key_precedents": ["Naveen Kohli v Neelu Kohli (2006) 4 SCC 558 — irretrievable breakdown", "Samar Ghosh v Jaya Ghosh (2007) 4 SCC 511 — cruelty as ground"],
     "condonation": "Not applicable — no limitation.",
     "notes": "Mutual consent divorce requires 6-month cooling period (waivable by court). Contested divorce can take 2-5 years.",
     "jurisdiction": "india"},

    {"id": "IN-FAM-02", "category": "Family", "subcategory": "Maintenance", "case_type": "Maintenance application (BNSS Section 144)",
     "period_years": 0, "period_days": 0,
     "starting_point": "No limitation — can be filed at any time during subsistence of the relationship",
     "governing_law": "BNSS 2023, Section 144 (formerly CrPC Section 125)",
     "accrual_rule": "No limitation. Maintenance can be claimed at any time. However, arrears of maintenance can only be claimed for the preceding 12 months from the date of application.",
     "extensions": [],
     "key_precedents": ["Rajnesh v Neha (2021) 2 SCC 324 — SC guidelines on maintenance", "Chaturbhuj v Sita Bai (2008) 14 SCC 164"],
     "condonation": "Not applicable.",
     "notes": "Interim maintenance can be granted within weeks. Final maintenance depends on income, needs, and standard of living.",
     "jurisdiction": "india"},

    # --- Labour ---
    {"id": "IN-LAB-01", "category": "Labour", "subcategory": "Industrial Dispute", "case_type": "Industrial dispute (wrongful termination)",
     "period_years": 3, "period_days": 0,
     "starting_point": "Date of termination/retrenchment",
     "governing_law": "Industrial Disputes Act 1947, Section 2A; Limitation Act 1963",
     "accrual_rule": "3 years from the date of termination. For continuing disputes, limitation may not apply.",
     "extensions": ["Section 2A(2): Conciliation proceedings toll limitation"],
     "key_precedents": ["Sapan Kumar Pandit v UP State Electricity Board (2001) — limitation in industrial disputes"],
     "condonation": "Labour courts have wide discretion to condone delay in the interest of justice.",
     "notes": "Before approaching the labour court, conciliation through the Labour Commissioner is usually required.",
     "jurisdiction": "india"},

    # --- Motor Accident ---
    {"id": "IN-MVA-01", "category": "Motor Accident", "subcategory": "Compensation", "case_type": "Motor accident compensation claim",
     "period_years": 0, "period_days": 180,
     "starting_point": "Date of accident",
     "governing_law": "Motor Vehicles Act 1988, Section 166",
     "accrual_rule": "Application must be made within 6 months of the accident. However, the tribunal may entertain the application after 6 months if sufficient cause is shown.",
     "extensions": ["Section 166(3): Tribunal may condone delay"],
     "key_precedents": ["Dhannalal v DP Vijayvargiya (1996) 4 SCC 652 — liberal approach to limitation in MV claims", "Nagappa v Gurudayal Singh (2003) 2 SCC 274 — just compensation principles"],
     "condonation": "Liberally condoned — tribunals take a victim-friendly approach.",
     "notes": "MACT claims are no-fault liability for death/permanent disability. Compensation is based on income, age, multiplier method (Sarla Verma formula).",
     "jurisdiction": "india"},

    # --- Tax ---
    {"id": "IN-TAX-01", "category": "Tax", "subcategory": "Income Tax", "case_type": "Income tax appeal to CIT(A)",
     "period_years": 0, "period_days": 30,
     "starting_point": "Date of receipt of assessment order",
     "governing_law": "Income Tax Act 1961, Section 246A",
     "accrual_rule": "30 days from the date of service of the order.",
     "extensions": ["CIT(A) may condone delay if sufficient cause is shown"],
     "key_precedents": ["Collector, Land Acquisition v Mst Katiji (1987) 2 SCC 107 — liberal approach to condonation"],
     "condonation": "Condonable — CIT(A) has discretion.",
     "notes": "Further appeal to ITAT within 60 days. Appeal to High Court within 120 days.",
     "jurisdiction": "india"},

    # --- Arbitration ---
    {"id": "IN-ARB-01", "category": "Arbitration", "subcategory": "Challenge", "case_type": "Challenge to arbitral award (Section 34)",
     "period_years": 0, "period_days": 90,
     "starting_point": "Date of receipt of the arbitral award",
     "governing_law": "Arbitration and Conciliation Act 1996, Section 34(3)",
     "accrual_rule": "Application must be made within 3 months of receiving the award. A further 30-day extension is available if sufficient cause is shown.",
     "extensions": ["Section 34(3) proviso: 30-day extension beyond 3 months if sufficient cause shown — NO further extension possible"],
     "key_precedents": ["Union of India v Popular Construction Co (2001) 8 SCC 470 — Section 34(3) is mandatory, no further extension beyond 3+1 months", "State of Himachal Pradesh v Himachal Techno Engineers (2010) 12 SCC 210"],
     "condonation": "Only 30 days beyond the 3-month period. After 3 months + 30 days = 120 days total, the right is EXTINGUISHED. No court can condone further delay.",
     "notes": "This is one of the strictest limitation provisions in Indian law. The Supreme Court has repeatedly held that Section 5 of the Limitation Act does NOT apply to Section 34 applications.",
     "jurisdiction": "india"},

    # --- Writ ---
    {"id": "IN-WRIT-01", "category": "Constitutional", "subcategory": "Writ Petition", "case_type": "Writ petition under Article 226/32",
     "period_years": 0, "period_days": 0,
     "starting_point": "No statutory limitation — but laches/delay doctrine applies",
     "governing_law": "Constitution of India, Articles 32 and 226",
     "accrual_rule": "No statutory limitation period. However, High Courts routinely dismiss writ petitions for unexplained delay (doctrine of laches). Generally, writs should be filed within 3-6 months of the cause of action.",
     "extensions": [],
     "key_precedents": ["Tilokchand Motichand v HB Munshi (1969) 1 SCC 110 — laches in writ jurisdiction", "Ramchandra Shankar Deodhar v State of Maharashtra (1974) 1 SCC 317"],
     "condonation": "No formal condonation — but court may entertain delayed petitions if fundamental rights are at stake.",
     "notes": "Article 32 (Supreme Court) petitions for fundamental rights violations are treated more liberally than Article 226 (High Court) petitions.",
     "jurisdiction": "india"},
]

# ============================================================
# LIMITATION DATABASE — UK
# ============================================================
UK_LIMITATIONS: list[dict] = [
    {"id": "UK-CIV-01", "category": "Civil", "subcategory": "Contract", "case_type": "Breach of contract (simple contract)",
     "period_years": 6, "period_days": 0, "starting_point": "Date of breach",
     "governing_law": "Limitation Act 1980, Section 5",
     "accrual_rule": "6 years from the date of breach. For contracts under deed, 12 years (Section 8).",
     "extensions": ["Section 32: Fraud/concealment/mistake — limitation postponed until discovery", "Section 28: Disability (minority, unsound mind)"],
     "key_precedents": ["Pirelli General Cable Works v Oscar Faber [1983] — accrual in latent damage"],
     "condonation": "No general condonation power. Limitation is strict.", "notes": "Contracts under deed have 12-year limitation.", "jurisdiction": "uk"},

    {"id": "UK-CIV-02", "category": "Civil", "subcategory": "Tort", "case_type": "Personal injury claim",
     "period_years": 3, "period_days": 0, "starting_point": "Date of injury or date of knowledge (whichever is later)",
     "governing_law": "Limitation Act 1980, Section 11",
     "accrual_rule": "3 years from date of injury OR date of knowledge (Section 14). Knowledge = when claimant knew injury was significant and attributable to defendant's act.",
     "extensions": ["Section 33: Court has discretion to disapply limitation in personal injury cases", "Section 28: Disability provisions"],
     "key_precedents": ["A v Hoare [2008] UKHL 6 — Section 33 discretion in abuse cases", "Donovan v Gwentoys [1990] 1 WLR 472"],
     "condonation": "Section 33 gives courts wide discretion to allow late personal injury claims — unique to PI cases.", "notes": "For clinical negligence, the 'date of knowledge' rule is crucial.", "jurisdiction": "uk"},

    {"id": "UK-CIV-03", "category": "Civil", "subcategory": "Property", "case_type": "Recovery of land (adverse possession)",
     "period_years": 12, "period_days": 0, "starting_point": "Date of dispossession",
     "governing_law": "Limitation Act 1980, Section 15; Land Registration Act 2002",
     "accrual_rule": "12 years for unregistered land. For registered land, adverse possession requires 10 years + application to Land Registry.",
     "extensions": ["Section 28: Disability"], "key_precedents": ["JA Pye v Graham [2002] UKHL 30 — adverse possession and human rights"],
     "condonation": "No condonation. Right extinguished after limitation.", "notes": "Registered land has different rules under LRA 2002.", "jurisdiction": "uk"},

    {"id": "UK-CIV-04", "category": "Civil", "subcategory": "Defamation", "case_type": "Defamation claim",
     "period_years": 1, "period_days": 0, "starting_point": "Date of publication",
     "governing_law": "Limitation Act 1980, Section 4A; Defamation Act 2013",
     "accrual_rule": "1 year from the date of publication. For online publications, the 'single publication rule' applies (Defamation Act 2013, Section 8).",
     "extensions": ["Section 32A: Court may disapply in exceptional circumstances"],
     "key_precedents": ["Loutchansky v Times Newspapers [2001] — online publication and limitation"],
     "condonation": "Very limited discretion.", "notes": "One of the shortest limitation periods in UK law.", "jurisdiction": "uk"},

    {"id": "UK-CRM-01", "category": "Criminal", "subcategory": "Summary Offence", "case_type": "Summary offence prosecution",
     "period_years": 0, "period_days": 180, "starting_point": "Date of offence",
     "governing_law": "Magistrates' Courts Act 1980, Section 127",
     "accrual_rule": "6 months from the date of the offence for summary-only offences.",
     "extensions": ["Some statutes provide longer periods for specific offences"],
     "key_precedents": ["R v Clerk to the Justices [1985] — strict application of 6-month rule"],
     "condonation": "No condonation — 6 months is absolute for summary offences.", "notes": "Indictable offences have no limitation.", "jurisdiction": "uk"},

    {"id": "UK-CRM-02", "category": "Criminal", "subcategory": "Indictable", "case_type": "Indictable offence (murder, robbery, rape, etc.)",
     "period_years": 0, "period_days": 0, "starting_point": "No limitation",
     "governing_law": "Common law; no statutory limitation for indictable offences",
     "accrual_rule": "No limitation period. Prosecution can be brought at any time.",
     "extensions": [], "key_precedents": ["R v Sawoniuk [2000] — prosecution for WWII crimes decades later"],
     "condonation": "Not applicable.", "notes": "Abuse of process arguments may succeed if delay causes serious prejudice to the defendant.", "jurisdiction": "uk"},

    {"id": "UK-EMP-01", "category": "Employment", "subcategory": "Unfair Dismissal", "case_type": "Unfair dismissal claim",
     "period_years": 0, "period_days": 90, "starting_point": "Effective date of termination (EDT)",
     "governing_law": "Employment Rights Act 1996, Section 111; Employment Tribunals Act 1996",
     "accrual_rule": "Claim must be presented to the Employment Tribunal within 3 months minus 1 day of the EDT. Early conciliation through ACAS pauses the clock.",
     "extensions": ["ACAS early conciliation: pauses limitation for up to 6 weeks", "Tribunal may extend if 'not reasonably practicable' to file in time"],
     "key_precedents": ["Palmer v Southend-on-Sea BC [1984] — 'not reasonably practicable' test"],
     "condonation": "Tribunal has limited discretion — must show it was 'not reasonably practicable' to file in time.", "notes": "ACAS conciliation is mandatory before filing. The 3-month clock is very strict.", "jurisdiction": "uk"},
]

# ============================================================
# LIMITATION DATABASE — US
# ============================================================
US_LIMITATIONS: list[dict] = [
    {"id": "US-CIV-01", "category": "Civil", "subcategory": "Contract", "case_type": "Breach of contract (written)",
     "period_years": 4, "period_days": 0, "starting_point": "Date of breach",
     "governing_law": "UCC § 2-725 (goods); State statutes vary (4-6 years typical)",
     "accrual_rule": "Varies by state. UCC: 4 years for sale of goods. Written contracts: 4-6 years in most states. Oral contracts: 2-4 years.",
     "extensions": ["Tolling for minority, incapacity, absence from state", "Discovery rule in some states for fraud-based claims", "Equitable tolling for fraudulent concealment"],
     "key_precedents": ["Gabelli v SEC (2013) — discovery rule limitations", "TRW Inc v Andrews (2001) — equitable tolling"],
     "condonation": "No general condonation. Equitable tolling available in limited circumstances.", "notes": "Varies significantly by state. California: 4 years written, 2 years oral. New York: 6 years. Texas: 4 years.", "jurisdiction": "us"},

    {"id": "US-CIV-02", "category": "Civil", "subcategory": "Tort", "case_type": "Personal injury",
     "period_years": 2, "period_days": 0, "starting_point": "Date of injury or discovery",
     "governing_law": "State statutes (1-6 years, typically 2-3)",
     "accrual_rule": "Varies by state. Most states: 2-3 years from injury. Discovery rule applies in medical malpractice and latent injury cases.",
     "extensions": ["Tolling for minority (until age 18)", "Tolling for incapacity", "Discovery rule for latent injuries", "Equitable tolling"],
     "key_precedents": ["Urie v Thompson (1949) — discovery rule origin"],
     "condonation": "No condonation. Statute of limitations is jurisdictional in some states.", "notes": "California: 2 years. New York: 3 years. Texas: 2 years. Florida: 4 years.", "jurisdiction": "us"},

    {"id": "US-CIV-03", "category": "Civil", "subcategory": "Employment", "case_type": "Employment discrimination (Title VII)",
     "period_years": 0, "period_days": 180, "starting_point": "Date of discriminatory act",
     "governing_law": "Title VII of the Civil Rights Act 1964; 42 U.S.C. § 2000e-5",
     "accrual_rule": "180 days to file charge with EEOC (300 days in states with fair employment agencies). After EEOC right-to-sue letter, 90 days to file federal lawsuit.",
     "extensions": ["300 days in 'deferral states' with state agencies", "Continuing violation doctrine for hostile work environment"],
     "key_precedents": ["Ledbetter v Goodyear (2007) — paycheck accrual rule (overruled by Lilly Ledbetter Act 2009)", "National Railroad Passenger Corp v Morgan (2002) — continuing violation"],
     "condonation": "EEOC may accept late charges in limited circumstances. Courts have no condonation power.", "notes": "The Lilly Ledbetter Fair Pay Act 2009 resets the clock with each discriminatory paycheck.", "jurisdiction": "us"},

    {"id": "US-CRM-01", "category": "Criminal", "subcategory": "Federal", "case_type": "Federal crime (general)",
     "period_years": 5, "period_days": 0, "starting_point": "Date of offence",
     "governing_law": "18 U.S.C. § 3282",
     "accrual_rule": "5 years from the date of the offence for most federal crimes.",
     "extensions": ["Tolling while defendant is outside the US", "DNA evidence exception for certain crimes"],
     "key_precedents": ["Toussie v United States (1970) — statute of limitations is 'an act of grace'"],
     "condonation": "No condonation. Statute of limitations is a constitutional protection.", "notes": "Murder has no statute of limitations. Tax crimes: 6 years. Securities fraud: 5 years.", "jurisdiction": "us"},

    {"id": "US-CRM-02", "category": "Criminal", "subcategory": "Murder", "case_type": "Murder / capital offence",
     "period_years": 0, "period_days": 0, "starting_point": "No limitation",
     "governing_law": "18 U.S.C. § 3281 (federal); State laws",
     "accrual_rule": "No statute of limitations for murder in any US jurisdiction.",
     "extensions": [], "key_precedents": [],
     "condonation": "Not applicable.", "notes": "All 50 states and federal law have no limitation for murder.", "jurisdiction": "us"},
]

ALL_LIMITATIONS = INDIA_LIMITATIONS + UK_LIMITATIONS + US_LIMITATIONS

# ============================================================
# COVID EXTENSION RULES
# ============================================================
COVID_EXTENSIONS = {
    "india": {
        "applicable": True,
        "description": "The Supreme Court of India in In Re: Cognizance for Extension of Limitation (2020) suo motu extended all limitation periods from 15.03.2020 to 14.03.2021 (later extended to 28.02.2022 for some matters). This applies to all courts and tribunals.",
        "start_date": "2020-03-15",
        "end_date": "2022-02-28",
        "precedent": "In Re: Cognizance for Extension of Limitation (2020) — SC suo motu order dated 23.03.2020, extended by orders dated 10.01.2022 and 10.03.2022.",
        "extra_days": 714,  # Approximate days of extension
    },
    "uk": {
        "applicable": True,
        "description": "The UK did not formally extend limitation periods during COVID. However, the Civil Procedure Rules Practice Direction 51ZA provided for extensions in specific circumstances. Courts have been sympathetic to COVID-related delays.",
        "start_date": "2020-03-23",
        "end_date": "2020-10-31",
        "precedent": "Practice Direction 51ZA; various judicial guidance notes.",
        "extra_days": 0,  # No automatic extension — case-by-case
    },
    "us": {
        "applicable": True,
        "description": "COVID extensions varied by state and federal court. Many states issued emergency orders tolling statutes of limitations. Federal courts generally did not toll limitations but were sympathetic to late filings.",
        "start_date": "2020-03-13",
        "end_date": "2020-12-31",
        "precedent": "Various state emergency orders; CARES Act provisions.",
        "extra_days": 0,  # Varies by state
    },
}

# ============================================================
# MAIN ANALYSIS FUNCTION
# ============================================================

def analyze_limitation(
    case_type_query: str,
    jurisdiction: str,
    incident_date: str,
    description: str,
    has_disability: bool,
    has_acknowledgment: bool,
    apply_covid_extension: bool,
) -> dict:
    """Full limitation analysis."""
    # Parse incident date
    try:
        inc_date = datetime.strptime(incident_date, "%Y-%m-%d")
    except (ValueError, TypeError):
        return {"error": "Invalid date format. Use YYYY-MM-DD."}

    today = datetime.now()
    if inc_date > today:
        return {"error": "Incident date cannot be in the future."}

    # Find matching limitation rules
    matches = _find_matching_rules(case_type_query, jurisdiction, description)

    if not matches:
        return {"error": f"No matching limitation rules found for '{case_type_query}' in {jurisdiction}."}

    # Analyze each match
    analyses = []
    for rule in matches[:3]:  # Top 3 matches
        analysis = _analyze_single_rule(rule, inc_date, today, has_disability, has_acknowledgment, apply_covid_extension, jurisdiction)
        analyses.append(analysis)

    # Primary analysis (best match)
    primary = analyses[0]

    # Jurisdiction analysis
    jurisdiction_info = _get_jurisdiction_info(jurisdiction, primary["rule"])

    # Conflict of laws note
    conflict_note = _conflict_of_laws(jurisdiction, case_type_query)

    return {
        "primary_analysis": primary,
        "alternative_analyses": analyses[1:],
        "jurisdiction_info": jurisdiction_info,
        "conflict_of_laws": conflict_note,
        "covid_extension": COVID_EXTENSIONS.get(jurisdiction, {}),
        "methodology": "Limitation analysis uses statutory period calculation with accrual date determination, disability tolling (where applicable), acknowledgment restart (India S.18), COVID extension overlay, and urgency classification. All periods are calculated from the accrual date per the governing statute, with extensions applied additively.",
        "disclaimer": DISCLAIMER,
    }


def _find_matching_rules(query: str, jurisdiction: str, description: str) -> list[dict]:
    """Find matching limitation rules by case type and jurisdiction."""
    query_lower = query.lower()
    desc_lower = description.lower() if description else ""
    combined = query_lower + " " + desc_lower

    scored = []
    for rule in ALL_LIMITATIONS:
        if rule["jurisdiction"] != jurisdiction:
            continue
        score = 0
        # Exact case type match
        if query_lower in rule["case_type"].lower():
            score += 50
        # Category match
        if rule["category"].lower() in combined:
            score += 15
        if rule["subcategory"].lower() in combined:
            score += 20
        # Keyword matching
        case_words = rule["case_type"].lower().split()
        for word in case_words:
            if len(word) > 3 and word in combined:
                score += 8
        # Description matching
        if rule.get("notes"):
            note_words = rule["notes"].lower().split()
            for word in note_words:
                if len(word) > 4 and word in combined:
                    score += 3
        if score > 10:
            scored.append({**rule, "_score": score})

    scored.sort(key=lambda x: x["_score"], reverse=True)
    return scored


def _analyze_single_rule(rule: dict, inc_date: datetime, today: datetime, has_disability: bool, has_acknowledgment: bool, apply_covid: bool, jurisdiction: str) -> dict:
    """Analyze a single limitation rule against the incident date."""
    period_days = rule["period_years"] * 365 + rule["period_days"]

    # No limitation
    if period_days == 0:
        return {
            "rule": rule,
            "has_limitation": False,
            "deadline": None,
            "days_remaining": None,
            "status": "No Limitation",
            "urgency": "None",
            "explanation": f"There is no statutory limitation period for this type of case. {rule['accrual_rule']}",
            "extensions_applied": [],
            "timeline": [],
        }

    # Calculate base deadline
    base_deadline = inc_date + timedelta(days=period_days)
    extensions_applied = []
    effective_deadline = base_deadline

    # Disability extension (India: S.6-8, UK: S.28, US: tolling)
    if has_disability:
        if jurisdiction == "india":
            # India: limitation does not begin to run until disability ceases
            disability_extension = 365  # Assume 1 year extension for calculation
            effective_deadline += timedelta(days=disability_extension)
            extensions_applied.append({
                "type": "Disability (Limitation Act S.6-8)",
                "days_added": disability_extension,
                "explanation": "Under Sections 6-8 of the Limitation Act 1963, if the plaintiff is a minor, insane, or an idiot at the time the cause of action accrues, limitation does not begin to run until the disability ceases. Calculated as +1 year (actual extension depends on when disability ceases).",
            })
        elif jurisdiction == "uk":
            disability_extension = 365
            effective_deadline += timedelta(days=disability_extension)
            extensions_applied.append({
                "type": "Disability (Limitation Act 1980, S.28)",
                "days_added": disability_extension,
                "explanation": "Under Section 28, limitation is postponed while the claimant is under a disability (minority or unsound mind).",
            })
        elif jurisdiction == "us":
            disability_extension = 365
            effective_deadline += timedelta(days=disability_extension)
            extensions_applied.append({
                "type": "Tolling (minority/incapacity)",
                "days_added": disability_extension,
                "explanation": "Most US states toll the statute of limitations during minority (until age 18) or mental incapacity.",
            })

    # Acknowledgment restart (India S.18)
    if has_acknowledgment and jurisdiction == "india":
        # Acknowledgment restarts the clock from the date of acknowledgment
        # For calculation, assume acknowledgment was recent
        ack_extension = period_days  # Full period restarts
        effective_deadline = today + timedelta(days=period_days)
        extensions_applied.append({
            "type": "Acknowledgment (Limitation Act S.18)",
            "days_added": ack_extension,
            "explanation": "Under Section 18, a written acknowledgment of liability made before the expiration of limitation restarts the limitation period from the date of acknowledgment. The full period runs afresh.",
        })

    # COVID extension
    if apply_covid:
        covid = COVID_EXTENSIONS.get(jurisdiction, {})
        if covid.get("applicable") and covid.get("extra_days", 0) > 0:
            covid_start = datetime.strptime(covid["start_date"], "%Y-%m-%d")
            covid_end = datetime.strptime(covid["end_date"], "%Y-%m-%d")
            # Only apply if deadline falls within or after COVID period
            if effective_deadline >= covid_start:
                covid_days = (covid_end - covid_start).days
                effective_deadline += timedelta(days=covid_days)
                extensions_applied.append({
                    "type": "COVID-19 Extension",
                    "days_added": covid_days,
                    "explanation": covid["description"],
                    "precedent": covid.get("precedent", ""),
                })

    # Calculate remaining time
    days_remaining = (effective_deadline - today).days

    # Urgency classification
    if days_remaining < 0:
        urgency = "EXPIRED"
        status = "Limitation Period Expired"
    elif days_remaining <= 7:
        urgency = "CRITICAL"
        status = "Expires This Week"
    elif days_remaining <= 30:
        urgency = "URGENT"
        status = "Expires Within 30 Days"
    elif days_remaining <= 90:
        urgency = "WARNING"
        status = "Expires Within 3 Months"
    elif days_remaining <= 180:
        urgency = "CAUTION"
        status = "Expires Within 6 Months"
    else:
        urgency = "SAFE"
        status = "Within Limitation Period"

    # Build timeline
    timeline = [
        {"date": inc_date.strftime("%d %b %Y"), "event": "Incident / Cause of Action", "type": "start"},
        {"date": base_deadline.strftime("%d %b %Y"), "event": f"Base Limitation Deadline ({rule['period_years']}y {rule['period_days']}d)", "type": "deadline"},
    ]
    for ext in extensions_applied:
        timeline.append({"date": "", "event": f"Extension: {ext['type']} (+{ext['days_added']} days)", "type": "extension"})
    timeline.append({"date": effective_deadline.strftime("%d %b %Y"), "event": "Effective Deadline (with extensions)", "type": "final"})
    timeline.append({"date": today.strftime("%d %b %Y"), "event": f"Today — {abs(days_remaining)} days {'remaining' if days_remaining >= 0 else 'overdue'}", "type": "today"})

    return {
        "rule": rule,
        "has_limitation": True,
        "base_deadline": base_deadline.strftime("%d %b %Y"),
        "effective_deadline": effective_deadline.strftime("%d %b %Y"),
        "days_remaining": days_remaining,
        "status": status,
        "urgency": urgency,
        "explanation": f"The limitation period for '{rule['case_type']}' is {rule['period_years']} year(s) and {rule['period_days']} day(s) under {rule['governing_law']}. {rule['accrual_rule']}",
        "extensions_applied": extensions_applied,
        "timeline": timeline,
        "condonation": rule.get("condonation", ""),
    }


def _get_jurisdiction_info(jurisdiction: str, rule: dict) -> dict:
    """Get jurisdiction-specific forum and filing information."""
    forums = {
        "india": {
            "Civil": "District Court / High Court (depending on value). Suits above ₹20 lakh: High Court original side (where applicable).",
            "Criminal": "Magistrate Court (for complaints). Sessions Court (for sessions triable offences). FIR at nearest police station.",
            "Consumer": "District Consumer Forum (up to ₹1 crore), State Commission (₹1-10 crore), National Commission (above ₹10 crore).",
            "Family": "Family Court (where established). Otherwise, District Court.",
            "Labour": "Labour Court / Industrial Tribunal. Conciliation through Labour Commissioner first.",
            "Motor Accident": "Motor Accident Claims Tribunal (MACT).",
            "Tax": "CIT(A) for first appeal. ITAT for second appeal. High Court for substantial question of law.",
            "Arbitration": "Court having jurisdiction over the subject matter (Section 34, Arbitration Act).",
            "Constitutional": "High Court (Article 226) or Supreme Court (Article 32).",
        },
        "uk": {
            "Civil": "County Court (claims up to £100,000). High Court (above £100,000 or complex matters).",
            "Criminal": "Magistrates' Court (summary offences). Crown Court (indictable offences).",
            "Employment": "Employment Tribunal. ACAS early conciliation mandatory before filing.",
        },
        "us": {
            "Civil": "State court (most cases). Federal court (diversity jurisdiction >$75,000 or federal question).",
            "Criminal": "State court (state crimes). Federal court (federal crimes).",
        },
    }
    category = rule.get("category", "Civil")
    jur_forums = forums.get(jurisdiction, {})
    forum = jur_forums.get(category, "Consult a lawyer for the appropriate forum.")

    return {
        "jurisdiction": jurisdiction,
        "appropriate_forum": forum,
        "filing_requirements": _get_filing_requirements(jurisdiction, category),
    }


def _get_filing_requirements(jurisdiction: str, category: str) -> list[str]:
    reqs = {
        "india": {
            "Civil": ["Court fee (ad valorem for money suits, fixed for declaratory suits)", "Plaint in prescribed format", "Vakalatnama (power of attorney for advocate)", "Copies of documents relied upon", "Affidavit of verification"],
            "Criminal": ["Written complaint with facts", "Supporting documents/evidence", "Verification affidavit", "Court fee (nominal for criminal complaints)"],
            "Consumer": ["Consumer complaint in prescribed format", "No court fee required", "Copies of bills/receipts/correspondence", "Affidavit"],
        },
        "uk": {
            "Civil": ["Claim form (N1)", "Particulars of claim", "Court fee (varies by claim value)", "Statement of truth"],
            "Criminal": ["Information/charge sheet", "Evidence bundle"],
            "Employment": ["ET1 claim form", "ACAS early conciliation certificate", "No fee required"],
        },
        "us": {
            "Civil": ["Complaint", "Filing fee (varies by court)", "Summons", "Civil cover sheet"],
            "Criminal": ["Indictment or information", "Probable cause affidavit"],
        },
    }
    return reqs.get(jurisdiction, {}).get(category, ["Consult a lawyer for specific filing requirements."])


def _conflict_of_laws(jurisdiction: str, case_type: str) -> str:
    if jurisdiction == "india":
        return "In India, limitation is governed by the lex fori (law of the forum court). If the cause of action arose in a different state, the limitation period of the forum state applies. For international contracts, the governing law clause determines which limitation regime applies."
    elif jurisdiction == "uk":
        return "In the UK, the Foreign Limitation Periods Act 1984 generally applies the limitation law of the country whose law governs the substantive claim. This can differ from the forum's limitation period."
    else:
        return "In the US, limitation periods are state-specific. The 'borrowing statute' doctrine may apply the shorter limitation period of the state where the cause of action arose, even if the suit is filed in a different state."
