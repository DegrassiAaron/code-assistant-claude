import { SandboxConfig, ExecutionResult } from '../types';
import { DockerSandbox } from './docker-sandbox';
import { VMSandbox } from './vm-sandbox';
import { ProcessSandbox } from './process-sandbox';

/**
 * Manages different sandbox implementations and routes execution
 */
export class SandboxManager {
  /**
   * Execute code using appropriate sandbox
   */
  async execute(
    code: string,
    language: 'typescript' | 'python',
    config: SandboxConfig
  ): Promise<ExecutionResult> {
    const sandbox = this.createSandbox(config);
    return sandbox.execute(code, language);
  }

  /**
   * Create appropriate sandbox instance based on config
   */
  private createSandbox(config: SandboxConfig): DockerSandbox | VMSandbox | ProcessSandbox {
    switch (config.type) {
      case 'docker':
        return new DockerSandbox(config);
      case 'vm':
        return new VMSandbox(config);
      case 'process':
        return new ProcessSandbox(config);
      default:
        throw new Error(`Unsupported sandbox type: ${config.type}`);
    }
  }

  /**
   * Get recommended sandbox type based on requirements
   */
  getRecommendedSandbox(requirements: {
    language: 'typescript' | 'python';
    securityLevel: 'low' | 'medium' | 'high';
    performanceNeeded: boolean;
  }): SandboxConfig['type'] {
    // High security always uses Docker
    if (requirements.securityLevel === 'high') {
      return 'docker';
    }

    // Python requires Docker or Process
    if (requirements.language === 'python') {
      return requirements.performanceNeeded ? 'process' : 'docker';
    }

    // TypeScript can use any sandbox
    if (requirements.performanceNeeded) {
      return 'process'; // Fastest startup
    } else if (requirements.securityLevel === 'medium') {
      return 'vm';      // Good balance
    } else {
      return 'docker';  // Most isolated
    }
  }

  /**
   * Create default sandbox config
   */
  createDefaultConfig(type?: SandboxConfig['type']): SandboxConfig {
    return {
      type: type || 'process',
      resourceLimits: {
        cpu: 1,
        memory: '512M',
        disk: '1G',
        timeout: 30000
      },
      networkPolicy: {
        mode: 'whitelist',
        allowed: []
      }
    };
  }

  /**
   * Validate sandbox config
   */
  validateConfig(config: SandboxConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate resource limits
    if (config.resourceLimits.cpu < 0.1 || config.resourceLimits.cpu > 8) {
      errors.push('CPU cores must be between 0.1 and 8');
    }

    if (!config.resourceLimits.memory.match(/^\d+[KMG]$/)) {
      errors.push('Memory must be in format: 512M, 1G, etc.');
    }

    if (!config.resourceLimits.disk.match(/^\d+[KMG]$/)) {
      errors.push('Disk must be in format: 1G, 2G, etc.');
    }

    if (config.resourceLimits.timeout < 1000 || config.resourceLimits.timeout > 300000) {
      errors.push('Timeout must be between 1s and 5 minutes');
    }

    // Validate network policy
    if (!['none', 'whitelist', 'blacklist'].includes(config.networkPolicy.mode)) {
      errors.push('Network mode must be: none, whitelist, or blacklist');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
