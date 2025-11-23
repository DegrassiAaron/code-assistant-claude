---
name: "sc-finish-feature"
description: "Complete feature development and merge to develop"
category: "git"
version: "1.0.0"

triggers:
  exact: "/sc:finish-feature"
  aliases: ["/finish", "/merge-feature"]
  keywords: ["finish feature", "complete feature", "merge"]

requires:
  mcps: ["serena"]

parameters:
  - name: "feature"
    type: "string"
    required: true
    description: "Feature branch name (without prefix)"
  - name: "squash"
    type: "boolean"
    required: false
    default: false
    description: "Squash commits before merging"

autoExecute: false
tokenEstimate: 6000
executionTime: "15-45s"
---

# /sc:finish-feature - Complete Feature

Finalizes feature development with quality checks and merge to develop.

## Feature Completion Workflow

```
Feature Finish Flow:
1. Pre-merge validation
2. Update from develop
3. Final testing
4. Code review (if not done)
5. Create pull request
6. Merge to develop
7. Delete feature branch
8. Verify integration
```

## Execution Flow

### 1. Pre-Merge Validation

```markdown
✅ Feature Completion Checklist

Code Quality:
- [ ] All tests passing
- [ ] Code coverage ≥ 80%
- [ ] No TypeScript/linting errors
- [ ] No console.log or debug code
- [ ] No TODO comments (or tracked)
- [ ] Code reviewed

Functionality:
- [ ] Feature fully implemented
- [ ] All acceptance criteria met
- [ ] Edge cases handled
- [ ] Error handling complete
- [ ] Performance acceptable

Documentation:
- [ ] Code comments added
- [ ] API documentation updated
- [ ] README updated (if needed)
- [ ] CHANGELOG updated
- [ ] Migration guide (if breaking)

Testing:
- [ ] Unit tests written
- [ ] Integration tests written
- [ ] E2E tests (if applicable)
- [ ] Manual testing completed
- [ ] Browser compatibility checked

Git:
- [ ] All changes committed
- [ ] Meaningful commit messages
- [ ] No merge conflicts
- [ ] Branch up to date with develop
```

### 2. Update from Develop

```bash
# Get latest develop changes
git checkout develop
git pull origin develop

# Switch back to feature
git checkout feature/{feature}

# Merge or rebase
git merge develop
# OR
git rebase develop

# Resolve conflicts if any
# Run tests after merge/rebase
npm test
```

### 3. Final Quality Check

```markdown
🔍 Final Quality Check

Running automated checks:
1. ⏳ Linting...
2. ⏳ Type checking...
3. ⏳ Unit tests...
4. ⏳ Integration tests...
5. ⏳ Build verification...
6. ⏳ Security scan...

Results:
✅ Linting: Passed
✅ TypeScript: No errors
✅ Tests: 127/127 passed
✅ Coverage: 87% (target: 80%)
✅ Build: Success
✅ Security: No vulnerabilities

Ready to merge: YES
```

### 4. Pull Request Creation

```markdown
# Pull Request: {feature}

## Description
{Brief description of what this feature does}

## Changes
- Implemented {feature}
- Added {component/functionality}
- Updated {documentation}

## Type of Change
- [ ] Bug fix
- [x] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [x] Unit tests added/updated
- [x] Integration tests added/updated
- [x] Manual testing completed
- [x] No breaking changes

## Checklist
- [x] Code follows project style guide
- [x] Self-review completed
- [x] Comments added for complex code
- [x] Documentation updated
- [x] No new warnings generated
- [x] Tests added that prove fix/feature works
- [x] New and existing tests pass locally

## Related Issues
Closes #{issue_number}

## Screenshots (if UI changes)
[Add screenshots]

## Additional Notes
{Any additional context}
```

### 5. Merge Execution

