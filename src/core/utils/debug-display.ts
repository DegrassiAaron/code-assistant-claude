import chalk from 'chalk';

/**
 * User-facing debug display system
 * Shows framework activity in real-time during development
 */
export class DebugDisplay {
  private static enabled = false;
  private static verbose = false;
  private static startTime: number = Date.now();
  private static sessionTokens = 0;

  /**
   * Enable debug mode
   */
  static enable(verbose = false): void {
    this.enabled = true;
    this.verbose = verbose;
    this.startTime = Date.now();
    this.sessionTokens = 0;

    console.log(chalk.cyan('\n╔════════════════════════════════════════════════════════╗'));
    console.log(chalk.cyan('║') + chalk.bold(' Code-Assistant-Claude Debug Mode ACTIVE ') + chalk.cyan('      ║'));
    console.log(chalk.cyan('╚════════════════════════════════════════════════════════╝\n'));
  }

  /**
   * Disable debug mode
   */
  static disable(): void {
    if (this.enabled) {
      this.printSessionSummary();
    }
    this.enabled = false;
    this.verbose = false;
  }

  /**
   * Check if debug is enabled
   */
  static isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Print skill activation
   */
  static skillActivated(skillName: string, reason: string, tokens: number): void {
    if (!this.enabled) return;

    this.sessionTokens += tokens;

    console.log(chalk.yellow('\n┌─ SKILL ACTIVATED'));
    console.log(chalk.yellow('│'));
    console.log(chalk.yellow('├─'), chalk.bold(skillName));
    console.log(chalk.yellow('├─'), chalk.gray(`Reason: ${reason}`));
    console.log(chalk.yellow('├─'), chalk.gray(`Tokens: ${tokens} (~${this.estimateSize(tokens)})`));
    console.log(chalk.yellow('├─'), chalk.gray(`Session Total: ${this.sessionTokens} tokens`));
    console.log(chalk.yellow('└─'), this.getTokenBar(this.sessionTokens, 200000));
  }

  /**
   * Print MCP execution
   */
  static mcpExecuting(server: string, tool: string, phase: string): void {
    if (!this.enabled) return;

    console.log(chalk.blue('\n┌─ MCP EXECUTION'));
    console.log(chalk.blue('│'));
    console.log(chalk.blue('├─'), chalk.bold(`${server}::${tool}`));
    console.log(chalk.blue('├─'), chalk.gray(`Phase: ${phase}`));
    console.log(chalk.blue('└─'), chalk.dim(this.getElapsedTime()));
  }

  /**
   * Print MCP result
   */
  static mcpCompleted(server: string, tool: string, tokens: number, duration: number): void {
    if (!this.enabled) return;

    this.sessionTokens += tokens;

    console.log(chalk.green('\n└─ MCP COMPLETED'));
    console.log(chalk.green('  ├─'), chalk.bold(`${server}::${tool}`));
    console.log(chalk.green('  ├─'), chalk.gray(`Duration: ${duration}ms`));
    console.log(chalk.green('  ├─'), chalk.gray(`Tokens Saved: ${this.calculateSavings(tokens)}`));
    console.log(chalk.green('  ├─'), chalk.gray(`Session Total: ${this.sessionTokens} tokens`));
    console.log(chalk.green('  └─'), this.getTokenBar(this.sessionTokens, 200000));
  }

  /**
   * Print command execution
   */
  static commandExecuting(command: string, params: Record<string, unknown>): void {
    if (!this.enabled) return;

    console.log(chalk.magenta('\n┌─ COMMAND EXECUTING'));
    console.log(chalk.magenta('│'));
    console.log(chalk.magenta('├─'), chalk.bold(command));
    if (this.verbose && Object.keys(params).length > 0) {
      console.log(chalk.magenta('├─'), chalk.gray('Parameters:'));
      Object.entries(params).forEach(([key, value]) => {
        console.log(chalk.magenta('│  ├─'), chalk.gray(`${key}: ${JSON.stringify(value)}`));
      });
    }
    console.log(chalk.magenta('└─'), chalk.dim(this.getElapsedTime()));
  }

  /**
   * Print agent selection
   */
  static agentSelected(agents: Array<{ name: string; score: number }>, reason: string): void {
    if (!this.enabled) return;

    console.log(chalk.cyan('\n┌─ AGENTS SELECTED'));
    console.log(chalk.cyan('│'));
    console.log(chalk.cyan('├─'), chalk.gray(`Reason: ${reason}`));
    console.log(chalk.cyan('├─'), chalk.gray(`Count: ${agents.length}`));
    agents.forEach((agent, idx) => {
      const isLast = idx === agents.length - 1;
      const prefix = isLast ? '└─' : '├─';
      console.log(chalk.cyan(prefix), chalk.bold(agent.name), chalk.dim(`(score: ${agent.score})`));
    });
  }

