---
name: "api-docs-generator"
version: "1.0.0"
description: "Automatic API documentation generation from code with OpenAPI/Swagger, interactive testing, and client SDK generation"
author: "Code-Assistant-Claude"
category: "documentation"

triggers:
  keywords: ["api docs", "swagger", "openapi", "api documentation"]
  patterns: ["generate.*api.*docs", "document.*api", "swagger.*spec"]
  filePatterns: ["**/routes/**", "**/controllers/**", "**/api/**", "*.controller.ts", "*.routes.ts"]
  commands: ["/sc:api-docs", "/sc:docs-api"]

tokenCost:
  metadata: 48
  fullContent: 3200
  resources: 1000

dependencies:
  skills: []
  mcps: []

composability:
  compatibleWith: ["code-reviewer"]
  conflictsWith: []

context:
  projectTypes: ["nodejs", "typescript", "python", "java", "go", "ruby", "php"]
  minNodeVersion: "18.0.0"
  requiredTools: []

priority: "medium"
autoActivate: true
cacheStrategy: "normal"
---

# API Documentation Generator Skill

Automatic generation of comprehensive API documentation from code annotations, with OpenAPI 3.0 specs, Swagger UI, interactive testing, and client SDK generation.

## Documentation Sources

```markdown
📚 Documentation Extraction Methods

Method 1: Decorators/Annotations (Recommended)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TypeScript/Node.js (NestJS style):
typescript
import { ApiProperty, ApiResponse } from '@nestjs/swagger';

@Controller('users')
@ApiTags('users')
export class UsersController {
  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUser(@Param('id') id: number): Promise<User> {
    return this.usersService.findOne(id);
  }
}


Python (FastAPI):
python
from fastapi import FastAPI, Path
from pydantic import BaseModel

class User(BaseModel):
    id: int
    name: str
    email: str

@app.get("/users/{user_id}", response_model=User)
async def get_user(
    user_id: int = Path(..., description="The ID of the user")
):
    """
    Get a user by ID

    Returns user details including name and email.
    """
    return await db.users.find_one({"id": user_id})


Java (Spring):
java
@RestController
@RequestMapping("/api/users")
@Tag(name = "users", description = "User management APIs")
public class UserController {

    @GetMapping("/{id}")
    @Operation(summary = "Get user by ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Success"),
        @ApiResponse(responseCode = "404", description = "User not found")
    })
    public User getUser(@PathVariable Long id) {
        return userService.findById(id);
    }
}


Method 2: JSDoc/DocBlocks
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TypeScript:
typescript
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.get('/users/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});


Method 3: Code Analysis (Automatic)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Automatically extracts from:
├─ Route definitions
├─ Request/response types
├─ Validation schemas
├─ Middleware
└─ Error handlers

Example detection:
typescript
// Automatically detected as GET /api/users/:id
app.get('/api/users/:id', authenticate, async (req, res) => {
  // Types inferred from TypeScript
  const id: number = req.params.id;
  const user: User = await findUser(id);
  res.json(user);
});

```

## OpenAPI Specification Generation

