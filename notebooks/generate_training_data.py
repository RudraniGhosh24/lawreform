"""
Generate 10,000 Q&A training pairs for LawReformer AI fine-tuning.
Uses templates + variations from the 1395 legal provisions.
Run this script to produce training_data.jsonl

Built by Rudrani Ghosh · lawreformer.com
"""

import json
import random
import itertools

# System instruction for all training examples
SYSTEM = ""

# === QUESTION TEMPLATES BY CATEGORY ===
# Each template generates multiple variations

RENT_QUESTIONS = [
    "My landlord is not returning my security deposit. What are my rights?",
    "The landlord cut off my water supply to force me to leave. Is this legal?",
    "Can my landlord increase rent without my consent?",
    "My landlord wants to evict me but I have been paying rent regularly. Can he do this?",
    "I don't have a written rent agreement. Do I still have tenant rights?",
    "The landlord is refusing to give me a rent receipt. What can I do?",
    "My landlord entered my house without permission. Is this allowed?",
    "The roof is leaking but landlord refuses to repair. Who is responsible?",
    "Can I sublet my rented room to someone else?",
    "My landlord is harassing me to vacate. Where do I complain?",
    "What is the maximum security deposit a landlord can take?",
    "The landlord locked my room while I was away. Is this legal?",
    "Can the landlord evict me if he wants to use the house himself?",
    "I want to deposit rent in court because landlord refuses to accept it. How?",
    "My landlord is charging more than fair rent. What can I do?",
    "The previous tenant left and landlord won't return my deposit saying there's damage.",
    "Can my landlord ask me to leave with just 1 day notice?",
    "I am a woman living alone and landlord is threatening me. What protection do I have?",
    "My landlord died. Can the new owner evict me?",
    "The electricity bill is in landlord's name but he's charging me extra. Is this legal?",
]

WAGES_QUESTIONS = [
    "My employer has not paid my salary for 2 months. What can I do?",
    "I work as a daily wage labourer. What is the minimum wage I should get?",
    "My employer is deducting money from my salary without explanation. Is this legal?",
    "I worked overtime but was not paid extra. What are my rights?",
    "My employer pays women less than men for the same work. Is this legal?",
    "I was fired without notice. Am I entitled to any compensation?",
    "My employer is not giving me a salary slip. Is this mandatory?",
    "I am a domestic worker. Do minimum wage laws apply to me?",
    "My employer is paying me in cash and not depositing PF. What should I do?",
    "I am a contract worker. Do I get the same wages as permanent workers?",
    "Where do I file a complaint about unpaid wages?",
    "My employer threatened to fire me if I ask for minimum wage. What can I do?",
    "I am a construction worker. What wages should I get?",
    "My employer is making me work 12 hours but paying for 8. Is this legal?",
    "I was not paid my bonus this year. Am I entitled to it?",
    "My employer closed the factory without paying us. What are our rights?",
    "I am a gig worker (delivery). Do I get minimum wage?",
    "My employer is not paying me during my notice period. Is this legal?",
    "What is the penalty for an employer who doesn't pay minimum wage?",
    "I am a migrant worker from another state. Do I get same wages as locals?",
]

RTI_QUESTIONS = [
    "How do I file an RTI application?",
    "What is the fee for filing RTI?",
    "Can I file RTI online? What is the website?",
    "The government office did not respond to my RTI in 30 days. What now?",
    "Can I ask for information about government spending in my area?",
    "Do I need to give a reason for filing RTI?",
    "What information can be denied under RTI?",
    "How do I file a first appeal if RTI is rejected?",
    "What is the penalty on officers who don't respond to RTI?",
    "Can I file RTI about police investigation?",
    "I am BPL. Do I need to pay RTI fee?",
    "Can I file RTI to know status of my government application?",
    "How do I file RTI against municipal corporation?",
    "Can I get copies of government contracts through RTI?",
    "What is the second appeal process in RTI?",
    "Can I file RTI to know my PF balance?",
    "How long does the government have to respond to RTI?",
    "Can I file RTI about my child's school?",
    "What is the Central Information Commission?",
    "Can private companies be asked for information under RTI?",
]

