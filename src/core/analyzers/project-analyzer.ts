import { DocumentationAnalyzer } from "./documentation-analyzer";
import { GitWorkflowAnalyzer } from "./git-workflow-analyzer";
import { TechStackDetector } from "./tech-stack-detector";
import { MonorepoDetector, MonorepoInfo, WorkspaceInfo } from "./monorepo-detector";
import { validateProjectRoot } from "../utils/validation";
import { createLogger } from "../utils/logger";

export interface ProjectContext {
  purpose: string;
  type: string;
  techStack: string[];
  domain: string[];
  gitWorkflow?: string;
  conventions: {
    gitWorkflow?: "gitflow" | "github-flow" | "trunk-based" | "custom";
    commitStyle?: "conventional" | "custom";
    branchNaming?: string;
  };
  customInstructions: string[];
  confidence: number;
  monorepo?: MonorepoInfo;
}

export { MonorepoInfo, WorkspaceInfo };

export class ProjectAnalyzer {
  private docAnalyzer: DocumentationAnalyzer;
  private gitAnalyzer: GitWorkflowAnalyzer;
  private techDetector: TechStackDetector;
  private monorepoDetector: MonorepoDetector | null = null;
  private logger = createLogger("ProjectAnalyzer");

  constructor() {
    this.docAnalyzer = new DocumentationAnalyzer();
    this.gitAnalyzer = new GitWorkflowAnalyzer();
    this.techDetector = new TechStackDetector();
  }

  /**
   * Analyzes a project to detect tech stack, documentation, and Git workflow.
   *
   * @param projectRoot - Absolute path to project directory
   * @returns ProjectContext with detected information and confidence score
   * @throws {Error} If project root is invalid or unreadable
   */
  async analyze(projectRoot: string): Promise<ProjectContext> {
    this.logger.debug(`Starting project analysis for: ${projectRoot}`);
    const endTimer = this.logger.startTimer("Project analysis");

    // Validate path to prevent security issues
    validateProjectRoot(projectRoot);
    this.logger.debug("Project root validation passed");

    const context: ProjectContext = {
      purpose: "",
      type: "unknown",
      techStack: [],
      domain: [],
      conventions: {},
      customInstructions: [],
      confidence: 0,
    };

    try {
      // 1. Detect tech stack (fastest, always succeeds)
      this.logger.step(1, 4, "Detecting tech stack");
      const techStack = await this.techDetector.detect(projectRoot);
      context.techStack = techStack.languages;
      this.logger.verbose(`Detected tech stack: ${techStack.languages.join(", ")}`);
      this.logger.debugObject("Tech stack", techStack);

      // 2. Detect monorepo structure (may not be a monorepo, don't fail)
      this.logger.step(2, 4, "Detecting monorepo structure");
      try {
        this.monorepoDetector = new MonorepoDetector(projectRoot);
        const monorepoInfo = await this.monorepoDetector.detect();

        if (monorepoInfo.isMonorepo) {
          context.monorepo = monorepoInfo;
          this.logger.verbose(`Monorepo detected: ${monorepoInfo.tool} with ${monorepoInfo.workspaces.length} workspaces`);
          this.logger.debugObject("Monorepo info", monorepoInfo);

          // Aggiorna il tipo di progetto per riflettere che è un monorepo
          context.type = this.inferProjectTypeWithMonorepo(techStack, monorepoInfo);
        } else {
          this.logger.verbose("Single-project repository detected");
          context.type = this.inferProjectType(techStack);
        }
      } catch (error) {
        // Monorepo detection failed, continue as single project
        this.logger.warn(
          "Monorepo detection failed: " +
            (error instanceof Error ? error.message : "Unknown error"),
        );
        context.type = this.inferProjectType(techStack);
      }

      this.logger.verbose(`Project type: ${context.type}`);

      // 3. Analyze documentation (may not exist, don't fail)
      this.logger.step(3, 4, "Analyzing documentation");
      try {
        const docContext = await this.docAnalyzer.analyze(projectRoot);
        context.purpose = docContext.purpose;
        context.domain = docContext.domain;
        context.customInstructions = docContext.customInstructions;

        this.logger.verbose(`Found purpose: ${docContext.purpose || "none"}`);
        this.logger.verbose(`Domains: ${docContext.domain.join(", ") || "none"}`);

        // Merge conventions
        if (docContext.conventions) {
          context.conventions = {
            ...context.conventions,
            ...docContext.conventions,
          };
        }
      } catch (error) {
        // Documentation analysis failed, continue with tech stack only
        this.logger.warn(
          "Documentation analysis failed: " +
            (error instanceof Error ? error.message : "Unknown error"),
        );
      }

      // 4. Analyze Git workflow (may not be a git repo, don't fail)
      this.logger.step(4, 4, "Analyzing Git workflow");
      try {
        const gitConventions = await this.gitAnalyzer.detect(projectRoot);
        context.gitWorkflow = gitConventions.workflow;
        context.conventions.gitWorkflow = gitConventions.workflow;
        context.conventions.branchNaming =
          gitConventions.branchPrefixes.join(", ");
        this.logger.verbose(`Git workflow: ${gitConventions.workflow}`);
        this.logger.debugObject("Git conventions", gitConventions);
      } catch (error) {
        // Git analysis failed, not a git repo or no branches
        this.logger.warn(
          "Git workflow analysis failed: " +
            (error instanceof Error ? error.message : "Unknown error"),
        );
      }

      // Calculate confidence score
      context.confidence = this.calculateConfidence(context);
      this.logger.verbose(`Analysis confidence: ${(context.confidence * 100).toFixed(0)}%`);
      this.logger.debugObject("Final context", context);

      endTimer();
      return context;
    } catch (error) {
      this.logger.error("Project analysis failed", error);
      throw new Error(
        "Failed to analyze project: " +
          (error instanceof Error ? error.message : "Unknown error"),
      );
    }
  }

