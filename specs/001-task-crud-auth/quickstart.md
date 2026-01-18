# Quickstart Guide: Task CRUD and Authentication

## Prerequisites

- Node.js 18+ for frontend
- Python 3.11+ for backend
- PostgreSQL-compatible database (Neon recommended)
- Better Auth account setup (if using hosted version)

## Setup Instructions

### 1. Clone and Navigate
```bash
git clone <repository-url>
cd <project-directory>
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend/

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment variables
cp .env.example .env

# Edit .env with your configuration
# - Set DATABASE_URL for your Neon PostgreSQL instance
# - Set JWT_SECRET to a strong random value
# - Set other required variables
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend/

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Edit .env.local with your configuration
# - Set NEXT_PUBLIC_API_URL to your backend URL
```

### 4. Database Initialization
```bash
# From backend directory
cd backend/

# Run database migrations
python -m src.database.migrate
```

### 5. Run Applications

#### Backend
```bash
cd backend/
uvicorn src.main:app --reload
```

#### Frontend
```bash
cd frontend/
npm run dev
```

## Key Endpoints

### Backend API
- Authentication: `POST /api/auth/login`, `POST /api/auth/register`
- Tasks: `GET/POST /api/tasks`, `GET/PUT/PATCH/DELETE /api/tasks/{id}`

### Frontend Pages
- Login: `http://localhost:3000/login`
- Register: `http://localhost:3000/register`
- Dashboard: `http://localhost:3000/dashboard`

## Configuration

### Environment Variables

#### Backend (.env)
```
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/todo_db
JWT_SECRET=your-super-secret-jwt-key-here-keep-it-safe
JWT_ALGORITHM=HS256
JWT_EXPIRATION=3600
ALLOWED_ORIGINS=http://localhost:3000
```

#### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:8000
```

## Development Commands

### Backend
```bash
# Run tests
python -m pytest

# Run with hot reload
uvicorn src.main:app --reload

# Format code
black src/
```

### Frontend
```bash
# Run development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build
```

## Common Issues

### Database Connection
- Ensure your Neon PostgreSQL instance is running
- Verify DATABASE_URL format: `postgresql+asyncpg://user:password@host:port/dbname`

### Authentication Problems
- Confirm JWT_SECRET matches between frontend and backend
- Ensure CORS settings allow frontend domain

### API Connection
- Verify backend is running before starting frontend
- Check that NEXT_PUBLIC_API_URL points to running backend

## Next Steps

1. Customize the UI components in `frontend/components/`
2. Extend the data models in `backend/src/models/`
3. Add additional API endpoints in `backend/src/api/`
4. Configure production deployment settings