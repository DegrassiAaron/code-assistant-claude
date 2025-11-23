#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import { initCommand } from "./commands/init";
import { configCommand } from "./commands/config";
import { resetCommand } from "./commands/reset";

const program = new Command();

program
  .name("code-assistant-claude")
  .description(
    "Intelligent framework for Claude Code CLI optimization with 98.7% token reduction",
  )
  .version("0.1.0");

// Init command - Initial setup
program
  .command("init")
  .description("Initialize code-assistant-claude in current project")
  .option("--dry-run", "Preview changes without applying")
  .option("--local", "Install to project .claude/ only")
  .option("--global", "Install to ~/.claude/ only")
  .option("--force", "Overwrite existing configuration")
  .action(initCommand);

// Config command - Manage configuration
program
  .command("config")
  .description("Manage code-assistant-claude configuration")
  .option("--list", "List current configuration")
  .option("--set <key=value>", "Set configuration value")
  .option("--get <key>", "Get configuration value")
  .action(configCommand);

// Reset command - Reset to vanilla state
program
  .command("reset")
  .description("Reset Claude Code to vanilla state")
  .option("--backup", "Create backup before reset (default: true)")
  .option("--no-backup", "Skip backup creation")
  .action(resetCommand);

// Global error handler
program.exitOverride((err) => {
  if (err.code === "commander.help") {
    process.exit(0);
  }
  console.error(chalk.red("Error:"), err.message);
  process.exit(1);
});

// Parse arguments
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
