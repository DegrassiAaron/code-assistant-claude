/**
 * Phase 3: Command System - Parameter Parser
 * Parses command-line style parameters and flags
 */

import { CommandParameter } from './types';

export class ParameterParser {
  /**
   * Parses parameters from a command string
   * Supports: positional args, --flags, --key=value, quoted strings
   *
   * Examples:
   *   "feature" --withTests --mode=debug
   *   "user profile" --withTests=true --experts=["porter", "drucker"]
   */
  parseParameters(
    input: string,
    parameterDefs?: CommandParameter[]
  ): { parameters: Record<string, any>; flags: Record<string, boolean | string> } {
    const parameters: Record<string, any> = {};
    const flags: Record<string, boolean | string> = {};

    // Split input respecting quotes
    const tokens = this.tokenize(input);

    let positionalIndex = 0;

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      if (token.startsWith('--')) {
        // Handle flags: --flag or --key=value
        const flagName = token.substring(2);

        if (flagName.includes('=')) {
          const [key, value] = flagName.split('=', 2);
          flags[key] = this.parseValue(value);
        } else {
          // Boolean flag or flag with next token as value
          if (i + 1 < tokens.length && !tokens[i + 1].startsWith('--')) {
            flags[flagName] = this.parseValue(tokens[i + 1]);
            i++; // Skip next token
          } else {
            flags[flagName] = true;
          }
        }
      } else {
        // Positional parameter
        if (parameterDefs && positionalIndex < parameterDefs.length) {
          const paramDef = parameterDefs[positionalIndex];
          parameters[paramDef.name] = this.parseValue(token, paramDef.type);
        } else {
          parameters[`param${positionalIndex}`] = this.parseValue(token);
        }
        positionalIndex++;
      }
    }

    // Apply defaults for missing parameters
    if (parameterDefs) {
      for (const paramDef of parameterDefs) {
        if (!(paramDef.name in parameters) && paramDef.default !== undefined) {
          parameters[paramDef.name] = paramDef.default;
        }

        // Check flags too
        if (!(paramDef.name in flags) && paramDef.default !== undefined) {
          flags[paramDef.name] = paramDef.default;
        }
      }
    }

    return { parameters, flags };
  }

  /**
   * Tokenizes input string, respecting quotes
   */
  private tokenize(input: string): string[] {
    const tokens: string[] = [];
    let current = '';
    let inQuotes = false;
    let quoteChar = '';

    for (let i = 0; i < input.length; i++) {
      const char = input[i];

      if ((char === '"' || char === "'") && !inQuotes) {
        inQuotes = true;
        quoteChar = char;
      } else if (char === quoteChar && inQuotes) {
        inQuotes = false;
        quoteChar = '';
      } else if (char === ' ' && !inQuotes) {
        if (current) {
          tokens.push(current);
          current = '';
        }
      } else {
        current += char;
      }
    }

    if (current) {
      tokens.push(current);
    }

    return tokens;
  }

  /**
   * Parses a value string into the appropriate type
   */
  private parseValue(value: string, expectedType?: string): any {
    // Remove quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    // Try to parse as JSON array or object
    if (value.startsWith('[') || value.startsWith('{')) {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }

    // Type-specific parsing
    if (expectedType === 'number' || (!expectedType && !isNaN(Number(value)))) {
      return Number(value);
    }

    if (expectedType === 'boolean' || value === 'true' || value === 'false') {
      return value === 'true';
    }

    if (expectedType === 'array') {
      // Split by comma if it's a simple array
      return value.split(',').map(v => v.trim());
    }

    return value;
  }

  /**
   * Validates parameters against definitions
   */
  validateParameters(
    parameters: Record<string, any>,
    flags: Record<string, boolean | string>,
    parameterDefs?: CommandParameter[]
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!parameterDefs) {
      return { valid: true, errors: [] };
    }

    for (const paramDef of parameterDefs) {
      const value = parameters[paramDef.name] ?? flags[paramDef.name];

      // Check required parameters
      if (paramDef.required && value === undefined) {
        errors.push(`Missing required parameter: ${paramDef.name}`);
        continue;
      }

      if (value !== undefined) {
        // Type validation
        const actualType = Array.isArray(value) ? 'array' : typeof value;
        const expectedType = paramDef.type;

        if (actualType !== expectedType && !(expectedType === 'number' && actualType === 'number')) {
          errors.push(
            `Parameter ${paramDef.name} has wrong type: expected ${expectedType}, got ${actualType}`
          );
        }

        // Options validation (enum-like)
        if (paramDef.options && !paramDef.options.includes(String(value))) {
          errors.push(
            `Parameter ${paramDef.name} has invalid value: ${value}. Valid options: ${paramDef.options.join(', ')}`
          );
        }
      }
    }

    return { valid: errors.length === 0, errors };
  }
}
