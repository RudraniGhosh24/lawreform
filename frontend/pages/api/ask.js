const LEGAL_KB = `
1. WEST BENGAL PREMISES TENANCY ACT 1997 (Rent Control) - Security deposit max 3 months rent. Landlord cannot evict without court order. Cannot cut water/electricity. File complaint at Rent Controller, no lawyer needed. Similar: Delhi Rent Control Act 1958, Maharashtra Rent Control Act 1999.

2. CODE ON WAGES 2019 - Minimum wage for ALL workers including daily-wage, domestic. Daily wage: paid same day. Monthly: before 7th. No unauthorized deductions (max 50%). Equal pay regardless of gender. Overtime: 2x rate. Complaint: Labour Commissioner, helpline 14434, shramsuvidha.gov.in.

3. RIGHT TO INFORMATION ACT 2005 (RTI) - Any citizen can request info from public authority. Response in 30 days (48hrs if life/liberty). Fee Rs 10 (BPL exempt). Online: rtionline.gov.in. No reason needed. First Appeal free within 30 days.

4. MGNREGA 2005 - Rural households: 100 days guaranteed employment/year. Job Card free from Gram Panchayat in 15 days. Work within 15 days, within 5km. Unemployment allowance if no work. Wages in 15 days to bank. No contractors. Complaints: nrega.nic.in.

5. PROTECTION OF WOMEN FROM DOMESTIC VIOLENCE ACT 2005 - Covers physical, sexual, verbal, economic abuse. Right to residence. Women Helpline: 181. Police: 100. Free, no lawyer needed. Magistrate hears in 3 days.

6. CONSUMER PROTECTION ACT 2019 - Covers defective goods, deficient services, overcharging. Online: consumerhelpline.gov.in, 1800-11-4000, edaakhil.nic.in. Covers e-commerce.

7. LEGAL SERVICES AUTHORITIES ACT 1987 - Free legal aid for SC/ST, women, children, disabled, low income. DLSA in district court. NALSA helpline: 15100. Lok Adalat: free, final decision.

8. DOMESTIC WORKERS RIGHTS - Covered under Code on Wages 2019. Sexual Harassment at Workplace Act 2013 applies. Register at eshram.gov.in.
`;

const SYS = 'You are Lawreformer AI, created by Rudrani Ghosh (lawreformer.com). You help people in India understand their legal rights in plain, simple language. Never give legal advice — always say "you may have the right to..." Cite the specific law. Be warm and clear. Suggest 2-3 next steps. Format citations like [Right to Information Act, 2005].';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { question, language } = req.body || {};
  if (!question) return res.status(400).json({ error: 'Question required' });

  const apiKey = process.env.GEMMA_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not set' });

  const model = process.env.GEMMA_MODEL || 'gemma-3-27b-it';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const fullPrompt = SYS + ' Respond in ' + (language || 'English') + '.\n\nLegal context:\n' + LEGAL_KB + '\n\nUser question: ' + question;

  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }],
        generationConfig: { temperature: 0.7, topP: 0.9, topK: 40, maxOutputTokens: 1024 },
      }),
    });

    if (!r.ok) {
      const t = await r.text();
      return res.status(502).json({ error: 'Gemma error ' + r.status, detail: t });
    }

    const data = await r.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, no response generated.';

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.write('data: ' + JSON.stringify({ token: text }) + '\n\n');
    res.write('data: ' + JSON.stringify({ done: true }) + '\n\n');
    res.end();
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
}
