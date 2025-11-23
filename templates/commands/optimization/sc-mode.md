---
name: "sc-mode"
description: "Switch between optimized operating modes"
category: "optimization"
version: "1.0.0"

triggers:
  exact: "/sc:mode"
  aliases: ["/mode", "/switch-mode"]
  keywords: ["mode", "switch", "optimize"]

requires:
  mcps: []

parameters:
  - name: "mode"
    type: "string"
    required: true
    options: ["standard", "fast", "deep", "research", "coding", "minimal"]
    description: "Operating mode to switch to"

autoExecute: true
tokenEstimate: 2000
executionTime: "2-5s"
---

# /sc:mode - Mode Switching

Switch between optimized operating modes for different tasks.

## Available Modes

### Standard Mode (Default)
```
⚙️ Standard Mode - Balanced Performance

Configuration:
- MCPs: Serena, Sequential (auto-load others as needed)
- Skills: Auto-load on demand
- Message history: 15 messages
- Token budget: Moderate (60K allocated)
- Response style: Comprehensive

Best for: General-purpose development
Token usage: ~40K average
```

### Fast Mode
```
⚡ Fast Mode - Speed Optimized

Configuration:
- MCPs: Serena only
- Skills: Minimal, load on explicit need
- Message history: 5 messages
- Token budget: Low (20K allocated)
- Response style: Concise

Best for: Quick tasks, rapid iteration
Token usage: ~15K average
Speed: 2-3x faster responses
```

### Deep Mode
```
🔬 Deep Mode - Maximum Capability

Configuration:
- MCPs: All relevant (Serena, Sequential, Context7, Tavily)
- Skills: Pre-load common skills
- Message history: 30 messages
- Token budget: High (100K allocated)
- Response style: Extremely detailed

Best for: Complex analysis, architecture design
Token usage: ~80K average
Capability: Maximum
```

### Research Mode
```
📚 Research Mode - Knowledge Focus

Configuration:
- MCPs: Tavily, Context7, Sequential
- Skills: research-mode, analysis
- Message history: 20 messages
- Token budget: High (80K allocated)
- Response style: Comprehensive with citations

Best for: Research, learning, documentation
Token usage: ~60K average
Features: Enhanced search, synthesis
```

### Coding Mode
```
💻 Coding Mode - Development Focus

Configuration:
- MCPs: Serena, Code Execution
- Skills: code-reviewer, test-generator
- Message history: 10 messages
- Token budget: Moderate (50K allocated)
- Response style: Code-focused

Best for: Implementation, debugging, testing
Token usage: ~35K average
Features: Enhanced code analysis
```

### Minimal Mode
```
🎯 Minimal Mode - Ultra-Efficient

Configuration:
- MCPs: None (load on explicit request)
- Skills: None
- Message history: 3 messages
- Token budget: Minimal (10K allocated)
- Response style: Brief

Best for: Simple tasks, token conservation
Token usage: ~8K average
Speed: Maximum (5x faster)
```

## Mode Comparison Matrix

```
📊 Mode Comparison

Feature          | Standard | Fast | Deep | Research | Coding | Minimal
-----------------|----------|------|------|----------|--------|--------
Token Budget     | 60K      | 20K  | 100K | 80K      | 50K    | 10K
MCPs Loaded      | 2-3      | 1    | 4-5  | 3        | 2      | 0
Skills Active    | 2-3      | 0-1  | 4-5  | 3        | 3      | 0
Message History  | 15       | 5    | 30   | 20       | 10     | 3
Response Time    | Medium   | Fast | Slow | Medium   | Medium | Fastest
Response Detail  | Good     | Brief| Rich | Rich     | Good   | Minimal
Best For         | General  | Quick| Complex| Research| Code  | Simple

Performance Score:
Speed:     ⚡⚡⚡ | ⚡⚡⚡⚡⚡ | ⚡    | ⚡⚡  | ⚡⚡⚡ | ⚡⚡⚡⚡⚡
Capability: ⭐⭐⭐ | ⭐⭐   | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐
Efficiency: 🟢🟢🟢 | 🟢🟢🟢🟢🟢 | 🟢   | 🟢🟢  | 🟢🟢🟢 | 🟢🟢🟢🟢🟢
```

