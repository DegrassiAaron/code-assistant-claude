# Configuration Guide

Complete guide to configuring Code-Assistant-Claude for your project.

## Configuration Files

Code-Assistant-Claude uses three main configuration files:

```
.claude/
├── CLAUDE.md          # Main context document (read by Claude)
├── settings.json      # System settings
└── .mcp.json         # MCP server configuration
```

## CLAUDE.md

This file provides context to Claude about your project and configuration.

### Structure

```markdown
# Code Assistant Claude Configuration

**Project**: [Your Project Name]
**Tech Stack**: [Technologies]
**Generated**: [Date]
**Version**: 1.0.0

## Project Overview
[Brief description of your project]

## Tech Stack Detected
- Framework: [e.g., React 18.2.0]
- Language: [e.g., TypeScript 5.0]
- Build Tool: [e.g., Vite 4.3]
- Testing: [e.g., Vitest, React Testing Library]

## Skills Configuration
Progressive loading enabled. Skills activate automatically based on task type.

Available Skills:
- code-reviewer: Code quality and best practices
- frontend-design: UI/UX component design
- test-generator: Test generation and validation
- security-auditor: Security analysis
- business-panel: Strategic business analysis

## Commands Configuration
Custom slash commands available via `/sc:` prefix.

Available Commands:
- /sc:implement: Feature implementation
- /sc:scaffold: Code scaffolding
- /sc:review: Code review
- /sc:test: Test generation
- /sc:security-audit: Security analysis

## MCP Integration
Code execution via MCP servers (98.7% token reduction).

Active MCPs:
- magic: Code generation and execution
- serena: Token compression
- sequential: Workflow automation

## Token Optimization
- MCP Code Execution: ✅ Enabled (98.7% reduction)
- Progressive Skills: ✅ Enabled (95% reduction)
- Symbol Compression: ✅ Enabled (30-50% reduction)

## Git Workflow
Detected: [GitFlow / GitHub Flow / Trunk-based]

## Security Configuration
- Sandboxing: Process isolation
- PII Tokenization: Enabled
- Audit Logging: Enabled
```

### Customization

Edit `.claude/CLAUDE.md` to:
- Update project description
- Add project-specific conventions
- Document custom workflows
- Add team guidelines

## settings.json

System configuration for Code-Assistant-Claude.

### Default Configuration

```json
{
  "version": "1.0.0",
  "projectType": "react",
  "techStack": ["react", "typescript", "vite"],

  "verbosityMode": "compressed",
  "installationScope": "local",

  "tokenOptimization": {
    "mcpCodeExecution": true,
    "progressiveSkills": true,
    "symbolCompression": true,
    "compressionLevel": 90
  },

  "skills": {
    "autoActivation": true,
    "progressiveLoading": true,
    "recommended": [
      "code-reviewer",
      "frontend-design",
      "test-generator",
      "security-auditor"
    ],
    "custom": []
  },

  "commands": {
    "prefix": "/sc:",
    "autoComplete": true,
    "enabled": [
      "implement",
      "scaffold",
      "review",
      "test",
      "security-audit",
      "business-panel",
      "optimize-tokens"
    ]
  },

  "mcpServers": {
    "enabled": true,
    "autoInstall": true,
    "servers": ["magic", "serena", "sequential"]
  },

  "security": {
    "sandboxing": "process",
    "piiTokenization": true,
    "auditLogging": true,
    "encryptionAtRest": false
  },

  "git": {
    "workflow": "github-flow",
    "autoDetect": true,
    "branchPrefix": "feature/",
    "commitMessageTemplate": "conventional"
  },

  "performance": {
    "cacheEnabled": true,
    "cacheTTL": 3600,
    "maxConcurrentOperations": 5
  }
}
```

### Configuration Options

#### Verbosity Mode

Controls token usage vs detail level:

```json
{
  "verbosityMode": "compressed"  // "verbose" | "balanced" | "compressed"
}
```

| Mode | Token Usage | Detail Level | Use Case |
|------|------------|--------------|----------|
| `verbose` | 100% (~200K) | Maximum | Learning, debugging |
| `balanced` | 50% (~100K) | Moderate | General development |
| `compressed` | 10% (~20K) | Essential | Production (recommended) |

#### Token Optimization

```json
{
  "tokenOptimization": {
    "mcpCodeExecution": true,      // 98.7% reduction
    "progressiveSkills": true,      // 95% reduction
    "symbolCompression": true,      // 30-50% reduction
    "compressionLevel": 90          // 0-100 (higher = more compression)
  }
}
```