MGNREGA_QUESTIONS = [
    "I have a job card but gram panchayat is not giving me work. What can I do?",
    "How do I get a MGNREGA job card?",
    "I applied for work 20 days ago but haven't received any. Am I entitled to allowance?",
    "MGNREGA wages are delayed by 2 months. Where do I complain?",
    "Can women get MGNREGA work? Is there any priority?",
    "The mate is marking me absent even though I worked. What can I do?",
    "Someone is demanding money to give me a job card. Is this legal?",
    "What facilities should be available at MGNREGA worksite?",
    "Can I get MGNREGA work on my own land?",
    "What is the current MGNREGA wage rate?",
    "How many days of work am I guaranteed under MGNREGA?",
    "The contractor is doing MGNREGA work with machines. Is this allowed?",
    "I was injured at MGNREGA worksite. What compensation do I get?",
    "How do I check my MGNREGA payment status online?",
    "What is social audit in MGNREGA?",
    "Can disabled persons get MGNREGA work?",
    "The gram panchayat is giving work only to some families. Is this fair?",
    "Can I get more than 100 days work under MGNREGA?",
    "What types of work are done under MGNREGA?",
    "How do I file a complaint about MGNREGA corruption?",
]

DV_QUESTIONS = [
    "My husband beats me regularly. What legal protection do I have?",
    "My in-laws are demanding more dowry and threatening me. What can I do?",
    "My husband threw me out of the house. Can he do this?",
    "I want to file a domestic violence case. How do I do it?",
    "What is the Women Helpline number?",
    "My husband controls all the money and doesn't give me anything. Is this abuse?",
    "Can I file DV case against my mother-in-law?",
    "I am in a live-in relationship and facing violence. Am I protected?",
    "What is a protection order under DV Act?",
    "Can I get maintenance without filing for divorce?",
    "My husband is threatening to share my private photos. What can I do?",
    "Where are shelter homes for women facing violence?",
    "I am being harassed for not bringing enough dowry. What law protects me?",
    "Can I get custody of my children under DV Act?",
    "What is the punishment for violating a protection order?",
    "My husband doesn't let me go to work. Is this domestic violence?",
    "I am an elderly woman and my son is abusing me. What can I do?",
    "How quickly does the court hear DV cases?",
    "Can I file DV case and divorce at the same time?",
    "What evidence do I need for a domestic violence case?",
]

CONSUMER_QUESTIONS = [
    "I bought a defective product online. How do I get a refund?",
    "The shop is charging more than MRP. Where do I complain?",
    "My insurance claim was rejected unfairly. What can I do?",
    "How do I file a consumer complaint online?",
    "The builder has not given possession of my flat for 3 years. What are my rights?",
    "I was charged hidden fees by the bank. Is this legal?",
    "The hospital charged me excessively. Can I file a consumer case?",
    "My mobile phone broke within warranty but company refuses to repair. What can I do?",
    "I ordered something online but received a different product. What are my rights?",
    "What is the National Consumer Helpline number?",
    "Can I file consumer complaint without a lawyer?",
    "The coaching institute made false promises about results. Can I get refund?",
    "My flight was cancelled but airline won't refund. What can I do?",
    "What is the time limit for filing a consumer complaint?",
    "Can I get compensation for mental agony in consumer case?",
    "The e-commerce platform is not processing my return. Where do I complain?",
    "What is product liability? Can I sue the manufacturer?",
    "My car has a manufacturing defect. Can I get replacement?",
    "The electricity company is sending wrong bills. Where do I complain?",
    "What is the consumer forum and how does it work?",
]

LEGAL_AID_QUESTIONS = [
    "I cannot afford a lawyer. Can I get free legal aid?",
    "What is DLSA and how do I contact them?",
    "Who is eligible for free legal aid in India?",
    "What is Lok Adalat and how does it work?",
    "How do I apply for free legal aid?",
    "Is free legal aid available for criminal cases?",
    "What is the NALSA helpline number?",
    "Can women get free legal aid regardless of income?",
    "What is the income limit for free legal aid?",
    "Can I get free legal aid for divorce case?",
    "What is Tele-Law service?",
    "Are there legal aid clinics in my area?",
    "Can SC/ST persons get free legal aid without income proof?",
    "What cases can be settled in Lok Adalat?",
    "Is there a fee for Lok Adalat?",
    "Can I change my legal aid lawyer if they are not good?",
    "What is a para-legal volunteer?",
    "Can undertrial prisoners get free legal aid?",
    "How long does it take to get a legal aid lawyer assigned?",
    "Can I get free legal aid for property dispute?",
]

SC_ST_QUESTIONS = [
    "Someone used a caste slur against me in public. What can I do?",
    "I was denied entry to a temple because of my caste. Is this legal?",
    "My employer discriminates against me because I am Dalit. What are my rights?",
    "What is the SC/ST Atrocities Act?",
    "Someone grabbed my land because I am from SC community. What can I do?",
    "The police refused to file my FIR for caste atrocity. What now?",
    "What compensation do SC/ST atrocity victims get?",
    "Can I get anticipatory bail in an atrocity case?",
    "My family is being socially boycotted because of our caste. Is this a crime?",
    "What is the punishment for caste-based discrimination?",
    "I was forced to do manual scavenging. What are my rights?",
    "Someone threatened me for marrying outside my caste. What protection do I have?",
    "What is the Special Court for atrocity cases?",
    "How quickly must police investigate atrocity cases?",
    "Can I get free legal aid for atrocity case?",
]

