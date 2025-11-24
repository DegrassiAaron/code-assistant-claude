import { validateProjectRoot, sanitizePath, validateConfigKey } from '../../../src/core/utils/validation';
import path from 'path';

describe('validation', () => {
  describe('validateProjectRoot', () => {
    it('should accept current working directory', () => {
      expect(() => validateProjectRoot(process.cwd())).not.toThrow();
    });

    it('should accept subdirectory of cwd', () => {
      const subDir = path.join(process.cwd(), 'src');
      expect(() => validateProjectRoot(subDir)).not.toThrow();
    });

    it('should reject path traversal with ..', () => {
      expect(() => validateProjectRoot('../../../etc/passwd'))
        .toThrow('path traversal detected');
    });

    it('should reject path traversal with ~', () => {
      expect(() => validateProjectRoot('~/malicious'))
        .toThrow('path traversal detected');
    });

    it('should reject system directories', () => {
      if (process.platform === 'win32') {
        expect(() => validateProjectRoot('C:\\Windows'))
          .toThrow('Access to system directory denied');
      } else {
        expect(() => validateProjectRoot('/etc/'))
          .toThrow('Access to system directory denied');

        expect(() => validateProjectRoot('/root/'))
          .toThrow('Access to system directory denied');
      }
    });

    it('should reject paths outside cwd', () => {
      expect(() => validateProjectRoot('/tmp/outside'))
        .toThrow('must be within the repository or the system temporary directory');
    });
  });

  describe('sanitizePath', () => {
    it('should remove null bytes', () => {
      const result = sanitizePath('file\0name.txt');
      expect(result).toBe('filename.txt');
    });

    it('should normalize path separators', () => {
      const result = sanitizePath('src/../dist/./file.js');
      expect(result).toContain('dist');
      expect(result).not.toContain('..');
    });

    it('should trim whitespace', () => {
      const result = sanitizePath('  /path/to/file.txt  ');
      expect(result.startsWith(' ')).toBe(false);
      expect(result.endsWith(' ')).toBe(false);
    });
  });

  describe('validateConfigKey', () => {
    it('should accept valid config keys', () => {
      expect(() => validateConfigKey('verbosity')).not.toThrow();
      expect(() => validateConfigKey('token.budget')).not.toThrow();
      expect(() => validateConfigKey('skills_enabled')).not.toThrow();
    });

    it('should reject special characters', () => {
      expect(() => validateConfigKey('key@invalid'))
        .toThrow('only alphanumeric');

      expect(() => validateConfigKey('key#hash'))
        .toThrow('only alphanumeric');

      expect(() => validateConfigKey('key$dollar'))
        .toThrow('only alphanumeric');
    });

    it('should reject prototype pollution attempts', () => {
      expect(() => validateConfigKey('__proto__'))
        .toThrow('prototype pollution detected');

      expect(() => validateConfigKey('constructor'))
        .toThrow('prototype pollution detected');

      expect(() => validateConfigKey('prototype'))
        .toThrow('prototype pollution detected');
    });
  });
});
