import inquirer from "inquirer";
import ora, { Ora } from "ora";
import chalk from "chalk";
import { promises as fs } from "fs";
import path from "path";
import { spawn, ChildProcess } from "child_process";
import type { MCPServerConfig, MCPToolSchema } from "../../core/execution-engine/types";

// MCP Registry types
interface MCPRegistryEntry {
  name: string;
  displayName: string;
  description: string;
  category: string;
  official: boolean;
  installation: {
    command: string;
    args: string[];
    requiresInstall: boolean;
  };
  env: {
    required: Array<{
      name: string;
      description: string;
      type: string;
      secret?: boolean;
      example?: string;
    }>;
    optional: Array<{
      name: string;
      description: string;
      default: string;
      type: string;
    }>;
  };
  features: string[];
  docs: string;
  repository: string;
  priority: string;
  recommended: boolean;
  tags: string[];
  verified: boolean;
}

interface MCPRegistry {
  version: string;
  servers: Record<string, MCPRegistryEntry>;
  categories: Record<string, { name: string; description: string; icon: string }>;
}

interface AddMCPOptions {
  name?: string;
  interactive?: boolean;
  test?: boolean;
}

interface MCPConfig {
  mcpServers: Record<string, MCPServerConfig>;
}

interface ToolListResponse {
  tools: Array<{
    name: string;
    description?: string;
    inputSchema?: any;
  }>;
}

interface JSONRPCRequest {
  jsonrpc: string;
  id: number;
  method: string;
  params?: any;
}

interface JSONRPCResponse {
  jsonrpc: string;
  id: number;
  result?: any;
  error?: {
    code: number;
    message: string;
  };
}

/**
 * Main command: Add new MCP server
 */
export async function mcpAddCommand(options: AddMCPOptions = {}): Promise<void> {
  console.log(chalk.blue.bold("\n🔌 Add MCP Server\n"));

  try {
    // Step 1: Load MCP registry
    const registry = await loadMCPRegistry();

    // Step 2: Select MCP server
    const selectedMCP = await selectMCPServer(registry, options.name);

    // Step 3: Configure environment variables
    const envConfig = await configureEnvironmentVariables(selectedMCP);

    // Step 4: Test connection
    let tools: MCPToolSchema[] = [];
    if (options.test !== false) {
      tools = await testMCPConnection(selectedMCP, envConfig);
    }

    // Step 5: Generate schema
    if (tools.length > 0) {
      await generateToolSchema(selectedMCP.name, tools);
    }

    // Step 6: Save configuration
    await saveMCPConfiguration(selectedMCP, envConfig);

    // Success message
    displaySuccessMessage(selectedMCP, tools);
  } catch (error) {
    if (error instanceof Error && error.message === "USER_CANCELLED") {
      console.log(chalk.yellow("\n⚠️  Setup cancelled by user\n"));
      process.exit(0);
    }

    console.error(
      chalk.red("\n❌ Failed to add MCP server:"),
      error instanceof Error ? error.message : "Unknown error"
    );
    process.exit(1);
  }
}

/**
 * Load MCP registry from JSON file
 */
