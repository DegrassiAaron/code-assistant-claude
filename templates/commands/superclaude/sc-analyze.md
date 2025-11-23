---
name: "sc-analyze"
description: "Multi-dimensional analysis with multiple perspectives"
category: "superclaude"
version: "1.0.0"

triggers:
  exact: "/sc:analyze"
  aliases: ["/analyze", "/examine"]
  keywords: ["analyze", "examine", "evaluate"]

requires:
  skills: ["multi-perspective-analysis"]
  mcps: ["sequential", "serena"]

parameters:
  - name: "target"
    type: "string"
    required: true
    description: "What to analyze (file, code, document, concept)"
  - name: "perspectives"
    type: "array"
    required: false
    description: "Analysis perspectives to use"
    options: ["technical", "business", "user", "security", "performance", "maintainability"]
  - name: "depth"
    type: "string"
    required: false
    default: "standard"
    options: ["overview", "standard", "deep"]

autoExecute: true
tokenEstimate: 12000
executionTime: "20-45s"
---

# /sc:analyze - Multi-Dimensional Analysis

Comprehensive analysis from multiple expert perspectives.

## Analysis Perspectives

### Technical
- Architecture and design
- Code quality and patterns
- Technology choices
- Technical debt
- Scalability

### Business
- Business value
- ROI and costs
- Market fit
- Competitive advantage
- Risk/opportunity

### User Experience
- Usability
- Accessibility
- User flow
- Pain points
- Delight factors

### Security
- Vulnerabilities
- Threat modeling
- Data protection
- Compliance
- Attack surface

### Performance
- Speed and efficiency
- Resource usage
- Bottlenecks
- Optimization opportunities
- Scalability limits

### Maintainability
- Code readability
- Documentation
- Test coverage
- Complexity
- Future-proofing

## Execution Flow

### 1. Target Analysis
- Identify analysis target
- Determine target type
- Select relevant perspectives
- Set analysis depth

### 2. Multi-Perspective Examination

**For each perspective**:

1. **Assess Current State**
   - Strengths
   - Weaknesses
   - Opportunities
   - Threats (SWOT)

2. **Identify Issues**
   - Critical problems
   - Warnings
   - Improvements
   - Best practices

3. **Measure Metrics**
   - Quantitative scores
   - Benchmarks
   - Comparisons
   - Trends

### 3. Cross-Perspective Synthesis

**Integration Analysis**:
- How perspectives interact
- Conflicting priorities
- Synergies
- Trade-offs
- Balanced recommendations

### 4. Report Generation

