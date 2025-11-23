import { promises as fs } from 'fs';
import { glob } from 'glob';
import { SkillMetadata, SkillRegistryEntry, LoadingStage } from './types';
import { SkillParser } from './skill-parser';

/**
 * Manages skill discovery and indexing
 *
 * The registry maintains metadata for all skills (lightweight, ~50 tokens per skill)
 * allowing intelligent matching without loading full skill content.
 */
export class SkillRegistry {
  private entries: Map<string, SkillRegistryEntry> = new Map();
  private parser: SkillParser;
  private skillsDir: string;

  constructor(skillsDir: string) {
    this.skillsDir = skillsDir;
    this.parser = new SkillParser();
  }

  /**
   * Index all skills in the skills directory
   */
  async indexSkills(): Promise<void> {
    const skillFiles = await glob('**/SKILL.md', {
      cwd: this.skillsDir,
      absolute: true
    });

    for (const skillPath of skillFiles) {
      try {
        await this.indexSkill(skillPath);
      } catch (error) {
        console.warn(`Failed to index skill: ${skillPath}`, error);
      }
    }

    console.log(`Indexed ${this.entries.size} skills`);
  }

  /**
   * Index a single skill file
   */
  private async indexSkill(skillPath: string): Promise<void> {
    // Parse metadata only for indexing
    const skill = await this.parser.parseSkill(
      skillPath,
      LoadingStage.METADATA_ONLY
    );

    const stat = await fs.stat(skillPath);

    this.entries.set(skill.metadata.name, {
      metadata: skill.metadata,
      path: skillPath,
      lastModified: stat.mtime,
      indexed: true
    });
  }

  /**
   * Get all registered skills
   */
  getAll(): SkillRegistryEntry[] {
    return Array.from(this.entries.values());
  }

  /**
   * Get skill by name
   */
  get(name: string): SkillRegistryEntry | undefined {
    return this.entries.get(name);
  }

  /**
   * Find skills matching criteria
   */
  find(predicate: (entry: SkillRegistryEntry) => boolean): SkillRegistryEntry[] {
    return Array.from(this.entries.values()).filter(predicate);
  }

  /**
   * Find skills by keyword
   */
  findByKeyword(keyword: string): SkillRegistryEntry[] {
    const lowerKeyword = keyword.toLowerCase();
    return this.find(entry =>
      entry.metadata.triggers.keywords?.some(k =>
        k.toLowerCase().includes(lowerKeyword)
      ) ?? false
    );
  }

  /**
   * Find skills by category
   */
  findByCategory(category: SkillMetadata['category']): SkillRegistryEntry[] {
    return this.find(entry => entry.metadata.category === category);
  }

  /**
   * Find skills by project type
   */
  findByProjectType(projectType: string): SkillRegistryEntry[] {
    return this.find(entry =>
      entry.metadata.context?.projectTypes?.includes(projectType) ?? false
    );
  }

  /**
   * Find skills by command trigger
   */
  findByCommand(command: string): SkillRegistryEntry[] {
    return this.find(entry =>
      entry.metadata.triggers.commands?.includes(command) ?? false
    );
  }

  /**
   * Find skills by event trigger
   */
  findByEvent(eventType: string): SkillRegistryEntry[] {
    return this.find(entry =>
      entry.metadata.triggers.events?.includes(eventType) ?? false
    );
  }

  /**
   * Get total token cost for metadata of all skills
   */
  getTotalMetadataTokens(): number {
    return Array.from(this.entries.values()).reduce(
      (total, entry) => total + entry.metadata.tokenCost.metadata,
      0
    );
  }

  /**
   * Get registry statistics
   */
  getStats() {
    const entries = Array.from(this.entries.values());

    return {
      totalSkills: this.entries.size,
      metadataTokens: this.getTotalMetadataTokens(),
      categories: {
        core: entries.filter(e => e.metadata.category === 'core').length,
        domain: entries.filter(e => e.metadata.category === 'domain').length,
        superclaude: entries.filter(e => e.metadata.category === 'superclaude').length,
        meta: entries.filter(e => e.metadata.category === 'meta').length
      },
      priority: {
        high: entries.filter(e => e.metadata.priority === 'high').length,
        medium: entries.filter(e => e.metadata.priority === 'medium').length,
        low: entries.filter(e => e.metadata.priority === 'low').length
      }
    };
  }
}
