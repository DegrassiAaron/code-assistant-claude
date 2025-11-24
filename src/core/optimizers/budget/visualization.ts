/**
 * Visualization
 * ASCII dashboard for token budget and usage
 */

import { BudgetManager, BudgetStatus } from "./budget-manager";
import { UsageMonitor, UsageStats } from "./usage-monitor";

export interface VisualizationOptions {
  width: number;
  showLegend: boolean;
  colorize: boolean;
}

/**
 * ASCII Visualization for Token Budget
 */
export class Visualization {
  private defaultOptions: VisualizationOptions = {
    width: 50,
    showLegend: true,
    colorize: false,
  };

  constructor(
    private budgetManager: BudgetManager,
    private usageMonitor: UsageMonitor,
  ) {}

  /**
   * Render complete dashboard
   */
  renderDashboard(options?: Partial<VisualizationOptions>): string {
    const opts = { ...this.defaultOptions, ...options };
    let dashboard = "";

    dashboard += this.renderHeader();
    dashboard += "\n";
    dashboard += this.renderBudgetAllocation();
    dashboard += "\n";
    dashboard += this.renderUsageBar(opts.width);
    dashboard += "\n";
    dashboard += this.renderCategoryBreakdown();
    dashboard += "\n";
    dashboard += this.renderRecentActivity();

    return dashboard;
  }

  /**
   * Render header
   */
  private renderHeader(): string {
    const status = this.budgetManager.getStatus();

    let header =
      "╔════════════════════════════════════════════════════════════╗\n";
    header +=
      "║           📊 TOKEN BUDGET DASHBOARD                        ║\n";
    header +=
      "╚════════════════════════════════════════════════════════════╝\n";

    return header;
  }

  /**
   * Render budget allocation
   */
  renderBudgetAllocation(): string {
    const status = this.budgetManager.getStatus();
    const allocation = status.allocation;

    let output =
      "┌─ Budget Allocation ─────────────────────────────────────┐\n";
    output += `│ Total Budget: ${status.total.toLocaleString().padEnd(43)} │\n`;
    output += "├─────────────────────────────────────────────────────────┤\n";

    output += `│ 🔒 Reserved (5%):    ${this.formatTokens(allocation.reserved).padEnd(30)} │\n`;
    output += `│ 🔧 System (5%):      ${this.formatTokens(allocation.system).padEnd(30)} │\n`;
    output += `│ 🔄 Dynamic (15%):    ${this.formatTokens(allocation.dynamic).padEnd(30)} │\n`;
    output += `│    ├─ MCPs:          ${this.formatTokens(Math.floor(allocation.dynamic / 2)).padEnd(30)} │\n`;
    output += `│    └─ Skills:        ${this.formatTokens(Math.floor(allocation.dynamic / 2)).padEnd(30)} │\n`;
    output += `│ 💬 Working (75%):    ${this.formatTokens(allocation.working).padEnd(30)} │\n`;

    output += "└─────────────────────────────────────────────────────────┘\n";

    return output;
  }

  /**
   * Render usage bar
   */
  renderUsageBar(width: number = 50): string {
    const status = this.budgetManager.getStatus();
    const percentage = status.percentage;
    const filled = Math.floor((percentage / 100) * width);
    const empty = width - filled;

    const statusEmoji = this.getStatusEmoji(status.status);

    let output =
      "┌─ Current Usage ─────────────────────────────────────────┐\n";
    output += `│ ${statusEmoji} Status: ${status.status.toUpperCase().padEnd(45)} │\n`;
    output += "├─────────────────────────────────────────────────────────┤\n";

    output += `│ Used: ${status.used.toLocaleString()} / ${status.total.toLocaleString()} tokens (${percentage.toFixed(1)}%)${" ".repeat(Math.max(0, 21 - status.used.toString().length))} │\n`;

    const bar = "█".repeat(filled) + "░".repeat(empty);
    output += `│ [${bar}] │\n`;

    output += `│ Remaining: ${status.remaining.toLocaleString()} tokens${" ".repeat(Math.max(0, 37 - status.remaining.toString().length))} │\n`;

    output += "└─────────────────────────────────────────────────────────┘\n";

    return output;
  }

