import { TokenUsageEntry, LoadingStage } from "./types";

/**
 * Tracks token consumption for skills
 *
 * Provides real-time monitoring of token usage to:
 * - Measure progressive loading effectiveness
 * - Identify token-heavy skills
 * - Generate usage reports
 */
export class TokenTracker {
  private entries: TokenUsageEntry[] = [];
  private systemUsage: Map<string, number> = new Map();

  /**
   * Track skill token usage
   */
  trackSkillUsage(
    skillName: string,
    stage: LoadingStage,
    tokens: number,
  ): void {
    this.entries.push({
      skillName,
      stage,
      tokens,
      timestamp: new Date(),
    });
  }

  /**
   * Track system-level usage (metadata, etc.)
   */
  trackSystemUsage(category: string, tokens: number): void {
    this.systemUsage.set(category, tokens);
  }

  /**
   * Track skill unload (negative tokens)
   */
  trackSkillUnload(skillName: string, tokens: number): void {
    this.entries.push({
      skillName,
      stage: LoadingStage.METADATA_ONLY,
      tokens: -tokens,
      timestamp: new Date(),
    });
  }

  /**
   * Get total tokens consumed
   */
  getTotalTokens(): number {
    const skillTokens = this.entries.reduce(
      (sum, entry) => sum + entry.tokens,
      0,
    );
    const systemTokens = Array.from(this.systemUsage.values()).reduce(
      (sum, val) => sum + val,
      0,
    );
    return skillTokens + systemTokens;
  }

  /**
   * Get usage by skill
   */
  getUsageBySkill(): Map<string, number> {
    const usage = new Map<string, number>();

    for (const entry of this.entries) {
      const current = usage.get(entry.skillName) || 0;
      usage.set(entry.skillName, current + entry.tokens);
    }

    return usage;
  }

  /**
   * Get usage by stage
   */
  getUsageByStage(): Map<LoadingStage, number> {
    const usage = new Map<LoadingStage, number>();

    for (const entry of this.entries) {
      if (entry.tokens > 0) {
        // Only count positive tokens
        const current = usage.get(entry.stage) || 0;
        usage.set(entry.stage, current + entry.tokens);
      }
    }

    return usage;
  }

  /**
   * Get usage report
   */
  getReport(): string {
    const total = this.getTotalTokens();
    const bySkill = this.getUsageBySkill();
    const byStage = this.getUsageByStage();

    let report = `📊 Token Usage Report\n`;
    report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    report += `Total: ${total.toLocaleString()} tokens\n\n`;

    // System usage
    if (this.systemUsage.size > 0) {
      report += `System:\n`;
      for (const [category, tokens] of this.systemUsage) {
        report += `  ${category}: ${tokens.toLocaleString()} tokens\n`;
      }
      report += `\n`;
    }

    // Stage usage
    if (byStage.size > 0) {
      report += `By Stage:\n`;
      for (const [stage, tokens] of byStage) {
        report += `  ${stage}: ${tokens.toLocaleString()} tokens\n`;
      }
      report += `\n`;
    }

    // Skill usage
    if (bySkill.size > 0) {
      report += `Skills:\n`;
      const sortedSkills = Array.from(bySkill.entries())
        .filter(([_, tokens]) => tokens > 0)
        .sort((a, b) => b[1] - a[1]); // Sort by tokens descending

      for (const [skill, tokens] of sortedSkills) {
        report += `  ${skill}: ${tokens.toLocaleString()} tokens\n`;
      }
    }

    return report;
  }

  /**
   * Reset all tracking data
   */
  reset(): void {
    this.entries = [];
    this.systemUsage.clear();
  }

  /**
   * Get entries for a specific time range
   */
  getEntriesInRange(start: Date, end: Date): TokenUsageEntry[] {
    return this.entries.filter(
      (entry) => entry.timestamp >= start && entry.timestamp <= end,
    );
  }
}
