# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**code-assistant-claude** is an intelligent self-configuring framework for Claude Code CLI that achieves 98.7% token reduction through revolutionary MCP code execution. The project combines SuperClaude's behavioral sophistication with progressive skill loading and sandboxed code execution.

## Build & Development Commands

```bash
# Development (watch mode with auto-rebuild)
npm run dev

# Production build
npm run build

# Type checking (always run before committing)
npm run typecheck

# Linting and formatting
npm run lint              # Check linting issues
npm run lint:fix          # Auto-fix linting issues
npm run format:check      # Check code formatting
npm run format            # Auto-format code

# Testing
npm test                  # Run all tests (unit + integration)
npm run test:watch        # Watch mode (recommended during development)
npm run test:unit         # Unit tests only
npm run test:integration  # Integration tests only
npm run test:e2e          # End-to-end tests
npm run test:coverage     # Generate coverage report

# Security and dependencies
npm run audit             # Security audit
npm run audit:production  # Production dependencies audit
npm run check:deps        # Check for outdated dependencies
```

## Key Architecture Components

### Core Structure

The architecture is organized into layered modules under `src/`:

**CLI Layer** (`src/cli/`)
- `index.ts` - Main CLI entrypoint using Commander.js
- `commands/` - User-facing commands: `init`, `config`, `reset`, `mcp-add`

**Core Systems** (`src/core/`)
- `analyzers/` - Project analysis: tech stack detection, git workflows, monorepo handling
- `configurators/` - Configuration generation based on project analysis
- `skills/` - Progressive skill loading system (95% token reduction)
- `agents/` - Multi-agent coordination and orchestration
- `commands/` - Command parsing, validation, and execution
- `execution-engine/` - **Revolutionary MCP code execution (98.7% token reduction)**
- `optimizers/` - Token optimization: symbols, compression, budget management
- `utils/` - Shared utilities: logging, file operations, validation

### Execution Engine Architecture

The execution engine (`src/core/execution-engine/`) implements the revolutionary 98.7% token reduction through five phases:

1. **Discovery** - Progressive tool discovery via filesystem indexing and semantic search
2. **Code Generation** - Type-safe wrapper generation from MCP schemas
3. **Security Validation** - Pattern-based analysis, risk assessment, PII detection
4. **Sandbox Execution** - Isolated execution in Docker/VM/Process sandboxes
5. **Result Processing** - Output summarization with PII tokenization

**Key Subdirectories:**
- `mcp-code-api/` - Code generation from MCP tool definitions
- `sandbox/` - Multiple sandbox implementations (Docker, VM, Process)
- `security/` - Code validation, risk assessment, approval gates, PII tokenization
- `discovery/` - Filesystem and semantic tool discovery
- `workspace/` - Workspace management, state persistence, caching
- `audit/` - Compliance logging, anomaly detection

### Skills System

Skills use **progressive loading** with three stages:
1. **Metadata** (~30-50 tokens) - Always loaded
2. **Full Content** (~1,500-3,000 tokens) - Loaded when skill is activated
3. **Resources** (variable) - Loaded only when needed

Skills are categorized as:
- `core` - Auto-activating foundational skills
- `domain` - Domain-specific (frontend, backend, testing)
- `superclaude` - Behavioral modes (brainstorming, research, orchestration)
- `meta` - Meta-level orchestration

## Testing Strategy

### Test Organization

Tests are organized in `tests/` mirroring the source structure:

- `unit/` - Fast isolated tests (~80% coverage target)
- `integration/` - Module integration tests
- `e2e/` - Full workflow tests (uses Jest)
- `performance/` - Benchmarks for token reduction metrics
- `fixtures/` - Reusable test data

### Quick Verification Workflow

**During development:**
```bash
# Terminal 1: Auto-rebuild on changes
npm run dev

# Terminal 2: Auto-run tests on changes
npm run test:watch
```

**Before commits:**
```bash
npm run typecheck && npm run lint && npm test && npm run build
```

**Testing specific features:**
```bash
npm test -- tests/unit/skills  # Test skills system only
npm test -- --changed          # Test only changed files
```

### Coverage Requirements

Maintain minimum coverage (configured in `vitest.config.ts`):
- Lines: 80%
- Functions: 80%
- Branches: 80%
- Statements: 80%

