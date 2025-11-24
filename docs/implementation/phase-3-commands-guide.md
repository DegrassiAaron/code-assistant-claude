# Phase 3: Command System - Complete Implementation Guide
## Workflow Automation with Slash Commands

**Status**: 📋 Ready for Implementation
**Duration**: 1 week (Week 5)
**Complexity**: Medium
**Dependencies**: Phase 2 (Skills System), Phase 4 (MCP Code Execution)

---

## Overview

### Objectives

✅ **Command Template Generator**: Create new commands easily
✅ **15+ Workflow Commands**: Development automation
✅ **SuperClaude Integration**: Mode-switching and analysis commands
✅ **Optimization Commands**: Token and MCP management
✅ **Validation Framework**: Ensure command correctness

### Success Metrics

- Command execution success rate: **>95%**
- Average execution time: **<3 seconds**
- User satisfaction: **>4.5/5**
- Documentation completeness: **100%**

---

## Architecture

### Command Structure

```markdown
---
name: "command-name"
description: "Brief description"
category: "workflow|superclaude|optimization|git"
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
autoExecute: false           # Requires confirmation
tokenEstimate: 5000
executionTime: "2-5s"
---

# Command Implementation

[Detailed instructions for Claude Code...]
```

---

## File Structure

```
templates/
└── commands/
    ├── command-template/              # Meta-template
    │   └── COMMAND.md
    │
    ├── workflow/                      # Development workflows
    │   ├── sc-implement.md            # Full feature implementation
    │   ├── sc-scaffold.md             # Component generation
    │   ├── sc-review.md               # Code review
    │   ├── sc-test.md                 # Test generation
    │   ├── sc-commit.md               # Git commits
    │   └── sc-deploy.md               # Deployment
    │
    ├── superclaude/                   # SuperClaude commands
    │   ├── sc-brainstorm.md           # Brainstorming mode
    │   ├── sc-research.md             # Deep research
    │   ├── sc-analyze.md              # Multi-dimensional analysis
    │   ├── sc-business-panel.md       # Business expert panel
    │   ├── sc-design.md               # Architecture design
    │   └── sc-troubleshoot.md         # Systematic debugging
    │
    ├── optimization/                  # Token & MCP optimization
    │   ├── sc-optimize-tokens.md      # Token analysis
    │   ├── sc-optimize-mcp.md         # MCP recommendations
    │   ├── sc-cleanup-context.md      # Context cleanup
    │   └── sc-mode.md                 # Mode switching
    │
    └── git/                           # Git workflow commands
        ├── sc-feature.md              # Start feature (GitFlow)
        ├── sc-release.md              # Release preparation
        ├── sc-hotfix.md               # Emergency fixes
        └── sc-finish-feature.md       # Merge feature

src/
└── core/
    └── commands/
        ├── command-parser.ts          # Parse command syntax
        ├── command-executor.ts        # Execute commands
        ├── command-validator.ts       # Validate commands
        ├── parameter-parser.ts        # Parse parameters
        └── types.ts                   # TypeScript interfaces

tests/
├── unit/
│   └── commands/
│       ├── command-parser.test.ts
│       ├── command-executor.test.ts
│       └── parameter-parser.test.ts
│
└── integration/
    └── commands/
        ├── workflow-commands.test.ts
        ├── superclaude-commands.test.ts
        └── optimization-commands.test.ts
```

---

## Step-by-Step Implementation

### Day 1: Core Infrastructure

**File**: `src/core/commands/types.ts`

```typescript
export interface CommandMetadata {
  name: string;
  description: string;
  category: 'workflow' | 'superclaude' | 'optimization' | 'git';
  version: string;

  triggers: {
    exact: string;
    aliases?: string[];
    keywords?: string[];
  };

  requires?: {
    skills?: string[];
    mcps?: string[];
    agents?: string[];
  };

  parameters?: CommandParameter[];

  autoExecute: boolean;
  tokenEstimate: number;
  executionTime: string;
}

export interface CommandParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array';
  required: boolean;
  description: string;
  default?: any;
  options?: string[];        // For enum-like parameters
}

export interface Command {
  metadata: CommandMetadata;
  content: string;
  loaded: boolean;
}

export interface CommandExecutionContext {
  command: string;
  parameters: Record<string, any>;
  userMessage: string;
  projectContext?: any;
}

export interface CommandExecutionResult {
  success: boolean;
  output?: string;
  activatedSkills: string[];
  activatedMCPs: string[];
  activatedAgents: string[];
  tokensUsed: number;
  executionTime: number;
}
```

---

### Day 2-3: Command Implementation Examples

#### Workflow Command: /sc:implement

`templates/commands/workflow/sc-implement.md`

```markdown
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
   📋 Implementation Plan: [Feature Name]
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
```

---

