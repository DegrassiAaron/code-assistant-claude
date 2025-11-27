import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

interface ResetOptions {
  backup?: boolean;
  local?: boolean;
  global?: boolean;
  cache?: boolean;
  workspace?: boolean;
}

export async function resetCommand(
  options: ResetOptions = { backup: true }
): Promise<void> {
  console.log(chalk.yellow('\n⚠️  Reset to Vanilla State\n'));

  // Determine scope
  const scope = options.local
    ? 'local'
    : options.global
      ? 'global'
      : 'both';

  const scopeDesc =
    scope === 'local'
      ? 'project configuration (.claude/)'
      : scope === 'global'
        ? 'global configuration (~/.claude/)'
        : 'all configurations (local + global)';

  console.log(chalk.gray(`Scope: ${scopeDesc}\n`));

  // Confirm reset
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: `This will reset ${scopeDesc}. Continue?`,
      default: false,
    },
  ]);

  if (!confirm) {
    console.log(chalk.gray('\nReset cancelled.\n'));
    return;
  }

  const spinner = ora('Resetting configuration...').start();

  try {
    const removedItems: string[] = [];

    // Paths
    const localClaudeDir = path.join(process.cwd(), '.claude');
    const globalClaudeDir = path.join(os.homedir(), '.claude');
    const workspaceDir = path.join(process.cwd(), '.workspace');
    const cacheDir = path.join(process.cwd(), '.cache');

    // Backup if enabled
    if (options.backup) {
      spinner.text = 'Creating backup...';
      const backupDir = path.join(os.homedir(), '.claude', 'backups');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

      await fs.mkdir(backupDir, { recursive: true });

      if (scope === 'local' || scope === 'both') {
        try {
          await fs.access(localClaudeDir);
          const backupPath = path.join(
            backupDir,
            `local-${timestamp}.backup`
          );
          await fs.cp(localClaudeDir, backupPath, { recursive: true });
          console.log(chalk.gray(`\n  ✓ Backup: ${backupPath}`));
        } catch {
          // No local config to backup
        }
      }

      if (scope === 'global' || scope === 'both') {
        try {
          const backupPath = path.join(
            backupDir,
            `global-${timestamp}.backup`
          );
          await fs.cp(globalClaudeDir, backupPath, { recursive: true });
          console.log(chalk.gray(`  ✓ Backup: ${backupPath}`));
        } catch {
          // No global config to backup
        }
      }
    }

    // Remove local configuration
    if (scope === 'local' || scope === 'both') {
      spinner.text = 'Removing local configuration...';
      try {
        await fs.access(localClaudeDir);
        await fs.rm(localClaudeDir, { recursive: true, force: true });
        removedItems.push('.claude/ (local)');
      } catch {
        // Directory doesn't exist
      }
    }

    // Remove global configuration
    if (scope === 'global' || scope === 'both') {
      spinner.text = 'Removing global configuration...';
      try {
        await fs.access(globalClaudeDir);
        // Keep backups directory
        const entries = await fs.readdir(globalClaudeDir);
        for (const entry of entries) {
          if (entry !== 'backups') {
            await fs.rm(path.join(globalClaudeDir, entry), {
              recursive: true,
              force: true,
            });
            removedItems.push(`~/.claude/${entry} (global)`);
          }
        }
      } catch {
        // Directory doesn't exist
      }
    }

    // Remove workspace (if option enabled)
    if (options.workspace) {
      spinner.text = 'Removing workspace...';
      try {
        await fs.access(workspaceDir);
        await fs.rm(workspaceDir, { recursive: true, force: true });
        removedItems.push('.workspace/ (generated files)');
      } catch {
        // Directory doesn't exist
      }
    }

    // Remove cache (if option enabled)
    if (options.cache) {
      spinner.text = 'Removing cache...';
      try {
        await fs.access(cacheDir);
        await fs.rm(cacheDir, { recursive: true, force: true });
        removedItems.push('.cache/ (cached results)');
      } catch {
        // Directory doesn't exist
      }
    }

    spinner.succeed('Reset complete');

    console.log(chalk.green('\n✅ Claude Code reset to vanilla state\n'));

    if (removedItems.length > 0) {
      console.log(chalk.gray('Removed:'));
      removedItems.forEach((item) => {
        console.log(chalk.gray(`  - ${item}`));
      });
      console.log('');
    } else {
      console.log(chalk.gray('No configurations found to remove.\n'));
    }

    if (options.backup) {
      console.log(
        chalk.gray('💾 Backup created in ~/.claude/backups/ for restore.\n')
      );
    }

    console.log(chalk.cyan('To reconfigure, run: code-assistant-claude init\n'));
  } catch (error) {
    spinner.fail('Reset failed');
    console.error(
      chalk.red('\nError:'),
      error instanceof Error ? error.message : 'Unknown error'
    );
    process.exit(1);
  }
}
