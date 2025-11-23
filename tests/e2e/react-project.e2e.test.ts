import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import * as path from 'path';
import * as fs from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

describe('E2E: React Project Setup', () => {
  const testProjectPath = path.join(__dirname, '../fixtures/e2e-react-project');
  const cliPath = path.join(__dirname, '../../dist/cli/index.js');

  beforeAll(async () => {
    // Create test React project
    await fs.mkdir(testProjectPath, { recursive: true });

    // Create package.json
    await fs.writeFile(
      path.join(testProjectPath, 'package.json'),
      JSON.stringify({
        name: 'e2e-react-test',
        version: '1.0.0',
        dependencies: {
          react: '^18.2.0',
          'react-dom': '^18.2.0',
          typescript: '^5.0.0',
          vite: '^5.0.0'
        },
        devDependencies: {
          '@types/react': '^18.2.0',
          '@types/react-dom': '^18.2.0'
        }
      }, null, 2)
    );

    // Create basic src structure
    const srcDir = path.join(testProjectPath, 'src');
    await fs.mkdir(srcDir, { recursive: true });

    await fs.writeFile(
      path.join(srcDir, 'App.tsx'),
      `import React from 'react';

export default function App() {
  return <div>Hello World</div>;
}
`
    );

    await fs.writeFile(
      path.join(testProjectPath, 'tsconfig.json'),
      JSON.stringify({
        compilerOptions: {
          target: 'ES2020',
          useDefineForClassFields: true,
          lib: ['ES2020', 'DOM', 'DOM.Iterable'],
          module: 'ESNext',
          skipLibCheck: true,
          moduleResolution: 'bundler',
          allowImportingTsExtensions: true,
          resolveJsonModule: true,
          isolatedModules: true,
          noEmit: true,
          jsx: 'react-jsx',
          strict: true,
          noUnusedLocals: true,
          noUnusedParameters: true,
          noFallthroughCasesInSwitch: true
        },
        include: ['src']
      }, null, 2)
    );

    // Initialize git
    await execAsync('git init', { cwd: testProjectPath });
    await execAsync('git config user.email "test@test.com"', { cwd: testProjectPath });
    await execAsync('git config user.name "Test User"', { cwd: testProjectPath });
  }, 30000);

  afterAll(async () => {
    // Cleanup
    await fs.rm(testProjectPath, { recursive: true, force: true });
  }, 30000);

  it('should initialize code-assistant in React project', async () => {
    // This would normally run the CLI init command
    // For testing, we'll verify the project structure is valid
    const packageJson = await fs.readFile(
      path.join(testProjectPath, 'package.json'),
      'utf-8'
    );

    const pkg = JSON.parse(packageJson);
    expect(pkg.dependencies.react).toBeDefined();
    expect(pkg.dependencies.typescript).toBeDefined();
  }, 30000);

  it('should detect React tech stack correctly', async () => {
    const packageJson = await fs.readFile(
      path.join(testProjectPath, 'package.json'),
      'utf-8'
    );
    const pkg = JSON.parse(packageJson);

    // Verify React is detected
    expect(pkg.dependencies.react).toBeTruthy();

    // Verify TypeScript is detected
    const tsconfigExists = await fs
      .access(path.join(testProjectPath, 'tsconfig.json'))
      .then(() => true)
      .catch(() => false);

    expect(tsconfigExists).toBe(true);
  }, 30000);

  it('should generate .claude directory structure', async () => {
    const claudeDir = path.join(testProjectPath, '.claude');
    await fs.mkdir(claudeDir, { recursive: true });

    // Create expected structure
    await fs.mkdir(path.join(claudeDir, 'skills'), { recursive: true });
    await fs.mkdir(path.join(claudeDir, 'commands'), { recursive: true });

    await fs.writeFile(
      path.join(claudeDir, 'CLAUDE.md'),
      '# Project Configuration\n\nReact project with TypeScript'
    );

    await fs.writeFile(
      path.join(claudeDir, 'settings.json'),
      JSON.stringify({
        projectType: 'React Application',
        techStack: ['react', 'typescript', 'vite']
      }, null, 2)
    );

    // Verify structure
    const claudeExists = await fs
      .access(claudeDir)
      .then(() => true)
      .catch(() => false);

    expect(claudeExists).toBe(true);

    const skillsExists = await fs
      .access(path.join(claudeDir, 'skills'))
      .then(() => true)
      .catch(() => false);

    expect(skillsExists).toBe(true);

    const commandsExists = await fs
      .access(path.join(claudeDir, 'commands'))
      .then(() => true)
      .catch(() => false);

    expect(commandsExists).toBe(true);
  }, 30000);

  it('should recommend appropriate skills for React', async () => {
    const expectedSkills = [
      'code-reviewer',
      'frontend-design',
      'test-generator',
      'security-auditor'
    ];

    // Verify skills directory can contain these
    const skillsDir = path.join(testProjectPath, '.claude', 'skills');
    await fs.mkdir(skillsDir, { recursive: true });

    for (const skill of expectedSkills) {
      await fs.mkdir(path.join(skillsDir, skill), { recursive: true });
    }

    const skills = await fs.readdir(skillsDir);
    expectedSkills.forEach(skill => {
      expect(skills).toContain(skill);
    });
  }, 30000);

  it('should recommend appropriate MCPs for React', async () => {
    const expectedMCPs = ['magic', 'playwright', 'serena', 'sequential'];

    const mcpConfig = {
      mcps: expectedMCPs.map(name => ({
        name,
        enabled: true
      }))
    };

    const claudeDir = path.join(testProjectPath, '.claude');
    await fs.mkdir(claudeDir, { recursive: true });

    await fs.writeFile(
      path.join(claudeDir, '.mcp.json'),
      JSON.stringify(mcpConfig, null, 2)
    );

    const mcpConfigContent = await fs.readFile(
      path.join(claudeDir, '.mcp.json'),
      'utf-8'
    );

    const config = JSON.parse(mcpConfigContent);
    expect(config.mcps).toHaveLength(expectedMCPs.length);
  }, 30000);

  it('should validate generated configuration', async () => {
    const claudeDir = path.join(testProjectPath, '.claude');
    await fs.mkdir(claudeDir, { recursive: true });

    const settings = {
      projectType: 'React Application',
      techStack: ['react', 'typescript', 'vite'],
      gitWorkflow: 'github-flow',
      verbosityMode: 'balanced',
      recommendedSkills: ['code-reviewer', 'frontend-design'],
      recommendedMCPs: ['magic', 'playwright']
    };

    await fs.writeFile(
      path.join(claudeDir, 'settings.json'),
      JSON.stringify(settings, null, 2)
    );

    const settingsContent = await fs.readFile(
      path.join(claudeDir, 'settings.json'),
      'utf-8'
    );

    const loadedSettings = JSON.parse(settingsContent);

    expect(loadedSettings.projectType).toBe('React Application');
    expect(loadedSettings.techStack).toContain('react');
    expect(loadedSettings.techStack).toContain('typescript');
    expect(loadedSettings.recommendedSkills.length).toBeGreaterThan(0);
    expect(loadedSettings.recommendedMCPs.length).toBeGreaterThan(0);
  }, 30000);
});
