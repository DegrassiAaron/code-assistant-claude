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
      updateAgeOnHas: true
    });
  }

  /**
   * Get skill from cache
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
   */
  async set(skillName: string, skill: Skill): Promise<void> {
    const key = this.getCacheKey(skillName, skill.loaded);
    this.cache.set(key, skill);
  }

  /**
   * Check if skill is in cache
   */
  has(skillName: string, stage: LoadingStage): boolean {
    const key = this.getCacheKey(skillName, stage);
    return this.cache.has(key);
  }

  /**
   * Remove skill from cache
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
   */
  clear(): void {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    return {
      size: this.cache.size,
      max: this.cache.max || 0,
      hits: this.hits,
      misses: this.misses
    };
  }

  /**
   * Get cache hit rate
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
   */
  prune(): void {
    this.cache.purgeStale();
  }

  /**
   * Get all cached skill names
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
