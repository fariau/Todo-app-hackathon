import sys
import os
# Add the src directory to the Python path to resolve relative imports
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from redis import asyncio as aioredis
import logging

# Try to import rate limiting components, but make them optional
try:
    from fastapi_limiter import FastAPILimiter
    from fastapi_limiter.depends import RateLimiter
    RATE_LIMITING_AVAILABLE = True
except ImportError:
    # Define mock classes when rate limiting is not available
    class RateLimiter:
        def __init__(self, times=1, milliseconds=0, seconds=0, minutes=1, hours=0):
            pass

    RATE_LIMITING_AVAILABLE = False
    FastAPILimiter = None
import asyncio
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Hackathon Todo API", version="1.0.0")

# Import routers after creating the app instance to avoid circular imports
import sys
import os
# Ensure the src directory is in the Python path for relative imports
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

from api.auth import router as auth_router
from api.tasks import router as tasks_router
from database.engine import init_db

# CORS configuration - adjust origins as needed for production
origins = [
    "http://localhost:3000",  # Next.js default port
    "http://localhost:3001",  # Alternative Next.js port
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    os.getenv("FRONTEND_URL", ""),  # From environment if set
]

# Filter out empty origin values
origins = [origin for origin in origins if origin]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    """Initialize database and rate limiter on startup"""
    # Initialize database
    await init_db()

    # Initialize rate limiter with Redis (optional - skip if Redis not available)
    if RATE_LIMITING_AVAILABLE:
        try:
            redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")
            redis = aioredis.from_url(redis_url, encoding="utf8", decode_responses=True)
            await FastAPILimiter.init(redis)
            print("Rate limiting initialized successfully")
            app.state.rate_limiter_available = True
        except Exception as e:
            print(f"Warning: Could not connect to Redis for rate limiting: {e}")
            print("Rate limiting will be disabled")
            app.state.rate_limiter_available = False
    else:
        print("Rate limiting is not available (dependencies not installed)")
        app.state.rate_limiter_available = False

@app.on_event("shutdown")
async def shutdown_event():
    """Clean up resources on shutdown"""
    if RATE_LIMITING_AVAILABLE and FastAPILimiter:
        await FastAPILimiter.close()

# Include API routers
app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(tasks_router, prefix="/api/tasks", tags=["tasks"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Hackathon Todo API"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "api"}

if __name__ == "__main__":
    import uvicorn
    # Use fixed port 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)  # Fixed port 8000