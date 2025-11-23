# Issue #3: Docker Container Resource Leak

**Severity**: 🔴 Critical
**Component**: Sandbox / Docker Execution
**File**: `src/core/execution-engine/sandbox/docker-sandbox.ts`
**Lines**: 41-54
**Labels**: `phase-4`, `bug`, `critical`, `resource-leak`, `docker`

---

## Problem Description

Docker containers are not properly cleaned up when errors occur during execution, causing resource leaks. If `container.stop()` or `container.remove()` fail, containers remain running indefinitely.

```typescript
// Lines 41-54 - VULNERABLE CODE
try {
  // Create container
  const container = await this.createContainer(language);

  // ... execution code ...

  // Cleanup - BUT ONLY IF NO ERRORS OCCUR ❌
  await container.stop();
  await container.remove();

  return { success: true, ... };

} catch (error) {
  // ❌ NO CLEANUP HERE - CONTAINER STILL RUNNING!
  return {
    success: false,
    error: error instanceof Error ? error.message : 'Unknown error',
    // ... container leaked!
  };
}
```

---

## Impact

**Resource Exhaustion**:
- CPU: Containers consume CPU cycles indefinitely
- Memory: Containers hold memory until system OOM
- Disk: Container filesystems accumulate over time
- Network: Containers may hold network resources

**Security**:
- Untrusted code continues running after execution "completes"
- Potential for container to make unauthorized network requests
- Zombie containers could be exploited for crypto mining or attacks

**Operational**:
- Docker daemon becomes unstable with 100s of zombie containers
- System becomes unresponsive
- Requires manual intervention to clean up
- `docker ps -a` shows hundreds of stopped containers

**Cost**:
- Cloud billing for resources that should have been freed
- Increased infrastructure costs

**Risk Level**: **CRITICAL** - Causes system instability and security breach

---

## Steps to Reproduce

1. Create a code execution that will fail:
   ```typescript
   const orchestrator = new ExecutionOrchestrator('./templates/mcp-tools');
   await orchestrator.initialize();

   // This will cause an error during execution
   const result = await orchestrator.execute(
     'Execute code that throws error',
     'typescript'
   );
   ```

2. During execution, in another terminal:
   ```bash
   docker ps -a | grep mcp-sandbox
   ```

3. **Observe**: Container created but not removed

4. Repeat 100 times:
   ```bash
   docker ps -a | wc -l
   # Shows increasing number of containers
   ```

5. **Observe**: System resources degrading

---

## Root Cause Analysis

The cleanup code is inside the try block BEFORE the return statement:

```typescript
try {
  const container = await this.createContainer(language);
  await this.copyCodeToContainer(container, code, language);
  await container.start();
  const result = await this.executeInContainer(container, language);
  const stats = await container.stats({ stream: false });

  // ❌ Cleanup here only runs if everything above succeeds
  await container.stop();
  await container.remove();

  return { success: true, ... }; // Early return

} catch (error) {
  // ❌ NO cleanup in catch block
  return { success: false, ... };
}
```

If ANY of the operations throw (network error, timeout, code error, stats failure), we jump to the catch block WITHOUT cleaning up.

---

## Proposed Solution

### Fix: Use try-finally for guaranteed cleanup

```typescript
async execute(code: string, language: 'typescript' | 'python'): Promise<ExecutionResult> {
  const startTime = Date.now();
  let container: Docker.Container | null = null;

  try {
    // Create container
    container = await this.createContainer(language);

    // Copy code to container
    await this.copyCodeToContainer(container, code, language);

    // Start container
    await container.start();

    // Execute code
    const result = await this.executeInContainer(container, language);

    // Get metrics
    const stats = await container.stats({ stream: false });

    return {
      success: true,
      output: result.output,
      summary: this.summarizeOutput(result.output),
      metrics: {
        executionTime: Date.now() - startTime,
        memoryUsed: this.formatMemory((stats as any).memory_stats?.usage || 0),
        tokensInSummary: this.estimateTokens(result.output)
      },
      piiTokenized: false
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      summary: 'Execution failed',
      metrics: {
        executionTime: Date.now() - startTime,
        memoryUsed: '0M',
        tokensInSummary: 0
      },
      piiTokenized: false
    };

  } finally {
    // ✅ GUARANTEED cleanup - runs whether try or catch executes
    if (container) {
      try {
        // Force stop with 0 second timeout
        await container.stop({ t: 0 });
      } catch (stopError) {
        // Log but don't fail - container might already be stopped
        console.error('Failed to stop container:', stopError);
      }

      try {
        // Force remove even if container is running
        await container.remove({ force: true, v: true });
      } catch (removeError) {
        // Log but don't fail - critical that we tried
        console.error('Failed to remove container:', removeError);

        // Add to dead letter queue for manual cleanup
        await this.recordFailedCleanup(container.id);
      }
    }
  }
}
```

---

## Additional Improvements

### 1. Container ID tracking for cleanup jobs

