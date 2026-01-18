from fastapi import Depends
from typing import Optional


# Placeholder RateLimiter class to use when fastapi-limiter is not available
class RateLimiter:
    def __init__(self, times=1, milliseconds=0, seconds=0, minutes=1, hours=0):
        pass


def conditional_rate_limiter(app, times: int = 5, seconds: int = 60):
    """
    Conditionally apply rate limiting based on whether Redis is available.
    This function should be called with the app instance to check its state.
    """
    if hasattr(app, 'state') and hasattr(app.state, 'rate_limiter_available') and app.state.rate_limiter_available:
        # Only import RateLimiter when we know it should be available
        try:
            from fastapi_limiter.depends import RateLimiter
            return RateLimiter(times=times, seconds=seconds)
        except ImportError:
            # Even though we expect it to be available, import failed
            pass

    # Return a no-op dependency when rate limiter is not available
    async def no_op():
        pass
    return Depends(no_op)