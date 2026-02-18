from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import posts, users

app = FastAPI(
    title="Blogify API",
    description="FastAPI backend for Blogify. Auth and Storage are handled directly by Supabase on the frontend.",
    version="1.0.0",
)

# ── CORS ───────────────────────────────────────────────────────────────────────
# In production replace "*" with your Vercel domain, e.g. "https://yuggoel-blogify.vercel.app"
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://yuggoel-blogify.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ────────────────────────────────────────────────────────────────────
app.include_router(posts.router)
app.include_router(users.router)


@app.get("/")
def root():
    return {"status": "ok", "message": "Blogify API is running"}
