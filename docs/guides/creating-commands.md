# Creating Custom Commands
## Workflow automation with slash commands

Complete guide to creating powerful slash commands for Claude Code workflow automation.

---

## 📋 What Are Slash Commands?

**Slash commands** are user-initiated shortcuts that trigger pre-defined prompts or workflows.

**Key characteristics**:
- **User-invoked**: You type `/command-name` to trigger
- **Immediate**: Activates instantly, no model decision needed
- **Reusable**: Same prompt every time, consistent results
- **Composable**: Can invoke skills, agents, or other commands

**vs Skills**:
- Skills: Model-invoked (automatic), Claude decides when to use
- Commands: User-invoked (manual), you decide when to use

---

## 🏗️ Command Structure

### Basic Command

**Simplest form** - Just a markdown file:

```markdown
<!-- .claude/commands/hello.md -->
Say "Hello, World!" in a creative way.
```

**Usage**:
```bash
claude
> /hello

# Claude responds:
# "Greetings, fellow human! 👋 Welcome to this beautiful day..."
```

### Command with Arguments

**Use `$ARGUMENTS` placeholder**:

```markdown
<!-- .claude/commands/explain.md -->
Explain the concept of $ARGUMENTS in simple terms with examples.
```

**Usage**:
```bash
> /explain recursion

# Expands to:
# "Explain the concept of recursion in simple terms with examples."
```

### Advanced Command

**Multi-line prompt with structure**:

```markdown
<!-- .claude/commands/scaffold.md -->
Generate a $ARGUMENTS with the following structure:

1. Create main component file
2. Create test file with comprehensive tests
3. Create Storybook stories
4. Create TypeScript types
5. Create barrel export (index.ts)

Follow project conventions:
- Use functional components with hooks
- Use React Testing Library for tests
- Use TypeScript strict mode
- Include accessibility attributes

After generation:
- Run tests to verify
- Show file structure
- Provide usage example
```

**Usage**:
```bash
> /scaffold react-component Button

# Generates complete component with tests and stories
```

---

## 📁 Command Locations

### Project Commands

**Location**: `.claude/commands/`

**Scope**: Available only in current project

**Use for**:
- Project-specific workflows
- Team-shared commands
- Version-controlled automation

**Example**:
```bash
my-project/
└── .claude/
    └── commands/
        ├── deploy-staging.md
        ├── run-e2e-tests.md
        └── generate-migration.md
```

### Personal Commands

**Location**: `~/.claude/commands/`

**Scope**: Available in all projects globally

**Use for**:
- Personal productivity shortcuts
- Cross-project workflows
- Reusable automation

**Example**:
```bash
~/.claude/commands/
├── commit-message.md
├── code-review.md
└── explain-code.md
```

### Command Priority

If same command exists in both locations:
```
Project command (./.claude/commands/hello.md)
    OVERRIDES
Personal command (~/.claude/commands/hello.md)
```

---

## 🎨 Command Patterns

### Pattern 1: Simple Prompt

**Use case**: Frequently asked questions

```markdown
<!-- commands/explain-architecture.md -->
Explain the architecture of this project:
- Main components and their responsibilities
- Data flow between components
- Key design patterns used
- Technology choices and rationale

Use diagrams if helpful.
```

### Pattern 2: Structured Workflow

**Use case**: Multi-step processes

```markdown
<!-- commands/feature-implementation.md -->
Implement feature: $ARGUMENTS

Follow this workflow:

## Phase 1: Planning
1. Analyze requirements
2. Break down into tasks
3. Identify affected components
4. Estimate complexity

## Phase 2: Implementation
1. Create/modify components
2. Add error handling
3. Implement logging
4. Write inline documentation

## Phase 3: Testing
1. Generate unit tests
2. Generate integration tests
3. Run test suite
4. Verify coverage >80%

## Phase 4: Documentation
1. Update README if needed
2. Add API documentation
3. Update changelog

## Phase 5: Review
1. Run linter
2. Run type checker
3. Security scan
4. Performance check

After completion, provide:
- Summary of changes
- Test results
- Next steps
```

