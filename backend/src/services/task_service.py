import sys
import os
# Add the src directory to the Python path to resolve relative imports
current_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from sqlmodel import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from uuid import UUID
from models.task import Task, TaskCreate, TaskUpdate, TaskRead
from sqlmodel import Session
from models.user import User

class TaskService:
    def __init__(self):
        pass

    async def create_task(self, session: AsyncSession, task_data: TaskCreate, user_id: UUID) -> TaskRead:
        """
        Create a new task for a specific user
        """
        # Create task instance with user_id
        task = Task(
            title=task_data.title,
            description=task_data.description,
            status=task_data.status,
            priority=task_data.priority,
            due_date=task_data.due_date,
            user_id=user_id
        )

        # Add to session and commit
        session.add(task)
        await session.commit()
        await session.refresh(task)

        # Convert to TaskRead to ensure proper serialization
        return TaskRead(
            title=task.title,
            description=task.description,
            status=task.status,
            priority=task.priority,
            due_date=task.due_date,
            id=task.id,
            user_id=task.user_id,
            created_at=task.created_at,
            updated_at=task.updated_at
        )

    async def get_user_tasks(self, session: AsyncSession, user_id: UUID,
                            status: Optional[str] = None,
                            priority: Optional[str] = None,
                            limit: Optional[int] = None,
                            offset: Optional[int] = None) -> List[TaskRead]:
        """
        Get all tasks for a specific user with optional filters
        """
        query = select(Task).where(Task.user_id == user_id)

        if status:
            query = query.where(Task.status == status)
        if priority:
            query = query.where(Task.priority == priority)

        if offset:
            query = query.offset(offset)
        if limit:
            query = query.limit(limit)

        result = await session.execute(query)
        task_instances = result.scalars().all()  # Use scalars() to get model instances

        # Convert Task objects to TaskRead to ensure proper serialization
        task_reads = []
        for task in task_instances:
            task_read = TaskRead(
                title=task.title,
                description=task.description,
                status=task.status,
                priority=task.priority,
                due_date=task.due_date,
                id=task.id,
                user_id=task.user_id,
                created_at=task.created_at,
                updated_at=task.updated_at
            )
            task_reads.append(task_read)

        return task_reads

    async def get_task_by_id(self, session: AsyncSession, task_id: UUID, user_id: UUID) -> Optional[TaskRead]:
        """
        Get a specific task by ID for a specific user (enforces data isolation)
        """
        result = await session.execute(
            select(Task).where(Task.id == task_id).where(Task.user_id == user_id)
        )
        task = result.scalar_one_or_none()  # Use scalar_one_or_none for single results

        if task:
            # Convert to TaskRead to ensure proper serialization
            return TaskRead(
                title=task.title,
                description=task.description,
                status=task.status,
                priority=task.priority,
                due_date=task.due_date,
                id=task.id,
                user_id=task.user_id,
                created_at=task.created_at,
                updated_at=task.updated_at
            )
        return None

    async def update_task(self, session: AsyncSession, task_id: UUID, task_data: TaskUpdate, user_id: UUID) -> Optional[TaskRead]:
        """
        Update a specific task for a specific user (enforces data isolation)
        """
        # Get the existing task
        result = await session.execute(
            select(Task).where(Task.id == task_id).where(Task.user_id == user_id)
        )
        task = result.scalar_one_or_none()

        if not task:
            return None

        # Update the task with provided data
        for field, value in task_data.dict(exclude_unset=True).items():
            setattr(task, field, value)

        await session.commit()
        await session.refresh(task)

        # Convert to TaskRead to ensure proper serialization
        return TaskRead(
            title=task.title,
            description=task.description,
            status=task.status,
            priority=task.priority,
            due_date=task.due_date,
            id=task.id,
            user_id=task.user_id,
            created_at=task.created_at,
            updated_at=task.updated_at
        )

    async def partial_update_task(self, session: AsyncSession, task_id: UUID, task_data: TaskUpdate, user_id: UUID) -> Optional[TaskRead]:
        """
        Partially update a specific task for a specific user (enforces data isolation)
        """
        # Get the existing task
        result = await session.execute(
            select(Task).where(Task.id == task_id).where(Task.user_id == user_id)
        )
        task = result.scalar_one_or_none()

        if not task:
            return None

        # Update only the fields that were provided
        for field, value in task_data.dict(exclude_unset=True).items():
            setattr(task, field, value)

        await session.commit()
        await session.refresh(task)

        # Convert to TaskRead to ensure proper serialization
        return TaskRead(
            title=task.title,
            description=task.description,
            status=task.status,
            priority=task.priority,
            due_date=task.due_date,
            id=task.id,
            user_id=task.user_id,
            created_at=task.created_at,
            updated_at=task.updated_at
        )

    async def delete_task(self, session: AsyncSession, task_id: UUID, user_id: UUID) -> bool:
        """
        Delete a specific task for a specific user (enforces data isolation)
        """
        result = await session.execute(
            select(Task).where(Task.id == task_id).where(Task.user_id == user_id)
        )
        task = result.scalar_one_or_none()

        if not task:
            return False

        await session.delete(task)
        await session.commit()

        return True

__all__ = ["TaskService"]