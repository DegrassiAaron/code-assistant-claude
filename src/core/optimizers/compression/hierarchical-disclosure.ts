/**
 * Hierarchical Disclosure
 * Progressive disclosure system to show only what's needed
 */

export interface DisclosureLevel {
  level: number;
  title: string;
  summary: string;
  details?: string;
  children?: DisclosureLevel[];
}

export interface DisclosureOptions {
  maxDepth: number;
  includeSummaries: boolean;
  collapseThreshold: number;
}

export interface DisclosedContent {
  rendered: string;
  tokensUsed: number;
  totalAvailable: number;
  compressionRatio: number;
}

/**
 * Hierarchical Disclosure System
 * Shows only what's needed at each level
 */
export class HierarchicalDisclosure {
  private defaultOptions: DisclosureOptions = {
    maxDepth: 3,
    includeSummaries: true,
    collapseThreshold: 5,
  };

  /**
   * Create hierarchical content from flat structure
   */
  createHierarchy(
    sections: Array<{ title: string; content: string; level: number }>
  ): DisclosureLevel[] {
    const root: DisclosureLevel[] = [];
    const stack: DisclosureLevel[] = [];

    for (const section of sections) {
      const node: DisclosureLevel = {
        level: section.level,
        title: section.title,
        summary: this.generateSummary(section.content),
        details: section.content,
        children: [],
      };

      // Find parent
      while (
        stack.length > 0 &&
        (stack[stack.length - 1]?.level || 0) >= node.level
      ) {
        stack.pop();
      }

      if (stack.length === 0) {
        root.push(node);
      } else {
        const parent = stack[stack.length - 1];
        if (parent) {
          if (!parent.children) parent.children = [];
          parent.children.push(node);
        }
      }

      stack.push(node);
    }

    return root;
  }

  /**
   * Disclose content at specified depth
   */
  disclose(
    hierarchy: DisclosureLevel[],
    depth: number,
    options?: Partial<DisclosureOptions>
  ): DisclosedContent {
    const opts = { ...this.defaultOptions, ...options };
    const rendered = this.renderHierarchy(hierarchy, depth, opts);
    const tokensUsed = this.estimateTokens(rendered);
    const totalContent = this.renderHierarchy(
      hierarchy,
      Number.MAX_SAFE_INTEGER,
      opts
    );
    const totalAvailable = this.estimateTokens(totalContent);

    return {
      rendered,
      tokensUsed,
      totalAvailable,
      compressionRatio: 1 - tokensUsed / totalAvailable,
    };
  }

  /**
   * Render hierarchy to specified depth
   */
  private renderHierarchy(
    nodes: DisclosureLevel[],
    maxDepth: number,
    options: DisclosureOptions,
    currentDepth = 0
  ): string {
    let output = '';

    for (const node of nodes) {
      const indent = '  '.repeat(currentDepth);
      const prefix = '#'.repeat(node.level);

      // Render title
      output += `${indent}${prefix} ${node.title}\n\n`;

      if (currentDepth < maxDepth) {
        // Show details if within depth
        if (node.details) {
          output += `${indent}${node.details}\n\n`;
        }

        // Render children
        if (node.children && node.children.length > 0) {
          if (
            node.children.length > options.collapseThreshold &&
            currentDepth === maxDepth - 1
          ) {
            // Collapse if too many children
            output += `${indent}*[${node.children.length} subsections collapsed]*\n\n`;
          } else {
            output += this.renderHierarchy(
              node.children,
              maxDepth,
              options,
              currentDepth + 1
            );
          }
        }
      } else {
        // Show summary only
        if (options.includeSummaries) {
          output += `${indent}${node.summary}\n\n`;
        }

        if (node.children && node.children.length > 0) {
          output += `${indent}*[${node.children.length} subsections available]*\n\n`;
        }
      }
    }

    return output;
  }

  /**
   * Generate summary from content
   */
  private generateSummary(content: string, maxLength = 100): string {
    if (content.length <= maxLength) {
      return content;
    }

    // Try to break at sentence boundary
    const sentences = content.split(/[.!?]\s+/);
    if (sentences.length > 0 && (sentences[0]?.length || 0) <= maxLength) {
      return (sentences[0] || '') + '.';
    }

    // Otherwise truncate
    return content.substring(0, maxLength - 3) + '...';
  }

  /**
   * Estimate tokens in text
   */
  private estimateTokens(text: string): number {
    // Rough estimate: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4);
  }

  /**
   * Create table of contents
   */
  createTOC(hierarchy: DisclosureLevel[], maxDepth = 3): string {
    let toc = '## Table of Contents\n\n';
    toc += this.renderTOC(hierarchy, maxDepth);
    return toc;
  }

  /**
   * Render TOC recursively
   */
  private renderTOC(
    nodes: DisclosureLevel[],
    maxDepth: number,
    currentDepth = 0
  ): string {
    if (currentDepth >= maxDepth) return '';

    let toc = '';

    for (const node of nodes) {
      const indent = '  '.repeat(currentDepth);
      toc += `${indent}- ${node.title}\n`;

      if (node.children && node.children.length > 0) {
        toc += this.renderTOC(node.children, maxDepth, currentDepth + 1);
      }
    }

    return toc;
  }

  /**
   * Expand specific section by path
   */
  expandSection(
    hierarchy: DisclosureLevel[],
    path: number[],
    options?: Partial<DisclosureOptions>
  ): DisclosedContent {
    const opts = { ...this.defaultOptions, ...options };
    let current = hierarchy;
    let selectedNode: DisclosureLevel | null = null;

    // Navigate to the specified path
    for (const index of path) {
      if (index >= current.length) break;
      selectedNode = current[index] || null;
      current = selectedNode?.children || [];
    }

    if (!selectedNode) {
      return {
        rendered: '',
        tokensUsed: 0,
        totalAvailable: 0,
        compressionRatio: 0,
      };
    }

    // Render the selected section
    const rendered = this.renderHierarchy([selectedNode], opts.maxDepth, opts);
    const tokensUsed = this.estimateTokens(rendered);

    return {
      rendered,
      tokensUsed,
      totalAvailable: tokensUsed,
      compressionRatio: 0,
    };
  }

  /**
   * Get disclosure statistics
   */
  getStats(hierarchy: DisclosureLevel[]): {
    totalSections: number;
    maxDepth: number;
    avgChildrenPerSection: number;
  } {
    let totalSections = 0;
    let maxDepth = 0;
    let totalChildren = 0;
    let sectionsWithChildren = 0;

    const traverse = (nodes: DisclosureLevel[], depth: number) => {
      maxDepth = Math.max(maxDepth, depth);

      for (const node of nodes) {
        totalSections++;

        if (node.children && node.children.length > 0) {
          totalChildren += node.children.length;
          sectionsWithChildren++;
          traverse(node.children, depth + 1);
        }
      }
    };

    traverse(hierarchy, 1);

    return {
      totalSections,
      maxDepth,
      avgChildrenPerSection:
        sectionsWithChildren > 0 ? totalChildren / sectionsWithChildren : 0,
    };
  }
}

/**
 * Default hierarchical disclosure instance
 */
export const hierarchicalDisclosure = new HierarchicalDisclosure();