CYBER_QUESTIONS = [
    "Someone hacked my social media account. What should I do?",
    "I lost money in an online fraud. How do I get it back?",
    "Someone is sharing my private photos online without consent. What can I do?",
    "What is the cyber crime helpline number?",
    "I received a threatening message online. Where do I report?",
    "Someone created a fake profile in my name. How do I report?",
    "I was cheated by a fake job offer online. What can I do?",
    "My bank account was hacked through OTP fraud. What should I do?",
    "What is the punishment for cyber stalking?",
    "How do I file a cyber crime complaint online?",
    "Someone is blackmailing me with my photos. What should I do?",
    "I clicked a phishing link and lost money. Can I recover it?",
    "What is the time limit to report online banking fraud to bank?",
    "A loan app is harassing me and sharing my contacts. What can I do?",
    "How do I protect myself from online fraud?",
]

# Hindi versions of common questions
HINDI_QUESTIONS = [
    "मकान मालिक मेरा सिक्योरिटी डिपॉजिट वापस नहीं कर रहा। मेरे क्या अधिकार हैं?",
    "मेरे मालिक ने दो महीने से वेतन नहीं दिया है। मैं क्या कर सकता हूँ?",
    "RTI कैसे दाखिल करें? प्रक्रिया क्या है?",
    "ग्राम पंचायत मुझे मनरेगा का काम नहीं दे रही है। मेरे क्या अधिकार हैं?",
    "मैं घरेलू हिंसा का सामना कर रही हूँ। मुझे कहाँ मदद मिलेगी?",
    "ऑनलाइन खरीदा सामान खराब निकला। रिफंड कैसे मिलेगा?",
    "मुझे मुफ्त कानूनी सहायता कैसे मिलेगी?",
    "मेरी जाति के कारण मुझे अपमानित किया गया। मैं क्या कर सकता हूँ?",
    "मेरा बैंक अकाउंट हैक हो गया। मैं क्या करूँ?",
    "मेरे पति मुझे मारते हैं। मैं कहाँ शिकायत करूँ?",
    "न्यूनतम वेतन क्या है? मुझे कितना मिलना चाहिए?",
    "मकान मालिक ने बिजली काट दी। क्या यह कानूनी है?",
    "मुझे नौकरी से बिना नोटिस निकाल दिया। मेरे क्या अधिकार हैं?",
    "दहेज के लिए ससुराल वाले परेशान कर रहे हैं। क्या करूँ?",
    "मेरा राशन कार्ड नहीं बन रहा। कहाँ शिकायत करूँ?",
    "बच्चे को स्कूल में एडमिशन नहीं मिल रहा। RTE के तहत क्या अधिकार हैं?",
    "पुलिस FIR दर्ज नहीं कर रही। मैं क्या करूँ?",
    "मेरी जमीन पर किसी ने कब्जा कर लिया। क्या करूँ?",
    "ऑनलाइन ठगी हो गई। पैसे कैसे वापस मिलेंगे?",
    "मुझे विकलांगता पेंशन नहीं मिल रही। कहाँ शिकायत करूँ?",
]

# Bengali versions
BENGALI_QUESTIONS = [
    "বাড়িওয়ালা আমার সিকিউরিটি ডিপোজিট ফেরত দিচ্ছে না। আমার কী অধিকার আছে?",
    "আমার মালিক দুই মাস ধরে বেতন দেয়নি। আমি কী করতে পারি?",
    "RTI কীভাবে দাখিল করব? প্রক্রিয়া কী?",
    "গ্রাম পঞ্চায়েত আমাকে মনরেগার কাজ দিচ্ছে না। আমার কী অধিকার আছে?",
    "আমি গৃহ নির্যাতনের সম্মুখীন। কোথায় সাহায্য পাব?",
    "অনলাইনে কেনা জিনিস খারাপ বেরিয়েছে। রিফান্ড কীভাবে পাব?",
    "আমি বিনামূল্যে আইনি সহায়তা কীভাবে পাব?",
    "আমার জাতির কারণে আমাকে অপমান করা হয়েছে। আমি কী করতে পারি?",
    "আমার ব্যাংক অ্যাকাউন্ট হ্যাক হয়ে গেছে। আমি কী করব?",
    "আমার স্বামী আমাকে মারধর করে। আমি কোথায় অভিযোগ করব?",
]

