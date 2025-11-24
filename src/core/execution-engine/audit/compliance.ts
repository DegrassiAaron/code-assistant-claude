import { ComplianceReport, AuditLogEntry } from "../types";
import { AuditLogger } from "./logger";

/**
 * Compliance manager for GDPR, SOC2, HIPAA
 */
export class ComplianceManager {
  private auditLogger: AuditLogger;

  constructor(auditLogger: AuditLogger) {
    this.auditLogger = auditLogger;
  }

  /**
   * Generate compliance report
   */
  generateReport(startDate: Date, endDate: Date): ComplianceReport {
    const logs = this.auditLogger.getRecentLogs();

    // Filter logs within date range
    const periodLogs = logs.filter(
      (log) => log.timestamp >= startDate && log.timestamp <= endDate,
    );

    // Calculate metrics
    const metrics = this.calculateMetrics(periodLogs);

    // Check compliance
    const compliance = this.checkCompliance(metrics, periodLogs);

    return {
      generatedAt: new Date(),
      period: {
        start: startDate,
        end: endDate,
      },
      metrics,
      compliance,
    };
  }

  /**
   * Calculate compliance metrics
   */
  private calculateMetrics(logs: AuditLogEntry[]): ComplianceReport["metrics"] {
    const executionLogs = logs.filter((l) => l.type === "execution");
    const securityLogs = logs.filter((l) => l.type === "security");

    return {
      totalExecutions: executionLogs.length,
      securityIncidents: securityLogs.filter(
        (l) => l.severity === "error" || l.severity === "critical",
      ).length,
      piiDataProcessed: this.countPIIProcessed(logs),
      sandboxEscapes: this.countSandboxEscapes(securityLogs),
    };
  }

  /**
   * Count PII data processed
   */
  private countPIIProcessed(logs: AuditLogEntry[]): number {
    return logs.filter(
      (log) =>
        log.metadata?.piiTokenized === true || log.message.includes("PII"),
    ).length;
  }

  /**
   * Count sandbox escapes (security incidents)
   */
  private countSandboxEscapes(securityLogs: AuditLogEntry[]): number {
    return securityLogs.filter(
      (log) =>
        log.message.includes("escape") ||
        log.message.includes("breach") ||
        log.severity === "critical",
    ).length;
  }

  /**
   * Check compliance against standards
   */
  private checkCompliance(
    metrics: ComplianceReport["metrics"],
    logs: AuditLogEntry[],
  ): ComplianceReport["compliance"] {
    return {
      gdpr: this.checkGDPRCompliance(metrics, logs),
      soc2: this.checkSOC2Compliance(metrics, logs),
      hipaa: this.checkHIPAACompliance(metrics, logs),
    };
  }

  /**
   * Check GDPR compliance
   */
  private checkGDPRCompliance(
    metrics: ComplianceReport["metrics"],
    logs: AuditLogEntry[],
  ): boolean {
    // GDPR requirements:
    // 1. All PII must be tokenized
    // 2. Audit logs must exist for all processing
    // 3. No unauthorized data access

    const piiProcessedWithTokenization = logs.filter(
      (log) => log.metadata?.piiTokenized === true,
    ).length;

    const allPIITokenized =
      piiProcessedWithTokenization === metrics.piiDataProcessed;
    const hasAuditTrail = logs.length > 0;
    const noUnauthorizedAccess = metrics.securityIncidents === 0;

    return allPIITokenized && hasAuditTrail && noUnauthorizedAccess;
  }

  /**
   * Check SOC2 compliance
   */
  private checkSOC2Compliance(
    metrics: ComplianceReport["metrics"],
    logs: AuditLogEntry[],
  ): boolean {
    // SOC2 requirements:
    // 1. Security controls in place (validation, sandboxing)
    // 2. Audit logging enabled
    // 3. No security incidents

    const hasSecurityControls = logs.some(
      (log) => log.type === "security" && log.message.includes("validation"),
    );

    const hasAuditLogging = logs.length > 0;
    const noSandboxEscapes = metrics.sandboxEscapes === 0;

    return hasSecurityControls && hasAuditLogging && noSandboxEscapes;
  }

  /**
   * Check HIPAA compliance
   */
  private checkHIPAACompliance(
    metrics: ComplianceReport["metrics"],
    logs: AuditLogEntry[],
  ): boolean {
    // HIPAA requirements (if processing health data):
    // 1. All PII/PHI must be encrypted/tokenized
    // 2. Access controls and audit trails
    // 3. No unauthorized access

    // Same as GDPR for our purposes
    return this.checkGDPRCompliance(metrics, logs);
  }

  /**
   * Validate compliance before execution
   */
  validateComplianceRequirements(): {
    compliant: boolean;
    issues: string[];
  } {
    const issues: string[] = [];

    // Check if audit logging is enabled
    if (!this.auditLogger) {
      issues.push("Audit logging not initialized");
    }

    // Add more validation checks as needed

    return {
      compliant: issues.length === 0,
      issues,
    };
  }
}
