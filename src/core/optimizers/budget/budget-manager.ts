/**
 * Budget Manager
 * Dynamic token budget allocation and management
 *
 * Bug Fixes:
 * - Negative token validation
 * - Allocation percentage validation
 * - Rollback mechanism for corrections
 */

export interface BudgetAllocation {
  reserved: number; // Emergency buffer
  system: number; // System prompts
  dynamic: number; // MCPs + Skills
  working: number; // Conversation
}

export interface BudgetConfig {
  total: number;
  allocation: {
    reserved: number; // percentage (0-1)
    system: number;
    dynamic: number;
    working: number;
  };
}

export interface BudgetStatus {
  total: number;
  used: number;
  remaining: number;
  allocation: BudgetAllocation;
  percentage: number;
  status: 'healthy' | 'warning' | 'critical';
}

export interface UsageSnapshot {
  timestamp: number;
  totalUsage: number;
  categoryUsage: Map<string, number>;
}

/**
 * Token Budget Manager
 */
export class BudgetManager {
  private static readonly ALLOCATION_TOLERANCE = 0.001;
  private static readonly WARNING_THRESHOLD = 60;
  private static readonly CRITICAL_THRESHOLD = 80;

  private config: BudgetConfig;
  private currentUsage: number = 0;
  private categoryUsage: Map<string, number> = new Map();
  private usageHistory: UsageSnapshot[] = [];
  private maxHistorySize: number = 100;

  constructor(config?: Partial<BudgetConfig>) {
    this.config = {
      total: 200000,
      allocation: {
        reserved: 0.05, // 5%
        system: 0.05, // 5%
        dynamic: 0.15, // 15%
        working: 0.75 // 75%
      },
      ...config
    };

    this.validateConfig(this.config);
    this.initializeCategories();
  }

  /**
   * Validate budget configuration
   */
  private validateConfig(config: BudgetConfig): void {
    // Validate total is positive
    if (config.total <= 0) {
      throw new Error('Budget total must be positive');
    }

    // Validate allocation sums to 1.0 (within tolerance)
    const sum = Object.values(config.allocation).reduce((a, b) => a + b, 0);
    if (Math.abs(sum - 1.0) > BudgetManager.ALLOCATION_TOLERANCE) {
      throw new Error(
        `Allocation must sum to 1.0, got ${sum.toFixed(4)}. ` +
        `Individual allocations: ${JSON.stringify(config.allocation)}`
      );
    }

    // Validate all allocations are non-negative
    for (const [category, percentage] of Object.entries(config.allocation)) {
      if (percentage < 0) {
        throw new Error(`Allocation for ${category} cannot be negative: ${percentage}`);
      }
    }
  }

  /**
   * Initialize category tracking
   */
  private initializeCategories(): void {
    this.categoryUsage.set('reserved', 0);
    this.categoryUsage.set('system', 0);
    this.categoryUsage.set('dynamic', 0);
    this.categoryUsage.set('working', 0);
  }

  /**
   * Get current budget status
   */
  getStatus(): BudgetStatus {
    const allocation = this.calculateAllocation();
    const percentage = (this.currentUsage / this.config.total) * 100;

    let status: 'healthy' | 'warning' | 'critical' = 'healthy';
    if (percentage > BudgetManager.CRITICAL_THRESHOLD) status = 'critical';
    else if (percentage > BudgetManager.WARNING_THRESHOLD) status = 'warning';

    return {
      total: this.config.total,
      used: this.currentUsage,
      remaining: this.config.total - this.currentUsage,
      allocation,
      percentage,
      status
    };
  }

  /**
   * Calculate budget allocation in tokens
   */
  private calculateAllocation(): BudgetAllocation {
    return {
      reserved: Math.floor(this.config.total * this.config.allocation.reserved),
      system: Math.floor(this.config.total * this.config.allocation.system),
      dynamic: Math.floor(this.config.total * this.config.allocation.dynamic),
      working: Math.floor(this.config.total * this.config.allocation.working)
    };
  }

  /**
   * Track token usage with validation
   * BUG FIX: Added negative token validation
   */
  trackUsage(tokens: number, category: keyof BudgetAllocation): void {
    // Validate positive tokens
    if (tokens < 0) {
      throw new Error(`Token usage cannot be negative: ${tokens}`);
    }

    // Validate category exists
    if (!this.categoryUsage.has(category)) {
      throw new Error(`Invalid category: ${category}`);
    }

    // Create snapshot before modification (for rollback)
    this.createSnapshot();

    // Track usage
    this.currentUsage += tokens;
    const current = this.categoryUsage.get(category) || 0;
    this.categoryUsage.set(category, current + tokens);
  }

  /**
   * NEW FEATURE: Untrack token usage (for error correction/rollback)
   */
  untrackUsage(tokens: number, category: keyof BudgetAllocation): void {
    if (tokens < 0) {
      throw new Error(`Token usage cannot be negative: ${tokens}`);
    }

    const current = this.categoryUsage.get(category) || 0;
    if (current < tokens) {
      throw new Error(
        `Cannot untrack ${tokens} tokens from ${category}. Only ${current} tokens tracked.`
      );
    }

    this.createSnapshot();

    this.currentUsage -= tokens;
    this.categoryUsage.set(category, current - tokens);
  }

  /**
   * NEW FEATURE: Create a snapshot of current usage for rollback
   */
  private createSnapshot(): void {
    const snapshot: UsageSnapshot = {
      timestamp: Date.now(),
      totalUsage: this.currentUsage,
      categoryUsage: new Map(this.categoryUsage)
    };

    this.usageHistory.push(snapshot);

    // Trim history if too large
    if (this.usageHistory.length > this.maxHistorySize) {
      this.usageHistory.shift();
    }
  }

