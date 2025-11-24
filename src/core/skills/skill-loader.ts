import { Skill, LoadingStage, ActivationContext, SkillMetadata } from "./types";
import { SkillRegistry } from "./skill-registry";
import { SkillParser } from "./skill-parser";
import { TokenTracker } from "./token-tracker";
import { CacheManager } from "./cache-manager";
import { Logger, ConsoleLogger } from "./logger";
import {
  DEFAULT_CACHE_SIZE,
  DEFAULT_CACHE_TTL_MS,
  PRIORITY_VALUES,
} from "./constants";

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
  private logger: Logger;

  // Currently loaded skills
  private loadedSkills: Map<string, Skill> = new Map();

  // Pre-compiled regex patterns for performance
  private compiledPatterns: Map<string, RegExp[]> = new Map();

  constructor(
    skillsDir: string,
    cacheSize: number = DEFAULT_CACHE_SIZE,
    cacheTTL: number = DEFAULT_CACHE_TTL_MS,
    logger: Logger = new ConsoleLogger("[SkillLoader]"),
  ) {
    this.registry = new SkillRegistry(skillsDir, logger);
    this.parser = new SkillParser(logger);
    this.tokenTracker = new TokenTracker();
    this.cache = new CacheManager(cacheSize, cacheTTL);
    this.logger = logger;
  }

  /**
   * Initialize loader by indexing all skills
   */
  async initialize(): Promise<void> {
    await this.registry.indexSkills();

    // Track metadata tokens
    const metadataTokens = this.registry.getTotalMetadataTokens();
    this.tokenTracker.trackSystemUsage("skills_metadata", metadataTokens);
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
    stage: LoadingStage = LoadingStage.FULL_CONTENT,
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
    stage: LoadingStage,
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
      this.logger.warn(`Skill not found: ${skillName}`);
      return null;
    }

    try {
      const skill = await this.parser.parseSkill(entry.path, stage);

      // Track tokens
      this.tokenTracker.trackSkillUsage(skillName, stage, skill.tokensConsumed);

      // Cache skill
      await this.cache.set(skillName, skill);

      // Store in loaded skills
      this.loadedSkills.set(skillName, skill);

      this.logger.debug?.(`Loaded skill: ${skillName} at stage: ${stage}`);

      return skill;
    } catch (error) {
      this.logger.error(`Failed to load skill: ${skillName}`, error);
      return null;
    }
  }

  /**
   * Get pre-compiled regex patterns for a skill
   * @param skillName - Skill name
   * @param patterns - Regex pattern strings
   * @returns Compiled RegExp array
   */
  private getCompiledPatterns(skillName: string, patterns: string[]): RegExp[] {
    if (!this.compiledPatterns.has(skillName)) {
      this.compiledPatterns.set(
        skillName,
        patterns.map((p) => new RegExp(p, "i")),
      );
    }
    return this.compiledPatterns.get(skillName)!;
  }

  /**
   * Check if skill should be activated based on context
   */
  private shouldActivate(
    metadata: SkillMetadata,
    context: ActivationContext,
  ): boolean {
    const { triggers } = metadata;
    const { userMessage, currentCommand, eventType, projectType } = context;

    // Check keywords
    if (triggers.keywords) {
      const messageLower = userMessage.toLowerCase();
      if (
        triggers.keywords.some((k) => messageLower.includes(k.toLowerCase()))
      ) {
        return true;
      }
    }

    // Check patterns (regex) - using pre-compiled patterns for performance
    if (triggers.patterns && triggers.patterns.length > 0) {
      const patterns = this.getCompiledPatterns(
        metadata.name,
        triggers.patterns,
      );
      if (patterns.some((p) => p.test(userMessage))) {
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
    return skillNames.sort((a, b) => {
      const entryA = this.registry.get(a);
      const entryB = this.registry.get(b);

      if (!entryA || !entryB) return 0;

      const priorityA = PRIORITY_VALUES[entryA.metadata.priority] ?? 0;
      const priorityB = PRIORITY_VALUES[entryB.metadata.priority] ?? 0;

      return priorityB - priorityA; // Higher priority first
    });
  }

  /**
   * Check if a stage includes another stage
   */
  private isStageLoaded(
    loaded: LoadingStage,
    requested: LoadingStage,
  ): boolean {
    const stages = [
      LoadingStage.METADATA_ONLY,
      LoadingStage.FULL_CONTENT,
      LoadingStage.WITH_RESOURCES,
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
