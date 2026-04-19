// Vercel Serverless Function — /api/ask
// Calls Gemma 4 via Google AI Studio with embedded Indian legal knowledge
// Built by Rudrani Ghosh · lawreformer.com

export const config = {
  maxDuration: 60,
};

const LEGAL_KNOWLEDGE = `
INDIAN LEGAL KNOWLEDGE BASE (Public Domain — india.gov.in, legislative.gov.in)

1. WEST BENGAL PREMISES TENANCY ACT, 1997 (Rent Control)
- Security deposit cannot exceed 3 months' rent
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
- Penalty: up to ₹50,000 first offence, ₹1,00,000 + imprisonment for repeat
- Complaint: Labour Commissioner (no fee), helpline 14434, shramsuvidha.gov.in
- West Bengal unskilled minimum wage: approximately ₹326/day

3. RIGHT TO INFORMATION ACT, 2005 (RTI)
- Every citizen can request information from any public authority
- Response within 30 days (48 hours if life/liberty concerned)
- Fee: ₹10 (BPL exempt). Online: rtionline.gov.in
- No reason needed for requesting information
- First Appeal: to First Appellate Authority within 30 days (free)
- Second Appeal: to Information Commission. Penalty on officers: ₹250/day, max ₹25,000

4. MGNREGA (Mahatma Gandhi National Rural Employment Guarantee Act, 2005)
- Every rural household: legal right to 100 days wage employment per year
- Job Card: free, issued within 15 days from Gram Panchayat
- Work must be provided within 15 days of application, within 5 km of village
- If no work within 15 days: unemployment allowance (1/4 wage first 30 days, then 1/2)
- Wages within 15 days, directly to bank account, no contractors allowed
- Worksite must have: drinking water, shade, first aid, crèche
- Complaints: Gram Panchayat, Block Development Officer, nrega.nic.in

5. PROTECTION OF WOMEN FROM DOMESTIC VIOLENCE ACT, 2005
- Covers: physical, sexual, verbal/emotional, economic abuse
- Protects: wife, live-in partner, mother, sister, daughter in domestic relationship
- Right to residence: cannot be thrown out of shared household
- Protection orders, monetary relief, custody orders, compensation available
- Women Helpline: 181 (toll-free, 24/7). Police: 100
- File Domestic Incident Report with Protection Officer (free, no lawyer needed)
- Magistrate must hear case within 3 days. Violation = imprisonment up to 1 year
- Free legal aid available under Legal Services Authorities Act

6. CONSUMER PROTECTION ACT, 2019
- Rights: safety, information, choice, be heard, redressal, education
- Covers: defective goods, deficient services, unfair trade, overcharging (above MRP)
- Forums: up to ₹1 crore District, ₹1-10 crore State, above ₹10 crore National
- Online: consumerhelpline.gov.in, helpline 1800-11-4000, edaakhil.nic.in
- Resolution within 3-5 months. Covers e-commerce purchases too
- Product liability: manufacturers/sellers liable for harm from defective products

7. LEGAL SERVICES AUTHORITIES ACT, 1987 (Free Legal Aid)
- Free legal aid for: SC/ST, trafficking victims, women, children, disabled, workers below income limit, undertrial prisoners, disaster victims
- Includes: free lawyer, court fees, legal documents, advice, Lok Adalat
- Apply at District Legal Services Authority (DLSA) in district court complex
- NALSA helpline: 15100 (toll-free). Website: nalsa.gov.in
- Lok Adalat: free dispute resolution, no court fee, decision is final

8. DOMESTIC WORKERS' RIGHTS
- Covered under Code on Wages 2019 for minimum wages
- Covered under Sexual Harassment at Workplace Act 2013
- Social security: Pradhan Mantri Jeevan Jyoti Bima, Ayushman Bharat, PM Shram Yogi Maan-dhan (₹3,000/month pension after 60)
- Register at eshram.gov.in for benefits
- Kerala has specific Domestic Workers Act 2015
`;

const SYSTEM_PROMPT = `You are Lawreformer AI, created by Rudrani Ghosh (lawreformer.com). You help people in India understand their legal rights in plain, simple language. Never give legal advice — always frame answers as "you may have the right to..." Cite the specific law you are drawing from. Be warm, clear, and non-intimidating. After your explanation, suggest 2-3 concrete next steps the person can take. Format law citations in square brackets like [Right to Information Act, 2005].`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { question, language = 'English' } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  const apiKey = process.env.GEMMA_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMMA_API_KEY not configured' });
  }

  const model = process.env.GEMMA_MODEL || 'gemma-3-27b-it';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`;

  const systemWithLang = SYSTEM_PROMPT + ` Respond in ${language}.`;
  const userMessage = `Legal context (use these to ground your answer):\n${LEGAL_KNOWLEDGE}\n\nUser's question: ${question}`;

  try {
    const response = await fetch(url, {
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
      return res.status(502).json({ error: `Gemma API error: ${response.status}` });
    }

    // Stream SSE back to client
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const jsonStr = line.slice(6).trim();
          if (!jsonStr || jsonStr === '[DONE]') continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              res.write(`data: ${JSON.stringify({ token: text })}\n\n`);
            }
          } catch {
            // skip malformed chunks
          }
        }
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
