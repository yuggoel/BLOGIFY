from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status

from ..auth import get_current_user_id
from ..database import supabase
from ..models import UserResponse, UserUpdate

router = APIRouter(prefix="/users", tags=["users"])


def _map_user(row: dict) -> UserResponse:
    return UserResponse(
        id=row["id"],
        name=row["name"],
        email=row["email"],
        profile_picture_url=row.get("profile_picture"),
        created_at=row["created_at"],
    )


@router.get("/count")
def get_user_count():
    result = supabase.table("users").select("*", count="exact", head=True).execute()
    return {"count": result.count or 0}


@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: str):
    result = (
        supabase.table("users").select("*").eq("id", user_id).maybe_single().execute()
    )
    if not result.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return _map_user(result.data)


@router.put("/{user_id}", response_model=UserResponse)
def update_user(
    user_id: str,
    body: UserUpdate,
    current_user_id: str = Depends(get_current_user_id),
):
    if user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your own profile",
        )

    update_data: dict = {"updated_at": datetime.now(timezone.utc).isoformat()}
    if body.name is not None:
        update_data["name"] = body.name
    if body.email is not None:
        update_data["email"] = body.email
    if body.profile_picture_url is not None:
        update_data["profile_picture"] = body.profile_picture_url

    result = (
        supabase.table("users")
        .update(update_data)
        .eq("id", user_id)
        .select()
        .single()
        .execute()
    )
    return _map_user(result.data)


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: str,
    current_user_id: str = Depends(get_current_user_id),
):
    if user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own account",
        )
    supabase.table("users").delete().eq("id", user_id).execute()