async function loadMCPRegistry(): Promise<MCPRegistry> {
  const registryPath = path.join(__dirname, "../../core/configurators/mcp-registry.json");

  try {
    const content = await fs.readFile(registryPath, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Failed to load MCP registry: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Interactive server selection
 */
async function selectMCPServer(
  registry: MCPRegistry,
  providedName?: string
): Promise<MCPRegistryEntry> {
  // If name provided, find in registry
  if (providedName) {
    const entry = registry.servers[providedName];
    if (entry) {
      return entry;
    }
    console.log(chalk.yellow(`\n⚠️  MCP "${providedName}" not found in registry`));
  }

  // Build choices grouped by category
  const choicesByCategory: Record<string, any[]> = {};

  for (const [key, server] of Object.entries(registry.servers)) {
    const category = server.category || "other";

    if (!choicesByCategory[category]) {
      choicesByCategory[category] = [];
    }

    const verified = server.verified ? chalk.green("✓") : chalk.gray("○");
    const official = server.official ? chalk.blue("[Official]") : chalk.gray("[Community]");

    choicesByCategory[category].push({
      name: `${verified} ${server.displayName} - ${server.description} ${official}`,
      value: key,
      short: server.displayName,
    });
  }

  // Build flat choice list with category headers
  const choices: any[] = [];

  // Recommended first
  const recommended = Object.entries(registry.servers)
    .filter(([, server]) => server.recommended)
    .map(([key, server]) => ({
      name: chalk.bold.green(`⭐ ${server.displayName} - ${server.description}`),
      value: key,
      short: server.displayName,
    }));

  if (recommended.length > 0) {
    choices.push(
      new inquirer.Separator(chalk.bold.cyan("\n━━━ Recommended ━━━")),
      ...recommended
    );
  }

  // Add categories
  for (const [categoryKey, categoryServers] of Object.entries(choicesByCategory)) {
    const categoryInfo = registry.categories[categoryKey];
    if (categoryInfo && categoryServers.length > 0) {
      choices.push(
        new inquirer.Separator(chalk.bold(`\n${categoryInfo.icon}  ${categoryInfo.name}`)),
        ...categoryServers
      );
    }
  }

  // Add custom option
  choices.push(
    new inquirer.Separator(chalk.bold.yellow("\n━━━ Custom ━━━")),
    {
      name: chalk.yellow("🔧 Custom MCP Server (manual configuration)"),
      value: "__custom__",
      short: "Custom",
    }
  );

  // Prompt for selection
  const { selectedMCP } = await inquirer.prompt<{ selectedMCP: string }>([
    {
      type: "list",
      name: "selectedMCP",
      message: "Select MCP server to add:",
      choices,
      pageSize: 15,
    },
  ]);

  // Handle custom MCP
  if (selectedMCP === "__custom__") {
    return await customMCPConfiguration(registry);
  }

  return registry.servers[selectedMCP];
}

/**
 * Custom MCP configuration wizard
 */
async function customMCPConfiguration(registry: MCPRegistry): Promise<MCPRegistryEntry> {
  console.log(chalk.cyan("\n🔧 Custom MCP Configuration\n"));

  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "MCP server name (lowercase, no spaces):",
      validate: (input: string) => {
        if (!input) return "Name is required";
        if (!/^[a-z0-9-]+$/.test(input)) return "Use lowercase letters, numbers, and hyphens only";
        if (registry.servers[input]) return `MCP "${input}" already exists`;
        return true;
      },
    },
    {
      type: "input",
      name: "displayName",
      message: "Display name:",
      default: (answers: any) => answers.name.split("-").map((w: string) =>
        w.charAt(0).toUpperCase() + w.slice(1)
      ).join(" "),
    },
    {
      type: "input",
      name: "description",
      message: "Description:",
      validate: (input: string) => input ? true : "Description is required",
    },
    {
      type: "list",
      name: "commandType",
      message: "How to launch the server?",
      choices: [
        { name: "npx package (e.g., npx -y @org/package)", value: "npx" },
        { name: "Node.js script (e.g., node ./server.js)", value: "node" },
        { name: "Python script (e.g., python ./server.py)", value: "python" },
        { name: "Custom command", value: "custom" },
      ],
    },
  ]);

  let command: string;
  let args: string[];

  // Configure command based on type
  if (answers.commandType === "npx") {
    const { packageName } = await inquirer.prompt([
      {
        type: "input",
        name: "packageName",
        message: "npm package name:",
        default: `@${answers.name}/mcp-server`,
      },
    ]);
    command = "npx";
    args = ["-y", packageName];
  } else if (answers.commandType === "node") {
    const { scriptPath } = await inquirer.prompt([
      {
        type: "input",
        name: "scriptPath",
        message: "Path to Node.js script:",
        default: "./server.js",
      },
    ]);
    command = "node";
    args = [scriptPath];
  } else if (answers.commandType === "python") {
    const { scriptPath } = await inquirer.prompt([
      {
        type: "input",
        name: "scriptPath",
        message: "Path to Python script:",
        default: "./server.py",
      },
    ]);
    command = "python";
    args = [scriptPath];
  } else {
    const { customCommand, customArgs } = await inquirer.prompt([
      {
        type: "input",
        name: "customCommand",
        message: "Command:",
        validate: (input: string) => input ? true : "Command is required",
      },
      {
        type: "input",
        name: "customArgs",
        message: "Arguments (space-separated):",
      },
    ]);
    command = customCommand;
    args = customArgs ? customArgs.split(" ") : [];
  }

  // Return custom MCP entry
  return {
    name: answers.name,
    displayName: answers.displayName,
    description: answers.description,
    category: "custom",
    official: false,
    installation: {
      command,
      args,
      requiresInstall: false,
    },
    env: {
      required: [],
      optional: [],
    },
    features: [],
    docs: "",
    repository: "",
    priority: "medium",
    recommended: false,
    tags: ["custom"],
    verified: false,
  };
}

/**
 * Configure environment variables
 */
