---
name: "sc-feature"
description: "Start new feature branch following GitFlow"
category: "git"
version: "1.0.0"

triggers:
  exact: "/sc:feature"
  aliases: ["/feature", "/start-feature"]
  keywords: ["start feature", "new feature", "gitflow"]

requires:
  mcps: []

parameters:
  - name: "name"
    type: "string"
    required: true
    description: "Feature name (kebab-case recommended)"
  - name: "from"
    type: "string"
    required: false
    default: "develop"
    description: "Base branch"

autoExecute: false
tokenEstimate: 3000
executionTime: "5-10s"
---

# /sc:feature - Start Feature (GitFlow)

Creates a new feature branch following GitFlow methodology.

## GitFlow Workflow

```
Main Branches:
- main/master: Production code
- develop: Integration branch

Supporting Branches:
- feature/*: New features
- release/*: Release preparation
- hotfix/*: Emergency fixes
```

## Execution Flow

### 1. Pre-Flight Checks

```markdown
✅ Pre-Flight Checks

Repository Status:
- [ ] Working directory clean
- [ ] On develop branch
- [ ] Develop up to date with origin
- [ ] No uncommitted changes
- [ ] No untracked files (that matter)

Branch Validation:
- [ ] Feature name valid (lowercase, kebab-case)
- [ ] Feature branch doesn't exist
- [ ] Base branch exists
```

### 2. Branch Creation

```bash
# Update base branch
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/{name}

# Push to remote with tracking
git push -u origin feature/{name}
```

### 3. Branch Setup

```markdown
📋 Feature Branch Setup

Branch: feature/{name}
Base: develop
Created: {timestamp}

Next Steps:
1. ✅ Branch created and pushed
2. ⏳ Implement feature
3. ⏳ Write tests
4. ⏳ Create pull request
5. ⏳ Code review
6. ⏳ Merge to develop
```

### 4. Configuration Files

Create/update feature-specific configs:

**`.github/PULL_REQUEST_TEMPLATE.md`** (if needed):
```markdown
## Feature: {name}

### Description
[Brief description of the feature]

### Changes
- [ ] Item 1
- [ ] Item 2

### Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

### Checklist
- [ ] Code follows project style
- [ ] Tests passing
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

## Usage Examples

### Basic Feature
```bash
/sc:feature "user-authentication"

# Creates:
# - feature/user-authentication branch from develop
# - Sets up tracking with origin
# - Ready for implementation
```

### Feature from Custom Base
```bash
/sc:feature "oauth-integration" --from=feature/user-authentication

# Creates:
# - feature/oauth-integration from feature/user-authentication
# - Useful for dependent features
```

### Feature with Issue Reference
```bash
/sc:feature "add-dark-mode-#123"

# Creates:
# - feature/add-dark-mode-#123
# - Links to issue #123
```

## Branch Naming Conventions

### Recommended Formats

**By Type**:
```
feature/user-authentication
feature/payment-integration
feature/dashboard-redesign
```

**With Issue Number**:
```
feature/123-user-authentication
feature/456-payment-integration
```

**With Category**:
```
feature/auth-user-authentication
feature/ui-dashboard-redesign
feature/api-payment-integration
```

### Naming Guidelines

**Do's** ✅:
- Use kebab-case
- Be descriptive but concise
- Include issue number if available
- Use present tense
- Focus on what, not how

**Don'ts** ❌:
- Don't use spaces
- Don't use special characters (except - and #)
- Don't use camelCase or snake_case
- Don't be vague ("feature/updates")
- Don't make it too long (>50 chars)

## GitFlow Feature Lifecycle

```
1. Start Feature
   git checkout -b feature/new-feature develop

2. Work on Feature
   [Make changes]
   git add .
   git commit -m "feat: implement X"
   git push

3. Keep Updated
   git checkout develop
   git pull
   git checkout feature/new-feature
   git merge develop

