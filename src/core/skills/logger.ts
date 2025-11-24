/**
 * Logger interface for skills system
 *
 * Allows dependency injection of custom loggers for testing
 * and production environments.
 */
export interface Logger {
  /**
   * Log informational message
   */
  info(message: string, ...args: unknown[]): void;

  /**
   * Log warning message
   */
  warn(message: string, ...args: unknown[]): void;

  /**
   * Log error message
   */
  error(message: string, error?: Error | unknown): void;

  /**
   * Log debug message (optional, for verbose mode)
   */
  debug?(message: string, ...args: unknown[]): void;
}

/**
 * Default console logger implementation
 */
export class ConsoleLogger implements Logger {
  constructor(private prefix: string = "[Skills]") {}

  info(message: string, ...args: unknown[]): void {
    console.log(`${this.prefix} ${message}`, ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    console.warn(`${this.prefix} ⚠️  ${message}`, ...args);
  }

  error(message: string, error?: Error | unknown): void {
    if (error instanceof Error) {
      console.error(`${this.prefix} ❌ ${message}`, error);
    } else {
      console.error(`${this.prefix} ❌ ${message}`, error);
    }
  }

  debug(message: string, ...args: unknown[]): void {
    if (process.env.DEBUG) {
      console.debug(`${this.prefix} 🐛 ${message}`, ...args);
    }
  }
}

/**
 * Silent logger for testing
 */
export class SilentLogger implements Logger {
  info(): void {}
  warn(): void {}
  error(): void {}
  debug(): void {}
}
