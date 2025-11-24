/**
 * Metrics for container operations
 */
export interface ContainerMetrics {
  containersCreated: number;
  containersCleanedSuccess: number;
  containersCleanedFailed: number;
  cleanupTimeMs: number;
  zombieContainersFound: number;
}

/**
 * Logger interface for sandbox operations
 */
export interface SandboxLogger {
  info(message: string, metadata?: Record<string, unknown>): void;
  warn(message: string, metadata?: Record<string, unknown>): void;
  error(
    message: string,
    error?: Error,
    metadata?: Record<string, unknown>
  ): void;
  metric(name: string, value: number, metadata?: Record<string, unknown>): void;
}

/**
 * Default console-based logger implementation
 */
export class ConsoleLogger implements SandboxLogger {
  info(message: string, metadata?: Record<string, unknown>): void {
    const meta = metadata ? ` ${JSON.stringify(metadata)}` : '';
    console.log(`[INFO] ${message}${meta}`);
  }

  warn(message: string, metadata?: Record<string, unknown>): void {
    const meta = metadata ? ` ${JSON.stringify(metadata)}` : '';
    console.warn(`[WARN] ${message}${meta}`);
  }

  error(
    message: string,
    error?: Error,
    metadata?: Record<string, unknown>
  ): void {
    const meta = metadata ? ` ${JSON.stringify(metadata)}` : '';
    const err = error ? ` - ${error.message}` : '';
    console.error(`[ERROR] ${message}${err}${meta}`);
  }

  metric(
    name: string,
    value: number,
    metadata?: Record<string, unknown>
  ): void {
    const meta = metadata ? ` ${JSON.stringify(metadata)}` : '';
    console.log(`[METRIC] ${name}=${value}${meta}`);
  }
}

/**
 * Metrics tracker for container operations
 */
export class ContainerMetricsTracker {
  private metrics: ContainerMetrics = {
    containersCreated: 0,
    containersCleanedSuccess: 0,
    containersCleanedFailed: 0,
    cleanupTimeMs: 0,
    zombieContainersFound: 0,
  };

  incrementCreated(): void {
    this.metrics.containersCreated++;
  }

  incrementCleanedSuccess(): void {
    this.metrics.containersCleanedSuccess++;
  }

  incrementCleanedFailed(): void {
    this.metrics.containersCleanedFailed++;
  }

  recordCleanupTime(timeMs: number): void {
    this.metrics.cleanupTimeMs = timeMs;
  }

  recordZombiesFound(count: number): void {
    this.metrics.zombieContainersFound = count;
  }

  getMetrics(): ContainerMetrics {
    return { ...this.metrics };
  }

  reset(): void {
    this.metrics = {
      containersCreated: 0,
      containersCleanedSuccess: 0,
      containersCleanedFailed: 0,
      cleanupTimeMs: 0,
      zombieContainersFound: 0,
    };
  }
}
