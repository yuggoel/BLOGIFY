from datetime import datetime, timedelta, timezone
from typing import Any

import jwt
from fastapi import HTTPException, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from .config import settings

security = HTTPBearer()

_ALGORITHM = "HS256"


def create_access_token(user_id: str, email: str) -> str:
    """Create a signed JWT for the given user."""
    now = datetime.now(timezone.utc)
    payload: dict[str, Any] = {
        "sub": user_id,
        "email": email,
        "iat": now,
        "exp": now + timedelta(minutes=settings.jwt_expire_minutes),
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm=_ALGORITHM)


def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Security(security),
) -> str:
    """
    Validates our own JWT from the Authorization header.
    Returns the user's ID (sub claim) so routes can use it for ownership checks.
    """
    token = credentials.credentials
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[_ALGORITHM])
        user_id: str = payload.get("sub", "")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: missing subject",
            )
        return user_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired"
        )
    except jwt.InvalidTokenError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Invalid token: {e}"
        )
