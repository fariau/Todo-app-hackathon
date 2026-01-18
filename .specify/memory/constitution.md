<!-- SYNC IMPACT REPORT:
Version change: 1.0.0 → 1.0.0
Modified principles: None (new constitution)
Added sections: All sections
Removed sections: None
Templates requiring updates:
- .specify/templates/plan-template.md ✅ updated
- .specify/templates/spec-template.md ✅ updated
- .specify/templates/tasks-template.md ✅ updated
- .specify/templates/commands/*.md ⚠ pending
Follow-up TODOs: None
-->

# hackathon-todo Constitution

## Core Principles

### Specification Adherence
Always follow specs strictly from specs/ folder (@specs/...). All development must align with the documented specifications and requirements without deviation.

### Monorepo Structure
Use monorepo structure: frontend/ (Next.js 16+ App Router), backend/ (FastAPI + SQLModel). Maintain clear separation of concerns while keeping all code in a single repository.

### Authentication Security
Authentication: Better Auth on frontend + JWT symmetric secret for backend verification. Implement secure token-based authentication with proper validation and verification mechanisms.

### Data Access Security
Security: Every API endpoint MUST filter by authenticated user.id, 401 if no/invalid token, 403 if wrong user. Enforce strict data isolation and access controls to prevent unauthorized access.

### Code Quality Standards
Code Quality: Use TypeScript in frontend, type hints + SQLModel in backend, no any types. Maintain high code quality standards with proper typing and clean architecture patterns.

### Testing Discipline
Testing: Write unit tests for backend endpoints, prefer TDD where possible. Implement comprehensive testing strategies with emphasis on test-driven development practices.

### UI/UX Excellence
UI: Responsive Tailwind CSS, server components by default. Create responsive, accessible user interfaces using modern styling and component patterns.

### Database Management
Database: Neon PostgreSQL, always use env DATABASE_URL. Use proper database configuration and environment variable management for database connections.

### Security Best Practices
Never hardcode secrets, always use .env. Maintain security by storing sensitive information in environment variables and never committing them to the repository.

### REST API Excellence
Follow REST best practices, clean error handling with HTTPException. Implement clean, well-documented REST APIs with proper error handling and status codes.

## Additional Constraints

Technology Stack Requirements:
- Frontend: Next.js 16+ with App Router, TypeScript, Tailwind CSS
- Backend: FastAPI with SQLModel ORM
- Database: Neon PostgreSQL
- Authentication: Better Auth with JWT tokens
- All components must follow the specified technology stack

Security Standards:
- All API endpoints must be protected with authentication
- User data must be properly isolated
- Input validation and sanitization required at all levels
- Proper error handling without information disclosure

## Development Workflow

Quality Gates:
- All code must follow the established architecture patterns
- Specifications must be strictly adhered to
- Tests must pass before merging
- Code reviews required for all changes
- Security considerations must be addressed

Deployment Policy:
- Environment-specific configurations
- Proper CI/CD pipeline adherence
- Database migration procedures
- Security scanning integration

## Governance

All development activities must comply with this constitution. Deviations from these principles require explicit documentation and approval. The constitution supersedes all other practices and serves as the authoritative guide for development decisions.

Amendments to this constitution must be documented with proper justification and approval process. All team members are responsible for ensuring compliance with these principles.

**Version**: 1.0.0 | **Ratified**: 2026-01-13 | **Last Amended**: 2026-01-13
