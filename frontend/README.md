# Unwanted Files & .gitignore

To keep your repository clean and secure, do not commit these files/folders (already in `.gitignore`):

- `node_modules/`, `.next/`, `.env.local` (dependencies, build outputs, secrets)
- Any `.DS_Store`, `Thumbs.db`, `*.log` (OS and log files)

If you accidentally commit these, untrack them with:
```bash
git rm -r --cached <file-or-folder>
```
and commit the change.

# Blogify Frontend - Comprehensive Documentation

Welcome to the **Blogify Frontend** documentation!

This guide serves as the definitive reference for the application's architecture, code structure, features, and implementation details. It is designed to provide a complete, step-by-step understanding of how the frontend works.

---

## 1. Project Overview

**Blogify** is a modern, single-page application (SPA) built to provide a seamless and beautiful blogging experience. It connects to a FastAPI backend to perform CRUD (Create, Read, Update, Delete) operations on blog posts and manage user authentication.

The frontend is built with four key pillars in mind:

*   **Performance:** Leveraging Next.js Server Components for speed.
*   **Readability:** Clean typography and layout optimized for long-form content.
*   **Developer Experience:** Fully type-safe code using TypeScript.
*   **Maintainability:** A modular, component-based architecture with centralized state management.

---

## 2. Technology Stack

We use the latest stable versions of the following cutting-edge technologies:

