---
name: "sc-optimize-tokens"
description: "Analyze and optimize token usage in current session"
category: "optimization"
version: "1.0.0"

triggers:
  exact: "/sc:optimize-tokens"
  aliases: ["/tokens", "/optimize"]
  keywords: ["token usage", "optimize context"]

requires:
  mcps: ["serena"]

autoExecute: true
tokenEstimate: 3000
executionTime: "5-10s"
---

# /sc:optimize-tokens - Token Usage Analysis

Real-time token usage analysis and optimization recommendations.

## Analysis Performed

### 1. Current Usage Breakdown
```
📊 Token Usage Analysis
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Budget:    200,000 tokens (100%)
Used:       45,000 tokens (22.5%) 🟢

Breakdown:
├─ System:           2,000 tokens (1.0%)
├─ MCP Servers:      8,500 tokens (4.3%)
│  ├─ Serena:          500 tokens
│  ├─ Sequential:    2,000 tokens
│  ├─ Magic:         1,500 tokens
│  ├─ Context7:      2,500 tokens
│  └─ Tavily:        2,000 tokens
├─ Skills:           6,500 tokens (3.3%)
│  ├─ code-reviewer:     2,000 tokens
│  ├─ frontend-design:   1,500 tokens
│  ├─ test-generator:    2,000 tokens
│  └─ research-mode:     1,000 tokens
├─ Messages:        28,000 tokens (14.0%)
└─ Available:      155,000 tokens (77.5%)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 2. Optimization Recommendations

```
💡 Recommendations:
1. Unload unused MCPs:
   • Context7 (-2,500 tokens) - Not used in last 10 messages
   • Tavily (-2,000 tokens) - No research queries

2. Unload inactive skills:
   • research-mode (-1,000 tokens) - Not triggered

3. Enable compression mode:
   • Symbol system → 30% reduction on messages
   • Estimated savings: 8,400 tokens

4. Cleanup old messages:
   • Keep last 10 messages
   • Archive older context
   • Estimated savings: 5,000 tokens

Total Potential Savings: 18,900 tokens (42% reduction)
```

### 3. Auto-Optimization

Automatically applies safe optimizations:
- Unloads unused MCPs (not accessed in >10 messages)
- Unloads inactive skills (not triggered)
- Clears message cache (keeps last 10)

## Execution Flow

### 1. Gather Token Metrics
```javascript
// Analyze current token usage
const analysis = {
  budget: 200000,
  used: calculateTokenUsage(),
  breakdown: {
    system: countSystemTokens(),
    mcps: countMCPTokens(),
    skills: countSkillTokens(),
    messages: countMessageTokens()
  }
};
```

### 2. Identify Waste
```javascript
// Find optimization opportunities
const waste = {
  unusedMCPs: findUnusedMCPs(10), // 10 message threshold
  inactiveSkills: findInactiveSkills(),
  oldMessages: findOldMessages(10), // Keep last 10
  largeFiles: findLargeFilesInContext()
};
```

### 3. Generate Recommendations
```javascript
// Prioritize by impact
const recommendations = [
  {
    action: 'unload-mcp',
    target: 'context7',
    savings: 2500,
    safety: 'safe',
    impact: 'none' // Not used recently
  },
  {
    action: 'enable-compression',
    target: 'messages',
    savings: 8400,
    safety: 'safe',
    impact: 'improved' // Better readability
  },
  // ... more recommendations
].sort((a, b) => b.savings - a.savings);
```

### 4. Apply Optimizations (if --apply flag)
```javascript
if (applyFlag) {
  for (const rec of recommendations.filter(r => r.safety === 'safe')) {
    await applyOptimization(rec);
    logResult(rec);
  }
}
```

## Usage Examples

### Basic Analysis
```bash
/sc:optimize-tokens

# Shows current usage and recommendations
# No changes applied
```

### Auto-Apply Safe Optimizations
```bash
/sc:optimize-tokens --apply

# Automatically applies safe optimizations:
# ✅ Unloaded Context7 (-2,500 tokens)
# ✅ Unloaded Tavily (-2,000 tokens)
# ✅ Unloaded research-mode (-1,000 tokens)
# ✅ Cleared old messages (-5,000 tokens)
#
# Total savings: 10,500 tokens (23% reduction)
# New usage: 34,500 / 200,000 (17.3%)
```

### Focus on Specific Area
```bash
/sc:optimize-tokens --focus mcp

# Analyzes only MCP token usage
# Provides MCP-specific recommendations
```

```bash
/sc:optimize-tokens --focus skills

