# Creating Custom Commands

Complete guide to building custom slash commands for Code-Assistant-Claude.

## What Are Commands?

Slash commands are workflow automation shortcuts that trigger predefined sequences of operations. They use the `/sc:` prefix and can combine multiple skills, MCPs, and agents.

## Command Anatomy

### Basic Structure

```
.claude/commands/
├── my-command.md              # Command definition
├── my-command-config.json     # Configuration (optional)
└── templates/                 # Command templates (optional)
    └── workflow-template.md
```

### Command Definition Format

```markdown
---
name: "my-command"
description: "Brief description of what this command does"
category: "development|deployment|analysis|utility"
version: "1.0.0"

parameters:
  - name: arg1
    type: string
    required: true
    description: "First argument description"
  - name: arg2
    type: string
    required: false
    default: "default-value"

flags:
  - name: --detailed
    type: boolean
    description: "Provide detailed output"
  - name: --format
    type: string
    options: [json, yaml, text]
    default: text

skills:
  - skill-name-1
  - skill-name-2

mcps:
  - mcp-server-1

agents:
  - agent-name

token_estimate: 8000
---

# Command Implementation

## Overview
[What this command does and when to use it]

## Workflow Steps

### Step 1: [Step Name]
[What happens in this step]

**Skills Activated**: skill-name
**MCPs Used**: mcp-name
**Expected Output**: [Description]

### Step 2: [Step Name]
[What happens in this step]

## Usage

\`\`\`bash
/sc:my-command <arg1> [arg2] [--detailed] [--format=json]
\`\`\`

## Examples

### Example 1: Basic Usage
\`\`\`
/sc:my-command value1
\`\`\`

### Example 2: With Flags
\`\`\`
/sc:my-command value1 value2 --detailed --format=json
\`\`\`

## Error Handling

[How errors are handled]

## Output Format

[Description of command output]
```

## Creating Your First Command

### Step 1: Define the Workflow

Example: Create a command for comprehensive feature implementation.

**Workflow**:
```yaml
Command: /sc:feature-complete <feature-name>

Steps:
  1. Scaffold feature structure
  2. Implement core functionality
  3. Generate tests (unit + integration)
  4. Run security audit
  5. Generate documentation
  6. Create PR

Skills: code-reviewer, test-generator, security-auditor, docs-writer
MCPs: magic, sequential
Agents: architect (for complex features)
```

### Step 2: Create Command File

