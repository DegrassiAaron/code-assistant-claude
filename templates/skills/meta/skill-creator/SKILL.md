---
name: "skill-creator"
version: "1.0.0"
description: "Interactive wizard for creating new custom skills with templates and validation"
author: "Code-Assistant-Claude"
category: "meta"

triggers:
  keywords: ["create skill", "new skill", "generate skill", "skill template"]
  patterns: ["create.*skill", "new.*skill"]
  commands: ["/sc:create-skill", "/skill-create"]

tokenCost:
  metadata: 35
  fullContent: 1500
  resources: 800

dependencies:
  skills: []
  mcps: ["serena"]

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

# Skill Creator Meta-Skill

Interactive wizard for generating custom skills with proper structure and validation.

## Creation Wizard Flow

### Step 1: Basic Information
```
🎯 Create New Skill
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

? Skill name (kebab-case): my-custom-skill
? Description: Brief description of what this skill does
? Category:
  ○ core      - Essential development skills
  ○ domain    - Domain-specific skills
  ● superclaude - SuperClaude framework modes
  ○ meta      - Meta-skills for system management

? Author: Your Name
? Version: 1.0.0
```

### Step 2: Trigger Configuration
```
🎯 Trigger Configuration
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

? Keywords (comma-separated):
  keyword1, keyword2, keyword3

? Patterns (regex, comma-separated, optional):
  pattern.*match, another.*pattern

? File patterns (glob, comma-separated, optional):
  *.ts, *.js, *.tsx

? Commands (slash commands, comma-separated, optional):
  /my-command, /another-command

? Events (comma-separated, optional):
  file_save, pre_commit
```

### Step 3: Dependencies & Context
```
🎯 Dependencies & Context
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

? Required skills (comma-separated, optional):
  skill1, skill2

? Required MCPs (comma-separated, optional):
  serena, sequential, tavily

? Project types (comma-separated, optional):
  javascript, typescript, react, nodejs

? Minimum Node version: 18.0.0

? Required tools (comma-separated, optional):
  eslint, prettier, jest

? Priority:
  ○ high    - Critical skills, always loaded
  ● medium  - Important skills, load when needed
  ○ low     - Optional skills, load on demand

? Auto-activate: Yes

? Cache strategy:
  ○ aggressive - Cache aggressively, long TTL
  ● normal     - Standard caching
  ○ minimal    - Minimal caching
```

### Step 4: Token Cost Estimation
```
🎯 Token Cost Estimation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Based on your inputs, estimated token costs:

Metadata:     40 tokens (frontmatter)
Full Content: [You will add content next]
Resources:    [Based on resources you add]

? Estimated full content tokens: 1500
? Estimated resources tokens: 300
```

### Step 5: Content Editor
```
🎯 Skill Content
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Opening editor for skill content...

# My Custom Skill

[Write your skill description and instructions here]

## Features

- Feature 1
- Feature 2
- Feature 3

## Usage

[How to use this skill]

## Examples

[Provide examples]

[Save and close editor to continue]
```

### Step 6: Resources (Optional)
```
🎯 Resources
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

? Add resources? (Y/n): Y

? Resource 1 name: best-practices.md
? Resource 1 type:
  ● reference - Documentation/reference
  ○ template  - Code template
  ○ config    - Configuration file
  ○ script    - Executable script

? Add another resource? (y/N): N
```

### Step 7: Examples (Optional)
```
🎯 Examples
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

? Add examples? (Y/n): Y

? Example 1 name: basic-usage.md
? Example 1 description: Basic usage example

? Add another example? (y/N): N
```

### Step 8: Generation & Validation
```
🎯 Generating Skill
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ Creating directory structure...
✓ Generating SKILL.md with frontmatter...
✓ Creating examples/
✓ Creating resources/
✓ Validating metadata schema...
✓ Validating frontmatter YAML...

✅ Skill created successfully!

Location: templates/skills/domain/my-custom-skill/

Structure:
templates/skills/domain/my-custom-skill/
├── SKILL.md                    (1,580 tokens)
├── examples/
│   └── basic-usage.md
├── resources/
│   └── best-practices.md
└── tests/
    └── .gitkeep

? Run validation now? (Y/n): Y

🔍 Validation Results:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Metadata schema valid
✅ YAML frontmatter parsed successfully
✅ Required fields present
✅ Triggers configured correctly
✅ Token costs estimated

? Index skill in registry? (Y/n): Y

✅ Skill indexed successfully!

? Test skill activation? (Y/n): Y

Testing activation with keyword "keyword1"...
✅ Skill activated successfully!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Skill "my-custom-skill" is ready to use!

Try it:
- Type a message with "keyword1"
- Use command /my-command
- Or activate manually: /skill my-custom-skill
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Skill Templates

### Core Skill Template
```yaml
---
name: "skill-name"
version: "1.0.0"
description: "Brief description"
category: "core"

