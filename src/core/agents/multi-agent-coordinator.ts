/**
 * Multi-Agent Coordinator
 *
 * Coordinates execution of multiple agents with different strategies.
 */

import type {
  Agent,
  AgentContext,
  AgentExecutionResult,
  CoordinationStrategy,
  IAgentCoordinator,
  IAgentOrchestrator,
  MultiAgentPlan,
  MultiAgentResult,
} from './types';

export class MultiAgentCoordinator implements IAgentCoordinator {
  constructor(private orchestrator: IAgentOrchestrator) {}

  /**
   * Create execution plan for multiple agents
   */
  async createPlan(
    agents: Agent[],
    strategy: CoordinationStrategy
  ): Promise<MultiAgentPlan> {
    // Estimate token usage based on number of agents
    const estimatedTokensPerAgent = 3000; // Average estimate
    const expectedTokens = agents.length * estimatedTokensPerAgent;

    const plan: MultiAgentPlan = {
      agents,
      strategy,
      expectedTokens,
    };

    // For hierarchical strategy, define dependencies
    if (strategy === 'hierarchical') {
      plan.dependencies = this.buildDependencyGraph(agents);
    }

    return plan;
  }

  /**
   * Execute plan
   */
  async executePlan(
    plan: MultiAgentPlan,
    context: AgentContext
  ): Promise<MultiAgentResult> {
    const startTime = Date.now();
    let results: AgentExecutionResult[];

    switch (plan.strategy) {
      case 'sequential':
        results = await this.executeSequential(plan.agents, context);
        break;
      case 'parallel':
        results = await this.executeParallel(plan.agents, context);
        break;
      case 'hierarchical':
        results = await this.executeHierarchical(
          plan.agents,
          context,
          plan.dependencies!
        );
        break;
      default:
        throw new Error(`Unknown strategy: ${plan.strategy}`);
    }

    const totalDuration = Date.now() - startTime;
    const totalTokens = results.reduce((sum, r) => sum + r.tokensUsed, 0);
    const success = results.every((r) => r.success);

    return {
      plan,
      results,
      totalTokens,
      totalDuration,
      success,
    };
  }

  /**
   * Execute agents sequentially
   */
  async executeSequential(
    agents: Agent[],
    context: AgentContext
  ): Promise<AgentExecutionResult[]> {
    const results: AgentExecutionResult[] = [];

    for (const agent of agents) {
      const result = await this.orchestrator.executeAgent(agent, context);
      results.push(result);

      // If an agent fails in sequential mode, optionally stop
      if (!result.success) {
        console.warn(
          `Agent ${agent.metadata.name} failed in sequential execution`
        );
        // Continue with remaining agents (could be changed to stop)
      }
    }

    return results;
  }

  /**
   * Execute agents in parallel
   */
  async executeParallel(
    agents: Agent[],
    context: AgentContext
  ): Promise<AgentExecutionResult[]> {
    const promises = agents.map((agent) =>
      this.orchestrator.executeAgent(agent, context)
    );

    return Promise.all(promises);
  }

  /**
   * Execute agents with hierarchical dependencies
   */
  private async executeHierarchical(
    agents: Agent[],
    context: AgentContext,
    dependencies: Map<string, string[]>
  ): Promise<AgentExecutionResult[]> {
    const results = new Map<string, AgentExecutionResult>();
    const executed = new Set<string>();

    /**
     * Execute agent if dependencies are met
     */
    const executeIfReady = async (agent: Agent): Promise<void> => {
      const deps = dependencies.get(agent.metadata.name) || [];

      // Check if all dependencies are executed
      const depsReady = deps.every((dep) => executed.has(dep));

      if (!depsReady) {
        return; // Dependencies not ready yet
      }

      // Execute agent
      const result = await this.orchestrator.executeAgent(agent, context);
      results.set(agent.metadata.name, result);
      executed.add(agent.metadata.name);
    };

    // Keep executing until all agents are done
    while (executed.size < agents.length) {
      const readyAgents = agents.filter(
        (agent) => !executed.has(agent.metadata.name)
      );

      if (readyAgents.length === 0) {
        break; // No more agents to execute
      }

      // Execute all ready agents in parallel
      await Promise.all(readyAgents.map(executeIfReady));
    }

    // Return results in original agent order
    return agents.map(
      (agent) =>
        results.get(agent.metadata.name) || {
          agent: agent.metadata.name,
          success: false,
          output: '',
          tokensUsed: 0,
          duration: 0,
          error: 'Agent was not executed (dependency issue)',
        }
    );
  }

  /**
   * Build dependency graph (simple implementation)
   */
  private buildDependencyGraph(agents: Agent[]): Map<string, string[]> {
    const dependencies = new Map<string, string[]>();

    // For now, simple linear dependencies
    // In real implementation, would analyze agent integrations and requirements
    for (let i = 0; i < agents.length; i++) {
      const agent = agents[i];
      const deps: string[] = [];

      // Each agent depends on previous agents in technical workflows
      if (i > 0 && agent.metadata.category === 'technical') {
        deps.push(agents[i - 1].metadata.name);
      }

      dependencies.set(agent.metadata.name, deps);
    }

    return dependencies;
  }
}
