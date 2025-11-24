# Intelligent Task Routing System
## Automatic Selection of Optimal Skills, MCPs, and Commands

**Goal**: Rafforzare l'uso appropriato di skill/MCP/comandi attraverso routing intelligente basato sul task richiesto.

---

## 🎯 Core Philosophy

**Right Tool for Right Job**: Ogni task deve automaticamente attivare la combinazione ottimale di:
- **Skills**: Expertise specializzata, progressive loading
- **MCP Servers**: Tool integration, data access
- **Commands**: Workflow automation shortcuts
- **Agents**: Multi-step complex reasoning
- **Modes**: Behavioral adaptations (Brainstorming, Research, etc.)

---

## 🧠 Task Classification System

### Task Analyzer

```typescript
interface TaskClassification {
  type: TaskType;
  complexity: 'simple' | 'moderate' | 'complex' | 'enterprise';
  domain: Domain[];
  requiredCapabilities: Capability[];
  estimatedTokens: number;
  recommendedResources: RecommendedResources;
}

interface RecommendedResources {
  skills: string[];
  mcps: string[];
  commands: string[];
  agents: string[];
  mode: BehavioralMode;
}

class TaskAnalyzer {
  async classify(userRequest: string): Promise<TaskClassification> {
    // 1. Parse user intent
    const intent = await this.parseIntent(userRequest);

    // 2. Detect task type
    const taskType = this.detectTaskType(intent);

    // 3. Assess complexity
    const complexity = this.assessComplexity(intent, taskType);

    // 4. Identify domains
    const domains = this.identifyDomains(intent);

    // 5. Determine required capabilities
    const capabilities = this.determineCapabilities(
      taskType,
      complexity,
      domains
    );

    // 6. Recommend optimal resources
    const resources = this.recommendResources(
      taskType,
      complexity,
      domains,
      capabilities
    );

    return {
      type: taskType,
      complexity,
      domain: domains,
      requiredCapabilities: capabilities,
      estimatedTokens: this.estimateTokenUsage(resources),
      recommendedResources: resources
    };
  }
}
```

### Task Types with Routing Rules

```yaml
task_types:
  code_implementation:
    keywords: ["implement", "create", "build", "add feature"]
    skills: ["code-reviewer", "test-generator"]
    mcps: ["serena", "sequential"]
    commands: ["/sc:implement", "/sc:scaffold"]
    mode: "orchestration"
    token_budget: "medium"

  code_review:
    keywords: ["review", "analyze code", "check quality"]
    skills: ["code-reviewer", "security-auditor", "performance-optimizer"]
    mcps: ["serena"]
    commands: ["/sc:review"]
    agents: ["code-reviewer-agent"]
    mode: "introspection"
    token_budget: "medium"

  ui_design:
    keywords: ["UI", "component", "frontend", "design", "layout"]
    skills: ["frontend-design"]
    mcps: ["magic", "playwright"]
    commands: ["/sc:scaffold", "/ui"]
    mode: "orchestration"
    token_budget: "high"

  research:
    keywords: ["research", "investigate", "find information", "analyze market"]
    skills: []
    mcps: ["tavily", "sequential"]
    commands: ["/sc:research"]
    agents: ["deep-research-agent"]
    mode: "deep-research"
    token_budget: "high"

  business_analysis:
    keywords: ["strategy", "business", "market", "innovation", "risk"]
    skills: ["business-panel"]
    mcps: ["sequential", "tavily"]
    commands: ["/sc:business-panel"]
    agents: ["business-panel-agent"]
    mode: "business-panel"
    token_budget: "medium"

  testing:
    keywords: ["test", "testing", "unit test", "e2e", "integration test"]
    skills: ["test-generator"]
    mcps: ["playwright", "serena"]
    commands: ["/sc:test"]
    agents: ["test-engineer-agent"]
    mode: "orchestration"
    token_budget: "medium"

  debugging:
    keywords: ["debug", "fix bug", "error", "troubleshoot"]
    skills: ["security-auditor", "performance-optimizer"]
    mcps: ["sequential", "serena"]
    commands: ["/sc:troubleshoot"]
    agents: ["debugger-agent"]
    mode: "introspection"
    token_budget: "high"

  requirements_discovery:
    keywords: ["brainstorm", "idea", "explore", "not sure", "help me plan"]
    skills: []
    mcps: ["sequential"]
    commands: ["/sc:brainstorm"]
    agents: ["requirements-analyst"]
    mode: "brainstorming"
    token_budget: "medium"

  documentation:
    keywords: ["document", "readme", "api docs", "write docs"]
    skills: ["technical-writer", "api-documenter"]
    mcps: ["serena", "context7"]
    commands: ["/sc:document", "/docs-gen"]
    mode: "orchestration"
    token_budget: "low"

  deployment:
    keywords: ["deploy", "deployment", "CI/CD", "release"]
    skills: ["devops-automation"]
    mcps: ["github"]
    commands: ["/sc:deploy"]
    agents: ["devops-architect"]
    mode: "orchestration"
    token_budget: "medium"

  security_audit:
    keywords: ["security", "vulnerability", "audit", "penetration"]
    skills: ["security-auditor", "secret-scanner"]
    mcps: ["serena", "sequential"]
    commands: ["/security"]
    agents: ["security-engineer"]
    mode: "introspection"
    token_budget: "high"

  refactoring:
    keywords: ["refactor", "clean up", "improve code", "optimize"]
    skills: ["code-reviewer", "performance-optimizer"]
    mcps: ["morphllm", "serena"]
    commands: ["/sc:improve"]
    agents: ["refactoring-expert"]
    mode: "orchestration"
    token_budget: "medium"
```

---

## 🔄 Routing Decision Tree

