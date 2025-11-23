/**
 * Main Symbol System
 * Combines all symbol types for comprehensive token compression
 */

import { CORE_SYMBOLS, getSymbolByKeyword } from './core-symbols';
import { BUSINESS_SYMBOLS, getBusinessSymbolByKeyword } from './business-symbols';
import { TECHNICAL_SYMBOLS, getTechnicalSymbolByKeyword } from './technical-symbols';

export interface CompressionResult {
  original: string;
  compressed: string;
  tokensReduced: number;
  compressionRatio: number;
}

export interface SymbolStats {
  totalSymbols: number;
  coreSymbols: number;
  businessSymbols: number;
  technicalSymbols: number;
  categories: Record<string, number>;
}

/**
 * Main Symbol System for token compression
 */
export class SymbolSystem {
  private symbolMap: Map<string, string>;
  private reverseMap: Map<string, string>;

  constructor() {
    this.symbolMap = new Map();
    this.reverseMap = new Map();
    this.initializeSymbols();
  }

  /**
   * Initialize all symbol mappings
   */
  private initializeSymbols(): void {
    // Core symbols
    for (const def of CORE_SYMBOLS) {
      for (const keyword of def.keywords) {
        this.symbolMap.set(keyword.toLowerCase(), def.symbol);
        // Store first keyword as the expansion
        if (!this.reverseMap.has(def.symbol)) {
          this.reverseMap.set(def.symbol, keyword);
        }
      }
    }

    // Business symbols
    for (const def of BUSINESS_SYMBOLS) {
      for (const keyword of def.keywords) {
        this.symbolMap.set(keyword.toLowerCase(), def.symbol);
        if (!this.reverseMap.has(def.symbol)) {
          this.reverseMap.set(def.symbol, keyword);
        }
      }
    }

    // Technical symbols
    for (const def of TECHNICAL_SYMBOLS) {
      for (const keyword of def.keywords) {
        this.symbolMap.set(keyword.toLowerCase(), def.symbol);
        if (!this.reverseMap.has(def.symbol)) {
          this.reverseMap.set(def.symbol, keyword);
        }
      }
    }
  }

  /**
   * Compress text using symbols
   * Replaces keywords with their symbol equivalents
   */
  compress(text: string, options: { aggressive?: boolean } = {}): CompressionResult {
    const originalLength = text.length;
    let compressed = text;

    // Sort keywords by length (longest first) to avoid partial matches
    const sortedKeywords = Array.from(this.symbolMap.keys()).sort(
      (a, b) => b.length - a.length
    );

    for (const keyword of sortedKeywords) {
      const symbol = this.symbolMap.get(keyword);
      if (!symbol) continue;

      // Create regex to match whole words only
      const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = new RegExp(`\\b${escapedKeyword}\\b`, 'gi');

      // Replace matches
      compressed = compressed.replace(pattern, symbol);
    }

    const compressedLength = compressed.length;
    const tokensReduced = this.estimateTokenReduction(originalLength, compressedLength);
    const compressionRatio = (originalLength - compressedLength) / originalLength;

    return {
      original: text,
      compressed,
      tokensReduced,
      compressionRatio
    };
  }

  /**
   * Expand symbols back to text
   */
  expand(text: string): string {
    let expanded = text;

    for (const [symbol, keyword] of this.reverseMap.entries()) {
      const escapedSymbol = symbol.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = new RegExp(escapedSymbol, 'g');
      expanded = expanded.replace(pattern, keyword);
    }

    return expanded;
  }

  /**
   * Estimate token reduction based on character reduction
   * Rough estimate: 1 token ≈ 4 characters
   */
  private estimateTokenReduction(originalLength: number, compressedLength: number): number {
    const charsReduced = originalLength - compressedLength;
    return Math.floor(charsReduced / 4);
  }

  /**
   * Get symbol for a specific keyword
   */
  getSymbol(keyword: string): string | null {
    return (
      getSymbolByKeyword(keyword) ||
      getBusinessSymbolByKeyword(keyword) ||
      getTechnicalSymbolByKeyword(keyword)
    );
  }

  /**
   * Get statistics about the symbol system
   */
  getStats(): SymbolStats {
    const categories: Record<string, number> = {};

    // Count core symbols
    for (const symbol of CORE_SYMBOLS) {
      categories[symbol.category] = (categories[symbol.category] || 0) + 1;
    }

    // Count business symbols
    for (const symbol of BUSINESS_SYMBOLS) {
      categories[`business_${symbol.category}`] =
        (categories[`business_${symbol.category}`] || 0) + 1;
    }

    // Count technical symbols
    for (const symbol of TECHNICAL_SYMBOLS) {
      categories[`technical_${symbol.category}`] =
        (categories[`technical_${symbol.category}`] || 0) + 1;
    }

    return {
      totalSymbols: this.reverseMap.size,
      coreSymbols: CORE_SYMBOLS.length,
      businessSymbols: BUSINESS_SYMBOLS.length,
      technicalSymbols: TECHNICAL_SYMBOLS.length,
      categories
    };
  }

  /**
   * Check if text contains symbols
   */
  hasSymbols(text: string): boolean {
    for (const symbol of this.reverseMap.keys()) {
      if (text.includes(symbol)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Get all available symbols
   */
  getAllSymbols(): Array<{ keyword: string; symbol: string }> {
    return Array.from(this.symbolMap.entries()).map(([keyword, symbol]) => ({
      keyword,
      symbol
    }));
  }
}

/**
 * Default singleton instance
 */
export const symbolSystem = new SymbolSystem();
