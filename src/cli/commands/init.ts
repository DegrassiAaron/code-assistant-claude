import inquirer from "inquirer";
import ora from "ora";
import chalk from "chalk";
import { promises as fs } from "fs";
import path from "path";
import os from "os";
import AsyncLock from "async-lock";
import {
  ProjectAnalyzer,
  type ProjectContext,
} from "../../core/analyzers/project-analyzer";
import { ConfigurationGenerator } from "../../core/configurators/config-generator";

// Global lock to prevent race conditions
const initLock = new AsyncLock();

// Token savings constants
const TOKEN_SAVINGS = {
  BASE: 60, // MCP code execution base savings
  MANY_SKILLS: 10, // Additional 10% when >5 skills
  COMPRESSED_MODE: 15, // Additional 15% in compressed mode
  MAX: 90, // Maximum possible savings
} as const;

const SKILL_THRESHOLD = 5;

interface InitOptions {
  dryRun?: boolean;
  local?: boolean;
  global?: boolean;
  force?: boolean;
}

interface SetupAnswers {
  installType: "local" | "global" | "both";
  verbosity: "verbose" | "balanced" | "compressed";
  enableSkills: string[];
  enableMCPs: string[];
}

export async function initCommand(options: InitOptions): Promise<void> {
  console.log(chalk.blue.bold("\n🚀 Code Assistant Claude Setup\n"));
  console.log(
    chalk.gray("Intelligent framework for Claude Code CLI optimization\n"),
  );

  try {
    // Step 1: Check for existing installation
    await checkExistingInstallation(options);

    // Step 2: Analyze project
    const spinner = ora("Analyzing project...").start();
    const analyzer = new ProjectAnalyzer();
    const projectContext = await analyzer.analyze(process.cwd());
    spinner.succeed("Project analysis complete");

    // Display detected project information
    displayProjectInfo(projectContext);

    // Step 3: Interactive configuration
    const answers = await promptSetupQuestions(projectContext, options);

    // Step 4: Generate configuration
    if (options.dryRun) {
      console.log(
        chalk.yellow("\n📋 Dry run mode - No changes will be made\n"),
      );
      await previewConfiguration(projectContext, answers);
    } else {
      await generateConfiguration(projectContext, answers, options);
    }

    // Step 5: Success message
    displaySuccessMessage(answers, options.dryRun);
  } catch (error) {
    console.error(
      chalk.red("\n❌ Setup failed:"),
      error instanceof Error ? error.message : "Unknown error",
    );
    process.exit(1);
  }
}

async function checkExistingInstallation(options: InitOptions): Promise<void> {
  const localConfigPath = path.join(process.cwd(), ".claude");
  const globalConfigPath = path.join(os.homedir(), ".claude");

  const localExists = await fs
    .access(localConfigPath)
    .then(() => true)
    .catch(() => false);
  const globalExists = await fs
    .access(globalConfigPath)
    .then(() => true)
    .catch(() => false);

  if ((localExists || globalExists) && !options.force) {
    console.log(chalk.yellow("\n⚠️  Existing installation detected\n"));

    if (localExists) {
      console.log(chalk.gray(`  Local:  ${localConfigPath}`));
    }
    if (globalExists) {
      console.log(chalk.gray(`  Global: ${globalConfigPath}`));
    }

    const { proceed } = await inquirer.prompt([
      {
        type: "confirm",
        name: "proceed",
        message: "Overwrite existing configuration?",
        default: false,
      },
    ]);

    if (!proceed) {
      console.log(chalk.gray("\nSetup cancelled.\n"));
      process.exit(0);
    }
  }
}

/**
 * Display detected project information to user
 */
function displayProjectInfo(projectContext: ProjectContext): void {
  console.log(chalk.green("\n✓ Project detected:\n"));

  console.log(chalk.cyan("  Type:"), projectContext.type || "Unknown");

  if (projectContext.techStack && projectContext.techStack.length > 0) {
    console.log(
      chalk.cyan("  Tech Stack:"),
      projectContext.techStack.join(", "),
    );
  }

  if (projectContext.domain && projectContext.domain.length > 0) {
    console.log(chalk.cyan("  Domain:"), projectContext.domain.join(", "));
  }

  if (projectContext.gitWorkflow) {
    console.log(chalk.cyan("  Git Workflow:"), projectContext.gitWorkflow);
  }

  console.log("");
}

