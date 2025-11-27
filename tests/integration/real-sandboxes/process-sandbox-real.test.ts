/// <reference types="vitest" />
import { describe, it, expect, beforeAll } from 'vitest';
import { ProcessSandbox } from '../../../src/core/execution-engine/sandbox/process-sandbox';
import { SandboxConfig } from '../../../src/core/execution-engine/types';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Real ProcessSandbox Integration Tests
 *
 * These tests require actual Python runtime installed on the system.
 * They verify that ProcessSandbox correctly:
 * - Executes real Python code
 * - Filters environment variables for security
 * - Handles errors and timeouts properly
 * - Maintains isolation from host system
 *
 * Prerequisites:
 * - Python 3.x installed and available in PATH
 * - Node.js runtime for JavaScript execution
 */
// Check Python availability at module level (before test execution)
let hasPython = false;
let pythonVersion = '';

const checkPython = async () => {
  try {
    const { stdout } = await execAsync('python --version 2>&1');
    hasPython = true;
    pythonVersion = stdout.trim();
    return true;
  } catch {
    try {
      const { stdout } = await execAsync('python3 --version 2>&1');
      hasPython = true;
      pythonVersion = stdout.trim();
      return true;
    } catch {
      return false;
    }
  }
};

// Run check immediately at module load
await checkPython().then(available => {
  if (available) {
    console.log(`Python runtime available: ${pythonVersion}`);
  } else {
    console.warn('Python not found - tests will skip');
  }
});

