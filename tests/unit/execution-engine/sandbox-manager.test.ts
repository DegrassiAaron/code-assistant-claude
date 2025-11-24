/// <reference types="vitest" />
import { SandboxManager } from '../../../src/core/execution-engine/sandbox/sandbox-manager';
import type { SandboxConfig } from '../../../src/core/execution-engine/types';

describe('SandboxManager', () => {
  let sandboxManager: SandboxManager;

  beforeEach(() => {
    sandboxManager = new SandboxManager();
  });

  afterEach(async () => {
    await sandboxManager.cleanup();
  });

  describe('initialization', () => {
    it('should initialize with default configuration', () => {
      expect(sandboxManager).toBeDefined();
    });

    it('should initialize with custom configuration', () => {
      const config: SandboxConfig = {
        type: 'process',
        resourceLimits: {
          memory: '256M',
          cpu: 1,
          timeout: 5000
        }
      };

      const customSandbox = new SandboxManager(config);
      expect(customSandbox).toBeDefined();
    });
  });

  describe('selectSandboxLevel', () => {
    it('should select process sandbox for low-risk code', () => {
      const level = sandboxManager.selectSandboxLevel({
        riskScore: 0.2,
        codeType: 'read-only',
        operations: ['fs.readFile']
      });

      expect(level).toBe('process');
    });

    it('should select VM sandbox for medium-risk code', () => {
      const level = sandboxManager.selectSandboxLevel({
        riskScore: 0.5,
        codeType: 'write',
        operations: ['fs.writeFile', 'child_process.exec']
      });

      expect(level).toBe('vm');
    });

    it('should select Docker sandbox for high-risk code', () => {
      const level = sandboxManager.selectSandboxLevel({
        riskScore: 0.8,
        codeType: 'network',
        operations: ['net.connect', 'child_process.spawn']
      });

      expect(level).toBe('docker');
    });
  });

  describe('executeInSandbox', () => {
    it('should execute safe code successfully', async () => {
      const code = 'return 2 + 2;';

      const result = await sandboxManager.executeInSandbox(code, {
        level: 'process',
        timeout: 5000
      });

      expect(result.success).toBe(true);
      expect(result.result).toBe(4);
    });

    it('should timeout long-running code', async () => {
      const code = 'while(true) {}';

      const result = await sandboxManager.executeInSandbox(code, {
        level: 'process',
        timeout: 100
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('timeout');
    }, 10000);

    it('should catch runtime errors', async () => {
      const code = 'throw new Error("Test error");';

      const result = await sandboxManager.executeInSandbox(code, {
        level: 'process',
        timeout: 5000
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Test error');
    });

    it('should restrict dangerous operations', async () => {
      const code = 'require("child_process").exec("rm -rf /");';

      const result = await sandboxManager.executeInSandbox(code, {
        level: 'vm',
        timeout: 5000
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('resource limiting', () => {
    it('should enforce memory limits', async () => {
      const code = `
        const arr = [];
        for(let i = 0; i < 1000000; i++) {
          arr.push(new Array(1000).fill(Math.random()));
        }
      `;

      const result = await sandboxManager.executeInSandbox(code, {
        level: 'process',
        timeout: 5000,
        memoryLimit: 50 // 50MB
      });

      expect(result.success).toBe(false);
    }, 10000);

    it('should enforce CPU limits', async () => {
      const code = `
        let count = 0;
        for(let i = 0; i < 1000000000; i++) {
          count += Math.sqrt(i);
        }
      `;

      const result = await sandboxManager.executeInSandbox(code, {
        level: 'process',
        timeout: 100,
        cpuLimit: 0.5
      });

      expect(result.success).toBe(false);
    });
  });

  describe('context isolation', () => {
    it('should isolate sandbox context from host', async () => {
      const code = 'return typeof process;';

      const result = await sandboxManager.executeInSandbox(code, {
        level: 'vm',
        timeout: 5000
      });

      expect(result.result).toBe('undefined');
    });

    it('should provide only allowed globals', async () => {
      const code = 'return { hasConsole: typeof console !== "undefined" };';

      const result = await sandboxManager.executeInSandbox(code, {
        level: 'process',
        timeout: 5000,
        allowedGlobals: ['console']
      });

      expect(result.success).toBe(true);
      const payload = result.result as { hasConsole?: boolean } | undefined;
      expect(payload?.hasConsole).toBe(true);
    });
  });

  describe('cleanup', () => {
    it('should cleanup all sandboxes', async () => {
      await sandboxManager.executeInSandbox('return 1;', {
        level: 'process',
        timeout: 5000
      });

      await expect(sandboxManager.cleanup()).resolves.not.toThrow();
    });

    it('should cleanup specific sandbox', async () => {
      const sessionId = 'test-session';

      await sandboxManager.executeInSandbox('return 1;', {
        level: 'process',
        timeout: 5000,
        sessionId
      });

      await expect(
        sandboxManager.cleanupSession(sessionId)
      ).resolves.not.toThrow();
    });
  });
});
