# Hackathon Todo Application

A full-stack todo application with authentication and task management capabilities built using modern web technologies.

## Tech Stack

- **Frontend**: Next.js 16+, TypeScript 5.5+, Tailwind CSS 3.4+
- **Backend**: FastAPI 0.115+, SQLModel 0.0.22+, Pydantic 2.10+
- **Authentication**: JWT-based with custom middleware, bcrypt password hashing
- **Database**: PostgreSQL via Neon
- **Rate Limiting**: Redis with fastapi-limiter
- **Styling**: Tailwind CSS with responsive design

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── main.py              # FastAPI application entry point
│   │   ├── api/                 # API routes
│   │   │   ├── auth.py          # Authentication endpoints
│   │   │   └── tasks.py         # Task management endpoints
│   │   ├── models/              # Database models
│   │   │   ├── user.py          # User model
│   │   │   └── task.py          # Task model
│   │   ├── database/            # Database configuration
│   │   │   ├── engine.py        # Database engine
│   │   │   └── session.py       # Session management
│   │   ├── services/            # Business logic
│   │   │   ├── auth_service.py  # Authentication service
│   │   │   └── task_service.py  # Task service
│   │   └── middleware/          # Middleware
│   │       └── jwt_middleware.py # JWT authentication
│   └── requirements.txt         # Backend dependencies
├── frontend/
│   ├── app/                     # Next.js App Router pages
│   │   ├── (auth)/              # Authentication pages
│   │   │   ├── login/           # Login page
│   │   │   └── register/        # Registration page
│   │   ├── dashboard/           # Dashboard pages
│   │   │   └── tasks/           # Task management pages
│   │   │       ├── create/      # Task creation page
│   │   │       └── [id]/        # Task detail page
│   │   └── globals.css          # Global styles
│   ├── components/              # React components
│   ├── lib/                     # Utilities and API client
│   │   ├── api.ts               # API client
│   │   └── auth.ts              # Authentication context
│   ├── types/                   # TypeScript type definitions
│   ├── package.json             # Frontend dependencies
│   └── tsconfig.json            # TypeScript configuration
├── .env                         # Environment variables
├── .gitignore                   # Git ignore file
└── README.md                    # This file
```

## Setup Instructions

### Prerequisites

- Node.js 18+ with npm/yarn
- Python 3.9+ with pip
- PostgreSQL (or Neon account) for database
- Redis (for rate limiting)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables in `.env`:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/hackathon_todo
   JWT_SECRET_KEY=your-super-secret-jwt-key-change-in-production
   JWT_ALGORITHM=HS256
   JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
   NEON_DATABASE_URL=your-neon-db-url
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
   REDIS_URL=redis://localhost:6379
   ```

5. Start the backend server:
   ```bash
   cd src
   uvicorn main:app --reload
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`.

## Running Guide

### Development Mode

1. **Start the backend server** (in the `backend` directory):
   ```bash
   cd backend/src
   uvicorn main:app --reload
   ```
   The backend will run on `http://localhost:8000`

2. **Start the frontend server** (in the `frontend` directory):
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:3000`

3. **Access the application** at `http://localhost:3000`

### Production Mode

1. **Build the frontend**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Start the backend server**:
   ```bash
   cd backend/src
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | User registration (rate limited to 5/min) | No |
| POST | `/api/auth/login` | User login (rate limited to 5/min) | No |
| POST | `/api/auth/logout` | User logout | Yes |
| GET | `/api/auth/verify` | Token verification | Yes |
| GET | `/api/tasks` | Get user's tasks (with optional filters: status, priority, limit, offset) | Yes |
| GET | `/api/tasks/{task_id}` | Get specific task | Yes |
| POST | `/api/tasks` | Create new task | Yes |
| PUT | `/api/tasks/{task_id}` | Update task | Yes |
| PATCH | `/api/tasks/{task_id}` | Partially update task | Yes |
| DELETE | `/api/tasks/{task_id}` | Delete task | Yes |

## Features

### Authentication
- User registration with email validation
- Secure login with JWT token generation
- Password hashing using bcrypt
- Token verification and logout
- Rate limiting on authentication endpoints (5 requests per minute)
- Auto-logout on 401 responses

### Task Management
- Create, read, update, and delete tasks
- Task filtering by status and priority
- Task sorting by creation date, priority, or due date
- Search functionality across task titles and descriptions
- Status tracking (todo, in-progress, done, archived)
- Priority levels (low, medium, high, urgent)
- Due date assignment with overdue highlighting
- Quick task completion toggle

### UI/UX Features
- Responsive design with Tailwind CSS
- Dashboard layout with sidebar navigation
- Beautiful task cards with status badges and priority indicators
- Loading skeletons for smooth user experience
- Toast notifications for success/error messages
- Confirmation dialogs for destructive actions
- Mobile-friendly layout with hamburger menu
- Clean, modern interface with consistent styling

### Security Features
- JWT-based authentication with 1-hour expiry
- User data isolation (users can only access their own tasks)
- Input validation and sanitization
- Secure password hashing with bcrypt
- Rate limiting to prevent abuse
- CORS configuration
- Proper error handling with appropriate HTTP status codes
- CSRF protection

## Screenshots

### Login Page
![Login Page](screenshots/login.png "Login Page")

### Dashboard
![Dashboard](screenshots/dashboard.png "Dashboard")

### Task List
![Task List](screenshots/task-list.png "Task List")

### Create Task
![Create Task](screenshots/create-task.png "Create Task")

### Task Detail
![Task Detail](screenshots/task-detail.png "Task Detail")

### Edit Task
![Edit Task](screenshots/edit-task.png "Edit Task")

## Demo Flow

1. **Register**: Visit `/auth/register` to create a new account
2. **Login**: Visit `/auth/login` to authenticate with your credentials
3. **Dashboard**: View your dashboard at `/dashboard`
4. **Create Task**: Click "Create Task" to add a new task
5. **View Tasks**: Navigate to `/dashboard/tasks` to see your tasks
6. **Edit Task**: Click on a task to view details and edit
7. **Toggle Status**: Use the checkbox to quickly mark tasks as done
8. **Delete Task**: Use the delete button in the task detail view
9. **Logout**: Click "Logout" in the top navigation to end your session

## Deployment Notes

### Frontend Deployment (Vercel)
1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend Deployment (Railway/Render/Fly.io)
1. Create a new application
2. Add environment variables in the platform dashboard
3. Connect to PostgreSQL/Neon database
4. Deploy using the platform's deployment process

## Security Considerations

- Store JWT secrets securely (not in version control)
- Use HTTPS in production
- Validate and sanitize all user inputs
- Implement proper error handling to avoid information leakage
- Use environment variables for configuration
- Regularly update dependencies
- Apply rate limiting to prevent abuse
- Never expose sensitive data in client-side code

## Built Using

Built using Spec-Kit Plus agentic workflow (constitution → specify → plan → tasks → iterative implementation)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request