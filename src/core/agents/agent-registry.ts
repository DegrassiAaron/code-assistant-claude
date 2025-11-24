/**
 * Agent Registry
 *
 * Manages available agents, caching, and lazy loading.
 */

import type {
  Agent,
  AgentCategory,
  AgentRegistry as IAgentRegistry,
  ExpertName,
  PanelMode,
} from './types';
import { AgentLoader } from './agent-loader';
import { Logger } from './logger';

export class AgentRegistry {
  private technical = new Map<string, Agent>();
  private business = new Map<string, Agent>();
  private businessExperts = new Map<ExpertName, string>();
  private panelModes = new Map<PanelMode, string>();
  private loader: AgentLoader;
  private logger = new Logger('AgentRegistry');
  private initialized = false;

  constructor() {
    this.loader = new AgentLoader();
  }

  /**
   * Initialize registry by loading all agents
   */
  async initialize(agentsDirectory: string): Promise<void> {
    if (this.initialized) {
      this.logger.warn('Registry already initialized');
      return;
    }

    this.logger.info('Initializing agent registry', { agentsDirectory });

    try {
      const agents = await this.loader.loadAgentsFromDirectory(agentsDirectory);

      for (const agent of agents) {
        this.registerAgent(agent);
      }

      // Load business panel expert profiles
      await this.loadBusinessPanelExperts(agentsDirectory);

      // Load panel modes
      await this.loadPanelModes(agentsDirectory);

      this.initialized = true;

      this.logger.info('Agent registry initialized', {
        technicalAgents: this.technical.size,
        businessAgents: this.business.size,
        businessExperts: this.businessExperts.size,
        panelModes: this.panelModes.size,
      });
    } catch (error) {
      this.logger.error('Failed to initialize registry', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Register an agent
   */
  registerAgent(agent: Agent): void {
    const category = agent.metadata.category;
    const name = agent.metadata.name;

    if (category === 'technical') {
      this.technical.set(name, agent);
    } else if (category === 'business') {
      this.business.set(name, agent);
    }

    this.logger.debug('Agent registered', {
      name,
      category,
    });
  }

  /**
   * Get agent by name
   */
  getAgent(name: string, category?: AgentCategory): Agent | undefined {
    if (category === 'technical') {
      return this.technical.get(name);
    } else if (category === 'business') {
      return this.business.get(name);
    }

    // Search both if category not specified
    return this.technical.get(name) || this.business.get(name);
  }

  /**
   * Get all agents
   */
  getAllAgents(): Agent[] {
    return [
      ...Array.from(this.technical.values()),
      ...Array.from(this.business.values()),
    ];
  }

  /**
   * Get agents by category
   */
  getAgentsByCategory(category: AgentCategory): Agent[] {
    if (category === 'technical') {
      return Array.from(this.technical.values());
    } else {
      return Array.from(this.business.values());
    }
  }

  /**
   * Get business panel expert profile path
   */
  getExpertProfile(expert: ExpertName): string | undefined {
    return this.businessExperts.get(expert);
  }

  /**
   * Get panel mode template path
   */
  getPanelMode(mode: PanelMode): string | undefined {
    return this.panelModes.get(mode);
  }

  /**
   * Check if registry is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Get registry as interface
   */
  toInterface(): IAgentRegistry {
    return {
      technical: new Map(this.technical),
      business: new Map(this.business),
      businessExperts: new Map(this.businessExperts),
      panelModes: new Map(this.panelModes),
    };
  }

  /**
   * Load business panel expert profiles
   */
  private async loadBusinessPanelExperts(baseDirectory: string): Promise<void> {
    const expertsDir = `${baseDirectory}/business-panel/experts`;

    try {
      const expertFiles: Array<[ExpertName, string]> = [
        ['christensen', `${expertsDir}/christensen.md`],
        ['porter', `${expertsDir}/porter.md`],
        ['drucker', `${expertsDir}/drucker.md`],
        ['godin', `${expertsDir}/godin.md`],
        ['kim-mauborgne', `${expertsDir}/kim-mauborgne.md`],
        ['collins', `${expertsDir}/collins.md`],
        ['taleb', `${expertsDir}/taleb.md`],
        ['meadows', `${expertsDir}/meadows.md`],
        ['doumont', `${expertsDir}/doumont.md`],
      ];

      for (const [expert, path] of expertFiles) {
        this.businessExperts.set(expert, path);
      }

      this.logger.debug('Business panel experts loaded', {
        count: this.businessExperts.size,
      });
    } catch (error) {
      this.logger.warn('Failed to load business panel experts', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Load panel modes
   */
  private async loadPanelModes(baseDirectory: string): Promise<void> {
    const modesDir = `${baseDirectory}/business-panel/modes`;

    try {
      const modeFiles: Array<[PanelMode, string]> = [
        ['discussion', `${modesDir}/discussion.md`],
        ['debate', `${modesDir}/debate.md`],
        ['socratic', `${modesDir}/socratic.md`],
      ];

      for (const [mode, path] of modeFiles) {
        this.panelModes.set(mode, path);
      }

      this.logger.debug('Panel modes loaded', {
        count: this.panelModes.size,
      });
    } catch (error) {
      this.logger.warn('Failed to load panel modes', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
