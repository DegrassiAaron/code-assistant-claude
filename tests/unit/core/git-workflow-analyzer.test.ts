import { GitWorkflowAnalyzer } from '../../../src/core/analyzers/git-workflow-analyzer';
import { execSync } from 'child_process';
import path from 'path';
import os from 'os';
import { promises as fs } from 'fs';

describe('GitWorkflowAnalyzer', () => {
  let analyzer: GitWorkflowAnalyzer;
  let testDir: string;

  beforeEach(async () => {
    analyzer = new GitWorkflowAnalyzer();
    testDir = path.join(os.tmpdir(), `test-git-${Date.now()}`);
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
    it('should detect GitFlow workflow', async () => {
      // Setup git repo with GitFlow structure
      execSync('git init', { cwd: testDir });
      execSync('git config user.name "Test"', { cwd: testDir });
      execSync('git config user.email "test@example.com"', { cwd: testDir });
      execSync('git checkout -b main', { cwd: testDir });
      execSync('git commit --allow-empty -m "Initial commit"', { cwd: testDir });
      execSync('git checkout -b develop', { cwd: testDir });
      execSync('git checkout -b feature/test-feature', { cwd: testDir });

      const result = await analyzer.detect(testDir);

      expect(result.workflow).toBe('gitflow');
      expect(result.mainBranch).toBe('main');
      expect(result.developBranch).toBe('develop');
      expect(result.branchPrefixes).toContain('feature');
    });

    it('should detect GitHub Flow workflow', async () => {
      // Setup git repo with GitHub Flow structure
      execSync('git init', { cwd: testDir });
      execSync('git config user.name "Test"', { cwd: testDir });
      execSync('git config user.email "test@example.com"', { cwd: testDir });
      execSync('git checkout -b main', { cwd: testDir });
      execSync('git commit --allow-empty -m "Initial commit"', { cwd: testDir });
      execSync('git checkout -b add-feature', { cwd: testDir });

      const result = await analyzer.detect(testDir);

      expect(result.workflow).toBe('github-flow');
      expect(result.mainBranch).toBe('main');
      expect(result.developBranch).toBeUndefined();
    });

    it('should detect Trunk-Based workflow', async () => {
      // Setup git repo with single branch
      execSync('git init', { cwd: testDir });
      execSync('git config user.name "Test"', { cwd: testDir });
      execSync('git config user.email "test@example.com"', { cwd: testDir });
      execSync('git checkout -b main', { cwd: testDir });
      execSync('git commit --allow-empty -m "Initial commit"', { cwd: testDir });

      const result = await analyzer.detect(testDir);

      expect(result.workflow).toBe('trunk-based');
      expect(result.mainBranch).toBe('main');
    });

    it('should throw error for non-git directory', async () => {
      await expect(analyzer.detect(testDir))
        .rejects.toThrow('Not a git repository');
    });

    it('should extract branch prefixes correctly', async () => {
      execSync('git init', { cwd: testDir });
      execSync('git config user.name "Test"', { cwd: testDir });
      execSync('git config user.email "test@example.com"', { cwd: testDir });
      execSync('git checkout -b main', { cwd: testDir });
      execSync('git commit --allow-empty -m "Initial commit"', { cwd: testDir });
      execSync('git checkout -b develop', { cwd: testDir });
      execSync('git checkout -b feature/auth', { cwd: testDir });
      execSync('git checkout -b bugfix/login', { cwd: testDir });
      execSync('git checkout -b hotfix/security', { cwd: testDir });

      const result = await analyzer.detect(testDir);

      expect(result.branchPrefixes).toContain('feature');
      expect(result.branchPrefixes).toContain('bugfix');
      expect(result.branchPrefixes).toContain('hotfix');
    });
  });
});
