# Blogify

<p align="center"><i>Your space to write, express, and inspire.</i></p>

<p align="center">
  <a href="https://yuggoel-blogify.vercel.app/">?? Live Demo</a> •
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a>
</p>

---

## ?? Live Demo

**https://yuggoel-blogify.vercel.app/**

---

## ?? Introduction

Blogify is a modern blogging platform where anyone can share their thoughts, ideas, and stories. The app is built entirely with **Next.js** on the frontend, talking directly to **Supabase** for the database, authentication, and file storage — no separate backend server required.

Whether you're a student, developer, writer, or someone who simply loves expressing ideas, Blogify makes blogging feel natural and enjoyable.

---

## ? Features

- ?? User signup & login (email/password via Supabase Auth)
- ?? Create, edit & delete blog posts with **Markdown + math (KaTeX) support**
- ??? Image uploads per post and avatar uploads for profiles
- ?? Community feed with featured post highlight and pagination
- ??? Tag-based post filtering
- ?? Personal profile page with editable name and avatar
- ?? View other users' public profiles
- ?? Responsive dark/light UI
- ?? All content is protected — login required to access anything

---

## ??? Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS, TypeScript |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (email/password) |
| Storage | Supabase Storage (images) |
| Security | Row Level Security (RLS) policies |
| Markdown | react-markdown, remark-math, rehype-katex |
| Hosting | Vercel |

---

## ?? Project Structure

```
frontend/
  src/
    app/                  # Next.js App Router pages
      feed/               # Main blog feed (requires login)
      posts/[id]/         # Post detail view
      posts/new/          # Create a post
      posts/[id]/edit/    # Edit a post
      login/              # Login page
      signup/             # Signup page
      profile/            # Your profile
      users/[id]/         # Other users' profiles
      tags/[tag]/         # Posts filtered by tag
      about/              # About page
    components/           # Shared UI components (Header, Footer, PostCard, etc.)
    context/
      UserContext.tsx      # Global auth state (current logged-in user)
    lib/
      api.ts              # All Supabase data functions (posts, users, images)
      supabase.ts         # Supabase client instance
```

---

## ?? How It Works

There is **no separate backend server**. The Next.js frontend communicates directly with Supabase:

```
Browser (Next.js)
      ?
  Supabase (cloud)
  +-- PostgreSQL  ?  posts & users tables
  +-- Auth        ?  email/password sessions
  +-- Storage     ?  post images & profile pictures
```

- **`supabase.ts`** — Creates the Supabase client using the environment variables.
- **`api.ts`** — Contains all data functions (`getPosts`, `createPost`, `login`, `signup`, `uploadImage`, etc.).
- **`UserContext.tsx`** — On app load, reads the stored Supabase session and makes the logged-in user available globally.
- **Security** — Enforced by Supabase Row Level Security (RLS) policies. Users can only edit/delete their own posts and profiles.

---

## ?? Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project (free tier works)

### 1. Clone the Repository

```bash
git clone https://github.com/yuggoel/BLOGIFY.git
cd BLOGIFY/frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a file at `frontend/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Get these values from your Supabase project ? **Settings ? API**.

### 4. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## ?? Deployment (Vercel)

1. Push your repo to GitHub.
2. Import the project on [Vercel](https://vercel.com).
3. Set the root directory to `frontend`.
4. Add the environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
5. Deploy.

---

## ?? .gitignore — Do Not Commit

- `node_modules/`, `frontend/.next/` — dependencies and build output
- `frontend/.env.local` — contains your Supabase keys (secrets)
- `__pycache__/`, `*.pyc` — Python cache files
- `.DS_Store`, `Thumbs.db` — OS metadata

To untrack an accidentally committed file:

```bash
git rm -r --cached <file-or-folder>
```

---
