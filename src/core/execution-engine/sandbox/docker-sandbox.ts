import Docker from 'dockerode';
import { SandboxConfig, ExecutionResult } from '../types';
import * as tar from 'tar-stream';
import { SandboxLogger, ConsoleLogger, ContainerMetricsTracker } from './sandbox-logger';

/**
 * Docker-based sandbox for isolated code execution
 * Provides containerized isolation with resource limits
 */
export class DockerSandbox {
  private docker: Docker;
  private config: SandboxConfig;
  private logger: SandboxLogger;
  private static activeContainers: Set<string> = new Set();
  private static metricsTracker = new ContainerMetricsTracker();

  constructor(config: SandboxConfig, logger?: SandboxLogger) {
    this.docker = new Docker();
    this.config = config;
    this.logger = logger || new ConsoleLogger();
  }

  /**
   * Execute code in Docker container
   */
  async execute(code: string, language: 'typescript' | 'python'): Promise<ExecutionResult> {
    const startTime = Date.now();
    let container: Docker.Container | null = null;
    let containerId: string | null = null;

    try {
      // Create container
      container = await this.createContainer(language);
      containerId = container.id;

      // Track active container and metrics
      DockerSandbox.activeContainers.add(containerId);
      DockerSandbox.metricsTracker.incrementCreated();
      this.logger.info('Container created', { containerId: containerId.substring(0, 12), language });

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
      // GUARANTEED cleanup - runs whether try or catch executes
      if (container) {
        const cleanupStartTime = Date.now();
        let cleanupSuccess = true;

        try {
          // Force stop with 0 second timeout
          await container.stop({ t: 0 });
        } catch (stopError) {
          // Log but don't fail - container might already be stopped
          this.logger.warn('Failed to stop container', {
            containerId: containerId?.substring(0, 12),
            error: stopError instanceof Error ? stopError.message : String(stopError)
          });
        }

        try {
          // Force remove even if container is running
          await container.remove({ force: true, v: true });
          DockerSandbox.metricsTracker.incrementCleanedSuccess();
          this.logger.info('Container cleaned up', {
            containerId: containerId?.substring(0, 12),
            cleanupTimeMs: Date.now() - cleanupStartTime
          });
        } catch (removeError) {
          // Log but don't fail - critical that we tried
          cleanupSuccess = false;
          DockerSandbox.metricsTracker.incrementCleanedFailed();
          this.logger.error('Failed to remove container', removeError instanceof Error ? removeError : undefined, {
            containerId: containerId?.substring(0, 12)
          });
        }

        // Remove from tracking
        if (containerId) {
          DockerSandbox.activeContainers.delete(containerId);
        }

        // Track cleanup metrics
        const cleanupTime = Date.now() - cleanupStartTime;
        DockerSandbox.metricsTracker.recordCleanupTime(cleanupTime);
        this.logger.metric('container.cleanup.duration_ms', cleanupTime, {
          success: cleanupSuccess
        });
      }
    }
  }

  /**
   * Create Docker container with resource limits
   */
  private async createContainer(language: string) {
    const image = language === 'typescript' ? 'node:18-alpine' : 'python:3.11-alpine';

    // Pull image if not exists
    try {
      await this.docker.pull(image);
    } catch (error) {
      console.warn(`Failed to pull image ${image}:`, error);
    }

    // Create container with resource limits and labels for identification
    return this.docker.createContainer({
      Image: image,
      Tty: false,
      NetworkDisabled: this.config.networkPolicy.mode === 'none',
      WorkingDir: '/workspace',
      Labels: {
        'mcp.sandbox': 'true',
        'mcp.sandbox.language': language,
        'mcp.sandbox.created': new Date().toISOString()
      },
      HostConfig: {
        Memory: this.parseMemory(this.config.resourceLimits.memory),
        NanoCpus: this.config.resourceLimits.cpu * 1e9,
        DiskQuota: this.parseDisk(this.config.resourceLimits.disk)
      }
    });
  }

  /**
   * Copy code to container
   */
  private async copyCodeToContainer(container: Docker.Container, code: string, language: string): Promise<void> {
    const filename = language === 'typescript' ? 'script.ts' : 'script.py';

    // Create tar archive with code file
    const pack = tar.pack();

    pack.entry({ name: filename }, code, (err) => {
      if (err) throw err;
      pack.finalize();
    });

    await container.putArchive(pack, { path: '/workspace' });
  }

