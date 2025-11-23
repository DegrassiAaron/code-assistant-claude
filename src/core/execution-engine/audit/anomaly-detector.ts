import { AnomalyDetection, Anomaly, AuditLogEntry } from '../types';

/**
 * Detects anomalies in execution patterns
 */
export class AnomalyDetector {
  private executionHistory: ExecutionMetrics[] = [];
  private maxHistorySize: number = 1000;

  /**
   * Analyze execution for anomalies
   */
  analyze(
    executionTime: number,
    memoryUsed: number,
    logs: AuditLogEntry[]
  ): AnomalyDetection {
    const anomalies: Anomaly[] = [];

    // Check for resource spikes
    anomalies.push(...this.detectResourceSpikes(executionTime, memoryUsed));

    // Check for suspicious patterns
    anomalies.push(...this.detectSuspiciousPatterns(logs));

    // Check for repeated failures
    anomalies.push(...this.detectRepeatedFailures(logs));

    // Check for unusual timing
    anomalies.push(...this.detectUnusualTiming(executionTime));

    // Record metrics
    this.recordExecution(executionTime, memoryUsed);

    // Calculate risk level
    const riskLevel = this.calculateRiskLevel(anomalies);

    return {
      detected: anomalies.length > 0,
      anomalies,
      riskLevel
    };
  }

  /**
   * Detect resource usage spikes
   */
  private detectResourceSpikes(executionTime: number, memoryUsed: number): Anomaly[] {
    const anomalies: Anomaly[] = [];

    if (this.executionHistory.length < 10) {
      return anomalies; // Not enough data
    }

    // Calculate averages
    const avgTime = this.executionHistory.reduce((sum, m) => sum + m.executionTime, 0) / this.executionHistory.length;
    const avgMemory = this.executionHistory.reduce((sum, m) => sum + m.memoryUsed, 0) / this.executionHistory.length;

    // Check for spikes (3x average)
    if (executionTime > avgTime * 3) {
      anomalies.push({
        type: 'resource_spike',
        description: `Execution time (${executionTime}ms) is 3x higher than average (${avgTime.toFixed(0)}ms)`,
        severity: 'high',
        timestamp: new Date()
      });
    }

    if (memoryUsed > avgMemory * 3) {
      anomalies.push({
        type: 'resource_spike',
        description: `Memory usage (${memoryUsed}MB) is 3x higher than average (${avgMemory.toFixed(0)}MB)`,
        severity: 'high',
        timestamp: new Date()
      });
    }

    return anomalies;
  }

  /**
   * Detect suspicious patterns in logs
   */
  private detectSuspiciousPatterns(logs: AuditLogEntry[]): Anomaly[] {
    const anomalies: Anomaly[] = [];

    // Check for high-severity security events
    const criticalSecurityLogs = logs.filter(
      log => log.type === 'security' && log.severity === 'critical'
    );

    if (criticalSecurityLogs.length > 0) {
      anomalies.push({
        type: 'suspicious_pattern',
        description: `${criticalSecurityLogs.length} critical security events detected`,
        severity: 'critical',
        timestamp: new Date()
      });
    }

    // Check for repeated error patterns
    const errorLogs = logs.filter(log => log.type === 'error');
    if (errorLogs.length > 5) {
      anomalies.push({
        type: 'suspicious_pattern',
        description: `High error rate: ${errorLogs.length} errors`,
        severity: 'medium',
        timestamp: new Date()
      });
    }

    return anomalies;
  }

  /**
   * Detect repeated failures
   */
  private detectRepeatedFailures(logs: AuditLogEntry[]): Anomaly[] {
    const anomalies: Anomaly[] = [];

    // Get execution logs
    const executionLogs = logs.filter(log => log.type === 'execution');

    // Count failures
    const failures = executionLogs.filter(log => log.metadata?.success === false);

    if (failures.length > 3) {
      anomalies.push({
        type: 'repeated_failure',
        description: `${failures.length} consecutive execution failures`,
        severity: failures.length > 5 ? 'high' : 'medium',
        timestamp: new Date()
      });
    }

    return anomalies;
  }

  /**
   * Detect unusual timing patterns
   */
  private detectUnusualTiming(executionTime: number): Anomaly[] {
    const anomalies: Anomaly[] = [];

    // Very fast execution might indicate code didn't actually run
    if (executionTime < 10) {
      anomalies.push({
        type: 'unusual_timing',
        description: `Suspiciously fast execution: ${executionTime}ms`,
        severity: 'low',
        timestamp: new Date()
      });
    }

    // Very slow execution might indicate infinite loop or DoS
    if (executionTime > 60000) {
      anomalies.push({
        type: 'unusual_timing',
        description: `Suspiciously slow execution: ${executionTime}ms`,
        severity: 'high',
        timestamp: new Date()
      });
    }

    return anomalies;
  }

  /**
   * Record execution metrics
   */
  private recordExecution(executionTime: number, memoryUsed: number): void {
    this.executionHistory.push({
      executionTime,
      memoryUsed,
      timestamp: new Date()
    });

    // Trim history if needed
    if (this.executionHistory.length > this.maxHistorySize) {
      this.executionHistory = this.executionHistory.slice(-this.maxHistorySize);
    }
  }

  /**
   * Calculate overall risk level
   */
  private calculateRiskLevel(anomalies: Anomaly[]): AnomalyDetection['riskLevel'] {
    if (anomalies.length === 0) return 'low';

    const hasCritical = anomalies.some(a => a.severity === 'critical');
    const hasHigh = anomalies.some(a => a.severity === 'high');
    const hasMedium = anomalies.some(a => a.severity === 'medium');

    if (hasCritical) return 'critical';
    if (hasHigh) return 'high';
    if (hasMedium) return 'medium';

    return 'low';
  }

  /**
   * Clear history
   */
  clearHistory(): void {
    this.executionHistory = [];
  }

  /**
   * Get statistics
   */
  getStats(): {
    historySize: number;
    avgExecutionTime: number;
    avgMemoryUsed: number;
  } {
    const avgExecutionTime = this.executionHistory.length > 0
      ? this.executionHistory.reduce((sum, m) => sum + m.executionTime, 0) / this.executionHistory.length
      : 0;

    const avgMemoryUsed = this.executionHistory.length > 0
      ? this.executionHistory.reduce((sum, m) => sum + m.memoryUsed, 0) / this.executionHistory.length
      : 0;

    return {
      historySize: this.executionHistory.length,
      avgExecutionTime,
      avgMemoryUsed
    };
  }
}

/**
 * Execution metrics for anomaly detection
 */
interface ExecutionMetrics {
  executionTime: number;
  memoryUsed: number;
  timestamp: Date;
}