#### Skills Configuration

```json
{
  "skills": {
    "autoActivation": true,         // Auto-activate based on task
    "progressiveLoading": true,     // Load only when needed
    "recommended": [                // Auto-selected skills
      "code-reviewer",
      "frontend-design"
    ],
    "custom": [                     // User-added skills
      "my-custom-skill"
    ]
  }
}
```

#### Security Settings

```json
{
  "security": {
    "sandboxing": "process",        // "docker" | "vm" | "process"
    "piiTokenization": true,        // Tokenize sensitive data
    "auditLogging": true,           // Log all operations
    "encryptionAtRest": false,      // Encrypt stored data
    "allowedCommands": ["git", "npm", "node"],
    "blockedPatterns": ["rm -rf", "DROP TABLE"]
  }
}
```

**Sandboxing Levels**:
- `docker`: Maximum isolation (requires Docker)
- `vm`: High isolation (requires VM)
- `process`: Standard isolation (default)

#### Git Workflow

```json
{
  "git": {
    "workflow": "github-flow",      // "gitflow" | "github-flow" | "trunk-based"
    "autoDetect": true,             // Auto-detect from repository
    "branchPrefix": "feature/",
    "commitMessageTemplate": "conventional"  // "conventional" | "custom"
  }
}
```

**Workflow Detection**:
- **GitFlow**: Detects develop, main, feature/, release/, hotfix/
- **GitHub Flow**: Detects main and feature branches
- **Trunk-based**: Detects single main branch with short-lived branches

## .mcp.json

Configuration for MCP (Model Context Protocol) servers.

### Structure

```json
{
  "mcpServers": {
    "magic": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-magic"],
      "env": {},
      "disabled": false
    },
    "serena": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-serena"],
      "env": {},
      "disabled": false
    },
    "sequential": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential"],
      "env": {},
      "disabled": false
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-playwright"],
      "env": {},
      "disabled": false
    }
  }
}
```

### Adding Custom MCP Servers

```json
{
  "mcpServers": {
    "my-custom-server": {
      "command": "node",
      "args": ["./path/to/server.js"],
      "env": {
        "API_KEY": "your-api-key",
        "CONFIG_PATH": "./config.json"
      },
      "disabled": false
    }
  }
}
```

### Tech-Specific MCPs

#### React Projects
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-playwright"]
    }
  }
}
```

#### Node.js APIs
```json
{
  "mcpServers": {
    "serpapi": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-serpapi"],
      "env": {
        "SERPAPI_KEY": "${SERPAPI_API_KEY}"
      }
    }
  }
}
```

#### Python Projects
```json
{
  "mcpServers": {
    "python-tools": {
      "command": "python",
      "args": ["-m", "mcp_server_python"],
      "env": {
        "PYTHONPATH": "./src"
      }
    }
  }
}
```

## Environment Variables

Create `.env` file in your project root:

```bash
# MCP Server API Keys
SERPAPI_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here

# Custom Configuration
CUSTOM_SKILL_PATH=/path/to/skills
CUSTOM_COMMAND_PATH=/path/to/commands

# Security
ENCRYPTION_KEY=your_encryption_key
AUDIT_LOG_PATH=/var/log/claude-assistant
```

**Important**: Add `.env` to `.gitignore`!

## Project-Specific Configuration

### React + TypeScript

```json
{
  "projectType": "react",
  "techStack": ["react", "typescript", "vite"],
  "skills": {
    "recommended": [
      "code-reviewer",
      "frontend-design",
      "test-generator",
      "performance-tuner"
    ]
  },
  "mcpServers": {
    "servers": ["magic", "serena", "playwright", "sequential"]
  }
}
```

### Node.js + Express API

```json
{
  "projectType": "nodejs-api",
  "techStack": ["nodejs", "express", "typescript"],
  "skills": {
    "recommended": [
      "code-reviewer",
      "test-engineer",
      "security-auditor",
      "architect"
    ]
  },
  "mcpServers": {
    "servers": ["magic", "serena", "sequential", "serpapi"]
  }
}
```

### Python + Django

```json
{
  "projectType": "python-django",
  "techStack": ["python", "django", "postgresql"],
  "skills": {
    "recommended": [
      "code-reviewer",
      "test-engineer",
      "security-auditor"
    ]
  },
  "mcpServers": {
    "servers": ["magic", "serena", "python-tools"]
  }
}
```

## Advanced Configuration

### Custom Token Budget

```json
{
  "tokenOptimization": {
    "budget": {
      "total": 200000,
      "reserved": 0.05,      // 5% emergency buffer
      "system": 0.05,        // 5% system prompts
      "dynamic": 0.15,       // 15% skills + MCPs
      "working": 0.75        // 75% conversation
    }
  }
}
```

### Cache Configuration

```json
{
  "performance": {
    "cacheEnabled": true,
    "cacheTTL": 3600,               // 1 hour
    "cacheStrategy": "lru",          // "lru" | "lfu" | "fifo"
    "maxCacheSize": 104857600,       // 100MB
    "cacheCompression": true
  }
}
```

### Logging Configuration

```json
{
  "logging": {
    "level": "info",                 // "debug" | "info" | "warn" | "error"
    "file": ".claude/logs/app.log",
    "maxSize": "10m",
    "maxFiles": 5,
    "format": "json"
  }
}
```

## Configuration Validation

### Manual Validation

```bash
# Validate configuration
code-assistant-claude validate

