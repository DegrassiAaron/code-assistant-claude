# Commands Guide

Complete reference for slash commands in Code-Assistant-Claude.

## Command Syntax

All custom commands use the `/sc:` prefix:

```
/sc:<command-name> [arguments] [--flags]
```

## Available Commands

### Core Commands

#### /sc:implement
**Purpose**: Feature implementation with full workflow

**Syntax**:
```
/sc:implement "feature description" [--test] [--security]
```

**Example**:
```
You: /sc:implement "user profile page with edit capability" --test --security

Claude: [Implementing feature]
        ✅ Generated components
        ✅ Generated tests (--test flag)
        ✅ Security audit passed (--security flag)
        Token usage: 12,500
```

#### /sc:scaffold
**Purpose**: Quick code scaffolding

**Syntax**:
```
/sc:scaffold <type> <name>
```

**Types**:
- `react-component`
- `react-feature`
- `api-endpoint`
- `service`
- `model`

**Examples**:
```
/sc:scaffold react-component LoginForm
/sc:scaffold react-feature Dashboard
/sc:scaffold api-endpoint users
/sc:scaffold service emailService
```

#### /sc:review
**Purpose**: Code quality review

**Syntax**:
```
/sc:review <path> [--detailed] [--security]
```

**Examples**:
```
/sc:review src/components/UserProfile
/sc:review src/api/auth --security
/sc:review . --detailed
```

#### /sc:test
**Purpose**: Test generation

**Syntax**:
```
/sc:test <path> [--unit] [--integration] [--e2e]
```

**Examples**:
```
/sc:test src/services/authService
/sc:test src/components/LoginForm --e2e
/sc:test src/api --integration
```

#### /sc:security-audit
**Purpose**: Security vulnerability scan

**Syntax**:
```
/sc:security-audit [path] [--owasp] [--dependencies]
```

**Examples**:
```
/sc:security-audit
/sc:security-audit src/api/users
/sc:security-audit --dependencies
```

#### /sc:business-panel
**Purpose**: Strategic business analysis

**Syntax**:
```
/sc:business-panel <@document> --mode <discussion|debate|socratic>
```

**Examples**:
```
/sc:business-panel @strategy.pdf --mode discussion
/sc:business-panel @market_analysis.docx --mode debate
/sc:business-panel @business_plan.md --mode socratic
```

#### /sc:optimize-tokens
**Purpose**: Token budget analysis

**Syntax**:
```
/sc:optimize-tokens [--detailed]
```

**Example Output**:
```
📊 Token Budget Analysis
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Budget: 200,000 tokens
Current Usage: 15,234 tokens (7.6%)
Status: Excellent 🟢

Optimizations Active:
✅ MCP Code Execution: 98.7% reduction
✅ Progressive Skills: 95% reduction
✅ Symbol Compression: 40% reduction

Session Breakdown:
- System: 10,000 tokens
- Skills: 3,000 tokens
- Conversation: 2,234 tokens
```

### SuperClaude Commands

#### /sc:architect
**Purpose**: System architecture design

**Example**:
```
/sc:architect "design microservices architecture for e-commerce"
```

#### /sc:debug
**Purpose**: Systematic debugging

**Example**:
```
/sc:debug "intermittent 500 errors during peak hours"
```

#### /sc:performance
**Purpose**: Performance optimization

**Example**:
```
/sc:performance analyze src/components/DataTable
```

#### /sc:generate-docs
**Purpose**: Documentation generation

**Example**:
```
/sc:generate-docs src/api
```

### Utility Commands

#### /help
**Purpose**: Show help information

#### /skills
**Purpose**: List available skills

#### /agents
**Purpose**: List available agents

#### /config
**Purpose**: Show configuration

**Example**:
```
/config --show
/config --sources
/config --update skills
```

## Command Flags

### Global Flags

- `--verbose`: Detailed output
- `--quiet`: Minimal output
- `--dry-run`: Preview without executing
- `--force`: Skip confirmations

### Feature Flags

- `--test`: Generate tests
- `--security`: Run security checks
- `--docs`: Generate documentation
- `--coverage`: Check test coverage

## Command Composition

Chain multiple commands:

```
/sc:implement "authentication" --test --security && /sc:review src/auth && /sc:generate-docs src/auth
```

## Custom Commands

### Creating Custom Commands

1. Create command file:
```bash
touch .claude/commands/my-custom-command.md
```

2. Define command:
```markdown
---
name: my-custom-command
description: My custom workflow
category: custom
---

# Custom Command Implementation

[Command instructions...]
```

3. Use command:
```
/sc:my-custom-command
```

### Example Custom Commands

#### Deploy Command
`.claude/commands/deploy.md`:
```markdown
---
name: deploy
description: Build, test, and deploy application
---

# Deploy Command

1. Run build
2. Run all tests
3. Run security audit
4. Deploy to staging
5. Run smoke tests
6. Deploy to production
```

#### Feature Complete
`.claude/commands/feature-complete.md`:
```markdown
---
name: feature-complete
description: Complete feature checklist
---

# Feature Complete Workflow

1. Code review
2. Test coverage check (>90%)
3. Security audit
4. Documentation generation
5. Performance check
6. Create PR
```

## Advanced Usage

### Parameterized Commands

```
/sc:scaffold $TYPE $NAME --path $PATH
```

Variables:
- `$TYPE`: Component type
- `$NAME`: Component name
- `$PATH`: Target path

### Conditional Execution

```
/sc:test src/components && /sc:review src/components || echo "Tests failed"
```

### Command Templates

Create reusable templates:

```bash
# .claude/commands/templates/feature-template.md
/sc:scaffold react-feature {{NAME}}
/sc:test src/features/{{NAME}} --unit --integration
/sc:review src/features/{{NAME}}
/sc:generate-docs src/features/{{NAME}}
```

Usage:
```
/sc:feature-template NAME=UserManagement
```

## Best Practices

### 1. Use Specific Commands
- ✅ Good: `/sc:review src/components/UserProfile`
- ❌ Vague: `/sc:review` (reviews entire codebase)

### 2. Leverage Flags
- ✅ Good: `/sc:implement "auth" --test --security`
- ❌ Less efficient: Multiple separate commands

### 3. Chain Related Operations
- ✅ Good: `/sc:scaffold LoginForm && /sc:test`
- ❌ Less efficient: Two separate requests

### 4. Create Custom Workflows
For repeated tasks, create custom commands

### 5. Check Token Usage
Periodically run `/sc:optimize-tokens`

## Command Shortcuts

Common command aliases:

```
/impl → /sc:implement
/rev → /sc:review
/test → /sc:test
/sec → /sc:security-audit
/doc → /sc:generate-docs
```

Configure in `.claude/settings.json`:
```json
{
  "commands": {
    "aliases": {
      "impl": "implement",
      "rev": "review",
      "test": "test",
      "sec": "security-audit",
      "doc": "generate-docs"
    }
  }
}
```

## Troubleshooting

### Command Not Found

**Check**:
```bash
ls .claude/commands/*.md
```

**Fix**:
```bash
code-assistant-claude init --update
```

### Command Failed

**Enable verbose mode**:
```
/sc:review --verbose
```

### Unexpected Output

**Run in dry-run mode**:
```
/sc:implement "feature" --dry-run
```

## Next Steps

- 🔌 [MCP Integration Guide](06-mcp-integration.md)
- 🤖 [Agents Guide](07-agents-guide.md)
- 💾 [Token Optimization](08-token-optimization.md)
- 📚 [Creating Custom Commands](../guides/creating-commands.md)

---

**Need Help?** See [Troubleshooting Guide](10-troubleshooting.md)
