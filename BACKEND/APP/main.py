
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from routers import posts, users
from .config import settings
from motor.motor_asyncio import AsyncIOMotorClient  # type: ignore
import os

app = FastAPI(title="Blog Backend")

@app.get("/")
def root():
    return {"status": "Backend running"}

# Create static directory if it doesn't exist
os.makedirs("static/images", exist_ok=True)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = None

@app.on_event("startup")
async def startup_event():
    # Initialize DB connection
    global client
    client = AsyncIOMotorClient(settings.MONGODB_URI)

@app.on_event("shutdown")
async def shutdown_event():
    # Close DB connection
    global client
    if client is not None:
        client.close()

# Register routers
app.include_router(posts.router)
app.include_router(users.router)
@app.get("/")
async def root():
    return {"message": "Welcome to the Blog Backend API"}