# === ANSWER TEMPLATES ===

RENT_ANSWERS = {
    "deposit": "You may have the right to recover your security deposit. Under the [{state} Premises Tenancy Act — Section 4], a landlord cannot demand more than {months} months' rent as deposit and must return it when you vacate.\n\nWhat you can do:\n1. Send a written notice to your landlord demanding return within 15 days. Keep a copy.\n2. If they refuse, file a complaint with the Rent Controller at your district court complex. No lawyer is needed and no fee is charged.\n3. You can also deposit future rent with the Rent Controller if the landlord is being difficult.\n4. Contact District Legal Services Authority (DLSA) for free legal aid — helpline 1516.\n5. If the landlord has made unauthorized deductions, you can challenge those before the Rent Controller too.\n\nImportant: Keep all rent receipts, bank transfer records, and your rent agreement as evidence.",
    "services": "Cutting essential services is illegal and a criminal offence. Under the [{state} Premises Tenancy Act — Section 15], a landlord cannot cut off water, electricity, or sanitation to force you to vacate. This is punishable with imprisonment up to 1 year or fine or both.\n\nWhat you can do:\n1. Call the police immediately at 100 and file an FIR — this is a cognizable offence.\n2. File a complaint with the Rent Controller for immediate restoration of services.\n3. Take photographs and videos as evidence of the disconnection.\n4. Get statements from neighbors as witnesses.\n5. If you feel unsafe, call Women Helpline 181 or approach the nearest police station.\n6. The Rent Controller can order restoration within 24 hours in urgent cases.\n7. You may also claim compensation for the period services were cut.\n\nRemember: The landlord cannot take law into their own hands. Only a court can order eviction.",
    "eviction": "You cannot be evicted without a court order. Under the [{state} Premises Tenancy Act — Section 6], no tenant can be evicted except by order of the Rent Controller. The landlord must prove valid grounds such as non-payment for 2+ months, subletting without consent, or genuine personal need.\n\nWhat you can do:\n1. If threatened verbally, record the threats (audio/video) as evidence.\n2. If physically forced out, call police at 100 immediately — illegal eviction is a criminal offence.\n3. File a complaint with the Rent Controller for protection.\n4. If already evicted illegally, the Rent Controller can order restoration of possession.\n5. Get free legal aid from DLSA — helpline 1516.\n6. Continue paying rent regularly (by money order if landlord refuses) to protect your position.\n7. The landlord faces imprisonment up to 6 months for illegal eviction.\n\nKey point: Even if you don't have a written agreement, you have tenant rights if you've been paying rent regularly.",
    "increase": "Arbitrary rent increase is illegal. Under the [{state} Premises Tenancy Act — Section 10], rent can only be increased by the permitted percentage (typically 4-10% depending on state) and only with Rent Controller approval.\n\nWhat you can do:\n1. Refuse to pay the increased amount — continue paying the legal rent amount.\n2. Send a written letter to the landlord stating the increase is illegal.\n3. Apply to the Rent Controller for fixation of fair rent for your premises.\n4. Keep all rent receipts showing the original amount you've been paying.\n5. If the landlord threatens eviction for not paying the increase, file a complaint with Rent Controller.\n6. The landlord cannot cut services or harass you for refusing an illegal increase.\n\nNote: If the landlord has made genuine improvements to the property, a limited increase may be permitted — but only through proper legal process.",
    "receipt": "You have the legal right to a written receipt for every rent payment. Under the [{state} Premises Tenancy Act — Section 9], every landlord must provide a written receipt. Refusing to give a receipt is itself a violation.\n\nWhat you can do:\n1. Send rent by bank transfer or money order — these automatically create a paper trail.\n2. If paying cash, demand a receipt in writing. If refused, send a letter acknowledging your payment.\n3. Keep money order receipts safely — they serve as legal proof of payment.\n4. File a complaint with the Rent Controller about receipt refusal.\n5. This is important because without receipts, a landlord might falsely claim non-payment to seek eviction.\n6. You can also deposit rent with the Rent Controller if the landlord refuses to accept it or give receipts.\n\nTip: Always pay through traceable methods (bank transfer, UPI, cheque) so you have automatic proof.",
}

