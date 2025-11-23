import { SkillLoader } from '../../../src/core/skills/skill-loader';
import { LoadingStage, ActivationContext } from '../../../src/core/skills/types';
import { SilentLogger } from '../../../src/core/skills/logger';
import path from 'path';

describe('Progressive Loading Integration', () => {
  let loader: SkillLoader;
  const skillsDir = path.join(__dirname, '../../../templates/skills');

  beforeEach(async () => {
    loader = new SkillLoader(skillsDir, 50, 30 * 60 * 1000, new SilentLogger());
    await loader.initialize();
  });

  afterEach(() => {
    loader.clearCaches();
  });

  describe('Token Savings Demonstration', () => {
    it('should demonstrate >85% token savings through progressive loading', async () => {
      // Baseline: Calculate tokens if all skills loaded at full content
      const allSkills = loader['registry'].getAll();
      const baselineTokens = allSkills.reduce(
        (sum, entry) => sum + entry.metadata.tokenCost.fullContent,
        0
      );

      console.log(`\n📊 Progressive Loading Demo:`);
      console.log(`Baseline (all skills full): ${baselineTokens.toLocaleString()} tokens`);

      // Progressive: Load metadata + matched skills
      const context: ActivationContext = {
        userMessage: 'Review my code and generate tests',
        projectType: 'typescript'
      };

      const matches = await loader.matchSkills(context);
      console.log(`\nMatched skills: ${matches.join(', ')}`);

      const loadedSkills = await loader.loadSkills(matches, LoadingStage.FULL_CONTENT);
      const progressiveTokens = loader.getTotalTokensConsumed();

      console.log(`Progressive (metadata + ${matches.length} active): ${progressiveTokens.toLocaleString()} tokens`);

      // Calculate savings
      const savings = ((baselineTokens - progressiveTokens) / baselineTokens) * 100;
      console.log(`\n✅ Savings: ${savings.toFixed(1)}%\n`);

      // Verify >85% savings
      expect(savings).toBeGreaterThan(85);
      expect(loadedSkills.length).toBeGreaterThan(0);
      expect(loadedSkills.length).toBeLessThan(allSkills.length);
    });
  });

  describe('Skill Activation', () => {
    it('should activate code-reviewer for review keywords', async () => {
      const context: ActivationContext = {
        userMessage: 'Please review my code',
        projectType: 'typescript'
      };

      const matches = await loader.matchSkills(context);

      expect(matches).toContain('code-reviewer');
    });

    it('should activate test-generator for test keywords', async () => {
      const context: ActivationContext = {
        userMessage: 'Generate tests for this module',
        projectType: 'typescript'
      };

      const matches = await loader.matchSkills(context);

      expect(matches).toContain('test-generator');
    });

    it('should activate brainstorming-mode for exploration', async () => {
      const context: ActivationContext = {
        userMessage: 'I\'m not sure what approach to take',
        projectType: 'typescript'
      };

      const matches = await loader.matchSkills(context);

      expect(matches).toContain('brainstorming-mode');
    });

    it('should activate research-mode for research keywords', async () => {
      const context: ActivationContext = {
        userMessage: 'Research best practices for authentication',
        projectType: 'typescript'
      };

      const matches = await loader.matchSkills(context);

      expect(matches).toContain('research-mode');
    });

    it('should activate by command trigger', async () => {
      const context: ActivationContext = {
        userMessage: 'Run code review',
        currentCommand: '/sc:review'
      };

      const matches = await loader.matchSkills(context);

      expect(matches).toContain('code-reviewer');
    });

    it('should activate by event trigger', async () => {
      const context: ActivationContext = {
        userMessage: 'File saved',
        eventType: 'file_save'
      };

      const matches = await loader.matchSkills(context);

      expect(matches.length).toBeGreaterThan(0);
    });
  });

  describe('Progressive Loading Stages', () => {
    it('should load metadata stage with minimal tokens', async () => {
      const context: ActivationContext = {
        userMessage: 'review code',
        projectType: 'typescript'
      };

      const matches = await loader.matchSkills(context);
      const skills = await loader.loadSkills(matches.slice(0, 1), LoadingStage.METADATA_ONLY);

      expect(skills.length).toBeGreaterThan(0);
      expect(skills[0]!.loaded).toBe(LoadingStage.METADATA_ONLY);
      expect(skills[0]!.content).toBe('');
      expect(skills[0]!.tokensConsumed).toBeLessThan(300); // Updated threshold
    });

    it('should load full content stage', async () => {
      const context: ActivationContext = {
        userMessage: 'review code',
        projectType: 'typescript'
      };

      const matches = await loader.matchSkills(context);
      const skills = await loader.loadSkills(matches.slice(0, 1), LoadingStage.FULL_CONTENT);

      expect(skills.length).toBeGreaterThan(0);
      expect(skills[0]!.loaded).toBe(LoadingStage.FULL_CONTENT);
      expect(skills[0]!.content).not.toBe('');
      expect(skills[0]!.tokensConsumed).toBeGreaterThan(1000);
    });

    it('should load resources stage when requested', async () => {
      const context: ActivationContext = {
        userMessage: 'review code',
        projectType: 'typescript'
      };

      const matches = await loader.matchSkills(context);
      const skills = await loader.loadSkills(matches.slice(0, 1), LoadingStage.WITH_RESOURCES);

      expect(skills.length).toBeGreaterThan(0);
      expect(skills[0]!.loaded).toBe(LoadingStage.WITH_RESOURCES);
    });
  });

  describe('Caching', () => {
    it('should cache loaded skills', async () => {
      const context: ActivationContext = {
        userMessage: 'review code',
        projectType: 'typescript'
      };

      const matches = await loader.matchSkills(context);

      // First load
      const firstLoad = await loader.loadSkills(matches.slice(0, 1), LoadingStage.FULL_CONTENT);
      expect(firstLoad.length).toBeGreaterThan(0);

      // Unload to clear in-memory cache but keep CacheManager cache
      loader.unloadSkill(matches[0]!);

      // Second load (should hit CacheManager)
      const secondLoad = await loader.loadSkills(matches.slice(0, 1), LoadingStage.FULL_CONTENT);
      expect(secondLoad.length).toBeGreaterThan(0);

      const stats = loader.getCacheStats();
      expect(stats.hits).toBeGreaterThan(0);
    });

    it('should improve hit rate with repeated access', async () => {
      const context: ActivationContext = {
        userMessage: 'review code and generate tests',
        projectType: 'typescript'
      };

      const matches = await loader.matchSkills(context);

      // Load multiple times, clearing in-memory cache between loads
      for (let i = 0; i < 5; i++) {
        await loader.loadSkills(matches, LoadingStage.FULL_CONTENT);
        // Unload to force cache manager usage on next iteration
        if (i < 4) {
          matches.forEach(name => loader.unloadSkill(name));
        }
      }

      const hitRate = loader['cache'].getHitRate();
      expect(hitRate).toBeGreaterThan(0);
    });
  });

  describe('Priority Sorting', () => {
    it('should sort matched skills by priority', async () => {
      const context: ActivationContext = {
        userMessage: 'review code, run security audit, and optimize performance',
        projectType: 'typescript'
      };

      const matches = await loader.matchSkills(context);

      expect(matches.length).toBeGreaterThan(0);

      // Verify high priority skills come first
      const firstSkillName = matches[0];
      expect(firstSkillName).toBeDefined();

      const firstSkill = loader['registry'].get(firstSkillName!);
      expect(firstSkill).toBeDefined();
      expect(['high', 'medium'].includes(firstSkill!.metadata.priority)).toBe(true);
    });
  });

  describe('Skill Unloading', () => {
    it('should unload skills and free memory', async () => {
      const context: ActivationContext = {
        userMessage: 'review code',
        projectType: 'typescript'
      };

      const matches = await loader.matchSkills(context);
      await loader.loadSkills(matches, LoadingStage.FULL_CONTENT);

      expect(matches.length).toBeGreaterThan(0);

      // Unload first skill
      const firstSkillName = matches[0];
      expect(firstSkillName).toBeDefined();
      loader.unloadSkill(firstSkillName!);

      const loadedSkills = loader.getLoadedSkills();
      expect(loadedSkills.length).toBe(matches.length - 1);
    });

    it('should unload all skills', async () => {
      const context: ActivationContext = {
        userMessage: 'review code and generate tests',
        projectType: 'typescript'
      };

      const matches = await loader.matchSkills(context);
      await loader.loadSkills(matches, LoadingStage.FULL_CONTENT);

      loader.unloadAll();

      const loadedSkills = loader.getLoadedSkills();
      expect(loadedSkills.length).toBe(0);
    });
  });

  describe('Registry Statistics', () => {
    it('should provide comprehensive registry stats', () => {
      const stats = loader.getRegistryStats();

      expect(stats.totalSkills).toBeGreaterThan(0);
      expect(stats.metadataTokens).toBeGreaterThan(0);
      expect(stats.categories.core).toBeGreaterThanOrEqual(5);
      expect(stats.categories.superclaude).toBeGreaterThanOrEqual(6);
      expect(stats.categories.meta).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Token Tracking', () => {
    it('should generate detailed token report', async () => {
      const context: ActivationContext = {
        userMessage: 'review code and generate tests',
        projectType: 'typescript'
      };

      const matches = await loader.matchSkills(context);
      await loader.loadSkills(matches, LoadingStage.FULL_CONTENT);

      const report = loader.getTokenReport();

      expect(report).toContain('Token Usage Report');
      expect(report).toContain('Total:');
      expect(report).toContain('System:');
    });
  });

  describe('Multi-Stage Loading', () => {
    it('should handle upgrading from metadata to full content', async () => {
      const context: ActivationContext = {
        userMessage: 'review code',
        projectType: 'typescript'
      };

      const matches = await loader.matchSkills(context);

      // First load metadata only
      const metadataSkills = await loader.loadSkills(matches.slice(0, 1), LoadingStage.METADATA_ONLY);
      expect(metadataSkills.length).toBeGreaterThan(0);
      expect(metadataSkills[0]!.loaded).toBe(LoadingStage.METADATA_ONLY);

      // Then upgrade to full content
      const fullSkills = await loader.loadSkills(matches.slice(0, 1), LoadingStage.FULL_CONTENT);
      expect(fullSkills.length).toBeGreaterThan(0);
      expect(fullSkills[0]!.loaded).toBe(LoadingStage.FULL_CONTENT);
      expect(fullSkills[0]!.content).not.toBe('');
    });
  });
});
