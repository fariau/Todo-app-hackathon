from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from uuid import UUID
from models.task import Task, TaskCreate, TaskUpdate, TaskRead
from models.user import UserRead
from services.task_service import TaskService
from database.session import get_session
from middleware.jwt_middleware import get_current_user
# Import rate limiter conditionally
try:
    from fastapi_limiter.depends import RateLimiter
except ImportError:
    # Define a mock RateLimiter class when the dependency is not available
    class RateLimiter:
        def __init__(self, times=1, milliseconds=0, seconds=0, minutes=1, hours=0):
            pass

router = APIRouter()
task_service = TaskService()

@router.get("/", response_model=List[TaskRead])
async def get_user_tasks(
    current_user: UserRead = Depends(get_current_user),
    status: Optional[str] = None,
    priority: Optional[str] = None,
    limit: Optional[int] = None,
    offset: Optional[int] = None,
    session: AsyncSession = Depends(get_session)
):
    """
    Get all tasks for the authenticated user with optional filters
    """
    try:
        tasks = await task_service.get_user_tasks(
            session=session,
            user_id=current_user.id,
            status=status,
            priority=priority,
            limit=limit,
            offset=offset
        )
        return tasks
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while retrieving tasks"
        )


@router.get("/{task_id}", response_model=TaskRead)
async def get_task(
    task_id: UUID,
    current_user: UserRead = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    """
    Get a specific task by ID for the authenticated user
    """
    try:
        task = await task_service.get_task_by_id(
            session=session,
            task_id=task_id,
            user_id=current_user.id
        )

        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found or unauthorized"
            )

        return task
    except ValueError:  # Invalid UUID
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid task ID format"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while retrieving the task"
        )


@router.post("/", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_data: TaskCreate,
    current_user: UserRead = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    """
    Create a new task for the authenticated user
    """
    try:
        task = await task_service.create_task(
            session=session,
            task_data=task_data,
            user_id=current_user.id
        )
        return task
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while creating the task"
        )


@router.put("/{task_id}", response_model=TaskRead)
async def update_task(
    task_id: UUID,
    task_data: TaskUpdate,
    current_user: UserRead = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    """
    Update a specific task for the authenticated user
    """
    try:
        updated_task = await task_service.update_task(
            session=session,
            task_id=task_id,
            task_data=task_data,
            user_id=current_user.id
        )

        if not updated_task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found or unauthorized"
            )

        return updated_task
    except ValueError:  # Invalid UUID
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid task ID format"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while updating the task"
        )


@router.patch("/{task_id}", response_model=TaskRead)
async def partial_update_task(
    task_id: UUID,
    task_data: TaskUpdate,
    current_user: UserRead = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    """
    Partially update a specific task for the authenticated user
    """
    try:
        updated_task = await task_service.partial_update_task(
            session=session,
            task_id=task_id,
            task_data=task_data,
            user_id=current_user.id
        )

        if not updated_task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found or unauthorized"
            )

        return updated_task
    except ValueError:  # Invalid UUID
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid task ID format"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while updating the task"
        )


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: UUID,
    current_user: UserRead = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    """
    Delete a specific task for the authenticated user
    """
    try:
        success = await task_service.delete_task(
            session=session,
            task_id=task_id,
            user_id=current_user.id
        )

        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found or unauthorized"
            )

        return  # 204 No Content
    except ValueError:  # Invalid UUID
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid task ID format"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while deleting the task"
        )