import { VM } from "vm2";
import type { SandboxConfig } from "../types";

type SandboxLevel = "docker" | "vm" | "process";

interface SandboxExecutionOptions {
  level: SandboxLevel;
  timeout: number;
  memoryLimit?: number;
  cpuLimit?: number;
  allowedGlobals?: string[];
  sessionId?: string;
}

interface SandboxResult {
  success: boolean;
  result?: any;
  output?: any;
  error?: string;
  summary?: string;
  metrics?: {
    executionTime: number;
    memoryUsed: string;
    tokensInSummary: number;
  };
  piiTokenized?: boolean;
}

export class SandboxManager {
  private activeSandboxes: Map<string, any>;
  private defaultConfig: SandboxConfig;

  constructor(config?: SandboxConfig) {
    this.defaultConfig = config || {
      type: "process",
      resourceLimits: {
        cpu: 0.8,
        memory: "256M",
        timeout: 5000,
      },
    };
    this.activeSandboxes = new Map();
  }

  selectSandboxLevel(riskAssessment: {
    riskScore: number;
    codeType: string;
    operations: string[];
  }): SandboxLevel {
    return riskAssessment.riskScore >= 0.7
      ? "docker"
      : riskAssessment.riskScore >= 0.4
        ? "vm"
        : "process";
  }

  async executeInSandbox(
    code: string,
    options: SandboxExecutionOptions,
  ): Promise<SandboxResult> {
    try {
      switch (options.level) {
        case "vm":
          return await this.executeInVM(code, options);
        case "process":
          return await this.executeInProcess(code, options);
        case "docker":
          return {
            success: false,
            error: "Docker sandbox not yet implemented",
          };
        default:
          return {
            success: false,
            error: `Unknown sandbox level: ${options.level}`,
          };
      }
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  private async executeInVM(
    code: string,
    options: SandboxExecutionOptions,
  ): Promise<SandboxResult> {
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        resolve({ success: false, error: "Execution timeout exceeded" });
      }, options.timeout);
      try {
        const vm = new VM({
          timeout: options.timeout,
          sandbox: {},
          eval: false,
          wasm: false,
        });
        const result = vm.run(code);
        clearTimeout(timer);
        resolve({ success: true, result });
      } catch (error: any) {
        clearTimeout(timer);
        resolve({ success: false, error: error.message });
      }
    });
  }

  private async executeInProcess(
    code: string,
    options: SandboxExecutionOptions,
  ): Promise<SandboxResult> {
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        resolve({ success: false, error: "Execution timeout exceeded" });
      }, options.timeout);
      try {
        const fn = new Function(code);
        const result = fn();
        clearTimeout(timer);
        resolve({ success: true, result });
      } catch (error: any) {
        clearTimeout(timer);
        resolve({ success: false, error: error.message });
      }
    });
  }

  async cleanup(): Promise<void> {
    this.activeSandboxes.clear();
  }

  async cleanupSession(sessionId: string): Promise<void> {
    this.activeSandboxes.delete(sessionId);
  }

  async execute(
    _code: string,
    _language?: string,
    _config?: any,
  ): Promise<SandboxResult> {
    const options: SandboxExecutionOptions = {
      level: "process",
      timeout: 5000,
    };
    return this.executeInSandbox(_code, options);
  }
}
