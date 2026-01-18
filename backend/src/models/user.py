import sys
import os
# Add the src directory to the Python path to resolve relative imports
current_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List, TYPE_CHECKING
import uuid
from datetime import datetime
from enum import Enum

if TYPE_CHECKING:
    from .task import Task  # Only import for type checking to avoid circular imports

class UserRole(str, Enum):
    USER = "user"
    ADMIN = "admin"

class UserBase(SQLModel):
    email: str = Field(unique=True, nullable=False, max_length=255)  # Removed regex as it's not supported in SQLModel Field
    first_name: Optional[str] = Field(default=None, max_length=100)
    last_name: Optional[str] = Field(default=None, max_length=100)
    role: UserRole = Field(default=UserRole.USER)

class User(UserBase, table=True):
    __tablename__ = "users"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    password_hash: str = Field(nullable=False, max_length=255)
    email_verified: bool = Field(default=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(), nullable=False)
    updated_at: datetime = Field(default_factory=lambda: datetime.now(), nullable=False)

    # Relationship to tasks
    tasks: List["Task"] = Relationship(back_populates="user")

class UserRead(SQLModel):
    id: uuid.UUID
    email: str
    first_name: Optional[str]
    last_name: Optional[str]
    role: UserRole
    email_verified: bool
    created_at: datetime
    updated_at: datetime

class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=72)  # bcrypt limit

class UserUpdate(SQLModel):
    first_name: Optional[str] = Field(default=None, max_length=100)
    last_name: Optional[str] = Field(default=None, max_length=100)
    email: Optional[str] = Field(default=None, max_length=255)