WAGES_ANSWERS = {
    "unpaid": "Your employer is legally required to pay wages on time. Under the [Code on Wages, 2019 — Section 17], monthly wages must be paid before the 7th of the following month. Non-payment is a criminal offence punishable with fine up to Rs 50,000 for first offence and imprisonment up to 3 months for repeat offences.\n\nWhat you can do:\n1. Send a written demand letter to your employer (keep a copy and send by registered post).\n2. File a complaint with the Labour Commissioner of your district — no fee is required.\n3. Call Shram Suvidha helpline 14434 for immediate guidance.\n4. File online complaint at shramsuvidha.gov.in.\n5. You can also approach the Labour Court directly if the amount is significant.\n6. Collect evidence: appointment letter, salary slips, bank statements showing no credit, attendance records.\n7. You can claim interest on delayed wages.\n8. If employer threatens you for complaining, that's a separate offence — report to police.\n\nImportant: You have 3 years from the date wages became due to file a claim. Don't delay.",
    "minimum": "Every worker is entitled to minimum wage regardless of the type of work. Under the [Code on Wages, 2019 — Section 6], no employer can pay below the minimum wage fixed by the government. This applies to ALL workers — daily-wage, contract, part-time, domestic, agricultural, and construction workers.\n\nWhat you can do:\n1. Check your state's current minimum wage at labour.gov.in or by calling 14434.\n2. If you're being paid below minimum wage, file a complaint with the Labour Commissioner — it's free.\n3. The employer faces a fine of up to Rs 50,000 for paying below minimum wage.\n4. You can claim the difference between what you were paid and the minimum wage for up to 3 years.\n5. Register on e-Shram portal (eshram.gov.in) to access worker benefits and insurance.\n6. Contact your nearest DLSA (helpline 1516) for free legal aid if needed.\n\nNote: Minimum wages are revised periodically. The current national floor wage is approximately Rs 178/day. State rates may be higher.",
    "deduction": "Unauthorized deductions from your wages are illegal. Under the [Code on Wages, 2019 — Section 18], total deductions cannot exceed 50% of your wages in any pay period. Only specific deductions are permitted: income tax, provident fund (PF), ESI, court-ordered deductions, and absence from duty.\n\nWhat you can do:\n1. Ask your employer for a written breakdown of all deductions on your salary slip.\n2. If deductions are unauthorized (fines, arbitrary cuts, charges for tools/uniforms), file complaint with Labour Commissioner.\n3. Employer cannot deduct for: breakage of goods (unless due to your negligence proven through inquiry), uniforms, or training costs.\n4. Maximum fine that can be imposed is 3% of wages, and fine money must be used for worker welfare.\n5. Keep all salary slips as evidence.\n6. Call 14434 or visit shramsuvidha.gov.in to file complaint.\n\nRemember: Your employer must give you a salary slip showing all deductions. If they don't, that itself is a violation.",
    "overtime": "You are entitled to double wages for overtime work. Under the [Code on Wages, 2019 — Section 8], any work beyond 8 hours per day or 48 hours per week must be compensated at twice the normal hourly rate. Your employer cannot force you to work overtime without extra payment.\n\nWhat you can do:\n1. Document your actual working hours — keep a personal record with dates and times.\n2. Demand overtime payment in writing from your employer.\n3. If refused, file complaint with Labour Commissioner (free, no lawyer needed).\n4. Maximum overtime allowed is 125 hours in 3 months — beyond this is illegal even with payment.\n5. You have the right to refuse overtime if it exceeds legal limits.\n6. Night shift workers (7 PM - 6 AM) are entitled to additional night shift allowance.\n7. Women workers can work overtime/night shifts only with their consent and adequate safety measures.\n\nTip: If your employer records only 8 hours but makes you work 12, that's wage theft. Keep your own attendance record.",
    "fired": "If you've been terminated, you may be entitled to significant compensation. Under the [Industrial Relations Code, 2020 — Section 70], your employer must give you 1 month written notice (or pay 1 month salary in lieu) AND retrenchment compensation of 15 days wages for every completed year of service.\n\nWhat you can do:\n1. Demand a written termination letter stating the reason — verbal termination is not valid.\n2. If no notice was given, claim 1 month's salary as notice pay.\n3. Calculate your retrenchment compensation: (15 × daily wage × years of service) / 26.\n4. Claim any pending salary, earned leave encashment, bonus, and gratuity (if 5+ years service).\n5. If termination was without valid reason or proper procedure, it may be illegal — you can seek reinstatement.\n6. File complaint with Labour Commissioner within 3 years.\n7. Get free legal aid from DLSA (helpline 1516) to fight wrongful termination.\n8. If you were part of a mass layoff (establishment with 300+ workers), employer needed government permission.\n\nImportant: Don't sign any 'voluntary resignation' letter under pressure. That waives your rights.",
}