  /**
   * Render category breakdown
   */
  renderCategoryBreakdown(): string {
    const breakdown = this.budgetManager.getCategoryBreakdown();

    let output =
      "┌─ Category Breakdown ────────────────────────────────────┐\n";

    for (const [category, stats] of Object.entries(breakdown)) {
      const bar = this.createMiniBar(stats.percentage, 20);
      const pct = stats.percentage.toFixed(1);

      output += `│ ${this.getCategoryEmoji(category)} ${category.padEnd(12)} ${bar} ${pct.padStart(5)}% │\n`;
      output += `│    ${stats.used.toLocaleString().padStart(8)} / ${stats.allocated.toLocaleString().padEnd(8)} tokens${" ".repeat(16)} │\n`;
    }

    output += "└─────────────────────────────────────────────────────────┘\n";

    return output;
  }

  /**
   * Render recent activity
   */
  renderRecentActivity(): string {
    const recentEvents = this.usageMonitor.getRecentEvents(5);

    let output =
      "┌─ Recent Activity ───────────────────────────────────────┐\n";

    if (recentEvents.length === 0) {
      output += "│ No recent activity                                      │\n";
    } else {
      for (const event of recentEvents.reverse()) {
        const time = new Date(event.timestamp).toLocaleTimeString();
        const tokens = event.tokens.toString().padStart(6);
        const operation = event.operation.substring(0, 20).padEnd(20);

        output += `│ ${time} │ ${tokens} │ ${operation} │\n`;
      }
    }

    output += "└─────────────────────────────────────────────────────────┘\n";

    return output;
  }

  /**
   * Create mini progress bar
   */
  private createMiniBar(percentage: number, width: number): string {
    const filled = Math.floor((percentage / 100) * width);
    const empty = width - filled;

    return "█".repeat(filled) + "░".repeat(empty);
  }

  /**
   * Get status emoji
   */
  private getStatusEmoji(status: "healthy" | "warning" | "critical"): string {
    const emojis = {
      healthy: "🟢",
      warning: "🟡",
      critical: "🔴",
    };

    return emojis[status];
  }

  /**
   * Get category emoji
   */
  private getCategoryEmoji(category: string): string {
    const emojis: Record<string, string> = {
      reserved: "🔒",
      system: "🔧",
      dynamic: "🔄",
      working: "💬",
      skills: "🎯",
      mcps: "🔌",
      code_execution: "⚙️",
    };

    return emojis[category] || "📦";
  }

  /**
   * Format tokens with commas
   */
  private formatTokens(tokens: number): string {
    return `${tokens.toLocaleString()} tokens`;
  }

  /**
   * Render simple usage chart
   */
  renderUsageChart(intervalMs: number = 60000): string {
    const trends = this.usageMonitor.getTrends(intervalMs);

    if (trends.length === 0) {
      return "No usage data available\n";
    }

    let output =
      "┌─ Usage Trend ───────────────────────────────────────────┐\n";

    const maxTokens = Math.max(...trends.map((t) => t.tokens), 1);

    for (const trend of trends.slice(-10)) {
      const time = new Date(trend.period).toLocaleTimeString();
      const barLength = Math.floor((trend.tokens / maxTokens) * 30);
      const bar = "▓".repeat(barLength);

      output += `│ ${time} │ ${bar.padEnd(30)} ${trend.tokens.toString().padStart(6)} │\n`;
    }

    output += "└─────────────────────────────────────────────────────────┘\n";

    return output;
  }

  /**
   * Render compact summary
   */
  renderCompactSummary(): string {
    const status = this.budgetManager.getStatus();
    const stats = this.usageMonitor.getStats();

    const emoji = this.getStatusEmoji(status.status);

    return `${emoji} ${status.used.toLocaleString()}/${status.total.toLocaleString()} tokens (${status.percentage.toFixed(1)}%) | Ops: ${stats.byOperation ? Object.keys(stats.byOperation).length : 0}`;
  }

  /**
   * Render savings report
   */
  renderSavingsReport(baselineTokens: number): string {
    const savings = this.usageMonitor.calculateSavings(baselineTokens);

    let output =
      "┌─ Token Savings Report ──────────────────────────────────┐\n";
    output += `│ Baseline:           ${savings.baseline.toLocaleString().padEnd(35)} │\n`;
    output += `│ Actual Usage:       ${savings.actual.toLocaleString().padEnd(35)} │\n`;
    output += `│ Tokens Saved:       ${savings.saved.toLocaleString().padEnd(35)} │\n`;
    output += `│ Reduction:          ${savings.percentSaved.toFixed(1)}%${" ".repeat(32)} │\n`;

    const bar = this.createMiniBar(savings.percentSaved, 40);
    output += `│ [${bar}] │\n`;

    output += "└─────────────────────────────────────────────────────────┘\n";

    return output;
  }
}
