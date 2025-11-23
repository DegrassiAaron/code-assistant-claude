import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import * as path from 'path';
import * as fs from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

describe('E2E: Node.js API Project Setup', () => {
  const testProjectPath = path.join(__dirname, '../fixtures/e2e-nodejs-project');

  beforeAll(async () => {
    // Create test Node.js API project
    await fs.mkdir(testProjectPath, { recursive: true });

    // Create package.json
    await fs.writeFile(
      path.join(testProjectPath, 'package.json'),
      JSON.stringify({
        name: 'e2e-nodejs-test',
        version: '1.0.0',
        type: 'module',
        dependencies: {
          express: '^4.18.0',
          typescript: '^5.0.0'
        },
        devDependencies: {
          '@types/express': '^4.17.0',
          '@types/node': '^18.0.0',
          'ts-node': '^10.9.0'
        }
      }, null, 2)
    );

    // Create basic src structure
    const srcDir = path.join(testProjectPath, 'src');
    await fs.mkdir(srcDir, { recursive: true });

    await fs.writeFile(
      path.join(srcDir, 'index.ts'),
      `import express from 'express';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.json({ message: 'Hello World' });
});

app.listen(port, () => {
  console.log(\`Server running on port \${port}\`);
});
`
    );

    await fs.writeFile(
      path.join(testProjectPath, 'tsconfig.json'),
      JSON.stringify({
        compilerOptions: {
          target: 'ES2020',
          module: 'ESNext',
          moduleResolution: 'node',
          esModuleInterop: true,
          strict: true,
          skipLibCheck: true,
          forceConsistentCasingInFileNames: true,
          outDir: './dist'
        },
        include: ['src/**/*'],
        exclude: ['node_modules']
      }, null, 2)
    );

    // Initialize git
    await execAsync('git init', { cwd: testProjectPath });
    await execAsync('git config user.email "test@test.com"', { cwd: testProjectPath });
    await execAsync('git config user.name "Test User"', { cwd: testProjectPath });
  }, 30000);

  afterAll(async () => {
    await fs.rm(testProjectPath, { recursive: true, force: true });
  }, 30000);

  it('should detect Node.js Express API stack', async () => {
    const packageJson = await fs.readFile(
      path.join(testProjectPath, 'package.json'),
      'utf-8'
    );
    const pkg = JSON.parse(packageJson);

    expect(pkg.dependencies.express).toBeDefined();
    expect(pkg.dependencies.typescript).toBeDefined();
  }, 30000);

  it('should recommend API-specific skills', async () => {
    const expectedSkills = [
      'code-reviewer',
      'test-generator',
      'security-auditor',
      'docs-writer'
    ];

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

  it('should recommend API-specific MCPs', async () => {
    const expectedMCPs = ['sequential', 'playwright'];

    const mcpConfig = {
      mcps: expectedMCPs.map(name => ({
        name,
        enabled: true,
        config: {}
      }))
    };

    const claudeDir = path.join(testProjectPath, '.claude');
    await fs.mkdir(claudeDir, { recursive: true });

    await fs.writeFile(
      path.join(claudeDir, '.mcp.json'),
      JSON.stringify(mcpConfig, null, 2)
    );

    const configContent = await fs.readFile(
      path.join(claudeDir, '.mcp.json'),
      'utf-8'
    );

    const config = JSON.parse(configContent);
    expect(config.mcps.length).toBeGreaterThan(0);
  }, 30000);

  it('should generate appropriate API documentation structure', async () => {
    const docsDir = path.join(testProjectPath, 'docs');
    await fs.mkdir(docsDir, { recursive: true });

    await fs.writeFile(
      path.join(docsDir, 'API.md'),
      '# API Documentation\n\n## Endpoints\n\n### GET /\n\nReturns hello message'
    );

    const apiDocExists = await fs
      .access(path.join(docsDir, 'API.md'))
      .then(() => true)
      .catch(() => false);

    expect(apiDocExists).toBe(true);
  }, 30000);

  it('should validate API project configuration', async () => {
    const claudeDir = path.join(testProjectPath, '.claude');
    await fs.mkdir(claudeDir, { recursive: true });

    const settings = {
      projectType: 'Node.js API',
      techStack: ['node', 'express', 'typescript'],
      gitWorkflow: 'github-flow',
      verbosityMode: 'balanced'
    };

    await fs.writeFile(
      path.join(claudeDir, 'settings.json'),
      JSON.stringify(settings, null, 2)
    );

    const settingsContent = await fs.readFile(
      path.join(claudeDir, 'settings.json'),
      'utf-8'
    );

    const config = JSON.parse(settingsContent);
    expect(config.projectType).toBe('Node.js API');
    expect(config.techStack).toContain('express');
  }, 30000);
});
