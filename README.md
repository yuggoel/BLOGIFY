# Blogify

<p align="center"><i>Your space to write, express, and inspire.</i></p>

<p align="center">
  <a href="https://yuggoel-blogify.vercel.app/">Live Demo</a> &bull;
  <a href="#features">Features</a> &bull;
  <a href="#tech-stack">Tech Stack</a> &bull;
  <a href="#getting-started">Getting Started</a>
</p>

---

## Live Demo

**https://yuggoel-blogify.vercel.app/**

---

## Introduction

Blogify is a modern blogging platform where anyone can share their thoughts, ideas, and stories.

**Architecture:**

```
Browser (Next.js)
      |
      +-- Auth + Data + Storage  -->  FastAPI  -->  MongoDB
```

- **FastAPI** handles all auth (signup/login with bcrypt + JWT), data reads/writes, and image uploads.
- **MongoDB** stores all posts, user profiles, and uploaded images (via GridFS).
- **PyJWT** signs and verifies JWTs — no third-party auth provider required.
- **Next.js** is the frontend — all pages, UI, and routing.

---

## Features

- User signup and login (email/password with bcrypt + JWT)
- Create, edit, and delete blog posts with Markdown + math (KaTeX) support
- Image uploads per post and avatar uploads for profiles (MongoDB GridFS)
- Community feed with featured post highlight and pagination
- Tag-based post filtering
- Personal profile page with editable name and avatar
- View other users' public profiles
- Responsive dark/light UI
- All content is protected — login required to access anything

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS, TypeScript |
| Backend API | Python FastAPI + Uvicorn |
| Database | MongoDB (PyMongo) |
| Auth | FastAPI JWT (PyJWT + bcrypt) |
| Storage | MongoDB GridFS (images) |
| Markdown | react-markdown, remark-math, rehype-katex |
| Frontend Hosting | Vercel |
| Backend Hosting | Railway |

---

## Project Structure

```
backend/
  APP/
    main.py          # FastAPI entry point + CORS
    config.py        # Loads backend/.env settings
    database.py      # PyMongo client + GridFS setup
    auth.py          # Issues and verifies JWT on protected routes
    models.py        # Pydantic request/response schemas
    routers/
      posts.py       # GET/POST/PUT/DELETE /posts
      users.py       # GET/PUT/DELETE /users/{id}
  requirements.txt
  .env.example
  .env               # Your secrets (never commit this)

frontend/
  src/
    app/             # Next.js App Router pages
      feed/          # Main blog feed (requires login)
      posts/[id]/    # Post detail view
      posts/new/     # Create a post
      posts/[id]/edit/   # Edit a post
      login/         # Login page
      signup/        # Signup page
      profile/       # Your profile
      users/[id]/    # Other users profiles
      tags/[tag]/    # Posts filtered by tag
      about/         # About page
    components/      # Shared UI (Header, Footer, PostCard, etc.)
    context/
      UserContext.tsx   # Global auth state
    lib/
      api.ts         # All data + auth + image upload calls (FastAPI)
  .env.local         # Your frontend secrets (never commit this)
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- A running MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas) free tier)

---

### Backend Setup

**1. Create and activate virtual environment**
```bash
python -m venv .venv
.venv\Scripts\activate        # Windows
source .venv/bin/activate     # macOS/Linux
```

**2. Install dependencies**
```bash
pip install -r backend/requirements.txt
```

**3. Create `backend/.env`** (copy from the example)
```bash
copy backend\.env.example backend\.env
```

Fill in your MongoDB URI and JWT secret:

```env
# Local MongoDB:  mongodb://localhost:27017/blogify
# MongoDB Atlas:  mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/blogify
MONGODB_URI=mongodb://localhost:27017/blogify

# Any long random string — used to sign JWTs issued by this API
JWT_SECRET=your-long-random-secret
```

**4. Run the backend**
```bash
uvicorn backend.APP.main:app --reload
```

- API: http://127.0.0.1:8000
- Swagger docs: http://127.0.0.1:8000/docs

---

### Frontend Setup

**1. Install dependencies**
```bash
cd frontend
npm install
```

**2. Create `frontend/.env.local`**
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

**3. Run the frontend**
```bash
npm run dev
```

App: http://localhost:3000

---

## Deployment

### Backend (Railway)

1. Connect your GitHub repo to [Railway](https://railway.app).
2. Set the root directory to `backend/`.
3. Set start command: `uvicorn APP.main:app --host 0.0.0.0 --port $PORT`
4. Add environment variables: `MONGODB_URI`, `JWT_SECRET`
5. Deploy. Railway gives you a public URL.

### Frontend (Vercel)

1. Connect your GitHub repo to [Vercel](https://vercel.com).
2. Set root directory to `frontend/`.
3. Add environment variables:
   - `NEXT_PUBLIC_API_URL` — set to your Railway backend URL
4. Deploy.

---

## .gitignore - Do Not Commit

- `node_modules/`, `frontend/.next/` — dependencies and build output
- `frontend/.env.local` — contains API URL override
- `backend/.env` — contains MongoDB URI and JWT secret
- `__pycache__/`, `*.pyc` — Python cache files
- `.DS_Store`, `Thumbs.db` — OS metadata

```bash
git rm -r --cached <file-or-folder>
```

---