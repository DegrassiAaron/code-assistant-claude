# Token Optimization Guide

Master guide to achieving 90% token reduction with Code-Assistant-Claude.

## Three Pillars of Token Optimization

Code-Assistant-Claude achieves 90% overall token reduction through three core technologies:

### 1. MCP Code Execution (98.7% reduction)
### 2. Progressive Skills (95% reduction)
### 3. Symbol Compression (30-50% reduction)

## MCP Code Execution

### How It Works

Traditional approach:
```
You: Create a login component

Claude (in context):
[Generates 1,500 tokens of component code]
[Generates 800 tokens of tests]
[Generates 400 tokens of styles]
Total: 2,700 tokens consumed from context
```

MCP approach:
```
You: Create a login component

Claude:
"Creating login component via magic MCP..."
[MCP generates code externally - 0 tokens from context]
"✅ Component created"
Total: 120 tokens consumed from context

Savings: 95.6% ✅
```

### Maximizing MCP Efficiency

**Do**:
- ✅ Request code generation directly: "Create a user profile component"
- ✅ Batch related files: "Create login component with tests and stories"
- ✅ Let MCP handle implementation: "Implement authentication feature"

**Don't**:
- ❌ Ask to see code first: "Show me the login component code"
- ❌ Generate code in multiple steps: Three separate requests
- ❌ Request detailed explanations: "Explain every line of code"

### MCP Token Savings Examples

| Task | Traditional | With MCP | Savings |
|------|------------|----------|---------|
| React Component | 2,700 | 120 | 95.6% |
| API Endpoint | 1,800 | 90 | 95.0% |
| Test Suite | 3,200 | 150 | 95.3% |
| Full Feature | 12,000 | 450 | 96.3% |

## Progressive Skills

### How It Works

Traditional approach:
```
All skills always loaded in context:
- code-reviewer: 18,000 tokens
- frontend-design: 22,000 tokens
- test-generator: 19,000 tokens
- security-auditor: 21,000 tokens
- business-panel: 15,000 tokens
Total: 95,000 tokens always consumed
```

Progressive approach:
```
Skills load only when needed:
- Task detected: "Create a login form"
- frontend-design activated: 4,200 tokens
- Other skills remain unloaded: 0 tokens
Total: 4,200 tokens consumed

Savings: 95.6% ✅
```

### Progressive Loading Stages

**Stage 1: Detection** (0 tokens)
```
System analyzes task
Determines: UI component needed
Candidate skill: frontend-design
No content loaded yet
```

**Stage 2: Core Activation** (200 tokens)
```
Skill metadata loaded
Core capabilities available
Ready for basic operations
```

**Stage 3: Detail Loading** (as needed)
```
Examples loaded: +1,000 tokens
Advanced patterns: +1,500 tokens
Full documentation: +1,500 tokens
Total: 4,200 tokens (only if all needed)
```

**Stage 4: Cleanup** (automatic)
```
Task complete
Skill unloaded
Tokens freed for next task
```

### Maximizing Progressive Efficiency

**Do**:
- ✅ Trust auto-activation: "Create a dashboard page"
- ✅ Single focused requests: "Review authentication code"
- ✅ Let system choose skills: Don't manually specify

**Don't**:
- ❌ Load all skills upfront: "Load all skills"
- ❌ Request unnecessary details: "Tell me everything about testing"
- ❌ Keep skills loaded: Skills auto-unload when done

## Symbol Compression

### How It Works

Symbol compression replaces common words/phrases with symbols:

**Before Compression**:
```
The authentication service validates user credentials and
returns a JSON Web Token if successful, otherwise returns
an error message. This leads to improved security because
the password is hashed using bcrypt.
(32 tokens)
```

**After Compression**:
```
Auth svc validates creds → JWT if ✅, else error.
This → improved security ∵ password hashed w/ bcrypt.
(16 tokens)

Savings: 50% ✅
```

### Symbol System

**Logic & Flow**:
- `→` leads to
- `⇒` transforms into
- `∴` therefore
- `∵` because

**Status**:
- `✅` completed/successful
- `❌` failed/error
- `⚠️` warning
- `🔄` in progress

**Technical**:
- `⚡` performance
- `🛡️` security
- `🔍` analysis
- `🔧` configuration

**Business**:
- `🎯` objective
- `📈` growth
- `💰` financial
- `🏆` competitive advantage

