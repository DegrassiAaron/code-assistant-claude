# Reset & Uninstall System
## Safe Removal and Vanilla State Restoration

**Critical Feature**: Prima dell'installazione, permettere all'utente di resettare Claude Code allo stato vanilla, rimuovendo tutte le configurazioni esistenti (local e global).

---

## 🎯 Core Requirements

### 1. Pre-Installation Reset Option

**Interactive Prompt During Init**:
```bash
code-assistant-claude init

┌─────────────────────────────────────────────────────────────────┐
│ 🚀 Code Assistant Claude Setup                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ⚠️  Existing Claude Code Configuration Detected                 │
│                                                                 │
│ Found configurations in:                                        │
│ • Global: ~/.claude/                                            │
│   ├─ 12 skills                                                  │
│   ├─ 8 commands                                                 │
│   ├─ 5 agents                                                   │
│   ├─ 3 MCP servers                                              │
│   └─ CLAUDE.md (15 KB)                                          │
│                                                                 │
│ • Local: ./.claude/                                             │
│   ├─ 3 skills                                                   │
│   ├─ 2 commands                                                 │
│   └─ settings.json                                              │
│                                                                 │
│ ? What would you like to do?                                    │
│                                                                 │
│   ○ Keep existing and merge with code-assistant                 │
│     (Preserves current setup, adds new features)                │
│                                                                 │
│   ○ Reset to vanilla and install fresh                          │
│     (⚠️  Backs up current config, removes all, clean install)    │
│                                                                 │
│   ○ Cancel installation                                         │
│     (Exit without changes)                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2. Safe Backup Before Reset

**Automatic Backup Creation**:
```bash
# If user selects "Reset to vanilla"
┌─────────────────────────────────────────────────────────────────┐
│ 💾 Creating Backup                                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Backing up existing configuration...                            │
│                                                                 │
│ ✅ Global config backed up to:                                  │
│    ~/.claude-backups/backup-2025-11-23-14-30-00/               │
│                                                                 │
│ ✅ Local config backed up to:                                   │
│    ./.claude-backups/backup-2025-11-23-14-30-00/               │
│                                                                 │
│ Backup contains:                                                │
│ • All skills, commands, agents                                  │
│ • CLAUDE.md files                                               │
│ • settings.json files                                           │
│ • .mcp.json configurations                                      │
│ • hooks configurations                                          │
│                                                                 │
│ ⚠️  To restore this backup later, run:                           │
│    code-assistant-claude restore backup-2025-11-23-14-30-00     │
│                                                                 │
│ ? Proceed with reset? [y/N]                                     │
└─────────────────────────────────────────────────────────────────┘
```

### 3. Comprehensive Cleanup

**Removal Scope**:
```yaml
cleanup_locations:
  global:
    - ~/.claude/skills/
    - ~/.claude/commands/
    - ~/.claude/agents/
    - ~/.claude/CLAUDE.md
    - ~/.claude/settings.json
    - ~/.claude/.mcp.json
    - ~/.claude/hooks/

  local:
    - ./.claude/skills/
    - ./.claude/commands/
    - ./.claude/agents/
    - ./.claude/CLAUDE.md
    - ./.claude/settings.json
    - ./.claude/settings.local.json
    - ./.claude/.mcp.json
    - ./.claude/hooks/

  preserve:
    - Conversation history (managed by Claude Code itself)
    - API keys and credentials
    - User personal data
```

---

## 🔧 Implementation

### Reset Command

```typescript
// core/cli/commands/reset.ts
export class ResetCommand {
  async execute(options: ResetOptions): Promise<void> {
    // 1. Detect existing configurations
    const existing = await this.detectExisting();

    if (!existing.hasAny) {
      console.log('✅ No existing configuration found. Already in vanilla state.');
      return;
    }

    // 2. Show what will be removed
    await this.showRemovalPreview(existing);

    // 3. Confirm with user
    const confirmed = await this.confirmReset(options.force);

    if (!confirmed) {
      console.log('❌ Reset cancelled.');
      return;
    }

    // 4. Create backup
    const backupPath = await this.createBackup(existing);
    console.log(`💾 Backup created: ${backupPath}`);

    // 5. Remove configurations
    await this.removeConfigurations(existing, options.scope);

    // 6. Verify vanilla state
    await this.verifyVanillaState();

    console.log('✅ Claude Code reset to vanilla state successfully!');
    console.log(`📦 Backup saved to: ${backupPath}`);
    console.log(`🔄 To restore: code-assistant-claude restore ${path.basename(backupPath)}`);
  }

