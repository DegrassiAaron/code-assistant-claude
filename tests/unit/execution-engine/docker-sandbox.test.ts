import { DockerSandbox } from '../../../src/core/execution-engine/sandbox/docker-sandbox';
import { SandboxConfig } from '../../../src/core/execution-engine/types';
import Docker from 'dockerode';

/**
 * Tests for Docker container cleanup functionality
 * Ensures containers are properly cleaned up in all scenarios
 */
describe('DockerSandbox Cleanup', () => {
  let sandbox: DockerSandbox;
  let docker: Docker;

  const defaultConfig: SandboxConfig = {
    resourceLimits: {
      memory: '512M',
      cpu: 1,
      disk: '1G',
      timeout: 30000
    },
    networkPolicy: {
      mode: 'none',
      allowedDomains: []
    },
    allowedModules: ['fs', 'path'],
    securityLevel: 'strict' as const
  };

  beforeEach(() => {
    docker = new Docker();
    sandbox = new DockerSandbox(defaultConfig);
  });

  afterEach(async () => {
    // Emergency cleanup after each test
    await DockerSandbox.emergencyCleanup();
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
});
