---
name: "tech-debt-tracker"
version: "1.0.0"
description: "Technical debt identification, tracking, and prioritization with metrics and paydown planning"
author: "Code-Assistant-Claude"
category: "quality"

triggers:
  keywords: ["tech debt", "technical debt", "refactor", "TODO", "FIXME"]
  patterns: ["track.*debt", "debt.*analysis"]
  filePatterns: ["**/*.ts", "**/*.js", "**/*.py"]
  commands: ["/sc:tech-debt"]

tokenCost:
  metadata: 44
  fullContent: 2600
  resources: 900

dependencies:
  skills: []
  mcps: []

composability:
  compatibleWith: ["code-quality-enforcer"]
  conflictsWith: []

context:
  projectTypes: ["javascript", "typescript", "python", "java"]
  minNodeVersion: "18.0.0"
  requiredTools: []

priority: "medium"
autoActivate: true
cacheStrategy: "normal"
---

# Technical Debt Tracker Skill

Automated technical debt identification, quantification, and prioritization with trend analysis and paydown planning.

## Debt Detection

```bash
/sc:tech-debt scan

Technical Debt Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total Debt: 234 hours ($58,500)
Trend: ↗️ +12 hours since last month

By Category:
├─ Code Complexity: 89 hours (38%)
├─ Duplicate Code: 56 hours (24%)
├─ Test Coverage Gaps: 45 hours (19%)
├─ Deprecated APIs: 28 hours (12%)
└─ TODO/FIXME: 16 hours (7%)

Hotspots:
1. src/services/payment.ts - 18 hours ❌
   ├─ Complexity: 45 (target: <10)
   ├─ 3 TODO comments
   └─ 0% test coverage

2. src/utils/helpers.ts - 15 hours ❌
   ├─ 400 lines duplicate code
   └─ Using deprecated moment.js

Recommendations:
1. Refactor payment service (HIGH ROI: 4.2x)
2. Eliminate duplicate code (MEDIUM ROI: 3.8x)
3. Add test coverage (HIGH ROI: 5.1x)
```

## Prioritization

```markdown
Priority Matrix:

┌─────────────────────────────────────┐
│ HIGH IMPACT + EASY                  │
│ ✅ Refactor payment processor (18h) │
│ ✅ Add missing tests (20h)          │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ HIGH IMPACT + HARD                  │
│ ⏳ Modernize auth system (45h)      │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ LOW IMPACT + EASY                   │
│ 📅 Remove unused code (8h)          │
└─────────────────────────────────────┘
```

## Usage

```bash
/sc:tech-debt scan                    # Full scan
/sc:tech-debt report                  # Detailed report
/sc:tech-debt hotspots                # Critical areas
/sc:tech-debt prioritize              # Recommended order
/sc:tech-debt trend                   # Historical analysis
```

## Success Metrics

- Debt visibility: 100%
- Prioritization accuracy: >90%
- Debt reduction: 30-40% in 6 months
- ROI tracking per fix
