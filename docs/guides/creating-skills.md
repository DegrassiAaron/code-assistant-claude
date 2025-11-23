# Creating Custom Skills

Complete guide to building custom skills for Code-Assistant-Claude.

## What Are Skills?

Skills are specialized capabilities that extend Claude's functionality for specific domains or tasks. They use progressive loading to minimize token usage while maximizing capability.

## Skill Anatomy

### Basic Structure

```
.claude/skills/my-custom-skill/
├── SKILL.md                    # Main skill definition
├── config.json                 # Skill configuration
├── examples/                   # Usage examples
│   ├── basic.md
│   └── advanced.md
├── templates/                  # Code templates
│   └── component-template.tsx
└── resources/                  # Additional resources
    └── patterns.json
```

### SKILL.md Format

```markdown
---
name: "my-custom-skill"
description: "Brief description of what this skill does"
category: "technical|business|utility"
version: "1.0.0"
author: "Your Name"

expertise:
  - domain1
  - domain2

activation:
  keywords:
    - keyword1
    - keyword2
  complexity:
    - simple
    - moderate
    - complex
  triggers:
    - task_type_1
    - task_type_2

capabilities:
  - Capability 1
  - Capability 2
  - Capability 3

integrations:
  skills:
    - other-skill-name
  mcps:
    - mcp-server-name
  agents:
    - agent-name

token_budget: 5000
progressive_loading: true
---

# Skill Implementation

## Overview
[Detailed description of the skill and when to use it]

## Core Capabilities

### Capability 1: [Name]
[Detailed explanation]

**Example**:
\`\`\`typescript
// Example code
\`\`\`

### Capability 2: [Name]
[Detailed explanation]

## Activation Triggers

This skill activates when:
- User requests [specific task type]
- Keywords detected: [list]
- Task complexity: [level]

## Usage Patterns

### Pattern 1: [Name]
\`\`\`
User: [Example request]
Skill: [Expected behavior]
Output: [What gets generated]
\`\`\`

### Pattern 2: [Name]
[Similar structure]

## Integration

### With Other Skills
- **skill-name**: [How they work together]

### With MCP Servers
- **mcp-name**: [How MCP is used]

### With Agents
- **agent-name**: [How agent is used]

## Best Practices

1. **Practice 1**: [Description]
2. **Practice 2**: [Description]

## Advanced Usage

[Advanced patterns and techniques]

## Troubleshooting

### Issue: [Common Issue]
**Solution**: [How to resolve]

## Examples

See `examples/` directory for detailed usage examples.
```

## Creating Your First Skill

### Step 1: Plan Your Skill

Define:
- **Purpose**: What specific problem does it solve?
- **Domain**: What area of expertise?
- **Triggers**: When should it activate?
- **Integration**: What tools/skills/MCPs does it use?

**Example Planning**:
```yaml
Skill: database-optimizer
Purpose: Optimize database queries and schema
Domain: Backend development, Performance
Triggers:
  - Database performance issues
  - Query optimization requests
  - Schema design tasks
Integration:
  - Skill: performance-tuner (for profiling)
  - MCP: sequential (for complex analysis)
  - Agent: architect (for schema design)
```

### Step 2: Create Skill Directory

```bash
mkdir -p .claude/skills/database-optimizer/{examples,templates,resources}
```

### Step 3: Write SKILL.md