### Compression Levels

**Level 0 (Verbose)** - 0% compression:
```
The authentication service should validate the user's
credentials and return a JSON Web Token if the validation
is successful. Otherwise, it should return an appropriate
error message to the user.
(35 tokens)
```

**Level 50 (Balanced)** - 30% compression:
```
Auth service validates user credentials → returns JWT
if successful, else error message.
(14 tokens, 60% savings)
```

**Level 90 (Compressed)** - 50% compression:
```
Auth svc: creds validation → JWT if ✅, else err msg
(11 tokens, 69% savings)
```

### Maximizing Compression Efficiency

Configure compression level in `.claude/settings.json`:
```json
{
  "tokenOptimization": {
    "symbolCompression": true,
    "compressionLevel": 90
  }
}
```

**Best Practices**:
- ✅ Use compressed mode (90) for production
- ✅ Use balanced mode (50) while learning
- ✅ Use verbose mode (0) only for debugging

## Combined Optimization

### Real-World Example

**Task**: "Implement complete e-commerce product page"

**Traditional Approach** (No Optimization):
```
1. Load all skills: 95,000 tokens
2. Generate component code in context: 3,500 tokens
3. Generate styles in context: 1,200 tokens
4. Generate tests in context: 2,800 tokens
5. Generate API integration: 2,200 tokens
6. Verbose explanations: 8,000 tokens
Total: 112,700 tokens
```

**Optimized Approach**:
```
1. Progressive skill loading:
   - frontend-design activated: 4,200 tokens
   - Other skills not loaded: 0 tokens

2. MCP code generation:
   - Component via MCP: 150 tokens
   - Styles via MCP: 80 tokens
   - Tests via MCP: 120 tokens
   - API via MCP: 90 tokens

3. Symbol compression:
   - Compressed coordination: 400 tokens (vs 8,000)

Total: 5,040 tokens

Savings: 95.5% ✅
```

## Token Budget Management

### Understanding the Budget

Total budget: 200,000 tokens

**Allocation**:
```
Reserved (5%):     10,000 tokens  🔒 Emergency buffer
System (5%):       10,000 tokens  🔧 System prompts
Dynamic (15%):     30,000 tokens  🔄 Skills + MCPs
  ├─ MCPs:         15,000 tokens
  └─ Skills:       15,000 tokens
Working (75%):    150,000 tokens  💬 Conversation
```

### Monitoring Usage

```
You: /sc:optimize-tokens

Claude: 📊 Token Budget Status
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        Total Budget: 200,000 tokens
        Current Usage: 15,234 tokens (7.6%)
        Remaining: 184,766 tokens
        Status: Excellent 🟢

        Session Breakdown:
        - System overhead: 2,100 tokens
        - Active skills: 4,200 tokens
        - MCP coordination: 890 tokens
        - Conversation: 8,044 tokens

        Optimizations Active:
        ✅ MCP Code Execution: 98.7%
        ✅ Progressive Skills: 95%
        ✅ Symbol Compression: 40%

        Efficiency Score: 95.2% ✅

        Recommendation: Excellent efficiency.
        You can handle ~40 more similar tasks
        before approaching budget limits.
```

### Budget Optimization Strategies

**Strategy 1: Batch Operations**
```
❌ Inefficient:
   "Create login component"
   "Now create register component"
   "Now create password reset component"
   (3 separate skill activations)

✅ Efficient:
   "Create login, register, and password reset components"
   (1 skill activation, batch MCP execution)
```

**Strategy 2: Precise Requests**
```
❌ Vague (wastes tokens on clarification):
   "Help with authentication"

✅ Specific (direct execution):
   "Implement JWT authentication with refresh tokens"
```

**Strategy 3: Use Commands**
```
❌ Natural language (more tokens):
   "I would like you to review my code for security issues"

✅ Slash command (optimized):
   "/sc:security-audit"
```

## Optimization Metrics

### Measuring Your Savings

**Traditional Session** (without optimization):
```
Average session: ~180,000 tokens
- Skills always loaded: 95,000 tokens
- Code in context: 45,000 tokens
- Verbose explanations: 40,000 tokens
```

**Optimized Session**:
```
Average session: ~18,000 tokens
- Progressive skills: 4,500 tokens
- MCP coordination: 800 tokens
- Compressed communication: 12,700 tokens

Savings: 90% ✅
```

