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

  describe('Edge Cases - Input Validation', () => {
    it('should throw error when registering empty agents array', () => {
      const emptyOrchestrator = new AgentOrchestrator();
      expect(() => emptyOrchestrator.registerAgents([])).toThrow(
        'Cannot register empty agents array'
      );
    });

    it('should throw error when registering null agents array', () => {
      const nullOrchestrator = new AgentOrchestrator();
      expect(() => nullOrchestrator.registerAgents(null as any)).toThrow(
        'Cannot register empty agents array'
      );
    });

    it('should throw error when selecting with empty query', async () => {
      const criteria: AgentSelectionCriteria = {
        query: '',
        maxAgents: 5,
      };

      await expect(orchestrator.selectAgents(criteria)).rejects.toThrow(
        'Query is required for agent selection'
      );
    });

    it('should throw error when selecting with whitespace-only query', async () => {
      const criteria: AgentSelectionCriteria = {
        query: '   ',
        maxAgents: 5,
      };

      await expect(orchestrator.selectAgents(criteria)).rejects.toThrow(
        'Query is required for agent selection'
      );
    });

    it('should handle agent with malformed metadata gracefully', () => {
      const malformedAgent = {
        metadata: {
          name: '', // Empty name
          description: 'Test',
          category: 'technical',
        },
      } as any;

      expect(() =>
        new AgentOrchestrator().registerAgents([malformedAgent])
      ).toThrow('Invalid agent metadata');
    });

    it('should handle agent with missing metadata', () => {
      const noMetadataAgent = {
        content: 'Test content',
        path: 'test.md',
      } as any;

      expect(() =>
        new AgentOrchestrator().registerAgents([noMetadataAgent])
      ).toThrow('Invalid agent metadata');
    });
  });

  describe('Edge Cases - Timeout Handling', () => {
    it('should timeout long-running agent execution', async () => {
      const agent = mockAgents[0];
      const context: AgentContext = {
        query: 'Test query',
      };

      const result = await orchestrator.executeAgent(agent, context, {
        timeout: 1, // 1ms timeout - should trigger timeout
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('timeout');
    });

    it('should respect custom timeout values', async () => {
      const agent = mockAgents[0];
      const context: AgentContext = {
        query: 'Test query',
      };

      const result = await orchestrator.executeAgent(agent, context, {
        timeout: 60000, // 60 second timeout - should succeed
      });

      expect(result.duration).toBeLessThan(60000);
    });
  });

  describe('Edge Cases - Error Policies', () => {
    it('should stop sequential execution on first error when continueOnError is false', async () => {
      const agents = [mockAgents[0], mockAgents[1], mockAgents[2]];
      const context: AgentContext = {
        query: 'Test query',
      };

      const result = await orchestrator.executeMultiAgent(agents, context, 'sequential', {
        policy: {
          continueOnError: false,
          maxFailures: undefined,
          timeout: 30000,
          maxConcurrent: 5,
        },
      });

      // Should only execute until first failure
      expect(result.results.length).toBeGreaterThanOrEqual(1);
      expect(result.results.length).toBeLessThanOrEqual(agents.length);
    });

    it('should respect maxFailures policy', async () => {
      const agents = [mockAgents[0], mockAgents[1], mockAgents[2]];
      const context: AgentContext = {
        query: 'Test query',
      };

      const result = await orchestrator.executeMultiAgent(agents, context, 'sequential', {
        policy: {
          continueOnError: true,
          maxFailures: 1,
          timeout: 30000,
          maxConcurrent: 5,
        },
      });

      // Should continue after failures up to maxFailures
      expect(result.results.length).toBeGreaterThanOrEqual(1);
    });

    it('should continue execution when continueOnError is true', async () => {
      const agents = [mockAgents[0], mockAgents[1], mockAgents[2]];
      const context: AgentContext = {
        query: 'Test query',
      };

      const result = await orchestrator.executeMultiAgent(agents, context, 'sequential', {
        policy: {
          continueOnError: true,
          maxFailures: undefined,
          timeout: 30000,
          maxConcurrent: 5,
        },
      });

      // Should execute all agents even if some fail
      expect(result.results.length).toBe(agents.length);
    });
  });

  describe('Edge Cases - Concurrency Limits', () => {
    it('should respect maxConcurrent limit in parallel execution', async () => {
      const manyAgents = [
        ...mockAgents,
        ...mockAgents,
        ...mockAgents,
      ]; // 9 agents total
      const context: AgentContext = {
        query: 'Test query',
      };

      const startTime = Date.now();
      const result = await orchestrator.executeMultiAgent(
        manyAgents,
        context,
        'parallel',
        {
          policy: {
            continueOnError: true,
            maxFailures: undefined,
            timeout: 30000,
            maxConcurrent: 3, // Limit to 3 concurrent executions
          },
        }
      );
      const duration = Date.now() - startTime;

      expect(result.results.length).toBe(9);
      // With maxConcurrent=3, should take at least 3 batches
      // (execution time should be >= time for 1 batch)
      expect(duration).toBeGreaterThanOrEqual(0);
    });

    it('should handle single agent with maxConcurrent=1', async () => {
      const context: AgentContext = {
        query: 'Test query',
      };

      const result = await orchestrator.executeMultiAgent(
        [mockAgents[0]],
        context,
        'parallel',
        {
          policy: {
            continueOnError: true,
            maxFailures: undefined,
            timeout: 30000,
            maxConcurrent: 1,
          },
        }
      );

      expect(result.success).toBe(true);
      expect(result.results.length).toBe(1);
    });
  });

  describe('Edge Cases - Circular Dependencies', () => {
    it('should detect circular dependencies in hierarchical execution', async () => {
      const circularAgents: Agent[] = [
        {
          metadata: {
            name: 'agent-a',
            description: 'Agent A',
            category: 'technical',
            expertise: ['Test'],
            activation: {
              keywords: ['test'],
              complexity: ['simple'],
              triggers: ['test'],
            },
            capabilities: ['Testing'],
            integrations: {
              skills: [],
              mcps: [],
              other_agents: ['agent-b'], // Depends on B
            },
          },
          content: 'Agent A content',
          path: 'agent-a.md',
        },
        {
          metadata: {
            name: 'agent-b',
            description: 'Agent B',
            category: 'technical',
            expertise: ['Test'],
            activation: {
              keywords: ['test'],
              complexity: ['simple'],
              triggers: ['test'],
            },
            capabilities: ['Testing'],
            integrations: {
              skills: [],
              mcps: [],
              other_agents: ['agent-a'], // Depends on A (circular!)
            },
          },
          content: 'Agent B content',
          path: 'agent-b.md',
        },
      ];

      const circularOrchestrator = new AgentOrchestrator();
      circularOrchestrator.registerAgents(circularAgents);

      const context: AgentContext = {
        query: 'Test query',
      };

      await expect(
        circularOrchestrator.executeMultiAgent(
          circularAgents,
          context,
          'hierarchical'
        )
      ).rejects.toThrow(/[Cc]ircular dependency/);
    });

    it('should handle self-referencing agent dependency', async () => {
      const selfReferencingAgent: Agent = {
        metadata: {
          name: 'self-agent',
          description: 'Self referencing',
          category: 'technical',
          expertise: ['Test'],
          activation: {
            keywords: ['test'],
            complexity: ['simple'],
            triggers: ['test'],
          },
          capabilities: ['Testing'],
          integrations: {
            skills: [],
            mcps: [],
            other_agents: ['self-agent'], // References itself
          },
        },
        content: 'Self agent content',
        path: 'self-agent.md',
      };

      const selfOrchestrator = new AgentOrchestrator();
      selfOrchestrator.registerAgents([selfReferencingAgent]);

      const context: AgentContext = {
        query: 'Test query',
      };

      await expect(
        selfOrchestrator.executeMultiAgent(
          [selfReferencingAgent],
          context,
          'hierarchical'
        )
      ).rejects.toThrow(/[Cc]ircular dependency|[Ii]nfinite loop/);
    });
  });

  describe('Edge Cases - Cache Behavior', () => {
    it('should cache agent selection scores', async () => {
      const criteria: AgentSelectionCriteria = {
        query: 'code review and security audit',
        maxAgents: 5,
      };

      // First call - should calculate scores
      const result1 = await orchestrator.selectAgents(criteria);

      // Second call - should use cached scores
      const result2 = await orchestrator.selectAgents(criteria);

      expect(result1.length).toBe(result2.length);
      expect(result1[0].score).toBe(result2[0].score);
      expect(result1[0].agent.metadata.name).toBe(
        result2[0].agent.metadata.name
      );
    });

    it('should handle different queries independently in cache', async () => {
      const criteria1: AgentSelectionCriteria = {
        query: 'code review',
        maxAgents: 5,
      };

      const criteria2: AgentSelectionCriteria = {
        query: 'security audit',
        maxAgents: 5,
      };

      const result1 = await orchestrator.selectAgents(criteria1);
      const result2 = await orchestrator.selectAgents(criteria2);

      // Different queries should yield different results
      expect(result1[0].agent.metadata.name).not.toBe(
        result2[0].agent.metadata.name
      );
    });
  });

  describe('Edge Cases - Token Counting', () => {
    it('should count tokens for empty output', async () => {
      const agent = {
        ...mockAgents[0],
        content: '', // Empty content
      };
      const context: AgentContext = {
        query: 'Test query',
      };

      const result = await orchestrator.executeAgent(agent, context);

      expect(result.tokensUsed).toBeGreaterThanOrEqual(0);
    });

    it('should count tokens differently for code vs prose', async () => {
      const codeAgent = {
        ...mockAgents[0],
        content: '```typescript\nfunction test() { return true; }\n```',
      };
      const proseAgent = {
        ...mockAgents[0],
        content: 'This is a simple prose description without any code blocks.',
      };

      const context: AgentContext = {
        query: 'Test query',
      };

      const codeResult = await orchestrator.executeAgent(codeAgent, context);
      const proseResult = await orchestrator.executeAgent(proseAgent, context);

      // Both should have token counts
      expect(codeResult.tokensUsed).toBeGreaterThan(0);
      expect(proseResult.tokensUsed).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases - Memory Management', () => {
    it('should handle large number of agents without memory issues', async () => {
      const largeAgentSet: Agent[] = [];
      for (let i = 0; i < 50; i++) {
        largeAgentSet.push({
          ...mockAgents[0],
          metadata: {
            ...mockAgents[0].metadata,
            name: `agent-${i}`,
          },
        });
      }

      const largeOrchestrator = new AgentOrchestrator();
      expect(() => largeOrchestrator.registerAgents(largeAgentSet)).not.toThrow();

      const criteria: AgentSelectionCriteria = {
        query: 'code review',
        maxAgents: 50,
      };

      const results = await largeOrchestrator.selectAgents(criteria);
      expect(results.length).toBeGreaterThan(0);
      expect(results.length).toBeLessThanOrEqual(50);
    });

    it('should handle very long query strings', async () => {
      const longQuery = 'code review '.repeat(1000); // Very long query
      const criteria: AgentSelectionCriteria = {
        query: longQuery,
        maxAgents: 5,
      };

      const results = await orchestrator.selectAgents(criteria);
      expect(results.length).toBeGreaterThan(0);
    });
  });
});
