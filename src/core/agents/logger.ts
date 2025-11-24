/**
 * Logger
 *
 * Simple logging utility for agent system observability.
 */

import type { ILogger, LogLevel, LogEntry } from "./types";

export class Logger implements ILogger {
  private context: string;
  private entries: LogEntry[] = [];
  private static globalEnabled = true;

  constructor(context: string) {
    this.context = context;
  }

  /**
   * Enable or disable logging globally
   */
  static setEnabled(enabled: boolean): void {
    Logger.globalEnabled = enabled;
  }

  /**
   * Debug level log
   */
  debug(message: string, metadata?: Record<string, unknown>): void {
    this.log("debug", message, metadata);
  }

  /**
   * Info level log
   */
  info(message: string, metadata?: Record<string, unknown>): void {
    this.log("info", message, metadata);
  }

  /**
   * Warning level log
   */
  warn(message: string, metadata?: Record<string, unknown>): void {
    this.log("warn", message, metadata);
  }

  /**
   * Error level log
   */
  error(message: string, metadata?: Record<string, unknown>): void {
    this.log("error", message, metadata);
  }

  /**
   * Get all log entries
   */
  getEntries(): LogEntry[] {
    return [...this.entries];
  }

  /**
   * Clear log entries
   */
  clear(): void {
    this.entries = [];
  }

  /**
   * Internal log method
   */
  private log(
    level: LogLevel,
    message: string,
    metadata?: Record<string, unknown>,
  ): void {
    if (!Logger.globalEnabled) {
      return;
    }

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      context: this.context,
      metadata,
    };

    this.entries.push(entry);

    // Also log to console
    const logMethod =
      level === "error"
        ? console.error
        : level === "warn"
          ? console.warn
          : level === "info"
            ? console.info
            : console.debug;

    const prefix = `[${entry.timestamp.toISOString()}] [${level.toUpperCase()}] [${this.context}]`;

    if (metadata) {
      logMethod(prefix, message, metadata);
    } else {
      logMethod(prefix, message);
    }
  }
}
