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
} from "./types";
import { Logger } from "./logger";

/**
 * Scoring weights for different matching criteria
 */
const SCORING_WEIGHTS = {
  KEYWORD: 10, // Highest weight - explicit keyword match
  TRIGGER: 8, // High weight - task trigger match
  EXPERTISE: 6, // Medium weight - domain expertise match
  CAPABILITY: 4, // Lower weight - general capability match
} as const;

export class AgentSelector implements IAgentSelector {
  private logger = new Logger("AgentSelector");
  private scoreCache = new Map<string, number>();

  /**
   * Score an agent's relevance to a query
   */
  scoreAgent(agent: Agent, query: string): number {
    if (!agent || !agent.metadata) {
      this.logger.warn("Invalid agent provided to scoreAgent");
      return 0;
    }

    if (!query || query.trim() === "") {
      this.logger.warn("Empty query provided to scoreAgent");
      return 0;
    }

    // Check cache first
    const cacheKey = this.getCacheKey(agent.metadata.name, query);
    const cachedScore = this.scoreCache.get(cacheKey);
    if (cachedScore !== undefined) {
      this.logger.debug("Using cached score", {
        agent: agent.metadata.name,
        score: cachedScore,
      });
      return cachedScore;
    }

    // Calculate score
    const score = this.calculateScore(agent, query);

    // Cache the result
    this.scoreCache.set(cacheKey, score);

    return score;
  }

  /**
   * Select best matching agents
   */
  select(
    agents: Agent[],
    criteria: AgentSelectionCriteria,
  ): AgentSelectionResult[] {
    // Validation
    if (!agents || agents.length === 0) {
      this.logger.warn("Empty agents array provided");
      return [];
    }

    if (!criteria.query || criteria.query.trim() === "") {
      this.logger.error("Query is required for agent selection");
      throw new Error("Query is required for agent selection");
    }

    this.logger.info("Selecting agents", {
      totalAgents: agents.length,
      query: criteria.query,
      category: criteria.category,
      complexity: criteria.complexity,
      maxAgents: criteria.maxAgents,
    });

    let filteredAgents = agents;

    // Filter by category if specified
    if (criteria.category) {
      filteredAgents = this.filterByCategory(filteredAgents, criteria.category);
      this.logger.debug("Filtered by category", {
        category: criteria.category,
        remaining: filteredAgents.length,
      });
    }

    // Filter by complexity if specified
    if (criteria.complexity) {
      filteredAgents = this.filterByComplexity(
        filteredAgents,
        criteria.complexity,
      );
      this.logger.debug("Filtered by complexity", {
        complexity: criteria.complexity,
        remaining: filteredAgents.length,
      });
    }

    // Filter by required expertise if specified
    if (criteria.requiredExpertise && criteria.requiredExpertise.length > 0) {
      filteredAgents = filteredAgents.filter((agent) =>
        criteria.requiredExpertise!.some((exp) =>
          agent.metadata.expertise.includes(exp),
        ),
      );
      this.logger.debug("Filtered by expertise", {
        requiredExpertise: criteria.requiredExpertise,
        remaining: filteredAgents.length,
      });
    }

    // Score and sort agents
    const scoredAgents: AgentSelectionResult[] = filteredAgents
      .map((agent) => {
        const score = this.scoreAgent(agent, criteria.query);
        const queryLower = criteria.query.toLowerCase();

        const matchedKeywords = agent.metadata.activation.keywords.filter(
          (keyword) => queryLower.includes(keyword.toLowerCase()),
        );

        const matchedTriggers = agent.metadata.activation.triggers.filter(
          (trigger) => queryLower.includes(trigger.replace(/_/g, " ")),
        );

        const reason = this.generateSelectionReason(
          agent,
          matchedKeywords,
          matchedTriggers,
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
    const selectedAgents = scoredAgents.slice(0, maxAgents);

    this.logger.info("Agents selected", {
      count: selectedAgents.length,
      agents: selectedAgents.map((r) => ({
        name: r.agent.metadata.name,
        score: r.score,
      })),
    });

    return selectedAgents;
  }

  /**
   * Filter agents by category
   */
  filterByCategory(agents: Agent[], category: AgentCategory): Agent[] {
    if (!agents || !category) {
      return agents;
    }
    return agents.filter((agent) => agent.metadata.category === category);
  }

  /**
   * Filter agents by complexity
   */
  filterByComplexity(agents: Agent[], complexity: ComplexityLevel): Agent[] {
    if (!agents || !complexity) {
      return agents;
    }
    return agents.filter((agent) =>
      agent.metadata.activation.complexity.includes(complexity),
    );
  }

  /**
   * Clear score cache
   */
  clearCache(): void {
    this.scoreCache.clear();
    this.logger.debug("Score cache cleared");
  }

  /**
   * Calculate score for an agent (internal method)
   */
  private calculateScore(agent: Agent, query: string): number {
    let score = 0;
    const queryLower = query.toLowerCase();
    const { activation, expertise, capabilities } = agent.metadata;

    // Keyword matching (highest weight)
    const matchedKeywords = activation.keywords.filter((keyword) =>
      queryLower.includes(keyword.toLowerCase()),
    );
    score += matchedKeywords.length * SCORING_WEIGHTS.KEYWORD;

    // Trigger matching
    const matchedTriggers = activation.triggers.filter((trigger) =>
      queryLower.includes(trigger.replace(/_/g, " ")),
    );
    score += matchedTriggers.length * SCORING_WEIGHTS.TRIGGER;

    // Expertise matching
    const matchedExpertise = expertise.filter((exp) =>
      queryLower.includes(exp.toLowerCase()),
    );
    score += matchedExpertise.length * SCORING_WEIGHTS.EXPERTISE;

    // Capability matching (fixed redundant toLowerCase)
    const matchedCapabilities = capabilities.filter((cap) =>
      queryLower.includes(cap.toLowerCase().substring(0, 20)),
    );
    score += matchedCapabilities.length * SCORING_WEIGHTS.CAPABILITY;

    this.logger.debug("Calculated score", {
      agent: agent.metadata.name,
      score,
      matchedKeywords: matchedKeywords.length,
      matchedTriggers: matchedTriggers.length,
      matchedExpertise: matchedExpertise.length,
      matchedCapabilities: matchedCapabilities.length,
    });

    return score;
  }

  /**
   * Generate reason for agent selection
   */
  private generateSelectionReason(
    agent: Agent,
    matchedKeywords: string[],
    matchedTriggers: string[],
  ): string {
    const reasons: string[] = [];

    if (matchedKeywords.length > 0) {
      reasons.push(
        `Matched keywords: ${matchedKeywords.slice(0, 3).join(", ")}`,
      );
    }

    if (matchedTriggers.length > 0) {
      reasons.push(
        `Matched triggers: ${matchedTriggers.slice(0, 2).join(", ")}`,
      );
    }

    if (reasons.length === 0) {
      reasons.push(
        `Expertise in: ${agent.metadata.expertise.slice(0, 2).join(", ")}`,
      );
    }

    return reasons.join("; ");
  }

  /**
   * Generate cache key
   */
  private getCacheKey(agentName: string, query: string): string {
    return `${agentName}:${query.toLowerCase()}`;
  }
}
