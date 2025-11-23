import { Logger, ConsoleLogger } from './logger';

/**
 * Retry configuration options
 */
export interface RetryOptions {
  /** Maximum number of retry attempts (default: 3) */
  maxRetries?: number;
  /** Initial delay in milliseconds (default: 100ms) */
  initialDelay?: number;
  /** Multiplier for exponential backoff (default: 2) */
  backoffMultiplier?: number;
  /** Maximum delay between retries in milliseconds (default: 5000ms) */
  maxDelay?: number;
  /** Logger instance for debugging */
  logger?: Logger;
}

/**
 * Default retry options
 */
const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  initialDelay: 100,
  backoffMultiplier: 2,
  maxDelay: 5000,
  logger: new ConsoleLogger('[Retry]')
};

/**
 * Sleep for specified milliseconds
 * @param ms - Milliseconds to sleep
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if an error is retryable
 *
 * Retryable errors include:
 * - ENOENT (file not found - might be temporary)
 * - EBUSY (resource busy)
 * - EMFILE (too many open files)
 * - ENFILE (file table overflow)
 * - EIO (I/O error)
 *
 * @param error - The error to check
 * @returns true if the error is retryable
 */
function isRetryableError(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) {
    return false;
  }

  const nodeError = error as NodeJS.ErrnoException;
  const retryableCodes = ['EBUSY', 'EMFILE', 'ENFILE', 'EIO'];

  return nodeError.code ? retryableCodes.includes(nodeError.code) : false;
}

/**
 * Execute an async operation with retry logic
 *
 * Implements exponential backoff retry strategy with configurable options.
 * Only retries on specific retryable errors (EBUSY, EMFILE, etc.).
 *
 * @param operation - The async operation to execute
 * @param options - Retry configuration options
 * @returns The result of the operation
 * @throws The last error if all retries fail
 *
 * @example
 * ```typescript
 * const content = await withRetry(
 *   () => fs.readFile(path, 'utf-8'),
 *   { maxRetries: 3, initialDelay: 100 }
 * );
 * ```
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const config = { ...DEFAULT_RETRY_OPTIONS, ...options };
  let lastError: unknown;
  let delay = config.initialDelay;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      // Don't retry on last attempt
      if (attempt === config.maxRetries) {
        break;
      }

      // Only retry on retryable errors
      if (!isRetryableError(error)) {
        throw error;
      }

      config.logger.warn(
        `Operation failed (attempt ${attempt + 1}/${config.maxRetries + 1}), retrying in ${delay}ms...`,
        error
      );

      await sleep(delay);

      // Exponential backoff with max delay
      delay = Math.min(delay * config.backoffMultiplier, config.maxDelay);
    }
  }

  // All retries exhausted
  config.logger.error('All retry attempts exhausted', lastError);
  throw lastError;
}

/**
 * Create a retryable version of an async function
 *
 * Returns a new function that wraps the original with retry logic.
 *
 * @param fn - The async function to make retryable
 * @param options - Retry configuration options
 * @returns A new function with retry logic
 *
 * @example
 * ```typescript
 * const readFileWithRetry = retryable(
 *   (path: string) => fs.readFile(path, 'utf-8'),
 *   { maxRetries: 3 }
 * );
 *
 * const content = await readFileWithRetry('/path/to/file');
 * ```
 */
export function retryable<TArgs extends any[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  options: RetryOptions = {}
): (...args: TArgs) => Promise<TResult> {
  return (...args: TArgs) => withRetry(() => fn(...args), options);
}
