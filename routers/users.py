from fastapi import APIRouter, HTTPException, Depends, status, Request
from BACKEND.APP.models import UserCreate, UserLogin, UserResponse, UserUpdate

router = APIRouter(prefix="/users", tags=["Users"])


def get_repo(request: Request):
    """Get the appropriate repository based on DB_MODE"""
    db = request.app.state.get_db()
    
    if request.app.state.db_mode == "supabase":
        from repositories.users_supabase import UserRepository
    else:
        from repositories.users import UserRepository
    
    return UserRepository(db)


@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def signup(payload: UserCreate, repo = Depends(get_repo)):
    user = await repo.create_user(payload.name, payload.email, payload.password)
    if not user:
        raise HTTPException(status_code=400, detail="Email already exists")
    return user


@router.post("/login")
async def login(payload: UserLogin, repo = Depends(get_repo)):
    user_doc = await repo.get_user_by_email(payload.email)
    if not user_doc or not await repo.verify_password(payload.password, user_doc.get("password_hash") or user_doc.get("password")):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {"id": str(user_doc.get("_id") or user_doc.get("id")), "name": user_doc["name"], "email": user_doc["email"]}


@router.get("/count", response_model=int)
async def count_users(repo = Depends(get_repo)):
    return await repo.count_users()


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: str, repo = Depends(get_repo)):
    user = await repo.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.put("/{user_id}", response_model=UserResponse)
async def update_user(user_id: str, payload: UserUpdate, repo = Depends(get_repo)):
    user = await repo.update_user(user_id, payload.dict(exclude_unset=True))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.delete("/{user_id}")
async def delete_user(user_id: str, repo = Depends(get_repo)):
    """Delete a user account"""
    success = await repo.delete_user(user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}