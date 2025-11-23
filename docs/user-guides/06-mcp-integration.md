# MCP Integration Guide

Complete guide to Model Context Protocol (MCP) servers in Code-Assistant-Claude.

## What is MCP?

Model Context Protocol (MCP) is a standardized protocol that allows Claude to execute code and operations outside its context window, achieving **98.7% token reduction**.

### Key Benefits

- ✅ **98.7% Token Reduction**: Code generated via MCP doesn't consume context
- ✅ **Real Execution**: Actual code execution with real results
- ✅ **Security**: Sandboxed execution environment
- ✅ **Extensibility**: Add custom MCP servers for specific needs

## Core MCP Servers

### 1. magic
**Purpose**: Code generation and execution

**Capabilities**:
- Generate code without consuming context
- Execute code in sandboxed environment
- Return results to Claude
- File system operations

**Token Savings**: 98.7%

**Example**:
```
You: Create a React component for user authentication

Claude: [Using magic MCP]
        Generated: LoginForm.tsx (via MCP)
        Token usage: 680 (vs 52,000 traditional)
        Savings: 98.7% ✅
```

### 2. serena
**Purpose**: Token compression and optimization

**Capabilities**:
- Intelligent text compression
- Symbol substitution
- Template optimization
- Context summarization

**Token Savings**: 30-50%

**Example**:
```
Before: "The authentication service should validate user credentials and return
a JSON Web Token if successful, otherwise return an error message"
(22 tokens)

After: "Auth svc validates creds → JWT if ✅, else error"
(11 tokens)

Savings: 50%
```

### 3. sequential
**Purpose**: Workflow automation and chaining

**Capabilities**:
- Multi-step workflows
- Conditional execution
- Result passing between steps
- Error handling

**Example**:
```
Workflow: Build → Test → Deploy

Step 1: npm run build
Step 2: npm test (only if build succeeds)
Step 3: npm run deploy (only if tests pass)

All executed via MCP, minimal token usage
```

## Tech-Specific MCPs

### playwright
**For**: Frontend testing

**Capabilities**:
- Browser automation
- E2E test execution
- Visual regression testing
- Accessibility testing

**Setup**:
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-playwright"],
      "env": {
        "PLAYWRIGHT_BROWSERS_PATH": "0"
      }
    }
  }
}
```

**Example**:
```
You: Create E2E test for login flow

Claude: [Using playwright MCP]
        Generated: login.spec.ts
        Executed: E2E tests
        Result: All tests passed ✅
        Token usage: 1,200
```

### serpapi
**For**: Web search and data retrieval

**Capabilities**:
- Google search integration
- Structured data extraction
- Market research
- Competitor analysis

**Setup**:
```json
{
  "mcpServers": {
    "serpapi": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-serpapi"],
      "env": {
        "SERPAPI_KEY": "${SERPAPI_API_KEY}"
      }
    }
  }
}
```

**Example**:
```
You: Research competitors in the authentication SaaS space

Claude: [Using serpapi MCP]
        Found: Auth0, Okta, Firebase Auth, AWS Cognito
        [Detailed analysis follows]
        Token usage: 3,400
```

## Configuration

### Basic Setup

`.claude/.mcp.json`:
```json
{
  "mcpServers": {
    "magic": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-magic"],
      "disabled": false
    },
    "serena": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-serena"],
      "disabled": false
    },
    "sequential": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential"],
      "disabled": false
    }
  }
}
```

### Advanced Configuration

```json
{
  "mcpServers": {
    "magic": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-magic"],
      "env": {
        "MAX_FILE_SIZE": "10485760",
        "ALLOWED_EXTENSIONS": "ts,tsx,js,jsx,json"
      },
      "timeout": 30000,
      "retries": 3,
      "disabled": false
    }
  }
}
```

### Environment Variables

Create `.env`:
```bash
# MCP Configuration
SERPAPI_API_KEY=your_key_here
MAX_MCP_TIMEOUT=30000
MCP_SANDBOX_MODE=process

# Security
ALLOWED_MCP_COMMANDS=npx,node,python3
BLOCKED_FILE_PATTERNS=.env,.git,node_modules
```

## Custom MCP Servers

### Creating a Custom Server

1. **Create server file**: `my-mcp-server.js`
```javascript
const { MCPServer } = require('@modelcontextprotocol/sdk');

class MyCustomServer extends MCPServer {
  async handleRequest(request) {
    // Custom logic
    return {
      result: 'Custom result',
      tokens: 100
    };
  }
}

const server = new MyCustomServer();
server.start();
```

2. **Add to configuration**:
```json
{
  "mcpServers": {
    "my-custom-server": {
      "command": "node",
      "args": ["./my-mcp-server.js"],
      "env": {}
    }
  }
}
```

3. **Use in Claude**:
```
You: Use my custom server to process data

Claude: [Using my-custom-server MCP]
        Result: [Custom processing]
