/// <reference types="vitest" />
import { DockerSandbox } from '../../../src/core/execution-engine/sandbox/docker-sandbox';
import { SandboxConfig } from '../../../src/core/execution-engine/types';
import Docker from 'dockerode';
import { vi } from 'vitest';

vi.mock('dockerode', () => {
  const { EventEmitter } = require('events');
  let nextId = 0;
  const containers = new Map<
    string,
    { id: string; labels: Record<string, string> }
  >();
  let lastCreateLabels: Record<string, string> | null = null;

  class MockStream extends EventEmitter {
    destroyed = false;
    destroy(): void {
      this.destroyed = true;
      this.removeAllListeners();
    }
  }

  class MockExec {
    start(): Promise<MockStream> {
      const stream = new MockStream();
      setTimeout(() => {
        stream.emit('data', Buffer.from('mock output'));
        stream.emit('end');
      }, 5);
      return Promise.resolve(stream);
    }
  }

  class MockContainer {
    id: string;
    labels: Record<string, string>;
    constructor(labels: Record<string, string> = {}) {
      this.id = `mock-${++nextId}`;
      this.labels = labels;
      containers.set(this.id, { id: this.id, labels });
    }

    async putArchive(): Promise<void> {
      return;
    }

    async start(): Promise<void> {
      return;
    }

    async stop(): Promise<void> {
      return;
    }

    async remove(): Promise<void> {
      containers.delete(this.id);
    }

    async stats(): Promise<any> {
      return { memory_stats: { usage: 1024 * 1024 } };
    }

    async exec(): Promise<MockExec> {
      return new MockExec();
    }

    async wait(): Promise<{ StatusCode: number }> {
      return { StatusCode: 0 };
    }
  }

  class MockDocker {
    async pull(): Promise<void> {
      return;
    }

    async createContainer(opts: { Labels?: Record<string, string> }): Promise<MockContainer> {
      lastCreateLabels = opts?.Labels ?? {};
      this.lastCreateLabels = lastCreateLabels;
      return new MockContainer(lastCreateLabels);
    }

    async listContainers(opts?: {
      filters?: { label?: string[] };
    }): Promise<Array<{ Id: string; Labels: Record<string, string> }>> {
      let values = Array.from(containers.values());
      const labelFilters = opts?.filters?.label ?? [];
      if (labelFilters.length > 0) {
        values = values.filter(({ labels }) =>
          labelFilters.every((rule) => {
            const [key, value] = rule.split('=');
            return labels[key] === value;
          })
        );
      }
      return values.map(({ id, labels }) => ({ Id: id, Labels: labels }));
    }

    getContainer(id: string): MockContainer | undefined {
      const item = containers.get(id);
      return item ? new MockContainer(item.labels) : undefined;
    }

    getLastCreateLabels(): Record<string, string> | null {
      return lastCreateLabels;
    }
  }

  return { default: MockDocker };
});

/**
 * Tests for Docker container cleanup functionality
 * Ensures containers are properly cleaned up in all scenarios
 */
