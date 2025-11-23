---
name: "sc-review"
description: "Comprehensive code review with security and quality checks"
category: "workflow"
version: "1.0.0"

triggers:
  exact: "/sc:review"
  aliases: ["/review", "/check"]
  keywords: ["review code", "code quality", "security check"]

requires:
  skills: ["code-reviewer", "security-auditor"]
  mcps: ["serena", "sequential"]

parameters:
  - name: "target"
    type: "string"
    required: false
    description: "File or directory to review (defaults to recent changes)"
  - name: "depth"
    type: "string"
    required: false
    default: "standard"
    options: ["quick", "standard", "deep"]

autoExecute: true
tokenEstimate: 10000
executionTime: "15-45s"
---

# /sc:review - Code Review

Comprehensive automated code review with security, quality, and best practice checks.

## Execution Flow

### 1. Scope Analysis
- Identify files to review
- Detect changed lines (git diff)
- Determine programming languages
- Select appropriate linters and checkers

### 2. Multi-Dimensional Review

**Quick Review** (5-10s):
- Syntax errors
- Basic linting
- Import issues
- Type errors

**Standard Review** (15-30s):
- All quick checks
- Security vulnerabilities
- Code smells
- Performance issues
- Best practices

**Deep Review** (30-60s):
- All standard checks
- Architecture analysis
- Maintainability assessment
- Test coverage gaps
- Documentation quality

### 3. Analysis Categories

1. **Security** (security-auditor skill)
   - SQL injection vulnerabilities
   - XSS risks
   - CSRF protection
   - Authentication flaws
   - Sensitive data exposure

2. **Quality** (code-reviewer skill)
   - Code complexity
   - Duplication
   - Naming conventions
   - Function length
   - Class cohesion

3. **Performance**
   - N+1 queries
   - Memory leaks
   - Inefficient algorithms
   - Bundle size impact

4. **Best Practices**
   - SOLID principles
   - Design patterns
   - Error handling
   - Logging practices

5. **Testing**
   - Test coverage
   - Test quality
   - Missing edge cases
   - Mock usage

### 4. Report Generation

```markdown
📊 Code Review Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Overall Score: 8.5/10 🟢

## Summary
Files reviewed: 5
Lines reviewed: 487
Issues found: 12 (3 critical, 4 warning, 5 info)

## Critical Issues ⚠️
1. [Security] SQL injection risk in src/api/users.ts:45
2. [Security] XSS vulnerability in src/components/Form.tsx:123
3. [Performance] Memory leak in src/hooks/useData.ts:67

## Warnings ⚡
1. [Quality] High complexity in calculateTotal() - consider refactoring
2. [Best Practices] Missing error handling in async function
3. [Testing] Low test coverage in UserService (45%)
4. [Performance] Inefficient loop in processItems()

## Info ℹ️
1. [Style] Inconsistent naming convention
2. [Documentation] Missing JSDoc for public API
3. [Best Practices] Consider using const instead of let
4. [Type Safety] Add return type annotation
5. [Testing] Add integration tests

## Recommendations
✅ Fix critical security issues immediately
✅ Refactor complex functions for maintainability
✅ Increase test coverage to >80%
✅ Add comprehensive error handling
✅ Update documentation
```

### 5. Auto-Fix Suggestions

For each issue, provides:
- Severity level
- Location (file:line)
- Description
- Fix suggestion
- Code example

## Examples

### Review Recent Changes
```bash
/sc:review

# Reviews git diff since last commit
```

### Review Specific File
```bash
/sc:review "src/services/UserService.ts" --depth=deep

# Deep analysis of specific file
```

### Quick Review
```bash
/sc:review --depth=quick

# Fast syntax and basic checks
```

## Integration

### With Skills
- code-reviewer: Quality and best practices
- security-auditor: Vulnerability scanning
- test-analyzer: Coverage analysis

### With MCPs
- Serena: Code navigation and analysis
- Sequential: Multi-step reasoning for complex issues

## Configuration

`.claude/settings.json`:
```json
{
  "commands": {
    "sc-review": {
      "defaultDepth": "standard",
      "autoFix": false,
      "failOnCritical": true,
      "minimumScore": 7.0
    }
  }
}
```

## Success Metrics

- Detection accuracy: >95%
- False positive rate: <5%
- Average execution time: <30s
- User satisfaction: >4.5/5
