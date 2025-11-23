---
name: "code-reviewer"
version: "1.0.0"
description: "Automatic code review focusing on best practices, security, and maintainability"
author: "Code-Assistant-Claude"
category: "core"

triggers:
  keywords: ["review", "code review", "check code", "analyze code"]
  patterns: ["review.*code", "check.*implementation"]
  filePatterns: ["*.ts", "*.js", "*.tsx", "*.jsx", "*.py", "*.java"]
  commands: ["/sc:review"]
  events: ["file_save", "pre_commit"]

tokenCost:
  metadata: 45
  fullContent: 2000
  resources: 500

dependencies:
  skills: ["security-auditor"]
  mcps: ["serena"]

composability:
  compatibleWith: ["test-generator", "performance-optimizer"]
  conflictsWith: []

context:
  projectTypes: ["javascript", "typescript", "python", "java", "react", "nodejs"]
  minNodeVersion: "18.0.0"
  requiredTools: ["eslint", "prettier"]

priority: "high"
autoActivate: true
cacheStrategy: "aggressive"
---

# Code Reviewer Skill

Provides comprehensive code review focusing on:
- Best practices and code quality
- Security vulnerabilities
- Performance issues
- Maintainability concerns
- Consistency with project standards

## Review Process

### 1. Initial Analysis
- Read modified files
- Identify programming language and framework
- Load relevant linting rules and best practices

### 2. Multi-Dimensional Review

#### Code Quality
- **Naming**: Clear, descriptive variable/function names
- **Structure**: Logical organization, proper separation of concerns
- **Complexity**: Avoid deeply nested logic, reduce cyclomatic complexity
- **DRY**: No code duplication
- **Comments**: Meaningful comments where needed, self-documenting code preferred

#### Security
- **Input Validation**: All user input validated
- **SQL Injection**: Parameterized queries used
- **XSS Prevention**: Proper output escaping
- **Authentication**: Secure auth implementation
- **Secrets**: No hardcoded secrets

#### Performance
- **Algorithm Efficiency**: Optimal time/space complexity
- **Resource Management**: Proper cleanup (connections, file handles)
- **Caching**: Appropriate use of caching
- **Async Operations**: Non-blocking where appropriate

#### Maintainability
- **Test Coverage**: Adequate test coverage
- **Error Handling**: Comprehensive error handling
- **Documentation**: API docs, README updates
- **Dependencies**: Minimal, well-maintained dependencies

### 3. Report Generation

```
📋 Code Review Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Files Reviewed: 3
Issues Found: 5 (2 high, 2 medium, 1 low)

🔴 HIGH PRIORITY
├─ src/auth.ts:45 - SQL injection vulnerability
│  Use parameterized queries instead of string concatenation
│
└─ src/api.ts:123 - Missing input validation
   Validate user input before processing

🟡 MEDIUM PRIORITY
├─ src/utils.ts:67 - Code duplication
│  Extract common logic into shared function
│
└─ src/components/Form.tsx:89 - Missing error handling
   Add try-catch for async operations

🟢 LOW PRIORITY
└─ src/helpers.ts:34 - Complex function
   Consider breaking into smaller functions

✅ STRENGTHS
├─ Good test coverage (85%)
├─ Clear naming conventions
└─ Proper TypeScript typing

💡 RECOMMENDATIONS
1. Add JSDoc comments for public APIs
2. Consider implementing error boundaries
3. Update README with new features
```

## Integration

### With Security Auditor
Delegates security-specific checks to security-auditor skill for deeper analysis.

### With Test Generator
Identifies untested code paths and suggests test cases.

### With Performance Optimizer
Highlights performance bottlenecks for optimization.

## Configuration

Can be customized via `.claude/settings.json`:

```json
{
  "skills": {
    "code-reviewer": {
      "autoActivate": true,
      "severity": ["high", "medium", "low"],
      "focus": ["security", "performance", "quality"],
      "excludePatterns": ["*.test.ts", "*.spec.js"]
    }
  }
}
```

## Resources

See `resources/` directory for:
- `best-practices.md` - Language-specific best practices
- `security-patterns.md` - Common security issues and fixes