```
User Request → Task Analyzer
                    ↓
        ┌───────────────────────┐
        │ Intent Classification │
        └───────────────────────┘
                    ↓
        ┌───────────────────────┐
        │ Complexity Assessment │
        └───────────────────────┘
                    ↓
        ┌───────────────────────┐
        │ Domain Identification │
        └───────────────────────┘
                    ↓
        ┌───────────────────────┐
        │ Resource Recommendation│
        └───────────────────────┘
                    ↓
    ┌───────────────┴───────────────┐
    ↓                               ↓
Skills + MCPs                   Commands
    ↓                               ↓
Progressive Load              Invoke Workflow
    ↓                               ↓
Code Execution               Multi-Step Process
    ↓                               ↓
Token Optimized              Quality Gates
    ↓                               ↓
    └───────────────┬───────────────┘
                    ↓
            Execute with Mode
                    ↓
            Validate & Audit
```

---

## 🎨 Domain-Based Routing

### Frontend Development

```yaml
frontend_tasks:
  ui_component:
    keywords: ["button", "form", "modal", "navbar", "card"]
    skills: ["frontend-design"]
    mcps: ["magic", "playwright"]
    commands: ["/sc:scaffold react-component"]
    example: "Create a responsive login form"
    token_approach: "Use Magic MCP for 21st.dev patterns"

  design_system:
    keywords: ["design system", "theme", "style guide", "brand"]
    skills: ["frontend-design", "technical-writer"]
    mcps: ["magic", "figma"]
    commands: ["/design-system"]
    example: "Create design system based on Figma"
    token_approach: "Figma MCP → extract tokens → generate CSS vars"

  accessibility:
    keywords: ["a11y", "accessibility", "WCAG", "aria"]
    skills: ["frontend-design"]
    mcps: ["playwright"]
    commands: ["/a11y-audit"]
    example: "Audit accessibility compliance"
    token_approach: "Playwright automated testing"

  performance:
    keywords: ["performance", "optimize", "lazy load", "bundle"]
    skills: ["performance-optimizer"]
    mcps: ["chrome-devtools"]
    commands: ["/perf-audit"]
    example: "Optimize React app performance"
    token_approach: "Chrome DevTools profiling"
```

### Backend Development

```yaml
backend_tasks:
  api_design:
    keywords: ["API", "endpoint", "REST", "GraphQL"]
    skills: ["api-designer", "security-auditor"]
    mcps: ["serena", "sequential"]
    commands: ["/sc:design api"]
    example: "Design RESTful API for user management"
    token_approach: "Sequential reasoning + Serena symbol ops"

  database:
    keywords: ["database", "schema", "migration", "query"]
    skills: ["database-schema", "performance-optimizer"]
    mcps: ["serena"]
    commands: ["/db-migration"]
    example: "Create database schema for e-commerce"
    token_approach: "Serena for dependency tracking"

  authentication:
    keywords: ["auth", "login", "JWT", "OAuth", "session"]
    skills: ["security-auditor", "api-designer"]
    mcps: ["context7", "serena"]
    commands: ["/auth-scaffold"]
    example: "Implement JWT authentication"
    token_approach: "Context7 for Auth0 patterns"

  microservices:
    keywords: ["microservice", "architecture", "distributed"]
    skills: []
    mcps: ["sequential", "serena"]
    commands: ["/sc:design system"]
    agents: ["backend-architect", "system-architect"]
    mode: "orchestration"
    example: "Design microservices architecture"
    token_approach: "Sequential for system design"
```

### DevOps & Infrastructure

```yaml
devops_tasks:
  deployment:
    keywords: ["deploy", "deployment", "CI/CD", "pipeline"]
    skills: ["devops-automation"]
    mcps: ["github"]
    commands: ["/sc:deploy"]
    example: "Setup CI/CD pipeline"
    token_approach: "GitHub MCP for actions automation"

  containerization:
    keywords: ["docker", "container", "kubernetes", "k8s"]
    skills: ["devops-automation"]
    mcps: ["context7"]
    commands: ["/docker-scaffold"]
    example: "Create Dockerfile for Node.js app"
    token_approach: "Context7 for official Docker patterns"

  monitoring:
    keywords: ["monitoring", "observability", "logging", "metrics"]
    skills: ["devops-automation"]
    mcps: ["sequential"]
    commands: ["/monitoring-setup"]
    example: "Setup Prometheus monitoring"
    token_approach: "Sequential for architecture planning"
```

### Security

```yaml
security_tasks:
  vulnerability_scan:
    keywords: ["security", "vulnerability", "CVE", "scan"]
    skills: ["security-auditor", "secret-scanner", "dependency-auditor"]
    mcps: ["serena"]
    commands: ["/security-scan"]
    example: "Scan for security vulnerabilities"
    token_approach: "Multiple skills for comprehensive audit"

  penetration_testing:
    keywords: ["pentest", "penetration", "exploit"]
    skills: ["security-auditor"]
    mcps: ["playwright", "chrome-devtools"]
    commands: ["/pentest"]
    agents: ["security-engineer"]
    example: "Perform security penetration test"
    token_approach: "Playwright for browser-based testing"

  compliance:
    keywords: ["compliance", "GDPR", "SOC2", "audit"]
    skills: ["security-auditor", "technical-writer"]
    mcps: ["sequential", "serena"]
    commands: ["/compliance-check"]
    example: "GDPR compliance audit"
    token_approach: "Sequential for systematic review"
```

---

## ⚡ Intelligent MCP Selection

### MCP Priority Matrix