  /**
   * Execute code inside container
   * Note: Container cleanup in finally block handles timeout/error cases
   */
  private async executeInContainer(container: Docker.Container, language: string): Promise<{ output: string }> {
    const command = language === 'typescript'
      ? ['npx', 'ts-node', '/workspace/script.ts']
      : ['python', '/workspace/script.py'];

    const exec = await container.exec({
      Cmd: command,
      AttachStdout: true,
      AttachStderr: true
    });

    const stream = await exec.start({ Detach: false });

    return new Promise((resolve, reject) => {
      let output = '';
      let timeoutHandle: NodeJS.Timeout | null = null;
      let completed = false;

      const cleanup = () => {
        completed = true;
        if (timeoutHandle) {
          clearTimeout(timeoutHandle);
          timeoutHandle = null;
        }
        // Destroy stream to prevent lingering references
        if (stream && !stream.destroyed) {
          stream.destroy();
        }
      };

      stream.on('data', (chunk: Buffer) => {
        output += chunk.toString();
      });

      stream.on('end', () => {
        if (!completed) {
          cleanup();
          resolve({ output });
        }
      });

      stream.on('error', (error) => {
        if (!completed) {
          cleanup();
          reject(error);
        }
      });

      // Timeout handling - cleanup will stop the stream, container cleanup in finally block handles the rest
      timeoutHandle = setTimeout(() => {
        if (!completed) {
          this.logger.warn('Execution timeout - container will be force-stopped', {
            timeout: this.config.resourceLimits.timeout
          });
          cleanup();
          reject(new Error('Execution timeout'));
        }
      }, this.config.resourceLimits.timeout);
    });
  }

  /**
   * Summarize output to <500 tokens
   */
  private summarizeOutput(output: any): string {
    const str = typeof output === 'string' ? output : JSON.stringify(output);

    if (str.length < 2000) {
      return str;
    }

    // Truncate and add summary
    return `${str.substring(0, 1800)}...\n\n[Output truncated. Total length: ${str.length} characters]`;
  }

  /**
   * Parse memory string to bytes
   */
  private parseMemory(memory: string): number {
    const match = memory.match(/^(\d+)([KMG])$/);
    if (!match) return 512 * 1024 * 1024; // Default 512M

    const [, amount, unit] = match;
    const multipliers = { K: 1024, M: 1024 ** 2, G: 1024 ** 3 };

    return parseInt(amount) * multipliers[unit as keyof typeof multipliers];
  }

  /**
   * Parse disk string to bytes
   */
  private parseDisk(disk: string): number {
    return this.parseMemory(disk);
  }

  /**
   * Format bytes to human-readable string
   */
  private formatMemory(bytes: number): string {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(2)}K`;
    if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(2)}M`;
    return `${(bytes / 1024 ** 3).toFixed(2)}G`;
  }

  /**
   * Estimate token count
   */
  private estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }

  /**
   * Emergency cleanup - kills all tracked containers
   * Should be called on process shutdown or when system is in bad state
   */
  static async emergencyCleanup(): Promise<void> {
    const docker = new Docker();
    const failedCleanups: string[] = [];

    for (const containerId of this.activeContainers) {
      try {
        const container = docker.getContainer(containerId);
        await container.stop({ t: 0 });
        await container.remove({ force: true });
        console.log(`Emergency cleanup: removed container ${containerId}`);
      } catch (error) {
        console.error(`Failed to clean up container ${containerId}:`, error);
        failedCleanups.push(containerId);
      }
    }

    // Clear the set
    this.activeContainers.clear();

    if (failedCleanups.length > 0) {
      console.error(`Failed to cleanup ${failedCleanups.length} containers:`, failedCleanups);
    }
  }

  /**
   * Get count of currently tracked active containers
   */
  static getActiveContainerCount(): number {
    return this.activeContainers.size;
  }

  /**
   * Get container metrics
   */
  static getMetrics() {
    return {
      ...this.metricsTracker.getMetrics(),
      activeContainers: this.activeContainers.size
    };
  }

  /**
   * Reset metrics (useful for testing)
   */
  static resetMetrics(): void {
    this.metricsTracker.reset();
  }
}
