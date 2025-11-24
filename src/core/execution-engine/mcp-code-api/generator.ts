import Handlebars from "handlebars";
import { promises as fs } from "fs";
import path from "path";
import { MCPToolSchema, CodeWrapper } from "../types";

/**
 * Generates TypeScript/Python wrapper code from MCP schemas
 * This is the core of the 98.7% token reduction strategy
 */
export class CodeAPIGenerator {
  private tsTemplate: HandlebarsTemplateDelegate | null = null;
  private pyTemplate: HandlebarsTemplateDelegate | null = null;

  constructor() {
    // Templates will be loaded lazily on first use
    this.registerHandlebarsHelpers();
  }

  /**
   * Generate TypeScript wrapper
   */
  async generateTypeScript(schemas: MCPToolSchema[]): Promise<CodeWrapper> {
    if (!this.tsTemplate) {
      await this.loadTemplates();
    }

    const code = this.tsTemplate!({
      tools: schemas.map((schema) => ({
        name: schema.name,
        description: schema.description,
        methodName: this.toCamelCase(schema.name),
        parameters: schema.parameters,
        returnType: this.toTSType(schema.returns?.type),
        examples: schema.examples || [],
      })),
    });

    return {
      language: "typescript",
      code,
      dependencies: this.extractDependencies(code),
      estimatedTokens: this.estimateTokens(code),
    };
  }

  /**
   * Generate Python wrapper
   */
  async generatePython(schemas: MCPToolSchema[]): Promise<CodeWrapper> {
    if (!this.pyTemplate) {
      await this.loadTemplates();
    }

    const code = this.pyTemplate!({
      tools: schemas.map((schema) => ({
        name: schema.name,
        description: schema.description,
        methodName: this.toSnakeCase(schema.name),
        parameters: schema.parameters,
        returnType: this.toPyType(schema.returns?.type),
        examples: schema.examples || [],
      })),
    });

    return {
      language: "python",
      code,
      dependencies: this.extractPythonDependencies(code),
      estimatedTokens: this.estimateTokens(code),
    };
  }

  /**
   * Load Handlebars templates from filesystem
   */
  private async loadTemplates(): Promise<void> {
    const tsTemplatePath = path.join(
      __dirname,
      "templates/typescript-wrapper.ts.hbs",
    );
    const pyTemplatePath = path.join(
      __dirname,
      "templates/python-wrapper.py.hbs",
    );

    const tsTemplateContent = await fs.readFile(tsTemplatePath, "utf-8");
    const pyTemplateContent = await fs.readFile(pyTemplatePath, "utf-8");

    this.tsTemplate = Handlebars.compile(tsTemplateContent);
    this.pyTemplate = Handlebars.compile(pyTemplateContent);
  }

  /**
   * Register custom Handlebars helpers
   */
  private registerHandlebarsHelpers(): void {
    Handlebars.registerHelper("json", (context: any) => {
      return JSON.stringify(context, null, 2);
    });

    Handlebars.registerHelper("toTSType", (type: string) => {
      return this.toTSType(type);
    });

    Handlebars.registerHelper("toPyType", (type: string) => {
      return this.toPyType(type);
    });
  }

  /**
   * Convert snake_case to camelCase
   */
  private toCamelCase(str: string): string {
    return str.replace(/_([a-z])/g, (_, char) => char.toUpperCase());
  }

  /**
   * Convert camelCase to snake_case
   */
  private toSnakeCase(str: string): string {
    return str
      .replace(/([A-Z])/g, "_$1")
      .toLowerCase()
      .replace(/^_/, "");
  }

  /**
   * Convert MCP type to TypeScript type
   */
  private toTSType(type?: string): string {
    if (!type) return "any";

    const typeMap: Record<string, string> = {
      string: "string",
      number: "number",
      boolean: "boolean",
      array: "any[]",
      object: "Record<string, unknown>",
      null: "null",
      undefined: "undefined",
    };

    return typeMap[type.toLowerCase()] || "any";
  }

  /**
   * Convert MCP type to Python type
   */
  private toPyType(type?: string): string {
    if (!type) return "Any";

    const typeMap: Record<string, string> = {
      string: "str",
      number: "float",
      boolean: "bool",
      array: "List[Any]",
      object: "Dict[str, Any]",
      null: "None",
      undefined: "None",
    };

    return typeMap[type.toLowerCase()] || "Any";
  }

  /**
   * Extract TypeScript dependencies from generated code
   */
  private extractDependencies(code: string): string[] {
    const importRegex = /import .+ from ['"](.+)['"]/g;
    const deps: string[] = [];
    let match;

    while ((match = importRegex.exec(code)) !== null) {
      const dep = match[1];
      // Filter out relative imports
      if (dep && !dep.startsWith(".") && !dep.startsWith("/")) {
        deps.push(dep);
      }
    }

    return [...new Set(deps)]; // Remove duplicates
  }

  /**
   * Extract Python dependencies from generated code
   */
  private extractPythonDependencies(code: string): string[] {
    const importRegex = /(?:from|import)\s+([a-zA-Z0-9_]+)/g;
    const deps: string[] = [];
    let match;

    const stdLibModules = new Set([
      "os",
      "sys",
      "json",
      "typing",
      "asyncio",
      "datetime",
    ]);

    while ((match = importRegex.exec(code)) !== null) {
      const dep = match[1];
      // Filter out standard library modules
      if (dep && !stdLibModules.has(dep)) {
        deps.push(dep);
      }
    }

    return [...new Set(deps)]; // Remove duplicates
  }

  /**
   * Estimate token count for generated code
   * Simple estimation: ~4 characters per token
   */
  private estimateTokens(code: string): number {
    return Math.ceil(code.length / 4);
  }
}
