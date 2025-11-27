import inquirer from 'inquirer';
import ora from 'ora';
import chalk from 'chalk';
import { promises as fs } from 'fs';
import path from 'path';
import { spawn, ChildProcess } from 'child_process';
import { z } from 'zod';
import type {
  MCPToolSchema,
  MCPParameter,
  MCPReturnType,
} from '../../core/execution-engine/types';
import { Logger } from '../../core/utils/logger';

// Configuration constants
const CONFIG = {
  CONNECTION_STARTUP_TIMEOUT_MS: 5000,
  REQUEST_TIMEOUT_MS: 30000,
  MAX_RETRIES: 3,
  MAX_BUFFER_SIZE: 10 * 1024 * 1024, // 10MB
  GRACEFUL_SHUTDOWN_TIMEOUT_MS: 5000,
} as const;

const logger = new Logger('mcp-add');

// Zod schemas for validation
const JSONSchemaSchema = z.object({
  type: z.string(),
  properties: z.record(z.any()).optional(),
  items: z.any().optional(),
  required: z.array(z.string()).optional(),
});

const MCPRegistryEntrySchema = z.object({
  name: z.string(),
  displayName: z.string(),
  description: z.string(),
  category: z.string(),
  official: z.boolean(),
  installation: z.object({
    command: z.string(),
    args: z.array(z.string()),
    requiresInstall: z.boolean(),
  }),
  env: z.object({
    required: z.array(
      z.object({
        name: z.string(),
        description: z.string(),
        type: z.string(),
        secret: z.boolean().optional(),
        example: z.string().optional(),
      })
    ),
    optional: z.array(
      z.object({
        name: z.string(),
        description: z.string(),
        default: z.string(),
        type: z.string(),
      })
    ),
  }),
  features: z.array(z.string()),
  docs: z.string(),
  repository: z.string(),
  priority: z.string(),
  recommended: z.boolean(),
  tags: z.array(z.string()),
  verified: z.boolean(),
});

const MCPRegistrySchema = z.object({
  version: z.string(),
  servers: z.record(MCPRegistryEntrySchema),
  categories: z.record(
    z.object({
      name: z.string(),
      description: z.string(),
      icon: z.string(),
    })
  ),
});

const JSONRPCResponseSchema = z.object({
  jsonrpc: z.literal('2.0'),
  id: z.number(),
  result: z.any().optional(),
  error: z
    .object({
      code: z.number(),
      message: z.string(),
    })
    .optional(),
});

const MCPConfigSchema = z.object({
  mcpServers: z.record(
    z.object({
      command: z.string(),
      args: z.array(z.string()),
      env: z.record(z.string()).optional(),
    })
  ),
});

// Types
type MCPRegistryEntry = z.infer<typeof MCPRegistryEntrySchema>;
type MCPRegistry = z.infer<typeof MCPRegistrySchema>;
type JSONRPCResponse = z.infer<typeof JSONRPCResponseSchema>;
type MCPConfig = z.infer<typeof MCPConfigSchema>;

interface AddMCPOptions {
  name?: string;
  interactive?: boolean;
  test?: boolean;
}

type JSONSchemaDefinition = z.infer<typeof JSONSchemaSchema>;

interface ToolListResponse {
  tools: Array<{
    name: string;
    description?: string;
    inputSchema?: JSONSchemaDefinition;
    outputSchema?: {
      type?: string;
      description?: string;
    };
  }>;
}

function mapInputSchemaToParameters(
  schema?: JSONSchemaDefinition
): MCPParameter[] {
  if (!schema || !schema.properties) {
    return [];
  }

  const required = new Set(schema.required ?? []);
  return Object.entries(schema.properties).map(([name, definition]) => {
    const typedDefinition = definition as {
      type?: string;
      description?: string;
      default?: unknown;
    };

    return {
      name,
      type:
        typeof typedDefinition.type === 'string' ? typedDefinition.type : 'any',
      description: typedDefinition.description ?? '',
      required: required.has(name),
      default: typedDefinition.default,
    };
  });
}

