/**
 * Abbreviation Engine
 * Smart abbreviation system for technical and business terms
 *
 * Performance Optimizations:
 * - Regex caching
 * - Pre-sorted rules
 * - Duplicate prevention
 */

import { escapeRegex, createWordBoundaryPattern } from "../../utils/regex";

export interface AbbreviationRule {
  full: string;
  abbreviation: string;
  category: "technical" | "business" | "general";
  context?: string[];
}

export interface AbbreviationResult {
  original: string;
  abbreviated: string;
  abbreviationsApplied: Array<{ from: string; to: string }>;
  tokensReduced: number;
}

export interface AbbreviationOptions {
  aggressive?: boolean;
}

/**
 * Smart Abbreviation Engine
 */
export class AbbreviationEngine {
  private static readonly CHARS_PER_TOKEN = 4;

  private rules: AbbreviationRule[] = [
    // Technical abbreviations
    { full: "application", abbreviation: "app", category: "technical" },
    { full: "database", abbreviation: "db", category: "technical" },
    { full: "configuration", abbreviation: "config", category: "technical" },
    { full: "environment", abbreviation: "env", category: "technical" },
    { full: "repository", abbreviation: "repo", category: "technical" },
    { full: "documentation", abbreviation: "docs", category: "technical" },
    { full: "specification", abbreviation: "spec", category: "technical" },
    { full: "implementation", abbreviation: "impl", category: "technical" },
    { full: "administrator", abbreviation: "admin", category: "technical" },
    { full: "authentication", abbreviation: "auth", category: "technical" },
    { full: "authorization", abbreviation: "authz", category: "technical" },
    { full: "function", abbreviation: "fn", category: "technical" },
    { full: "parameter", abbreviation: "param", category: "technical" },
    { full: "variable", abbreviation: "var", category: "technical" },
    { full: "constant", abbreviation: "const", category: "technical" },
    { full: "interface", abbreviation: "iface", category: "technical" },
    { full: "definition", abbreviation: "def", category: "technical" },
    { full: "reference", abbreviation: "ref", category: "technical" },
    { full: "temporary", abbreviation: "temp", category: "technical" },
    { full: "maximum", abbreviation: "max", category: "technical" },
    { full: "minimum", abbreviation: "min", category: "technical" },
    { full: "average", abbreviation: "avg", category: "technical" },
    { full: "statistics", abbreviation: "stats", category: "technical" },
    { full: "information", abbreviation: "info", category: "technical" },
    { full: "message", abbreviation: "msg", category: "technical" },
    { full: "error", abbreviation: "err", category: "technical" },
    { full: "warning", abbreviation: "warn", category: "technical" },
    { full: "production", abbreviation: "prod", category: "technical" },
    { full: "development", abbreviation: "dev", category: "technical" },

    // Business abbreviations
    { full: "customer", abbreviation: "cust", category: "business" },
    { full: "organization", abbreviation: "org", category: "business" },
    { full: "department", abbreviation: "dept", category: "business" },
    { full: "management", abbreviation: "mgmt", category: "business" },
    { full: "business", abbreviation: "biz", category: "business" },
    { full: "marketing", abbreviation: "mkt", category: "business" },
    { full: "operations", abbreviation: "ops", category: "business" },
    { full: "human resources", abbreviation: "HR", category: "business" },
    {
      full: "chief executive officer",
      abbreviation: "CEO",
      category: "business",
    },
    {
      full: "chief technology officer",
      abbreviation: "CTO",
      category: "business",
    },
    { full: "return on investment", abbreviation: "ROI", category: "business" },
    {
      full: "key performance indicator",
      abbreviation: "KPI",
      category: "business",
    },

    // General abbreviations
    { full: "for example", abbreviation: "e.g.", category: "general" },
    { full: "that is", abbreviation: "i.e.", category: "general" },
    { full: "and so forth", abbreviation: "etc.", category: "general" },
    { full: "approximately", abbreviation: "approx.", category: "general" },
    { full: "versus", abbreviation: "vs", category: "general" },
    { full: "with respect to", abbreviation: "w.r.t.", category: "general" },
    { full: "with regard to", abbreviation: "w.r.t.", category: "general" },
  ];

  // PERFORMANCE FIX: Cached regex patterns
  private regexCache: Map<string, RegExp> = new Map();
  private reverseRegexCache: Map<string, RegExp> = new Map();

  // PERFORMANCE FIX: Pre-sorted rules
  private sortedRules: AbbreviationRule[] = [];

  // Custom rules tracking
  private customRules: Set<string> = new Set();

  constructor() {
    this.initializeCache();
  }

  /**
   * Initialize regex cache and sort rules
   */
  private initializeCache(): void {
    // Sort rules by length (longest first) to avoid partial matches
    this.sortRules();

    // Pre-compile regex patterns
    this.compilePatterns();
  }

  /**
   * Sort rules by full text length (longest first)
   */
  private sortRules(): void {
    this.sortedRules = [...this.rules].sort(
      (a, b) => b.full.length - a.full.length,
    );
  }

