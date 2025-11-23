/**
 * Abbreviation Engine
 * Smart abbreviation system for technical and business terms
 */

export interface AbbreviationRule {
  full: string;
  abbreviation: string;
  category: 'technical' | 'business' | 'general';
  context?: string[];
}

export interface AbbreviationResult {
  original: string;
  abbreviated: string;
  abbreviationsApplied: Array<{ from: string; to: string }>;
  tokensReduced: number;
}

/**
 * Smart Abbreviation Engine
 */
export class AbbreviationEngine {
  private rules: AbbreviationRule[] = [
    // Technical abbreviations
    { full: 'application', abbreviation: 'app', category: 'technical' },
    { full: 'database', abbreviation: 'db', category: 'technical' },
    { full: 'configuration', abbreviation: 'config', category: 'technical' },
    { full: 'environment', abbreviation: 'env', category: 'technical' },
    { full: 'repository', abbreviation: 'repo', category: 'technical' },
    { full: 'documentation', abbreviation: 'docs', category: 'technical' },
    { full: 'specification', abbreviation: 'spec', category: 'technical' },
    { full: 'implementation', abbreviation: 'impl', category: 'technical' },
    { full: 'administrator', abbreviation: 'admin', category: 'technical' },
    { full: 'authentication', abbreviation: 'auth', category: 'technical' },
    { full: 'authorization', abbreviation: 'authz', category: 'technical' },
    { full: 'function', abbreviation: 'fn', category: 'technical' },
    { full: 'parameter', abbreviation: 'param', category: 'technical' },
    { full: 'variable', abbreviation: 'var', category: 'technical' },
    { full: 'constant', abbreviation: 'const', category: 'technical' },
    { full: 'interface', abbreviation: 'iface', category: 'technical' },
    { full: 'definition', abbreviation: 'def', category: 'technical' },
    { full: 'reference', abbreviation: 'ref', category: 'technical' },
    { full: 'temporary', abbreviation: 'temp', category: 'technical' },
    { full: 'maximum', abbreviation: 'max', category: 'technical' },
    { full: 'minimum', abbreviation: 'min', category: 'technical' },
    { full: 'average', abbreviation: 'avg', category: 'technical' },
    { full: 'statistics', abbreviation: 'stats', category: 'technical' },
    { full: 'information', abbreviation: 'info', category: 'technical' },
    { full: 'message', abbreviation: 'msg', category: 'technical' },
    { full: 'error', abbreviation: 'err', category: 'technical' },
    { full: 'warning', abbreviation: 'warn', category: 'technical' },
    { full: 'production', abbreviation: 'prod', category: 'technical' },
    { full: 'development', abbreviation: 'dev', category: 'technical' },

    // Business abbreviations
    { full: 'customer', abbreviation: 'cust', category: 'business' },
    { full: 'organization', abbreviation: 'org', category: 'business' },
    { full: 'department', abbreviation: 'dept', category: 'business' },
    { full: 'management', abbreviation: 'mgmt', category: 'business' },
    { full: 'business', abbreviation: 'biz', category: 'business' },
    { full: 'marketing', abbreviation: 'mkt', category: 'business' },
    { full: 'operations', abbreviation: 'ops', category: 'business' },
    { full: 'human resources', abbreviation: 'HR', category: 'business' },
    { full: 'chief executive officer', abbreviation: 'CEO', category: 'business' },
    { full: 'chief technology officer', abbreviation: 'CTO', category: 'business' },
    { full: 'return on investment', abbreviation: 'ROI', category: 'business' },
    { full: 'key performance indicator', abbreviation: 'KPI', category: 'business' },

    // General abbreviations
    { full: 'for example', abbreviation: 'e.g.', category: 'general' },
    { full: 'that is', abbreviation: 'i.e.', category: 'general' },
    { full: 'and so forth', abbreviation: 'etc.', category: 'general' },
    { full: 'approximately', abbreviation: 'approx.', category: 'general' },
    { full: 'versus', abbreviation: 'vs', category: 'general' },
    { full: 'with respect to', abbreviation: 'w.r.t.', category: 'general' },
    { full: 'with regard to', abbreviation: 'w.r.t.', category: 'general' }
  ];

