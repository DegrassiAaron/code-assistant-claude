import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ToolIndexer } from '../../../src/core/execution-engine/discovery/tool-indexer';
import type { Tool, ToolMetadata } from '../../../src/core/execution-engine/types';

describe('ToolIndexer', () => {
  let toolIndexer: ToolIndexer;

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
      description: 'Make an HTTP GET request',
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
    toolIndexer = new ToolIndexer();
  });

  describe('indexTools', () => {
    it('should index all provided tools', () => {
      toolIndexer.indexTools(mockTools);

      const indexed = toolIndexer.getAllTools();
      expect(indexed).toHaveLength(3);
    });

    it('should create searchable metadata for tools', () => {
      toolIndexer.indexTools(mockTools);

      const tool = toolIndexer.getTool('readFile');
      expect(tool).toBeDefined();
      expect(tool?.name).toBe('readFile');
    });

    it('should handle empty tool list', () => {
      toolIndexer.indexTools([]);

      const indexed = toolIndexer.getAllTools();
      expect(indexed).toHaveLength(0);
    });
  });

  describe('getTool', () => {
    beforeEach(() => {
      toolIndexer.indexTools(mockTools);
    });

    it('should retrieve tool by name', () => {
      const tool = toolIndexer.getTool('readFile');

      expect(tool).toBeDefined();
      expect(tool?.name).toBe('readFile');
    });

    it('should return undefined for non-existent tool', () => {
      const tool = toolIndexer.getTool('nonExistent');

      expect(tool).toBeUndefined();
    });

    it('should handle case-sensitive lookups', () => {
      const tool = toolIndexer.getTool('ReadFile');

      expect(tool).toBeUndefined();
    });
  });

  describe('getToolsByCategory', () => {
    beforeEach(() => {
      toolIndexer.indexTools(mockTools);
    });

    it('should retrieve all tools in a category', () => {
      const fsTools = toolIndexer.getToolsByCategory('filesystem');

      expect(fsTools).toHaveLength(2);
      expect(fsTools.map(t => t.name)).toContain('readFile');
      expect(fsTools.map(t => t.name)).toContain('writeFile');
    });

    it('should return empty array for non-existent category', () => {
      const tools = toolIndexer.getToolsByCategory('database');

      expect(tools).toEqual([]);
    });

    it('should handle single tool categories', () => {
      const networkTools = toolIndexer.getToolsByCategory('network');

      expect(networkTools).toHaveLength(1);
      expect(networkTools[0].name).toBe('httpGet');
    });
  });

  describe('searchTools', () => {
    beforeEach(() => {
      toolIndexer.indexTools(mockTools);
    });

    it('should find tools by keyword in name', () => {
      const results = toolIndexer.search('file');

      expect(results.length).toBeGreaterThan(0);
      expect(results.some(t => t.name === 'readFile')).toBe(true);
    });

    it('should find tools by keyword in description', () => {
      const results = toolIndexer.search('HTTP');

      expect(results.length).toBeGreaterThan(0);
      expect(results.some(t => t.name === 'httpGet')).toBe(true);
    });

    it('should return empty array for no matches', () => {
      const results = toolIndexer.search('database');

      expect(results).toEqual([]);
    });

    it('should handle case-insensitive search', () => {
      const results = toolIndexer.search('FILE');

      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe('getCategories', () => {
    beforeEach(() => {
      toolIndexer.indexTools(mockTools);
    });

    it('should return all unique categories', () => {
      const categories = toolIndexer.getCategories();

      expect(categories).toContain('filesystem');
      expect(categories).toContain('network');
      expect(categories.length).toBe(2);
    });

    it('should return empty array when no tools indexed', () => {
      const emptyIndexer = new ToolIndexer();
      const categories = emptyIndexer.getCategories();

      expect(categories).toEqual([]);
    });
  });

  describe('updateTool', () => {
    beforeEach(() => {
      toolIndexer.indexTools(mockTools);
    });

    it('should update existing tool', () => {
      const updatedTool: Tool = {
        ...mockTools[0],
        description: 'Updated description'
      };

      toolIndexer.updateTool('readFile', updatedTool);

      const tool = toolIndexer.getTool('readFile');
      expect(tool?.description).toBe('Updated description');
    });

    it('should not update non-existent tool', () => {
      const result = toolIndexer.updateTool('nonExistent', mockTools[0]);

      expect(result).toBe(false);
    });
  });

  describe('removeTool', () => {
    beforeEach(() => {
      toolIndexer.indexTools(mockTools);
    });

    it('should remove tool from index', () => {
      toolIndexer.removeTool('readFile');

      const tool = toolIndexer.getTool('readFile');
      expect(tool).toBeUndefined();
    });

    it('should return true when tool is removed', () => {
      const result = toolIndexer.removeTool('readFile');

      expect(result).toBe(true);
    });

    it('should return false when tool does not exist', () => {
      const result = toolIndexer.removeTool('nonExistent');

      expect(result).toBe(false);
    });
  });

  describe('getAllTools', () => {
    it('should return all indexed tools', () => {
      toolIndexer.indexTools(mockTools);

      const allTools = toolIndexer.getAllTools();

      expect(allTools).toHaveLength(3);
    });

    it('should return empty array when no tools indexed', () => {
      const allTools = toolIndexer.getAllTools();

      expect(allTools).toEqual([]);
    });
  });
});
