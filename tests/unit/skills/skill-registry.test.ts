import { SkillRegistry } from '../../../src/core/skills/skill-registry';
import path from 'path';

describe('SkillRegistry', () => {
  let registry: SkillRegistry;
  const skillsDir = path.join(__dirname, '../../../templates/skills');

  beforeEach(async () => {
    registry = new SkillRegistry(skillsDir);
    await registry.indexSkills();
  });

  describe('indexSkills', () => {
    it('should index all available skills', async () => {
      const allSkills = registry.getAll();

      expect(allSkills.length).toBeGreaterThan(0);
      // We have at least 5 core skills + 6 superclaude + 1 meta = 12 skills
      expect(allSkills.length).toBeGreaterThanOrEqual(12);
    });

    it('should index skills with correct metadata', async () => {
      const codeReviewer = registry.get('code-reviewer');

      expect(codeReviewer).toBeDefined();
      expect(codeReviewer!.metadata.name).toBe('code-reviewer');
      expect(codeReviewer!.metadata.category).toBe('core');
      expect(codeReviewer!.path).toContain('code-reviewer');
      expect(codeReviewer!.indexed).toBe(true);
    });

    it('should set lastModified date', async () => {
      const allSkills = registry.getAll();

      allSkills.forEach(skill => {
        expect(skill.lastModified).toBeInstanceOf(Date);
        expect(skill.lastModified.getTime()).toBeLessThanOrEqual(Date.now());
      });
    });
  });

  describe('get', () => {
    it('should retrieve skill by name', () => {
      const skill = registry.get('code-reviewer');

      expect(skill).toBeDefined();
      expect(skill!.metadata.name).toBe('code-reviewer');
    });

    it('should return undefined for non-existent skill', () => {
      const skill = registry.get('non-existent-skill');
      expect(skill).toBeUndefined();
    });
  });

  describe('findByKeyword', () => {
    it('should find skills by keyword', () => {
      const skills = registry.findByKeyword('review');

      expect(skills.length).toBeGreaterThan(0);
      const codeReviewer = skills.find(s => s.metadata.name === 'code-reviewer');
      expect(codeReviewer).toBeDefined();
    });

    it('should be case-insensitive', () => {
      const lowercase = registry.findByKeyword('review');
      const uppercase = registry.findByKeyword('REVIEW');

      expect(lowercase.length).toBe(uppercase.length);
    });

    it('should return empty array for non-matching keyword', () => {
      const skills = registry.findByKeyword('xyznonexistent123');
      expect(skills).toEqual([]);
    });
  });

  describe('findByCategory', () => {
    it('should find all core skills', () => {
      const coreSkills = registry.findByCategory('core');

      expect(coreSkills.length).toBeGreaterThanOrEqual(5);
      coreSkills.forEach(skill => {
        expect(skill.metadata.category).toBe('core');
      });
    });

    it('should find all superclaude skills', () => {
      const superclaudeSkills = registry.findByCategory('superclaude');

      expect(superclaudeSkills.length).toBeGreaterThanOrEqual(6);
      superclaudeSkills.forEach(skill => {
        expect(skill.metadata.category).toBe('superclaude');
      });
    });

    it('should find meta skills', () => {
      const metaSkills = registry.findByCategory('meta');

      expect(metaSkills.length).toBeGreaterThanOrEqual(1);
      expect(metaSkills.some(s => s.metadata.name === 'skill-creator')).toBe(true);
    });
  });

  describe('findByCommand', () => {
    it('should find skills by command', () => {
      const skills = registry.findByCommand('/sc:review');

      expect(skills.length).toBeGreaterThan(0);
      const codeReviewer = skills.find(s => s.metadata.name === 'code-reviewer');
      expect(codeReviewer).toBeDefined();
    });

    it('should return empty array for non-existent command', () => {
      const skills = registry.findByCommand('/nonexistent-command');
      expect(skills).toEqual([]);
    });
  });

  describe('findByEvent', () => {
    it('should find skills by event', () => {
      const skills = registry.findByEvent('file_save');

      expect(skills.length).toBeGreaterThan(0);
    });
  });

  describe('findByProjectType', () => {
    it('should find skills compatible with project type', () => {
      const skills = registry.findByProjectType('typescript');

      expect(skills.length).toBeGreaterThan(0);
      const codeReviewer = skills.find(s => s.metadata.name === 'code-reviewer');
      expect(codeReviewer).toBeDefined();
    });
  });

  describe('getTotalMetadataTokens', () => {
    it('should calculate total metadata tokens', () => {
      const total = registry.getTotalMetadataTokens();

      expect(total).toBeGreaterThan(0);
      // With 12+ skills at ~30-45 tokens each, should be 360+ tokens
      expect(total).toBeGreaterThan(300);
    });
  });

  describe('getStats', () => {
    it('should return registry statistics', () => {
      const stats = registry.getStats();

      expect(stats.totalSkills).toBeGreaterThan(0);
      expect(stats.metadataTokens).toBeGreaterThan(0);
      expect(stats.categories).toBeDefined();
      expect(stats.categories.core).toBeGreaterThanOrEqual(5);
      expect(stats.categories.superclaude).toBeGreaterThanOrEqual(6);
      expect(stats.categories.meta).toBeGreaterThanOrEqual(1);
      expect(stats.priority).toBeDefined();
    });
  });
});
