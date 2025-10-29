# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from BACKEND.APP.routers import posts
from .config import settings
from .db import get_client

app = FastAPI(title="Blog Backend")

# CORS - adjust origins in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # in prod, set allowed origins list
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    # Force creation of client on startup (optional)
    get_client()


@app.on_event("shutdown")
async def shutdown_event():
    # Close client on shutdown
    client = get_client()
    client.close()


app.include_router(posts.router)
