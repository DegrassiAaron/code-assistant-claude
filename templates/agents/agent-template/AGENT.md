# Agent Template

This template provides the standard structure for creating specialized agents in the Code Assistant Claude system.

## Template Structure

```markdown
---
name: "agent-name"
description: "Brief description of agent's specialization"
category: "technical|business"
expertise: ["domain1", "domain2", "domain3"]

activation:
  keywords: ["keyword1", "keyword2", "keyword3"]
  complexity: ["simple", "moderate", "complex"]
  triggers: ["task_type1", "task_type2"]

capabilities:
  - Capability 1 description
  - Capability 2 description
  - Capability 3 description

integrations:
  skills: ["skill1", "skill2"]
  mcps: ["mcp1", "mcp2"]
  other_agents: ["agent1", "agent2"]
---

# [Agent Name] - [Role/Specialization]

## Overview

[Brief description of what this agent does and when to use it]

## Expertise Areas

### [Area 1]
[Detailed description]

### [Area 2]
[Detailed description]

### [Area 3]
[Detailed description]

## Analysis Framework

### Step 1: [Initial Analysis]
[Description of first step]

### Step 2: [Deep Dive]
[Description of second step]

### Step 3: [Recommendations]
[Description of third step]

## Communication Style

- [Style trait 1]
- [Style trait 2]
- [Style trait 3]

## Example Outputs

### Example 1: [Scenario Name]

**Input**: [Example input]

**Analysis**:
[Example analysis output]

**Recommendations**:
- [Recommendation 1]
- [Recommendation 2]

### Example 2: [Scenario Name]

**Input**: [Example input]

**Analysis**:
[Example analysis output]

**Recommendations**:
- [Recommendation 1]
- [Recommendation 2]

## Integration Patterns

### With Skills
[How this agent integrates with skills]

### With MCPs
[How this agent integrates with MCPs]

### With Other Agents
[How this agent coordinates with other agents]

## Best Practices

1. [Best practice 1]
2. [Best practice 2]
3. [Best practice 3]

## Common Pitfalls to Avoid

- [Pitfall 1]
- [Pitfall 2]
- [Pitfall 3]

## Token Optimization

- [Optimization strategy 1]
- [Optimization strategy 2]
- [Optimization strategy 3]
```

## Creating a New Agent

1. **Copy this template** to `templates/agents/[agent-name]-agent.md`
2. **Fill in the frontmatter** with appropriate metadata
3. **Customize sections** based on the agent's specialization
4. **Add concrete examples** showing the agent in action
5. **Define integration patterns** with skills, MCPs, and other agents
6. **Test the agent** with real-world scenarios
7. **Document token usage** and optimization strategies

## Metadata Guidelines

### name
- Use kebab-case (e.g., "code-reviewer", "security-auditor")
- Keep it concise and descriptive
- Should match the filename

### description
- One sentence describing the agent's primary purpose
- Focus on the value it provides

### category
- **technical**: For code-focused agents (review, testing, debugging, etc.)
- **business**: For strategy-focused agents (analysis, planning, etc.)

### expertise
- List 3-5 core competency areas
- Be specific (e.g., "Test-Driven Development" not just "Testing")

### activation.keywords
- Words/phrases that should trigger this agent
- Include variations and synonyms
- Be specific enough to avoid false positives

### activation.complexity
- **simple**: Basic, straightforward tasks
- **moderate**: Medium complexity, requires some analysis
- **complex**: High complexity, requires deep expertise

### activation.triggers
- Task types that activate this agent
- Examples: "code_review", "security_audit", "performance_optimization"

### capabilities
- List specific things this agent can do
- Be concrete and actionable
- Focus on outcomes, not processes

### integrations
- **skills**: Related progressive skills
- **mcps**: MCP servers this agent commonly uses
- **other_agents**: Agents this one frequently coordinates with

## Example Usage

See the specialized agents in `/templates/agents/` for concrete examples:
- `code-reviewer-agent.md` - Technical agent example
- `business-panel/AGENT.md` - Business agent example
