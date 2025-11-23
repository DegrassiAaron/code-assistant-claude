---
name: "sc-brainstorm"
description: "Creative ideation with divergent and convergent thinking"
category: "superclaude"
version: "1.0.0"

triggers:
  exact: "/sc:brainstorm"
  aliases: ["/brainstorm", "/ideate"]
  keywords: ["brainstorm", "ideation", "creative thinking"]

requires:
  skills: ["creative-thinking"]
  mcps: ["sequential", "tavily"]

parameters:
  - name: "topic"
    type: "string"
    required: true
    description: "Brainstorming topic or challenge"
  - name: "count"
    type: "number"
    required: false
    default: 20
    description: "Number of ideas to generate"
  - name: "technique"
    type: "string"
    required: false
    default: "scamper"
    options: ["scamper", "lateral", "reverse", "analogies", "random"]

autoExecute: true
tokenEstimate: 10000
executionTime: "15-30s"
---

# /sc:brainstorm - Creative Ideation

Advanced brainstorming using proven creativity techniques and frameworks.

## Brainstorming Techniques

### SCAMPER (Default)
- **S**ubstitute: What can be replaced?
- **C**ombine: What can be merged?
- **A**dapt: What can be adjusted?
- **M**odify: What can be changed?
- **P**ut to other uses: Alternative applications?
- **E**liminate: What can be removed?
- **R**everse: What can be flipped?

### Lateral Thinking
- Challenge assumptions
- Random word stimulation
- Alternative perspectives
- Provocative operations

### Reverse Brainstorming
- How to make problem worse?
- Reverse those ideas
- Find innovative solutions

### Analogies
- Find similar problems in nature
- Apply solutions from other domains
- Cross-industry inspiration

### Random Stimulation
- Random word associations
- Forced connections
- Unexpected combinations

## Execution Flow

### 1. Problem Framing
- Clarify the challenge
- Identify constraints
- Set success criteria
- Define scope

### 2. Divergent Thinking Phase

Generate {count} ideas using {technique}:

**Idea Generation Rules**:
- No criticism or evaluation
- Encourage wild ideas
- Build on others' ideas
- Aim for quantity over quality
- Defer judgment

**Output Format**:
```
💡 Brainstorming Session: {topic}

Technique: {technique}
Target: {count} ideas
Duration: 15-30 seconds

Ideas Generated:
1. [Idea 1] - Brief description
2. [Idea 2] - Brief description
3. [Idea 3] - Brief description
...
20. [Idea 20] - Brief description
```

### 3. Convergent Thinking Phase

Evaluate and cluster ideas:

**Evaluation Criteria**:
- ✅ Feasibility (1-5)
- ✅ Impact (1-5)
- ✅ Novelty (1-5)
- ✅ Cost (low/medium/high)

**Clustering**:
- Group similar ideas
- Identify patterns
- Find themes
- Combine complementary ideas

### 4. Refinement

Top ideas refined:

```
🌟 Top 5 Ideas

1. [Idea Name] - Score: 14/15
   Feasibility: ⭐⭐⭐⭐⭐
   Impact: ⭐⭐⭐⭐⭐
   Novelty: ⭐⭐⭐⭐
   Cost: Low

   Description: [Detailed explanation]
   Implementation: [How to execute]
   Risks: [Potential challenges]
   Next Steps: [Action items]

2. [Idea Name] - Score: 13/15
   ...
```

## Examples

### Product Feature Brainstorming
```bash
/sc:brainstorm "new features for task management app" --count=30

# Generates:
# - 30 feature ideas using SCAMPER
# - Evaluation matrix
# - Top 5 refined ideas with implementation plans
```

### Problem Solving
```bash
/sc:brainstorm "reduce customer churn" --technique=reverse

# Approach:
# 1. How to increase churn? (reverse thinking)
# 2. Reverse those ideas
# 3. Find preventive solutions
```

### Creative Naming
```bash
/sc:brainstorm "name for AI coding assistant" --count=50 --technique=analogies

# Generates:
# - 50 name ideas inspired by analogies
# - Availability check
# - Brand analysis
```

### Innovation Strategy
```bash
/sc:brainstorm "disrupt traditional education" --technique=lateral

# Generates:
# - Lateral thinking perspectives
# - Challenge assumptions
# - Innovative approaches
```

## Ideation Frameworks

### Design Thinking
1. Empathize with users
2. Define the problem
3. Ideate solutions
4. Prototype concepts
5. Test and iterate

### Six Thinking Hats
- 🎩 White: Facts and data
- 🎩 Red: Emotions and intuition
- 🎩 Black: Critical judgment
- 🎩 Yellow: Optimism and benefits
- 🎩 Green: Creativity and ideas
- 🎩 Blue: Process control

### First Principles Thinking
1. Identify assumptions
2. Break down to fundamentals
3. Reason up from basics
4. Create novel solutions

## Output Deliverables

### Idea Catalog
```markdown
# Brainstorming Results: {topic}

## Summary
- Total ideas generated: {count}
- Technique used: {technique}
- Session duration: {duration}
- Top ideas: 5

## All Ideas (by category)

### Category 1: [Name]
1. Idea 1
2. Idea 2
...

### Category 2: [Name]
1. Idea 3
2. Idea 4
...

## Evaluation Matrix

| Idea | Feasibility | Impact | Novelty | Cost | Total |
|------|------------|--------|---------|------|-------|
| Idea 1 | 5 | 5 | 4 | Low | 14/15 |
| Idea 2 | 4 | 5 | 4 | Med | 13/15 |

## Top 5 Recommendations
[Detailed breakdown of top ideas]

## Next Steps
[Action items to move forward]
```

## Integration

### With Skills
- creative-thinking: Ideation techniques
- business-analysis: Idea evaluation
- research: Market validation

### With MCPs
- Sequential: Multi-step ideation process
- Tavily: Research similar solutions
- Context7: Document existing ideas

## Configuration

`.claude/settings.json`:
```json
{
  "commands": {
    "sc-brainstorm": {
      "defaultTechnique": "scamper",
      "defaultCount": 20,
      "autoEvaluate": true,
      "includeMarketResearch": true
    }
  }
}
```

## Success Metrics

- Ideas generated per minute: >20
- Idea quality score: >7/10
- Novelty rate: >40%
- Actionable ideas: >60%
- User satisfaction: >4.5/5