```bash
cat > .claude/commands/feature-complete.md << 'EOF'
---
name: "feature-complete"
description: "Complete feature implementation workflow with tests, security, and docs"
category: "development"
version: "1.0.0"

parameters:
  - name: feature_name
    type: string
    required: true
    description: "Name of the feature to implement"
  - name: feature_type
    type: string
    required: false
    default: "standard"
    options: [standard, api, ui, full-stack]

flags:
  - name: --skip-tests
    type: boolean
    description: "Skip test generation"
  - name: --skip-security
    type: boolean
    description: "Skip security audit"
  - name: --create-pr
    type: boolean
    description: "Automatically create PR when complete"

skills:
  - code-reviewer
  - test-generator
  - security-auditor
  - docs-writer

mcps:
  - magic
  - sequential

agents:
  - architect

token_estimate: 18000
---

# Feature Complete Workflow

Comprehensive feature implementation from scaffolding to PR.

## Overview

This command automates the entire feature development lifecycle:
- Scaffolds feature structure
- Implements functionality
- Generates comprehensive tests
- Runs security audit
- Creates documentation
- Optionally creates PR

## Workflow Steps

### Step 1: Architecture Planning
**Agent**: architect
**Purpose**: Design feature architecture

Analyzes requirements and creates:
- Component structure
- Data flow diagrams
- API contracts
- Integration points

**Output**: Architecture document

### Step 2: Scaffolding
**MCP**: magic
**Purpose**: Generate initial file structure

Creates:
- Component files
- Service layer
- Type definitions
- Test file stubs

**Output**: Feature directory structure

### Step 3: Implementation
**MCP**: magic + sequential
**Purpose**: Implement core functionality

Generates:
- Business logic
- UI components (if feature_type includes UI)
- API endpoints (if feature_type includes API)
- Database migrations

**Output**: Implemented feature code

### Step 4: Test Generation
**Skill**: test-generator
**Purpose**: Create comprehensive test suite

Generates:
- Unit tests (coverage >90%)
- Integration tests
- E2E tests (for UI features)
- Mock data

**Skipped if**: --skip-tests flag set

**Output**: Complete test suite

### Step 5: Security Audit
**Skill**: security-auditor
**Purpose**: Validate security

Checks:
- Input validation
- Authentication/authorization
- SQL injection prevention
- XSS vulnerabilities
- OWASP Top 10

**Skipped if**: --skip-security flag set

**Output**: Security audit report

### Step 6: Code Review
**Skill**: code-reviewer
**Purpose**: Quality validation

Reviews:
- Code quality
- Best practices
- Design patterns
- Performance considerations

**Output**: Code review report with recommendations

### Step 7: Documentation
**Skill**: docs-writer
**Purpose**: Generate documentation

Creates:
- Feature documentation
- API documentation (if applicable)
- Usage examples
- Migration guide

**Output**: Documentation files

### Step 8: PR Creation (Optional)
**MCP**: sequential
**Purpose**: Create pull request

If --create-pr flag set:
- Commits changes
- Creates PR with generated description
- Links to architecture doc
- Includes test coverage report

**Output**: PR URL

## Usage

\`\`\`bash
# Basic usage
/sc:feature-complete user-authentication

# Specify feature type
/sc:feature-complete user-dashboard --type=full-stack

# Skip certain steps
/sc:feature-complete payment-processing --skip-tests

# Auto-create PR
/sc:feature-complete notification-system --create-pr
\`\`\`

## Examples

### Example 1: Standard Feature
\`\`\`
You: /sc:feature-complete user-profile

Claude: [Executing feature-complete workflow]

        Step 1/8: Architecture Planning
        ✅ Feature architecture designed
        ✅ Components: UserProfile, EditProfile, ProfileSettings
        ✅ Services: userService, profileService

        Step 2/8: Scaffolding
        ✅ Created: src/features/user-profile/
        ✅ Files: 12 files generated

        Step 3/8: Implementation
        ✅ UserProfile component implemented
        ✅ Profile edit functionality complete
        ✅ Settings panel integrated

        Step 4/8: Test Generation
        ✅ Unit tests: 24 tests (96% coverage)
        ✅ Integration tests: 8 tests
        ✅ E2E tests: 3 scenarios

        Step 5/8: Security Audit
        ✅ Security scan passed
        ⚠️  1 medium issue found: Add rate limiting to profile updates
        ✅ Fix applied automatically

        Step 6/8: Code Review
        ✅ Quality score: 9.2/10
        ✅ Best practices: All followed
        ℹ️  2 minor suggestions (see report)

        Step 7/8: Documentation
        ✅ Feature docs: user-profile.md
        ✅ API docs: Updated
        ✅ Examples: 3 usage examples

        Step 8/8: Skipped (--create-pr not specified)

        ✅ Feature Complete!

        Summary:
        - Files created: 12
        - Tests generated: 35
        - Coverage: 96%
        - Security: Passed
        - Quality: 9.2/10

        Token usage: 16,800 (vs 120,000 traditional)
        Time: 2.5 minutes
\`\`\`

### Example 2: API Feature with PR
\`\`\`
You: /sc:feature-complete payment-webhook --type=api --create-pr

Claude: [Executing workflow with API focus and PR creation]

        [Steps 1-7 execute as above, optimized for API]

        Step 8/8: Creating Pull Request
        ✅ Changes committed
        ✅ PR created: #123
        ✅ URL: https://github.com/org/repo/pull/123

        PR Description:
        # Feature: Payment Webhook Handler

        ## Architecture
        - RESTful webhook endpoint
        - Event validation and processing
        - Idempotency handling

        ## Implementation
        - Route: POST /api/webhooks/payment
        - Validation: HMAC signature verification
        - Processing: Async event handler

        ## Tests
        - Coverage: 94%
        - Scenarios: Success, Invalid signature, Duplicate events

        ## Security
        ✅ All checks passed
        ✅ Rate limiting: 100 req/min per IP
        ✅ Input validation: Strict schema
\`\`\`

## Error Handling

### Workflow Failure

If any step fails:
```
⚠️  Step 4/8 Failed: Test Generation