```bash
# Option 1: Merge via pull request (recommended)
gh pr create \
  --title "feat: {feature}" \
  --body "$(cat PR_DESCRIPTION.md)" \
  --base develop \
  --head feature/{feature}

# Wait for approval and CI/CD
# Merge via GitHub UI or:
gh pr merge --squash --delete-branch

# Option 2: Direct merge (if no PR required)
git checkout develop
git merge --no-ff feature/{feature}
git push origin develop
git branch -d feature/{feature}
git push origin --delete feature/{feature}
```

### 6. Post-Merge Verification

```markdown
✅ Post-Merge Verification

Integration Checks:
- [ ] Develop branch builds successfully
- [ ] All tests passing on develop
- [ ] No conflicts with other features
- [ ] CI/CD pipeline successful
- [ ] Deployment to staging successful

Feature Validation:
- [ ] Feature works in staging
- [ ] No regression bugs
- [ ] Performance acceptable
- [ ] Integration tests passing

Cleanup:
- [ ] Feature branch deleted locally
- [ ] Feature branch deleted remotely
- [ ] Related issues closed
- [ ] Team notified

Status: ✅ Feature successfully merged
```

## Usage Examples

### Basic Feature Completion
```bash
/sc:finish-feature "user-authentication"

# Completes feature/user-authentication:
# 1. Runs quality checks
# 2. Updates from develop
# 3. Creates pull request
# 4. Merges to develop (after approval)
# 5. Deletes feature branch
# 6. Verifies integration
```

### Squash Merge
```bash
/sc:finish-feature "user-profile" --squash=true

# Squashes all commits into one:
# - Cleaner git history
# - Single commit message
# - Easier to revert if needed
#
# Before: 15 commits
# After: 1 commit "feat: add user profile functionality"
```

### With Conflict Resolution
```bash
/sc:finish-feature "payment-integration"

# If conflicts detected:
# 1. Shows conflicting files
# 2. Guides through resolution
# 3. Re-runs tests after resolution
# 4. Continues merge process
```

## Merge Strategies

### Merge Commit (--no-ff)
```
Preserves full commit history
Shows feature branch structure
Easy to identify feature work

Git graph:
    A---B---C feature/x
   /         \
--D-----------E develop

Pros: Full history, clear feature boundaries
Cons: More commits, complex history
Use when: Want complete history
```

### Squash Merge
```
Combines all commits into one
Clean linear history
Single commit message

Git graph:
--D---E develop
      (E = squashed A+B+C)

Pros: Clean history, easy revert
Cons: Loses detailed commit info
Use when: Many small commits, want clean history
```

### Rebase
```
Replays commits on top of develop
Linear history
No merge commits

Git graph:
--D---A'---B'---C' develop

Pros: Linear history, clean
Cons: Rewrites history, risky if shared
Use when: Small features, comfortable with rebase
```

## Conflict Resolution

### Automated Conflict Detection

```markdown
⚠️ Merge Conflicts Detected

Conflicting Files:
1. src/services/UserService.ts
   - Lines 45-67 (authentication logic)
   - Conflict: develop vs feature/user-auth

2. package.json
   - Dependency versions differ

Resolution Strategy:
1. Review each conflict
2. Keep necessary changes from both
3. Test after resolution
4. Commit resolved conflicts

Guidance:
- Use merge tool: git mergetool
- Or manual resolution
- Always test after resolving
```

### Conflict Resolution Guide

```bash
# View conflicts
git status
git diff

# Edit conflicting files
# Look for conflict markers:
<<<<<<< HEAD
// Code from develop
=======
// Code from feature
>>>>>>> feature/user-auth

# Resolve by choosing or combining code
# Remove conflict markers
# Save file

# Mark as resolved
git add src/services/UserService.ts

# Continue merge
git commit

# Verify resolution
npm test
npm run build
```

## Quality Gates

### Automated Quality Checks

