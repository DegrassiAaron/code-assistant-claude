export class ResourceLimiter {
  private maxMemoryMB: number;
  private maxCpuPercent: number;
  private maxExecutionTime: number;
  private startTime: number;

  constructor(limits: {
    maxMemoryMB?: number;
    maxCpuPercent?: number;
    maxExecutionTime?: number;
  }) {
    this.maxMemoryMB = limits.maxMemoryMB ?? 256;
    this.maxCpuPercent = limits.maxCpuPercent ?? 80;
    this.maxExecutionTime = limits.maxExecutionTime ?? 30000;
    this.startTime = Date.now();
  }

  checkMemoryUsage(currentMemoryMB: number): boolean {
    return currentMemoryMB <= this.maxMemoryMB;
  }

  checkCpuUsage(currentCpuPercent: number): boolean {
    return currentCpuPercent <= this.maxCpuPercent;
  }

  checkExecutionTime(startTime: number): boolean {
    return (Date.now() - startTime) <= this.maxExecutionTime;
  }

  enforceLimit(resourceType: 'memory' | 'cpu' | 'time', withinLimit: boolean, customMessage?: string): void {
    if (!withinLimit) {
      throw new Error(customMessage || `Resource limit exceeded: ${resourceType}`);
    }
  }

  async getResourceStats(): Promise<{
    memoryUsageMB: number;
    cpuUsagePercent: number;
    executionTimeMs: number;
  }> {
    const memoryUsage = process.memoryUsage();
    return {
      memoryUsageMB: memoryUsage.heapUsed / 1024 / 1024,
      cpuUsagePercent: 0,
      executionTimeMs: Date.now() - this.startTime
    };
  }

  resetLimits(newLimits: {
    maxMemoryMB?: number;
    maxCpuPercent?: number;
    maxExecutionTime?: number;
  }): void {
    if (newLimits.maxMemoryMB !== undefined) this.maxMemoryMB = newLimits.maxMemoryMB;
    if (newLimits.maxCpuPercent !== undefined) this.maxCpuPercent = newLimits.maxCpuPercent;
    if (newLimits.maxExecutionTime !== undefined) this.maxExecutionTime = newLimits.maxExecutionTime;
  }
}
