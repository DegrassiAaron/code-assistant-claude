---
name: "code-quality-enforcer"
version: "1.0.0"
description: "Automated code quality enforcement with pre-commit hooks, PR checks, and continuous monitoring"
author: "Code-Assistant-Claude"
category: "quality"

triggers:
  keywords: ["code quality", "quality gates", "linting", "coverage"]
  patterns: ["quality.*check", "enforce.*quality"]
  filePatterns: [".eslintrc*", ".prettierrc*", "jest.config*"]
  commands: ["/sc:quality"]

tokenCost:
  metadata: 45
  fullContent: 2900
  resources: 1000

dependencies:
  skills: ["code-reviewer", "test-generator"]
  mcps: []

composability:
  compatibleWith: ["code-reviewer", "security-auditor"]
  conflictsWith: []

context:
  projectTypes: ["javascript", "typescript", "python", "java"]
  minNodeVersion: "18.0.0"
  requiredTools: []

priority: "high"
autoActivate: true
cacheStrategy: "normal"
---

# Code Quality Enforcer Skill

Automated code quality enforcement with pre-commit hooks, PR quality gates, and continuous monitoring.

## Quality Gates

```yaml
# .claude/quality-gates.yml
quality_gates:
  pre_commit:
    - name: "Linting"
      command: "npm run lint"
      blocking: true
    - name: "Type check"
      command: "npm run type-check"
      blocking: true
    - name: "Unit tests"
      command: "npm test"
      blocking: false  # Warning only

  pull_request:
    - name: "Test coverage"
      threshold: 80
      blocking: true
    - name: "Code complexity"
      max_complexity: 15
      blocking: true
    - name: "Security scan"
      command: "npm audit"
      blocking: true
    - name: "Bundle size"
      max_size: "700KB"
      blocking: false

  continuous:
    - name: "Performance"
      threshold: "LCP < 2.5s"
      alert: true
    - name: "Error rate"
      threshold: "< 1%"
      alert: true
```

## Pre-Commit Enforcement

```bash
/sc:quality init

Pre-commit hooks installed:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

On every commit:
├─ ✅ ESLint (auto-fix enabled)
├─ ✅ Prettier (auto-format)
├─ ✅ TypeScript check
├─ ✅ Unit tests (affected files)
└─ ✅ Commit message validation

Result:
✅ All checks passed - Commit allowed
❌ Checks failed - Commit blocked

Time: <5 seconds per commit
```

## PR Quality Report

```markdown
Pull Request Quality Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PR #456: Add payment integration

CODE QUALITY:
├─ Linting: ✅ PASSED
├─ Type checking: ✅ PASSED
├─ Complexity: ⚠️  WARNING
│   └─ src/payment/processor.ts: 18 (target: <15)
└─ Duplication: ✅ PASSED

TEST COVERAGE:
├─ Overall: 87% ✅ (target: 80%)
├─ New code: 92% ✅
├─ Files changed: 8
│   ├─ payment/processor.ts: 95% ✅
│   ├─ payment/validator.ts: 100% ✅
│   └─ api/routes.ts: 65% ⚠️

SECURITY:
├─ Vulnerabilities: 0 ✅
├─ Secrets: None detected ✅
└─ Dependencies: All up to date ✅

BUNDLE SIZE:
├─ Before: 685 KB
├─ After: 742 KB (+57 KB) ⚠️
└─ Impact: 8.3% increase

OVERALL: 🟢 APPROVED
Warnings: 2 (non-blocking)
Can merge: YES
```

## Continuous Monitoring

```bash
/sc:quality trends

Code Quality Trends (Last 30 Days)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Test Coverage:
90% │                           ●
85% │                   ●   ●   ●
80% │           ●   ●   ●
75% │   ●   ●
    └─────────────────────────────────
    W1  W2  W3  W4  W5  W6  W7  W8

Trend: 📈 IMPROVING (+15% over 8 weeks)

Code Complexity:
20  │   ●
15  │       ●   ●   ●   ●   ●   ●   ●
10  │
    └─────────────────────────────────
    W1  W2  W3  W4  W5  W6  W7  W8

Trend: 📉 IMPROVING (reduced complexity)

Technical Debt:
250h│   ●
200h│       ●
150h│           ●   ●   ●   ●   ●   ●
    └─────────────────────────────────
    W1  W2  W3  W4  W5  W6  W7  W8

Trend: 📉 DECREASING (40% reduction)
```

## Auto-Fix Capabilities

```bash
/sc:quality fix

Auto-fixing issues:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Linting errors: 45 fixed automatically
✅ Formatting issues: 123 files formatted
✅ Import sorting: 67 files organized
✅ Unused imports: 89 removed
⚠️  Complexity issues: 3 require manual review

Files modified: 156
Time: 8 seconds

Next: Review and commit changes
```

## Quality Metrics

```markdown
Team Quality Scorecard
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Overall Score: 87/100 (B+)

Categories:
├─ Test Coverage: 87% ✅
├─ Code Complexity: 12 avg ✅
├─ Documentation: 76% ⚠️
├─ Security: 100% ✅
├─ Performance: 92% ✅
└─ Maintainability: 85% ✅

Top Contributors (by quality):
1. @developer1 - 94/100
2. @developer2 - 91/100
3. @developer3 - 88/100

Action Items:
1. Improve documentation coverage
2. Reduce complexity in 3 files
3. Add integration tests for payments
```

## Usage

```bash
/sc:quality init                 # Setup quality gates
/sc:quality check                # Run all checks
/sc:quality check --pre-commit   # Pre-commit checks
/sc:quality check --pr           # PR checks
/sc:quality fix                  # Auto-fix issues
/sc:quality report               # Quality report
/sc:quality trends               # Historical trends
```

## Success Metrics

- Code quality: Consistent 85%+
- Bug reduction: 60%
- PR review time: -40%
- Test coverage: >80% enforced
- Zero quality regressions
