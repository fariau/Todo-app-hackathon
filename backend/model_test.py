"""Debug script to test model creation"""
import sys
import os

# Add the current directory to the Python path to allow relative imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from src.models.user import UserCreate

    # Test creating a UserCreate object like the API would
    user_data = {
        "email": "test@example.com",
        "password": "password123",
        "first_name": "Test",
        "last_name": "User"
    }

    print("Creating UserCreate object with:", user_data)
    user_create = UserCreate(**user_data)
    print("UserCreate object created successfully:", user_create)
    print("Email:", user_create.email)
    print("Password:", user_create.password)

except Exception as e:
    print(f"Error creating UserCreate object: {e}")
    import traceback
    traceback.print_exc()