---
id: 1
title: "Create hackathon-todo Constitution"
stage: "constitution"
date_iso: "2026-01-13"
surface: "agent"
model: "claude-sonnet-4-5-20250929"
feature: "none"
branch: "main"
user: "user"
command: "/sp.constitution"
labels: ["constitution", "hackathon-todo", "governance"]
link_spec: null
link_ticket: null
link_adr: null
link_pr: null
files_yaml: |
  - .specify/memory/constitution.md
  - history/prompts/constitution/1-create-hackathon-todo-constitution.constitution.prompt.md
tests_yaml: |
  - "Constitution file created with core principles"
  - "Governance section defined"
prompt_text: |
  /sp.constitution

  Project name: hackathon-todo (Phase II Full-Stack Web App)

  Core Principles:
  - Always follow specs strictly from specs/ folder (@specs/...)
  - Use monorepo structure: frontend/ (Next.js 16+ App Router), backend/ (FastAPI + SQLModel)
  - Authentication: Better Auth on frontend + JWT symmetric secret for backend verification
  - Security: Every API endpoint MUST filter by authenticated user.id, 401 if no/invalid token, 403 if wrong user
  - Code Quality: Use TypeScript in frontend, type hints + SQLModel in backend, no any types
  - Testing: Write unit tests for backend endpoints, prefer TDD where possible
  - UI: Responsive Tailwind CSS, server components by default
  - Database: Neon PostgreSQL, always use env DATABASE_URL
  - Never hardcode secrets, always use .env
  - Follow REST best practices, clean error handling with HTTPException

  These rules are NON-NEGOTIABLE for all features in Phase II.
response_text: |
  I have created and updated the project constitution file .specify/memory/constitution.md with the specified principles for the hackathon-todo project. The constitution now includes:

  1. Core Principles section with all 10 specified principles:
     - Specification Adherence
     - Monorepo Structure
     - Authentication Security
     - Data Access Security
     - Code Quality Standards
     - Testing Discipline
     - UI/UX Excellence
     - Database Management
     - Security Best Practices
     - REST API Excellence

  2. Additional Constraints section covering technology stack requirements and security standards

  3. Development Workflow section with quality gates and deployment policies

  4. Governance section outlining compliance and amendment procedures

  The constitution follows the required format and incorporates all the non-negotiable rules for Phase II development.
outcome: "Successfully created the hackathon-todo constitution with all specified principles and governance structure."
evaluation: "The constitution accurately reflects all the provided principles and establishes proper governance for the project."
---

# Create hackathon-todo Constitution

This PHR documents the creation of the project constitution for hackathon-todo (Phase II Full-Stack Web App).

## Original Prompt

/sp.constitution

Project name: hackathon-todo (Phase II Full-Stack Web App)

Core Principles:
- Always follow specs strictly from specs/ folder (@specs/...)
- Use monorepo structure: frontend/ (Next.js 16+ App Router), backend/ (FastAPI + SQLModel)
- Authentication: Better Auth on frontend + JWT symmetric secret for backend verification
- Security: Every API endpoint MUST filter by authenticated user.id, 401 if no/invalid token, 403 if wrong user
- Code Quality: Use TypeScript in frontend, type hints + SQLModel in backend, no any types
- Testing: Write unit tests for backend endpoints, prefer TDD where possible
- UI: Responsive Tailwind CSS, server components by default
- Database: Neon PostgreSQL, always use env DATABASE_URL
- Never hardcode secrets, always use .env
- Follow REST best practices, clean error handling with HTTPException

These rules are NON-NEGOTIABLE for all features in Phase II.

## Response Summary

I have created and updated the project constitution file .specify/memory/constitution.md with the specified principles for the hackathon-todo project. The constitution now includes:

1. Core Principles section with all 10 specified principles:
   - Specification Adherence
   - Monorepo Structure
   - Authentication Security
   - Data Access Security
   - Code Quality Standards
   - Testing Discipline
   - UI/UX Excellence
   - Database Management
   - Security Best Practices
   - REST API Excellence

2. Additional Constraints section covering technology stack requirements and security standards

3. Development Workflow section with quality gates and deployment policies

4. Governance section outlining compliance and amendment procedures

The constitution follows the required format and incorporates all the non-negotiable rules for Phase II development.