```markdown
📄 Generated OpenAPI 3.0 Specification

bash
/sc:api-docs generate

Output: openapi.yaml
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

openapi: 3.0.0
info:
  title: User Management API
  version: 2.1.0
  description: |
    REST API for user management with authentication,
    profile management, and preferences.
  contact:
    name: API Support
    email: api@company.com
  license:
    name: MIT

servers:
  - url: https://api.production.com/v1
    description: Production server
  - url: https://api.staging.com/v1
    description: Staging server
  - url: http://localhost:3000/v1
    description: Development server

tags:
  - name: users
    description: User management operations
  - name: auth
    description: Authentication endpoints

paths:
  /users:
    get:
      tags: [users]
      summary: List all users
      description: |
        Retrieve a paginated list of users.
        Supports filtering, sorting, and searching.
      operationId: listUsers
      parameters:
        - name: page
          in: query
          description: Page number (1-indexed)
          schema:
            type: integer
            minimum: 1
            default: 1
        - name: limit
          in: query
          description: Items per page
          schema:
            type: integer
            minimum: 1
            maximum: 100
            default: 20
        - name: sort
          in: query
          description: Sort field
          schema:
            type: string
            enum: [name, email, createdAt]
            default: createdAt
        - name: order
          in: query
          description: Sort order
          schema:
            type: string
            enum: [asc, desc]
            default: desc
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/User'
                  pagination:
                    $ref: '#/components/schemas/Pagination'
              example:
                data:
                  - id: 1
                    name: "John Doe"
                    email: "john@example.com"
                    role: "user"
                    createdAt: "2024-01-15T10:00:00Z"
                pagination:
                  page: 1
                  limit: 20
                  total: 150
                  totalPages: 8
        '401':
          $ref: '#/components/responses/Unauthorized'
      security:
        - bearerAuth: []

  /users/{id}:
    get:
      tags: [users]
      summary: Get user by ID
      operationId: getUser
      parameters:
        - name: id
          in: path
          required: true
          description: User ID
          schema:
            type: integer
      responses:
        '200':
          description: User found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '404':
          $ref: '#/components/responses/NotFound'
      security:
        - bearerAuth: []

    put:
      tags: [users]
      summary: Update user
      operationId: updateUser
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UserUpdate'
            example:
              name: "Jane Doe"
              email: "jane@example.com"
      responses:
        '200':
          description: User updated
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '400':
          $ref: '#/components/responses/BadRequest'
        '404':
          $ref: '#/components/responses/NotFound'
      security:
        - bearerAuth: []

    delete:
      tags: [users]
      summary: Delete user
      operationId: deleteUser
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      responses:
        '204':
          description: User deleted
        '404':
          $ref: '#/components/responses/NotFound'
      security:
        - bearerAuth: []

components:
  schemas:
    User:
      type: object
      required: [id, email, name]
      properties:
        id:
          type: integer
          description: Unique user identifier
          example: 1
        email:
          type: string
          format: email
          description: User email address
          example: "user@example.com"
        name:
          type: string
          description: User full name
          minLength: 1
          maxLength: 100
          example: "John Doe"
        role:
          type: string
          enum: [user, admin, moderator]
          default: user
        avatar:
          type: string
          format: uri
          nullable: true
          example: "https://cdn.example.com/avatars/123.jpg"
        preferences:
          $ref: '#/components/schemas/UserPreferences'
        createdAt:
          type: string
          format: date-time
          example: "2024-01-15T10:00:00Z"
        updatedAt:
          type: string
          format: date-time
          example: "2024-01-16T14:30:00Z"

    UserPreferences:
      type: object
      properties:
        theme:
          type: string
          enum: [light, dark, auto]
          default: auto
        language:
          type: string
          example: "en"
        notifications:
          type: boolean
          default: true

    UserUpdate:
      type: object
      properties:
        name:
          type: string
          minLength: 1
          maxLength: 100
        email:
          type: string
          format: email
        preferences:
          $ref: '#/components/schemas/UserPreferences'

    Pagination:
      type: object
      properties:
        page:
          type: integer
        limit:
          type: integer
        total:
          type: integer
        totalPages:
          type: integer

    Error:
      type: object
      required: [code, message]
      properties:
        code:
          type: string
        message:
          type: string
        details:
          type: object

  responses:
    BadRequest:
      description: Bad request
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            code: "VALIDATION_ERROR"
            message: "Invalid input data"
            details:
              email: "Invalid email format"

    Unauthorized:
      description: Unauthorized
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            code: "UNAUTHORIZED"
            message: "Authentication required"

    NotFound:
      description: Resource not found
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            code: "NOT_FOUND"
            message: "User not found"

  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: |
        JWT authentication token.

        To obtain a token, use POST /auth/login with email and password.

        Example: `Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

security:
  - bearerAuth: []
```

## Interactive Documentation

```markdown
🎨 Swagger UI Generation

bash
/sc:api-docs serve

Output:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Swagger UI available at: http://localhost:3000/api-docs

Features:
├─ Interactive endpoint testing
├─ Example requests/responses
├─ Authentication support
├─ Schema validation
├─ Download OpenAPI spec
└─ Dark/light theme

Press Ctrl+C to stop


UI Features:
┌──────────────────────────────────────────────┐
│ 🏠 User Management API v2.1.0                │
├──────────────────────────────────────────────┤
│                                              │
│ 📁 users (4 endpoints)                       │
│   GET    /users          List all users     │
│   POST   /users          Create user        │
│   GET    /users/{id}     Get user           │
│   PUT    /users/{id}     Update user        │
│   DELETE /users/{id}     Delete user        │
│                                              │
│ 🔐 auth (3 endpoints)                        │
│   POST   /auth/login     Login              │
│   POST   /auth/register  Register           │
│   POST   /auth/refresh   Refresh token      │
│                                              │
│ [Try it out] button per each endpoint       │
└──────────────────────────────────────────────┘