  private async detectExisting(): Promise<ExistingConfig> {
    const global = {
      skills: await this.scanDirectory('~/.claude/skills/'),
      commands: await this.scanDirectory('~/.claude/commands/'),
      agents: await this.scanDirectory('~/.claude/agents/'),
      claudeMd: await this.fileExists('~/.claude/CLAUDE.md'),
      settings: await this.fileExists('~/.claude/settings.json'),
      mcp: await this.fileExists('~/.claude/.mcp.json'),
      hooks: await this.scanDirectory('~/.claude/hooks/')
    };

    const local = {
      skills: await this.scanDirectory('./.claude/skills/'),
      commands: await this.scanDirectory('./.claude/commands/'),
      agents: await this.scanDirectory('./.claude/agents/'),
      claudeMd: await this.fileExists('./.claude/CLAUDE.md'),
      settings: await this.fileExists('./.claude/settings.json'),
      settingsLocal: await this.fileExists('./.claude/settings.local.json'),
      mcp: await this.fileExists('./.claude/.mcp.json'),
      hooks: await this.scanDirectory('./.claude/hooks/')
    };

    return {
      global,
      local,
      hasAny: this.hasAnyConfig(global, local)
    };
  }

  private async showRemovalPreview(existing: ExistingConfig): Promise<void> {
    console.log(`
┌─────────────────────────────────────────────────────────────────┐
│ 🗑️  Reset Preview - Files to be Removed                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Global Configuration (~/.claude/):                              │
${this.formatConfigList(existing.global)}
│                                                                 │
│ Local Configuration (./.claude/):                               │
${this.formatConfigList(existing.local)}
│                                                                 │
│ ⚠️  All files will be backed up before removal                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
    `);
  }

  private async createBackup(
    existing: ExistingConfig
  ): Promise<string> {
    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, '-')
      .slice(0, -5);

    const backupDir = `backup-${timestamp}`;

    // Global backup
    const globalBackupPath = path.join(
      os.homedir(),
      '.claude-backups',
      backupDir,
      'global'
    );

    await this.copyDirectory('~/.claude/', globalBackupPath);

    // Local backup (if exists)
    if (existing.local.hasAny) {
      const localBackupPath = path.join(
        process.cwd(),
        '.claude-backups',
        backupDir,
        'local'
      );

      await this.copyDirectory('./.claude/', localBackupPath);
    }

    // Create manifest
    await this.createBackupManifest(backupDir, existing);

    return backupDir;
  }

  private async createBackupManifest(
    backupDir: string,
    existing: ExistingConfig
  ): Promise<void> {
    const manifest = {
      created_at: new Date().toISOString(),
      created_by: 'code-assistant-claude',
      version: this.getVersion(),
      contents: {
        global: existing.global,
        local: existing.local
      },
      restoration_commands: {
        full: `code-assistant-claude restore ${backupDir}`,
        global_only: `code-assistant-claude restore ${backupDir} --scope global`,
        local_only: `code-assistant-claude restore ${backupDir} --scope local`
      }
    };

    const manifestPath = path.join(
      os.homedir(),
      '.claude-backups',
      backupDir,
      'manifest.json'
    );

    await fs.writeFile(
      manifestPath,
      JSON.stringify(manifest, null, 2)
    );
  }

  private async removeConfigurations(
    existing: ExistingConfig,
    scope: 'global' | 'local' | 'both'
  ): Promise<void> {
    const targets: string[] = [];

    if (scope === 'global' || scope === 'both') {
      targets.push(
        '~/.claude/skills/',
        '~/.claude/commands/',
        '~/.claude/agents/',
        '~/.claude/CLAUDE.md',
        '~/.claude/settings.json',
        '~/.claude/.mcp.json',
        '~/.claude/hooks/'
      );
    }

    if (scope === 'local' || scope === 'both') {
      targets.push(
        './.claude/skills/',
        './.claude/commands/',
        './.claude/agents/',
        './.claude/CLAUDE.md',
        './.claude/settings.json',
        './.claude/settings.local.json',
        './.claude/.mcp.json',
        './.claude/hooks/'
      );
    }

    // Remove each target
    for (const target of targets) {
      const fullPath = this.resolvePath(target);
      if (await this.exists(fullPath)) {
        await this.removeSafely(fullPath);
        console.log(`🗑️  Removed: ${target}`);
      }
    }
  }

  private async verifyVanillaState(): Promise<void> {
    const checks = [
      '~/.claude/skills/',
      '~/.claude/commands/',
      '~/.claude/agents/',
      '~/.claude/CLAUDE.md',
      './.claude/'
    ];

    for (const check of checks) {
      const exists = await this.exists(this.resolvePath(check));
      if (exists) {
        throw new Error(`Failed to remove: ${check}`);
      }
    }

    console.log('✅ Verified: Claude Code is now in vanilla state');
  }
}
```

### Restore Command

```typescript
// core/cli/commands/restore.ts
export class RestoreCommand {
  async execute(backupName: string, options: RestoreOptions): Promise<void> {
    // 1. Find backup
    const backupPath = path.join(
      os.homedir(),
      '.claude-backups',
      backupName
    );

    if (!await this.exists(backupPath)) {
      throw new Error(`Backup not found: ${backupName}`);
    }

    // 2. Load manifest
    const manifest = await this.loadManifest(backupPath);

    // 3. Show restore preview
    await this.showRestorePreview(manifest);

    // 4. Confirm with user
    const confirmed = await this.confirmRestore(options.force);

    if (!confirmed) {
      console.log('❌ Restore cancelled.');
      return;
    }

    // 5. Check for conflicts
    const conflicts = await this.detectConflicts(
      manifest,
      options.scope
    );

    if (conflicts.length > 0) {
      const overwrite = await this.confirmOverwrite(conflicts);
      if (!overwrite) {
        console.log('❌ Restore cancelled to avoid overwriting existing files.');
        return;
      }
    }

    // 6. Restore files
    await this.restoreFiles(backupPath, manifest, options.scope);

    // 7. Verify restoration
    await this.verifyRestoration(manifest);

    console.log('✅ Configuration restored successfully!');
  }

