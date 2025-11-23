# Code-Assistant-Claude: Implementation Workflow
## Comprehensive Development Roadmap

**Generated**: 2025-11-23
**Based on**: Architecture v1.0, Project Documentation
**Duration**: 10 weeks (8 phases)
**Complexity**: Enterprise-scale TypeScript project

---

## 📋 Executive Summary

### Project Overview
**code-assistant-claude** is an intelligent self-configuring framework combining SuperClaude's behavioral sophistication with Claude Code's extensibility ecosystem, featuring revolutionary 98.7% token reduction through MCP code execution.

### Key Deliverables
- ✅ CLI installer with interactive wizard
- ✅ 20+ skills with progressive loading
- ✅ 15+ slash commands for workflow automation
- ✅ MCP code execution engine (98.7% token reduction)
- ✅ Intelligent task routing (12 task types)
- ✅ SuperClaude framework integration (6 modes + Business Panel)
- ✅ Security-first design (Docker/VM sandboxing)

### Success Metrics
- **Token Efficiency**: 60-70% reduction vs baseline
- **Setup Time**: <5 minutes from init to first use
- **Configuration Accuracy**: >95% auto-detection
- **Test Coverage**: >80% across all components
- **Quality**: Production-ready with comprehensive docs

---

## 🎯 Phase Overview

```
Phase 1-2: Foundation (Week 1-4)
├─ CLI skeleton + interactive wizard
├─ Enhanced project analyzer (reads documentation)
├─ Git workflow detection (GitFlow/GitHub Flow)
└─ Configuration generator

Phase 3-4: Core Features (Week 5-6)
├─ Skills system (20+ skills)
├─ Commands system (15+ commands)
├─ MCP Code Execution Engine ⚡ (Revolutionary)
└─ Security sandbox + PII tokenization

Phase 5-6: Intelligence (Week 7-8)
├─ Task classification + intelligent routing
├─ Specialized agents (10+ agents)
├─ Business Panel integration
└─ Token efficiency layer

Phase 7-8: Polish (Week 9-10)
├─ Comprehensive testing (>80% coverage)
├─ Complete documentation
├─ Example projects
└─ v1.0.0 release
```

---

## 🔧 Prerequisites & Setup

### Development Environment

**Required**:
- Node.js 18+ and npm 9+
- TypeScript 5.3+
- Git 2.30+
- Docker Desktop (for sandbox testing)
- VS Code or similar IDE

**Recommended Extensions**:
- ESLint
- Prettier
- TypeScript
- Docker
- Jest Runner

### Initial Setup

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/code-assistant-claude.git
cd code-assistant-claude

# Install dependencies
npm install

# Setup development environment
npm run prepare  # Initialize husky hooks

# Verify setup
npm run typecheck
npm run lint
npm test

# Start development
npm run dev  # Watch mode compilation
```

### Project Structure Creation

```bash
# Create core directories
mkdir -p src/{cli,core,framework,execution-engine}
mkdir -p src/core/{analyzers,configurators,optimizers,git}
mkdir -p src/execution-engine/{mcp-code-api,sandbox,security,discovery,workspace}
mkdir -p templates/{skills,commands,agents,claude-config}
mkdir -p docs/{guides,api,examples}
mkdir -p tests/{unit,integration,e2e}

# Initialize configuration files
touch src/cli/index.ts
touch src/core/index.ts
touch tsconfig.json
touch jest.config.js
```

---

## 📊 PHASE 1: Foundation - CLI & Project Analysis
**Duration**: Week 1-2
**Goal**: Working CLI with intelligent project detection
**Token Budget Impact**: Baseline establishment

### Phase Overview

Build the foundation that enables all other features:
- CLI framework with interactive wizard
- Enhanced project analyzer that reads documentation
- Git workflow detection (GitFlow, GitHub Flow, Trunk-based)
- Configuration generator for `.claude/` structure

---

### EPIC 1.1: CLI Framework

#### Story 1.1.1: Interactive CLI Installer
**As a** developer
**I want** an intuitive CLI installer
**So that** I can set up code-assistant-claude in <5 minutes

**Acceptance Criteria**:
- ✅ `code-assistant-claude init` command works
- ✅ Interactive prompts guide user through setup
- ✅ Beautiful terminal UI with progress indicators
- ✅ Error handling with helpful messages
- ✅ Dry-run mode for testing

**Tasks**:

1. **Setup CLI Entry Point**
   ```typescript
   // src/cli/index.ts
   import { Command } from 'commander';
   import { initCommand } from './commands/init';

   const program = new Command();

   program
     .name('code-assistant-claude')
     .description('Intelligent framework for Claude Code CLI optimization')
     .version('0.1.0');

   program
     .command('init')
     .description('Initialize code-assistant-claude in current project')
     .option('--dry-run', 'Preview changes without applying')
     .option('--local', 'Install to project .claude/ only')
     .option('--global', 'Install to ~/.claude/ only')
     .action(initCommand);

   program.parse();
   ```
   - **File**: `src/cli/index.ts`
   - **Technology**: Commander.js
   - **Validation**: `npm run build && node dist/cli/index.js --help`

2. **Create Interactive Wizard**
   ```typescript
   // src/cli/commands/init.ts
   import inquirer from 'inquirer';
   import ora from 'ora';
   import chalk from 'chalk';

   export async function initCommand(options: any) {
     console.log(chalk.blue.bold('🚀 Code Assistant Claude Setup\n'));

     const answers = await inquirer.prompt([
       {
         type: 'list',
         name: 'installType',
         message: 'Installation scope:',
         choices: ['Project only (.claude/)', 'Global only (~/.claude/)', 'Both (recommended)']
       },
       {
         type: 'list',
         name: 'verbosity',
         message: 'Default verbosity mode:',
         choices: ['Verbose', 'Balanced (recommended)', 'Compressed']
       }
     ]);

     const spinner = ora('Analyzing project...').start();
     // ... implementation
   }
   ```
   - **File**: `src/cli/commands/init.ts`
   - **Technology**: Inquirer.js, ora, chalk
   - **Validation**: Run command and verify prompts appear

3. **Implement Progress Tracking**
   - Multi-step progress bar
   - Status indicators for each phase
   - Time estimates
   - **File**: `src/cli/utils/progress.ts`

**Validation Gate**:
```bash
# Test CLI functionality
npm run build
./dist/cli/index.js init --dry-run

# Expected output:
# 🚀 Code Assistant Claude Setup
# Step 1/7: Project Analysis
# ✓ TypeScript React Application detected
# ...
```

---

#### Story 1.1.2: Command Framework
**As a** developer
**I want** a modular command structure
**So that** adding new commands is straightforward

**Tasks**:

1. **Create Command Base Class**
   ```typescript
   // src/cli/commands/base-command.ts
   export abstract class BaseCommand {
     abstract name: string;
     abstract description: string;

     abstract execute(options: any): Promise<void>;

     protected async validate(options: any): Promise<boolean> {
       // Common validation logic
       return true;
     }

     protected handleError(error: Error): void {
       console.error(chalk.red('Error:'), error.message);
       process.exit(1);
     }
   }
   ```

2. **Implement Command Registry**
   - Auto-discover commands in `src/cli/commands/`
   - Dynamic help generation
   - **File**: `src/cli/registry.ts`

3. **Add Common Commands**
   - `init` - Initial setup
   - `reset` - Reset to vanilla
   - `restore` - Restore from backup
   - `config` - Manage configuration
   - `list` - List installed resources

**Validation**: Each command should have unit tests

---

### EPIC 1.2: Enhanced Project Analyzer

#### Story 1.2.1: Documentation-Aware Detection
**As a** developer
**I want** the analyzer to read my project documentation
**So that** recommendations match my actual project needs

**Acceptance Criteria**:
- ✅ Reads CLAUDE.md, README.md, docs/, CONTRIBUTING.md
- ✅ Extracts project purpose, domain, standards
- ✅ 95% accuracy in recommendations
- ✅ Handles missing or incomplete docs gracefully

**Tasks**:

1. **Create Documentation Analyzer**
   ```typescript
   // src/core/analyzers/documentation-analyzer.ts
   import { promises as fs } from 'fs';
   import * as yaml from 'js-yaml';

   export interface ProjectContext {
     purpose: string;
     domain: string[];
     techStack: string[];
     conventions: {
       gitWorkflow?: 'gitflow' | 'github-flow' | 'trunk-based';
       commitStyle?: 'conventional' | 'custom';
       branchNaming?: string;
     };
     customInstructions: string[];
   }

   export class DocumentationAnalyzer {
     async analyze(projectRoot: string): Promise<ProjectContext> {
       const context: ProjectContext = {
         purpose: '',
         domain: [],
         techStack: [],
         conventions: {},
         customInstructions: []
       };

       // Read CLAUDE.md
       await this.readClaudeMd(projectRoot, context);

       // Read README.md
       await this.readReadme(projectRoot, context);

       // Read docs/
       await this.readDocsFolder(projectRoot, context);

       // Read CONTRIBUTING.md
       await this.readContributing(projectRoot, context);

       return context;
     }

     private async readClaudeMd(root: string, context: ProjectContext) {
       try {
         const content = await fs.readFile(`${root}/CLAUDE.md`, 'utf-8');
         // Parse markdown, extract sections
         // Look for project description, domain keywords, custom instructions
       } catch {
         // File doesn't exist, continue
       }
     }

     // ... other methods
   }
   ```
   - **File**: `src/core/analyzers/documentation-analyzer.ts`
   - **Technology**: Node.js fs, markdown parser
   - **Validation**: Test with real project repos

2. **Implement Semantic Analysis**
   ```typescript
   // Use 'compromise' for NLP
   import nlp from 'compromise';

   private extractDomain(text: string): string[] {
     const doc = nlp(text);
     const topics = doc.topics().out('array');
     // Identify domain: e-commerce, healthcare, finance, etc.
     return this.categorizeDomains(topics);
   }
   ```
   - **File**: `src/core/analyzers/semantic-analyzer.ts`
   - **Technology**: compromise (NLP)

3. **Create Confidence Scoring**
   - Score each detected feature (0-1)
   - Aggregate confidence levels
   - Only recommend with confidence >0.7
   - **File**: `src/core/analyzers/confidence-scorer.ts`

**Validation Gate**:
```bash
# Test with multiple project types
npm test -- documentation-analyzer.test.ts