```bash
cat > .claude/skills/database-optimizer/SKILL.md << 'EOF'
---
name: "database-optimizer"
description: "Database query and schema optimization expert"
category: "technical"
version: "1.0.0"

expertise:
  - sql-optimization
  - schema-design
  - indexing-strategies
  - query-profiling

activation:
  keywords:
    - "database performance"
    - "slow query"
    - "optimize database"
    - "schema design"
  complexity:
    - moderate
    - complex
  triggers:
    - performance_optimization
    - database_design

capabilities:
  - Query analysis and optimization
  - Index recommendation
  - Schema normalization
  - Performance profiling

integrations:
  skills:
    - performance-tuner
  mcps:
    - sequential
  agents:
    - architect

token_budget: 6000
progressive_loading: true
---

# Database Optimizer

Expert skill for database query optimization and schema design.

## Core Capabilities

### 1. Query Optimization

Analyzes SQL queries and provides optimized versions with explanations.

**Example**:
\`\`\`sql
-- Before
SELECT * FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at > '2023-01-01';

-- After (Optimized)
SELECT u.id, u.name, u.email, o.order_id, o.total
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at > '2023-01-01'
AND u.deleted_at IS NULL;

-- Improvements:
-- ✅ Explicit column selection (avoid SELECT *)
-- ✅ Added index hint for created_at
-- ✅ Filtered soft-deleted records
-- ⚡ Expected 70% performance improvement
\`\`\`

### 2. Index Recommendations

Suggests optimal indexes based on query patterns.

**Example**:
\`\`\`sql
-- Recommended indexes
CREATE INDEX idx_users_created_at ON users(created_at)
WHERE deleted_at IS NULL;

CREATE INDEX idx_orders_user_id ON orders(user_id)
INCLUDE (order_id, total);

-- Rationale:
-- idx_users_created_at: Supports WHERE clause filtering
-- idx_orders_user_id: Covers JOIN + SELECT columns
\`\`\`

### 3. Schema Analysis

Reviews schema design for normalization and best practices.

## Activation Triggers

Activates when:
- Keywords: "slow query", "database performance", "optimize"
- Task involves SQL or database design
- Performance issues related to data access

## Usage Patterns

### Pattern 1: Query Optimization
\`\`\`
User: This query is running slow, can you optimize it?
      SELECT * FROM orders WHERE user_id = 123

Skill: [Activates database-optimizer]
       Analyzes query structure
       Identifies issues:
       - SELECT * inefficient
       - Missing index on user_id

       Provides optimized version with indexes
\`\`\`

### Pattern 2: Schema Review
\`\`\`
User: Review my database schema for a blog platform

Skill: [Activates database-optimizer]
       Analyzes schema normalization
       Checks indexing strategy
       Reviews relationships

       Provides recommendations and migration scripts
\`\`\`

## Integration

### With performance-tuner Skill
- database-optimizer identifies slow queries
- performance-tuner profiles overall system impact

### With sequential MCP
- Complex analysis broken into steps
- Query plan analysis with multiple iterations

### With architect Agent
- Schema design validated by architecture patterns
- Scalability considerations incorporated

## Best Practices

1. **Always Provide Context**: Include table schemas, row counts, query frequency
2. **Test Recommendations**: Suggest running EXPLAIN ANALYZE before/after
3. **Consider Trade-offs**: Indexes improve reads but slow writes
4. **Monitor Impact**: Recommend tracking metrics after optimization

## Advanced Usage

### Complex Query Optimization
Handles subqueries, CTEs, window functions, and complex JOINs.

### Multi-Database Support
Optimizes for PostgreSQL, MySQL, SQL Server with dialect-specific features.

### Migration Generation
Creates safe migration scripts with rollback strategies.

## Troubleshooting

### Issue: Optimization Makes Query Slower
**Cause**: Added index not being used by query planner
**Solution**: Check statistics, analyze table, adjust query hints

### Issue: Recommended Index Too Large
**Cause**: INCLUDE clause adding too many columns
**Solution**: Create covering index only for hottest queries

## Examples

See `examples/` for:
- E-commerce query optimization
- Blog platform schema design
- Analytics query tuning
- Multi-tenant database optimization
EOF
```

### Step 4: Create config.json

```bash
cat > .claude/skills/database-optimizer/config.json << 'EOF'
{
  "enabled": true,
  "autoActivate": true,
  "priority": "high",
  "tokenBudget": 6000,
  "progressiveLoading": true,

  "caching": {
    "enabled": true,
    "ttl": 3600
  },

  "validation": {
    "requireContext": true,
    "minComplexity": "moderate"
  },

  "performance": {
    "maxConcurrent": 1,
    "timeout": 30000
  }
}
EOF
```

### Step 5: Add Examples

```bash
cat > .claude/skills/database-optimizer/examples/basic.md << 'EOF'
# Basic Query Optimization Example

## Scenario
E-commerce site with slow product search query.

## Original Query
\`\`\`sql
SELECT * FROM products
WHERE category_id = 5
AND status = 'active'
ORDER BY created_at DESC;
\`\`\`

## User Request
"This product search is slow, can you optimize it?"

## Skill Activation
database-optimizer activates based on:
- Keyword: "optimize"
- Context: SQL query
- Task: Performance optimization

## Analysis
1. **SELECT * Issue**: Fetches unnecessary columns
2. **Missing Index**: No index on (category_id, status)
3. **Sort Performance**: created_at not indexed

## Optimized Solution
\`\`\`sql
-- Optimized query
SELECT id, name, price, image_url, created_at
FROM products
WHERE category_id = 5
  AND status = 'active'
ORDER BY created_at DESC
LIMIT 20;

-- Recommended index
CREATE INDEX idx_products_category_status_created
ON products(category_id, status, created_at DESC)
WHERE status = 'active';
\`\`\`

## Results
- Query time: 850ms → 12ms (98.6% improvement)
- Index size: 2.3 MB
- Maintenance overhead: Minimal (< 5% write slowdown)
EOF
```

### Step 6: Test Your Skill

```bash
# Validate skill structure
code-assistant-claude validate-skill database-optimizer

# Test activation
code-assistant-claude test-skill database-optimizer \
  --input "Optimize this slow query: SELECT * FROM users"
```

## Progressive Loading Strategy

Skills load in three phases to minimize token usage:

### Phase 1: Metadata (Always Loaded)
```yaml
Tokens: ~50
Contains:
  - Skill name
  - Description
  - Keywords
  - Triggers
  - Basic capabilities
```

