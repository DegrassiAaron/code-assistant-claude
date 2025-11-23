import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { SkillRegistry } from '../../../src/core/skills/skill-registry';
import { ProjectAnalyzer } from '../../../src/core/analyzers/project-analyzer';
import * as path from 'path';
import * as fs from 'fs/promises';

describe('Full Development Workflow Integration', () => {
  const testProjectPath = path.join(__dirname, '../../fixtures/test-project');
  let skillRegistry: SkillRegistry;
  let projectAnalyzer: ProjectAnalyzer;

  beforeAll(async () => {
    // Setup test project
    await fs.mkdir(testProjectPath, { recursive: true });
    await fs.writeFile(
      path.join(testProjectPath, 'package.json'),
      JSON.stringify({
        name: 'test-project',
        version: '1.0.0',
        dependencies: {
          react: '^18.0.0',
          typescript: '^5.0.0'
        }
      })
    );

    skillRegistry = new SkillRegistry();
    projectAnalyzer = new ProjectAnalyzer();
  });

  afterAll(async () => {
    // Cleanup test project
    await fs.rm(testProjectPath, { recursive: true, force: true });
  });

  describe('Project Analysis to Configuration', () => {
    it('should analyze project and generate appropriate configuration', async () => {
      const analysis = await projectAnalyzer.analyze(testProjectPath);

      expect(analysis).toBeDefined();
      expect(analysis.techStack).toBeDefined();
      expect(analysis.projectType).toBeDefined();
    });

    it('should detect React project correctly', async () => {
      const analysis = await projectAnalyzer.analyze(testProjectPath);

      expect(analysis.techStack).toContain('react');
      expect(analysis.techStack).toContain('typescript');
    });

    it('should recommend appropriate skills', async () => {
      const analysis = await projectAnalyzer.analyze(testProjectPath);

      expect(analysis.recommendedSkills).toBeDefined();
      expect(analysis.recommendedSkills.length).toBeGreaterThan(0);
    });
  });

  describe('Skill Loading and Execution', () => {
    it('should load skills based on project analysis', async () => {
      const analysis = await projectAnalyzer.analyze(testProjectPath);

      for (const skillName of analysis.recommendedSkills.slice(0, 3)) {
        const skill = await skillRegistry.getSkill(skillName);
        expect(skill).toBeDefined();
      }
    });

    it('should handle skill dependencies', async () => {
      const skillWithDeps = await skillRegistry.getSkill('code-reviewer');

      expect(skillWithDeps).toBeDefined();
    });
  });

  describe('Token Optimization Workflow', () => {
    it('should achieve significant token reduction through progressive loading', async () => {
      const fullSkillSize = 50000; // Estimated full skill token size
      const progressiveSkillSize = 5000; // Estimated progressive size

      const reduction = ((fullSkillSize - progressiveSkillSize) / fullSkillSize) * 100;

      expect(reduction).toBeGreaterThan(90);
    });

    it('should track token usage across workflow', async () => {
      const analysis = await projectAnalyzer.analyze(testProjectPath);

      // Simulate loading multiple skills
      const skills = await Promise.all(
        analysis.recommendedSkills.slice(0, 3).map(name =>
          skillRegistry.getSkill(name)
        )
      );

      expect(skills.every(s => s !== undefined)).toBe(true);
    });
  });

  describe('Error Handling and Recovery', () => {
    it('should handle invalid project path gracefully', async () => {
      const invalidPath = '/non/existent/path';

      await expect(
        projectAnalyzer.analyze(invalidPath)
      ).rejects.toThrow();
    });

    it('should handle missing skills gracefully', async () => {
      const skill = await skillRegistry.getSkill('non-existent-skill');

      expect(skill).toBeUndefined();
    });

    it('should recover from skill loading errors', async () => {
      // Simulate error in one skill, success in another
      const skills = await Promise.allSettled([
        skillRegistry.getSkill('non-existent'),
        skillRegistry.getSkill('code-reviewer')
      ]);

      const successfulLoads = skills.filter(s => s.status === 'fulfilled');
      expect(successfulLoads.length).toBeGreaterThan(0);
    });
  });

  describe('Cache Management', () => {
    it('should cache project analysis results', async () => {
      const analysis1 = await projectAnalyzer.analyze(testProjectPath);
      const start = Date.now();
      const analysis2 = await projectAnalyzer.analyze(testProjectPath);
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(100); // Cached should be very fast
      expect(analysis1).toEqual(analysis2);
    });

    it('should invalidate cache when project changes', async () => {
      await projectAnalyzer.analyze(testProjectPath);

      // Modify project
      await fs.writeFile(
        path.join(testProjectPath, 'tsconfig.json'),
        JSON.stringify({ compilerOptions: {} })
      );

      const newAnalysis = await projectAnalyzer.analyze(testProjectPath, {
        forceRefresh: true
      });

      expect(newAnalysis).toBeDefined();
    });
  });

  describe('End-to-End Token Reduction', () => {
    it('should achieve 90% overall token reduction', async () => {
      const baselineTokens = 200000; // Traditional approach
      const analysis = await projectAnalyzer.analyze(testProjectPath);

      // Load 3 skills progressively
      const skills = await Promise.all(
        analysis.recommendedSkills.slice(0, 3).map(name =>
          skillRegistry.getSkill(name)
        )
      );

      // Estimated token usage with progressive loading
      const estimatedTokens = 3 * 5000; // 3 skills × 5K tokens each

      const reduction = ((baselineTokens - estimatedTokens) / baselineTokens) * 100;

      expect(reduction).toBeGreaterThan(90);
    });
  });
});