/**
 * Prompt user for setup configuration options
 */
async function promptSetupQuestions(
  projectContext: ProjectContext,
  options: InitOptions,
): Promise<SetupAnswers> {
  const questions = [];

  // Installation scope
  if (!options.local && !options.global) {
    questions.push({
      type: "list",
      name: "installType",
      message: "Installation scope:",
      choices: [
        { name: "Project only (.claude/)", value: "local" },
        { name: "Global only (~/.claude/)", value: "global" },
        { name: "Both (recommended)", value: "both" },
      ],
      default: "both",
    });
  }

  // Verbosity mode
  questions.push({
    type: "list",
    name: "verbosity",
    message: "Default verbosity mode:",
    choices: [
      { name: "Verbose (detailed, full context)", value: "verbose" },
      {
        name: "Balanced (moderate, optimized) - recommended",
        value: "balanced",
      },
      { name: "Compressed (minimal, efficient)", value: "compressed" },
    ],
    default: "balanced",
  });

  // Skills selection
  const recommendedSkills = getRecommendedSkills(projectContext);
  questions.push({
    type: "checkbox",
    name: "enableSkills",
    message: "Select skills to enable:",
    choices: recommendedSkills.map((skill) => ({
      name: `${skill.name} - ${skill.description}`,
      value: skill.name,
      checked: skill.recommended,
    })),
  });

  // MCPs selection
  const recommendedMCPs = getRecommendedMCPs(projectContext);
  questions.push({
    type: "checkbox",
    name: "enableMCPs",
    message: "Select MCP servers to enable:",
    choices: recommendedMCPs.map((mcp) => ({
      name: `${mcp.name} - ${mcp.description}`,
      value: mcp.name,
      checked: mcp.recommended,
    })),
  });

  const answers = await inquirer.prompt(questions);

  // Determine installation type from options if provided
  if (options.local) {
    answers.installType = "local";
  } else if (options.global) {
    answers.installType = "global";
  }

  return answers as SetupAnswers;
}

/**
 * Get recommended skills based on project context
 */
function getRecommendedSkills(
  projectContext: ProjectContext,
): Array<{ name: string; description: string; recommended: boolean }> {
  const allSkills = [
    {
      name: "code-reviewer",
      description: "Automatic code review on save",
      recommended: true,
    },
    {
      name: "test-generator",
      description: "Generate comprehensive tests",
      recommended: true,
    },
    {
      name: "git-commit-helper",
      description: "Conventional commit messages",
      recommended: true,
    },
    {
      name: "security-auditor",
      description: "Vulnerability scanning",
      recommended: true,
    },
    {
      name: "frontend-design",
      description: "UI best practices",
      recommended: false,
    },
    {
      name: "api-designer",
      description: "RESTful API patterns",
      recommended: false,
    },
    {
      name: "business-panel",
      description: "Strategic analysis (9 experts)",
      recommended: false,
    },
  ];

  // Customize recommendations based on project type
  if (
    projectContext.techStack?.includes("react") ||
    projectContext.techStack?.includes("vue")
  ) {
    allSkills.find((s) => s.name === "frontend-design")!.recommended = true;
  }

  if (
    projectContext.type?.includes("api") ||
    projectContext.techStack?.includes("express")
  ) {
    allSkills.find((s) => s.name === "api-designer")!.recommended = true;
  }

  return allSkills;
}

/**
 * Get recommended MCP servers based on project context
 */
function getRecommendedMCPs(
  projectContext: ProjectContext,
): Array<{ name: string; description: string; recommended: boolean }> {
  const allMCPs = [
    {
      name: "serena",
      description: "Project memory & symbol operations",
      recommended: true,
    },
    {
      name: "sequential",
      description: "Multi-step reasoning",
      recommended: true,
    },
    {
      name: "tavily",
      description: "Web search & real-time info",
      recommended: true,
    },
    {
      name: "magic",
      description: "UI components from 21st.dev",
      recommended: false,
    },
    {
      name: "playwright",
      description: "Browser automation & testing",
      recommended: false,
    },
    {
      name: "context7",
      description: "Official documentation lookup",
      recommended: false,
    },
  ];

  // Customize recommendations
  if (
    projectContext.techStack?.includes("react") ||
    projectContext.techStack?.includes("vue")
  ) {
    allMCPs.find((m) => m.name === "magic")!.recommended = true;
    allMCPs.find((m) => m.name === "playwright")!.recommended = true;
  }

  return allMCPs;
}

