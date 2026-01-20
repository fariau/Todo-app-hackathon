# Moving Todo App Backend to Vercel

## Overview
This guide explains how to move your FastAPI backend from Hugging Face Spaces to Vercel while keeping it integrated with your Next.js frontend.

## Current Architecture
- **Frontend**: Next.js deployed on Vercel
- **Backend**: FastAPI deployed on Hugging Face Spaces
- **Communication**: Frontend connects to external backend API

## Recommended Approach for Vercel Deployment

Due to limitations in Vercel's Python runtime support for complex applications like FastAPI with database connections, here are the recommended approaches:

### Option 1: Deploy FastAPI Backend Separately (Recommended)
Deploy your FastAPI backend to a Python-friendly platform like:
- Railway (https://railway.app)
- Render (https://render.com)
- AWS Elastic Beanstalk
- Google Cloud Run
- DigitalOcean App Platform

Then update the frontend to connect to the new backend URL.

### Option 2: Convert to Monorepo and Use Vercel Python Runtime (Advanced)
The changes made in this migration:

#### Backend Changes Made:
1. **CORS Configuration** (`backend/src/main.py`):
   - Added Vercel frontend domains to allowed origins
   - Added pattern `"https://*.vercel.app"`

2. **Database Configuration** (`backend/src/database/engine.py`):
   - Added serverless-friendly connection pooling parameters
   - Changed database path to `todo_app.db`

3. **Dependencies** (`backend/requirements.txt`):
   - Added `mangum==0.17.0` for ASGI compatibility

4. **Vercel Entry Point** (`backend/fastapi_app.py`):
   - Created Mangum adapter for Vercel compatibility

#### Frontend Changes Made:
1. **API Configuration** (`frontend/lib/api.ts`):
   - Updated to use environment variable for flexibility
   - Added logic to conditionally add `/api` prefix when using relative URLs
   - Frontend will call `/api/*` endpoints on the same domain when BASE_URL is relative

2. **Environment Configuration** (`frontend/.env.local`):
   - Updated to use Hugging Face backend temporarily
   - For Vercel production, set NEXT_PUBLIC_API_BASE_URL to empty string for relative URLs

#### Vercel Configuration:
1. **Routing** (`vercel.json`):
   - Configured rewrites to route `/api/*` to FastAPI backend

## Deployment Steps

### If Using Option 1 (Separate Backend):
1. Deploy your FastAPI backend to Railway/Render
2. Update `NEXT_PUBLIC_API_BASE_URL` in frontend `.env.local` to point to your new backend URL
3. Redeploy the frontend on Vercel

### If Using Option 2 (Same Vercel Project):
1. Push the updated code to your GitHub repository
2. Connect your repo to Vercel
3. Set environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_API_BASE_URL`: Leave empty for relative URLs when backend is on same domain
   - `DATABASE_URL`: Your database connection string (PostgreSQL recommended for production)
   - `JWT_SECRET_KEY`: Your JWT secret
   - Any other environment variables needed
4. Vercel will automatically detect and deploy both frontend and backend

### Switching Between Environments:
- **Local development with local backend**: Set `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000`
- **Local development with external backend**: Set `NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.com`
- **Production with same-domain backend**: Set `NEXT_PUBLIC_API_BASE_URL=""` (empty string)

## Important Considerations

### Database Limitations
- SQLite databases are not suitable for serverless functions due to ephemeral filesystems
- Recommended: Migrate to PostgreSQL (Vercel Postgres, Supabase, or Neon)

### Environment Variables
Ensure the following environment variables are set in Vercel:
- `DATABASE_URL` (PostgreSQL connection string)
- `JWT_SECRET_KEY`
- `JWT_ACCESS_TOKEN_EXPIRE_MINUTES`
- Any other variables referenced in your backend

### Production Recommendations
1. Use a managed PostgreSQL database instead of SQLite
2. Implement proper error handling for database connection failures
3. Add request/response logging for debugging
4. Set up monitoring and alerting

## API Endpoints
The following API endpoints will be available when deployed on Vercel:
- `GET /api/auth/verify` - Verify JWT token
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/tasks` - Get user tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/{id}` - Get specific task
- `PUT /api/tasks/{id}` - Update specific task
- `PATCH /api/tasks/{id}` - Partially update task
- `DELETE /api/tasks/{id}` - Delete specific task

## Troubleshooting

### Common Issues:
1. **Database Connection Errors**: Ensure you're using PostgreSQL instead of SQLite in production
2. **CORS Errors**: Verify that your frontend domain is included in the CORS configuration
3. **Environment Variables**: Check that all required environment variables are set in Vercel
4. **Timeout Errors**: FastAPI applications may have cold start issues; consider using a platform with better Python support if needed

## Alternative: Serverless Databases
Consider using serverless database solutions:
- Turso (LibSQL) - Drop-in SQLite replacement
- PlanetScale - Serverless MySQL
- Vercel Postgres - Integrated PostgreSQL
- Supabase - Open-source Firebase alternative

For the best experience with FastAPI and database persistence, Option 1 (deploying to a Python-optimized platform) is strongly recommended.