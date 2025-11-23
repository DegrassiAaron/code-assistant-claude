# Agent System Architecture

This document provides architectural diagrams and technical details for the multi-agent orchestration system.

## Table of Contents

- [System Overview](#system-overview)
- [Agent Selection Flow](#agent-selection-flow)
- [Coordination Strategies](#coordination-strategies)
- [Hierarchical Dependency Resolution](#hierarchical-dependency-resolution)
- [Token Management](#token-management)
- [Error Handling & Resilience](#error-handling--resilience)

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      Agent Orchestration System                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐  │
│  │   Agent      │      │  Multi-Agent │      │    Agent     │  │
│  │  Selector    │──────│  Coordinator │──────│   Registry   │  │
│  └──────────────┘      └──────────────┘      └──────────────┘  │
│         │                      │                      │          │
│         │                      │                      │          │
│         ▼                      ▼                      ▼          │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐  │
│  │   Scoring    │      │  Execution   │      │    Agent     │  │
│  │   Engine     │      │   Policies   │      │    Loader    │  │
│  └──────────────┘      └──────────────┘      └──────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Token Counter                         │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Logger (Observability)                │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Key Components:**
- **Agent Orchestrator**: Main entry point for agent operations
- **Agent Selector**: Matches agents to user queries using weighted scoring
- **Multi-Agent Coordinator**: Manages execution strategies (sequential, parallel, hierarchical)
- **Agent Registry**: Caches and manages available agents
- **Agent Loader**: Loads agents from markdown files with YAML frontmatter
- **Token Counter**: Accurate token estimation for LLM usage
- **Logger**: Structured logging for observability

---

## Agent Selection Flow

```
User Query
    │
    ▼
┌─────────────────────────────┐
│  Parse Selection Criteria   │
│  • query: string            │
│  • category?: technical|bus │
│  • complexity?: level       │
│  • maxAgents?: number       │
└─────────────────────────────┘
    │
    ▼
┌─────────────────────────────┐
│   Filter Agents by          │
│   • Category                │
│   • Complexity              │
│   • Required Expertise      │
└─────────────────────────────┘
    │
    ▼
┌─────────────────────────────┐
│   Score Each Agent          │
│                             │
│   Weights:                  │
│   • KEYWORD:     10         │
│   • TRIGGER:     8          │
│   • EXPERTISE:   6          │
│   • CAPABILITY:  4          │
└─────────────────────────────┘
    │
    ▼
┌─────────────────────────────┐
│   Check Score Cache         │
│   (agentName:queryLower)    │
└─────────────────────────────┘
    │
    ├─── Cache Hit ───┐
    │                 │
    │                 ▼
    │         ┌────────────────┐
    │         │ Return Cached  │
    │         │     Score      │
    │         └────────────────┘
    │
    ├─── Cache Miss ──┐
    │                 │
    │                 ▼
    │         ┌────────────────┐
    │         │  Calculate     │
    │         │  Score & Cache │
    │         └────────────────┘
    │
    ▼
┌─────────────────────────────┐
│   Sort by Score (DESC)      │
│   Filter score > 0          │
└─────────────────────────────┘
    │
    ▼
┌─────────────────────────────┐
│   Limit to maxAgents        │
└─────────────────────────────┘
    │
    ▼
Return AgentSelectionResult[]
```

**Selection Algorithm:**
1. Apply filters (category, complexity, required expertise)
2. Score each agent based on query match
3. Check cache for previous score
4. Sort by relevance score
5. Limit results

---

## Coordination Strategies

### Sequential Strategy

```
Start
  │
  ▼
┌─────────────────┐
│  Agent 1        │──── Execute
└─────────────────┘
  │
  ├─── Success ────┐
  │                │
  │                ▼
  │         ┌─────────────────┐
  │         │  Agent 2        │──── Execute
  │         └─────────────────┘
  │                │
  │                ├─── Success ────┐
  │                │                │
  │                │                ▼
  │                │         ┌─────────────────┐
  │                │         │  Agent 3        │──── Execute
  │                │         └─────────────────┘
  │                │                │
  │                │                ▼
  │                │              Done
  │                │
  │                └─── Failure ──┐
  │                                │
  ├─── Failure ──┐                │
                  │                │
                  ▼                ▼
           ┌──────────────────────────┐
           │   Check Policy:          │
           │   • continueOnError?     │
           │   • failureCount < max?  │
           └──────────────────────────┘
                  │
                  ├─── Continue ──► Next Agent
                  │
                  └─── Stop ──────► Return Results
```

**Use Cases:**
- Workflows with dependencies between steps
- When order matters (e.g., analyze → review → refactor)
- Limited resources (one agent at a time)

### Parallel Strategy

```
Start
  │
  └──────┬────────┬────────┬────────┬───────┐
         │        │        │        │       │
         ▼        ▼        ▼        ▼       ▼
    ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐
    │Agent 1│ │Agent 2│ │Agent 3│ │Agent 4│ │Agent 5│
    └───────┘ └───────┘ └───────┘ └───────┘ └───────┘
         │        │        │        │       │
         └────────┴────────┴────────┴───────┘
                        │
                        ▼
                ┌───────────────┐
                │ Batching with │
                │ maxConcurrent │
                └───────────────┘
                        │
         ┌──────────────┼──────────────┐
         │              │              │
         ▼              ▼              ▼
    Batch 1         Batch 2       Batch 3
    (5 agents)      (5 agents)    (remaining)
         │              │              │
         └──────────────┴──────────────┘
                        │
                        ▼
                  Aggregate Results
```

**Concurrency Control:**
```python
maxConcurrent = 5  # Default limit

for i in range(0, len(agents), maxConcurrent):
    batch = agents[i : i + maxConcurrent]
    results = await Promise.all(batch.map(execute))
    aggregate(results)
```

**Use Cases:**
- Independent agent tasks
- Time-sensitive operations (maximize throughput)
- Multiple perspectives on same input

### Hierarchical Strategy

```
                    ┌──────────────┐
                    │  Agent Root  │
                    │  (no deps)   │
                    └──────────────┘
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
       ┌──────────────┐          ┌──────────────┐
       │  Agent A     │          │  Agent B     │
       │  deps: [root]│          │  deps: [root]│
       └──────────────┘          └──────────────┘
              │                         │
              └────────────┬────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  Agent C     │
                    │  deps: [A,B] │
                    └──────────────┘
```

**Dependency Resolution Algorithm:**
```
dependencies = Map<agentName, dependentAgentNames[]>
executed = Set<agentName>
iterations = 0
maxIterations = agents.length * 2

while (executed.size < agents.length):
    iterations++

    if iterations > maxIterations:
        throw Error("Circular dependency detected")

    sizeBefore = executed.size
    readyAgents = agents.filter(a =>
        !executed.has(a.name) &&
        all(a.dependencies).in(executed)
    )

    await Promise.all(readyAgents.map(execute))

    if executed.size === sizeBefore:
        throw Error("No progress - circular dependency")

return results
```

**Safety Mechanisms:**
- Progress tracking (sizeBefore vs. current size)
- Iteration limit (agents.length * 2)
- Explicit circular dependency detection

**Use Cases:**
- Complex workflows with clear dependencies
- Build systems (compile → test → deploy)
- Multi-stage analysis (gather → process → synthesize)

---

## Hierarchical Dependency Resolution

### Example: Code Review Workflow

```
User Request: "Review code for quality, security, and performance"
                                │
                                ▼
                        ┌───────────────┐
                        │  Iteration 1  │
                        └───────────────┘
                                │
                    ┌───────────┼───────────┐
                    │                       │
                    ▼                       ▼
            ┌──────────────┐        ┌──────────────┐
            │Code Reviewer │        │Test Engineer │
            │(no deps)     │        │(no deps)     │
            └──────────────┘        └──────────────┘
                    │                       │
                    └───────────┬───────────┘
                                │
                                ▼
                        ┌───────────────┐
                        │  Iteration 2  │
                        └───────────────┘
                                │
            ┌───────────────────┼───────────────────┐
            │                   │                   │
            ▼                   ▼                   ▼
    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
    │Security      │    │Performance   │    │Docs Writer   │
    │Auditor       │    │Tuner         │    │              │
    │deps:[CR]     │    │deps:[CR]     │    │deps:[CR,TE]  │
    └──────────────┘    └──────────────┘    └──────────────┘
            │                   │                   │
            └───────────────────┴───────────────────┘
                                │
                                ▼
                        ┌───────────────┐
                        │  Iteration 3  │
                        └───────────────┘
                                │
                                ▼
                        ┌──────────────┐
                        │Refactor      │
                        │Expert        │
                        │deps:[SA,PT]  │
                        └──────────────┘
                                │
                                ▼
                            Complete
```

### Circular Dependency Detection

```
Scenario: Agent A → Agent B → Agent A

Iteration 1:
  readyAgents = []  (A needs B, B needs A)
  executed = {}
  sizeBefore = 0
  sizeAfter = 0  ← No progress!

  Error: "Circular dependency detected. Unable to execute: A, B"
```

---

## Token Management

```
┌─────────────────────────────────────────────────────────────┐
│                     Token Counter                           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Input: Agent Output Text                                    │
│     │                                                         │
│     ▼                                                         │
│  ┌───────────────────────────────┐                          │
│  │ Detect Content Type           │                          │
│  │ • Code blocks (```)           │                          │
│  │ • Indented code (4 spaces)    │                          │
│  └───────────────────────────────┘                          │
│     │                                                         │
│     ├─── Code ────────┐                                      │
│     │                 │                                      │
│     │                 ▼                                      │
│     │         charPerToken = 3                               │
│     │                                                         │
│     └─── Prose ───────┐                                      │
│                       │                                      │
│                       ▼                                      │
│                charPerToken = 4                               │
│                                                               │
│  ┌───────────────────────────────┐                          │
│  │ Calculate Metrics:            │                          │
│  │ • Word count                  │                          │
│  │ • Character count             │                          │
│  │ • Punctuation count           │                          │
│  └───────────────────────────────┘                          │
│     │                                                         │
│     ▼                                                         │
│  charBasedTokens = chars / charPerToken                      │
│  wordBasedTokens = words + (punctuation / 2)                 │
│     │                                                         │
│     ▼                                                         │
│  estimatedTokens = (charBased + wordBased) / 2               │
│     │                                                         │
│     ▼                                                         │
│  Return: ceil(estimatedTokens)                               │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**Token Estimation Examples:**
```typescript
// Prose text (charPerToken = 4)
"This is a simple test." → ~5 tokens

// Code block (charPerToken = 3)
"```typescript\nfunction test() {}\n```" → ~8 tokens

// Mixed content
Uses weighted average based on content ratio
```

---

## Error Handling & Resilience

### Execution Policy

```typescript
interface ExecutionPolicy {
  continueOnError: boolean;    // Continue after failures?
  maxFailures?: number;        // Max failures before stopping
  timeout?: number;            // Per-agent timeout (ms)
  maxConcurrent?: number;      // Max parallel agents
}

const DEFAULT_POLICY = {
  continueOnError: true,
  maxFailures: undefined,      // No limit
  timeout: 30000,              // 30 seconds
  maxConcurrent: 5,            // 5 agents
};
```

### Timeout Handling

```
Agent Execution
    │
    ▼
┌─────────────────────────────────┐
│  Promise.race([                 │
│    executionPromise,            │
│    timeoutPromise               │
│  ])                             │
└─────────────────────────────────┘
    │
    ├─── Execution Completes First ──┐
    │                                 │
    │                                 ▼
    │                          ┌─────────────┐
    │                          │  Success!   │
    │                          │  Return     │
    │                          │  Result     │
    │                          └─────────────┘
    │
    └─── Timeout Completes First ────┐
                                      │
                                      ▼
                               ┌─────────────┐
                               │  Timeout    │
                               │  Error      │
                               │  Return     │
                               │  Failure    │
                               └─────────────┘
```

### Failure Handling Flow

```
Agent Fails
    │
    ▼
┌─────────────────────────────┐
│  Check Policy:              │
│  continueOnError?           │
└─────────────────────────────┘
    │
    ├─── false ────► Stop Execution
    │                Return Partial Results
    │
    └─── true ─────► Continue
                      │
                      ▼
              ┌─────────────────────────────┐
              │  Increment failureCount     │
              └─────────────────────────────┘
                      │
                      ▼
              ┌─────────────────────────────┐
              │  Check:                     │
              │  failureCount >= maxFailures│
              └─────────────────────────────┘
                      │
                      ├─── true ─► Stop Execution
                      │
                      └─── false ─► Continue to Next
```

---

## Cache Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Score Cache                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Key: "agentName:queryLowerCase"                             │
│  Value: number (score)                                       │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Map<string, number>                                   │ │
│  │                                                          │ │
│  │  "code-reviewer:security audit" → 28                   │ │
│  │  "code-reviewer:code review" → 30                      │ │
│  │  "security-auditor:security audit" → 32                │ │
│  │  "test-engineer:testing strategy" → 26                 │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
│  Cache Hit Rate: High for repeated queries                   │
│  Invalidation: Manual (clearCache())                         │
│  Thread Safety: Single-threaded (JavaScript)                 │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**Cache Benefits:**
- Avoid redundant scoring calculations
- Faster response for repeated queries
- Reduced CPU usage

**Trade-offs:**
- Memory usage grows with unique query/agent combinations
- No automatic invalidation (manual clear required)
- Case-insensitive keys (normalized to lowercase)

---

## Component Interactions

```
┌──────────────┐
│     User     │
└──────────────┘
       │
       │ query
       ▼
┌──────────────────────────────────────────────────────────┐
│              AgentOrchestrator                           │
│                                                            │
│  selectAgents(criteria) ──────────────┐                  │
│                                        │                  │
│  executeAgent(agent, context) ────┐   │                  │
│                                    │   │                  │
│  executeMultiAgent(agents, ctx) ──┼───┼─────┐            │
│                                    │   │     │            │
└────────────────────────────────────┼───┼─────┼───────────┘
                                     │   │     │
                                     │   │     │
                  ┌──────────────────┘   │     └────────────────┐
                  │                      │                       │
                  ▼                      ▼                       ▼
         ┌────────────────┐    ┌────────────────┐    ┌────────────────┐
         │ Execute Single │    │ AgentSelector  │    │MultiAgent      │
         │     Agent      │    │                │    │Coordinator     │
         └────────────────┘    │ • Score        │    │                │
                  │             │ • Filter       │    │ • Create Plan  │
                  │             │ • Cache        │    │ • Execute Plan │
                  │             └────────────────┘    └────────────────┘
                  │                      │                       │
                  ▼                      ▼                       ▼
         ┌────────────────┐    ┌────────────────┐    ┌────────────────┐
         │  TokenCounter  │    │ AgentRegistry  │    │  Strategies:   │
         │                │    │                │    │  • Sequential  │
         │ countTokens()  │    │ getAgent()     │    │  • Parallel    │
         └────────────────┘    │ getAllAgents() │    │  • Hierarchical│
                               └────────────────┘    └────────────────┘
                                        │
                                        ▼
                               ┌────────────────┐
                               │  AgentLoader   │
                               │                │
                               │ loadAgent()    │
                               │ parseFrontmatter│
                               └────────────────┘
```

---

## Observability & Logging

```
┌─────────────────────────────────────────────────────────────┐
│                    Structured Logging                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Log Entry Format:                                           │
│  [timestamp] [LEVEL] [Context] message {metadata}            │
│                                                               │
│  Example:                                                    │
│  [2025-01-15T10:30:45Z] [INFO] [AgentOrchestrator]          │
│    Executing agent sequentially                              │
│    { agent: "code-reviewer", timeout: 30000 }                │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Log Levels:                                          │  │
│  │                                                         │  │
│  │  DEBUG   ─── Internal state, cache hits, scores      │  │
│  │  INFO    ─── Major operations, completions           │  │
│  │  WARN    ─── Recoverable errors, missing data        │  │
│  │  ERROR   ─── Failures, exceptions                     │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  Contexts:                                                   │
│  • AgentOrchestrator                                         │
│  • AgentSelector                                             │
│  • MultiAgentCoordinator                                     │
│  • AgentRegistry                                             │
│  • AgentLoader                                               │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**Key Metrics Logged:**
- Agent selection (query, count, scores)
- Execution duration
- Token usage
- Failure counts
- Cache hit/miss
- Dependency resolution iterations

---

## Performance Characteristics

### Time Complexity

| Operation | Best Case | Average Case | Worst Case |
|-----------|-----------|--------------|------------|
| Agent Selection | O(n) | O(n log n) | O(n log n) |
| Sequential Execution | O(n) | O(n) | O(n) |
| Parallel Execution | O(n/c) | O(n/c) | O(n/c) |
| Hierarchical Execution | O(n) | O(n²) | O(n²) |
| Cache Lookup | O(1) | O(1) | O(1) |

Where:
- n = number of agents
- c = maxConcurrent limit

### Space Complexity

| Component | Space Usage |
|-----------|-------------|
| Agent Registry | O(n) where n = total agents |
| Score Cache | O(q × a) where q = unique queries, a = agents |
| Execution Results | O(n) where n = executed agents |
| Dependency Graph | O(n + e) where e = edges |

---

## Best Practices

### 1. Agent Selection
- Use specific keywords in queries for better matching
- Set appropriate maxAgents limit (3-5 optimal)
- Specify category when known (technical vs. business)

### 2. Coordination Strategy
- **Sequential**: Use for dependent workflows
- **Parallel**: Use for independent tasks (set maxConcurrent appropriately)
- **Hierarchical**: Use for complex DAG workflows (ensure no circular deps)

### 3. Error Handling
- Set continueOnError=true for exploratory tasks
- Set maxFailures for critical workflows
- Use appropriate timeouts (default 30s)

### 4. Performance
- Leverage cache for repeated queries (call clearCache() when agents change)
- Use parallel execution with concurrency limits (default 5)
- Monitor token usage to stay within budget

### 5. Observability
- Enable logging in production
- Monitor key metrics (duration, tokens, failures)
- Use log entries for debugging and optimization

---

## Future Enhancements

- [ ] Dynamic timeout adjustment based on agent complexity
- [ ] Adaptive concurrency limits based on system load
- [ ] Agent result streaming for real-time feedback
- [ ] Retry mechanisms with exponential backoff
- [ ] Persistent caching with TTL
- [ ] Agent versioning and A/B testing
- [ ] Circuit breaker pattern for failing agents
- [ ] Distributed agent execution across workers