function mapOutputSchemaToReturn(schema?: {
  type?: string;
  description?: string;
}): MCPReturnType | undefined {
  if (!schema) {
    return undefined;
  }

  return {
    type: typeof schema.type === 'string' ? schema.type : 'object',
    description: schema.description ?? '',
  };
}

interface JSONRPCRequest {
  jsonrpc: '2.0';
  id: number;
  method: string;
  params?: unknown;
}

/**
 * Main command: Add new MCP server
 */
export async function mcpAddCommand(
  options: AddMCPOptions = {}
): Promise<void> {
  logger.info('Starting MCP add command');
  console.log(chalk.blue.bold('\n🔌 Add MCP Server\n'));

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
    logger.info('MCP server added successfully', { server: selectedMCP.name });
  } catch (error) {
    if (error instanceof Error && error.message === 'USER_CANCELLED') {
      logger.info('Setup cancelled by user');
      console.log(chalk.yellow('\n⚠️  Setup cancelled by user\n'));
      process.exit(0);
    }

    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    logger.error('Failed to add MCP server', { error: errorMessage });
    console.error(chalk.red('\n❌ Failed to add MCP server:'), errorMessage);
    process.exit(1);
  }
}

/**
 * Load MCP registry from JSON file with validation
 */
async function loadMCPRegistry(): Promise<MCPRegistry> {
  const registryPath = path.join(
    __dirname,
    '../../core/configurators/mcp-registry.json'
  );

  try {
    logger.debug('Loading MCP registry', { path: registryPath });
    const content = await fs.readFile(registryPath, 'utf-8');
    const parsed = JSON.parse(content);
    const validated = MCPRegistrySchema.parse(parsed);
    logger.debug('MCP registry loaded', {
      serverCount: Object.keys(validated.servers).length,
    });
    return validated;
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.error('Invalid registry format', { errors: error.errors });
      const firstIssue = error.errors[0];
      const message = firstIssue
        ? firstIssue.message
        : 'Unknown validation error';
      throw new Error(`Invalid MCP registry format: ${message}`);
    }
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    logger.error('Failed to load MCP registry', { error: errorMessage });
    throw new Error(`Failed to load MCP registry: ${errorMessage}`);
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
      logger.debug('Using provided MCP server', { name: providedName });
      return entry;
    }
    logger.warn('Provided MCP not found in registry', { name: providedName });
    console.log(
      chalk.yellow(`\n⚠️  MCP "${providedName}" not found in registry`)
    );
  }

  // Build choices grouped by category
  const choicesByCategory: Record<string, any[]> = {};

  for (const [key, server] of Object.entries(registry.servers)) {
    const category = server.category || 'other';

    if (!choicesByCategory[category]) {
      choicesByCategory[category] = [];
    }

    const verified = server.verified ? chalk.green('✓') : chalk.gray('○');
    const official = server.official
      ? chalk.blue('[Official]')
      : chalk.gray('[Community]');

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
      name: chalk.bold.green(
        `⭐ ${server.displayName} - ${server.description}`
      ),
      value: key,
      short: server.displayName,
    }));

  if (recommended.length > 0) {
    choices.push(
      new inquirer.Separator(chalk.bold.cyan('\n━━━ Recommended ━━━')),
      ...recommended
    );
  }

  // Add categories
  for (const [categoryKey, categoryServers] of Object.entries(
    choicesByCategory
  )) {
    const categoryInfo = registry.categories[categoryKey];
    if (categoryInfo && categoryServers.length > 0) {
      choices.push(
        new inquirer.Separator(
          chalk.bold(`\n${categoryInfo.icon}  ${categoryInfo.name}`)
        ),
        ...categoryServers
      );
    }
  }

  // Add custom option
  choices.push(new inquirer.Separator(chalk.bold.yellow('\n━━━ Custom ━━━')), {
    name: chalk.yellow('🔧 Custom MCP Server (manual configuration)'),
    value: '__custom__',
    short: 'Custom',
  });

  // Prompt for selection
  const { selectedMCP } = await inquirer.prompt<{ selectedMCP: string }>([
    {
      type: 'list',
      name: 'selectedMCP',
      message: 'Select MCP server to add:',
      choices,
      pageSize: 15,
    },
  ]);

  // Handle custom MCP
  if (selectedMCP === '__custom__') {
    return await customMCPConfiguration(registry);
  }

  const server = registry.servers[selectedMCP];
  if (!server) {
    throw new Error(`MCP server "${selectedMCP}" not found in registry`);
  }

  return server;
}

