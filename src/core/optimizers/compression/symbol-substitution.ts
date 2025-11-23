/**
 * Symbol Substitution Engine
 * Intelligent replacement of text with symbols for compression
 */

import { symbolSystem } from '../symbols/symbol-system';

export interface SubstitutionOptions {
  aggressive: boolean;
  preserveCodeBlocks: boolean;
  preserveUrls: boolean;
  minWordLength: number;
}

export interface SubstitutionResult {
  original: string;
  substituted: string;
  substitutions: Array<{ from: string; to: string; position: number }>;
  compressionRatio: number;
}

/**
 * Symbol Substitution Engine for intelligent text compression
 */
export class SymbolSubstitution {
  private defaultOptions: SubstitutionOptions = {
    aggressive: false,
    preserveCodeBlocks: true,
    preserveUrls: true,
    minWordLength: 3
  };

  /**
   * Substitute text with symbols
   */
  substitute(text: string, options?: Partial<SubstitutionOptions>): SubstitutionResult {
    const opts = { ...this.defaultOptions, ...options };
    const substitutions: Array<{ from: string; to: string; position: number }> = [];

    let substituted = text;

    // Preserve code blocks if requested
    const protectedRanges: Array<{ start: number; end: number }> = [];

    if (opts.preserveCodeBlocks) {
      protectedRanges.push(...this.findCodeBlocks(text));
    }

    if (opts.preserveUrls) {
      protectedRanges.push(...this.findUrls(text));
    }

    // Perform substitution
    const result = symbolSystem.compress(text, { aggressive: opts.aggressive });

    return {
      original: text,
      substituted: result.compressed,
      substitutions,
      compressionRatio: result.compressionRatio
    };
  }

  /**
   * Find code blocks in text (markdown style)
   */
  private findCodeBlocks(text: string): Array<{ start: number; end: number }> {
    const ranges: Array<{ start: number; end: number }> = [];
    const codeBlockPattern = /```[\s\S]*?```|`[^`]+`/g;

    let match;
    while ((match = codeBlockPattern.exec(text)) !== null) {
      ranges.push({
        start: match.index,
        end: match.index + match[0].length
      });
    }

    return ranges;
  }

  /**
   * Find URLs in text
   */
  private findUrls(text: string): Array<{ start: number; end: number }> {
    const ranges: Array<{ start: number; end: number }> = [];
    const urlPattern = /https?:\/\/[^\s]+/g;

    let match;
    while ((match = urlPattern.exec(text)) !== null) {
      ranges.push({
        start: match.index,
        end: match.index + match[0].length
      });
    }

    return ranges;
  }

  /**
   * Check if position is in a protected range
   */
  private isProtected(
    position: number,
    ranges: Array<{ start: number; end: number }>
  ): boolean {
    return ranges.some(range => position >= range.start && position < range.end);
  }

  /**
   * Batch substitution for multiple texts
   */
  batchSubstitute(
    texts: string[],
    options?: Partial<SubstitutionOptions>
  ): SubstitutionResult[] {
    return texts.map(text => this.substitute(text, options));
  }

  /**
   * Get substitution statistics
   */
  getStats(result: SubstitutionResult): {
    originalLength: number;
    substitutedLength: number;
    reduction: number;
    percentReduction: number;
  } {
    const originalLength = result.original.length;
    const substitutedLength = result.substituted.length;
    const reduction = originalLength - substitutedLength;
    const percentReduction = (reduction / originalLength) * 100;

    return {
      originalLength,
      substitutedLength,
      reduction,
      percentReduction
    };
  }
}

/**
 * Default substitution engine instance
 */
export const symbolSubstitution = new SymbolSubstitution();