### Per-Task Metrics

Track optimization per task:

```
You: /sc:optimize-tokens --by-task

Claude: 📊 Task-Level Token Analysis
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        Task 1: Create LoginForm component
        - Traditional estimate: 52,000 tokens
        - Actual usage: 5,200 tokens
        - Savings: 90%
        - Breakdown:
          • MCP code gen: 120 tokens
          • Skill activation: 4,200 tokens
          • Coordination: 880 tokens

        Task 2: Security audit
        - Traditional estimate: 38,000 tokens
        - Actual usage: 6,800 tokens
        - Savings: 82%
        - Breakdown:
          • Skill activation: 5,400 tokens
          • Analysis: 1,200 tokens
          • Reporting: 200 tokens (compressed)

        Session Total:
        - Estimated traditional: 90,000 tokens
        - Actual usage: 12,000 tokens
        - Overall savings: 87% ✅
```

## Advanced Optimization

### Custom Token Budget

Adjust budget allocation for specific workflows:

```json
{
  "tokenOptimization": {
    "budget": {
      "total": 200000,
      "allocation": {
        "reserved": 0.05,
        "system": 0.05,
        "dynamic": 0.15,
        "working": 0.75
      }
    }
  }
}
```

### Workflow-Specific Optimization

**Heavy MCP Usage** (code generation):
```json
{
  "tokenOptimization": {
    "prioritize": "mcp",
    "skillBudget": 5000,
    "mcpBudget": 20000
  }
}
```

**Analysis-Heavy** (reviews, audits):
```json
{
  "tokenOptimization": {
    "prioritize": "skills",
    "skillBudget": 15000,
    "mcpBudget": 5000
  }
}
```

### Cache Optimization

Enable caching for repeated operations:

```json
{
  "performance": {
    "caching": {
      "enabled": true,
      "skillResponses": true,
      "mcpResults": true,
      "ttl": 3600
    }
  }
}
```

**Example**:
```
First request: "Review authentication code"
- Skill loaded: 4,200 tokens
- Analysis: 2,100 tokens
- Total: 6,300 tokens

Second similar request: "Review payment code"
- Skill cached: 0 tokens (reused)
- Analysis: 2,100 tokens
- Total: 2,100 tokens

Savings: 67% on second request ✅
```

## Best Practices

### 1. Enable All Optimizations
```json
{
  "tokenOptimization": {
    "mcpCodeExecution": true,
    "progressiveSkills": true,
    "symbolCompression": true,
    "compressionLevel": 90
  }
}
```

### 2. Use Compressed Mode
Set verbosity to compressed:
```json
{
  "verbosityMode": "compressed"
}
```

### 3. Leverage Commands
Use `/sc:` commands instead of natural language for common tasks

### 4. Batch Related Operations
Group similar tasks in single request

### 5. Monitor Regularly
Check token usage periodically:
```
/sc:optimize-tokens
```

### 6. Trust Automation
Let system optimize automatically:
- Auto-activate skills
- Auto-compress output
- Auto-batch MCP operations

## Troubleshooting

### High Token Usage

**Symptom**: Token usage >50,000 per session

**Diagnosis**:
```
/sc:optimize-tokens --detailed
```

**Common Causes**:
1. Verbose mode enabled
2. Progressive skills disabled
3. MCP not used for code generation
4. Skills manually loaded

**Solution**:
```json
{
  "verbosityMode": "compressed",
  "tokenOptimization": {
    "mcpCodeExecution": true,
    "progressiveSkills": true,
    "symbolCompression": true,
    "compressionLevel": 90
  }
}
```

### Skills Not Unloading

**Symptom**: Multiple skills remain loaded

**Solution**: Skills auto-unload after task completion. If not:
```
/skills --unload-all
```

### MCP Not Activating

**Symptom**: Code generated in context instead of via MCP

**Check**:
```bash
cat .claude/.mcp.json
```

**Verify MCP servers are configured and enabled**

## Next Steps

- 🛡️ [Security Best Practices](09-security-best-practices.md)
- 📚 [Advanced Optimization Guide](../guides/advanced-optimization.md)
- 🔍 [Troubleshooting](10-troubleshooting.md)

---

**Need Help?** See [Troubleshooting Guide](10-troubleshooting.md)
