/**
 * Token Counter
 *
 * Provides accurate token counting for text content.
 * Uses a simple estimation method that approximates GPT tokenization.
 */

export class TokenCounter {
  /**
   * Count tokens in text
   *
   * This is a simple approximation. For production, use a proper tokenizer
   * like 'gpt-tokenizer' or 'tiktoken' npm packages.
   *
   * Approximation rules:
   * - Average 4 characters per token
   * - Punctuation and whitespace count as tokens
   * - Code blocks typically have lower char/token ratio (~3)
   */
  countTokens(text: string): number {
    if (!text || text.length === 0) {
      return 0;
    }

    // Detect if text contains significant code
    const hasCodeBlocks = text.includes('```') || text.includes('    ');
    const charPerToken = hasCodeBlocks ? 3 : 4;

    // Split by whitespace and punctuation to get word count
    const words = text.split(/\s+/).filter((w) => w.length > 0);

    // Calculate based on character count with adjustment for words
    const charCount = text.length;
    const charBasedTokens = Math.ceil(charCount / charPerToken);

    // Word-based estimate (punctuation adds tokens)
    const punctuationCount = (text.match(/[.,!?;:(){}[\]]/g) || []).length;
    const wordBasedTokens = words.length + Math.ceil(punctuationCount / 2);

    // Use average of both methods for better accuracy
    return Math.ceil((charBasedTokens + wordBasedTokens) / 2);
  }

  /**
   * Estimate tokens for a prompt-response pair
   */
  countPromptAndResponse(
    prompt: string,
    response: string
  ): {
    promptTokens: number;
    responseTokens: number;
    totalTokens: number;
  } {
    const promptTokens = this.countTokens(prompt);
    const responseTokens = this.countTokens(response);

    return {
      promptTokens,
      responseTokens,
      totalTokens: promptTokens + responseTokens,
    };
  }

  /**
   * Check if text exceeds token limit
   */
  exceedsLimit(text: string, limit: number): boolean {
    return this.countTokens(text) > limit;
  }

  /**
   * Truncate text to fit within token limit
   */
  truncateToLimit(text: string, limit: number): string {
    const currentTokens = this.countTokens(text);

    if (currentTokens <= limit) {
      return text;
    }

    // Estimate character limit
    const estimatedCharLimit = Math.floor(
      (limit / currentTokens) * text.length
    );

    // Truncate with some buffer
    const truncated = text.substring(0, estimatedCharLimit * 0.95);

    // Verify and adjust if needed
    if (this.countTokens(truncated) > limit) {
      // Recursively truncate further
      return this.truncateToLimit(truncated, limit);
    }

    return truncated + '\n...[truncated]';
  }
}
