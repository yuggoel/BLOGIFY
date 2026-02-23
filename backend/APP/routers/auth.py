from datetime import datetime, timezone

import bcrypt
from fastapi import APIRouter, HTTPException, status

from ..auth import create_access_token
from ..database import users_col
from ..models import AuthLogin, AuthSignup, TokenResponse

router = APIRouter(prefix="/auth", tags=["auth"])


def _hash(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def _verify(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())


@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def signup(body: AuthSignup):
    """Register a new user. Returns a JWT access token immediately."""
    if body.password.strip() == "" or len(body.password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 6 characters",
        )

    # Check if email is already taken
    if users_col.find_one({"email": body.email}, {"_id": 1}):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with that email already exists",
        )

    now = datetime.now(timezone.utc).isoformat()
    doc = {
        "name": body.name.strip(),
        "email": body.email.lower().strip(),
        "password_hash": _hash(body.password),
        "profile_picture": None,
        "created_at": now,
        "updated_at": now,
    }
    result = users_col.insert_one(doc)
    user_id = str(result.inserted_id)

    token = create_access_token(user_id, doc["email"])
    return TokenResponse(
        access_token=token,
        user_id=user_id,
        name=doc["name"],
        email=doc["email"],
    )


@router.post("/login", response_model=TokenResponse)
def login(body: AuthLogin):
    """Authenticate with email + password. Returns a JWT access token."""
    doc = users_col.find_one({"email": body.email.lower().strip()})
    if not doc or not _verify(body.password, doc.get("password_hash", "")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    user_id = str(doc["_id"])
    token = create_access_token(user_id, doc["email"])
    return TokenResponse(
        access_token=token,
        user_id=user_id,
        name=doc["name"],
        email=doc["email"],
    )
