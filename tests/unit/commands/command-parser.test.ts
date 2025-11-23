/**
 * Unit tests for CommandParser
 */

import { CommandParser } from '../../../src/core/commands/command-parser';

describe('CommandParser', () => {
  let parser: CommandParser;

  beforeEach(() => {
    parser = new CommandParser();
  });

  describe('parse', () => {
    it('should parse basic command without arguments', () => {
      const result = parser.parse('/sc:implement');

      expect(result).not.toBeNull();
      expect(result?.commandName).toBe('implement');
      expect(result?.parameters).toEqual({});
      expect(result?.flags).toEqual({});
    });

    it('should parse command with quoted argument', () => {
      const result = parser.parse('/sc:implement "user authentication"');

      expect(result).not.toBeNull();
      expect(result?.commandName).toBe('implement');
      expect(result?.parameters.param0).toBe('user authentication');
    });

    it('should parse command with boolean flag', () => {
      const result = parser.parse('/sc:implement "feature" --withTests');

      expect(result).not.toBeNull();
      expect(result?.flags.withTests).toBe(true);
    });

    it('should parse command with key=value flag', () => {
      const result = parser.parse('/sc:mode fast');

      expect(result).not.toBeNull();
      expect(result?.parameters.param0).toBe('fast');
    });

    it('should parse command with multiple flags', () => {
      const result = parser.parse('/sc:implement "feature" --withTests=true --withDocs=false');

      expect(result).not.toBeNull();
      expect(result?.flags.withTests).toBe(true);
      expect(result?.flags.withDocs).toBe(false);
    });

    it('should return null for non-command input', () => {
      const result = parser.parse('regular text');

      expect(result).toBeNull();
    });

    it('should handle slash-only commands', () => {
      const result = parser.parse('/implement "feature"');

      expect(result).not.toBeNull();
      expect(result?.commandName).toBe('implement');
    });

    it('should handle sc: prefix', () => {
      const result = parser.parse('/sc:implement');

      expect(result).not.toBeNull();
      expect(result?.commandName).toBe('implement');
    });

    it('should throw on excessively long input', () => {
      const longInput = '/' + 'x'.repeat(15000);

      expect(() => {
        parser.parse(longInput);
      }).toThrow('Command input too long');
    });

    it('should throw on excessively long command name', () => {
      const longName = '/' + 'a'.repeat(150);

      expect(() => {
        parser.parse(longName);
      }).toThrow('Command name too long');
    });

    it('should handle escaped characters in arguments', () => {
      const result = parser.parse('/test "say \\"hello\\""');

      expect(result).not.toBeNull();
      expect(result?.parameters.param0).toBe('say "hello"');
    });
  });

  describe('matchesCommand', () => {
    it('should match exact trigger', () => {
      const matches = parser.matchesCommand(
        '/sc:implement "feature"',
        '/sc:implement'
      );

      expect(matches).toBe(true);
    });

    it('should match alias', () => {
      const matches = parser.matchesCommand(
        '/implement "feature"',
        '/sc:implement',
        ['/implement', '/feature']
      );

      expect(matches).toBe(true);
    });

    it('should match keyword', () => {
      const matches = parser.matchesCommand(
        'can you implement this feature',
        '/sc:implement',
        [],
        ['implement', 'build feature']
      );

      expect(matches).toBe(true);
    });

    it('should not match unrelated input', () => {
      const matches = parser.matchesCommand(
        'hello world',
        '/sc:implement'
      );

      expect(matches).toBe(false);
    });
  });

  describe('isCommand', () => {
    it('should return true for slash commands', () => {
      expect(parser.isCommand('/sc:implement')).toBe(true);
      expect(parser.isCommand('/implement')).toBe(true);
    });

    it('should return false for non-commands', () => {
      expect(parser.isCommand('regular text')).toBe(false);
      expect(parser.isCommand('implement feature')).toBe(false);
    });
  });

  describe('formatCommand', () => {
    it('should format command with parameters', () => {
      const formatted = parser.formatCommand('implement', {
        withTests: true,
        mode: 'fast'
      });

      expect(formatted).toContain('/implement');
      expect(formatted).toContain('--withTests');
      expect(formatted).toContain('--mode="fast"');
    });

    it('should format command without parameters', () => {
      const formatted = parser.formatCommand('implement');

      expect(formatted).toBe('/implement');
    });

    it('should handle boolean false values', () => {
      const formatted = parser.formatCommand('implement', {
        withTests: false
      });

      // False boolean flags should not appear
      expect(formatted).toBe('/implement');
    });

    it('should handle numeric values', () => {
      const formatted = parser.formatCommand('test', {
        count: 42
      });

      expect(formatted).toContain('--count=42');
    });
  });

  describe('extractCommandName', () => {
    it('should extract command name from valid command', () => {
      const name = parser.extractCommandName('/sc:implement "feature"');

      expect(name).toBe('implement');
    });

    it('should return null for non-command', () => {
      const name = parser.extractCommandName('regular text');

      expect(name).toBeNull();
    });
  });
});