#### SuperClaude Command: /sc:business-panel

`templates/commands/superclaude/sc-business-panel.md`

```markdown
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

## Token Efficiency

- Traditional business analysis: ~60K tokens
- With business-panel command: ~12K tokens
- **Savings**: 80%

## Integration

- **Sequential MCP**: Multi-step expert reasoning
- **Business-panel skill**: Expert personas and frameworks
- **Symbol system**: Efficient expert communication
```

---

### Day 4: Optimization Commands

#### Token Optimization: /sc:optimize-tokens

`templates/commands/optimization/sc-optimize-tokens.md`

```markdown
---
name: "sc-optimize-tokens"
description: "Analyze and optimize token usage in current session"
category: "optimization"
version: "1.0.0"

triggers:
  exact: "/sc:optimize-tokens"
  aliases: ["/tokens", "/optimize"]
  keywords: ["token usage", "optimize context"]

requires:
  mcps: ["serena"]

autoExecute: true
tokenEstimate: 3000
executionTime: "5-10s"
---

# /sc:optimize-tokens - Token Usage Analysis

Real-time token usage analysis and optimization recommendations.

## Analysis Performed

### 1. Current Usage Breakdown
```
📊 Token Usage Analysis
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Budget:    200,000 tokens (100%)
Used:       45,000 tokens (22.5%) 🟢

Breakdown:
├─ System:           2,000 tokens (1.0%)
├─ MCP Servers:      8,500 tokens (4.3%)
│  ├─ Serena:        500 tokens
│  ├─ Sequential:  2,000 tokens
│  ├─ Magic:       1,500 tokens
│  ├─ Context7:    2,500 tokens
│  └─ Tavily:      2,000 tokens
├─ Skills:           6,500 tokens (3.3%)
│  ├─ code-reviewer:     2,000 tokens
│  ├─ frontend-design:   1,500 tokens
│  ├─ test-generator:    2,000 tokens
│  └─ research-mode:     1,000 tokens
├─ Messages:        28,000 tokens (14.0%)
└─ Available:      155,000 tokens (77.5%)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 2. Optimization Recommendations

```
💡 Recommendations:
1. Unload unused MCPs:
   • Context7 (-2,500 tokens) - Not used in last 10 messages
   • Tavily (-2,000 tokens) - No research queries

2. Unload inactive skills:
   • research-mode (-1,000 tokens) - Not triggered

3. Enable compression mode:
   • Symbol system → 30% reduction on messages
   • Estimated savings: 8,400 tokens

4. Cleanup old messages:
   • Keep last 10 messages
   • Archive older context
   • Estimated savings: 5,000 tokens

Total Potential Savings: 18,900 tokens (42% reduction)
```

### 3. Auto-Optimization

Automatically applies safe optimizations:
- Unloads unused MCPs (not accessed in >10 messages)
- Unloads inactive skills (not triggered)
- Clears message cache (keeps last 10)

## Usage

```bash
# Basic analysis
/sc:optimize-tokens

# With auto-apply
/sc:optimize-tokens --apply

# Focus on specific area
/sc:optimize-tokens --focus mcp
/sc:optimize-tokens --focus skills
```
```

---

### Day 5-6: Implementation & Testing

**Implementation Steps**:

1. **Create command parser**:
   ```typescript
   // src/core/commands/command-parser.ts
   export class CommandParser {
     parse(input: string): ParsedCommand {
       // Parse /sc:command-name param1 param2 --flag
     }
   }
   ```

2. **Create command executor**:
   ```typescript
   // src/core/commands/command-executor.ts
   export class CommandExecutor {
     async execute(command: ParsedCommand): Promise<ExecutionResult> {
       // 1. Load command definition
       // 2. Validate parameters
       // 3. Activate required skills/MCPs
       // 4. Execute command logic
       // 5. Return results
     }
   }
   ```

3. **Implement all 15+ commands** following templates

4. **Write comprehensive tests**

---

## Validation Checklist

### Phase 3 Completion Criteria

#### Infrastructure ✅
- [ ] Command parser working
- [ ] Command executor functional
- [ ] Parameter validation implemented
- [ ] Command template generator ready

#### Commands Implemented ✅
- [ ] 6 workflow commands
- [ ] 6 SuperClaude commands
- [ ] 4 optimization commands
- [ ] All commands tested

#### Integration ✅
- [ ] Skills activated correctly
- [ ] MCPs coordinated properly
- [ ] Agents delegated when needed
- [ ] Token tracking functional

#### Testing ✅
- [ ] Unit test coverage >80%
- [ ] Integration tests passing
- [ ] E2E workflow tests passing
- [ ] Command success rate >95%

---

**End of Phase 3 Implementation Guide**

**Generated**: 2025-11-23
**Next**: Phase 5-8 guides
