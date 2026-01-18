# Data Model: Task CRUD and Authentication

## User Entity

### Fields
- **id**: UUID (Primary Key, auto-generated)
- **email**: String (255 chars, unique, required)
- **password_hash**: String (255 chars, required)
- **email_verified**: Boolean (default: false)
- **created_at**: DateTime (auto-generated, required)
- **updated_at**: DateTime (auto-generated, required)

### Constraints
- Email must be unique across all users
- Email format must be valid
- Password must be securely hashed before storage

### Relationships
- One-to-many with Task entity (via user_id foreign key)

## Task Entity

### Fields
- **id**: UUID (Primary Key, auto-generated)
- **user_id**: UUID (Foreign Key to User.id, required, indexed)
- **title**: String (255 chars, required)
- **description**: Text (optional)
- **status**: String (enum: 'todo', 'in-progress', 'done', 'archived', default: 'todo')
- **priority**: String (enum: 'low', 'medium', 'high', 'urgent', default: 'medium')
- **due_date**: DateTime (optional)
- **created_at**: DateTime (auto-generated, required)
- **updated_at**: DateTime (auto-generated, required)

### Constraints
- Title must not be empty
- Status must be one of the allowed values
- Priority must be one of the allowed values
- user_id must reference a valid User.id
- Tasks can only be accessed by their owner (user_id)

### Relationships
- Many-to-one with User entity (via user_id foreign key)

## Validation Rules

### User Validation
- Email: Must be valid email format
- Password: Minimum 8 characters with complexity requirements
- Email uniqueness: Checked during registration

### Task Validation
- Title: Required, maximum 255 characters
- Status: Must be one of 'todo', 'in-progress', 'done', 'archived'
- Priority: Must be one of 'low', 'medium', 'high', 'urgent'
- Due Date: If provided, must be valid date/time format
- User Ownership: Task can only be modified by the owning user

## Indexes

### User Table
- Primary Key: id (UUID)
- Unique Index: email

### Task Table
- Primary Key: id (UUID)
- Foreign Key Index: user_id
- Secondary Indexes: status, priority, due_date, created_at

## State Transitions

### Task Status Transitions
- 'todo' → 'in-progress' → 'done'
- 'todo' → 'archived'
- 'in-progress' → 'todo' (if not completed)
- 'in-progress' → 'done'
- 'in-progress' → 'archived'
- 'done' → 'in-progress' (if reopening)
- 'archived' → 'todo' (if unarchiving)

## Database Schema (SQLModel)

```python
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
import uuid
from datetime import datetime

class UserBase(SQLModel):
    email: str = Field(unique=True, nullable=False, max_length=255)

class User(UserBase, table=True):
    __tablename__ = "users"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    password_hash: str = Field(nullable=False, max_length=255)
    email_verified: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship to tasks
    tasks: List["Task"] = Relationship(back_populates="user")

class TaskBase(SQLModel):
    title: str = Field(max_length=255, nullable=False)
    description: Optional[str] = Field(default=None)
    status: str = Field(default="todo", max_length=20)
    priority: str = Field(default="medium", max_length=20)
    due_date: Optional[datetime] = Field(default=None)

class Task(TaskBase, table=True):
    __tablename__ = "tasks"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.id", nullable=False, index=True)

    # Validation constraints
    __table_args__ = (
        "CHECK (status IN ('todo', 'in-progress', 'done', 'archived'))",
        "CHECK (priority IN ('low', 'medium', 'high', 'urgent'))",
    )

    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    # Relationship to user
    user: User = Relationship(back_populates="tasks")
```

## Security Considerations

### Data Isolation
- All queries must filter by user_id to ensure data isolation
- Cross-user access prevention at both API and database levels
- Proper authorization checks before any data access

### Field Security
- Password hashes stored securely, never plain text
- No sensitive user data in task descriptions without encryption
- Proper access controls on all fields