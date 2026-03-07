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
- **Public endpoints:** View posts, user profiles, and counts without login
- **Protected endpoints:** Creating, editing, deleting posts/users, and uploads require authentication

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
    auth.py          # JWT creation/validation, authentication helpers
    models.py        # Pydantic request/response schemas
    routers/
      posts.py       # All /posts endpoints (public/protected)
      users.py       # All /users endpoints (public/protected)
      auth.py        # /auth/signup, /auth/login (public)
      upload.py      # /upload, /images (protected)
  requirements.txt
  .env.example
  .env               # Your secrets (never commit this)

frontend/
  src/
    app/             # Next.js App Router pages
      feed/          # Main blog feed (protected)
      posts/[id]/    # Post detail view (public)
      posts/new/     # Create a post (protected)
      posts/[id]/edit/   # Edit a post (protected)
      login/         # Login page (public)
      signup/        # Signup page (public)
      profile/       # Your profile (protected)
      users/[id]/    # Other users profiles (public)
      tags/[tag]/    # Posts filtered by tag (public)
      about/         # About page (public)
    components/      # Shared UI (Header, Footer, PostCard, etc.)
    context/
      UserContext.tsx   # Global auth state
    lib/
      api.ts         # All data + auth + image upload calls (FastAPI)
  .env.local         # Your frontend secrets (never commit this)
```

---

## API Endpoint Authentication Table

| Endpoint                  | Method | Public | Description                                 |
|---------------------------|--------|--------|---------------------------------------------|
| `/auth/signup`            | POST   | Yes    | Register new user, returns JWT              |
| `/auth/login`             | POST   | Yes    | Login, returns JWT                          |
| `/users/{user_id}`        | GET    | Yes    | Get user profile                            |
| `/users/count`            | GET    | Yes    | Get user count                              |
| `/users/{user_id}`        | PUT    | No     | Update user (self only)                     |
| `/users/{user_id}`        | DELETE | No     | Delete user (self only)                     |
| `/posts`                  | GET    | Yes    | List posts                                  |
| `/posts/{post_id}`        | GET    | Yes    | Get post by ID                              |
| `/posts/count`            | GET    | No     | Get post count                              |
| `/posts`                  | POST   | No     | Create post                                 |
| `/posts/{post_id}`        | PUT    | No     | Update post (owner only)                    |
| `/posts/{post_id}`        | DELETE | No     | Delete post (owner only)                    |
| `/upload`                 | POST   | No     | Upload image                                |
| `/images/{file_id}`       | GET    | No     | Get uploaded image                          |
| `/`                       | GET    | Yes    | API root (health/status)                    |

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
cd backend
python -m pip install -r requirements.txt
python -m uvicorn APP.main:app --reload --host 127.0.0.1 --port 8000
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
cd frontend
npm install
npm run dev
```

App: http://localhost:3000

---

## Auth Architecture (Frontend)

- JWT token is stored in `localStorage` as `blogify_token`.
- All protected API calls include the Authorization header.
- `UserContext` manages auth state; `RequireAuth` guards protected pages.

**Login flow:**
1. `POST /auth/login` returns a JWT token
2. `setToken(token)` writes it to localStorage
3. `UserContext` decodes the token and fetches the user profile
4. Navigation within the SPA keeps the token intact

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