```typescript
export class DockerSandbox {
  private static activeContainers: Set<string> = new Set();

  async execute(code: string, language: 'typescript' | 'python'): Promise<ExecutionResult> {
    let containerId: string | null = null;

    try {
      const container = await this.createContainer(language);
      containerId = container.id;

      // Track active container
      DockerSandbox.activeContainers.add(containerId);

      // ... rest of execution ...

    } finally {
      if (containerId) {
        // Cleanup
        // ... cleanup code ...

        // Remove from tracking
        DockerSandbox.activeContainers.delete(containerId);
      }
    }
  }

  /**
   * Emergency cleanup - kills all tracked containers
   */
  static async emergencyCleanup(): Promise<void> {
    const docker = new Docker();

    for (const containerId of this.activeContainers) {
      try {
        const container = docker.getContainer(containerId);
        await container.stop({ t: 0 });
        await container.remove({ force: true });
      } catch (error) {
        console.error(`Failed to clean up container ${containerId}:`, error);
      }
    }

    this.activeContainers.clear();
  }
}
```

### 2. Periodic cleanup job

```typescript
/**
 * Background job to cleanup zombie containers
 */
export class ContainerCleanupJob {
  private docker: Docker;
  private interval: NodeJS.Timeout | null = null;

  constructor() {
    this.docker = new Docker();
  }

  start(intervalMs: number = 60000): void {
    this.interval = setInterval(() => this.cleanup(), intervalMs);
  }

  stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  private async cleanup(): Promise<void> {
    try {
      const containers = await this.docker.listContainers({ all: true });

      for (const containerInfo of containers) {
        // Find containers older than 1 hour
        const created = new Date(containerInfo.Created * 1000);
        const ageHours = (Date.now() - created.getTime()) / (1000 * 60 * 60);

        if (ageHours > 1 && containerInfo.Image.includes('mcp-sandbox')) {
          console.log(`Cleaning up zombie container: ${containerInfo.Id}`);

          const container = this.docker.getContainer(containerInfo.Id);
          await container.stop({ t: 0 });
          await container.remove({ force: true });
        }
      }
    } catch (error) {
      console.error('Cleanup job failed:', error);
    }
  }
}
```

---

## Acceptance Criteria

- [ ] All containers cleaned up on success
- [ ] All containers cleaned up on error
- [ ] All containers cleaned up on timeout
- [ ] All containers cleaned up on process crash (via cleanup job)
- [ ] No zombie containers after 1000 executions
- [ ] Emergency cleanup function works
- [ ] Cleanup job removes old containers
- [ ] Tests verify container cleanup in all scenarios

---

## Testing Requirements

### Unit Tests

```typescript
describe('DockerSandbox Cleanup', () => {
  let sandbox: DockerSandbox;
  let docker: Docker;

  beforeEach(() => {
    docker = new Docker();
    sandbox = new DockerSandbox(defaultConfig);
  });

  it('should cleanup container on successful execution', async () => {
    const initialContainers = await docker.listContainers({ all: true });

    await sandbox.execute('console.log("test")', 'typescript');

    const finalContainers = await docker.listContainers({ all: true });
    expect(finalContainers.length).toBe(initialContainers.length);
  });

  it('should cleanup container on execution error', async () => {
    const initialContainers = await docker.listContainers({ all: true });

    await sandbox.execute('throw new Error("test")', 'typescript');

    const finalContainers = await docker.listContainers({ all: true });
    expect(finalContainers.length).toBe(initialContainers.length);
  });

  it('should cleanup container on timeout', async () => {
    const initialContainers = await docker.listContainers({ all: true });

    await sandbox.execute('while(true){}', 'typescript');

    const finalContainers = await docker.listContainers({ all: true });
    expect(finalContainers.length).toBe(initialContainers.length);
  });

  it('should not leak containers on 100 executions', async () => {
    const initialContainers = await docker.listContainers({ all: true });

    for (let i = 0; i < 100; i++) {
      await sandbox.execute(`console.log(${i})`, 'typescript');
    }

    const finalContainers = await docker.listContainers({ all: true });
    expect(finalContainers.length).toBe(initialContainers.length);
  }, 60000); // 60 second timeout
});
```

### Integration Test

```typescript
describe('Container Resource Management', () => {
  it('should cleanup containers on process exit', async () => {
    // Spawn child process
    const child = spawn('node', ['test-script.js']);

    // Wait for containers to be created
    await new Promise(resolve => setTimeout(resolve, 2000));

    const duringContainers = await docker.listContainers({ all: true });
    expect(duringContainers.length).toBeGreaterThan(0);

    // Kill process
    child.kill('SIGTERM');

    // Wait for cleanup
    await new Promise(resolve => setTimeout(resolve, 2000));

    const afterContainers = await docker.listContainers({ all: true });
    expect(afterContainers.length).toBe(0);
  });
});
```

---

## Rollout Plan

1. **Fix the immediate issue** - Add try-finally block
2. **Add container tracking** - Track all active containers
3. **Implement cleanup job** - Background job for zombie cleanup
4. **Add monitoring** - Alert on container count > 10
5. **Add metrics** - Track cleanup success/failure rates

---

## Related Issues

- Issue #10: Process Sandbox Timeout Race (similar cleanup issue)
- Container limits configuration (max containers per user)

---

## References

- Docker API: https://docs.docker.com/engine/api/v1.41/
- Resource Management: https://docs.docker.com/config/containers/resource_constraints/

---

**Priority**: 🔥 CRITICAL - BLOCKS PRODUCTION
**Estimated Effort**: 3 hours
**Risk if not fixed**: System crashes, security breach, high cloud costs