Error: Test file compilation error
File: user-profile.test.tsx
Issue: Cannot find module '@testing-library/react'

Resolution Options:
1. Install missing dependency
2. Skip test generation (--skip-tests)
3. Retry after fixing manually

Retry: /sc:feature-complete user-profile --from-step=4
```

### Partial Success

Steps complete independently:
```
✅ Steps 1-3: Complete
✅ Step 4: Complete (with warnings)
❌ Step 5: Failed (security audit)
⏸️  Steps 6-8: Paused

Fix issues and resume:
/sc:feature-complete user-profile --resume
```

## Output Format

### Summary
```
Feature Complete Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Feature: user-authentication
Type: full-stack
Duration: 3m 24s

Results:
✅ Architecture: Complete
✅ Scaffolding: 18 files
✅ Implementation: 2,450 lines
✅ Tests: 42 tests, 94% coverage
✅ Security: Passed (1 fix applied)
✅ Review: 9.4/10
✅ Docs: Complete

Quality Metrics:
- Code Quality: Excellent
- Test Coverage: 94%
- Security Score: 100%
- Performance: Optimized

Token Usage: 17,200 (vs 135,000)
Savings: 87%
```

## Advanced Configuration

### Custom Workflow Steps

```json
{
  "workflow": {
    "steps": [
      {
        "name": "architecture",
        "agent": "architect",
        "optional": false
      },
      {
        "name": "custom-step",
        "skill": "my-custom-skill",
        "optional": true
      }
    ]
  }
}
```

### Conditional Execution

```json
{
  "conditions": {
    "skip_security": {
      "when": ["feature_type", "==", "ui-only"]
    },
    "use_architect": {
      "when": ["complexity", ">", "moderate"]
    }
  }
}
```

## Best Practices

### 1. Keep Commands Focused
- ✅ Good: feature-complete (specific workflow)
- ❌ Bad: do-everything (too broad)

### 2. Provide Clear Parameters
```markdown
parameters:
  - name: feature_name
    type: string
    required: true
    description: "Feature name in kebab-case (e.g., user-authentication)"
    pattern: "^[a-z][a-z0-9-]*$"
```

### 3. Handle Failures Gracefully
- Allow resume from failed step
- Provide clear error messages
- Suggest resolution options

### 4. Estimate Token Usage
Help users understand cost:
```markdown
token_estimate: 18000
breakdown:
  architecture: 3000
  implementation: 8000
  tests: 4000
  security: 2000
  docs: 1000
```

### 5. Document Examples
Show common use cases with expected output.

## Testing Commands

```bash
# Dry run
code-assistant-claude test-command feature-complete \
  --args "user-profile" \
  --dry-run

# Measure token usage
code-assistant-claude test-command feature-complete \
  --args "test-feature" \
  --measure-tokens

# Validate workflow
code-assistant-claude validate-command feature-complete
```

## Command Categories

### Development
- feature-complete
- implement
- scaffold
- refactor

### Testing
- test-suite
- test-coverage
- e2e-test

### Deployment
- deploy
- rollback
- smoke-test

### Analysis
- code-audit
- performance-profile
- security-scan

### Documentation
- generate-docs
- update-readme
- api-docs

## Next Steps

- [Creating Agents](creating-agents.md) - Build specialized agents
- [MCP Integration](mcp-integration.md) - Deep MCP integration
- [Commands Guide](../user-guides/05-commands-guide.md) - Using commands

---

**Questions?** See [Troubleshooting Guide](../user-guides/10-troubleshooting.md)
