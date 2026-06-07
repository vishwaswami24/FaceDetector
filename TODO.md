# TODO - Netlify + Railway deployment

- [x] Update backend to run on `$PORT` (production-friendly) instead of hardcoded debug server
- [x] Add `gunicorn` to backend dependencies
- [x] Add `backend/Procfile` for Railway startup
- [x] Update frontend to call API via `VITE_API_URL` env var (fallback to localhost)
- [x] Build backend and run a quick smoke test locally (optional)

- [x] Build frontend (`npm run build`) and verify no broken API calls

- [ ] Provide Netlify setup instructions (publish dir, build command, env var)
- [ ] Provide Railway setup instructions (service root, start command/Procfile, env vars)