### Pattern 3: Agent Invocation

**Use case**: Delegate to specialized agent

```markdown
<!-- commands/deep-review.md -->
@code-reviewer-agent

Perform comprehensive code review of recent changes:

Analyze:
- Security vulnerabilities
- Performance bottlenecks
- Code quality issues
- Test coverage gaps
- Documentation completeness

Provide:
- Prioritized issues (critical, high, medium, low)
- Specific line numbers and code snippets
- Actionable recommendations
- Estimated effort for fixes

Use multi-persona analysis:
- Security Auditor perspective
- Performance Tuner perspective
- Code Quality Reviewer perspective
- Test Engineer perspective
```

### Pattern 4: MCP Integration

**Use case**: Leverage MCP tools

```markdown
<!-- commands/api-docs.md -->
Generate API documentation for $ARGUMENTS:

1. Use Serena MCP to find all API endpoints
2. For each endpoint, extract:
   - HTTP method and path
   - Request parameters
   - Response schema
   - Error codes
   - Authentication requirements

3. Use Context7 MCP to find official documentation patterns

4. Generate markdown documentation following OpenAPI spec

5. Save to `docs/api/${ARGUMENTS}.md`

Include:
- Quick start examples
- Authentication guide
- Error handling
- Rate limits
```

### Pattern 5: Skill Combination

**Use case**: Orchestrate multiple skills

```markdown
<!-- commands/production-ready.md -->
Make $ARGUMENTS production-ready:

This command activates multiple skills:

1. **Code Reviewer Skill**
   - Analyze code quality
   - Check best practices

2. **Security Auditor Skill**
   - Scan for vulnerabilities
   - Check for secrets
   - Validate inputs

3. **Performance Optimizer Skill**
   - Identify bottlenecks
   - Suggest optimizations

4. **Test Generator Skill**
   - Ensure >80% coverage
   - Add edge case tests

5. **Documentation Writer Skill**
   - Generate JSDoc comments
   - Update README
   - Add usage examples

Provide comprehensive report with:
- All issues found (categorized)
- All improvements made
- Test coverage metrics
- Performance benchmarks
```

---

## 🚀 Real-World Commands

### Command 1: Code Scaffold

```markdown
<!-- commands/sc-scaffold.md -->
# Auto-generated by code-assistant-claude
# Version: 1.0.0

Generate $ARGUMENTS following project conventions:

## Detection
1. Detect project type (React, Vue, Angular, etc.)
2. Identify testing framework (Jest, Vitest, etc.)
3. Find component patterns in existing code

## Generation

### Component File
```typescript
// [ComponentName].tsx
import React from 'react';
import { [ComponentName]Props } from './types';

export const [ComponentName]: React.FC<[ComponentName]Props> = (props) => {
  // Implementation following project patterns
  return (
    // JSX with accessibility attributes
  );
};
```

### Test File
```typescript
// [ComponentName].test.tsx
import { render, screen } from '@testing-library/react';
import { [ComponentName] } from './[ComponentName]';

describe('[ComponentName]', () => {
  it('renders correctly', () => {
    // Comprehensive tests
  });
});
```

### Stories File (if Storybook detected)
```typescript
// [ComponentName].stories.tsx
export default {
  title: 'Components/[ComponentName]',
  component: [ComponentName]
};

export const Primary = { args: { ... } };
```

### Types File
```typescript
// types.ts
export interface [ComponentName]Props {
  // Type definitions
}
```

### Barrel Export
```typescript
// index.ts
export { [ComponentName] } from './[ComponentName]';
export type { [ComponentName]Props } from './types';
```

## Post-Generation
1. Run tests: `npm test`
2. Show file structure
3. Provide usage example
4. Suggest Storybook command if available
```

### Command 2: Comprehensive Review