  /**
   * Compile all regex patterns
   */
  private compilePatterns(): void {
    // Clear existing cache
    this.regexCache.clear();
    this.reverseRegexCache.clear();

    // Compile abbreviation patterns
    for (const rule of this.rules) {
      const pattern = createWordBoundaryPattern(rule.full, "gi");
      this.regexCache.set(rule.full, pattern);

      // Compile reverse pattern for expansion
      const reversePattern = createWordBoundaryPattern(rule.abbreviation, "g");
      this.reverseRegexCache.set(rule.abbreviation, reversePattern);
    }
  }

  /**
   * Apply abbreviations to text
   */
  abbreviate(
    text: string,
    options: AbbreviationOptions = {},
  ): AbbreviationResult {
    if (text.length === 0) {
      return {
        original: text,
        abbreviated: text,
        abbreviationsApplied: [],
        tokensReduced: 0,
      };
    }

    const originalLength = text.length;
    let abbreviated = text;
    const abbreviationsApplied: Array<{ from: string; to: string }> = [];

    // PERFORMANCE FIX: Use pre-sorted rules instead of sorting every time
    for (const rule of this.sortedRules) {
      // PERFORMANCE FIX: Use cached regex
      const pattern = this.regexCache.get(rule.full);
      if (!pattern) continue;

      pattern.lastIndex = 0;
      const matches = abbreviated.match(pattern);

      if (matches) {
        pattern.lastIndex = 0;
        abbreviated = abbreviated.replace(pattern, rule.abbreviation);
        abbreviationsApplied.push({
          from: rule.full,
          to: rule.abbreviation,
        });
      }
    }

    const abbreviatedLength = abbreviated.length;
    const tokensReduced = Math.floor(
      (originalLength - abbreviatedLength) / AbbreviationEngine.CHARS_PER_TOKEN,
    );

    return {
      original: text,
      abbreviated,
      abbreviationsApplied,
      tokensReduced,
    };
  }

  /**
   * Expand abbreviations back to full form
   */
  expand(text: string): string {
    if (text.length === 0) return text;

    let expanded = text;

    // Use cached reverse patterns
    for (const rule of this.rules) {
      const pattern = this.reverseRegexCache.get(rule.abbreviation);
      if (!pattern) continue;

      pattern.lastIndex = 0;
      expanded = expanded.replace(pattern, rule.full);
    }

    return expanded;
  }

  /**
   * Add custom abbreviation rule
   * BUG FIX: Prevent duplicates and invalidate cache
   */
  addCustomRule(
    full: string,
    abbreviation: string,
    category: AbbreviationRule["category"],
  ): void {
    // Remove existing rule if present
    this.removeCustomRule(full);

    // Add new rule
    this.rules.push({ full, abbreviation, category });
    this.customRules.add(full);

    // Invalidate and rebuild cache
    this.initializeCache();
  }

  /**
   * Remove custom abbreviation rule
   * BUG FIX: Ensure complete removal from all structures
   */
  removeCustomRule(full: string): void {
    if (!this.customRules.has(full)) {
      return; // Not a custom rule, don't remove
    }

    // Remove from rules array (remove all instances)
    this.rules = this.rules.filter((r) => r.full !== full);
    this.customRules.delete(full);

    // Invalidate and rebuild cache
    this.initializeCache();
  }

  /**
   * Get all abbreviation rules
   */
  getRules(category?: AbbreviationRule["category"]): AbbreviationRule[] {
    if (category) {
      return this.rules.filter((r) => r.category === category);
    }
    return [...this.rules];
  }

  /**
   * Find potential abbreviations in text
   */
  findPotentialAbbreviations(
    text: string,
  ): Array<{ word: string; suggestion: string }> {
    const suggestions: Array<{ word: string; suggestion: string }> = [];

    for (const rule of this.rules) {
      const pattern = this.regexCache.get(rule.full);
      if (!pattern) continue;

      pattern.lastIndex = 0;
      if (pattern.test(text)) {
        suggestions.push({
          word: rule.full,
          suggestion: rule.abbreviation,
        });
      }
    }

    return suggestions;
  }

  /**
   * Calculate abbreviation statistics
   */
  getStats(): {
    totalRules: number;
    technicalRules: number;
    businessRules: number;
    generalRules: number;
    customRules: number;
  } {
    const technical = this.rules.filter(
      (r) => r.category === "technical",
    ).length;
    const business = this.rules.filter((r) => r.category === "business").length;
    const general = this.rules.filter((r) => r.category === "general").length;

    return {
      totalRules: this.rules.length,
      technicalRules: technical,
      businessRules: business,
      generalRules: general,
      customRules: this.customRules.size,
    };
  }

  /**
   * Check if a rule exists
   */
  hasRule(full: string): boolean {
    return this.rules.some((r) => r.full === full);
  }

  /**
   * Get a specific rule
   */
  getRule(full: string): AbbreviationRule | null {
    return this.rules.find((r) => r.full === full) || null;
  }
}

/**
 * Default abbreviation engine instance
 */
export const abbreviationEngine = new AbbreviationEngine();

/**
 * Factory function for creating new instances (useful for testing)
 */
export function createAbbreviationEngine(): AbbreviationEngine {
  return new AbbreviationEngine();
}
