import { AuditLogEntry } from '../types';
import { promises as fs } from 'fs';
import path from 'path';

/**
 * Execution audit logger
 * Logs all execution activities for compliance and debugging
 */
export class AuditLogger {
  private logs: AuditLogEntry[] = [];
  private logFile: string;
  private maxLogsInMemory: number = 1000;

  constructor(logFile?: string) {
    this.logFile = logFile || path.join(process.cwd(), 'logs/mcp-audit.log');
  }

  /**
   * Log an entry
   */
  async log(
    type: AuditLogEntry['type'],
    severity: AuditLogEntry['severity'],
    message: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    const entry: AuditLogEntry = {
      timestamp: new Date(),
      type,
      severity,
      message,
      metadata
    };

    this.logs.push(entry);

    // Write to file
    await this.writeToFile(entry);

    // Trim in-memory logs if needed
    if (this.logs.length > this.maxLogsInMemory) {
      this.logs = this.logs.slice(-this.maxLogsInMemory);
    }
  }

  /**
   * Log execution event
   */
  async logExecution(
    workspaceId: string,
    code: string,
    result: any,
    metadata?: Record<string, any>
  ): Promise<void> {
    await this.log('execution', 'info', 'Code execution completed', {
      workspaceId,
      codeLength: code.length,
      success: result.success,
      executionTime: result.metrics?.executionTime,
      ...metadata
    });
  }

  /**
   * Log security event
   */
  async logSecurity(
    severity: AuditLogEntry['severity'],
    message: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    await this.log('security', severity, message, metadata);
  }

  /**
   * Log discovery event
   */
  async logDiscovery(
    query: string,
    toolsFound: number,
    metadata?: Record<string, any>
  ): Promise<void> {
    await this.log('discovery', 'info', 'Tool discovery completed', {
      query,
      toolsFound,
      ...metadata
    });
  }

  /**
   * Log error
   */
  async logError(
    error: Error,
    context?: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    await this.log('error', 'error', error.message, {
      stack: error.stack,
      context,
      ...metadata
    });
  }

  /**
   * Get recent logs
   */
  getRecentLogs(limit: number = 100): AuditLogEntry[] {
    return this.logs.slice(-limit);
  }

  /**
   * Get logs by type
   */
  getLogsByType(type: AuditLogEntry['type'], limit?: number): AuditLogEntry[] {
    const filtered = this.logs.filter(log => log.type === type);
    return limit ? filtered.slice(-limit) : filtered;
  }

  /**
   * Get logs by severity
   */
  getLogsBySeverity(severity: AuditLogEntry['severity'], limit?: number): AuditLogEntry[] {
    const filtered = this.logs.filter(log => log.severity === severity);
    return limit ? filtered.slice(-limit) : filtered;
  }

  /**
   * Write log entry to file
   */
  private async writeToFile(entry: AuditLogEntry): Promise<void> {
    try {
      // Ensure log directory exists
      const logDir = path.dirname(this.logFile);
      await fs.mkdir(logDir, { recursive: true });

      // Format log entry
      const logLine = JSON.stringify(entry) + '\n';

      // Append to file
      await fs.appendFile(this.logFile, logLine);
    } catch (error) {
      console.error('Failed to write to audit log:', error);
    }
  }

  /**
   * Clear in-memory logs
   */
  clearMemoryLogs(): void {
    this.logs = [];
  }

  /**
   * Get statistics
   */
  getStats(): {
    totalLogs: number;
    byType: Record<string, number>;
    bySeverity: Record<string, number>;
  } {
    const byType: Record<string, number> = {};
    const bySeverity: Record<string, number> = {};

    for (const log of this.logs) {
      byType[log.type] = (byType[log.type] || 0) + 1;
      bySeverity[log.severity] = (bySeverity[log.severity] || 0) + 1;
    }

    return {
      totalLogs: this.logs.length,
      byType,
      bySeverity
    };
  }

  /**
   * Get log file path (for testing only)
   * @internal
   */
  getLogFilePath(): string {
    return this.logFile;
  }
}
