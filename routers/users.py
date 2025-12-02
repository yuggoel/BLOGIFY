from fastapi import APIRouter, HTTPException, Depends, status
from BACKEND.APP.models import UserCreate, UserLogin, UserResponse
from repositories.users import UserRepository
from BACKEND.APP.db import get_database
from motor.motor_asyncio import AsyncIOMotorDatabase

router = APIRouter(prefix="/users", tags=["Users"])


async def get_repo(db: AsyncIOMotorDatabase = Depends(get_database)) -> UserRepository:
    return UserRepository(db)


@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def signup(payload: UserCreate, repo: UserRepository = Depends(get_repo)):
    user = await repo.create_user(payload.name, payload.email, payload.password)
    if not user:
        raise HTTPException(status_code=400, detail="Email already exists")
    return user


@router.post("/login")
async def login(payload: UserLogin, repo: UserRepository = Depends(get_repo)):
    user_doc = await repo.get_user_by_email(payload.email)
    if not user_doc or not await repo.verify_password(payload.password, user_doc["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {"id": str(user_doc["_id"]), "name": user_doc["name"], "email": user_doc["email"]}


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: str, repo: UserRepository = Depends(get_repo)):
    user = await repo.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.delete("/{user_id}")
async def delete_user(user_id: str, repo: UserRepository = Depends(get_repo)):
    """Delete a user account"""
    success = await repo.delete_user(user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}