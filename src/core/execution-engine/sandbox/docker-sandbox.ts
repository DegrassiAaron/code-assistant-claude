import Docker from 'dockerode';
import { SandboxConfig, ExecutionResult } from '../types';
import * as tar from 'tar-stream';

/**
 * Docker-based sandbox for isolated code execution
 * Provides containerized isolation with resource limits
 */
export class DockerSandbox {
  private docker: Docker;
  private config: SandboxConfig;

  constructor(config: SandboxConfig) {
    this.docker = new Docker();
    this.config = config;
  }

  /**
   * Execute code in Docker container
   */
  async execute(code: string, language: 'typescript' | 'python'): Promise<ExecutionResult> {
    const startTime = Date.now();

    try {
      // Create container
      const container = await this.createContainer(language);

      // Copy code to container
      await this.copyCodeToContainer(container, code, language);

      // Start container
      await container.start();

      // Execute code
      const result = await this.executeInContainer(container, language);

      // Get metrics
      const stats = await container.stats({ stream: false });

      // Cleanup
      await container.stop();
      await container.remove();

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

    // Create container with resource limits
    return this.docker.createContainer({
      Image: image,
      Tty: false,
      NetworkDisabled: this.config.networkPolicy.mode === 'none',
      WorkingDir: '/workspace',
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

      stream.on('data', (chunk: Buffer) => {
        output += chunk.toString();
      });

      stream.on('end', () => {
        resolve({ output });
      });

      stream.on('error', reject);

      // Timeout handling
      setTimeout(() => {
        reject(new Error('Execution timeout'));
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
}
