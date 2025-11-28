# Debug Mode Guide

**See exactly what Code-Assistant-Claude is doing in real-time**

---

## Quick Start

```bash
# Enable debug mode with environment variable
DEBUG=true code-assistant-claude mcp-execute "your intent here"

# Or export for entire session
export DEBUG=true
code-assistant-claude mcp-execute "task 1"
code-assistant-claude mcp-execute "task 2"
```

---

## What Debug Mode Shows

### 1. **Skill Activation** (Coming in v1.1)
```
┌─ SKILL ACTIVATED
│
├─ code-reviewer
├─ Reason: File save event detected
├─ Tokens: 2,000 (~7.8 KB)
├─ Session Total: 2,000 tokens
└─ ██████░░░░░░░░░░░░░░░░░░░░░░░░░░ 1.0%
```

### 2. **MCP Tool Execution**
```
┌─ MCP EXECUTION
│
├─ serena::find_symbol
├─ Phase: Discovery
└─ [+2.3s]

└─ MCP COMPLETED
  ├─ serena::find_symbol
  ├─ Duration: 145ms
  ├─ Tokens Saved: 147,500 tokens (98.3%)
  ├─ Session Total: 2,500 tokens
  └─ ██████░░░░░░░░░░░░░░░░░░░░░░░░░░ 1.3%
```

### 3. **Code Generation**
```
┌─ CODE GENERATED
│
├─ typescript wrapper
├─ Tokens: 364
├─ Traditional: 150,000
├─ Savings: 99.8% 🎉
└─ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 0.2%
```

### 4. **Security Validation**
```
┌─ SECURITY VALIDATION
│
├─ Risk Level: low
├─ Risk Score: 15/100
├─ Issues Found: 0
└─ ████░░░░░░░░░░░░░░░░░░░░░░░░░░ 15/100
```

### 5. **Sandbox Execution**
```
┌─ SANDBOX EXECUTION
│
├─ ⚡ PROCESS
├─ Language: typescript
└─ [+2.5s]

└─ SANDBOX RESULT
  ├─ ✅ SUCCESS
  ├─ Duration: 156ms
  └─ Memory: 42M
```

### 6. **Agent Selection** (Coming in v1.1)
```
┌─ AGENTS SELECTED
│
├─ Reason: Complex debugging task detected
├─ Count: 3
├─ code-reviewer (score: 28)
├─ debugger (score: 24)
└─ test-engineer (score: 18)
```

### 7. **Token Budget**
```
┌─ TOKEN BUDGET
├─ Skills Dynamic Allocation
├─ 🟢 5,200 / 30,000 (17.3%)
└─ █████░░░░░░░░░░░░░░░░░░░░░░░░░ 17.3%
```

### 8. **Phase Transitions**
```
════════════════════════════════════════════════════════════
PHASE 1: TOOL DISCOVERY
Finding relevant MCP tools for your intent
════════════════════════════════════════════════════════════
```

### 9. **Session Summary**
```
╔════════════════════════════════════════════════════════╗
║         SESSION SUMMARY                           ║
╠════════════════════════════════════════════════════════╣
║ Duration: 2m 34s                            ║
║ Total Tokens: 12,450                        ║
║ Avg Token/min: 4,854                        ║
╚════════════════════════════════════════════════════════╝
```

---

## Usage Examples

### Example 1: Basic Debug
```bash
DEBUG=true code-assistant-claude mcp-execute "read config.json"
```