# Should correctly identify:
# - React e-commerce project
# - Python data science project
# - Node.js API project
```

---

#### Story 1.2.2: Git Workflow Detection
**As a** developer
**I want** automatic detection of my Git workflow
**So that** Git-related commands match my team's conventions

**Tasks**:

1. **Create Git Workflow Analyzer**
   ```typescript
   // src/core/analyzers/git-workflow-analyzer.ts
   import { execSync } from 'child_process';

   export type GitWorkflow = 'gitflow' | 'github-flow' | 'trunk-based' | 'custom';

   export interface GitConventions {
     workflow: GitWorkflow;
     branchPrefixes: string[];
     mainBranch: string;
     developBranch?: string;
     releaseBranches?: string[];
     hotfixPattern?: string;
   }

   export class GitWorkflowAnalyzer {
     async detect(projectRoot: string): Promise<GitConventions> {
       // Get all branches
       const branches = this.getAllBranches(projectRoot);

       // Detect workflow from branch patterns
       if (this.isGitFlow(branches)) {
         return this.detectGitFlowConventions(branches);
       } else if (this.isGitHubFlow(branches)) {
         return this.detectGitHubFlowConventions(branches);
       } else if (this.isTrunkBased(branches)) {
         return this.detectTrunkBasedConventions(branches);
       }

       return this.detectCustomWorkflow(branches);
     }

     private isGitFlow(branches: string[]): boolean {
       // Check for 'develop' branch
       // Check for feature/*, release/*, hotfix/* patterns
       return branches.includes('develop') &&
              branches.some(b => b.startsWith('feature/') ||
                                 b.startsWith('release/') ||
                                 b.startsWith('hotfix/'));
     }
   }
   ```
   - **File**: `src/core/analyzers/git-workflow-analyzer.ts`
   - **Technology**: Node.js child_process (git commands)

2. **Implement Branch Naming Detection**
   - Extract common prefixes (feature/, bugfix/, release/)
   - Detect naming conventions (kebab-case, JIRA-style)
   - **File**: `src/core/analyzers/branch-naming-detector.ts`

3. **Create Git Commands Generator**
   - Generate workflow-specific commands
   - `/sc:feature` for GitFlow
   - `/sc:pr` for GitHub Flow
   - **File**: `src/core/git/command-generator.ts`

**Validation**: Test with repos using different workflows

---

### EPIC 1.3: Configuration Generator

#### Story 1.3.1: Smart Config Generation
**As a** developer
**I want** intelligent configuration recommendations
**So that** my setup is optimized for my project type

**Tasks**:

1. **Create Configuration Schema**
   ```typescript
   // src/core/configurators/schema.ts
   import { z } from 'zod';

   export const ConfigSchema = z.object({
     version: z.string(),
     project: z.object({
       type: z.string(),
       techStack: z.array(z.string()),
       domain: z.array(z.string())
     }),
     skills: z.object({
       enabled: z.array(z.string()),
       autoActivate: z.array(z.string())
     }),
     mcps: z.object({
       core: z.array(z.string()),
       techSpecific: z.array(z.string())
     }),
     commands: z.array(z.string()),
     tokenBudget: z.object({
       total: z.number(),
       reserved: z.number(),
       system: z.number(),
       dynamic: z.number(),
       working: z.number()
     }),
     verbosity: z.enum(['verbose', 'balanced', 'compressed'])
   });
   ```
   - **File**: `src/core/configurators/schema.ts`
   - **Technology**: Zod (validation)

2. **Implement Recommendation Engine**
   ```typescript
   // src/core/configurators/recommendation-engine.ts
   export class RecommendationEngine {
     recommend(projectContext: ProjectContext): Configuration {
       const config: Configuration = {
         version: '1.0.0',
         project: {
           type: projectContext.techStack[0],
           techStack: projectContext.techStack,
           domain: projectContext.domain
         },
         skills: this.recommendSkills(projectContext),
         mcps: this.recommendMCPs(projectContext),
         commands: this.recommendCommands(projectContext),
         tokenBudget: this.calculateTokenBudget(projectContext),
         verbosity: 'balanced'
       };

       return config;
     }

     private recommendSkills(context: ProjectContext): SkillsConfig {
       const skills: string[] = ['code-reviewer', 'test-generator'];

       if (context.techStack.includes('react')) {
         skills.push('frontend-design');
       }

       if (context.domain.includes('security')) {
         skills.push('security-auditor');
       }

       return {
         enabled: skills,
         autoActivate: ['code-reviewer']
       };
     }
   }
   ```
   - **File**: `src/core/configurators/recommendation-engine.ts`

3. **Create Config File Generator**
   - Generate `.claude/CLAUDE.md`
   - Generate `.claude/settings.json`
   - Generate `.claude/.mcp.json`
   - Copy skill/command templates
   - **File**: `src/core/configurators/file-generator.ts`

**Validation Gate**:
```bash
# Run full init workflow
code-assistant-claude init

# Verify generated structure:
ls -la .claude/
# Expected:
# CLAUDE.md
# settings.json
# .mcp.json
# skills/
# commands/
# agents/
```

---

### PHASE 1 DELIVERABLES

**Code**:
- ✅ `src/cli/` - Complete CLI framework
- ✅ `src/core/analyzers/` - Enhanced project analyzer
- ✅ `src/core/configurators/` - Configuration generator
- ✅ `src/core/git/` - Git workflow management

**Tests**:
- ✅ CLI command tests (>80% coverage)
- ✅ Analyzer tests with real projects
- ✅ Configuration validation tests

**Documentation**:
- ✅ CLI usage guide
- ✅ Configuration reference
- ✅ Analyzer algorithm documentation

**Validation**:
```bash
# Full Phase 1 validation
npm run build
npm test
code-assistant-claude init --dry-run

# Should output:
# ✅ Project detected: TypeScript React
# ✅ Recommended: 8 skills, 5 MCPs, 12 commands
# ✅ Estimated token savings: 65%
```

---

## 📦 PHASE 2: Skills System
**Duration**: Week 3-4
**Goal**: 20+ production-ready skills with progressive loading
**Token Budget Impact**: 95% reduction vs always-loaded

### Phase Overview

Implement the skills system that provides specialized expertise:
- Core skills (5): Essential development capabilities
- Domain skills (4): Tech-specific expertise
- SuperClaude skills (8): Behavioral modes + Business Panel
- Progressive loading infrastructure

---

### EPIC 2.1: Skills Infrastructure

#### Story 2.1.1: Progressive Loading System
**As a** user
**I want** skills to load only when needed
**So that** my token budget isn't consumed by unused skills

**Acceptance Criteria**:
- ✅ Skills load in 3 phases: metadata → content → resources
- ✅ 95% token reduction vs always-loaded
- ✅ <100ms loading time per skill
- ✅ Intelligent caching and warm-up

**Tasks**:

1. **Create Skill Metadata Schema**
   ```typescript
   // src/framework/skills/schema.ts
   export interface SkillMetadata {
     name: string;
     description: string;
     version: string;
     triggers: string[];
     tokenCost: {
       metadata: number;      // ~50 tokens
       content: number;        // ~2000 tokens
       resources: number;      // Variable
     };
     dependencies: string[];
     composability: string[];
     projectTypes: string[];
     priority: 'low' | 'medium' | 'high';
     autoActivate?: boolean;
   }

   export interface Skill {
     metadata: SkillMetadata;
     content?: string;          // Loaded on demand
     resources?: SkillResource[]; // Loaded on demand
   }
   ```
   - **File**: `src/framework/skills/schema.ts`

2. **Implement Skill Loader**
   ```typescript
   // src/framework/skills/loader.ts
   import { LRUCache } from 'lru-cache';

   export class SkillLoader {
     private metadataCache: Map<string, SkillMetadata>;
     private contentCache: LRUCache<string, string>;

     constructor() {
       this.metadataCache = new Map();
       this.contentCache = new LRUCache({ max: 10 });
     }

     async loadMetadata(skillName: string): Promise<SkillMetadata> {
       if (this.metadataCache.has(skillName)) {
         return this.metadataCache.get(skillName)!;
       }

       const metadata = await this.readMetadataFromDisk(skillName);
       this.metadataCache.set(skillName, metadata);
       return metadata;
     }

     async loadContent(skillName: string): Promise<string> {
       if (this.contentCache.has(skillName)) {
         return this.contentCache.get(skillName)!;
       }

       const content = await this.readContentFromDisk(skillName);
       this.contentCache.set(skillName, content);
       return content;
     }

     async activateSkill(skillName: string): Promise<Skill> {
       const metadata = await this.loadMetadata(skillName);
       const content = await this.loadContent(skillName);

       return {
         metadata,
         content
       };
     }
   }
   ```
   - **File**: `src/framework/skills/loader.ts`
   - **Technology**: LRU-cache for performance

3. **Create Dependency Resolver**
   - Topological sort for loading order
   - Circular dependency detection
   - **File**: `src/framework/skills/dependency-resolver.ts`

**Validation**:
```typescript
// Test progressive loading
test('should load metadata only initially', async () => {
  const loader = new SkillLoader();
  const skill = await loader.loadMetadata('code-reviewer');

  expect(skill.tokenCost.metadata).toBeLessThan(100);
  expect(skill.content).toBeUndefined();
});
```

---

#### Story 2.1.2: Skill Template System
**As a** developer
**I want** a skill template generator
**So that** creating new skills follows best practices

**Tasks**:

1. **Create Skill Template**
   ```markdown
   <!-- templates/skills/skill-template.md -->
   ---
   name: {{skillName}}
   description: {{description}}
   version: 1.0.0
   triggers: {{triggers}}
   tokenCost:
     metadata: 50
     content: 2000
     resources: 0
   dependencies: {{dependencies}}
   projectTypes: {{projectTypes}}
   priority: medium
   ---

   # {{skillName}} Skill

   ## Purpose
   {{purpose}}

   ## Activation
   This skill activates when:
   {{activationConditions}}

   ## Capabilities
   {{capabilities}}

   ## Usage Examples
   {{examples}}
   ```

2. **Implement Skill Generator CLI**
   ```bash
   code-assistant-claude create-skill
   ```
   - Interactive prompts for skill properties
   - Generates template with placeholders filled
   - **File**: `src/cli/commands/create-skill.ts`

3. **Add Validation Tools**
   - Lint skill markdown
   - Validate metadata schema
   - Check token cost accuracy
   - **File**: `src/framework/skills/validator.ts`

---

### EPIC 2.2: Core Skills (5 Skills)

#### Skill 2.2.1: code-reviewer
**Purpose**: Automatic code review on file save
**Token Cost**: 2000 tokens when active
**Auto-activate**: Yes

**Implementation**:
```markdown
<!-- templates/skills/core/code-reviewer/SKILL.md -->
---
name: code-reviewer
description: Automatic code review when files are saved or modified
version: 1.0.0
triggers: ["file_save", "pre_commit"]
autoActivate: true
priority: high
---

# Code Reviewer Skill

## Activation Triggers
- File save in watched directories
- Pre-commit Git hook
- Manual invocation: `/review`

## Review Checklist

### Code Quality
- [ ] SOLID principles adherence
- [ ] DRY violations detected
- [ ] Code smells identified
- [ ] Complexity analysis (cyclomatic)

### Security
- [ ] SQL injection risks
- [ ] XSS vulnerabilities
- [ ] Hardcoded secrets
- [ ] Unsafe dependencies

### Performance
- [ ] O(n²) or worse algorithms
- [ ] Memory leaks
- [ ] Unnecessary re-renders (React)

### Best Practices
- [ ] Naming conventions
- [ ] Error handling
- [ ] Logging practices
- [ ] Documentation completeness

## Output Format
```
📊 Code Review: src/components/UserForm.tsx

✅ Quality: 8/10
⚠️  Issues Found: 3

🔴 Critical (1):
  Line 45: Potential SQL injection in user input

⚠️  Warnings (2):
  Line 23: Complex nested conditions (consider refactoring)
  Line 67: Missing error handling for async operation

💡 Suggestions:
  - Extract validation logic to separate function
  - Add PropTypes or TypeScript interfaces
```
```

**Tasks**:
1. Implement static analysis integration (ESLint, TSLint)
2. Create security pattern detector
3. Build complexity calculator
4. Generate review reports

**Validation**: Test with intentionally buggy code

---

#### Skill 2.2.2: test-generator
**Purpose**: Generate comprehensive test suites
**Token Cost**: 2500 tokens when active

**Implementation**:
```markdown
---
name: test-generator
description: Generate unit, integration, and E2E tests automatically
triggers: ["test", "generate tests", "/sc:test"]
priority: high
---

