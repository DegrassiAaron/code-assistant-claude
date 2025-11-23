# Installation Guide

## Prerequisites

Before installing Code-Assistant-Claude, ensure you have:

- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher
- **Git** (for Git workflow features)
- **Claude Code CLI** installed and configured

## Quick Install

```bash
# Global installation
npm install -g code-assistant-claude

# Verify installation
code-assistant-claude --version

# Initialize in your project
cd your-project
code-assistant-claude init
```

## Interactive Setup

The `init` command launches an interactive wizard that will:

### 1. Project Analysis
The system automatically detects:
- **Tech Stack**: React, Node.js, Python, etc.
- **Git Workflow**: GitFlow, GitHub Flow, or Trunk-based Development
- **Project Structure**: Directories, configuration files
- **Dependencies**: package.json, requirements.txt, etc.

### 2. Installation Scope
Choose where to install configuration:
- **Local** (.claude/ in project root)
- **Global** (~/.config/claude/)
- **Both** (Recommended for most projects)

### 3. Verbosity Mode
Select your preference:
- **Verbose** (0%): Full detailed prompts (~200K tokens)
- **Balanced** (50%): Moderate compression (~100K tokens)
- **Compressed** (90%): Maximum optimization (~20K tokens) ✅ **Recommended**

### 4. Skills Selection
- **Recommended Skills**: Auto-selected based on project type
- **Custom Skills**: Add additional skills as needed
- **Progressive Loading**: Skills load only when needed

**Example for React Project**:
- ✅ code-reviewer
- ✅ frontend-design
- ✅ test-generator
- ✅ security-auditor

### 5. MCP Configuration
Essential MCPs are configured automatically:
- **magic**: Code execution (98.7% token reduction)
- **serena**: Token compression
- **sequential**: Efficient workflows
- **playwright** (for React/frontend)
- **serpapi** (for research tasks)

### 6. Validation
The wizard validates your configuration:
- ✅ All dependencies installed
- ✅ Skills accessible
- ✅ MCPs configured correctly
- ✅ Security settings validated

## Manual Installation

If you prefer manual setup:

### 1. Create Configuration Directory
```bash
mkdir -p .claude/skills
mkdir -p .claude/commands
```

### 2. Create CLAUDE.md
```bash
cat > .claude/CLAUDE.md << 'EOF'
# Code Assistant Claude Configuration

**Project**: Your Project Name
**Tech Stack**: [Your Stack]
**Generated**: $(date)

## Skills
Progressive loading enabled. Skills activate automatically based on task type.

## Commands
Custom slash commands available via `/sc:` prefix.

## Token Optimization
- MCP Code Execution: 98.7% reduction
- Progressive Skills: 95% reduction
- Symbol Compression: 30-50% reduction
EOF
```

### 3. Create settings.json
```bash
cat > .claude/settings.json << 'EOF'
{
  "verbosityMode": "compressed",
  "installationScope": "local",
  "tokenOptimization": {
    "mcpCodeExecution": true,
    "progressiveSkills": true,
    "symbolCompression": true
  },
  "security": {
    "sandboxing": "process",
    "piiTokenization": true,
    "auditLogging": true
  }
}
EOF
```

### 4. Install Skills
```bash
# Download recommended skills
code-assistant-claude install-skill code-reviewer
code-assistant-claude install-skill frontend-design
code-assistant-claude install-skill test-generator
```

### 5. Configure MCPs
```bash
cat > .claude/.mcp.json << 'EOF'
{
  "mcpServers": {
    "magic": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-magic"]
    },
    "serena": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-serena"]
    }
  }
}
EOF
```

## Verification

### Check Configuration
```bash
# View generated configuration
cat .claude/CLAUDE.md
cat .claude/settings.json

# List installed skills
ls -la .claude/skills/

# Verify MCP configuration
cat .claude/.mcp.json
```

### Test Installation
Open Claude Code CLI in your project directory:

```
You: /sc:optimize-tokens

Claude: 📊 Token Budget Status
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        Total Budget: 200,000 tokens
        Current Usage: 5,234 tokens (2.6%)
        Status: Healthy 🟢

        Optimizations Active:
        ✅ MCP Code Execution (98.7%)
        ✅ Progressive Skills (95%)
        ✅ Symbol Compression (40%)
```

## Common Installation Issues

### Issue: "Command not found"
**Solution**: Ensure npm global bin is in your PATH:
```bash
npm config get prefix
export PATH="$(npm config get prefix)/bin:$PATH"
```

### Issue: "Permission denied"
**Solution**: Install without sudo using npm prefix:
```bash
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
npm install -g code-assistant-claude
```

### Issue: "MCP servers not found"
**Solution**: MCPs are installed on-demand. First usage will install automatically:
```bash
# Manually install if needed
npx -y @modelcontextprotocol/server-magic
```

### Issue: "Skills not loading"
**Solution**: Verify skills directory structure:
```bash
# Should show skill directories with SKILL.md files
ls -la .claude/skills/*/SKILL.md
```

## Next Steps

After successful installation:

1. 📚 Read [Quick Start Tutorial](02-quick-start.md)
2. ⚙️ Review [Configuration Guide](03-configuration.md)
3. 🚀 Explore [Skills Guide](04-skills-guide.md)
4. 💡 Learn [Token Optimization](08-token-optimization.md)

## Updating

```bash
# Update to latest version
npm update -g code-assistant-claude

# Re-run init to update configuration
code-assistant-claude init --update
```

## Uninstallation

```bash
# Remove global package
npm uninstall -g code-assistant-claude

# Remove project configuration (optional)
rm -rf .claude/
```

---

**Need Help?** See [Troubleshooting Guide](10-troubleshooting.md) or visit [GitHub Issues](https://github.com/DegrassiAaron/code-assistant-claude/issues)
