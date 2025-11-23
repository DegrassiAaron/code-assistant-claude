/**
 * Agent Orchestrator
 *
 * Main coordinator for agent selection and execution.
 */

import type {
  Agent,
  AgentContext,
  AgentExecutionResult,
  AgentSelectionCriteria,
  AgentSelectionResult,
  CoordinationStrategy,
  ExecutionOptions,
  IAgentOrchestrator,
  MultiAgentResult,
} from './types';
import { AgentSelector } from './agent-selector';
import { MultiAgentCoordinator } from './multi-agent-coordinator';
import { Logger } from './logger';
import { TokenCounter } from './token-counter';

export class AgentOrchestrator implements IAgentOrchestrator {
  private selector: AgentSelector;
  private coordinator: MultiAgentCoordinator;
  private logger = new Logger('AgentOrchestrator');
  private tokenCounter = new TokenCounter();
  private availableAgents: Agent[] = [];

  constructor() {
    this.selector = new AgentSelector();
    this.coordinator = new MultiAgentCoordinator(this);
  }

  /**
   * Register available agents
   * @throws {Error} If agents array is empty or contains invalid agents
   */
  registerAgents(agents: Agent[]): void {
    if (!agents || agents.length === 0) {
      throw new Error('Cannot register empty agents array');
    }

    // Validate agents
    for (const agent of agents) {
      if (!agent.metadata || !agent.metadata.name) {
        throw new Error('Invalid agent metadata');
      }
    }

    this.availableAgents = agents;

    this.logger.info('Agents registered', {
      count: agents.length,
      agents: agents.map((a) => a.metadata.name),
    });
  }

  /**
   * Select appropriate agents for a query
   */
  async selectAgents(
    criteria: AgentSelectionCriteria
  ): Promise<AgentSelectionResult[]> {
    this.logger.debug('Selecting agents', { criteria });

    const results = this.selector.select(this.availableAgents, criteria);

    return results;
  }

  /**
   * Execute a single agent
   */
  async executeAgent(
    agent: Agent,
    context: AgentContext,
    options?: ExecutionOptions
  ): Promise<AgentExecutionResult> {
    const startTime = Date.now();
    const timeout = options?.timeout || 30000; // 30 second default

    this.logger.info('Executing agent', {
      agent: agent.metadata.name,
      query: context.query,
      timeout,
    });

    try {
      // Create timeout promise
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Agent execution timeout')), timeout)
      );

      // Create execution promise
      const executionPromise = this.executeAgentInternal(agent, context);

      // Race between execution and timeout
      const output = await Promise.race([executionPromise, timeoutPromise]);
      const duration = Date.now() - startTime;

      const tokensUsed = this.tokenCounter.countTokens(output);

      this.logger.info('Agent execution successful', {
        agent: agent.metadata.name,
        duration,
        tokensUsed,
      });

      return {
        agent: agent.metadata.name,
        success: true,
        output,
        tokensUsed,
        duration,
      };
    } catch (error) {
      const duration = Date.now() - startTime;

      this.logger.error('Agent execution failed', {
        agent: agent.metadata.name,
        duration,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      return {
        agent: agent.metadata.name,
        success: false,
        output: '',
        tokensUsed: 0,
        duration,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Execute multiple agents with coordination
   */
  async executeMultiAgent(
    agents: Agent[],
    context: AgentContext,
    strategy: CoordinationStrategy,
    options?: ExecutionOptions
  ): Promise<MultiAgentResult> {
    this.logger.info('Executing multi-agent workflow', {
      agentCount: agents.length,
      strategy,
    });

    const plan = await this.coordinator.createPlan(agents, strategy);
    return this.coordinator.executePlan(plan, context, options);
  }

  /**
   * Execute agent (internal implementation)
   * This is where real agent execution would happen
   */
  private async executeAgentInternal(
    agent: Agent,
    context: AgentContext
  ): Promise<string> {
    // In a full implementation, this would:
    // 1. Load agent template/instructions from agent.content
    // 2. Prepare context and query
    // 3. Call LLM with agent instructions + context
    // 4. Parse and structure output

    // For now, we'll create a structured output based on agent content
    // This simulates what a real execution might produce

    const { metadata, content } = agent;

    // Build prompt for agent
    const prompt = this.buildAgentPrompt(agent, context);

    // Simulate agent execution
    // In production, this would be: await callLLM(prompt)
    const output = this.simulateAgentExecution(prompt, metadata.name, context);

    return output;
  }

  /**
   * Build prompt for agent execution
   */
  private buildAgentPrompt(agent: Agent, context: AgentContext): string {
    const { metadata, content } = agent;

    return `
# Agent: ${metadata.name}

## Agent Instructions
${content.substring(0, 2000)} // Truncate for demo

## Task
Category: ${context.category || 'general'}
Complexity: ${context.complexity || 'moderate'}

## Query
${context.query}

${context.attachments && context.attachments.length > 0 ? `
## Attachments
${context.attachments.join('\n')}
` : ''}

## Required Output
Provide analysis following your expertise in:
${metadata.expertise.map((e) => `- ${e}`).join('\n')}

Apply these capabilities:
${metadata.capabilities.slice(0, 3).map((c) => `- ${c}`).join('\n')}
    `.trim();
  }

  /**
   * Simulate agent execution (mock implementation)
   * In production, this would call the LLM
   */
  private simulateAgentExecution(
    prompt: string,
    agentName: string,
    context: AgentContext
  ): string {
    // This is a placeholder that generates structured output
    // Real implementation would call LLM with the prompt

    return `
# ${agentName} Analysis

## Query Analysis
**Task**: ${context.query}

## Expert Assessment
The ${agentName} agent has analyzed this request using specialized expertise.

## Key Findings
- Analysis point 1 based on agent's framework
- Analysis point 2 demonstrating domain knowledge
- Analysis point 3 with actionable insights

## Recommendations
1. **Primary Recommendation**: [Based on agent's specialty]
   - Rationale: [Expert reasoning]
   - Expected Impact: [Quantified benefit]

2. **Secondary Recommendation**: [Supporting action]
   - Rationale: [Expert reasoning]
   - Expected Impact: [Quantified benefit]

## Implementation Steps
1. [Step 1 with specifics]
2. [Step 2 with specifics]
3. [Step 3 with specifics]

## Success Criteria
- Metric 1: [Measurable outcome]
- Metric 2: [Measurable outcome]

## Risks & Mitigations
- **Risk**: [Potential issue]
  **Mitigation**: [How to address]

---
*Analysis completed by ${agentName} agent*
*Token-optimized output following best practices*
    `.trim();
  }
}
