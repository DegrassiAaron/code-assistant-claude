/**
 * Phase 3: Command System - Command Executor
 * Executes commands and manages skill/MCP activation
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import {
  Command,
  CommandExecutionContext,
  CommandExecutionResult,
  CommandLoadResult,
  CommandMetadata,
  CommandRegistry,
} from './types';
import { CommandParser } from './command-parser';
import { CommandValidator } from './command-validator';

export class CommandExecutor {
  private commandParser: CommandParser;
  private commandValidator: CommandValidator;
  private commandRegistry: CommandRegistry = {};
  private templatesPath: string;

  constructor(templatesPath: string = 'templates/commands') {
    this.commandParser = new CommandParser();
    this.commandValidator = new CommandValidator();
    this.templatesPath = templatesPath;
  }

  /**
   * Loads a command from a markdown file
   */
  async loadCommand(commandPath: string): Promise<CommandLoadResult> {
    try {
      const content = await fs.readFile(commandPath, 'utf-8');

      // Extract metadata from frontmatter
      const metadata = this.parseCommandMetadata(content);
      if (!metadata) {
        return {
          success: false,
          error: 'Failed to parse command metadata',
        };
      }

      const command: Command = {
        metadata,
        content,
        loaded: true,
      };

      // Validate command
      const validation = this.commandValidator.validateCommandDefinition(command);
      if (!validation.valid) {
        return {
          success: false,
          error: `Invalid command: ${validation.errors.join(', ')}`,
        };
      }

      // Register command
      this.commandRegistry[metadata.name] = command;

      return {
        success: true,
        command,
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to load command: ${error}`,
      };
    }
  }

  /**
   * Loads all commands from the templates directory
   */
  async loadAllCommands(): Promise<{ loaded: number; failed: string[] }> {
    let loaded = 0;
    const failed: string[] = [];

    const categories = ['workflow', 'superclaude', 'optimization', 'git'];

    for (const category of categories) {
      const categoryPath = path.join(this.templatesPath, category);

      try {
        const files = await fs.readdir(categoryPath);

        for (const file of files) {
          if (file.endsWith('.md')) {
            const commandPath = path.join(categoryPath, file);
            const result = await this.loadCommand(commandPath);

            if (result.success) {
              loaded++;
            } else {
              failed.push(`${category}/${file}: ${result.error}`);
            }
          }
        }
      } catch (error) {
        // Category directory might not exist yet
        continue;
      }
    }

    return { loaded, failed };
  }

  /**
   * Executes a command
   */
  async execute(context: CommandExecutionContext): Promise<CommandExecutionResult> {
    const startTime = Date.now();

    try {
      // Parse command
      const parsed = this.commandParser.parse(context.command);
      if (!parsed) {
        return {
          success: false,
          error: 'Invalid command syntax',
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
        return {
          success: false,
          error: `Command not found: ${parsed.commandName}`,
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
        parsed
      );

      if (!validation.valid) {
        return {
          success: false,
          error: `Validation failed: ${validation.errors.join(', ')}`,
          activatedSkills: [],
          activatedMCPs: [],
          activatedAgents: [],
          tokensUsed: 0,
          executionTime: Date.now() - startTime,
        };
      }

      // Prepare execution output
      const output = this.prepareCommandOutput(command, parsed, context);

      return {
        success: true,
        output,
        activatedSkills: command.metadata.requires?.skills || [],
        activatedMCPs: command.metadata.requires?.mcps || [],
        activatedAgents: command.metadata.requires?.agents || [],
        tokensUsed: command.metadata.tokenEstimate,
        executionTime: Date.now() - startTime,
      };
    } catch (error) {
      return {
        success: false,
        error: `Execution failed: ${error}`,
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
   */
  private parseCommandMetadata(content: string): CommandMetadata | null {
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) {
      return null;
    }

    try {
      // Parse YAML-like frontmatter
      const frontmatter = frontmatterMatch[1];
      const metadata: any = {};

      const lines = frontmatter.split('\n');
      let currentKey = '';
      let currentObject: any = metadata;
      let indent = 0;

      for (const line of lines) {
        if (line.trim() === '') continue;

        const lineIndent = line.search(/\S/);
        const trimmed = line.trim();

        if (trimmed.startsWith('-')) {
          // Array item
          const value = trimmed.substring(1).trim();
          if (!Array.isArray(currentObject[currentKey])) {
            currentObject[currentKey] = [];
          }
          currentObject[currentKey].push(this.parseValue(value));
        } else if (trimmed.includes(':')) {
          const [key, ...valueParts] = trimmed.split(':');
          const value = valueParts.join(':').trim();

          if (lineIndent > indent) {
            // Nested object
            currentObject = currentObject[currentKey];
          } else if (lineIndent < indent) {
            // Back to parent
            currentObject = metadata;
          }

          currentKey = key.trim();
          if (value) {
            currentObject[currentKey] = this.parseValue(value);
          } else {
            currentObject[currentKey] = {};
          }

          indent = lineIndent;
        }
      }

      return metadata as CommandMetadata;
    } catch (error) {
      return null;
    }
  }

  /**
   * Parses a value from YAML-like format
   */
  private parseValue(value: string): any {
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (!isNaN(Number(value))) return Number(value);
    if (value.startsWith('"') && value.endsWith('"')) {
      return value.slice(1, -1);
    }
    if (value.startsWith('[') && value.endsWith(']')) {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    return value;
  }

  /**
   * Prepares the command output for execution
   */
  private prepareCommandOutput(
    command: Command,
    parsed: any,
    context: CommandExecutionContext
  ): string {
    let output = command.content;

    // Remove frontmatter
    output = output.replace(/^---\n[\s\S]*?\n---\n/, '');

    // Replace parameter placeholders
    for (const [key, value] of Object.entries(parsed.parameters)) {
      output = output.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
    }

    for (const [key, value] of Object.entries(parsed.flags)) {
      output = output.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
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
    const byCategory: Record<string, string[]> = {
      workflow: [],
      superclaude: [],
      optimization: [],
      git: [],
    };

    for (const command of Object.values(this.commandRegistry)) {
      byCategory[command.metadata.category].push(command.metadata.name);
    }

    return byCategory;
  }
}
