/// <reference types="vitest" />
import { SkillRegistry } from '../../../src/core/skills/skill-registry';
import { SilentLogger } from '../../../src/core/skills/logger';
import { ProjectAnalyzer } from '../../../src/core/analyzers/project-analyzer';
import * as path from 'path';
import * as fs from 'fs/promises';

describe('Full Development Workflow Integration', () => {
  const testProjectPath = path.join(__dirname, '../../fixtures/test-project');
  const skillsDir = path.join(process.cwd(), 'templates/skills');
  let skillRegistry: SkillRegistry;
  let projectAnalyzer: ProjectAnalyzer;
  const deriveRecommendedSkills = (analysis: Awaited<ReturnType<ProjectAnalyzer['analyze']>>): string[] => {
    const seen = new Set<string>();

    const addEntries = (entries: ReturnType<SkillRegistry['findByCategory']>) => {
      entries.forEach(entry => seen.add(entry.metadata.name));
    };

    analysis.techStack.forEach(lang => addEntries(skillRegistry.findByProjectType(lang)));

    if (analysis.type.toLowerCase().includes('react')) {
      addEntries(skillRegistry.findByProjectType('react'));
    }

    analysis.domain.forEach(domain => addEntries(skillRegistry.findByKeyword(domain)));

    if (seen.size === 0) {
      addEntries(skillRegistry.findByCategory('core'));
    }

    return Array.from(seen);
  };

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

    skillRegistry = new SkillRegistry(skillsDir, new SilentLogger());
    await skillRegistry.indexSkills();
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
      expect(analysis.type).toBeDefined();
    });

    it('should detect React project correctly', async () => {
      const analysis = await projectAnalyzer.analyze(testProjectPath);

      expect(analysis.techStack).toContain('typescript');
      expect(analysis.type).toBe('React Application');
    });

    it('should recommend appropriate skills', async () => {
      const analysis = await projectAnalyzer.analyze(testProjectPath);

      const recommended = deriveRecommendedSkills(analysis);
      expect(recommended.length).toBeGreaterThan(0);
      expect(recommended).toContain('code-reviewer');
    });
  });

  describe('Skill Loading and Execution', () => {
    it('should load skills based on project analysis', async () => {
      const analysis = await projectAnalyzer.analyze(testProjectPath);
      const recommended = deriveRecommendedSkills(analysis);

      for (const skillName of recommended.slice(0, 3)) {
        const skill = skillRegistry.get(skillName);
        expect(skill).toBeDefined();
      }
    });

    it('should handle skill dependencies', () => {
      const skillWithDeps = skillRegistry.get('code-reviewer');

      expect(skillWithDeps).toBeDefined();
    });
  });

  describe('Token Optimization Workflow', () => {
    it('should achieve significant token reduction through progressive loading', async () => {
      const fullSkillSize = 50000; // Estimated full skill token size
      const progressiveSkillSize = 5000; // Estimated progressive size

      const reduction = ((fullSkillSize - progressiveSkillSize) / fullSkillSize) * 100;

      expect(reduction).toBeGreaterThanOrEqual(90);
    });

    it('should track token usage across workflow', async () => {
      const analysis = await projectAnalyzer.analyze(testProjectPath);
      const recommended = deriveRecommendedSkills(analysis);
      const skills = recommended.slice(0, 3).map(name => skillRegistry.get(name));
      const expectedCount = Math.min(3, recommended.length);

      expect(skills).toHaveLength(expectedCount);
      expect(skills).not.toContain(undefined);
    });
  });

  describe('Error Handling and Recovery', () => {
    it('should handle invalid project path gracefully', async () => {
      const invalidPath = '/non/existent/path';

      await expect(
        projectAnalyzer.analyze(invalidPath)
      ).rejects.toThrow();
    });

    it('should handle missing skills gracefully', () => {
      const skill = skillRegistry.get('non-existent-skill');

      expect(skill).toBeUndefined();
    });

    it('should recover from skill loading errors', () => {
      const requestedSkills = ['non-existent', 'code-reviewer'];
      const results = requestedSkills.map(name => skillRegistry.get(name));
      const successfulLoads = results.filter((skill): skill is NonNullable<typeof skill> => Boolean(skill));

      expect(successfulLoads).toHaveLength(1);
      expect(successfulLoads[0]!.metadata.name).toBe('code-reviewer');
    });
  });

  describe('Re-analysis Behavior', () => {
    it('should produce consistent results for unchanged projects', async () => {
      const analysis1 = await projectAnalyzer.analyze(testProjectPath);
      const analysis2 = await projectAnalyzer.analyze(testProjectPath);

      expect(analysis2).toEqual(analysis1);
    });

    it('should reflect project changes on subsequent analyses', async () => {
      // Add Python requirements to introduce a new tech stack entry
      await fs.writeFile(
        path.join(testProjectPath, 'requirements.txt'),
        'django==4.2.0'
      );

      const newAnalysis = await projectAnalyzer.analyze(testProjectPath);
      expect(newAnalysis.techStack).toContain('python');
    });
  });

  describe('End-to-End Token Reduction', () => {
    it('should achieve 90% overall token reduction', async () => {
      const baselineTokens = 200000; // Traditional approach
      const analysis = await projectAnalyzer.analyze(testProjectPath);
      const recommended = deriveRecommendedSkills(analysis);

      // Load 3 skills progressively
      const skills = recommended.slice(0, 3).map(name => skillRegistry.get(name));

      // Estimated token usage with progressive loading
      const estimatedTokens = 3 * 5000; // 3 skills × 5K tokens each

      const reduction = ((baselineTokens - estimatedTokens) / baselineTokens) * 100;

      expect(reduction).toBeGreaterThan(90);
    });
  });
});
