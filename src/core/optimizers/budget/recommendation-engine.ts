/**
 * Recommendation Engine
 * Provides optimization suggestions based on usage patterns
 */

import { BudgetManager } from './budget-manager';
import { UsageMonitor } from './usage-monitor';

export interface Recommendation {
  type: 'optimization' | 'allocation' | 'workflow' | 'warning';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  estimatedSavings?: number;
  actionItems?: string[];
}

export interface OptimizationOpportunity {
  area: string;
  currentUsage: number;
  potentialSavings: number;
  suggestions: string[];
}

/**
 * Recommendation Engine for Token Optimization
 */
export class RecommendationEngine {
  constructor(
    private budgetManager: BudgetManager,
    private usageMonitor: UsageMonitor
  ) {}

  /**
   * Get all recommendations
   */
  getRecommendations(): Recommendation[] {
    const recommendations: Recommendation[] = [];

    recommendations.push(...this.getBudgetRecommendations());
    recommendations.push(...this.getUsageRecommendations());
    recommendations.push(...this.getOptimizationRecommendations());
    recommendations.push(...this.getWorkflowRecommendations());

    return recommendations.sort(
      (a, b) => this.priorityScore(b) - this.priorityScore(a)
    );
  }

  /**
   * Get budget-related recommendations
   */
  private getBudgetRecommendations(): Recommendation[] {
    const recommendations: Recommendation[] = [];
    const status = this.budgetManager.getStatus();

    // Critical usage warning
    if (status.percentage > 80) {
      recommendations.push({
        type: 'warning',
        priority: 'critical',
        title: 'Critical Token Usage',
        description: `Token usage is at ${status.percentage.toFixed(1)}%. You're approaching the budget limit.`,
        actionItems: [
          'Review and optimize current operations',
          'Consider increasing budget allocation',
          'Enable aggressive compression',
        ],
      });
    }

    // High usage warning
    if (status.percentage > 60 && status.percentage <= 80) {
      recommendations.push({
        type: 'warning',
        priority: 'high',
        title: 'High Token Usage',
        description: `Token usage is at ${status.percentage.toFixed(1)}%. Monitor closely to avoid hitting limits.`,
        actionItems: [
          'Review token-heavy operations',
          'Consider enabling symbol compression',
          'Optimize prompt templates',
        ],
      });
    }

    // Category-specific recommendations
    const breakdown = this.budgetManager.getCategoryBreakdown();

    for (const [category, stats] of Object.entries(breakdown)) {
      if (stats.percentage > 90) {
        recommendations.push({
          type: 'allocation',
          priority: 'high',
          title: `${category} Budget Exhausted`,
          description: `The ${category} category is at ${stats.percentage.toFixed(1)}% capacity.`,
          actionItems: [
            `Optimize ${category} operations`,
            `Consider reallocating budget to ${category}`,
            'Review usage patterns',
          ],
        });
      }
    }

    return recommendations;
  }

  /**
   * Get usage-based recommendations
   */
  private getUsageRecommendations(): Recommendation[] {
    const recommendations: Recommendation[] = [];
    const stats = this.usageMonitor.getStats();
    const topConsumers = this.usageMonitor.getTopConsumers(3);

    // High average per operation
    if (stats.averagePerOperation > 5000) {
      recommendations.push({
        type: 'optimization',
        priority: 'medium',
        title: 'High Average Token Usage',
        description: `Operations are using ${stats.averagePerOperation.toFixed(0)} tokens on average.`,
        estimatedSavings: Math.floor(stats.averagePerOperation * 0.3),
        actionItems: [
          'Enable progressive skill loading',
          'Use symbol compression',
          'Optimize prompt templates',
        ],
      });
    }

    // Top consumer recommendations
    for (const consumer of topConsumers) {
      if (consumer.percentage > 40) {
        recommendations.push({
          type: 'optimization',
          priority: 'medium',
          title: `Optimize ${consumer.category}`,
          description: `${consumer.category} is consuming ${consumer.percentage.toFixed(1)}% of total tokens.`,
          estimatedSavings: Math.floor(consumer.tokens * 0.2),
          actionItems: [
            `Review ${consumer.category} usage patterns`,
            'Consider caching frequently used data',
            'Implement incremental loading',
          ],
        });
      }
    }

    return recommendations;
  }

  /**
   * Get optimization recommendations
   */
  private getOptimizationRecommendations(): Recommendation[] {
    const recommendations: Recommendation[] = [];
    const opportunities = this.identifyOptimizationOpportunities();

    for (const opportunity of opportunities) {
      if (opportunity.potentialSavings > 1000) {
        recommendations.push({
          type: 'optimization',
          priority: this.calculatePriority(opportunity.potentialSavings),
          title: `Optimize ${opportunity.area}`,
          description: `Potential savings of ${opportunity.potentialSavings.toLocaleString()} tokens in ${opportunity.area}.`,
          estimatedSavings: opportunity.potentialSavings,
          actionItems: opportunity.suggestions,
        });
      }
    }

    return recommendations;
  }

