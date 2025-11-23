import { encoding_for_model, TiktokenModel } from 'tiktoken';
import { CHARS_PER_TOKEN_ESTIMATE } from './constants';
import { Logger, ConsoleLogger } from './logger';

/**
 * Token estimation utility using tiktoken for accurate token counting
 *
 * Provides both accurate tiktoken-based estimation and fallback simple estimation.
 * The simple fallback is used when tiktoken fails or for non-critical estimations.
 */
export class TokenEstimator {
  private encoder: ReturnType<typeof encoding_for_model> | null = null;
  private logger: Logger;
  private initialized = false;

  /**
   * Creates a new TokenEstimator
   * @param model - The model to use for token estimation (default: gpt-4)
   * @param logger - Logger instance for debugging
   */
  constructor(
    private model: TiktokenModel = 'gpt-4',
    logger: Logger = new ConsoleLogger('[TokenEstimator]')
  ) {
    this.logger = logger;
    this.initialize();
  }

  /**
   * Initialize tiktoken encoder
   * @private
   */
  private initialize(): void {
    try {
      this.encoder = encoding_for_model(this.model);
      this.initialized = true;
      this.logger.debug?.(`Initialized tiktoken encoder for model: ${this.model}`);
    } catch (error) {
      this.logger.warn('Failed to initialize tiktoken encoder, falling back to simple estimation', error);
      this.encoder = null;
      this.initialized = false;
    }
  }

  /**
   * Estimate token count for text
   *
   * Uses tiktoken for accurate counting when available, falls back to
   * simple character-based estimation otherwise.
   *
   * @param text - The text to estimate tokens for
   * @param useSimple - Force use of simple estimation (optional)
   * @returns Estimated token count
   */
  estimateTokens(text: string, useSimple = false): number {
    if (!text) return 0;

    // Use simple estimation if forced or tiktoken not available
    if (useSimple || !this.initialized || !this.encoder) {
      return this.simpleEstimate(text);
    }

    try {
      const tokens = this.encoder.encode(text);
      return tokens.length;
    } catch (error) {
      this.logger.warn('Tiktoken encoding failed, using simple estimation', error);
      return this.simpleEstimate(text);
    }
  }

  /**
   * Simple character-based token estimation
   *
   * Uses the heuristic of ~4 characters per token, which is reasonably
   * accurate for English text.
   *
   * @param text - The text to estimate tokens for
   * @returns Estimated token count
   */
  private simpleEstimate(text: string): number {
    return Math.ceil(text.length / CHARS_PER_TOKEN_ESTIMATE);
  }

  /**
   * Check if tiktoken is available and initialized
   * @returns true if tiktoken is available
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Get the current model being used for estimation
   * @returns The model name
   */
  getModel(): TiktokenModel {
    return this.model;
  }

  /**
   * Free tiktoken encoder resources
   *
   * Call this when the estimator is no longer needed to free up memory.
   */
  dispose(): void {
    if (this.encoder) {
      try {
        this.encoder.free();
        this.logger.debug?.('Disposed tiktoken encoder');
      } catch (error) {
        this.logger.warn('Failed to dispose tiktoken encoder', error);
      }
      this.encoder = null;
      this.initialized = false;
    }
  }
}

/**
 * Singleton instance for shared token estimation
 *
 * Use this for most token estimation needs. Create separate instances
 * only if you need different models or loggers.
 */
export const defaultTokenEstimator = new TokenEstimator();