/**
 * Parse command arguments safely (prevents command injection)
 */
function parseArguments(input: string): string[] {
  // Match quoted strings or non-whitespace sequences
  const regex = /(?:[^\s"]+|"[^"]*")+/g;
  const matches = input.match(regex) || [];

  // Remove quotes from matched strings
  return matches.map((arg) => arg.replace(/^"(.*)"$/, '$1'));
}

/**
 * Validate script path for security
 */
async function validateScriptPath(scriptPath: string): Promise<string> {
  const resolvedPath = path.resolve(scriptPath);
  const cwd = process.cwd();

  // Check if path is within project directory (security)
  if (!resolvedPath.startsWith(cwd)) {
    throw new Error('Script path must be within project directory');
  }

  // Check if file exists
  try {
    await fs.access(resolvedPath);
    logger.debug('Script path validated', { path: resolvedPath });
  } catch {
    logger.warn('Script file not found', { path: scriptPath });
    console.log(chalk.yellow(`\n⚠️  Warning: File not found: ${scriptPath}`));
    const { continueAnyway } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'continueAnyway',
        message: 'Continue anyway?',
        default: false,
      },
    ]);
    if (!continueAnyway) {
      throw new Error('USER_CANCELLED');
    }
  }

  return resolvedPath;
}

/**
 * Custom MCP configuration wizard
 */
