/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  MCPToolSchema,
  MCPParameter,
  MCPReturnType,
  MCPExample,
} from "../types";

/**
 * Parses MCP tool schemas from various formats
 */
export class SchemaParser {
  /**
   * Parse MCP schema from JSON
   */
  parseFromJSON(json: string): MCPToolSchema[] {
    try {
      const data = JSON.parse(json);

      // Handle both single schema and array of schemas
      const schemas = Array.isArray(data) ? data : [data];

      return schemas.map((schema) => this.normalizeSchema(schema));
    } catch (error) {
      throw new Error(
        `Failed to parse MCP schema: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  /**
   * Parse MCP schema from object
   */
  parseFromObject(obj: unknown): MCPToolSchema {
    return this.normalizeSchema(obj);
  }

  /**
   * Normalize schema to ensure all required fields are present
   */
  private normalizeSchema(schema: any): MCPToolSchema {
    if (!schema.name || typeof schema.name !== "string") {
      throw new Error('Schema must have a valid "name" field');
    }

    return {
      name: schema.name,
      description: schema.description || "",
      parameters: this.normalizeParameters(
        schema.parameters || schema.params || [],
      ),
      returns: this.normalizeReturnType(schema.returns || schema.return),
      examples: this.normalizeExamples(schema.examples || []),
    };
  }

  /**
   * Normalize parameters array
   */
  private normalizeParameters(params: unknown): MCPParameter[] {
    if (!Array.isArray(params)) {
      // Handle object-style parameters
      if (typeof params === "object" && params !== null) {
        return Object.entries(params).map(([name, config]: [string, any]) => ({
          name,
          type: config.type || "any",
          description: config.description || "",
          required: config.required !== false, // Default to true
          default: config.default,
        }));
      }
      return [];
    }

    return params.map((param) => ({
      name: param.name,
      type: param.type || "any",
      description: param.description || "",
      required: param.required !== false,
      default: param.default,
    }));
  }

  /**
   * Normalize return type
   */
  private normalizeReturnType(returnType: any): MCPReturnType | undefined {
    if (!returnType) return undefined;

    if (typeof returnType === "string") {
      return {
        type: returnType,
        description: "",
      };
    }

    return {
      type: returnType.type || "any",
      description: returnType.description || "",
    };
  }

  /**
   * Normalize examples array
   */
  private normalizeExamples(examples: any): MCPExample[] {
    if (!Array.isArray(examples)) {
      return [];
    }

    return examples.map((example) => ({
      input: example.input || {},
      output: example.output,
      description: example.description || "",
    }));
  }

  /**
   * Validate schema structure
   */
  validateSchema(schema: MCPToolSchema): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!schema.name || schema.name.trim() === "") {
      errors.push("Schema name is required");
    }

    if (!schema.description) {
      errors.push("Schema description is recommended");
    }

    // Validate parameters
    if (schema.parameters) {
      for (const param of schema.parameters) {
        if (!param.name) {
          errors.push("Parameter name is required");
        }
        if (!param.type) {
          errors.push(`Parameter "${param.name}" must have a type`);
        }
      }

      // Check for duplicate parameter names
      const paramNames = schema.parameters.map((p) => p.name);
      const duplicates = paramNames.filter(
        (name, index) => paramNames.indexOf(name) !== index,
      );
      if (duplicates.length > 0) {
        errors.push(`Duplicate parameter names: ${duplicates.join(", ")}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
