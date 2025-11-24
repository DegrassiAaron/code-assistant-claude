import { promises as fs } from 'fs';
import path from 'path';

export interface DocumentationContext {
  purpose: string;
  domain: string[];
  conventions: {
    gitWorkflow?: 'gitflow' | 'github-flow' | 'trunk-based';
    commitStyle?: 'conventional' | 'custom';
  };
  customInstructions: string[];
}

export class DocumentationAnalyzer {
  async analyze(projectRoot: string): Promise<DocumentationContext> {
    const context: DocumentationContext = {
      purpose: '',
      domain: [],
      conventions: {},
      customInstructions: [],
    };

    // Try to read various documentation files
    await this.readClaudeMd(projectRoot, context);
    await this.readReadme(projectRoot, context);
    await this.readContributing(projectRoot, context);

    return context;
  }

  private async readClaudeMd(
    root: string,
    context: DocumentationContext
  ): Promise<void> {
    try {
      const content = await fs.readFile(path.join(root, 'CLAUDE.md'), 'utf-8');

      // Extract purpose from first paragraph or header
      const lines = content.split('\n');
      for (const line of lines) {
        if (line.trim() && !line.startsWith('#') && !context.purpose) {
          context.purpose = line.trim();
          break;
        }
      }

      // Extract domain keywords
      context.domain = this.extractDomain(content);

      // Extract conventions
      if (content.toLowerCase().includes('gitflow')) {
        context.conventions.gitWorkflow = 'gitflow';
      } else if (content.toLowerCase().includes('github flow')) {
        context.conventions.gitWorkflow = 'github-flow';
      } else if (content.toLowerCase().includes('trunk-based')) {
        context.conventions.gitWorkflow = 'trunk-based';
      }

      if (content.toLowerCase().includes('conventional commit')) {
        context.conventions.commitStyle = 'conventional';
      }

      // Extract custom instructions (sections starting with ##)
      const instructionPattern = /##\s+(.+)/g;
      let match;
      while ((match = instructionPattern.exec(content)) !== null) {
        if (match[1]) {
          context.customInstructions.push(match[1].trim());
        }
      }
    } catch {
      // CLAUDE.md doesn't exist, skip
    }
  }

  private async readReadme(
    root: string,
    context: DocumentationContext
  ): Promise<void> {
    try {
      const content = await fs.readFile(path.join(root, 'README.md'), 'utf-8');

      // If no purpose from CLAUDE.md, try README
      if (!context.purpose) {
        // Get first paragraph after title
        const lines = content.split('\n').filter((l) => l.trim());
        for (let i = 0; i < lines.length; i++) {
          const currentLine = lines[i];
          const nextLine = lines[i + 1];
          if (currentLine && currentLine.startsWith('#') && nextLine) {
            const trimmedNext = nextLine.trim();
            if (trimmedNext && !trimmedNext.startsWith('#')) {
              context.purpose = trimmedNext;
              break;
            }
          }
        }
      }

      // Add domain keywords
      const domains = this.extractDomain(content);
      context.domain = [...new Set([...context.domain, ...domains])];
    } catch {
      // README.md doesn't exist, skip
    }
  }

  private async readContributing(
    root: string,
    context: DocumentationContext
  ): Promise<void> {
    try {
      const content = await fs.readFile(
        path.join(root, 'CONTRIBUTING.md'),
        'utf-8'
      );

      // Extract commit conventions
      if (content.toLowerCase().includes('conventional commit')) {
        context.conventions.commitStyle = 'conventional';
      }

      // Extract git workflow if not already found
      if (!context.conventions.gitWorkflow) {
        if (
          content.toLowerCase().includes('gitflow') ||
          (content.includes('feature/') && content.includes('develop'))
        ) {
          context.conventions.gitWorkflow = 'gitflow';
        } else if (content.toLowerCase().includes('github flow')) {
          context.conventions.gitWorkflow = 'github-flow';
        }
      }
    } catch {
      // CONTRIBUTING.md doesn't exist, skip
    }
  }

  private extractDomain(text: string): string[] {
    const domains: string[] = [];
    const lowerText = text.toLowerCase();

    // Common domain keywords
    const domainKeywords = {
      'e-commerce': [
        'ecommerce',
        'e-commerce',
        'shopping',
        'cart',
        'checkout',
        'payment',
        'store',
      ],
      healthcare: [
        'healthcare',
        'health',
        'medical',
        'patient',
        'hospital',
        'clinic',
      ],
      finance: [
        'finance',
        'financial',
        'banking',
        'payment',
        'transaction',
        'ledger',
      ],
      education: [
        'education',
        'learning',
        'course',
        'student',
        'teacher',
        'school',
      ],
      social: ['social', 'messaging', 'chat', 'feed', 'post', 'comment'],
      analytics: [
        'analytics',
        'dashboard',
        'metrics',
        'reporting',
        'visualization',
      ],
      productivity: [
        'productivity',
        'task',
        'todo',
        'project management',
        'collaboration',
      ],
      content: ['content', 'cms', 'blog', 'article', 'publishing'],
      iot: ['iot', 'sensor', 'device', 'embedded', 'hardware'],
      'ai-ml': [
        'ai',
        'machine learning',
        'ml',
        'neural network',
        'deep learning',
      ],
    };

    for (const [domain, keywords] of Object.entries(domainKeywords)) {
      if (keywords.some((keyword) => lowerText.includes(keyword))) {
        domains.push(domain);
      }
    }

    return domains;
  }
}