  private async showRestorePreview(manifest: BackupManifest): Promise<void> {
    console.log(`
┌─────────────────────────────────────────────────────────────────┐
│ 📦 Restore Preview                                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Backup Information:                                             │
│ • Created: ${new Date(manifest.created_at).toLocaleString()}    │
│ • Version: ${manifest.version}                                  │
│                                                                 │
│ Will restore:                                                   │
│                                                                 │
│ Global Configuration:                                           │
│ • ${manifest.contents.global.skills.length} skills              │
│ • ${manifest.contents.global.commands.length} commands          │
│ • ${manifest.contents.global.agents.length} agents              │
│ • CLAUDE.md (${this.formatSize(manifest.contents.global.claudeMdSize)})│
│ • MCP servers configuration                                     │
│                                                                 │
│ Local Configuration:                                            │
│ • ${manifest.contents.local.skills.length} skills               │
│ • ${manifest.contents.local.commands.length} commands           │
│ • settings.json                                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
    `);
  }

  private async restoreFiles(
    backupPath: string,
    manifest: BackupManifest,
    scope: 'global' | 'local' | 'both'
  ): Promise<void> {
    if (scope === 'global' || scope === 'both') {
      await this.copyDirectory(
        path.join(backupPath, 'global'),
        path.join(os.homedir(), '.claude')
      );
      console.log('✅ Global configuration restored');
    }

    if (scope === 'local' || scope === 'both') {
      if (manifest.contents.local.hasAny) {
        await this.copyDirectory(
          path.join(backupPath, 'local'),
          path.join(process.cwd(), '.claude')
        );
        console.log('✅ Local configuration restored');
      }
    }
  }
}
```

### Uninstall Command

```typescript
// core/cli/commands/uninstall.ts
export class UninstallCommand {
  async execute(options: UninstallOptions): Promise<void> {
    console.log(`
┌─────────────────────────────────────────────────────────────────┐
│ 🗑️  Uninstall Code Assistant Claude                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ This will remove:                                               │
│                                                                 │
│ 1. Code Assistant configurations:                               │
│    • All code-assistant-generated skills                        │
│    • All code-assistant-generated commands                      │
│    • All code-assistant-generated agents                        │
│    • code-assistant-claude CLI tool                             │
│                                                                 │
│ 2. Optional: Reset Claude to vanilla state                      │
│    • Remove ALL .claude/ configurations                         │
│    • Remove ALL custom skills/commands/agents                   │
│    • Remove ALL MCP server configs                              │
│    • (⚠️  Creates backup before removal)                         │
│                                                                 │
│ ? Uninstall scope:                                              │
│                                                                 │
│   ○ Code Assistant only                                         │
│     (Keep other Claude Code customizations)                     │
│                                                                 │
│   ○ Complete reset to vanilla                                   │
│     (⚠️  Remove ALL Claude Code configurations)                  │
│                                                                 │
│   ○ Cancel                                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
    `);

    const scope = await this.getUserChoice();

    if (scope === 'cancel') {
      console.log('❌ Uninstall cancelled.');
      return;
    }

    // Create backup before any removal
    const backupPath = await this.createBackup();
    console.log(`💾 Backup created: ${backupPath}`);

    if (scope === 'code-assistant-only') {
      await this.removeCodeAssistantOnly();
    } else {
      await this.completeReset();
    }

    // Uninstall CLI tool
    await this.uninstallCLI();

    console.log('✅ Uninstall complete!');
    console.log(`📦 Backup: ${backupPath}`);
    console.log(`🔄 Restore: code-assistant-claude restore ${path.basename(backupPath)}`);
  }

