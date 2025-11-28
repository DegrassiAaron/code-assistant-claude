/* eslint-disable @typescript-eslint/no-explicit-any */
import { CodeWrapper, ExecutionResult, SandboxConfig } from '../types';
import { ProcessSandbox } from '../sandbox/process-sandbox';
import { SandboxManager } from '../sandbox/sandbox-manager';
import { CodeValidator } from '../security/code-validator';
import { RiskAssessor } from '../security/risk-assessor';
import { PIITokenizer } from '../security/pii-tokenizer';

/**
 * Runtime for executing generated MCP code with security and sandbox integration
 */
export class MCPCodeRuntime {
  private executionEnvironment: Map<string, any> = new Map();
  private sandboxManager: SandboxManager;
  private codeValidator: CodeValidator;
  private riskAssessor: RiskAssessor;
  private piiTokenizer: PIITokenizer;

  constructor() {
    this.sandboxManager = new SandboxManager();
    this.codeValidator = new CodeValidator();
    this.riskAssessor = new RiskAssessor();
    this.piiTokenizer = new PIITokenizer();
  }

  /**
   * Execute generated code wrapper in sandbox with security validation
   */
  async execute(
    wrapper: CodeWrapper,
    context?: Record<string, unknown>
  ): Promise<ExecutionResult> {
    const startTime = Date.now();

    try {
      // Set up execution context
      if (context) {
        for (const [key, value] of Object.entries(context)) {
          this.executionEnvironment.set(key, value);
        }
      }

      // Phase 1: Security validation
      console.log('[MCPRuntime] Validating code security...');
      const validation = await this.codeValidator.validate(wrapper.code);

      if (!validation.isSecure && validation.requiresApproval) {
        return {
          success: false,
          error: `Code failed security validation (risk score: ${validation.riskScore})`,
          summary: `Security issues detected: ${validation.issues.map((i) => i.type).join(', ')}`,
          metrics: {
            executionTime: Date.now() - startTime,
            memoryUsed: '0M',
            tokensInSummary: 50,
          },
          piiTokenized: false,
        };
      }

      // Phase 2: Risk assessment
      const riskAssessment = this.riskAssessor.assess(wrapper.code, validation);
      console.log(
        `[MCPRuntime] Risk assessment: ${riskAssessment.riskLevel} (score: ${riskAssessment.riskScore})`
      );

      // Determine sandbox level based on risk
      const sandboxLevel = this.sandboxManager.selectSandboxLevel({
        riskScore: riskAssessment.riskScore / 100,
        codeType: wrapper.language,
        operations: ['mcp-tool-call'],
      });

      console.log(`[MCPRuntime] Selected sandbox level: ${sandboxLevel}`);

      // Create sandbox config
      const sandboxConfig: SandboxConfig = {
        type: sandboxLevel,
        resourceLimits: {
          cpu: 1,
          memory: '512M',
          timeout: 30000,
        },
      };

      // Phase 3: Execute in appropriate sandbox
      let result: ExecutionResult;
      if (wrapper.language === 'typescript') {
        result = await this.executeTypeScript(wrapper.code, sandboxConfig);
      } else if (wrapper.language === 'python') {
        result = await this.executePython(wrapper.code, sandboxConfig);
      } else {
        throw new Error(`Unsupported language: ${wrapper.language}`);
      }

      // Phase 4: PII tokenization on output
      if (result.success && result.summary) {
        const originalSummary = result.summary;
        const tokenizedSummary = this.piiTokenizer.tokenize(result.summary);
        result.summary = tokenizedSummary;
        result.piiTokenized = tokenizedSummary !== originalSummary;
      }

      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        summary: 'Runtime execution failed',
        metrics: {
          executionTime: Date.now() - startTime,
          memoryUsed: '0M',
          tokensInSummary: 10,
        },
        piiTokenized: false,
      };
    }
  }

  /**
   * Execute TypeScript code in sandbox
   */
  private async executeTypeScript(
    code: string,
    config: SandboxConfig
  ): Promise<ExecutionResult> {
    try {
      const sandbox = new ProcessSandbox(config);
      return await sandbox.execute(code, 'typescript');
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        summary: 'TypeScript execution failed in sandbox',
        metrics: {
          executionTime: 0,
          memoryUsed: '0M',
          tokensInSummary: 10,
        },
        piiTokenized: false,
      };
    }
  }

  /**
   * Execute Python code in sandbox
   */
  private async executePython(
    code: string,
    config: SandboxConfig
  ): Promise<ExecutionResult> {
    try {
      const sandbox = new ProcessSandbox(config);
      return await sandbox.execute(code, 'python');
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        summary: 'Python execution failed in sandbox',
        metrics: {
          executionTime: 0,
          memoryUsed: '0M',
          tokensInSummary: 10,
        },
        piiTokenized: false,
      };
    }
  }


  /**
   * Clear execution environment
   */
  clear(): void {
    this.executionEnvironment.clear();
  }

  /**
   * Get value from execution environment
   */
  getEnvironmentValue(key: string): unknown {
    return this.executionEnvironment.get(key);
  }

  /**
   * Set value in execution environment
   */
  setEnvironmentValue(key: string, value: unknown): void {
    this.executionEnvironment.set(key, value);
  }

  /**
   * Cleanup sandbox resources
   */
  async cleanup(): Promise<void> {
    await this.sandboxManager.cleanup();
    this.clear();
  }
}