## Code Style & Conventions

### TypeScript Guidelines

- **Strict mode enabled** - All type safety rules enforced
- **No implicit any** - Explicit typing required (warnings on `any`)
- **Unused parameters** - Prefix with `_` if intentional (e.g., `_unusedParam`)
- **Path aliases** - Use `@/` for `src/` and `@tests/` for `tests/`

### File Naming

- Source files: `kebab-case.ts` (e.g., `token-tracker.ts`)
- Test files: `*.test.ts` or `*.spec.ts`
- Type definitions: `types.ts` or `*.d.ts`
- Classes: `PascalCase` (e.g., `SkillLoader`)

### Code Organization

- **Single Responsibility** - Each module has one clear purpose
- **Explicit exports** - Use named exports from `index.ts` barrel files
- **Type-first** - Define interfaces before implementations
- **Error handling** - Use custom error classes from `src/core/skills/errors.ts`

### Import Order

1. Node.js built-ins
2. External dependencies
3. Internal modules (using `@/` alias)
4. Types (using `type` keyword)

## Common Development Patterns

### Creating New CLI Commands

1. Add command handler in `src/cli/commands/[command-name].ts`
2. Export command builder following existing patterns
3. Register in `src/cli/index.ts`
4. Add integration tests in `tests/integration/`
5. Update documentation

### Working with the Execution Engine

**Security-first principle:**
- Always validate code before execution
- Use appropriate sandbox based on risk level
- Implement PII tokenization for sensitive data
- Log all operations for audit trails

**Example pattern:**
```typescript
import { ExecutionOrchestrator } from '@/core/execution-engine/orchestrator';

const orchestrator = new ExecutionOrchestrator('./templates/mcp-tools');
await orchestrator.initialize();

const result = await orchestrator.execute(
  userIntent,
  'typescript',
  { timeout: 5000, sandboxType: 'process' }
);
```

### Adding New Skills

Skills follow the progressive loading pattern:

1. Create skill file in `templates/skills/`
2. Add YAML frontmatter with metadata:
   ```yaml
   ---
   name: skill-name
   version: 1.0.0
   category: core|domain|superclaude|meta
   triggers:
     keywords: [keyword1, keyword2]
     patterns: [regex-pattern]
   tokenCost:
     metadata: 40
     fullContent: 2000
   ---
   ```
3. Write skill content in markdown
4. Test with `tests/unit/skills/skill-loader.test.ts` patterns

### Token Optimization

**Always prioritize token efficiency:**
- Use symbol substitution from `src/core/optimizers/symbols/`
- Leverage abbreviation engine for technical terms
- Implement hierarchical disclosure (progressive detail)
- Monitor token usage with `src/core/skills/token-tracker.ts`

## Important Implementation Details

### Execution Engine Token Economics

Traditional MCP approach: **200,000 tokens** per session
Code execution approach: **2,700 tokens** per session
**Reduction: 98.7%**

This is achieved by:
- Loading only tool metadata upfront (~200 tokens)
- Generating code from schemas (~500 tokens)
- Processing data in sandbox (zero context tokens)
- Returning only summaries (~200 tokens)

### Skills Progressive Loading

Instead of loading all skills upfront:
- 20 skills × 40 tokens metadata = **800 tokens** (always loaded)
- Only activated skills load full content (~2,000 tokens each)
- Resources loaded on-demand only

**Total savings: 95% vs. loading all skills**

### Sandbox Security Layers

Multi-layer security enforced by `src/core/execution-engine/security/`:
1. Code validation (pattern-based blocking)
2. Risk assessment (0-100 scoring)
3. PII tokenization (automatic detection)
4. Approval gates (high-risk operations)
5. Resource limits (CPU, memory, disk)
6. Network policies (whitelist/blacklist)
7. Audit logging (compliance)

### Git Workflow

This project uses Conventional Commits:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `chore:` - Maintenance tasks
- `test:` - Test changes
- `refactor:` - Code refactoring

**Pre-commit hooks** (via Husky):
- Runs linting and formatting
- Runs type checking
- Runs unit tests
- Blocks commit if any check fails

## Testing Hooks

The project includes custom Claude Code hooks in `.claude/hooks/`:

**post-edit.sh** - Runs after Claude modifies code:
- Type checking
- Linting
- Unit tests

