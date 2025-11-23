---
name: "sc-business-panel"
description: "Multi-expert business analysis with 9 thought leaders"
category: "superclaude"
version: "1.0.0"

triggers:
  exact: "/sc:business-panel"
  aliases: ["/business", "/strategy"]
  keywords: ["strategic", "business analysis", "market"]

requires:
  skills: ["business-panel"]
  mcps: ["sequential"]

parameters:
  - name: "document"
    type: "string"
    required: true
    description: "Document path or analysis topic"
  - name: "mode"
    type: "string"
    required: false
    default: "discussion"
    options: ["discussion", "debate", "socratic"]
  - name: "experts"
    type: "array"
    required: false
    description: "Specific experts to include (auto-select if not provided)"

autoExecute: true
tokenEstimate: 12000
executionTime: "20-40s"
---

# /sc:business-panel - Strategic Analysis

Multi-expert business analysis using 9 renowned thought leaders.

## Experts Available

1. **CHRISTENSEN** - Disruption theory, jobs-to-be-done
2. **PORTER** - Competitive strategy, five forces
3. **DRUCKER** - Management fundamentals
4. **GODIN** - Marketing, remarkability
5. **KIM/MAUBORGNE** - Blue ocean strategy
6. **COLLINS** - Organizational excellence
7. **TALEB** - Antifragility, risk
8. **MEADOWS** - Systems thinking
9. **DOUMONT** - Communication clarity

## Analysis Modes

### Discussion Mode (Default)
Collaborative multi-perspective analysis through complementary frameworks.

```
User: /sc:business-panel @product_strategy.pdf

Output:
PORTER: Five forces analysis reveals...
CHRISTENSEN building on PORTER: From JTBD perspective...
MEADOWS: System dynamics suggest...

Synthesis:
✅ Convergent insights
⚖️ Productive tensions
🕸️ System patterns
```

### Debate Mode
Stress-test ideas through structured disagreement.

```
User: /sc:business-panel @risky_decision.md --mode debate

Output:
COLLINS: Evidence suggests we should...
TALEB challenges COLLINS: But consider the downside risk...
MEADOWS on system dynamics: This debate reveals...
```

### Socratic Mode
Develop strategic thinking through expert-guided questions.

```
User: /sc:business-panel "market entry strategy" --mode socratic

Output:
Panel Questions:
• CHRISTENSEN: What job is this being hired to do?
• PORTER: What prevents competitive copying?
• TALEB: What are the tail risks?
```

## Auto-Expert Selection

Based on document content analysis:
- **Strategy documents** → Porter, Kim/Mauborgne, Collins, Meadows
- **Innovation topics** → Christensen, Drucker, Godin
- **Risk analysis** → Taleb, Meadows, Porter
- **Organizational** → Collins, Drucker, Meadows

## Execution Flow

### 1. Document Analysis
- Read and parse document/topic
- Identify key themes
- Extract strategic questions
- Determine relevant experts

### 2. Expert Selection
If experts not specified:
- Analyze document content
- Map to expert frameworks
- Select 3-5 most relevant experts
- Ensure diverse perspectives

### 3. Multi-Expert Analysis

**Discussion Mode**:
1. Each expert analyzes from their framework
2. Experts build on each other's insights
3. Identify convergences and tensions
4. Synthesize integrated perspective

**Debate Mode**:
1. Present initial positions
2. Challenge and counter-arguments
3. Evidence-based rebuttals
4. Moderator synthesis

**Socratic Mode**:
1. Experts formulate probing questions
2. User answers guide next questions
3. Deeper understanding through inquiry
4. Action recommendations

### 4. Synthesis Report

```markdown
🎯 Strategic Analysis Summary

## Key Insights

### Convergent Perspectives
✅ All experts agree on [insight 1]
✅ Strong consensus around [insight 2]

### Productive Tensions
⚖️ PORTER vs CHRISTENSEN: Sustaining vs disruptive
⚖️ TALEB vs COLLINS: Antifragility vs optimization

### System Patterns
🕸️ Positive feedback loop: [pattern]
🕸️ Unintended consequences: [risk]

## Strategic Recommendations

1. **Immediate Actions** (DRUCKER framework)
   - Action 1
   - Action 2

2. **Strategic Positioning** (PORTER framework)
   - Competitive moat
   - Differentiation

3. **Risk Mitigation** (TALEB framework)
   - Downside protection
   - Optionality

## Questions for Further Exploration
- Question 1 (CHRISTENSEN)
- Question 2 (MEADOWS)
- Question 3 (KIM/MAUBORGNE)
```

## Examples

### Product Strategy Analysis
```bash
/sc:business-panel "docs/product_strategy.md"

# Auto-selects: CHRISTENSEN, PORTER, GODIN, MEADOWS
# Provides: Market analysis, competitive positioning, innovation strategy
```

### Risk Assessment
```bash
/sc:business-panel "proposals/expansion_plan.pdf" --mode debate

# Auto-selects: TALEB, COLLINS, DRUCKER, MEADOWS
# Provides: Stress-tested decision through expert debate
```

### Market Entry Strategy
```bash
/sc:business-panel "market entry to asia" --mode socratic --experts=["porter","kim","meadows"]

# Guides strategic thinking through expert questions
```

## Token Efficiency

- Traditional business analysis: ~60K tokens
- With business-panel command: ~12K tokens
- **Savings**: 80%

## Integration

### With Skills
- business-panel: Expert personas and frameworks
- strategic-analysis: Framework application
- synthesis: Integration of perspectives

### With MCPs
- Sequential: Multi-step expert reasoning
- Context7: Document analysis
- Tavily: Market research

## Configuration

`.claude/settings.json`:
```json
{
  "commands": {
    "sc-business-panel": {
      "defaultMode": "discussion",
      "defaultExperts": 4,
      "includeSymbols": true,
      "detailLevel": "comprehensive"
    }
  }
}
```

## Success Metrics

- Analysis depth: >9/10
- Framework application accuracy: >95%
- Token efficiency: 80% reduction
- User satisfaction: >4.7/5
- Actionability: >90%
