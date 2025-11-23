/**
 * Usage Monitor
 * Real-time token usage tracking and analysis
 */

export interface UsageEvent {
  timestamp: number;
  tokens: number;
  category: string;
  operation: string;
  metadata?: Record<string, any>;
}

export interface UsageStats {
  total: number;
  byCategory: Record<string, number>;
  byOperation: Record<string, number>;
  timeRange: { start: number; end: number };
  averagePerOperation: number;
  peakUsage: number;
}

export interface UsageTrend {
  period: string;
  tokens: number;
  operations: number;
  avgTokensPerOp: number;
}

/**
 * Real-time Usage Monitor
 */
export class UsageMonitor {
  private events: UsageEvent[] = [];
  private maxEvents: number = 1000;
  private listeners: Array<(event: UsageEvent) => void> = [];

  /**
   * Record a usage event
   */
  record(tokens: number, category: string, operation: string, metadata?: Record<string, any>): void {
    const event: UsageEvent = {
      timestamp: Date.now(),
      tokens,
      category,
      operation,
      metadata
    };

    this.events.push(event);

    // Trim old events if exceeding max
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Notify listeners
    this.notifyListeners(event);
  }

  /**
   * Get usage statistics
   */
  getStats(since?: number): UsageStats {
    const relevantEvents = since
      ? this.events.filter(e => e.timestamp >= since)
      : this.events;

    const total = relevantEvents.reduce((sum, e) => sum + e.tokens, 0);

    const byCategory: Record<string, number> = {};
    const byOperation: Record<string, number> = {};

    for (const event of relevantEvents) {
      byCategory[event.category] = (byCategory[event.category] || 0) + event.tokens;
      byOperation[event.operation] = (byOperation[event.operation] || 0) + event.tokens;
    }

    const timeRange = {
      start: relevantEvents[0]?.timestamp || Date.now(),
      end: relevantEvents[relevantEvents.length - 1]?.timestamp || Date.now()
    };

    const averagePerOperation = relevantEvents.length > 0 ? total / relevantEvents.length : 0;
    const peakUsage = Math.max(...relevantEvents.map(e => e.tokens), 0);

    return {
      total,
      byCategory,
      byOperation,
      timeRange,
      averagePerOperation,
      peakUsage
    };
  }

  /**
   * Get usage trends over time
   */
  getTrends(intervalMs: number = 60000): UsageTrend[] {
    if (this.events.length === 0) return [];

    const trends: UsageTrend[] = [];
    const startTime = this.events[0].timestamp;
    const endTime = this.events[this.events.length - 1].timestamp;

    let currentTime = startTime;

    while (currentTime < endTime) {
      const intervalEnd = currentTime + intervalMs;
      const intervalEvents = this.events.filter(
        e => e.timestamp >= currentTime && e.timestamp < intervalEnd
      );

      const tokens = intervalEvents.reduce((sum, e) => sum + e.tokens, 0);
      const operations = intervalEvents.length;
      const avgTokensPerOp = operations > 0 ? tokens / operations : 0;

      trends.push({
        period: new Date(currentTime).toISOString(),
        tokens,
        operations,
        avgTokensPerOp
      });

      currentTime = intervalEnd;
    }

    return trends;
  }

  /**
   * Get top consumers by category
   */
  getTopConsumers(limit: number = 5): Array<{ category: string; tokens: number; percentage: number }> {
    const stats = this.getStats();
    const total = stats.total;

    const consumers = Object.entries(stats.byCategory)
      .map(([category, tokens]) => ({
        category,
        tokens,
        percentage: (tokens / total) * 100
      }))
      .sort((a, b) => b.tokens - a.tokens)
      .slice(0, limit);

    return consumers;
  }

  /**
   * Get recent events
   */
  getRecentEvents(count: number = 10): UsageEvent[] {
    return this.events.slice(-count);
  }

  /**
   * Clear all events
   */
  clear(): void {
    this.events = [];
  }

  /**
   * Subscribe to usage events
   */
  subscribe(listener: (event: UsageEvent) => void): () => void {
    this.listeners.push(listener);

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Notify all listeners
   */
  private notifyListeners(event: UsageEvent): void {
    for (const listener of this.listeners) {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in usage monitor listener:', error);
      }
    }
  }

  /**
   * Get usage report
   */
  getReport(since?: number): string {
    const stats = this.getStats(since);
    const topConsumers = this.getTopConsumers(5);

    let report = '## Token Usage Report\n\n';

    report += `**Total Tokens Used:** ${stats.total.toLocaleString()}\n`;
    report += `**Time Range:** ${new Date(stats.timeRange.start).toLocaleString()} - ${new Date(stats.timeRange.end).toLocaleString()}\n`;
    report += `**Average per Operation:** ${stats.averagePerOperation.toFixed(2)}\n`;
    report += `**Peak Usage:** ${stats.peakUsage.toLocaleString()}\n\n`;

    report += '### Top Consumers\n\n';
    for (const consumer of topConsumers) {
      report += `- **${consumer.category}**: ${consumer.tokens.toLocaleString()} tokens (${consumer.percentage.toFixed(1)}%)\n`;
    }

    report += '\n### By Category\n\n';
    for (const [category, tokens] of Object.entries(stats.byCategory)) {
      report += `- ${category}: ${tokens.toLocaleString()}\n`;
    }

    return report;
  }

  /**
   * Export events for analysis
   */
  export(): UsageEvent[] {
    return [...this.events];
  }

  /**
   * Set maximum events to store
   */
  setMaxEvents(max: number): void {
    this.maxEvents = max;

    if (this.events.length > max) {
      this.events = this.events.slice(-max);
    }
  }

  /**
   * Calculate savings compared to baseline
   */
  calculateSavings(baselineTokens: number): {
    actual: number;
    baseline: number;
    saved: number;
    percentSaved: number;
  } {
    const actual = this.getStats().total;
    const saved = baselineTokens - actual;
    const percentSaved = (saved / baselineTokens) * 100;

    return {
      actual,
      baseline: baselineTokens,
      saved,
      percentSaved
    };
  }
}

/**
 * Default usage monitor instance
 */
export const usageMonitor = new UsageMonitor();