  /**
   * Print token budget status
   */
  static tokenBudget(used: number, total: number, category: string): void {
    if (!this.enabled) return;

    const percentage = ((used / total) * 100).toFixed(1);
    const status = used / total < 0.75 ? '🟢' : used / total < 0.9 ? '🟡' : '🔴';

    console.log(chalk.gray('\n┌─ TOKEN BUDGET'));
    console.log(chalk.gray('├─'), chalk.bold(category));
    console.log(chalk.gray('├─'), `${status} ${used.toLocaleString()} / ${total.toLocaleString()} (${percentage}%)`);
    console.log(chalk.gray('└─'), this.getTokenBar(used, total));
  }

  /**
   * Print code generation
   */
  static codeGenerated(language: string, tokens: number, traditional: number): void {
    if (!this.enabled) return;

    this.sessionTokens += tokens;
    const savings = ((1 - tokens / traditional) * 100).toFixed(1);

    console.log(chalk.green('\n┌─ CODE GENERATED'));
    console.log(chalk.green('│'));
    console.log(chalk.green('├─'), chalk.bold(`${language} wrapper`));
    console.log(chalk.green('├─'), chalk.gray(`Tokens: ${tokens}`));
    console.log(chalk.green('├─'), chalk.gray(`Traditional: ${traditional}`));
    console.log(chalk.green('├─'), chalk.bold.green(`Savings: ${savings}% 🎉`));
    console.log(chalk.green('└─'), this.getTokenBar(tokens, traditional));
  }

  /**
   * Print security validation
   */
  static securityValidated(riskScore: number, level: string, issues: number): void {
    if (!this.enabled) return;

    const statusColor = riskScore < 40 ? chalk.green : riskScore < 70 ? chalk.yellow : chalk.red;

    console.log(statusColor('\n┌─ SECURITY VALIDATION'));
    console.log(statusColor('│'));
    console.log(statusColor('├─'), chalk.bold(`Risk Level: ${level}`));
    console.log(statusColor('├─'), chalk.gray(`Risk Score: ${riskScore}/100`));
    console.log(statusColor('├─'), chalk.gray(`Issues Found: ${issues}`));
    console.log(statusColor('└─'), this.getRiskBar(riskScore));
  }

  /**
   * Print sandbox execution
   */
  static sandboxExecuting(type: string, language: string): void {
    if (!this.enabled) return;

    const emoji = type === 'docker' ? '🐳' : type === 'vm' ? '📦' : '⚡';

    console.log(chalk.blue('\n┌─ SANDBOX EXECUTION'));
    console.log(chalk.blue('│'));
    console.log(chalk.blue('├─'), chalk.bold(`${emoji} ${type.toUpperCase()}`));
    console.log(chalk.blue('├─'), chalk.gray(`Language: ${language}`));
    console.log(chalk.blue('└─'), chalk.dim(this.getElapsedTime()));
  }

  /**
   * Print sandbox result
   */
  static sandboxCompleted(success: boolean, duration: number, memory: string): void {
    if (!this.enabled) return;

    const statusColor = success ? chalk.green : chalk.red;
    const icon = success ? '✅' : '❌';

    console.log(statusColor('\n└─ SANDBOX RESULT'));
    console.log(statusColor(`  ├─ ${icon} ${success ? 'SUCCESS' : 'FAILED'}`));
    console.log(statusColor('  ├─'), chalk.gray(`Duration: ${duration}ms`));
    console.log(statusColor('  └─'), chalk.gray(`Memory: ${memory}`));
  }

  /**
   * Print progressive loading
   */
  static progressiveLoad(type: 'metadata' | 'full' | 'resources', name: string, tokens: number): void {
    if (!this.enabled) return;

    this.sessionTokens += tokens;

    const emoji = type === 'metadata' ? '📋' : type === 'full' ? '📄' : '📦';
    const label = type === 'metadata' ? 'Metadata' : type === 'full' ? 'Full Content' : 'Resources';

    console.log(chalk.gray(`  ${emoji} Loading ${label}: ${chalk.bold(name)} (${tokens} tokens)`));
  }

  /**
   * Print phase transition
   */
  static phase(number: number, name: string, description?: string): void {
    if (!this.enabled) return;

    console.log(chalk.cyan(`\n${'═'.repeat(60)}`));
    console.log(chalk.cyan(`PHASE ${number}: ${name.toUpperCase()}`));
    if (description) {
      console.log(chalk.gray(description));
    }
    console.log(chalk.cyan('═'.repeat(60)));
  }

  /**
   * Print warning
   */
  static warning(message: string, details?: string): void {
    if (!this.enabled) return;

    console.log(chalk.yellow('\n⚠️  ' + message));
    if (details && this.verbose) {
      console.log(chalk.gray('   ' + details));
    }
  }

  /**
   * Print info
   */
  static info(message: string, details?: Record<string, unknown>): void {
    if (!this.enabled) return;

    console.log(chalk.blue('\nℹ️  ' + message));
    if (details && this.verbose) {
      Object.entries(details).forEach(([key, value]) => {
        console.log(chalk.gray(`   ${key}: ${JSON.stringify(value)}`));
      });
    }
  }

  /**
   * Print session summary
   */
  private static printSessionSummary(): void {
    const duration = Date.now() - this.startTime;
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);