# Test Generator Skill

## Test Types
1. **Unit Tests**: Individual functions/methods
2. **Integration Tests**: Component interactions
3. **E2E Tests**: Complete user workflows

## Generation Strategy

### For Functions
```typescript
// Original function
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// Generated test
describe('calculateTotal', () => {
  test('should sum item prices correctly', () => {
    const items = [
      { price: 10 },
      { price: 20 },
      { price: 30 }
    ];
    expect(calculateTotal(items)).toBe(60);
  });

  test('should return 0 for empty array', () => {
    expect(calculateTotal([])).toBe(0);
  });

  test('should handle negative prices', () => {
    const items = [{ price: -10 }, { price: 20 }];
    expect(calculateTotal(items)).toBe(10);
  });
});
```

### For React Components
- Render tests
- User interaction tests
- State management tests
- Props validation tests

## Coverage Targets
- Functions: >90%
- Branches: >80%
- Lines: >85%
```

**Tasks**:
1. Parse code to extract testable units
2. Generate test cases with edge cases
3. Integrate with Jest/Vitest/Playwright
4. Calculate coverage metrics

---

#### Skill 2.2.3: git-commit-helper
**Purpose**: Generate conventional commit messages
**Token Cost**: 1500 tokens when active

**Implementation**:
```markdown
---
name: git-commit-helper
description: Generate conventional commit messages from staged changes
triggers: ["commit", "pre-commit", "/sc:commit"]
priority: medium
---

# Git Commit Helper Skill

## Commit Message Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

## Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Test additions/modifications
- **chore**: Build process or auxiliary tool changes

## Generation Process
1. Analyze `git diff --staged`
2. Classify change type
3. Extract scope from file paths
4. Generate concise subject line
5. Add detailed body if needed
6. Include breaking changes in footer

## Example Output
```bash
feat(auth): add JWT token refresh mechanism

- Implement refresh token rotation
- Add token expiration handling
- Update authentication middleware

BREAKING CHANGE: Auth API now requires refresh token endpoint
```
```

**Tasks**:
1. Parse git diff output
2. Classify changes using heuristics
3. Generate commit message templates
4. Validate against conventional commits spec

---

#### Skill 2.2.4: security-auditor
**Purpose**: Scan for security vulnerabilities
**Token Cost**: 2200 tokens when active

**Implementation**:
```markdown
---
name: security-auditor
description: Comprehensive security vulnerability scanning
triggers: ["security", "audit", "vulnerability scan"]
priority: high
---

# Security Auditor Skill

## Scan Categories

### 1. Code Vulnerabilities
- SQL injection
- XSS (Cross-Site Scripting)
- CSRF (Cross-Site Request Forgery)
- Command injection
- Path traversal
- Insecure deserialization

### 2. Dependency Vulnerabilities
- Known CVEs in dependencies
- Outdated packages with security patches
- License compliance issues

### 3. Secret Detection
- API keys in code
- Passwords and tokens
- Private keys
- Database credentials

### 4. Configuration Issues
- Weak encryption
- Insecure defaults
- Missing security headers
- CORS misconfigurations

## Integration
- npm audit
- Snyk
- OWASP Dependency-Check
- Custom pattern matching

## Report Format
```
🛡️  Security Audit Report

🔴 Critical (2):
  1. Hardcoded API key found
     File: src/config/api.ts:12
     Risk: High - Credential exposure

  2. SQL injection vulnerability
     File: src/db/queries.ts:45
     Risk: High - Data breach potential

⚠️  High (3):
  ...

📊 Dependency Vulnerabilities:
  - lodash 4.17.15 (CVE-2020-8203)
  - axios 0.19.0 (CVE-2020-28168)

💡 Recommendations:
  1. Move API keys to environment variables
  2. Use parameterized queries
  3. Update vulnerable dependencies
```
```

**Tasks**:
1. Integrate security scanning tools
2. Build custom pattern matchers
3. Implement severity classification
4. Generate actionable remediation steps

---

#### Skill 2.2.5: performance-optimizer
**Purpose**: Identify and fix performance bottlenecks
**Token Cost**: 2800 tokens when active

**Implementation**:
```markdown
---
name: performance-optimizer
description: Analyze and optimize code performance
triggers: ["performance", "optimize", "slow"]
priority: medium
---

# Performance Optimizer Skill

## Analysis Dimensions

### 1. Algorithm Complexity
- Identify O(n²) or worse algorithms
- Suggest optimized alternatives
- Recommend caching strategies

### 2. Memory Usage
- Detect memory leaks
- Identify unnecessary allocations
- Optimize data structures

### 3. Frontend Performance (React/Vue)
- Unnecessary re-renders
- Large bundle sizes
- Unoptimized images
- Missing code splitting

### 4. Backend Performance
- N+1 query problems
- Unindexed database queries
- Synchronous blocking operations
- Missing caching layers

## Profiling Integration
- Chrome DevTools integration
- Node.js profiler
- Bundle analyzer
- Lighthouse metrics

## Optimization Suggestions
```
⚡ Performance Analysis: src/components/ProductList.tsx

📊 Current Metrics:
  - Render time: 850ms (Target: <200ms)
  - Bundle size: 450KB (Target: <300KB)
  - LCP: 3.2s (Target: <2.5s)

🔴 Critical Issues (2):
  1. Line 34: O(n²) algorithm in filtering
     Current: items.filter(i => tags.includes(i.tag))
     Optimize: Use Set for O(n) lookup

  2. Line 67: Component re-renders on every prop change
     Fix: Wrap with React.memo() and use useCallback

⚡ Quick Wins:
  - Enable React.memo for ProductCard (Line 12)
  - Move expensive calculation to useMemo (Line 45)
  - Lazy load images with loading="lazy"
```
```

**Tasks**:
1. Build complexity analyzer
2. Integrate profiling tools
3. Create optimization rule engine
4. Generate before/after comparisons

---

### EPIC 2.3: SuperClaude Skills (8 Skills)

#### Skill 2.3.1: brainstorming-mode
**Purpose**: Activate Socratic dialogue for requirements discovery
**Token Cost**: 1800 tokens when active

**Implementation** (abbreviated):
```markdown
---
name: brainstorming-mode
description: Collaborative discovery mindset for requirements exploration
triggers: ["brainstorm", "explore", "idea", "not sure"]
mode: brainstorming
---

# Brainstorming Mode Skill

Activates when user has vague requirements or needs exploration.

## Behavioral Changes
- Ask probing questions
- Non-presumptive approach
- Collaborative exploration
- Brief generation

## Example Flow
User: "I want to build something for my business"

Assistant (Brainstorming Mode):
"🤔 Let's explore this together:
- What problem are you trying to solve?
- Who are your target users?
- What's your expected scale?
- Any existing systems to integrate with?"
```

**Tasks**:
1. Implement mode activation logic
2. Create question bank by domain
3. Build brief generation templates

---

#### Skill 2.3.2-2.3.6: Other Mode Skills
- **deep-research-mode**: Multi-hop reasoning with Tavily + Sequential
- **orchestration-mode**: Optimal tool selection
- **task-management-mode**: Hierarchical organization with memory
- **token-efficiency-mode**: Symbol systems for compression
- **introspection-mode**: Meta-cognitive analysis

(Detailed implementations similar to brainstorming-mode)

---

#### Skill 2.3.7: business-panel
**Purpose**: Multi-expert strategic analysis (9 thought leaders)
**Token Cost**: 4500 tokens when active

**Implementation**:
```markdown
---
name: business-panel
description: Strategic analysis with 9 expert thought leaders
triggers: ["strategy", "business", "market", "innovation"]
experts:
  - christensen
  - porter
  - drucker
  - godin
  - kim_mauborgne
  - collins
  - taleb
  - meadows
  - doumont
---

# Business Panel Skill

## Expert Selection Algorithm
Auto-select 3-5 most relevant experts based on content:

```typescript
function selectExperts(content: string, maxExperts: number = 5): Expert[] {
  const scores = EXPERTS.map(expert => ({
    expert,
    score: calculateRelevance(content, expert)
  }));

  return scores
    .sort((a, b) => b.score - a.score)
    .slice(0, maxExperts)
    .map(s => s.expert);
}
```

## Analysis Modes
1. **Discussion**: Collaborative multi-perspective analysis
2. **Debate**: Adversarial stress-testing
3. **Socratic**: Question-driven exploration

## Output Template
```
## 🧩 SYNTHESIS ACROSS FRAMEWORKS

**🤝 Convergent Insights**: [Agreement areas]
**⚖️ Productive Tensions**: [Strategic trade-offs]
**🕸️ System Patterns**: [Leverage points]
**💬 Communication Clarity**: [Action priorities]
**⚠️ Blind Spots**: [Gaps requiring analysis]
```
```

**Tasks**:
1. Implement expert selection algorithm
2. Create debate orchestration
3. Build synthesis framework
4. Test with real strategic documents

---

### EPIC 2.4: Skill Testing & Validation

**Tasks**:
1. Write unit tests for each skill (>80% coverage)
2. Create integration tests with real workflows
3. Build token usage benchmarks
4. Generate skill documentation

**Validation Gate**:
```bash
# Test all skills
npm test -- skills/

# Benchmark token usage
npm run benchmark:skills

# Expected:
# ✅ All 20 skills passing tests
# ✅ Token usage within budgets
# ✅ Progressive loading working (95% reduction)
```

---

### PHASE 2 DELIVERABLES

**Code**:
- ✅ `src/framework/skills/` - Complete skills infrastructure
- ✅ `templates/skills/` - 20+ production-ready skills
- ✅ Progressive loading system

**Tests**:
- ✅ >80% coverage for all skills
- ✅ Integration tests with workflows
- ✅ Token usage benchmarks

**Documentation**:
- ✅ Skill development guide
- ✅ API reference for skill system
- ✅ Individual skill documentation

---

## ⚡ PHASE 3-4: MCP Code Execution Engine (Revolutionary Feature)
**Duration**: Week 5-6
**Goal**: 98.7% token reduction through code execution
**Token Budget Impact**: -148,000 tokens (150K → 2K)

### Phase Overview

This is the **most critical and innovative component** of code-assistant-claude. It implements Anthropic's revolutionary MCP code execution pattern, transforming how MCP tools are presented to Claude.

**Traditional Approach** (Current MCP):
```
150,000 tokens: All MCP tools loaded as JSON schemas
+ 50,000 tokens: Intermediate tool results
= 200,000 tokens total
```

**Code Execution Approach** (Our Innovation):
```
2,000 tokens: MCP tools as TypeScript/Python functions
+ 200 tokens: Execution summaries
= 2,200 tokens total (98.7% reduction!)
```

---

### EPIC 4.1: MCP Code API Generator

#### Story 4.1.1: TypeScript API Generator
**As a** developer
**I want** MCP tools presented as TypeScript functions
**So that** Claude can write code instead of making tool calls

**Acceptance Criteria**:
- ✅ Generate TypeScript wrappers for all MCP tools
- ✅ Type-safe with full IntelliSense support
- ✅ Automatic error handling and retries
- ✅ <2000 tokens for complete API surface

**Implementation Architecture**:

```typescript
// src/execution-engine/mcp-code-api/generator.ts

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: JSONSchema;
  outputSchema: JSONSchema;
}