4. Finish Feature
   [Create PR from feature/new-feature to develop]
   [Code review]
   [Merge PR]
   [Delete feature branch]
```

## Integration with Development

### Local Development Setup

```bash
# After creating feature branch

# Install dependencies (if needed)
npm install

# Create feature flag (optional)
echo "FEATURE_{NAME}_ENABLED=true" >> .env.local

# Start development server
npm run dev
```

### Testing Strategy

```markdown
📝 Testing Checklist

Before pushing:
- [ ] Unit tests written
- [ ] Unit tests passing
- [ ] Integration tests written (if needed)
- [ ] Integration tests passing
- [ ] Manual testing completed
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Linting passing

Before PR:
- [ ] All tests passing
- [ ] Code coverage >80%
- [ ] E2E tests added (if needed)
- [ ] Performance tested
- [ ] Accessibility tested
- [ ] Browser compatibility tested
```

## Collaboration

### Team Notifications

```markdown
📢 New Feature Branch Created

Feature: {name}
Branch: feature/{name}
Developer: {username}
Issue: #{issue_number}
Started: {timestamp}

Description:
[Brief description of what this feature will do]

Timeline:
- Implementation: [estimated time]
- Testing: [estimated time]
- Review: [estimated time]
- Expected merge: [date]
```

### Branch Protection

```json
{
  "branch_protection": {
    "feature/*": {
      "required_reviews": 1,
      "require_code_owner_reviews": false,
      "dismiss_stale_reviews": true,
      "require_status_checks": true,
      "required_status_checks": [
        "test",
        "lint",
        "build"
      ]
    }
  }
}
```

## Advanced Usage

### Interactive Feature Creation

```bash
/sc:feature "interactive"

# Prompts for:
# - Feature name
# - Description
# - Base branch
# - Issue number
# - Estimated timeline
# - Assigned developers
```

### Feature with Scaffolding

```bash
/sc:feature "user-profile" --scaffold

# Creates feature branch AND:
# - Generates component structure
# - Creates test files
# - Updates documentation
# - Creates PR template
```

### Feature from Template

```bash
/sc:feature "payment" --template backend-api

# Creates feature with:
# - Pre-configured API structure
# - Test templates
# - Documentation templates
```

## Troubleshooting

### Common Issues

**Issue**: Working directory not clean
```bash
# Solution 1: Commit changes
git add .
git commit -m "wip: save work"

# Solution 2: Stash changes
git stash
/sc:feature "new-feature"
git stash pop
```

**Issue**: Feature branch already exists
```bash
# Solution: Use different name or delete old branch
git branch -d feature/existing-name
# or
/sc:feature "existing-name-v2"
```

**Issue**: Base branch not up to date
```bash
# Solution: Update base branch first
git checkout develop
git pull origin develop
/sc:feature "new-feature"
```

## Integration

### With Other Commands

```bash
# Complete workflow
/sc:feature "user-auth"              # Create feature branch
/sc:implement "JWT authentication"   # Implement feature
/sc:test "src/auth/**"              # Generate tests
/sc:review                          # Code review
/sc:commit                          # Commit changes
/sc:finish-feature "user-auth"      # Merge and cleanup
```

### With CI/CD

```yaml
# .github/workflows/feature.yml
name: Feature Branch CI

on:
  push:
    branches:
      - 'feature/**'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm test
      - name: Run linting
        run: npm run lint
```

## Configuration

`.claude/settings.json`:
```json
{
  "commands": {
    "sc-feature": {
      "baseBranch": "develop",
      "branchPrefix": "feature/",
      "namingConvention": "kebab-case",
      "pushOnCreate": true,
      "notifyTeam": true,
      "createPRTemplate": true,
      "scaffold": false
    }
  }
}
```

## Success Metrics

- Branch creation success rate: >99%
- Average setup time: <10s
- Naming convention compliance: >95%
- Integration with team workflow: Seamless
- User satisfaction: >4.7/5
