# LawReformer AI: Voice-First Legal Rights for 500 Million Indians

## The Problem

India has 1.4 billion people but only 1.4 million lawyers — one for every thousand citizens. For the 500 million Indians living below or near the poverty line, legal aid is effectively inaccessible. A daily-wage worker doesn't know their employer is violating the Code on Wages. A tenant doesn't know their rights when a landlord withholds a deposit. A rural woman doesn't know help exists under the Domestic Violence Act.

The barrier isn't just money. It's language — legal documents exist only in English. It's literacy — 25% of Indians can't read. It's intimidation — the law feels like it belongs to someone else. And it's access — the nearest legal aid office might be 50 kilometers away.

## The Solution

LawReformer AI is a voice-first, multilingual legal rights assistant that lets anyone speak their problem and hear their rights explained in plain language. Built on Gemma 4 (gemma-3-27b-it) with Retrieval-Augmented Generation, it grounds every answer in actual Indian law — not hallucinated legal advice.

A user taps the microphone, speaks in any of 8 Indian languages (English, Hindi, Bengali, Tamil, Telugu, Marathi, Kannada, Gujarati), and receives a clear explanation of their legal rights with specific law citations, followed by concrete next steps they can take today.

**Live demo: https://ai.lawreformer.com**

## How Gemma 4 Powers This

Gemma 4 is the core intelligence. Every user question flows through this pipeline:

1. **Voice Input** — Web Speech API captures speech in the user's language
2. **RAG Retrieval** — The question is matched against 1,395 chunked legal provisions from 28 Indian laws using keyword-based retrieval
3. **Gemma 4 Generation** — The top-3 retrieved provisions are passed as grounded context to gemma-3-27b-it, which generates a plain-language explanation with law citations
4. **Voice Output** — The response is read aloud using browser-native TTS with language-appropriate voice selection

The system prompt instructs Gemma to never give legal advice — only legal information framed as "you may have the right to..." This is a critical ethical guardrail.

### Why Gemma 4 Specifically?

- **Multilingual excellence** — Gemma 4 handles Hindi, Bengali, Tamil, and other Indian languages natively, producing responses entirely in the user's script without code-mixing
- **Instruction following** — The model reliably cites specific laws and sections when instructed, critical for legal accuracy
- **Multimodal capability** — Users can photograph documents (rental agreements, salary slips) and Gemma 4's vision analyzes them in legal context
- **Size-quality tradeoff** — The 27B model provides high-quality responses via API, while the 4B variant enables edge deployment for offline scenarios

## Technical Architecture

```
┌─────────────────────────────────────────────────┐
│                  Frontend (Next.js)               │
│  Voice I/O │ 8 Languages │ Document Upload │ PWA │
└──────────────────────┬──────────────────────────┘
                       │ /api/ask
┌──────────────────────▼──────────────────────────┐
│              Vercel Serverless Function           │
│                                                  │
│  ┌─────────────┐    ┌────────────────────────┐  │
│  │ RAG Engine  │───▶│  Gemma 4 (27B-it)      │  │
│  │ 1395 chunks │    │  via Google AI Studio   │  │
│  │ 28 laws     │    │  + Retrieved Context    │  │
│  └─────────────┘    └────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

**Frontend:** React (Next.js) + Tailwind CSS, deployed on Vercel  
**Voice:** Web Speech API (STT + TTS) — works offline after first load  
**RAG:** 1,395 provisions from 28 Indian laws, keyword-matched retrieval  
**Model:** Gemma-3-27b-it via Google AI Studio API  
**Offline:** Service Worker caches responses, PWA installable on phone  
**Edge-ready:** Fine-tuning notebook with GGUF export for Ollama deployment

## Knowledge Base (RAG Corpus)

The RAG corpus contains 1,395 chunked provisions from 28 Indian laws, all sourced from public domain government publications (legislative.gov.in, india.gov.in):

- Rent Control Acts (West Bengal, Delhi, Maharashtra)
- Code on Wages, 2019
- Right to Information Act, 2005
- MGNREGA, 2005
- Protection of Women from Domestic Violence Act, 2005
- Consumer Protection Act, 2019
- Legal Services Authorities Act, 1987
- SC/ST Prevention of Atrocities Act, 1989
- Code on Social Security, 2020
- Sexual Harassment at Workplace Act, 2013
- And 18 more statutes covering child labour, bonded labour, motor vehicles, cyber crimes, food security, education rights, disability rights, and family law

Each provision includes: source law, section reference, plain-language text, and multilingual keywords for retrieval.

## Key Features

1. **Voice-First** — Large mic button, auto-submit on speech end, auto-play response
2. **8 Indian Languages** — Full voice I/O in English, Hindi, Bengali, Tamil, Telugu, Marathi, Kannada, Gujarati
3. **RAG-Grounded Citations** — Every answer shows retrieved source with law name and section
4. **Document Analysis** — Upload photos of legal documents for Gemma 4 vision analysis
5. **Animated Avatar** — Visual conversational agent with lip-sync animation
6. **Zero Data Storage** — No queries logged, complete privacy
7. **PWA/Offline** — Installable, caches responses for offline replay
8. **Scenario Tiles** — Six pre-loaded common legal scenarios per language for quick access

## Impact & Digital Equity

LawReformer AI directly addresses the Digital Equity track by:

- **Breaking language barriers** — Legal information in 8 Indian languages, not just English
- **Breaking literacy barriers** — Voice-first design means you don't need to read or write
- **Breaking cost barriers** — Completely free, no registration, no data collected
- **Breaking access barriers** — Works on any smartphone with Chrome, installable as PWA
- **Breaking intimidation barriers** — Warm, conversational tone with animated avatar makes law approachable

Target users: daily-wage workers, tenants, domestic workers, farmers, women facing violence, and first-generation citizens navigating government services.

## What's Next

- Expand to all 22 scheduled Indian languages
- Partner with District Legal Services Authorities for referral integration
- Deploy fine-tuned 4B model on-device for fully offline rural use
- Add voice-based document dictation for illiterate users filing RTI/complaints

## Creator

Built by **Rudrani Ghosh** — Indian developer building tools for legal access.  
Website: [lawreformer.com](https://lawreformer.com)  
Live Demo: [ai.lawreformer.com](https://ai.lawreformer.com)  
Code: [github.com/RudraniGhosh24/lawreform](https://github.com/RudraniGhosh24/lawreform)