```yaml
mcp_selection_rules:
  # Always load (core functionality)
  always_load:
    - serena       # Project memory, symbol operations
    reason: "Essential for project context and code understanding"

  # Load by task type
  conditional_load:
    ui_tasks:
      - magic      # UI component generation
      - playwright # Browser testing
      - figma      # Design-to-code

    backend_tasks:
      - context7   # Official docs
      - sequential # Complex reasoning

    research_tasks:
      - tavily     # Web search
      - sequential # Multi-step reasoning

    data_tasks:
      - chrome-devtools  # Performance analysis
      - playwright       # Data extraction

  # Load by tech stack
  tech_specific:
    react:
      - magic      # React components
      - playwright # React testing

    python:
      - context7   # Python docs

    infrastructure:
      - context7   # Official infrastructure docs

  # Never load (token waste)
  exclude_unless_explicit:
    - Unused integrations
    - Redundant servers
    - Inactive project-specific MCPs
```

### Dynamic MCP Loading Logic

```typescript
class MCPRouter {
  async selectOptimalMCPs(
    taskClassification: TaskClassification
  ): Promise<MCPServer[]> {
    const mcps: Set<MCPServer> = new Set();

    // 1. Always load core MCPs
    mcps.add(this.registry.get('serena'));

    // 2. Load task-specific MCPs
    for (const domain of taskClassification.domain) {
      const domainMCPs = this.getRecommendedMCPsForDomain(domain);
      domainMCPs.forEach(mcp => mcps.add(mcp));
    }

    // 3. Load tech-specific MCPs
    const techStack = await this.detectTechStack();
    for (const tech of techStack) {
      const techMCPs = this.registry.getTechSpecific(tech);
      techMCPs.forEach(mcp => mcps.add(mcp));
    }

    // 4. Optimize for token budget
    const sortedMCPs = this.prioritizeByTokenEfficiency(Array.from(mcps));

    // 5. Filter to stay within budget
    const tokenBudget = this.getTokenBudgetForComplexity(
      taskClassification.complexity
    );

    return this.selectWithinBudget(sortedMCPs, tokenBudget);
  }

  private prioritizeByTokenEfficiency(mcps: MCPServer[]): MCPServer[] {
    return mcps.sort((a, b) => {
      // Prioritize by: utility / token_cost ratio
      const aScore = a.utility_score / a.token_cost;
      const bScore = b.utility_score / b.token_cost;
      return bScore - aScore;
    });
  }

  private selectWithinBudget(
    mcps: MCPServer[],
    budget: number
  ): MCPServer[] {
    const selected: MCPServer[] = [];
    let totalCost = 0;

    for (const mcp of mcps) {
      if (totalCost + mcp.token_cost <= budget) {
        selected.push(mcp);
        totalCost += mcp.token_cost;
      }
    }

    return selected;
  }
}
```

---

## 🎪 Skill Selection Engine

### Skill Recommendation Matrix

```yaml
skill_triggers:
  # Code Quality
  code_save_event:
    auto_activate: ["code-reviewer"]
    conditions: "File saved in src/, lib/, app/"

  pre_commit_event:
    auto_activate: ["security-auditor", "secret-scanner", "test-generator"]
    conditions: "Git pre-commit hook"

  # Task-based activation
  frontend_task:
    keywords: ["component", "UI", "design", "layout"]
    activate: ["frontend-design"]
    token_cost: 1500

  api_task:
    keywords: ["API", "endpoint", "REST", "GraphQL"]
    activate: ["api-designer", "security-auditor"]
    token_cost: 2500

  testing_task:
    keywords: ["test", "testing", "coverage"]
    activate: ["test-generator"]
    token_cost: 2000

  documentation_task:
    keywords: ["document", "readme", "docs"]
    activate: ["technical-writer", "api-documenter"]
    token_cost: 1800

  # Business context
  strategic_task:
    keywords: ["strategy", "business model", "market"]
    activate: ["business-panel"]
    token_cost: 3500

  # Mode-based skills
  brainstorming_mode:
    trigger: "/sc:brainstorm"
    activate: ["superclaude-brainstorming"]
    token_cost: 2000

  research_mode:
    trigger: "/sc:research"
    activate: ["superclaude-research", "mcp-progressive-discovery"]
    token_cost: 2500
```

### Skill Composition Rules

```typescript
class SkillComposer {
  /**
   * Determine optimal skill combination for task
   * Considers:
   * - Skill dependencies
   * - Complementary skills
   * - Token budget
   * - Task requirements
   */
  async composeSkills(
    taskType: TaskType,
    tokenBudget: number
  ): Promise<Skill[]> {
    // 1. Get recommended skills for task
    const recommended = this.getRecommendedSkills(taskType);

    // 2. Resolve dependencies
    const withDeps = await this.resolveDependencies(recommended);

    // 3. Add complementary skills
    const complementary = this.findComplementarySkills(withDeps);

    // 4. Optimize for token budget
    const optimized = this.optimizeForBudget(
      [...withDeps, ...complementary],
      tokenBudget
    );

    return optimized;
  }

  private async resolveDependencies(
    skills: Skill[]
  ): Promise<Skill[]> {
    const result: Set<Skill> = new Set(skills);

    for (const skill of skills) {
      if (skill.dependencies) {
        for (const depName of skill.dependencies) {
          const dep = await this.registry.getSkill(depName);
          result.add(dep);
        }
      }
    }

    return Array.from(result);
  }

  private findComplementarySkills(skills: Skill[]): Skill[] {
    const complementary: Skill[] = [];

    for (const skill of skills) {
      if (skill.composability) {
        for (const compName of skill.composability) {
          const comp = this.registry.getSkill(compName);
          if (comp && this.shouldAdd(comp, skills)) {
            complementary.push(comp);
          }
        }
      }
    }

    return complementary;
  }

  private optimizeForBudget(
    skills: Skill[],
    budget: number
  ): Skill[] {
    // Sort by priority and token efficiency
    const sorted = skills.sort((a, b) => {
      const aPriority = this.getPriorityScore(a);
      const bPriority = this.getPriorityScore(b);

      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }

      // If same priority, prefer lower token cost
      return a.fullTokenCost - b.fullTokenCost;
    });

    // Select skills within budget
    const selected: Skill[] = [];
    let totalCost = 0;

    for (const skill of sorted) {
      // Always include metadata cost
      const cost = skill.tokenCost;

      if (totalCost + cost <= budget * 0.15) { // 15% of total for skills
        selected.push(skill);
        totalCost += skill.fullTokenCost; // Reserve full cost
      }
    }

    return selected;
  }

  private getPriorityScore(skill: Skill): number {
    const priorityMap = {
      'critical': 100,
      'high': 75,
      'medium': 50,
      'low': 25
    };

    return priorityMap[skill.priority] || 50;
  }
}
```

