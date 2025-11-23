# Security Best Practices

Comprehensive security guide for Code-Assistant-Claude.

## Security Architecture

Code-Assistant-Claude implements multi-layered security:

```
Layer 1: Input Validation & Sanitization
Layer 2: PII Tokenization
Layer 3: Sandboxing (Docker/VM/Process)
Layer 4: Audit Logging
Layer 5: Encryption at Rest
```

## PII Tokenization

### What Is PII Tokenization?

Personally Identifiable Information (PII) is automatically detected and replaced with secure tokens before processing.

**Before Tokenization**:
```
User data: {
  name: "John Smith",
  email: "john.smith@example.com",
  ssn: "123-45-6789",
  credit_card: "4532-1234-5678-9010"
}
```

**After Tokenization**:
```
User data: {
  name: "[PII_NAME_a8f3c2]",
  email: "[PII_EMAIL_d9e2b1]",
  ssn: "[PII_SSN_f4a7d9]",
  credit_card: "[PII_CC_b2c8e5]"
}
```

**Benefits**:
- ✅ PII never enters AI context
- ✅ Secure token mapping stored encrypted
- ✅ Automatic detokenization in output
- ✅ Compliance with GDPR, CCPA

### Supported PII Types

- **Personal**: Names, addresses, phone numbers
- **Financial**: Credit cards, bank accounts, SSN
- **Health**: Medical records, health IDs
- **Authentication**: Passwords, API keys, tokens
- **Custom**: Configurable patterns

### Configuration

Enable PII tokenization in `.claude/settings.json`:

```json
{
  "security": {
    "piiTokenization": true,
    "piiTypes": [
      "name",
      "email",
      "phone",
      "ssn",
      "credit_card",
      "api_key",
      "password"
    ],
    "customPatterns": [
      {
        "name": "employee_id",
        "pattern": "EMP-\\d{6}",
        "tokenPrefix": "PII_EMPID"
      }
    ]
  }
}
```

### Custom PII Patterns

Add organization-specific PII:

```json
{
  "security": {
    "customPatterns": [
      {
        "name": "customer_id",
        "pattern": "CUST-[A-Z0-9]{8}",
        "tokenPrefix": "PII_CUSTID"
      },
      {
        "name": "internal_ip",
        "pattern": "10\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}",
        "tokenPrefix": "PII_IP"
      }
    ]
  }
}
```

## Sandboxing

### Sandboxing Levels

#### Process Isolation (Default)
**Security**: Medium
**Performance**: High
**Setup**: Automatic

```json
{
  "security": {
    "sandboxing": "process",
    "processIsolation": {
      "maxMemory": "512M",
      "maxCPU": "50%",
      "timeout": 30000,
      "networkAccess": "restricted"
    }
  }
}
```

**Restrictions**:
- Limited memory and CPU
- Restricted file system access
- Network access controlled
- No root privileges

#### Docker Isolation
**Security**: High
**Performance**: Medium
**Setup**: Requires Docker

```json
{
  "security": {
    "sandboxing": "docker",
    "dockerConfig": {
      "image": "code-assistant-sandbox:latest",
      "networkMode": "none",
      "readOnlyRootfs": true,
      "memory": "512m",
      "cpus": "0.5"
    }
  }
}
```

**Benefits**:
- Complete isolation
- No host access
- Network isolation
- Immutable filesystem

**Setup**:
```bash
# Build sandbox image
docker build -t code-assistant-sandbox:latest .

# Verify isolation
docker run --rm code-assistant-sandbox:latest whoami
# Output: sandbox (not root)
```

#### VM Isolation
**Security**: Maximum
**Performance**: Low
**Setup**: Requires VM

```json
{
  "security": {
    "sandboxing": "vm",
    "vmConfig": {
      "provider": "virtualbox",
      "image": "sandbox-vm",
      "memory": "1024",
      "cpus": 1,
      "network": "isolated"
    }
  }
}
```

**When to Use**:
- Maximum security requirements
- Untrusted code execution
- Compliance requirements (SOC 2, ISO 27001)

### Sandboxing Best Practices

**1. Match Security to Risk**:
- Development: Process isolation
- Production: Docker isolation
- High-security: VM isolation

**2. Restrict Network Access**:
```json
{
  "security": {
    "networkAccess": {
      "allowed": [
        "api.github.com",
        "registry.npmjs.org"
      ],
      "blocked": [
        "*.internal.company.com"
      ]
    }
  }
}
```