  private async removeCodeAssistantOnly(): Promise<void> {
    // Scan for code-assistant-generated files
    const marker = '# Auto-generated by code-assistant-claude';

    const skills = await this.findFilesWithMarker(
      ['~/.claude/skills/', './.claude/skills/'],
      marker
    );

    const commands = await this.findFilesWithMarker(
      ['~/.claude/commands/', './.claude/commands/'],
      marker
    );

    const agents = await this.findFilesWithMarker(
      ['~/.claude/agents/', './.claude/agents/'],
      marker
    );

    // Remove only code-assistant files
    for (const file of [...skills, ...commands, ...agents]) {
      await fs.remove(file);
      console.log(`🗑️  Removed: ${file}`);
    }

    console.log('✅ Code Assistant configurations removed');
    console.log('✅ Other Claude Code customizations preserved');
  }

  private async completeReset(): Promise<void> {
    // Use ResetCommand for complete cleanup
    const resetCmd = new ResetCommand();
    await resetCmd.execute({
      scope: 'both',
      force: true,
      skipBackup: true // Already created backup
    });
  }

  private async uninstallCLI(): Promise<void> {
    console.log('🗑️  Uninstalling code-assistant-claude CLI...');

    // Remove global npm package
    await this.execAsync('npm uninstall -g code-assistant-claude');

    console.log('✅ CLI tool uninstalled');
  }
}
```

### List Backups Command

```typescript
// core/cli/commands/list-backups.ts
export class ListBackupsCommand {
  async execute(): Promise<void> {
    const backupsDir = path.join(os.homedir(), '.claude-backups');

    if (!await this.exists(backupsDir)) {
      console.log('No backups found.');
      return;
    }

    const backups = await fs.readdir(backupsDir);

    if (backups.length === 0) {
      console.log('No backups found.');
      return;
    }

    console.log(`
┌─────────────────────────────────────────────────────────────────┐
│ 📦 Available Backups                                            │
├─────────────────────────────────────────────────────────────────┤
    `);

    for (const backup of backups.sort().reverse()) {
      const manifest = await this.loadManifest(
        path.join(backupsDir, backup)
      );

      const size = await this.getDirectorySize(
        path.join(backupsDir, backup)
      );

      console.log(`
│ ${backup}
│ • Created: ${new Date(manifest.created_at).toLocaleString()}
│ • Size: ${this.formatSize(size)}
│ • Skills: ${this.countItems(manifest.contents, 'skills')}
│ • Commands: ${this.countItems(manifest.contents, 'commands')}
│ • Agents: ${this.countItems(manifest.contents, 'agents')}
│ • Restore: code-assistant-claude restore ${backup}
│
      `);
    }

    console.log(`
└─────────────────────────────────────────────────────────────────┘

Total backups: ${backups.length}
Total size: ${this.formatSize(await this.getTotalSize(backupsDir))}

Commands:
• Restore: code-assistant-claude restore <backup-name>
• Delete: code-assistant-claude delete-backup <backup-name>
• Clean old: code-assistant-claude clean-backups --older-than 30d
    `);
  }
}
```

### Delete Backup Command

```typescript
// core/cli/commands/delete-backup.ts
export class DeleteBackupCommand {
  async execute(backupName: string, options: DeleteOptions): Promise<void> {
    const backupPath = path.join(
      os.homedir(),
      '.claude-backups',
      backupName
    );

    if (!await this.exists(backupPath)) {
      throw new Error(`Backup not found: ${backupName}`);
    }

    // Load manifest for preview
    const manifest = await this.loadManifest(backupPath);
    const size = await this.getDirectorySize(backupPath);

    console.log(`
┌─────────────────────────────────────────────────────────────────┐
│ 🗑️  Delete Backup                                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Backup: ${backupName}                                           │
│ Created: ${new Date(manifest.created_at).toLocaleString()}      │
│ Size: ${this.formatSize(size)}                                  │
│                                                                 │
│ ⚠️  This action cannot be undone!                                │
│                                                                 │
│ ? Confirm deletion? [y/N]                                       │
└─────────────────────────────────────────────────────────────────┘
    `);

    const confirmed = await this.confirmDeletion(options.force);

    if (!confirmed) {
      console.log('❌ Deletion cancelled.');
      return;
    }

    await fs.remove(backupPath);
    console.log(`✅ Backup deleted: ${backupName}`);
  }
}
```

### Clean Old Backups Command

```typescript
// core/cli/commands/clean-backups.ts
export class CleanBackupsCommand {
  async execute(options: CleanOptions): Promise<void> {
    const backupsDir = path.join(os.homedir(), '.claude-backups');
    const backups = await fs.readdir(backupsDir);

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - (options.olderThanDays || 30));

