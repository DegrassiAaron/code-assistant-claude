import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { SandboxConfig, ExecutionResult } from '../types';
import * as os from 'os';

/**
 * Safe environment variables that don't contain secrets
 * These variables are passed to sandboxed processes if they exist
 *
 * Note: PATH, HOME, and TMPDIR are handled specially:
 * - PATH: Uses host PATH or safe fallback
 * - HOME: Set to sandbox temporary directory
 * - TMPDIR: Set to sandbox temporary directory
 */
const SAFE_ENV_VARS = [
  'USER',    // Username (generally safe, no secrets)
  'LANG',    // Language/locale setting
  'LC_ALL',  // Locale setting
  'TZ'       // Timezone
];

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

      // Execute in process with isolated environment
      const result = await this.executeInProcess(filePath, language, tmpDir);

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
    language: string,
    tmpDir: string
  ): Promise<{ success: boolean; output?: string; error?: string; memoryUsed?: string }> {
    return new Promise((resolve) => {
      const command = language === 'typescript' ? 'ts-node' : 'python3';
      const args = [filePath];

      // ✅ Build safe environment - NO SECRETS
      // Only include whitelisted safe variables to prevent credential leakage

      // Validate custom allowed environment variables
      const customAllowedVars = this.config.allowedEnvVars || [];
      const dangerousPattern = /KEY|SECRET|TOKEN|PASSWORD|CREDENTIAL|AUTH/i;

      for (const varName of customAllowedVars) {
        if (dangerousPattern.test(varName)) {
          throw new Error(
            `Security Error: Refusing to expose potentially sensitive variable: ${varName}. ` +
            `Variable names matching KEY, SECRET, TOKEN, PASSWORD, CREDENTIAL, or AUTH are not allowed.`
          );
        }
      }

      const safeEnv: Record<string, string> = {
        NODE_ENV: 'sandbox',
        // Use sandbox-specific directories to prevent path leakage
        HOME: tmpDir,
        TMPDIR: tmpDir,
        // Ensure PATH is available with safe fallback
        PATH: process.env.PATH || '/usr/local/bin:/usr/bin:/bin',
        // Only include whitelisted variables that exist (type-safe)
        ...Object.fromEntries(
          SAFE_ENV_VARS
            .map(key => [key, process.env[key]])
            .filter(([_, value]) => value !== undefined) as [string, string][]
        ),
        // Include custom allowed variables if validated
        ...Object.fromEntries(
          customAllowedVars
            .map(key => [key, process.env[key]])
            .filter(([_, value]) => value !== undefined) as [string, string][]
        )
      };

      const child = spawn(command, args, {
        timeout: this.config.resourceLimits.timeout,
        maxBuffer: this.parseMemory(this.config.resourceLimits.memory),
        env: safeEnv
      });

      let stdout = '';
      let stderr = '';
      let resolved = false;

      // Guard to prevent double-resolution of promise
      const safeResolve = (result: { success: boolean; output?: string; error?: string; memoryUsed?: string }) => {
        if (!resolved) {
          resolved = true;
          resolve(result);
        }
      };

      child.stdout?.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr?.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code, signal) => {
        // Check if process was killed by timeout
        if (signal === 'SIGTERM' || code === null) {
          safeResolve({
            success: false,
            error: 'Execution timeout'
          });
        } else if (code === 0) {
          safeResolve({
            success: true,
            output: stdout,
            memoryUsed: this.formatMemory(process.memoryUsage().heapUsed)
          });
        } else {
          safeResolve({
            success: false,
            error: stderr || `Process exited with code ${code}`,
            output: stdout
          });
        }
      });

      child.on('error', (error) => {
        safeResolve({
          success: false,
          error: error.message
        });
      });
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
