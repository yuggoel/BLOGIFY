from typing import List, Optional
from pydantic import BaseModel


# ── Auth ───────────────────────────────────────────────────────────────────────

class AuthSignup(BaseModel):
    name: str
    email: str
    password: str


class AuthLogin(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    user_id: str
    name: str
    email: str


# ── Posts ──────────────────────────────────────────────────────────────────────

class PostCreate(BaseModel):
    title: str
    content: str
    user_id: str
    tags: List[str] = []
    image_url: Optional[str] = None


class PostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    tags: Optional[List[str]] = None
    image_url: Optional[str] = None


class PostResponse(BaseModel):
    id: str
    title: str
    content: str
    user_id: str
    tags: List[str]
    image_url: Optional[str]
    created_at: str
    updated_at: Optional[str]


# ── Users ──────────────────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    name: str
    email: str


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    profile_picture_url: Optional[str] = None


class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    profile_picture_url: Optional[str]
    created_at: str
