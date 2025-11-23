/**
 * Type definitions for the Skills System
 *
 * This module defines all interfaces and types for the progressive skill loading
 * system that enables 95% token reduction through metadata-based activation.
 */

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

/**
 * Cache statistics
 */
export interface CacheStats {
  size: number;
  max: number;
  hits: number;
  misses: number;
}

/**
 * Skill loader configuration
 */
export interface SkillLoaderConfig {
  skillsDir: string;
  cacheSize?: number;
  cacheTTL?: number;
}

/**
 * Skill validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}
