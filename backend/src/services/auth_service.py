import sys
import os
# Add the src directory to the Python path to resolve relative imports
current_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession
from passlib.context import CryptContext
from models.user import User, UserCreate
from typing import Optional
import uuid

# Password hashing context using argon2 as primary scheme to avoid bcrypt compatibility issues
pwd_context = CryptContext(schemes=["argon2", "bcrypt"], deprecated="auto")

class AuthService:
    def __init__(self):
        pass

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """
        Verify a plain password against a hashed password
        """
        return pwd_context.verify(plain_password, hashed_password)

    def get_password_hash(self, password: str) -> str:
        """
        Generate a hash for a plain password
        """
        # Bcrypt has a maximum password length of 72 bytes, truncate if necessary
        if len(password.encode('utf-8')) > 72:
            password = password[:72]
        return pwd_context.hash(password)

    async def create_user(self, session: AsyncSession, user_data: UserCreate) -> User:
        """
        Create a new user with hashed password
        """
        # Check if user already exists
        existing_user_result = await session.execute(
            select(User).where(User.email == user_data.email)
        )
        existing_user = existing_user_result.first()

        if existing_user:
            raise ValueError("User with this email already exists")

        # Hash the password
        hashed_password = self.get_password_hash(user_data.password)

        # Create user instance
        user = User(
            email=user_data.email,
            password_hash=hashed_password,
            first_name=user_data.first_name,
            last_name=user_data.last_name
        )

        # Add to session and commit
        session.add(user)
        await session.commit()
        await session.refresh(user)

        return user

    async def authenticate_user(self, session: AsyncSession, email: str, password: str) -> Optional[User]:
        """
        Authenticate a user by email and password
        """
        # Find user by email
        result = await session.execute(select(User).where(User.email == email))
        user = result.first()

        if not user:
            return None

        # Verify password
        if not self.verify_password(password, user.password_hash):
            return None

        return user

    async def get_user_by_id(self, session: AsyncSession, user_id: uuid.UUID) -> Optional[User]:
        """
        Get a user by ID
        """
        result = await session.execute(select(User).where(User.id == user_id))
        return result.first()

__all__ = ["AuthService"]