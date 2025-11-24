---
name: "dependency-updater"
version: "1.0.0"
description: "Automated dependency updates with security scanning, compatibility testing, and changelog generation"
author: "Code-Assistant-Claude"
category: "maintenance"

triggers:
  keywords: ["update dependencies", "dependency update", "upgrade packages", "npm update"]
  patterns: ["update.*dependencies", "upgrade.*packages", "check.*outdated"]
  filePatterns: ["package.json", "package-lock.json", "yarn.lock", "pnpm-lock.yaml", "requirements.txt", "Pipfile", "Gemfile", "go.mod", "pom.xml"]
  commands: ["/sc:update-deps", "/sc:dependency-check"]

tokenCost:
  metadata: 45
  fullContent: 2800
  resources: 800

dependencies:
  skills: ["security-auditor"]
  mcps: []

composability:
  compatibleWith: ["security-auditor", "test-generator"]
  conflictsWith: []

context:
  projectTypes: ["javascript", "typescript", "python", "ruby", "go", "java", "nodejs", "react", "vue", "angular"]
  minNodeVersion: "18.0.0"
  requiredTools: ["npm", "git"]

priority: "high"
autoActivate: true
cacheStrategy: "normal"
---

# Dependency Updater Skill

Automated dependency management with intelligent updates, security scanning, compatibility testing, and comprehensive change tracking.

## Features

### 1. Multi-Package Manager Support

Supports all major package managers:
- **JavaScript/TypeScript**: npm, yarn, pnpm, bun
- **Python**: pip, poetry, pipenv
- **Ruby**: bundler
- **Go**: go modules
- **Java**: maven, gradle
- **Rust**: cargo
- **PHP**: composer

### 2. Update Strategies

```markdown
Update Strategies:

🔴 SECURITY: Critical security updates only
├─ CVE fixes
├─ Security advisories
└─ Zero-day patches

🟡 CONSERVATIVE: Patch versions only (1.2.3 → 1.2.4)
├─ Bug fixes
├─ Performance improvements
└─ No breaking changes

🟢 MODERATE: Minor versions (1.2.3 → 1.3.0)
├─ New features
├─ Deprecation warnings
└─ Mostly backwards compatible

🔵 AGGRESSIVE: Major versions (1.2.3 → 2.0.0)
├─ Breaking changes
├─ API changes
└─ Requires code changes
```

### 3. Dependency Analysis

```bash
# Analyze current dependencies
npm outdated
npm audit

# Output:
Package         Current  Wanted  Latest  Location
react           18.2.0   18.2.0  18.3.1  dependencies
typescript      5.0.4    5.0.4   5.3.3   devDependencies
eslint          8.45.0   8.57.0  8.57.0  devDependencies

Vulnerabilities: 3 (1 high, 2 moderate)
```

### 4. Automated Update Workflow

```markdown
🔄 Dependency Update Workflow

Step 1: Scan Dependencies
├─ Identify outdated packages
├─ Check for security vulnerabilities
├─ Analyze breaking change risk
└─ Generate update plan

Step 2: Prioritize Updates
├─ Critical security: Update immediately
├─ High security: Update within 24h
├─ Feature updates: Schedule for sprint
└─ Major versions: Require review

Step 3: Test Updates
├─ Create test branch
├─ Update dependencies
├─ Run full test suite
├─ Check for build errors
└─ Verify functionality

Step 4: Review Changes
├─ Generate changelog
├─ Document breaking changes
├─ Estimate migration effort
└─ Create PR with details

Step 5: Deploy
├─ Merge after approval
├─ Deploy to staging
├─ Monitor for issues
└─ Rollback if needed
```

## Update Report Format

