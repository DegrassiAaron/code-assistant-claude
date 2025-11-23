/**
 * Budget Manager
 * Dynamic token budget allocation and management
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

/**
 * Token Budget Manager
 */
export class BudgetManager {
  private config: BudgetConfig;
  private currentUsage: number = 0;
  private categoryUsage: Map<string, number> = new Map();

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

    this.initializeCategories();
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
    if (percentage > 80) status = 'critical';
    else if (percentage > 60) status = 'warning';

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
   * Track token usage
   */
  trackUsage(tokens: number, category: keyof BudgetAllocation): void {
    this.currentUsage += tokens;
    const current = this.categoryUsage.get(category) || 0;
    this.categoryUsage.set(category, current + tokens);
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
  }

  /**
   * Update budget configuration
   */
  updateConfig(config: Partial<BudgetConfig>): void {
    this.config = {
      ...this.config,
      ...config,
      allocation: {
        ...this.config.allocation,
        ...(config.allocation || {})
      }
    };
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

    if (total === 0) return;

    const newAllocation = { ...this.config.allocation };

    for (const [category, priority] of Object.entries(priorities) as Array<
      [keyof BudgetAllocation, number]
    >) {
      newAllocation[category] = priority / total;
    }

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
    if (status.percentage > 80) {
      recommendations.push('Critical: Token usage above 80%. Consider optimizing prompts or increasing budget.');
    } else if (status.percentage > 60) {
      recommendations.push('Warning: Token usage above 60%. Monitor closely to avoid hitting limits.');
    }

    // Category-specific recommendations
    for (const [category, stats] of Object.entries(breakdown)) {
      if (stats.percentage > 90) {
        recommendations.push(
          `${category} category is at ${stats.percentage.toFixed(1)}% capacity. Consider reallocating budget.`
        );
      }
    }

    // Reallocation suggestions
    const underutilized = Object.entries(breakdown).filter(([_, stats]) => stats.percentage < 50);
    const overutilized = Object.entries(breakdown).filter(([_, stats]) => stats.percentage > 80);

    if (underutilized.length > 0 && overutilized.length > 0) {
      recommendations.push(
        `Consider reallocating budget from ${underutilized.map(([c]) => c).join(', ')} to ${overutilized.map(([c]) => c).join(', ')}`
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
