import { SecurityValidation } from '../types';

/**
 * Assesses risk level of code execution
 */
export class RiskAssessor {
  /**
   * Assess risk of code execution
   */
  assess(code: string, validation: SecurityValidation): RiskAssessment {
    const factors: RiskFactor[] = [];

    // Check code complexity
    factors.push(this.assessComplexity(code));

    // Check for network access
    factors.push(this.assessNetworkAccess(code));

    // Check for file system access
    factors.push(this.assessFileSystemAccess(code));

    // Check for process/system access
    factors.push(this.assessSystemAccess(code));

    // Check security validation results
    factors.push(this.assessSecurityIssues(validation));

    // Calculate overall risk
    const overallRisk = this.calculateOverallRisk(factors);

    return {
      riskLevel: this.getRiskLevel(overallRisk),
      riskScore: overallRisk,
      factors,
      recommendation: this.getRecommendation(overallRisk),
      requiresApproval: overallRisk >= 70,
    };
  }

  /**
   * Assess code complexity
   */
  private assessComplexity(code: string): RiskFactor {
    const lines = code.split('\n').length;
    const cyclomaticComplexity = this.calculateCyclomaticComplexity(code);

    let score = 0;
    let description = 'Low complexity';

    if (lines > 500 || cyclomaticComplexity > 20) {
      score = 30;
      description = 'High complexity - difficult to review';
    } else if (lines > 200 || cyclomaticComplexity > 10) {
      score = 15;
      description = 'Medium complexity';
    } else {
      score = 5;
      description = 'Low complexity';
    }

    return {
      name: 'Code Complexity',
      score,
      description,
      details: `${lines} lines, cyclomatic complexity: ${cyclomaticComplexity}`,
    };
  }

  /**
   * Calculate cyclomatic complexity (simplified)
   */
  private calculateCyclomaticComplexity(code: string): number {
    // Count decision points
    const decisionPoints = [
      /\bif\b/g,
      /\belse\b/g,
      /\bfor\b/g,
      /\bwhile\b/g,
      /\bcase\b/g,
      /\bcatch\b/g,
      /\b\?\s*:/g, // Ternary operator
      /\b&&\b/g, // Logical AND
      /\b\|\|\b/g, // Logical OR
    ];

    let complexity = 1; // Base complexity

    for (const pattern of decisionPoints) {
      const matches = code.match(pattern);
      if (matches) {
        complexity += matches.length;
      }
    }

    return complexity;
  }

  /**
   * Assess network access risk
   */
  private assessNetworkAccess(code: string): RiskFactor {
    const networkPatterns = [
      /fetch\(/g,
      /XMLHttpRequest/g,
      /WebSocket/g,
      /axios\./g,
      /http\./g,
      /https\./g,
    ];

    let matches = 0;
    for (const pattern of networkPatterns) {
      const found = code.match(pattern);
      if (found) matches += found.length;
    }

    let score = 0;
    let description = 'No network access detected';

    if (matches > 5) {
      score = 40;
      description = 'Extensive network access';
    } else if (matches > 0) {
      score = 20;
      description = 'Limited network access';
    }

    return {
      name: 'Network Access',
      score,
      description,
      details: `${matches} network operations detected`,
    };
  }

  /**
   * Assess file system access risk
   */
  private assessFileSystemAccess(code: string): RiskFactor {
    const fsPatterns = [
      /fs\./g,
      /readFile/g,
      /writeFile/g,
      /unlink/g,
      /mkdir/g,
      /rmdir/g,
    ];

    let matches = 0;
    for (const pattern of fsPatterns) {
      const found = code.match(pattern);
      if (found) matches += found.length;
    }

    let score = 0;
    let description = 'No file system access';

    if (matches > 10) {
      score = 50;
      description = 'Extensive file system access';
    } else if (matches > 5) {
      score = 30;
      description = 'Moderate file system access';
    } else if (matches > 0) {
      score = 15;
      description = 'Limited file system access';
    }

    return {
      name: 'File System Access',
      score,
      description,
      details: `${matches} file system operations detected`,
    };
  }

  /**
   * Assess system/process access risk
   */
  private assessSystemAccess(code: string): RiskFactor {
    const systemPatterns = [
      /child_process/g,
      /exec\(/g,
      /spawn\(/g,
      /process\./g,
      /os\./g,
    ];

    let matches = 0;
    for (const pattern of systemPatterns) {
      const found = code.match(pattern);
      if (found) matches += found.length;
    }

    let score = 0;
    let description = 'No system access';

    if (matches > 0) {
      score = 60;
      description = 'System/process access detected - HIGH RISK';
    }

    return {
      name: 'System Access',
      score,
      description,
      details: `${matches} system operations detected`,
    };
  }

  /**
   * Assess security validation issues
   */
  private assessSecurityIssues(validation: SecurityValidation): RiskFactor {
    const criticalCount = validation.issues.filter(
      (i) => i.severity === 'critical'
    ).length;
    const highCount = validation.issues.filter(
      (i) => i.severity === 'high'
    ).length;

    return {
      name: 'Security Issues',
      score: validation.riskScore,
      description: `${validation.issues.length} security issues found`,
      details: `${criticalCount} critical, ${highCount} high severity`,
    };
  }

  /**
   * Calculate overall risk from factors
   */
  private calculateOverallRisk(factors: RiskFactor[]): number {
    // Use weighted average, with security issues having highest weight
    const weights = {
      'Security Issues': 0.4,
      'System Access': 0.25,
      'File System Access': 0.15,
      'Network Access': 0.1,
      'Code Complexity': 0.1,
    };

    let totalScore = 0;
    let totalWeight = 0;

    for (const factor of factors) {
      const weight = weights[factor.name as keyof typeof weights] || 0.1;
      totalScore += factor.score * weight;
      totalWeight += weight;
    }

    return Math.min(100, Math.round(totalScore / totalWeight));
  }

  /**
   * Get risk level from score
   */
  private getRiskLevel(score: number): 'low' | 'medium' | 'high' | 'critical' {
    if (score >= 80) return 'critical';
    if (score >= 60) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  }

  /**
   * Get recommendation based on risk
   */
  private getRecommendation(score: number): string {
    if (score >= 80) {
      return 'DO NOT EXECUTE - Critical risk detected. Manual review required.';
    }
    if (score >= 60) {
      return 'HIGH RISK - Requires approval before execution.';
    }
    if (score >= 40) {
      return 'MEDIUM RISK - Review recommended before execution.';
    }
    return 'LOW RISK - Safe to execute with standard safeguards.';
  }
}

/**
 * Risk assessment result
 */
export interface RiskAssessment {
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskScore: number;
  factors: RiskFactor[];
  recommendation: string;
  requiresApproval: boolean;
}

/**
 * Individual risk factor
 */
export interface RiskFactor {
  name: string;
  score: number;
  description: string;
  details: string;
}
