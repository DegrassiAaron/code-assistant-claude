---
name: "research-mode"
version: "1.0.0"
description: "Deep research with multi-hop reasoning and evidence-based synthesis"
author: "SuperClaude Framework"
category: "superclaude"

triggers:
  keywords: ["research", "investigate", "analyze", "study", "compare"]
  patterns: ["research.*on", "find.*information", "learn.*about"]
  commands: ["/sc:research"]

tokenCost:
  metadata: 42
  fullContent: 2200
  resources: 300

dependencies:
  skills: []
  mcps: ["tavily", "sequential", "context7"]

composability:
  compatibleWith: ["brainstorming-mode"]
  conflictsWith: []

context:
  projectTypes: []
  minNodeVersion: "18.0.0"
  requiredTools: []

priority: "high"
autoActivate: true
cacheStrategy: "aggressive"
---

# Research Mode

Deep research with multi-hop reasoning, evidence synthesis, and citation management.

## Research Process

### 1. Query Decomposition
Break complex questions into sub-questions that can be researched independently.

### 2. Information Gathering
- **Web Search**: Use Tavily MCP for real-time information
- **Documentation**: Use Context7 MCP for official docs
- **Sequential Reasoning**: Use Sequential MCP for multi-step analysis

### 3. Source Evaluation
- Assess credibility of sources
- Cross-reference information
- Identify conflicts and discrepancies

### 4. Synthesis
- Combine findings from multiple sources
- Identify patterns and insights
- Draw evidence-based conclusions

## Output Format

```markdown
# Research Report: [Topic]

## Executive Summary
[2-3 paragraph overview of findings]

## Key Findings

### Finding 1: [Title]
[Detailed explanation]

**Evidence:**
- [Source 1] - [Citation]
- [Source 2] - [Citation]

**Confidence:** High | Medium | Low

### Finding 2: [Title]
[Detailed explanation]

**Evidence:**
- [Source 1] - [Citation]
- [Source 2] - [Citation]

**Confidence:** High | Medium | Low

## Comparative Analysis

| Aspect | Option A | Option B | Option C |
|--------|----------|----------|----------|
| [Criterion 1] | [Value] | [Value] | [Value] |
| [Criterion 2] | [Value] | [Value] | [Value] |

## Recommendations

1. **[Recommendation 1]**
   - Rationale: [Why]
   - Trade-offs: [Pros/Cons]

2. **[Recommendation 2]**
   - Rationale: [Why]
   - Trade-offs: [Pros/Cons]

## Sources

1. [Source 1 Title] - [URL] - [Credibility: High/Medium/Low]
2. [Source 2 Title] - [URL] - [Credibility: High/Medium/Low]
3. [Source 3 Title] - [URL] - [Credibility: High/Medium/Low]

## Further Reading

- [Resource 1]
- [Resource 2]
- [Resource 3]
```

## Confidence Scoring

- **High (>80%)**: Multiple credible sources agree, recent information
- **Medium (50-80%)**: Some agreement, or single credible source
- **Low (<50%)**: Conflicting information or limited sources

## Integration

Essential MCPs:
- **Tavily**: Real-time web search
- **Sequential**: Multi-step reasoning
- **Context7**: Official documentation lookup

Works with:
- Brainstorming Mode (after requirements discovery)
- Orchestration Mode (for implementation planning)
