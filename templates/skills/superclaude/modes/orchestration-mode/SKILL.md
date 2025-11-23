---
name: "orchestration-mode"
version: "1.0.0"
description: "Intelligent tool selection and parallel execution orchestration"
author: "SuperClaude Framework"
category: "superclaude"

triggers:
  keywords: ["implement", "build", "create", "develop"]
  patterns: ["build.*feature", "implement.*system"]
  commands: ["/sc:implement", "/sc:orchestrate"]

tokenCost:
  metadata: 38
  fullContent: 1600
  resources: 250

dependencies:
  skills: []
  mcps: ["serena", "sequential"]

composability:
  compatibleWith: ["research-mode", "task-management-mode"]
  conflictsWith: []

context:
  projectTypes: []
  minNodeVersion: "18.0.0"
  requiredTools: []

priority: "high"
autoActivate: true
cacheStrategy: "aggressive"
---

# Orchestration Mode

Optimal tool selection, parallel execution, and efficient resource utilization.

## Core Capabilities

### 1. Tool Selection
Automatically selects the best tools and skills for each task:
- Analyzes task requirements
- Matches to available skills/MCPs
- Considers dependencies and conflicts
- Optimizes for token efficiency

### 2. Parallel Execution
Executes independent tasks concurrently:
- Identifies parallelizable operations
- Manages execution order based on dependencies
- Monitors and aggregates results

### 3. Resource Management
Optimizes resource utilization:
- Token budget allocation
- Skill loading/unloading
- Cache management
- MCP activation timing

## Orchestration Flow

```
Task Input
    ↓
1. Task Analysis
   - Break down into subtasks
   - Identify dependencies
   - Estimate complexity
    ↓
2. Resource Selection
   - Match skills to subtasks
   - Select required MCPs
   - Check composability
    ↓
3. Execution Planning
   - Create dependency graph
   - Identify parallel paths
   - Allocate token budget
    ↓
4. Execution
   - Activate required skills
   - Execute in optimal order
   - Monitor progress
    ↓
5. Synthesis
   - Aggregate results
   - Validate completeness
   - Generate output
```

## Example: Feature Implementation

```
User: "Implement user authentication with OAuth2"

Orchestration Mode:
1. Analysis
   ✓ Backend API endpoints
   ✓ Frontend login UI
   ✓ Token management
   ✓ Security validation

2. Resource Selection
   Skills: code-reviewer, test-generator, security-auditor
   MCPs: serena (memory), sequential (reasoning)

3. Execution Plan
   Parallel Path 1: Backend implementation
   Parallel Path 2: Frontend implementation
   Sequential: Security audit → Testing

4. Execution
   [Backend + Frontend in parallel]
   → [Security audit]
   → [Test generation]
   → [Code review]

5. Output
   ✓ Complete OAuth2 implementation
   ✓ Security validated
   ✓ Tests generated (>80% coverage)
   ✓ Code reviewed
```

## Token Budget Management

```
Total Budget: 50,000 tokens

Allocation:
- Task analysis: 2,000 (4%)
- Skills (3 activated): 6,000 (12%)
- Implementation: 35,000 (70%)
- Testing: 5,000 (10%)
- Review: 2,000 (4%)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total: 50,000 (100%)
```

## Integration

Essential for:
- Complex feature implementation
- Multi-component systems
- Parallel task execution
- Resource-constrained environments