# Output:
✅ CLAUDE.md: Valid
✅ settings.json: Valid
✅ .mcp.json: Valid
⚠️ Warning: Skill 'custom-skill' not found
```

### Automatic Validation

Configuration is validated automatically:
- On initialization (`init`)
- On startup
- When settings change

### Validation Rules

1. **CLAUDE.md**: Must exist and be readable
2. **settings.json**: Must be valid JSON with required fields
3. **.mcp.json**: Must be valid JSON, commands must be executable
4. **Skills**: Referenced skills must exist in `.claude/skills/`
5. **Commands**: Referenced commands must exist in `.claude/commands/`

## Configuration Inheritance

### Local → Global → Default

Configuration resolves in this order:

1. **Local** (`.claude/settings.json`)
2. **Global** (`~/.config/claude/settings.json`)
3. **Default** (built-in defaults)

```bash
# View effective configuration
code-assistant-claude config --show

# View configuration sources
code-assistant-claude config --sources
```

## Updating Configuration

### Interactive Update

```bash
# Re-run initialization wizard
code-assistant-claude init --update

# Update specific section
code-assistant-claude config --update skills
```

### Manual Update

Edit `.claude/settings.json` directly:

```bash
# Edit with your preferred editor
nano .claude/settings.json

# Validate after changes
code-assistant-claude validate
```

### Reset to Defaults

```bash
# Reset all configuration
code-assistant-claude init --reset

# Reset specific section
code-assistant-claude config --reset skills
```

## Best Practices

### 1. Start with Defaults
Use the initialization wizard and customize gradually.

### 2. Use Compressed Mode
Unless debugging, use `"verbosityMode": "compressed"` for 90% token savings.

### 3. Enable All Optimizations
```json
{
  "tokenOptimization": {
    "mcpCodeExecution": true,
    "progressiveSkills": true,
    "symbolCompression": true
  }
}
```

### 4. Secure Sensitive Data
- Use environment variables for API keys
- Enable PII tokenization
- Never commit `.env` files

### 5. Version Control
Commit these files:
- ✅ `.claude/CLAUDE.md`
- ✅ `.claude/settings.json`
- ✅ `.claude/.mcp.json`

Ignore these files:
- ❌ `.claude/.env`
- ❌ `.claude/logs/`
- ❌ `.claude/cache/`

## Troubleshooting Configuration

### Issue: Skills Not Loading

**Check**:
```bash
ls -la .claude/skills/*/SKILL.md
```

**Fix**:
```bash
code-assistant-claude install-skill <skill-name>
```

### Issue: MCP Servers Not Found

**Check**:
```bash
which npx
npx -y @modelcontextprotocol/server-magic --version
```

**Fix**:
```bash
npm install -g npx
```

### Issue: Token Budget Exceeded

**Solution**: Adjust budget allocation in settings.json:
```json
{
  "tokenOptimization": {
    "compressionLevel": 95  // Increase compression
  }
}
```

## Next Steps

- 📚 [Skills Guide](04-skills-guide.md) - Configure skills
- ⚡ [Commands Guide](05-commands-guide.md) - Set up commands
- 🔌 [MCP Integration](06-mcp-integration.md) - Configure MCPs
- 🛡️ [Security Best Practices](09-security-best-practices.md)

---

**Need Help?** See [Troubleshooting Guide](10-troubleshooting.md)
