/**
 * Phase 3: Command System - Command Executor
 * Executes commands and manages skill/MCP activation with comprehensive security and error handling
 */

import * as fs from "fs/promises";
import * as path from "path";
import {
  Command,
  CommandExecutionContext,
  CommandExecutionResult,
  CommandLoadResult,
  CommandMetadata,
  CommandRegistry,
  CommandCache,
  ParameterValue,
} from "./types";
import { CommandParser } from "./command-parser";
import { CommandValidator } from "./command-validator";
import { Logger, ConsoleLogger } from "./logger";

export class CommandExecutor {
  private static readonly DEFAULT_CATEGORIES = [
    "workflow",
    "superclaude",
    "optimization",
    "git",
  ] as const;

  private commandParser: CommandParser;
  private commandValidator: CommandValidator;
  private commandRegistry: CommandRegistry = {};
  private commandCache: Map<string, CommandCache> = new Map();
  private templatesPath: string;
  private logger: Logger;
  private categories: readonly string[];

  constructor(
    templatesPath: string = "templates/commands",
    logger?: Logger,
    categories?: readonly string[],
  ) {
    this.commandParser = new CommandParser();
    this.commandValidator = new CommandValidator();
    this.templatesPath = templatesPath;
    this.logger = logger || new ConsoleLogger();
    this.categories = categories || CommandExecutor.DEFAULT_CATEGORIES;
  }

