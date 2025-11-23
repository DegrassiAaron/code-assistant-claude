import {
  fileExists,
  readFileSafe,
  readJsonSafe,
  ensureDir,
  writeFileSafe
} from '../../../src/core/utils/file-utils';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

describe('file-utils', () => {
  let testDir: string;

  beforeEach(async () => {
    testDir = path.join(os.tmpdir(), `test-fileutils-${Date.now()}`);
    await fs.mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    try {
      await fs.rm(testDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  describe('fileExists', () => {
    it('should return true for existing file', async () => {
      const filePath = path.join(testDir, 'exists.txt');
      await fs.writeFile(filePath, 'content');

      const result = await fileExists(filePath);

      expect(result).toBe(true);
    });

    it('should return false for non-existent file', async () => {
      const result = await fileExists(path.join(testDir, 'not-exists.txt'));

      expect(result).toBe(false);
    });

    it('should return true for existing directory', async () => {
      const result = await fileExists(testDir);

      expect(result).toBe(true);
    });
  });

  describe('readFileSafe', () => {
    it('should read existing file', async () => {
      const filePath = path.join(testDir, 'test.txt');
      const content = 'Hello, World!';
      await fs.writeFile(filePath, content);

      const result = await readFileSafe(filePath);

      expect(result).toBe(content);
    });

    it('should return null for non-existent file', async () => {
      const result = await readFileSafe(path.join(testDir, 'missing.txt'));

      expect(result).toBeNull();
    });
  });

  describe('readJsonSafe', () => {
    it('should read and parse valid JSON', async () => {
      const filePath = path.join(testDir, 'config.json');
      const data = { key: 'value', number: 42 };
      await fs.writeFile(filePath, JSON.stringify(data));

      const result = await readJsonSafe(filePath);

      expect(result).toEqual(data);
    });

    it('should return null for non-existent file', async () => {
      const result = await readJsonSafe(path.join(testDir, 'missing.json'));

      expect(result).toBeNull();
    });

    it('should return null for invalid JSON', async () => {
      const filePath = path.join(testDir, 'invalid.json');
      await fs.writeFile(filePath, '{ invalid json }');

      const result = await readJsonSafe(filePath);

      expect(result).toBeNull();
    });
  });

  describe('ensureDir', () => {
    it('should create directory if not exists', async () => {
      const dirPath = path.join(testDir, 'new-dir');

      await ensureDir(dirPath);

      const exists = await fileExists(dirPath);
      expect(exists).toBe(true);
    });

    it('should create nested directories', async () => {
      const dirPath = path.join(testDir, 'a', 'b', 'c');

      await ensureDir(dirPath);

      const exists = await fileExists(dirPath);
      expect(exists).toBe(true);
    });

    it('should not fail if directory already exists', async () => {
      const dirPath = path.join(testDir, 'existing');
      await fs.mkdir(dirPath);

      await expect(ensureDir(dirPath)).resolves.not.toThrow();
    });
  });

  describe('writeFileSafe', () => {
    it('should write file and create parent directories', async () => {
      const filePath = path.join(testDir, 'nested', 'dir', 'file.txt');
      const content = 'Test content';

      await writeFileSafe(filePath, content);

      const exists = await fileExists(filePath);
      expect(exists).toBe(true);

      const readContent = await fs.readFile(filePath, 'utf-8');
      expect(readContent).toBe(content);
    });

    it('should overwrite existing file', async () => {
      const filePath = path.join(testDir, 'overwrite.txt');
      await fs.writeFile(filePath, 'old content');

      await writeFileSafe(filePath, 'new content');

      const content = await fs.readFile(filePath, 'utf-8');
      expect(content).toBe('new content');
    });
  });
});