**3. Limit File System Access**:
```json
{
  "security": {
    "fileSystem": {
      "allowedPaths": [
        "./src",
        "./tests",
        "./docs"
      ],
      "blockedPaths": [
        ".env",
        ".git",
        "node_modules/.bin"
      ],
      "readOnly": [
        "./config"
      ]
    }
  }
}
```

## Audit Logging

### What Is Logged

All security-relevant operations:

```
2025-01-23 10:15:32 [INFO] Session started: user_123
2025-01-23 10:15:45 [INFO] Skill activated: security-auditor-agent
2025-01-23 10:16:02 [WARN] PII detected: email, tokenized
2025-01-23 10:16:15 [INFO] MCP execution: magic (sandboxed)
2025-01-23 10:16:45 [INFO] File written: src/auth/login.ts
2025-01-23 10:17:10 [ERROR] Sandbox violation: network access denied
2025-01-23 10:17:30 [INFO] Session ended: user_123
```

### Configuration

```json
{
  "security": {
    "auditLogging": true,
    "auditLog": {
      "path": ".claude/logs/audit.log",
      "level": "info",
      "maxSize": "100M",
      "maxFiles": 10,
      "format": "json",
      "includeStackTraces": true
    }
  }
}
```

### Log Levels

- **DEBUG**: Verbose logging (development only)
- **INFO**: Normal operations
- **WARN**: Potential security issues
- **ERROR**: Security violations
- **CRITICAL**: Severe security breaches

### Log Analysis

Search audit logs:

```bash
# Find all PII detections
grep "PII detected" .claude/logs/audit.log

# Find sandbox violations
grep "Sandbox violation" .claude/logs/audit.log

# Find failed authentication
grep "auth.*failed" .claude/logs/audit.log

# Export to CSV for analysis
jq -r '[.timestamp, .level, .message] | @csv' .claude/logs/audit.log > audit.csv
```

### Compliance Integration

Forward logs to compliance systems:

```json
{
  "security": {
    "auditLog": {
      "forwarding": {
        "enabled": true,
        "targets": [
          {
            "type": "syslog",
            "host": "siem.company.com",
            "port": 514,
            "protocol": "tcp"
          },
          {
            "type": "splunk",
            "host": "splunk.company.com",
            "token": "${SPLUNK_TOKEN}"
          }
        ]
      }
    }
  }
}
```

## Secrets Management

### Never Commit Secrets

**❌ Bad**:
```javascript
const API_KEY = "sk-1234567890abcdef";
```

**✅ Good**:
```javascript
const API_KEY = process.env.API_KEY;
```

### Environment Variables

`.env` file (add to `.gitignore`):
```bash
# API Keys
OPENAI_API_KEY=sk-xxxxx
SERPAPI_API_KEY=xxxxx
GITHUB_TOKEN=ghp_xxxxx

# Database
DATABASE_URL=postgresql://user:pass@localhost/db

# Encryption
ENCRYPTION_KEY=xxxxx
```

Load in code:
```javascript
require('dotenv').config();
const apiKey = process.env.OPENAI_API_KEY;
```

### Secret Scanning

Enable automatic secret detection:

```json
{
  "security": {
    "secretScanning": {
      "enabled": true,
      "patterns": [
        "sk-[a-zA-Z0-9]{32}",
        "ghp_[a-zA-Z0-9]{36}",
        "AKIA[A-Z0-9]{16}"
      ],
      "action": "block"
    }
  }
}
```

### Vault Integration

Use HashiCorp Vault or AWS Secrets Manager:

```json
{
  "security": {
    "secretsProvider": {
      "type": "vault",
      "address": "https://vault.company.com",
      "token": "${VAULT_TOKEN}",
      "path": "secret/code-assistant"
    }
  }
}
```

Retrieve secrets:
```javascript
const secrets = await vault.read('secret/code-assistant/api-keys');
const apiKey = secrets.data.openai;
```

## Code Security

### Input Validation

Always validate user input:

**❌ Vulnerable**:
```javascript
app.get('/user', (req, res) => {
  const userId = req.query.id;
  const query = `SELECT * FROM users WHERE id = ${userId}`;
  // SQL Injection vulnerability!
});
```

