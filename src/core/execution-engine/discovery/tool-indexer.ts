import { MCPToolSchema, ToolIndexEntry } from '../types';
import { FilesystemDiscovery } from './filesystem-discovery';
import { SemanticSearch } from './semantic-search';

/**
 * Tool indexer that combines filesystem and semantic search
 */
export class ToolIndexer {
  private filesystemDiscovery: FilesystemDiscovery;
  private semanticSearch: SemanticSearch;

  constructor(toolsDir: string) {
    this.filesystemDiscovery = new FilesystemDiscovery(toolsDir);
    this.semanticSearch = new SemanticSearch();
  }

  /**
   * Initialize indexer (load and index all tools)
   */
  async initialize(): Promise<void> {
    // Index filesystem
    await this.filesystemDiscovery.indexTools();

    // Build semantic search index
    const allTools = this.filesystemDiscovery.getAll();
    this.semanticSearch.buildIndex(allTools);

    console.log(`✓ Tool indexer initialized with ${allTools.length} tools`);
  }

  /**
   * Search for tools (combines keyword and semantic search)
   */
  search(query: string, limit: number = 10): MCPToolSchema[] {
    // Extract keywords from query
    const keywords = this.extractKeywords(query);

    // Keyword search
    const keywordResults = this.filesystemDiscovery.search(keywords);

    // Semantic search
    const semanticResults = this.semanticSearch.search(query, limit);

    // Combine and deduplicate
    const combined = this.combineResults(keywordResults, semanticResults);

    return combined.slice(0, limit).map(r => r.schema);
  }

  /**
   * Get tool by name
   */
  getTool(name: string): MCPToolSchema | undefined {
    return this.filesystemDiscovery.get(name);
  }

  /**
   * Get all tools
   */
  getAllTools(): MCPToolSchema[] {
    return this.filesystemDiscovery.getAll();
  }

  /**
   * Extract keywords from natural language query
   */
  private extractKeywords(query: string): string[] {
    // Remove stop words
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at',
      'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was'
    ]);

    return query
      .toLowerCase()
      .split(/\W+/)
      .filter(word => word.length > 2 && !stopWords.has(word));
  }

  /**
   * Combine keyword and semantic search results
   */
  private combineResults(
    keywordResults: any[],
    semanticResults: any[]
  ): Array<{ schema: MCPToolSchema; score: number }> {
    const scoreMap = new Map<string, { schema: MCPToolSchema; score: number }>();

    // Add keyword results
    keywordResults.forEach((result, index) => {
      const keywordScore = result.relevanceScore * 0.6; // 60% weight
      scoreMap.set(result.name, {
        schema: result.schema,
        score: keywordScore
      });
    });

    // Add/merge semantic results
    semanticResults.forEach((result, index) => {
      const semanticScore = result.score * 0.4; // 40% weight
      const existing = scoreMap.get(result.tool.name);

      if (existing) {
        existing.score += semanticScore;
      } else {
        scoreMap.set(result.tool.name, {
          schema: result.tool.schema,
          score: semanticScore
        });
      }
    });

    // Convert to array and sort
    return Array.from(scoreMap.values())
      .sort((a, b) => b.score - a.score);
  }

  /**
   * Get indexer statistics
   */
  getStats(): {
    totalTools: number;
    filesystemIndexSize: number;
    semanticIndexSize: number;
  } {
    return {
      totalTools: this.filesystemDiscovery.getAll().length,
      filesystemIndexSize: this.filesystemDiscovery.getStats().totalTools,
      semanticIndexSize: this.semanticSearch.getIndexSize()
    };
  }
}