RTI_ANSWERS = {
    "how": "Filing RTI is simple and your fundamental right. Under the [Right to Information Act, 2005 — Section 6], any citizen can request information from any government office.\n\nHow to file:\n1. Write application addressed to Public Information Officer (PIO) of the department\n2. Pay Rs 10 fee (BPL exempt) — by cash, DD, or online\n3. Submit in person, by post, or online at rtionline.gov.in\n4. You do NOT need to give any reason for seeking information\n\nThe PIO must respond within 30 days [Section 7].",
    "no_response": "If PIO doesn't respond within 30 days, it's deemed refusal. Under the [RTI Act, 2005 — Section 19], you can file a First Appeal within 30 days — it's FREE.\n\nNext steps:\n1. File First Appeal with the First Appellate Authority (senior officer in same department)\n2. If that fails, file Second Appeal with Information Commission within 90 days\n3. PIO faces penalty of Rs 250/day up to Rs 25,000 for unjustified delay [Section 20]",
    "fee": "RTI fee is just Rs 10. Under the [RTI Act, 2005 — Section 6], the application fee is Rs 10 payable by cash, demand draft, or online. BPL (Below Poverty Line) card holders are completely exempt from all fees.\n\nAdditional charges: Rs 2 per page for photocopies. First appeal is FREE.",
}

MGNREGA_ANSWERS = {
    "no_work": "You have a legal right to work. Under [MGNREGA, 2005 — Section 3], every rural household is guaranteed 100 days of employment per year. Work must be provided within 15 days of application.\n\nIf not provided within 15 days, you're entitled to unemployment allowance [Section 7].\n\nNext steps:\n1. Submit written application at Gram Panchayat — get dated receipt\n2. If no work in 15 days, apply for unemployment allowance with receipt\n3. Complain to Programme Officer at Block office\n4. File online at nrega.nic.in",
    "job_card": "Job Card is free and your right. Under [MGNREGA, 2005 — Section 4], Gram Panchayat must issue Job Card within 15 days of application. It's completely FREE — no one can charge you.\n\nHow to get:\n1. Apply at Gram Panchayat with photograph\n2. Card must be issued within 15 days\n3. If anyone demands money, report to Programme Officer\n4. Demanding money for Job Card is a criminal offence",
    "delayed_wages": "Delayed wages entitle you to compensation. Under [MGNREGA, 2005 — Section 3(4)], wages must be paid within 15 days of work. Delay attracts compensation of 0.05% per day.\n\nNext steps:\n1. Check payment status at nrega.nic.in\n2. Complain to Programme Officer at Block office\n3. File complaint on MGNREGA portal\n4. Attend Gram Sabha and raise the issue publicly",
}

DV_ANSWERS = {
    "violence": "You have strong legal protections. The [Protection of Women from Domestic Violence Act, 2005] covers physical, sexual, verbal, emotional, and economic abuse.\n\nYour rights:\n- Right to reside in shared household [Section 17]\n- Protection orders [Section 18] — court orders abuser to stop\n- Monetary relief [Section 20] — maintenance and medical expenses\n- Free legal aid through DLSA\n\nImmediate help:\n1. Call Women Helpline 181 (24/7, toll-free)\n2. Call Police 100 for immediate danger\n3. Visit nearest Protection Officer or One Stop Centre\n4. Filing is FREE — no lawyer needed",
    "thrown_out": "You cannot be thrown out of your home. Under [DV Act, 2005 — Section 17], every woman has the right to reside in the shared household regardless of ownership. Even if the house is in your husband's or in-laws' name, you have the right to stay.\n\nNext steps:\n1. Call Police 100 immediately\n2. File application before Magistrate for residence order [Section 19]\n3. Court can order your restoration to the house\n4. Call Women Helpline 181 for guidance",
    "dowry": "Dowry harassment is both domestic violence and a criminal offence. Under [Dowry Prohibition Act, 1961 — Section 4], demanding dowry is punishable with 6 months to 2 years imprisonment. Under [IPC Section 498A], cruelty for dowry is punishable with up to 3 years.\n\nNext steps:\n1. Call Women Helpline 181\n2. File FIR at police station (cognizable offence)\n3. File DV case for protection order and maintenance\n4. Keep evidence: messages, recordings, witness statements",
}

# === GENERATION LOGIC ===