async function customMCPConfiguration(
  registry: MCPRegistry
): Promise<MCPRegistryEntry> {
  logger.info('Starting custom MCP configuration');
  console.log(chalk.cyan('\n🔧 Custom MCP Configuration\n'));

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'MCP server name (lowercase, no spaces):',
      validate: (input: string) => {
        if (!input) return 'Name is required';
        if (!/^[a-z0-9-]+$/.test(input))
          return 'Use lowercase letters, numbers, and hyphens only';
        if (registry.servers[input]) return `MCP "${input}" already exists`;
        return true;
      },
    },
    {
      type: 'input',
      name: 'displayName',
      message: 'Display name:',
      default: (answers: any) =>
        answers.name
          .split('-')
          .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' '),
    },
    {
      type: 'input',
      name: 'description',
      message: 'Description:',
      validate: (input: string) => (input ? true : 'Description is required'),
    },
    {
      type: 'list',
      name: 'commandType',
      message: 'How to launch the server?',
      choices: [
        { name: 'npx package (e.g., npx -y @org/package)', value: 'npx' },
        { name: 'Node.js script (e.g., node ./server.js)', value: 'node' },
        { name: 'Python script (e.g., python ./server.py)', value: 'python' },
        { name: 'Custom command', value: 'custom' },
      ],
    },
  ]);

  let command: string;
  let args: string[];

  // Configure command based on type
  if (answers.commandType === 'npx') {
    const { packageName } = await inquirer.prompt([
      {
        type: 'input',
        name: 'packageName',
        message: 'npm package name:',
        default: `@${answers.name}/mcp-server`,
      },
    ]);
    command = 'npx';
    args = ['-y', packageName];
  } else if (answers.commandType === 'node') {
    const { scriptPath } = await inquirer.prompt([
      {
        type: 'input',
        name: 'scriptPath',
        message: 'Path to Node.js script:',
        default: './server.js',
      },
    ]);
    const validatedPath = await validateScriptPath(scriptPath);
    command = 'node';
    args = [validatedPath];
  } else if (answers.commandType === 'python') {
    const { scriptPath } = await inquirer.prompt([
      {
        type: 'input',
        name: 'scriptPath',
        message: 'Path to Python script:',
        default: './server.py',
      },
    ]);
    const validatedPath = await validateScriptPath(scriptPath);
    command = 'python';
    args = [validatedPath];
  } else {
    const { customCommand, customArgs } = await inquirer.prompt([
      {
        type: 'input',
        name: 'customCommand',
        message: 'Command:',
        validate: (input: string) => (input ? true : 'Command is required'),
      },
      {
        type: 'input',
        name: 'customArgs',
        message:
          'Arguments (space-separated, use quotes for args with spaces):',
      },
    ]);
    command = customCommand;
    args = customArgs ? parseArguments(customArgs) : [];
  }

  logger.info('Custom MCP configured', { name: answers.name, command });

  // Return custom MCP entry
  return {
    name: answers.name,
    displayName: answers.displayName,
    description: answers.description,
    category: 'custom',
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
    docs: '',
    repository: '',
    priority: 'medium',
    recommended: false,
    tags: ['custom'],
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
    console.log(chalk.cyan('\n🔐 Required Environment Variables\n'));

    for (const envVar of mcpEntry.env.required) {
      const { value } = await inquirer.prompt([
        {
          type: envVar.secret ? 'password' : 'input',
          name: 'value',
          message: `${envVar.name}: ${envVar.description}${envVar.example ? `\n   Example: ${chalk.gray(envVar.example)}` : ''}`,
          validate: (input: string) =>
            input ? true : `${envVar.name} is required`,
        },
      ]);

      envConfig[envVar.name] = value;
      logger.debug('Environment variable configured', { name: envVar.name });
    }
  }

  // Optional env vars
  if (mcpEntry.env.optional.length > 0) {
    const { configureOptional } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'configureOptional',
        message: 'Configure optional environment variables?',
        default: false,
      },
    ]);

    if (configureOptional) {
      console.log(chalk.cyan('\n⚙️  Optional Environment Variables\n'));

      for (const envVar of mcpEntry.env.optional) {
        const { value } = await inquirer.prompt([
          {
            type: 'input',
            name: 'value',
            message: `${envVar.name}: ${envVar.description}`,
            default: envVar.default,
          },
        ]);

        if (value !== envVar.default) {
          envConfig[envVar.name] = value;
          logger.debug('Optional environment variable configured', {
            name: envVar.name,
          });
        }
      }
    }
  }

  return envConfig;
}

/**
 * Test MCP connection via JSON-RPC with retry logic
 */
async function testMCPConnection(
  mcpEntry: MCPRegistryEntry,
  envConfig: Record<string, string>
): Promise<MCPToolSchema[]> {
  let attempt = 0;

  while (attempt < CONFIG.MAX_RETRIES) {
    const spinner = ora('Testing MCP connection...').start();

    let client: MCPClient | null = null;

    try {
      logger.debug('Attempting MCP connection', {
        attempt: attempt + 1,
        server: mcpEntry.name,
      });

      // Spawn MCP server process
      client = new MCPClient(
        mcpEntry.installation.command,
        mcpEntry.installation.args,
        envConfig
      );

      await client.connect();

      spinner.text = 'Fetching available tools...';

      // Get tools list
      const tools = await client.listTools();

      spinner.succeed(
        `Connection successful! Found ${chalk.bold(tools.length)} tools`
      );
      logger.info('MCP connection successful', { toolCount: tools.length });

      return tools;
    } catch (error) {
      spinner.fail('Connection test failed');
      attempt++;

      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      logger.error('Connection test failed', { attempt, error: errorMessage });

      if (attempt >= CONFIG.MAX_RETRIES) {
        const { continueAnyway } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'continueAnyway',
            message: `All ${CONFIG.MAX_RETRIES} attempts failed. Continue without testing connection?`,
            default: false,
          },
        ]);

        if (!continueAnyway) {
          throw new Error('USER_CANCELLED');
        }

        return [];
      }

      const { retry } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'retry',
          message: `Attempt ${attempt}/${CONFIG.MAX_RETRIES} - Error: ${errorMessage}\n   Retry connection?`,
          default: true,
        },
      ]);

      if (!retry) {
        const { continueAnyway } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'continueAnyway',
            message: 'Continue without testing connection?',
            default: false,
          },
        ]);

        if (!continueAnyway) {
          throw new Error('USER_CANCELLED');
        }

        return [];
      }
    } finally {
      if (client) {
        try {
          await client.disconnect();
        } catch (disconnectError) {
          logger.warn('Failed to disconnect MCP client', {
            error:
              disconnectError instanceof Error
                ? disconnectError.message
                : String(disconnectError),
          });
        }
      }
    }
  }

  return [];
}

