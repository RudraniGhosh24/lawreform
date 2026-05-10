// LawReformer AI — Gemma 4 API Route with RAG (Retrieval-Augmented Generation)
// Model: gemma-3-27b-it via Google AI Studio
// RAG: Keyword-based retrieval from chunked Indian legal documents
// Built by Rudrani Ghosh · lawreformer.com

import { retrieveChunks } from '../../src/data/retrieve'

const SYS = `You are a helpful legal information assistant for people in India.

RULES:
1. Respond DIRECTLY to the user's question in a warm, conversational tone. Do NOT show your reasoning or thinking process.
2. Provide legal information, not formal legal advice. Use phrases like "you may have the right to..."
3. Use the retrieved legal context to ground your answer. If the context doesn't cover the question well, still provide helpful general guidance.
4. Cite relevant laws in square brackets like [Code on Wages, 2019 — Section 17].
5. End with practical next steps including helpline numbers or websites.
6. Keep it natural — like a knowledgeable friend explaining your rights.
7. LANGUAGE RULE: If the user's language is Hindi, respond ENTIRELY in Hindi. Same for Bengali, Tamil, Telugu, Marathi, Kannada, Gujarati. Only keep URLs and phone numbers in English.
8. NEVER output your internal reasoning, analysis, or thought process. Just give the answer directly.`;

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { question, language, image, history } = req.body || {}
  if (!question && !image) return res.status(400).json({ error: 'Question or image required' })

  const apiKey = process.env.GEMMA_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'API key not set' })

  // === RAG RETRIEVAL ===
  const retrievedChunks = retrieveChunks(question || '', 3)
  const ragContext = retrievedChunks.length > 0
    ? retrievedChunks.map(c => `[${c.source} — ${c.section}]\n"${c.text}"`).join('\n\n')
    : 'No specific legal provisions found for this query. Provide general guidance about seeking help from DLSA.'

  // === MODEL SELECTION ===
  // Priority: Fine-tuned model on HuggingFace > Google AI Studio Gemma
  const HF_API_KEY = process.env.HF_API_KEY
  const HF_MODEL = process.env.HF_MODEL // e.g. "RudraniGhosh24/lawreformer-gemma-4b-legal-indian"
  const useFineTuned = HF_API_KEY && HF_MODEL

  const model = process.env.GEMMA_MODEL || 'gemma-4-26b-a4b-it'
  const url = useFineTuned
    ? `https://api-inference.huggingface.co/models/${HF_MODEL}`
    : `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

  const lang = language || 'English'
  const fullPrompt = SYS + ' Respond in ' + lang + '.\n\n--- RETRIEVED LEGAL CONTEXT (from RAG) ---\n' + ragContext + '\n--- END CONTEXT ---\n\nUser question: ' + (question || 'Analyze this document and explain my legal rights.')

  try {
    const parts = [{ text: fullPrompt }]
    if (image) {
      const [meta, base64] = image.split(',')
      const mimeType = meta.match(/data:(.*?);/)?.[1] || 'image/jpeg'
      parts.push({ inline_data: { mime_type: mimeType, data: base64 } })
    }

    let text = ''

    if (useFineTuned) {
      // === FINE-TUNED MODEL via HuggingFace Inference API ===
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${HF_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputs: fullPrompt,
          parameters: { max_new_tokens: 1024, temperature: 0.7, top_p: 0.9 },
        }),
      })
      if (!r.ok) {
        // Fallback to Google AI Studio if HF fails
        console.error('HF API failed, falling back to Google AI Studio')
      } else {
        const data = await r.json()
        text = data?.[0]?.generated_text || data?.generated_text || ''
        // Remove the prompt from response if echoed
        if (text.includes(fullPrompt)) text = text.replace(fullPrompt, '').trim()
      }
    }

    if (!text) {
      // === GOOGLE AI STUDIO (base Gemma or fallback) ===
      const contents = []
      if (history && history.length > 0) {
        contents.push({ role: 'user', parts: [{ text: fullPrompt + '\n\nPrevious context: ' + history[0].content }] })
        for (let i = 1; i < history.length; i++) {
          contents.push({ role: history[i].role === 'user' ? 'user' : 'model', parts: [{ text: history[i].content }] })
        }
        contents.push({ role: 'user', parts })
      } else {
        contents.push({ role: 'user', parts })
      }

      const googleUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
      const r = await fetch(googleUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: { temperature: 0.7, topP: 0.9, topK: 40, maxOutputTokens: 1500, thinkingConfig: { thinkingBudget: 0 } },
        }),
      })

      if (!r.ok) {
        const t = await r.text()
        return res.status(502).json({ error: 'Gemma 4 error ' + r.status, detail: t })
      }

      const data = await r.json()
      // Get the last text part (skip thinking parts if present)
      const parts_resp = data?.candidates?.[0]?.content?.parts || []
      const textParts = parts_resp.filter(p => p.text && !p.thought)
      text = (textParts.length > 0 ? textParts[textParts.length - 1].text : parts_resp[0]?.text) || 'Sorry, no response generated.'
      // Strip any remaining reasoning markers
      text = text.replace(/^\s*\*[^*]+\*\s*/gm, '').replace(/^[\s*•-]+(?:User|Goal|Context|Persona|Constraint|Strategy|Drafting|Self-Correction|Problem|Crucial|Wait|Note|Refined|Final|Help|Looking|Since|However|Let).*$/gm, '').trim()
      if (!text || text.length < 20) text = parts_resp.map(p => p.text).filter(Boolean).join('\n').replace(/^\s*\*[^*]+\*\s*/gm, '').trim()
    }

    // Return response + retrieved sources
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.write('data: ' + JSON.stringify({
      token: text,
      model: model,
      sources: retrievedChunks.map(c => ({ source: c.source, section: c.section, text: c.text.slice(0, 150) + '...' }))
    }) + '\n\n')
    res.write('data: ' + JSON.stringify({ done: true }) + '\n\n')
    res.end()
  } catch (e) {
    return res.status(500).json({ error: String(e) })
  }
}
