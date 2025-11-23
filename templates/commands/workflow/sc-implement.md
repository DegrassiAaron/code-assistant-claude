---
name: "sc-implement"
description: "Full feature implementation with intelligent persona and MCP selection"
category: "workflow"
version: "1.0.0"

triggers:
  exact: "/sc:implement"
  aliases: ["/implement", "/feature"]
  keywords: ["implement", "build feature", "create feature"]

requires:
  skills: ["code-reviewer", "test-generator"]
  mcps: ["serena"]

parameters:
  - name: "feature"
    type: "string"
    required: true
    description: "Feature name or description"
  - name: "withTests"
    type: "boolean"
    required: false
    default: true
  - name: "withDocs"
    type: "boolean"
    required: false
    default: true

autoExecute: false
tokenEstimate: 15000
executionTime: "30-120s"
---

# /sc:implement - Full Feature Implementation

Intelligent feature implementation workflow with automatic persona and MCP selection.

## Execution Flow

### 1. Analyze Feature Request
- Extract feature requirements from user description
- Identify affected files and modules
- Determine complexity level (simple, moderate, complex, enterprise)
- Select appropriate personas and MCPs

### 2. Activate Resources

**Personas** (Auto-selected based on feature type):
- **Frontend features** → frontend-architect persona
- **Backend features** → backend-architect persona
- **Data features** → system-architect persona
- **Security features** → security-engineer persona

**MCPs** (Auto-selected based on requirements):
- **UI components** → magic, playwright
- **Data operations** → serena (with code execution)
- **Research needed** → tavily, sequential
- **Documentation** → context7

**Skills** (Always activated):
- code-reviewer (automatic quality checks)
- test-generator (if withTests=true)
- security-auditor (vulnerability scanning)

### 3. Implementation Steps

1. **Plan** (with TodoWrite)
   ```
   📋 Implementation Plan: {feature}
   ├─ 1. Analyze existing codebase patterns
   ├─ 2. Design feature architecture
   ├─ 3. Implement core functionality
   ├─ 4. Add error handling and validation
   ├─ 5. Generate tests (unit + integration)
   ├─ 6. Update documentation
   └─ 7. Code review and refinement
   ```

2. **Analyze** (Serena MCP)
   - Use find_symbol to locate related code
   - Use search_for_pattern to find usage examples
   - Understand existing patterns and conventions

3. **Implement** (Following existing patterns)
   - Write code matching project style
   - Follow SOLID principles
   - Add comprehensive error handling
   - Include TypeScript types

4. **Test** (test-generator skill)
   - Generate unit tests
   - Generate integration tests
   - Ensure >80% coverage
   - Test edge cases

5. **Review** (code-reviewer skill)
   - Security validation
   - Performance check
   - Best practices compliance
   - Maintainability review

6. **Document** (if withDocs=true)
   - Update README if needed
   - Add JSDoc/docstrings
   - Update API documentation

### 4. Quality Gates

Before marking complete:
- ✅ All tests passing
- ✅ Linting passing
- ✅ Type checking passing
- ✅ Security scan clean
- ✅ Code review approved

## Examples

### Frontend Component
```bash
/sc:implement "responsive user profile card with avatar and bio"

# Auto-activates:
# - Skills: frontend-design, code-reviewer, test-generator
# - MCPs: magic (UI generation), playwright (testing)
# - Persona: frontend-architect

# Generates:
# src/components/UserProfile/
# ├── UserProfile.tsx
# ├── UserProfile.test.tsx
# ├── UserProfile.stories.tsx
# ├── types.ts
# └── index.ts
```

### Backend API Endpoint
```bash
/sc:implement "REST API endpoint for user authentication" --withTests=true

# Auto-activates:
# - Skills: api-designer, security-auditor, test-generator
# - MCPs: serena (pattern matching), sequential (security analysis)
# - Persona: backend-architect

# Generates:
# src/api/routes/auth.ts
# src/api/middleware/auth-middleware.ts
# tests/api/auth.test.ts
```

## Integration

### With Skills
- Automatically loads required skills based on feature type
- Skills provide domain expertise
- Progressive loading maintains token efficiency

### With MCPs
- Serena: Code navigation and pattern matching
- Magic: UI component generation
- Sequential: Complex reasoning for architecture
- Tavily: Research for best practices

### With Agents
- Delegates to specialized agents for complex features
- Multi-agent coordination for full-stack features

## Configuration

`.claude/settings.json`:
```json
{
  "commands": {
    "sc-implement": {
      "autoTest": true,
      "autoReview": true,
      "autoDocs": true,
      "confirmBeforeExecute": true
    }
  }
}
```
