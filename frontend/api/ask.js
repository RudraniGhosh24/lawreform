// Vercel Serverless Function — /api/ask
// Calls Gemma 4 via Google AI Studio with embedded Indian legal knowledge
// Built by Rudrani Ghosh · lawreformer.com

const LEGAL_KNOWLEDGE = `
INDIAN LEGAL KNOWLEDGE BASE (Public Domain — india.gov.in, legislative.gov.in)

1. WEST BENGAL PREMISES TENANCY ACT, 1997 (Rent Control)
- Security deposit cannot exceed 3 months rent
- Landlord cannot increase rent arbitrarily; tenant can challenge before Rent Controller
- Tenant cannot be evicted without court order from Rent Controller
- Landlord cannot cut off water/electricity to force eviction (punishable offence)
- Tenant has right to written receipt for every rent payment
- If landlord refuses rent, tenant can deposit with Rent Controller
- File complaint at Rent Controller office, no lawyer required
- Similar protections: Delhi Rent Control Act 1958, Maharashtra Rent Control Act 1999

2. THE CODE ON WAGES, 2019
- Every employer must pay at least minimum wage — applies to ALL workers including daily-wage, contract, part-time, domestic
- Daily wage: paid same day or next working day. Monthly: before 7th of next month
- No unauthorized deductions; total deductions cannot exceed 50% of wages
- Equal pay for equal work regardless of gender
- Overtime wages: twice the normal rate
- Penalty: up to 50000 first offence, 100000 + imprisonment for repeat
- Complaint: Labour Commissioner (no fee), helpline 14434, shramsuvidha.gov.in

3. RIGHT TO INFORMATION ACT, 2005 (RTI)
- Every citizen can request information from any public authority
- Response within 30 days (48 hours if life/liberty concerned)
- Fee: Rs 10 (BPL exempt). Online: rtionline.gov.in
- No reason needed for requesting information
- First Appeal: to First Appellate Authority within 30 days (free)
- Second Appeal: to Information Commission

4. MGNREGA (Mahatma Gandhi National Rural Employment Guarantee Act, 2005)
- Every rural household: legal right to 100 days wage employment per year
- Job Card: free, issued within 15 days from Gram Panchayat
- Work must be provided within 15 days of application, within 5 km of village
- If no work within 15 days: unemployment allowance
- Wages within 15 days, directly to bank account, no contractors allowed
- Complaints: Gram Panchayat, Block Development Officer, nrega.nic.in

5. PROTECTION OF WOMEN FROM DOMESTIC VIOLENCE ACT, 2005
- Covers: physical, sexual, verbal/emotional, economic abuse
- Protects: wife, live-in partner, mother, sister, daughter
- Right to residence: cannot be thrown out of shared household
- Protection orders, monetary relief, custody orders, compensation available
- Women Helpline: 181 (toll-free, 24/7). Police: 100
- File Domestic Incident Report with Protection Officer (free, no lawyer needed)
- Free legal aid available under Legal Services Authorities Act

6. CONSUMER PROTECTION ACT, 2019
- Rights: safety, information, choice, be heard, redressal, education
- Covers: defective goods, deficient services, unfair trade, overcharging
- Online: consumerhelpline.gov.in, helpline 1800-11-4000, edaakhil.nic.in
- Covers e-commerce purchases too

7. LEGAL SERVICES AUTHORITIES ACT, 1987 (Free Legal Aid)
- Free legal aid for: SC/ST, trafficking victims, women, children, disabled, workers below income limit, undertrial prisoners
- Apply at District Legal Services Authority (DLSA) in district court complex
- NALSA helpline: 15100 (toll-free). Website: nalsa.gov.in
- Lok Adalat: free dispute resolution, no court fee, decision is final

8. DOMESTIC WORKERS RIGHTS
- Covered under Code on Wages 2019 for minimum wages
- Covered under Sexual Harassment at Workplace Act 2013
- Register at eshram.gov.in for benefits
`;

const SYSTEM_PROMPT = 'You are Lawreformer AI, created by Rudrani Ghosh (lawreformer.com). You help people in India understand their legal rights in plain, simple language. Never give legal advice — always frame answers as "you may have the right to..." Cite the specific law you are drawing from. Be warm, clear, and non-intimidating. After your explanation, suggest 2-3 concrete next steps the person can take. Format law citations in square brackets like [Right to Information Act, 2005].';

module.exports = async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { question, language } = req.body || {};

  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  const apiKey = process.env.GEMMA_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMMA_API_KEY not configured' });
  }

  const model = process.env.GEMMA_MODEL || 'gemma-3-27b-it';
  const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent?key=' + apiKey;

  const systemWithLang = SYSTEM_PROMPT + ' Respond in ' + (language || 'English') + '.';
  const userMessage = 'Legal context (use these to ground your answer):\n' + LEGAL_KNOWLEDGE + '\n\nUser question: ' + question;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemWithLang }] },
        contents: [{ parts: [{ text: userMessage }] }],
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          topK: 40,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemma API error:', response.status, errText);
      return res.status(502).json({ error: 'Gemma API error: ' + response.status, detail: errText });
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';

    // Return as SSE format so frontend streaming code works
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Access-Control-Allow-Origin', '*');

    res.write('data: ' + JSON.stringify({ token: text }) + '\n\n');
    res.write('data: ' + JSON.stringify({ done: true }) + '\n\n');
    res.end();
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Internal server error', detail: String(err) });
  }
};
