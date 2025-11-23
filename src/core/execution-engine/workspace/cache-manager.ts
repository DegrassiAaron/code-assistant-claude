import { ExecutionResult, CacheEntry } from '../types';
import crypto from 'crypto';

/**
 * Manages caching of execution results
 * Reduces redundant executions for identical code
 */
export class CacheManager {
  private cache: Map<string, CacheEntry> = new Map();
  private defaultTTL: number = 3600000; // 1 hour in milliseconds

  /**
   * Get cached result
   */
  get(code: string): ExecutionResult | null {
    const key = this.generateKey(code);
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if expired
    if (entry.expiresAt < new Date()) {
      this.cache.delete(key);
      return null;
    }

    // Update hit count
    entry.hits++;

    return entry.value;
  }

  /**
   * Set cache entry
   */
  set(code: string, result: ExecutionResult, ttl?: number): void {
    const key = this.generateKey(code);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + (ttl || this.defaultTTL));

    const entry: CacheEntry = {
      key,
      value: result,
      createdAt: now,
      expiresAt,
      hits: 0
    };

    this.cache.set(key, entry);
  }

  /**
   * Delete cache entry
   */
  delete(code: string): boolean {
    const key = this.generateKey(code);
    return this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Clean up expired entries
   */
  cleanup(): number {
    const now = new Date();
    let removed = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiresAt < now) {
        this.cache.delete(key);
        removed++;
      }
    }

    return removed;
  }

  /**
   * Generate cache key from code
   */
  private generateKey(code: string): string {
    return crypto.createHash('sha256').update(code).digest('hex');
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    size: number;
    totalHits: number;
    entries: Array<{ key: string; hits: number; age: number }>;
  } {
    const now = new Date();
    const entries: Array<{ key: string; hits: number; age: number }> = [];
    let totalHits = 0;

    for (const [key, entry] of this.cache.entries()) {
      const age = now.getTime() - entry.createdAt.getTime();
      entries.push({ key, hits: entry.hits, age });
      totalHits += entry.hits;
    }

    return {
      size: this.cache.size,
      totalHits,
      entries: entries.sort((a, b) => b.hits - a.hits)
    };
  }

  /**
   * Set default TTL
   */
  setDefaultTTL(milliseconds: number): void {
    this.defaultTTL = milliseconds;
  }
}
