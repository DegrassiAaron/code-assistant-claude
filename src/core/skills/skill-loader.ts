import { Skill, LoadingStage, ActivationContext, SkillMetadata } from './types';
import { SkillRegistry } from './skill-registry';
import { SkillParser } from './skill-parser';
import { TokenTracker } from './token-tracker';
import { CacheManager } from './cache-manager';

/**
 * Manages progressive skill loading with caching and token tracking
 *
 * Central orchestrator for the skills system that:
 * - Matches skills to activation contexts
 * - Loads skills progressively (metadata → full → resources)
 * - Tracks token consumption
 * - Manages caching for performance
 */
export class SkillLoader {
  private registry: SkillRegistry;
  private parser: SkillParser;
  private tokenTracker: TokenTracker;
  private cache: CacheManager;

  // Currently loaded skills
  private loadedSkills: Map<string, Skill> = new Map();

  constructor(skillsDir: string, cacheSize: number = 50, cacheTTL: number = 1000 * 60 * 30) {
    this.registry = new SkillRegistry(skillsDir);
    this.parser = new SkillParser();
    this.tokenTracker = new TokenTracker();
    this.cache = new CacheManager(cacheSize, cacheTTL);
  }

  /**
   * Initialize loader by indexing all skills
   */
  async initialize(): Promise<void> {
    await this.registry.indexSkills();

    // Track metadata tokens
    const metadataTokens = this.registry.getTotalMetadataTokens();
    this.tokenTracker.trackSystemUsage('skills_metadata', metadataTokens);
  }

  /**
   * Match skills to activation context
   */
  async matchSkills(context: ActivationContext): Promise<string[]> {
    const allSkills = this.registry.getAll();
    const matches: string[] = [];

    for (const entry of allSkills) {
      if (this.shouldActivate(entry.metadata, context)) {
        matches.push(entry.metadata.name);
      }
    }

    // Sort by priority
    return this.sortByPriority(matches);
  }

  /**
   * Load matched skills progressively
   */
  async loadSkills(
    skillNames: string[],
    stage: LoadingStage = LoadingStage.FULL_CONTENT
  ): Promise<Skill[]> {
    const skills: Skill[] = [];

    for (const skillName of skillNames) {
      const skill = await this.loadSkill(skillName, stage);
      if (skill) {
        skills.push(skill);
      }
    }

    return skills;
  }

  /**
   * Load a single skill with caching
   */
  private async loadSkill(
    skillName: string,
    stage: LoadingStage
  ): Promise<Skill | null> {
    // Check if already loaded at requested stage or higher
    const cached = this.loadedSkills.get(skillName);
    if (cached && this.isStageLoaded(cached.loaded, stage)) {
      return cached;
    }

    // Check cache manager
    const cachedSkill = await this.cache.get(skillName, stage);
    if (cachedSkill) {
      this.loadedSkills.set(skillName, cachedSkill);
      return cachedSkill;
    }

    // Load from file system
    const entry = this.registry.get(skillName);
    if (!entry) {
      console.warn(`Skill not found: ${skillName}`);
      return null;
    }

    try {
      const skill = await this.parser.parseSkill(entry.path, stage);

      // Track tokens
      this.tokenTracker.trackSkillUsage(
        skillName,
        stage,
        skill.tokensConsumed
      );

      // Cache skill
      await this.cache.set(skillName, skill);

      // Store in loaded skills
      this.loadedSkills.set(skillName, skill);

      return skill;
    } catch (error) {
      console.error(`Failed to load skill: ${skillName}`, error);
      return null;
    }
  }

  /**
   * Check if skill should be activated based on context
   */
  private shouldActivate(
    metadata: SkillMetadata,
    context: ActivationContext
  ): boolean {
    const { triggers } = metadata;
    const { userMessage, currentCommand, eventType, projectType } = context;

    // Check keywords
    if (triggers.keywords) {
      const messageLower = userMessage.toLowerCase();
      if (triggers.keywords.some(k => messageLower.includes(k.toLowerCase()))) {
        return true;
      }
    }

    // Check patterns (regex)
    if (triggers.patterns) {
      if (triggers.patterns.some(p => new RegExp(p, 'i').test(userMessage))) {
        return true;
      }
    }

    // Check commands
    if (triggers.commands && currentCommand) {
      if (triggers.commands.includes(currentCommand)) {
        return true;
      }
    }

    // Check events
    if (triggers.events && eventType) {
      if (triggers.events.includes(eventType)) {
        return true;
      }
    }

    // Check project type compatibility
    if (metadata.context?.projectTypes && projectType) {
      if (!metadata.context.projectTypes.includes(projectType)) {
        return false;
      }
    }

    return false;
  }

  /**
   * Sort skill names by priority
   */
  private sortByPriority(skillNames: string[]): string[] {
    const priorityMap: Record<string, number> = {
      high: 3,
      medium: 2,
      low: 1
    };

    return skillNames.sort((a, b) => {
      const entryA = this.registry.get(a);
      const entryB = this.registry.get(b);

      if (!entryA || !entryB) return 0;

      const priorityA = priorityMap[entryA.metadata.priority] ?? 0;
      const priorityB = priorityMap[entryB.metadata.priority] ?? 0;

      return priorityB - priorityA; // Higher priority first
    });
  }

  /**
   * Check if a stage includes another stage
   */
  private isStageLoaded(loaded: LoadingStage, requested: LoadingStage): boolean {
    const stages = [
      LoadingStage.METADATA_ONLY,
      LoadingStage.FULL_CONTENT,
      LoadingStage.WITH_RESOURCES
    ];

    return stages.indexOf(loaded) >= stages.indexOf(requested);
  }

  /**
   * Unload skill to free memory
   */
  unloadSkill(skillName: string): void {
    const skill = this.loadedSkills.get(skillName);
    if (skill) {
      this.tokenTracker.trackSkillUnload(skillName, skill.tokensConsumed);
      this.loadedSkills.delete(skillName);
    }
  }

  /**
   * Unload all skills
   */
  unloadAll(): void {
    for (const skillName of this.loadedSkills.keys()) {
      this.unloadSkill(skillName);
    }
  }

  /**
   * Get currently loaded skills
   */
  getLoadedSkills(): Skill[] {
    return Array.from(this.loadedSkills.values());
  }

  /**
   * Get total tokens consumed by loaded skills
   */
  getTotalTokensConsumed(): number {
    return this.tokenTracker.getTotalTokens();
  }

  /**
   * Get token usage report
   */
  getTokenReport(): string {
    return this.tokenTracker.getReport();
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return this.cache.getStats();
  }

  /**
   * Get registry statistics
   */
  getRegistryStats() {
    return this.registry.getStats();
  }

  /**
   * Clear all caches
   */
  clearCaches(): void {
    this.cache.clear();
    this.loadedSkills.clear();
  }
}
