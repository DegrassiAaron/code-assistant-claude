import { describe, it, expect, beforeEach } from 'vitest';
import { PIITokenizer } from '../../../src/core/execution-engine/security/pii-tokenizer';

describe('PIITokenizer', () => {
  let tokenizer: PIITokenizer;

  beforeEach(() => {
    tokenizer = new PIITokenizer();
  });

  it('should tokenize email addresses', () => {
    const text = 'Contact john@example.com for details';
    const tokenized = tokenizer.tokenize(text);

    expect(tokenized).toContain('[EMAIL_1]');
    expect(tokenized).not.toContain('john@example.com');
  });

  it('should tokenize phone numbers', () => {
    const text = 'Call me at (555) 123-4567';
    const tokenized = tokenizer.tokenize(text);

    expect(tokenized).toContain('[PHONE_1]');
    expect(tokenized).not.toContain('555');
  });

  it('should tokenize credit card numbers', () => {
    const text = 'Card: 1234 5678 9012 3456';
    const tokenized = tokenizer.tokenize(text);

    expect(tokenized).toContain('[CREDIT_CARD_1]');
    expect(tokenized).not.toContain('1234 5678 9012 3456');
  });

  it('should tokenize SSN', () => {
    const text = 'SSN: 123-45-6789';
    const tokenized = tokenizer.tokenize(text);

    expect(tokenized).toContain('[SSN_1]');
    expect(tokenized).not.toContain('123-45-6789');
  });


  it('should detect PII presence', () => {
    expect(tokenizer.containsPII('john@example.com')).toBe(true);
    expect(tokenizer.containsPII('555-123-4567')).toBe(true);
    expect(tokenizer.containsPII('Hello world')).toBe(false);
  });

  it('should handle multiple occurrences', () => {
    const text = 'Email: john@example.com and jane@example.com';
    const tokenized = tokenizer.tokenize(text);

    expect(tokenized).toContain('[EMAIL_1]');
    expect(tokenized).toContain('[EMAIL_2]');
  });

  it('should track token counts by type', () => {
    tokenizer.tokenize('john@example.com and (555) 123-4567');
    const counts = tokenizer.getTokenCountByType();

    expect(counts.email).toBe(1);
    expect(counts.phone).toBe(1);
  });

  describe('Security: PII Storage Validation', () => {
    it('should not store plaintext PII in memory', () => {
      const sensitiveEmail = 'secret@example.com';
      const sensitivePhone = '555-123-4567';
      const sensitiveSSN = '123-45-6789';

      tokenizer.tokenize(`Contact ${sensitiveEmail} at ${sensitivePhone}, SSN: ${sensitiveSSN}`);

      // Convert tokenizer object to string to inspect memory
      const tokenizerString = JSON.stringify(tokenizer);

      // Verify plaintext values are NOT present in the object
      expect(tokenizerString).not.toContain(sensitiveEmail);
      expect(tokenizerString).not.toContain(sensitivePhone);
      expect(tokenizerString).not.toContain(sensitiveSSN);
    });

    it('should only store hashed values, not plaintext', () => {
      const sensitiveData = 'user@private.com';
      tokenizer.tokenize(sensitiveData);

      const tokens = tokenizer.getTokens();

      // Verify tokens contain hashed values but not plaintext
      expect(tokens.length).toBeGreaterThan(0);
      expect(tokens[0].hashedValue).toBeDefined();
      expect(tokens[0].hashedValue).not.toBe(sensitiveData);

      // Hash should be a hex string (SHA-256 produces 64 char hex)
      expect(tokens[0].hashedValue).toMatch(/^[a-f0-9]{64}$/);
    });

    it('should not expose plaintext through any public methods', () => {
      const sensitiveCC = '1234 5678 9012 3456';
      tokenizer.tokenize(sensitiveCC);

      // Check that the tokenizer instance doesn't have a reverseMap property
      expect((tokenizer as any).reverseMap).toBeUndefined();

      // Verify no detokenize method exists
      expect((tokenizer as any).detokenize).toBeUndefined();
    });

    it('should maintain tokenization without plaintext storage', () => {
      const text1 = 'Email: test@example.com';
      const text2 = 'Email: test@example.com again';

      const tokenized1 = tokenizer.tokenize(text1);
      const tokenized2 = tokenizer.tokenize(text2);

      // Same email should produce same token (via hash lookup)
      expect(tokenized1).toContain('[EMAIL_1]');
      expect(tokenized2).toContain('[EMAIL_1]');

      // But plaintext should never be stored
      const tokenizerString = JSON.stringify(tokenizer);
      expect(tokenizerString).not.toContain('test@example.com');
    });
  });
});
