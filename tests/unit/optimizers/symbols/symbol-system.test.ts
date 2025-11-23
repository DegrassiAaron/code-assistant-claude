/**
 * Tests for Symbol System
 */

import { SymbolSystem } from '../../../../src/core/optimizers/symbols/symbol-system';

describe('SymbolSystem', () => {
  let symbolSystem: SymbolSystem;

  beforeEach(() => {
    symbolSystem = new SymbolSystem();
  });

  describe('compress', () => {
    it('should compress text with symbols', () => {
      const text = 'The project leads to success because of good planning';
      const result = symbolSystem.compress(text);

      expect(result.compressed).toContain('→'); // leads_to
      expect(result.compressed).toContain('∵'); // because
      expect(result.compressed.length).toBeLessThan(text.length);
    });

    it('should calculate compression ratio', () => {
      const text = 'This is completed and leads to success';
      const result = symbolSystem.compress(text);

      expect(result.compressionRatio).toBeGreaterThan(0);
      expect(result.compressionRatio).toBeLessThan(1);
    });

    it('should estimate token reduction', () => {
      const text = 'completed failed warning in_progress';
      const result = symbolSystem.compress(text);

      expect(result.tokensReduced).toBeGreaterThan(0);
    });

    it('should handle text without compressible keywords', () => {
      const text = 'random text with no keywords';
      const result = symbolSystem.compress(text);

      expect(result.compressed).toBe(text);
      expect(result.compressionRatio).toBe(0);
    });

    it('should compress multiple occurrences', () => {
      const text = 'success leads to more success and therefore success is good';
      const result = symbolSystem.compress(text);

      const successCount = (result.compressed.match(/✅/g) || []).length;
      expect(successCount).toBeGreaterThan(0);
    });
  });

  describe('expand', () => {
    it('should expand symbols back to text', () => {
      const text = 'The project leads to success';
      const compressed = symbolSystem.compress(text);
      const expanded = symbolSystem.expand(compressed.compressed);

      expect(expanded).toContain('leads_to');
    });

    it('should handle text without symbols', () => {
      const text = 'plain text';
      const expanded = symbolSystem.expand(text);

      expect(expanded).toBe(text);
    });
  });

  describe('getSymbol', () => {
    it('should get symbol by keyword', () => {
      const symbol = symbolSystem.getSymbol('completed');

      expect(symbol).toBe('✅');
    });

    it('should return null for unknown keyword', () => {
      const symbol = symbolSystem.getSymbol('unknown_keyword');

      expect(symbol).toBeNull();
    });

    it('should find symbols from all categories', () => {
      expect(symbolSystem.getSymbol('completed')).toBe('✅'); // core
      expect(symbolSystem.getSymbol('objective')).toBe('🎯'); // business
      expect(symbolSystem.getSymbol('performance')).toBe('⚡'); // technical
    });
  });

  describe('getStats', () => {
    it('should return symbol statistics', () => {
      const stats = symbolSystem.getStats();

      expect(stats.totalSymbols).toBeGreaterThan(0);
      expect(stats.coreSymbols).toBeGreaterThan(0);
      expect(stats.businessSymbols).toBeGreaterThan(0);
      expect(stats.technicalSymbols).toBeGreaterThan(0);
      expect(stats.categories).toBeDefined();
    });

    it('should have correct total count', () => {
      const stats = symbolSystem.getStats();
      const categoryTotal = Object.values(stats.categories).reduce((sum, count) => sum + count, 0);

      expect(categoryTotal).toBeGreaterThan(0);
    });
  });

  describe('hasSymbols', () => {
    it('should detect symbols in text', () => {
      const textWithSymbols = 'Project ✅ completed';
      const textWithoutSymbols = 'Project is done';

      expect(symbolSystem.hasSymbols(textWithSymbols)).toBe(true);
      expect(symbolSystem.hasSymbols(textWithoutSymbols)).toBe(false);
    });
  });

  describe('getAllSymbols', () => {
    it('should return all symbol mappings', () => {
      const symbols = symbolSystem.getAllSymbols();

      expect(symbols.length).toBeGreaterThan(0);
      expect(symbols[0]).toHaveProperty('keyword');
      expect(symbols[0]).toHaveProperty('symbol');
    });
  });

  describe('compression targets', () => {
    it('should achieve at least 30% compression on symbol-rich text', () => {
      const text = 'The objective leads to success therefore performance is optimized and security is maintained';
      const result = symbolSystem.compress(text);

      expect(result.compressionRatio).toBeGreaterThanOrEqual(0.3);
    });

    it('should handle edge cases', () => {
      expect(symbolSystem.compress('').compressed).toBe('');
      expect(symbolSystem.compress(' ').compressed).toBe(' ');
      expect(symbolSystem.compress('!!!').compressed).toBe('!!!');
    });
  });
});