### Phase 2: Core Implementation (Loaded on Activation)
```yaml
Tokens: ~2000-4000
Contains:
  - Detailed instructions
  - Core patterns
  - Integration details
  - Best practices
```

### Phase 3: Resources (Loaded on Demand)
```yaml
Tokens: Variable
Contains:
  - Examples
  - Templates
  - Advanced patterns
  - Troubleshooting details
```

**Implementation**:
```markdown
<!-- Metadata Section (Always loaded) -->
---
name: "skill-name"
description: "Brief description"
---

<!-- Core Implementation (Loaded on activation) -->
# Skill Implementation
[Core instructions here]

<!-- Resources (Loaded on demand) -->
## Examples
[Link to examples/ directory - loaded only if user requests examples]

## Advanced Patterns
[Link to resources/ - loaded only for complex tasks]
```

## Skill Categories

### Technical Skills
Focus on code quality, architecture, testing, performance.

**Examples**:
- code-reviewer
- test-generator
- performance-tuner
- security-auditor

### Domain Skills
Specialized knowledge for specific domains.

**Examples**:
- frontend-design
- api-designer
- database-optimizer
- devops-automation

### Business Skills
Strategic analysis and business decision support.

**Examples**:
- business-panel
- market-researcher
- financial-analyzer

### Utility Skills
Helper skills for common tasks.

**Examples**:
- git-commit-helper
- docs-generator
- refactor-assistant

## Advanced Techniques

### Skill Composition

Skills can call other skills:

```markdown
## Integration with Other Skills

When database query involves frontend:
1. database-optimizer: Optimize backend query
2. frontend-design: Design data display component
3. performance-tuner: Validate end-to-end performance
```

### Conditional Activation

```json
{
  "activation": {
    "conditions": {
      "and": [
        {"keyword": "database"},
        {"complexity": "moderate"},
        {"not": {"activeSkill": "performance-tuner"}}
      ]
    }
  }
}
```

### Dynamic Token Budgets

```json
{
  "tokenBudget": {
    "base": 3000,
    "perComplexity": {
      "simple": 1000,
      "moderate": 3000,
      "complex": 6000
    }
  }
}
```

## Testing Skills

### Unit Testing

```bash
# Test skill activation
code-assistant-claude test-skill database-optimizer \
  --scenario "optimize-query" \
  --expect-activation true

# Test token usage
code-assistant-claude test-skill database-optimizer \
  --measure-tokens \
  --expect-max 6000
```

### Integration Testing

```bash
# Test with other skills
code-assistant-claude test-workflow \
  --skills "database-optimizer,performance-tuner" \
  --task "Optimize database performance for e-commerce site"
```

## Best Practices

### 1. Keep Skills Focused
- ✅ Good: "database-optimizer" (specific)
- ❌ Bad: "backend-expert" (too broad)

### 2. Optimize Token Usage
- Use progressive loading
- Link to examples rather than embedding
- Compress repeated patterns into templates

### 3. Clear Activation Criteria
- Specific keywords
- Clear complexity mapping
- Well-defined triggers

### 4. Document Integrations
- List compatible skills
- Specify required MCPs
- Note agent coordination

### 5. Provide Examples
- Basic usage
- Advanced patterns
- Common troubleshooting

## Publishing Skills

### Package Structure

```
database-optimizer-skill/
├── package.json
├── README.md
├── SKILL.md
├── config.json
├── examples/
├── templates/
└── tests/
```

### package.json

```json
{
  "name": "@your-org/database-optimizer-skill",
  "version": "1.0.0",
  "description": "Database optimization skill for Code-Assistant-Claude",
  "main": "SKILL.md",
  "keywords": ["claude-skill", "database", "optimization"],
  "author": "Your Name",
  "license": "MIT",
  "peerDependencies": {
    "code-assistant-claude": "^1.0.0"
  }
}
```

### Installation

```bash
# Install from npm
npm install -g @your-org/database-optimizer-skill

# Or install locally
code-assistant-claude install-skill @your-org/database-optimizer-skill
```

## Troubleshooting

### Skill Not Activating

**Check**:
1. Keywords match user request
2. Complexity level appropriate
3. Skill enabled in config
4. No conflicts with other skills

**Debug**:
```bash
code-assistant-claude debug-activation \
  --task "Optimize this database query" \
  --show-candidates
```

### High Token Usage

**Solutions**:
1. Enable progressive loading
2. Move examples to separate files
3. Use templates for repetitive content
4. Link to external resources

### Conflicts with Other Skills

**Resolution**:
```json
{
  "activation": {
    "priority": "high",
    "excludeSkills": ["conflicting-skill-name"]
  }
}
```

## Next Steps

- [Creating Commands](creating-commands.md) - Build custom slash commands
- [Creating Agents](creating-agents.md) - Develop specialized agents
- [MCP Integration](mcp-integration.md) - Integrate with MCP servers

---

**Questions?** See [Skills Guide](../user-guides/04-skills-guide.md) or [Troubleshooting](../user-guides/10-troubleshooting.md)