/**
 * JSON-RPC MCP Client with proper resource management
 */
class MCPClient {
  private process: ChildProcess | null = null;
  private requestId = 0;
  private pendingRequests = new Map<
    number,
    {
      resolve: (value: any) => void;
      reject: (error: Error) => void;
      timeout: NodeJS.Timeout;
    }
  >();
  private stdoutHandler?: (data: Buffer) => void;
  private stderrHandler?: (data: Buffer) => void;
  private errorHandler?: (error: Error) => void;
  private exitHandler?: (code: number | null) => void;
  private errorBuffer = '';
  private stdoutBuffer = '';

  constructor(
    private command: string,
    private args: string[],
    private env: Record<string, string>
  ) {}

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      let resolved = false;
      const timeoutHandle = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          this.cleanup();
          reject(new Error('Server startup timeout'));
        }
      }, CONFIG.CONNECTION_STARTUP_TIMEOUT_MS);

      try {
        // Spawn process
        this.process = spawn(this.command, this.args, {
          stdio: ['pipe', 'pipe', 'pipe'],
          env: { ...process.env, ...this.env },
        });

        // Handle stdout (JSON-RPC responses)
        this.stdoutHandler = (data: Buffer) => {
          this.stdoutBuffer += data.toString();

          // Buffer size limit
          if (this.stdoutBuffer.length > CONFIG.MAX_BUFFER_SIZE) {
            if (!resolved) {
              resolved = true;
              clearTimeout(timeoutHandle);
              this.cleanup();
              reject(
                new Error('Buffer overflow: MCP server sent too much data')
              );
            }
            return;
          }

          // Try to parse complete JSON messages
          const lines = this.stdoutBuffer.split('\n');
          this.stdoutBuffer = lines.pop() || '';

          for (const line of lines) {
            if (line.trim()) {
              try {
                const parsed = JSON.parse(line);
                const response = JSONRPCResponseSchema.parse(parsed);
                this.handleResponse(response);

                // Resolve on first valid JSON-RPC response (server is ready)
                if (!resolved) {
                  resolved = true;
                  clearTimeout(timeoutHandle);
                  resolve();
                }
              } catch (e) {
                // Ignore non-JSON lines or validation errors
                logger.debug('Ignored non-JSON line from stdout', { line });
              }
            }
          }
        };

        this.process.stdout?.on('data', this.stdoutHandler);

        // Handle stderr
        this.stderrHandler = (data: Buffer) => {
          this.errorBuffer += data.toString();

          // Buffer size limit
          if (this.errorBuffer.length > CONFIG.MAX_BUFFER_SIZE) {
            this.errorBuffer =
              this.errorBuffer.substring(0, CONFIG.MAX_BUFFER_SIZE) +
              '\n[Buffer limit reached]';
          }
        };

        this.process.stderr?.on('data', this.stderrHandler);

        // Handle process errors
        this.errorHandler = (error: Error) => {
          if (!resolved) {
            resolved = true;
            clearTimeout(timeoutHandle);
            this.cleanup();
            reject(new Error(`Failed to start MCP server: ${error.message}`));
          }
        };

        this.process.on('error', this.errorHandler);

        // Handle process exit
        this.exitHandler = (code: number | null) => {
          if (code !== 0 && code !== null) {
            if (!resolved) {
              resolved = true;
              clearTimeout(timeoutHandle);
              this.cleanup();
              reject(
                new Error(
                  `MCP server exited with code ${code}\n${this.errorBuffer}`
                )
              );
            }
          }
        };

        this.process.on('exit', this.exitHandler);
      } catch (error) {
        if (!resolved) {
          resolved = true;
          clearTimeout(timeoutHandle);
          this.cleanup();
          reject(error);
        }
      }
    });
  }

  async disconnect(): Promise<void> {
    if (!this.process) return;

    logger.debug('Disconnecting MCP client');

    // Try graceful shutdown first
    this.process.kill('SIGTERM');

    // Wait for process to exit
    await new Promise<void>((resolve) => {
      const timeout = setTimeout(() => {
        // Force kill after timeout
        if (this.process) {
          logger.warn('Forcing MCP server kill after timeout');
          this.process.kill('SIGKILL');
        }
        resolve();
      }, CONFIG.GRACEFUL_SHUTDOWN_TIMEOUT_MS);

      this.process?.once('exit', () => {
        clearTimeout(timeout);
        resolve();
      });
    });

    this.cleanup();
  }

  private cleanup(): void {
    // Remove event listeners to prevent memory leaks
    if (this.process) {
      if (this.stdoutHandler) {
        this.process.stdout?.removeListener('data', this.stdoutHandler);
      }
      if (this.stderrHandler) {
        this.process.stderr?.removeListener('data', this.stderrHandler);
      }
      if (this.errorHandler) {
        this.process.removeListener('error', this.errorHandler);
      }
      if (this.exitHandler) {
        this.process.removeListener('exit', this.exitHandler);
      }

      this.process = null;
    }

    this.stdoutHandler = undefined;
    this.stderrHandler = undefined;
    this.errorHandler = undefined;
    this.exitHandler = undefined;

    // Reject all pending requests
    for (const [, pending] of this.pendingRequests) {
      clearTimeout(pending.timeout);
      pending.reject(new Error('Client disconnected'));
    }
    this.pendingRequests.clear();

    // Clear buffers
    this.stdoutBuffer = '';
    this.errorBuffer = '';
  }

  async listTools(): Promise<MCPToolSchema[]> {
    const response = await this.request<ToolListResponse>('tools/list', {});

    return response.tools.map((tool) => ({
      name: tool.name,
      description: tool.description ?? '',
      parameters: mapInputSchemaToParameters(tool.inputSchema),
      returns: mapOutputSchemaToReturn(tool.outputSchema),
    }));
  }

  private async request<T = unknown>(
    method: string,
    params: unknown = {}
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!this.process || !this.process.stdin) {
        reject(new Error('MCP client not connected'));
        return;
      }

      const id = ++this.requestId;
      const request: JSONRPCRequest = {
        jsonrpc: '2.0',
        id,
        method,
        params,
      };

      // Set timeout
      const timeout = setTimeout(() => {
        this.pendingRequests.delete(id);
        logger.warn('Request timeout', { method, id });
        reject(new Error(`Request timeout: ${method}`));
      }, CONFIG.REQUEST_TIMEOUT_MS);

      // Store pending request
      this.pendingRequests.set(id, { resolve, reject, timeout });

      // Send request
      try {
        this.process.stdin.write(JSON.stringify(request) + '\n');
        logger.debug('Sent JSON-RPC request', { method, id });
      } catch (error) {
        clearTimeout(timeout);
        this.pendingRequests.delete(id);
        reject(error);
      }
    });
  }

  private handleResponse(response: JSONRPCResponse): void {
    const pending = this.pendingRequests.get(response.id);
    if (!pending) {
      logger.warn('Received response for unknown request', { id: response.id });
      return;
    }

    clearTimeout(pending.timeout);
    this.pendingRequests.delete(response.id);

    if (response.error) {
      logger.error('JSON-RPC error', {
        id: response.id,
        error: response.error,
      });
      pending.reject(new Error(`JSON-RPC error: ${response.error.message}`));
    } else {
      logger.debug('JSON-RPC response received', { id: response.id });
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
    'templates',
    'mcp-tools',
    `${mcpName}-tools.json`
  );

  // Ensure directory exists
  await fs.mkdir(path.dirname(schemaPath), { recursive: true });

  // Write schema
  const schema = {
    version: '1.0.0',
    mcp: mcpName,
    generatedAt: new Date().toISOString(),
    tools: tools.map((tool) => ({
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters,
      returns: tool.returns,
      examples: tool.examples,
      category: tool.category,
    })),
  };

  await fs.writeFile(schemaPath, JSON.stringify(schema, null, 2));

  console.log(
    chalk.green(
      `\n✓ Generated schema: ${chalk.bold(path.relative(process.cwd(), schemaPath))}`
    )
  );
  logger.info('Schema generated', {
    path: schemaPath,
    toolCount: tools.length,
  });
}

