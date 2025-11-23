import { describe, it, expect, beforeEach } from 'vitest';
import { RelevanceScorer } from '../../../src/core/execution-engine/discovery/relevance-scorer';
import type { Tool } from '../../../src/core/execution-engine/types';

describe('RelevanceScorer', () => {
  let scorer: RelevanceScorer;

  const mockTools: Tool[] = [
    {
      name: 'readFile',
      description: 'Read a file from the filesystem',
      category: 'filesystem',
      inputSchema: {
        type: 'object',
        properties: {
          path: { type: 'string' }
        }
      }
    },
    {
      name: 'writeFile',
      description: 'Write content to a file',
      category: 'filesystem',
      inputSchema: {
        type: 'object',
        properties: {
          path: { type: 'string' },
          content: { type: 'string' }
        }
      }
    },
    {
      name: 'httpGet',
      description: 'Make an HTTP GET request to fetch data',
      category: 'network',
      inputSchema: {
        type: 'object',
        properties: {
          url: { type: 'string' }
        }
      }
    }
  ];

  beforeEach(() => {
    scorer = new RelevanceScorer();
  });

  describe('scoreTools', () => {
    it('should score tools based on query relevance', () => {
      const query = 'read file content';
      const scores = scorer.scoreTools(mockTools, query);

      expect(scores).toHaveLength(3);
      expect(scores[0].score).toBeGreaterThan(0);
    });

    it('should rank exact name matches highest', () => {
      const query = 'readFile';
      const scores = scorer.scoreTools(mockTools, query);

      expect(scores[0].tool.name).toBe('readFile');
      expect(scores[0].score).toBeGreaterThan(scores[1].score);
    });

    it('should rank description matches', () => {
      const query = 'fetch data from network';
      const scores = scorer.scoreTools(mockTools, query);

      const httpGetScore = scores.find(s => s.tool.name === 'httpGet');
      expect(httpGetScore).toBeDefined();
      expect(httpGetScore!.score).toBeGreaterThan(0);
    });

    it('should return scores in descending order', () => {
      const query = 'file operations';
      const scores = scorer.scoreTools(mockTools, query);

      for (let i = 0; i < scores.length - 1; i++) {
        expect(scores[i].score).toBeGreaterThanOrEqual(scores[i + 1].score);
      }
    });

    it('should handle empty query', () => {
      const scores = scorer.scoreTools(mockTools, '');

      expect(scores).toHaveLength(3);
      scores.forEach(s => expect(s.score).toBeGreaterThanOrEqual(0));
    });

    it('should handle no matching tools', () => {
      const query = 'database operations';
      const scores = scorer.scoreTools(mockTools, query);

      expect(scores).toHaveLength(3);
      scores.forEach(s => expect(s.score).toBeLessThan(0.5));
    });
  });

  describe('getTopNTools', () => {
    it('should return top N tools by relevance', () => {
      const query = 'file operations';
      const topTools = scorer.getTopNTools(mockTools, query, 2);

      expect(topTools).toHaveLength(2);
    });

    it('should return all tools if N exceeds tool count', () => {
      const query = 'operations';
      const topTools = scorer.getTopNTools(mockTools, query, 10);

      expect(topTools).toHaveLength(3);
    });

    it('should return empty array if N is 0', () => {
      const query = 'file';
      const topTools = scorer.getTopNTools(mockTools, query, 0);

      expect(topTools).toEqual([]);
    });

    it('should return most relevant tools first', () => {
      const query = 'read file';
      const topTools = scorer.getTopNTools(mockTools, query, 1);

      expect(topTools[0].name).toBe('readFile');
    });
  });

  describe('scoreTool', () => {
    it('should score individual tool', () => {
      const query = 'read file';
      const score = scorer.scoreTool(mockTools[0], query);

      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(1);
    });

    it('should score name matches higher', () => {
      const nameScore = scorer.scoreTool(mockTools[0], 'readFile');
      const descScore = scorer.scoreTool(mockTools[0], 'filesystem');

      expect(nameScore).toBeGreaterThan(descScore);
    });

    it('should handle case-insensitive matching', () => {
      const lowerScore = scorer.scoreTool(mockTools[0], 'readfile');
      const upperScore = scorer.scoreTool(mockTools[0], 'READFILE');

      expect(lowerScore).toBe(upperScore);
    });
  });

  describe('filterByThreshold', () => {
    it('should filter tools below relevance threshold', () => {
      const query = 'read file';
      const scores = scorer.scoreTools(mockTools, query);
      const filtered = scorer.filterByThreshold(scores, 0.5);

      filtered.forEach(s => expect(s.score).toBeGreaterThanOrEqual(0.5));
    });

    it('should return empty array if no tools meet threshold', () => {
      const query = 'database';
      const scores = scorer.scoreTools(mockTools, query);
      const filtered = scorer.filterByThreshold(scores, 0.9);

      expect(filtered).toEqual([]);
    });

    it('should return all tools if threshold is 0', () => {
      const query = 'file';
      const scores = scorer.scoreTools(mockTools, query);
      const filtered = scorer.filterByThreshold(scores, 0);

      expect(filtered).toHaveLength(scores.length);
    });
  });

  describe('calculateSimilarity', () => {
    it('should calculate similarity between strings', () => {
      const similarity = scorer.calculateSimilarity('readFile', 'read file');

      expect(similarity).toBeGreaterThan(0);
      expect(similarity).toBeLessThanOrEqual(1);
    });

    it('should return 1 for identical strings', () => {
      const similarity = scorer.calculateSimilarity('test', 'test');

      expect(similarity).toBe(1);
    });

    it('should return 0 for completely different strings', () => {
      const similarity = scorer.calculateSimilarity('abc', 'xyz');

      expect(similarity).toBe(0);
    });

    it('should handle empty strings', () => {
      const similarity = scorer.calculateSimilarity('', '');

      expect(similarity).toBe(1);
    });
  });
});