async function configureEnvironmentVariables(
  mcpEntry: MCPRegistryEntry
): Promise<Record<string, string>> {
  const envConfig: Record<string, string> = {};

  // Required env vars
  if (mcpEntry.env.required.length > 0) {
    console.log(chalk.cyan("\n🔐 Required Environment Variables\n"));

    for (const envVar of mcpEntry.env.required) {
      const { value } = await inquirer.prompt([
        {
          type: envVar.secret ? "password" : "input",
          name: "value",
          message: `${envVar.name}: ${envVar.description}${envVar.example ? `\n   Example: ${chalk.gray(envVar.example)}` : ""}`,
          validate: (input: string) => input ? true : `${envVar.name} is required`,
        },
      ]);

      envConfig[envVar.name] = value;
    }
  }

  // Optional env vars
  if (mcpEntry.env.optional.length > 0) {
    const { configureOptional } = await inquirer.prompt([
      {
        type: "confirm",
        name: "configureOptional",
        message: "Configure optional environment variables?",
        default: false,
      },
    ]);

    if (configureOptional) {
      console.log(chalk.cyan("\n⚙️  Optional Environment Variables\n"));

      for (const envVar of mcpEntry.env.optional) {
        const { value } = await inquirer.prompt([
          {
            type: "input",
            name: "value",
            message: `${envVar.name}: ${envVar.description}`,
            default: envVar.default,
          },
        ]);

        if (value !== envVar.default) {
          envConfig[envVar.name] = value;
        }
      }
    }
  }

  return envConfig;
}

/**
 * Test MCP connection via JSON-RPC
 */
async function testMCPConnection(
  mcpEntry: MCPRegistryEntry,
  envConfig: Record<string, string>
): Promise<MCPToolSchema[]> {
  const spinner = ora("Testing MCP connection...").start();

  try {
    // Spawn MCP server process
    const client = new MCPClient(
      mcpEntry.installation.command,
      mcpEntry.installation.args,
      envConfig
    );

    await client.connect();

    spinner.text = "Fetching available tools...";

    // Get tools list
    const tools = await client.listTools();

    spinner.succeed(`Connection successful! Found ${chalk.bold(tools.length)} tools`);

    await client.disconnect();

    return tools;
  } catch (error) {
    spinner.fail("Connection test failed");

    const { retry } = await inquirer.prompt([
      {
        type: "confirm",
        name: "retry",
        message: `Error: ${error instanceof Error ? error.message : "Unknown error"}\n   Retry connection?`,
        default: true,
      },
    ]);

    if (retry) {
      return testMCPConnection(mcpEntry, envConfig);
    }

    const { continueAnyway } = await inquirer.prompt([
      {
        type: "confirm",
        name: "continueAnyway",
        message: "Continue without testing connection?",
        default: false,
      },
    ]);

    if (!continueAnyway) {
      throw new Error("USER_CANCELLED");
    }

    return [];
  }
}

/**
 * JSON-RPC MCP Client
 */
class MCPClient {
  private process: ChildProcess | null = null;
  private requestId = 0;
  private pendingRequests = new Map<number, {
    resolve: (value: any) => void;
    reject: (error: Error) => void;
    timeout: NodeJS.Timeout;
  }>();

  constructor(
    private command: string,
    private args: string[],
    private env: Record<string, string>
  ) {}

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Spawn process
        this.process = spawn(this.command, this.args, {
          stdio: ["pipe", "pipe", "pipe"],
          env: { ...process.env, ...this.env },
        });

        // Handle stdout (JSON-RPC responses)
        let buffer = "";
        this.process.stdout?.on("data", (data: Buffer) => {
          buffer += data.toString();

          // Try to parse complete JSON messages
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.trim()) {
              try {
                const response: JSONRPCResponse = JSON.parse(line);
                this.handleResponse(response);
              } catch (e) {
                // Ignore non-JSON lines
              }
            }
          }
        });

        // Handle stderr
        let errorBuffer = "";
        this.process.stderr?.on("data", (data: Buffer) => {
          errorBuffer += data.toString();
        });

        // Handle process errors
        this.process.on("error", (error) => {
          reject(new Error(`Failed to start MCP server: ${error.message}`));
        });

        // Handle process exit
        this.process.on("exit", (code) => {
          if (code !== 0) {
            reject(new Error(`MCP server exited with code ${code}\n${errorBuffer}`));
          }
        });

        // Give process time to start
        setTimeout(() => resolve(), 1000);
      } catch (error) {
        reject(error);
      }
    });
  }

  async disconnect(): Promise<void> {
    if (this.process) {
      this.process.kill();
      this.process = null;
    }

    // Reject all pending requests
    for (const [, pending] of this.pendingRequests) {
      clearTimeout(pending.timeout);
      pending.reject(new Error("Client disconnected"));
    }
    this.pendingRequests.clear();
  }

  async listTools(): Promise<MCPToolSchema[]> {
    const response = await this.request<ToolListResponse>("tools/list", {});

    return response.tools.map((tool) => ({
      name: tool.name,
      description: tool.description || "",
      inputSchema: tool.inputSchema || { type: "object", properties: {} },
      outputSchema: { type: "object" },
    }));
  }

  private async request<T = any>(method: string, params: any = {}): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!this.process || !this.process.stdin) {
        reject(new Error("MCP client not connected"));
        return;
      }

      const id = ++this.requestId;
      const request: JSONRPCRequest = {
        jsonrpc: "2.0",
        id,
        method,
        params,
      };

      // Set timeout
      const timeout = setTimeout(() => {
        this.pendingRequests.delete(id);
        reject(new Error(`Request timeout: ${method}`));
      }, 30000); // 30 second timeout

      // Store pending request
      this.pendingRequests.set(id, { resolve, reject, timeout });

      // Send request
      try {
        this.process.stdin.write(JSON.stringify(request) + "\n");
      } catch (error) {
        clearTimeout(timeout);
        this.pendingRequests.delete(id);
        reject(error);
      }
    });
  }

  private handleResponse(response: JSONRPCResponse): void {
    const pending = this.pendingRequests.get(response.id);
    if (!pending) return;

    clearTimeout(pending.timeout);
    this.pendingRequests.delete(response.id);

    if (response.error) {
      pending.reject(new Error(`JSON-RPC error: ${response.error.message}`));
    } else {
      pending.resolve(response.result);
    }
  }
}