    const toDelete: string[] = [];
    let totalSize = 0;

    for (const backup of backups) {
      const manifest = await this.loadManifest(
        path.join(backupsDir, backup)
      );

      const created = new Date(manifest.created_at);

      if (created < cutoffDate) {
        const size = await this.getDirectorySize(
          path.join(backupsDir, backup)
        );
        toDelete.push(backup);
        totalSize += size;
      }
    }

    if (toDelete.length === 0) {
      console.log('No old backups found.');
      return;
    }

    console.log(`
┌─────────────────────────────────────────────────────────────────┐
│ 🧹 Clean Old Backups                                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Found ${toDelete.length} backups older than ${options.olderThanDays} days│
│ Total size: ${this.formatSize(totalSize)}                       │
│                                                                 │
│ Backups to delete:                                              │
${toDelete.map(b => `│ • ${b}`).join('\n')}
│                                                                 │
│ ? Proceed with deletion? [y/N]                                  │
└─────────────────────────────────────────────────────────────────┘
    `);

    const confirmed = await this.confirmCleanup(options.force);

    if (!confirmed) {
      console.log('❌ Cleanup cancelled.');
      return;
    }

    for (const backup of toDelete) {
      await fs.remove(path.join(backupsDir, backup));
      console.log(`🗑️  Deleted: ${backup}`);
    }

    console.log(`✅ Cleaned ${toDelete.length} old backups`);
    console.log(`💾 Freed ${this.formatSize(totalSize)} of disk space`);
  }
}
```

---

## 🔄 Complete Command Set

### Installation & Reset Commands

```bash
# Installation
code-assistant-claude init                    # Full setup wizard
code-assistant-claude init --reset            # Reset to vanilla first
code-assistant-claude init --global           # Global config only
code-assistant-claude init --local            # Local config only
code-assistant-claude init --merge            # Merge with existing

# Reset
code-assistant-claude reset                   # Interactive reset
code-assistant-claude reset --scope global    # Global only
code-assistant-claude reset --scope local     # Local only
code-assistant-claude reset --scope both      # Complete reset
code-assistant-claude reset --force           # Skip confirmations

# Restore
code-assistant-claude restore <backup-name>   # Restore from backup
code-assistant-claude restore <backup-name> --scope global
code-assistant-claude restore <backup-name> --scope local
code-assistant-claude restore <backup-name> --force

# Backup Management
code-assistant-claude list-backups            # Show all backups
code-assistant-claude delete-backup <name>    # Delete specific backup
code-assistant-claude clean-backups           # Clean old backups (>30d)
code-assistant-claude clean-backups --older-than 60d

# Uninstall
code-assistant-claude uninstall               # Interactive uninstall
code-assistant-claude uninstall --complete    # Complete reset + remove CLI
code-assistant-claude uninstall --keep-config # Remove CLI only
```

---

## 🛡️ Safety Features

### 1. Automatic Backup

**Every destructive operation creates backup**:
```yaml
backup_triggers:
  - reset command
  - uninstall command
  - overwrite during restore
  - merge conflicts during init

backup_location:
  global: ~/.claude-backups/
  local: ./.claude-backups/

backup_naming:
  pattern: backup-YYYY-MM-DD-HH-MM-SS
  example: backup-2025-11-23-14-30-00

backup_contents:
  - All files from ~/.claude/
  - All files from ./.claude/
  - manifest.json with metadata
  - Restoration instructions
```

### 2. Conflict Detection

**Before overwriting existing files**:
```typescript
interface Conflict {
  file: string;
  existingSource: 'user' | 'code-assistant' | 'unknown';
  action: 'overwrite' | 'merge' | 'skip';
}