export class MCPCodeAPIGenerator {
  async generateTypeScriptAPI(
    serverName: string,
    tools: MCPTool[]
  ): Promise<string> {
    const imports = this.generateImports();
    const types = this.generateTypes(tools);
    const functions = tools.map(tool => this.generateFunction(tool));

    return `
${imports}

// ============================================
// MCP Server: ${serverName}
// Auto-generated TypeScript API
// ============================================

${types}

${functions.join('\n\n')}
    `.trim();
  }

  private generateFunction(tool: MCPTool): string {
    const { name, description, inputSchema } = tool;
    const params = this.extractParameters(inputSchema);
    const paramTypes = this.generateParamTypes(params);

    return `
/**
 * ${description}
 *
 * @example
 * const result = await ${name}({ ${this.generateExampleParams(params)} });
 */
export async function ${name}(
  params: ${paramTypes}
): Promise<any> {
  return await mcpClient.callTool('${name}', params);
}
    `.trim();
  }
}
```

**Example Generated API**:

```typescript
// .claude/mcp-apis/google-drive.ts

/**
 * Get a document from Google Drive by ID
 *
 * @example
 * const doc = await getDocument({ id: 'abc123' });
 * console.log(doc.title, doc.content);
 */
export async function getDocument(params: {
  id: string;
  includeContent?: boolean;
}): Promise<{
  title: string;
  content: string;
  metadata: object;
}> {
  return await mcpClient.callTool('google-drive.getDocument', params);
}

/**
 * Search Google Drive for files matching query
 *
 * @example
 * const files = await searchFiles({ query: 'budget 2024' });
 * for (const file of files) {
 *   console.log(file.name, file.id);
 * }
 */
export async function searchFiles(params: {
  query: string;
  maxResults?: number;
}): Promise<Array<{
  id: string;
  name: string;
  mimeType: string;
}>> {
  return await mcpClient.callTool('google-drive.searchFiles', params);
}
```

**Tasks**:

1. **Implement Schema Parser**
   ```typescript
   // src/execution-engine/mcp-code-api/schema-parser.ts
   export class SchemaParser {
     parseJSONSchema(schema: JSONSchema): TypeDefinition {
       // Convert JSON Schema to TypeScript types
       // Handle nested objects, arrays, unions
       // Generate JSDoc comments
     }
   }
   ```
   - **File**: `src/execution-engine/mcp-code-api/schema-parser.ts`
   - **Technology**: JSON Schema parsing, TypeScript AST generation

2. **Create Function Template Generator**
   ```typescript
   // src/execution-engine/mcp-code-api/template-generator.ts
   export class TemplateGenerator {
     generateFunctionSignature(tool: MCPTool): string {
       // Generate async function with proper types
     }

     generateDocumentation(tool: MCPTool): string {
       // Generate JSDoc with examples
     }

     generateExamples(tool: MCPTool): string[] {
       // Create realistic usage examples
     }
   }
   ```

3. **Implement Progressive Discovery**
   ```typescript
   // src/execution-engine/discovery/progressive-discovery.ts
   export class ProgressiveDiscovery {
     async discoverTools(
       serverName: string,
       initialQuery?: string
     ): Promise<MCPTool[]> {
       // Start with searchTools() if available
       // Otherwise, list all tools
       // Cache results for session
     }
   }
   ```
   - Uses `searchTools()` from MCP spec for semantic discovery
   - Falls back to `listTools()` if search not available
   - **File**: `src/execution-engine/discovery/progressive-discovery.ts`

4. **Build API Registry**
   ```typescript
   // src/execution-engine/mcp-code-api/registry.ts
   export class APIRegistry {
     private apis: Map<string, GeneratedAPI>;

     async registerServer(serverName: string): Promise<void> {
       const tools = await this.discoverTools(serverName);
       const api = await this.generator.generateTypeScriptAPI(serverName, tools);
       this.apis.set(serverName, api);
     }

     getAPI(serverName: string): string | undefined {
       return this.apis.get(serverName);
     }
   }
   ```

**Validation**:
```typescript
test('should generate valid TypeScript API', async () => {
  const generator = new MCPCodeAPIGenerator();
  const api = await generator.generateTypeScriptAPI('google-drive', gdTools);

  // Compile TypeScript to verify syntax
  const result = ts.transpileModule(api, {});
  expect(result.diagnostics).toHaveLength(0);

  // Verify token count
  const tokens = tiktoken.encode(api);
  expect(tokens.length).toBeLessThan(2000);
});
```

---

#### Story 4.1.2: Python API Generator
**As a** Python developer
**I want** MCP tools as Python functions
**So that** I can use code execution with Python projects

**Implementation**:

```python
# .claude/mcp-apis/google_drive.py

from typing import Dict, List, Optional
from mcp_client import call_tool

async def get_document(
    id: str,
    include_content: bool = True
) -> Dict[str, any]:
    """
    Get a document from Google Drive by ID

    Example:
        doc = await get_document(id='abc123')
        print(doc['title'], doc['content'])
    """
    return await call_tool('google-drive.getDocument', {
        'id': id,
        'includeContent': include_content
    })

async def search_files(
    query: str,
    max_results: int = 10
) -> List[Dict[str, str]]:
    """
    Search Google Drive for files matching query

    Example:
        files = await search_files(query='budget 2024')
        for file in files:
            print(file['name'], file['id'])
    """
    return await call_tool('google-drive.searchFiles', {
        'query': query,
        'maxResults': max_results
    })
```

**Tasks**:
1. Implement Python AST generation
2. Create type hint generator (using `typing` module)
3. Build Python docstring formatter
4. Test with real Python MCP servers

---

### EPIC 4.2: Execution Sandbox Manager

#### Story 4.2.1: Docker Sandbox
**As a** security-conscious user
**I want** code to execute in isolated Docker containers
**So that** my system is protected from malicious code

**Acceptance Criteria**:
- ✅ Complete isolation from host system
- ✅ Resource limits (CPU, memory, network)
- ✅ Automatic cleanup after execution
- ✅ <3 seconds startup time

**Architecture**:

```typescript
// src/execution-engine/sandbox/docker-sandbox.ts
import Docker from 'dockerode';

export interface SandboxConfig {
  image: string;
  memory: string;      // e.g., '512m'
  cpus: number;        // e.g., 1.0
  timeout: number;     // milliseconds
  network: 'none' | 'isolated' | 'bridge';
  volumes?: VolumeMount[];
}

export class DockerSandbox {
  private docker: Docker;
  private containers: Map<string, Docker.Container>;

  constructor() {
    this.docker = new Docker();
    this.containers = new Map();
  }

  async createSandbox(config: SandboxConfig): Promise<string> {
    const container = await this.docker.createContainer({
      Image: config.image,
      HostConfig: {
        Memory: this.parseMemory(config.memory),
        NanoCpus: config.cpus * 1e9,
        NetworkMode: config.network,
        AutoRemove: true
      },
      // ... other config
    });

    await container.start();
    const id = container.id;
    this.containers.set(id, container);

    return id;
  }

  async executeCode(
    sandboxId: string,
    code: string,
    language: 'typescript' | 'python'
  ): Promise<ExecutionResult> {
    const container = this.containers.get(sandboxId);
    if (!container) throw new Error('Sandbox not found');

    // Write code to container
    await this.writeCode(container, code, language);

    // Execute code
    const exec = await container.exec({
      Cmd: this.getExecuteCommand(language),
      AttachStdout: true,
      AttachStderr: true
    });

    const stream = await exec.start({});
    const output = await this.readStream(stream);

    return {
      stdout: output.stdout,
      stderr: output.stderr,
      exitCode: output.exitCode,
      duration: output.duration
    };
  }

  async destroySandbox(sandboxId: string): Promise<void> {
    const container = this.containers.get(sandboxId);
    if (!container) return;

    await container.stop();
    await container.remove();
    this.containers.delete(sandboxId);
  }
}
```

**Docker Images**:

```dockerfile
# docker/typescript-sandbox/Dockerfile
FROM node:18-alpine

# Install dependencies
RUN npm install -g typescript ts-node

# Create workspace
WORKDIR /workspace

# Install common MCP client libraries
COPY package.json .
RUN npm install

# Set up non-root user
RUN adduser -D sandbox
USER sandbox

# Default command
CMD ["ts-node"]
```

```dockerfile
# docker/python-sandbox/Dockerfile
FROM python:3.11-slim

# Install dependencies
RUN pip install --no-cache-dir \
    aiohttp \
    asyncio \
    typing-extensions

# Create workspace
WORKDIR /workspace

# Set up non-root user
RUN useradd -m sandbox
USER sandbox

# Default command
CMD ["python"]
```

**Tasks**:

1. **Create Docker Image Builder**
   ```typescript
   // src/execution-engine/sandbox/image-builder.ts
   export class ImageBuilder {
     async buildImages(): Promise<void> {
       await this.buildTypeScriptImage();
       await this.buildPythonImage();
     }
   }
   ```

2. **Implement Resource Limiter**
   ```typescript
   // src/execution-engine/sandbox/resource-limiter.ts
   export class ResourceLimiter {
     async enforceLimit(container: Container, limits: ResourceLimits) {
       // Monitor CPU/memory usage
       // Terminate if exceeded
     }
   }
   ```

3. **Create Sandbox Pool**
   ```typescript
   // src/execution-engine/sandbox/sandbox-pool.ts
   export class SandboxPool {
     private pool: DockerSandbox[];

     async warmUp(count: number): Promise<void> {
       // Pre-create sandboxes for fast execution
     }

     async acquire(): Promise<DockerSandbox> {
       // Get sandbox from pool or create new
     }

     async release(sandbox: DockerSandbox): Promise<void> {
       // Return to pool or destroy
     }
   }
   ```

**Validation**:
```typescript
test('should execute code in Docker sandbox', async () => {
  const sandbox = new DockerSandbox();
  const id = await sandbox.createSandbox({
    image: 'code-assistant/typescript:latest',
    memory: '512m',
    cpus: 1,
    timeout: 5000,
    network: 'none'
  });

  const result = await sandbox.executeCode(id, 'console.log("Hello")', 'typescript');
  expect(result.stdout).toBe('Hello\n');
  expect(result.exitCode).toBe(0);

  await sandbox.destroySandbox(id);
});
```

---

#### Story 4.2.2: VM Sandbox (Alternative)
**For users without Docker**

**Implementation**:
```typescript
// src/execution-engine/sandbox/vm-sandbox.ts
import { VM } from 'vm2';

export class VMSandbox {
  private vm: VM;

  constructor() {
    this.vm = new VM({
      timeout: 5000,
      sandbox: {},
      eval: false,
      wasm: false
    });
  }

