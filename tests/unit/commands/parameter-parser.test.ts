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
      const { flags } = parser.parseParameters('--list=\'["a","b","c"]\'');

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

    it('should handle escaped quotes', () => {
      const { parameters } = parser.parseParameters('"say \\"hello\\""');

      expect(parameters.param0).toBe('say "hello"');
    });

    it('should handle escaped backslashes', () => {
      const { parameters } = parser.parseParameters('"path\\\\to\\\\file"');

      expect(parameters.param0).toBe('path\\to\\file');
    });

    it('should not parse empty string as number', () => {
      const { parameters } = parser.parseParameters('""');

      expect(parameters.param0).toBe('');
      expect(typeof parameters.param0).toBe('string');
    });

    it('should not parse whitespace as number', () => {
      const { parameters } = parser.parseParameters('"   "');

      expect(parameters.param0).toBe('   ');
      expect(typeof parameters.param0).toBe('string');
    });

    it('should reject oversized JSON', () => {
      const largeArray = '[' + '"x",'.repeat(5000) + '"x"]';

      expect(() => {
        parser.parseParameters(`--data=${largeArray}`);
      }).toThrow('JSON value too large');
    });

    it('should reject deeply nested JSON', () => {
      let deep = '\'{"a":';
      for (let i = 0; i < 15; i++) {
        deep += '{"b":';
      }
      deep += '1';
      for (let i = 0; i < 15; i++) {
        deep += '}';
      }
      deep += '}\'';

      expect(() => {
        parser.parseParameters(`--data=${deep}`);
      }).toThrow('too deep');
    });

    it('should handle NaN and Infinity correctly', () => {
      const { parameters: params1 } = parser.parseParameters('NaN');
      const { parameters: params2 } = parser.parseParameters('Infinity');

      expect(params1.param0).toBe('NaN');
      expect(params2.param0).toBe('Infinity');
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

    it('should validate number types correctly', () => {
      const paramDefs = [
        {
          name: 'count',
          type: 'number' as const,
          required: true,
          description: 'Count'
        }
      ];

      const { valid, errors } = parser.validateParameters(
        { count: 42 },
        {},
        paramDefs
      );

      expect(valid).toBe(true);
      expect(errors).toEqual([]);
    });

    it('should validate array types', () => {
      const paramDefs = [
        {
          name: 'items',
          type: 'array' as const,
          required: true,
          description: 'Items'
        }
      ];

      const { valid, errors } = parser.validateParameters(
        { items: ['a', 'b', 'c'] },
        {},
        paramDefs
      );

      expect(valid).toBe(true);
      expect(errors).toEqual([]);
    });

    it('should handle optional parameters', () => {
      const paramDefs = [
        {
          name: 'feature',
          type: 'string' as const,
          required: false,
          description: 'Feature name',
          default: 'default-feature'
        }
      ];

      const { valid } = parser.validateParameters(
        {},
        {},
        paramDefs
      );

      expect(valid).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle mixed quote types', () => {
      const { parameters } = parser.parseParameters("'say \"hello\"'");

      expect(parameters.param0).toBe('say "hello"');
    });

    it('should handle empty input', () => {
      const { parameters, flags } = parser.parseParameters('');

      expect(parameters).toEqual({});
      expect(flags).toEqual({});
    });

    it('should handle only flags', () => {
      const { parameters, flags } = parser.parseParameters('--flag1 --flag2=value');

      expect(parameters).toEqual({});
      expect(flags.flag1).toBe(true);
      expect(flags.flag2).toBe('value');
    });

    it('should handle complex JSON', () => {
      const { flags } = parser.parseParameters('--config=\'{"a":1,"b":true,"c":"test"}\'');

      expect(flags.config).toEqual({ a: 1, b: true, c: 'test' });
    });
  });
});
