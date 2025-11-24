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
  ExecutionOptions,
  ExecutionPolicy,
  IAgentCoordinator,
  IAgentOrchestrator,
  MultiAgentPlan,
  MultiAgentResult,
} from "./types";
import { Logger } from "./logger";

/**
 * Default execution policy
 */
const DEFAULT_POLICY: ExecutionPolicy = {
  continueOnError: true,
  maxFailures: undefined,
  timeout: 30000, // 30 seconds
  maxConcurrent: 5,
};

export class MultiAgentCoordinator implements IAgentCoordinator {
  private logger = new Logger("MultiAgentCoordinator");

  constructor(private orchestrator: IAgentOrchestrator) {}

  /**
   * Create execution plan for multiple agents
   */
  async createPlan(
    agents: Agent[],
    strategy: CoordinationStrategy,
  ): Promise<MultiAgentPlan> {
    if (!agents || agents.length === 0) {
      throw new Error("Cannot create plan with empty agents array");
    }

    this.logger.info("Creating execution plan", {
      agentCount: agents.length,
      strategy,
    });

    // Estimate token usage based on agent metadata
    const expectedTokens = agents.reduce(
      (sum, agent) => sum + this.estimateAgentTokens(agent),
      0,
    );

    const plan: MultiAgentPlan = {
      agents,
      strategy,
      expectedTokens,
    };

    // For hierarchical strategy, define dependencies
    if (strategy === "hierarchical") {
      plan.dependencies = this.buildDependencyGraph(agents);
      this.logger.debug("Built dependency graph", {
        dependencies: Array.from(plan.dependencies.entries()),
      });
    }

    return plan;
  }

