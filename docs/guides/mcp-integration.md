# MCP Integration Deep Dive

Advanced guide to integrating and developing custom MCP servers.

## Custom MCP Server Development

### Basic MCP Server

```javascript
// my-mcp-server.js
const { MCPServer } = require('@modelcontextprotocol/sdk');

class MyCustomServer extends MCPServer {
  constructor() {
    super({
      name: 'my-custom-server',
      version: '1.0.0'
    });
  }

  async initialize() {
    // Register tools
    this.registerTool('my_tool', {
      description: 'My custom tool',
      parameters: {
        input: { type: 'string', required: true }
      },
      handler: this.handleMyTool.bind(this)
    });
  }

  async handleMyTool(params) {
    // Tool implementation
    return {
      result: `Processed: ${params.input}`,
      tokens: 50
    };
  }
}

const server = new MyCustomServer();
server.start();
```

### Configuration

Add to `.claude/.mcp.json`:

```json
{
  "mcpServers": {
    "my-custom-server": {
      "command": "node",
      "args": ["./my-mcp-server.js"],
      "env": {
        "API_KEY": "${MY_API_KEY}"
      }
    }
  }
}
```

## Advanced Patterns

### Token-Efficient Operations

```javascript
async handleLargeOperation(params) {
  // Process data outside context
  const result = await processLargeDataset(params.data);
  
  // Return summary only
  return {
    result: {
      summary: 'Processed 10,000 records',
      stats: result.stats
    },
    tokens: 100  // vs 50,000 if data in context
  };
}
```

### State Management

```javascript
class StatefulMCPServer extends MCPServer {
  constructor() {
    super({ name: 'stateful' });
    this.cache = new Map();
  }

  async handleWithCache(params) {
    const cached = this.cache.get(params.key);
    if (cached) return { result: cached, cached: true };
    
    const result = await expensiveOperation(params);
    this.cache.set(params.key, result);
    return { result, cached: false };
  }
}
```

## Security Best Practices

1. **Input Validation**: Always validate parameters
2. **Sandboxing**: Run in isolated environment
3. **Timeouts**: Set operation timeouts
4. **Rate Limiting**: Prevent abuse
5. **Audit Logging**: Track all operations

## See Also

- [MCP Integration Guide](../user-guides/06-mcp-integration.md)
- [Security Best Practices](../user-guides/09-security-best-practices.md)
