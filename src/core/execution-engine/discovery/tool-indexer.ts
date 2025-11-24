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

  getTool(name: string): Tool | undefined {
    return this.tools.get(name);
  }

  getToolsByCategory(category: string): Tool[] {
    const toolNames = this.categoryIndex.get(category);
    if (!toolNames) return [];
    return Array.from(toolNames)
      .map((name) => this.tools.get(name))
      .filter((tool): tool is Tool => tool !== undefined);
  }

  searchTools(keyword: string): Tool[] {
    const lowerKeyword = keyword.toLowerCase();
    const results: Tool[] = [];
    for (const tool of this.tools.values()) {
      const nameMatch = tool.name.toLowerCase().includes(lowerKeyword);
      const descMatch = tool.description?.toLowerCase().includes(lowerKeyword);
      if (nameMatch || descMatch) results.push(tool);
    }
    return results;
  }

  getCategories(): string[] {
    return Array.from(this.categoryIndex.keys());
  }

  updateTool(name: string, updatedTool: Tool): boolean {
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

  getAllTools(): Tool[] {
    return Array.from(this.tools.values());
  }
}
