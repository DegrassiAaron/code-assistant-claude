import { RiskAssessment } from './risk-assessor';
import { SecurityValidation } from '../types';

/**
 * Manages approval workflow for high-risk code execution
 */
export class ApprovalGate {
  private pendingApprovals: Map<string, ApprovalRequest> = new Map();

  /**
   * Check if code requires approval
   */
  requiresApproval(riskAssessment: RiskAssessment, validation: SecurityValidation): boolean {
    return riskAssessment.requiresApproval || validation.requiresApproval;
  }

  /**
   * Request approval for code execution
   */
  async requestApproval(
    code: string,
    riskAssessment: RiskAssessment,
    validation: SecurityValidation
  ): Promise<ApprovalRequest> {
    const requestId = this.generateRequestId();

    const request: ApprovalRequest = {
      id: requestId,
      code,
      riskAssessment,
      validation,
      status: 'pending',
      requestedAt: new Date(),
      approvedBy: undefined,
      approvedAt: undefined,
      reason: undefined
    };

    this.pendingApprovals.set(requestId, request);

    return request;
  }

  /**
   * Approve a request
   */
  approve(requestId: string, approvedBy: string, reason?: string): boolean {
    const request = this.pendingApprovals.get(requestId);
    if (!request || request.status !== 'pending') {
      return false;
    }

    request.status = 'approved';
    request.approvedBy = approvedBy;
    request.approvedAt = new Date();
    request.reason = reason;

    return true;
  }

  /**
   * Reject a request
   */
  reject(requestId: string, rejectedBy: string, reason: string): boolean {
    const request = this.pendingApprovals.get(requestId);
    if (!request || request.status !== 'pending') {
      return false;
    }

    request.status = 'rejected';
    request.approvedBy = rejectedBy;
    request.approvedAt = new Date();
    request.reason = reason;

    return true;
  }

  /**
   * Get approval request
   */
  getRequest(requestId: string): ApprovalRequest | undefined {
    return this.pendingApprovals.get(requestId);
  }

  /**
   * Get all pending approvals
   */
  getPendingApprovals(): ApprovalRequest[] {
    return Array.from(this.pendingApprovals.values())
      .filter(r => r.status === 'pending');
  }

  /**
   * Clean up old requests
   */
  cleanup(olderThanHours: number = 24): number {
    const cutoff = new Date();
    cutoff.setHours(cutoff.getHours() - olderThanHours);

    let removed = 0;

    for (const [id, request] of this.pendingApprovals.entries()) {
      if (request.requestedAt < cutoff && request.status !== 'pending') {
        this.pendingApprovals.delete(id);
        removed++;
      }
    }

    return removed;
  }

  /**
   * Generate unique request ID
   */
  private generateRequestId(): string {
    return `approval-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Format approval request for display
   */
  formatRequest(request: ApprovalRequest): string {
    const lines = [
      '═══════════════════════════════════════════════════',
      '          CODE EXECUTION APPROVAL REQUIRED          ',
      '═══════════════════════════════════════════════════',
      '',
      `Request ID: ${request.id}`,
      `Risk Level: ${request.riskAssessment.riskLevel.toUpperCase()}`,
      `Risk Score: ${request.riskAssessment.riskScore}/100`,
      '',
      'Risk Factors:',
      ...request.riskAssessment.factors.map(f =>
        `  • ${f.name}: ${f.description} (score: ${f.score})`
      ),
      '',
      'Security Issues:',
      ...request.validation.issues.slice(0, 5).map(i =>
        `  • [${i.severity}] ${i.description}`
      ),
      '',
      'Recommendation:',
      `  ${request.riskAssessment.recommendation}`,
      '',
      '═══════════════════════════════════════════════════',
      ''
    ];

    return lines.join('\n');
  }
}

/**
 * Approval request
 */
export interface ApprovalRequest {
  id: string;
  code: string;
  riskAssessment: RiskAssessment;
  validation: SecurityValidation;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
  reason?: string;
}
