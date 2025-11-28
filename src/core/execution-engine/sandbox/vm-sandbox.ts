import { SandboxConfig, ExecutionResult } from '../types';
import * as vm from 'vm';

/**
 * VM-based sandbox for isolated code execution
 * Provides lightweight VM isolation (suitable for JavaScript/TypeScript)
 */
export class VMSandbox {
  private config: SandboxConfig;

  constructor(config: SandboxConfig) {
    this.config = config;
  }

  /**
   * Execute code in VM sandbox
   */
  async execute(
    code: string,
    language: 'typescript' | 'python'
  ): Promise<ExecutionResult> {
    const startTime = Date.now();

    if (language === 'python') {
      return {
        success: false,
        error:
          'VM sandbox does not support Python. Use Docker or Process sandbox instead.',
        summary: 'Unsupported language for VM sandbox',
        metrics: {
          executionTime: 0,
          memoryUsed: '0M',
          tokensInSummary: 0,
        },
        piiTokenized: false,
      };
    }

    try {
      // Create sandbox context
      const context = vm.createContext(this.createSandboxContext());

      // Execute code with timeout
      const result = vm.runInContext(code, context, {
        timeout: this.config.resourceLimits.timeout,
        displayErrors: true,
      });

      const executionTime = Date.now() - startTime;
      const memoryUsed = process.memoryUsage().heapUsed;

      return {
        success: true,
        output: result,
        summary: this.summarizeOutput(result),
        metrics: {
          executionTime,
          memoryUsed: this.formatMemory(memoryUsed),
          tokensInSummary: this.estimateTokens(result),
        },
        piiTokenized: false,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        summary: 'VM execution failed',
        metrics: {
          executionTime: Date.now() - startTime,
          memoryUsed: '0M',
          tokensInSummary: 0,
        },
        piiTokenized: false,
      };
    }
  }

  /**
   * Create sandbox context with limited globals
   */
  private createSandboxContext(): Record<string, unknown> {
    return {
      console: {
        log: (...args: unknown[]) => console.log('[Sandbox]', ...args),
        error: (...args: unknown[]) => console.error('[Sandbox]', ...args),
        warn: (...args: unknown[]) => console.warn('[Sandbox]', ...args),
      },
      setTimeout: undefined, // Disable timers
      setInterval: undefined,
      setImmediate: undefined,
      // Add safe utilities as needed
    };
  }

  /**
   * Summarize output to <500 tokens
   */
  private summarizeOutput(output: unknown): string {
    const str = typeof output === 'string' ? output : JSON.stringify(output);

    if (str.length < 2000) {
      return str;
    }

    return `${str.substring(0, 1800)}...\n\n[Output truncated. Total length: ${str.length} characters]`;
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
