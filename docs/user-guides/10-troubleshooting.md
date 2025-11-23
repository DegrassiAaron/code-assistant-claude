# Troubleshooting Guide

Complete troubleshooting guide for Code-Assistant-Claude.

## Quick Diagnostics

Run automatic diagnostics:

```bash
code-assistant-claude diagnose
```

Output:
```
🔍 Running Diagnostics...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Node.js: v18.16.0
✅ npm: v9.5.1
✅ Claude Code CLI: Detected
✅ Git: v2.40.1
✅ Configuration: Valid
⚠️  MCP Server 'magic': Not responding
❌ Skill 'custom-skill': Not found

Issues Found: 2
Run with --verbose for details
```

## Common Issues

### Installation Issues

#### Issue: "Command not found: code-assistant-claude"

**Cause**: npm global bin not in PATH

**Solution**:
```bash
# Check npm global path
npm config get prefix

# Add to PATH (add to ~/.bashrc or ~/.zshrc)
export PATH="$(npm config get prefix)/bin:$PATH"

# Reload shell
source ~/.bashrc

# Verify
code-assistant-claude --version
```

#### Issue: "Permission denied" during installation

**Cause**: Attempting to install with wrong permissions

**Solution**:
```bash
# DON'T use sudo!

# Instead, configure npm to use user directory
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH

# Install without sudo
npm install -g code-assistant-claude
```

#### Issue: "EACCES: permission denied, mkdir"

**Cause**: npm cache permissions

**Solution**:
```bash
# Fix npm cache permissions
sudo chown -R $(whoami) ~/.npm
npm cache clean --force

# Retry installation
npm install -g code-assistant-claude
```

### Configuration Issues

#### Issue: "Configuration file not found"

**Cause**: Not initialized in project

**Solution**:
```bash
# Initialize in project directory
cd /path/to/your/project
code-assistant-claude init
```

#### Issue: "Invalid JSON in settings.json"

**Cause**: Syntax error in configuration

**Solution**:
```bash
# Validate JSON
cat .claude/settings.json | jq .

# If validation fails, check for:
# - Missing commas
# - Extra commas (after last item)
# - Unescaped quotes
# - Missing braces

# Reset to defaults if needed
code-assistant-claude init --reset
```

#### Issue: "Skill not found"

**Cause**: Skill not installed or misconfigured

**Diagnostics**:
```bash
# List installed skills
ls .claude/skills/

# Check skill structure
ls .claude/skills/code-reviewer/SKILL.md
```

**Solution**:
```bash
# Install missing skill
code-assistant-claude install-skill code-reviewer

# Verify installation
code-assistant-claude validate
```

### MCP Issues

#### Issue: "MCP server not found"

**Cause**: MCP server not installed or not in PATH

**Diagnostics**:
```bash
# Check if npx is available
which npx

# Test MCP server manually
npx -y @modelcontextprotocol/server-magic
```

**Solution**:
```bash
# Install npx if missing
npm install -g npx

# Verify MCP server can be installed
npx -y @modelcontextprotocol/server-magic --version

# Check .mcp.json configuration
cat .claude/.mcp.json
```

#### Issue: "MCP timeout"

**Cause**: MCP server taking too long to respond

**Solution**:
```json
// Increase timeout in .mcp.json
{
  "mcpServers": {
    "magic": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-magic"],
      "timeout": 60000  // Increase to 60 seconds
    }
  }
}
```

#### Issue: "MCP network error"

**Cause**: Network connectivity issues

**Diagnostics**:
```bash
# Check internet connectivity
curl -I https://registry.npmjs.org

# Check proxy settings
npm config get proxy
npm config get https-proxy
```

**Solution**:
```bash
# If behind corporate proxy
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080

# If using corporate CA certificate
npm config set cafile /path/to/ca-certificate.crt
```

### Skills Issues

#### Issue: "Skill not auto-activating"

**Cause**: Auto-activation disabled or task not recognized

**Diagnostics**:
```bash
# Check settings
cat .claude/settings.json | jq '.skills.autoActivation'
```

**Solution**:
```json
// Enable auto-activation in settings.json
{
  "skills": {
    "autoActivation": true,
    "progressiveLoading": true
  }
}
```