**✅ Secure**:
```javascript
app.get('/user', (req, res) => {
  const userId = parseInt(req.query.id, 10);
  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }
  const query = 'SELECT * FROM users WHERE id = ?';
  db.query(query, [userId]);
});
```

### OWASP Top 10 Protection

Code-Assistant-Claude automatically checks for:

1. **Injection**: SQL, NoSQL, Command injection
2. **Broken Authentication**: Weak passwords, session management
3. **Sensitive Data Exposure**: Unencrypted data, weak crypto
4. **XML External Entities (XXE)**: XML parsing vulnerabilities
5. **Broken Access Control**: Authorization bypass
6. **Security Misconfiguration**: Default credentials, verbose errors
7. **XSS**: Cross-site scripting
8. **Insecure Deserialization**: Object injection
9. **Using Components with Known Vulnerabilities**: Outdated dependencies
10. **Insufficient Logging & Monitoring**: Missing security logs

### Dependency Scanning

Automatically scan dependencies:

```json
{
  "security": {
    "dependencyScanning": {
      "enabled": true,
      "scanOnInstall": true,
      "scanOnBuild": true,
      "action": "warn",
      "excludePackages": []
    }
  }
}
```

Run manual scan:
```bash
code-assistant-claude security-scan --dependencies
```

## Network Security

### TLS/SSL

Always use HTTPS:

```json
{
  "security": {
    "network": {
      "requireTLS": true,
      "minTLSVersion": "1.2",
      "allowInsecure": false
    }
  }
}
```

### Rate Limiting

Protect against abuse:

```json
{
  "security": {
    "rateLimiting": {
      "enabled": true,
      "maxRequestsPerMinute": 60,
      "maxRequestsPerHour": 1000,
      "blockDuration": 900
    }
  }
}
```

## Compliance

### GDPR Compliance

```json
{
  "compliance": {
    "gdpr": {
      "enabled": true,
      "dataRetention": 90,
      "rightToErasure": true,
      "dataPortability": true,
      "consentRequired": true
    }
  }
}
```

### SOC 2 Compliance

```json
{
  "compliance": {
    "soc2": {
      "enabled": true,
      "auditLogging": true,
      "encryptionAtRest": true,
      "encryptionInTransit": true,
      "accessControl": true,
      "changeManagement": true
    }
  }
}
```

### HIPAA Compliance

```json
{
  "compliance": {
    "hipaa": {
      "enabled": true,
      "phiEncryption": true,
      "auditLogging": true,
      "accessControl": true,
      "dataBackup": true
    }
  }
}
```

## Security Checklist

### Initial Setup
- [ ] Enable PII tokenization
- [ ] Configure sandboxing
- [ ] Enable audit logging
- [ ] Set up secrets management
- [ ] Configure dependency scanning

### Development
- [ ] Never commit secrets
- [ ] Use environment variables
- [ ] Validate all inputs
- [ ] Sanitize outputs
- [ ] Follow OWASP guidelines

### Production
- [ ] Enable Docker/VM sandboxing
- [ ] Forward audit logs to SIEM
- [ ] Enable rate limiting
- [ ] Use TLS 1.2+
- [ ] Regular security audits

### Compliance
- [ ] Enable required compliance modes
- [ ] Configure data retention
- [ ] Document security controls
- [ ] Regular compliance audits

## Security Incident Response

### Detection

Monitor for security events:
```bash
# Real-time monitoring
tail -f .claude/logs/audit.log | grep -E "ERROR|CRITICAL"

# Security alerts
grep "Sandbox violation" .claude/logs/audit.log | mail -s "Security Alert" security@company.com
```

### Response Plan

1. **Identify**: Detect security incident
2. **Contain**: Isolate affected systems
3. **Eradicate**: Remove threat
4. **Recover**: Restore normal operations
5. **Learn**: Update security measures

### Emergency Contacts

Configure in `.claude/settings.json`:
```json
{
  "security": {
    "incidents": {
      "contacts": [
        "security@company.com",
        "oncall@company.com"
      ],
      "escalationThreshold": "ERROR",
      "autoAlert": true
    }
  }
}
```

## Next Steps

- 🔍 [Troubleshooting Guide](10-troubleshooting.md)
- 📚 [Security Configuration Guide](../guides/security-configuration.md)
- 🛡️ [Advanced Security Patterns](../guides/advanced-security.md)

---

**Security Issues?** Report to security team or [GitHub Security](https://github.com/DegrassiAaron/code-assistant-claude/security)
