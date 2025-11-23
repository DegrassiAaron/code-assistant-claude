import { TokenTracker } from '../../../src/core/skills/token-tracker';
import { LoadingStage } from '../../../src/core/skills/types';

describe('TokenTracker', () => {
  let tracker: TokenTracker;

  beforeEach(() => {
    tracker = new TokenTracker();
  });

  describe('trackSkillUsage', () => {
    it('should track skill token usage', () => {
      tracker.trackSkillUsage('code-reviewer', LoadingStage.FULL_CONTENT, 2000);

      const total = tracker.getTotalTokens();
      expect(total).toBe(2000);
    });

    it('should track multiple skills', () => {
      tracker.trackSkillUsage('code-reviewer', LoadingStage.FULL_CONTENT, 2000);
      tracker.trackSkillUsage('test-generator', LoadingStage.FULL_CONTENT, 1800);

      const total = tracker.getTotalTokens();
      expect(total).toBe(3800);
    });

    it('should track usage by skill', () => {
      tracker.trackSkillUsage('code-reviewer', LoadingStage.METADATA_ONLY, 50);
      tracker.trackSkillUsage('code-reviewer', LoadingStage.FULL_CONTENT, 2000);

      const bySkill = tracker.getUsageBySkill();
      expect(bySkill.get('code-reviewer')).toBe(2050);
    });
  });

  describe('trackSystemUsage', () => {
    it('should track system-level usage', () => {
      tracker.trackSystemUsage('skills_metadata', 500);

      const total = tracker.getTotalTokens();
      expect(total).toBe(500);
    });

    it('should combine system and skill usage', () => {
      tracker.trackSystemUsage('skills_metadata', 500);
      tracker.trackSkillUsage('code-reviewer', LoadingStage.FULL_CONTENT, 2000);

      const total = tracker.getTotalTokens();
      expect(total).toBe(2500);
    });
  });

  describe('trackSkillUnload', () => {
    it('should track negative tokens when unloading', () => {
      tracker.trackSkillUsage('code-reviewer', LoadingStage.FULL_CONTENT, 2000);
      tracker.trackSkillUnload('code-reviewer', 2000);

      const total = tracker.getTotalTokens();
      expect(total).toBe(0);
    });
  });

  describe('getUsageBySkill', () => {
    it('should return usage map by skill', () => {
      tracker.trackSkillUsage('code-reviewer', LoadingStage.FULL_CONTENT, 2000);
      tracker.trackSkillUsage('test-generator', LoadingStage.FULL_CONTENT, 1800);

      const bySkill = tracker.getUsageBySkill();

      expect(bySkill.size).toBe(2);
      expect(bySkill.get('code-reviewer')).toBe(2000);
      expect(bySkill.get('test-generator')).toBe(1800);
    });

    it('should accumulate multiple entries for same skill', () => {
      tracker.trackSkillUsage('code-reviewer', LoadingStage.METADATA_ONLY, 50);
      tracker.trackSkillUsage('code-reviewer', LoadingStage.FULL_CONTENT, 1950);

      const bySkill = tracker.getUsageBySkill();
      expect(bySkill.get('code-reviewer')).toBe(2000);
    });
  });

  describe('getUsageByStage', () => {
    it('should return usage map by stage', () => {
      tracker.trackSkillUsage('code-reviewer', LoadingStage.METADATA_ONLY, 50);
      tracker.trackSkillUsage('test-generator', LoadingStage.FULL_CONTENT, 1800);

      const byStage = tracker.getUsageByStage();

      expect(byStage.get(LoadingStage.METADATA_ONLY)).toBe(50);
      expect(byStage.get(LoadingStage.FULL_CONTENT)).toBe(1800);
    });

    it('should not include negative tokens', () => {
      tracker.trackSkillUsage('code-reviewer', LoadingStage.FULL_CONTENT, 2000);
      tracker.trackSkillUnload('code-reviewer', 2000);

      const byStage = tracker.getUsageByStage();

      expect(byStage.get(LoadingStage.FULL_CONTENT)).toBe(2000);
    });
  });

  describe('getReport', () => {
    it('should generate formatted report', () => {
      tracker.trackSystemUsage('skills_metadata', 500);
      tracker.trackSkillUsage('code-reviewer', LoadingStage.FULL_CONTENT, 2000);
      tracker.trackSkillUsage('test-generator', LoadingStage.FULL_CONTENT, 1800);

      const report = tracker.getReport();

      expect(report).toContain('Token Usage Report');
      expect(report).toContain('Total:');
      expect(report).toContain('System:');
      expect(report).toContain('Skills:');
      expect(report).toContain('code-reviewer');
      expect(report).toContain('test-generator');
    });
  });

  describe('reset', () => {
    it('should clear all tracking data', () => {
      tracker.trackSystemUsage('skills_metadata', 500);
      tracker.trackSkillUsage('code-reviewer', LoadingStage.FULL_CONTENT, 2000);

      tracker.reset();

      const total = tracker.getTotalTokens();
      expect(total).toBe(0);

      const bySkill = tracker.getUsageBySkill();
      expect(bySkill.size).toBe(0);
    });
  });

  describe('getEntriesInRange', () => {
    it('should filter entries by time range', () => {
      const start = new Date();
      tracker.trackSkillUsage('skill1', LoadingStage.FULL_CONTENT, 1000);

      tracker.trackSkillUsage('skill2', LoadingStage.FULL_CONTENT, 2000);

      const end = new Date();
      const entries = tracker.getEntriesInRange(start, end);

      expect(entries.length).toBe(2);
    });
  });
});