## Execution Flow

### 1. Mode Switching

```markdown
🔄 Switching to {mode} Mode

Current Mode: Standard
Target Mode: Coding

Changes Required:
1. Unload MCPs:
   ❌ Sequential (-2,000 tokens)
   ❌ Tavily (-2,000 tokens)

2. Load MCPs:
   ✅ Code Execution (+800 tokens)

3. Update Skills:
   ✅ Load code-reviewer
   ✅ Load test-generator
   ❌ Unload business-panel

4. Adjust Settings:
   • Message history: 15 → 10
   • Token budget: 60K → 50K
   • Response style: Comprehensive → Code-focused

Executing transition...
```

### 2. Mode Activation

```markdown
✅ Coding Mode Activated

Active Configuration:
- MCPs: Serena, Code Execution
- Skills: code-reviewer, test-generator
- Message history: 10 messages
- Token budget: 50K / 200K
- Current usage: 8K tokens

Ready for: Implementation, debugging, testing
Optimized for: Code quality and testing
```

## Usage Examples

### Switch to Fast Mode
```bash
/sc:mode fast

# Optimizes for speed
# Minimal token usage
# Quick responses
#
# Result:
# ⚡ Fast Mode Activated
# Token budget: 20K
# Response time: ~2-3s
# Perfect for quick tasks
```

### Switch to Deep Mode
```bash
/sc:mode deep

# Maximum capability
# All resources loaded
# Comprehensive responses
#
# Result:
# 🔬 Deep Mode Activated
# Token budget: 100K
# All MCPs loaded
# Perfect for complex analysis
```

### Switch to Research Mode
```bash
/sc:mode research

# Optimized for research
# Web search enabled
# Documentation access
#
# Result:
# 📚 Research Mode Activated
# MCPs: Tavily, Context7, Sequential
# Perfect for learning and research
```

### Switch to Coding Mode
```bash
/sc:mode coding

# Development focus
# Code analysis tools
# Testing capabilities
#
# Result:
# 💻 Coding Mode Activated
# MCPs: Serena, Code Execution
# Skills: code-reviewer, test-generator
# Perfect for implementation
```

### Switch to Minimal Mode
```bash
/sc:mode minimal

# Ultra-efficient
# No MCPs loaded
# Brief responses
#
# Result:
# 🎯 Minimal Mode Activated
# Token budget: 10K
# Maximum speed
# Perfect for simple tasks
```

## Smart Mode Detection

### Auto-Switch Based on Task

```javascript
// Automatically detect and switch modes
function detectOptimalMode(userMessage) {
  if (containsKeywords(userMessage, ['research', 'find', 'learn'])) {
    return 'research';
  }

  if (containsKeywords(userMessage, ['implement', 'code', 'function'])) {
    return 'coding';
  }

  if (containsKeywords(userMessage, ['analyze', 'design', 'architecture'])) {
    return 'deep';
  }

  if (containsKeywords(userMessage, ['quick', 'simple', 'just'])) {
    return 'fast';
  }

  return 'standard';
}
```

### Context-Aware Switching

```javascript
// Switch based on context
if (tokenUsage > 150000) {
  switchMode('minimal'); // Conserve tokens
}

if (complexityScore > 8) {
  switchMode('deep'); // Need more capability
}

if (timeConstraint < 60) {
  switchMode('fast'); // Need speed
}
```

## Mode Profiles

### Development Workflow
```
Morning (Planning):
→ /sc:mode deep
- Architecture decisions
- Design discussions
- System analysis

Midday (Implementation):
→ /sc:mode coding
- Writing code
- Testing
- Debugging

Afternoon (Quick fixes):
→ /sc:mode fast
- Bug fixes
- Small changes
- Code reviews
```

### Learning Workflow
```
Phase 1 (Discovery):
→ /sc:mode research
- Web search
- Documentation
- Tutorials

Phase 2 (Practice):
→ /sc:mode coding
- Implement examples
- Build projects
- Test knowledge

Phase 3 (Mastery):
→ /sc:mode deep
- Complex projects
- Advanced topics
- Best practices
```

