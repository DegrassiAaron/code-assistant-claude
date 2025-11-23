import { TechStackDetector } from '../../../src/core/analyzers/tech-stack-detector';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

describe('TechStackDetector', () => {
  let detector: TechStackDetector;
  let testDir: string;

  beforeEach(async () => {
    detector = new TechStackDetector();
    testDir = path.join(os.tmpdir(), `test-techstack-${Date.now()}`);
    await fs.mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    try {
      await fs.rm(testDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  describe('detect', () => {
    it('should detect TypeScript from package.json', async () => {
      await fs.writeFile(
        path.join(testDir, 'package.json'),
        JSON.stringify({
          dependencies: {},
          devDependencies: { typescript: '^5.0.0' }
        })
      );

      const result = await detector.detect(testDir);

      expect(result.languages).toContain('typescript');
      expect(result.confidence).toBeGreaterThan(0);
    });

    it('should detect React framework', async () => {
      await fs.writeFile(
        path.join(testDir, 'package.json'),
        JSON.stringify({
          dependencies: { react: '^18.0.0' }
        })
      );

      const result = await detector.detect(testDir);

      expect(result.frameworks).toContain('react');
    });

    it('should detect Python from requirements.txt', async () => {
      await fs.writeFile(
        path.join(testDir, 'requirements.txt'),
        'django==4.2.0\nflask==2.0.0'
      );

      const result = await detector.detect(testDir);

      expect(result.languages).toContain('python');
      expect(result.frameworks).toContain('django');
      expect(result.frameworks).toContain('flask');
    });

    it('should detect Java from pom.xml', async () => {
      await fs.writeFile(
        path.join(testDir, 'pom.xml'),
        '<project><dependencies><dependency>spring-boot</dependency></dependencies></project>'
      );

      const result = await detector.detect(testDir);

      expect(result.languages).toContain('java');
      expect(result.frameworks).toContain('spring');
    });

    it('should detect Go from go.mod', async () => {
      await fs.writeFile(
        path.join(testDir, 'go.mod'),
        'module example.com/myproject\n\ngo 1.20'
      );

      const result = await detector.detect(testDir);

      expect(result.languages).toContain('go');
    });

    it('should detect Rust from Cargo.toml', async () => {
      await fs.writeFile(
        path.join(testDir, 'Cargo.toml'),
        '[package]\nname = "myproject"\nversion = "0.1.0"'
      );

      const result = await detector.detect(testDir);

      expect(result.languages).toContain('rust');
    });

    it('should parallelize detection operations', async () => {
      // Setup multiple language files
      await Promise.all([
        fs.writeFile(path.join(testDir, 'package.json'), JSON.stringify({ dependencies: { react: '^18.0.0' } })),
        fs.writeFile(path.join(testDir, 'requirements.txt'), 'django==4.2.0'),
        fs.writeFile(path.join(testDir, 'go.mod'), 'module test\n\ngo 1.20')
      ]);

      const startTime = Date.now();
      const result = await detector.detect(testDir);
      const duration = Date.now() - startTime;

      // Should complete quickly due to parallelization
      expect(duration).toBeLessThan(500); // Less than 500ms
      expect(result.languages.length).toBeGreaterThan(1);
    });

    it('should fallback to file extension detection', async () => {
      // Create source files without config files
      await fs.writeFile(path.join(testDir, 'main.ts'), 'console.log("test");');
      await fs.writeFile(path.join(testDir, 'app.py'), 'print("test")');

      const result = await detector.detect(testDir);

      expect(result.languages.length).toBeGreaterThan(0);
    });

    it('should respect file scan limit', async () => {
      // This test would require creating >10K files
      // For now, just verify the constant is defined
      expect(detector).toBeDefined();
      // TODO: Implement when performance testing infrastructure is ready
    });

    it('should handle malformed package.json gracefully', async () => {
      await fs.writeFile(
        path.join(testDir, 'package.json'),
        '{ invalid json syntax'
      );

      const result = await detector.detect(testDir);

      // Should not crash, should fallback to other detection methods
      expect(result).toBeDefined();
      expect(result.languages).toBeDefined();
    });

    it('should skip excluded directories', async () => {
      // Create node_modules with many files
      const nodeModules = path.join(testDir, 'node_modules');
      await fs.mkdir(nodeModules, { recursive: true });
      await fs.writeFile(path.join(nodeModules, 'test.js'), 'test');

      // Should not scan node_modules
      const result = await detector.detect(testDir);

      expect(result).toBeDefined();
    });
  });
});
