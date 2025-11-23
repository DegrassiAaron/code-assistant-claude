# Node.js API Example

Complete example of Code-Assistant-Claude setup for a Node.js + Express + TypeScript API project.

## Project Overview

This example demonstrates:
- ✅ API endpoint scaffolding
- ✅ Security-focused development
- ✅ Comprehensive test coverage
- ✅ Token optimization achieving 85% savings
- ✅ Production-ready code generation

## Project Structure

```
nodejs-api/
├── .claude/
│   ├── CLAUDE.md
│   ├── settings.json
│   ├── .mcp.json
│   ├── skills/
│   │   ├── code-reviewer/
│   │   ├── architect/
│   │   ├── test-engineer/
│   │   └── security-auditor/
│   └── commands/
│       ├── sc-implement.md
│       ├── sc-scaffold.md
│       └── sc-security-audit.md
│
├── src/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── middleware/
│   ├── models/
│   └── app.ts
│
├── tests/
│   ├── unit/
│   └── integration/
│
├── package.json
└── tsconfig.json
```

## Setup

```bash
npm install -g code-assistant-claude
cd nodejs-api
code-assistant-claude init
```

## Generated Configuration

### .claude/settings.json

```json
{
  "version": "1.0.0",
  "projectType": "nodejs-api",
  "techStack": ["nodejs", "express", "typescript", "postgresql"],

  "verbosityMode": "compressed",

  "skills": {
    "recommended": [
      "code-reviewer",
      "architect",
      "test-engineer",
      "security-auditor"
    ]
  },

  "mcpServers": {
    "servers": ["magic", "serena", "sequential"]
  }
}
```

## Example Workflows

### 1. Scaffold API Endpoint

```
You: /sc:scaffold api-endpoint users

Claude: ✅ Generated: src/routes/users.ts
        ✅ Generated: src/controllers/userController.ts
        ✅ Generated: src/services/userService.ts
        ✅ Generated: src/models/User.ts
        ✅ Generated: tests/integration/users.test.ts

        Token usage: 3,800 (vs 45,000 traditional)
        Savings: 92%
```

**Generated: src/routes/users.ts**:
```typescript
import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { createUserSchema, updateUserSchema } from '../schemas/user';

const router = Router();
const controller = new UserController();

router.get('/', authMiddleware, controller.getUsers);
router.get('/:id', authMiddleware, controller.getUserById);
router.post('/', validate(createUserSchema), controller.createUser);
router.put('/:id', authMiddleware, validate(updateUserSchema), controller.updateUser);
router.delete('/:id', authMiddleware, controller.deleteUser);

export default router;
```

### 2. Implement Authentication

```
You: /sc:implement "JWT authentication with refresh tokens" --security

Claude: [Coordinating: architect + security-auditor + test-engineer]

        ✅ Architecture designed
        ✅ Auth middleware implemented
        ✅ Token service implemented
        ✅ Security audit passed
        ✅ Tests generated (95% coverage)

        Security Features:
        - Secure password hashing (bcrypt)
        - JWT with refresh tokens
        - Rate limiting
        - CSRF protection

        Token usage: 16,200 (vs 98,000 traditional)
        Savings: 83%
```

### 3. Security Audit

```
You: /sc:security-audit src/routes/users.ts

Claude: [Activating security-auditor skill]

        🛡️ Security Audit Report
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        Risk Level: LOW

        🟡 Medium (2):
        1. Missing rate limiting on POST /users
           Impact: DoS vulnerability
           Fix: Add rate limiter middleware

        2. Verbose error messages
           Impact: Information leakage
           Fix: Sanitize error responses

        ✅ Passed (12):
        - Input validation present
        - SQL injection protected
        - Authentication required
        - CORS configured
        [...]

        Token usage: 7,400
```

## Token Savings Breakdown

| Task | Traditional | Optimized | Savings |
|------|------------|-----------|---------|
| API Scaffolding | 45,000 | 3,800 | 92% |
| Auth Implementation | 98,000 | 16,200 | 83% |
| Security Audit | 38,000 | 7,400 | 81% |
| Code Review | 32,000 | 5,200 | 84% |
| **Average Session** | **150,000** | **22,500** | **85%** |

## Best Practices

### 1. Security First
Always use `--security` flag for authentication/authorization features

### 2. Scaffold Before Implementing
Use `/sc:scaffold` to create boilerplate, then implement business logic

### 3. Regular Security Audits
Run `/sc:security-audit` before commits

### 4. Test Coverage
Maintain >90% coverage using `/sc:test`

---

**Next**: [Python Django Example](../python-django/)
