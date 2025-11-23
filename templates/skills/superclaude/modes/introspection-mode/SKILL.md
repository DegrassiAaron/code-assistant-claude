---
name: "introspection-mode"
version: "1.0.0"
description: "Meta-cognitive analysis and pattern recognition for self-improvement"
author: "SuperClaude Framework"
category: "superclaude"

triggers:
  keywords: ["reflect", "analyze approach", "improve process"]
  patterns: ["how.*did", "could.*improve", "better.*approach"]
  commands: ["/sc:introspect", "/sc:reflect"]

tokenCost:
  metadata: 32
  fullContent: 1300
  resources: 150

dependencies:
  skills: []
  mcps: ["serena", "sequential"]

composability:
  compatibleWith: []
  conflictsWith: []

context:
  projectTypes: []
  minNodeVersion: "18.0.0"
  requiredTools: []

priority: "low"
autoActivate: false
cacheStrategy: "minimal"
---

# Introspection Mode

Meta-cognitive analysis for continuous improvement and pattern recognition.

## Core Functions

### 1. Performance Analysis
Evaluate own responses and decisions:
- Tool selection effectiveness
- Token efficiency achieved
- Task completion quality
- User satisfaction indicators

### 2. Pattern Recognition
Identify recurring patterns:
- Common user requests
- Frequently used skills
- Token consumption patterns
- Error patterns and causes

### 3. Process Improvement
Suggest optimizations:
- Better tool combinations
- More efficient workflows
- Skill composition opportunities
- Caching strategies

### 4. Learning Capture
Extract and persist learnings:
- Effective solutions
- Failed approaches (to avoid)
- Domain-specific patterns
- User preferences

## Introspection Framework

```
Trigger: Task Completion or User Request
    ↓
1. Context Gathering
   - What was the task?
   - Which tools/skills were used?
   - How many tokens consumed?
   - Was the outcome successful?
    ↓
2. Analysis
   - Was tool selection optimal?
   - Could we have used fewer tokens?
   - Did we miss any patterns?
   - Were there better approaches?
    ↓
3. Pattern Matching
   - Have we seen similar tasks?
   - What worked well before?
   - What patterns emerge?
    ↓
4. Learning Extraction
   - What should we remember?
   - What should we avoid?
   - What new patterns emerged?
    ↓
5. Recommendation
   - Suggest improvements
   - Update best practices
   - Store patterns in Serena
```

## Example Introspection

```
Task Completed: "Implement user authentication with OAuth2"

🔍 Introspection Analysis:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Performance Metrics:
✓ Task completed successfully
✓ User satisfied with output
- Tokens used: 42,350 / 50,000 (85%)
- Time: ~15 minutes
- Skills activated: 4 (orchestration, code-reviewer,
  test-generator, security-auditor)

🎯 What Worked Well:
1. Parallel execution of backend + frontend
   → Saved ~8 minutes
   → Reduced context switching

2. Security audit before testing
   → Caught 3 issues early
   → Prevented test rework

3. Progressive skill loading
   → Only loaded needed skills
   → Saved ~15,000 tokens

⚠️ Areas for Improvement:
1. Token Usage
   - Could have used compressed mode for review
   - Estimated savings: 5,000 tokens (12%)

2. Skill Sequencing
   - Security audit could run parallel with tests
   - Estimated time savings: 2 minutes

3. Caching Opportunity
   - OAuth2 pattern detected (3rd time this week)
   - Should create reusable template
   - Future savings: ~20,000 tokens per use

💡 Learnings Captured:
→ OAuth2 implementation pattern stored
→ Parallel execution strategy refined
→ Security-first approach validated

📝 Recommendations:
1. Create OAuth2 skill template
2. Update orchestration patterns
3. Enable compressed mode at 70% token usage
4. Store security checklist in Serena

🔄 Patterns Recognized:
- Authentication tasks: 12 instances
- Always need: code-review + security-audit + tests
- Token range: 35K-50K average
- Success rate: 95%

Action: Store pattern in Serena for future use
```

## Self-Improvement Cycle

```
Week 1: Baseline Performance
├─ Track all tasks
├─ Measure token usage
└─ Record outcomes

Week 2: Pattern Identification
├─ Analyze task types
├─ Identify commonalities
└─ Extract best practices

Week 3: Optimization
├─ Apply learnings
├─ Test improvements
└─ Measure impact

Week 4: Refinement
├─ Compare to baseline
├─ Adjust strategies
└─ Update patterns

→ Repeat cycle continuously
```

## Meta-Analysis Questions

After each significant task:

1. **Effectiveness**
   - Did we achieve the goal?
   - Was the approach optimal?
   - What could we have done better?

2. **Efficiency**
   - How many tokens did we use?
   - Could we have used fewer?
   - Were there redundancies?

3. **Quality**
   - Did the output meet standards?
   - Were all requirements addressed?
   - Is the user satisfied?

4. **Learning**
   - What patterns emerged?
   - What should we remember?
   - What should we avoid?

## Integration

Uses Serena MCP to:
- Store learned patterns
- Build pattern library
- Track improvement metrics
- Persist best practices

Works with Sequential MCP for:
- Multi-step analysis
- Causal reasoning
- Pattern detection
- Impact assessment

## Output Types

1. **Instant Feedback**: Quick analysis after each task
2. **Session Summary**: Overview at end of conversation
3. **Weekly Report**: Aggregated patterns and trends
4. **Custom Analysis**: Deep dive on specific aspects

**Note**: Introspection mode is resource-intensive. Use selectively for high-value learning opportunities.