/**
 * Generate tool schema JSON file
 */
async function generateToolSchema(
  mcpName: string,
  tools: MCPToolSchema[]
): Promise<void> {
  const schemaPath = path.join(
    process.cwd(),
    "templates",
    "mcp-tools",
    `${mcpName}-tools.json`
  );

  // Ensure directory exists
  await fs.mkdir(path.dirname(schemaPath), { recursive: true });

  // Write schema
  const schema = {
    version: "1.0.0",
    mcp: mcpName,
    generatedAt: new Date().toISOString(),
    tools: tools.map((tool) => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema,
      outputSchema: tool.outputSchema,
    })),
  };

  await fs.writeFile(schemaPath, JSON.stringify(schema, null, 2));

  console.log(chalk.green(`\n✓ Generated schema: ${chalk.bold(path.relative(process.cwd(), schemaPath))}`));
}

/**
 * Save MCP configuration to .mcp.json
 */
async function saveMCPConfiguration(
  mcpEntry: MCPRegistryEntry,
  envConfig: Record<string, string>
): Promise<void> {
  const configPath = path.join(process.cwd(), ".claude", ".mcp.json");

  // Load existing config or create new
  let config: MCPConfig;
  try {
    const content = await fs.readFile(configPath, "utf-8");
    config = JSON.parse(content);
  } catch {
    config = { mcpServers: {} };
  }

  // Add new MCP server
  config.mcpServers[mcpEntry.name] = {
    command: mcpEntry.installation.command,
    args: mcpEntry.installation.args,
    env: envConfig,
  };

  // Ensure directory exists
  await fs.mkdir(path.dirname(configPath), { recursive: true });

  // Write config
  await fs.writeFile(configPath, JSON.stringify(config, null, 2));

  console.log(chalk.green(`\n✓ Configuration saved: ${chalk.bold(path.relative(process.cwd(), configPath))}`));
}

/**
 * Display success message
 */
function displaySuccessMessage(
  mcpEntry: MCPRegistryEntry,
  tools: MCPToolSchema[]
): void {
  console.log(chalk.green.bold("\n✨ MCP Server Added Successfully!\n"));

  console.log(chalk.bold("Server: ") + chalk.cyan(mcpEntry.displayName));
  console.log(chalk.bold("Description: ") + mcpEntry.description);

  if (tools.length > 0) {
    console.log(chalk.bold("\nAvailable Tools:"));
    tools.slice(0, 5).forEach((tool) => {
      console.log(chalk.gray(`  • ${tool.name}: ${tool.description}`));
    });
    if (tools.length > 5) {
      console.log(chalk.gray(`  ... and ${tools.length - 5} more`));
    }
  }

  if (mcpEntry.features.length > 0) {
    console.log(chalk.bold("\nFeatures:"));
    mcpEntry.features.forEach((feature) => {
      console.log(chalk.gray(`  • ${feature}`));
    });
  }

  if (mcpEntry.docs) {
    console.log(chalk.bold("\nDocumentation: ") + chalk.blue(mcpEntry.docs));
  }

  console.log(chalk.cyan("\n💡 Next steps:"));
  console.log(chalk.gray("  • The MCP server is now available in your project"));
  console.log(chalk.gray("  • Claude will automatically discover and use the tools"));
  console.log(chalk.gray("  • Check .claude/.mcp.json for configuration"));

  console.log();
}
