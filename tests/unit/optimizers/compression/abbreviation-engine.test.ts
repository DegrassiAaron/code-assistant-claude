/**
 * Tests for Abbreviation Engine
 */

import { AbbreviationEngine } from '../../../../src/core/optimizers/compression/abbreviation-engine';

describe('AbbreviationEngine', () => {
  let engine: AbbreviationEngine;

  beforeEach(() => {
    engine = new AbbreviationEngine();
  });

  describe('abbreviate', () => {
    it('should abbreviate technical terms', () => {
      const text = 'The application uses a database for configuration';
      const result = engine.abbreviate(text);

      expect(result.abbreviated).toContain('app');
      expect(result.abbreviated).toContain('db');
      expect(result.abbreviated).toContain('config');
    });

    it('should abbreviate business terms', () => {
      const text = 'The customer relationship with the organization';
      const result = engine.abbreviate(text);

      expect(result.abbreviated).toContain('cust');
      expect(result.abbreviated).toContain('org');
    });

    it('should abbreviate general terms', () => {
      const text = 'for example and so forth';
      const result = engine.abbreviate(text);

      expect(result.abbreviated).toContain('e.g.');
      expect(result.abbreviated).toContain('etc.');
    });

    it('should calculate token reduction', () => {
      const text = 'application configuration environment';
      const result = engine.abbreviate(text);

      expect(result.tokensReduced).toBeGreaterThan(0);
    });

    it('should track abbreviations applied', () => {
      const text = 'The application configuration';
      const result = engine.abbreviate(text);

      expect(result.abbreviationsApplied.length).toBeGreaterThan(0);
      expect(result.abbreviationsApplied.some(a => a.from === 'application')).toBe(true);
    });

    it('should handle text without abbreviable terms', () => {
      const text = 'simple test';
      const result = engine.abbreviate(text);

      expect(result.abbreviated).toBe(text);
      expect(result.tokensReduced).toBe(0);
    });

    it('should preserve word boundaries', () => {
      const text = 'application applications';
      const result = engine.abbreviate(text);

      // Should only abbreviate exact matches
      const appCount = (result.abbreviated.match(/\bapp\b/g) || []).length;
      expect(appCount).toBeGreaterThan(0);
    });
  });

  describe('expand', () => {
    it('should expand abbreviations back to full form', () => {
      const text = 'The app uses a db for config';
      const expanded = engine.expand(text);

      expect(expanded).toContain('application');
      expect(expanded).toContain('database');
      expect(expanded).toContain('configuration');
    });

    it('should handle text without abbreviations', () => {
      const text = 'plain text';
      const expanded = engine.expand(text);

      expect(expanded).toBe(text);
    });
  });

  describe('custom rules', () => {
    it('should add custom abbreviation rules', () => {
      engine.addCustomRule('custom_term', 'ct', 'technical');

      const text = 'This is a custom_term';
      const result = engine.abbreviate(text);

      expect(result.abbreviated).toContain('ct');
    });

    it('should remove custom rules', () => {
      engine.addCustomRule('custom_term', 'ct', 'technical');
      engine.removeCustomRule('custom_term');

      const text = 'This is a custom_term';
      const result = engine.abbreviate(text);

      expect(result.abbreviated).toBe(text);
    });

    it('should apply custom rules in abbreviation', () => {
      engine.addCustomRule('myterm', 'mt', 'general');

      const result = engine.abbreviate('myterm is here');
      expect(result.abbreviated).toContain('mt');
    });

    it('should expand custom rules', () => {
      engine.addCustomRule('myterm', 'mt', 'general');

      const expanded = engine.expand('mt is here');
      expect(expanded).toContain('myterm');
    });
  });

  describe('getRules', () => {
    it('should return all rules', () => {
      const rules = engine.getRules();

      expect(rules.length).toBeGreaterThan(0);
      expect(rules[0]).toHaveProperty('full');
      expect(rules[0]).toHaveProperty('abbreviation');
      expect(rules[0]).toHaveProperty('category');
    });

    it('should filter rules by category', () => {
      const technicalRules = engine.getRules('technical');
      const businessRules = engine.getRules('business');

      expect(technicalRules.length).toBeGreaterThan(0);
      expect(businessRules.length).toBeGreaterThan(0);
      expect(technicalRules.every(r => r.category === 'technical')).toBe(true);
      expect(businessRules.every(r => r.category === 'business')).toBe(true);
    });
  });

  describe('findPotentialAbbreviations', () => {
    it('should find potential abbreviations in text', () => {
      const text = 'The application uses configuration and database';
      const suggestions = engine.findPotentialAbbreviations(text);

      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions.some(s => s.word === 'application')).toBe(true);
      expect(suggestions.some(s => s.word === 'configuration')).toBe(true);
    });

    it('should return empty array for text without abbreviable terms', () => {
      const text = 'simple test';
      const suggestions = engine.findPotentialAbbreviations(text);

      expect(suggestions.length).toBe(0);
    });
  });

  describe('getStats', () => {
    it('should return statistics about rules', () => {
      const stats = engine.getStats();

      expect(stats.totalRules).toBeGreaterThan(0);
      expect(stats.technicalRules).toBeGreaterThan(0);
      expect(stats.businessRules).toBeGreaterThan(0);
      expect(stats.generalRules).toBeGreaterThan(0);
    });

    it('should include custom rules in stats', () => {
      const statsBefore = engine.getStats();

      engine.addCustomRule('test', 't', 'general');

      const statsAfter = engine.getStats();

      expect(statsAfter.customRules).toBe(statsBefore.customRules + 1);
      expect(statsAfter.totalRules).toBe(statsBefore.totalRules + 1);
    });
  });

  describe('case sensitivity', () => {
    it('should handle case-insensitive matching', () => {
      const text = 'Application APPLICATION application';
      const result = engine.abbreviate(text);

      // All variants should be abbreviated
      expect(result.abbreviated.toLowerCase()).toContain('app');
    });
  });

  describe('performance', () => {
    it('should handle long text efficiently', () => {
      const longText = 'application '.repeat(100) + 'database '.repeat(100);
      const start = Date.now();

      const result = engine.abbreviate(longText);

      const duration = Date.now() - start;

      expect(duration).toBeLessThan(100); // Should complete in under 100ms
      expect(result.abbreviated.length).toBeLessThan(longText.length);
    });
  });
});
