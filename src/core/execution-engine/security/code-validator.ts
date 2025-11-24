import { SecurityValidation, SecurityIssue } from "../types";
import { promises as fs } from "fs";
import path from "path";

/**
 * Validates generated code for security issues
 * Pattern-based analysis to detect dangerous code patterns
 */
export class CodeValidator {
  private dangerousPatterns: RegExp[] = [];
  private suspiciousPatterns: RegExp[] = [];
  private initPromise: Promise<void> | null = null;
  private readonly INIT_TIMEOUT_MS = 5000;

  constructor() {
    // Patterns will be loaded lazily
  }

  /**
   * Validate code for security issues
   *
   * Performs pattern-based analysis to detect dangerous and suspicious code patterns.
   * On first call, patterns are loaded lazily with automatic fallback to hardcoded defaults.
   * Thread-safe: handles concurrent validation requests correctly during initialization.
   *
   * @param code - The code string to validate
   * @returns Promise resolving to validation result with security assessment
   *
   * @example
   * ```typescript
   * const validator = new CodeValidator();
   * const result = await validator.validate('eval("code")');
   * if (!result.isSecure) {
   *   console.log(`Risk score: ${result.riskScore}`);
   *   console.log(`Issues found: ${result.issues.length}`);
   * }
   * ```
   */
  async validate(code: string): Promise<SecurityValidation> {
    await this.ensureInitialized();

    const issues: SecurityIssue[] = [];

    // Check for dangerous patterns
    issues.push(...this.checkDangerousPatterns(code));

    // Check for suspicious patterns
    issues.push(...this.checkSuspiciousPatterns(code));

    // Calculate risk score
    const riskScore = this.calculateRiskScore(issues);

    return {
      isSecure: riskScore < 70,
      riskScore,
      issues,
      requiresApproval: riskScore >= 70,
    };
  }

  /**
   * Ensures patterns are initialized exactly once, even with concurrent calls
   * Uses Promise-based guard to prevent race conditions
   */
  private async ensureInitialized(): Promise<void> {
    // If already initialized or initializing, await the existing promise
    if (this.initPromise) {
      return this.initPromise;
    }

    // Create and store the initialization promise
    this.initPromise = this.initializeWithTimeout();

    try {
      await this.initPromise;
    } catch (error) {
      // Defensive programming: Currently initializeWithTimeout() never throws (catches all errors),
      // but this ensures we can retry initialization if future modifications change that behavior
      this.initPromise = null;
      throw error;
    }
  }

