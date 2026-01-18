from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from datetime import timedelta
from typing import Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from models.user import User, UserCreate, UserRead
from services.auth_service import AuthService
from database.session import get_session
from middleware.jwt_middleware import create_access_token, verify_token, get_current_user

router = APIRouter()
security = HTTPBearer()

# Initialize auth service
auth_service = AuthService()


@router.post("/register",
             response_model=Dict[str, Any])
async def register_user(user_data: UserCreate, session: AsyncSession = Depends(get_session)):
    """
    Register a new user
    """
    try:
        # Create user with hashed password
        user = await auth_service.create_user(session, user_data)

        # Create access token
        access_token_expires = timedelta(minutes=60)  # 1 hour expiry
        access_token = create_access_token(
            data={"sub": str(user.id), "email": user.email},
            expires_delta=access_token_expires
        )

        # Return token and user data
        return {
            "token": access_token,
            "user": {
                "id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "role": user.role,
                "email_verified": user.email_verified,
                "created_at": user.created_at,
                "updated_at": user.updated_at
            }
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        # For debugging: show actual error
        print(f"Registration error: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during registration: {str(e)}"
        )


@router.post("/login",
             response_model=Dict[str, Any])
async def login_user(credentials: Dict[str, str], session: AsyncSession = Depends(get_session)):
    """
    Login a user and return JWT token
    """
    email = credentials.get("email")
    password = credentials.get("password")

    if not email or not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email and password are required"
        )

    try:
        # Authenticate user
        user = await auth_service.authenticate_user(session, email, password)

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Create access token
        access_token_expires = timedelta(minutes=60)  # 1 hour expiry
        access_token = create_access_token(
            data={"sub": str(user.id), "email": user.email},
            expires_delta=access_token_expires
        )

        # Return token and user data
        return {
            "token": access_token,
            "user": {
                "id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "role": user.role,
                "email_verified": user.email_verified,
                "created_at": user.created_at,
                "updated_at": user.updated_at
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        # For debugging: show actual error
        print(f"Login error: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during login: {str(e)}"
        )


@router.post("/logout")
async def logout_user():
    """
    Logout a user (client-side token invalidation)
    """
    # For JWT tokens, true server-side invalidation would require a token blacklist
    # For now, we just indicate successful logout to the client
    return {"success": True}


@router.get("/verify")
async def verify_user(current_user: UserRead = Depends(get_current_user)):
    """
    Verify the current user's token and return user information
    """
    return {
        "valid": True,
        "user": {
            "id": current_user.id,
            "email": current_user.email,
            "first_name": current_user.first_name,
            "last_name": current_user.last_name,
            "role": current_user.role,
            "email_verified": current_user.email_verified,
            "created_at": current_user.created_at,
            "updated_at": current_user.updated_at
        }
    }