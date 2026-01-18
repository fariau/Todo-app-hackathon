"""Debug script to test password hashing"""
import sys
import os

# Add the current directory to the Python path to allow relative imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from src.services.auth_service import AuthService

    print("Testing password hashing...")

    auth_service = AuthService()

    # Test with the password that's causing issues
    password = "password123"
    print(f"Testing password: '{password}' (length: {len(password)})")

    try:
        hashed = auth_service.get_password_hash(password)
        print("Password hashing successful!")
        print(f"Hashed password length: {len(hashed)}")
    except Exception as e:
        print(f"Error hashing password: {e}")
        import traceback
        traceback.print_exc()

except Exception as e:
    print(f"Error importing auth service: {e}")
    import traceback
    traceback.print_exc()