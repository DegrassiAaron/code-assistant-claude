/**
 * Unit tests for ParameterParser
 */

import { ParameterParser } from '../../../src/core/commands/parameter-parser';

describe('ParameterParser', () => {
  let parser: ParameterParser;

  beforeEach(() => {
    parser = new ParameterParser();
  });

  describe('parseParameters', () => {
    it('should parse simple positional parameter', () => {
      const { parameters, flags } = parser.parseParameters('hello');

      expect(parameters.param0).toBe('hello');
      expect(flags).toEqual({});
    });

    it('should parse quoted string', () => {
      const { parameters } = parser.parseParameters('"hello world"');

      expect(parameters.param0).toBe('hello world');
    });

    it('should parse boolean flag', () => {
      const { flags } = parser.parseParameters('--flag');

      expect(flags.flag).toBe(true);
    });

    it('should parse key=value flag', () => {
      const { flags } = parser.parseParameters('--key=value');

      expect(flags.key).toBe('value');
    });

    it('should parse number', () => {
      const { parameters } = parser.parseParameters('123');

      expect(parameters.param0).toBe(123);
    });

    it('should parse boolean string', () => {
      const { flags } = parser.parseParameters('--flag=true');

      expect(flags.flag).toBe(true);
    });

    it('should parse JSON array', () => {
      const { flags } = parser.parseParameters('--list=["a","b","c"]');

      expect(flags.list).toEqual(['a', 'b', 'c']);
    });

    it('should handle multiple parameters and flags', () => {
      const { parameters, flags } = parser.parseParameters(
        '"feature" --withTests=true --mode=fast'
      );

      expect(parameters.param0).toBe('feature');
      expect(flags.withTests).toBe(true);
      expect(flags.mode).toBe('fast');
    });
  });

  describe('validateParameters', () => {
    it('should validate required parameters', () => {
      const paramDefs = [
        {
          name: 'feature',
          type: 'string' as const,
          required: true,
          description: 'Feature name'
        }
      ];

      const { valid, errors } = parser.validateParameters(
        {},
        {},
        paramDefs
      );

      expect(valid).toBe(false);
      expect(errors).toContain('Missing required parameter: feature');
    });

    it('should validate parameter types', () => {
      const paramDefs = [
        {
          name: 'count',
          type: 'number' as const,
          required: true,
          description: 'Count'
        }
      ];

      const { valid, errors } = parser.validateParameters(
        { count: 'abc' },
        {},
        paramDefs
      );

      expect(valid).toBe(false);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should validate enum options', () => {
      const paramDefs = [
        {
          name: 'mode',
          type: 'string' as const,
          required: true,
          description: 'Mode',
          options: ['fast', 'slow']
        }
      ];

      const { valid, errors } = parser.validateParameters(
        { mode: 'invalid' },
        {},
        paramDefs
      );

      expect(valid).toBe(false);
      expect(errors.some(e => e.includes('invalid value'))).toBe(true);
    });

    it('should pass valid parameters', () => {
      const paramDefs = [
        {
          name: 'feature',
          type: 'string' as const,
          required: true,
          description: 'Feature name'
        }
      ];

      const { valid, errors } = parser.validateParameters(
        { feature: 'user-auth' },
        {},
        paramDefs
      );

      expect(valid).toBe(true);
      expect(errors).toEqual([]);
    });
  });
});
