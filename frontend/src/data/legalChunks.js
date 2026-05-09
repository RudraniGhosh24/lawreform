// Indian Legal Knowledge Base — Chunked for RAG retrieval
// Sources: legislative.gov.in, india.gov.in (Public Domain)

export const legalChunks = [
  // === RENT CONTROL ===
  {
    id: 'rent-1',
    source: 'West Bengal Premises Tenancy Act, 1997',
    section: 'Section 4 — Security Deposit',
    text: 'A landlord shall not demand or receive any premium or security deposit exceeding three months rent from a tenant. Any amount collected in excess of three months rent as security deposit shall be refundable to the tenant on demand.',
    keywords: ['landlord', 'deposit', 'security', 'rent', 'refund', 'return', 'tenant', 'premium', 'three months'],
  },
  {
    id: 'rent-2',
    source: 'West Bengal Premises Tenancy Act, 1997',
    section: 'Section 6 — Eviction Protection',
    text: 'No tenant shall be evicted from any premises except in execution of an order made by the Rent Controller. The landlord must prove valid grounds such as non-payment of rent for two consecutive months, subletting without consent, causing damage to property, or bona fide personal need.',
    keywords: ['eviction', 'evict', 'thrown out', 'vacate', 'rent controller', 'court order', 'landlord'],
  },
  {
    id: 'rent-3',
    source: 'West Bengal Premises Tenancy Act, 1997',
    section: 'Section 15 — Essential Services',
    text: 'The landlord shall not cut off or withhold any essential service including water supply, electricity, or sanitary facilities enjoyed by the tenant. Contravention of this provision is punishable with imprisonment up to one year or fine or both.',
    keywords: ['water', 'electricity', 'cut off', 'essential services', 'sanitary', 'landlord', 'punishable'],
  },
  {
    id: 'rent-4',
    source: 'West Bengal Premises Tenancy Act, 1997',
    section: 'Section 9 — Rent Receipt',
    text: 'Every tenant is entitled to obtain a written receipt for rent paid. If the landlord refuses to accept rent, the tenant may deposit the rent with the Rent Controller. Such deposit shall be deemed as payment of rent to the landlord.',
    keywords: ['receipt', 'rent', 'deposit', 'rent controller', 'refuse', 'payment'],
  },

  // === CODE ON WAGES ===
  {
    id: 'wages-1',
    source: 'Code on Wages, 2019',
    section: 'Section 6 — Minimum Wage',
    text: 'Every employer shall pay to every employee wages not less than the minimum rate of wages as fixed by the appropriate Government. This applies to all workers including daily-wage, contract, part-time, and domestic workers. No employer shall pay below the floor wage fixed by the Central Government.',
    keywords: ['minimum wage', 'salary', 'pay', 'employer', 'worker', 'wages', 'daily wage', 'domestic worker'],
  },
  {
    id: 'wages-2',
    source: 'Code on Wages, 2019',
    section: 'Section 17 — Time of Payment',
    text: 'Wages shall be paid before the expiry of the seventh day of the following month in case of monthly wages. For daily wage workers, wages must be paid at the end of the same day or before the next working day. For weekly wage workers, before the last working day of the week.',
    keywords: ['payment', 'time', 'delay', 'salary', 'wages', 'monthly', 'daily', 'seventh day', 'not paid'],
  },
  {
    id: 'wages-3',
    source: 'Code on Wages, 2019',
    section: 'Section 18 — Deductions',
    text: 'No deduction shall be made from wages except those authorized under this Code including income tax, provident fund, court-ordered deductions, and absence from duty. Total deductions in any wage period shall not exceed fifty percent of the wages.',
    keywords: ['deduction', 'cut', 'salary', 'wages', 'fifty percent', 'unauthorized'],
  },
  {
    id: 'wages-4',
    source: 'Code on Wages, 2019',
    section: 'Section 45 — Penalty',
    text: 'Any employer who pays less than the minimum wage shall be punishable with fine up to fifty thousand rupees for first offence. For subsequent offence, fine up to one lakh rupees or imprisonment up to three months or both.',
    keywords: ['penalty', 'fine', 'punishment', 'employer', 'minimum wage', 'violation', 'complaint'],
  },

  // === RTI ACT ===
  {
    id: 'rti-1',
    source: 'Right to Information Act, 2005',
    section: 'Section 3 — Right to Information',
    text: 'Subject to the provisions of this Act, all citizens shall have the right to information. Every public authority shall provide information to any person making a request under this Act. No citizen is required to give any reason for requesting information.',
    keywords: ['RTI', 'right to information', 'citizen', 'public authority', 'request', 'information', 'reason'],
  },
  {
    id: 'rti-2',
    source: 'Right to Information Act, 2005',
    section: 'Section 7 — Time Limit',
    text: 'The Public Information Officer shall provide information within thirty days of receipt of the request. Where the information sought concerns the life or liberty of a person, it shall be provided within forty-eight hours.',
    keywords: ['thirty days', 'time limit', 'response', 'RTI', 'forty-eight hours', 'life', 'liberty', 'deadline'],
  },
  {
    id: 'rti-3',
    source: 'Right to Information Act, 2005',
    section: 'Section 6 — Application Fee',
    text: 'A request for obtaining information shall be accompanied by a fee of ten rupees. Persons below the poverty line shall be exempted from payment of fee. Application may be made in writing or through electronic means including online at rtionline.gov.in.',
    keywords: ['fee', 'ten rupees', 'RTI', 'application', 'BPL', 'poverty', 'online', 'rtionline', 'how to file'],
  },
  {
    id: 'rti-4',
    source: 'Right to Information Act, 2005',
    section: 'Section 19 — Appeal',
    text: 'Any person who does not receive a decision within the specified time or is aggrieved by a decision may file an appeal to the First Appellate Authority within thirty days. No fee is required for the first appeal. A second appeal lies to the Central or State Information Commission.',
    keywords: ['appeal', 'first appeal', 'second appeal', 'information commission', 'RTI', 'no response', 'aggrieved'],
  },

  // === MGNREGA ===
  {
    id: 'mgnrega-1',
    source: 'MGNREGA, 2005',
    section: 'Section 3 — Guarantee of Employment',
    text: 'Every rural household whose adult members volunteer to do unskilled manual work shall be entitled to not less than one hundred days of employment in a financial year. This is a legal right guaranteed by the State.',
    keywords: ['MGNREGA', 'hundred days', '100 days', 'employment', 'rural', 'guarantee', 'work', 'job'],
  },
  {
    id: 'mgnrega-2',
    source: 'MGNREGA, 2005',
    section: 'Section 7 — Unemployment Allowance',
    text: 'If an applicant is not provided employment within fifteen days of receipt of application, the applicant shall be entitled to a daily unemployment allowance. The allowance shall be one-fourth of the wage rate for the first thirty days and one-half thereafter.',
    keywords: ['unemployment', 'allowance', 'fifteen days', 'MGNREGA', 'not provided', 'denied', 'work'],
  },
  {
    id: 'mgnrega-3',
    source: 'MGNREGA, 2005',
    section: 'Section 4 — Job Card',
    text: 'The Gram Panchayat shall register every household that applies and issue a Job Card within fifteen days. The Job Card shall be issued free of cost. No person shall charge any fee for issuance of Job Card.',
    keywords: ['job card', 'gram panchayat', 'register', 'free', 'fifteen days', 'MGNREGA', 'apply'],
  },

  // === DOMESTIC VIOLENCE ===
  {
    id: 'dv-1',
    source: 'Protection of Women from Domestic Violence Act, 2005',
    section: 'Section 3 — Definition of Domestic Violence',
    text: 'Domestic violence includes any act, omission or commission that harms or injures or endangers the health, safety, life, limb or well-being of the aggrieved person. It includes physical abuse, sexual abuse, verbal and emotional abuse, and economic abuse.',
    keywords: ['domestic violence', 'abuse', 'physical', 'sexual', 'verbal', 'emotional', 'economic', 'harm'],
  },
  {
    id: 'dv-2',
    source: 'Protection of Women from Domestic Violence Act, 2005',
    section: 'Section 17 — Right to Residence',
    text: 'Every woman in a domestic relationship shall have the right to reside in the shared household, whether or not she has any right, title or beneficial interest in the same. The respondent shall not evict or exclude the aggrieved person from the shared household.',
    keywords: ['residence', 'shared household', 'right to live', 'evict', 'thrown out', 'domestic violence', 'woman'],
  },
  {
    id: 'dv-3',
    source: 'Protection of Women from Domestic Violence Act, 2005',
    section: 'Section 4 — Information and Assistance',
    text: 'Any person who has reason to believe that domestic violence has been committed may inform the Protection Officer. The aggrieved person may contact Women Helpline 181 (toll-free, 24/7) or Police at 100. Filing a complaint is free and no lawyer is required.',
    keywords: ['helpline', '181', 'police', '100', 'protection officer', 'complaint', 'domestic violence', 'help', 'free'],
  },

  // === CONSUMER PROTECTION ===
  {
    id: 'consumer-1',
    source: 'Consumer Protection Act, 2019',
    section: 'Section 2(7) — Consumer Rights',
    text: 'Every consumer has the right to be protected against marketing of goods and services which are hazardous to life and property, the right to be informed about quality and price, the right to be assured access to goods at competitive prices, and the right to seek redressal against unfair trade practices.',
    keywords: ['consumer', 'rights', 'goods', 'services', 'quality', 'price', 'redressal', 'unfair', 'hazardous'],
  },
  {
    id: 'consumer-2',
    source: 'Consumer Protection Act, 2019',
    section: 'Section 34 — Consumer Disputes Redressal Forum',
    text: 'Complaints relating to goods or services valued up to one crore rupees shall be filed before the District Consumer Disputes Redressal Forum. Complaints may also be filed online at edaakhil.nic.in. The National Consumer Helpline number is 1800-11-4000 (toll-free).',
    keywords: ['complaint', 'consumer forum', 'district', 'online', 'edaakhil', 'helpline', '1800', 'file'],
  },

  // === LEGAL SERVICES ===
  {
    id: 'legal-1',
    source: 'Legal Services Authorities Act, 1987',
    section: 'Section 12 — Entitlement to Legal Services',
    text: 'Every person who is a member of Scheduled Caste or Scheduled Tribe, a victim of trafficking, a woman or child, a person with disability, an industrial workman, or a person with annual income less than the prescribed amount shall be entitled to free legal services.',
    keywords: ['free legal aid', 'SC', 'ST', 'woman', 'child', 'disability', 'poor', 'income', 'entitled', 'DLSA'],
  },
  {
    id: 'legal-2',
    source: 'Legal Services Authorities Act, 1987',
    section: 'Section 7 — District Legal Services Authority',
    text: 'There shall be a District Legal Services Authority in every district to provide free legal services. The DLSA is located in the district court complex. Citizens may contact NALSA helpline 15100 (toll-free) for assistance. Lok Adalat provides free dispute resolution with no court fee.',
    keywords: ['DLSA', 'district', 'legal services', 'free', 'NALSA', '15100', 'lok adalat', 'court', 'lawyer'],
  },

  // === DOMESTIC WORKERS ===
  {
    id: 'domestic-1',
    source: 'Code on Wages 2019 + Unorganised Workers Social Security Act 2008',
    section: 'Domestic Workers Coverage',
    text: 'Domestic workers are covered under the Code on Wages 2019 for minimum wages. The Sexual Harassment of Women at Workplace Act 2013 applies to domestic workers as a household is considered a workplace. Workers may register at eshram.gov.in for social security benefits including PM Shram Yogi Maan-dhan pension scheme.',
    keywords: ['domestic worker', 'maid', 'household', 'minimum wage', 'sexual harassment', 'eshram', 'pension', 'social security'],
  },
]