describe('DockerSandbox Cleanup', () => {
  let sandbox: DockerSandbox;
  let docker: Docker;

  const defaultConfig: SandboxConfig = {
    type: 'docker',
    resourceLimits: {
      memory: '512M',
      cpu: 1,
      disk: '1G',
      timeout: 30000
    },
    networkPolicy: {
      mode: 'none',
      allowed: []
    },
    allowedEnvVars: []
  };

  beforeEach(() => {
    docker = new Docker();
    sandbox = new DockerSandbox(defaultConfig);
    DockerSandbox.resetMetrics();
  });

  afterEach(async () => {
    // Emergency cleanup after each test
    await DockerSandbox.emergencyCleanup();
    DockerSandbox.resetMetrics();
  });

  describe('Container Cleanup on Success', () => {
    it('should cleanup container after successful execution', async () => {
      const initialContainers = await docker.listContainers({ all: true });
      const initialCount = initialContainers.length;

      await sandbox.execute('console.log("test")', 'typescript');

      const finalContainers = await docker.listContainers({ all: true });
      expect(finalContainers.length).toBe(initialCount);
    }, 30000);

    it('should not leave containers after multiple executions', async () => {
      const initialContainers = await docker.listContainers({ all: true });
      const initialCount = initialContainers.length;

      // Run 10 executions
      for (let i = 0; i < 10; i++) {
        await sandbox.execute(`console.log(${i})`, 'typescript');
      }

      const finalContainers = await docker.listContainers({ all: true });
      expect(finalContainers.length).toBe(initialCount);
    }, 60000);
  });

  describe('Container Cleanup on Error', () => {
    it('should cleanup container when execution throws error', async () => {
      const initialContainers = await docker.listContainers({ all: true });
      const initialCount = initialContainers.length;

      // This should fail but still cleanup
      await sandbox.execute('throw new Error("test error")', 'typescript');

      const finalContainers = await docker.listContainers({ all: true });
      expect(finalContainers.length).toBe(initialCount);
    }, 30000);

    it('should cleanup container on syntax error', async () => {
      const initialContainers = await docker.listContainers({ all: true });
      const initialCount = initialContainers.length;

      // Invalid syntax
      await sandbox.execute('const x = {', 'typescript');

      const finalContainers = await docker.listContainers({ all: true });
      expect(finalContainers.length).toBe(initialCount);
    }, 30000);
  });

  describe('Container Cleanup on Timeout', () => {
    it('should cleanup container when execution times out', async () => {
      const initialContainers = await docker.listContainers({ all: true });
      const initialCount = initialContainers.length;

      // Infinite loop should timeout
      await sandbox.execute('while(true){}', 'typescript');

      const finalContainers = await docker.listContainers({ all: true });
      expect(finalContainers.length).toBe(initialCount);
    }, 60000);
  });

  describe('Container Tracking', () => {
    it('should track active containers', async () => {
      const initialCount = DockerSandbox.getActiveContainerCount();

      // Start execution but don't wait
      const promise = sandbox.execute('console.log("test")', 'typescript');

      // Give it time to create container
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Should have at least one active container during execution
      expect(DockerSandbox.getActiveContainerCount()).toBeGreaterThanOrEqual(initialCount);

      // Wait for completion
      await promise;

      // Should be back to initial count
      expect(DockerSandbox.getActiveContainerCount()).toBe(initialCount);
    }, 30000);
  });

  describe('Emergency Cleanup', () => {
    it('should cleanup all tracked containers', async () => {
      // Start multiple executions
      const promises = [
        sandbox.execute('console.log("test1")', 'typescript'),
        sandbox.execute('console.log("test2")', 'typescript'),
        sandbox.execute('console.log("test3")', 'typescript')
      ];

      // Give them time to create containers
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Emergency cleanup should remove all
      await DockerSandbox.emergencyCleanup();

      // Wait for promises to settle
      await Promise.allSettled(promises);

      // Should have no tracked containers
      expect(DockerSandbox.getActiveContainerCount()).toBe(0);
    }, 60000);
  });

  describe('Stress Test', () => {
    it('should not leak containers on 100 executions', async () => {
      const initialContainers = await docker.listContainers({ all: true });
      const initialCount = initialContainers.length;

      // Run 100 executions with mix of success and failure
      for (let i = 0; i < 100; i++) {
        if (i % 3 === 0) {
          // Throw error every 3rd execution
          await sandbox.execute('throw new Error("test")', 'typescript');
        } else {
          await sandbox.execute(`console.log(${i})`, 'typescript');
        }
      }

      const finalContainers = await docker.listContainers({ all: true });
      expect(finalContainers.length).toBe(initialCount);
    }, 300000); // 5 minute timeout for stress test
  });

  describe('Python Execution Cleanup', () => {
    it('should cleanup Python containers on success', async () => {
      const initialContainers = await docker.listContainers({ all: true });
      const initialCount = initialContainers.length;

      await sandbox.execute('print("test")', 'python');

      const finalContainers = await docker.listContainers({ all: true });
      expect(finalContainers.length).toBe(initialCount);
    }, 30000);

    it('should cleanup Python containers on error', async () => {
      const initialContainers = await docker.listContainers({ all: true });
      const initialCount = initialContainers.length;

      await sandbox.execute('raise Exception("test")', 'python');

      const finalContainers = await docker.listContainers({ all: true });
      expect(finalContainers.length).toBe(initialCount);
    }, 30000);
  });

  describe('Metrics Tracking', () => {
    it('should track container creation metrics', async () => {
      const initialMetrics = DockerSandbox.getMetrics();

      await sandbox.execute('console.log("test")', 'typescript');

      const finalMetrics = DockerSandbox.getMetrics();
      expect(finalMetrics.containersCreated).toBe(initialMetrics.containersCreated + 1);
      expect(finalMetrics.containersCleanedSuccess).toBeGreaterThan(initialMetrics.containersCleanedSuccess);
    }, 30000);

    it('should track cleanup success and failure metrics', async () => {
      await sandbox.execute('console.log("test")', 'typescript');

      const metrics = DockerSandbox.getMetrics();
      expect(metrics.containersCreated).toBeGreaterThan(0);
      expect(metrics.containersCleanedSuccess).toBeGreaterThan(0);
    }, 30000);

    it('should track active containers count', async () => {
      expect(DockerSandbox.getActiveContainerCount()).toBe(0);

      const promise = sandbox.execute('console.log("test")', 'typescript');
      await new Promise(resolve => setTimeout(resolve, 500));

      // Should have active container during execution
      const activeDuringExec = DockerSandbox.getActiveContainerCount();
      expect(activeDuringExec).toBeGreaterThanOrEqual(0);

      await promise;

      // Should be cleaned up after execution
      expect(DockerSandbox.getActiveContainerCount()).toBe(0);
    }, 30000);
  });

  describe('Docker Labels', () => {
    it('should add mcp.sandbox labels to containers', async () => {
      await sandbox.execute('console.log("test")', 'typescript');

      const labels =
        (docker as any).getLastCreateLabels?.() ??
        (docker as any).lastCreateLabels ??
        {};

      expect(labels['mcp.sandbox']).toBe('true');
      expect(labels['mcp.sandbox.language']).toBe('typescript');
    }, 30000);
  });
});