```markdown
📦 Dependency Update Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated: {{timestamp}}
Strategy: MODERATE
Environment: Production

🔴 SECURITY UPDATES (Must Update)
┌──────────────────────────────────────────────┐
│ Package: axios                               │
│ Current: 0.21.1                              │
│ Latest: 1.6.2                                │
│ Severity: HIGH                               │
│ CVE: CVE-2023-45857                          │
│ Issue: Server-Side Request Forgery (SSRF)   │
│ Impact: Attacker can make unauthorized reqs  │
│ Fix: Update to 1.6.2+                        │
│ Effort: LOW (No breaking changes)            │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ Package: json5                               │
│ Current: 2.2.0                               │
│ Latest: 2.2.3                                │
│ Severity: HIGH                               │
│ CVE: CVE-2022-46175                          │
│ Issue: Prototype Pollution                   │
│ Impact: Potential RCE via crafted JSON       │
│ Fix: Update to 2.2.3+                        │
│ Effort: LOW (Patch version)                  │
└──────────────────────────────────────────────┘

Security Updates Total: 2 packages
Required Action: IMMEDIATE

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🟢 FEATURE UPDATES (Recommended)
┌──────────────────────────────────────────────┐
│ Package: react                               │
│ Current: 18.2.0                              │
│ Latest: 18.3.1                               │
│ Type: Minor update                           │
│ Changes:                                     │
│ - Performance improvements                   │
│ - New useOptimistic hook                     │
│ - Better DevTools integration                │
│ Breaking: None                               │
│ Effort: LOW                                  │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ Package: typescript                          │
│ Current: 5.0.4                               │
│ Latest: 5.3.3                                │
│ Type: Minor update                           │
│ Changes:                                     │
│ - Improved type inference                    │
│ - Better error messages                      │
│ - New import attributes                      │
│ Breaking: Stricter type checking (minor)     │
│ Effort: MEDIUM (may require type fixes)      │
└──────────────────────────────────────────────┘

Feature Updates Total: 8 packages
Required Action: SCHEDULE FOR SPRINT

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔵 MAJOR UPDATES (Review Required)
┌──────────────────────────────────────────────┐
│ Package: jest                                │
│ Current: 28.1.3                              │
│ Latest: 29.7.0                               │
│ Type: MAJOR update                           │
│ Breaking Changes:                            │
│ - Node.js 14+ required (we have 18) ✅       │
│ - Changed config format                      │
│ - Removed legacy fake timers                 │
│ - New snapshot format                        │
│ Migration Effort: HIGH                       │
│ Time Estimate: 4-8 hours                     │
│ Documentation: jest.io/docs/29.x/upgrading  │
│ Recommendation: Schedule for next sprint     │
└──────────────────────────────────────────────┘

Major Updates Total: 3 packages
Required Action: REVIEW & PLAN

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Summary

Total Packages Analyzed: 124
Outdated: 13 (10%)
Security Issues: 2 (HIGH priority)
Feature Updates: 8 (Recommended)
Major Updates: 3 (Review required)

Recommended Actions:
1. 🔴 Update axios & json5 IMMEDIATELY (security)
2. 🟢 Schedule feature updates for Sprint 43
3. 🔵 Plan major updates for Sprint 44
4. 📅 Next scan: {{next_scan_date}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🤖 Automated Actions Available

/sc:update-deps security        # Update security issues only
/sc:update-deps conservative    # Patch versions only
/sc:update-deps moderate        # Minor versions
/sc:update-deps aggressive      # All updates (with review)

/sc:update-deps package axios   # Update specific package
/sc:update-deps test            # Test updates without commit
```

## Compatibility Testing

```markdown
🧪 Compatibility Test Suite

Pre-Update Tests:
├─ ✅ Unit tests (passing)
├─ ✅ Integration tests (passing)
├─ ✅ E2E tests (passing)
├─ ✅ Build successful
└─ ✅ Linting passing

Post-Update Tests:
├─ ⏳ Running unit tests...
├─ ⏳ Running integration tests...
├─ ⏳ Running E2E tests...
├─ ⏳ Building project...
└─ ⏳ Checking for breaking changes...

Results:
✅ All tests passing
✅ Build successful
✅ No breaking changes detected
✅ Code coverage maintained (87%)
⚠️  3 TypeScript warnings (non-blocking)

Recommendation: ✅ SAFE TO MERGE
```

## Changelog Generation

```markdown
## Dependencies Update - {{date}}

### Security Fixes 🔒

- **axios**: 0.21.1 → 1.6.2
  - Fixed CVE-2023-45857 (SSRF vulnerability)
  - Critical security update

- **json5**: 2.2.0 → 2.2.3
  - Fixed CVE-2022-46175 (Prototype pollution)
  - High severity security issue

### Feature Updates ✨

- **react**: 18.2.0 → 18.3.1
  - Added useOptimistic hook
  - Performance improvements
  - Better DevTools integration

- **typescript**: 5.0.4 → 5.3.3
  - Improved type inference
  - Better error messages
  - New import attributes support

- **eslint**: 8.45.0 → 8.57.0
  - New rules for modern JavaScript
  - Performance improvements
  - Bug fixes

### DevDependencies Updates 🛠️

- **@types/node**: 18.16.0 → 20.10.6
- **@types/react**: 18.2.14 → 18.2.45
- **prettier**: 2.8.8 → 3.1.1

### Breaking Changes ⚠️

None in this update.

### Migration Notes

No migration required for this update. All changes are backwards compatible.

### Testing

- ✅ All unit tests passing (234/234)
- ✅ All integration tests passing (67/67)
- ✅ All E2E tests passing (23/23)
- ✅ Build successful
- ✅ No runtime errors detected

### Deployment

- Deployed to staging: {{staging_date}}
- Deployed to production: {{production_date}}
- Rollback plan: Available if needed
```

