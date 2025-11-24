/**
 * Phase 3: Command System - Parameter Parser
 * Parses command-line style parameters and flags with security hardening
 */

import { CommandParameter, ParameterValue } from "./types";

const MAX_JSON_SIZE = 10000;
const MAX_JSON_DEPTH = 10;

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
    parameterDefs?: CommandParameter[],
  ): {
    parameters: Record<string, ParameterValue>;
    flags: Record<string, boolean | string | ParameterValue>;
  } {
    const parameters: Record<string, ParameterValue> = {};
    const flags: Record<string, boolean | string | ParameterValue> = {};

    // Split input respecting quotes
    const tokens = this.tokenize(input);

    let positionalIndex = 0;

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (!token) continue;

      if (token.startsWith("--")) {
        // Handle flags: --flag or --key=value
        const flagName = token.substring(2);

        if (flagName.includes("=")) {
          const [key, value] = flagName.split("=", 2);
          if (key && value !== undefined) {
            flags[key] = this.parseValue(value);
          }
        } else {
          // Boolean flag or flag with next token as value
          const nextToken = tokens[i + 1];
          if (
            i + 1 < tokens.length &&
            nextToken &&
            !nextToken.startsWith("--")
          ) {
            flags[flagName] = this.parseValue(nextToken);
            i++; // Skip next token
          } else {
            flags[flagName] = true;
          }
        }
      } else {
        // Positional parameter
        if (parameterDefs && positionalIndex < parameterDefs.length) {
          const paramDef = parameterDefs[positionalIndex];
          if (paramDef && paramDef.name) {
            parameters[paramDef.name] = this.parseValue(
              token,
              paramDef.type || "string",
            );
          }
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
   * Tokenizes input string, respecting quotes and escaped characters
   */
  private tokenize(input: string): string[] {
    const tokens: string[] = [];
    let current = "";
    let inQuotes = false;
    let quoteChar = "";
    let escaped = false;
    let wasQuoted = false;

    for (let i = 0; i < input.length; i++) {
      const char = input[i];

      if (escaped) {
        // Add escaped character literally
        current += char;
        escaped = false;
        continue;
      }

      if (char === "\\") {
        // Next character is escaped
        escaped = true;
        continue;
      }

      if ((char === '"' || char === "'") && !inQuotes) {
        inQuotes = true;
        quoteChar = char;
        wasQuoted = true;
      } else if (char === quoteChar && inQuotes) {
        inQuotes = false;
        quoteChar = "";
        // Keep wasQuoted true - we'll check it when adding token
      } else if (char === " " && !inQuotes) {
        // Add token if it has content OR if it was a quoted empty string
        if (current || wasQuoted) {
          tokens.push(current);
          current = "";
          wasQuoted = false;
        }
      } else {
        current += char;
      }
    }

    // Add final token if it has content OR if it was quoted
    if (current || wasQuoted) {
      tokens.push(current);
    }

    return tokens;
  }

  /**
   * Parses a value string into the appropriate type with security checks
   */
  private parseValue(value: string, expectedType?: string): ParameterValue {
    // Remove quotes if present
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    // Security: Check size before parsing JSON
    if (value.startsWith("[") || value.startsWith("{")) {
      if (value.length > MAX_JSON_SIZE) {
        throw new Error(
          `JSON value too large (max ${MAX_JSON_SIZE} characters)`,
        );
      }

      try {
        const parsed = JSON.parse(value);

        // Security: Validate depth
        const depth = this.getObjectDepth(parsed);
        if (depth > MAX_JSON_DEPTH) {
          throw new Error(
            `JSON structure too deep (max depth ${MAX_JSON_DEPTH})`,
          );
        }

        return parsed as ParameterValue;
      } catch (error) {
        // If JSON parsing fails, return as string
        if (error instanceof Error && error.message.includes("JSON")) {
          throw error; // Re-throw our security errors
        }
        return value;
      }
    }

    // Type-specific parsing
    // Fix: Check for empty/whitespace strings before parsing as number
    if (
      expectedType === "number" ||
      (!expectedType && value.trim() && !isNaN(Number(value)))
    ) {
      const num = Number(value);
      // Additional check: ensure it's a valid number
      if (!isNaN(num) && isFinite(num)) {
        return num;
      }
    }

    if (expectedType === "boolean" || value === "true" || value === "false") {
      return value === "true";
    }

    if (expectedType === "array") {
      // Split by comma if it's a simple array
      return value.split(",").map((v) => v.trim());
    }

    return value;
  }

  /**
   * Calculates the depth of a nested object/array
   */
  private getObjectDepth(obj: unknown, currentDepth: number = 0): number {
    // Security: Prevent stack overflow
    if (currentDepth > MAX_JSON_DEPTH) {
      return currentDepth;
    }

    if (typeof obj !== "object" || obj === null) {
      return currentDepth;
    }

    if (Array.isArray(obj)) {
      if (obj.length === 0) {
        return currentDepth + 1;
      }
      return (
        1 +
        Math.max(
          ...obj.map((item) => this.getObjectDepth(item, currentDepth + 1)),
        )
      );
    }

    const values = Object.values(obj);
    if (values.length === 0) {
      return currentDepth + 1;
    }

    return (
      1 +
      Math.max(
        ...values.map((value) => this.getObjectDepth(value, currentDepth + 1)),
      )
    );
  }

  /**
   * Validates parameters against definitions
   */
  validateParameters(
    parameters: Record<string, ParameterValue>,
    flags: Record<string, boolean | string | ParameterValue>,
    parameterDefs?: CommandParameter[],
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
        // Type validation - Fixed logic
        const actualType = Array.isArray(value) ? "array" : typeof value;
        const expectedType = paramDef.type;

        const isValidType =
          actualType === expectedType ||
          (expectedType === "number" &&
            typeof value === "number" &&
            !isNaN(value));

        if (!isValidType) {
          errors.push(
            `Parameter ${paramDef.name} has wrong type: expected ${expectedType}, got ${actualType}`,
          );
        }

        // Options validation (enum-like)
        if (paramDef.options && !paramDef.options.includes(String(value))) {
          errors.push(
            `Parameter ${paramDef.name} has invalid value: ${value}. Valid options: ${paramDef.options.join(", ")}`,
          );
        }
      }
    }

    return { valid: errors.length === 0, errors };
  }
}
