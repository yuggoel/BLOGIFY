# Blogify Frontend - Comprehensive Documentation

This document serves as the definitive guide to the **Blogify Frontend**. It covers every aspect of the application's architecture, code structure, features, and implementation details. It is designed to provide a complete understanding of how the frontend works, step-by-step.

---

## 1. Project Overview

**Blogify** is a modern, single-page application (SPA) built to provide a seamless blogging experience. It connects to a FastAPI backend to perform CRUD (Create, Read, Update, Delete) operations on blog posts and manage user authentication.

The frontend is built with a focus on:
*   **Performance:** Using Next.js Server Components.
*   **Readability:** Clean typography and layout for long-form content.
*   **Developer Experience:** Type-safe code with TypeScript.
*   **Maintainability:** Component-based architecture and centralized state management.

---

## 2. Technology Stack

We use the latest stable versions of the following technologies:

*   **Core Framework:** [Next.js 16.0.5](https://nextjs.org/) (App Router)
*   **UI Library:** [React 19.2.0](https://react.dev/)
*   **Language:** [TypeScript 5](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
    *   **Plugin:** `@tailwindcss/typography` (for rendering Markdown content styles)
*   **Markdown Rendering:**
    *   `react-markdown`: Converts Markdown to React components.
    *   `remark-math`: Parses math syntax.
    *   `rehype-katex`: Renders math using KaTeX.
    *   `remark-unwrap-images`: Removes `<p>` tags around images to prevent hydration errors.
*   **Icons:** Heroicons (via SVG).
*   **State Management:** React Context API.
*   **Build Tool:** Turbopack (via `next dev --turbo`).

---

## 3. Directory Structure & File Breakdown

Here is a detailed explanation of every significant file and folder in `frontend/`:

```text
frontend/
├── .next/                  # Build output (gitignored)
├── node_modules/           # Dependencies (gitignored)
├── public/                 # Static assets (images, fonts)
├── src/
│   ├── app/                # Next.js App Router (Pages & Layouts)
│   │   ├── feed/           # Feed Page Route
│   │   │   └── page.tsx    # Server Component. Fetches & displays list of posts.
│   │   ├── login/          # Login Page Route
│   │   │   └── page.tsx    # Client Component. Login form.
│   │   ├── posts/          # Post Routes
│   │   │   ├── [id]/       # Dynamic Route for Single Post
│   │   │   │   ├── edit/   # Edit Post Route
│   │   │   │   │   └── page.tsx # Client Component. Edit form.
│   │   │   │   └── page.tsx     # Server Component. Displays single post.
│   │   │   └── new/        # Create Post Route
│   │   │   │   └── page.tsx     # Client Component. Create form.
│   │   ├── signup/         # Signup Page Route
│   │   │   └── page.tsx    # Client Component. Registration form.
│   │   ├── globals.css     # Global CSS (Tailwind imports & theme vars)
│   │   ├── layout.tsx      # Root Layout (HTML shell, Providers, Header/Footer)
│   │   └── page.tsx        # Root Page (Redirects to /feed or landing)
│   ├── components/         # Reusable UI Components
│   │   ├── DeletePostButton.tsx # Button to delete a post (Owner only)
│   │   ├── EditPostButton.tsx   # Button to edit a post (Owner only)
│   │   ├── Footer.tsx      # Site footer
│   │   ├── Header.tsx      # Navigation bar (Responsive)
│   │   ├── index.ts        # Barrel file for easy imports
│   │   ├── Pagination.tsx  # Pagination controls
│   │   ├── PostCard.tsx    # Card component for post previews
│   │   ├── ProfilePicture.tsx # User avatar component
│   │   ├── Sidebar.tsx     # Sidebar component (currently placeholder)
│   │   └── Skeleton.tsx    # Loading state placeholders
│   ├── context/            # Global State
│   │   └── UserContext.tsx # Auth state (User object, Login/Logout logic)
│   └── lib/                # Utilities & Helpers
│       └── api.ts          # API Client (Fetch wrappers for Backend)
├── .env.local              # Environment variables (API URL)
├── .gitignore              # Git ignore rules
├── eslint.config.mjs       # ESLint configuration
├── next-env.d.ts           # Next.js TypeScript declarations
├── next.config.ts          # Next.js configuration
├── package.json            # Project dependencies & scripts
├── postcss.config.mjs      # PostCSS configuration
├── README.md               # This file
└── tsconfig.json           # TypeScript configuration
```

---

## 4. Detailed Feature Implementation

### 4.1. Authentication System
*   **Logic:** We use a token-less or session-based approach simulated via `localStorage` for this demo (or standard JWT if the backend supports it).
*   **Context (`UserContext.tsx`):**
    *   On mount (`useEffect`), it checks `localStorage` for a saved `user` object.
    *   If found, it sets the `user` state, effectively logging the user in.
    *   **Login:** Accepts user data, saves to state and `localStorage`.
    *   **Logout:** Clears state and `localStorage`, redirects to home.
*   **Protection:** Pages like `posts/new` and `posts/[id]/edit` check `useUser()`. If `user` is null, they redirect to `/feed` or `/login`.

### 4.2. The Blog Feed (`src/app/feed/page.tsx`)
*   **Fetching:** It is a **Server Component**. It fetches data directly on the server using `getPosts(skip, limit)` from `lib/api.ts`.
*   **Pagination:** It reads the `?page=X` search parameter.
    *   Calculates `skip = (page - 1) * limit`.
    *   Fetches total count to determine `totalPages`.
*   **Layout:**
    *   The **first post** is highlighted as a "Featured Post" (larger card).
    *   Subsequent posts are displayed in a grid using the `PostCard` component.

### 4.3. Single Post View (`src/app/posts/[id]/page.tsx`)
*   **Dynamic Routing:** The `[id]` folder creates a route like `/posts/123`. The `page.tsx` receives `params.id`.
*   **Data Fetching:** Fetches the specific post and its author details in parallel (or sequentially if dependent).
*   **Rendering Pipeline:**
    1.  **Markdown:** `ReactMarkdown` processes the `content` string.
    2.  **Math:** `remark-math` and `rehype-katex` transform `$math$` into HTML math elements.
    3.  **Images:** A custom component is passed to `ReactMarkdown` to render images.
        *   **Fix:** `remark-unwrap-images` is used to remove wrapping `<p>` tags.
        *   **Styling:** Images are rendered inside a `div` with shadow and rounded corners. The `title` attribute becomes a caption.
        *   **URL Handling:** `getImageUrl()` helper ensures relative paths from the backend (e.g., `/uploads/img.png`) are converted to full URLs (`http://localhost:8000/uploads/img.png`).

### 4.4. Creating & Editing Posts
*   **Forms:** Controlled inputs for Title, Content (Textarea), and Tags.
*   **Image Upload:**
    *   **Cover Image:** Standard file input. Uploads to `/posts/upload`, returns a URL, which is sent with the post data.
    *   **Content Images:** A custom "Insert Image" button.
        *   When a user selects an image, it is uploaded immediately.
        *   The returned URL is inserted into the textarea as Markdown: `![Description](url)`.
*   **Edit Mode:**
    *   Fetches existing data to populate fields.
    *   **Security:** Checks `if (user.id !== post.user_id)` to prevent unauthorized edits.

---

## 5. Styling & Design System

### 5.1. Global Styles (`globals.css`)
*   **Theme:** We use CSS variables for colors, but primarily rely on Tailwind's utility classes.
*   **Dark Mode:** The app is forced to Dark Mode by default via `<html className="dark">` in `layout.tsx`.
    *   Background: `bg-slate-900` (via `bg-background`)
    *   Text: `text-slate-50` (via `text-foreground`)

### 5.2. Typography
*   **Font:** `Inter` from `next/font/google`.
*   **Prose:** We use the `prose` class from `@tailwindcss/typography` in the post detail view. This automatically styles headings (`h1`, `h2`), paragraphs, lists, and code blocks within the Markdown content to look professional without manual CSS.

---

## 6. Installation & Setup Guide (Step-by-Step)

### Prerequisites
1.  **Node.js:** Version 18.17 or later.
2.  **Backend:** The FastAPI backend must be running (default: `http://127.0.0.1:8000`).

### Installation

1.  **Clone/Navigate:**
    Open your terminal and navigate to the `frontend` folder.
    ```bash
    cd frontend
    ```

2.  **Install Dependencies:**
    Run the following command to install all required packages:
    ```bash
    npm install
    ```

3.  **Environment Configuration:**
    Create a file named `.env.local` in the `frontend` root. Add your backend URL:
    ```env
    NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
    ```
    *(If your backend is on a different port, update this value).*

4.  **Run Development Server:**
    Start the app in development mode:
    ```bash
    npm run dev
    ```

5.  **Access the App:**
    Open your web browser and go to:
    `http://localhost:3000`

---

## 7. Common Issues & Troubleshooting

*   **Images not loading:**
    *   Check if the backend is running.
    *   Verify `NEXT_PUBLIC_API_URL` in `.env.local` matches your backend URL.
    *   Ensure the backend is serving static files correctly from the `uploads` directory.

*   **Hydration Errors (Text content does not match server-rendered HTML):**
    *   This often happens with Markdown. We fixed the most common cause (images inside paragraphs) using `remark-unwrap-images`.
    *   If you see this, ensure your HTML nesting in custom components is valid (e.g., no `div` inside `p`).

*   **"User not found" on refresh:**
    *   The app relies on `localStorage`. If you clear your browser cache, you will be logged out.

---

## 8. API Reference (`src/lib/api.ts`)

This file acts as the bridge between Frontend and Backend.

| Function | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| `getPosts(skip, limit)` | GET | `/posts/` | Fetches a paginated list of posts. |
| `getPost(id)` | GET | `/posts/{id}` | Fetches a single post by ID. |
| `createPost(data)` | POST | `/posts/` | Creates a new post (Auth required). |
| `updatePost(id, data)` | PUT | `/posts/{id}` | Updates a post (Owner only). |
| `deletePost(id)` | DELETE | `/posts/{id}` | Deletes a post (Owner only). |
| `uploadImage(file)` | POST | `/posts/upload` | Uploads an image file. |
| `login(data)` | POST | `/users/login` | Authenticates a user. |
| `signup(data)` | POST | `/users/signup` | Registers a new user. |
| `getUser(id)` | GET | `/users/{id}` | Fetches user profile details. |

---

*Documentation generated for Blogify v1.0*