**Output**:
```
╔════════════════════════════════════════════════════════╗
║ Code-Assistant-Claude Debug Mode ACTIVE       ║
╚════════════════════════════════════════════════════════╝

🔧 MCP Code Execution
Intent: read config.json

ℹ️  Debug mode enabled
   intent: "read config.json"
   language: "typescript"
   timeout: "30000"
   maxTools: "5"

🚀 Initializing MCP Execution Engine...
✓ Indexed 5 MCP tools

Phase 1: Tool Discovery
ℹ️  Discovered 1 relevant tools
   tools: [{"name":"filesystem_read","score":0.9}]

Phase 2: Code Generation
┌─ CODE GENERATED
├─ typescript wrapper
├─ Tokens: 364
├─ Savings: 99.8% 🎉

Phase 3: Sandbox Execution
└─ SANDBOX RESULT
  ├─ ✅ SUCCESS
  ├─ Duration: 156ms
  └─ Memory: 42M

✅ Result: File contents retrieved
💡 Token Reduction: 98.7%

╔════════════════════════════════════════════════════════╗
║         SESSION SUMMARY                           ║
║ Total Tokens: 376                           ║
╚════════════════════════════════════════════════════════╝
```

### Example 2: Complex Workflow Debug
```bash
export DEBUG=true

# Step 1: Read
code-assistant-claude mcp-execute "read package.json"

# Step 2: Analyze
code-assistant-claude mcp-execute "analyze dependencies from package.json"

# Step 3: Transform
code-assistant-claude mcp-execute "write analysis to report.md"
```

Each command shows:
- Tools discovered
- Code generated with token counts
- Security validation results
- Execution timing
- Cumulative session tokens

### Example 3: Debug with Different Languages
```bash
# TypeScript debug
DEBUG=true code-assistant-claude mcp-execute "process data" --language typescript

# Python debug
DEBUG=true code-assistant-claude mcp-execute "analyze CSV" --language python
```

Both show language-specific code generation and execution details.

---

## Debug Information Shown

### Tool Discovery
- Number of tools indexed
- Tools found for intent
- Relevance scores
- Selection reasoning

### Code Generation
- Language (TypeScript/Python)
- Generated code token count
- Traditional approach token count
- Savings percentage
- Visual progress bar

### Security
- Risk assessment level (low/medium/high/critical)
- Risk score (0-100)
- Issues found
- Validation details

### Sandbox
- Sandbox type (Process/VM/Docker)
- Language being executed
- Execution duration
- Memory usage
- Success/failure status

### Token Budget
- Category (Skills/MCPs/Working)
- Used vs Total
- Percentage utilization
- Visual status indicator (🟢/🟡/🔴)
- Progress bar

### Session Stats
- Total session duration
- Total tokens used
- Average tokens per minute
- Efficiency metrics

---

## Color Coding

| Color | Meaning |
|-------|---------|
| **Cyan** | Information, phases, summaries |
| **Yellow** | Skill activation, warnings |
| **Blue** | MCP execution, sandbox |
| **Green** | Success, completions, low risk |
| **Red** | Failures, high risk |
| **Magenta** | Command execution |
| **Gray** | Details, timestamps, metadata |

---

## When to Use Debug Mode

### ✅ Use Debug Mode When:

1. **Learning the framework** - See how it works internally
2. **Optimizing token usage** - Track token consumption
3. **Troubleshooting** - Understand why something isn't working
4. **Performance tuning** - Identify slow components
5. **Developing custom skills** - See activation patterns
6. **Testing MCP integrations** - Verify tool discovery

### ❌ Don't Use Debug Mode When:

1. **Production use** - Adds visual noise
2. **Scripting/automation** - Use `--quiet` instead
3. **CI/CD pipelines** - Use normal output
4. **Performance critical** - Adds minimal overhead but avoid if critical

---

## Configuration

### Environment Variable
```bash
# Enable debug
export DEBUG=true

# Disable debug
unset DEBUG

# Or inline
DEBUG=true code-assistant-claude mcp-execute "task"
```

### In settings.json (Coming in v1.1)
```json
{
  "debug": {
    "enabled": true,
    "verbose": true,
    "showTokenBars": true,
    "showTimestamps": true
  }
}
```

---

## Advanced Features (v1.1+)

### Verbose Mode
Shows additional details:
- Full parameters for commands
- Complete tool schemas
- Detailed error stack traces
- Internal state transitions

