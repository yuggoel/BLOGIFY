from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .routers import posts, users
from .routers.auth import router as auth_router
from .routers.upload import router as upload_router

app = FastAPI(
    title="Blogify API",
    description="FastAPI + MongoDB backend for Blogify. Auth, storage, and JWT are all self-contained.",
    version="2.0.0",
)

# ── CORS ───────────────────────────────────────────────────────────────────────
# allow_origins is driven by FRONTEND_URL env var (set on Railway).
# Locally it defaults to http://localhost:3000.
# allow_origin_regex also covers Vercel preview deployment URLs.
_origins = list({"http://localhost:3000", settings.frontend_url})
app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ────────────────────────────────────────────────────────────────────
app.include_router(auth_router)
app.include_router(upload_router)
app.include_router(posts.router)
app.include_router(users.router)


@app.get("/")
def root():
    return {"status": "ok", "message": "Blogify API is running"}
