---
name: "command-name"
description: "Brief description of what this command does"
category: "workflow"
version: "1.0.0"

# Activation
triggers:
  exact: "/sc:command-name"
  aliases: ["/cmd", "/command"]
  keywords: ["keyword1", "keyword2"]

# Integration
requires:
  skills: ["skill1", "skill2"]
  mcps: ["mcp1", "mcp2"]
  agents: ["agent1"]

# Parameters
parameters:
  - name: "param1"
    type: "string"
    required: true
    description: "Parameter description"
  - name: "flag1"
    type: "boolean"
    required: false
    default: false

# Execution
autoExecute: false
tokenEstimate: 5000
executionTime: "2-5s"
---

# /sc:command-name - Command Title

Brief description of the command's purpose and use case.

## Purpose

Explain what problem this command solves and when to use it.

## Execution Flow

### 1. Initial Analysis
- What the command analyzes first
- What information it gathers
- What decisions it makes

### 2. Resource Activation

**Skills** (Auto-selected based on context):
- **skill1** → Use case 1
- **skill2** → Use case 2

**MCPs** (Auto-selected based on requirements):
- **mcp1** → Capability 1
- **mcp2** → Capability 2

**Agents** (If needed):
- **agent1** → Complex task delegation

### 3. Implementation Steps

1. **Step 1 Name**
   ```
   Detailed description of what happens in this step
   Include examples if helpful
   ```

2. **Step 2 Name**
   - Sub-task 1
   - Sub-task 2
   - Sub-task 3

3. **Step 3 Name**
   - Final tasks
   - Verification steps
   - Output generation

### 4. Quality Gates

Before marking complete:
- ✅ Criterion 1
- ✅ Criterion 2
- ✅ Criterion 3

## Examples

### Basic Usage
```bash
/sc:command-name "param1 value"

# Auto-activates:
# - Skills: skill1, skill2
# - MCPs: mcp1
# - Persona: relevant-persona

# Output:
# [Description of what gets generated]
```

### Advanced Usage
```bash
/sc:command-name "param1 value" --flag1=true --param2="value"

# Additional capabilities activated
# More complex output generated
```

## Integration

### With Skills
- How this command uses skills
- Which skills are activated when
- How skills enhance the command

### With MCPs
- How MCPs are utilized
- What data they provide
- How they're coordinated

### With Agents
- When agents are spawned
- What tasks they handle
- How results are integrated

## Configuration

`.claude/settings.json`:
```json
{
  "commands": {
    "command-name": {
      "enabled": true,
      "confirmBeforeExecute": false,
      "customSettings": "value"
    }
  }
}
```

## Success Metrics

- Execution success rate: >95%
- Average execution time: <5s
- Token efficiency: ~80% vs manual
- User satisfaction: >4.5/5

## Notes

- Any important considerations
- Known limitations
- Best practices
- Tips for optimal use