  async executeCode(code: string): Promise<ExecutionResult> {
    try {
      const result = this.vm.run(code);
      return {
        stdout: String(result),
        stderr: '',
        exitCode: 0
      };
    } catch (error) {
      return {
        stdout: '',
        stderr: error.message,
        exitCode: 1
      };
    }
  }
}
```

**Tasks**:
1. Implement VM2 sandbox
2. Add resource monitoring
3. Create fallback mechanism (Docker → VM → Process)

---

### EPIC 4.3: Security Validation System

#### Story 4.3.1: Code Pattern Detection
**As a** security engineer
**I want** automatic detection of malicious code patterns
**So that** dangerous code never executes

**Acceptance Criteria**:
- ✅ Detect 50+ dangerous patterns
- ✅ <100ms validation time
- ✅ False positive rate <5%
- ✅ User approval for high-risk operations

**Implementation**:

```typescript
// src/execution-engine/security/pattern-detector.ts

export interface SecurityPattern {
  name: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  pattern: RegExp;
  description: string;
  mitigation: string;
}

export class PatternDetector {
  private patterns: SecurityPattern[] = [
    {
      name: 'command-injection',
      severity: 'critical',
      pattern: /exec\(.*\$\{.*\}\)/,
      description: 'Potential command injection via string interpolation',
      mitigation: 'Use parameterized commands or whitelist inputs'
    },
    {
      name: 'file-system-access',
      severity: 'high',
      pattern: /fs\.(readFile|writeFile|unlink|rmdir)/,
      description: 'File system access detected',
      mitigation: 'Require user approval for file operations'
    },
    {
      name: 'network-access',
      severity: 'high',
      pattern: /(fetch|axios|http\.request|net\.connect)/,
      description: 'Network access detected',
      mitigation: 'Whitelist allowed domains'
    },
    // ... 47 more patterns
  ];

