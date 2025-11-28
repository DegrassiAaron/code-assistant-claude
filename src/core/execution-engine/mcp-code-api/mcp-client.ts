/* eslint-disable @typescript-eslint/no-explicit-any */
import { spawn, ChildProcess } from 'child_process';
import { EventEmitter } from 'events';

/**
 * Real MCP Client for communicating with MCP servers
 *
 * Supports:
 * - stdio protocol (process spawning)
 * - HTTP/SSE protocol (future)
 * - Tool discovery
 * - Tool execution
 */
export class RealMCPClient extends EventEmitter {
  private process: ChildProcess | null = null;
  private connected: boolean = false;
  private tools: Map<string, any> = new Map();
  private pendingRequests: Map<
    number,
    { resolve: (value: any) => void; reject: (error: Error) => void }
  > = new Map();
  private requestId: number = 0;

  constructor(
    private serverCommand: string,
    private serverArgs: string[]
  ) {
    super();
  }

  /**
   * Connect to MCP server
   */
  async connect(): Promise<void> {
    if (this.connected) {
      return;
    }

    return new Promise((resolve, reject) => {
      try {
        // Spawn MCP server process
        this.process = spawn(this.serverCommand, this.serverArgs, {
          stdio: ['pipe', 'pipe', 'pipe'],
        });

        // Handle stdout (JSON-RPC messages)
        this.process.stdout?.on('data', (data) => {
          this.handleServerMessage(data.toString());
        });

        // Handle stderr (logs)
        this.process.stderr?.on('data', (data) => {
          console.error('[MCP Server]', data.toString());
        });

        // Handle process exit
        this.process.on('exit', (code) => {
          console.log(`[MCP Server] Exited with code ${code}`);
          this.connected = false;
          this.emit('disconnected');
        });

        // Handle errors
        this.process.on('error', (error) => {
          console.error('[MCP Server] Error:', error);
          reject(error);
        });

        // Send initialize request
        this.sendRequest('initialize', {
          protocolVersion: '2024-11-05',
          capabilities: {},
          clientInfo: {
            name: 'code-assistant-claude',
            version: '1.0.0',
          },
        })
          .then((response) => {
            console.log('[MCP Server] Initialized:', response);
            this.connected = true;

            // Discover available tools
            return this.discoverTools();
          })
          .then(() => {
            resolve();
          })
          .catch(reject);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Discover available tools from server
   */
  async discoverTools(): Promise<void> {
    try {
      const response = await this.sendRequest('tools/list', {});

      if (response.tools && Array.isArray(response.tools)) {
        for (const tool of response.tools) {
          this.tools.set(tool.name, tool);
        }
        console.log(`[MCP Client] Discovered ${this.tools.size} tools`);
      }
    } catch (error) {
      console.error('[MCP Client] Failed to discover tools:', error);
    }
  }

  /**
   * Call an MCP tool
   */
  async callTool(toolName: string, params: Record<string, any>): Promise<any> {
    if (!this.connected) {
      throw new Error('MCP Client not connected');
    }

    if (!this.tools.has(toolName)) {
      throw new Error(`Tool not found: ${toolName}`);
    }

    const response = await this.sendRequest('tools/call', {
      name: toolName,
      arguments: params,
    });

    return response.content || response.result;
  }

  /**
   * Get list of available tools
   */
  getAvailableTools(): string[] {
    return Array.from(this.tools.keys());
  }

  /**
   * Get tool schema
   */
  getToolSchema(toolName: string): any {
    return this.tools.get(toolName);
  }

  /**
   * Disconnect from MCP server
   */
  async disconnect(): Promise<void> {
    if (this.process && !this.process.killed) {
      this.process.kill('SIGTERM');
      this.process = null;
      this.connected = false;
      this.tools.clear();
    }
  }

  /**
   * Send JSON-RPC request to server
   */
  private sendRequest(method: string, params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.process || !this.process.stdin) {
        reject(new Error('MCP Server process not available'));
        return;
      }

      const id = ++this.requestId;
      const request = {
        jsonrpc: '2.0',
        id,
        method,
        params,
      };

      // Store pending request
      this.pendingRequests.set(id, { resolve, reject });

      // Send request
      const message = JSON.stringify(request) + '\n';
      this.process.stdin.write(message);

      // Set timeout
      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          reject(new Error(`Request timeout: ${method}`));
        }
      }, 30000); // 30s timeout
    });
  }

  /**
   * Handle messages from MCP server
   */
  private handleServerMessage(data: string): void {
    try {
      // Parse JSON-RPC messages (can be multiple per chunk)
      const lines = data
        .split('\n')
        .filter((line) => line.trim())
        .map((line) => line.trim());

      for (const line of lines) {
        try {
          const message = JSON.parse(line);

          if (message.id !== undefined) {
            // Response to our request
            const pending = this.pendingRequests.get(message.id);
            if (pending) {
              this.pendingRequests.delete(message.id);

              if (message.error) {
                pending.reject(
                  new Error(message.error.message || 'MCP Server error')
                );
              } else {
                pending.resolve(message.result);
              }
            }
          } else if (message.method) {
            // Notification from server
            this.emit('notification', message.method, message.params);
          }
        } catch (parseError) {
          console.error('[MCP Client] Failed to parse message:', line);
        }
      }
    } catch (error) {
      console.error('[MCP Client] Error handling server message:', error);
    }
  }
}

/**
 * MCP Client Pool for managing multiple MCP server connections
 */
export class MCPClientPool {
  private clients: Map<string, RealMCPClient> = new Map();

  /**
   * Add MCP server to pool
   */
  async addServer(
    name: string,
    command: string,
    args: string[]
  ): Promise<void> {
    if (this.clients.has(name)) {
      console.warn(`[MCP Pool] Server already exists: ${name}`);
      return;
    }

    const client = new RealMCPClient(command, args);
    await client.connect();
    this.clients.set(name, client);

    console.log(`[MCP Pool] Added server: ${name}`);
  }

  /**
   * Get client for server
   */
  getClient(name: string): RealMCPClient | undefined {
    return this.clients.get(name);
  }

  /**
   * Call tool on any server that has it
   */
  async callTool(toolName: string, params: Record<string, any>): Promise<any> {
    for (const [serverName, client] of this.clients) {
      if (client.getAvailableTools().includes(toolName)) {
        console.log(`[MCP Pool] Calling ${toolName} on ${serverName}`);
        return await client.callTool(toolName, params);
      }
    }

    throw new Error(`Tool not found in any server: ${toolName}`);
  }

  /**
   * Get all available tools across all servers
   */
  getAllTools(): Map<string, string> {
    const allTools = new Map<string, string>();

    for (const [serverName, client] of this.clients) {
      const tools = client.getAvailableTools();
      for (const toolName of tools) {
        allTools.set(toolName, serverName);
      }
    }

    return allTools;
  }

  /**
   * Disconnect all servers
   */
  async disconnectAll(): Promise<void> {
    const disconnectPromises = Array.from(this.clients.values()).map((client) =>
      client.disconnect()
    );
    await Promise.all(disconnectPromises);
    this.clients.clear();
  }
}
