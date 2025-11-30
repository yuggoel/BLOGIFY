# app/models.py
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


# ===== USER MODELS =====
class UserCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: str = Field(..., pattern=r"^[\w\.-]+@[\w\.-]+\.\w+$")
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    created_at: datetime


# ===== POST MODELS =====
class PostCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    content: str
    tags: Optional[list[str]] = []
    user_id: str  # ← NEW: Every post needs a user_id


class PostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    tags: Optional[list[str]] = None


class PostInDB(BaseModel):
    id: str
    title: str
    content: str
    tags: list[str] = []
    user_id: str  # ← NEW
    created_at: datetime
    updated_at: Optional[datetime] = None


class PostResponse(PostInDB):
    pass