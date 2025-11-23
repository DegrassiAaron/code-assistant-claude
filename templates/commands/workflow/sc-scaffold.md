---
name: "sc-scaffold"
description: "Generate project scaffolding and boilerplate code"
category: "workflow"
version: "1.0.0"

triggers:
  exact: "/sc:scaffold"
  aliases: ["/scaffold", "/generate"]
  keywords: ["scaffold", "generate boilerplate", "create structure"]

requires:
  skills: ["code-generator"]
  mcps: ["serena"]

parameters:
  - name: "type"
    type: "string"
    required: true
    description: "Type of scaffold (component, service, route, etc.)"
    options: ["component", "service", "route", "model", "test", "module"]
  - name: "name"
    type: "string"
    required: true
    description: "Name of the generated item"
  - name: "withTests"
    type: "boolean"
    required: false
    default: true

autoExecute: false
tokenEstimate: 8000
executionTime: "10-30s"
---

# /sc:scaffold - Component Generation

Generates project scaffolding following best practices and project conventions.

## Execution Flow

### 1. Analyze Project Structure
- Detect project type (React, Node, Python, etc.)
- Identify naming conventions
- Understand directory structure
- Locate similar existing components

### 2. Generate Boilerplate

**Component Types**:
- **component**: React/Vue component with tests and styles
- **service**: Backend service with API interface
- **route**: API route with validation and tests
- **model**: Database model with migrations
- **test**: Test suite for existing code
- **module**: Complete feature module

### 3. Implementation Steps

1. **Detect Patterns** (Serena MCP)
   - Find similar existing code
   - Extract patterns and conventions
   - Identify required imports

2. **Generate Files**
   - Create main file with boilerplate
   - Add type definitions
   - Include error handling
   - Generate documentation

3. **Generate Tests** (if withTests=true)
   - Unit tests
   - Integration tests
   - Mock data

4. **Update Exports**
   - Add to index files
   - Update module exports
   - Register in configuration

### 4. Quality Gates

Before completion:
- ✅ All files created
- ✅ Follows project conventions
- ✅ Type definitions included
- ✅ Tests generated
- ✅ Exports updated

## Examples

### React Component
```bash
/sc:scaffold component "UserProfile" --withTests=true

# Generates:
# src/components/UserProfile/
# ├── UserProfile.tsx
# ├── UserProfile.test.tsx
# ├── UserProfile.module.css
# ├── types.ts
# └── index.ts
```

### API Route
```bash
/sc:scaffold route "users"

# Generates:
# src/routes/users/
# ├── users.routes.ts
# ├── users.controller.ts
# ├── users.validation.ts
# ├── users.test.ts
# └── index.ts
```

### Service
```bash
/sc:scaffold service "EmailService"

# Generates:
# src/services/EmailService/
# ├── EmailService.ts
# ├── EmailService.interface.ts
# ├── EmailService.test.ts
# └── index.ts
```

## Integration

### With Skills
- code-generator: Template generation
- test-generator: Test scaffolding

### With MCPs
- Serena: Pattern detection and analysis
- Context7: Documentation generation

## Configuration

`.claude/settings.json`:
```json
{
  "commands": {
    "sc-scaffold": {
      "defaultType": "component",
      "alwaysGenerateTests": true,
      "updateExports": true
    }
  }
}
```
