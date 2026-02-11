from fastapi import APIRouter, HTTPException, status, Request, Depends
from BACKEND.APP.models import UserCreate, UserResponse

router = APIRouter(tags=["Auth"])


def get_repo(request: Request):
    db = request.app.state.get_db()
    if request.app.state.db_mode == "supabase":
        from repositories.users_supabase import UserRepository
    else:
        from repositories.users import UserRepository
    return UserRepository(db)


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(payload: UserCreate, repo = Depends(get_repo)):
    user = await repo.create_user(payload.name, payload.email, payload.password)
    if not user:
        raise HTTPException(status_code=400, detail="Email already exists")
    return user
