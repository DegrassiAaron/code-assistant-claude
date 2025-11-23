# CLI Commands Reference

Complete reference for Code-Assistant-Claude CLI commands.

## Installation Commands

### `code-assistant-claude init`

Initialize Code-Assistant-Claude in a project.

**Usage**:
```bash
code-assistant-claude init [options]
```

**Options**:
- `--project-type <type>` - Specify project type
- `--skills <skills>` - Comma-separated list of skills
- `--update` - Update existing configuration
- `--reset` - Reset to defaults
- `--force` - Skip confirmations

**Examples**:
```bash
# Interactive setup
code-assistant-claude init

# Specify project type
code-assistant-claude init --project-type react

# Update existing
code-assistant-claude init --update

# Reset configuration
code-assistant-claude init --reset --force
```

## Skill Management

### `install-skill`

Install a skill from npm or local path.

**Usage**:
```bash
code-assistant-claude install-skill <skill-name> [options]
```

**Options**:
- `--global` - Install globally
- `--local` - Install locally (default)
- `--version <version>` - Specific version

**Examples**:
```bash
code-assistant-claude install-skill code-reviewer
code-assistant-claude install-skill @org/custom-skill --global
```

### `list-skills`

List installed skills.

**Usage**:
```bash
code-assistant-claude list-skills [options]
```

**Options**:
- `--global` - List global skills
- `--local` - List local skills
- `--json` - Output as JSON

### `validate-skill`

Validate skill structure and configuration.

**Usage**:
```bash
code-assistant-claude validate-skill <skill-name>
```

## Configuration

### `validate`

Validate configuration files.

**Usage**:
```bash
code-assistant-claude validate [options]
```

**Options**:
- `--verbose` - Detailed validation output
- `--fix` - Auto-fix issues

### `config`

Manage configuration.

**Usage**:
```bash
code-assistant-claude config <action> [options]
```

**Actions**:
- `show` - Display current configuration
- `get <key>` - Get specific value
- `set <key> <value>` - Set value
- `reset` - Reset to defaults

**Examples**:
```bash
code-assistant-claude config show
code-assistant-claude config get verbosityMode
code-assistant-claude config set verbosityMode compressed
```

## Diagnostics

### `diagnose`

Run system diagnostics.

**Usage**:
```bash
code-assistant-claude diagnose [options]
```

**Options**:
- `--verbose` - Detailed output
- `--json` - JSON format
- `--fix` - Attempt auto-fixes

**Output**:
```
🔍 Running Diagnostics...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Node.js: v18.16.0
✅ npm: v9.5.1
✅ Claude Code CLI: Detected
✅ Configuration: Valid
⚠️  MCP 'magic': Not responding

Issues Found: 1
```

### `test-skill`

Test skill activation and token usage.

**Usage**:
```bash
code-assistant-claude test-skill <skill-name> [options]
```

**Options**:
- `--scenario <name>` - Test scenario
- `--measure-tokens` - Measure token usage
- `--dry-run` - Simulate without execution

## Backup & Restore

### `backup`

Create configuration backup.

**Usage**:
```bash
code-assistant-claude backup [options]
```

**Options**:
- `--name <name>` - Backup name
- `--output <path>` - Output directory

### `restore`

Restore from backup.

**Usage**:
```bash
code-assistant-claude restore <backup-name>
```

### `list-backups`

List available backups.

**Usage**:
```bash
code-assistant-claude list-backups
```

## Reset & Uninstall

### `reset`

Reset to vanilla Claude Code.

**Usage**:
```bash
code-assistant-claude reset [options]
```

**Options**:
- `--backup` - Create backup first (default)
- `--no-backup` - Skip backup
- `--force` - Skip confirmation

### `uninstall`

Completely uninstall Code-Assistant-Claude.

**Usage**:
```bash
code-assistant-claude uninstall [options]
```

**Options**:
- `--complete` - Remove all configuration
- `--keep-backups` - Preserve backups

## Version & Help

### `--version`

Display version information.

**Usage**:
```bash
code-assistant-claude --version
```

### `--help`

Display help information.

**Usage**:
```bash
code-assistant-claude --help
code-assistant-claude <command> --help
```

## Environment Variables

```bash
# MCP Configuration
CLAUDE_MCP_TIMEOUT=30000

# Skill Paths
CLAUDE_SKILLS_PATH=/custom/skills/path

# Debug Mode
CLAUDE_DEBUG=true

# Token Budget
CLAUDE_TOKEN_BUDGET=200000
```

## Exit Codes

- `0` - Success
- `1` - General error
- `2` - Configuration error
- `3` - Validation error
- `4` - Network error
- `5` - Permission error
