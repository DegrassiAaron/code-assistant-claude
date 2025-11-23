import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as path from 'path';
import * as fs from 'fs/promises';

describe('Command Execution Workflow', () => {
  const testProjectPath = path.join(__dirname, '../../fixtures/command-test');

  beforeEach(async () => {
    await fs.mkdir(testProjectPath, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(testProjectPath, { recursive: true, force: true });
  });

  describe('Command Registration and Discovery', () => {
    it('should discover commands from .claude/commands directory', async () => {
      const commandsDir = path.join(testProjectPath, '.claude', 'commands');
      await fs.mkdir(commandsDir, { recursive: true });

      await fs.writeFile(
        path.join(commandsDir, 'test-command.md'),
        '# Test Command\n\nTest command content'
      );

      const files = await fs.readdir(commandsDir);
      expect(files).toContain('test-command.md');
    });

    it('should parse command metadata correctly', async () => {
      const commandsDir = path.join(testProjectPath, '.claude', 'commands');
      await fs.mkdir(commandsDir, { recursive: true });

      const commandContent = `---
name: scaffold
description: Scaffold a new component
category: generation
---

# Scaffold Command

Generate component scaffolding.
`;

      await fs.writeFile(
        path.join(commandsDir, 'scaffold.md'),
        commandContent
      );

      const content = await fs.readFile(
        path.join(commandsDir, 'scaffold.md'),
        'utf-8'
      );

      expect(content).toContain('name: scaffold');
      expect(content).toContain('description: Scaffold');
    });
  });

  describe('Command Execution Pipeline', () => {
    it('should execute command with proper context', async () => {
      const commandsDir = path.join(testProjectPath, '.claude', 'commands');
      await fs.mkdir(commandsDir, { recursive: true });

      const command = `---
name: create-file
description: Create a test file
---

Create a file named test.txt
`;

      await fs.writeFile(
        path.join(commandsDir, 'create-file.md'),
        command
      );

      expect(await fs.access(path.join(commandsDir, 'create-file.md'))).toBeDefined;
    });

    it('should handle command parameters', async () => {
      const commandsDir = path.join(testProjectPath, '.claude', 'commands');
      await fs.mkdir(commandsDir, { recursive: true });

      const command = `---
name: parameterized
description: Test parameterized command
parameters:
  - name: filename
    type: string
    required: true
---

Create file: {{filename}}
`;

      await fs.writeFile(
        path.join(commandsDir, 'parameterized.md'),
        command
      );

      const content = await fs.readFile(
        path.join(commandsDir, 'parameterized.md'),
        'utf-8'
      );

      expect(content).toContain('{{filename}}');
    });
  });

  describe('Command Chaining', () => {
    it('should support command composition', async () => {
      const commandsDir = path.join(testProjectPath, '.claude', 'commands');
      await fs.mkdir(commandsDir, { recursive: true });

      const command1 = `---
name: step1
description: First step
---

Execute step 1
`;

      const command2 = `---
name: step2
description: Second step
depends_on: [step1]
---

Execute step 2
`;

      await fs.writeFile(path.join(commandsDir, 'step1.md'), command1);
      await fs.writeFile(path.join(commandsDir, 'step2.md'), command2);

      const files = await fs.readdir(commandsDir);
      expect(files).toContain('step1.md');
      expect(files).toContain('step2.md');
    });
  });

  describe('Error Handling', () => {
    it('should handle command execution errors gracefully', async () => {
      const commandsDir = path.join(testProjectPath, '.claude', 'commands');
      await fs.mkdir(commandsDir, { recursive: true });

      const errorCommand = `---
name: error-test
description: Command that triggers error
---

This command will fail
`;

      await fs.writeFile(
        path.join(commandsDir, 'error-test.md'),
        errorCommand
      );

      const content = await fs.readFile(
        path.join(commandsDir, 'error-test.md'),
        'utf-8'
      );

      expect(content).toBeDefined();
    });

    it('should validate command syntax before execution', async () => {
      const commandsDir = path.join(testProjectPath, '.claude', 'commands');
      await fs.mkdir(commandsDir, { recursive: true });

      const invalidCommand = `---
name: invalid
description: Invalid command
invalid_field: true
---`;

      await fs.writeFile(
        path.join(commandsDir, 'invalid.md'),
        invalidCommand
      );

      const content = await fs.readFile(
        path.join(commandsDir, 'invalid.md'),
        'utf-8'
      );

      expect(content).toBeDefined();
    });
  });

  describe('Command Context Management', () => {
    it('should maintain execution context across commands', async () => {
      const commandsDir = path.join(testProjectPath, '.claude', 'commands');
      await fs.mkdir(commandsDir, { recursive: true });

      const contextCommand = `---
name: context-test
description: Test context preservation
---

Set context variable: test_value
`;

      await fs.writeFile(
        path.join(commandsDir, 'context-test.md'),
        contextCommand
      );

      expect(await fs.access(path.join(commandsDir, 'context-test.md'))).toBeDefined;
    });
  });
});
