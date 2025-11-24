import { LRUCache } from 'lru-cache';
import { Skill, LoadingStage, CacheStats } from './types';

/**
 * Manages caching of loaded skills
 *
 * Uses LRU (Least Recently Used) eviction policy to:
 * - Reduce file system reads
 * - Speed up skill activation
 * - Manage memory efficiently
 */
export class CacheManager {
  private cache: LRUCache<string, Skill>;
  private hits: number = 0;
  private misses: number = 0;

  constructor(maxSize: number = 50, ttl: number = 1000 * 60 * 30) {
    this.cache = new LRUCache({
      max: maxSize,
      ttl, // 30 minutes default
      updateAgeOnGet: true,
      updateAgeOnHas: true,
    });
  }

  /**
   * Get skill from cache
   *
   * Retrieves a cached skill at the specified loading stage. Updates the
   * skill's age to implement LRU eviction policy.
   *
   * @param skillName - Name of the skill to retrieve
   * @param stage - Loading stage of the cached skill
   * @returns The cached skill or null if not found
   *
   * @example
   * ```typescript
   * const skill = await cache.get('code-reviewer', LoadingStage.FULL_CONTENT);
   * if (skill) {
   *   console.log('Cache hit!');
   * }
   * ```
   */
  async get(skillName: string, stage: LoadingStage): Promise<Skill | null> {
    const key = this.getCacheKey(skillName, stage);
    const cached = this.cache.get(key);

    if (cached) {
      this.hits++;
      return cached;
    }

    this.misses++;
    return null;
  }

  /**
   * Set skill in cache
   *
   * Stores a skill in the cache with LRU eviction. If the cache is full,
   * the least recently used skill will be evicted.
   *
   * @param skillName - Name of the skill to cache
   * @param skill - The skill object to cache
   *
   * @example
   * ```typescript
   * await cache.set('code-reviewer', loadedSkill);
   * ```
   */
  async set(skillName: string, skill: Skill): Promise<void> {
    const key = this.getCacheKey(skillName, skill.loaded);
    this.cache.set(key, skill);
  }

  /**
   * Check if skill is in cache
   *
   * Checks for the presence of a skill at the specified loading stage
   * without retrieving it. Updates the skill's age for LRU eviction.
   *
   * @param skillName - Name of the skill to check
   * @param stage - Loading stage to check for
   * @returns true if the skill is cached at the specified stage
   */
  has(skillName: string, stage: LoadingStage): boolean {
    const key = this.getCacheKey(skillName, stage);
    return this.cache.has(key);
  }

  /**
   * Remove skill from cache
   *
   * Deletes a skill from the cache. If stage is specified, only that stage
   * is removed. If stage is omitted, all stages for the skill are removed.
   *
   * @param skillName - Name of the skill to remove
   * @param stage - Optional loading stage to remove (if omitted, removes all stages)
   *
   * @example
   * ```typescript
   * // Remove only full content stage
   * cache.delete('code-reviewer', LoadingStage.FULL_CONTENT);
   *
   * // Remove all stages
   * cache.delete('code-reviewer');
   * ```
   */
  delete(skillName: string, stage?: LoadingStage): void {
    if (stage) {
      const key = this.getCacheKey(skillName, stage);
      this.cache.delete(key);
    } else {
      // Remove all stages for this skill
      for (const stageValue of Object.values(LoadingStage)) {
        const key = this.getCacheKey(skillName, stageValue);
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear cache
   *
   * Removes all cached skills and resets statistics (hits/misses).
   * Use this when you want to force reload all skills from disk.
   */
  clear(): void {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * Get cache statistics
   *
   * Returns detailed statistics about cache performance including:
   * - Current size (number of cached skills)
   * - Maximum size
   * - Number of cache hits
   * - Number of cache misses
   *
   * @returns Cache statistics object
   *
   * @example
   * ```typescript
   * const stats = cache.getStats();
   * console.log(`Hit rate: ${(stats.hits / (stats.hits + stats.misses) * 100).toFixed(1)}%`);
   * ```
   */
  getStats(): CacheStats {
    return {
      size: this.cache.size,
      max: this.cache.max || 0,
      hits: this.hits,
      misses: this.misses,
    };
  }

  /**
   * Get cache hit rate
   *
   * Calculates the percentage of cache accesses that were hits (0-1).
   * A value of 0.75 means 75% of accesses were cache hits.
   *
   * @returns Hit rate as a decimal (0-1), or 0 if no accesses yet
   */
  getHitRate(): number {
    const total = this.hits + this.misses;
    return total === 0 ? 0 : this.hits / total;
  }

  /**
   * Generate cache key for skill + stage combination
   */
  private getCacheKey(skillName: string, stage: LoadingStage): string {
    return `${skillName}:${stage}`;
  }

  /**
   * Prune expired entries
   *
   * Removes all entries that have exceeded their TTL (time to live).
   * This is called automatically by the LRU cache, but can be called
   * manually to free up memory.
   */
  prune(): void {
    this.cache.purgeStale();
  }

  /**
   * Get all cached skill names
   *
   * Returns a unique list of skill names that are currently cached,
   * regardless of which stages are cached for each skill.
   *
   * @returns Array of unique skill names in the cache
   *
   * @example
   * ```typescript
   * const cachedNames = cache.getCachedSkillNames();
   * console.log(`${cachedNames.length} skills currently cached`);
   * ```
   */
  getCachedSkillNames(): string[] {
    const names = new Set<string>();
    for (const key of this.cache.keys()) {
      const parts = key.split(':');
      if (parts[0]) {
        names.add(parts[0]);
      }
    }
    return Array.from(names);
  }
}
