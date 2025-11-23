/**
 * Agent Orchestrator Integration Tests
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { AgentOrchestrator } from '../../../src/core/agents/agent-orchestrator';
import type {
  Agent,
  AgentContext,
  AgentSelectionCriteria,
} from '../../../src/core/agents/types';

describe('Agent Orchestrator', () => {
  let orchestrator: AgentOrchestrator;
  let mockAgents: Agent[];

  beforeEach(() => {
    orchestrator = new AgentOrchestrator();

    // Create mock agents for testing
    mockAgents = [
      {
        metadata: {
          name: 'code-reviewer',
          description: 'Expert code review',
          category: 'technical',
          expertise: ['Code Quality', 'Best Practices', 'Design Patterns'],
          activation: {
            keywords: ['review', 'code review', 'quality'],
            complexity: ['moderate', 'complex'],
            triggers: ['code_review', 'quality_audit'],
          },
          capabilities: [
            'Code quality analysis',
            'Design pattern identification',
            'Best practices validation',
          ],
          integrations: {
            skills: ['code-reviewer'],
            mcps: ['magic'],
            other_agents: ['security-auditor', 'performance-tuner'],
          },
        },
        content: 'Code reviewer agent content...',
        path: 'templates/agents/code-reviewer-agent.md',
      },
      {
        metadata: {
          name: 'security-auditor',
          description: 'Security vulnerability analysis',
          category: 'technical',
          expertise: ['Security', 'OWASP', 'Penetration Testing'],
          activation: {
            keywords: ['security', 'vulnerability', 'audit'],
            complexity: ['moderate', 'complex'],
            triggers: ['security_audit', 'vulnerability_scan'],
          },
          capabilities: [
            'OWASP Top 10 detection',
            'Security code review',
            'Authentication analysis',
          ],
          integrations: {
            skills: ['security-auditor'],
            mcps: [],
            other_agents: ['code-reviewer'],
          },
        },
        content: 'Security auditor agent content...',
        path: 'templates/agents/security-auditor-agent.md',
      },
      {
        metadata: {
          name: 'test-engineer',
          description: 'Test strategy and generation',
          category: 'technical',
          expertise: ['Testing', 'TDD', 'Quality Assurance'],
          activation: {
            keywords: ['test', 'testing', 'quality assurance'],
            complexity: ['simple', 'moderate', 'complex'],
            triggers: ['test_generation', 'test_strategy'],
          },
          capabilities: [
            'Test strategy development',
            'Unit test generation',
            'Coverage analysis',
          ],
          integrations: {
            skills: ['test-generator'],
            mcps: ['playwright'],
            other_agents: ['code-reviewer'],
          },
        },
        content: 'Test engineer agent content...',
        path: 'templates/agents/test-engineer-agent.md',
      },
    ];

    orchestrator.registerAgents(mockAgents);
  });

  describe('Agent Selection', () => {
    it('should select relevant agents based on keywords', async () => {
      const criteria: AgentSelectionCriteria = {
        query: 'I need a code review for security vulnerabilities',
        maxAgents: 5,
      };

      const results = await orchestrator.selectAgents(criteria);

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].agent.metadata.name).toMatch(
        /(code-reviewer|security-auditor)/
      );
      expect(results[0].score).toBeGreaterThan(0);
    });

    it('should filter agents by category', async () => {
      const criteria: AgentSelectionCriteria = {
        query: 'help with testing',
        category: 'technical',
        maxAgents: 3,
      };

      const results = await orchestrator.selectAgents(criteria);

      results.forEach((result) => {
        expect(result.agent.metadata.category).toBe('technical');
      });
    });

    it('should limit results to maxAgents', async () => {
      const criteria: AgentSelectionCriteria = {
        query: 'code review and testing and security',
        maxAgents: 2,
      };

      const results = await orchestrator.selectAgents(criteria);

      expect(results.length).toBeLessThanOrEqual(2);
    });

    it('should return empty array when no agents match', async () => {
      const criteria: AgentSelectionCriteria = {
        query: 'unrelated query about cooking recipes',
        maxAgents: 5,
      };

      const results = await orchestrator.selectAgents(criteria);

      expect(results.length).toBe(0);
    });
  });

  describe('Single Agent Execution', () => {
    it('should execute agent successfully', async () => {
      const agent = mockAgents[0];
      const context: AgentContext = {
        query: 'Review this code for quality issues',
        category: 'technical',
      };

      const result = await orchestrator.executeAgent(agent, context);

      expect(result.success).toBe(true);
      expect(result.agent).toBe('code-reviewer');
      expect(result.output).toBeTruthy();
      expect(result.tokensUsed).toBeGreaterThan(0);
      expect(result.duration).toBeGreaterThanOrEqual(0);
    });

    it('should track token usage', async () => {
      const agent = mockAgents[0];
      const context: AgentContext = {
        query: 'Simple query',
      };

      const result = await orchestrator.executeAgent(agent, context);

      expect(result.tokensUsed).toBeGreaterThan(0);
    });
  });

  describe('Multi-Agent Execution', () => {
    it('should execute multiple agents sequentially', async () => {
      const agents = [mockAgents[0], mockAgents[1]];
      const context: AgentContext = {
        query: 'Review code for quality and security',
      };

      const result = await orchestrator.executeMultiAgent(
        agents,
        context,
        'sequential'
      );

      expect(result.success).toBe(true);
      expect(result.results.length).toBe(2);
      expect(result.totalTokens).toBeGreaterThan(0);
      expect(result.totalDuration).toBeGreaterThanOrEqual(0);
    });

    it('should execute multiple agents in parallel', async () => {
      const agents = [mockAgents[0], mockAgents[1], mockAgents[2]];
      const context: AgentContext = {
        query: 'Comprehensive analysis',
      };

      const result = await orchestrator.executeMultiAgent(
        agents,
        context,
        'parallel'
      );

      expect(result.success).toBe(true);
      expect(result.results.length).toBe(3);
      // Parallel execution should be faster than sequential for multiple agents
      expect(result.totalDuration).toBeLessThan(10000); // Less than 10 seconds
    });

    it('should handle hierarchical execution with dependencies', async () => {
      const agents = mockAgents;
      const context: AgentContext = {
        query: 'Full workflow analysis',
      };

      const result = await orchestrator.executeMultiAgent(
        agents,
        context,
        'hierarchical'
      );

      expect(result.success).toBe(true);
      expect(result.results.length).toBe(agents.length);
      expect(result.plan.dependencies).toBeDefined();
    });
  });

  describe('Agent Coordination', () => {
    it('should create execution plan', async () => {
      const agents = [mockAgents[0], mockAgents[1]];
      const context: AgentContext = {
        query: 'Test query',
      };

      const result = await orchestrator.executeMultiAgent(
        agents,
        context,
        'sequential'
      );

      expect(result.plan).toBeDefined();
      expect(result.plan.agents.length).toBe(2);
      expect(result.plan.strategy).toBe('sequential');
      expect(result.plan.expectedTokens).toBeGreaterThan(0);
    });

    it('should aggregate token usage across agents', async () => {
      const agents = [mockAgents[0], mockAgents[1]];
      const context: AgentContext = {
        query: 'Test query',
      };

      const result = await orchestrator.executeMultiAgent(
        agents,
        context,
        'parallel'
      );

      const individualTokens = result.results.reduce(
        (sum, r) => sum + r.tokensUsed,
        0
      );

      expect(result.totalTokens).toBe(individualTokens);
    });
  });
});
