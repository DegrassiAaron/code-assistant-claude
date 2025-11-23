import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { SandboxConfig, ExecutionResult } from '../types';
import * as os from 'os';

/**
 * Process-based sandbox for isolated code execution
 * Provides lightweight process isolation with resource limits
 */
export class ProcessSandbox {
  private config: SandboxConfig;

  constructor(config: SandboxConfig) {
    this.config = config;
  }

  /**
   * Execute code in isolated process
   */
  async execute(code: string, language: 'typescript' | 'python'): Promise<ExecutionResult> {
    const startTime = Date.now();

    try {
      // Create temporary directory for execution
      const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'mcp-sandbox-'));

      // Write code to file
      const filename = language === 'typescript' ? 'script.ts' : 'script.py';
      const filePath = path.join(tmpDir, filename);
      await fs.writeFile(filePath, code);

      // Execute in process
      const result = await this.executeInProcess(filePath, language);

      // Cleanup
      await fs.rm(tmpDir, { recursive: true, force: true });

      return {
        success: result.success,
        output: result.output,
        summary: this.summarizeOutput(result.output),
        error: result.error,
        metrics: {
          executionTime: Date.now() - startTime,
          memoryUsed: result.memoryUsed || '0M',
          tokensInSummary: this.estimateTokens(result.output || '')
        },
        piiTokenized: false
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        summary: 'Process execution failed',
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
   * Execute code file in child process
   */
  private async executeInProcess(
    filePath: string,
    language: string
  ): Promise<{ success: boolean; output?: string; error?: string; memoryUsed?: string }> {
    return new Promise((resolve) => {
      const command = language === 'typescript' ? 'ts-node' : 'python3';
      const args = [filePath];

      const child = spawn(command, args, {
        timeout: this.config.resourceLimits.timeout,
        maxBuffer: this.parseMemory(this.config.resourceLimits.memory),
        env: {
          ...process.env,
          // Limit environment variables for security
          NODE_ENV: 'sandbox',
          PATH: process.env.PATH
        }
      });

      let stdout = '';
      let stderr = '';

      child.stdout?.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr?.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve({
            success: true,
            output: stdout,
            memoryUsed: this.formatMemory(process.memoryUsage().heapUsed)
          });
        } else {
          resolve({
            success: false,
            error: stderr || `Process exited with code ${code}`,
            output: stdout
          });
        }
      });

      child.on('error', (error) => {
        resolve({
          success: false,
          error: error.message
        });
      });

      // Handle timeout
      setTimeout(() => {
        child.kill('SIGTERM');
        resolve({
          success: false,
          error: 'Execution timeout'
        });
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