  async validateCode(code: string): Promise<ValidationResult> {
    const findings: SecurityFinding[] = [];

    for (const pattern of this.patterns) {
      if (pattern.pattern.test(code)) {
        findings.push({
          pattern: pattern.name,
          severity: pattern.severity,
          description: pattern.description,
          mitigation: pattern.mitigation,
          line: this.findLine(code, pattern.pattern)
        });
      }
    }

    return {
      safe: findings.filter(f => f.severity === 'critical').length === 0,
      findings,
      requiresApproval: findings.some(f => f.severity === 'high' || f.severity === 'critical')
    };
  }
}
```

**Security Patterns Library**:

```typescript
// src/execution-engine/security/patterns/
export const SECURITY_PATTERNS: SecurityPattern[] = [
  // Command Injection
  { name: 'command-injection', pattern: /exec\(/, severity: 'critical' },
  { name: 'eval-usage', pattern: /eval\(/, severity: 'critical' },
  { name: 'function-constructor', pattern: /new Function\(/, severity: 'high' },

  // File System
  { name: 'file-read', pattern: /fs\.readFile/, severity: 'medium' },
  { name: 'file-write', pattern: /fs\.writeFile/, severity: 'high' },
  { name: 'file-delete', pattern: /fs\.(unlink|rmdir)/, severity: 'critical' },

  // Network
  { name: 'http-request', pattern: /fetch\(|axios/, severity: 'medium' },
  { name: 'websocket', pattern: /new WebSocket/, severity: 'medium' },

  // Process
  { name: 'process-exit', pattern: /process\.exit/, severity: 'medium' },
  { name: 'process-env', pattern: /process\.env/, severity: 'low' },

  // Crypto
  { name: 'crypto-weak', pattern: /MD5|SHA1/, severity: 'medium' },

  // ... 40 more patterns
];
```

**Tasks**:

1. **Build Pattern Database**
   - Research common attack vectors
   - Categorize by severity
   - Create detection regexes
   - **File**: `src/execution-engine/security/patterns/`

2. **Implement AST-Based Analysis**
   ```typescript
   // src/execution-engine/security/ast-analyzer.ts
   import * as ts from 'typescript';

   export class ASTAnalyzer {
     analyzeTypeScript(code: string): SecurityFinding[] {
       const sourceFile = ts.createSourceFile('temp.ts', code, ts.ScriptTarget.Latest);
       const findings: SecurityFinding[] = [];

       const visit = (node: ts.Node) => {
         // Detect dangerous patterns in AST
         if (ts.isCallExpression(node)) {
           this.checkCallExpression(node, findings);
         }
         ts.forEachChild(node, visit);
       };

       visit(sourceFile);
       return findings;
     }
   }
   ```

3. **Create User Approval Flow**
   ```typescript
   // src/execution-engine/security/approval-manager.ts
   export class ApprovalManager {
     async requestApproval(
       code: string,
       findings: SecurityFinding[]
     ): Promise<boolean> {
       // Show findings to user
       // Request explicit approval
       // Log decision
     }
   }
   ```

**Validation**:
```typescript
test('should detect command injection', () => {
  const detector = new PatternDetector();
  const code = 'exec(`rm -rf ${userInput}`)';

  const result = detector.validateCode(code);
  expect(result.safe).toBe(false);
  expect(result.findings[0].severity).toBe('critical');
});
```

---

#### Story 4.3.2: PII Tokenization Engine
**As a** privacy-conscious user
**I want** PII to never enter model context
**So that** my sensitive data stays secure

**Acceptance Criteria**:
- ✅ Detect and tokenize PII automatically
- ✅ Support emails, phones, SSNs, credit cards
- ✅ Reversible tokenization with secure storage
- ✅ <50ms tokenization time

**Implementation**:

```typescript
// src/execution-engine/security/pii-tokenizer.ts
import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';

export class PIITokenizer {
  private tokenMap: Map<string, string>;
  private reverseMap: Map<string, string>;
  private key: Buffer;

  constructor() {
    this.tokenMap = new Map();
    this.reverseMap = new Map();
    this.key = randomBytes(32); // AES-256
  }

  tokenize(text: string): string {
    let tokenized = text;

    // Email addresses
    tokenized = tokenized.replace(
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
      (email) => this.createToken(email, 'EMAIL')
    );

    // Phone numbers
    tokenized = tokenized.replace(
      /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
      (phone) => this.createToken(phone, 'PHONE')
    );

    // SSN
    tokenized = tokenized.replace(
      /\b\d{3}-\d{2}-\d{4}\b/g,
      (ssn) => this.createToken(ssn, 'SSN')
    );

    // Credit card
    tokenized = tokenized.replace(
      /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g,
      (cc) => this.createToken(cc, 'CC')
    );

    return tokenized;
  }

  private createToken(value: string, type: string): string {
    if (this.tokenMap.has(value)) {
      return this.tokenMap.get(value)!;
    }

    const token = `[${type}_${randomBytes(4).toString('hex')}]`;
    this.tokenMap.set(value, token);
    this.reverseMap.set(token, value);

    return token;
  }

  detokenize(text: string): string {
    let detokenized = text;

    for (const [token, value] of this.reverseMap) {
      detokenized = detokenized.replace(new RegExp(token, 'g'), value);
    }

    return detokenized;
  }
}
```

**Usage Example**:

```typescript
// Original code with PII
const code = `
const user = {
  email: 'john.doe@example.com',
  phone: '555-123-4567',
  ssn: '123-45-6789'
};

await updateUser(user);
`;

// Tokenized version (what Claude sees)
const tokenized = `
const user = {
  email: '[EMAIL_a3f2b1c9]',
  phone: '[PHONE_d8e4f1a2]',
  ssn: '[SSN_b7c3e9d1]'
};

await updateUser(user);
`;

// Real data flows directly: Salesforce → execution env → Salesforce
// Model never sees actual PII!
```

**Tasks**:

1. **Implement PII Detectors**
   - Email regex
   - Phone number patterns (international)
   - SSN/Tax ID
   - Credit card numbers
   - API keys
   - **File**: `src/execution-engine/security/pii-detectors.ts`

2. **Create Secure Token Storage**
   ```typescript
   // src/execution-engine/security/token-store.ts
   import Database from 'better-sqlite3';

   export class TokenStore {
     private db: Database.Database;

     constructor() {
       this.db = new Database(':memory:'); // or persistent
       this.createTables();
     }

     store(token: string, value: string, encrypted: boolean = true) {
       const stored = encrypted ? this.encrypt(value) : value;
       this.db.prepare('INSERT INTO tokens (token, value) VALUES (?, ?)').run(token, stored);
     }

     retrieve(token: string): string {
       const row = this.db.prepare('SELECT value FROM tokens WHERE token = ?').get(token);
       return row ? this.decrypt(row.value) : '';
     }
   }
   ```

3. **Build Encryption Layer**
   - AES-256 encryption
   - Key rotation support
   - Secure key storage
   - **File**: `src/execution-engine/security/encryption.ts`

**Validation**:
```typescript
test('should tokenize and detokenize PII', () => {
  const tokenizer = new PIITokenizer();
  const text = 'Contact: john@example.com, 555-1234';

  const tokenized = tokenizer.tokenize(text);
  expect(tokenized).not.toContain('john@example.com');
  expect(tokenized).toMatch(/\[EMAIL_[a-f0-9]+\]/);

  const detokenized = tokenizer.detokenize(tokenized);
  expect(detokenized).toBe(text);
});
```

---

### EPIC 4.4: Audit & Compliance System

#### Story 4.4.1: Comprehensive Audit Logging
**As a** compliance officer
**I want** complete audit trails
**So that** I can prove regulatory compliance

**Implementation**:

```typescript
// src/execution-engine/security/audit-logger.ts
import Database from 'better-sqlite3';

export interface AuditEvent {
  id: string;
  timestamp: Date;
  sessionId: string;
  userId?: string;
  event: string;
  details: object;
  severity: 'info' | 'warning' | 'error' | 'critical';
  ipAddress?: string;
  userAgent?: string;
}

export class AuditLogger {
  private db: Database.Database;

  constructor(dbPath: string = './audit.db') {
    this.db = new Database(dbPath);
    this.createTables();
  }

  log(event: Omit<AuditEvent, 'id' | 'timestamp'>): void {
    const auditEvent: AuditEvent = {
      id: randomUUID(),
      timestamp: new Date(),
      ...event
    };

    this.db.prepare(`
      INSERT INTO audit_log
      (id, timestamp, session_id, user_id, event, details, severity, ip_address, user_agent)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      auditEvent.id,
      auditEvent.timestamp.toISOString(),
      auditEvent.sessionId,
      auditEvent.userId,
      auditEvent.event,
      JSON.stringify(auditEvent.details),
      auditEvent.severity,
      auditEvent.ipAddress,
      auditEvent.userAgent
    );
  }

  query(filters: AuditQueryFilters): AuditEvent[] {
    // Query audit log with filters
  }

  export(format: 'json' | 'csv' | 'pdf'): Buffer {
    // Export audit log for compliance
  }
}
```

**Audit Events**:

```typescript
// Code execution
auditLogger.log({
  sessionId: 'sess_abc123',
  userId: 'user_xyz789',
  event: 'code_execution_started',
  details: {
    language: 'typescript',
    sandbox: 'docker',
    codeHash: 'sha256:...'
  },
  severity: 'info'
});

// Security validation
auditLogger.log({
  sessionId: 'sess_abc123',
  event: 'security_validation_failed',
  details: {
    findings: [
      { pattern: 'command-injection', severity: 'critical' }
    ],
    approved: false
  },
  severity: 'warning'
});

// PII tokenization
auditLogger.log({
  sessionId: 'sess_abc123',
  event: 'pii_tokenized',
  details: {
    types: ['EMAIL', 'PHONE'],
    count: 5
  },
  severity: 'info'
});
```

**Tasks**:
1. Create audit schema
2. Implement query API
3. Build export functionality
4. Add retention policies

---

### PHASE 3-4 DELIVERABLES

**Code**:
- ✅ `src/execution-engine/mcp-code-api/` - TypeScript/Python API generators
- ✅ `src/execution-engine/sandbox/` - Docker + VM + Process sandboxes
- ✅ `src/execution-engine/security/` - Pattern detection + PII tokenization
- ✅ `src/execution-engine/discovery/` - Progressive tool discovery
- ✅ `src/execution-engine/workspace/` - State management + caching

**Docker Images**:
- ✅ `typescript-sandbox:latest`
- ✅ `python-sandbox:latest`

**Tests**:
- ✅ >80% coverage for all execution engine components
- ✅ Security pattern detection tests (50+ patterns)
- ✅ PII tokenization tests
- ✅ Sandbox isolation tests
- ✅ End-to-end execution tests

**Documentation**:
- ✅ MCP Code Execution guide (updated from design doc)
- ✅ Security architecture documentation
- ✅ API generation reference
- ✅ Sandbox configuration guide

**Validation Gate**:
```bash
# Test MCP code execution
npm run test:execution-engine

# Benchmark token reduction
npm run benchmark:token-reduction

# Expected output:
# ✅ Traditional MCP: 150,000 tokens
# ✅ Code execution: 2,200 tokens
# ✅ Reduction: 98.7% ✅
#
# ✅ Security: 50+ patterns detected
# ✅ PII: Tokenization working
# ✅ Sandbox: Docker isolation verified
```

---

## 🧠 PHASE 5-6: Intelligent Routing & Agents
**Duration**: Week 7-8
**Goal**: Automatic task classification and optimal resource selection
**Token Budget Impact**: +30% efficiency through smart routing

### Phase Overview

Build the intelligence layer that automatically selects optimal skills, MCPs, commands, and agents for each task. This is what makes code-assistant-claude "self-configuring".

---

### EPIC 5.1: Task Classification Engine

#### Story 5.1.1: NLP-Based Intent Parser
**As a** user
**I want** natural language task recognition
**So that** I can describe what I need in plain English

**Implementation**:

```typescript
// src/core/routing/intent-parser.ts
import nlp from 'compromise';
import { tokenize } from 'natural';

export interface ParsedIntent {
  primaryIntent: string;
  secondaryIntents: string[];
  entities: {
    type: string;
    value: string;
  }[];
  keywords: string[];
  confidence: number;
}

export class IntentParser {
  async parse(userRequest: string): Promise<ParsedIntent> {
    const doc = nlp(userRequest);

    // Extract verbs (actions)
    const verbs = doc.verbs().out('array');

    // Extract nouns (entities)
    const nouns = doc.nouns().out('array');

    // Extract technical terms
    const techTerms = this.extractTechTerms(userRequest);

    // Classify intent
    const intent = this.classifyIntent(verbs, nouns, techTerms);

    return {
      primaryIntent: intent.primary,
      secondaryIntents: intent.secondary,
      entities: this.extractEntities(doc),
      keywords: [...verbs, ...nouns, ...techTerms],
      confidence: intent.confidence
    };
  }

  private classifyIntent(
    verbs: string[],
    nouns: string[],
    techTerms: string[]
  ): { primary: string; secondary: string[]; confidence: number } {
    // Rule-based classification
    const rules = [
      {
        intent: 'code_implementation',
        patterns: ['create', 'build', 'implement', 'add', 'develop'],
        confidence: 0.9
      },
      {
        intent: 'code_review',
        patterns: ['review', 'check', 'analyze', 'audit', 'inspect'],
        confidence: 0.85
      },
      {
        intent: 'ui_design',
        patterns: ['UI', 'component', 'design', 'layout', 'interface'],
        confidence: 0.9
      },
      // ... more rules
    ];

    // Score each intent
    const scores = rules.map(rule => ({
      intent: rule.intent,
      score: this.calculateScore(verbs, nouns, techTerms, rule.patterns),
      confidence: rule.confidence
    }));

    // Return top intent
    const sorted = scores.sort((a, b) => b.score - a.score);
    return {
      primary: sorted[0].intent,
      secondary: sorted.slice(1, 3).map(s => s.intent),
      confidence: sorted[0].score * sorted[0].confidence
    };
  }
}
```

**Tasks**:

1. **Build Intent Classification Rules**
   ```yaml
   # src/core/routing/intent-rules.yaml
   intents:
     code_implementation:
       verbs: ["create", "build", "implement", "add", "develop", "write"]
       nouns: ["feature", "function", "class", "component", "module"]
       tech_terms: ["react", "api", "database", "service"]
       confidence: 0.9

     code_review:
       verbs: ["review", "check", "analyze", "audit", "inspect"]
       nouns: ["code", "PR", "changes", "commit"]
       confidence: 0.85

     # ... 10 more intents
   ```

2. **Implement ML-Based Classification (Optional Enhancement)**
   ```typescript
   // src/core/routing/ml-classifier.ts
   // Use pre-trained model for intent classification
   // Fallback to rule-based if confidence low
   ```

3. **Create Confidence Scorer**
   ```typescript
   // src/core/routing/confidence-scorer.ts
   export class ConfidenceScorer {
     calculateConfidence(
       intent: string,
       keywords: string[],
       context: ProjectContext
     ): number {
       // Multi-factor confidence calculation
       // - Keyword match score
       // - Context relevance
       // - Historical accuracy
       return score;
     }
   }
   ```

**Validation**:
```typescript
test('should parse intent from natural language', async () => {
  const parser = new IntentParser();
  const intent = await parser.parse('Create a responsive login form with validation');

  expect(intent.primaryIntent).toBe('ui_design');
  expect(intent.keywords).toContain('form');
  expect(intent.confidence).toBeGreaterThan(0.8);
});
```

---

#### Story 5.1.2: Complexity Assessment
**As a** routing engine
**I want** to assess task complexity
**So that** I can allocate appropriate resources

**Implementation**:

```typescript
// src/core/routing/complexity-assessor.ts

export type Complexity = 'simple' | 'moderate' | 'complex' | 'enterprise';

export interface ComplexityFactors {
  scope: number;          // 0-1: single file vs entire codebase
  novelty: number;        // 0-1: routine vs innovative
  dependencies: number;   // 0-1: standalone vs many dependencies
  criticalPath: boolean;  // Is this blocking other work?
  expertiseLevel: number; // 0-1: junior vs expert required
}

export class ComplexityAssessor {
  assess(
    intent: ParsedIntent,
    projectContext: ProjectContext
  ): { complexity: Complexity; factors: ComplexityFactors } {
    const factors: ComplexityFactors = {
      scope: this.assessScope(intent),
      novelty: this.assessNovelty(intent, projectContext),
      dependencies: this.assessDependencies(intent, projectContext),
      criticalPath: this.isCriticalPath(intent),
      expertiseLevel: this.assessExpertiseLevel(intent)
    };

    const score = this.calculateComplexityScore(factors);

    return {
      complexity: this.scoreToComplexity(score),
      factors
    };
  }

  private assessScope(intent: ParsedIntent): number {
    // Keywords indicating scope
    const broadScope = ['entire', 'all', 'codebase', 'project-wide'];
    const narrowScope = ['single', 'one', 'this file'];

    if (intent.keywords.some(k => broadScope.includes(k))) return 0.9;
    if (intent.keywords.some(k => narrowScope.includes(k))) return 0.1;

    // Default: moderate scope
    return 0.5;
  }

  private calculateComplexityScore(factors: ComplexityFactors): number {
    return (
      factors.scope * 0.3 +
      factors.novelty * 0.25 +
      factors.dependencies * 0.2 +
      (factors.criticalPath ? 0.15 : 0) +
      factors.expertiseLevel * 0.1
    );
  }

  private scoreToComplexity(score: number): Complexity {
    if (score < 0.3) return 'simple';
    if (score < 0.6) return 'moderate';
    if (score < 0.8) return 'complex';
    return 'enterprise';
  }
}
```

**Validation**:
```typescript
test('should assess complexity accurately', () => {
  const assessor = new ComplexityAssessor();

  // Simple task
  let result = assessor.assess(
    { primaryIntent: 'fix_typo', keywords: ['single', 'file'] },
    projectContext
  );
  expect(result.complexity).toBe('simple');

  // Enterprise task
  result = assessor.assess(
    { primaryIntent: 'migrate', keywords: ['entire', 'codebase', 'microservices'] },
    projectContext
  );
  expect(result.complexity).toBe('enterprise');
});
```

---

### EPIC 5.2: Resource Recommendation Engine

#### Story 5.2.1: Intelligent Resource Selection
**As a** routing engine
**I want** to recommend optimal skills, MCPs, commands
**So that** each task has the right resources

**Implementation**:

```typescript
// src/core/routing/recommendation-engine.ts

export interface RecommendedResources {
  skills: ScoredResource[];
  mcps: ScoredResource[];
  commands: ScoredResource[];
  agents: ScoredResource[];
  mode: BehavioralMode;
  estimatedTokens: number;
  confidence: number;
}

export interface ScoredResource {
  name: string;
  score: number;
  reason: string;
}

export class RecommendationEngine {
  async recommend(
    classification: TaskClassification
  ): Promise<RecommendedResources> {
    const { type, complexity, domain } = classification;

    // Get resource candidates
    const skillCandidates = await this.getSkillCandidates(type, domain);
    const mcpCandidates = await this.getMCPCandidates(type, domain);
    const commandCandidates = await this.getCommandCandidates(type);
    const agentCandidates = await this.getAgentCandidates(type, complexity);

    // Score each candidate
    const skills = this.scoreResources(skillCandidates, classification);
    const mcps = this.scoreResources(mcpCandidates, classification);
    const commands = this.scoreResources(commandCandidates, classification);
    const agents = this.scoreResources(agentCandidates, classification);

    // Select behavioral mode
    const mode = this.selectMode(type, complexity);

    // Estimate token usage
    const estimatedTokens = this.estimateTokenUsage({
      skills: skills.slice(0, 5),
      mcps: mcps.slice(0, 3),
      mode
    });

    return {
      skills: skills.slice(0, 5),
      mcps: mcps.slice(0, 3),
      commands: commands.slice(0, 3),
      agents: agents.slice(0, 2),
      mode,
      estimatedTokens,
      confidence: this.calculateConfidence(skills, mcps, commands)
    };
  }

  private scoreResources(
    candidates: Resource[],
    classification: TaskClassification
  ): ScoredResource[] {
    return candidates.map(resource => {
      const score = this.calculateResourceScore(resource, classification);
      return {
        name: resource.name,
        score,
        reason: this.explainScore(resource, classification, score)
      };
    }).sort((a, b) => b.score - a.score);
  }

  private calculateResourceScore(
    resource: Resource,
    classification: TaskClassification
  ): number {
    let score = 0;

    // Task type match
    if (resource.supportedTaskTypes.includes(classification.type)) {
      score += 0.4;
    }

    // Domain match
    const domainMatch = classification.domain.filter(
      d => resource.domains.includes(d)
    ).length / classification.domain.length;
    score += domainMatch * 0.3;

    // Complexity match
    const complexityScore = this.matchComplexity(
      resource.complexityRange,
      classification.complexity
    );
    score += complexityScore * 0.2;

    // Historical performance
    score += resource.historicalAccuracy * 0.1;

    return Math.min(score, 1.0);
  }
}
```

**Resource Database**:

```yaml
# src/core/routing/resources.yaml

skills:
  code-reviewer:
    supported_task_types:
      - code_review
      - code_implementation  # auto-activate after
    domains: [all]
    complexity_range: [simple, moderate, complex]
    token_cost: 2000
    priority: high

  frontend-design:
    supported_task_types:
      - ui_design
      - code_implementation
    domains: [frontend, react, vue, angular]
    complexity_range: [moderate, complex]
    token_cost: 2500
    priority: medium

mcps:
  magic:
    supported_task_types:
      - ui_design
    domains: [frontend, react, vue]
    complexity_range: [simple, moderate]
    token_cost: 1500

  tavily:
    supported_task_types:
      - research
      - business_analysis
    domains: [all]
    complexity_range: [moderate, complex, enterprise]
    token_cost: 3000

# ... complete database
```

**Validation**:
```typescript
test('should recommend correct resources for UI task', async () => {
  const engine = new RecommendationEngine();
  const resources = await engine.recommend({
    type: 'ui_design',
    complexity: 'moderate',
    domain: ['frontend', 'react']
  });

  expect(resources.skills).toContainEqual(
    expect.objectContaining({ name: 'frontend-design' })
  );
  expect(resources.mcps).toContainEqual(
    expect.objectContaining({ name: 'magic' })
  );
  expect(resources.mode).toBe('orchestration');
});
```

---

### EPIC 5.3: Specialized Agents (10+ Agents)

#### Agent 5.3.1: deep-research-agent
**Purpose**: Multi-hop reasoning with evidence synthesis
**Activation**: Research tasks, complex analysis

**Implementation** (abbreviated):
```markdown
---
name: deep-research-agent
description: Systematic multi-hop research with evidence-based synthesis
triggers: ["research", "investigate", "/sc:research"]
mcps: ["tavily", "sequential"]
complexity: [moderate, complex, enterprise]
---

# Deep Research Agent

## Research Methodology

### 1. Planning Phase
- Decompose research question
- Identify knowledge gaps
- Create search strategy

### 2. Execution Phase
- Multi-hop searches (up to 5 hops)
- Progressive refinement
- Source credibility assessment

### 3. Synthesis Phase
- Cross-reference findings
- Resolve contradictions
- Generate confidence scores

## Output Format
```
# Research Report: [Topic]

## Executive Summary
[1-2 paragraph summary]

## Methodology
- Search strategy: [approach]
- Sources analyzed: [count]
- Confidence level: [score]

## Findings
### [Finding 1]
**Evidence**: [citations]
**Confidence**: 0.85

### [Finding 2]
...

## Synthesis
[Cross-cutting insights]

## Sources
1. [Source](url) - Credibility: High
2. [Source](url) - Credibility: Medium
...
```
```

**Tasks**:
1. Implement multi-hop search algorithm
2. Create source credibility scorer
3. Build synthesis engine
4. Test with real research queries

---

#### Agent 5.3.2-5.3.10: Other Specialized Agents
- **code-reviewer-agent**: Multi-persona code review
- **test-engineer-agent**: Comprehensive test generation
- **security-auditor-agent**: Vulnerability assessment
- **performance-tuner-agent**: Performance optimization
- **refactor-expert-agent**: Code refactoring
- **debugger-agent**: Systematic debugging
- **architect-agent**: System design
- **docs-writer-agent**: Documentation generation
- **business-panel-agent**: Strategic analysis orchestration

(Similar structure to deep-research-agent)

---

### EPIC 5.4: Token Efficiency Layer

#### Story 5.4.1: Symbol System Implementation
**As a** user
**I want** compressed communication in token-efficient mode
**So that** I can maximize context budget

**Implementation**:

```typescript
// src/framework/symbols/symbol-engine.ts

export class SymbolEngine {
  private symbols: Map<string, string>;

  constructor() {
    this.symbols = new Map([
      // Logic flow
      ['→', 'leads to, implies'],
      ['⇒', 'transforms to'],
      ['←', 'rollback, reverse'],
      ['∴', 'therefore'],
      ['∵', 'because'],

      // Status
      ['✅', 'completed, passed'],
      ['❌', 'failed, error'],
      ['⚠️', 'warning'],
      ['🔄', 'in progress'],

      // Technical
      ['⚡', 'performance'],
      ['🛡️', 'security'],
      ['🔍', 'analysis'],
      ['🔧', 'configuration'],

      // ... 50+ symbols
    ]);
  }

  compress(text: string): string {
    let compressed = text;

    // Replace verbose phrases with symbols
    compressed = compressed.replace(/leads to/g, '→');
    compressed = compressed.replace(/therefore/g, '∴');
    compressed = compressed.replace(/completed/g, '✅');
    compressed = compressed.replace(/performance/g, '⚡');

    // Smart abbreviations
    compressed = this.applyAbbreviations(compressed);

    return compressed;
  }

  decompress(text: string): string {
    let decompressed = text;

    for (const [symbol, meaning] of this.symbols) {
      decompressed = decompressed.replace(
        new RegExp(symbol, 'g'),
        meaning.split(',')[0]
      );
    }

    return decompressed;
  }

  estimateReduction(text: string): number {
    const original = tiktoken.encode(text).length;
    const compressed = tiktoken.encode(this.compress(text)).length;

    return ((original - compressed) / original) * 100;
  }
}
```

**Symbol Mappings**:
```yaml
# src/framework/symbols/mappings.yaml

core_logic:
  →: "leads to, implies"
  ⇒: "transforms to"
  ←: "rollback, reverse"
  ⇄: "bidirectional"
  ∴: "therefore"
  ∵: "because"

status:
  ✅: "completed, passed"
  ❌: "failed, error"
  ⚠️: "warning"
  🔄: "in progress"
  ⏳: "waiting, pending"

technical:
  ⚡: "performance"
  🛡️: "security"
  🔍: "analysis"
  🔧: "configuration"
  📦: "deployment"
  🎨: "design"

abbreviations:
  cfg: "configuration"
  impl: "implementation"
  perf: "performance"
  sec: "security"
  req: "requirements"
  deps: "dependencies"
```

**Tasks**:
1. Implement compression/decompression algorithms
2. Create context-aware abbreviation system
3. Build token reduction benchmarks
4. Test with real conversations

**Validation**:
```typescript
test('should achieve 30-50% token reduction', () => {
  const engine = new SymbolEngine();
  const text = 'The authentication system has completed security analysis and passed all performance tests';

  const compressed = engine.compress(text);
  const reduction = engine.estimateReduction(text);

  expect(reduction).toBeGreaterThan(30);
  expect(reduction).toBeLessThan(50);
  expect(compressed).toContain('✅');
  expect(compressed).toContain('🛡️');
  expect(compressed).toContain('⚡');
});
```

---

### PHASE 5-6 DELIVERABLES

**Code**:
- ✅ `src/core/routing/` - Complete intelligent routing system
- ✅ `src/agents/` - 10+ specialized agents
- ✅ `src/framework/symbols/` - Token efficiency layer

**Tests**:
- ✅ Intent parsing tests (>85% accuracy)
- ✅ Resource recommendation tests
- ✅ Agent integration tests
- ✅ Symbol compression benchmarks

**Documentation**:
- ✅ Intelligent routing guide
- ✅ Agent development reference
- ✅ Symbol system documentation

**Validation Gate**:
```bash
# Test intelligent routing
npm run test:routing

# Expected output:
# ✅ Intent classification: 92% accuracy
# ✅ Resource recommendations: 95% relevance
# ✅ Token reduction (symbols): 35% average
# ✅ All agents operational
```

---

## ✅ PHASE 7-8: Testing & Documentation
**Duration**: Week 9-10
**Goal**: Production-ready with >80% test coverage
**Token Budget Impact**: Quality assurance

### Phase Overview

Final phase focuses on comprehensive testing, documentation, and preparing for v1.0.0 release.

---

### EPIC 7.1: Testing Infrastructure

#### Story 7.1.1: Unit Testing
**Coverage target**: >80% for all components

**Test Structure**:
```
tests/
├── unit/
│   ├── cli/
│   │   ├── commands.test.ts
│   │   └── wizard.test.ts
│   │
│   ├── core/
│   │   ├── analyzers/
│   │   │   ├── project-analyzer.test.ts
│   │   │   ├── documentation-analyzer.test.ts
│   │   │   └── git-workflow-analyzer.test.ts
│   │   │
│   │   ├── routing/
│   │   │   ├── intent-parser.test.ts
│   │   │   ├── complexity-assessor.test.ts
│   │   │   └── recommendation-engine.test.ts
│   │   │
│   │   └── configurators/
│   │       └── config-generator.test.ts
│   │
│   ├── execution-engine/
│   │   ├── mcp-code-api/
│   │   │   ├── generator.test.ts
│   │   │   └── schema-parser.test.ts
│   │   │
│   │   ├── sandbox/
│   │   │   ├── docker-sandbox.test.ts
│   │   │   └── vm-sandbox.test.ts
│   │   │
│   │   └── security/
│   │       ├── pattern-detector.test.ts
│   │       └── pii-tokenizer.test.ts
│   │
│   └── framework/
│       ├── skills/
│       │   └── loader.test.ts
│       │
│       └── symbols/
│           └── symbol-engine.test.ts
```

**Tasks**:
1. Write unit tests for all components
2. Achieve >80% coverage
3. Set up coverage reporting
4. Configure CI/CD integration

---

#### Story 7.1.2: Integration Testing
**Test complete workflows end-to-end**

**Integration Tests**:
```typescript
// tests/integration/workflows/ui-development.test.ts

describe('UI Development Workflow', () => {
  test('should handle complete UI component creation', async () => {
    // Setup
    const testProject = await createTestProject('react-app');

    // Execute
    const result = await runWorkflow({
      request: 'Create a responsive login form',
      project: testProject
    });

    // Verify
    expect(result.skillsActivated).toContain('frontend-design');
    expect(result.mcpsUsed).toContain('magic');
    expect(result.filesCreated).toContainEqual(
      expect.objectContaining({
        path: 'src/components/LoginForm.tsx'
      })
    );
    expect(result.testsGenerated).toBe(true);
    expect(result.tokenUsage).toBeLessThan(10000);
  });
});
```

**Test Scenarios**:
1. Complete feature implementation
2. Code review workflow
3. Research task
4. Business analysis
5. Debugging session
6. Refactoring operation

---

#### Story 7.1.3: Performance Testing
**Benchmark critical operations**

**Benchmarks**:
```typescript
// tests/benchmarks/token-reduction.bench.ts

import Benchmark from 'benchmark';

const suite = new Benchmark.Suite();

suite
  .add('Traditional MCP loading', async () => {
    await loadTraditionalMCP();
  })
  .add('Code execution approach', async () => {
    await loadCodeExecutionMCP();
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
    console.log('Token reduction:', calculateReduction());
  })
  .run({ async: true });
```

**Performance Targets**:
- CLI init: <5 seconds
- Skill loading: <100ms per skill
- Intent parsing: <200ms
- Resource recommendation: <500ms
- Sandbox startup: <3 seconds
- Code execution: <5 seconds

---

### EPIC 7.2: Documentation

#### Story 7.2.1: User Documentation
**Complete guides for all user personas**

**Documentation Structure**:
```
docs/
├── README.md                          # Project overview
├── GETTING_STARTED.md                 # Installation & setup
├── QUICK_START.md                     # 5-minute tutorial
├── ARCHITECTURE.md                    # System design
├── MCP_CODE_EXECUTION.md              # Revolutionary feature
├── INTELLIGENT_ROUTING.md             # Task classification
│
├── guides/
│   ├── CREATING_SKILLS.md             # Skill development
│   ├── CREATING_COMMANDS.md           # Command development
│   ├── CONFIGURATION.md               # Settings reference
│   ├── SECURITY.md                    # Security best practices
│   └── TROUBLESHOOTING.md             # Common issues
│
├── api/
│   ├── CLI_COMMANDS.md                # CLI reference
│   ├── CONFIG_SCHEMA.md               # Configuration schema
│   ├── SKILLS_API.md                  # Skills API reference
│   └── AGENTS_API.md                  # Agents API reference
│
└── examples/
    ├── react-app/                     # React setup example
    ├── nodejs-api/                    # Node.js API example
    └── python-django/                 # Django example
```

**Tasks**:
1. Write comprehensive user guides
2. Create API reference documentation
3. Build example projects
4. Record video tutorials

---

#### Story 7.2.2: Developer Documentation
**Enable contributors and advanced users**

**Developer Docs**:
```
CONTRIBUTING.md                         # How to contribute
DEVELOPMENT.md                          # Development setup
TESTING.md                              # Testing guidelines
RELEASE_PROCESS.md                      # Release procedures
CODE_OF_CONDUCT.md                      # Community standards
```

**Tasks**:
1. Write contribution guidelines
2. Document development workflow
3. Create code style guide
4. Build contributor onboarding

---

### EPIC 7.3: Release Preparation

#### Story 7.3.1: v1.0.0 Release
**Prepare production-ready release**

**Release Checklist**:
- [ ] All tests passing (>80% coverage)
- [ ] Documentation complete
- [ ] Example projects working
- [ ] Performance benchmarks met
- [ ] Security audit passed
- [ ] License and copyright correct
- [ ] Changelog generated
- [ ] Release notes written
- [ ] NPM package published
- [ ] GitHub release created
- [ ] Documentation site deployed

**Tasks**:
1. Final testing sweep
2. Security audit
3. Performance validation
4. Documentation review
5. Package and publish

---

### PHASE 7-8 DELIVERABLES

**Tests**:
- ✅ >80% unit test coverage
- ✅ Complete integration test suite
- ✅ Performance benchmarks
- ✅ Security tests

**Documentation**:
- ✅ 9 comprehensive guides
- ✅ Complete API reference
- ✅ 3 example projects
- ✅ Video tutorials

**Release**:
- ✅ v1.0.0 published to NPM
- ✅ GitHub release
- ✅ Documentation site live

**Validation Gate**:
```bash
# Final validation
npm run test
npm run test:integration
npm run test:e2e
npm run benchmark

# All checks should pass:
# ✅ Tests: 487 passing (>80% coverage)
# ✅ Token reduction: 98.7% (MCP code execution)
# ✅ Routing accuracy: 95%
# ✅ Performance: All targets met
# ✅ Documentation: Complete
# ✅ Ready for v1.0.0 release 🚀
```

---

## 📊 Success Metrics & KPIs

### Development Metrics
- **Velocity**: 10-week timeline maintained
- **Quality**: >80% test coverage achieved
- **Documentation**: All guides complete

### Performance Metrics
- **Token Efficiency**: 60-70% reduction vs baseline ✅
  - MCP code execution: 98.7% reduction
  - Progressive skills: 95% reduction
  - Symbol compression: 30-50% reduction

- **Speed**:
  - Setup time: <5 minutes ✅
  - Intent parsing: <200ms ✅
  - Resource recommendation: <500ms ✅

### Quality Metrics
- **Accuracy**:
  - Project detection: >95% ✅
  - Intent classification: >90% ✅
  - Resource recommendations: >95% ✅

- **Reliability**:
  - Test coverage: >80% ✅
  - Security validation: 100% ✅
  - Sandbox isolation: 100% ✅

---

## 🎯 Critical Path & Dependencies

### Critical Path (Blocks Other Work)
1. **Week 1**: CLI foundation → Everything depends on this
2. **Week 2**: Project analyzer → Configuration depends on this
3. **Week 5-6**: MCP code execution → Core innovation
4. **Week 7**: Intelligent routing → Requires skills + MCPs

### Parallel Execution Opportunities

**Phase 1-2 (Week 1-4)**:
- CLI framework (1 dev)
- Project analyzer (1 dev)
- Git workflow detection (1 dev)

**Phase 3-4 (Week 5-6)**:
- Skills development (2 devs)
- MCP code execution (2 devs - complex!)
- Commands system (1 dev)

**Phase 5-6 (Week 7-8)**:
- Intelligent routing (1 dev)
- Agents development (2 devs)
- Token efficiency (1 dev)

**Phase 7-8 (Week 9-10)**:
- Testing (2 devs)
- Documentation (2 devs)

### Recommended Team Size
- **Minimum**: 3 developers
- **Optimal**: 5 developers
- **With docs/testing**: 7 people (5 devs + 2 writers/QA)

---

## 🚨 Risk Mitigation

### High-Risk Areas

1. **MCP Code Execution Engine** (Phase 4)
   - **Risk**: Most complex component, security critical
   - **Mitigation**:
     - Allocate 2 experienced developers
     - Extended testing period
     - Security audit before release
     - Fallback to traditional MCP if needed

2. **Docker Sandbox Isolation** (Phase 4)
   - **Risk**: Platform-specific issues, performance concerns
   - **Mitigation**:
     - Implement VM fallback
     - Process isolation as last resort
     - Extensive cross-platform testing
     - Clear platform requirements

3. **Intelligent Routing Accuracy** (Phase 5)
   - **Risk**: May not achieve >90% accuracy initially
   - **Mitigation**:
     - Start with rule-based (simpler)
     - Add ML enhancement later
     - Collect user feedback for improvement
     - Manual override always available

4. **Token Budget Management**
   - **Risk**: May not achieve 60-70% reduction target
   - **Mitigation**:
     - Core innovation (98.7%) ensures success
     - Progressive loading provides additional savings
     - Symbol system adds 30-50% more
     - Target exceeded even with some features missing

---

## 🔄 Iterative Development Approach

### Sprint Structure (2-week sprints)

**Sprint 1-2 (Phase 1)**: Foundation
- Goals: Working CLI, basic detection
- Demo: `code-assistant-claude init` working
- Review: Architecture validation

**Sprint 3-4 (Phase 2)**: Skills
- Goals: 20+ skills, progressive loading
- Demo: Skill activation in action
- Review: Token savings validated

**Sprint 5-6 (Phase 3-4)**: MCP Execution
- Goals: Code execution working, 98.7% reduction
- Demo: MCP code execution vs traditional
- Review: Security audit passed

**Sprint 7-8 (Phase 5-6)**: Intelligence
- Goals: Routing + agents operational
- Demo: End-to-end automated workflows
- Review: Accuracy metrics validated

**Sprint 9-10 (Phase 7-8)**: Polish
- Goals: Testing + docs complete
- Demo: Full product walkthrough
- Review: Release readiness check

### Review Gates
Each sprint ends with:
1. **Demo**: Working features shown
2. **Metrics**: Performance measured
3. **Retrospective**: Lessons learned
4. **Planning**: Next sprint adjusted

---

## 📅 Timeline Summary

```
Week 1-2:  Foundation (CLI, Analyzers, Config)
Week 3-4:  Skills System (20+ skills, progressive loading)
Week 5-6:  MCP Code Execution (98.7% token reduction) ⚡
Week 7-8:  Intelligence (Routing, Agents, Token efficiency)
Week 9-10: Polish (Testing, Documentation, Release)

Milestone: v1.0.0 Release 🚀
```

---

## 🎓 Appendices

### A. Technology Reference

**Core Stack**:
- **Runtime**: Node.js 18+
- **Language**: TypeScript 5.3+
- **Build**: tsup (fast bundler)
- **Testing**: Jest + ts-jest
- **CLI**: Commander.js + Inquirer.js

**Key Libraries**:
- **NLP**: compromise, natural
- **Tokens**: tiktoken
- **Security**: dockerode, better-sqlite3
- **Performance**: lru-cache, memoizee, p-limit
- **UI**: chalk, ora

### B. File Structure per Phase

**Phase 1**:
```
src/
├── cli/
│   ├── index.ts
│   ├── commands/
│   └── utils/
├── core/
│   ├── analyzers/
│   ├── configurators/
│   └── git/
```

**Phase 2**:
```
src/framework/
├── skills/
│   ├── schema.ts
│   ├── loader.ts
│   └── validator.ts
templates/skills/
├── core/
├── domain/
└── superclaude/
```

**Phase 3-4**:
```
src/execution-engine/
├── mcp-code-api/
├── sandbox/
├── security/
├── discovery/
└── workspace/
docker/
├── typescript-sandbox/
└── python-sandbox/
```

**Phase 5-6**:
```
src/core/routing/
├── intent-parser.ts
├── complexity-assessor.ts
└── recommendation-engine.ts
src/agents/
├── deep-research-agent.md
└── ...
src/framework/symbols/
```

### C. Testing Strategy

**Unit Tests**:
- Every function/class has tests
- Mock external dependencies
- Test edge cases
- Target: >80% coverage

**Integration Tests**:
- Complete workflows
- Real project scenarios
- Multi-component interactions

**E2E Tests**:
- Full CLI workflows
- User journey simulations
- Cross-platform validation

**Performance Tests**:
- Token usage benchmarks
- Speed measurements
- Load testing

### D. Documentation Checklist

**User Docs**:
- [ ] README.md with quick start
- [ ] Installation guide
- [ ] Configuration reference
- [ ] User guides (8+)
- [ ] Troubleshooting guide
- [ ] FAQ

**Developer Docs**:
- [ ] Architecture documentation
- [ ] API reference
- [ ] Contributing guide
- [ ] Development setup
- [ ] Testing guidelines

**Examples**:
- [ ] React application
- [ ] Node.js API
- [ ] Python Django project

**Media**:
- [ ] Demo videos
- [ ] Tutorial screencasts
- [ ] Architecture diagrams

---

## 🏁 Conclusion

This comprehensive workflow provides a complete roadmap for implementing code-assistant-claude from scratch. With systematic execution of these phases, the project will achieve its revolutionary goals:

✅ **98.7% token reduction** through MCP code execution
✅ **Intelligent task routing** for optimal resource selection
✅ **SuperClaude integration** for behavioral sophistication
✅ **Security-first design** with Docker sandboxing
✅ **Production-ready quality** with >80% test coverage

**Ready to build the future of Claude Code development! 🚀**

---

**Generated by**: /sc:workflow command
**Based on**: Complete project documentation
**Version**: 1.0.0
**Date**: 2025-11-23