### Debug Levels
```bash
DEBUG=1  # Basic (tool discovery, code gen, results)
DEBUG=2  # Detailed (+ security, sandbox details)
DEBUG=3  # Verbose (+ internal state, timing)
```

### Debug Filters
```bash
DEBUG_FILTER=mcp  # Only MCP execution
DEBUG_FILTER=skills  # Only skill activation
DEBUG_FILTER=tokens  # Only token tracking
```

### Debug Output to File
```bash
DEBUG=true code-assistant-claude mcp-execute "task" 2>&1 | tee debug.log
```

---

## Integration with Skills/Commands (v1.1)

When debug mode is enabled, skills and commands can also emit debug info:

```markdown
# In a skill SKILL.md

When this skill activates, users will see:

┌─ SKILL ACTIVATED
├─ code-reviewer
├─ Reason: file_save event on src/app.ts
├─ Tokens: 2,045
└─ Progress bar...
```

---

## Example Session Output

```bash
$ export DEBUG=true
$ code-assistant-claude mcp-execute "comprehensive workflow"

╔════════════════════════════════════════════════════════╗
║ Code-Assistant-Claude Debug Mode ACTIVE       ║
╚════════════════════════════════════════════════════════╝

🔧 MCP Code Execution

ℹ️  Debug mode enabled...

Phase 1: Discovery
ℹ️  Discovered 3 relevant tools
   - filesystem_read (score: 0.9)
   - json_parse (score: 0.7)
   - data_transform (score: 0.6)

Phase 2: Code Generation
┌─ CODE GENERATED
├─ typescript wrapper
├─ Tokens: 892
├─ Savings: 99.4% 🎉

Phase 3: Security
┌─ SECURITY VALIDATION
├─ Risk Level: low
├─ Risk Score: 12/100
└─ ████░░░░░░░░░░░░░░░░░░░░░░░░░░ 12/100

Phase 4: Sandbox
┌─ SANDBOX EXECUTION
├─ ⚡ PROCESS
└─ [+2.8s]

└─ SANDBOX RESULT
  ├─ ✅ SUCCESS
  ├─ Duration: 234ms
  └─ Memory: 58M

Phase 5: Result Processing

✅ Result: Workflow completed successfully
💡 Token Reduction: 98.5%

╔════════════════════════════════════════════════════════╗
║         SESSION SUMMARY                           ║
║ Duration: 2m 45s                            ║
║ Total Tokens: 3,127                         ║
║ Avg Token/min: 1,137                        ║
╚════════════════════════════════════════════════════════╝
```

---

## Troubleshooting with Debug

### Problem: "No relevant tools found"

**Debug shows**:
```
ℹ️  Discovered 0 relevant tools
   tools: []
```

**Solution**: Use more specific keywords in your intent

### Problem: "Security validation failed"

**Debug shows**:
```
┌─ SECURITY VALIDATION
├─ Risk Level: critical
├─ Risk Score: 85/100
├─ Issues Found: 3
```

**Solution**: Review generated code, simplify operations

### Problem: "Execution timeout"

**Debug shows**:
```
└─ SANDBOX RESULT
  ├─ ❌ FAILED
  ├─ Duration: 30000ms (timeout)
```

**Solution**: Increase --timeout or optimize code

---

## Benefits

### For Developers
- **Transparency**: See exactly what the framework does
- **Learning**: Understand MCP code execution flow
- **Optimization**: Identify token usage hotspots
- **Debugging**: Quickly find issues

### For Token Optimization
- **Real-time tracking**: See token usage as it happens
- **Budget awareness**: Know when approaching limits
- **Savings visualization**: See reduction percentages
- **Session analytics**: Understand usage patterns

### For Performance
- **Timing information**: Identify slow operations
- **Memory tracking**: Monitor resource usage
- **Phase visibility**: See where time is spent

---

## See Also

- [MCP Code Execution Guide](./mcp-code-execution.md)
- [Token Optimization Guide](./token-optimization.md)
- [Troubleshooting Guide](./troubleshooting.md)