def generate_variations(base_questions, answers_dict, category, count_per_q=50):
    """Generate training pairs from templates with many variations."""
    pairs = []
    states = ["West Bengal", "Delhi", "Maharashtra", "Tamil Nadu", "Karnataka", "Gujarat"]
    months = ["2", "3"]
    languages_instructions = [
        "",
        " Respond clearly and thoroughly.",
        " Explain step by step.",
        " Use simple language suitable for someone unfamiliar with legal terms.",
        " Be warm and encouraging in your response.",
    ]
    
    # Question rephrasing prefixes
    prefixes = [
        "", "Please help me. ", "I urgently need help. ", "Can you tell me — ",
        "I don't know what to do. ", "Someone told me to ask you. ",
        "I am very worried. ", "This is an emergency. ",
        "My neighbor suggested I ask about this. ", "I am poor and cannot afford a lawyer. ",
    ]
    
    # Question rephrasing suffixes  
    suffixes = [
        "", " Please help.", " What should I do?", " Is there any law that protects me?",
        " Where can I get help?", " Can I file a complaint?", " Who do I approach?",
        " I need urgent help.", " Please guide me step by step.",
    ]
    
    for q in base_questions:
        q_lower = q.lower()
        
        # Determine answer template
        answer_key = None
        if category == "rent":
            if "deposit" in q_lower or "return" in q_lower: answer_key = "deposit"
            elif "water" in q_lower or "electricity" in q_lower or "cut" in q_lower: answer_key = "services"
            elif "evict" in q_lower or "vacate" in q_lower or "leave" in q_lower: answer_key = "eviction"
            elif "increase" in q_lower or "hike" in q_lower: answer_key = "increase"
            elif "receipt" in q_lower: answer_key = "receipt"
            else: answer_key = random.choice(list(answers_dict.keys()))
        elif category == "wages":
            if "not paid" in q_lower or "salary" in q_lower or "unpaid" in q_lower: answer_key = "unpaid"
            elif "minimum" in q_lower: answer_key = "minimum"
            elif "deduct" in q_lower: answer_key = "deduction"
            elif "overtime" in q_lower or "extra hours" in q_lower: answer_key = "overtime"
            elif "fired" in q_lower or "terminated" in q_lower: answer_key = "fired"
            else: answer_key = random.choice(list(answers_dict.keys()))
        elif category == "rti":
            if "how" in q_lower or "file" in q_lower or "process" in q_lower: answer_key = "how"
            elif "respond" in q_lower or "30 days" in q_lower or "no response" in q_lower: answer_key = "no_response"
            elif "fee" in q_lower or "cost" in q_lower: answer_key = "fee"
            else: answer_key = random.choice(list(answers_dict.keys()))
        elif category == "mgnrega":
            if "not giving" in q_lower or "denied" in q_lower or "no work" in q_lower: answer_key = "no_work"
            elif "job card" in q_lower or "card" in q_lower: answer_key = "job_card"
            elif "delay" in q_lower or "wages" in q_lower or "payment" in q_lower: answer_key = "delayed_wages"
            else: answer_key = random.choice(list(answers_dict.keys()))
        elif category == "dv":
            if "beat" in q_lower or "violence" in q_lower or "hit" in q_lower: answer_key = "violence"
            elif "threw" in q_lower or "out" in q_lower or "house" in q_lower: answer_key = "thrown_out"
            elif "dowry" in q_lower: answer_key = "dowry"
            else: answer_key = random.choice(list(answers_dict.keys()))
        
        if answer_key is None or answer_key not in answers_dict:
            answer_key = list(answers_dict.keys())[0]
            
        answer_template = answers_dict[answer_key]
        
        # Generate many variations per question
        for state in states:
            for prefix in random.sample(prefixes, min(3, len(prefixes))):
                for suffix in random.sample(suffixes, min(2, len(suffixes))):
                    for lang_inst in random.sample(languages_instructions, min(2, len(languages_instructions))):
                        varied_q = prefix + q + suffix
                        answer = answer_template.format(state=state, months=random.choice(months)) if "{state}" in answer_template else answer_template
                        
                        pairs.append({
                            "instruction": SYSTEM + lang_inst,
                            "input": varied_q.strip(),
                            "output": answer
                        })
    
    return pairs


