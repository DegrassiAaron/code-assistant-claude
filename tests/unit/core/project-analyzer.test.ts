import { ProjectAnalyzer } from '../../../src/core/analyzers/project-analyzer';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

describe('ProjectAnalyzer', () => {
  let analyzer: ProjectAnalyzer;
  let testDir: string;

  beforeEach(async () => {
    analyzer = new ProjectAnalyzer();
    // Create temp directory for tests
    testDir = path.join(os.tmpdir(), `test-project-${Date.now()}`);
    await fs.mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    // Cleanup
    try {
      await fs.rm(testDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  describe('analyze', () => {
    it('should detect TypeScript React project', async () => {
      // Setup
      const packageJson = {
        dependencies: {
          react: '^18.0.0',
          typescript: '^5.0.0'
        },
        devDependencies: {
          vite: '^4.0.0'
        }
      };

      await fs.writeFile(
        path.join(testDir, 'package.json'),
        JSON.stringify(packageJson, null, 2)
      );

      await fs.writeFile(
        path.join(testDir, 'tsconfig.json'),
        JSON.stringify({ compilerOptions: {} }, null, 2)
      );

      // Execute
      const result = await analyzer.analyze(testDir);

      // Assert
      expect(result.type).toBe('React Application');
      expect(result.techStack).toContain('typescript');
      expect(result.techStack).toContain('react');
      expect(result.confidence).toBeGreaterThan(0);
    });

    it('should detect Python Django project', async () => {
      // Setup
      await fs.writeFile(
        path.join(testDir, 'requirements.txt'),
        'django==4.2.0\npytest==7.0.0'
      );

      // Execute
      const result = await analyzer.analyze(testDir);

      // Assert
      expect(result.type).toContain('Django');
      expect(result.techStack).toContain('python');
      expect(result.confidence).toBeGreaterThan(0);
    });

    it('should extract project purpose from CLAUDE.md', async () => {
      // Setup
      const claudeMd = `# My Project

This is a test project for demonstrating the analyzer.

## Guidelines
- Follow conventions
`;

      await fs.writeFile(path.join(testDir, 'CLAUDE.md'), claudeMd);

      await fs.writeFile(
        path.join(testDir, 'package.json'),
        JSON.stringify({ dependencies: {} }, null, 2)
      );

      // Execute
      const result = await analyzer.analyze(testDir);

      // Assert
      expect(result.purpose).toBeTruthy();
      expect(result.purpose).toContain('test project');
    });

    it('should detect domain from documentation', async () => {
      // Setup
      const readmeMd = `# E-commerce Platform

A shopping cart and checkout system for online retail.
`;

      await fs.writeFile(path.join(testDir, 'README.md'), readmeMd);

      await fs.writeFile(
        path.join(testDir, 'package.json'),
        JSON.stringify({ dependencies: {} }, null, 2)
      );

      // Execute
      const result = await analyzer.analyze(testDir);

      // Assert
      expect(result.domain).toContain('e-commerce');
    });

    it('should handle project without documentation gracefully', async () => {
      // Setup - minimal project with just package.json
      await fs.writeFile(
        path.join(testDir, 'package.json'),
        JSON.stringify({ dependencies: { express: '^4.18.0' } }, null, 2)
      );

      // Execute
      const result = await analyzer.analyze(testDir);

      // Assert
      expect(result.type).toBeTruthy();
      expect(result.techStack).toContain('javascript');
      expect(result.confidence).toBeGreaterThan(0);
    });

    it('should calculate confidence score based on available information', async () => {
      // Setup - project with everything
      await fs.writeFile(
        path.join(testDir, 'package.json'),
        JSON.stringify({ dependencies: { react: '^18.0.0' } }, null, 2)
      );

      await fs.writeFile(
        path.join(testDir, 'CLAUDE.md'),
        '# Project\n\nThis is a React project for social media.'
      );

      // Execute
      const result = await analyzer.analyze(testDir);

      // Assert - should have high confidence with all info present
      expect(result.confidence).toBeGreaterThan(0.5);
    });
  });
});