---

## 🚀 Command Selection Strategy

### Command Routing Rules

```typescript
class CommandRouter {
  /**
   * Select optimal command for user request
   * Considers:
   * - Task type and complexity
   * - User preferences
   * - Token efficiency
   * - Workflow automation potential
   */
  async selectCommand(
    userRequest: string,
    taskClassification: TaskClassification
  ): Promise<Command | null> {
    // 1. Check for explicit command invocation
    if (userRequest.startsWith('/')) {
      const cmdName = userRequest.split(' ')[0].slice(1);
      return await this.registry.getCommand(cmdName);
    }

    // 2. Match task type to command
    const candidates = this.matchTaskToCommands(taskClassification.type);

    // 3. Filter by complexity
    const suitable = candidates.filter(cmd =>
      this.isSuitableForComplexity(cmd, taskClassification.complexity)
    );

    // 4. Select best match
    if (suitable.length === 0) return null;
    if (suitable.length === 1) return suitable[0];

    // Multiple matches: ask user or use highest priority
    return await this.selectBestCommand(suitable, taskClassification);
  }

  private matchTaskToCommands(taskType: TaskType): Command[] {
    const mapping: Record<TaskType, string[]> = {
      'code_implementation': ['/sc:implement', '/sc:scaffold'],
      'code_review': ['/sc:review'],
      'testing': ['/sc:test', '/test-gen'],
      'research': ['/sc:research'],
      'business_analysis': ['/sc:business-panel'],
      'documentation': ['/sc:document', '/docs-gen'],
      'debugging': ['/sc:troubleshoot'],
      'deployment': ['/sc:deploy'],
      'refactoring': ['/sc:improve']
    };

    const commandNames = mapping[taskType] || [];
    return commandNames.map(name => this.registry.getCommand(name));
  }

  private selectBestCommand(
    commands: Command[],
    classification: TaskClassification
  ): Command {
    // Score each command
    const scores = commands.map(cmd => ({
      command: cmd,
      score: this.scoreCommand(cmd, classification)
    }));

    // Return highest scoring
    scores.sort((a, b) => b.score - a.score);
    return scores[0].command;
  }

  private scoreCommand(
    cmd: Command,
    classification: TaskClassification
  ): number {
    let score = 0;

    // Domain match
    for (const domain of classification.domain) {
      if (cmd.domains?.includes(domain)) score += 10;
    }

    // Capability match
    for (const cap of classification.requiredCapabilities) {
      if (cmd.capabilities?.includes(cap)) score += 5;
    }

    // Complexity suitability
    if (cmd.complexity === classification.complexity) score += 15;

    // Token efficiency
    score += (1000 - cmd.estimated_tokens) / 100;

    return score;
  }
}
```

---

## 🧩 Mode Selection Engine

### Behavioral Mode Routing

```typescript
class ModeSelector {
  /**
   * Determine optimal behavioral mode for task
   * Modes influence Claude's communication style,
   * tool selection, and problem-solving approach
   */
  async selectMode(
    taskClassification: TaskClassification,
    userPreferences: UserPreferences
  ): Promise<BehavioralMode> {
    // 1. Check explicit mode flags
    if (userPreferences.explicitMode) {
      return userPreferences.explicitMode;
    }

    // 2. Match task to mode
    const modeScores = this.scoreAllModes(taskClassification);

    // 3. Select highest scoring mode
    const sorted = Object.entries(modeScores)
      .sort(([, a], [, b]) => b - a);

    return sorted[0][0] as BehavioralMode;
  }

  private scoreAllModes(
    classification: TaskClassification
  ): Record<BehavioralMode, number> {
    return {
      brainstorming: this.scoreBrainstorming(classification),
      deep_research: this.scoreDeepResearch(classification),
      orchestration: this.scoreOrchestration(classification),
      task_management: this.scoreTaskManagement(classification),
      token_efficiency: this.scoreTokenEfficiency(classification),
      introspection: this.scoreIntrospection(classification),
      business_panel: this.scoreBusinessPanel(classification)
    };
  }

  private scoreBrainstorming(c: TaskClassification): number {
    let score = 0;

    // Vague requirements
    if (c.hasVagueRequirements) score += 30;

    // Exploration keywords
    if (c.hasExplorationKeywords) score += 20;

    // No clear technical direction
    if (!c.hasTechnicalDirection) score += 25;

    // Uncertainty indicators
    if (c.hasUncertainty) score += 15;

    return score;
  }

  private scoreDeepResearch(c: TaskClassification): number {
    let score = 0;

    // Research keywords
    if (c.type === 'research') score += 40;

    // Requires external information
    if (c.needsExternalInfo) score += 25;

    // Market/competitive analysis
    if (c.domains.includes('market_analysis')) score += 20;

    // Multi-source verification needed
    if (c.requiresVerification) score += 15;

    return score;
  }

  private scoreOrchestration(c: TaskClassification): number {
    let score = 0;

    // Multi-tool operations
    if (c.toolCount > 3) score += 30;

    // Parallel execution opportunities
    if (c.parallelizable) score += 25;

    // Multiple file operations
    if (c.fileCount > 3) score += 20;

    // Complex coordination needed
    if (c.complexity === 'complex' || c.complexity === 'enterprise') {
      score += 25;
    }

    return score;
  }

  private scoreTaskManagement(c: TaskClassification): number {
    let score = 0;

    // Multi-step operation
    if (c.stepCount > 3) score += 30;

    // Complex dependencies
    if (c.hasDependencies) score += 20;

    // Long-running task
    if (c.estimatedDuration > 300) score += 25; // >5 minutes

    // Multiple phases
    if (c.phaseCount > 1) score += 15;

    return score;
  }

  private scoreTokenEfficiency(c: TaskClassification): number {
    let score = 0;

    // High token usage expected
    if (c.estimatedTokens > 150000) score += 35;

    // Context pressure
    if (c.contextPressure > 0.75) score += 30;

    // Large-scale operations
    if (c.fileCount > 10) score += 20;

    // Explicit efficiency request
    if (c.hasEfficiencyKeywords) score += 15;

    return score;
  }

  private scoreIntrospection(c: TaskClassification): number {
    let score = 0;

    // Debugging task
    if (c.type === 'debugging') score += 35;

    // Error recovery
    if (c.hasErrors) score += 25;

    // Code review
    if (c.type === 'code_review') score += 20;

    // Quality analysis
    if (c.requiresQualityAnalysis) score += 15;

    return score;
  }

  private scoreBusinessPanel(c: TaskClassification): number {
    let score = 0;

    // Business/strategic keywords
    if (c.type === 'business_analysis') score += 40;

    // Strategic domains
    const strategicDomains = [
      'strategy', 'market', 'innovation', 'risk'
    ];
    const matches = c.domains.filter(d =>
      strategicDomains.includes(d)
    ).length;
    score += matches * 15;

    return score;
  }
}
```