    console.log(chalk.cyan('\n╔════════════════════════════════════════════════════════╗'));
    console.log(chalk.cyan('║') + chalk.bold('         SESSION SUMMARY                           ') + chalk.cyan('║'));
    console.log(chalk.cyan('╠════════════════════════════════════════════════════════╣'));
    console.log(chalk.cyan('║') + ` Duration: ${minutes}m ${seconds}s` + ' '.repeat(44 - (`Duration: ${minutes}m ${seconds}s`.length)) + chalk.cyan('║'));
    console.log(chalk.cyan('║') + ` Total Tokens: ${this.sessionTokens.toLocaleString()}` + ' '.repeat(44 - (`Total Tokens: ${this.sessionTokens.toLocaleString()}`.length)) + chalk.cyan('║'));
    console.log(chalk.cyan('║') + ` Avg Token/min: ${Math.floor(this.sessionTokens / Math.max(minutes, 1))}` + ' '.repeat(44 - (`Avg Token/min: ${Math.floor(this.sessionTokens / Math.max(minutes, 1))}`.length)) + chalk.cyan('║'));
    console.log(chalk.cyan('╚════════════════════════════════════════════════════════╝\n'));
  }

  /**
   * Get token usage bar
   */
  private static getTokenBar(used: number, total: number): string {
    const percentage = Math.min(used / total, 1);
    const barLength = 30;
    const filled = Math.floor(percentage * barLength);
    const empty = barLength - filled;

    const color = percentage < 0.75 ? chalk.green : percentage < 0.9 ? chalk.yellow : chalk.red;

    return color('█'.repeat(filled)) + chalk.gray('░'.repeat(empty)) + chalk.gray(` ${(percentage * 100).toFixed(1)}%`);
  }

  /**
   * Get risk score bar
   */
  private static getRiskBar(score: number): string {
    const percentage = Math.min(score / 100, 1);
    const barLength = 30;
    const filled = Math.floor(percentage * barLength);
    const empty = barLength - filled;

    const color = score < 40 ? chalk.green : score < 70 ? chalk.yellow : chalk.red;

    return color('█'.repeat(filled)) + chalk.gray('░'.repeat(empty)) + chalk.gray(` ${score}/100`);
  }

  /**
   * Get elapsed time
   */
  private static getElapsedTime(): string {
    const elapsed = Date.now() - this.startTime;
    const seconds = (elapsed / 1000).toFixed(1);
    return chalk.dim(`[+${seconds}s]`);
  }

  /**
   * Estimate size from tokens
   */
  private static estimateSize(tokens: number): string {
    const kb = (tokens * 4) / 1024; // ~4 chars per token
    if (kb < 1) return `${Math.round(kb * 1024)} bytes`;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  }

  /**
   * Calculate token savings
   */
  private static calculateSavings(actualTokens: number): string {
    const traditional = 150000;
    const saved = traditional - actualTokens;
    const percentage = ((saved / traditional) * 100).toFixed(1);
    return `${saved.toLocaleString()} tokens (${percentage}%)`;
  }
}

/**
 * Convenience functions for common debug messages
 */
export const debug = {
  skill: (name: string, reason: string, tokens: number) =>
    DebugDisplay.skillActivated(name, reason, tokens),

  mcp: (server: string, tool: string, phase: string) =>
    DebugDisplay.mcpExecuting(server, tool, phase),

  mcpDone: (server: string, tool: string, tokens: number, duration: number) =>
    DebugDisplay.mcpCompleted(server, tool, tokens, duration),

  command: (cmd: string, params: Record<string, unknown>) =>
    DebugDisplay.commandExecuting(cmd, params),

  agent: (agents: Array<{ name: string; score: number }>, reason: string) =>
    DebugDisplay.agentSelected(agents, reason),

  budget: (used: number, total: number, category: string) =>
    DebugDisplay.tokenBudget(used, total, category),

  codegen: (language: string, tokens: number, traditional: number) =>
    DebugDisplay.codeGenerated(language, tokens, traditional),

  security: (riskScore: number, level: string, issues: number) =>
    DebugDisplay.securityValidated(riskScore, level, issues),

  sandbox: (type: string, language: string) =>
    DebugDisplay.sandboxExecuting(type, language),

  sandboxDone: (success: boolean, duration: number, memory: string) =>
    DebugDisplay.sandboxCompleted(success, duration, memory),

  progressive: (type: 'metadata' | 'full' | 'resources', name: string, tokens: number) =>
    DebugDisplay.progressiveLoad(type, name, tokens),

  phase: (number: number, name: string, description?: string) =>
    DebugDisplay.phase(number, name, description),

  warn: (message: string, details?: string) =>
    DebugDisplay.warning(message, details),

  info: (message: string, details?: Record<string, unknown>) =>
    DebugDisplay.info(message, details),

  enable: (verbose = false) => DebugDisplay.enable(verbose),

  disable: () => DebugDisplay.disable(),

  isEnabled: () => DebugDisplay.isEnabled(),
};
