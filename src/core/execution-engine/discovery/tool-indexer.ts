import type { MCPToolSchema } from "../types";

export class ToolIndexer {
  private tools: Map<string, MCPToolSchema>;
  private categoryIndex: Map<string, Set<string>>;

  constructor() {
    this.tools = new Map();
    this.categoryIndex = new Map();
  }

  indexTools(tools: MCPToolSchema[]): void {
    for (const tool of tools) {
      this.tools.set(tool.name, tool);
      if (tool.category) {
        if (!this.categoryIndex.has(tool.category)) {
          this.categoryIndex.set(tool.category, new Set());
        }
        this.categoryIndex.get(tool.category)!.add(tool.name);
      }
    }
  }

  getTool(name: string): MCPToolSchema | undefined {
    return this.tools.get(name);
  }

  getToolsByCategory(category: string): MCPToolSchema[] {
    const toolNames = this.categoryIndex.get(category);
    if (!toolNames) return [];
    return Array.from(toolNames)
      .map((name) => this.tools.get(name))
      .filter((tool): tool is MCPToolSchema => tool !== undefined);
  }

  search(keyword: string, limit?: number): MCPToolSchema[] {
    const lowerKeyword = keyword.toLowerCase();
    const results: MCPToolSchema[] = [];
    for (const tool of this.tools.values()) {
      const nameMatch = tool.name.toLowerCase().includes(lowerKeyword);
      const descMatch = tool.description?.toLowerCase().includes(lowerKeyword);
      if (nameMatch || descMatch) results.push(tool);
      if (limit && results.length >= limit) break;
    }
    return results;
  }

  getCategories(): string[] {
    return Array.from(this.categoryIndex.keys());
  }

  updateTool(name: string, updatedTool: MCPToolSchema): boolean {
    if (!this.tools.has(name)) return false;
    this.tools.set(name, updatedTool);
    return true;
  }

  removeTool(name: string): boolean {
    const tool = this.tools.get(name);
    if (!tool) return false;
    this.tools.delete(name);
    if (tool.category) {
      this.categoryIndex.get(tool.category)?.delete(name);
    }
    return true;
  }

  getAllTools(): MCPToolSchema[] {
    return Array.from(this.tools.values());
  }

  initialize(): void {
    // Initialization logic if needed
  }

  getStats(): {
    totalTools: number;
    categories: number;
    toolsByCategory: Record<string, number>;
  } {
    const toolsByCategory: Record<string, number> = {};
    for (const [category, tools] of this.categoryIndex.entries()) {
      toolsByCategory[category] = tools.size;
    }
    return {
      totalTools: this.tools.size,
      categories: this.categoryIndex.size,
      toolsByCategory,
    };
  }
}
