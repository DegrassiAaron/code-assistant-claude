import { promises as fs } from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { Skill, SkillMetadata, LoadingStage, SkillResource } from './types';

/**
 * Parses skill files and extracts metadata and content
 *
 * Implements progressive loading:
 * - METADATA_ONLY: Parse only YAML frontmatter (~30-50 tokens)
 * - FULL_CONTENT: Parse frontmatter + markdown body (~1500-3000 tokens)
 * - WITH_RESOURCES: Load all resources (~500-2000 additional tokens)
 */
export class SkillParser {
  /**
   * Parse skill file and extract metadata + content
   * @param skillPath - Absolute path to SKILL.md file
   * @param stage - Loading stage (metadata only or full content)
   */
  async parseSkill(
    skillPath: string,
    stage: LoadingStage = LoadingStage.METADATA_ONLY
  ): Promise<Skill> {
    const content = await fs.readFile(skillPath, 'utf-8');

    // Extract YAML frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]+?)\n---/);
    if (!frontmatterMatch) {
      throw new Error(`Invalid skill file: missing frontmatter in ${skillPath}`);
    }

    const yamlContent = frontmatterMatch[1];
    if (!yamlContent) {
      throw new Error(`Invalid skill file: empty frontmatter in ${skillPath}`);
    }

    const metadata = yaml.load(yamlContent) as SkillMetadata;
    if (!metadata) {
      throw new Error(`Invalid skill file: failed to parse frontmatter in ${skillPath}`);
    }

    // Validate metadata
    this.validateMetadata(metadata);

    // Calculate tokens for metadata
    const metadataTokens = this.estimateTokens(frontmatterMatch[0]);

    // Return based on loading stage
    if (stage === LoadingStage.METADATA_ONLY) {
      return {
        metadata,
        content: '',
        loaded: LoadingStage.METADATA_ONLY,
        loadedAt: new Date(),
        tokensConsumed: metadataTokens
      };
    }

    // Extract full content (everything after frontmatter)
    const bodyContent = content.substring(frontmatterMatch[0].length).trim();
    const fullTokens = metadataTokens + this.estimateTokens(bodyContent);

    const skill: Skill = {
      metadata,
      content: bodyContent,
      loaded: LoadingStage.FULL_CONTENT,
      loadedAt: new Date(),
      tokensConsumed: fullTokens
    };

    // Load resources if requested
    if (stage === LoadingStage.WITH_RESOURCES) {
      const resources = await this.loadResources(skillPath);
      skill.resources = resources;
      skill.loaded = LoadingStage.WITH_RESOURCES;
      skill.tokensConsumed = fullTokens + this.calculateResourceTokens(resources);
    }

    return skill;
  }

  /**
   * Load skill resources (templates, scripts, etc.)
   */
  private async loadResources(skillPath: string): Promise<SkillResource[]> {
    const skillDir = path.dirname(skillPath);
    const resourcesDir = path.join(skillDir, 'resources');

    try {
      const files = await fs.readdir(resourcesDir);
      const resources: SkillResource[] = [];

      for (const file of files) {
        if (file === '.gitkeep') continue;

        const resourcePath = path.join(resourcesDir, file);
        const stat = await fs.stat(resourcePath);

        if (stat.isFile()) {
          const content = await fs.readFile(resourcePath, 'utf-8');
          resources.push({
            name: file,
            type: this.detectResourceType(file),
            path: resourcePath,
            content,
            loaded: true
          });
        }
      }

      return resources;
    } catch (error) {
      // Resources directory doesn't exist or is empty
      return [];
    }
  }

  /**
   * Detect resource type from file extension
   */
  private detectResourceType(filename: string): SkillResource['type'] {
    const ext = path.extname(filename).toLowerCase();

    if (ext === '.json') return 'config';
    if (ext === '.js' || ext === '.ts') return 'script';
    if (ext === '.md') return 'reference';
    return 'template';
  }

  /**
   * Validate skill metadata against schema
   */
  private validateMetadata(metadata: SkillMetadata): void {
    // Required fields
    if (!metadata.name) throw new Error('Skill metadata missing required field: name');
    if (!metadata.description) throw new Error('Skill metadata missing required field: description');
    if (!metadata.category) throw new Error('Skill metadata missing required field: category');

    // Validate category
    const validCategories = ['core', 'domain', 'superclaude', 'meta'];
    if (!validCategories.includes(metadata.category)) {
      throw new Error(`Invalid category: ${metadata.category}`);
    }

    // Validate triggers
    if (!metadata.triggers || Object.keys(metadata.triggers).length === 0) {
      throw new Error('Skill must have at least one trigger');
    }

    // Validate token costs
    if (!metadata.tokenCost) {
      throw new Error('Skill metadata missing required field: tokenCost');
    }
  }

  /**
   * Estimate token count for text using simple heuristic
   * (Will be replaced with tiktoken in production)
   */
  private estimateTokens(text: string): number {
    // Simple estimation: ~4 characters per token
    return Math.ceil(text.length / 4);
  }

  /**
   * Calculate total tokens for resources
   */
  private calculateResourceTokens(resources: SkillResource[]): number {
    return resources.reduce((total, resource) => {
      return total + (resource.content ? this.estimateTokens(resource.content) : 0);
    }, 0);
  }
}