  /**
   * Get workflow recommendations
   */
  private getWorkflowRecommendations(): Recommendation[] {
    const recommendations: Recommendation[] = [];
    const stats = this.usageMonitor.getStats();

    // Recommend MCP code execution
    if (
      stats.byCategory['code_execution'] === undefined ||
      stats.byCategory['code_execution'] === 0
    ) {
      recommendations.push({
        type: 'workflow',
        priority: 'high',
        title: 'Enable MCP Code Execution',
        description:
          'MCP code execution can reduce token usage by up to 98.7%.',
        estimatedSavings: Math.floor(stats.total * 0.9),
        actionItems: [
          'Configure MCP code execution',
          'Enable automatic code execution for suitable tasks',
          'Review security settings',
        ],
      });
    }

    // Recommend progressive skill loading
    if (stats.byCategory['skills'] && stats.byCategory['skills'] > 10000) {
      recommendations.push({
        type: 'workflow',
        priority: 'medium',
        title: 'Use Progressive Skill Loading',
        description:
          'Progressive skill loading can reduce skill-related token usage by 95%.',
        estimatedSavings: Math.floor(stats.byCategory['skills'] * 0.95),
        actionItems: [
          'Enable progressive skill loading',
          'Configure skill activation triggers',
          'Optimize skill templates',
        ],
      });
    }

    return recommendations;
  }

  /**
   * Identify optimization opportunities
   */
  private identifyOptimizationOpportunities(): OptimizationOpportunity[] {
    const opportunities: OptimizationOpportunity[] = [];
    const stats = this.usageMonitor.getStats();

    for (const [category, tokens] of Object.entries(stats.byCategory)) {
      // Estimate potential savings based on category
      let savingsRate = 0.3; // Default 30%

      if (category === 'skills') savingsRate = 0.95;
      else if (category === 'code_execution') savingsRate = 0.98;
      else if (category === 'prompts') savingsRate = 0.4;

      const potentialSavings = Math.floor(tokens * savingsRate);

      opportunities.push({
        area: category,
        currentUsage: tokens,
        potentialSavings,
        suggestions: this.getSuggestionsForCategory(category),
      });
    }

    return opportunities.sort(
      (a, b) => b.potentialSavings - a.potentialSavings
    );
  }

  /**
   * Get suggestions for a specific category
   */
  private getSuggestionsForCategory(category: string): string[] {
    const suggestions: Record<string, string[]> = {
      skills: [
        'Enable progressive skill loading',
        'Use skill activation triggers',
        'Cache skill templates',
      ],
      code_execution: [
        'Enable MCP code execution',
        'Optimize execution workflows',
        'Use batch execution',
      ],
      prompts: [
        'Use symbol compression',
        'Apply abbreviations',
        'Optimize template structure',
      ],
      system: [
        'Minimize system prompt length',
        'Use hierarchical disclosure',
        'Cache system prompts',
      ],
      working: [
        'Enable conversation summarization',
        'Use progressive disclosure',
        'Implement message compression',
      ],
    };

    return (
      suggestions[category] || [
        'Review usage patterns',
        'Enable compression',
        'Optimize workflows',
      ]
    );
  }

  /**
   * Calculate priority based on savings
   */
  private calculatePriority(
    savings: number
  ): 'low' | 'medium' | 'high' | 'critical' {
    if (savings > 10000) return 'critical';
    if (savings > 5000) return 'high';
    if (savings > 1000) return 'medium';
    return 'low';
  }

  /**
   * Convert priority to numeric score
   */
  private priorityScore(rec: Recommendation): number {
    const scores = { critical: 4, high: 3, medium: 2, low: 1 };
    return scores[rec.priority];
  }

  /**
   * Generate optimization report
   */
  generateReport(): string {
    const recommendations = this.getRecommendations();
    const status = this.budgetManager.getStatus();

    let report = '# Token Optimization Report\n\n';

    report += '## Current Status\n\n';
    report += `- **Total Budget:** ${status.total.toLocaleString()} tokens\n`;
    report += `- **Used:** ${status.used.toLocaleString()} tokens (${status.percentage.toFixed(1)}%)\n`;
    report += `- **Remaining:** ${status.remaining.toLocaleString()} tokens\n`;
    report += `- **Status:** ${status.status.toUpperCase()}\n\n`;

    if (recommendations.length === 0) {
      report +=
        '## Recommendations\n\nNo recommendations at this time. Usage is optimal.\n';
      return report;
    }

    report += '## Recommendations\n\n';

    // Group by priority
    const critical = recommendations.filter((r) => r.priority === 'critical');
    const high = recommendations.filter((r) => r.priority === 'high');
    const medium = recommendations.filter((r) => r.priority === 'medium');
    const low = recommendations.filter((r) => r.priority === 'low');

    if (critical.length > 0) {
      report += '### Critical Priority\n\n';
      report += this.formatRecommendations(critical);
    }

    if (high.length > 0) {
      report += '### High Priority\n\n';
      report += this.formatRecommendations(high);
    }

    if (medium.length > 0) {
      report += '### Medium Priority\n\n';
      report += this.formatRecommendations(medium);
    }

    if (low.length > 0) {
      report += '### Low Priority\n\n';
      report += this.formatRecommendations(low);
    }

    // Total potential savings
    const totalSavings = recommendations.reduce(
      (sum, r) => sum + (r.estimatedSavings || 0),
      0
    );

    if (totalSavings > 0) {
      report += `\n## Potential Total Savings\n\n`;
      report += `**${totalSavings.toLocaleString()} tokens** (~${((totalSavings / status.total) * 100).toFixed(1)}% of budget)\n`;
    }

    return report;
  }

  /**
   * Format recommendations for display
   */
  private formatRecommendations(recommendations: Recommendation[]): string {
    let output = '';

    for (const rec of recommendations) {
      output += `#### ${rec.title}\n\n`;
      output += `${rec.description}\n\n`;

      if (rec.estimatedSavings) {
        output += `**Estimated Savings:** ${rec.estimatedSavings.toLocaleString()} tokens\n\n`;
      }

      if (rec.actionItems && rec.actionItems.length > 0) {
        output += '**Action Items:**\n\n';
        for (const item of rec.actionItems) {
          output += `- ${item}\n`;
        }
        output += '\n';
      }
    }

    return output;
  }
}
