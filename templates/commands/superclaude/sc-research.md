---
name: "sc-research"
description: "Deep research with synthesis and citation"
category: "superclaude"
version: "1.0.0"

triggers:
  exact: "/sc:research"
  aliases: ["/research", "/investigate"]
  keywords: ["research", "investigate", "deep dive"]

requires:
  skills: ["research-mode"]
  mcps: ["tavily", "sequential", "context7"]

parameters:
  - name: "query"
    type: "string"
    required: true
    description: "Research query or question"
  - name: "depth"
    type: "string"
    required: false
    default: "comprehensive"
    options: ["quick", "standard", "comprehensive", "academic"]
  - name: "sources"
    type: "number"
    required: false
    default: 10

autoExecute: true
tokenEstimate: 15000
executionTime: "30-90s"
---

# /sc:research - Deep Research

Comprehensive research with source synthesis and academic-quality citations.

## Research Depths

### Quick (5-10 sources, <30s)
- Web search
- Top results
- Summary synthesis
- Basic citations

### Standard (10-15 sources, 30-60s)
- Multi-source web search
- Cross-reference validation
- Structured synthesis
- Formatted citations

### Comprehensive (15-25 sources, 60-90s)
- Exhaustive web search
- Academic sources
- Expert perspectives
- Deep synthesis
- Bibliography

### Academic (25+ sources, >90s)
- Scholarly articles
- Research papers
- Statistical data
- Meta-analysis
- Publication-ready citations

## Execution Flow

### 1. Query Analysis
- Parse research question
- Identify key concepts
- Determine information needs
- Plan search strategy

### 2. Information Gathering

**Search Strategy**:
1. **Primary Search** (Tavily MCP)
   - Main query
   - Top {sources} results
   - Credibility filtering

2. **Related Searches**
   - Alternative phrasings
   - Subtopics
   - Related concepts

3. **Source Diversification**
   - Academic papers
   - Industry reports
   - Expert opinions
   - Official documentation
   - News articles

4. **Validation**
   - Cross-reference facts
   - Verify claims
   - Check publication dates
   - Assess source credibility

### 3. Analysis & Synthesis

**Content Analysis** (Sequential MCP):
1. Extract key findings
2. Identify patterns
3. Note contradictions
4. Assess reliability
5. Synthesize insights

**Synthesis Framework**:
- What: Key findings
- Why: Underlying reasons
- How: Mechanisms and processes
- Implications: Consequences
- Gaps: Unknown areas

### 4. Report Generation

```markdown
# Research Report: {query}

## Executive Summary
[3-5 sentence overview of findings]

## Key Findings

### Finding 1: [Title]
[Detailed explanation]

**Evidence**:
- Source 1: [Citation] - [Key point]
- Source 2: [Citation] - [Supporting evidence]
- Source 3: [Citation] - [Additional data]

**Analysis**: [Interpretation and implications]

### Finding 2: [Title]
...

## Synthesis

### Convergent Insights
✅ Consistent across multiple sources:
- Point 1 (5/10 sources)
- Point 2 (7/10 sources)

### Divergent Perspectives
⚖️ Conflicting viewpoints:
- Perspective A (Source 1, 3, 5)
- Perspective B (Source 2, 4, 6)

### Knowledge Gaps
❓ Areas requiring further research:
- Gap 1
- Gap 2

## Implications

### Theoretical Implications
[Academic/conceptual implications]

### Practical Implications
[Real-world applications]

### Future Research
[Suggested research directions]

## Methodology

- Sources consulted: {sources}
- Search queries: [List of queries]
- Date range: [Time period]
- Credibility criteria: [Standards used]

## Bibliography

1. Author, A. (Year). Title. *Publication*. URL
2. Author, B. (Year). Title. *Publication*. URL
...

## Appendix

### Search Terms Used
- Primary: {query}
- Related: [List of related searches]

### Source Quality Assessment
| Source | Credibility | Recency | Relevance |
|--------|------------|---------|-----------|
| Source 1 | High | 2024 | ⭐⭐⭐⭐⭐ |
| Source 2 | Medium | 2023 | ⭐⭐⭐⭐ |
```

## Examples

### Technology Research
```bash
/sc:research "latest developments in quantum computing" --depth=comprehensive

# Delivers:
# - 20+ sources
# - Academic papers
# - Industry reports
# - Expert perspectives
# - Comprehensive synthesis
```

### Market Research
```bash
/sc:research "AI coding assistant market size and trends" --sources=15

# Delivers:
# - Market size data
# - Growth trends
# - Competitive landscape
# - Future projections
```

### Academic Research
```bash
/sc:research "impact of remote work on productivity" --depth=academic

# Delivers:
# - Peer-reviewed papers
# - Meta-analysis
# - Statistical data
# - Publication-ready citations
```

### Quick Fact-Check
```bash
/sc:research "when was TypeScript first released" --depth=quick

# Delivers:
# - Quick answer
# - 3-5 sources
# - Basic verification
```

## Source Types

**Prioritized Sources**:
1. **Academic** (highest credibility)
   - Peer-reviewed journals
   - Research papers
   - University publications

2. **Official**
   - Government data
   - Official documentation
   - Standards bodies

3. **Industry**
   - Expert blogs
   - Industry reports
   - Technical documentation

4. **News**
   - Reputable news outlets
   - Technology news
   - Recent developments

## Citation Formats

### APA (Default)
```
Author, A. A. (Year). Title of work. Publication. https://doi.org/xxx
```

### MLA
```
Author. "Title." Publication, Date, URL.
```

### Chicago
```
Author. "Title." Publication. Date. URL.
```

### IEEE
```
[1] A. Author, "Title," Publication, vol. x, no. y, pp. z, Year.
```

## Quality Assurance

### Source Credibility Checks
- ✅ Author expertise
- ✅ Publication reputation
- ✅ Peer review status
- ✅ Recency
- ✅ Citation count
- ✅ Conflict of interest

### Fact Verification
- Cross-reference multiple sources
- Check primary sources
- Verify statistics
- Validate claims

## Integration

### With Skills
- research-mode: Deep investigation
- analysis: Data synthesis
- writing: Report generation

### With MCPs
- Tavily: Web search and retrieval
- Sequential: Multi-step reasoning
- Context7: Document analysis

## Configuration

`.claude/settings.json`:
```json
{
  "commands": {
    "sc-research": {
      "defaultDepth": "standard",
      "defaultSources": 10,
      "citationFormat": "APA",
      "includeAcademic": true,
      "validateSources": true,
      "maxAge": "2 years"
    }
  }
}
```

## Success Metrics

- Source quality: >8/10
- Synthesis depth: >9/10
- Citation accuracy: 100%
- Fact accuracy: >98%
- Time efficiency: <90s
- User satisfaction: >4.7/5
