/**
 * Agent System Types
 *
 * Type definitions for the agent orchestration system including
 * specialized technical agents and business panel experts.
 */

/**
 * Agent categories
 */
export type AgentCategory = 'technical' | 'business';

/**
 * Complexity levels for agent activation
 */
export type ComplexityLevel = 'simple' | 'moderate' | 'complex';

/**
 * Agent activation configuration
 */
export interface AgentActivation {
  keywords: string[];
  complexity: ComplexityLevel[];
  triggers: string[];
}

/**
 * Agent metadata from frontmatter
 */
export interface AgentMetadata {
  name: string;
  description: string;
  category: AgentCategory;
  expertise: string[];
  activation: AgentActivation;
  capabilities: string[];
  integrations: {
    skills?: string[];
    mcps?: string[];
    other_agents?: string[];
  };
}

/**
 * Agent content and metadata
 */
export interface Agent {
  metadata: AgentMetadata;
  content: string;
  path: string;
}

/**
 * Agent selection criteria
 */
export interface AgentSelectionCriteria {
  query: string;
  category?: AgentCategory;
  complexity?: ComplexityLevel;
  requiredExpertise?: string[];
  maxAgents?: number;
}

/**
 * Agent selection result with score
 */
export interface AgentSelectionResult {
  agent: Agent;
  score: number;
  matchedKeywords: string[];
  matchedTriggers: string[];
  reason: string;
}

/**
 * Business panel modes
 */
export type PanelMode = 'discussion' | 'debate' | 'socratic';

/**
 * Business panel expert names
 */
export type ExpertName =
  | 'christensen'
  | 'porter'
  | 'drucker'
  | 'godin'
  | 'kim-mauborgne'
  | 'collins'
  | 'taleb'
  | 'meadows'
  | 'doumont';

/**
 * Business panel configuration
 */
export interface BusinessPanelConfig {
  mode: PanelMode;
  experts?: ExpertName[];
  rounds?: number;
  document?: string;
  question?: string;
}

/**
 * Expert perspective in panel discussion
 */
export interface ExpertPerspective {
  expert: ExpertName;
  framework: string;
  insights: string[];
  recommendations: string[];
}

/**
 * Panel analysis result
 */
export interface PanelAnalysisResult {
  topic: string;
  mode: PanelMode;
  experts: ExpertName[];
  perspectives: ExpertPerspective[];
  convergence: string[];
  tensions: string[];
  synthesis: string;
  recommendations: string[];
  actionItems: string[];
  successCriteria: string[];
  risksAndMitigations: string[];
  tokensUsed: number;
}

/**
 * Agent execution context
 */
export interface AgentContext {
  query: string;
  category?: AgentCategory;
  complexity?: ComplexityLevel;
  attachments?: string[];
  metadata?: Record<string, unknown>;
}

/**
 * Agent execution result
 */
export interface AgentExecutionResult {
  agent: string;
  success: boolean;
  output: string;
  tokensUsed: number;
  duration: number;
  error?: string;
}

/**
 * Multi-agent coordination strategy
 */
export type CoordinationStrategy = 'sequential' | 'parallel' | 'hierarchical';

/**
 * Execution policy for error handling
 */
export interface ExecutionPolicy {
  continueOnError: boolean;
  maxFailures?: number;
  timeout?: number;
  maxConcurrent?: number;
}

/**
 * Execution options
 */
export interface ExecutionOptions {
  timeout?: number;
  policy?: ExecutionPolicy;
  enableCaching?: boolean;
}

/**
 * Log level
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Log entry
 */
export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Multi-agent execution plan
 */
export interface MultiAgentPlan {
  agents: Agent[];
  strategy: CoordinationStrategy;
  dependencies?: Map<string, string[]>;
  expectedTokens: number;
}

/**
 * Multi-agent execution result
 */
export interface MultiAgentResult {
  plan: MultiAgentPlan;
  results: AgentExecutionResult[];
  totalTokens: number;
  totalDuration: number;
  success: boolean;
}

/**
 * Agent registry for managing available agents
 */
export interface AgentRegistry {
  technical: Map<string, Agent>;
  business: Map<string, Agent>;
  businessExperts: Map<ExpertName, string>;
  panelModes: Map<PanelMode, string>;
}

/**
 * Agent orchestrator interface
 */
export interface IAgentOrchestrator {
  /**
   * Select appropriate agent(s) for a given query
   */
  selectAgents(criteria: AgentSelectionCriteria): Promise<AgentSelectionResult[]>;

  /**
   * Execute a single agent
   */
  executeAgent(
    agent: Agent,
    context: AgentContext,
    options?: ExecutionOptions
  ): Promise<AgentExecutionResult>;

  /**
   * Execute multiple agents with coordination
   */
  executeMultiAgent(
    agents: Agent[],
    context: AgentContext,
    strategy: CoordinationStrategy,
    options?: ExecutionOptions
  ): Promise<MultiAgentResult>;
}

/**
 * Business panel orchestrator interface
 */
export interface IBusinessPanel {
  /**
   * Conduct a panel analysis
   */
  analyze(config: BusinessPanelConfig): Promise<PanelAnalysisResult>;

  /**
   * Auto-select experts based on question
   */
  autoSelectExperts(question: string, mode: PanelMode): Promise<ExpertName[]>;

  /**
   * Load expert profile
   */
  loadExpert(expert: ExpertName): Promise<string>;

  /**
   * Load panel mode template
   */
  loadMode(mode: PanelMode): Promise<string>;
}

/**
 * Agent selector interface
 */
export interface IAgentSelector {
  /**
   * Score agent relevance for query
   */
  scoreAgent(agent: Agent, query: string): number;

  /**
   * Select best matching agents
   */
  select(
    agents: Agent[],
    criteria: AgentSelectionCriteria
  ): AgentSelectionResult[];

  /**
   * Filter agents by category
   */
  filterByCategory(agents: Agent[], category: AgentCategory): Agent[];

  /**
   * Filter agents by complexity
   */
  filterByComplexity(agents: Agent[], complexity: ComplexityLevel): Agent[];
}

/**
 * Agent coordinator interface
 */
export interface IAgentCoordinator {
  /**
   * Create execution plan for multiple agents
   */
  createPlan(
    agents: Agent[],
    strategy: CoordinationStrategy
  ): Promise<MultiAgentPlan>;

  /**
   * Execute plan
   */
  executePlan(
    plan: MultiAgentPlan,
    context: AgentContext,
    options?: ExecutionOptions
  ): Promise<MultiAgentResult>;

  /**
   * Coordinate sequential execution
   */
  executeSequential(
    agents: Agent[],
    context: AgentContext,
    options?: ExecutionOptions
  ): Promise<AgentExecutionResult[]>;

  /**
   * Coordinate parallel execution
   */
  executeParallel(
    agents: Agent[],
    context: AgentContext,
    options?: ExecutionOptions
  ): Promise<AgentExecutionResult[]>;
}

/**
 * Logger interface
 */
export interface ILogger {
  debug(message: string, metadata?: Record<string, unknown>): void;
  info(message: string, metadata?: Record<string, unknown>): void;
  warn(message: string, metadata?: Record<string, unknown>): void;
  error(message: string, metadata?: Record<string, unknown>): void;
}

/**
 * Agent loader interface
 */
export interface IAgentLoader {
  /**
   * Load agent from markdown file
   */
  loadAgent(path: string): Promise<Agent>;

  /**
   * Load all agents from directory
   */
  loadAgentsFromDirectory(directory: string): Promise<Agent[]>;

  /**
   * Parse agent frontmatter
   */
  parseFrontmatter(content: string): AgentMetadata;
}
