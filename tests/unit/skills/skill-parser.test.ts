import { SkillParser } from '../../../src/core/skills/skill-parser';
import { LoadingStage } from '../../../src/core/skills/types';
import { SilentLogger } from '../../../src/core/skills/logger';
import path from 'path';

describe('SkillParser', () => {
  let parser: SkillParser;
  const testSkillPath = path.join(__dirname, '../../../templates/skills/core/code-reviewer/SKILL.md');

  beforeEach(() => {
    parser = new SkillParser(new SilentLogger());
  });

  describe('parseSkill', () => {
    it('should parse metadata only at METADATA_ONLY stage', async () => {
      const skill = await parser.parseSkill(testSkillPath, LoadingStage.METADATA_ONLY);

      expect(skill.metadata.name).toBe('code-reviewer');
      expect(skill.metadata.version).toBe('1.0.0');
      expect(skill.metadata.category).toBe('core');
      expect(skill.content).toBe('');
      expect(skill.loaded).toBe(LoadingStage.METADATA_ONLY);
      expect(skill.tokensConsumed).toBeGreaterThan(0);
      expect(skill.tokensConsumed).toBeLessThan(300); // Updated threshold
    });

    it('should parse full content at FULL_CONTENT stage', async () => {
      const skill = await parser.parseSkill(testSkillPath, LoadingStage.FULL_CONTENT);

      expect(skill.metadata.name).toBe('code-reviewer');
      expect(skill.content).not.toBe('');
      expect(skill.content.length).toBeGreaterThan(100);
      expect(skill.loaded).toBe(LoadingStage.FULL_CONTENT);
      expect(skill.tokensConsumed).toBeGreaterThan(900); // Adjusted for tiktoken accuracy
    });

    it('should load resources at WITH_RESOURCES stage', async () => {
      const skill = await parser.parseSkill(testSkillPath, LoadingStage.WITH_RESOURCES);

      expect(skill.loaded).toBe(LoadingStage.WITH_RESOURCES);
      expect(skill.resources).toBeDefined();
      // code-reviewer has resources
      if (skill.resources) {
        expect(skill.resources.length).toBeGreaterThan(0);
      }
    });

    it('should throw error for invalid skill file', async () => {
      const invalidPath = '/invalid/path/to/skill.md';
      await expect(parser.parseSkill(invalidPath)).rejects.toThrow();
    });

    it('should validate required metadata fields', async () => {
      const skill = await parser.parseSkill(testSkillPath, LoadingStage.METADATA_ONLY);

      expect(skill.metadata.name).toBeDefined();
      expect(skill.metadata.description).toBeDefined();
      expect(skill.metadata.category).toBeDefined();
      expect(skill.metadata.triggers).toBeDefined();
      expect(skill.metadata.tokenCost).toBeDefined();
      expect(skill.metadata.priority).toBeDefined();
      expect(skill.metadata.autoActivate).toBeDefined();
      expect(skill.metadata.cacheStrategy).toBeDefined();
    });

    it('should parse triggers correctly', async () => {
      const skill = await parser.parseSkill(testSkillPath, LoadingStage.METADATA_ONLY);

      expect(skill.metadata.triggers.keywords).toBeDefined();
      expect(Array.isArray(skill.metadata.triggers.keywords)).toBe(true);
      expect(skill.metadata.triggers.keywords!.length).toBeGreaterThan(0);
    });

    it('should parse token costs correctly', async () => {
      const skill = await parser.parseSkill(testSkillPath, LoadingStage.METADATA_ONLY);

      expect(skill.metadata.tokenCost.metadata).toBeGreaterThan(0);
      expect(skill.metadata.tokenCost.fullContent).toBeGreaterThan(0);
      expect(skill.metadata.tokenCost.resources).toBeGreaterThan(0);
    });
  });

  describe('metadata validation', () => {
    it('should accept valid categories', async () => {
      const skill = await parser.parseSkill(testSkillPath, LoadingStage.METADATA_ONLY);
      expect(['core', 'domain', 'superclaude', 'meta']).toContain(skill.metadata.category);
    });

    it('should accept valid priorities', async () => {
      const skill = await parser.parseSkill(testSkillPath, LoadingStage.METADATA_ONLY);
      expect(['high', 'medium', 'low']).toContain(skill.metadata.priority);
    });

    it('should accept valid cache strategies', async () => {
      const skill = await parser.parseSkill(testSkillPath, LoadingStage.METADATA_ONLY);
      expect(['aggressive', 'normal', 'minimal']).toContain(skill.metadata.cacheStrategy);
    });
  });

  describe('token estimation', () => {
    it('should estimate tokens for metadata', async () => {
      const skill = await parser.parseSkill(testSkillPath, LoadingStage.METADATA_ONLY);

      // Metadata should be relatively small
      expect(skill.tokensConsumed).toBeGreaterThan(10);
      expect(skill.tokensConsumed).toBeLessThan(300); // Updated threshold
    });

    it('should estimate more tokens for full content', async () => {
      const metadataSkill = await parser.parseSkill(testSkillPath, LoadingStage.METADATA_ONLY);
      const fullSkill = await parser.parseSkill(testSkillPath, LoadingStage.FULL_CONTENT);

      expect(fullSkill.tokensConsumed).toBeGreaterThan(metadataSkill.tokensConsumed);
    });

    it('should estimate even more tokens with resources', async () => {
      const fullSkill = await parser.parseSkill(testSkillPath, LoadingStage.FULL_CONTENT);
      const resourceSkill = await parser.parseSkill(testSkillPath, LoadingStage.WITH_RESOURCES);

      // Only if resources exist
      if (resourceSkill.resources && resourceSkill.resources.length > 0) {
        expect(resourceSkill.tokensConsumed).toBeGreaterThan(fullSkill.tokensConsumed);
      }
    });
  });
});
