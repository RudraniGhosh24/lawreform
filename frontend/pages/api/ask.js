// LawReformer AI — Gemma 4 API Route
// Model: gemma-3-27b-it via Google AI Studio
// Built by Rudrani Ghosh · lawreformer.com

const LEGAL_KB = `
[Source: West Bengal Premises Tenancy Act, 1997] Security deposit max 3 months rent. Landlord cannot evict without court order. Cannot cut water/electricity (punishable). File complaint at Rent Controller office, no lawyer needed. Similar: Delhi Rent Control Act 1958, Maharashtra Rent Control Act 1999.

[Source: Code on Wages, 2019] Minimum wage for ALL workers including daily-wage, contract, domestic. Daily wage: paid same day. Monthly: before 7th. No unauthorized deductions (max 50%). Equal pay regardless of gender. Overtime: 2x rate. Penalty up to Rs 50,000. Complaint: Labour Commissioner (free), helpline 14434, shramsuvidha.gov.in.

[Source: Right to Information Act, 2005] Any citizen can request info from any public authority. Response within 30 days (48hrs if life/liberty). Fee Rs 10 (BPL exempt). Online: rtionline.gov.in. No reason needed. First Appeal free within 30 days.

[Source: MGNREGA, 2005] Every rural household: legal right to 100 days wage employment/year. Job Card free from Gram Panchayat within 15 days. Work within 15 days, within 5km. Unemployment allowance if no work. Wages within 15 days to bank. No contractors. Complaints: nrega.nic.in.

[Source: Protection of Women from Domestic Violence Act, 2005] Covers physical, sexual, verbal, economic abuse. Right to residence. Women Helpline: 181. Police: 100. Free, no lawyer needed. Magistrate hears in 3 days.

[Source: Consumer Protection Act, 2019] Covers defective goods, deficient services, overcharging. Online: consumerhelpline.gov.in, 1800-11-4000, edaakhil.nic.in. Covers e-commerce.

[Source: Legal Services Authorities Act, 1987] Free legal aid for SC/ST, women, children, disabled, low income. DLSA in district court. NALSA helpline: 15100. Lok Adalat: free, final decision.

[Source: Domestic Workers Rights] Covered under Code on Wages 2019. Sexual Harassment at Workplace Act 2013 applies. Register at eshram.gov.in.
`;

// Language detection via Unicode script ranges
function detectLanguage(text) {
  const scripts = {
    Hindi: /[\u0900-\u097F]/,
    Bengali: /[\u0980-\u09FF]/,
    Tamil: /[\u0B80-\u0BFF]/,
    Telugu: /[\u0C00-\u0C7F]/,
    Kannada: /[\u0C80-\u0CFF]/,
    Malayalam: /[\u0D00-\u0D7F]/,
    Gujarati: /[\u0A80-\u0AFF]/,
    Marathi: /[\u0900-\u097F]/, // same script as Hindi (Devanagari)
    Punjabi: /[\u0A00-\u0A7F]/,
    Odia: /[\u0B00-\u0B7F]/,
    Assamese: /[\u0980-\u09FF]/, // same script as Bengali
    Urdu: /[\u0600-\u06FF]/,
  }

  // Count characters per script
  let maxCount = 0, detected = 'English'
  for (const [lang, regex] of Object.entries(scripts)) {
    const count = (text.match(new RegExp(regex.source, 'g')) || []).length
    if (count > maxCount) { maxCount = count; detected = lang }
  }

  // Hinglish detection: if Devanagari chars exist but less than 30% of text, it's Hinglish
  const devanagariCount = (text.match(/[\u0900-\u097F]/g) || []).length
  const totalChars = text.replace(/\s/g, '').length
  if (devanagariCount > 0 && devanagariCount < totalChars * 0.3) {
    return 'Hinglish'
  }

  // If Devanagari detected, check for Marathi-specific words
  if (detected === 'Hindi') {
    const marathiWords = /\b(आहे|नाही|काय|कसे|माझा|तुमचा|होते|करा|म्हणजे)\b/
    if (marathiWords.test(text)) return 'Marathi'
  }

  // If Bengali script detected, check for Assamese-specific words
  if (detected === 'Bengali') {
    const assameseWords = /\b(মোৰ|তোমাৰ|নহয়|কৰা|হৈছে)\b/
    if (assameseWords.test(text)) return 'Assamese'
  }

  return maxCount > 2 ? detected : 'English'
}

const SYS = `You are LawReformer AI, a legal rights assistant created by Rudrani Ghosh (lawreformer.com), powered by Gemma 4.

RULES:
1. Help people in India understand their legal rights in plain, simple language.
2. Never give legal advice — always say "you may have the right to..."
3. ALWAYS cite the specific law using square bracket format like [Rent Control Act, WB 1997] or [Code on Wages, 2019]. Every answer MUST have at least one citation.
4. After your explanation, suggest 2-3 concrete next steps with helpline numbers or websites.
5. Be warm, clear, and non-intimidating.
6. CRITICAL LANGUAGE RULE: Auto-detect the user's language and respond in the SAME language and script. If user writes in Hindi, respond entirely in Devanagari. If Bengali, respond in Bengali script. If Tamil, respond in Tamil script. And so on for Telugu, Kannada, Malayalam, Gujarati, Marathi, Punjabi, Odia, Assamese, Urdu.
7. For Hinglish (mix of Hindi + English): respond in Hinglish — use Roman script with Hindi words mixed in, casual and friendly tone. Example: "Aapka landlord deposit return nahi kar raha? Toh aapke paas legal rights hain..."
8. Only keep URLs and phone numbers in English/digits regardless of language.
9. Do NOT translate the language — respond in whatever language/script the user used.`;

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { question, language, image, history } = req.body || {};
  if (!question && !image) return res.status(400).json({ error: 'Question or image required' });

  const apiKey = process.env.GEMMA_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not set' });

  const model = process.env.GEMMA_MODEL || 'gemma-3-27b-it';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  // Auto-detect language from user's question, fallback to selected language
  const detectedLang = question ? detectLanguage(question) : (language || 'English');
  const lang = detectedLang;

  const systemMsg = SYS + '\n\nDetected language: ' + lang + '. Respond in ' + lang + '.\n\nLegal knowledge base:\n' + LEGAL_KB;

  try {
    const contents = [];

    if (history && history.length > 0) {
      contents.push({ role: 'user', parts: [{ text: systemMsg + '\n\nUser: ' + history[0].content }] });
      for (let i = 1; i < history.length; i++) {
        contents.push({
          role: history[i].role === 'user' ? 'user' : 'model',
          parts: [{ text: history[i].content }],
        });
      }
    }

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
    res.write('data: ' + JSON.stringify({ token: text, model, detectedLanguage: lang }) + '\n\n');
    res.write('data: ' + JSON.stringify({ done: true }) + '\n\n');
    res.end();
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
}
