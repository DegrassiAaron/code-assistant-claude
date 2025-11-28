/* eslint-disable @typescript-eslint/no-explicit-any */
import Handlebars from 'handlebars';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MCPToolSchema, CodeWrapper } from '../types';

// Get directory of this module (works in both ESM and bundled code)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
      language: 'typescript',
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
      language: 'python',
      code,
      dependencies: this.extractPythonDependencies(code),
      estimatedTokens: this.estimateTokens(code),
    };
  }

  /**
   * Load Handlebars templates from filesystem
   */
  private async loadTemplates(): Promise<void> {
    // When tsup bundles, __dirname is the dist/cli or dist/core directory
    // Templates are copied to dist/{cli|core}/execution-engine/mcp-code-api/templates/
    const possibleBasePaths = [
      // From dist/cli bundle (most common case)
      path.join(__dirname, 'execution-engine/mcp-code-api/templates'),
      // From dist/core bundle
      path.join(__dirname, '../core/execution-engine/mcp-code-api/templates'),
      // Development (cwd = repo root)
      path.join(process.cwd(), 'dist/core/execution-engine/mcp-code-api/templates'),
      path.join(process.cwd(), 'dist/cli/execution-engine/mcp-code-api/templates'),
      path.join(process.cwd(), 'src/core/execution-engine/mcp-code-api/templates'),
      // npm install paths
      path.join(process.cwd(), 'node_modules/code-assistant-claude/dist/core/execution-engine/mcp-code-api/templates'),
      path.join(process.cwd(), 'node_modules/code-assistant-claude/dist/cli/execution-engine/mcp-code-api/templates'),
    ];

    let tsTemplateContent: string | null = null;
    let pyTemplateContent: string | null = null;

    for (const basePath of possibleBasePaths) {
      try {
        const tsPath = path.join(basePath, 'typescript-wrapper.ts.hbs');
        const pyPath = path.join(basePath, 'python-wrapper.py.hbs');

        tsTemplateContent = await fs.readFile(tsPath, 'utf-8');
        pyTemplateContent = await fs.readFile(pyPath, 'utf-8');
        break; // Success, stop trying
      } catch {
        // Try next path
      }
    }

    if (!tsTemplateContent || !pyTemplateContent) {
      throw new Error(
        'Could not find MCP code generation templates. Tried paths: ' +
          possibleBasePaths.join(', ')
      );
    }

    this.tsTemplate = Handlebars.compile(tsTemplateContent);
    this.pyTemplate = Handlebars.compile(pyTemplateContent);
  }

  /**
   * Register custom Handlebars helpers
   */
  private registerHandlebarsHelpers(): void {
    Handlebars.registerHelper('json', (context: any) => {
      return JSON.stringify(context, null, 2);
    });

    Handlebars.registerHelper('toTSType', (type: string) => {
      return this.toTSType(type);
    });

    Handlebars.registerHelper('toPyType', (type: string) => {
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
      .replace(/([A-Z])/g, '_$1')
      .toLowerCase()
      .replace(/^_/, '');
  }

  /**
   * Convert MCP type to TypeScript type
   */
  private toTSType(type?: string): string {
    if (!type) return 'any';

    const typeMap: Record<string, string> = {
      string: 'string',
      number: 'number',
      boolean: 'boolean',
      array: 'any[]',
      object: 'Record<string, unknown>',
      null: 'null',
      undefined: 'undefined',
    };

    return typeMap[type.toLowerCase()] || 'any';
  }

  /**
   * Convert MCP type to Python type
   */
  private toPyType(type?: string): string {
    if (!type) return 'Any';

    const typeMap: Record<string, string> = {
      string: 'str',
      number: 'float',
      boolean: 'bool',
      array: 'List[Any]',
      object: 'Dict[str, Any]',
      null: 'None',
      undefined: 'None',
    };

    return typeMap[type.toLowerCase()] || 'Any';
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
      if (dep && !dep.startsWith('.') && !dep.startsWith('/')) {
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
      'os',
      'sys',
      'json',
      'typing',
      'asyncio',
      'datetime',
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
