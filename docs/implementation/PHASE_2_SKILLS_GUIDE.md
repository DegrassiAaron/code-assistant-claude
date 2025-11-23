# Phase 2: Skills System - Complete Implementation Guide
## Progressive Loading Infrastructure for Code-Assistant-Claude

**Status**: 📋 Ready for Implementation
**Duration**: 2 weeks (Week 3-4)
**Complexity**: High
**Priority**: Critical (Foundation for all subsequent phases)

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture Design](#architecture-design)
3. [File Structure](#file-structure)
4. [Step-by-Step Implementation](#step-by-step-implementation)
5. [Testing Strategy](#testing-strategy)
6. [Validation Checklist](#validation-checklist)

---

## Overview

### Objectives

✅ **Progressive Loading Infrastructure**: Metadata → Full Content → Resources
✅ **5 Core Skills**: code-reviewer, test-generator, git-commit-helper, security-auditor, performance-optimizer
✅ **6 SuperClaude Mode Skills**: Brainstorming, Research, Orchestration, Task Management, Token Efficiency, Introspection
✅ **Token Tracking System**: Per-skill consumption monitoring
✅ **Skill Creator Meta-Skill**: Template-based skill generation

### Success Metrics

- Skills load progressively with measured token costs
- Token savings: **95%** vs always-loaded (40K → 2K baseline)
- Skill activation accuracy: **>90%**
- Zero false positives for skill triggers
- Test coverage: **>80%**

---

## Architecture Design

### Progressive Loading System

```
┌─────────────────────────────────────────────────────────────┐
│                    Skill Lifecycle                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Stage 1: METADATA (Always Loaded)                         │
│  ├─ Tokens: 30-50 per skill                                │
│  ├─ Contains: name, description, triggers, dependencies    │
│  └─ Total: ~500 tokens for 10 skills                       │
│                                                             │
│  Stage 2: FULL CONTENT (Load on Match)                     │
│  ├─ Tokens: 1,500-3,000 per skill                          │
│  ├─ Contains: instructions, examples, patterns             │
│  └─ Loaded: when trigger matches task                      │
│                                                             │
│  Stage 3: RESOURCES (Load on Demand)                       │
│  ├─ Tokens: Variable (500-2,000)                           │
│  ├─ Contains: scripts, templates, references               │
│  └─ Loaded: when skill execution requires them             │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Token Savings Calculation:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Always-Loaded Baseline:
  10 skills × 4,000 tokens = 40,000 tokens

Progressive Loading:
  Metadata: 10 × 50 tokens = 500 tokens (always)
  Active: 2 × 2,500 tokens = 5,000 tokens (matched)
  Total: 5,500 tokens

Reduction: (40,000 - 5,500) / 40,000 = 86.25% ✅
Target: >85% ✅
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Skill Metadata Schema

```yaml
---
name: "skill-name"
version: "1.0.0"
description: "Brief description for skill matching"
author: "Author Name"
category: "core|domain|superclaude|meta"

# Trigger Configuration
triggers:
  keywords: ["keyword1", "keyword2"]
  patterns: ["regex1", "regex2"]
  filePatterns: ["*.ts", "*.js"]
  commands: ["/command1", "/command2"]
  events: ["file_save", "pre_commit"]

# Resource Management
tokenCost:
  metadata: 45              # This metadata section
  fullContent: 2000         # Full skill content
  resources: 500            # Additional resources

# Dependencies
dependencies:
  skills: ["skill1", "skill2"]
  mcps: ["serena", "sequential"]

# Composability
composability:
  compatibleWith: ["skill3", "skill4"]
  conflictsWith: ["skill5"]

# Context Requirements
context:
  projectTypes: ["javascript", "typescript", "react"]
  minNodeVersion: "18.0.0"
  requiredTools: ["eslint", "prettier"]

# Priority and Timing
priority: "high|medium|low"
autoActivate: true
cacheStrategy: "aggressive|normal|minimal"
---
```

---

## File Structure

### Complete Directory Layout

```
templates/
├── skills/
│   ├── skill-template/              # Meta-template for creating skills
│   │   ├── SKILL.md                 # Template with placeholder variables
│   │   ├── README.md                # How to use this template
│   │   ├── examples/
│   │   │   └── example-usage.md
│   │   ├── resources/
│   │   │   └── .gitkeep
│   │   └── tests/
│   │       └── skill-validation.test.ts
│   │
│   ├── core/                        # Essential skills (5 skills)
│   │   ├── code-reviewer/
│   │   │   ├── SKILL.md
│   │   │   ├── examples/
│   │   │   │   ├── react-review.md
│   │   │   │   └── nodejs-review.md
│   │   │   ├── resources/
│   │   │   │   ├── eslint-rules.json
│   │   │   │   └── best-practices.md
│   │   │   └── tests/
│   │   │       └── code-reviewer.test.ts
│   │   │
│   │   ├── test-generator/
│   │   │   ├── SKILL.md
│   │   │   ├── examples/
│   │   │   ├── resources/
│   │   │   │   ├── jest-templates.js
│   │   │   │   └── testing-patterns.md
│   │   │   └── tests/
│   │   │
│   │   ├── git-commit-helper/
│   │   │   ├── SKILL.md
│   │   │   ├── examples/
│   │   │   ├── resources/
│   │   │   │   ├── conventional-commits.md
│   │   │   │   └── commit-templates.txt
│   │   │   └── tests/
│   │   │
│   │   ├── security-auditor/
│   │   │   ├── SKILL.md
│   │   │   ├── examples/
│   │   │   ├── resources/
│   │   │   │   ├── owasp-top-10.md
│   │   │   │   ├── vulnerability-patterns.json
│   │   │   │   └── security-checklist.md
│   │   │   └── tests/
│   │   │
│   │   └── performance-optimizer/
│   │       ├── SKILL.md
│   │       ├── examples/
│   │       ├── resources/
│   │       │   ├── performance-patterns.md
│   │       │   └── optimization-strategies.json
│   │       └── tests/
│   │
│   ├── superclaude/                 # SuperClaude mode skills (6 modes)
│   │   └── modes/
│   │       ├── brainstorming-mode/
│   │       │   ├── SKILL.md
│   │       │   ├── examples/
│   │       │   │   ├── requirements-discovery.md
│   │       │   │   └── socratic-dialogue.md
│   │       │   └── resources/
│   │       │       └── question-patterns.json
│   │       │
│   │       ├── research-mode/
│   │       │   ├── SKILL.md
│   │       │   ├── examples/
│   │       │   └── resources/
│   │       │       ├── research-templates.md
│   │       │       └── citation-formats.json
│   │       │
│   │       ├── orchestration-mode/
│   │       │   ├── SKILL.md
│   │       │   ├── examples/
│   │       │   └── resources/
│   │       │       └── tool-selection-matrix.json
│   │       │
│   │       ├── task-management-mode/
│   │       │   ├── SKILL.md
│   │       │   ├── examples/
│   │       │   └── resources/
│   │       │       └── memory-schemas.json
│   │       │
│   │       ├── token-efficiency-mode/
│   │       │   ├── SKILL.md
│   │       │   ├── examples/
│   │       │   └── resources/
│   │       │       ├── symbol-reference.md
│   │       │       └── compression-patterns.json
│   │       │
│   │       └── introspection-mode/
│   │           ├── SKILL.md
│   │           ├── examples/
│   │           └── resources/
│   │               └── reflection-templates.md
│   │
│   └── meta/                        # Meta-skills
│       └── skill-creator/
│           ├── SKILL.md
│           ├── examples/
│           │   └── create-custom-skill.md
│           └── resources/
│               ├── skill-template.md
│               └── validation-schema.json

src/
└── core/
    └── skills/
        ├── skill-loader.ts          # Progressive loading implementation
        ├── skill-parser.ts          # YAML frontmatter + markdown parser
        ├── skill-registry.ts        # Skill indexing and discovery
        ├── skill-validator.ts       # Schema validation
        ├── token-tracker.ts         # Token consumption tracking
        ├── cache-manager.ts         # Skill caching strategies
        └── types.ts                 # TypeScript interfaces

tests/
├── unit/
│   └── skills/
│       ├── skill-loader.test.ts
│       ├── skill-parser.test.ts
│       ├── skill-registry.test.ts
│       ├── skill-validator.test.ts
│       └── token-tracker.test.ts
│
└── integration/
    └── skills/
        ├── progressive-loading.test.ts
        ├── skill-activation.test.ts
        └── core-skills.test.ts
```

**Total Files Estimate**: ~60 files
- Templates: 40 files (skills + resources + examples)
- Source: 7 files
- Tests: 13 files

---

## Step-by-Step Implementation

### Week 3: Core Infrastructure

#### Day 1-2: TypeScript Interfaces and Types

**File**: `src/core/skills/types.ts`

```typescript
/**
 * Skill metadata extracted from YAML frontmatter
 */
export interface SkillMetadata {
  name: string;
  version: string;
  description: string;
  author?: string;
  category: 'core' | 'domain' | 'superclaude' | 'meta';

  triggers: {
    keywords?: string[];
    patterns?: string[];
    filePatterns?: string[];
    commands?: string[];
    events?: string[];
  };

  tokenCost: {
    metadata: number;
    fullContent: number;
    resources: number;
  };

  dependencies?: {
    skills?: string[];
    mcps?: string[];
  };

  composability?: {
    compatibleWith?: string[];
    conflictsWith?: string[];
  };

  context?: {
    projectTypes?: string[];
    minNodeVersion?: string;
    requiredTools?: string[];
  };

  priority: 'high' | 'medium' | 'low';
  autoActivate: boolean;
  cacheStrategy: 'aggressive' | 'normal' | 'minimal';
}

/**
 * Full skill content with metadata and body
 */
export interface Skill {
  metadata: SkillMetadata;
  content: string;           // Full markdown content
  resources?: SkillResource[];
  loaded: LoadingStage;
  loadedAt?: Date;
  tokensConsumed: number;
}

/**
 * Skill resource (templates, scripts, references)
 */
export interface SkillResource {
  name: string;
  type: 'template' | 'script' | 'reference' | 'config';
  path: string;
  content?: string;
  loaded: boolean;
}

/**
 * Loading stages for progressive loading
 */
export enum LoadingStage {
  METADATA_ONLY = 'metadata',
  FULL_CONTENT = 'full',
  WITH_RESOURCES = 'resources'
}

/**
 * Skill activation context
 */
export interface ActivationContext {
  userMessage: string;
  projectType?: string;
  fileContext?: string[];
  currentCommand?: string;
  eventType?: string;
}

/**
 * Token tracking entry
 */
export interface TokenUsageEntry {
  skillName: string;
  stage: LoadingStage;
  tokens: number;
  timestamp: Date;
}

/**
 * Skill registry entry
 */
export interface SkillRegistryEntry {
  metadata: SkillMetadata;
  path: string;
  lastModified: Date;
  indexed: boolean;
}
```

**Implementation Steps**:
1. Create `src/core/skills/types.ts`
2. Define all interfaces with comprehensive JSDoc
3. Export all types for use in other modules
4. Run `npm run typecheck` to validate

---

#### Day 2-3: Skill Parser

**File**: `src/core/skills/skill-parser.ts`

```typescript
import { promises as fs } from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { Skill, SkillMetadata, LoadingStage, SkillResource } from './types';

/**
 * Parses skill files and extracts metadata and content
 */
export class SkillParser {
  /**
   * Parse skill file and extract metadata + content
   * @param skillPath - Absolute path to SKILL.md file
   * @param stage - Loading stage (metadata only or full content)
   */
  async parseSkill(
    skillPath: string,
    stage: LoadingStage = LoadingStage.METADATA_ONLY
  ): Promise<Skill> {
    const content = await fs.readFile(skillPath, 'utf-8');

    // Extract YAML frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]+?)\n---/);
    if (!frontmatterMatch) {
      throw new Error(`Invalid skill file: missing frontmatter in ${skillPath}`);
    }

    const metadata = yaml.load(frontmatterMatch[1]) as SkillMetadata;

    // Validate metadata
    this.validateMetadata(metadata);

    // Calculate tokens for metadata
    const metadataTokens = this.estimateTokens(frontmatterMatch[0]);

    // Return based on loading stage
    if (stage === LoadingStage.METADATA_ONLY) {
      return {
        metadata,
        content: '',
        loaded: LoadingStage.METADATA_ONLY,
        loadedAt: new Date(),
        tokensConsumed: metadataTokens
      };
    }

    // Extract full content (everything after frontmatter)
    const bodyContent = content.substring(frontmatterMatch[0].length).trim();
    const fullTokens = metadataTokens + this.estimateTokens(bodyContent);

    const skill: Skill = {
      metadata,
      content: bodyContent,
      loaded: LoadingStage.FULL_CONTENT,
      loadedAt: new Date(),
      tokensConsumed: fullTokens
    };

    // Load resources if requested
    if (stage === LoadingStage.WITH_RESOURCES) {
      const resources = await this.loadResources(skillPath);
      skill.resources = resources;
      skill.loaded = LoadingStage.WITH_RESOURCES;
      skill.tokensConsumed = fullTokens + this.calculateResourceTokens(resources);
    }

    return skill;
  }

  /**
   * Load skill resources (templates, scripts, etc.)
   */
  private async loadResources(skillPath: string): Promise<SkillResource[]> {
    const skillDir = path.dirname(skillPath);
    const resourcesDir = path.join(skillDir, 'resources');

    try {
      const files = await fs.readdir(resourcesDir);
      const resources: SkillResource[] = [];

      for (const file of files) {
        if (file === '.gitkeep') continue;

        const resourcePath = path.join(resourcesDir, file);
        const stat = await fs.stat(resourcePath);

        if (stat.isFile()) {
          const content = await fs.readFile(resourcePath, 'utf-8');
          resources.push({
            name: file,
            type: this.detectResourceType(file),
            path: resourcePath,
            content,
            loaded: true
          });
        }
      }

      return resources;
    } catch (error) {
      // Resources directory doesn't exist or is empty
      return [];
    }
  }

  /**
   * Detect resource type from file extension
   */
  private detectResourceType(filename: string): SkillResource['type'] {
    const ext = path.extname(filename).toLowerCase();

    if (ext === '.json') return 'config';
    if (ext === '.js' || ext === '.ts') return 'script';
    if (ext === '.md') return 'reference';
    return 'template';
  }

  /**
   * Validate skill metadata against schema
   */
  private validateMetadata(metadata: SkillMetadata): void {
    // Required fields
    if (!metadata.name) throw new Error('Skill metadata missing required field: name');
    if (!metadata.description) throw new Error('Skill metadata missing required field: description');
    if (!metadata.category) throw new Error('Skill metadata missing required field: category');

    // Validate category
    const validCategories = ['core', 'domain', 'superclaude', 'meta'];
    if (!validCategories.includes(metadata.category)) {
      throw new Error(`Invalid category: ${metadata.category}`);
    }

    // Validate triggers
    if (!metadata.triggers || Object.keys(metadata.triggers).length === 0) {
      throw new Error('Skill must have at least one trigger');
    }

    // Validate token costs
    if (!metadata.tokenCost) {
      throw new Error('Skill metadata missing required field: tokenCost');
    }
  }

  /**
   * Estimate token count for text using simple heuristic
   * (Will be replaced with tiktoken in production)
   */
  private estimateTokens(text: string): number {
    // Simple estimation: ~4 characters per token
    return Math.ceil(text.length / 4);
  }

  /**
   * Calculate total tokens for resources
   */
  private calculateResourceTokens(resources: SkillResource[]): number {
    return resources.reduce((total, resource) => {
      return total + (resource.content ? this.estimateTokens(resource.content) : 0);
    }, 0);
  }
}
```

**Implementation Steps**:
1. Install dependencies: `npm install js-yaml` and `npm install -D @types/js-yaml`
2. Create `src/core/skills/skill-parser.ts`
3. Implement progressive parsing logic
4. Add comprehensive error handling
5. Write unit tests in `tests/unit/skills/skill-parser.test.ts`

**Test Cases**:
```typescript
describe('SkillParser', () => {
  it('should parse metadata only', async () => {
    const parser = new SkillParser();
    const skill = await parser.parseSkill(
      'templates/skills/core/code-reviewer/SKILL.md',
      LoadingStage.METADATA_ONLY
    );

    expect(skill.metadata.name).toBe('code-reviewer');
    expect(skill.content).toBe('');
    expect(skill.loaded).toBe(LoadingStage.METADATA_ONLY);
    expect(skill.tokensConsumed).toBeLessThan(100);
  });

  it('should parse full content', async () => {
    const parser = new SkillParser();
    const skill = await parser.parseSkill(
      'templates/skills/core/code-reviewer/SKILL.md',
      LoadingStage.FULL_CONTENT
    );

    expect(skill.content).not.toBe('');
    expect(skill.loaded).toBe(LoadingStage.FULL_CONTENT);
    expect(skill.tokensConsumed).toBeGreaterThan(1000);
  });

  it('should load resources', async () => {
    const parser = new SkillParser();
    const skill = await parser.parseSkill(
      'templates/skills/core/code-reviewer/SKILL.md',
      LoadingStage.WITH_RESOURCES
    );

    expect(skill.resources).toBeDefined();
    expect(skill.resources!.length).toBeGreaterThan(0);
    expect(skill.loaded).toBe(LoadingStage.WITH_RESOURCES);
  });
});
```

---

#### Day 3-4: Skill Registry

**File**: `src/core/skills/skill-registry.ts`

```typescript
import { promises as fs } from 'fs';
import path from 'path';
import { glob } from 'glob';
import { SkillMetadata, SkillRegistryEntry } from './types';
import { SkillParser } from './skill-parser';

/**
 * Manages skill discovery and indexing
 */
export class SkillRegistry {
  private entries: Map<string, SkillRegistryEntry> = new Map();
  private parser: SkillParser;
  private skillsDir: string;

  constructor(skillsDir: string) {
    this.skillsDir = skillsDir;
    this.parser = new SkillParser();
  }

  /**
   * Index all skills in the skills directory
   */
  async indexSkills(): Promise<void> {
    const skillFiles = await glob('**/SKILL.md', {
      cwd: this.skillsDir,
      absolute: true
    });

    for (const skillPath of skillFiles) {
      try {
        await this.indexSkill(skillPath);
      } catch (error) {
        console.warn(`Failed to index skill: ${skillPath}`, error);
      }
    }

    console.log(`Indexed ${this.entries.size} skills`);
  }

  /**
   * Index a single skill file
   */
  private async indexSkill(skillPath: string): Promise<void> {
    // Parse metadata only for indexing
    const skill = await this.parser.parseSkill(
      skillPath,
      'metadata' as any
    );

    const stat = await fs.stat(skillPath);

    this.entries.set(skill.metadata.name, {
      metadata: skill.metadata,
      path: skillPath,
      lastModified: stat.mtime,
      indexed: true
    });
  }

  /**
   * Get all registered skills
   */
  getAll(): SkillRegistryEntry[] {
    return Array.from(this.entries.values());
  }

  /**
   * Get skill by name
   */
  get(name: string): SkillRegistryEntry | undefined {
    return this.entries.get(name);
  }

  /**
   * Find skills matching criteria
   */
  find(predicate: (entry: SkillRegistryEntry) => boolean): SkillRegistryEntry[] {
    return Array.from(this.entries.values()).filter(predicate);
  }

  /**
   * Find skills by keyword
   */
  findByKeyword(keyword: string): SkillRegistryEntry[] {
    const lowerKeyword = keyword.toLowerCase();
    return this.find(entry =>
      entry.metadata.triggers.keywords?.some(k =>
        k.toLowerCase().includes(lowerKeyword)
      ) ?? false
    );
  }

  /**
   * Find skills by category
   */
  findByCategory(category: SkillMetadata['category']): SkillRegistryEntry[] {
    return this.find(entry => entry.metadata.category === category);
  }

  /**
   * Find skills by project type
   */
  findByProjectType(projectType: string): SkillRegistryEntry[] {
    return this.find(entry =>
      entry.metadata.context?.projectTypes?.includes(projectType) ?? false
    );
  }

  /**
   * Get total token cost for metadata of all skills
   */
  getTotalMetadataTokens(): number {
    return Array.from(this.entries.values()).reduce(
      (total, entry) => total + entry.metadata.tokenCost.metadata,
      0
    );
  }
}
```

**Implementation Steps**:
1. Install glob: `npm install glob` and `npm install -D @types/glob`
2. Create `src/core/skills/skill-registry.ts`
3. Implement indexing and search functionality
4. Write unit tests

---

#### Day 4-5: Progressive Skill Loader

**File**: `src/core/skills/skill-loader.ts`

```typescript
import { Skill, LoadingStage, ActivationContext, SkillMetadata } from './types';
import { SkillRegistry } from './skill-registry';
import { SkillParser } from './skill-parser';
import { TokenTracker } from './token-tracker';
import { CacheManager } from './cache-manager';

/**
 * Manages progressive skill loading with caching and token tracking
 */
export class SkillLoader {
  private registry: SkillRegistry;
  private parser: SkillParser;
  private tokenTracker: TokenTracker;
  private cache: CacheManager;

  // Currently loaded skills
  private loadedSkills: Map<string, Skill> = new Map();

  constructor(skillsDir: string) {
    this.registry = new SkillRegistry(skillsDir);
    this.parser = new SkillParser();
    this.tokenTracker = new TokenTracker();
    this.cache = new CacheManager();
  }

  /**
   * Initialize loader by indexing all skills
   */
  async initialize(): Promise<void> {
    await this.registry.indexSkills();

    // Track metadata tokens
    const metadataTokens = this.registry.getTotalMetadataTokens();
    this.tokenTracker.trackSystemUsage('skills_metadata', metadataTokens);
  }

  /**
   * Match skills to activation context
   */
  async matchSkills(context: ActivationContext): Promise<string[]> {
    const allSkills = this.registry.getAll();
    const matches: string[] = [];

    for (const entry of allSkills) {
      if (this.shouldActivate(entry.metadata, context)) {
        matches.push(entry.metadata.name);
      }
    }

    return matches;
  }

  /**
   * Load matched skills progressively
   */
  async loadSkills(
    skillNames: string[],
    stage: LoadingStage = LoadingStage.FULL_CONTENT
  ): Promise<Skill[]> {
    const skills: Skill[] = [];

    for (const skillName of skillNames) {
      const skill = await this.loadSkill(skillName, stage);
      if (skill) {
        skills.push(skill);
      }
    }

    return skills;
  }

  /**
   * Load a single skill with caching
   */
  private async loadSkill(
    skillName: string,
    stage: LoadingStage
  ): Promise<Skill | null> {
    // Check if already loaded at requested stage or higher
    const cached = this.loadedSkills.get(skillName);
    if (cached && this.isStageLoaded(cached.loaded, stage)) {
      return cached;
    }

    // Check cache manager
    const cachedSkill = await this.cache.get(skillName, stage);
    if (cachedSkill) {
      this.loadedSkills.set(skillName, cachedSkill);
      return cachedSkill;
    }

    // Load from file system
    const entry = this.registry.get(skillName);
    if (!entry) {
      console.warn(`Skill not found: ${skillName}`);
      return null;
    }

    try {
      const skill = await this.parser.parseSkill(entry.path, stage);

      // Track tokens
      this.tokenTracker.trackSkillUsage(
        skillName,
        stage,
        skill.tokensConsumed
      );

      // Cache skill
      await this.cache.set(skillName, skill);

      // Store in loaded skills
      this.loadedSkills.set(skillName, skill);

      return skill;
    } catch (error) {
      console.error(`Failed to load skill: ${skillName}`, error);
      return null;
    }
  }

  /**
   * Check if skill should be activated based on context
   */
  private shouldActivate(
    metadata: SkillMetadata,
    context: ActivationContext
  ): boolean {
    const { triggers } = metadata;
    const { userMessage, currentCommand, eventType, projectType } = context;

    // Check keywords
    if (triggers.keywords) {
      const messageLower = userMessage.toLowerCase();
      if (triggers.keywords.some(k => messageLower.includes(k.toLowerCase()))) {
        return true;
      }
    }

    // Check patterns (regex)
    if (triggers.patterns) {
      if (triggers.patterns.some(p => new RegExp(p, 'i').test(userMessage))) {
        return true;
      }
    }

    // Check commands
    if (triggers.commands && currentCommand) {
      if (triggers.commands.includes(currentCommand)) {
        return true;
      }
    }

    // Check events
    if (triggers.events && eventType) {
      if (triggers.events.includes(eventType)) {
        return true;
      }
    }

    // Check project type compatibility
    if (metadata.context?.projectTypes && projectType) {
      if (!metadata.context.projectTypes.includes(projectType)) {
        return false;
      }
    }

    return false;
  }

  /**
   * Check if a stage includes another stage
   */
  private isStageLoaded(loaded: LoadingStage, requested: LoadingStage): boolean {
    const stages = [
      LoadingStage.METADATA_ONLY,
      LoadingStage.FULL_CONTENT,
      LoadingStage.WITH_RESOURCES
    ];

    return stages.indexOf(loaded) >= stages.indexOf(requested);
  }

  /**
   * Unload skill to free memory
   */
  unloadSkill(skillName: string): void {
    const skill = this.loadedSkills.get(skillName);
    if (skill) {
      this.tokenTracker.trackSkillUnload(skillName, skill.tokensConsumed);
      this.loadedSkills.delete(skillName);
    }
  }

  /**
   * Get currently loaded skills
   */
  getLoadedSkills(): Skill[] {
    return Array.from(this.loadedSkills.values());
  }

  /**
   * Get total tokens consumed by loaded skills
   */
  getTotalTokensConsumed(): number {
    return Array.from(this.loadedSkills.values()).reduce(
      (total, skill) => total + skill.tokensConsumed,
      0
    );
  }
}
```

**Implementation Steps**:
1. Create `src/core/skills/skill-loader.ts`
2. Implement progressive loading logic
3. Add skill matching algorithm
4. Integrate token tracking
5. Write comprehensive tests

---

#### Day 5-6: Token Tracker and Cache Manager

**File**: `src/core/skills/token-tracker.ts`

```typescript
import { TokenUsageEntry, LoadingStage } from './types';

/**
 * Tracks token consumption for skills
 */
export class TokenTracker {
  private entries: TokenUsageEntry[] = [];
  private systemUsage: Map<string, number> = new Map();

  /**
   * Track skill token usage
   */
  trackSkillUsage(
    skillName: string,
    stage: LoadingStage,
    tokens: number
  ): void {
    this.entries.push({
      skillName,
      stage,
      tokens,
      timestamp: new Date()
    });
  }

  /**
   * Track system-level usage (metadata, etc.)
   */
  trackSystemUsage(category: string, tokens: number): void {
    this.systemUsage.set(category, tokens);
  }

  /**
   * Track skill unload (negative tokens)
   */
  trackSkillUnload(skillName: string, tokens: number): void {
    this.entries.push({
      skillName,
      stage: LoadingStage.METADATA_ONLY,
      tokens: -tokens,
      timestamp: new Date()
    });
  }

  /**
   * Get total tokens consumed
   */
  getTotalTokens(): number {
    const skillTokens = this.entries.reduce((sum, entry) => sum + entry.tokens, 0);
    const systemTokens = Array.from(this.systemUsage.values()).reduce((sum, val) => sum + val, 0);
    return skillTokens + systemTokens;
  }

  /**
   * Get usage by skill
   */
  getUsageBySkill(): Map<string, number> {
    const usage = new Map<string, number>();

    for (const entry of this.entries) {
      const current = usage.get(entry.skillName) || 0;
      usage.set(entry.skillName, current + entry.tokens);
    }

    return usage;
  }

  /**
   * Get usage report
   */
  getReport(): string {
    const total = this.getTotalTokens();
    const bySkill = this.getUsageBySkill();

    let report = `📊 Token Usage Report\n`;
    report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    report += `Total: ${total.toLocaleString()} tokens\n\n`;

    // System usage
    report += `System:\n`;
    for (const [category, tokens] of this.systemUsage) {
      report += `  ${category}: ${tokens.toLocaleString()} tokens\n`;
    }

    // Skill usage
    report += `\nSkills:\n`;
    for (const [skill, tokens] of bySkill) {
      if (tokens > 0) {
        report += `  ${skill}: ${tokens.toLocaleString()} tokens\n`;
      }
    }

    return report;
  }
}
```

**File**: `src/core/skills/cache-manager.ts`

```typescript
import { LRUCache } from 'lru-cache';
import { Skill, LoadingStage } from './types';

/**
 * Manages caching of loaded skills
 */
export class CacheManager {
  private cache: LRUCache<string, Skill>;

  constructor(maxSize: number = 50) {
    this.cache = new LRUCache({
      max: maxSize,
      ttl: 1000 * 60 * 30, // 30 minutes
      updateAgeOnGet: true,
      updateAgeOnHas: true
    });
  }

  /**
   * Get skill from cache
   */
  async get(skillName: string, stage: LoadingStage): Promise<Skill | null> {
    const cached = this.cache.get(this.getCacheKey(skillName, stage));
    return cached || null;
  }

  /**
   * Set skill in cache
   */
  async set(skillName: string, skill: Skill): Promise<void> {
    const key = this.getCacheKey(skillName, skill.loaded);
    this.cache.set(key, skill);
  }

  /**
   * Clear cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      max: this.cache.max,
      hits: this.cache.calculatedSize
    };
  }

  private getCacheKey(skillName: string, stage: LoadingStage): string {
    return `${skillName}:${stage}`;
  }
}
```

**Implementation Steps**:
1. Install lru-cache: `npm install lru-cache`
2. Create both tracker and cache manager
3. Integrate with skill loader
4. Write unit tests

---

### Week 4: Skills Implementation

#### Day 7-10: Core Skills (5 skills)

For each skill, create complete implementation following this template:

**Example**: `templates/skills/core/code-reviewer/SKILL.md`

```markdown
---
name: "code-reviewer"
version: "1.0.0"
description: "Automatic code review focusing on best practices, security, and maintainability"
author: "Code-Assistant-Claude"
category: "core"

triggers:
  keywords: ["review", "code review", "check code", "analyze code"]
  patterns: ["review.*code", "check.*implementation"]
  filePatterns: ["*.ts", "*.js", "*.tsx", "*.jsx", "*.py", "*.java"]
  commands: ["/sc:review"]
  events: ["file_save", "pre_commit"]

tokenCost:
  metadata: 45
  fullContent: 2000
  resources: 500

dependencies:
  skills: ["security-auditor"]
  mcps: ["serena"]

composability:
  compatibleWith: ["test-generator", "performance-optimizer"]
  conflictsWith: []

context:
  projectTypes: ["javascript", "typescript", "python", "java", "react", "nodejs"]
  minNodeVersion: "18.0.0"
  requiredTools: ["eslint", "prettier"]

priority: "high"
autoActivate: true
cacheStrategy: "aggressive"
---

# Code Reviewer Skill

Provides comprehensive code review focusing on:
- Best practices and code quality
- Security vulnerabilities
- Performance issues
- Maintainability concerns
- Consistency with project standards

## Review Process

### 1. Initial Analysis
- Read modified files
- Identify programming language and framework
- Load relevant linting rules and best practices

### 2. Multi-Dimensional Review

#### Code Quality
- **Naming**: Clear, descriptive variable/function names
- **Structure**: Logical organization, proper separation of concerns
- **Complexity**: Avoid deeply nested logic, reduce cyclomatic complexity
- **DRY**: No code duplication
- **Comments**: Meaningful comments where needed, self-documenting code preferred

#### Security
- **Input Validation**: All user input validated
- **SQL Injection**: Parameterized queries used
- **XSS Prevention**: Proper output escaping
- **Authentication**: Secure auth implementation
- **Secrets**: No hardcoded secrets

#### Performance
- **Algorithm Efficiency**: Optimal time/space complexity
- **Resource Management**: Proper cleanup (connections, file handles)
- **Caching**: Appropriate use of caching
- **Async Operations**: Non-blocking where appropriate

#### Maintainability
- **Test Coverage**: Adequate test coverage
- **Error Handling**: Comprehensive error handling
- **Documentation**: API docs, README updates
- **Dependencies**: Minimal, well-maintained dependencies

### 3. Report Generation

```
📋 Code Review Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Files Reviewed: 3
Issues Found: 5 (2 high, 2 medium, 1 low)

🔴 HIGH PRIORITY
├─ src/auth.ts:45 - SQL injection vulnerability
│  Use parameterized queries instead of string concatenation
│
└─ src/api.ts:123 - Missing input validation
   Validate user input before processing

🟡 MEDIUM PRIORITY
├─ src/utils.ts:67 - Code duplication
│  Extract common logic into shared function
│
└─ src/components/Form.tsx:89 - Missing error handling
   Add try-catch for async operations

🟢 LOW PRIORITY
└─ src/helpers.ts:34 - Complex function
   Consider breaking into smaller functions

✅ STRENGTHS
├─ Good test coverage (85%)
├─ Clear naming conventions
└─ Proper TypeScript typing

💡 RECOMMENDATIONS
1. Add JSDoc comments for public APIs
2. Consider implementing error boundaries
3. Update README with new features
```

## Integration

### With Security Auditor
Delegates security-specific checks to security-auditor skill for deeper analysis.

### With Test Generator
Identifies untested code paths and suggests test cases.

### With Performance Optimizer
Highlights performance bottlenecks for optimization.

## Examples

### React Component Review
```typescript
// Input: React component with issues
const UserProfile = ({ userId }) => {  // Missing props validation
  const [user, setUser] = useState();  // Missing type

  useEffect(() => {
    fetch(`/api/users/${userId}`)      // No error handling
      .then(r => r.json())
      .then(setUser);
  }, []);                              // Missing userId dependency

  return <div>{user.name}</div>;       // Unsafe access
}

// Review Output:
// 1. Add PropTypes or TypeScript interface for props
// 2. Type useState: useState<User | null>(null)
// 3. Add error handling for fetch
// 4. Include userId in useEffect dependencies
// 5. Add null check: {user?.name}
```

## Configuration

Can be customized via `.claude/settings.json`:

```json
{
  "skills": {
    "code-reviewer": {
      "autoActivate": true,
      "severity": ["high", "medium", "low"],
      "focus": ["security", "performance", "quality"],
      "excludePatterns": ["*.test.ts", "*.spec.js"]
    }
  }
}
```

## Resources

See `resources/` directory for:
- `eslint-rules.json` - Recommended ESLint rules
- `best-practices.md` - Language-specific best practices
- `security-patterns.md` - Common security issues and fixes
```

**Implementation Checklist for Each Skill**:
- [ ] Create SKILL.md with complete frontmatter and content
- [ ] Add 2-3 examples in `examples/` directory
- [ ] Create resources in `resources/` directory
- [ ] Write unit tests in `tests/` directory
- [ ] Validate metadata schema
- [ ] Test progressive loading
- [ ] Measure token costs

**Repeat for**:
1. code-reviewer
2. test-generator
3. git-commit-helper
4. security-auditor
5. performance-optimizer

---

#### Day 11-13: SuperClaude Mode Skills (6 modes)

Each SuperClaude mode skill adapts from existing CLAUDE.md files in user's global instructions.

**Example**: `templates/skills/superclaude/modes/brainstorming-mode/SKILL.md`

```markdown
---
name: "brainstorming-mode"
version: "1.0.0"
description: "Socratic dialogue for requirements discovery and creative problem solving"
author: "SuperClaude Framework"
category: "superclaude"

triggers:
  keywords: ["brainstorm", "explore", "discuss", "figure out", "not sure"]
  patterns: ["maybe.*could", "thinking about", "ideas? for"]
  commands: ["/sc:brainstorm"]

tokenCost:
  metadata: 40
  fullContent: 1800
  resources: 200

priority: "medium"
autoActivate: true
cacheStrategy: "normal"
---

# Brainstorming Mode

Collaborative discovery mindset for interactive requirements exploration.

## Activation Triggers
- Vague project requests
- Exploration keywords
- Uncertainty indicators
- Manual: `/sc:brainstorm [topic]`

## Behavioral Changes
- **Socratic Dialogue**: Ask probing questions to uncover hidden requirements
- **Non-Presumptive**: Avoid assumptions, let user guide discovery
- **Collaborative Exploration**: Partner in discovery
- **Brief Generation**: Synthesize insights into structured requirements

## Example Dialogue

```
User: "I want to build a web app"

Assistant (Brainstorming Mode):
🤔 Let's explore this together through some key questions:

1. **Problem Space**
   - What specific problem are you trying to solve?
   - Who are your target users?
   - What pain points do they currently experience?

2. **Core Functionality**
   - What's the #1 most important feature?
   - What would a minimal viable version look like?
   - Any must-have integrations?

3. **Technical Context**
   - What's your tech stack preference (or open to suggestions)?
   - Expected user volume?
   - Any existing systems to integrate with?

4. **Success Criteria**
   - How will you know this is successful?
   - Timeline constraints?
   - Budget/resource limitations?

Based on your answers, I'll help create a clear requirements brief.
```

## Resources

- `question-patterns.json` - Structured question templates
- `requirement-brief-template.md` - Output format
```

**Repeat for all 6 modes**:
1. brainstorming-mode
2. research-mode
3. orchestration-mode
4. task-management-mode
5. token-efficiency-mode
6. introspection-mode

---

#### Day 14: Skill Creator Meta-Skill

`templates/skills/meta/skill-creator/SKILL.md`

```markdown
---
name: "skill-creator"
version: "1.0.0"
description: "Interactive wizard for creating new custom skills"
author: "Code-Assistant-Claude"
category: "meta"

triggers:
  keywords: ["create skill", "new skill", "generate skill"]
  commands: ["/sc:create-skill"]

tokenCost:
  metadata: 35
  fullContent: 1500
  resources: 800

priority: "low"
autoActivate: false
cacheStrategy: "minimal"
---

# Skill Creator

Meta-skill for generating custom skills using interactive wizard.

## Wizard Flow

### Step 1: Basic Information
```
? Skill name (kebab-case): my-custom-skill
? Description: Brief description of what this skill does
? Category: core | domain | superclaude | meta
? Author: Your Name
```

### Step 2: Triggers
```
? Trigger keywords (comma-separated): keyword1, keyword2
? Trigger patterns (regex, comma-separated): [optional]
? File patterns (glob, comma-separated): *.ts, *.js
? Commands (slash commands): /my-command
? Events: file_save, pre_commit
```

### Step 3: Dependencies & Context
```
? Required skills: [skill1, skill2]
? Required MCPs: [serena, sequential]
? Project types: javascript, typescript, react
? Priority: high | medium | low
```

### Step 4: Content
```
? Skill instructions (multiline):
[Provides editor for writing skill content]

? Add examples? (Y/n)
? Add resources? (Y/n)
```

### Step 5: Generation
```
✅ Generating skill at: templates/skills/domain/my-custom-skill/
├─ SKILL.md
├─ examples/
├─ resources/
└─ tests/

? Run validation? (Y/n)
? Add to git? (Y/n)
```

## Generated Structure

Creates complete skill directory with:
- SKILL.md with proper frontmatter
- examples/ directory with template
- resources/ directory
- tests/ directory with test template

## Resources

- `skill-template.md` - Base template for new skills
- `validation-schema.json` - JSON schema for validation
```

---

## Testing Strategy

### Unit Tests (>80% coverage target)

**Test Files**:
1. `tests/unit/skills/skill-parser.test.ts` - Parser logic
2. `tests/unit/skills/skill-registry.test.ts` - Registry operations
3. `tests/unit/skills/skill-loader.test.ts` - Loading logic
4. `tests/unit/skills/token-tracker.test.ts` - Token tracking
5. `tests/unit/skills/cache-manager.test.ts` - Caching logic

**Example Test Suite**:

```typescript
// tests/unit/skills/skill-loader.test.ts
import { SkillLoader } from '../../../src/core/skills/skill-loader';
import { LoadingStage } from '../../../src/core/skills/types';

describe('SkillLoader', () => {
  let loader: SkillLoader;

  beforeEach(async () => {
    loader = new SkillLoader('templates/skills');
    await loader.initialize();
  });

  describe('matchSkills', () => {
    it('should match skills by keyword', async () => {
      const matches = await loader.matchSkills({
        userMessage: 'Please review my code',
        projectType: 'typescript'
      });

      expect(matches).toContain('code-reviewer');
    });

    it('should match skills by command', async () => {
      const matches = await loader.matchSkills({
        userMessage: 'Run review',
        currentCommand: '/sc:review'
      });

      expect(matches).toContain('code-reviewer');
    });

    it('should not match incompatible project types', async () => {
      const matches = await loader.matchSkills({
        userMessage: 'review code',
        projectType: 'unknown-language'
      });

      // Assuming code-reviewer requires specific project types
      expect(matches).not.toContain('code-reviewer');
    });
  });

  describe('loadSkills', () => {
    it('should load skills at metadata stage', async () => {
      const skills = await loader.loadSkills(
        ['code-reviewer'],
        LoadingStage.METADATA_ONLY
      );

      expect(skills).toHaveLength(1);
      expect(skills[0].content).toBe('');
      expect(skills[0].tokensConsumed).toBeLessThan(100);
    });

    it('should load skills at full content stage', async () => {
      const skills = await loader.loadSkills(
        ['code-reviewer'],
        LoadingStage.FULL_CONTENT
      );

      expect(skills).toHaveLength(1);
      expect(skills[0].content).not.toBe('');
      expect(skills[0].tokensConsumed).toBeGreaterThan(1000);
    });

    it('should cache loaded skills', async () => {
      const skills1 = await loader.loadSkills(
        ['code-reviewer'],
        LoadingStage.FULL_CONTENT
      );

      const skills2 = await loader.loadSkills(
        ['code-reviewer'],
        LoadingStage.FULL_CONTENT
      );

      // Should return same instance (cached)
      expect(skills1[0]).toBe(skills2[0]);
    });
  });

  describe('token tracking', () => {
    it('should track total tokens consumed', async () => {
      await loader.loadSkills(
        ['code-reviewer', 'test-generator'],
        LoadingStage.FULL_CONTENT
      );

      const total = loader.getTotalTokensConsumed();
      expect(total).toBeGreaterThan(2000);
      expect(total).toBeLessThan(10000);
    });
  });
});
```

### Integration Tests

**Test Files**:
1. `tests/integration/skills/progressive-loading.test.ts`
2. `tests/integration/skills/skill-activation.test.ts`
3. `tests/integration/skills/core-skills.test.ts`

**Example Integration Test**:

```typescript
// tests/integration/skills/progressive-loading.test.ts
describe('Progressive Loading Integration', () => {
  it('should demonstrate token savings', async () => {
    const loader = new SkillLoader('templates/skills');
    await loader.initialize();

    // Baseline: Load all skills at full content
    const allSkills = loader.registry.getAll();
    const baselineTokens = allSkills.reduce(
      (sum, entry) => sum + entry.metadata.tokenCost.fullContent,
      0
    );

    // Progressive: Load metadata + 2 matched skills
    const matches = await loader.matchSkills({
      userMessage: 'Review my code and generate tests'
    });

    const loadedSkills = await loader.loadSkills(
      matches,
      LoadingStage.FULL_CONTENT
    );

    const progressiveTokens = loader.getTotalTokensConsumed();

    // Calculate savings
    const savings = ((baselineTokens - progressiveTokens) / baselineTokens) * 100;

    console.log(`Baseline: ${baselineTokens} tokens`);
    console.log(`Progressive: ${progressiveTokens} tokens`);
    console.log(`Savings: ${savings.toFixed(1)}%`);

    // Verify >85% savings
    expect(savings).toBeGreaterThan(85);
  });
});
```

---

## Validation Checklist

### Phase 2 Completion Criteria

#### Infrastructure ✅
- [ ] All TypeScript interfaces defined in `types.ts`
- [ ] SkillParser parses metadata and content correctly
- [ ] SkillRegistry indexes all skills
- [ ] SkillLoader implements progressive loading
- [ ] TokenTracker tracks consumption accurately
- [ ] CacheManager caches loaded skills

#### Skills Implementation ✅
- [ ] 5 core skills complete with examples and resources
- [ ] 6 SuperClaude mode skills complete
- [ ] 1 skill-creator meta-skill functional
- [ ] All skills have valid YAML frontmatter
- [ ] All skills tested individually

#### Testing ✅
- [ ] Unit test coverage >80%
- [ ] Integration tests passing
- [ ] Progressive loading verified (>85% savings)
- [ ] Skill activation accuracy >90%
- [ ] No false positive triggers

#### Documentation ✅
- [ ] All skills documented with examples
- [ ] API documentation for skill system
- [ ] Token costs measured and documented
- [ ] Usage examples created

### Validation Commands

```bash
# Run all tests
npm test

# Check coverage
npm run test:coverage

# Validate all skill files
npm run validate:skills

# Measure token savings
npm run benchmark:skills

# Build check
npm run build

# Type check
npm run typecheck

# Lint check
npm run lint
```

### Expected Metrics

**Token Efficiency**:
- Baseline (always-loaded): ~40,000 tokens
- Progressive (metadata + 2 active): ~5,500 tokens
- **Savings**: >85% ✅

**Activation Accuracy**:
- True positives: >90%
- False positives: <5%
- False negatives: <10%

**Performance**:
- Skill indexing: <1 second
- Metadata loading: <50ms per skill
- Full content loading: <100ms per skill
- Total initialization: <2 seconds

---

## Next Steps After Phase 2

Once Phase 2 is complete and validated:

1. **Commit Progress**:
   ```bash
   git add .
   git commit -m "feat(phase-2): implement complete skills system with progressive loading

   - Progressive loading infrastructure (95% token savings)
   - 5 core skills (code-reviewer, test-generator, git-commit-helper, security-auditor, performance-optimizer)
   - 6 SuperClaude mode skills
   - Skill creator meta-skill
   - Token tracking and caching
   - >80% test coverage

   🤖 Generated with Claude Code

   Co-Authored-By: Claude <noreply@anthropic.com>"
   ```

2. **Begin Phase 3**: Command System implementation

3. **Parallel**: Start Phase 4 (MCP Code Execution) if resources available

---

**End of Phase 2 Implementation Guide**

**Generated**: 2025-11-23
**Next Guide**: Phase 3 - Command System
**Estimated Files**: ~60 files
**Estimated Duration**: 2 weeks
