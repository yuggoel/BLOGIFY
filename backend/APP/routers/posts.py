from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status

from ..auth import get_current_user_id
from ..database import supabase
from ..models import PostCreate, PostResponse, PostUpdate

router = APIRouter(prefix="/posts", tags=["posts"])


def _map_post(row: dict) -> PostResponse:
    return PostResponse(
        id=row["id"],
        title=row["title"],
        content=row["content"],
        user_id=row["user_id"],
        tags=row.get("tags") or [],
        image_url=row.get("image_url"),
        created_at=row["created_at"],
        updated_at=row.get("updated_at"),
    )


@router.get("", response_model=list[PostResponse])
def get_posts(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    user_id: Optional[str] = Query(None),
):
    query = (
        supabase.table("posts")
        .select("*")
        .order("created_at", desc=True)
        .range(skip, skip + limit - 1)
    )
    if user_id:
        query = query.eq("user_id", user_id)

    result = query.execute()
    return [_map_post(row) for row in result.data]


@router.get("/count")
def get_post_count():
    result = supabase.table("posts").select("*", count="exact", head=True).execute()
    return {"count": result.count or 0}


@router.get("/{post_id}", response_model=PostResponse)
def get_post(post_id: str):
    result = supabase.table("posts").select("*").eq("id", post_id).maybe_single().execute()
    if not result.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    return _map_post(result.data)


@router.post("", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
def create_post(
    body: PostCreate,
    user_id: str = Depends(get_current_user_id),
):
    # Ensure the token owner matches the requested user_id
    if body.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="user_id mismatch")

    result = (
        supabase.table("posts")
        .insert(
            {
                "title": body.title,
                "content": body.content,
                "user_id": body.user_id,
                "tags": body.tags,
                "image_url": body.image_url,
            }
        )
        .select()
        .single()
        .execute()
    )
    return _map_post(result.data)


@router.put("/{post_id}", response_model=PostResponse)
def update_post(
    post_id: str,
    body: PostUpdate,
    user_id: str = Depends(get_current_user_id),
):
    # Ownership check
    existing = supabase.table("posts").select("user_id").eq("id", post_id).maybe_single().execute()
    if not existing.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    if existing.data["user_id"] != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your post")

    update_data = body.model_dump(exclude_none=True)
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()

    result = (
        supabase.table("posts")
        .update(update_data)
        .eq("id", post_id)
        .select()
        .single()
        .execute()
    )
    return _map_post(result.data)


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(
    post_id: str,
    user_id: str = Depends(get_current_user_id),
):
    existing = supabase.table("posts").select("user_id").eq("id", post_id).maybe_single().execute()
    if not existing.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    if existing.data["user_id"] != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your post")

    supabase.table("posts").delete().eq("id", post_id).execute()
