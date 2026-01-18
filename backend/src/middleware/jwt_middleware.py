from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
from typing import Optional
import sys
import os
# Add the src directory to the Python path to resolve relative imports
current_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from models.user import UserRead
import uuid

load_dotenv()

# Get JWT configuration from environment
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-super-secret-jwt-key-change-in-production")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

security = HTTPBearer()

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """
    Create a new JWT access token
    """
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> dict:
    """
    Verify and decode a JWT token
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        email: str = payload.get("email")

        if user_id is None or email is None:
            raise HTTPException(status_code=401, detail="Could not validate credentials")

        return {
            "user_id": uuid.UUID(user_id),
            "email": email
        }
    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Get the current user from the JWT token
    """
    token = credentials.credentials

    try:
        user_data = verify_token(token)

        # Create a minimal user representation
        user = UserRead(
            id=user_data["user_id"],
            email=user_data["email"],
            first_name=None,
            last_name=None,
            role="user",
            email_verified=False,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )

        return user
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

def verify_user_owns_resource(user_id: uuid.UUID, resource_user_id: uuid.UUID) -> bool:
    """
    Verify that the authenticated user owns a specific resource
    """
    return user_id == resource_user_id

__all__ = [
    "create_access_token",
    "verify_token",
    "get_current_user",
    "verify_user_owns_resource",
    "security",
    "ACCESS_TOKEN_EXPIRE_MINUTES",
    "ALGORITHM",
    "SECRET_KEY"
]