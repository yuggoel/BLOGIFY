# Deployment Guide — Vercel (frontend) & Railway (backend)

This document describes how to deploy the `frontend` (Next.js) to Vercel and the `backend` (FastAPI) to Railway, and which environment variables to set.

## Overview
- Frontend: `frontend` folder (Next.js 16). Deploy to Vercel; set `NEXT_PUBLIC_API_URL` to the backend URL.
- Backend: `backend` folder (Dockerfile + FastAPI). Deploy to Railway using the `backend/Dockerfile`.

## Required environment variables
Set these in Railway (backend) and Vercel (frontend) as described below.

Backend (Railway) — names to add as *environment variables*:
- `MONGODB_URI`: MongoDB connection string (must include database name). Example: `mongodb://user:pass@host:27017/blogify` or Atlas URI `mongodb+srv://user:pass@cluster.mongodb.net/blogify`.
- `JWT_SECRET`: long random secret for signing JWTs.
- `API_BASE_URL`: public base URL of the API (Railway service URL); used to construct absolute image URLs. Example: `https://my-blogify.up.railway.app`.
- `FRONTEND_URL`: frontend origin to allow CORS (set to your Vercel URL, e.g. `https://my-blogify.vercel.app`).
- (optional) `JWT_EXPIRE_MINUTES`: integer; default is 10080 (7 days).

Frontend (Vercel) — names to add as *environment variables*:
- `NEXT_PUBLIC_API_URL`: the public URL of the API (the Railway service URL). Example: `https://my-blogify.up.railway.app`.

Notes: The backend `APP/config.py` reads these values from environment variables using Pydantic BaseSettings. Use the uppercase names above when configuring the platform.

## Deploying the backend to Railway
1. Push your repo to GitHub (or a supported Git provider) if not already pushed.
2. On Railway, create a new Project → New Service → Deploy from GitHub.
3. Select your repository and choose the branch to deploy.
4. When configuring the service, set the service root or select the `backend` subfolder as the build context so Railway uses `backend/Dockerfile`.
5. Add the environment variables listed above (`MONGODB_URI`, `JWT_SECRET`, `API_BASE_URL`, `FRONTEND_URL`, ...).
6. Deploy. Railway will build the Docker image and run the service. The service will expose a public URL (e.g. `https://<project>.up.railway.app`).

Railway notes:
- The repository already contains `backend/Dockerfile`, `backend/start.sh`, and `backend/railway.toml`. The `start.sh` uses `$PORT` so Railway's platform port will be respected.
- If Railway asks for the Dockerfile path, use `backend/Dockerfile`.

## Deploying the frontend to Vercel
1. On Vercel, create a new Project → Import Git Repository → choose your repository.
2. When prompted for the Root Directory (monorepo), set it to `frontend` so Vercel builds that folder.
3. Build settings: Vercel will typically detect Next.js; the default build command `npm run build` and output are fine. (`frontend/package.json` already has `build` and `start` scripts.)
4. Add an Environment Variable in Vercel:
   - `NEXT_PUBLIC_API_URL` = the Railway public URL (e.g. `https://my-blogify.up.railway.app`).
5. Deploy. Vercel will build and publish the frontend. The site will be available at a Vercel domain (e.g. `https://my-blogify.vercel.app`).

### Deploy immediately using Vercel CLI (manual)
If you prefer to deploy directly from your machine right now, use the Vercel CLI:

1. Install and login:
```bash
npm i -g vercel
vercel login
```

2. From the repo root, link the project (choose/Create a project, set root to `frontend`):
```bash
cd frontend
vercel link
```

3. Add the production environment variable (replace <RAILWAY_URL>):
```bash
vercel env add NEXT_PUBLIC_API_URL production
# when prompted paste https://<your-railway-service>.up.railway.app
```

4. Deploy to production:
```bash
vercel --prod
```

Notes:
- `frontend/vercel.json` is included to ensure Vercel uses the Next.js builder and references the `NEXT_PUBLIC_API_URL` env variable defined in the Vercel dashboard or via `vercel env add`.
- If you want me to run these commands for you I can guide you, but I cannot run them without your Vercel credentials.

Local testing tips
- Backend locally: from `backend` directory run:
```bash
python -m pip install -r requirements.txt
# create .env with MONGODB_URI and JWT_SECRET (and optional API_BASE_URL, FRONTEND_URL)
./start.sh
```
- Frontend locally: from `frontend` directory run:
```bash
npm install
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000 npm run dev
```

Post-deploy checklist
- Set `NEXT_PUBLIC_API_URL` in Vercel to the Railway URL.
- Set `API_BASE_URL` and `FRONTEND_URL` in Railway to the Railway URL and Vercel URL respectively.
- Verify CORS and uploads: visit the frontend, sign up or log in, and create a post with an image to confirm uploads and absolute image URLs.

If you'd like, I can:
- Add a small `vercel.json` or GitHub Actions workflow for automatic deployments, or
- Help you create the Railway project and provide exact env var values to enter.

## Continuous Deployment via GitHub Actions (optional)
This repo includes a GitHub Actions workflow that automates deployment on push to `main`:

- Frontend: built from the `frontend` folder and deployed to Vercel using the Vercel GitHub Action.
- Backend: built from `backend/Dockerfile` and the resulting image is pushed to GitHub Container Registry (GHCR) as `ghcr.io/<owner>/blogify-backend:latest`.

Required GitHub repository secrets for the workflow to work:
- `VERCEL_TOKEN` — a Vercel personal token with deployment permissions.
- `VERCEL_ORG_ID` — your Vercel organization ID.
- `VERCEL_PROJECT_ID` — the Vercel project ID for the frontend.
- (the workflow uses `GITHUB_TOKEN` to publish to GHCR; ensure Actions permissions allow `packages: write`)

How to use the published backend image with Railway:
- Option A: Connect Railway to your GitHub repo and deploy using the repository (Railway will build from `backend/Dockerfile`).
- Option B: Configure Railway to pull the Docker image from GHCR (you may need to provide access credentials).

If you'd like, I can also:
- Add a small `vercel.json` for routing / headers, or
- Update the workflow to push the backend image to a registry of your choice (Docker Hub, Azure Container Registry, etc.).