**Alternative**: Manually activate skill:
```
You: /skill:code-reviewer review this code
```

#### Issue: "Skill token budget exceeded"

**Cause**: Skill using too many tokens

**Solution**:
```json
// Reduce skill token budget in settings.json
{
  "skills": {
    "tokenBudgetPerSkill": 3000  // Reduce from 5000
  }
}
```

#### Issue: "Multiple skills conflicting"

**Cause**: Too many skills active simultaneously

**Solution**:
```json
// Limit concurrent skills
{
  "skills": {
    "maxConcurrent": 2  // Reduce from 3
  }
}
```

### Token Usage Issues

#### Issue: "Token budget exceeded"

**Cause**: High token consumption

**Diagnostics**:
```
You: /sc:optimize-tokens --detailed
```

**Common Causes**:
1. Verbose mode enabled
2. Progressive skills disabled
3. Multiple skills loaded
4. Large skill budgets

**Solution**:
```json
{
  "verbosityMode": "compressed",
  "tokenOptimization": {
    "mcpCodeExecution": true,
    "progressiveSkills": true,
    "symbolCompression": true,
    "compressionLevel": 90
  },
  "skills": {
    "maxConcurrent": 2,
    "tokenBudgetPerSkill": 3000
  }
}
```

#### Issue: "Unexpected high token usage"

**Diagnostics**:
```
You: /sc:optimize-tokens --by-task
```

**Analysis**: Review token breakdown to identify issues

**Solutions**:
- Batch related operations
- Use slash commands instead of natural language
- Enable MCP code execution
- Increase compression level

### Performance Issues

#### Issue: "Slow response times"

**Cause**: Various performance bottlenecks

**Diagnostics**:
```bash
# Check system resources
top

# Check disk space
df -h

# Check cache size
du -sh .claude/cache/
```

**Solutions**:

1. **Clear cache**:
```bash
rm -rf .claude/cache/*
```

2. **Reduce concurrent operations**:
```json
{
  "performance": {
    "maxConcurrentOperations": 3  // Reduce from 5
  }
}
```

3. **Disable caching if causing issues**:
```json
{
  "performance": {
    "cacheEnabled": false
  }
}
```

#### Issue: "High memory usage"

**Cause**: Large cache or too many concurrent operations

**Solution**:
```json
{
  "performance": {
    "cache": {
      "maxSize": "50M",  // Reduce from 100M
      "ttl": 1800        // Reduce from 3600
    },
    "maxConcurrentOperations": 2
  }
}
```

### Security Issues

#### Issue: "Sandbox violation errors"

**Cause**: Operation blocked by sandbox

**Diagnostics**: Check audit log:
```bash
grep "Sandbox violation" .claude/logs/audit.log
```

**Solution**: Adjust sandbox permissions:
```json
{
  "security": {
    "fileSystem": {
      "allowedPaths": [
        "./src",
        "./tests",
        "./build"  // Add additional path
      ]
    },
    "allowedCommands": [
      "git",
      "npm",
      "node",
      "docker"  // Add additional command
    ]
  }
}
```

#### Issue: "PII false positives"

**Cause**: Legitimate data matched PII patterns

**Solution**: Add exceptions:
```json
{
  "security": {
    "piiTokenization": {
      "exceptions": [
        "test@example.com",
        "123-45-6789"  // Test SSN
      ]
    }
  }
}
```

### Git Integration Issues

#### Issue: "Git workflow not detected"

**Cause**: Non-standard git setup

**Solution**: Manually specify workflow:
```json
{
  "git": {
    "workflow": "github-flow",  // or "gitflow" or "trunk-based"
    "autoDetect": false
  }
}
```

#### Issue: "Git commands failing"

**Diagnostics**:
```bash
# Check git installation
git --version

# Check repository status
git status

# Check remote
git remote -v
```

**Common Causes**:
1. Not in git repository
2. Detached HEAD state
3. Merge conflicts

**Solutions**:
```bash
# Initialize git if needed
git init

# Checkout branch if detached
git checkout main

# Resolve merge conflicts
git status
# Fix conflicts, then:
git add .
git commit
```

## Error Messages

### "Failed to initialize: ENOENT"

**Meaning**: Required file or directory not found