## Scheduled Updates

```markdown
📅 Dependency Update Schedule

WEEKLY (Every Monday 9:00 AM):
├─ Scan for security vulnerabilities
├─ Generate update report
├─ Auto-update critical security issues
└─ Notify team of recommendations

MONTHLY (First Monday of month):
├─ Full dependency audit
├─ Update patch versions
├─ Test compatibility
└─ Generate comprehensive report

QUARTERLY (Start of quarter):
├─ Review major version updates
├─ Plan migration efforts
├─ Update roadmap
└─ Allocate sprint capacity

ON-DEMAND:
├─ Security advisory triggered
├─ Manual request via /sc:update-deps
├─ Pre-release preparation
└─ Before major feature development
```

## Rollback Procedure

```markdown
🔙 Rollback Procedure

If issues detected after update:

Step 1: Identify Issue
├─ Check error logs
├─ Review failing tests
├─ Identify problematic package
└─ Assess severity

Step 2: Quick Rollback
bash
# Rollback to previous version
git revert <commit-hash>
npm install
npm test


Step 3: Investigate
├─ Review changelog for breaking changes
├─ Check compatibility matrix
├─ Identify code that needs updating
└─ Create fix plan

Step 4: Fix or Defer
Option A: Quick Fix
- Update code to work with new version
- Retest and redeploy

Option B: Defer Update
- Rollback and stay on old version
- Schedule proper migration
- Document technical debt
```

## Integration

### CI/CD Integration

```yaml
# .github/workflows/dependency-check.yml
name: Dependency Check

on:
  schedule:
    - cron: '0 9 * * 1'  # Every Monday 9 AM
  workflow_dispatch:

jobs:
  check-dependencies:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Check for outdated packages
        run: npm outdated
      - name: Security audit
        run: npm audit
      - name: Generate update report
        run: /sc:update-deps --report-only
```

### Notification Integration

```markdown
Notifications sent to:
├─ Slack: #engineering-updates
├─ Email: engineering@company.com
├─ GitHub Issues: Auto-create for security
└─ Dashboard: Team metrics board
```

## Best Practices

```markdown
✅ DO:
- Update security issues immediately
- Test updates in staging first
- Review changelogs before updating
- Keep lock files committed
- Document breaking changes
- Monitor after deployment

❌ DON'T:
- Update all packages blindly
- Skip testing after updates
- Ignore security warnings
- Update major versions without review
- Mix dependency updates with feature changes
- Deploy updates on Friday afternoons
```

## Usage

```bash
# Scan dependencies
/sc:update-deps scan

# Update security issues only
/sc:update-deps security

# Update with conservative strategy
/sc:update-deps conservative

# Update specific package
/sc:update-deps package react

# Test updates without committing
/sc:update-deps test

# Generate report only
/sc:update-deps report

# Full update with all strategies
/sc:update-deps moderate --auto-test --auto-pr
```

## Configuration

`.claude/settings.json`:
```json
{
  "skills": {
    "dependency-updater": {
      "strategy": "moderate",
      "autoUpdate": {
        "security": true,
        "patch": false,
        "minor": false,
        "major": false
      },
      "schedule": {
        "securityScan": "daily",
        "fullAudit": "weekly",
        "majorReview": "monthly"
      },
      "testing": {
        "runTests": true,
        "requireAllPassing": true,
        "coverageThreshold": 80
      },
      "notifications": {
        "slack": true,
        "email": true,
        "githubIssue": true
      }
    }
  }
}
```

## Success Metrics

- Security vulnerability resolution: <24 hours
- Dependency freshness: >90% current within 1 minor version
- Update success rate: >95%
- Rollback rate: <5%
- Time spent on manual updates: -80%
