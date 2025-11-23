/**
 * Template Optimizer
 * Optimizes structured templates for token efficiency
 */

export interface Template {
  name: string;
  structure: string;
  variables: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface OptimizedTemplate {
  original: Template;
  optimized: string;
  tokensReduced: number;
}

/**
 * Template Optimizer for structured content
 */
export class TemplateOptimizer {
  /**
   * Optimize a template by removing redundancy
   */
  optimize(template: Template): OptimizedTemplate {
    let optimized = template.structure;
    let tokensReduced = 0;

    // Remove excessive whitespace
    const beforeWhitespace = optimized.length;
    optimized = this.removeExcessiveWhitespace(optimized);
    tokensReduced += Math.floor((beforeWhitespace - optimized.length) / 4);

    // Compress repeated patterns
    const beforePatterns = optimized.length;
    optimized = this.compressRepeatedPatterns(optimized);
    tokensReduced += Math.floor((beforePatterns - optimized.length) / 4);

    // Replace verbose phrases with abbreviations
    const beforeAbbrev = optimized.length;
    optimized = this.applyAbbreviations(optimized);
    tokensReduced += Math.floor((beforeAbbrev - optimized.length) / 4);

    // Inject variables
    optimized = this.injectVariables(optimized, template.variables);

    return {
      original: template,
      optimized,
      tokensReduced
    };
  }

  /**
   * Remove excessive whitespace
   */
  private removeExcessiveWhitespace(text: string): string {
    return text
      .replace(/\n\s*\n\s*\n/g, '\n\n') // Remove triple+ newlines
      .replace(/[ \t]+/g, ' ') // Collapse multiple spaces
      .replace(/\n +/g, '\n') // Remove leading spaces on lines
      .trim();
  }

  /**
   * Compress repeated patterns
   */
  private compressRepeatedPatterns(text: string): string {
    // Find and compress repeated bullet points
    let compressed = text.replace(/(\n- [^\n]+){3,}/g, match => {
      const items = match.split('\n').filter(Boolean);
      if (items.length > 5) {
        return items.slice(0, 3).join('\n') + `\n- ... (${items.length - 3} more)`;
      }
      return match;
    });

    return compressed;
  }

  /**
   * Apply common abbreviations
   */
  private applyAbbreviations(text: string): string {
    const abbreviations: Record<string, string> = {
      'for example': 'e.g.',
      'that is': 'i.e.',
      'and so on': 'etc.',
      'versus': 'vs',
      'approximately': '~',
      'percent': '%',
      'number': '#',
      'at symbol': '@'
    };

    let abbreviated = text;

    for (const [full, abbrev] of Object.entries(abbreviations)) {
      const pattern = new RegExp(`\\b${full}\\b`, 'gi');
      abbreviated = abbreviated.replace(pattern, abbrev);
    }

    return abbreviated;
  }

  /**
   * Inject variables into template
   */
  private injectVariables(template: string, variables: Record<string, any>): string {
    let result = template;

    for (const [key, value] of Object.entries(variables)) {
      const pattern = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      result = result.replace(pattern, String(value));
    }

    return result;
  }

  /**
   * Create a hierarchical template structure
   */
  createHierarchical(sections: Array<{ title: string; content: string; level: number }>): string {
    let output = '';

    for (const section of sections) {
      const prefix = '#'.repeat(section.level);
      output += `${prefix} ${section.title}\n\n`;
      output += `${section.content}\n\n`;
    }

    return output;
  }

  /**
   * Optimize multiple templates
   */
  batchOptimize(templates: Template[]): OptimizedTemplate[] {
    return templates.map(t => this.optimize(t));
  }

  /**
   * Calculate compression ratio
   */
  getCompressionRatio(original: string, optimized: string): number {
    const originalLength = original.length;
    const optimizedLength = optimized.length;

    if (originalLength === 0) return 0;

    return (originalLength - optimizedLength) / originalLength;
  }

  /**
   * Validate template structure
   */
  validate(template: Template): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check for required fields
    if (!template.name) {
      errors.push('Template name is required');
    }

    if (!template.structure) {
      errors.push('Template structure is required');
    }

    // Check for unresolved variables
    const variablePattern = /\{\{([^}]+)\}\}/g;
    const matches = template.structure.matchAll(variablePattern);

    for (const match of matches) {
      const varName = match[1];
      if (!(varName in template.variables)) {
        errors.push(`Unresolved variable: ${varName}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

/**
 * Default template optimizer instance
 */
export const templateOptimizer = new TemplateOptimizer();
