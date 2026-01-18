"""Debug script to test JWT token creation"""
import sys
import os

# Add the current directory to the Python path to allow relative imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from src.middleware.jwt_middleware import create_access_token
    from datetime import timedelta

    print("Testing JWT token creation...")

    # Test creating a token like the API would
    token_data = {
        "sub": "123e4567-e89b-12d3-a456-426614174000",  # Sample UUID string
        "email": "test@example.com"
    }

    token = create_access_token(
        data=token_data,
        expires_delta=timedelta(minutes=60)
    )

    print("Token created successfully!")
    print(f"Token length: {len(token)}")
    print(f"Token preview: {token[:50]}...")

except Exception as e:
    print(f"Error creating JWT token: {e}")
    import traceback
    traceback.print_exc()