  /**
   * Loads a command from a markdown file with caching
   */
  async loadCommand(
    commandPath: string,
    useCache: boolean = true,
  ): Promise<CommandLoadResult> {
    this.logger.info("Loading command", { path: commandPath });

    try {
      // Check cache if enabled
      if (useCache) {
        const cached = this.commandCache.get(commandPath);
        if (cached) {
          const stats = await fs.stat(commandPath);
          if (stats.mtimeMs === cached.mtime) {
            this.logger.debug("Using cached command", { path: commandPath });
            return { success: true, command: cached.command };
          }
        }
      }

      const content = await fs.readFile(commandPath, "utf-8");
      const stats = await fs.stat(commandPath);

      // Extract metadata from frontmatter
      const metadata = this.parseCommandMetadata(content);
      if (!metadata) {
        const error = "Failed to parse command metadata";
        this.logger.error(error, undefined, { path: commandPath });
        return {
          success: false,
          error,
        };
      }

      const command: Command = {
        metadata,
        content,
        loaded: true,
      };

      // Validate command
      const validation =
        this.commandValidator.validateCommandDefinition(command);
      if (!validation.valid) {
        const error = `Invalid command: ${validation.errors.join(", ")}`;
        this.logger.error(error, undefined, {
          path: commandPath,
          errors: validation.errors.join("; "),
        });
        return {
          success: false,
          error,
        };
      }

      // Register command and update cache
      this.commandRegistry[metadata.name] = command;
      this.commandCache.set(commandPath, {
        command,
        mtime: stats.mtimeMs,
      });

      this.logger.info("Command loaded successfully", {
        name: metadata.name,
        path: commandPath,
      });

      return {
        success: true,
        command,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      this.logger.error(
        "Failed to load command",
        error instanceof Error ? error : undefined,
        {
          path: commandPath,
          message: errorMessage,
        },
      );

      return {
        success: false,
        error: `Failed to load command: ${errorMessage}`,
      };
    }
  }

  /**
   * Loads all commands from the templates directory
   */
  async loadAllCommands(): Promise<{ loaded: number; failed: string[] }> {
    let loaded = 0;
    const failed: string[] = [];

    for (const category of this.categories) {
      const categoryPath = path.join(this.templatesPath, category);

      try {
        const files = await fs.readdir(categoryPath);

        for (const file of files) {
          if (file.endsWith(".md")) {
            const commandPath = path.join(categoryPath, file);
            const result = await this.loadCommand(commandPath);

            if (result.success) {
              loaded++;
            } else {
              const errorMsg = `${category}/${file}: ${result.error}`;
              failed.push(errorMsg);
              this.logger.warn("Failed to load command file", {
                error: errorMsg,
              });
            }
          }
        }
      } catch (error) {
        // Category directory might not exist yet
        this.logger.warn(`Failed to load category ${category}`, {
          error: error instanceof Error ? error.message : String(error),
        });
        continue;
      }
    }

    this.logger.info("Commands loaded", { loaded, failed: failed.length });

    return { loaded, failed };
  }

  /**
   * Executes a command
   */
  async execute(
    context: CommandExecutionContext,
  ): Promise<CommandExecutionResult> {
    const startTime = Date.now();

    try {
      this.logger.info("Executing command", { command: context.command });

      // Parse command
      const parsed = this.commandParser.parse(context.command);
      if (!parsed) {
        return {
          success: false,
          error: "Invalid command syntax",
          activatedSkills: [],
          activatedMCPs: [],
          activatedAgents: [],
          tokensUsed: 0,
          executionTime: Date.now() - startTime,
        };
      }

      // Find command in registry
      const command = this.findCommand(parsed.commandName);
      if (!command) {
        const error = `Command not found: ${parsed.commandName}`;
        this.logger.warn(error);
        return {
          success: false,
          error,
          activatedSkills: [],
          activatedMCPs: [],
          activatedAgents: [],
          tokensUsed: 0,
          executionTime: Date.now() - startTime,
        };
      }

      // Validate execution
      const validation = this.commandValidator.validateExecution(
        command,
        parsed,
      );

      if (!validation.valid) {
        const error = `Validation failed: ${validation.errors.join(", ")}`;
        this.logger.warn(error, { command: command.metadata.name });
        return {
          success: false,
          error,
          activatedSkills: [],
          activatedMCPs: [],
          activatedAgents: [],
          tokensUsed: 0,
          executionTime: Date.now() - startTime,
        };
      }

      // Prepare execution output
      const output = this.prepareCommandOutput(command, parsed, context);

      const executionTime = Date.now() - startTime;

      this.logger.info("Command executed successfully", {
        command: command.metadata.name,
        executionTime,
      });

      return {
        success: true,
        output,
        activatedSkills: command.metadata.requires?.skills || [],
        activatedMCPs: command.metadata.requires?.mcps || [],
        activatedAgents: command.metadata.requires?.agents || [],
        tokensUsed: command.metadata.tokenEstimate,
        executionTime,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      this.logger.error(
        "Command execution failed",
        error instanceof Error ? error : undefined,
        { command: context.command },
      );

      return {
        success: false,
        error: `Execution failed: ${errorMessage}`,
        activatedSkills: [],
        activatedMCPs: [],
        activatedAgents: [],
        tokensUsed: 0,
        executionTime: Date.now() - startTime,
      };
    }
  }

  /**
   * Finds a command by name or alias
   */
  private findCommand(commandName: string): Command | null {
    // Direct lookup
    if (this.commandRegistry[commandName]) {
      return this.commandRegistry[commandName];
    }

    // Search by alias
    for (const command of Object.values(this.commandRegistry)) {
      if (command.metadata.triggers.aliases?.includes(`/${commandName}`)) {
        return command;
      }
    }

    return null;
  }

  /**
   * Parses command metadata from markdown frontmatter
   * Uses a safe subset of YAML parsing with runtime validation
   */
  private parseCommandMetadata(content: string): CommandMetadata | null {
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch || !frontmatterMatch[1]) {
      this.logger.warn("No frontmatter found in command file");
      return null;
    }

    try {
      // Parse YAML-like frontmatter (safe subset)
      const frontmatter = frontmatterMatch[1];
      const metadata = this.parseYAMLSubset(frontmatter);

      // Runtime validation
      if (!this.validateMetadata(metadata)) {
        this.logger.error("Metadata validation failed");
        return null;
      }

      return metadata as CommandMetadata;
    } catch (error) {
      this.logger.error(
        "Failed to parse command metadata",
        error instanceof Error ? error : undefined,
      );
      return null;
    }
  }

  /**
   * Safe YAML subset parser (only handles simple key-value, arrays, and nested objects)
   */
  private parseYAMLSubset(yaml: string): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    const lines = yaml.split("\n");
    const stack: Array<{ obj: Record<string, unknown>; indent: number }> = [
      { obj: result, indent: -1 },
    ];

    let currentKey = "";
    let currentArray: unknown[] | null = null;

    for (const line of lines) {
      if (line.trim() === "" || line.trim().startsWith("#")) {
        continue;
      }

      const indent = line.search(/\S/);
      const trimmed = line.trim();

      // Pop stack if we've decreased indentation
      while (
        stack.length > 1 &&
        stack[stack.length - 1] &&
        indent <= (stack[stack.length - 1]?.indent || 0)
      ) {
        stack.pop();
        currentArray = null;
      }

      const stackTop = stack[stack.length - 1];
      if (!stackTop) continue;

      const current = stackTop.obj;

      if (trimmed.startsWith("-")) {
        // Array item
        const value = trimmed.substring(1).trim();
        if (!currentArray && currentKey) {
          currentArray = [];
          current[currentKey] = currentArray;
        }
        if (currentArray) {
          currentArray.push(this.parseYAMLValue(value));
        }
      } else if (trimmed.includes(":")) {
        currentArray = null;
        const colonIndex = trimmed.indexOf(":");
        const key = trimmed.substring(0, colonIndex).trim();
        const value = trimmed.substring(colonIndex + 1).trim();

        currentKey = key;

        if (value) {
          current[key] = this.parseYAMLValue(value);
        } else {
          // Nested object
          const nested: Record<string, unknown> = {};
          current[key] = nested;
          stack.push({ obj: nested, indent });
        }
      }
    }

    return result;
  }

