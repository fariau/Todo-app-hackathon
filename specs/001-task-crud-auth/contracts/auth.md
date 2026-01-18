# Authentication API Contract

## Register User
```
POST /api/auth/register
```

### Request
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

### Response (200)
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com"
  }
}
```

### Response (400)
```json
{
  "error": "Invalid input or user already exists",
  "code": "AUTH_USER_EXISTS"
}
```

## Login User
```
POST /api/auth/login
```

### Request
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

### Response (200)
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com"
  }
}
```

### Response (401)
```json
{
  "error": "Invalid credentials",
  "code": "AUTH_INVALID_CREDENTIALS"
}
```

## Logout User
```
POST /api/auth/logout
```

### Headers
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Response (200)
```json
{
  "success": true
}
```

## Verify Token
```
GET /api/auth/verify
```

### Headers
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Response (200)
```json
{
  "valid": true,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com"
  }
}
```

### Response (401)
```json
{
  "valid": false,
  "error": "Invalid or expired token"
}
```