---

## 🎯 Automatic Workflow Orchestration

### Multi-Resource Coordination

```typescript
class WorkflowOrchestrator {
  /**
   * Orchestrate optimal combination of resources for task
   */
  async orchestrate(
    userRequest: string
  ): Promise<ExecutionPlan> {
    // 1. Classify task
    const classification = await this.taskAnalyzer.classify(userRequest);

    // 2. Select behavioral mode
    const mode = await this.modeSelector.selectMode(
      classification,
      this.userPreferences
    );

    // 3. Select skills
    const skills = await this.skillComposer.composeSkills(
      classification.type,
      this.getTokenBudget(classification.complexity)
    );

    // 4. Select MCPs
    const mcps = await this.mcpRouter.selectOptimalMCPs(classification);

    // 5. Select command (if applicable)
    const command = await this.commandRouter.selectCommand(
      userRequest,
      classification
    );

    // 6. Select agents (if needed)
    const agents = await this.agentSelector.selectAgents(classification);

    // 7. Generate execution plan
    return {
      mode,
      skills,
      mcps,
      command,
      agents,
      tokenBudget: this.allocateTokenBudget(
        classification,
        skills,
        mcps
      ),
      executionStrategy: this.determineStrategy(classification),
      qualityGates: this.defineQualityGates(classification)
    };
  }

  private determineStrategy(
    classification: TaskClassification
  ): ExecutionStrategy {
    if (classification.complexity === 'simple') {
      return {
        approach: 'direct',
        parallelization: false,
        validation: 'basic'
      };
    }

    if (classification.complexity === 'moderate') {
      return {
        approach: 'progressive',
        parallelization: true,
        validation: 'standard'
      };
    }

    if (classification.complexity === 'complex') {
      return {
        approach: 'phased',
        parallelization: true,
        validation: 'comprehensive',
        checkpoints: true
      };
    }

    // Enterprise
    return {
      approach: 'systematic',
      parallelization: true,
      validation: 'enterprise',
      checkpoints: true,
      approval_gates: true
    };
  }
}
```

---

## 📊 Real-World Routing Examples

### Example 1: "Create a responsive login form"

**Task Analysis**:
```yaml
type: code_implementation + ui_design
complexity: moderate
domains: [frontend, security]
file_count: 3-5
tool_count: 2-3
```

**Routing Decision**:
```yaml
skills:
  - frontend-design         (1,500 tokens) - UI best practices
  - security-auditor        (2,000 tokens) - Input validation

mcps:
  - magic                   (1,500 tokens) - 21st.dev components
  - serena                  (500 tokens)   - Project context

command: /sc:scaffold react-component LoginForm --responsive --validated

mode: orchestration

agents: [] (not needed for moderate complexity)

total_tokens: 5,500 (2.75% of budget) ✅
```

**Execution**:
```bash
# Claude automatically:
1. Activates Orchestration Mode
2. Loads frontend-design + security-auditor skills
3. Enables Magic + Serena MCPs
4. Executes /sc:scaffold command
5. Generates LoginForm component with:
   - Responsive design (from frontend-design skill)
   - Input validation (from security-auditor skill)
   - shadcn/ui components (from Magic MCP)
   - Tests and stories
```

### Example 2: "Research best practices for microservices"

**Task Analysis**:
```yaml
type: research
complexity: complex
domains: [backend, architecture]
needs_external_info: true
multi_source_verification: true
```

**Routing Decision**:
```yaml
skills:
  - superclaude-research    (2,500 tokens) - Research methodology
  - mcp-progressive-discovery (1,000 tokens) - Tool discovery

mcps:
  - tavily                  (2,000 tokens) - Web search
  - sequential              (3,000 tokens) - Multi-step reasoning
  - context7                (2,500 tokens) - Official docs

command: /sc:research "microservices best practices" --depth deep

mode: deep-research

agents:
  - deep-research-agent     (activated by /sc:research)

total_tokens: 11,000 (5.5% of budget) ✅
```

