# LawReformer

Legal decision-support platform covering India, UK, and US jurisdictions.

## Structure

```
lawreformer/
├── frontend/        # Next.js app (deploy to Vercel)
└── backend/         # FastAPI app (deploy to Railway/Render/Fly.io)
```

## Local Development

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs at http://localhost:3000

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
uvicorn main:app --reload
```
Runs at http://localhost:8000

## Deployment

### Frontend → Vercel
1. Push `frontend/` to GitHub
2. Import repo in Vercel
3. Set root directory to `frontend`
4. Add env var: `NEXT_PUBLIC_API_URL=https://your-backend-url.com`

### Backend → Railway / Render
1. Push `backend/` to GitHub
2. Create new service pointing to `backend/`
3. Set env vars from `backend/.env`
4. Deploy — the `Procfile` handles startup

## Security Notes
- All legal decision logic lives in the backend — never exposed to the browser
- Use a private GitHub repo to protect your rule logic
- Never commit `.env` files (already in `.gitignore`)
