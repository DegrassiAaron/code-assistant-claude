/**
 * Performance Metrics Utilities
 * Track and measure performance of operations
 */

export interface PerformanceMetrics {
  operationName: string;
  durationMs: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

export class PerformanceTracker {
  private metrics: PerformanceMetrics[] = [];
  private maxMetrics: number = 1000;

  /**
   * Measure the execution time of a function
   */
  async measure<T>(
    operationName: string,
    fn: () => T | Promise<T>,
    metadata?: Record<string, any>
  ): Promise<{ result: T; durationMs: number }> {
    const start = performance.now();
    const result = await fn();
    const durationMs = performance.now() - start;

    this.record({
      operationName,
      durationMs,
      timestamp: Date.now(),
      metadata
    });

    return { result, durationMs };
  }

  /**
   * Measure synchronously
   */
  measureSync<T>(
    operationName: string,
    fn: () => T,
    metadata?: Record<string, any>
  ): { result: T; durationMs: number } {
    const start = performance.now();
    const result = fn();
    const durationMs = performance.now() - start;

    this.record({
      operationName,
      durationMs,
      timestamp: Date.now(),
      metadata
    });

    return { result, durationMs };
  }

  /**
   * Record a metric
   */
  record(metric: PerformanceMetrics): void {
    this.metrics.push(metric);

    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }
  }

  /**
   * Get all metrics for an operation
   */
  getMetrics(operationName?: string): PerformanceMetrics[] {
    if (operationName) {
      return this.metrics.filter(m => m.operationName === operationName);
    }
    return [...this.metrics];
  }

  /**
   * Get average duration for an operation
   */
  getAverageDuration(operationName: string): number {
    const metrics = this.getMetrics(operationName);
    if (metrics.length === 0) return 0;

    const total = metrics.reduce((sum, m) => sum + m.durationMs, 0);
    return total / metrics.length;
  }

  /**
   * Get statistics for an operation
   */
  getStats(operationName: string): {
    count: number;
    avgMs: number;
    minMs: number;
    maxMs: number;
    totalMs: number;
  } {
    const metrics = this.getMetrics(operationName);

    if (metrics.length === 0) {
      return { count: 0, avgMs: 0, minMs: 0, maxMs: 0, totalMs: 0 };
    }

    const durations = metrics.map(m => m.durationMs);
    const totalMs = durations.reduce((sum, d) => sum + d, 0);

    return {
      count: metrics.length,
      avgMs: totalMs / metrics.length,
      minMs: Math.min(...durations),
      maxMs: Math.max(...durations),
      totalMs
    };
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics = [];
  }

  /**
   * Set maximum metrics to store
   */
  setMaxMetrics(max: number): void {
    this.maxMetrics = max;
    if (this.metrics.length > max) {
      this.metrics = this.metrics.slice(-max);
    }
  }
}

/**
 * Global performance tracker instance
 */
export const performanceTracker = new PerformanceTracker();
