# Blogify

A full-stack blogging platform built with **Next.js 16** and **FastAPI + MongoDB**.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4, TypeScript |
| Backend API | Python FastAPI + Uvicorn |
| Database | MongoDB (PyMongo) |
| Auth | FastAPI JWT (PyJWT + bcrypt) |
| Storage | MongoDB GridFS (images) |
| Markdown | react-markdown, remark-math, rehype-katex |

---

## Features

- Sign up / log in with email and password
- Create, edit, and delete blog posts
- Markdown editor with math equation support (KaTeX)
- Image uploads per post
- Tag-based filtering
- User profiles with avatar upload
- Fully responsive dark/light UI
- Protected routes — all content requires login

---

## Project Structure

```
src/
  app/                  # Next.js App Router pages
    feed/               # Main blog feed
    posts/[id]/         # Post detail (read)
    posts/new/          # Create post
    posts/[id]/edit/    # Edit post
    login/              # Login page
    signup/             # Signup page
    profile/            # User profile
    about/              # About page
  components/           # Shared UI components
  context/              # UserContext (global auth state)
  lib/
    api.ts              # All API calls to FastAPI backend
```

---

## Auth Architecture

Session is stored in **localStorage** as a JWT token (`blogify_token`) issued by the FastAPI backend.

**UserContext** (`src/context/UserContext.tsx`):
1. On mount — calls `getTokenPayload()` to decode the JWT from localStorage (synchronous, no network)
2. Fetches full profile from `GET /users/{id}`
3. Sets `user` + `loading = false`

**RequireAuth** (`src/components/RequireAuth.tsx`):
- Three-state guard: `loading` → spinner, `user = null` → redirect to `/login`, `user` → render children
- Wraps all protected pages client-side

**Login flow:**
1. `POST /auth/login` returns a JWT token
2. `setToken(token)` writes it to localStorage
3. `UserContext` decodes the token and fetches the user profile
4. `router.push(returnTo)` navigates within the SPA — token stays intact

---

## Environment Variables

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

---

## Getting Started

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## .gitignore — Do Not Commit

- `node_modules/`, `.next/` — dependencies and build output
- `.env.local` — contains secrets
- `*.log`, `.DS_Store`, `Thumbs.db` — OS/log files

To untrack an accidentally committed file:

```bash
git rm -r --cached <file-or-folder>
```