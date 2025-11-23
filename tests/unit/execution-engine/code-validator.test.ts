import { describe, it, expect, beforeEach } from 'vitest';
import { CodeValidator } from '../../../src/core/execution-engine/security/code-validator';

describe('CodeValidator', () => {
  let validator: CodeValidator;

  beforeEach(() => {
    validator = new CodeValidator();
  });

  it('should block dangerous eval() pattern', async () => {
    const code = 'eval("malicious code");';
    const validation = await validator.validate(code);

    expect(validation.isSecure).toBe(false);
    expect(validation.riskScore).toBeGreaterThan(70);
    expect(validation.requiresApproval).toBe(true);
    expect(validation.issues.length).toBeGreaterThan(0);
    expect(validation.issues[0].severity).toBe('critical');
  });

  it('should block dangerous exec() pattern', async () => {
    const code = 'require("child_process").exec("rm -rf /");';
    const validation = await validator.validate(code);

    expect(validation.isSecure).toBe(false);
    expect(validation.requiresApproval).toBe(true);
  });

  it('should allow safe code', async () => {
    const code = `
      const x = 5 + 3;
      console.log(x);
    `;
    const validation = await validator.validate(code);

    expect(validation.isSecure).toBe(true);
    expect(validation.riskScore).toBeLessThan(30);
    expect(validation.requiresApproval).toBe(false);
  });

  it('should detect suspicious patterns with lower severity', async () => {
    const code = `
      const data = await fetch('https://api.example.com/data');
    `;
    const validation = await validator.validate(code);

    // fetch() is suspicious but not critical
    expect(validation.issues.some(i => i.type === 'suspicious_pattern')).toBe(true);
  });

  it('should calculate correct risk score', async () => {
    const code = `
      eval('x'); // Critical
      fetch('url'); // Suspicious
    `;
    const validation = await validator.validate(code);

    expect(validation.riskScore).toBeGreaterThan(50);
  });

  it('should handle concurrent validations without race conditions', async () => {
    const code1 = 'const x = 1;';
    const code2 = 'eval("test");';
    const code3 = 'const y = 2;';

    // Create multiple concurrent validation requests
    const promises = [
      validator.validate(code1),
      validator.validate(code2),
      validator.validate(code3),
      validator.validate(code1),
      validator.validate(code2),
    ];

    // All should complete successfully
    const results = await Promise.all(promises);

    // Verify results are consistent
    expect(results[0].isSecure).toBe(true);
    expect(results[1].isSecure).toBe(false);
    expect(results[2].isSecure).toBe(true);
    expect(results[3].isSecure).toBe(true);
    expect(results[4].isSecure).toBe(false);
  });

  it('should handle 100+ concurrent validations', async () => {
    const safeCode = 'const x = 1;';
    const dangerousCode = 'eval("test");';

    // Create 100+ concurrent validation requests
    const promises = [];
    for (let i = 0; i < 120; i++) {
      const code = i % 2 === 0 ? safeCode : dangerousCode;
      promises.push(validator.validate(code));
    }

    // All should complete successfully
    const results = await Promise.all(promises);

    // Verify we got 120 results
    expect(results.length).toBe(120);

    // Verify even indices (safe code) are secure
    for (let i = 0; i < 120; i += 2) {
      expect(results[i].isSecure).toBe(true);
    }

    // Verify odd indices (dangerous code) are not secure
    for (let i = 1; i < 120; i += 2) {
      expect(results[i].isSecure).toBe(false);
    }
  });
});