```markdown
<!-- commands/sc-review.md -->
# Auto-generated by code-assistant-claude
# Version: 1.0.0

Perform comprehensive multi-persona code review:

## Step 1: Analyze Changes
```bash
git diff main...HEAD
```

Identify:
- Files modified
- Lines changed
- Scope of changes

## Step 2: Multi-Persona Analysis

Invoke specialized skills:

### 🛡️ Security Auditor
- SQL injection vulnerabilities
- XSS vulnerabilities
- Authentication/authorization issues
- Secrets in code
- Input validation gaps

### ⚡ Performance Tuner
- N+1 query patterns
- Unnecessary re-renders (React)
- Memory leaks
- Large bundle sizes
- Slow algorithms (O(n²) or worse)

### ✅ Code Reviewer
- Naming conventions
- Code organization
- SOLID principles
- DRY violations
- Code complexity

### 🧪 Test Engineer
- Test coverage (<80% warning)
- Missing edge cases
- Test quality
- Mock usage

## Step 3: Prioritize Issues

Categorize findings:
- 🚨 Critical: Security, data loss, breaking changes
- ⚠️  High: Performance, quality issues
- 💡 Medium: Suggestions, improvements
- 📝 Low: Style, minor improvements

## Step 4: Generate Report

```markdown
# Code Review Report

## Summary
- Files reviewed: [count]
- Issues found: [count by severity]
- Test coverage: [percentage]

## Critical Issues 🚨
[List with line numbers and fixes]

## High Priority ⚠️
[List with recommendations]

## Suggestions 💡
[List with improvements]

## Test Coverage 🧪
[Coverage report]

## Next Steps
[Action items]
```

## Step 5: Save Report
Save to `claudedocs/review_[timestamp].md`
```

### Command 3: Research & Synthesis

```markdown
<!-- commands/sc-research.md -->
# Auto-generated by code-assistant-claude
# Version: 1.0.0

Conduct deep research on: $ARGUMENTS

## Research Strategy

### 1. Planning Phase
- Decompose question into sub-questions
- Identify information types needed
- Estimate hop count (1-5)
- Set confidence threshold (0.7)

### 2. Execution Phase

Use Tavily MCP for web search:
```typescript
// Parallel searches for efficiency
const searches = await Promise.all([
  tavily.search({ query: "[main topic]" }),
  tavily.search({ query: "[sub-topic 1]" }),
  tavily.search({ query: "[sub-topic 2]" })
]);
```

Use Context7 MCP for official docs:
```typescript
// If technical topic
const officialDocs = await context7.search({
  query: "[framework/library name]",
  type: "official"
});
```

### 3. Analysis Phase

Use Sequential MCP for synthesis:
- Extract key findings
- Identify patterns
- Resolve contradictions
- Score confidence (0-1)

### 4. Validation Phase
- Verify with additional sources
- Cross-reference claims
- Check source credibility

## Output Format

```markdown
# Research Report: [Topic]

**Date**: [timestamp]
**Confidence**: [score] ([Low/Medium/High/Very High])
**Sources**: [count]

## Executive Summary
[3-5 sentence overview]

## Key Findings
1. [Finding 1] (Confidence: [score])
   - Evidence: [citation]

2. [Finding 2] (Confidence: [score])
   - Evidence: [citation]

## Detailed Analysis
[Comprehensive analysis]

## Sources
1. [Source 1] - [Title](URL) - Credibility: Tier-1
2. [Source 2] - [Title](URL) - Credibility: Tier-2

## Contradictions Resolved
[How conflicting information was resolved]

