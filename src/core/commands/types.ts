/**
 * Phase 3: Command System - Core Type Definitions
 * Provides TypeScript interfaces for the intelligent command system
 */

export type ParameterValue = string | number | boolean | string[];
export type ProjectContext = Record<string, unknown>;

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
  default?: ParameterValue;
  options?: string[];        // For enum-like parameters
}

export interface Command {
  metadata: CommandMetadata;
  content: string;
  loaded: boolean;
}

export interface CommandExecutionContext {
  command: string;
  parameters: Record<string, ParameterValue>;
  userMessage: string;
  projectContext?: ProjectContext;
}

export interface CommandExecutionResult {
  success: boolean;
  output?: string;
  activatedSkills: string[];
  activatedMCPs: string[];
  activatedAgents: string[];
  tokensUsed: number;
  executionTime: number;
  error?: string;
}

export interface ParsedCommand {
  commandName: string;
  rawInput: string;
  parameters: Record<string, ParameterValue>;
  flags: Record<string, boolean | string | ParameterValue>;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface CommandRegistry {
  [commandName: string]: Command;
}

export interface CommandLoadResult {
  success: boolean;
  command?: Command;
  error?: string;
}

export interface CommandCache {
  command: Command;
  mtime: number;
}