Interactive Testing:
1. Click "Try it out"
2. Fill parameters
3. Click "Execute"
4. See real response
```

## Client SDK Generation

```markdown
🔧 Generate Client SDKs

JavaScript/TypeScript:
bash
/sc:api-docs generate-client --language=typescript

Generated: src/generated/api-client.ts
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

typescript
// Auto-generated API client
import { ApiClient } from './api-client';

const client = new ApiClient({
  baseUrl: 'https://api.example.com/v1',
  token: 'your-jwt-token'
});

// Type-safe API calls
const users = await client.users.list({
  page: 1,
  limit: 20,
  sort: 'name',
  order: 'asc'
});

const user = await client.users.get(123);

await client.users.update(123, {
  name: 'Jane Doe',
  email: 'jane@example.com'
});

// Full TypeScript support
type User = {
  id: number;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'moderator';
  // ... all fields typed
};


Python:
bash
/sc:api-docs generate-client --language=python

Generated: api_client.py
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

python
# Auto-generated API client
from api_client import ApiClient

client = ApiClient(
    base_url='https://api.example.com/v1',
    token='your-jwt-token'
)

# Type-hinted API calls
users = client.users.list(page=1, limit=20)
user = client.users.get(user_id=123)
client.users.update(user_id=123, name='Jane Doe')


Go:
bash
/sc:api-docs generate-client --language=go

Generated: client/api_client.go
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

go
package main

import "github.com/yourorg/api-client"

func main() {
    client := apiclient.NewClient(
        "https://api.example.com/v1",
        "your-jwt-token",
    )

    users, err := client.Users.List(ctx, &apiclient.ListUsersParams{
        Page:  1,
        Limit: 20,
    })
}


Other Supported Languages:
├─ Java
├─ C#
├─ Ruby
├─ PHP
├─ Swift
└─ Kotlin
```

## API Changelog

```markdown
📝 Automatic API Changelog

bash
/sc:api-docs changelog

API Changelog - v2.1.0 to v2.2.0
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ NEW ENDPOINTS:
├─ POST   /users/{id}/avatar     Upload user avatar
├─ DELETE /users/{id}/avatar     Delete user avatar
└─ GET    /users/{id}/activity   Get user activity log

🔄 MODIFIED ENDPOINTS:
├─ GET /users
│  ├─ Added parameter: filter (string, optional)
│  ├─ Added parameter: fields (array, optional)
│  └─ Response: Added field 'lastActive' to User schema
│
└─ PUT /users/{id}
   └─ Request: Added optional field 'bio' (string, max 500 chars)

⚠️  DEPRECATED:
├─ GET /users/legacy
│  Deprecated since: v2.2.0
│  Removal date: v3.0.0 (2024-06-01)
│  Migration: Use GET /users instead
│
└─ Field: User.legacyId (integer)
   Use: User.id instead

❌ BREAKING CHANGES:
None in this release

🔒 SECURITY:
├─ Added rate limiting to /auth/login (5 req/min)
└─ Enhanced JWT token validation

📊 Statistics:
├─ Total endpoints: 24 (was 21)
├─ New: 3
├─ Modified: 2
├─ Deprecated: 1
└─ Breaking: 0

Migration Guide: See docs/migration-v2.2.md
```

## Validation & Testing

```markdown
✅ API Documentation Validation

bash
/sc:api-docs validate

Validation Report:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OpenAPI Spec:
├─ ✅ Valid OpenAPI 3.0 syntax
├─ ✅ All $ref references resolved
├─ ✅ No circular dependencies
└─ ✅ Schemas valid JSON Schema

Completeness:
├─ ✅ All endpoints documented (24/24)
├─ ✅ All parameters documented
├─ ⚠️  3 endpoints missing examples
│   ├─ POST /users/{id}/avatar
│   ├─ DELETE /users/{id}/avatar
│   └─ GET /users/{id}/activity
│
└─ ⚠️  2 schemas missing descriptions
    ├─ ActivityLog
    └─ AvatarUpload

Security:
├─ ✅ Authentication documented
├─ ✅ All protected endpoints marked
└─ ✅ Security schemes defined

