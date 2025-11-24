import type { MCPToolSchema } from "../types";

interface ScoredTool {
  tool: MCPToolSchema;
  score: number;
}

export class RelevanceScorer {
  scoreTools(tools: MCPToolSchema[], query: string): ScoredTool[] {
    const scoredTools = tools.map((tool) => ({
      tool,
      score: this.scoreTool(tool, query),
    }));
    return scoredTools.sort((a, b) => b.score - a.score);
  }

  getTopNTools(
    tools: MCPToolSchema[],
    query: string,
    n: number,
  ): MCPToolSchema[] {
    if (n <= 0) return [];
    const scored = this.scoreTools(tools, query);
    return scored.slice(0, Math.min(n, scored.length)).map((s) => s.tool);
  }

  scoreTool(tool: MCPToolSchema, query: string): number {
    const lowerQuery = query.toLowerCase();
    const lowerName = tool.name.toLowerCase();
    const lowerDesc = (tool.description || "").toLowerCase();
    let score = 0;

    if (lowerName === lowerQuery) score += 1.0;
    else if (lowerName.includes(lowerQuery)) score += 0.8;
    if (lowerDesc.includes(lowerQuery)) score += 0.5;

    const queryWords = lowerQuery.split(/\s+/);
    const nameWords = lowerName.split(/[\s_-]+/);
    const descWords = lowerDesc.split(/\s+/);

    for (const qWord of queryWords) {
      if (nameWords.includes(qWord)) score += 0.3;
      if (descWords.includes(qWord)) score += 0.1;
    }

    if (tool.category && lowerQuery.includes(tool.category.toLowerCase())) {
      score += 0.2;
    }
    return score;
  }

  filterByThreshold(
    scoredTools: ScoredTool[],
    threshold: number,
  ): ScoredTool[] {
    return scoredTools.filter((st) => st.score >= threshold);
  }

  calculateSimilarity(str1: string, str2: string): number {
    if (str1 === str2) return 1.0;
    if (!str1 || !str2) return 0.0;
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    if (longer.length === 0) return 1.0;

    const longerLower = longer.toLowerCase();
    const shorterLower = shorter.toLowerCase();
    let matches = 0;
    for (let i = 0; i < shorterLower.length; i++) {
      if (longerLower.includes(shorterLower[i])) matches++;
    }
    return matches / longer.length;
  }
}
