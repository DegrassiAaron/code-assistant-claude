import { CacheManager } from '../../../src/core/skills/cache-manager';
import { Skill, LoadingStage, SkillMetadata } from '../../../src/core/skills/types';

describe('CacheManager', () => {
  let cache: CacheManager;

  const createMockSkill = (name: string, stage: LoadingStage): Skill => ({
    metadata: {
      name,
      version: '1.0.0',
      description: 'Test skill',
      category: 'core',
      triggers: { keywords: ['test'] },
      tokenCost: { metadata: 40, fullContent: 2000, resources: 500 },
      priority: 'medium',
      autoActivate: true,
      cacheStrategy: 'normal'
    } as SkillMetadata,
    content: 'Test content',
    loaded: stage,
    loadedAt: new Date(),
    tokensConsumed: 2000
  });

  beforeEach(() => {
    cache = new CacheManager(10, 1000 * 60); // 10 items, 1 minute TTL
  });

  describe('set and get', () => {
    it('should cache and retrieve skill', async () => {
      const skill = createMockSkill('test-skill', LoadingStage.FULL_CONTENT);

      await cache.set('test-skill', skill);
      const retrieved = await cache.get('test-skill', LoadingStage.FULL_CONTENT);

      expect(retrieved).toBeDefined();
      expect(retrieved!.metadata.name).toBe('test-skill');
    });

    it('should return null for non-cached skill', async () => {
      const retrieved = await cache.get('non-existent', LoadingStage.FULL_CONTENT);
      expect(retrieved).toBeNull();
    });

    it('should cache different stages separately', async () => {
      const metadataSkill = createMockSkill('skill', LoadingStage.METADATA_ONLY);
      const fullSkill = createMockSkill('skill', LoadingStage.FULL_CONTENT);

      await cache.set('skill', metadataSkill);
      await cache.set('skill', fullSkill);

      const metadata = await cache.get('skill', LoadingStage.METADATA_ONLY);
      const full = await cache.get('skill', LoadingStage.FULL_CONTENT);

      expect(metadata).toBeDefined();
      expect(full).toBeDefined();
      expect(metadata!.loaded).toBe(LoadingStage.METADATA_ONLY);
      expect(full!.loaded).toBe(LoadingStage.FULL_CONTENT);
    });
  });

  describe('has', () => {
    it('should return true for cached skill', async () => {
      const skill = createMockSkill('test-skill', LoadingStage.FULL_CONTENT);
      await cache.set('test-skill', skill);

      expect(cache.has('test-skill', LoadingStage.FULL_CONTENT)).toBe(true);
    });

    it('should return false for non-cached skill', () => {
      expect(cache.has('non-existent', LoadingStage.FULL_CONTENT)).toBe(false);
    });
  });

  describe('delete', () => {
    it('should delete specific stage', async () => {
      const skill = createMockSkill('test-skill', LoadingStage.FULL_CONTENT);
      await cache.set('test-skill', skill);

      cache.delete('test-skill', LoadingStage.FULL_CONTENT);

      expect(cache.has('test-skill', LoadingStage.FULL_CONTENT)).toBe(false);
    });

    it('should delete all stages when stage not specified', async () => {
      const metadata = createMockSkill('skill', LoadingStage.METADATA_ONLY);
      const full = createMockSkill('skill', LoadingStage.FULL_CONTENT);

      await cache.set('skill', metadata);
      await cache.set('skill', full);

      cache.delete('skill');

      expect(cache.has('skill', LoadingStage.METADATA_ONLY)).toBe(false);
      expect(cache.has('skill', LoadingStage.FULL_CONTENT)).toBe(false);
    });
  });

  describe('clear', () => {
    it('should clear all cached skills', async () => {
      const skill1 = createMockSkill('skill1', LoadingStage.FULL_CONTENT);
      const skill2 = createMockSkill('skill2', LoadingStage.FULL_CONTENT);

      await cache.set('skill1', skill1);
      await cache.set('skill2', skill2);

      cache.clear();

      expect(cache.has('skill1', LoadingStage.FULL_CONTENT)).toBe(false);
      expect(cache.has('skill2', LoadingStage.FULL_CONTENT)).toBe(false);
    });

    it('should reset statistics', async () => {
      const skill = createMockSkill('test-skill', LoadingStage.FULL_CONTENT);
      await cache.set('test-skill', skill);
      await cache.get('test-skill', LoadingStage.FULL_CONTENT); // Hit

      cache.clear();

      const stats = cache.getStats();
      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(0);
    });
  });

  describe('getStats', () => {
    it('should track cache hits', async () => {
      const skill = createMockSkill('test-skill', LoadingStage.FULL_CONTENT);
      await cache.set('test-skill', skill);

      await cache.get('test-skill', LoadingStage.FULL_CONTENT); // Hit
      await cache.get('test-skill', LoadingStage.FULL_CONTENT); // Hit

      const stats = cache.getStats();
      expect(stats.hits).toBe(2);
    });

    it('should track cache misses', async () => {
      await cache.get('non-existent-1', LoadingStage.FULL_CONTENT); // Miss
      await cache.get('non-existent-2', LoadingStage.FULL_CONTENT); // Miss

      const stats = cache.getStats();
      expect(stats.misses).toBe(2);
    });

    it('should track cache size', async () => {
      const skill1 = createMockSkill('skill1', LoadingStage.FULL_CONTENT);
      const skill2 = createMockSkill('skill2', LoadingStage.FULL_CONTENT);

      await cache.set('skill1', skill1);
      await cache.set('skill2', skill2);

      const stats = cache.getStats();
      expect(stats.size).toBe(2);
      expect(stats.max).toBe(10);
    });
  });

  describe('getHitRate', () => {
    it('should calculate hit rate', async () => {
      const skill = createMockSkill('test-skill', LoadingStage.FULL_CONTENT);
      await cache.set('test-skill', skill);

      await cache.get('test-skill', LoadingStage.FULL_CONTENT); // Hit
      await cache.get('non-existent', LoadingStage.FULL_CONTENT); // Miss

      const hitRate = cache.getHitRate();
      expect(hitRate).toBe(0.5); // 1 hit, 1 miss = 50%
    });

    it('should return 0 for empty cache', () => {
      const hitRate = cache.getHitRate();
      expect(hitRate).toBe(0);
    });
  });

  describe('getCachedSkillNames', () => {
    it('should return list of cached skill names', async () => {
      const skill1 = createMockSkill('skill1', LoadingStage.FULL_CONTENT);
      const skill2 = createMockSkill('skill2', LoadingStage.METADATA_ONLY);

      await cache.set('skill1', skill1);
      await cache.set('skill2', skill2);

      const names = cache.getCachedSkillNames();

      expect(names).toContain('skill1');
      expect(names).toContain('skill2');
      expect(names.length).toBe(2);
    });
  });

  describe('LRU eviction', () => {
    it('should evict least recently used when at capacity', async () => {
      const smallCache = new CacheManager(3, 1000 * 60);

      // Fill cache to capacity
      for (let i = 1; i <= 3; i++) {
        const skill = createMockSkill(`skill${i}`, LoadingStage.FULL_CONTENT);
        await smallCache.set(`skill${i}`, skill);
      }

      // Add one more, should evict skill1
      const skill4 = createMockSkill('skill4', LoadingStage.FULL_CONTENT);
      await smallCache.set('skill4', skill4);

      const stats = smallCache.getStats();
      expect(stats.size).toBeLessThanOrEqual(3);
    });
  });
});
