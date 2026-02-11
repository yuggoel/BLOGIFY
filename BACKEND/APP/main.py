
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from routers import posts, users
from .config import settings
import os

# Global database connection
db_pool = None
mongo_client = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifespan - startup and shutdown"""
    global db_pool, mongo_client
    
    # Startup
    if settings.DB_MODE == "supabase" and settings.DATABASE_URL:
        # Use Supabase/PostgreSQL
        import asyncpg
        db_pool = await asyncpg.create_pool(settings.DATABASE_URL, min_size=2, max_size=10)
        print("✅ Connected to Supabase PostgreSQL")
    else:
        # Use MongoDB
        from motor.motor_asyncio import AsyncIOMotorClient
        mongo_client = AsyncIOMotorClient(settings.MONGODB_URI)
        print("✅ Connected to MongoDB")
    
    yield
    
    # Shutdown
    if db_pool:
        await db_pool.close()
    if mongo_client:
        mongo_client.close()


app = FastAPI(title="Blog Backend", lifespan=lifespan)
from routers import auth, protected
from auth import get_current_user
from fastapi import Depends


def get_db():
    """Get database connection based on DB_MODE"""
    if settings.DB_MODE == "supabase":
        return db_pool
    else:
        return mongo_client[settings.MONGODB_DB]


# Make get_db available to routers
app.state.get_db = get_db
app.state.db_mode = settings.DB_MODE


@app.get("/")
def root():
    return {"status": "Backend running", "db_mode": settings.DB_MODE}

def public_routes():
    return ["/login", "/register", "/"]

@app.middleware("http")
async def enforce_auth(request, call_next):
    path = request.url.path
    if path not in public_routes():
        try:
            # Extract token from Authorization header
            token = request.headers.get("Authorization")
            if not token or not token.startswith("Bearer "):
                from fastapi.responses import JSONResponse
                return JSONResponse(status_code=401, content={"detail": "Not authenticated"})
            token = token.split(" ", 1)[1]
            get_current_user(token)
        except Exception:
            from fastapi.responses import JSONResponse
            return JSONResponse(status_code=401, content={"detail": "Invalid or missing token"})
    response = await call_next(request)
    return response

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

# Register routers
app.include_router(auth.router)
app.include_router(protected.router)
app.include_router(posts.router)
app.include_router(users.router)