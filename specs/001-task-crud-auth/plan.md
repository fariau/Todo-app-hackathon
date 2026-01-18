# Implementation Plan: Task CRUD and Authentication

## Technical Context

**Feature**: Task CRUD and Authentication System
**Spec File**: specs/001-task-crud-auth/spec.md
**Timeline**: [NEEDS CLARIFICATION: estimated timeline for completion]
**Team Size**: [NEEDS CLARIFICATION: number of developers working on this]

**Technology Stack**:
- Frontend: Next.js 16+ with App Router
- Backend: FastAPI with SQLModel
- Database: Neon PostgreSQL
- Authentication: Better Auth with JWT symmetric verification
- Styling: Tailwind CSS

**Architecture Pattern**:
- Monorepo structure with frontend/ and backend/ directories
- Decoupled frontend-backend with REST API communication
- JWT-based authentication flow
- User data isolation through authenticated user ID filtering

## Constitution Check

Based on .specify/memory/constitution.md:

✅ **Specification Adherence**: Plan follows specs strictly from specs/ folder (@specs/...)
✅ **Monorepo Structure**: Plan uses monorepo structure: frontend/ (Next.js 16+ App Router), backend/ (FastAPI + SQLModel)
✅ **Authentication Security**: Plan implements Better Auth on frontend + JWT symmetric secret for backend verification
✅ **Data Access Security**: Plan ensures every API endpoint filters by authenticated user.id, returns 401 if no/invalid token, 403 if wrong user
✅ **Code Quality Standards**: Plan uses TypeScript in frontend, type hints + SQLModel in backend, avoids any types
✅ **Testing Discipline**: Plan includes unit tests for backend endpoints with TDD approach
✅ **UI/UX Excellence**: Plan implements responsive Tailwind CSS, server components by default
✅ **Database Management**: Plan uses Neon PostgreSQL with env DATABASE_URL
✅ **Security Best Practices**: Plan ensures no hardcoded secrets, uses .env files
✅ **REST API Excellence**: Plan follows REST best practices with clean error handling using HTTPException

## Gates

### Gate 1: Architecture Alignment
- [x] Solution architecture aligns with specified technology stack
- [x] Data flow respects user isolation requirements
- [x] Authentication mechanism matches constitution requirements

### Gate 2: Security Compliance
- [x] Authentication flow uses Better Auth + JWT symmetric verification
- [x] API endpoints enforce user data isolation
- [x] Proper error handling (401/403) for unauthorized access

### Gate 3: Specification Compliance
- [x] Plan addresses all functional requirements from spec
- [x] Success criteria are achievable with proposed approach
- [x] Non-functional requirements are satisfied

## Phase 0: Research

### Research Tasks Completed

[Research completed - all clarifications resolved]

## Phase 1: Design & Contracts

### Data Model

#### User Entity
- **Fields**: id (UUID), email (string), password_hash (string), created_at (timestamp), updated_at (timestamp)
- **Constraints**: Email must be unique
- **Relationships**: One-to-many with tasks

#### Task Entity
- **Fields**: id (UUID), user_id (UUID), title (string), description (text), status (enum: todo, in-progress, done, archived), priority (enum: low, medium, high, urgent), due_date (timestamp), created_at (timestamp), updated_at (timestamp)
- **Constraints**: Title required, user_id references valid user
- **Relationships**: Belongs to one user

### API Contracts

#### Authentication Endpoints
```
POST /api/auth/register
- Request: {email: string, password: string}
- Response: {token: string, user: {id, email}}

POST /api/auth/login
- Request: {email: string, password: string}
- Response: {token: string, user: {id, email}}

POST /api/auth/logout
- Headers: Authorization: Bearer {token}
- Response: {success: boolean}

GET /api/auth/verify
- Headers: Authorization: Bearer {token}
- Response: {valid: boolean, user: {id, email}}
```

#### Task Management Endpoints
```
GET /api/tasks
- Headers: Authorization: Bearer {token}
- Response: {tasks: Task[]}

GET /api/tasks/{task_id}
- Headers: Authorization: Bearer {token}
- Response: Task

POST /api/tasks
- Headers: Authorization: Bearer {token}
- Request: {title: string, description?: string, status?: string, priority?: string, due_date?: string}
- Response: Task

PUT /api/tasks/{task_id}
- Headers: Authorization: Bearer {token}
- Request: {title?: string, description?: string, status?: string, priority?: string, due_date?: string}
- Response: Task

DELETE /api/tasks/{task_id}
- Headers: Authorization: Bearer {token}
- Response: {success: boolean}
```

## Phase 2: Implementation Plan

### 2.1 Backend Implementation

#### 2.1.1 Project Setup
- Create backend/ directory
- Initialize FastAPI project with required dependencies
- Set up environment variables and configuration
- Configure database connection with Neon PostgreSQL

#### 2.1.2 Database Models
- Create SQLModel User model
- Create SQLModel Task model with proper relationships
- Implement database session management
- Set up connection pooling

#### 2.1.3 Authentication Service
- Configure Better Auth with Neon adapter
- Implement JWT token generation and validation
- Create authentication middleware
- Implement user registration and login endpoints