  /**
   * NEW FEATURE: Rollback to a previous state
   */
  rollback(stepsBack: number = 1): boolean {
    if (stepsBack < 1 || stepsBack > this.usageHistory.length) {
      return false;
    }

    // Get the snapshot
    const targetIndex = this.usageHistory.length - stepsBack;
    const snapshot = this.usageHistory[targetIndex];

    // Restore state
    this.currentUsage = snapshot.totalUsage;
    this.categoryUsage = new Map(snapshot.categoryUsage);

    // Remove rolled-back history
    this.usageHistory = this.usageHistory.slice(0, targetIndex);

    return true;
  }

  /**
   * NEW FEATURE: Get rollback history
   */
  getRollbackHistory(): UsageSnapshot[] {
    return [...this.usageHistory];
  }

  /**
   * Check if category has budget available
   */
  hasBudgetAvailable(category: keyof BudgetAllocation, tokens: number): boolean {
    const allocation = this.calculateAllocation();
    const currentCategoryUsage = this.categoryUsage.get(category) || 0;
    const categoryBudget = allocation[category];

    return currentCategoryUsage + tokens <= categoryBudget;
  }

  /**
   * Get remaining budget for category
   */
  getRemainingBudget(category: keyof BudgetAllocation): number {
    const allocation = this.calculateAllocation();
    const currentCategoryUsage = this.categoryUsage.get(category) || 0;
    const categoryBudget = allocation[category];

    return Math.max(0, categoryBudget - currentCategoryUsage);
  }

  /**
   * Reset budget tracking
   */
  reset(): void {
    this.currentUsage = 0;
    this.initializeCategories();
    this.usageHistory = [];
  }

  /**
   * Update budget configuration with validation
   * BUG FIX: Added allocation percentage validation
   */
  updateConfig(config: Partial<BudgetConfig>): void {
    const newConfig: BudgetConfig = {
      ...this.config,
      ...config,
      allocation: {
        ...this.config.allocation,
        ...(config.allocation || {})
      }
    };

    // Validate new configuration
    this.validateConfig(newConfig);

    this.config = newConfig;
  }

  /**
   * Get category usage breakdown
   */
  getCategoryBreakdown(): Record<string, { used: number; allocated: number; percentage: number }> {
    const allocation = this.calculateAllocation();
    const breakdown: Record<string, { used: number; allocated: number; percentage: number }> = {};

    for (const [category, used] of this.categoryUsage.entries()) {
      const allocated = allocation[category as keyof BudgetAllocation] || 0;
      const percentage = allocated > 0 ? (used / allocated) * 100 : 0;

      breakdown[category] = {
        used,
        allocated,
        percentage
      };
    }

    return breakdown;
  }

  /**
   * Allocate budget dynamically based on usage patterns
   */
  reallocate(priorities: Partial<Record<keyof BudgetAllocation, number>>): void {
    // Normalize priorities
    const total = Object.values(priorities).reduce((sum, val) => sum + val, 0);

    if (total === 0) {
      throw new Error('Cannot reallocate with zero total priority');
    }

    const newAllocation = { ...this.config.allocation };

    for (const [category, priority] of Object.entries(priorities) as Array<
      [keyof BudgetAllocation, number]
    >) {
      newAllocation[category] = priority / total;
    }

    // Validate before applying
    const testConfig = { ...this.config, allocation: newAllocation };
    this.validateConfig(testConfig);

    this.config.allocation = newAllocation;
  }

  /**
   * Get budget recommendations
   */
  getRecommendations(): string[] {
    const status = this.getStatus();
    const breakdown = this.getCategoryBreakdown();
    const recommendations: string[] = [];

    // Overall usage recommendations
    if (status.percentage > BudgetManager.CRITICAL_THRESHOLD) {
      recommendations.push(
        `Critical: Token usage above ${BudgetManager.CRITICAL_THRESHOLD}%. ` +
        'Consider optimizing prompts or increasing budget.'
      );
    } else if (status.percentage > BudgetManager.WARNING_THRESHOLD) {
      recommendations.push(
        `Warning: Token usage above ${BudgetManager.WARNING_THRESHOLD}%. ` +
        'Monitor closely to avoid hitting limits.'
      );
    }

    // Category-specific recommendations
    for (const [category, stats] of Object.entries(breakdown)) {
      if (stats.percentage > 90) {
        recommendations.push(
          `${category} category is at ${stats.percentage.toFixed(1)}% capacity. ` +
          'Consider reallocating budget.'
        );
      }
    }

    // Reallocation suggestions
    const underutilized = Object.entries(breakdown).filter(([_, stats]) => stats.percentage < 50);
    const overutilized = Object.entries(breakdown).filter(([_, stats]) => stats.percentage > 80);

    if (underutilized.length > 0 && overutilized.length > 0) {
      recommendations.push(
        `Consider reallocating budget from ${underutilized.map(([c]) => c).join(', ')} ` +
        `to ${overutilized.map(([c]) => c).join(', ')}`
      );
    }

    return recommendations;
  }

  /**
   * Export budget configuration
   */
  export(): BudgetConfig {
    return { ...this.config };
  }
}

/**
 * Default budget manager instance
 */
export const budgetManager = new BudgetManager();

/**
 * Factory function for creating new instances (useful for testing)
 */
export function createBudgetManager(config?: Partial<BudgetConfig>): BudgetManager {
  return new BudgetManager(config);
}
