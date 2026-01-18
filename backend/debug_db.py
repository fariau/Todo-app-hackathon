"""Debug script to test database connection"""
import sys
import os

# Add the current directory to the Python path to allow relative imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Set environment variable to use SQLite for this test
os.environ['DATABASE_URL'] = 'sqlite+aiosqlite:///./test_debug.db'

try:
    from src.database.engine import init_db, engine
    print("Import successful")

    import asyncio

    async def test_db():
        print("Testing database initialization...")
        try:
            await init_db()
            print("Database initialization successful!")

            # Test creating a simple connection
            async with engine.begin() as conn:
                print("Connection established successfully")

        except Exception as e:
            print(f"Database test failed: {e}")
            import traceback
            traceback.print_exc()

    asyncio.run(test_db())

except Exception as e:
    print(f"Import failed: {e}")
    import traceback
    traceback.print_exc()