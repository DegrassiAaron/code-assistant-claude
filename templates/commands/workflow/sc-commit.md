---
name: "sc-commit"
description: "Intelligent git commit with conventional commit messages"
category: "workflow"
version: "1.0.0"

triggers:
  exact: "/sc:commit"
  aliases: ["/commit", "/git-commit"]
  keywords: ["commit changes", "git commit", "save changes"]

requires:
  skills: []
  mcps: ["serena"]

parameters:
  - name: "message"
    type: "string"
    required: false
    description: "Custom commit message (auto-generated if not provided)"
  - name: "type"
    type: "string"
    required: false
    options: ["feat", "fix", "docs", "style", "refactor", "test", "chore"]
    description: "Conventional commit type"

autoExecute: false
tokenEstimate: 5000
executionTime: "5-15s"
---

# /sc:commit - Intelligent Git Commit

Analyzes changes and creates meaningful conventional commits.

## Execution Flow

### 1. Analyze Changes
- Run `git status` and `git diff`
- Identify modified, added, deleted files
- Analyze code changes semantically
- Determine commit type automatically

### 2. Generate Commit Message

**Conventional Commit Format**:
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code formatting (no logic change)
- **refactor**: Code restructuring
- **test**: Test additions/changes
- **chore**: Build process, dependencies

**Auto-Detection**:
- Added new files → `feat`
- Fixed bugs → `fix`
- Updated tests → `test`
- Modified docs → `docs`
- Renamed/formatted → `style`
- Restructured → `refactor`

### 3. Commit Creation

1. **Stage Changes**
   ```bash
   git add <relevant-files>
   ```

2. **Generate Message** (if not provided)
   - Analyze diff for context
   - Create concise subject (<50 chars)
   - Add detailed body (why, not what)
   - Include breaking changes if any

3. **Create Commit**
   ```bash
   git commit -m "type(scope): subject" -m "body"
   ```

4. **Verify Commit**
   ```bash
   git log -1 --stat
   ```

### 4. Quality Checks

Before committing:
- ✅ All tests passing (if applicable)
- ✅ No linting errors
- ✅ No sensitive data (env files, keys)
- ✅ Message follows conventions
- ✅ Logical commit scope

## Examples

### Auto-Generated Message
```bash
/sc:commit

# Analyzes changes and generates:
# "feat(user-service): add user profile update endpoint
#
# - Implemented PUT /api/users/:id endpoint
# - Added validation for user input
# - Updated user model with new fields
# - Added unit and integration tests
#
# Closes #123"
```

### Custom Message with Type
```bash
/sc:commit "add pagination to user list" --type=feat

# Creates:
# "feat(users): add pagination to user list"
```

### Quick Commit
```bash
/sc:commit "fix typo in documentation" --type=docs

# Creates:
# "docs: fix typo in documentation"
```

### Breaking Change
```bash
/sc:commit "redesign authentication API" --type=feat

# Detects breaking change and adds:
# "feat(auth): redesign authentication API
#
# BREAKING CHANGE: Authentication endpoints now require
# Bearer token instead of API key"
```

## Commit Message Templates

### Feature
```
feat(scope): add <feature>

- Implementation details
- Why this change was needed
- Impact on existing functionality

Closes #<issue-number>
```

### Bug Fix
```
fix(scope): resolve <issue>

- Root cause explanation
- Fix approach
- Test cases added

Fixes #<issue-number>
```

### Refactor
```
refactor(scope): improve <component>

- What was refactored
- Performance/maintainability gains
- No functional changes
```

## Integration

### With Skills
- code-analyzer: Change analysis
- commit-message-generator: Message creation

### With MCPs
- Serena: Code diff analysis
- Context7: Documentation updates

### Pre-Commit Hooks

Automatically runs:
1. Linting
2. Type checking
3. Unit tests
4. Format checking

If hooks fail:
- Show errors
- Allow manual override (--no-verify)
- Suggest fixes

## Configuration

`.claude/settings.json`:
```json
{
  "commands": {
    "sc-commit": {
      "autoGenerate": true,
      "runTests": true,
      "runLinter": true,
      "conventional": true,
      "signCommits": false,
      "includeEmoji": false
    }
  }
}
```

## Best Practices

1. **Atomic Commits**
   - One logical change per commit
   - Related changes together
   - Unrelated changes separate

2. **Clear Messages**
   - Imperative mood ("add" not "added")
   - Concise subject line
   - Detailed body when needed

3. **Proper Scope**
   - Meaningful scope names
   - Consistent across commits
   - Team conventions

4. **Reference Issues**
   - Link to issue tracker
   - Use "Closes #123" or "Fixes #456"
   - Add context from issue

## Success Metrics

- Message quality score: >9/10
- Convention compliance: 100%
- Average commit time: <15s
- User satisfaction: >4.5/5
