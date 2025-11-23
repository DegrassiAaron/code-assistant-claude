---
name: "performance-optimizer"
version: "1.0.0"
description: "Identifies and optimizes performance bottlenecks in code and architecture"
author: "Code-Assistant-Claude"
category: "core"

triggers:
  keywords: ["performance", "optimize", "slow", "bottleneck"]
  patterns: ["improve.*performance", "optimize.*code"]
  filePatterns: ["*.ts", "*.js", "*.tsx", "*.jsx"]
  commands: ["/sc:optimize"]

tokenCost:
  metadata: 38
  fullContent: 1700
  resources: 450

dependencies:
  skills: []
  mcps: ["chrome-devtools"]

composability:
  compatibleWith: ["code-reviewer"]
  conflictsWith: []

context:
  projectTypes: ["javascript", "typescript", "react", "nodejs"]
  minNodeVersion: "18.0.0"
  requiredTools: []

priority: "medium"
autoActivate: false
cacheStrategy: "normal"
---

# Performance Optimizer Skill

Analyzes and optimizes code performance across multiple dimensions.

## Optimization Areas

### 1. Algorithm Complexity
- Time complexity analysis
- Space complexity analysis
- Suggest better algorithms

### 2. React Performance
- Unnecessary re-renders
- Missing memoization opportunities
- Large bundle sizes
- Virtual scrolling for long lists

### 3. Network Performance
- API call optimization
- Request batching
- Caching strategies
- Lazy loading

### 4. Memory Management
- Memory leaks
- Inefficient data structures
- Garbage collection optimization

### 5. Build Optimization
- Code splitting
- Tree shaking
- Minification
- Compression

## Performance Metrics

```
⚡ Performance Analysis
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔴 SLOW (>100ms)
- API call in useEffect causing cascading renders
- Unoptimized filter in render method

🟡 MODERATE (50-100ms)
- Large JSON parsing in component
- Complex calculation without memoization

🟢 FAST (<50ms)
- Most rendering operations
- Event handlers

💡 RECOMMENDATIONS
1. Use useMemo for expensive calculations
2. Implement virtual scrolling for large lists
3. Add debouncing to search input
4. Enable code splitting for routes
```

## Optimization Patterns

### React.memo
```typescript
const ExpensiveComponent = React.memo(({ data }) => {
  // Component implementation
});
```

### useMemo
```typescript
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);
```

### useCallback
```typescript
const handleClick = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

## Integration

Works with:
- Chrome DevTools
- React DevTools Profiler
- Lighthouse
- webpack-bundle-analyzer
