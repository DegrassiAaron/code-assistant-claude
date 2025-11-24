/**
 * Symbol Renderer
 * Renders symbols in human-readable format with context
 */

import { CORE_SYMBOLS } from "./core-symbols";
import { BUSINESS_SYMBOLS } from "./business-symbols";
import { TECHNICAL_SYMBOLS } from "./technical-symbols";

export interface RenderOptions {
  mode: "compact" | "verbose" | "hybrid";
  colorize?: boolean;
  includeTooltips?: boolean;
}

export interface RenderedOutput {
  text: string;
  symbolsUsed: string[];
  readabilityScore: number;
}

/**
 * Symbol Renderer for displaying compressed text
 */
export class SymbolRenderer {
  /**
   * Render text with symbols in a readable format
   */
  render(
    text: string,
    options: RenderOptions = { mode: "hybrid" },
  ): RenderedOutput {
    const symbolsUsed: string[] = [];
    let rendered = text;

    // In compact mode, keep symbols as-is
    if (options.mode === "compact") {
      return {
        text,
        symbolsUsed: this.extractSymbols(text),
        readabilityScore: 0.7,
      };
    }

    // In verbose mode, add explanations
    if (options.mode === "verbose") {
      rendered = this.addExplanations(text);
      return {
        text: rendered,
        symbolsUsed: this.extractSymbols(text),
        readabilityScore: 1.0,
      };
    }

    // In hybrid mode, add tooltips for complex symbols
    if (options.mode === "hybrid" && options.includeTooltips) {
      rendered = this.addTooltips(text);
    }

    return {
      text: rendered,
      symbolsUsed: this.extractSymbols(text),
      readabilityScore: 0.85,
    };
  }

  /**
   * Add explanations for symbols
   */
  private addExplanations(text: string): string {
    let explained = text;

    // Add explanations for all symbols
    const allSymbols = [
      ...CORE_SYMBOLS,
      ...BUSINESS_SYMBOLS,
      ...TECHNICAL_SYMBOLS,
    ];

    for (const def of allSymbols) {
      const pattern = new RegExp(def.symbol, "g");
      explained = explained.replace(
        pattern,
        `${def.symbol} (${def.keywords[0]})`,
      );
    }

    return explained;
  }

  /**
   * Add tooltips for symbols (markdown style)
   */
  private addTooltips(text: string): string {
    let withTooltips = text;

    const allSymbols = [
      ...CORE_SYMBOLS,
      ...BUSINESS_SYMBOLS,
      ...TECHNICAL_SYMBOLS,
    ];

    for (const def of allSymbols) {
      const pattern = new RegExp(def.symbol, "g");
      // Use markdown link syntax for tooltips
      withTooltips = withTooltips.replace(
        pattern,
        `[${def.symbol}](# "${def.description}")`,
      );
    }

    return withTooltips;
  }

  /**
   * Extract all symbols used in text
   */
  private extractSymbols(text: string): string[] {
    const symbols: string[] = [];
    const allSymbols = [
      ...CORE_SYMBOLS,
      ...BUSINESS_SYMBOLS,
      ...TECHNICAL_SYMBOLS,
    ];

    for (const def of allSymbols) {
      if (text.includes(def.symbol)) {
        symbols.push(def.symbol);
      }
    }

    return [...new Set(symbols)];
  }

  /**
   * Create a symbol legend for documentation
   */
  createLegend(symbols?: string[]): string {
    const allSymbols = [
      ...CORE_SYMBOLS,
      ...BUSINESS_SYMBOLS,
      ...TECHNICAL_SYMBOLS,
    ];
    const symbolsToShow = symbols
      ? allSymbols.filter((s) => symbols.includes(s.symbol))
      : allSymbols;

    let legend = "## Symbol Legend\n\n";

    // Group by category
    const categories = new Map<string, typeof symbolsToShow>();

    for (const symbol of symbolsToShow) {
      const category = symbol.category;
      if (!categories.has(category)) {
        categories.set(category, []);
      }
      categories.get(category)!.push(symbol);
    }

    // Render each category
    for (const [category, syms] of categories.entries()) {
      legend += `### ${this.capitalizeFirst(category)}\n\n`;

      for (const sym of syms) {
        legend += `- ${sym.symbol} **${sym.keywords[0]}** - ${sym.description}\n`;
      }

      legend += "\n";
    }

    return legend;
  }

  /**
   * Calculate readability score
   * Higher is more readable (0-1)
   */
  calculateReadability(text: string): number {
    const symbols = this.extractSymbols(text);
    const symbolDensity = symbols.length / text.length;

    // Lower symbol density = higher readability
    return Math.max(0, 1 - symbolDensity * 10);
  }

  /**
   * Capitalize first letter
   */
  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Render a summary of symbol usage
   */
  renderSummary(text: string): string {
    const symbols = this.extractSymbols(text);
    const allSymbols = [
      ...CORE_SYMBOLS,
      ...BUSINESS_SYMBOLS,
      ...TECHNICAL_SYMBOLS,
    ];

    let summary = "### Symbol Usage Summary\n\n";
    summary += `Total symbols used: ${symbols.length}\n\n`;

    // Count by category
    const categoryCounts = new Map<string, number>();

    for (const symbol of symbols) {
      const def = allSymbols.find((s) => s.symbol === symbol);
      if (def) {
        const count = categoryCounts.get(def.category) || 0;
        categoryCounts.set(def.category, count + 1);
      }
    }

    summary += "**By Category:**\n";
    for (const [category, count] of categoryCounts.entries()) {
      summary += `- ${this.capitalizeFirst(category)}: ${count}\n`;
    }

    summary += `\n**Readability Score:** ${this.calculateReadability(text).toFixed(2)}\n`;

    return summary;
  }
}

/**
 * Default renderer instance
 */
export const symbolRenderer = new SymbolRenderer();
