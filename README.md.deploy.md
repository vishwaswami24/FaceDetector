# Deploy: Netlify (frontend) + Railway (backend)

This repo contains:
- `frontend/` (React + Vite)
- `backend/` (Flask)

## 1) Railway deploy (backend)

### Files added for Railway
- `backend/Procfile`

### Recommended setup
- Root: `backend/`
- Start command: uses `Procfile`
- Ensure the container/service has these env vars (Railway often sets `PORT` automatically):
  - `PORT` (optional; app defaults to 5000)

### Verify
- `GET /health` should return `{ "status": "healthy" }`
- `POST /detect` should work with base64 JSON body.

## 2) Netlify deploy (frontend)

### Build settings
Netlify auto-detects from `netlify.toml`, but you can set manually:
- Build command: `npm run build`
- Publish directory: `frontend/dist`

### Env var
Set:
- `VITE_API_URL` = your Railway backend base URL, e.g.
  - `https://your-railway-service.up.railway.app`

The app will call:
- `${VITE_API_URL}/detect`

### Verify
After deploy, open the Netlify URL and run either:
- Camera: click **Start Camera** then **Capture & Detect**
- Upload: **Upload Image** then **Detect Faces**

## Local run (quick)

### Backend
```bash
cd backend
python -m pip install -r requirements.txt
python app.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Set `VITE_API_URL` if the backend isn’t on `localhost`.

