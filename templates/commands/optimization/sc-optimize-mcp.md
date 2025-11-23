---
name: "sc-optimize-mcp"
description: "MCP server selection and optimization recommendations"
category: "optimization"
version: "1.0.0"

triggers:
  exact: "/sc:optimize-mcp"
  aliases: ["/mcp", "/mcps"]
  keywords: ["mcp optimization", "server selection"]

requires:
  mcps: []

autoExecute: true
tokenEstimate: 4000
executionTime: "5-15s"
---

# /sc:optimize-mcp - MCP Optimization

Intelligent MCP server selection and optimization for current task.

## MCP Server Capabilities

### Code Analysis & Execution
- **Serena**: Code navigation, symbol search, pattern matching
- **Code Execution**: Run Python, JavaScript, shell commands

### Research & Knowledge
- **Tavily**: Web search, research, fact-finding
- **Context7**: Documentation search, knowledge retrieval
- **Sequential**: Multi-step reasoning, complex analysis

### UI & Testing
- **Magic**: UI component generation
- **Playwright**: Browser automation, E2E testing

### Infrastructure
- **Filesystem**: File operations
- **Database**: Data querying
- **API**: External service integration

## Execution Flow

### 1. Analyze Current Task
```markdown
🎯 Task Analysis

Current Task: "Implement user authentication with OAuth"

Task Type: Backend Development
Complexity: High
Duration Estimate: 2-4 hours

Required Capabilities:
- ✅ Code navigation
- ✅ Pattern matching
- ✅ Security analysis
- ❌ UI generation (not needed)
- ❌ Web research (not needed)
```

### 2. MCP Recommendation Matrix

```
📊 MCP Recommendation Matrix

MCP Server    | Relevance | Token Cost | Usage | Recommendation
--------------|-----------|------------|-------|----------------
Serena        | ⭐⭐⭐⭐⭐  | 500       | High  | ✅ KEEP
Sequential    | ⭐⭐⭐⭐    | 2,000     | Med   | ✅ KEEP
Code Exec     | ⭐⭐⭐      | 800       | Low   | ⚠️ OPTIONAL
Context7      | ⭐⭐        | 2,500     | None  | ❌ UNLOAD
Tavily        | ⭐         | 2,000     | None  | ❌ UNLOAD
Magic         | ⭐         | 1,500     | None  | ❌ UNLOAD
Playwright    | ⭐         | 1,200     | None  | ❌ UNLOAD

Recommendations:
✅ Keep: Serena, Sequential (essential for task)
⚠️ Optional: Code Exec (might be useful for testing)
❌ Unload: Context7, Tavily, Magic, Playwright (not needed)

Potential Savings: 7,200 tokens (72% reduction in MCP tokens)
```

### 3. Task-Specific Recommendations

**For Different Task Types**:

#### Backend Development
```
Recommended MCPs:
- ✅ Serena (code navigation)
- ✅ Sequential (architecture reasoning)
- ✅ Code Execution (testing)
- ❌ Magic (not needed)
- ❌ Playwright (not needed)

Estimated tokens: 3,300
```

#### Frontend Development
```
Recommended MCPs:
- ✅ Serena (code navigation)
- ✅ Magic (UI generation)
- ✅ Playwright (testing)
- ⚠️ Sequential (for complex components)
- ❌ Tavily (usually not needed)

Estimated tokens: 3,700
```

#### Research & Analysis
```
Recommended MCPs:
- ✅ Tavily (web research)
- ✅ Context7 (documentation)
- ✅ Sequential (synthesis)
- ❌ Magic (not needed)
- ❌ Serena (minimal code work)

Estimated tokens: 6,500
```

#### DevOps & Infrastructure
```
Recommended MCPs:
- ✅ Code Execution (scripts)
- ✅ Filesystem (config files)
- ✅ Serena (code analysis)
- ❌ Magic (not needed)
- ❌ Tavily (rarely needed)

Estimated tokens: 1,800
```

#### Testing & QA
```
Recommended MCPs:
- ✅ Serena (test code navigation)
- ✅ Playwright (E2E testing)
- ✅ Code Execution (test running)
- ⚠️ Sequential (complex test scenarios)

Estimated tokens: 2,500
```

### 4. Optimization Actions

```markdown
💡 Optimization Plan

Current MCP Load: 10,500 tokens
Recommended Load: 3,300 tokens
Savings: 7,200 tokens (69%)

Actions:
1. ❌ Unload Context7 → Save 2,500 tokens
2. ❌ Unload Tavily → Save 2,000 tokens
3. ❌ Unload Magic → Save 1,500 tokens
4. ❌ Unload Playwright → Save 1,200 tokens

Keep Active:
- ✅ Serena (essential)
- ✅ Sequential (needed for complex reasoning)

Apply with: /sc:optimize-mcp --apply
```

## Usage Examples

### Analyze Current Setup
```bash
/sc:optimize-mcp

# Shows current MCP usage and recommendations
# No changes applied
```

### Auto-Apply Recommendations
```bash
/sc:optimize-mcp --apply

# Unloads unnecessary MCPs
# Keeps only relevant ones for current task
#
# Results:
# ❌ Unloaded Context7 (-2,500 tokens)
# ❌ Unloaded Tavily (-2,000 tokens)
# ❌ Unloaded Magic (-1,500 tokens)
# ❌ Unloaded Playwright (-1,200 tokens)
# ✅ Kept Serena (essential)
# ✅ Kept Sequential (useful)
#
# Total savings: 7,200 tokens
```