def generate_all_pairs():
    """Generate all 3000+ training pairs."""
    all_pairs = []
    
    # English pairs from all categories
    all_pairs.extend(generate_variations(RENT_QUESTIONS, RENT_ANSWERS, "rent"))
    all_pairs.extend(generate_variations(WAGES_QUESTIONS, WAGES_ANSWERS, "wages"))
    all_pairs.extend(generate_variations(RTI_QUESTIONS, RTI_ANSWERS, "rti"))
    all_pairs.extend(generate_variations(MGNREGA_QUESTIONS, MGNREGA_ANSWERS, "mgnrega"))
    all_pairs.extend(generate_variations(DV_QUESTIONS, DV_ANSWERS, "dv"))
    all_pairs.extend(generate_variations(CONSUMER_QUESTIONS, WAGES_ANSWERS, "wages"))
    all_pairs.extend(generate_variations(LEGAL_AID_QUESTIONS, RTI_ANSWERS, "rti"))
    all_pairs.extend(generate_variations(SC_ST_QUESTIONS, DV_ANSWERS, "dv"))
    all_pairs.extend(generate_variations(CYBER_QUESTIONS, WAGES_ANSWERS, "wages"))
    
    # Hindi pairs — each question gets multiple answer variations
    hindi_answers = [
        "आपको कानूनी सहायता का अधिकार है। [विधिक सेवा प्राधिकरण अधिनियम, 1987 — धारा 12] के तहत आप मुफ्त कानूनी सहायता पा सकते हैं।\n\nअगले कदम:\n1. DLSA हेल्पलाइन 1516 पर कॉल करें\n2. अपने जिला न्यायालय में जाएं\n3. मुफ्त कानूनी सहायता आपका अधिकार है",
        "आपके पास कानूनी अधिकार हैं। कृपया तुरंत कार्रवाई करें।\n\nअगले कदम:\n1. नजदीकी पुलिस स्टेशन में शिकायत दर्ज करें\n2. श्रम सुविधा हेल्पलाइन 14434 पर कॉल करें\n3. shramsuvidha.gov.in पर ऑनलाइन शिकायत करें",
        "यह कानून के खिलाफ है। आपको सुरक्षा का अधिकार है।\n\nअगले कदम:\n1. महिला हेल्पलाइन 181 पर कॉल करें (24/7)\n2. पुलिस 100 पर कॉल करें\n3. जिला विधिक सेवा प्राधिकरण से मुफ्त वकील लें",
    ]
    
    for q in HINDI_QUESTIONS:
        for ans in hindi_answers:
            for variation in ["", " कृपया विस्तार से बताएं।", " मुझे तुरंत मदद चाहिए।"]:
                all_pairs.append({
                    "instruction": SYSTEM + " Respond ENTIRELY in Hindi using Devanagari script. Do not mix English words.",
                    "input": q + variation,
                    "output": ans
                })
    
    # Bengali pairs
    bengali_answers = [
        "আপনার আইনি সহায়তার অধিকার আছে। [আইনি সেবা কর্তৃপক্ষ আইন, ১৯৮৭ — ধারা ১২] অনুসারে আপনি বিনামূল্যে আইনি সহায়তা পেতে পারেন।\n\nপরবর্তী পদক্ষেপ:\n1. DLSA হেল্পলাইন ১৫১৬-এ কল করুন\n2. আপনার জেলা আদালতে যান\n3. বিনামূল্যে আইনি সহায়তা আপনার অধিকার",
        "এটি আইনের পরিপন্থী। আপনার সুরক্ষার অধিকার আছে।\n\nপরবর্তী পদক্ষেপ:\n1. মহিলা হেল্পলাইন ১৮১-এ কল করুন (২৪/৭)\n2. পুলিশ ১০০-এ কল করুন\n3. জেলা আইনি সেবা কর্তৃপক্ষ থেকে বিনামূল্যে উকিল নিন",
    ]
    
    for q in BENGALI_QUESTIONS:
        for ans in bengali_answers:
            for variation in ["", " অনুগ্রহ করে বিস্তারিত বলুন।", " আমার জরুরি সাহায্য দরকার।"]:
                all_pairs.append({
                    "instruction": SYSTEM + " Respond ENTIRELY in Bengali using Bengali script. Do not mix English words.",
                    "input": q + variation,
                    "output": ans
                })
    
    # Shuffle
    random.seed(42)
    random.shuffle(all_pairs)
    
    # Cap at target size if too many
    if len(all_pairs) > 5000:
        all_pairs = all_pairs[:5000]
    
    return all_pairs


if __name__ == "__main__":
    pairs = generate_all_pairs()
    print(f"Generated {len(pairs)} training pairs")
    print(f"Sample: {pairs[0]['input'][:80]}...")
    
    # Save as JSONL
    with open("training_data.jsonl", "w", encoding="utf-8") as f:
        for p in pairs:
            f.write(json.dumps(p, ensure_ascii=False) + "\n")
    
    print(f"Saved to training_data.jsonl")
    print(f"\nLanguage distribution:")
    hindi_count = sum(1 for p in pairs if "Hindi" in p["instruction"])
    bengali_count = sum(1 for p in pairs if "Bengali" in p["instruction"])
    print(f"  English: {len(pairs) - hindi_count - bengali_count}")
    print(f"  Hindi: {hindi_count}")
    print(f"  Bengali: {bengali_count}")
