/**
 * Phase 3: Command System - Command Parser
 * Parses slash command syntax and extracts command name and arguments
 */

import { ParsedCommand } from './types';
import { ParameterParser } from './parameter-parser';

export class CommandParser {
  private parameterParser: ParameterParser;

  constructor() {
    this.parameterParser = new ParameterParser();
  }

  /**
   * Parses a command string into structured format
   *
   * Supported formats:
   *   /sc:implement "feature name" --withTests
   *   /implement feature --withTests=true --mode=debug
   *   /business-panel @doc.pdf --mode discussion
   *
   * Returns null if input is not a command
   */
  parse(input: string): ParsedCommand | null {
    const trimmed = input.trim();

    // Check if it starts with a slash (command trigger)
    if (!trimmed.startsWith('/')) {
      return null;
    }

    // Extract command name and arguments
    const spaceIndex = trimmed.indexOf(' ');
    let commandPart: string;
    let argsPart: string;

    if (spaceIndex === -1) {
      commandPart = trimmed;
      argsPart = '';
    } else {
      commandPart = trimmed.substring(0, spaceIndex);
      argsPart = trimmed.substring(spaceIndex + 1).trim();
    }

    // Parse command name (remove leading slash)
    let commandName = commandPart.substring(1);

    // Handle /sc:command-name syntax
    if (commandName.startsWith('sc:')) {
      commandName = commandName.substring(3);
    }

    // Parse parameters and flags
    const { parameters, flags } = this.parameterParser.parseParameters(argsPart);

    return {
      commandName,
      rawInput: input,
      parameters,
      flags,
    };
  }

  /**
   * Checks if input matches any command trigger
   * Supports exact matches, aliases, and keywords
   */
  matchesCommand(
    input: string,
    exactTrigger: string,
    aliases?: string[],
    keywords?: string[]
  ): boolean {
    const parsed = this.parse(input);
    if (!parsed) {
      return false;
    }

    const commandName = parsed.commandName.toLowerCase();

    // Check exact trigger (remove /sc: prefix)
    const exactName = exactTrigger.replace(/^\/sc:/, '').toLowerCase();
    if (commandName === exactName) {
      return true;
    }

    // Check aliases
    if (aliases) {
      for (const alias of aliases) {
        const aliasName = alias.replace(/^\//, '').toLowerCase();
        if (commandName === aliasName) {
          return true;
        }
      }
    }

    // Check keywords (partial match in raw input)
    if (keywords) {
      const lowerInput = input.toLowerCase();
      for (const keyword of keywords) {
        if (lowerInput.includes(keyword.toLowerCase())) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Extracts command name from various formats
   */
  extractCommandName(input: string): string | null {
    const parsed = this.parse(input);
    return parsed ? parsed.commandName : null;
  }

  /**
   * Checks if a string looks like a command
   */
  isCommand(input: string): boolean {
    return input.trim().startsWith('/');
  }

  /**
   * Formats a command for display
   */
  formatCommand(command: string, parameters?: Record<string, any>): string {
    let formatted = `/${command}`;

    if (parameters) {
      for (const [key, value] of Object.entries(parameters)) {
        if (typeof value === 'boolean') {
          if (value) {
            formatted += ` --${key}`;
          }
        } else if (typeof value === 'string') {
          formatted += ` --${key}="${value}"`;
        } else {
          formatted += ` --${key}=${JSON.stringify(value)}`;
        }
      }
    }

    return formatted;
  }
}
