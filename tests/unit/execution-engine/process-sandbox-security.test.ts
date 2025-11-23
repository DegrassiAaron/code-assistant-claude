import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ProcessSandbox } from '../../../src/core/execution-engine/sandbox/process-sandbox';
import { SandboxConfig } from '../../../src/core/execution-engine/types';

describe('ProcessSandbox Security - Environment Variable Protection', () => {
  let sandbox: ProcessSandbox;
  const defaultConfig: SandboxConfig = {
    type: 'process',
    resourceLimits: {
      timeout: 5000,
      memory: '512M',
      cpu: '1.0'
    }
  };

  beforeEach(() => {
    sandbox = new ProcessSandbox(defaultConfig);

    // Set sensitive environment variables to simulate production environment
    process.env.AWS_ACCESS_KEY_ID = 'AKIA_TEST_KEY_12345';
    process.env.AWS_SECRET_ACCESS_KEY = 'secret_test_key_super_secret_123';
    process.env.DATABASE_PASSWORD = 'supersecret_db_password';
    process.env.DATABASE_URL = 'postgresql://user:secret@localhost:5432/db';
    process.env.STRIPE_SECRET_KEY = 'sk_test_123456789';
    process.env.GITHUB_TOKEN = 'ghp_test_token_123';
    process.env.API_KEY = 'api_key_test_123';
    process.env.JWT_SECRET = 'jwt_secret_for_auth';
    process.env.OPENAI_API_KEY = 'sk-test-openai-key';
  });

  afterEach(() => {
    // Cleanup sensitive environment variables
    delete process.env.AWS_ACCESS_KEY_ID;
    delete process.env.AWS_SECRET_ACCESS_KEY;
    delete process.env.DATABASE_PASSWORD;
    delete process.env.DATABASE_URL;
    delete process.env.STRIPE_SECRET_KEY;
    delete process.env.GITHUB_TOKEN;
    delete process.env.API_KEY;
    delete process.env.JWT_SECRET;
    delete process.env.OPENAI_API_KEY;
  });

  it('should NOT expose AWS credentials', async () => {
    const code = `
import os
import json

hasAWSKey = 'AWS_ACCESS_KEY_ID' in os.environ
hasAWSSecret = 'AWS_SECRET_ACCESS_KEY' in os.environ
print(json.dumps({'hasAWSKey': hasAWSKey, 'hasAWSSecret': hasAWSSecret}))
`;

    const result = await sandbox.execute(code, 'python');

    expect(result.success).toBe(true);
    expect(result.output).toBeTruthy();
    expect(result.output).toContain('"hasAWSKey": false');
    expect(result.output).toContain('"hasAWSSecret": false');
  });

  it('should NOT expose database credentials', async () => {
    const code = `
import os
import json

hasDBPassword = 'DATABASE_PASSWORD' in os.environ
hasDBUrl = 'DATABASE_URL' in os.environ
print(json.dumps({'hasDBPassword': hasDBPassword, 'hasDBUrl': hasDBUrl}))
`;

    const result = await sandbox.execute(code, 'python');

    expect(result.success).toBe(true);
    expect(result.output).toContain('"hasDBPassword": false');
    expect(result.output).toContain('"hasDBUrl": false');
  });

  it('should NOT expose API keys and tokens', async () => {
    const code = `
import os
import json

hasStripeKey = 'STRIPE_SECRET_KEY' in os.environ
hasGitHubToken = 'GITHUB_TOKEN' in os.environ
hasAPIKey = 'API_KEY' in os.environ
hasOpenAIKey = 'OPENAI_API_KEY' in os.environ
print(json.dumps({
    'hasStripeKey': hasStripeKey,
    'hasGitHubToken': hasGitHubToken,
    'hasAPIKey': hasAPIKey,
    'hasOpenAIKey': hasOpenAIKey
}))
`;

    const result = await sandbox.execute(code, 'python');

    expect(result.success).toBe(true);
    expect(result.output).toContain('"hasStripeKey": false');
    expect(result.output).toContain('"hasGitHubToken": false');
    expect(result.output).toContain('"hasAPIKey": false');
    expect(result.output).toContain('"hasOpenAIKey": false');
  });

  it('should NOT expose JWT secrets', async () => {
    const code = `
import os
import json

hasJWTSecret = 'JWT_SECRET' in os.environ
print(json.dumps({'hasJWTSecret': hasJWTSecret}))
`;

    const result = await sandbox.execute(code, 'python');

    expect(result.success).toBe(true);
    expect(result.output).toContain('"hasJWTSecret": false');
  });

  it('should NOT expose any secret-like variables', async () => {
    const code = `
import os
import json
import re

pattern = re.compile(r'KEY|SECRET|TOKEN|PASSWORD|CREDENTIAL|AUTH', re.IGNORECASE)
secrets = [key for key in os.environ.keys() if pattern.search(key)]
print(json.dumps({'count': len(secrets), 'secrets': secrets}))
`;

    const result = await sandbox.execute(code, 'python');

    expect(result.success).toBe(true);
    const parsed = JSON.parse(result.output!.trim());
    expect(parsed.count).toBe(0);
    expect(parsed.secrets).toEqual([]);
  });

  it('should ONLY expose whitelisted safe variables', async () => {
    const code = `
import os
import json

env = os.environ
all_keys = list(env.keys())
print(json.dumps({
    'hasNodeEnv': 'NODE_ENV' in env,
    'hasPath': 'PATH' in env,
    'hasAWS': 'AWS_ACCESS_KEY_ID' in env,
    'hasDB': 'DATABASE_PASSWORD' in env,
    'totalKeys': len(all_keys),
    'keys': sorted(all_keys)
}))
`;

    const result = await sandbox.execute(code, 'python');

    expect(result.success).toBe(true);
    const parsed = JSON.parse(result.output!.trim());

    // Safe variables should be present
    expect(parsed.hasNodeEnv).toBe(true);
    expect(parsed.hasPath).toBe(true);

    // Secrets should NOT be present
    expect(parsed.hasAWS).toBe(false);
    expect(parsed.hasDB).toBe(false);

    // Should have very limited set of variables (whitelisted only)
    expect(parsed.totalKeys).toBeLessThan(10);
  });

  it('should prevent credential exfiltration attempts', async () => {
    const maliciousCode = `
import os
import json
import re

# Attempt to collect all credentials
credentials = {}
pattern = re.compile(r'KEY|SECRET|TOKEN|PASSWORD', re.IGNORECASE)

for key in os.environ.keys():
    if pattern.search(key):
        credentials[key] = os.environ[key]

# Report what was found (will be empty if security works)
print(json.dumps({
    'attemptedExfiltration': len(credentials),
    'found': list(credentials.keys())
}))
`;

    const result = await sandbox.execute(maliciousCode, 'python');

    expect(result.success).toBe(true);
    const parsed = JSON.parse(result.output!.trim());

    // No credentials should be found
    expect(parsed.attemptedExfiltration).toBe(0);
    expect(parsed.found).toEqual([]);
  });

  it('should not leak credentials through direct access attempts', async () => {
    const code = `
import os
import json

# Try to access various secret variables directly
attempts = {
    'aws_key': os.environ.get('AWS_ACCESS_KEY_ID'),
    'aws_secret': os.environ.get('AWS_SECRET_ACCESS_KEY'),
    'db_pass': os.environ.get('DATABASE_PASSWORD'),
    'stripe': os.environ.get('STRIPE_SECRET_KEY'),
    'github': os.environ.get('GITHUB_TOKEN'),
    'api_key': os.environ.get('API_KEY')
}

# Count how many are None (should be all)
none_count = sum(1 for v in attempts.values() if v is None)
total_attempts = len(attempts)

print(json.dumps({
    'noneCount': none_count,
    'totalAttempts': total_attempts,
    'allNone': none_count == total_attempts
}))
`;

    const result = await sandbox.execute(code, 'python');

    expect(result.success).toBe(true);
    const parsed = JSON.parse(result.output!.trim());

    // All credential access attempts should return None
    expect(parsed.allNone).toBe(true);
    expect(parsed.noneCount).toBe(parsed.totalAttempts);
  });

  it('should maintain safe variables like PATH and NODE_ENV', async () => {
    const code = `
import os
import json

print(json.dumps({
    'hasNodeEnv': 'NODE_ENV' in os.environ,
    'nodeEnvValue': os.environ.get('NODE_ENV'),
    'hasPath': 'PATH' in os.environ,
    'pathIsDefined': bool(os.environ.get('PATH'))
}))
`;

    const result = await sandbox.execute(code, 'python');

    expect(result.success).toBe(true);
    const parsed = JSON.parse(result.output!.trim());

    // These safe variables should be present
    expect(parsed.hasNodeEnv).toBe(true);
    expect(parsed.nodeEnvValue).toBe('sandbox');
    expect(parsed.hasPath).toBe(true);
    expect(parsed.pathIsDefined).toBe(true);
  });

  it('should use sandbox-specific HOME and TMPDIR directories', async () => {
    const code = `
import os
import json

home = os.environ.get('HOME', '')
tmpdir = os.environ.get('TMPDIR', '')

print(json.dumps({
    'home': home,
    'tmpdir': tmpdir,
    'homeSame': home == tmpdir,
    'homeIsTmp': home.startswith('/tmp/'),
    'tmpdirIsTmp': tmpdir.startswith('/tmp/')
}))
`;

    const result = await sandbox.execute(code, 'python');

    expect(result.success).toBe(true);
    const parsed = JSON.parse(result.output!.trim());

    // Both HOME and TMPDIR should point to the sandbox temp directory
    expect(parsed.homeSame).toBe(true);
    expect(parsed.homeIsTmp).toBe(true);
    expect(parsed.tmpdirIsTmp).toBe(true);
  });

  it('should allow custom safe environment variables', async () => {
    process.env.CUSTOM_SAFE_VAR = 'test_value_123';
    process.env.MY_CONFIG = 'config_value';

    const customConfig: SandboxConfig = {
      ...defaultConfig,
      allowedEnvVars: ['CUSTOM_SAFE_VAR', 'MY_CONFIG']
    };

    const customSandbox = new ProcessSandbox(customConfig);

    const code = `
import os
import json

print(json.dumps({
    'hasCustomVar': 'CUSTOM_SAFE_VAR' in os.environ,
    'customVarValue': os.environ.get('CUSTOM_SAFE_VAR'),
    'hasMyConfig': 'MY_CONFIG' in os.environ,
    'myConfigValue': os.environ.get('MY_CONFIG')
}))
`;

    const result = await customSandbox.execute(code, 'python');

    expect(result.success).toBe(true);
    const parsed = JSON.parse(result.output!.trim());

    // Custom allowed variables should be accessible
    expect(parsed.hasCustomVar).toBe(true);
    expect(parsed.customVarValue).toBe('test_value_123');
    expect(parsed.hasMyConfig).toBe(true);
    expect(parsed.myConfigValue).toBe('config_value');

    // Cleanup
    delete process.env.CUSTOM_SAFE_VAR;
    delete process.env.MY_CONFIG;
  });

  it('should reject dangerous custom environment variables', async () => {
    const dangerousConfigs = [
      { allowedEnvVars: ['MY_API_KEY'] },
      { allowedEnvVars: ['DATABASE_SECRET'] },
      { allowedEnvVars: ['AUTH_TOKEN'] },
      { allowedEnvVars: ['MY_PASSWORD'] },
      { allowedEnvVars: ['SERVICE_CREDENTIAL'] }
    ];

    for (const config of dangerousConfigs) {
      const dangerousSandbox = new ProcessSandbox({
        ...defaultConfig,
        ...config
      });

      const code = `print("test")`;

      const result = await dangerousSandbox.execute(code, 'python');

      // Execution should fail with security error
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/Security Error: Refusing to expose potentially sensitive variable/);
    }
  });

  it('should not leak host HOME directory path', async () => {
    const hostHome = process.env.HOME || '/home/user';

    const code = `
import os
import json

sandbox_home = os.environ.get('HOME', '')

print(json.dumps({
    'sandboxHome': sandbox_home,
    'isHostHome': sandbox_home == '${hostHome}',
    'containsUser': 'user' in sandbox_home.lower() if sandbox_home else False
}))
`;

    const result = await sandbox.execute(code, 'python');

    expect(result.success).toBe(true);
    const parsed = JSON.parse(result.output!.trim());

    // Sandbox HOME should NOT be the host HOME directory
    expect(parsed.isHostHome).toBe(false);
  });
});
