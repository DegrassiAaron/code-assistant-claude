/**
 * Agent Selector
 *
 * Selects appropriate agents based on query analysis and matching criteria.
 */

import type {
  Agent,
  AgentSelectionCriteria,
  AgentSelectionResult,
  AgentCategory,
  ComplexityLevel,
  IAgentSelector,
} from './types';

export class AgentSelector implements IAgentSelector {
  /**
   * Score an agent's relevance to a query
   */
  scoreAgent(agent: Agent, query: string): number {
    let score = 0;
    const queryLower = query.toLowerCase();
    const { activation, expertise, capabilities } = agent.metadata;

    // Keyword matching (highest weight)
    const matchedKeywords = activation.keywords.filter((keyword) =>
      queryLower.includes(keyword.toLowerCase())
    );
    score += matchedKeywords.length * 10;

    // Trigger matching
    const matchedTriggers = activation.triggers.filter((trigger) =>
      queryLower.includes(trigger.replace(/_/g, ' '))
    );
    score += matchedTriggers.length * 8;

    // Expertise matching
    const matchedExpertise = expertise.filter((exp) =>
      queryLower.includes(exp.toLowerCase())
    );
    score += matchedExpertise.length * 6;

    // Capability matching
    const matchedCapabilities = capabilities.filter((cap) =>
      queryLower.toLowerCase().includes(cap.toLowerCase().substring(0, 20))
    );
    score += matchedCapabilities.length * 4;

    return score;
  }

  /**
   * Select best matching agents
   */
  select(
    agents: Agent[],
    criteria: AgentSelectionCriteria
  ): AgentSelectionResult[] {
    let filteredAgents = agents;

    // Filter by category if specified
    if (criteria.category) {
      filteredAgents = this.filterByCategory(filteredAgents, criteria.category);
    }

    // Filter by complexity if specified
    if (criteria.complexity) {
      filteredAgents = this.filterByComplexity(
        filteredAgents,
        criteria.complexity
      );
    }

    // Filter by required expertise if specified
    if (criteria.requiredExpertise && criteria.requiredExpertise.length > 0) {
      filteredAgents = filteredAgents.filter((agent) =>
        criteria.requiredExpertise!.some((exp) =>
          agent.metadata.expertise.includes(exp)
        )
      );
    }

    // Score and sort agents
    const scoredAgents: AgentSelectionResult[] = filteredAgents
      .map((agent) => {
        const score = this.scoreAgent(agent, criteria.query);
        const queryLower = criteria.query.toLowerCase();

        const matchedKeywords = agent.metadata.activation.keywords.filter(
          (keyword) => queryLower.includes(keyword.toLowerCase())
        );

        const matchedTriggers = agent.metadata.activation.triggers.filter(
          (trigger) => queryLower.includes(trigger.replace(/_/g, ' '))
        );

        const reason = this.generateSelectionReason(
          agent,
          matchedKeywords,
          matchedTriggers
        );

        return {
          agent,
          score,
          matchedKeywords,
          matchedTriggers,
          reason,
        };
      })
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score);

    // Limit to maxAgents if specified
    const maxAgents = criteria.maxAgents || scoredAgents.length;
    return scoredAgents.slice(0, maxAgents);
  }

  /**
   * Filter agents by category
   */
  filterByCategory(agents: Agent[], category: AgentCategory): Agent[] {
    return agents.filter((agent) => agent.metadata.category === category);
  }

  /**
   * Filter agents by complexity
   */
  filterByComplexity(agents: Agent[], complexity: ComplexityLevel): Agent[] {
    return agents.filter((agent) =>
      agent.metadata.activation.complexity.includes(complexity)
    );
  }

  /**
   * Generate reason for agent selection
   */
  private generateSelectionReason(
    agent: Agent,
    matchedKeywords: string[],
    matchedTriggers: string[]
  ): string {
    const reasons: string[] = [];

    if (matchedKeywords.length > 0) {
      reasons.push(
        `Matched keywords: ${matchedKeywords.slice(0, 3).join(', ')}`
      );
    }

    if (matchedTriggers.length > 0) {
      reasons.push(
        `Matched triggers: ${matchedTriggers.slice(0, 2).join(', ')}`
      );
    }

    if (reasons.length === 0) {
      reasons.push(`Expertise in: ${agent.metadata.expertise.slice(0, 2).join(', ')}`);
    }

    return reasons.join('; ');
  }
}
