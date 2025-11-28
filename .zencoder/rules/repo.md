---
description: Repository Information Overview
alwaysApply: true
---

# Code Assistant Claude Repository Information

## Summary

**code-assistant-claude** is an intelligent self-configuring framework for Claude Code CLI that achieves 98.7% token reduction through revolutionary MCP code execution. It combines SuperClaude's behavioral sophistication with progressive skill loading, multi-agent orchestration, and sandboxed code execution. The project provides a TypeScript-based CLI tool with comprehensive project analysis, automatic configuration generation, and execution engine capabilities.

## Structure

The repository is organized into layered modules:

- **`src/cli/`** - User-facing CLI commands using Commander.js (`init`, `config`, `reset`, `mcp-add`, `mcp-execute`)
- **`src/core/`** - Core systems: execution-engine, analyzers, configurators, skills, agents, commands, optimizers, and utilities
- **`templates/`** - Setup wizard templates, skills, agents, MCP tools
- **`tests/`** - Unit, integration, e2e, and performance tests mirroring source structure
- **`docs/`** - Architecture, guides, examples, implementation details
- **`dist/`** - Compiled distributable (build output)

### Main Repository Components

- **Execution Engine** (`src/core/execution-engine/`) - 5-phase MCP execution with security validation, sandbox management, and 98.7% token reduction
- **Skills System** (`src/core/skills/`) - Progressive loading with metadata (~40 tokens) → full content (~2000 tokens) → resources (on-demand)
- **Project Analyzers** (`src/core/analyzers/`) - Tech stack detection, git workflow analysis, monorepo handling
- **Multi-Agent System** (`src/core/agents/`) - Agent coordination, orchestration, and selection
- **Optimizers** (`src/core/optimizers/`) - Token budgeting, symbol substitution, compression strategies

## Language & Runtime

**Language**: TypeScript  
**Version**: TypeScript 5.9.3  
**Target**: ES2020  
**Runtime**: Node.js ≥18.0.0, npm ≥9.0.0  
**Build System**: tsup (TypeScript bundler)  
**Package Manager**: npm  
**Module Type**: ESM (type: "module")

## Dependencies

**Main Dependencies**:
- `commander` (14.0.2) - CLI framework for command parsing
- `dockerode` (4.0.2) - Docker sandbox implementation
- `better-sqlite3` (12.4.6) - State persistence
- `tiktoken` (1.0.10) - Token counting for optimization metrics
- `zod` (3.25.76) - Schema validation
- `inquirer` (8.2.5) - Interactive prompts for setup wizard
- `handlebars` (4.7.8) - Template generation
- `chalk` (4.1.2) - Terminal styling
- `js-yaml` (4.1.0) - YAML configuration parsing
- `natural` (8.1.0), `compromise` (14.11.0) - NLP for skill matching
- `p-limit` (3.1.0) - Concurrency control
- `lru-cache` (11.2.2), `memoizee` (0.4.15) - Caching strategies

**Development Dependencies**:
- `vitest` (4.0.13) - Unit & integration testing
- `jest` (30.2.0) - E2E & load testing
- `@typescript-eslint` - TypeScript linting
- `eslint`, `prettier` - Code quality
- `tsup`, `ts-node` - Build tools
- `husky` (9.1.7) - Git hooks for pre-commit validation

## Build & Installation

```bash
npm install

npm run build         # Production build with tsup
npm run dev          # Development with watch mode
npm run typecheck    # TypeScript strict checking
npm run lint         # ESLint checking
npm run lint:fix     # ESLint auto-fix
npm run format       # Prettier formatting
```

**Build Output**: `dist/` with executable at `dist/cli/index.js`

## Testing

**Frameworks**:
- **Unit Tests**: Vitest (fast, ESM-native)
- **Integration Tests**: Vitest with fixtures
- **E2E Tests**: Jest
- **Performance Benchmarks**: Vitest performance suite

**Test Location**: `tests/` mirroring `src/` structure
- `tests/unit/` - Isolated component tests (~80% coverage target)
- `tests/integration/` - Module interaction tests
- `tests/integration/real-sandboxes/` - Real Docker/Process execution tests
- `tests/e2e/` - Full workflow tests (React, Node.js projects)
- `tests/performance/` - Token reduction & performance benchmarks
- `tests/fixtures/` - Reusable test data

**Configuration**:
- `vitest.config.ts` - Vitest configuration
- `jest.config.cjs` - Jest E2E configuration

**Run Commands**:

```bash
npm test                    # All tests
npm run test:watch         # Watch mode
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests
npm run test:fast          # Quick unit test subset
npm run test:real          # Real sandbox tests (60s timeout)
npm run test:e2e           # End-to-end tests
npm run benchmark          # Performance benchmarks
npm run test:coverage      # Coverage report
```

**Coverage Requirements**: 80% lines, functions, branches, statements

## Main Entry Points

**CLI Entry**: `src/cli/index.ts`
- Compiled to: `dist/cli/index.js`
- Binary name: `code-assistant-claude` (from `package.json#bin`)
- Main export: `dist/index.js`

**CLI Commands**:
- `init` - Interactive setup wizard
- `config` - Configuration management
- `reset` - Reset configuration
- `mcp-add` - Add MCP servers
- `mcp-execute` - Execute MCP commands

## Project Ecosystem

**Configuration Files**:
- `tsconfig.json` - TypeScript strict mode, ES2020, path aliases
- `.eslintrc.json` - ESLint rules with TypeScript support
- `.prettierrc` - Prettier code formatting
- `.editorconfig` - Editor formatting standards
- `.gitattributes` - LF line ending enforcement

**Scripts** (`scripts/`):
- `smoke-test.sh` / `smoke-test.ps1` - Verification tests
- `fix-line-endings.sh` / `fix-line-endings.ps1` - Normalize LF endings
- `quick-start.md` - Setup documentation

**Execution Engine Modules** (`src/core/execution-engine/`):
- `mcp-code-api/` - Code generation from MCP schemas
- `sandbox/` - Docker, VM, Process sandboxes
- `security/` - Code validation, risk assessment, PII detection
- `discovery/` - Tool indexing and semantic search
- `workspace/` - Workspace management, caching
- `audit/` - Compliance logging

## Code Style Conventions

- **Naming**: kebab-case files (`token-tracker.ts`), PascalCase classes
- **Exports**: Named exports from `index.ts` barrel files
- **Imports**: Node.js → external → internal (`@/`) → types (`type` imports)
- **Type Safety**: Strict mode, no implicit `any`, unused params prefixed `_`
- **Line Endings**: LF enforced via `.gitattributes`
- **Indentation**: 2 spaces (EditorConfig, Prettier)

## Validation & Pre-commit

Husky hooks run:
- `npm run lint` - ESLint validation
- `npm run format:check` - Prettier check
- `npm run typecheck` - TypeScript compilation check

**Before release** (`prepublishOnly`):
- Lint, typecheck, fast test suite, then build