## Gaps & Limitations
[What couldn't be fully answered]

## Recommendations
[Actionable next steps]
```

## Save Location
`claudedocs/research_[topic]_[timestamp].md`
```

---

## 🎯 Command Best Practices

### 1. Clear Naming

```bash
# ✅ Good - Clear, descriptive
/scaffold-component
/review-security
/generate-migration
/deploy-staging

# ❌ Bad - Vague, ambiguous
/do-thing
/fix
/run
/make
```

### 2. Argument Handling

**Single argument**:
```markdown
Create a $ARGUMENTS following best practices.
```

**Multiple arguments** (space-separated):
```markdown
<!-- Commands receive full argument string -->
Generate component $ARGUMENTS

<!-- User types: /scaffold Button --variants --tests -->
<!-- Expands to: Generate component Button --variants --tests -->

Parse arguments:
- Component name: First word (Button)
- Flags: Words starting with -- (--variants, --tests)
```

**Complex arguments** (JSON):
```markdown
Generate API endpoint with configuration: $ARGUMENTS

<!-- User types: -->
<!-- /generate-api {"path": "/users", "method": "POST", "auth": true} -->

Parse JSON configuration and implement accordingly.
```

### 3. Error Handling

```markdown
<!-- commands/safe-command.md -->
Execute $ARGUMENTS with validation:

## Pre-execution Checks
1. Verify all required files exist
2. Check for unsaved changes
3. Validate arguments
4. Confirm user intent for destructive operations

## Execution
[Command logic]

## Post-execution Validation
1. Verify output was generated
2. Run tests if applicable
3. Check for errors
4. Provide success confirmation

## Error Recovery
If any step fails:
1. Log error details
2. Rollback changes if possible
3. Suggest corrective action
4. Preserve user work
```

### 4. Documentation

**Include usage instructions in command**:
```markdown
<!-- commands/complex-command.md -->
# Usage: /complex-command <arg1> <arg2> [--flag]

Execute complex workflow with arguments:
- arg1: [description]
- arg2: [description]
- --flag: [optional flag description]

## Examples
```
/complex-command user auth --secure
/complex-command product api --rest
```

[Command implementation]
```

---

## 🎪 Command Categories

### Development Workflow Commands

#### /sc:implement

```markdown
<!-- commands/sc-implement.md -->
# Auto-generated by code-assistant-claude

Implement feature: $ARGUMENTS

## Mode Activation
Activate Orchestration Mode for optimal tool selection.

## Workflow

### Phase 1: Analysis & Planning
1. Analyze requirements
2. Use TodoWrite to create task breakdown (3+ tasks)
3. Identify affected files
4. Plan architecture

### Phase 2: Implementation
1. Generate/modify components
2. Add error handling
3. Implement validation
4. Add logging

### Phase 3: Testing
1. Generate unit tests (test-generator skill)
2. Generate integration tests
3. Run test suite
4. Verify coverage >80%

### Phase 4: Quality Assurance
1. Code review (code-reviewer skill)
2. Security scan (security-auditor skill)
3. Performance check (performance-optimizer skill)
4. Lint and typecheck

### Phase 5: Documentation
1. Add inline comments
2. Update README if needed
3. Generate API docs if applicable
4. Update changelog

## Activation
Auto-activate skills:
- code-reviewer
- test-generator
- security-auditor

Auto-enable MCPs:
- serena (code navigation)
- sequential (if complex)

## Output
Provide comprehensive summary:
- Files created/modified
- Tests generated
- Coverage metrics
- Quality checks passed
- Next steps
```

#### /sc:test

```markdown
<!-- commands/sc-test.md -->
Generate and run tests for: $ARGUMENTS

## Detection
1. Identify file to test
2. Detect testing framework:
   - Jest
   - Vitest
   - Mocha
   - pytest
   - JUnit

3. Find existing test patterns in project

## Test Generation

Use test-generator skill to create:

### Unit Tests
- Test main functionality
- Test edge cases
- Test error handling
- Mock external dependencies

### Integration Tests (if applicable)
- Test component integration
- Test API endpoints
- Test database operations

## Test Execution
```bash
# Run tests
npm test $ARGUMENTS

# Or framework-specific
pytest $ARGUMENTS
cargo test $ARGUMENTS
```

## Coverage Analysis
1. Generate coverage report
2. Identify uncovered lines
3. Suggest additional tests if <80%

## Output
```
Test Results: $ARGUMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tests: 15 passed, 0 failed
Coverage: 87% ✅
Time: 1.2s

Uncovered lines:
• Line 42-45: Error handling path
• Line 89: Edge case for empty array

Suggestions:
• Add test for error scenario
• Add test for empty input
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
```

### Optimization Commands

#### /sc:optimize-tokens

```markdown
<!-- commands/sc-optimize-tokens.md -->
Analyze and optimize token usage in current session.

## Analysis

### 1. Current Usage Breakdown
Show token consumption by category:
```
📊 Token Usage Analysis
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
System Prompt:        2,000 tokens (1.0%)
MCP Servers:          6,500 tokens (3.3%)
  ├─ Serena:            500 tokens
  ├─ Sequential:      2,000 tokens
  ├─ Magic:           1,500 tokens
  └─ Context7:        2,500 tokens
Skills (loaded):      3,500 tokens (1.8%)
  ├─ code-reviewer:   2,000 tokens
  └─ frontend-design: 1,500 tokens
Messages:            8,000 tokens (4.0%)
Available:         180,000 tokens (90.0%)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 2. Identify Waste
Find unused resources:
- MCPs loaded but not used in last 5 minutes
- Skills loaded but not triggered
- Old messages consuming space

### 3. Recommendations
```
💡 Optimization Recommendations:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Disable Context7 MCP (not used in 10 min)
   Savings: -2,500 tokens

2. Unload frontend-design skill (not triggered)
   Savings: -1,500 tokens

3. Enable auto-compact for messages
   Savings: -2,400 tokens (30% of messages)

Total potential savings: -6,400 tokens (3.2%)

Apply recommendations? [Y/n]
```

### 4. Auto-Apply (if approved)
Execute recommended optimizations automatically.
```

#### /sc:optimize-mcp

```markdown
<!-- commands/sc-optimize-mcp.md -->
Optimize MCP server configuration for current project.

## Analysis

### 1. Detect Project Type
Analyze:
- package.json / requirements.txt
- Framework indicators
- Tool usage patterns

### 2. Recommend MCPs

Based on project type, suggest optimal MCPs:

**For React projects**:
✅ Keep: magic, serena, playwright
❌ Remove: backend-specific MCPs

**For Node.js API projects**:
✅ Keep: serena, sequential, context7
❌ Remove: frontend-specific MCPs

**For Python projects**:
✅ Keep: serena, sequential
❌ Remove: JavaScript-specific MCPs

### 3. Token Analysis

Show token cost per MCP:
```
MCP Server Analysis
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Active MCPs:
✅ serena        500 tokens    (used 15 times)  Keep
✅ sequential  3,000 tokens    (used 3 times)   Keep
⚠️  magic      1,500 tokens    (used 0 times)   Consider removing
❌ context7    2,500 tokens    (used 0 times)   Remove

Recommendations:
• Disable magic, context7: -4,000 tokens
• Enable on-demand loading for sequential
```

### 4. Apply Optimization
Update `.mcp.json` with optimized configuration.
```

### SuperClaude Mode Commands

#### /sc:brainstorm

```markdown
<!-- commands/sc-brainstorm.md -->
# Auto-generated by code-assistant-claude
# Implements SuperClaude Brainstorming Mode

Brainstorm and discover requirements for: $ARGUMENTS

## Mode Activation
Activate Brainstorming Mode:
- Socratic dialogue approach
- Non-presumptive questioning
- Collaborative exploration
- Progressive requirement elicitation

## Discovery Process

### Round 1: Core Understanding
Ask 2-3 key questions:
1. What problem does this solve?
2. Who are the primary users?
3. What's the main value proposition?

### Round 2: Context Deep-Dive
Based on answers, explore:
- User workflows
- Technical constraints
- Integration requirements
- Success criteria

### Round 3: Validation
- Summarize understanding
- Identify gaps
- Clarify ambiguities
- Confirm assumptions

### Round 4: Specification
Generate structured brief:
```markdown
# [Project/Feature] Brief

## Problem Statement
[Clear problem definition]

## Target Users
[User personas]

## Requirements
### Functional
- [Requirement 1]
- [Requirement 2]

### Non-Functional
- Performance: [criteria]
- Security: [criteria]
- Scalability: [criteria]

## Technical Approach
[High-level architecture]

## Success Metrics
[How to measure success]

## Risks & Mitigation
[Potential issues and solutions]

## Next Steps
[Implementation roadmap]
```

## Output
Save brief to: `claudedocs/brief_[topic]_[timestamp].md`
```

#### /sc:business-panel

```markdown
<!-- commands/sc-business-panel.md -->
# Auto-generated by code-assistant-claude
# Implements SuperClaude Business Panel Mode

Analyze $ARGUMENTS with business expert panel.

## Mode Activation
Activate Business Panel Mode with multi-expert analysis.

## Expert Selection

Auto-select 3-5 most relevant experts based on content:

**Strategy Focus**: Porter, Kim/Mauborgne, Collins
**Innovation Focus**: Christensen, Drucker, Meadows
**Risk Focus**: Taleb, Meadows, Porter
**Marketing Focus**: Godin, Christensen, Doumont

## Analysis Mode

Detect appropriate mode:
- **Discussion**: Collaborative multi-perspective (default)
- **Debate**: Adversarial stress-testing (for controversial decisions)
- **Socratic**: Question-driven exploration (for learning)

## Execution

### Discussion Mode
1. Each expert analyzes from their framework
2. Experts build on each other's insights
3. Cross-pollination of perspectives
4. Synthesis across frameworks

### Debate Mode
1. Experts present conflicting views
2. Structured rebuttal and defense
3. Meadows analyzes system dynamics of disagreement
4. Higher-order solution from productive tension

### Socratic Mode
1. Experts generate probing questions
2. User responds
3. Follow-up questions based on responses
4. Extract strategic thinking patterns

## Output Format

```markdown
# Business Panel Analysis: [Topic]

## Expert Analysis

**PORTER** - Competitive Strategy:
[Analysis from five forces perspective]

**CHRISTENSEN** building on PORTER:
[Jobs-to-be-done perspective connecting to competitive dynamics]

**MEADOWS** - Systems Thinking:
[System structure and leverage points]

**DOUMONT** - Communication:
[Clear action<output truncated - length exceeded>
```

Eccellente progresso! Continuo con la guida alla creazione di comandi. Creo un nuovo file per completarla:

<function_calls>
<invoke name="TodoWrite">
<parameter name="todos">[{"content": "Add reset/uninstall functionality to architecture design", "status": "completed", "activeForm": "Adding reset/uninstall functionality to architecture design"}, {"content": "Create comprehensive user guide for code-assistant-claude", "status": "completed", "activeForm": "Creating comprehensive user guide for code-assistant-claude"}, {"content": "Write getting started guide with installation and setup", "status": "completed", "activeForm": "Writing getting started guide with installation and setup"}, {"content": "Create quick start tutorial for 5-minute intro", "status": "completed", "activeForm": "Creating quick start tutorial for 5-minute intro"}, {"content": "Document skill creation guide with templates", "status": "completed", "activeForm": "Documenting skill creation guide with templates"}, {"content": "Create command creation guide with examples", "status": "completed", "activeForm": "Creating command creation guide with examples"}, {"content": "Create summary document of all documentation", "status": "in_progress", "activeForm": "Creating summary document of all documentation"}, {"content": "Create tutorial examples for common workflows", "status": "pending", "activeForm": "Creating tutorial examples for common workflows"}, {"content": "Write MCP integration guide", "status": "pending", "activeForm": "Writing MCP integration guide"}, {"content": "Create troubleshooting and FAQ documentation", "status": "pending", "activeForm": "Creating troubleshooting and FAQ documentation"}]