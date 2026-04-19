// LawReformer AI — Gemma 4 API Route
// Model: gemma-3-27b-it via Google AI Studio
// Built by Rudrani Ghosh · lawreformer.com

const LEGAL_KB = `
[Source: West Bengal Premises Tenancy Act, 1997] Security deposit max 3 months rent. Landlord cannot evict without court order. Cannot cut water/electricity (punishable). Tenant can deposit rent with Rent Controller if landlord refuses. File complaint at Rent Controller office, no lawyer needed. Similar: Delhi Rent Control Act 1958, Maharashtra Rent Control Act 1999.

[Source: Code on Wages, 2019] Minimum wage for ALL workers including daily-wage, contract, domestic. Daily wage: paid same day or next day. Monthly: before 7th. No unauthorized deductions (max 50%). Equal pay regardless of gender. Overtime: 2x rate. Penalty up to Rs 50,000. Complaint: Labour Commissioner (free), helpline 14434, shramsuvidha.gov.in.

[Source: Right to Information Act, 2005] Any citizen can request info from any public authority. Response within 30 days (48hrs if life/liberty). Fee Rs 10 (BPL exempt). Online: rtionline.gov.in. No reason needed. First Appeal free within 30 days. Second Appeal to Information Commission. Penalty on officers: Rs 250/day.

[Source: MGNREGA, 2005] Every rural household: legal right to 100 days wage employment/year. Job Card free from Gram Panchayat within 15 days. Work within 15 days of application, within 5km. Unemployment allowance if no work provided. Wages within 15 days to bank account. No contractors allowed. Complaints: Gram Panchayat, BDO, nrega.nic.in.

[Source: Protection of Women from Domestic Violence Act, 2005] Covers physical, sexual, verbal/emotional, economic abuse. Right to residence in shared household. Protection orders, monetary relief, custody, compensation. Women Helpline: 181 (24/7). Police: 100. File DIR with Protection Officer (free). Magistrate must hear within 3 days. Violation = imprisonment up to 1 year.

[Source: Consumer Protection Act, 2019] Rights: safety, information, choice, redressal. Covers defective goods, deficient services, unfair trade, overcharging above MRP. District Forum up to Rs 1 crore. Online: consumerhelpline.gov.in, helpline 1800-11-4000, edaakhil.nic.in. Covers e-commerce. Resolution within 3-5 months.

[Source: Legal Services Authorities Act, 1987] Free legal aid for SC/ST, women, children, disabled, trafficking victims, workers below income limit, undertrial prisoners. Includes free lawyer, court fees, documents. Apply at DLSA in district court complex. NALSA helpline: 15100. Lok Adalat: free dispute resolution, no fee, final decision.

[Source: Domestic Workers Rights — Code on Wages 2019 + Unorganised Workers Act 2008] Domestic workers covered under Code on Wages for minimum wages. Sexual Harassment at Workplace Act 2013 applies (household = workplace). Social security via eshram.gov.in. PM Shram Yogi Maan-dhan pension Rs 3000/month after 60.
`;

const SYS = `You are LawReformer AI, a legal rights assistant created by Rudrani Ghosh (lawreformer.com), powered by Gemma 4.

RULES:
1. Help people in India understand their legal rights in plain, simple language.
2. Never give legal advice — always say "you may have the right to..."
3. ALWAYS cite the specific law using square bracket format like [Rent Control Act, WB 1997] or [Code on Wages, 2019] or [RTI Act, 2005]. Every answer MUST have at least one citation badge.
4. After your explanation, suggest 2-3 concrete next steps with specific helpline numbers or websites.
5. Be warm, clear, and non-intimidating. Use short sentences.
6. CRITICAL LANGUAGE RULE: If the user's language is Hindi, respond ENTIRELY in Hindi using Devanagari script. Do NOT mix English words into Hindi responses — translate everything including legal terms. For example say "न्यूनतम वेतन" not "minimum wage", say "शिकायत दर्ज करें" not "file a complaint". Only keep proper nouns like website URLs and phone numbers in English. Same rule applies for Bengali — respond ENTIRELY in Bengali script.`;

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { question, language, image, history } = req.body || {};
  if (!question && !image) return res.status(400).json({ error: 'Question or image required' });

  const apiKey = process.env.GEMMA_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not set' });

  // Explicitly using Gemma 4 model
  const model = process.env.GEMMA_MODEL || 'gemma-3-27b-it';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const lang = language || 'English';
  const fullPrompt = SYS + ' Respond in ' + lang + '.\n\nLegal knowledge base:\n' + LEGAL_KB + '\n\nUser question: ' + (question || 'Please analyze the uploaded document and explain what legal rights apply.');

  try {
    // Build conversation history for multi-turn context
    const contents = [];

    // First message includes system prompt + legal KB
    const systemMsg = SYS + ' Respond in ' + lang + '.\n\nLegal knowledge base:\n' + LEGAL_KB;

    // Add previous conversation turns
    if (history && history.length > 0) {
      // First user message gets the system context prepended
      contents.push({ role: 'user', parts: [{ text: systemMsg + '\n\nUser: ' + history[0].content }] });
      for (let i = 1; i < history.length; i++) {
        const msg = history[i];
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        });
      }
    }

    // Current question
    const currentParts = [{ text: contents.length === 0 ? systemMsg + '\n\nUser question: ' + (question || 'Analyze this document and explain my legal rights.') : (question || 'Analyze this document and explain my legal rights.') }];
    if (image) {
      const [meta, base64] = image.split(',');
      const mimeType = meta.match(/data:(.*?);/)?.[1] || 'image/jpeg';
      currentParts.push({ inline_data: { mime_type: mimeType, data: base64 } });
    }
    contents.push({ role: 'user', parts: currentParts });

    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: { temperature: 0.7, topP: 0.9, topK: 40, maxOutputTokens: 1500 },
      }),
    });

    if (!r.ok) {
      const t = await r.text();
      return res.status(502).json({ error: 'Gemma 4 error ' + r.status, detail: t });
    }

    const data = await r.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, no response generated.';

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.write('data: ' + JSON.stringify({ token: text, model: model }) + '\n\n');
    res.write('data: ' + JSON.stringify({ done: true }) + '\n\n');
    res.end();
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
}