**Execution**:
```bash
# Claude automatically:
1. Activates Deep Research Mode
2. Loads research + discovery skills
3. Enables Tavily + Sequential + Context7 MCPs
4. Invokes deep-research-agent
5. Executes multi-hop research:
   - Tavily: Search for microservices patterns
   - Context7: Official Spring Boot / NestJS docs
   - Sequential: Synthesize findings
   - Save to claudedocs/research_microservices_[timestamp].md
```

### Example 3: "Analyze our product strategy"

**Task Analysis**:
```yaml
type: business_analysis
complexity: complex
domains: [strategy, market, innovation]
requires_multi_expert: true
```

**Routing Decision**:
```yaml
skills:
  - business-panel          (3,500 tokens) - Multi-expert analysis

mcps:
  - sequential              (3,000 tokens) - Structured reasoning
  - tavily                  (2,000 tokens) - Market research

command: /sc:business-panel @strategy_doc.pdf --mode discussion

mode: business-panel

agents:
  - business-panel-agent    (activated by /sc:business-panel)

experts_auto_selected:
  - porter        (competitive strategy)
  - christensen   (innovation)
  - kim_mauborgne (blue ocean)
  - meadows       (systems thinking)

total_tokens: 8,500 (4.25% of budget) ✅
```

**Execution**:
```bash
# Claude automatically:
1. Activates Business Panel Mode
2. Loads business-panel skill
3. Enables Sequential + Tavily MCPs
4. Auto-selects 4 most relevant experts
5. Performs Discussion mode analysis:
   - Each expert analyzes from their framework
   - Cross-pollination of insights
   - Synthesis across frameworks
   - Strategic recommendations
```

### Example 4: "Fix the performance issues in our React app"

**Task Analysis**:
```yaml
type: debugging + performance_optimization
complexity: complex
domains: [frontend, performance]
needs_profiling: true
multi_file_analysis: true
```

**Routing Decision**:
```yaml
skills:
  - performance-optimizer   (2,000 tokens) - Performance patterns
  - code-reviewer          (2,000 tokens) - Code quality

mcps:
  - chrome-devtools        (3,000 tokens) - Performance profiling
  - serena                 (500 tokens)   - Code navigation
  - sequential             (3,000 tokens) - Systematic analysis

command: /sc:troubleshoot performance --profile

mode: introspection

agents:
  - performance-tuner      (activated for complex perf issues)

total_tokens: 10,500 (5.25% of budget) ✅
```

**Execution**:
```bash
# Claude automatically:
1. Activates Introspection Mode
2. Loads performance + code-review skills
3. Enables Chrome DevTools + Serena + Sequential MCPs
4. Invokes performance-tuner agent
5. Executes systematic debugging:
   - Chrome DevTools: Profile runtime performance
   - Serena: Analyze component architecture
   - Sequential: Identify bottlenecks
   - Code Reviewer: Suggest optimizations
   - Generate performance report with fixes
```

---

## 🎪 User Preference Integration

### Verbosity Configuration

```typescript
interface VerbosityConfig {
  mode: 'verbose' | 'balanced' | 'compressed';
  symbols_enabled: boolean;
  abbreviations_enabled: boolean;
  structured_output: boolean;
}

class VerbosityManager {
  async promptUserPreference(): Promise<VerbosityConfig> {
    console.log(`
┌─────────────────────────────────────────────┐
│ 🎯 Session Verbosity Configuration          │
├─────────────────────────────────────────────┤
│                                             │
│ ? Select verbosity mode:                    │
│   ○ Verbose                                 │
│     Detailed explanations, full context     │
│     Token usage: ~50K per session           │
│                                             │
│   ○ Balanced (Recommended)                  │
│     Moderate detail, optimized              │
│     Token usage: ~35K per session           │
│                                             │
│   ○ Compressed                              │
│     Minimal output, maximum efficiency      │
│     Token usage: ~25K per session           │
│     Uses symbol system (→, ✅, ⚡, etc.)    │
│                                             │
│ ? Save as default? [y/N]                    │
└─────────────────────────────────────────────┘
    `);

    const mode = await this.getUserChoice();
    const saveDefault = await this.askSavePreference();

    const config: VerbosityConfig = {
      mode,
      symbols_enabled: mode === 'compressed',
      abbreviations_enabled: mode !== 'verbose',
      structured_output: true
    };

    if (saveDefault) {
      await this.saveToConfig(config);
    } else {
      process.env.CLAUDE_VERBOSITY = mode;
    }

    return config;
  }

  applyVerbosityToOutput(
    output: string,
    config: VerbosityConfig
  ): string {
    if (config.mode === 'verbose') {
      return output; // No transformation
    }

    let transformed = output;

    if (config.symbols_enabled) {
      transformed = this.applySymbolSubstitution(transformed);
    }

    if (config.abbreviations_enabled) {
      transformed = this.applyAbbreviations(transformed);
    }

    if (config.structured_output) {
      transformed = this.applyStructuredFormatting(transformed);
    }

    return transformed;
  }

  private applySymbolSubstitution(text: string): string {
    const substitutions = {
      'leads to': '→',
      'transforms to': '⇒',
      'therefore': '∴',
      'because': '∵',
      'completed': '✅',
      'failed': '❌',
      'warning': '⚠️',
      'in progress': '🔄',
      'performance': '⚡',
      'security': '🛡️',
      'analysis': '🔍',
      'configuration': '🔧'
    };

    let result = text;
    for (const [phrase, symbol] of Object.entries(substitutions)) {
      result = result.replace(new RegExp(phrase, 'gi'), symbol);
    }

    return result;
  }
}
```