### Task-Specific Optimization
```bash
/sc:optimize-mcp --task frontend

# Recommends MCPs for frontend work:
# ✅ Serena, Magic, Playwright
# ❌ Tavily, Context7
```

```bash
/sc:optimize-mcp --task research

# Recommends MCPs for research:
# ✅ Tavily, Context7, Sequential
# ❌ Magic, Playwright
```

### Load Specific MCPs
```bash
/sc:optimize-mcp --load "serena,sequential"

# Unloads all MCPs except specified ones
```

## MCP Selection Guide

### By Project Type

#### Web Application (Full-Stack)
```
Phase 1: Planning & Design
- Sequential (architecture)
- Tavily (research best practices)

Phase 2: Backend Development
- Serena (code navigation)
- Sequential (complex logic)
- Code Execution (testing)

Phase 3: Frontend Development
- Serena (code navigation)
- Magic (UI generation)
- Playwright (testing)

Phase 4: Testing & Deployment
- Playwright (E2E tests)
- Code Execution (CI/CD)
```

#### Data Analysis Project
```
Essential:
- Code Execution (run analysis)
- Serena (code navigation)

Optional:
- Tavily (research methodologies)
- Sequential (complex analysis)
```

#### Documentation Project
```
Essential:
- Context7 (documentation search)
- Tavily (research)

Optional:
- Sequential (synthesis)
- Serena (code examples)
```

### By Task Complexity

#### Simple (1-2 files, <100 lines)
```
Minimal MCPs:
- Serena (basic navigation)
Total: ~500 tokens
```

#### Moderate (3-5 files, 100-500 lines)
```
Standard MCPs:
- Serena (navigation)
- Code Execution (testing)
Total: ~1,300 tokens
```

#### Complex (6-10 files, 500-1000 lines)
```
Enhanced MCPs:
- Serena (extensive navigation)
- Sequential (complex reasoning)
- Code Execution (comprehensive testing)
Total: ~3,300 tokens
```

#### Enterprise (>10 files, >1000 lines)
```
Full Suite:
- Serena (codebase navigation)
- Sequential (architecture)
- Code Execution (testing)
- Context7 (documentation)
- Tavily (research)
Total: ~6,300 tokens
```

## MCP Performance Metrics

```
📈 MCP Performance Report

MCP Server | Avg Response | Success Rate | Token/Operation
-----------|--------------|--------------|----------------
Serena     | 150ms       | 98%          | 20 tokens
Sequential | 800ms       | 95%          | 250 tokens
Magic      | 1200ms      | 92%          | 500 tokens
Playwright | 2000ms      | 90%          | 400 tokens
Tavily     | 1500ms      | 96%          | 2000 tokens
Context7   | 600ms       | 97%          | 2500 tokens

Efficiency Rating:
⭐⭐⭐⭐⭐ Serena (fast & token-efficient)
⭐⭐⭐⭐   Sequential (good value)
⭐⭐⭐    Magic (moderate efficiency)
⭐⭐      Tavily (expensive but valuable for research)
⭐⭐      Context7 (expensive, use sparingly)
```

## Smart Loading Strategy

### Progressive Loading
```javascript
// Start minimal
const initialMCPs = ['serena'];

// Add as needed
if (needsResearch) {
  loadMCP('tavily');
}

if (needsUIGeneration) {
  loadMCP('magic');
}

if (needsTesting) {
  loadMCP('playwright');
}
```

### Context-Aware Loading
```javascript
// Detect task from user message
const taskType = detectTaskType(userMessage);

// Load appropriate MCPs
const mcps = getMCPsForTask(taskType);
mcps.forEach(mcp => loadMCP(mcp));
```

### Load Balancing
```javascript
// Prioritize by cost-benefit
const mcps = [
  { name: 'serena', cost: 500, value: 95 },
  { name: 'sequential', cost: 2000, value: 85 },
  { name: 'tavily', cost: 2000, value: 60 }
];

// Sort by value/cost ratio
mcps.sort((a, b) => (b.value/b.cost) - (a.value/a.cost));
```

## Integration

### With Skills
- mcp-manager: MCP lifecycle management
- task-analyzer: Task type detection

### With Commands
- /sc:optimize-tokens: Combined optimization
- /sc:mode: Switch MCP profiles

## Configuration

`.claude/settings.json`:
```json
{
  "commands": {
    "sc-optimize-mcp": {
      "autoOptimize": true,
      "taskProfiles": {
        "backend": ["serena", "sequential", "code-exec"],
        "frontend": ["serena", "magic", "playwright"],
        "research": ["tavily", "context7", "sequential"],
        "testing": ["serena", "playwright", "code-exec"]
      },
      "alwaysLoaded": ["serena"],
      "maxConcurrentMCPs": 5,
      "tokenBudget": 10000
    }
  }
}
```

## Best Practices

### Do's ✅
- Start with minimal MCPs
- Add MCPs as needed
- Unload when task changes
- Monitor token usage
- Use task-specific profiles

### Don'ts ❌
- Don't load all MCPs by default
- Don't keep unused MCPs loaded
- Don't ignore token costs
- Don't over-optimize (unload essential MCPs)

## Success Metrics

- Token savings: >60% vs full load
- Task completion: No degradation
- Response time: <15s optimization
- Accuracy: >95% recommendations
- User satisfaction: >4.7/5