**pre-commit.sh** - Runs before commits:
- Full build
- All tests
- Security audit

Configure in Claude Code settings to enable automatic verification.

## Performance Benchmarks

Expected performance metrics (run `npm run benchmark`):
- Token reduction: ≥98.7%
- Code generation: <50ms
- Sandbox startup: <500ms
- Progressive skill loading: <100ms
- Total overhead: <3s

## Security Considerations

**When working with execution-engine:**
- Never bypass sandbox isolation
- Always validate generated code
- Implement PII tokenization for sensitive data
- Use approval gates for high-risk operations
- Maintain comprehensive audit logs

**Dangerous patterns blocked:**
- `eval()`, `Function()` - Dynamic code execution
- `exec()`, `spawn()` - Shell command execution
- `innerHTML`, `dangerouslySetInnerHTML` - XSS vectors
- Prototype pollution patterns
- Direct DOM/localStorage access

## Common Tasks

**Adding MCP server support:**
1. Add template in `templates/mcp-tools/`
2. Create schema parser in `src/core/execution-engine/mcp-code-api/`
3. Add discovery rules in `src/core/execution-engine/discovery/`
4. Test with integration tests

**Optimizing token usage:**
1. Profile with `src/core/optimizers/budget/usage-monitor.ts`
2. Apply compression strategies from `src/core/optimizers/compression/`
3. Use symbol substitution system
4. Validate savings with performance benchmarks

**Debugging sandbox issues:**
1. Check logs in `logs/` directory
2. Review audit trail in `src/core/execution-engine/audit/`
3. Test with different sandbox types (Process → VM → Docker)
4. Verify resource limits and network policies

## Resources

- Templates: `templates/` - Skills, commands, agents, MCP tools
- Documentation: `docs/` - User guides, examples, implementation phases
- Test fixtures: `tests/fixtures/` - Reusable test data
- Build output: `dist/` - Compiled distributable (never edit directly)

## Node.js Requirements

- **Minimum:** Node.js ≥18.0.0, npm ≥9.0.0
- Specified in `package.json#engines`
- Enforced during installation

## Key Dependencies

**Production:**
- `commander` - CLI framework
- `inquirer` - Interactive prompts
- `tiktoken` - Token counting
- `dockerode` - Docker sandbox
- `vm2` - VM sandbox
- `better-sqlite3` - State persistence
- `handlebars` - Template generation

**Development:**
- `vitest` - Unit/integration testing
- `jest` - E2E testing
- `tsup` - Fast TypeScript bundler
- `eslint` + `prettier` - Code quality
- `husky` - Git hooks

## Critical Files

**Never manually edit:**
- `dist/` - Build artifacts (regenerate with `npm run build`)
- `node_modules/` - Dependencies (managed by npm)
- `coverage/` - Test coverage reports

**Configuration files:**
- `tsconfig.json` - TypeScript compiler options
- `vitest.config.ts` - Test configuration
- `.eslintrc.json` - Linting rules
- `tsup.config.ts` - Build configuration

## When Adding New Features

1. **Analyze token impact** - Every feature must justify its token cost
2. **Write tests first** - TDD approach preferred
3. **Document in code** - JSDoc comments for public APIs
4. **Update CHANGELOG** - Follow Keep a Changelog format
5. **Benchmark if relevant** - Especially for execution-engine changes
6. **Security review** - Especially for sandbox or security layer changes

## Debugging Tips

**Token usage analysis:**
```typescript
import { TokenTracker } from '@/core/skills/token-tracker';
const tracker = TokenTracker.getInstance();
const usage = tracker.getCurrentUsage();
console.log('Token usage:', usage);
```

**Skill loading debug:**
```typescript
import { Logger } from '@/core/utils/logger';
Logger.configure({ level: 'debug' });
```

**Sandbox debugging:**
```bash
# Run with debug logging
npm run dev -- --debug

# Check sandbox logs
cat logs/sandbox-*.log
```

## Line Ending Handling

This project enforces **LF line endings** for all text files:
- `.gitattributes` normalizes line endings on checkout
- `.editorconfig` enforces LF in editors
- Scripts in `scripts/` normalize line endings

**If you encounter CRLF/LF issues:**
```bash
node scripts/normalize-line-endings.js
```
