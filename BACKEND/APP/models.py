# app/models.py
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class PostCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    content: str
    tags: Optional[list[str]] = []


class PostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    tags: Optional[list[str]] = None


class PostInDB(BaseModel):
    id: str
    title: str
    content: str
    tags: list[str] = []
    created_at: datetime
    updated_at: Optional[datetime] = None


class PostResponse(PostInDB):
    pass
