import { DocumentationAnalyzer } from "./documentation-analyzer";
import { GitWorkflowAnalyzer } from "./git-workflow-analyzer";
import { TechStackDetector } from "./tech-stack-detector";
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
}

export class ProjectAnalyzer {
  private docAnalyzer: DocumentationAnalyzer;
  private gitAnalyzer: GitWorkflowAnalyzer;
  private techDetector: TechStackDetector;
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
      this.logger.step(1, 3, "Detecting tech stack");
      const techStack = await this.techDetector.detect(projectRoot);
      context.techStack = techStack.languages;
      context.type = this.inferProjectType(techStack);
      this.logger.verbose(`Detected: ${context.type}`);
      this.logger.debugObject("Tech stack", techStack);

      // 2. Analyze documentation (may not exist, don't fail)
      this.logger.step(2, 3, "Analyzing documentation");
      try {
        const docContext = await this.docAnalyzer.analyze(projectRoot);
        context.purpose = docContext.purpose;
        context.domain = docContext.domain;
        context.customInstructions = docContext.customInstructions;

        this.logger.verbose(`Found purpose: ${docContext.purpose || "none"}`);
        this.logger.verbose(
          `Domains: ${docContext.domain.join(", ") || "none"}`,
        );

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

      // 3. Analyze Git workflow (may not be a git repo, don't fail)
      this.logger.step(3, 3, "Analyzing Git workflow");
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

      // 4. Calculate confidence score
      context.confidence = this.calculateConfidence(context);
      this.logger.verbose(
        `Analysis confidence: ${(context.confidence * 100).toFixed(0)}%`,
      );
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

  private calculateConfidence(context: ProjectContext): number {
    let confidence = 0;

    // Tech stack detection (always succeeds)
    if (context.techStack.length > 0) confidence += 0.3;

    // Documentation analysis
    if (context.purpose) confidence += 0.3;
    if (context.domain.length > 0) confidence += 0.2;

    // Git workflow detection
    if (context.gitWorkflow) confidence += 0.2;

    return Math.min(confidence, 1.0);
  }
}
