# Task Management API Contract

## Get User's Tasks
```
GET /api/tasks
```

### Headers
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Query Parameters (Optional)
- `status`: Filter by task status (todo, in-progress, done)
- `priority`: Filter by task priority (low, medium, high, urgent)
- `limit`: Number of tasks to return (pagination)
- `offset`: Offset for pagination

### Response (200)
```json
{
  "tasks": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "user_id": "550e8400-e29b-41d4-a716-446655440001",
      "title": "Sample Task",
      "description": "Task description",
      "status": "todo",
      "priority": "medium",
      "due_date": "2024-12-31T23:59:59Z",
      "created_at": "2024-01-01T12:00:00Z",
      "updated_at": "2024-01-01T12:00:00Z"
    }
  ],
  "total_count": 1
}
```

## Get Specific Task
```
GET /api/tasks/{task_id}
```

### Headers
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Path Parameters
- `task_id`: ID of the specific task to retrieve

### Response (200)
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "550e8400-e29b-41d4-a716-446655440001",
  "title": "Sample Task",
  "description": "Task description",
  "status": "todo",
  "priority": "medium",
  "due_date": "2024-12-31T23:59:59Z",
  "created_at": "2024-01-01T12:00:00Z",
  "updated_at": "2024-01-01T12:00:00Z"
}
```

### Response (404)
```json
{
  "error": "Task not found or unauthorized",
  "code": "TASK_NOT_FOUND"
}
```

## Create Task
```
POST /api/tasks
```

### Headers
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Request Body
```json
{
  "title": "New Task",
  "description": "Task description",
  "status": "todo",
  "priority": "medium",
  "due_date": "2024-12-31T23:59:59Z"
}
```

### Response (201)
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "550e8400-e29b-41d4-a716-446655440001",
  "title": "New Task",
  "description": "Task description",
  "status": "todo",
  "priority": "medium",
  "due_date": "2024-12-31T23:59:59Z",
  "created_at": "2024-01-01T12:00:00Z",
  "updated_at": "2024-01-01T12:00:00Z"
}
```

## Update Task
```
PUT /api/tasks/{task_id}
```

### Headers
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Path Parameters
- `task_id`: ID of the specific task to update

### Request Body
```json
{
  "title": "Updated Task",
  "description": "Updated description",
  "status": "in-progress",
  "priority": "high",
  "due_date": "2024-12-31T23:59:59Z"
}
```

### Response (200)
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "550e8400-e29b-41d4-a716-446655440001",
  "title": "Updated Task",
  "description": "Updated description",
  "status": "in-progress",
  "priority": "high",
  "due_date": "2024-12-31T23:59:59Z",
  "created_at": "2024-01-01T12:00:00Z",
  "updated_at": "2024-01-01T13:00:00Z"
}
```

## Partially Update Task
```
PATCH /api/tasks/{task_id}
```

### Headers
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Path Parameters
- `task_id`: ID of the specific task to update

### Request Body (partial)
```json
{
  "status": "done"
}
```

### Response (200)
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "550e8400-e29b-41d4-a716-446655440001",
  "title": "Sample Task",
  "description": "Task description",
  "status": "done",
  "priority": "medium",
  "due_date": "2024-12-31T23:59:59Z",
  "created_at": "2024-01-01T12:00:00Z",
  "updated_at": "2024-01-01T14:00:00Z"
}
```

## Delete Task
```
DELETE /api/tasks/{task_id}
```

### Headers
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Path Parameters
- `task_id`: ID of the specific task to delete

### Response (204)
No content returned on successful deletion

### Response (404)
```json
{
  "error": "Task not found or unauthorized",
  "code": "TASK_NOT_FOUND"
}
```

## HTTP Status Codes

- **200 OK**: Request successful (for GET, PUT, PATCH)
- **201 Created**: New resource created successfully (for POST)
- **204 No Content**: Request successful, no content to return (for DELETE)
- **400 Bad Request**: Invalid request format or validation error
- **401 Unauthorized**: Missing or invalid authentication token
- **403 Forbidden**: Insufficient permissions (trying to access another user's data)
- **404 Not Found**: Requested resource doesn't exist
- **422 Unprocessable Entity**: Semantic errors in request payload
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Unexpected server error