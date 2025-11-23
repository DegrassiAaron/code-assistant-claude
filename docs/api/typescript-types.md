# TypeScript Type Definitions

Complete TypeScript type definitions for Code-Assistant-Claude.

## Core Types

### Settings

```typescript
export interface Settings {
  version: string;
  projectType: ProjectType;
  techStack: TechStack[];
  verbosityMode: VerbosityMode;
  installationScope: InstallationScope;
  tokenOptimization: TokenOptimization;
  skills: SkillsConfig;
  commands: CommandsConfig;
  mcpServers: MCPServersConfig;
  security: SecurityConfig;
  git: GitConfig;
  performance: PerformanceConfig;
}

export type ProjectType = 
  | 'react'
  | 'nodejs-api'
  | 'python-django'
  | 'vue'
  | 'angular'
  | 'unknown';

export type VerbosityMode = 'verbose' | 'balanced' | 'compressed';
export type InstallationScope = 'local' | 'global' | 'both';
```

### Skills

```typescript
export interface Skill {
  name: string;
  description: string;
  category: SkillCategory;
  version: string;
  expertise: string[];
  activation: ActivationCriteria;
  capabilities: string[];
  integrations: SkillIntegrations;
  tokenBudget: number;
  progressiveLoading: boolean;
}

export type SkillCategory = 'technical' | 'business' | 'utility';

export interface ActivationCriteria {
  keywords: string[];
  complexity: ComplexityLevel[];
  triggers: TaskType[];
}

export type ComplexityLevel = 'simple' | 'moderate' | 'complex';
export type TaskType = 
  | 'implementation'
  | 'review'
  | 'testing'
  | 'debugging'
  | 'research'
  | 'analysis';
```

### Commands

```typescript
export interface Command {
  name: string;
  description: string;
  category: CommandCategory;
  parameters: Parameter[];
  flags: Flag[];
  skills: string[];
  mcps: string[];
  agents: string[];
  tokenEstimate: number;
}

export type CommandCategory = 
  | 'development'
  | 'deployment'
  | 'analysis'
  | 'utility';

export interface Parameter {
  name: string;
  type: ParameterType;
  required: boolean;
  description: string;
  default?: any;
  pattern?: string;
}

export type ParameterType = 'string' | 'number' | 'boolean' | 'array';

export interface Flag {
  name: string;
  type: ParameterType;
  description: string;
  options?: string[];
  default?: any;
}
```

### MCP

```typescript
export interface MCPServer {
  name: string;
  command: string;
  args: string[];
  env?: Record<string, string>;
  timeout?: number;
  retries?: number;
  disabled?: boolean;
}

export interface MCPTool {
  name: string;
  description: string;
  parameters: Record<string, ToolParameter>;
  handler: ToolHandler;
}

export type ToolHandler = (params: any) => Promise<ToolResult>;

export interface ToolResult {
  result: any;
  tokens?: number;
  cached?: boolean;
}
```

### Security

```typescript
export interface SecurityConfig {
  sandboxing: SandboxingLevel;
  piiTokenization: boolean;
  auditLogging: boolean;
  encryptionAtRest: boolean;
  allowedCommands?: string[];
  blockedPatterns?: RegExp[];
  fileSystem?: FileSystemConfig;
}

export type SandboxingLevel = 'docker' | 'vm' | 'process';

export interface FileSystemConfig {
  allowedPaths: string[];
  blockedPaths: string[];
  readOnly: string[];
  maxFileSize?: number;
}
```

## Utility Types

```typescript
export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> =
  Pick<T, Exclude<keyof T, Keys>> 
  & {
      [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
    }[Keys];
```

## Installation

```bash
npm install --save-dev code-assistant-claude
```

## Usage

```typescript
import type { Settings, Skill, Command } from 'code-assistant-claude';

const settings: Settings = {
  version: '1.0.0',
  projectType: 'react',
  // ...
};
```
