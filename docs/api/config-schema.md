# Configuration Schema

Complete JSON schema reference for Code-Assistant-Claude configuration.

## settings.json

### Root Schema

```typescript
interface Settings {
  version: string;
  projectType: string;
  techStack: string[];
  verbosityMode: 'verbose' | 'balanced' | 'compressed';
  installationScope: 'local' | 'global' | 'both';
  tokenOptimization: TokenOptimization;
  skills: SkillsConfig;
  commands: CommandsConfig;
  mcpServers: MCPServersConfig;
  security: SecurityConfig;
  git: GitConfig;
  performance: PerformanceConfig;
  logging?: LoggingConfig;
}
```

### TokenOptimization

```typescript
interface TokenOptimization {
  mcpCodeExecution: boolean;
  progressiveSkills: boolean;
  symbolCompression: boolean;
  compressionLevel: number; // 0-100
  budget?: {
    total: number;
    reserved: number;    // Percentage (0-1)
    system: number;
    dynamic: number;
    working: number;
  };
}
```

### SkillsConfig

```typescript
interface SkillsConfig {
  autoActivation: boolean;
  progressiveLoading: boolean;
  maxConcurrent: number;
  tokenBudgetPerSkill: number;
  recommended: string[];
  custom: string[];
  caching?: {
    enabled: boolean;
    ttl: number;
  };
}
```

### SecurityConfig

```typescript
interface SecurityConfig {
  sandboxing: 'docker' | 'vm' | 'process';
  piiTokenization: boolean;
  auditLogging: boolean;
  encryptionAtRest: boolean;
  allowedCommands?: string[];
  blockedPatterns?: string[];
  fileSystem?: {
    allowedPaths: string[];
    blockedPaths: string[];
    readOnly: string[];
  };
}
```

## .mcp.json

```typescript
interface MCPConfig {
  mcpServers: {
    [serverName: string]: {
      command: string;
      args: string[];
      env?: Record<string, string>;
      timeout?: number;
      retries?: number;
      disabled?: boolean;
    };
  };
}
```

## Example Configuration

```json
{
  "version": "1.0.0",
  "projectType": "react",
  "techStack": ["react", "typescript", "vite"],
  "verbosityMode": "compressed",
  "tokenOptimization": {
    "mcpCodeExecution": true,
    "progressiveSkills": true,
    "symbolCompression": true,
    "compressionLevel": 90
  },
  "skills": {
    "autoActivation": true,
    "progressiveLoading": true,
    "maxConcurrent": 3,
    "tokenBudgetPerSkill": 5000,
    "recommended": ["code-reviewer", "frontend-design"]
  },
  "security": {
    "sandboxing": "process",
    "piiTokenization": true,
    "auditLogging": true
  }
}
```

## Validation

Schema validation using JSON Schema:

```bash
code-assistant-claude validate
```
