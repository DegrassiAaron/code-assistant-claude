/// <reference types="vitest" />
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { DockerSandbox } from '../../../src/core/execution-engine/sandbox/docker-sandbox';
import { SandboxConfig } from '../../../src/core/execution-engine/types';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Real DockerSandbox Integration Tests
 *
 * These tests require actual Docker daemon running on the system.
 * They verify that DockerSandbox correctly:
 * - Creates and manages real Docker containers
 * - Executes code in isolated containers
 * - Cleans up containers after execution
 * - Enforces resource limits via Docker
 *
 * Prerequisites:
 * - Docker installed and daemon running
 * - User has permissions to run Docker commands
 * - Docker images: python:3.11-slim, node:18-alpine
 */
// Check Docker availability at module level
let hasDocker = false;
let dockerVersion = '';

const checkDocker = async () => {
  try {
    const { stdout } = await execAsync('docker --version');
    hasDocker = true;
    dockerVersion = stdout.trim();
    return true;
  } catch {
    return false;
  }
};

// Run check immediately
await checkDocker().then(available => {
  if (available) {
    console.log(`Docker runtime available: ${dockerVersion}`);
  } else {
    console.warn('Docker not found - tests will skip');
  }
});

describe('DockerSandbox - Real Execution Tests', () => {
  const createdContainers: string[] = [];

  beforeAll(async () => {
    if (hasDocker) {
      console.log(`Running tests with: ${dockerVersion}`);
      // Pull required images if not present
      console.log('Ensuring Docker images are available...');
      await execAsync('docker pull python:3.11-slim').catch(() => {
        console.warn('Failed to pull python:3.11-slim');
      });
      await execAsync('docker pull node:18-alpine').catch(() => {
        console.warn('Failed to pull node:18-alpine');
      });
    }
  }, 60000); // 60s timeout for image pulls

  afterAll(async () => {
    // Cleanup any orphaned containers
    if (hasDocker && createdContainers.length > 0) {
      console.log(`Cleaning up ${createdContainers.length} test containers...`);
      for (const containerId of createdContainers) {
        try {
          await execAsync(`docker rm -f ${containerId}`);
        } catch {
          // Container might already be cleaned up
        }
      }
    }
  });

  const defaultConfig: SandboxConfig = {
    type: 'docker',
    resourceLimits: {
      timeout: 10000,
      memory: '512M',
      cpu: '1.0',
    },
  };

  describe('Python Execution in Docker', () => {
    it.skipIf(!hasDocker)('should execute Python in container', async () => {
      const sandbox = new DockerSandbox(defaultConfig);

      const code = `print("Hello from Docker Python!")`;
      const result = await sandbox.execute(code, 'python');

      expect(result.success).toBe(true);
      expect(result.output).toContain('Hello from Docker Python!');
    }, 30000);

    it.skipIf(!hasDocker)(
      'should handle Python calculations',
      async () => {
        const sandbox = new DockerSandbox(defaultConfig);

        const code = `
import json
result = sum(range(100))
print(json.dumps({'sum': result}))
`;
        const result = await sandbox.execute(code, 'python');

        expect(result.success).toBe(true);
        const parsed = JSON.parse(result.output as string);
        expect(parsed.sum).toBe(4950);
      },
      30000
    );

    it.skipIf(!hasDocker)(
      'should isolate environment variables',
      async () => {
        // Set sensitive env var on host
        process.env.DOCKER_TEST_SECRET = 'super_secret_value';

        const sandbox = new DockerSandbox(defaultConfig);

        const code = `
import os
import json
has_secret = 'DOCKER_TEST_SECRET' in os.environ
print(json.dumps({'has_secret': has_secret}))
`;
        const result = await sandbox.execute(code, 'python');

        delete process.env.DOCKER_TEST_SECRET;

        expect(result.success).toBe(true);
        const parsed = JSON.parse(result.output as string);
        expect(parsed.has_secret).toBe(false);
      },
      30000
    );
  });

  describe('JavaScript Execution in Docker', () => {
    it.skipIf(!hasDocker)('should execute JavaScript in container', async () => {
      const sandbox = new DockerSandbox(defaultConfig);

      const code = `console.log("Hello from Docker Node!");`;
      const result = await sandbox.execute(code, 'javascript');

      expect(result.success).toBe(true);
      expect(result.output).toContain('Hello from Docker Node!');
    }, 30000);

    it.skipIf(!hasDocker)(
      'should handle Node.js built-ins',
      async () => {
        const sandbox = new DockerSandbox(defaultConfig);

        const code = `
const crypto = require('crypto');
const hash = crypto.createHash('sha256').update('test').digest('hex');
console.log(JSON.stringify({ hash: hash.substring(0, 10) }));
`;
        const result = await sandbox.execute(code, 'javascript');

        expect(result.success).toBe(true);
        expect(result.output).toContain('"hash"');
      },
      30000
    );
  });

  describe('Container Lifecycle Management', () => {
    it.skipIf(!hasDocker)(
      'should cleanup container after execution',
      async () => {
        const sandbox = new DockerSandbox(defaultConfig);

        const code = `print("Test container cleanup")`;
        const result = await sandbox.execute(code, 'python');

        expect(result.success).toBe(true);

        // Give time for cleanup
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Verify containers are cleaned up
        const { stdout } = await execAsync(
          'docker ps -a --filter "label=mcp.sandbox=true" --format "{{.ID}}"'
        );

        const runningContainers = stdout
          .trim()
          .split('\n')
          .filter((id) => id.length > 0);

        // Should have no orphaned containers with our label
        expect(runningContainers.length).toBe(0);
      },
      40000
    );

    it.skipIf(!hasDocker)(
      'should handle multiple concurrent executions',
      async () => {
        const sandbox = new DockerSandbox(defaultConfig);

        const executions = Array.from({ length: 3 }, async (_, i) => {
          const code = `print("Execution ${i}")`;
          return sandbox.execute(code, 'python');
        });

        const results = await Promise.all(executions);

        results.forEach((result, i) => {
          expect(result.success).toBe(true);
          expect(result.output).toContain(`Execution ${i}`);
        });
      },
      60000
    );
  });

  describe('Resource Limit Enforcement', () => {
    it.skipIf(!hasDocker)(
      'should enforce memory limits',
      async () => {
        const sandbox = new DockerSandbox({
          ...defaultConfig,
          resourceLimits: {
            timeout: 10000,
            memory: '50M', // Very low limit
            cpu: '1.0',
          },
        });

        const code = `
# Try to allocate more than available memory
try:
    big_list = bytearray(100 * 1024 * 1024)  # 100MB
    print("MEMORY_ERROR: Should not reach here")
except MemoryError:
    print("MEMORY_LIMIT_ENFORCED")
`;

        const result = await sandbox.execute(code, 'python');

        // Docker should kill the container or Python should raise MemoryError
        if (result.success) {
          expect(result.output).toContain('MEMORY_LIMIT_ENFORCED');
        } else {
          // Container was killed by Docker
          expect(result.error).toBeTruthy();
        }
      },
      30000
    );

    it.skipIf(!hasDocker)(
      'should enforce timeout limits',
      async () => {
        const sandbox = new DockerSandbox({
          ...defaultConfig,
          resourceLimits: {
            timeout: 2000, // 2 second timeout
            memory: '512M',
            cpu: '1.0',
          },
        });

        const code = `
import time
time.sleep(10)  # Sleep longer than timeout
print("Should not reach here")
`;

        const result = await sandbox.execute(code, 'python');

        expect(result.success).toBe(false);
        expect(result.error).toBeTruthy();
        expect(result.error?.toLowerCase()).toMatch(/timeout|timed out/);
      },
      15000
    );
  });

  describe('Security Isolation', () => {
    it.skipIf(!hasDocker)(
      'should prevent access to host filesystem',
      async () => {
        const sandbox = new DockerSandbox(defaultConfig);

        const code = `
import os
try:
    # Try to access host files
    files = os.listdir('/host')
    print(f"BREACH: Found {len(files)} host files")
except Exception as e:
    print(f"ISOLATED: {type(e).__name__}")
`;

        const result = await sandbox.execute(code, 'python');

        expect(result.success).toBe(true);
        expect(result.output).toContain('ISOLATED');
        expect(result.output).not.toContain('BREACH');
      },
      30000
    );

    it.skipIf(!hasDocker)(
      'should prevent docker socket access',
      async () => {
        const sandbox = new DockerSandbox(defaultConfig);

        const code = `
import os
has_docker_sock = os.path.exists('/var/run/docker.sock')
print(f"Docker socket accessible: {has_docker_sock}")
`;

        const result = await sandbox.execute(code, 'python');

        expect(result.success).toBe(true);
        // Docker socket should NOT be mounted
        expect(result.output).toContain('Docker socket accessible: False');
      },
      30000
    );
  });

  describe('Error Handling', () => {
    it.skipIf(!hasDocker)(
      'should handle container creation failures gracefully',
      async () => {
        const badConfig: SandboxConfig = {
          type: 'docker',
          dockerImage: 'nonexistent-image-12345',
          resourceLimits: {
            timeout: 5000,
            memory: '512M',
            cpu: '1.0',
          },
        };

        const sandbox = new DockerSandbox(badConfig);
        const code = `print("test")`;
        const result = await sandbox.execute(code, 'python');

        expect(result.success).toBe(false);
        expect(result.error).toBeTruthy();
      },
      30000
    );

    it.skipIf(!hasDocker)(
      'should recover from failed executions',
      async () => {
        const sandbox = new DockerSandbox(defaultConfig);

        // First: failing execution
        const badCode = `raise Exception("Test error")`;
        const result1 = await sandbox.execute(badCode, 'python');
        expect(result1.success).toBe(false);

        // Second: successful execution
        const goodCode = `print("Recovered successfully")`;
        const result2 = await sandbox.execute(goodCode, 'python');
        expect(result2.success).toBe(true);
        expect(result2.output).toContain('Recovered successfully');
      },
      60000
    );
  });

  describe('Performance Metrics', () => {
    it.skipIf(!hasDocker)(
      'should track container creation time',
      async () => {
        const sandbox = new DockerSandbox(defaultConfig);

        const start = Date.now();
        const code = `print("Performance test")`;
        const result = await sandbox.execute(code, 'python');
        const duration = Date.now() - start;

        expect(result.success).toBe(true);
        console.log(`Docker execution took ${duration}ms`);

        // Should complete within reasonable time
        expect(duration).toBeLessThan(30000); // 30s max
      },
      35000
    );
  });
});
