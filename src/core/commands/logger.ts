/**
 * Phase 3: Command System - Logging Infrastructure
 * Provides structured logging for debugging and monitoring
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LogContext {
  [key: string]: string | number | boolean | undefined | null;
}

export interface Logger {
  debug(message: string, context?: LogContext): void;
  info(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  error(message: string, error?: Error, context?: LogContext): void;
}

export class ConsoleLogger implements Logger {
  constructor(private minLevel: LogLevel = LogLevel.INFO) {}

  debug(message: string, context?: LogContext): void {
    if (this.minLevel <= LogLevel.DEBUG) {
      console.debug(`[DEBUG] ${message}`, context || "");
    }
  }

  info(message: string, context?: LogContext): void {
    if (this.minLevel <= LogLevel.INFO) {
      console.info(`[INFO] ${message}`, context || "");
    }
  }

  warn(message: string, context?: LogContext): void {
    if (this.minLevel <= LogLevel.WARN) {
      console.warn(`[WARN] ${message}`, context || "");
    }
  }

  error(message: string, error?: Error, context?: LogContext): void {
    if (this.minLevel <= LogLevel.ERROR) {
      console.error(`[ERROR] ${message}`, {
        error: error?.message,
        stack: error?.stack,
        ...context,
      });
    }
  }
}

export class NoOpLogger implements Logger {
  debug(): void {}
  info(): void {}
  warn(): void {}
  error(): void {}
}