/**
 * Save MCP configuration to .mcp.json with validation
 */
async function saveMCPConfiguration(
  mcpEntry: MCPRegistryEntry,
  envConfig: Record<string, string>
): Promise<void> {
  const configPath = path.join(process.cwd(), '.claude', '.mcp.json');

  // Load existing config or create new
  let config: MCPConfig;
  try {
    const content = await fs.readFile(configPath, 'utf-8');
    const parsed = JSON.parse(content);
    config = MCPConfigSchema.parse(parsed);
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn('Existing config invalid, creating new', {
        errors: error.errors,
      });
    }
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

  console.log(
    chalk.green(
      `\n✓ Configuration saved: ${chalk.bold(path.relative(process.cwd(), configPath))}`
    )
  );
  logger.info('Configuration saved', {
    path: configPath,
    server: mcpEntry.name,
  });
}

/**
 * Display success message
 */
function displaySuccessMessage(
  mcpEntry: MCPRegistryEntry,
  tools: MCPToolSchema[]
): void {
  console.log(chalk.green.bold('\n✨ MCP Server Added Successfully!\n'));

  console.log(chalk.bold('Server: ') + chalk.cyan(mcpEntry.displayName));
  console.log(chalk.bold('Description: ') + mcpEntry.description);

  if (tools.length > 0) {
    console.log(chalk.bold('\nAvailable Tools:'));
    tools.slice(0, 5).forEach((tool) => {
      console.log(chalk.gray(`  • ${tool.name}: ${tool.description}`));
    });
    if (tools.length > 5) {
      console.log(chalk.gray(`  ... and ${tools.length - 5} more`));
    }
  }

  if (mcpEntry.features.length > 0) {
    console.log(chalk.bold('\nFeatures:'));
    mcpEntry.features.forEach((feature: string) => {
      console.log(chalk.gray(`  • ${feature}`));
    });
  }

  if (mcpEntry.docs) {
    console.log(chalk.bold('\nDocumentation: ') + chalk.blue(mcpEntry.docs));
  }

  console.log(chalk.cyan('\n💡 Next steps:'));
  console.log(
    chalk.gray('  • The MCP server is now available in your project')
  );
  console.log(
    chalk.gray('  • Claude will automatically discover and use the tools')
  );
  console.log(chalk.gray('  • Check .claude/.mcp.json for configuration'));

  console.log();
}

// Test hooks (not part of public CLI API)
export const __testing = {
  parseArguments,
  validateScriptPath,
  MCPClient,
  CONFIG,
  mapInputSchemaToParameters,
  mapOutputSchemaToReturn,
};