  /**
   * Initialize patterns with timeout protection
   */
  private async initializeWithTimeout(): Promise<void> {
    let timeoutId: NodeJS.Timeout;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(
          new Error(
            `Pattern loading timed out after ${this.INIT_TIMEOUT_MS}ms`,
          ),
        );
      }, this.INIT_TIMEOUT_MS);
    });

    try {
      await Promise.race([this.loadPatterns(), timeoutPromise]);
      // Clean up timeout on successful completion
      clearTimeout(timeoutId!);
    } catch (error) {
      // Clean up timeout on error/timeout
      clearTimeout(timeoutId!);

      // On timeout or error, ensure we have fallback patterns loaded
      if (this.dangerousPatterns.length === 0) {
        this.loadDefaultDangerousPatterns();
      }
      if (this.suspiciousPatterns.length === 0) {
        this.loadDefaultSuspiciousPatterns();
      }

      // Intentionally using console.warn for critical security initialization failures
      // This ensures visibility in all environments before logging infrastructure is ready
      console.warn("Pattern loading failed, using hardcoded patterns:", error);
    }
  }

  /**
   * Load patterns from JSON files or use defaults
   */
  private async loadPatterns(): Promise<void> {
    try {
      const dangerousPath = path.join(
        __dirname,
        "patterns/dangerous-patterns.json",
      );
      const _safePath = path.join(__dirname, "patterns/safe-patterns.json");

      // Try to load from files
      try {
        const dangerousData = await fs.readFile(dangerousPath, "utf-8");
        const dangerous = JSON.parse(dangerousData);
        this.dangerousPatterns = dangerous.patterns.map(
          (p: string) => new RegExp(p, "g"),
        );
      } catch {
        // Use hardcoded patterns
        this.loadDefaultDangerousPatterns();
      }

      // Load suspicious patterns
      this.loadDefaultSuspiciousPatterns();
    } catch (error) {
      // Fallback to hardcoded patterns
      this.loadDefaultDangerousPatterns();
      this.loadDefaultSuspiciousPatterns();
    }
  }

  /**
   * Load default dangerous patterns
   */
  private loadDefaultDangerousPatterns(): void {
    this.dangerousPatterns = [
      /eval\(/g, // eval() execution
      /Function\(/g, // Function constructor
      /require\(['"]child_process['"]\)/g, // Shell execution
      /exec\(/g, // Shell execution
      /execSync\(/g, // Synchronous shell execution
      /spawn\(/g, // Process spawning
      /\$\{[^}]*\}/g, // Template injection (risky)
      /document\.cookie/g, // Cookie stealing
      /localStorage/g, // Local storage access
      /sessionStorage/g, // Session storage access
      /\.innerHTML\s*=/g, // XSS via innerHTML
      /on(click|load|error|mouseover)\s*=/g, // Event handler injection
      /\.outerHTML\s*=/g, // DOM manipulation
      /dangerouslySetInnerHTML/g, // React dangerous HTML
      /__proto__/g, // Prototype pollution
      /constructor\[/g, // Constructor access
    ];
  }

  /**
   * Load default suspicious patterns
   */
  private loadDefaultSuspiciousPatterns(): void {
    this.suspiciousPatterns = [
      /require\(/g, // Dynamic require
      /import\(/g, // Dynamic import
      /fetch\(/g, // Network requests
      /XMLHttpRequest/g, // AJAX
      /WebSocket/g, // WebSocket
      /setTimeout/g, // Timers (potential DoS)
      /setInterval/g, // Intervals (potential DoS)
      /while\s*\(\s*true\s*\)/g, // Infinite loop
      /for\s*\([^)]*;;[^)]*\)/g, // Infinite loop
      /process\.env/g, // Environment access
      /fs\./g, // File system access
      /readFile/g, // File reading
      /writeFile/g, // File writing
      /\.exec\(/g, // Regex exec (potential ReDoS)
    ];
  }

  /**
   * Check for dangerous patterns
   */
  private checkDangerousPatterns(code: string): SecurityIssue[] {
    const issues: SecurityIssue[] = [];

    for (const pattern of this.dangerousPatterns) {
      pattern.lastIndex = 0; // Reset regex
      const matches = code.matchAll(pattern);

      for (const match of matches) {
        issues.push({
          severity: "critical",
          type: "dangerous_pattern",
          description: `Blocked pattern detected: ${pattern.source}`,
          line: this.getLineNumber(code, match.index || 0),
          suggestion: "Remove or replace with safe alternative",
        });
      }
    }

    return issues;
  }

  /**
   * Check for suspicious patterns
   */
  private checkSuspiciousPatterns(code: string): SecurityIssue[] {
    const issues: SecurityIssue[] = [];

    for (const pattern of this.suspiciousPatterns) {
      pattern.lastIndex = 0; // Reset regex
      const matches = code.matchAll(pattern);

      for (const match of matches) {
        issues.push({
          severity: "medium",
          type: "suspicious_pattern",
          description: `Suspicious pattern detected: ${pattern.source}`,
          line: this.getLineNumber(code, match.index || 0),
          suggestion: "Review for security implications",
        });
      }
    }

    return issues;
  }

  /**
   * Calculate risk score based on issues
   */
  private calculateRiskScore(issues: SecurityIssue[]): number {
    const severityScores = {
      low: 10,
      medium: 25,
      high: 50,
      critical: 100,
    };

    const totalScore = issues.reduce(
      (sum, issue) => sum + severityScores[issue.severity],
      0,
    );

    // Normalize to 0-100
    return Math.min(100, totalScore);
  }

  /**
   * Get line number from character index
   */
  private getLineNumber(code: string, index: number): number {
    return code.substring(0, index).split("\n").length;
  }
}
