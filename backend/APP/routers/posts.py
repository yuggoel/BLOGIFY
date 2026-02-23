from datetime import datetime, timezone
from typing import Optional

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Depends, HTTPException, Query, status

from ..auth import get_current_user_id
from ..database import posts_col
from ..models import PostCreate, PostResponse, PostUpdate

router = APIRouter(prefix="/posts", tags=["posts"])


def _map_post(doc: dict) -> PostResponse:
    return PostResponse(
        id=str(doc["_id"]),
        title=doc["title"],
        content=doc["content"],
        user_id=doc["user_id"],
        tags=doc.get("tags") or [],
        image_url=doc.get("image_url"),
        created_at=doc["created_at"],
        updated_at=doc.get("updated_at"),
    )


def _parse_oid(post_id: str) -> ObjectId:
    """Convert a string post id to ObjectId, raising 404 on invalid format."""
    try:
        return ObjectId(post_id)
    except (InvalidId, Exception):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")


@router.get("", response_model=list[PostResponse])
def get_posts(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=1000),
    user_id: Optional[str] = Query(None),
    tag: Optional[str] = Query(None),
):
    query: dict = {}
    if user_id:
        query["user_id"] = user_id
    if tag:
        query["tags"] = {"$in": [tag]}

    cursor = (
        posts_col
        .find(query)
        .sort("created_at", -1)
        .skip(skip)
        .limit(limit)
    )
    return [_map_post(doc) for doc in cursor]


@router.get("/count")
def get_post_count():
    return {"count": posts_col.count_documents({})}


@router.get("/{post_id}", response_model=PostResponse)
def get_post(post_id: str):
    doc = posts_col.find_one({"_id": _parse_oid(post_id)})
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    return _map_post(doc)


@router.post("", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
def create_post(
    body: PostCreate,
    user_id: str = Depends(get_current_user_id),
):
    if body.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="user_id mismatch")

    now = datetime.now(timezone.utc).isoformat()
    doc = {
        "title": body.title,
        "content": body.content,
        "user_id": body.user_id,
        "tags": body.tags,
        "image_url": body.image_url,
        "created_at": now,
        "updated_at": None,
    }
    result = posts_col.insert_one(doc)
    doc["_id"] = result.inserted_id
    return _map_post(doc)


@router.put("/{post_id}", response_model=PostResponse)
def update_post(
    post_id: str,
    body: PostUpdate,
    user_id: str = Depends(get_current_user_id),
):
    oid = _parse_oid(post_id)
    existing = posts_col.find_one({"_id": oid}, {"user_id": 1})
    if not existing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    if existing["user_id"] != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your post")

    update_fields = body.model_dump(exclude_none=True)
    update_fields["updated_at"] = datetime.now(timezone.utc).isoformat()

    posts_col.update_one({"_id": oid}, {"$set": update_fields})
    updated = posts_col.find_one({"_id": oid})
    return _map_post(updated)


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(
    post_id: str,
    user_id: str = Depends(get_current_user_id),
):
    oid = _parse_oid(post_id)
    existing = posts_col.find_one({"_id": oid}, {"user_id": 1})
    if not existing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    if existing["user_id"] != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your post")

    posts_col.delete_one({"_id": oid})
