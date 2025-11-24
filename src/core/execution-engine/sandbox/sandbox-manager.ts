import { VM } from "vm2";
import type { SandboxConfig, SandboxLevel } from "../types";

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
  error?: string;
}

export class SandboxManager {
  private config: SandboxConfig;
  private activeSandboxes: Map<string, any>;

  constructor(config?: SandboxConfig) {
    this.config = config || {
      level: "process",
      timeout: 5000,
      memoryLimit: 256,
      cpuLimit: 0.8,
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
}
