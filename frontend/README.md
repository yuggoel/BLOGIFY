# Blogify

A full-stack blogging platform built with **Next.js 16** and **Supabase**.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4, TypeScript |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (email/password) |
| Storage | Supabase Storage (images) |
| Security | Row Level Security (RLS) policies |
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
    api.ts              # All Supabase data functions
    supabase.ts         # Supabase client instance
```

---

## Auth Architecture

Session is stored in **localStorage** via the standard Supabase JS client (`createClient`).

**UserContext** (`src/context/UserContext.tsx`):
1. On mount — calls `getSession()` to read localStorage immediately (synchronous, no network)
2. Sets `user` + `loading = false`
3. Listens to `onAuthStateChange` for `SIGNED_IN`, `TOKEN_REFRESHED`, `SIGNED_OUT` (ignores `INITIAL_SESSION` to avoid double-fire)

**RequireAuth** (`src/components/RequireAuth.tsx`):
- Three-state guard: `loading` → spinner, `user = null` → redirect to `/login`, `user` → render children
- Wraps all protected pages client-side

**Login flow:**
1. `supabase.auth.signInWithPassword()` writes session to localStorage
2. `onAuthStateChange(SIGNED_IN)` fires → `UserContext` updates `user`
3. `router.push(returnTo)` navigates within the SPA — localStorage stays intact

---

## Environment Variables

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
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