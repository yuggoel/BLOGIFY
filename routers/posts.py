# app/routers/posts.py
from fastapi import APIRouter, HTTPException, Depends, Query, status
from typing import List
from ..models import PostCreate, PostResponse, PostUpdate
from ..repositories.posts import PostRepository
from ..db import get_database
from motor.motor_asyncio import AsyncIOMotorDatabase

router = APIRouter(prefix="/posts", tags=["posts"])


async def get_repo(db: AsyncIOMotorDatabase = Depends(get_database)) -> PostRepository:
    return PostRepository(db)


@router.post("/", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
async def create_post(payload: PostCreate, repo: PostRepository = Depends(get_repo)):
    post = await repo.create_post(payload.title, payload.content, payload.tags)
    return post


@router.get("/{post_id}", response_model=PostResponse)
async def read_post(post_id: str, repo: PostRepository = Depends(get_repo)):
    post = await repo.get_post(post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


@router.get("/", response_model=List[PostResponse])
async def list_posts(skip: int = Query(0, ge=0), limit: int = Query(20, ge=1, le=100), repo: PostRepository = Depends(get_repo)):
    posts = await repo.list_posts(skip=skip, limit=limit)
    return posts


@router.put("/{post_id}", response_model=PostResponse)
async def update_post(post_id: str, payload: PostUpdate, repo: PostRepository = Depends(get_repo)):
    post = await repo.update_post(post_id, payload.title, payload.content, payload.tags)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found or invalid ID")
    return post


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(post_id: str, repo: PostRepository = Depends(get_repo)):
    deleted = await repo.delete_post(post_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Post not found or invalid ID")
    return None  # 204 No Content