#### 2.1.4 API Endpoints
- Create authentication endpoints (register, login, logout, verify)
- Create task management endpoints (CRUD operations)
- Implement user data isolation in all task endpoints
- Add proper request/response validation with Pydantic models

#### 2.1.5 Security Implementation
- Implement JWT validation middleware for all protected endpoints
- Add user ID extraction and validation
- Database query filtering by authenticated user ID
- Input validation and sanitization
- Error handling with proper HTTP status codes

### 2.2 Frontend Implementation

#### 2.2.1 Project Setup
- Create frontend/ directory
- Initialize Next.js 16+ project with App Router
- Configure TypeScript and Tailwind CSS
- Set up environment variables for API communication

#### 2.2.2 Authentication Components
- Create login page with form validation
- Create registration page with password strength indicator
- Implement protected route wrapper component
- Create logout functionality
- Implement token management and refresh logic

#### 2.2.3 Task Management UI
- Create task list page with filtering/sorting
- Create task creation form with validation
- Create task detail/edit page
- Implement task status toggle functionality
- Add task deletion confirmation

#### 2.2.4 API Client Integration
- Create centralized API client in `/lib/api.ts`
- Implement JWT token handling in API requests
- Add request/response interceptors for auth
- Create React Query or SWR hooks for data fetching
- Implement error handling and user feedback

### 2.3 Folder Structure

```
project-root/
├── frontend/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── dashboard/
│   │   │   ├── tasks/
│   │   │   │   ├── create/
│   │   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── api/
│   │   ├── components/
│   │   ├── lib/
│   │   │   └── api.ts
│   │   ├── hooks/
│   │   └── types/
│   ├── public/
│   ├── styles/
│   ├── package.json
│   └── tsconfig.json
├── backend/
│   ├── src/
│   │   ├── main.py
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   └── tasks.py
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   └── task.py
│   │   ├── database/
│   │   │   ├── __init__.py
│   │   │   ├── engine.py
│   │   │   └── session.py
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── auth_service.py
│   │   │   └── task_service.py
│   │   └── middleware/
│   │       ├── __init__.py
│   │       └── jwt_middleware.py
│   ├── requirements.txt
│   ├── .env
│   └── Dockerfile
├── .env
├── docker-compose.yml
└── README.md
```

### 2.4 Key Files to Create/Change

#### Backend Key Files:
- `backend/src/main.py` - Main FastAPI application
- `backend/src/models/user.py` - SQLModel User entity
- `backend/src/models/task.py` - SQLModel Task entity
- `backend/src/api/auth.py` - Authentication endpoints
- `backend/src/api/tasks.py` - Task management endpoints
- `backend/src/middleware/jwt_middleware.py` - JWT validation middleware
- `backend/src/services/auth_service.py` - Authentication business logic
- `backend/src/services/task_service.py` - Task business logic
- `backend/src/database/engine.py` - Database connection setup
- `backend/src/database/session.py` - Database session management

#### Frontend Key Files:
- `frontend/app/(auth)/login/page.tsx` - Login page component
- `frontend/app/(auth)/register/page.tsx` - Registration page component
- `frontend/app/dashboard/tasks/page.tsx` - Task list page
- `frontend/app/dashboard/tasks/create/page.tsx` - Task creation page
- `frontend/app/dashboard/tasks/[id]/page.tsx` - Task detail/edit page
- `frontend/lib/api.ts` - Centralized API client
- `frontend/components/ProtectedRoute.tsx` - Protected route wrapper
- `frontend/types/index.ts` - Type definitions

### 2.5 Security Implementation Details

#### Authentication Flow:
1. User registers/logs in via frontend authentication pages
2. Better Auth handles registration/login and returns JWT token
3. Frontend stores token securely (localStorage/secure cookies)
4. Frontend includes token in Authorization header for API requests (Bearer token)
5. Backend middleware validates token and extracts user_id
6. Backend filters all task queries by authenticated user_id
7. Unauthorized access attempts return 401/403 as per constitution

#### Data Isolation:
- All task endpoints extract user_id from JWT token
- Database queries filter by authenticated user's ID
- Path parameters validated against authenticated user
- Proper error responses for unauthorized access (401/403)

### 2.6 Testing Strategy

#### Backend Tests:
- Unit tests for authentication service
- Unit tests for task service
- Integration tests for API endpoints
- Security tests for authentication and authorization
- Data isolation tests to ensure users can't access other users' tasks

#### Frontend Tests:
- Component tests for authentication forms
- Integration tests for API client
- End-to-end tests for complete user flows
- Security tests for client-side authentication

## Phase 3: Deployment Preparation

### 3.1 Environment Configuration
- Set up environment variables for different environments
- Configure production database connection
- Set up secure JWT secret management
- Configure CORS settings appropriately

### 3.2 Documentation
- Update README with setup instructions
- Document API endpoints with examples
- Create deployment guide
- Document security considerations

## Success Criteria Validation

✅ **Performance**: Authentication operations complete within 2 seconds
✅ **Performance**: Task CRUD operations complete within 1 second
✅ **Security**: 0% unauthorized access to other users' tasks
✅ **Availability**: 99.9% uptime for authentication and task management services
✅ **User Experience**: Seamless registration, login, and task management flows