```javascript
async function runQualityGates(feature) {
  const results = {
    linting: await runLinter(),
    typeCheck: await runTypeChecker(),
    tests: await runTests(),
    coverage: await getCoverage(),
    build: await runBuild(),
    security: await runSecurityScan()
  };

  const gates = {
    linting: results.linting.errors === 0,
    typeCheck: results.typeCheck.errors === 0,
    tests: results.tests.failed === 0,
    coverage: results.coverage.percentage >= 80,
    build: results.build.success,
    security: results.security.vulnerabilities.critical === 0
  };

  const passed = Object.values(gates).every(g => g);

  if (!passed) {
    throw new QualityGateError(
      'Quality gates failed',
      gates,
      results
    );
  }

  return { passed, gates, results };
}
```

### Manual Quality Review

```markdown
👁️ Manual Review Checklist

Code Review:
- [ ] Code is readable and maintainable
- [ ] No code smells
- [ ] Follows project patterns
- [ ] Proper error handling
- [ ] Security best practices

Design Review:
- [ ] Architecture sound
- [ ] Scalable solution
- [ ] Performance considerations
- [ ] Future-proof design

UX Review (if applicable):
- [ ] User-friendly
- [ ] Accessible
- [ ] Responsive design
- [ ] Loading states
- [ ] Error messages clear
```

## Integration with CI/CD

### GitHub Actions Workflow

```yaml
name: Feature PR Check

on:
  pull_request:
    branches:
      - develop

jobs:
  quality-gates:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Install dependencies
        run: npm install

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npm run type-check

      - name: Test
        run: npm test

      - name: Coverage
        run: npm run coverage
        env:
          COVERAGE_THRESHOLD: 80

      - name: Build
        run: npm run build

      - name: Security scan
        run: npm audit

      - name: Comment PR
        uses: actions/github-script@v5
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '✅ All quality gates passed!'
            })
```

## Team Collaboration

### Merge Notification

```markdown
📢 Feature Merged to Develop

Feature: {feature}
Developer: @{username}
Merged: {timestamp}
PR: #{pr_number}

Changes:
- {summary of changes}

Impact:
- Files changed: {count}
- Lines added: {count}
- Lines removed: {count}

Testing:
- Tests: {passed}/{total}
- Coverage: {percentage}%

Next Steps:
- Verify in staging
- Include in next release
- Update documentation

Deployment:
Will be included in release {version}
Expected deployment: {date}
```

### Knowledge Sharing

```markdown
# Feature Documentation: {feature}

## What Was Built
{Description of the feature}

## Technical Decisions
- {Decision 1}: {Rationale}
- {Decision 2}: {Rationale}

## How It Works
{Brief technical explanation}

## Testing
{How to test the feature}

## Known Limitations
{Any limitations or future improvements}

## Related Documentation
- [Design doc](link)
- [API docs](link)
- [User guide](link)
```

## Troubleshooting

### Common Issues

**Issue**: Tests failing after merge
```bash
# Solution: Run tests locally
npm test

# If passing locally but failing in CI:
- Check environment variables
- Check Node.js version
- Check dependencies
```

**Issue**: Merge conflicts
```bash
# Solution: Update from develop first
git checkout develop
git pull
git checkout feature/{feature}
git merge develop
# Resolve conflicts
git add .
git commit
```

**Issue**: Quality gates failing
```bash
# Solution: Fix issues one by one
npm run lint --fix        # Auto-fix linting
npm run type-check        # Fix type errors
npm test                  # Fix failing tests
npm run coverage          # Improve coverage
```

## Configuration

`.claude/settings.json`:
```json
{
  "commands": {
    "sc-finish-feature": {
      "requireQualityGates": true,
      "qualityGates": {
        "linting": true,
        "typeCheck": true,
        "tests": true,
        "coverage": 80,
        "build": true,
        "security": true
      },
      "mergeStrategy": "squash",
      "requirePR": true,
      "requireReview": true,
      "autoDeleteBranch": true,
      "notifyTeam": true,
      "updateChangelog": true
    }
  }
}
```

## Success Metrics

- Merge success rate: >99%
- Average merge time: <30 minutes
- Quality gate pass rate: >95%
- Post-merge bugs: <2%
- Code review satisfaction: >4.5/5
- Integration success: >98%