---

## 📈 Token Budget Optimization

### Dynamic Budget Allocation

```typescript
class TokenBudgetOptimizer {
  /**
   * Dynamically allocate token budget based on:
   * - Task complexity
   * - Current context usage
   * - User verbosity preference
   * - Active resources
   */
  async optimizeBudget(
    classification: TaskClassification,
    currentUsage: number,
    verbosity: VerbosityConfig
  ): Promise<TokenAllocation> {
    const totalBudget = 200000; // 200K for Sonnet 3.5
    const available = totalBudget - currentUsage;

    // Adjust for verbosity
    const verbosityMultiplier = {
      'verbose': 1.0,
      'balanced': 0.7,
      'compressed': 0.5
    }[verbosity.mode];

    // Base allocation
    const allocation = {
      system: 10000,           // 5%
      mcps: 15000,             // 7.5%
      skills: 10000,           // 5%
      conversation: 100000,    // 50%
      buffer: 55000            // 27.5%
    };

    // Adjust based on task
    if (classification.type === 'research') {
      allocation.mcps += 10000;      // More for Tavily + Sequential
      allocation.buffer -= 10000;
    }

    if (classification.complexity === 'enterprise') {
      allocation.skills += 5000;     // More skills needed
      allocation.mcps += 5000;       // More MCPs needed
      allocation.buffer -= 10000;
    }

    // Apply verbosity adjustment
    allocation.conversation *= verbosityMultiplier;
    allocation.buffer += allocation.conversation * (1 - verbosityMultiplier);

    // Validate doesn't exceed available
    const total = Object.values(allocation).reduce((a, b) => a + b, 0);
    if (total > available) {
      return this.scaleDownAllocation(allocation, available);
    }

    return allocation;
  }

  /**
   * Monitor token usage in real-time
   * Provide optimization recommendations
   */
  async monitorAndOptimize(
    currentUsage: TokenUsage
  ): Promise<Optimization[]> {
    const optimizations: Optimization[] = [];

    // Check MCP efficiency
    for (const [mcpName, tokens] of Object.entries(currentUsage.mcps)) {
      const mcp = this.mcpRegistry.get(mcpName);

      if (tokens > 5000 && mcp.lastUsed > Date.now() - 300000) {
        // MCP using >5K tokens and not used in 5 minutes
        optimizations.push({
          type: 'disable_mcp',
          target: mcpName,
          savings: tokens,
          recommendation: `Disable unused ${mcpName} MCP (-${tokens} tokens)`
        });
      }
    }

    // Check skill efficiency
    for (const [skillName, tokens] of Object.entries(currentUsage.skills)) {
      const skill = this.skillRegistry.get(skillName);

      if (skill.status === 'loaded' && !skill.used) {
        optimizations.push({
          type: 'unload_skill',
          target: skillName,
          savings: tokens,
          recommendation: `Unload unused ${skillName} skill (-${tokens} tokens)`
        });
      }
    }

    // Check context bloat
    if (currentUsage.messages > 50000) {
      optimizations.push({
        type: 'compact_context',
        savings: currentUsage.messages * 0.3,
        recommendation: 'Enable auto-compact for messages (-30% tokens)'
      });
    }

    return optimizations;
  }
}
```

---

## 🎬 Automatic Execution Flow

### Enhanced Installation Wizard

```bash
code-assistant-claude init

┌─────────────────────────────────────────────────────────────────┐
│ 🚀 Code Assistant Claude - Intelligent Setup                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Step 1/7: Project Analysis                                      │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                 │
│ 🔍 Analyzing project structure...                               │
│                                                                 │
│ Detected Tech Stack:                                            │
│ ✅ TypeScript React Application                                 │
│ ✅ Node.js 18.x                                                  │
│ ✅ Testing: Jest + React Testing Library                        │
│ ✅ Build: Vite                                                   │
│ ✅ State Management: Redux Toolkit                              │
│ ✅ Routing: React Router v6                                     │
│                                                                 │
│ Analyzing Common Tasks (from git history & file patterns):      │
│ • UI component creation (42% of commits)                        │
│ • Bug fixes (28% of commits)                                    │
│ • API integration (18% of commits)                              │
│ • Testing (12% of commits)                                      │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ Step 2/7: Intelligent Resource Recommendation                   │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                 │
│ 🎯 Recommended Configuration Based on Your Usage Patterns:      │
│                                                                 │
│ Skills (Auto-activate when relevant):                           │
│ ✅ frontend-design        UI best practices, Anthropic patterns │
│ ✅ code-reviewer          Automatic quality checks              │
│ ✅ test-generator         Generate React Testing Library tests  │
│ ✅ security-auditor       Input validation, XSS prevention      │
│                                                                 │
│ MCP Servers (Dynamic loading):                                  │
│ ✅ magic                  21st.dev UI components                │
│ ✅ serena                 Project memory & symbol operations    │
│ ✅ sequential             Multi-step reasoning (--think)        │
│ ✅ playwright             E2E testing & visual validation       │
│ ✅ context7               React/Redux official docs             │
│                                                                 │
│ Commands (Workflow automation):                                 │
│ ✅ /sc:scaffold          Generate components with tests         │
│ ✅ /sc:review            Comprehensive code review              │
│ ✅ /sc:test              Auto-generate and run tests            │
│ ✅ /sc:implement         Full feature implementation            │
│                                                                 │
│ Behavioral Modes:                                               │
│ ✅ SuperClaude framework  All 6 modes + Business Panel          │
│                                                                 │
│ Estimated Token Savings:                                        │
│ • MCP Code Execution: 98.7% reduction on tool calls             │
│ • Progressive Skills: 95% reduction vs always-loaded            │
│ • Symbol System: 30-50% reduction in verbosity mode             │
│ • Total Average: 60-70% reduction per session                   │
│                                                                 │
│ ? Continue with this configuration? [Y/n]                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔧 Configuration Output Example

### Generated .claude/CLAUDE.md

```markdown
# Project Context: My React App

