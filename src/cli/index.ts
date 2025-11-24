import { Command } from "commander";
import chalk from "chalk";
import { initCommand } from "./commands/init";
import { configCommand } from "./commands/config";
import { resetCommand } from "./commands/reset";
import { mcpAddCommand } from "./commands/mcp-add";
import { Logger } from "../core/utils/logger";

const program = new Command();

program
  .name("code-assistant-claude")
  .description(
    "Intelligent framework for Claude Code CLI optimization with 98.7% token reduction",
  )
  .version("0.1.0")
  .option("--debug", "Enable debug mode (maximum verbosity)")
  .option("--verbose", "Enable verbose mode (detailed output)")
  .option("--quiet", "Suppress all non-essential output")
  .option("--timestamps", "Show timestamps in log messages")
  .hook("preAction", (thisCommand) => {
    // Configure logger based on global options
    const opts = thisCommand.opts();

    let level: "silent" | "normal" | "verbose" | "debug" = "normal";
    if (opts.quiet) {
      level = "silent";
    } else if (opts.debug) {
      level = "debug";
    } else if (opts.verbose) {
      level = "verbose";
    }

    Logger.configure({
      level,
      showTimestamps: opts.timestamps || false,
    });

    // Show debug info if debug mode is enabled
    if (level === "debug") {
      const logger = new Logger("CLI");
      logger.debug(`Log level: ${level}`);
      logger.debug(`Timestamps: ${opts.timestamps ? "enabled" : "disabled"}`);
      logger.debug(`Node version: ${process.version}`);
      logger.debug(`CWD: ${process.cwd()}`);
    }
  });

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

// MCP Add command - Add new MCP server with auto-discovery
program
  .command("mcp:add")
  .description("Add new MCP server with automatic configuration")
  .option("--name <name>", "MCP server name from registry")
  .option("--no-test", "Skip connection testing")
  .option("--no-interactive", "Non-interactive mode (use defaults)")
  .action(mcpAddCommand);

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