# Analyzes only skill token usage
# Recommends which skills to unload
```

```bash
/sc:optimize-tokens --focus messages

# Analyzes message history
# Suggests compression and cleanup
```

## Token Budgets by Usage

### Safe Zone (0-50%)
```
🟢 Token Budget: Healthy

Used: 45,000 / 200,000 (22.5%)
Status: Plenty of room for complex tasks
Action: No optimization needed
```

### Warning Zone (50-75%)
```
🟡 Token Budget: Moderate

Used: 125,000 / 200,000 (62.5%)
Status: Approaching limits
Action: Consider optimization
Recommendations: Unload unused resources
```

### Critical Zone (75-90%)
```
🟠 Token Budget: High

Used: 165,000 / 200,000 (82.5%)
Status: Limited headroom
Action: Optimization recommended
Priority: High
```

### Danger Zone (90-100%)
```
🔴 Token Budget: Critical

Used: 185,000 / 200,000 (92.5%)
Status: Very limited tokens remaining
Action: Immediate optimization required
Priority: Critical
Warning: May not be able to handle complex tasks
```

## Optimization Strategies

### Level 1: No Impact (Always Safe)
- Unload unused MCPs
- Unload inactive skills
- Clear old messages (keep last 10)
- Remove duplicate context

### Level 2: Low Impact (Usually Safe)
- Enable symbol compression
- Reduce message history (keep last 5)
- Compress large code blocks
- Simplify responses

### Level 3: Medium Impact (Requires Confirmation)
- Unload recently used MCPs
- Clear active skill context
- Aggressive message pruning
- Remove file context

### Level 4: High Impact (Use with Caution)
- Unload all MCPs
- Unload all skills
- Minimal message history
- Start fresh session

## Advanced Analysis

### Token Usage Trends
```
📈 Token Usage Over Time

Message | Tokens | Cumulative | Change
--------|--------|------------|-------
1       | 2,500  | 2,500      | -
2       | 3,200  | 5,700      | +700
3       | 4,100  | 9,800      | +900
4       | 2,800  | 12,600     | -1,300
...

Trend: Increasing by avg 850 tokens/message
Forecast: Budget exhausted in ~180 messages
```

### Cost-Benefit Analysis
```
💰 Optimization ROI

Optimization         | Cost | Benefit | ROI
---------------------|------|---------|-----
Unload Context7      | 0    | 2,500   | ∞
Enable compression   | 100  | 8,400   | 84x
Clear old messages   | 0    | 5,000   | ∞
Symbol system        | 200  | 15,000  | 75x
```

### MCP Efficiency Report
```
📊 MCP Token Efficiency

MCP        | Tokens | Uses | Tokens/Use | Efficiency
-----------|--------|------|------------|------------
Serena     | 500    | 25   | 20         | ⭐⭐⭐⭐⭐
Sequential | 2,000  | 8    | 250        | ⭐⭐⭐
Magic      | 1,500  | 3    | 500        | ⭐⭐
Context7   | 2,500  | 0    | ∞          | ⭐ (unused)
Tavily     | 2,000  | 1    | 2,000      | ⭐ (rarely used)

Recommendation: Keep Serena, unload Context7 and Tavily
```

## Integration

### With Skills
- token-analyzer: Deep token analysis
- optimization-advisor: Smart recommendations

### With MCPs
- Serena: Analyze code token usage
- All MCPs: Calculate their own token cost

## Configuration

`.claude/settings.json`:
```json
{
  "commands": {
    "sc-optimize-tokens": {
      "autoOptimize": false,
      "unusedThreshold": 10,
      "messageHistory": 10,
      "warningThreshold": 0.75,
      "criticalThreshold": 0.90,
      "compressionMode": "auto"
    }
  }
}
```

## Automation

### Auto-Optimization Triggers
```javascript
// Automatically run when token usage exceeds threshold
if (tokenUsage > 150000) {
  runCommand('/sc:optimize-tokens --apply');
}

// Run after every 50 messages
if (messageCount % 50 === 0) {
  runCommand('/sc:optimize-tokens');
}
```

### Scheduled Optimization
```javascript
// Optimize every hour
setInterval(() => {
  runCommand('/sc:optimize-tokens --apply --focus unused');
}, 3600000);
```

## Success Metrics

- Token savings: >20% on average
- Optimization time: <10s
- False positive rate: <1%
- Impact on functionality: Minimal
- User satisfaction: >4.8/5
