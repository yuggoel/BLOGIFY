from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from ..auth import hash_password, verify_password, create_access_token
from datetime import timedelta

router = APIRouter()

# Dummy user store (replace with DB lookup)
users_db = {
    "testuser": {
        "username": "testuser",
        "hashed_password": hash_password("testpass")
    }
}

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = users_db.get(form_data.username)
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(
        data={"sub": user["username"]},
        expires_delta=timedelta(minutes=30)
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/register")
def register(form_data: OAuth2PasswordRequestForm = Depends()):
    if form_data.username in users_db:
        raise HTTPException(status_code=400, detail="Username already registered")
    users_db[form_data.username] = {
        "username": form_data.username,
        "hashed_password": hash_password(form_data.password)
    }
    return {"msg": "User registered successfully"}