```markdown
📊 Multi-Dimensional Analysis: {target}

## Executive Summary

Overall Score: 7.5/10

**Strengths**: [Top 3]
**Weaknesses**: [Top 3]
**Priority Actions**: [Top 3]

---

## Technical Analysis (8/10) 🔧

### Architecture
✅ Well-structured modular design
✅ Clear separation of concerns
⚠️ Some circular dependencies
❌ Missing abstraction layer for database

**Score Breakdown**:
- Design patterns: 8/10
- Code quality: 9/10
- Tech stack: 7/10
- Scalability: 7/10

**Recommendations**:
1. Refactor circular dependencies
2. Add database abstraction layer
3. Consider microservices for scaling

---

## Business Analysis (7/10) 💼

### Value Proposition
✅ Solves clear user pain point
✅ Competitive differentiation
⚠️ High development cost
❌ Unclear pricing strategy

**ROI Analysis**:
- Development cost: $150K
- Expected revenue: $500K/year
- Payback period: 4 months
- 5-year NPV: $1.8M

**Market Position**:
- Market size: $5B
- Target segment: 2%
- Competition: Moderate
- Barriers to entry: Medium

**Recommendations**:
1. Define pricing tiers
2. Focus on high-value segment
3. Build strategic partnerships

---

## User Experience Analysis (6/10) 👥

### Usability
⚠️ Complex onboarding flow
⚠️ Limited mobile responsiveness
✅ Intuitive navigation
❌ Poor error messages

**User Journey Analysis**:
- Sign-up: 3 steps (industry avg: 2)
- Time to value: 10 minutes (target: 5)
- Task completion: 75% (target: 90%)
- User satisfaction: 3.8/5

**Pain Points**:
1. Confusing initial setup
2. Lack of in-app guidance
3. Mobile experience subpar

**Recommendations**:
1. Simplify onboarding to 2 steps
2. Add interactive tutorial
3. Improve mobile UI

---

## Security Analysis (9/10) 🔒

### Threat Assessment
✅ Strong authentication (OAuth2 + MFA)
✅ Encrypted data at rest
✅ Regular security audits
⚠️ Missing rate limiting
⚠️ API needs better validation

**Vulnerability Scan**:
- Critical: 0
- High: 0
- Medium: 2
- Low: 5

**Compliance**:
- GDPR: ✅ Compliant
- SOC 2: ✅ Certified
- HIPAA: ⚠️ In progress
- PCI DSS: ❌ Not applicable

**Recommendations**:
1. Implement rate limiting
2. Enhance API input validation
3. Complete HIPAA certification

---

## Performance Analysis (7/10) ⚡

### Speed Metrics
- Page load: 2.1s (target: <2s)
- API response: 150ms (good)
- Database queries: 50ms avg
- Largest bundle: 850KB (target: <500KB)

**Bottlenecks Identified**:
1. Large JavaScript bundle
2. N+1 query in user dashboard
3. Unoptimized images
4. Missing CDN for static assets

**Resource Usage**:
- CPU: 45% avg (acceptable)
- Memory: 2.1GB (high)
- Database: 70% capacity
- Network: 50Mbps avg

**Recommendations**:
1. Code splitting and lazy loading
2. Fix N+1 queries
3. Implement image optimization
4. Add CDN for static assets

---

## Maintainability Analysis (8/10) 🔧

### Code Quality
✅ Consistent code style
✅ Good test coverage (85%)
✅ Clear documentation
⚠️ High complexity in some modules
⚠️ Missing API documentation

**Complexity Metrics**:
- Cyclomatic complexity: 12 avg (target: <10)
- Lines per file: 250 avg (acceptable)
- Function length: 20 lines avg (good)

**Technical Debt**:
- Estimated hours: 120
- Priority debt: 40 hours
- Monthly accumulation: 8 hours

**Recommendations**:
1. Refactor high-complexity modules
2. Add API documentation
3. Schedule debt reduction sprints

---

## Cross-Perspective Synthesis

### Key Trade-offs
⚖️ **Performance vs Maintainability**
- Current: Optimized for maintainability
- Impact: Slightly slower performance
- Recommendation: Acceptable trade-off

⚖️ **Features vs Time-to-Market**
- Current: Feature-rich but delayed
- Impact: 2-month delay
- Recommendation: Consider MVP approach

### Synergies
🔗 Security + Performance: Caching improves both
🔗 UX + Business: Better UX → higher conversion
🔗 Technical + Maintainability: Clean code → easier scaling

### Priority Matrix

| Action | Impact | Effort | Priority |
|--------|--------|--------|----------|
| Fix onboarding | High | Low | 🔴 Critical |
| Add rate limiting | High | Low | 🔴 Critical |
| Optimize bundle | High | Medium | 🟡 High |
| Refactor complex modules | Medium | High | 🟢 Medium |
| Add API docs | Medium | Low | 🟡 High |

---

## Recommendations

### Immediate (Week 1)
1. 🔴 Simplify user onboarding
2. 🔴 Implement rate limiting
3. 🔴 Fix critical N+1 query

### Short-term (Month 1)
4. 🟡 Optimize JavaScript bundle
5. 🟡 Add API documentation
6. 🟡 Improve mobile UX

### Long-term (Quarter 1)
7. 🟢 Refactor complex modules
8. 🟢 Complete HIPAA certification
9. 🟢 Migrate to microservices

---

## Conclusion

**Overall Assessment**: Good foundation with clear improvement path

**Strengths**: Strong security, good maintainability, solid architecture
**Focus Areas**: UX optimization, performance tuning, business strategy

**Success Probability**: 85% with recommended actions
```

## Examples

### Code Analysis
```bash
/sc:analyze "src/services/UserService.ts" --perspectives=["technical","security","maintainability"]

# Analyzes code from multiple angles
```

### Product Analysis
```bash
/sc:analyze "product_spec.md" --perspectives=["business","user","technical"]

# Evaluates product viability
```

### Architecture Analysis
```bash
/sc:analyze "system architecture" --depth=deep

# Deep dive into system design
```

## Integration

### With Skills
- multi-perspective-analysis: Framework application
- code-reviewer: Technical analysis
- security-auditor: Security assessment

### With MCPs
- Sequential: Multi-step reasoning
- Serena: Code analysis
- Context7: Document analysis

## Configuration

`.claude/settings.json`:
```json
{
  "commands": {
    "sc-analyze": {
      "defaultPerspectives": ["technical", "business", "user"],
      "defaultDepth": "standard",
      "includeMetrics": true,
      "generatePriorityMatrix": true
    }
  }
}
```

## Success Metrics

- Analysis comprehensiveness: >95%
- Accuracy: >90%
- Actionability: >85%
- Time efficiency: <45s
- User satisfaction: >4.6/5
