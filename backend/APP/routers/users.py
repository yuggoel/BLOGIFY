from datetime import datetime, timezone

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Depends, HTTPException, status

from ..auth import get_current_user_id
from ..database import users_col
from ..models import UserResponse, UserUpdate

router = APIRouter(prefix="/users", tags=["users"])


def _parse_uid(user_id: str) -> ObjectId:
    try:
        return ObjectId(user_id)
    except (InvalidId, Exception):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")


def _map_user(doc: dict) -> UserResponse:
    return UserResponse(
        id=str(doc["_id"]),
        name=doc["name"],
        email=doc["email"],
        profile_picture_url=doc.get("profile_picture"),
        created_at=doc["created_at"],
    )


@router.get("/count")
def get_user_count():
    return {"count": users_col.count_documents({})}


@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: str):
    doc = users_col.find_one({"_id": _parse_uid(user_id)})
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return _map_user(doc)


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

    update_fields: dict = {"updated_at": datetime.now(timezone.utc).isoformat()}
    if body.name is not None:
        update_fields["name"] = body.name
    if body.email is not None:
        update_fields["email"] = body.email
    if body.profile_picture_url is not None:
        update_fields["profile_picture"] = body.profile_picture_url

    result = users_col.update_one({"_id": _parse_uid(user_id)}, {"$set": update_fields})
    if result.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    updated = users_col.find_one({"_id": _parse_uid(user_id)})
    return _map_user(updated)


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
    users_col.delete_one({"_id": _parse_uid(user_id)})
