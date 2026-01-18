# Todo Backend API

This is the backend API for the Todo Full-Stack Web Application.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Create a `.env` file based on `.env.example`

3. Run the application:
```bash
uvicorn src.main:app --reload
```

## Project Structure

- `src/main.py` - Main FastAPI application
- `src/api/` - API routes and endpoints
- `src/models/` - Database models
- `src/database/` - Database configuration and session management
- `src/services/` - Business logic services
- `src/middleware/` - Middleware components