  private customRules: Map<string, string> = new Map();

  /**
   * Apply abbreviations to text
   */
  abbreviate(text: string, options: { aggressive?: boolean } = {}): AbbreviationResult {
    const originalLength = text.length;
    let abbreviated = text;
    const abbreviationsApplied: Array<{ from: string; to: string }> = [];

    // Sort rules by length (longest first) to avoid partial matches
    const sortedRules = [...this.rules].sort((a, b) => b.full.length - a.full.length);

    for (const rule of sortedRules) {
      const pattern = new RegExp(`\\b${this.escapeRegex(rule.full)}\\b`, 'gi');
      const matches = abbreviated.match(pattern);

      if (matches) {
        abbreviated = abbreviated.replace(pattern, rule.abbreviation);
        abbreviationsApplied.push({
          from: rule.full,
          to: rule.abbreviation
        });
      }
    }

    // Apply custom rules
    for (const [full, abbrev] of this.customRules.entries()) {
      const pattern = new RegExp(`\\b${this.escapeRegex(full)}\\b`, 'gi');
      abbreviated = abbreviated.replace(pattern, abbrev);
    }

    const abbreviatedLength = abbreviated.length;
    const tokensReduced = Math.floor((originalLength - abbreviatedLength) / 4);

    return {
      original: text,
      abbreviated,
      abbreviationsApplied,
      tokensReduced
    };
  }

  /**
   * Expand abbreviations back to full form
   */
  expand(text: string): string {
    let expanded = text;

    // Reverse the rules
    for (const rule of this.rules) {
      const pattern = new RegExp(`\\b${this.escapeRegex(rule.abbreviation)}\\b`, 'g');
      expanded = expanded.replace(pattern, rule.full);
    }

    // Reverse custom rules
    for (const [full, abbrev] of this.customRules.entries()) {
      const pattern = new RegExp(`\\b${this.escapeRegex(abbrev)}\\b`, 'g');
      expanded = expanded.replace(pattern, full);
    }

    return expanded;
  }

  /**
   * Add custom abbreviation rule
   */
  addCustomRule(full: string, abbreviation: string, category: AbbreviationRule['category']): void {
    this.customRules.set(full, abbreviation);
    this.rules.push({ full, abbreviation, category });
  }

  /**
   * Remove custom abbreviation rule
   */
  removeCustomRule(full: string): void {
    this.customRules.delete(full);
    this.rules = this.rules.filter(r => r.full !== full);
  }

  /**
   * Get all abbreviation rules
   */
  getRules(category?: AbbreviationRule['category']): AbbreviationRule[] {
    if (category) {
      return this.rules.filter(r => r.category === category);
    }
    return this.rules;
  }

  /**
   * Find potential abbreviations in text
   */
  findPotentialAbbreviations(text: string): Array<{ word: string; suggestion: string }> {
    const suggestions: Array<{ word: string; suggestion: string }> = [];

    for (const rule of this.rules) {
      const pattern = new RegExp(`\\b${this.escapeRegex(rule.full)}\\b`, 'gi');
      if (pattern.test(text)) {
        suggestions.push({
          word: rule.full,
          suggestion: rule.abbreviation
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
    const technical = this.rules.filter(r => r.category === 'technical').length;
    const business = this.rules.filter(r => r.category === 'business').length;
    const general = this.rules.filter(r => r.category === 'general').length;

    return {
      totalRules: this.rules.length,
      technicalRules: technical,
      businessRules: business,
      generalRules: general,
      customRules: this.customRules.size
    };
  }

  /**
   * Escape special regex characters
   */
  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}

/**
 * Default abbreviation engine instance
 */
export const abbreviationEngine = new AbbreviationEngine();
