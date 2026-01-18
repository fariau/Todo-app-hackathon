# Authentication Specification

## 1. Overview

This specification defines the authentication system for the Todo Full-Stack Web Application. The system implements secure user authentication using Better Auth on the frontend with JWT-based authentication for the backend. The architecture ensures that all API endpoints require authentication and that users can only access their own data.

The authentication system consists of:
- Frontend authentication using Better Auth in Next.js
- JWT token-based authentication for FastAPI backend
- Shared secret for token verification
- Fine-grained access control per user's tasks

## 2. User Stories

- **As a user**, I want to register for an account so that I can securely store and access my personal tasks
- **As a user**, I want to log in to my account so that I can access my task data
- **As a user**, I want to log out of my account so that others cannot access my data on shared devices
- **As a user**, I want my authentication to persist across browser sessions until I explicitly log out
- **As a user**, I want to ensure that I can only view and modify my own tasks, not other users' tasks
- **As a system administrator**, I want all API endpoints protected by authentication to prevent unauthorized access
- **As a security-conscious user**, I want my authentication tokens to have limited lifetime for security

## 3. Authentication Flow (Frontend → Backend)

1. **Registration/Login Flow**:
   - User initiates registration/login through Better Auth UI components
   - Better Auth handles the registration/login process
   - Upon successful authentication, Better Auth generates a JWT token
   - JWT token is stored in browser (localStorage/cookies depending on Better Auth configuration)

2. **API Request Flow**:
   - Frontend makes API request to FastAPI backend
   - Request includes JWT in Authorization header as `Bearer {token}`
   - Backend receives request and extracts JWT from Authorization header
   - Backend verifies JWT using shared secret `BETTER_AUTH_SECRET`
   - Backend validates token signature and expiration
   - Backend retrieves user identity from token claims
   - Backend authorizes access based on user identity and requested resource
   - Backend processes request and returns response

3. **Logout Flow**:
   - User initiates logout through frontend UI
   - Frontend calls Better Auth logout function
   - Frontend clears stored JWT token
   - Session is invalidated on the frontend

## 4. JWT Token Structure & Lifetime

### JWT Claims Structure:
- `sub` (Subject): User's unique identifier (UUID)
- `email`: User's email address
- `name`: User's display name (optional)
- `iat` (Issued At): Timestamp when token was issued
- `exp` (Expiration): Timestamp when token expires
- `jti` (JWT ID): Unique identifier for the token (optional, for revocation)

### Token Lifetime:
- Access Token: 1 hour (3600 seconds)
- Refresh Token: 7 days (604800 seconds) - if implemented separately

### Security Configuration:
- Algorithm: HS256 (HMAC with SHA-256)
- Secret: Shared `BETTER_AUTH_SECRET` environment variable
- Audience: Optional, for additional validation
- Issuer: Optional, for additional validation

## 5. Backend Authorization Rules

### General Rules:
- All API endpoints require valid JWT in Authorization header
- Invalid or expired tokens result in 401 Unauthorized response
- Missing Authorization header results in 401 Unauthorized response
- Malformed tokens result in 401 Unauthorized response

### Resource Access Rules:
- Users can only access their own tasks
- Users can only create tasks associated with their account
- Users can only update tasks they own
- Users can only delete tasks they own
- Users cannot access tasks belonging to other users
- Admin users (if any) follow special rules defined separately

### Authorization Implementation:
- FastAPI dependency to verify JWT and extract user ID
- Database queries filtered by authenticated user's ID
- Middleware to handle token verification
- Custom exceptions for authorization failures

## 6. Acceptance Criteria

### Registration & Login:
- [ ] Users can register with email and password
- [ ] Users can log in with registered credentials
- [ ] Successful login results in valid JWT token
- [ ] Failed login attempts do not generate tokens

### Token Handling:
- [ ] JWT tokens are properly included in Authorization header for all API requests
- [ ] Tokens contain correct user information (ID, email)
- [ ] Tokens expire after configured lifetime
- [ ] Expired tokens are rejected by backend

### API Protection:
- [ ] All API endpoints return 401 for unauthenticated requests
- [ ] Valid tokens allow access to protected endpoints
- [ ] Invalid tokens result in 401 responses

### Data Isolation:
- [ ] Users can only see their own tasks in API responses
- [ ] Users cannot modify tasks owned by other users
- [ ] Users cannot delete tasks owned by other users
- [ ] Attempting to access other users' data results in 403 Forbidden or 404 Not Found

### Logout:
- [ ] Users can log out and invalidate their session
- [ ] After logout, API requests return 401 until re-authentication
- [ ] JWT tokens are cleared from client storage after logout

### Error Handling:
- [ ] Proper error messages returned for authentication failures
- [ ] Appropriate HTTP status codes for different failure scenarios
- [ ] Security-related errors do not expose sensitive information