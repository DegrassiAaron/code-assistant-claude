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
});
