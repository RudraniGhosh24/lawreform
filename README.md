# Lawreformer AI

**Built by Rudrani Ghosh · [ai.lawreformer.com](https://ai.lawreformer.com)**

> Kaggle Gemma 4 Good Hackathon · Digital Equity & Inclusivity Track

## The Problem

Over 500 million Indians have no meaningful access to legal aid. A daily-wage worker doesn't know their employer is violating the Code on Wages. A tenant doesn't know their rights when a landlord withholds a deposit. A rural woman doesn't know help exists under the Domestic Violence Act. The barrier isn't just money — it's language, literacy, and the intimidating complexity of the law.

## The Solution

Lawreformer AI is a voice-first, multilingual legal rights assistant powered by Gemma 4. Users speak their problem in English, Hindi, or Bengali and receive a plain-language explanation of their rights, grounded in real Indian law via RAG, spoken back to them aloud.

No data is stored. No legal jargon. No lawyers needed.

**Target users:** daily-wage workers, tenants, domestic workers, farmers, and first-generation citizens navigating government services in India.

## Tech Stack

- **AI**: Gemma 4 (gemma-3-27b-it) via Google AI Studio
- **RAG**: ChromaDB + LangChain + sentence-transformers (all-MiniLM-L6-v2)
- **Voice**: Web Speech API (STT + TTS, browser-native, works offline after first load)
- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Python FastAPI (streaming via SSE)
- **Deployment**: Vercel → ai.lawreformer.com

## Knowledge Base

All sourced from public domain (india.gov.in, legislative.gov.in):

- Rent Control Act (West Bengal, Maharashtra, Delhi)
- The Code on Wages 2019
- Right to Information Act 2005
- MGNREGA scheme rights
- Domestic Workers' Rights
- Consumer Protection Act 2019
- Protection of Women from Domestic Violence Act 2005
- Legal Services Authorities Act 1987

## How to Run Locally

### Prerequisites

- Python 3.10+
- Node.js 18+
- A Google AI Studio API key ([get one free](https://aistudio.google.com/apikey))

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env file
echo "GEMMA_API_KEY=your_api_key_here" > .env

# Ingest legal documents into ChromaDB
python ingest.py

# Start the server
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 in Chrome or Edge (required for Web Speech API).

## Features

1. **Voice Input** — Tap the mic, speak in English/Hindi/Bengali, edit the transcription, submit
2. **AI Response** — Gemma 4 + RAG streams a plain-language answer citing specific Indian laws
3. **Voice Output** — Response auto-read aloud with pause/replay/speed controls
4. **Next Steps** — Concrete action cards after every answer (file RTI, contact DLSA, etc.)
5. **Scenario Tiles** — Six pre-loaded common legal scenarios for quick access
6. **Multilingual** — Full support for English, Hindi (हिंदी), and Bengali (বাংলা)
7. **Zero Data Storage** — No queries logged, no analytics, complete privacy

## Demo

[Link to demo video]

## Creator

Rudrani Ghosh — developer, [lawreformer.com](https://lawreformer.com)
Submission for the Kaggle Gemma 4 Good Hackathon 2026.