triggers:
  keywords: ["keyword1"]
  filePatterns: ["*.ts"]
  commands: ["/command"]
  events: ["file_save"]

tokenCost:
  metadata: 40
  fullContent: 2000
  resources: 500

priority: "high"
autoActivate: true
cacheStrategy: "aggressive"
---

# Skill Name

[Content here]
```

### Domain Skill Template
```yaml
---
name: "skill-name"
version: "1.0.0"
description: "Brief description"
category: "domain"

triggers:
  keywords: ["keyword1"]
  patterns: ["pattern.*"]

tokenCost:
  metadata: 35
  fullContent: 1500
  resources: 300

context:
  projectTypes: ["javascript", "typescript"]

priority: "medium"
autoActivate: true
cacheStrategy: "normal"
---

# Skill Name

[Content here]
```

### SuperClaude Mode Template
```yaml
---
name: "mode-name"
version: "1.0.0"
description: "Mode description"
category: "superclaude"

triggers:
  keywords: ["keyword1"]
  commands: ["/sc:mode"]

tokenCost:
  metadata: 40
  fullContent: 1800
  resources: 200

dependencies:
  mcps: ["serena", "sequential"]

priority: "medium"
autoActivate: false
cacheStrategy: "normal"
---

# Mode Name

[Content here]
```

## Validation Rules

### Required Fields
- `name` (kebab-case)
- `version` (semver)
- `description` (min 10 chars)
- `category` (core|domain|superclaude|meta)
- `triggers` (at least one type)
- `tokenCost` (all three values)
- `priority` (high|medium|low)
- `autoActivate` (boolean)
- `cacheStrategy` (aggressive|normal|minimal)

### Optional Fields
- `author`
- `dependencies.skills`
- `dependencies.mcps`
- `composability.compatibleWith`
- `composability.conflictsWith`
- `context.projectTypes`
- `context.minNodeVersion`
- `context.requiredTools`

### Naming Conventions
- Skill name: kebab-case (e.g., "my-custom-skill")
- Version: Semantic versioning (e.g., "1.0.0")
- Commands: Start with "/" (e.g., "/my-command")
- Events: snake_case (e.g., "file_save")

## Integration

Uses Serena MCP to:
- Store skill templates
- Save user preferences
- Track created skills
- Suggest improvements

## Post-Creation Steps

After creating a skill:

1. **Manual Review**
   - Review generated SKILL.md
   - Add detailed content
   - Include comprehensive examples

2. **Testing**
   - Test activation triggers
   - Verify token estimates
   - Check compatibility

3. **Documentation**
   - Add to skill catalog
   - Document use cases
   - Include screenshots/demos

4. **Integration**
   - Test with related skills
   - Verify MCP dependencies
   - Check composability

5. **Refinement**
   - Gather feedback
   - Optimize token costs
   - Update based on usage

## Example: Creating a "API Designer" Skill

```
Skill Created: api-designer
Category: domain
Triggers: ["api", "endpoint", "rest", "graphql"]
Commands: ["/api-design"]
Token Cost: metadata=38, full=1600, resources=400
Dependencies: MCPs=[serena, sequential]
Project Types: [nodejs, typescript, javascript]

Structure:
├── SKILL.md (Complete API design guidelines)
├── examples/
│   ├── rest-api-example.md
│   └── graphql-example.md
├── resources/
│   ├── rest-patterns.json
│   ├── graphql-patterns.json
│   └── api-best-practices.md
└── tests/
    └── api-designer.test.ts

Status: ✅ Ready to use
```

## Resources

The `resources/` directory contains:
- `skill-template.md` - Base template for all skills
- `validation-schema.json` - JSON schema for validation
- `examples/` - Example custom skills