async function detectConflicts(
  targetPath: string,
  newConfig: Config
): Promise<Conflict[]> {
  const conflicts: Conflict[] = [];

  for (const file of newConfig.files) {
    const fullPath = path.join(targetPath, file);

    if (await exists(fullPath)) {
      const source = await this.detectSource(fullPath);

      conflicts.push({
        file,
        existingSource: source,
        action: this.recommendAction(source)
      });
    }
  }

  return conflicts;
}
```

**Conflict Resolution**:
```bash
┌─────────────────────────────────────────────────────────────────┐
│ ⚠️  Conflicts Detected                                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ The following files already exist:                              │
│                                                                 │
│ ~/.claude/skills/code-reviewer/ (source: user-created)          │
│ ? Action:                                                       │
│   ○ Keep existing (skip code-assistant version)                 │
│   ○ Overwrite with code-assistant version                       │
│   ○ Merge (combine both)                                        │
│   ○ Rename existing (code-reviewer-backup)                      │
│                                                                 │
│ ~/.claude/CLAUDE.md (source: code-assistant v1.2.0)             │
│ ? Action:                                                       │
│   ○ Update to latest version                                    │
│   ○ Keep current version                                        │
│   ○ Merge configurations                                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3. Dry Run Mode

**Preview changes without executing**:
```bash
code-assistant-claude init --dry-run

┌─────────────────────────────────────────────────────────────────┐
│ 🔍 Dry Run: Preview Changes                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Would create:                                                   │
│ ✅ ~/.claude/skills/code-reviewer/                              │
│ ✅ ~/.claude/skills/test-generator/                             │
│ ✅ ~/.claude/skills/frontend-design/                            │
│ ✅ ~/.claude/commands/sc-implement.md                           │
│ ✅ ~/.claude/commands/sc-scaffold.md                            │
│ ✅ ~/.claude/agents/code-reviewer-agent.md                      │
│ ✅ ~/.claude/CLAUDE.md                                          │
│ ✅ ~/.claude/.mcp.json                                          │
│                                                                 │
│ Would modify:                                                   │
│ ⚠️  ~/.claude/settings.json (add MCP configurations)            │
│                                                                 │
│ Would backup:                                                   │
│ 💾 ~/.claude/ → ~/.claude-backups/backup-[timestamp]/          │
│                                                                 │
│ No changes made (dry run mode)                                  │
│                                                                 │
│ ? Proceed with actual installation? [y/N]                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Backup Management

### Backup Structure

```
~/.claude-backups/
├── backup-2025-11-23-14-30-00/
│   ├── manifest.json
│   ├── global/
│   │   ├── skills/
│   │   ├── commands/
│   │   ├── agents/
│   │   ├── CLAUDE.md
│   │   ├── settings.json
│   │   └── .mcp.json
│   └── local/
│       ├── skills/
│       ├── commands/
│       ├── settings.json
│       └── settings.local.json
│
├── backup-2025-11-20-10-15-00/
│   └── ...
│
└── backup-2025-11-15-09-00-00/
    └── ...
```

### Manifest Example

```json
{
  "created_at": "2025-11-23T14:30:00.000Z",
  "created_by": "code-assistant-claude",
  "version": "1.0.0",
  "trigger": "reset",
  "contents": {
    "global": {
      "skills": [
        "code-reviewer",
        "test-generator",
        "frontend-design",
        "security-auditor"
      ],
      "commands": [
        "sc-implement",
        "sc-scaffold",
        "sc-review"
      ],
      "agents": [
        "code-reviewer-agent",
        "test-engineer-agent"
      ],
      "claudeMd": true,
      "claudeMdSize": 15360,
      "settings": true,
      "mcp": true,
      "mcpServers": ["magic", "serena", "sequential"]
    },
    "local": {
      "skills": ["project-specific-skill"],
      "commands": ["custom-command"],
      "settings": true,
      "settingsLocal": true
    }
  },
  "restoration_commands": {
    "full": "code-assistant-claude restore backup-2025-11-23-14-30-00",
    "global_only": "code-assistant-claude restore backup-2025-11-23-14-30-00 --scope global",
    "local_only": "code-assistant-claude restore backup-2025-11-23-14-30-00 --scope local"
  }
}
```

---

## 🎯 Integration with Init Flow

### Enhanced Installation Flow

```typescript
// core/cli/commands/init.ts (enhanced)
export class InitCommand {
  async execute(options: InitOptions): Promise<void> {
    // 0. Check for existing configuration
    const existing = await this.detectExisting();

    if (existing.hasAny && !options.force) {
      const choice = await this.promptExistingConfigAction();

      switch (choice) {
        case 'merge':
          return await this.mergeWithExisting(existing);

        case 'reset':
          await this.resetToVanilla(existing);
          // Continue with fresh install
          break;

        case 'cancel':
          console.log('❌ Installation cancelled.');
          return;
      }
    }

    // 1. Project analysis
    const analysis = await this.projectAnalyzer.analyze();

    // 2. Intelligent recommendations
    const recommendations = await this.intelligentRouter.recommend(analysis);

    // 3. User confirmation
    const approved = await this.showRecommendations(recommendations);

    // 4. Configuration preferences
    const preferences = await this.gatherPreferences();

    // 5. Generate configuration
    await this.configGenerator.generate(recommendations, preferences);

    // 6. Install resources
    await this.installer.install(recommendations);

    // 7. Validate
    await this.validator.validate();

    console.log('✅ Code Assistant Claude configured successfully!');
  }