  private inferProjectType(techStack: any): string {
    const { languages, frameworks, tools } = techStack;

    // Frontend frameworks
    if (frameworks.includes("react")) return "React Application";
    if (frameworks.includes("vue")) return "Vue Application";
    if (frameworks.includes("angular")) return "Angular Application";
    if (frameworks.includes("next")) return "Next.js Application";
    if (frameworks.includes("svelte")) return "Svelte Application";

    // Backend frameworks
    if (frameworks.includes("express")) return "Express API";
    if (frameworks.includes("nestjs")) return "NestJS Application";
    if (frameworks.includes("fastapi")) return "FastAPI Application";
    if (frameworks.includes("django")) return "Django Application";
    if (frameworks.includes("flask")) return "Flask Application";
    if (frameworks.includes("spring")) return "Spring Boot Application";

    // Mobile frameworks
    if (frameworks.includes("react-native")) return "React Native Application";
    if (frameworks.includes("flutter")) return "Flutter Application";

    // Language-based inference
    if (languages.includes("typescript") || languages.includes("javascript")) {
      if (tools.includes("vite") || tools.includes("webpack")) {
        return "JavaScript/TypeScript Frontend";
      }
      return "JavaScript/TypeScript Application";
    }

    if (languages.includes("python")) return "Python Application";
    if (languages.includes("java")) return "Java Application";
    if (languages.includes("go")) return "Go Application";
    if (languages.includes("rust")) return "Rust Application";
    if (languages.includes("csharp")) return "C# Application";

    return "Unknown Project Type";
  }

  private inferProjectTypeWithMonorepo(
    techStack: any,
    monorepoInfo: MonorepoInfo,
  ): string {
    const { tool, workspaces, crossLanguage } = monorepoInfo;

    // Determina il tipo base
    const toolName = this.getMonorepoToolName(tool || "unknown");

    // Se è cross-language, enfatizza questo
    if (crossLanguage) {
      const uniqueTechs = new Set<string>();
      workspaces.forEach((ws) => ws.technologies.forEach((t) => uniqueTechs.add(t)));
      const techList = Array.from(uniqueTechs).slice(0, 3).join("/");
      return `${toolName} Monorepo (${techList}, ${workspaces.length} workspaces)`;
    }

    // Se è single-language, menziona il linguaggio principale
    const mainTech = monorepoInfo.rootTechnologies[0] || techStack.languages[0];
    return `${toolName} Monorepo (${mainTech}, ${workspaces.length} workspaces)`;
  }

  private getMonorepoToolName(tool: string): string {
    const toolNames: Record<string, string> = {
      lerna: "Lerna",
      pnpm: "pnpm",
      yarn: "Yarn",
      npm: "npm",
      "go-workspace": "Go",
      "cargo-workspace": "Cargo",
      maven: "Maven",
      gradle: "Gradle",
      poetry: "Poetry",
      "python-custom": "Python",
      "dotnet-solution": ".NET",
    };
    return toolNames[tool] || "Multi-project";
  }

  private calculateConfidence(context: ProjectContext): number {
    let confidence = 0;

    // Tech stack detection (always succeeds)
    if (context.techStack.length > 0) confidence += 0.25;

    // Monorepo detection
    if (context.monorepo?.isMonorepo) confidence += 0.15;

    // Documentation analysis
    if (context.purpose) confidence += 0.25;
    if (context.domain.length > 0) confidence += 0.15;

    // Git workflow detection
    if (context.gitWorkflow) confidence += 0.2;

    return Math.min(confidence, 1.0);
  }
}