  /**
   * Parse a YAML value
   */
  private parseYAMLValue(value: string): unknown {
    if (value === "true") return true;
    if (value === "false") return false;
    if (value === "null") return null;
    if (!isNaN(Number(value)) && value.trim()) return Number(value);
    if (value.startsWith('"') && value.endsWith('"')) {
      return value.slice(1, -1);
    }
    if (value.startsWith("[") && value.endsWith("]")) {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    return value;
  }

  /**
   * Runtime validation of metadata structure
   */
  private validateMetadata(metadata: unknown): metadata is CommandMetadata {
    if (typeof metadata !== "object" || metadata === null) {
      return false;
    }

    const m = metadata as Record<string, unknown>;

    return (
      typeof m.name === "string" &&
      typeof m.description === "string" &&
      typeof m.category === "string" &&
      ["workflow", "superclaude", "optimization", "git"].includes(
        m.category as string,
      ) &&
      typeof m.version === "string" &&
      typeof m.triggers === "object" &&
      typeof m.autoExecute === "boolean" &&
      typeof m.tokenEstimate === "number" &&
      typeof m.executionTime === "string"
    );
  }

  /**
   * Escapes special regex characters
   */
  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  /**
   * Prepares the command output for execution with safe regex replacement
   */
  private prepareCommandOutput(
    command: Command,
    parsed: {
      parameters: Record<string, ParameterValue>;
      flags: Record<string, boolean | string | ParameterValue>;
    },
    context: CommandExecutionContext,
  ): string {
    let output = command.content;

    // Remove frontmatter
    output = output.replace(/^---\n[\s\S]*?\n---\n/, "");

    // Replace parameter placeholders - FIX: Escape regex special characters
    for (const [key, value] of Object.entries(parsed.parameters)) {
      const escapedKey = this.escapeRegex(key);
      output = output.replace(
        new RegExp(`\\{${escapedKey}\\}`, "g"),
        String(value),
      );
    }

    for (const [key, value] of Object.entries(parsed.flags)) {
      const escapedKey = this.escapeRegex(key);
      output = output.replace(
        new RegExp(`\\{${escapedKey}\\}`, "g"),
        String(value),
      );
    }

    // Add execution context
    output += `\n\n## Execution Context\n`;
    output += `- Command: ${context.command}\n`;
    output += `- Parameters: ${JSON.stringify(parsed.parameters)}\n`;
    output += `- Flags: ${JSON.stringify(parsed.flags)}\n`;

    if (command.metadata.requires?.skills) {
      output += `\n## Required Skills\n`;
      for (const skill of command.metadata.requires.skills) {
        output += `- ${skill}\n`;
      }
    }

    if (command.metadata.requires?.mcps) {
      output += `\n## Required MCPs\n`;
      for (const mcp of command.metadata.requires.mcps) {
        output += `- ${mcp}\n`;
      }
    }

    return output;
  }

  /**
   * Unloads a command from registry and cache
   */
  unloadCommand(name: string): boolean {
    if (this.commandRegistry[name]) {
      delete this.commandRegistry[name];
      this.logger.info("Command unloaded", { name });

      // Also remove from cache
      for (const [path, cached] of this.commandCache.entries()) {
        if (cached.command.metadata.name === name) {
          this.commandCache.delete(path);
          break;
        }
      }

      return true;
    }
    return false;
  }

  /**
   * Clears all loaded commands and cache
   */
  clearRegistry(): void {
    const count = Object.keys(this.commandRegistry).length;
    this.commandRegistry = {};
    this.commandCache.clear();
    this.logger.info("Registry cleared", { commandsCleared: count });
  }

  /**
   * Gets all registered commands
   */
  getCommands(): CommandRegistry {
    return this.commandRegistry;
  }

  /**
   * Gets a specific command
   */
  getCommand(name: string): Command | null {
    return this.findCommand(name);
  }

  /**
   * Lists all available commands by category
   */
  listCommands(): Record<string, string[]> {
    const byCategory: Record<string, string[]> = {};

    // Initialize all categories
    for (const cat of this.categories) {
      byCategory[cat] = [];
    }

    for (const command of Object.values(this.commandRegistry)) {
      const category = command.metadata.category;
      if (category && byCategory[category]) {
        byCategory[category]?.push(command.metadata.name);
      }
    }

    return byCategory;
  }

  /**
   * Gets cache statistics
   */
  getCacheStats(): { size: number; commands: string[] } {
    return {
      size: this.commandCache.size,
      commands: Array.from(this.commandCache.values()).map(
        (c) => c.command.metadata.name,
      ),
    };
  }
}
