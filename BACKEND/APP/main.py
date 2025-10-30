
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import posts
from .config import settings
from motor.motor_asyncio import AsyncIOMotorClient  # type: ignore

app = FastAPI(title="Blog Backend")

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

@app.get("/")
async def root():
    return {"message": "Welcome to the Blog Backend API"}