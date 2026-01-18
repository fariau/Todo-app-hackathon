import sys
import os

# Add the backend root directory to Python path so relative imports work
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Change working directory to backend root so imports work properly
original_cwd = os.getcwd()
os.chdir(os.path.dirname(os.path.abspath(__file__)))

# Import the app and run it
import src.main
app = src.main.app

import uvicorn

if __name__ == "__main__":
    # Use fixed port 8000
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)

    # Restore original working directory
    os.chdir(original_cwd)