## Mode Configuration

### Custom Modes

`.claude/settings.json`:
```json
{
  "modes": {
    "custom-backend": {
      "mcps": ["serena", "sequential", "code-execution"],
      "skills": ["backend-architect", "security-auditor"],
      "messageHistory": 12,
      "tokenBudget": 55000,
      "responseStyle": "technical"
    },
    "custom-frontend": {
      "mcps": ["serena", "magic", "playwright"],
      "skills": ["frontend-architect", "ui-designer"],
      "messageHistory": 10,
      "tokenBudget": 45000,
      "responseStyle": "visual"
    },
    "custom-research": {
      "mcps": ["tavily", "context7", "sequential"],
      "skills": ["research-mode", "synthesis"],
      "messageHistory": 25,
      "tokenBudget": 75000,
      "responseStyle": "academic"
    }
  }
}
```

### Mode Presets by Language

```json
{
  "languageModes": {
    "typescript": {
      "mode": "coding",
      "mcps": ["serena", "code-execution"],
      "skills": ["typescript-expert"],
      "settings": {
        "strictTypes": true,
        "linting": true
      }
    },
    "python": {
      "mode": "coding",
      "mcps": ["serena", "code-execution"],
      "skills": ["python-expert"],
      "settings": {
        "formatter": "black",
        "linting": "pylint"
      }
    }
  }
}
```

## Performance Impact

### Mode Switching Overhead

```
⏱️ Mode Switch Performance

Transition          | Time | Token Change | Impact
--------------------|------|--------------|--------
Standard → Fast     | 2s   | -40K         | High savings
Standard → Deep     | 5s   | +40K         | High capability
Fast → Deep         | 8s   | +80K         | Maximum impact
Any → Minimal       | 1s   | -50K         | Fastest
Minimal → Deep      | 10s  | +90K         | Slowest

Recommendation: Plan mode switches for task boundaries
```

### Token Efficiency by Mode

```
💰 Token Efficiency

Mode     | Avg Task Tokens | Tasks/200K | Efficiency
---------|-----------------|------------|------------
Minimal  | 8K              | 25         | ⭐⭐⭐⭐⭐
Fast     | 15K             | 13         | ⭐⭐⭐⭐
Standard | 40K             | 5          | ⭐⭐⭐
Coding   | 35K             | 5.7        | ⭐⭐⭐
Research | 60K             | 3.3        | ⭐⭐
Deep     | 80K             | 2.5        | ⭐
```

## Integration

### With Other Commands
```bash
# Optimize before mode switch
/sc:optimize-tokens --apply
/sc:mode deep

# Switch mode for specific task
/sc:mode coding
/sc:implement "user authentication"
/sc:mode standard

# Emergency token conservation
/sc:mode minimal
/sc:cleanup-context --level aggressive
```

### With Automation
```javascript
// Auto-optimize workflow
async function optimizedWorkflow(task) {
  const mode = detectOptimalMode(task);
  await switchMode(mode);

  const result = await executeTask(task);

  await switchMode('standard');
  return result;
}
```

## Best Practices

### Mode Selection Guide

**Use Fast Mode when**:
- Simple, quick tasks
- Time-constrained
- Token budget low
- Straightforward implementation

**Use Standard Mode when**:
- General development
- Balanced needs
- Unknown complexity
- Default choice

**Use Deep Mode when**:
- Complex architecture
- System design
- Critical decisions
- Learning complex topics

**Use Research Mode when**:
- Need web search
- Learning new topics
- Documentation needed
- Market research

**Use Coding Mode when**:
- Writing code
- Debugging
- Testing
- Code reviews

**Use Minimal Mode when**:
- Emergency token conservation
- Very simple tasks
- Just need quick answer
- End of session cleanup

## Success Metrics

- Mode switch time: <5s
- Token optimization: 40-80%
- Performance improvement: 2-5x
- User satisfaction: >4.8/5
- Context preservation: >95%