Best Practices:
├─ ✅ Consistent naming conventions
├─ ✅ Proper HTTP status codes
├─ ✅ Error responses documented
└─ ⚠️  Consider adding more examples

Overall Score: 92/100 (Excellent)

Recommendations:
1. Add examples for 3 missing endpoints
2. Add descriptions for 2 schemas
3. Consider adding webhooks documentation


Contract Testing:
bash
/sc:api-docs test

Running contract tests against: http://localhost:3000
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

GET /users
├─ ✅ Response matches schema
├─ ✅ Status code: 200
├─ ✅ Content-Type: application/json
└─ ✅ Pagination object present

GET /users/1
├─ ✅ Response matches User schema
├─ ✅ All required fields present
└─ ✅ Field types correct

POST /users
├─ ✅ Accepts valid input
├─ ✅ Rejects invalid email
├─ ✅ Returns 201 Created
└─ ✅ Response matches User schema

Results:
├─ Passed: 42/45 tests (93%)
├─ Failed: 3/45 tests
│   ├─ PUT /users/{id} - Field 'bio' not in response
│   ├─ DELETE /users/{id}/avatar - Returns 500 instead of 204
│   └─ GET /users/{id}/activity - Response doesn't match schema
│
└─ Overall: ⚠️  NEEDS FIXES

Action: Fix 3 failing tests before release
```

## Export Formats

```markdown
📤 Multiple Export Formats

OpenAPI YAML:
bash
/sc:api-docs export --format=openapi-yaml
# Output: openapi.yaml


OpenAPI JSON:
bash
/sc:api-docs export --format=openapi-json
# Output: openapi.json


Postman Collection:
bash
/sc:api-docs export --format=postman
# Output: postman_collection.json

Import to Postman:
1. Open Postman
2. File → Import
3. Select postman_collection.json
4. All endpoints ready to test


Insomnia Collection:
bash
/sc:api-docs export --format=insomnia
# Output: insomnia_collection.json


Markdown:
bash
/sc:api-docs export --format=markdown
# Output: API_REFERENCE.md

# Beautiful Markdown documentation
# Perfect for GitHub README


HTML (Static Site):
bash
/sc:api-docs export --format=html
# Output: docs/index.html

# Standalone HTML documentation
# No server required


ReDoc:
bash
/sc:api-docs export --format=redoc
# Output: redoc.html

# Beautiful 3-column layout
# Alternative to Swagger UI
```

## Version Management

```markdown
🔢 API Versioning

Track Multiple Versions:
bash
/sc:api-docs versions

Available API Versions:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
├─ v3.0.0 (beta)          /v3/*
│  Status: In development
│  Release: 2024-06-01
│  Breaking changes: 15
│
├─ v2.2.0 (current)       /v2/*
│  Status: Stable
│  Released: 2024-01-15
│  Endpoints: 24
│
├─ v2.1.0                 /v2/*
│  Status: Deprecated (2024-03-01)
│  Support ends: 2024-06-01
│
└─ v1.0.0                 /v1/*
   Status: End of life
   Removed: 2023-12-31


Generate Specific Version:
bash
/sc:api-docs generate --version=v2.2.0
```

## Configuration

`.claude/settings.json`:
```json
{
  "skills": {
    "api-docs-generator": {
      "format": "openapi-3.0",
      "output": "docs/openapi.yaml",
      "swaggerUI": {
        "enabled": true,
        "path": "/api-docs"
      },
      "autoGenerate": {
        "onSave": true,
        "onBuild": true
      },
      "validation": {
        "strict": true,
        "requireExamples": true,
        "requireDescriptions": true
      },
      "clients": {
        "generate": ["typescript", "python"],
        "output": "src/generated"
      }
    }
  }
}
```

## Usage

```bash
# Generate full documentation
/sc:api-docs generate

# Serve interactive docs
/sc:api-docs serve

# Validate documentation
/sc:api-docs validate

# Generate client SDK
/sc:api-docs generate-client --language=typescript

# Export to format
/sc:api-docs export --format=postman

# Show changelog
/sc:api-docs changelog

# Test API contracts
/sc:api-docs test
```

## Success Metrics

- Documentation coverage: >95%
- Auto-generation accuracy: >98%
- Client SDK generation: 8 languages
- Validation success rate: 100%
- Time saved: 80% vs manual docs
