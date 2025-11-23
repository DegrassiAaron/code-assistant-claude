# Advanced Token Optimization

Expert-level optimization techniques for maximum token efficiency.

## Three-Pillar Optimization

### 1. MCP Code Execution (98.7% Reduction)

#### Pattern: Progressive Discovery

Instead of loading all tools upfront, discover progressively:

```typescript
// Traditional: Load all tools (150K tokens)
const allTools = loadAllMCPTools();

// Progressive: Discover as needed (2K tokens)
async function progressiveDiscovery(task: string) {
  const relevantTools = await discoverTools(task);  // 500 tokens
  const results = await executeTools(relevantTools); // 1500 tokens
  return summarize(results);                         // 200 tokens
}
```

#### Pattern: Result Summarization

```typescript
// Bad: Return full dataset (50K tokens)
return {
  data: await database.query('SELECT * FROM users')
};

// Good: Return summary (200 tokens)
return {
  summary: {
    count: 10000,
    stats: { avgAge: 32, distribution: {...} }
  }
};
```

### 2. Progressive Skills (95% Reduction)

#### Metadata-Only Loading

```markdown
<!-- Phase 1: Metadata (50 tokens) -->
---
name: "skill-name"
triggers: ["keyword1", "keyword2"]
---

<!-- Phase 2: Core (3000 tokens) - Loaded only if activated -->
# Implementation
[Detailed instructions]

<!-- Phase 3: Resources (variable) - Loaded on demand -->
## Examples
[Link to examples/ - loaded only if needed]
```

#### Lazy Example Loading

```markdown
## Examples

See [basic-example.md](examples/basic.md) - loaded only if user requests

Rather than embedding:
```typescript
// Don't embed 2000 tokens of examples here
```

### 3. Symbol Compression (30-50% Reduction)

#### Symbol Dictionary

```typescript
const symbols = {
  // Logic
  'leads_to': '→',
  'therefore': '∴',
  'because': '∵',
  
  // Status
  'completed': '✅',
  'failed': '❌',
  'warning': '⚠️',
  
  // Metrics
  'performance': '⚡',
  'security': '🛡️',
  'tokens': '💾'
};

// Before: "This leads to better performance because of caching"
// After: "This → better ⚡ ∵ caching"
// Savings: 45%
```

## Advanced Techniques

### Hierarchical Disclosure

Show summary first, details on request:

```
Summary (200 tokens):
✅ Found 15 optimization opportunities
⚡ Expected improvement: 60%
💾 Token savings: 12,000

[Request details to see all 15 optimizations - 3000 tokens]
```

### Context Compression

```typescript
interface CompressedContext {
  recent: Message[];      // Last 5 messages
  summary: string;        // Summary of older messages
  keyFacts: string[];     // Important facts to remember
}

// vs keeping all messages (100K+ tokens)
```

### Template Reuse

```typescript
// Define once (500 tokens)
const componentTemplate = loadTemplate('react-component');

// Reuse with substitution (50 tokens each)
generate(componentTemplate, { name: 'LoginForm' });
generate(componentTemplate, { name: 'SignupForm' });
// vs regenerating full template each time
```

## Optimization Metrics

### Measuring Effectiveness

```typescript
interface OptimizationMetrics {
  baseline: number;      // Tokens without optimization
  optimized: number;     // Tokens with optimization
  reduction: number;     // Percentage saved
  quality: number;       // Output quality score (0-1)
}

function calculateROI(metrics: OptimizationMetrics): number {
  const tokensSaved = metrics.baseline - metrics.optimized;
  const qualityAdjusted = tokensSaved * metrics.quality;
  return (qualityAdjusted / metrics.baseline) * 100;
}
```

### Benchmarking

```bash
# Baseline measurement
code-assistant-claude benchmark --scenario feature-implementation

# With optimizations
code-assistant-claude benchmark --scenario feature-implementation \
  --optimizations all

# Compare
code-assistant-claude compare-benchmarks baseline optimized
```

## Extreme Optimization (95%+ Reduction)

### Use Case: Bulk Operations

```typescript
// Traditional: Process each item in context
items.forEach(item => {
  const result = processInContext(item); // 2K tokens each
});
// Total: 100 items × 2K = 200K tokens

// Optimized: Process via MCP, return summary
const summary = await mcp.processBulk(items);
// Total: 500 tokens (summary only)
// Savings: 99.75%
```

### Use Case: Code Analysis

```typescript
// Traditional: Load all code in context
const allFiles = loadCodebase(); // 180K tokens

// Optimized: Progressive analysis
const summary = await mcp.analyzeCodebase({
  patterns: ['security-issues', 'performance-bottlenecks']
});
// Returns: List of issues (2K tokens)
// Savings: 98.9%
```

## Monitoring & Tuning

```typescript
class OptimizationMonitor {
  track(operation: string, tokens: number) {
    this.metrics.set(operation, {
      tokens,
      timestamp: Date.now()
    });
  }

  analyze(): OptimizationReport {
    return {
      totalTokens: this.sum(),
      breakdown: this.breakdown(),
      recommendations: this.generateRecommendations()
    };
  }

  generateRecommendations(): string[] {
    const recs = [];
    
    if (this.metrics.get('skill_loading') > 10000) {
      recs.push('Enable progressive skill loading');
    }
    
    if (this.metrics.get('mcp_overhead') > 5000) {
      recs.push('Use code execution pattern for MCPs');
    }
    
    return recs;
  }
}
```

## See Also

- [Token Optimization Guide](../user-guides/08-token-optimization.md)
- [MCP Integration](mcp-integration.md)
- [Creating Skills](creating-skills.md)
