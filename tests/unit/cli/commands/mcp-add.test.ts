import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EventEmitter } from 'events';
import path from 'path';
import { promises as fs } from 'fs';
import { spawn } from 'child_process';
import inquirer from 'inquirer';

import { __testing } from '../../../../src/cli/commands/mcp-add';

const {
  parseArguments,
  validateScriptPath,
  MCPClient,
  CONFIG,
} = __testing;

vi.mock('child_process');
vi.mock('inquirer');

function createMockProcess() {
  const proc = new EventEmitter() as any;
  proc.stdin = { write: vi.fn() };
  proc.stdout = new EventEmitter();
  proc.stderr = new EventEmitter();
  proc.kill = vi.fn();
  // Ensure listener helpers exist
  proc.removeListener = proc.removeListener?.bind(proc);
  proc.on = proc.addListener;
  return proc;
}

describe('mcp-add helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('parseArguments handles quoted strings and spaces', () => {
    const args = parseArguments('--path "/Users/My Folder/server.js" arg2');
    expect(args).toEqual(['--path', '/Users/My Folder/server.js', 'arg2']);
  });

  it('validateScriptPath rejects paths outside the project', async () => {
    await expect(
      validateScriptPath(path.resolve('..', '..', 'etc', 'passwd'))
    ).rejects.toThrow('Script path must be within project directory');
  });

  it('validateScriptPath resolves existing file inside project', async () => {
    const tmpPath = path.join(process.cwd(), 'tmp-validate-script.txt');
    await fs.writeFile(tmpPath, 'ok');

    const resolved = await validateScriptPath(tmpPath);
    expect(resolved).toBe(path.resolve(tmpPath));

    await fs.unlink(tmpPath);
  });

  it('MCPClient connects once a valid JSON-RPC line arrives', async () => {
    const mockProcess = createMockProcess();
    vi.mocked(spawn).mockReturnValue(mockProcess as any);

    const client = new MCPClient('node', ['server.js'], {});
    const connectPromise = client.connect();

    mockProcess.stdout.emit(
      'data',
      Buffer.from('{"jsonrpc":"2.0","id":1,"result":{}}\n')
    );

    await expect(connectPromise).resolves.toBeUndefined();
    expect(spawn).toHaveBeenCalledWith(
      'node',
      ['server.js'],
      expect.objectContaining({ env: expect.any(Object) })
    );
  });

  it('listTools sends request and maps tool schemas', async () => {
    const mockProcess = createMockProcess();
    vi.mocked(spawn).mockReturnValue(mockProcess as any);

    const client = new MCPClient('node', ['server.js'], {});
    const connectPromise = client.connect();
    mockProcess.stdout.emit(
      'data',
      Buffer.from('{"jsonrpc":"2.0","id":99,"result":{}}\n')
    );
    await connectPromise;

    const toolsPromise = client.listTools();

    const response = {
      jsonrpc: '2.0',
      id: 1,
      result: {
        tools: [
          {
            name: 'hello',
            description: 'greets',
            inputSchema: {
              type: 'object',
              properties: { name: { type: 'string', description: 'who' } },
              required: ['name'],
            },
            outputSchema: { type: 'string', description: 'greeting' },
          },
        ],
      },
    };

    mockProcess.stdout.emit('data', Buffer.from(JSON.stringify(response) + '\n'));

    const tools = await toolsPromise;
    expect(tools).toEqual([
      {
        name: 'hello',
        description: 'greets',
        parameters: [
          { name: 'name', type: 'string', description: 'who', required: true },
        ],
        returns: { type: 'string', description: 'greeting' },
      },
    ]);
    expect(mockProcess.stdin.write).toHaveBeenCalledWith(
      expect.stringContaining('"method":"tools/list"')
    );
  });

  it('request rejects on timeout', async () => {
    vi.useFakeTimers();
    const mockProcess = createMockProcess();
    vi.mocked(spawn).mockReturnValue(mockProcess as any);

    const client = new MCPClient('node', ['server.js'], {});
    const connectPromise = client.connect();
    mockProcess.stdout.emit(
      'data',
      Buffer.from('{"jsonrpc":"2.0","id":42,"result":{}}\n')
    );
    await connectPromise;

    const promise = client.listTools();
    vi.advanceTimersByTime(CONFIG.REQUEST_TIMEOUT_MS + 1);

    await expect(promise).rejects.toThrow('Request timeout');
  });

  it('connect rejects when stdout exceeds buffer limit', async () => {
    const mockProcess = createMockProcess();
    vi.mocked(spawn).mockReturnValue(mockProcess as any);

    const client = new MCPClient('node', ['server.js'], {});
    const promise = client.connect();

    mockProcess.stdout.emit('data', Buffer.alloc(CONFIG.MAX_BUFFER_SIZE + 1));

    await expect(promise).rejects.toThrow('Buffer overflow');
  });
});