  private async promptExistingConfigAction(): Promise<Action> {
    console.log(`
┌─────────────────────────────────────────────────────────────────┐
│ ⚠️  Existing Claude Code Configuration Detected                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ? What would you like to do?                                    │
│                                                                 │
│   ○ Merge with existing                                         │
│     Preserves current setup, adds code-assistant features       │
│     Recommended if you have custom configurations               │
│                                                                 │
│   ○ Reset to vanilla and install fresh                          │
│     ⚠️  Creates backup, removes all, clean install               │
│     Recommended for optimal code-assistant experience           │
│                                                                 │
│   ○ Cancel installation                                         │
│     Exit without making changes                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
    `);

    return await this.getUserChoice();
  }

  private async resetToVanilla(existing: ExistingConfig): Promise<void> {
    const resetCmd = new ResetCommand();
    await resetCmd.execute({
      scope: 'both',
      force: false, // Still prompt for final confirmation
      createBackup: true
    });

    console.log('✅ Reset complete. Proceeding with fresh installation...\n');
  }
}
```

---

## 🎪 User Experience Flow

### Complete Installation Journey

```bash
$ code-assistant-claude init

┌─────────────────────────────────────────────────────────────────┐
│ 🚀 Code Assistant Claude v1.0.0                                 │
└─────────────────────────────────────────────────────────────────┘

🔍 Scanning for existing Claude Code configuration...

⚠️  Found existing configuration:
   • Global: 12 skills, 8 commands, 5 agents
   • Local: 3 skills, 2 commands

? What would you like to do?
❯ Merge with existing
  Reset to vanilla and install fresh
  Cancel installation

[User selects: Reset to vanilla]

┌─────────────────────────────────────────────────────────────────┐
│ 💾 Creating Safety Backup                                       │
└─────────────────────────────────────────────────────────────────┘

✅ Backup created: ~/.claude-backups/backup-2025-11-23-14-30-00/
   Restore command: code-assistant-claude restore backup-2025-11-23-14-30-00

? Proceed with removal of existing configuration? [y/N] y

🗑️  Removing global configuration...
✅ Removed: ~/.claude/skills/
✅ Removed: ~/.claude/commands/
✅ Removed: ~/.claude/agents/
✅ Removed: ~/.claude/CLAUDE.md
✅ Removed: ~/.claude/settings.json

🗑️  Removing local configuration...
✅ Removed: ./.claude/

✅ Claude Code reset to vanilla state
✅ Proceeding with fresh installation...

┌─────────────────────────────────────────────────────────────────┐
│ 🔍 Step 1/7: Project Analysis                                   │
└─────────────────────────────────────────────────────────────────┘

Analyzing project structure...
✅ Detected: TypeScript React Application
✅ Node.js 18.x, Vite, Jest, React Testing Library

[... rest of installation wizard ...]

✅ Installation complete!

📦 Backup available: ~/.claude-backups/backup-2025-11-23-14-30-00/
🔄 Restore anytime: code-assistant-claude restore backup-2025-11-23-14-30-00
```

---

## 🔧 Implementation Details

### File Marker System

**All code-assistant-generated files include marker**:
```markdown
<!-- .claude/skills/code-reviewer/SKILL.md -->
# Auto-generated by code-assistant-claude
# Version: 1.0.0
# Generated: 2025-11-23T14:30:00Z
# DO NOT EDIT: This file is managed by code-assistant-claude

---
name: code-reviewer
description: Automatic code review when files are saved
---

