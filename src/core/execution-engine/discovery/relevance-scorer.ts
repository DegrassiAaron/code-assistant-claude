import { MCPToolSchema } from '../types';

/**
 * Scores relevance of tools for a given query
 * Implements advanced scoring algorithms
 */
export class RelevanceScorer {
  /**
   * Score tool relevance for query
   */
  score(tool: MCPToolSchema, query: string): number {
    const factors: ScoringFactor[] = [];

    // Name matching
    factors.push(this.scoreNameMatch(tool, query));

    // Description matching
    factors.push(this.scoreDescriptionMatch(tool, query));

    // Parameter matching
    factors.push(this.scoreParameterMatch(tool, query));

    // Calculate weighted score
    return this.calculateWeightedScore(factors);
  }

  /**
   * Score name matching
   */
  private scoreNameMatch(tool: MCPToolSchema, query: string): ScoringFactor {
    const toolName = tool.name.toLowerCase();
    const queryLower = query.toLowerCase();

    let score = 0;

    // Exact match
    if (toolName === queryLower) {
      score = 1.0;
    }
    // Starts with query
    else if (toolName.startsWith(queryLower)) {
      score = 0.9;
    }
    // Contains query
    else if (toolName.includes(queryLower)) {
      score = 0.7;
    }
    // Fuzzy match (edit distance)
    else {
      score = this.fuzzyMatch(toolName, queryLower);
    }

    return {
      name: 'name_match',
      score,
      weight: 0.4  // 40% weight
    };
  }

  /**
   * Score description matching
   */
  private scoreDescriptionMatch(tool: MCPToolSchema, query: string): ScoringFactor {
    const description = tool.description.toLowerCase();
    const queryTokens = query.toLowerCase().split(/\s+/);

    let matchCount = 0;

    for (const token of queryTokens) {
      if (description.includes(token)) {
        matchCount++;
      }
    }

    const score = queryTokens.length > 0 ? matchCount / queryTokens.length : 0;

    return {
      name: 'description_match',
      score,
      weight: 0.3  // 30% weight
    };
  }

  /**
   * Score parameter matching
   */
  private scoreParameterMatch(tool: MCPToolSchema, query: string): ScoringFactor {
    const queryLower = query.toLowerCase();
    let matchCount = 0;

    for (const param of tool.parameters) {
      if (param.name.toLowerCase().includes(queryLower)) {
        matchCount++;
      }
    }

    const score = tool.parameters.length > 0 ? matchCount / tool.parameters.length : 0;

    return {
      name: 'parameter_match',
      score,
      weight: 0.3  // 30% weight
    };
  }

  /**
   * Fuzzy string matching using Levenshtein distance
   */
  private fuzzyMatch(str1: string, str2: string): number {
    const distance = this.levenshteinDistance(str1, str2);
    const maxLength = Math.max(str1.length, str2.length);

    if (maxLength === 0) return 1.0;

    // Normalize to 0-1 scale
    return 1 - (distance / maxLength);
  }

  /**
   * Calculate Levenshtein distance
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const m = str1.length;
    const n = str2.length;
    const dp: number[][] = [];

    for (let i = 0; i <= m; i++) {
      dp[i] = [i];
    }

    for (let j = 0; j <= n; j++) {
      dp[0][j] = j;
    }

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (str1[i - 1] === str2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = Math.min(
            dp[i - 1][j] + 1,      // deletion
            dp[i][j - 1] + 1,      // insertion
            dp[i - 1][j - 1] + 1   // substitution
          );
        }
      }
    }

    return dp[m][n];
  }

  /**
   * Calculate weighted score from factors
   */
  private calculateWeightedScore(factors: ScoringFactor[]): number {
    let totalScore = 0;
    let totalWeight = 0;

    for (const factor of factors) {
      totalScore += factor.score * factor.weight;
      totalWeight += factor.weight;
    }

    return totalWeight > 0 ? totalScore / totalWeight : 0;
  }

  /**
   * Batch score multiple tools
   */
  batchScore(tools: MCPToolSchema[], query: string): Array<{ tool: MCPToolSchema; score: number }> {
    return tools
      .map(tool => ({
        tool,
        score: this.score(tool, query)
      }))
      .sort((a, b) => b.score - a.score);
  }
}

/**
 * Scoring factor
 */
interface ScoringFactor {
  name: string;
  score: number;
  weight: number;
}