**Auto-generated by code-assistant-claude**
**Date**: 2025-11-23
**Tech Stack**: TypeScript, React, Redux Toolkit, Vite

## Intelligent Resource Configuration

This project is configured with intelligent task routing.
Claude will automatically activate optimal skills, MCPs, and commands based on your requests.

### Common Tasks → Automatic Activation

**UI Development**:
- "Create a button component" → frontend-design skill + Magic MCP + /sc:scaffold
- "Make this responsive" → frontend-design skill + Playwright MCP
- "Test this component" → test-generator skill + Playwright MCP + /sc:test

**Code Quality**:
- Save any file → code-reviewer skill (auto-activates)
- Git commit → security-auditor + secret-scanner (pre-commit hook)
- "/sc:review" → Full multi-persona code review

**Features**:
- "Implement user authentication" → /sc:implement + security-auditor skill
- "Add search functionality" → /sc:scaffold + api-designer skill

**Research & Strategy**:
- "Research best practices for X" → /sc:research + Tavily + Sequential MCPs
- "Analyze our market position" → /sc:business-panel + business experts

### MCP Code Execution (98.7% Token Reduction)

This project uses revolutionary code execution approach:
- MCP tools presented as TypeScript functions
- Progressive discovery via filesystem
- Data processing in execution environment
- Only summaries flow through model context

**Example**:
Traditional: 150K tokens for tool definitions
Code Execution: 2K tokens (load only what's needed) ✅

### Token Budget Visualization

Current Session:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
System:      2K  (1%)    ████░░░░░░░░░░░░░░░░░░░░░░░░
MCPs:        6K  (3%)    ████████░░░░░░░░░░░░░░░░░░░░
Skills:      4K  (2%)    ████░░░░░░░░░░░░░░░░░░░░░░░░
Messages:    8K  (4%)    ████████░░░░░░░░░░░░░░░░░░░░
Available: 180K (90%)    ████████████████████████████
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Status: 🟢 Healthy
```

### Optimization Tips

Run `/sc:optimize-tokens` to see detailed breakdown and recommendations.
Run `/sc:optimize-mcp` to optimize MCP server configuration.
Run `/sc:cleanup-context` for intelligent context cleanup.

### Project-Specific Patterns

- **Component Structure**: src/components/[ComponentName]/
  - index.tsx (component)
  - [ComponentName].test.tsx (tests)
  - [ComponentName].stories.tsx (Storybook)
  - types.ts (TypeScript interfaces)

- **Testing Standards**:
  - Unit tests: Jest + React Testing Library
  - E2E tests: Playwright
  - Coverage target: >80%

- **Code Style**:
  - ESLint: Airbnb config
  - Prettier: 2-space indentation
  - TypeScript: strict mode

### Quick Commands

- `/sc:scaffold react-component [name]` - Generate component with tests
- `/sc:review` - Comprehensive code review
- `/sc:test [file]` - Generate and run tests
- `/sc:implement [feature]` - Full feature implementation
- `/sc:research [query]` - Deep research with citations
- `/sc:business-panel [doc]` - Strategic analysis
```

---

## 🎯 Implementation Priority

Add to **Phase 1** (Foundation):

```typescript
// core/cli/commands/init.ts
export class InitCommand {
  async execute() {
    // 1. Project analysis
    const analysis = await this.projectAnalyzer.analyze();

    // 2. Task pattern detection
    const patterns = await this.detectCommonTasks(analysis);

    // 3. Intelligent recommendations
    const recommendations = await this.intelligentRouter.recommend({
      analysis,
      patterns,
      userPreferences: await this.loadUserPreferences()
    });

    // 4. User confirmation
    const approved = await this.showRecommendations(recommendations);

    if (!approved) {
      // Allow user customization
      recommendations = await this.customizeRecommendations(recommendations);
    }

    // 5. Generate configuration
    await this.configGenerator.generate(recommendations);

    // 6. Install resources
    await this.installer.install(recommendations);

    // 7. Validate
    await this.validator.validate();

    console.log('✅ Code Assistant Claude configured successfully!');
  }
}
```

---

## 📊 Success Metrics

**Routing Accuracy**:
- Target: >95% optimal resource selection
- Measure: User satisfaction surveys + usage analytics

**Token Efficiency**:
- Traditional: 50K average tokens per session
- With Intelligent Routing: 15-20K tokens per session
- **Improvement: 60-70% reduction** ✅

**User Experience**:
- Setup time: <5 minutes
- Configuration accuracy: >95%
- Learning curve: Minimal (automatic)
- Satisfaction: >4.5/5

**Quality Metrics**:
- Appropriate skill activation: >90%
- MCP over/under-loading: <5%
- Command suggestion relevance: >85%
- Mode selection accuracy: >90%

---

## 🚀 Next Steps

1. Implement TaskAnalyzer with NLP intent detection
2. Build MCPRouter with dynamic loading logic
3. Create SkillComposer with dependency resolution
4. Implement CommandRouter with scoring algorithm
5. Build ModeSelector with multi-dimensional scoring
6. Create VerbosityManager with session prompts
7. Integrate WorkflowOrchestrator for end-to-end coordination

**Impact**: Questo sistema trasforma code-assistant-claude da un tool di configurazione a un **intelligent development accelerator** che automaticamente attiva le risorse ottimali per ogni task, massimizzando efficienza e qualità. 🎯