[... skill content ...]
```

**Benefits**:
- Easy identification of managed files
- Selective removal (remove only code-assistant files)
- Version tracking
- Update detection

### Configuration Tracking

**Metadata File**:
```json
// ~/.claude/.code-assistant-meta.json
{
  "version": "1.0.0",
  "installed_at": "2025-11-23T14:30:00Z",
  "managed_files": {
    "global": {
      "skills": [
        "~/.claude/skills/code-reviewer/",
        "~/.claude/skills/test-generator/"
      ],
      "commands": [
        "~/.claude/commands/sc-implement.md"
      ],
      "agents": [
        "~/.claude/agents/code-reviewer-agent.md"
      ],
      "configs": [
        "~/.claude/CLAUDE.md",
        "~/.claude/.mcp.json"
      ]
    },
    "local": {
      "skills": [],
      "commands": [],
      "configs": [
        "./.claude/settings.json"
      ]
    }
  },
  "user_customizations": {
    "modified_files": [],
    "custom_skills": [],
    "custom_commands": []
  }
}
```

---

## 📋 Updated CLI Command Structure

Add to architecture:

```typescript
// core/cli/index.ts
import { Command } from 'commander';

const program = new Command();

program
  .name('code-assistant-claude')
  .description('Intelligent Claude Code configuration framework')
  .version('1.0.0');

// Installation & Setup
program
  .command('init')
  .description('Initialize code-assistant-claude in current project')
  .option('--reset', 'Reset to vanilla before installation')
  .option('--global', 'Configure global only')
  .option('--local', 'Configure local only')
  .option('--merge', 'Merge with existing configuration')
  .option('--dry-run', 'Preview changes without executing')
  .action(initCommand);

// Reset & Cleanup
program
  .command('reset')
  .description('Reset Claude Code to vanilla state')
  .option('--scope <scope>', 'Reset scope: global, local, or both', 'both')
  .option('--force', 'Skip confirmation prompts')
  .option('--no-backup', 'Skip backup creation (dangerous!)')
  .action(resetCommand);

// Backup Management
program
  .command('restore <backup-name>')
  .description('Restore configuration from backup')
  .option('--scope <scope>', 'Restore scope: global, local, or both', 'both')
  .option('--force', 'Skip confirmation and overwrite conflicts')
  .action(restoreCommand);

program
  .command('list-backups')
  .description('List all available backups')
  .alias('backups')
  .action(listBackupsCommand);

program
  .command('delete-backup <backup-name>')
  .description('Delete a specific backup')
  .option('--force', 'Skip confirmation')
  .action(deleteBackupCommand);

program
  .command('clean-backups')
  .description('Remove old backups')
  .option('--older-than <days>', 'Delete backups older than X days', '30')
  .option('--force', 'Skip confirmation')
  .action(cleanBackupsCommand);

// Uninstall
program
  .command('uninstall')
  .description('Uninstall code-assistant-claude')
  .option('--complete', 'Complete reset and remove CLI')
  .option('--keep-config', 'Remove CLI only, keep configurations')
  .option('--force', 'Skip all confirmations')
  .action(uninstallCommand);

// ... other commands ...

program.parse();
```

---

## ✅ Integration Checklist

Add to **Phase 1: Foundation (Week 1-2)**:

**New Tasks**:
- ✅ Implement ResetCommand with backup creation
- ✅ Implement RestoreCommand with conflict detection
- ✅ Implement UninstallCommand with scope options
- ✅ Implement ListBackupsCommand
- ✅ Implement DeleteBackupCommand
- ✅ Implement CleanBackupsCommand
- ✅ Create file marker system for tracking
- ✅ Build conflict resolution wizard
- ✅ Add dry-run mode for all commands

**Updated Deliverables**:
- ✅ Working CLI with reset/restore functionality
- ✅ Safe backup/restore system
- ✅ Conflict detection and resolution
- ✅ Dry-run mode for previewing changes
- ✅ Complete uninstall with vanilla restoration

---

## 🎯 Key Benefits

**User Control** 🎮:
- ✅ Full control over installation vs reset
- ✅ Preview changes before applying
- ✅ Safe backups before any destructive action
- ✅ Easy restoration if something goes wrong

**Safety** 🛡️:
- ✅ Automatic backups (cannot be skipped without --no-backup flag)
- ✅ Conflict detection before overwriting
- ✅ Dry-run mode for risk-free exploration
- ✅ Complete audit trail of changes

**Flexibility** 🔧:
- ✅ Merge or replace existing configs
- ✅ Selective restoration (global, local, or both)
- ✅ Partial uninstall (keep configs, remove CLI)
- ✅ Clean old backups to save disk space

**Professional** 💼:
- ✅ Enterprise-grade backup management
- ✅ Version tracking across backups
- ✅ Compliance-ready audit logging
- ✅ Disaster recovery support

---

Perfetto! Ora abbiamo un sistema completo di reset/uninstall che garantisce massima safety e user control.

Procedo con la documentazione utente (Opzione D)? 📖