```

## Security

### Sandboxing

MCP servers run in isolated environments:

**Process Isolation** (Default):
```json
{
  "security": {
    "sandboxing": "process",
    "allowedCommands": ["npx", "node"],
    "maxMemory": "512M",
    "maxCPU": "50%"
  }
}
```

**Docker Isolation** (Recommended for production):
```json
{
  "security": {
    "sandboxing": "docker",
    "dockerImage": "mcp-sandbox:latest",
    "networkIsolation": true,
    "readOnlyFileSystem": false
  }
}
```

### Access Control

Restrict MCP operations:

```json
{
  "security": {
    "mcp": {
      "allowedOperations": ["read", "write", "execute"],
      "blockedPaths": [".env", ".git", "node_modules"],
      "maxFileSize": 10485760,
      "allowedExtensions": ["ts", "js", "json", "md"]
    }
  }
}
```

### Audit Logging

Track all MCP operations:

```json
{
  "security": {
    "auditLogging": true,
    "auditLogPath": ".claude/logs/mcp-audit.log",
    "logLevel": "info"
  }
}
```

## Token Savings Analysis

### Traditional Approach
```
Request: "Create a React component for user login"

Claude generates code in context:
- Component code: 1,200 tokens
- Props types: 300 tokens
- Styles: 400 tokens
- Tests: 1,500 tokens
- Documentation: 600 tokens
Total: 4,000 tokens consumed
```

### MCP Approach
```
Request: "Create a React component for user login"

Claude uses magic MCP:
- Request to MCP: 50 tokens
- MCP generates code: 0 tokens (external)
- Result confirmation: 80 tokens
Total: 130 tokens consumed

Savings: 96.75% ✅
```

### Real-World Example

**Task**: Implement complete authentication system

**Traditional**:
```
- Login component: 4,000 tokens
- Register component: 3,500 tokens
- Password reset: 2,800 tokens
- Auth service: 3,200 tokens
- Tests: 5,000 tokens
- Documentation: 2,500 tokens
Total: 21,000 tokens
```

**With MCP**:
```
- Requests to MCP: 200 tokens
- Coordination: 300 tokens
- Reviews: 180 tokens
Total: 680 tokens

Savings: 96.8% ✅
```

## Troubleshooting

### MCP Server Not Found

**Symptom**: "MCP server 'magic' not found"

**Solution**:
```bash
# Manually install MCP server
npx -y @modelcontextprotocol/server-magic

# Verify installation
which npx
npx --version
```

### Timeout Errors

**Symptom**: "MCP request timeout"

**Solution**: Increase timeout in `.mcp.json`:
```json
{
  "mcpServers": {
    "magic": {
      "timeout": 60000  // Increase to 60 seconds
    }
  }
}
```

### Permission Denied

**Symptom**: "Permission denied: cannot execute MCP command"

**Solution**: Check security settings:
```json
{
  "security": {
    "allowedCommands": ["npx", "node", "python3"]
  }
}
```

### Network Errors

**Symptom**: "Cannot connect to MCP server"

**Solution**:
```bash
# Check network connectivity
curl -I https://registry.npmjs.org

# Check firewall settings
# Allow outbound connections on required ports
```

## Best Practices

### 1. Use MCP for Code Generation
Let MCP handle code generation to save tokens:
- ✅ Good: "Create a login component"
- ❌ Wasteful: "Show me the code for a login component"

### 2. Combine Multiple Operations
Batch related operations in single MCP call:
- ✅ Good: "Create login component with tests and styles"
- ❌ Less efficient: Three separate MCP calls

### 3. Monitor MCP Usage
Track MCP performance:
```
/sc:optimize-tokens --detailed
```

### 4. Secure MCP Configuration
- Use environment variables for secrets
- Enable sandboxing
- Restrict file access
- Enable audit logging

### 5. Update MCP Servers
```bash
# Update all MCP servers
npx -y @modelcontextprotocol/server-magic@latest
npx -y @modelcontextprotocol/server-serena@latest
```

## Advanced Usage

### Chaining MCP Operations

```
sequential MCP:
1. magic → Generate code
2. serena → Compress documentation
3. playwright → Run E2E tests
4. magic → Deploy if tests pass
```

### Conditional MCP Execution

```
if (code_review_passed) {
  magic.deploy()
} else {
  magic.rollback()
}
```

### Parallel MCP Operations

```
Parallel execution:
- magic: Generate frontend
- magic: Generate backend (separate instance)
- serena: Compress docs
All complete in parallel, minimal token usage
```

## Performance Optimization

### Caching

Enable MCP response caching:
```json
{
  "performance": {
    "mcpCaching": {
      "enabled": true,
      "ttl": 3600,
      "maxSize": "100M"
    }
  }
}
```

### Connection Pooling

Reuse MCP connections:
```json
{
  "performance": {
    "mcpConnectionPool": {
      "minConnections": 2,
      "maxConnections": 10,
      "idleTimeout": 30000
    }
  }
}
```

## Next Steps

- 🤖 [Agents Guide](07-agents-guide.md)
- 💾 [Token Optimization Guide](08-token-optimization.md)
- 🛡️ [Security Best Practices](09-security-best-practices.md)
- 📚 [Advanced MCP Integration](../guides/mcp-integration.md)

---

**Need Help?** See [Troubleshooting Guide](10-troubleshooting.md)
