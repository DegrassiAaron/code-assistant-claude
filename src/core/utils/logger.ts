/**
 * Centralized logging system with debug/verbose modes
 *
 * Provides consistent logging across the entire framework with
 * support for different verbosity levels.
 */

import chalk from 'chalk';

export type LogLevel = 'silent' | 'normal' | 'verbose' | 'debug';

export interface LoggerOptions {
  level: LogLevel;
  showTimestamps?: boolean;
  prefix?: string;
}

/**
 * Global logger configuration
 */
class LoggerConfig {
  private static instance: LoggerConfig;
  private _level: LogLevel = 'normal';
  private _showTimestamps: boolean = false;

  private constructor() {}

  static getInstance(): LoggerConfig {
    if (!LoggerConfig.instance) {
      LoggerConfig.instance = new LoggerConfig();
    }
    return LoggerConfig.instance;
  }

  setLevel(level: LogLevel): void {
    this._level = level;
  }

  getLevel(): LogLevel {
    return this._level;
  }

  setShowTimestamps(show: boolean): void {
    this._showTimestamps = show;
  }

  shouldShowTimestamps(): boolean {
    return this._showTimestamps;
  }

  /**
   * Check if current level allows logging at specified level
   */
  shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['silent', 'normal', 'verbose', 'debug'];
    const currentLevelIndex = levels.indexOf(this._level);
    const requestedLevelIndex = levels.indexOf(level);
    return requestedLevelIndex <= currentLevelIndex;
  }
}

/**
 * Enhanced logger with debug/verbose support
 */
export class Logger {
  private prefix: string;
  private config: LoggerConfig;

  constructor(prefix: string = '') {
    this.prefix = prefix;
    this.config = LoggerConfig.getInstance();
  }

  /**
   * Configure global logging settings
   */
  static configure(options: {
    level?: LogLevel;
    showTimestamps?: boolean;
  }): void {
    const config = LoggerConfig.getInstance();
    if (options.level) {
      config.setLevel(options.level);
    }
    if (options.showTimestamps !== undefined) {
      config.setShowTimestamps(options.showTimestamps);
    }
  }

  /**
   * Get current log level
   */
  static getLevel(): LogLevel {
    return LoggerConfig.getInstance().getLevel();
  }

  /**
   * Format timestamp if enabled
   */
  private getTimestamp(): string {
    if (!this.config.shouldShowTimestamps()) {
      return '';
    }
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour12: false });
    return chalk.gray(`[${time}] `);
  }

  /**
   * Format prefix
   */
  private getPrefix(): string {
    return this.prefix ? chalk.cyan(`[${this.prefix}]`) + ' ' : '';
  }

  /**
   * Log informational message (normal level)
   */
  info(message: string, ...args: unknown[]): void {
    if (!this.config.shouldLog('normal')) return;
    console.log(
      `${this.getTimestamp()}${this.getPrefix()}${chalk.blue('ℹ')} ${message}`,
      ...args
    );
  }

  /**
   * Log success message (normal level)
   */
  success(message: string, ...args: unknown[]): void {
    if (!this.config.shouldLog('normal')) return;
    console.log(
      `${this.getTimestamp()}${this.getPrefix()}${chalk.green('✓')} ${chalk.green(message)}`,
      ...args
    );
  }

  /**
   * Log warning message (normal level)
   */
  warn(message: string, ...args: unknown[]): void {
    if (!this.config.shouldLog('normal')) return;
    console.warn(
      `${this.getTimestamp()}${this.getPrefix()}${chalk.yellow('⚠')} ${chalk.yellow(message)}`,
      ...args
    );
  }

  /**
   * Log error message (always shown)
   */
  error(message: string, error?: Error | unknown): void {
    const errorDetails =
      error instanceof Error ? error.stack || error.message : error;
    console.error(
      `${this.getTimestamp()}${this.getPrefix()}${chalk.red('✖')} ${chalk.red(message)}`,
      errorDetails ? '\n' + errorDetails : ''
    );
  }

  /**
   * Log verbose message (verbose level)
   */
  verbose(message: string, ...args: unknown[]): void {
    if (!this.config.shouldLog('verbose')) return;
    console.log(
      `${this.getTimestamp()}${this.getPrefix()}${chalk.magenta('◆')} ${chalk.gray(message)}`,
      ...args
    );
  }

  /**
   * Log debug message (debug level)
   */
  debug(message: string, ...args: unknown[]): void {
    if (!this.config.shouldLog('debug')) return;
    console.log(
      `${this.getTimestamp()}${this.getPrefix()}${chalk.gray('🐛')} ${chalk.gray(message)}`,
      ...args
    );
  }

  /**
   * Start a timed operation (verbose/debug)
   */
  startTimer(label: string): () => void {
    if (!this.config.shouldLog('verbose')) {
      return () => {}; // No-op if not verbose
    }

    const start = Date.now();
    this.verbose(`${label}...`);

    return () => {
      const duration = Date.now() - start;
      this.verbose(`${label} completed in ${chalk.cyan(`${duration}ms`)}`);
    };
  }

  /**
   * Log a step in a process (verbose)
   */
  step(step: number, total: number, message: string): void {
    if (!this.config.shouldLog('verbose')) return;
    console.log(
      `${this.getTimestamp()}${this.getPrefix()}${chalk.blue(`[${step}/${total}]`)} ${message}`
    );
  }

  /**
   * Log JSON data (debug only)
   */
  debugObject(label: string, obj: unknown): void {
    if (!this.config.shouldLog('debug')) return;
    this.debug(`${label}:`);
    console.log(chalk.gray(JSON.stringify(obj, null, 2)));
  }

  /**
   * Create a child logger with a sub-prefix
   */
  child(subPrefix: string): Logger {
    const newPrefix = this.prefix ? `${this.prefix}:${subPrefix}` : subPrefix;
    return new Logger(newPrefix);
  }
}

/**
 * Default logger instance
 */
export const logger = new Logger();

/**
 * Create logger for specific module
 */
export function createLogger(prefix: string): Logger {
  return new Logger(prefix);
}
