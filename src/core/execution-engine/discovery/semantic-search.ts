import { MCPToolSchema, SemanticSearchResult, ToolIndexEntry } from '../types';

/**
 * Semantic search for MCP tools
 * Uses natural language matching to find relevant tools
 */
export class SemanticSearch {
  private index: ToolIndexEntry[] = [];

  /**
   * Build search index from schemas
   */
  buildIndex(schemas: MCPToolSchema[]): void {
    this.index = schemas.map((schema) => ({
      name: schema.name,
      description: schema.description,
      keywords: this.extractKeywords(schema),
      category: this.inferCategory(schema),
      filePath: '', // Would be set by filesystem discovery
      schema,
    }));
  }

  /**
   * Search for tools using natural language query
   */
  search(query: string, limit: number = 10): SemanticSearchResult[] {
    const queryTokens = this.tokenize(query);
    const results: SemanticSearchResult[] = [];

    for (const entry of this.index) {
      const score = this.calculateSemanticScore(entry, queryTokens);

      if (score > 0.2) {
        results.push({
          tool: entry,
          score,
          matches: this.findMatches(entry, queryTokens),
        });
      }
    }

    // Sort by score (descending)
    results.sort((a, b) => b.score - a.score);

    return results.slice(0, limit);
  }

  /**
   * Extract keywords from schema
   */
  private extractKeywords(schema: MCPToolSchema): string[] {
    const keywords = new Set<string>();

    // From name
    const nameWords = schema.name.split(/[_-]/).filter((w) => w.length > 2);
    nameWords.forEach((w) => keywords.add(w.toLowerCase()));

    // From description
    const descWords = schema.description
      .toLowerCase()
      .split(/\W+/)
      .filter((w) => w.length > 3);

    descWords.forEach((w) => keywords.add(w));

    // From parameters
    schema.parameters?.forEach((param) => {
      keywords.add(param.name.toLowerCase());
      param.description.split(/\W+/).forEach((w) => {
        if (w.length > 3) keywords.add(w.toLowerCase());
      });
    });

    return Array.from(keywords);
  }

  /**
   * Infer category from schema
   */
  private inferCategory(schema: MCPToolSchema): string {
    const name = schema.name.toLowerCase();
    const desc = schema.description.toLowerCase();

    // Simple category inference
    if (name.includes('git') || desc.includes('git')) return 'git';
    if (name.includes('file') || desc.includes('file')) return 'filesystem';
    if (name.includes('http') || desc.includes('http')) return 'network';
    if (name.includes('db') || desc.includes('database')) return 'database';
    if (name.includes('test') || desc.includes('test')) return 'testing';

    return 'general';
  }

  /**
   * Tokenize query string
   */
  private tokenize(query: string): string[] {
    return query
      .toLowerCase()
      .split(/\W+/)
      .filter((w) => w.length > 2);
  }

  /**
   * Calculate semantic score between tool and query
   */
  private calculateSemanticScore(
    entry: ToolIndexEntry,
    queryTokens: string[]
  ): number {
    let score = 0;

    // Exact name match (highest weight)
    if (queryTokens.some((token) => entry.name.toLowerCase().includes(token))) {
      score += 0.5;
    }

    // Keyword matches
    const keywordMatches = queryTokens.filter((token) =>
      entry.keywords.some(
        (keyword) => keyword.includes(token) || token.includes(keyword)
      )
    );
    score += (keywordMatches.length / queryTokens.length) * 0.3;

    // Description matches
    const descriptionText = entry.description.toLowerCase();
    const descMatches = queryTokens.filter((token) =>
      descriptionText.includes(token)
    );
    score += (descMatches.length / queryTokens.length) * 0.2;

    return Math.min(1, score);
  }

  /**
   * Find specific matches in tool
   */
  private findMatches(
    entry: ToolIndexEntry,
    queryTokens: string[]
  ): { field: string; value: string; relevance: number }[] {
    const matches: { field: string; value: string; relevance: number }[] = [];

    // Name matches
    queryTokens.forEach((token) => {
      if (entry.name.toLowerCase().includes(token)) {
        matches.push({
          field: 'name',
          value: entry.name,
          relevance: 1.0,
        });
      }
    });

    // Keyword matches
    entry.keywords.forEach((keyword) => {
      queryTokens.forEach((token) => {
        if (keyword.includes(token)) {
          matches.push({
            field: 'keyword',
            value: keyword,
            relevance: 0.8,
          });
        }
      });
    });

    // Description matches
    const sentences = entry.description.split(/[.!?]/);
    sentences.forEach((sentence) => {
      const matchCount = queryTokens.filter((token) =>
        sentence.toLowerCase().includes(token)
      ).length;

      if (matchCount > 0) {
        matches.push({
          field: 'description',
          value: sentence.trim(),
          relevance: matchCount / queryTokens.length,
        });
      }
    });

    return matches;
  }

  /**
   * Get index size
   */
  getIndexSize(): number {
    return this.index.length;
  }

  /**
   * Clear index
   */
  clear(): void {
    this.index = [];
  }
}
