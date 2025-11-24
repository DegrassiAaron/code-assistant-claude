import { promises as fs } from 'fs';
import { glob } from 'glob';
import { MCPToolSchema, DiscoveredTool } from '../types';
import { SchemaParser } from '../mcp-code-api/schema-parser';

/**
 * Discovers MCP tools from filesystem
 * Progressive discovery: load only what's needed
 */
export class FilesystemDiscovery {
  private toolsDir: string;
  private index: Map<string, MCPToolSchema> = new Map();
  private schemaParser: SchemaParser;
  private indexed: boolean = false;

  constructor(toolsDir: string) {
    this.toolsDir = toolsDir;
    this.schemaParser = new SchemaParser();
  }

  /**
   * Index all MCP tool definitions
   */
  async indexTools(): Promise<void> {
    if (this.indexed) {
      return; // Already indexed
    }

    const toolFiles = await glob('**/*.json', {
      cwd: this.toolsDir,
      absolute: true,
    });

    for (const toolFile of toolFiles) {
      try {
        const content = await fs.readFile(toolFile, 'utf-8');
        const tools = this.schemaParser.parseFromJSON(content);

        for (const tool of tools) {
          this.index.set(tool.name, tool);
        }
      } catch (error) {
        console.warn(`Failed to index tools from ${toolFile}:`, error);
      }
    }

    this.indexed = true;
    console.log(
      `✓ Indexed ${this.index.size} MCP tools from ${toolFiles.length} files`
    );
  }

  /**
   * Search tools by keywords
   */
  search(keywords: string[]): DiscoveredTool[] {
    if (!this.indexed) {
      throw new Error('Tools not indexed. Call indexTools() first.');
    }

    const results: DiscoveredTool[] = [];

    for (const [name, schema] of this.index) {
      const relevance = this.calculateRelevance(schema, keywords);

      if (relevance > 0.3) {
        results.push({
          name,
          description: schema.description,
          relevanceScore: relevance,
          schema,
        });
      }
    }

    // Sort by relevance (descending)
    return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  /**
   * Get tool by exact name
   */
  get(name: string): MCPToolSchema | undefined {
    return this.index.get(name);
  }

  /**
   * Get all indexed tools
   */
  getAll(): MCPToolSchema[] {
    return Array.from(this.index.values());
  }

  /**
   * Get tools by category
   */
  getByCategory(_category: string): MCPToolSchema[] {
    // Category is inferred from file path
    // e.g., templates/mcp-tools/tech-specific/javascript/*.json
    return this.getAll(); // Simplified - would need category metadata
  }

  /**
   * Calculate relevance score (0-1)
   */
  private calculateRelevance(
    schema: MCPToolSchema,
    keywords: string[]
  ): number {
    const text = `${schema.name} ${schema.description}`.toLowerCase();
    let matches = 0;
    let exactMatches = 0;

    for (const keyword of keywords) {
      const lowerKeyword = keyword.toLowerCase();

      // Exact match in name (highest weight)
      if (schema.name.toLowerCase().includes(lowerKeyword)) {
        exactMatches++;
        matches++;
      }
      // Match in description
      else if (text.includes(lowerKeyword)) {
        matches++;
      }
    }

    // Calculate score with weights
    const exactMatchScore = exactMatches / keywords.length;
    const partialMatchScore = (matches - exactMatches) / keywords.length;

    return exactMatchScore * 0.7 + partialMatchScore * 0.3;
  }

  /**
   * Get index statistics
   */
  getStats(): {
    totalTools: number;
    indexed: boolean;
    toolNames: string[];
  } {
    return {
      totalTools: this.index.size,
      indexed: this.indexed,
      toolNames: Array.from(this.index.keys()),
    };
  }

  /**
   * Clear index
   */
  clear(): void {
    this.index.clear();
    this.indexed = false;
  }
}