/**
 * Preview configuration in dry-run mode
 */
async function previewConfiguration(
  _projectContext: ProjectContext,
  answers: SetupAnswers,
): Promise<void> {
  console.log(chalk.yellow("\n📋 Configuration Preview:\n"));
  console.log(chalk.gray("  Installation:"), answers.installType);
  console.log(chalk.gray("  Verbosity:"), answers.verbosity);
  console.log(chalk.gray("  Skills:"), answers.enableSkills.join(", "));
  console.log(chalk.gray("  MCPs:"), answers.enableMCPs.join(", "));

  console.log(chalk.yellow("\n📊 Estimated Token Savings:\n"));
  const savings = calculateTokenSavings(answers);
  console.log(
    chalk.gray("  MCP Code Execution:"),
    chalk.green("98.7% reduction"),
  );
  console.log(
    chalk.gray("  Progressive Skills:"),
    chalk.green("95% reduction"),
  );
  console.log(chalk.gray("  Symbol System:"), chalk.green("30-50% reduction"));
  console.log(
    chalk.gray("  Total Average:"),
    chalk.green.bold(`${savings}% per session`),
  );
}

/**
 * Generate configuration files with lock to prevent race conditions
 */
async function generateConfiguration(
  projectContext: ProjectContext,
  answers: SetupAnswers,
  _options: InitOptions,
): Promise<void> {
  const spinner = ora("Generating configuration...").start();

  try {
    const generator = new ConfigurationGenerator();

    // Acquire lock to prevent concurrent init operations
    await initLock.acquire("init-operation", async () => {
      // Generate configuration based on installation type
      if (answers.installType === "local" || answers.installType === "both") {
        await generator.generateLocal(process.cwd(), projectContext, answers);
        spinner.text = "Generated local configuration (.claude/)";
      }

      if (answers.installType === "global" || answers.installType === "both") {
        await generator.generateGlobal(projectContext, answers);
        spinner.text = "Generated global configuration (~/.claude/)";
      }
    });

    spinner.succeed("Configuration generated successfully");
  } catch (error) {
    spinner.fail("Configuration generation failed");
    throw error;
  }
}

/**
 * Calculate estimated token savings based on selected configuration
 */
function calculateTokenSavings(answers: SetupAnswers): number {
  let savings = TOKEN_SAVINGS.BASE;

  // Additional savings based on features
  if (answers.enableSkills.length > SKILL_THRESHOLD) {
    savings += TOKEN_SAVINGS.MANY_SKILLS;
  }

  if (answers.verbosity === "compressed") {
    savings += TOKEN_SAVINGS.COMPRESSED_MODE;
  }

  return Math.min(savings, TOKEN_SAVINGS.MAX);
}

/**
 * Display success message with token savings and usage examples
 */
function displaySuccessMessage(_answers: SetupAnswers, dryRun?: boolean): void {
  if (dryRun) {
    console.log(chalk.yellow("\n✅ Dry run complete - No changes made\n"));
    return;
  }

  console.log(
    chalk.green.bold("\n✅ Code Assistant Claude configured successfully!\n"),
  );

  console.log(chalk.cyan("Token Savings Estimate:"));
  console.log(chalk.gray("  • MCP Code Execution: 98.7% reduction"));
  console.log(chalk.gray("  • Progressive Skills: 95% reduction"));
  console.log(chalk.gray("  • Symbol System: 30-50% reduction"));
  console.log(chalk.gray("  • Total Average: 60-70% per session\n"));

  console.log(chalk.cyan("Try it:"));
  console.log(
    chalk.gray(
      '  • "Create a login form" → Auto-activates frontend-design + Magic MCP',
    ),
  );
  console.log(
    chalk.gray(
      '  • "/sc:research microservices" → Deep research with Tavily + Sequential',
    ),
  );
  console.log(
    chalk.gray(
      '  • "/sc:business-panel @strategy.pdf" → 9-expert strategic analysis\n',
    ),
  );

  console.log(
    chalk.gray("Run"),
    chalk.cyan("code-assistant-claude --help"),
    chalk.gray("for more commands.\n"),
  );
}