  /**
   * Execute plan
   */
  async executePlan(
    plan: MultiAgentPlan,
    context: AgentContext,
    options?: ExecutionOptions,
  ): Promise<MultiAgentResult> {
    const startTime = Date.now();
    const policy = { ...DEFAULT_POLICY, ...options?.policy };

    this.logger.info("Executing plan", {
      strategy: plan.strategy,
      agentCount: plan.agents.length,
      policy,
    });

    let results: AgentExecutionResult[];

    try {
      switch (plan.strategy) {
        case "sequential":
          results = await this.executeSequential(plan.agents, context, options);
          break;
        case "parallel":
          results = await this.executeParallel(plan.agents, context, options);
          break;
        case "hierarchical":
          if (!plan.dependencies) {
            throw new Error("Hierarchical strategy requires dependencies");
          }
          results = await this.executeHierarchical(
            plan.agents,
            context,
            plan.dependencies,
            options,
          );
          break;
        default:
          throw new Error(`Unknown strategy: ${plan.strategy}`);
      }
    } catch (error) {
      this.logger.error("Plan execution failed", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
      throw error;
    }

    const totalDuration = Date.now() - startTime;
    const totalTokens = results.reduce((sum, r) => sum + r.tokensUsed, 0);
    const success = results.every((r) => r.success);

    this.logger.info("Plan execution completed", {
      totalDuration,
      totalTokens,
      success,
      resultsCount: results.length,
    });

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
    context: AgentContext,
    options?: ExecutionOptions,
  ): Promise<AgentExecutionResult[]> {
    const policy = { ...DEFAULT_POLICY, ...options?.policy };
    const results: AgentExecutionResult[] = [];
    let failureCount = 0;

    this.logger.debug("Starting sequential execution", {
      agentCount: agents.length,
      policy,
    });

    for (const agent of agents) {
      this.logger.debug("Executing agent sequentially", {
        agent: agent.metadata.name,
      });

      const result = await this.orchestrator.executeAgent(
        agent,
        context,
        options,
      );
      results.push(result);

      if (!result.success) {
        failureCount++;
        this.logger.warn("Agent execution failed", {
          agent: agent.metadata.name,
          error: result.error,
          failureCount,
        });

        // Check if we should stop
        if (
          !policy.continueOnError ||
          (policy.maxFailures && failureCount >= policy.maxFailures)
        ) {
          this.logger.info("Stopping sequential execution due to failures", {
            failureCount,
            maxFailures: policy.maxFailures,
          });
          break;
        }
      }
    }

    return results;
  }

  /**
   * Execute agents in parallel with concurrency limit
   */
  async executeParallel(
    agents: Agent[],
    context: AgentContext,
    options?: ExecutionOptions,
  ): Promise<AgentExecutionResult[]> {
    const policy = { ...DEFAULT_POLICY, ...options?.policy };
    const maxConcurrent = policy.maxConcurrent || 5;
    const results: AgentExecutionResult[] = [];

    this.logger.debug("Starting parallel execution", {
      agentCount: agents.length,
      maxConcurrent,
    });

    // Execute in batches to respect concurrency limit
    for (let i = 0; i < agents.length; i += maxConcurrent) {
      const batch = agents.slice(i, i + maxConcurrent);

      this.logger.debug("Executing batch", {
        batchNumber: Math.floor(i / maxConcurrent) + 1,
        batchSize: batch.length,
      });

      const batchPromises = batch.map((agent) =>
        this.orchestrator.executeAgent(agent, context, options),
      );

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      // Log any failures
      const batchFailures = batchResults.filter((r) => !r.success);
      if (batchFailures.length > 0) {
        this.logger.warn("Batch had failures", {
          failureCount: batchFailures.length,
          agents: batchFailures.map((r) => r.agent),
        });
      }
    }

    return results;
  }

  /**
   * Execute agents with hierarchical dependencies (fixed infinite loop)
   */
  private async executeHierarchical(
    agents: Agent[],
    context: AgentContext,
    dependencies: Map<string, string[]>,
    options?: ExecutionOptions,
  ): Promise<AgentExecutionResult[]> {
    const results = new Map<string, AgentExecutionResult>();
    const executed = new Set<string>();
    const maxIterations = agents.length * 2; // Safety limit
    let iterations = 0;

    this.logger.debug("Starting hierarchical execution", {
      agentCount: agents.length,
    });

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
      this.logger.debug("Executing agent in hierarchy", {
        agent: agent.metadata.name,
        dependencies: deps,
      });

      const result = await this.orchestrator.executeAgent(
        agent,
        context,
        options,
      );
      results.set(agent.metadata.name, result);
      executed.add(agent.metadata.name);
    };

    // Keep executing until all agents are done
    while (executed.size < agents.length) {
      iterations++;

      // Detect circular dependencies or infinite loop
      if (iterations > maxIterations) {
        this.logger.error(
          "Max iterations exceeded - likely circular dependency",
          {
            executed: Array.from(executed),
            remaining: agents
              .filter((a) => !executed.has(a.metadata.name))
              .map((a) => a.metadata.name),
          },
        );
        throw new Error(
          "Circular dependency or infinite loop detected in hierarchical execution",
        );
      }

      const readyAgents = agents.filter(
        (agent) => !executed.has(agent.metadata.name),
      );

      if (readyAgents.length === 0) {
        break; // No more agents to execute
      }

      const sizeBefore = executed.size;

      // Execute all ready agents in parallel
      await Promise.all(readyAgents.map(executeIfReady));

      // Check if we made progress
      if (executed.size === sizeBefore) {
        // No progress - circular dependency detected
        const remaining = agents
          .filter((a) => !executed.has(a.metadata.name))
          .map((a) => a.metadata.name);

        this.logger.error("No progress made - circular dependency", {
          remaining,
          dependencies: remaining.map((name) => ({
            agent: name,
            deps: dependencies.get(name),
          })),
        });

        throw new Error(
          `Circular dependency detected. Unable to execute: ${remaining.join(", ")}`,
        );
      }
    }

    this.logger.debug("Hierarchical execution completed", {
      iterations,
      executed: executed.size,
    });

    // Return results in original agent order
    return agents.map(
      (agent) =>
        results.get(agent.metadata.name) || {
          agent: agent.metadata.name,
          success: false,
          output: "",
          tokensUsed: 0,
          duration: 0,
          error: "Agent was not executed (dependency issue)",
        },
    );
  }

  /**
   * Build dependency graph
   */
  private buildDependencyGraph(agents: Agent[]): Map<string, string[]> {
    const dependencies = new Map<string, string[]>();

    // Analyze agent integrations to build dependencies
    for (let i = 0; i < agents.length; i++) {
      const agent = agents[i];
      const deps: string[] = [];

      // Check if this agent depends on other agents
      const otherAgents = agent?.metadata?.integrations?.other_agents || [];

      for (const depAgentName of otherAgents) {
        // Find if dependency is in our agent list
        const depAgent = agents.find((a) => a.metadata.name === depAgentName);
        if (depAgent) {
          deps.push(depAgent.metadata.name);
        }
      }

      // For technical workflows, simple linear dependency if no explicit deps
      if (
        deps.length === 0 &&
        i > 0 &&
        agent?.metadata?.category === "technical"
      ) {
        const prevAgent = agents[i - 1];
        if (prevAgent) {
          deps.push(prevAgent.metadata.name);
        }
      }

      dependencies.set(agent.metadata.name, deps);
    }

    return dependencies;
  }

  /**
   * Estimate token usage for an agent
   */
  private estimateAgentTokens(agent: Agent): number {
    const baseTokens = 2000;

    // More complex agents use more tokens
    const complexityMultiplier = agent.metadata.activation.complexity.includes(
      "complex",
    )
      ? 1.5
      : 1.0;

    // More capabilities = more output
    const capabilityBonus = agent.metadata.capabilities.length * 100;

    return Math.ceil(baseTokens * complexityMultiplier + capabilityBonus);
  }
}