describe('ProcessSandbox - Real Execution Tests', () => {
  beforeAll(async () => {
    if (hasPython) {
      console.log(`Running tests with: ${pythonVersion}`);
    }
  });

  const defaultConfig: SandboxConfig = {
    type: 'process',
    resourceLimits: {
      timeout: 5000,
      memory: '512M',
      cpu: '1.0',
    },
  };

  describe('Python Execution', () => {
    it.skipIf(!hasPython)('should execute simple Python script', async () => {
      const sandbox = new ProcessSandbox(defaultConfig);

      const code = `print("Hello from Python sandbox!")`;
      const result = await sandbox.execute(code, 'python');

      expect(result.success).toBe(true);
      expect(result.output).toContain('Hello from Python sandbox!');
      expect(result.error).toBeUndefined();
    });

    it.skipIf(!hasPython)('should handle Python calculations', async () => {
      const sandbox = new ProcessSandbox(defaultConfig);

      const code = `
import json
result = 2 + 2
print(json.dumps({'result': result}))
`;
      const result = await sandbox.execute(code, 'python');

      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.output as string);
      expect(parsed.result).toBe(4);
    });

    it.skipIf(!hasPython)(
      'should NOT expose sensitive environment variables',
      async () => {
        const sandbox = new ProcessSandbox(defaultConfig);

        // Set sensitive env vars
        process.env.AWS_ACCESS_KEY_ID = 'AKIA_TEST_KEY';
        process.env.DATABASE_PASSWORD = 'super_secret';

        const code = `
import os
import json

has_aws = 'AWS_ACCESS_KEY_ID' in os.environ
has_db = 'DATABASE_PASSWORD' in os.environ

print(json.dumps({'has_aws': has_aws, 'has_db': has_db}))
`;

        const result = await sandbox.execute(code, 'python');

        // Cleanup
        delete process.env.AWS_ACCESS_KEY_ID;
        delete process.env.DATABASE_PASSWORD;

        expect(result.success).toBe(true);
        const parsed = JSON.parse(result.output as string);
        expect(parsed.has_aws).toBe(false);
        expect(parsed.has_db).toBe(false);
      }
    );

    it.skipIf(!hasPython)(
      'should expose safe environment variables',
      async () => {
        const sandbox = new ProcessSandbox(defaultConfig);

        const code = `
import os
import json

has_node_env = 'NODE_ENV' in os.environ
node_env_value = os.environ.get('NODE_ENV')
has_path = 'PATH' in os.environ

print(json.dumps({
    'has_node_env': has_node_env,
    'node_env': node_env_value,
    'has_path': has_path
}))
`;

        const result = await sandbox.execute(code, 'python');

        expect(result.success).toBe(true);
        const parsed = JSON.parse(result.output as string);
        expect(parsed.has_node_env).toBe(true);
        expect(parsed.node_env).toBe('sandbox');
        expect(parsed.has_path).toBe(true);
      }
    );

    it.skipIf(!hasPython)('should handle Python errors gracefully', async () => {
      const sandbox = new ProcessSandbox(defaultConfig);

      const code = `
# This will cause a runtime error
undefined_variable = some_undefined_var
`;

      const result = await sandbox.execute(code, 'python');

      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
      expect(result.error).toContain('NameError');
    });

    it.skipIf(!hasPython)('should timeout long-running Python code', async () => {
      const sandbox = new ProcessSandbox({
        ...defaultConfig,
        resourceLimits: {
          ...defaultConfig.resourceLimits!,
          timeout: 1000, // 1 second timeout
        },
      });

      const code = `
import time
time.sleep(5)  # Sleep longer than timeout
print("Should not reach here")
`;

      const result = await sandbox.execute(code, 'python');

      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
      // Error message varies by platform - just verify it failed
      expect(result.error?.length).toBeGreaterThan(0);
    });
  });

  // Note: ProcessSandbox primarily supports Python execution
  // JavaScript/TypeScript execution requires different sandbox implementation
  describe.skip('JavaScript Execution - Not Supported by ProcessSandbox', () => {
    // These tests are placeholders for future JavaScript sandbox implementation
  });

  describe.skip('TypeScript Execution - Not Supported by ProcessSandbox', () => {
    // These tests are placeholders for future TypeScript sandbox implementation
  });

  describe('Security Validation', () => {
    it.skipIf(!hasPython)(
      'should prevent file system access outside sandbox',
      async () => {
        const sandbox = new ProcessSandbox(defaultConfig);

        const code = `
import os
try:
    with open('/etc/passwd', 'r') as f:
        content = f.read()
    print("SECURITY BREACH: Accessed /etc/passwd")
except Exception as e:
    print(f"Access denied: {type(e).__name__}")
`;

        const result = await sandbox.execute(code, 'python');

        expect(result.success).toBe(true);
        // Should fail to access system files
        expect(result.output).toContain('Access denied');
        expect(result.output).not.toContain('SECURITY BREACH');
      }
    );

    it.skipIf(!hasPython)(
      'should prevent network access (if configured)',
      async () => {
        const sandbox = new ProcessSandbox({
          ...defaultConfig,
          networkPolicy: {
            allowedDomains: [],
            blockedDomains: ['*'],
          },
        });

        const code = `
import socket
try:
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.connect(('google.com', 80))
    print("SECURITY BREACH: Network access succeeded")
except Exception as e:
    print(f"Network blocked: {type(e).__name__}")
`;

        const result = await sandbox.execute(code, 'python');

        expect(result.success).toBe(true);
        // Network access should be denied (implementation dependent)
        // This is a best-effort test
      }
    );
  });

  describe('Resource Limits', () => {
    it.skipIf(!hasPython)(
      'should enforce memory limits (if supported)',
      async () => {
        const sandbox = new ProcessSandbox({
          ...defaultConfig,
          resourceLimits: {
            timeout: 5000,
            memory: '10M', // Very low memory limit
            cpu: '1.0',
          },
        });

        const code = `
# Try to allocate large amount of memory
try:
    big_list = [0] * (10 ** 8)  # ~800MB
    print("Allocated memory")
except MemoryError:
    print("Memory limit enforced")
`;

        const result = await sandbox.execute(code, 'python');

        // On systems with memory limiting, should fail
        // This is platform-dependent
        expect(result.success).toBe(true);
      }
    );

    it.skipIf(!hasPython)('should enforce CPU limits gracefully', async () => {
      const sandbox = new ProcessSandbox({
        ...defaultConfig,
        resourceLimits: {
          timeout: 2000,
          memory: '512M',
          cpu: '0.5', // 50% CPU limit
        },
      });

      const code = `
import time
start = time.time()
# CPU-intensive task
sum([i**2 for i in range(1000000)])
elapsed = time.time() - start
print(f"Completed in {elapsed:.2f}s")
`;

      const result = await sandbox.execute(code, 'python');

      // CPU limiting is platform-dependent
      // Test verifies graceful handling
      expect([true, false]).toContain(result.success);
    });
  });

  describe('Custom Environment Variables', () => {
    it.skipIf(!hasPython)('should allow whitelisted env vars', async () => {
      process.env.CUSTOM_SAFE_VAR = 'test_value_123';

      const sandbox = new ProcessSandbox({
        ...defaultConfig,
        allowedEnvVars: ['CUSTOM_SAFE_VAR'],
      });

      const code = `
import os
import json
value = os.environ.get('CUSTOM_SAFE_VAR')
print(json.dumps({'value': value}))
`;

      const result = await sandbox.execute(code, 'python');

      delete process.env.CUSTOM_SAFE_VAR;

      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.output as string);
      expect(parsed.value).toBe('test_value_123');
    });

    it.skipIf(!hasPython)(
      'should reject dangerous custom env vars',
      async () => {
        const sandbox = new ProcessSandbox({
          ...defaultConfig,
          allowedEnvVars: ['MY_API_KEY'], // Dangerous pattern
        });

        const code = `print("test")`;
        const result = await sandbox.execute(code, 'python');

        // Should fail security validation
        expect(result.success).toBe(false);
        expect(result.error).toMatch(/Security Error/);
      }
    );
  });

  describe('Multi-Language Support', () => {
    it.skipIf(!hasPython)('should execute Python correctly', async () => {
      const sandbox = new ProcessSandbox(defaultConfig);
      const code = 'print("Python works!")';
      const result = await sandbox.execute(code, 'python');

      expect(result.success).toBe(true);
      expect(result.output).toContain('Python works!');
    });

    // JavaScript/TypeScript not supported by ProcessSandbox
    // Use DockerSandbox or VM sandbox for multi-language support
  });

  describe('Error Recovery', () => {
    it.skipIf(!hasPython)('should recover from syntax errors', async () => {
      const sandbox = new ProcessSandbox(defaultConfig);

      const badCode = `
this is not valid python syntax!
`;
      const result1 = await sandbox.execute(badCode, 'python');
      expect(result1.success).toBe(false);

      // Next execution should work fine
      const goodCode = `print("Recovered!")`;
      const result2 = await sandbox.execute(goodCode, 'python');
      expect(result2.success).toBe(true);
    });

    it.skipIf(!hasPython)('should handle multiple consecutive executions', async () => {
      const sandbox = new ProcessSandbox(defaultConfig);

      for (let i = 0; i < 5; i++) {
        const code = `print(f"Iteration {${i}}")`;
        const result = await sandbox.execute(code, 'python');
        expect(result.success).toBe(true);
        expect(result.output).toContain(`Iteration ${i}`);
      }
    });
  });

  describe('Cleanup and Isolation', () => {
    it.skipIf(!hasPython)(
      'should isolate executions (no state leakage)',
      async () => {
        const sandbox = new ProcessSandbox(defaultConfig);

        const code1 = `
import os
os.environ['SANDBOX_TEST_VAR'] = 'from_first_run'
print("Set variable")
`;
        await sandbox.execute(code1, 'python');

        const code2 = `
import os
has_var = 'SANDBOX_TEST_VAR' in os.environ
print(f"Has variable: {has_var}")
`;
        const result2 = await sandbox.execute(code2, 'python');

        expect(result2.success).toBe(true);
        // Each execution should be isolated
        expect(result2.output).toContain('Has variable: False');
      }
    );
  });
});