**Solution**:
```bash
# Create required directories
mkdir -p .claude/skills
mkdir -p .claude/commands
mkdir -p .claude/logs

# Reinitialize
code-assistant-claude init
```

### "Validation failed: Missing required field"

**Meaning**: Configuration missing required settings

**Solution**:
```bash
# Validate to see which fields are missing
code-assistant-claude validate

# Reset to defaults
code-assistant-claude init --reset
```

### "Maximum call stack size exceeded"

**Meaning**: Circular dependency or infinite loop

**Solution**:
```bash
# Clear cache
rm -rf .claude/cache/*

# Restart Claude Code CLI

# If persists, check for circular skill dependencies
cat .claude/skills/*/SKILL.md | grep "other_agents"
```

## Debug Mode

Enable debug logging for detailed diagnostics:

```json
{
  "logging": {
    "level": "debug",
    "file": ".claude/logs/debug.log"
  }
}
```

View debug logs:
```bash
tail -f .claude/logs/debug.log
```

## Getting Help

### 1. Check Documentation
- [Installation Guide](01-installation.md)
- [Configuration Guide](03-configuration.md)
- [Skills Guide](04-skills-guide.md)

### 2. Run Diagnostics
```bash
code-assistant-claude diagnose --verbose
```

### 3. Search Issues
[GitHub Issues](https://github.com/DegrassiAaron/code-assistant-claude/issues)

### 4. Create Issue

If problem persists, create a GitHub issue with:

```markdown
### Environment
- OS: [e.g., macOS 13.4]
- Node.js: [e.g., v18.16.0]
- npm: [e.g., v9.5.1]
- code-assistant-claude: [e.g., v1.0.0]

### Configuration
\`\`\`json
{
  "verbosityMode": "compressed",
  ...
}
\`\`\`

### Steps to Reproduce
1. Run `code-assistant-claude init`
2. Execute `/sc:implement "feature"`
3. Error occurs

### Expected Behavior
Should generate feature implementation

### Actual Behavior
Error: "MCP timeout"

### Logs
\`\`\`
[Error logs here]
\`\`\`

### Diagnostics Output
\`\`\`
[code-assistant-claude diagnose --verbose output]
\`\`\`
```

## Best Practices for Troubleshooting

### 1. Start Simple
- Verify basic installation first
- Test with minimal configuration
- Add complexity gradually

### 2. Check Logs
- Always check audit logs for security issues
- Review debug logs for detailed errors
- Use `grep` to filter relevant entries

### 3. Isolate Issues
- Test components individually
- Disable features one by one
- Use dry-run mode to preview actions

### 4. Document Changes
- Track configuration changes
- Note when issues started
- Keep version history

### 5. Regular Maintenance
```bash
# Update to latest version
npm update -g code-assistant-claude

# Clear old caches
find .claude/cache -mtime +7 -delete

# Rotate large logs
logrotate .claude/logs/

# Validate configuration
code-assistant-claude validate
```

## Emergency Recovery

### Reset to Factory Defaults

```bash
# Backup current configuration
cp -r .claude .claude.backup

# Reset everything
code-assistant-claude init --reset --force

# If needed, restore specific files
cp .claude.backup/settings.json .claude/settings.json
```

### Nuclear Option

Complete reinstall:
```bash
# Uninstall
npm uninstall -g code-assistant-claude

# Clear npm cache
npm cache clean --force

# Remove all configuration
rm -rf ~/.config/claude
rm -rf .claude

# Reinstall
npm install -g code-assistant-claude

# Reinitialize
code-assistant-claude init
```

## Frequently Asked Questions

**Q: Why is token usage higher than expected?**
A: Check verbosity mode, ensure progressive skills are enabled, and verify MCP is being used.

**Q: Skills not loading?**
A: Verify skill files exist, check auto-activation is enabled, and review audit logs.

**Q: MCP servers timing out?**
A: Increase timeout in .mcp.json, check network connectivity, verify npx is working.

**Q: How do I report a security issue?**
A: Email security@example.com or use GitHub Security Advisories.

**Q: Can I use without MCP?**
A: Yes, but token savings will be reduced from 98.7% to ~50%.

---

**Still having issues?** [Create a GitHub Issue](https://github.com/DegrassiAaron/code-assistant-claude/issues)
