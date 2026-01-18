from sqlmodel import SQLModel
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# For SQLite support
import urllib.parse

load_dotenv()

# Get database URL from environment variables
NEON_DB_URL = os.getenv("NEON_DATABASE_URL", os.getenv("DATABASE_URL", ""))
if NEON_DB_URL:
    DATABASE_URL = NEON_DB_URL
else:
    # Fallback to SQLite for development/testing when no Neon URL is provided
    DATABASE_URL = "sqlite+aiosqlite:///./test.db"

# Ensure the URL uses the asyncpg driver if it's a standard postgresql URL
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

engine = create_async_engine(DATABASE_URL)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def init_db():
    """Initialize the database and create tables"""
    try:
        # For SQLite, we need to create tables differently
        if DATABASE_URL.startswith("sqlite"):
            # For SQLite, create a sync engine to initialize tables
            from sqlalchemy import create_engine as sync_create_engine
            sync_db_url = DATABASE_URL.replace("+aiosqlite", "")
            sync_engine = sync_create_engine(sync_db_url)
            SQLModel.metadata.create_all(bind=sync_engine)
        else:
            async with engine.begin() as conn:
                await conn.run_sync(SQLModel.metadata.create_all)
    except Exception as e:
        print(f"Error initializing database: {e}")
        import traceback
        traceback.print_exc()
        raise