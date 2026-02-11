from fastapi import APIRouter, Depends
from ..auth import get_current_user

router = APIRouter()

@router.get("/protected")
def protected_route(user_id: str = Depends(get_current_user)):
    return {"msg": f"Hello, {user_id}. You are authenticated."}