*   **Core Framework:** [Next.js 16.0.5](https://nextjs.org/) (App Router)
*   **UI Library:** [React 19.2.0](https://react.dev/)
*   **Language:** [TypeScript 5](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
    *   *Plugin:* `@tailwindcss/typography` (for beautiful Markdown rendering)

**Markdown & Content Rendering:**
*   `react-markdown`: Converts Markdown text into React components.
*   `remark-math`: Parses mathematical syntax.
*   `rehype-katex`: Renders math equations using KaTeX.
*   `remark-unwrap-images`: Removes `<p>` tags around images to prevent hydration errors.

**Utilities:**
*   **Icons:** Heroicons (via SVG).
*   **State Management:** React Context API.
*   **Build Tool:** Turbopack (via `next dev --turbo`).

---

## 3. Detailed Feature Implementation

### 3.1. Authentication System

**Core Logic:**
We use a token-less or session-based approach, simulated via `localStorage` for this demo.
*(Note: This can be easily swapped for standard JWT if the backend supports it).*

**Context Management (`UserContext.tsx`):**
*   **Initialization:** On mount (`useEffect`), the app checks `localStorage` for a saved `user` object.
*   **Auto-Login:** If a user object is found, it sets the `user` state, effectively logging the user in automatically.
*   **Login Action:** Accepts user data from the form, saves it to the global state, and persists it in `localStorage`.
*   **Logout Action:** Clears both the global state and `localStorage`, then redirects the user to the home page.

**Route Protection:**
Protected pages (like `posts/new` and `posts/[id]/edit`) utilize the `useUser()` hook. If `user` is null, the user is immediately redirected to `/feed` or `/login`.

### 3.2. The Blog Feed (`src/app/feed/page.tsx`)

**Data Fetching:**
This is a **Server Component**. It fetches data directly on the server using `getPosts(skip, limit)` from `lib/api.ts`, ensuring fast initial loads and SEO benefits.

**Pagination Logic:**
*   It reads the `?page=X` search parameter from the URL.
*   Calculates the skip value: `skip = (page - 1) * limit`.
*   Fetches the total count to determine `totalPages` for the UI.

**Layout Strategy:**
*   **Featured Post:** The **first post** in the list is highlighted as a "Featured Post" with a larger card layout.
*   **Grid Layout:** Subsequent posts are displayed in a responsive grid using the `PostCard` component.

### 3.3. Single Post View (`src/app/posts/[id]/page.tsx`)

**Dynamic Routing:**
The `[id]` folder creates a dynamic route (e.g., `/posts/123`). The `page.tsx` file receives `params.id` to know which post to load.

**Data Fetching:**
Fetches the specific post and its author details in parallel (or sequentially if dependent) to minimize waterfall requests.

**Rendering Pipeline:**
1.  **Markdown Processing:** `ReactMarkdown` processes the raw `content` string.
2.  **Math Rendering:** `remark-math` and `rehype-katex` transform `$math$` syntax into HTML math elements.
3.  **Image Handling:** A custom component is passed to `ReactMarkdown` to render images.
    *   *Fix:* `remark-unwrap-images` is used to remove wrapping `<p>` tags.
    *   *Styling:* Images are rendered inside a `div` with shadow and rounded corners. The `title` attribute becomes a caption.
    *   *URL Handling:* The `getImageUrl()` helper ensures relative paths from the backend (e.g., `/uploads/img.png`) are converted to full, valid URLs.

### 3.4. Creating & Editing Posts

**Form Handling:**
We use controlled inputs for the Title, Content (Textarea), and Tags fields to manage state effectively.

**Image Upload System:**
*   **Cover Image:** Uses a standard file input. The file is uploaded to `/posts/upload`, and the returned URL is sent with the post data.
*   **Content Images:** Features a custom "Insert Image" button in the editor.
    *   When a user selects an image, it is uploaded immediately.
    *   The returned URL is automatically inserted into the textarea as Markdown: `![Description](url)`.

**Edit Mode:**
*   Fetches existing data to pre-populate the form fields.
*   **Security Check:** Verifies `if (user.id !== post.user_id)` to prevent unauthorized edits on the client side.

---

## 4. Styling & Design System

### 4.1. Global Styles (`globals.css`)
*   **Theme:** We use CSS variables for colors but primarily rely on Tailwind's utility classes for styling.
*   **Dark Mode:** The app is forced to **Dark Mode** by default via `<html className="dark">` in `layout.tsx`.
    *   *Background:* `bg-slate-900` (via `bg-background`)
    *   *Text:* `text-slate-50` (via `text-foreground`)

### 4.2. Typography
*   **Font Family:** We use `Inter` from `next/font/google` for a clean, modern look.
*   **Prose Styling:** We utilize the `prose` class from `@tailwindcss/typography` in the post detail view. This automatically styles headings (`h1`, `h2`), paragraphs, lists, and code blocks within the Markdown content to look professional without writing manual CSS.

---

## 5. Installation & Setup Guide

Follow these steps to get the project running on your local machine.

### Prerequisites
1.  **Node.js:** Version 18.17 or later.
2.  **Backend:** The FastAPI backend must be running (default: `http://127.0.0.1:8000`).

### Step-by-Step Installation

1.  **Navigate to the Folder:**
    Open your terminal and move into the `frontend` directory:
    ```bash
    cd frontend
    ```

2.  **Install Dependencies:**
    Run the following command to install all required packages:
    ```bash
    npm install
    ```

3.  **Environment Configuration:**
    Create a file named `.env.local` in the `frontend` root directory. Add your backend URL:
    ```env
    NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
    ```
    *(Note: If your backend is running on a different port, update this value accordingly).*

4.  **Run Development Server:**
    Start the app in development mode:
    ```bash
    npm run dev
    ```

### Alternative: Quick Start (Run Everything)
If you want to run both the Backend and Frontend simultaneously, you can use the scripts provided in the **project root** folder:

*   **Windows:** Double-click `start_app.bat`
*   **PowerShell:** Run `..\start_app.ps1`

5.  **Access the App:**
    Open your web browser and go to:
    `http://localhost:3000`

---

## 6. Common Issues & Troubleshooting

*   **Images not loading?**
    *   Check if the backend is running.
    *   Verify `NEXT_PUBLIC_API_URL` in `.env.local` matches your backend URL.
    *   Ensure the backend is serving static files correctly from the `uploads` directory.

*   **Hydration Errors?**
    *   *(Text content does not match server-rendered HTML)*
    *   This often happens with Markdown. We fixed the most common cause (images inside paragraphs) using `remark-unwrap-images`.
    *   If you see this, ensure your HTML nesting in custom components is valid (e.g., no `div` inside `p`).

*   **"User not found" on refresh?**
    *   The app relies on `localStorage`. If you clear your browser cache, you will be logged out.

---

## 7. API Reference (`src/lib/api.ts`)

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

## 8. Automation Scripts Reference

To streamline development, we use automation scripts located in the **project root**. If you need to recreate them, here is the source code:

**start_app.bat (Windows CMD)**
```bat
@echo off
echo Starting Backend...
start "Blogify Backend" cmd /k "uvicorn BACKEND.APP.main:app --reload"

echo Starting Frontend...
cd frontend
start "Blogify Frontend" cmd /k "npm run dev"

echo Waiting for services to start...
timeout /t 5 >nul
start http://localhost:3000

echo Both services are starting in separate windows.
```

**start_app.ps1 (PowerShell)**
```powershell
# Start Backend
Write-Host "Starting Backend..." -ForegroundColor Green
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "uvicorn BACKEND.APP.main:app --reload"

# Start Frontend
Write-Host "Starting Frontend..." -ForegroundColor Green
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

# Open Browser
Write-Host "Waiting for services to start..." -ForegroundColor Cyan
Start-Sleep -Seconds 5
Start-Process "http://localhost:3000"

Write-Host "Both services are starting in separate windows." -ForegroundColor Cyan
```

---

*Documentation generated for Blogify v1.0*