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

  it('should detokenize correctly', () => {
    const original = 'Contact john@example.com';
    const tokenized = tokenizer.tokenize(original);
    const detokenized = tokenizer.detokenize(tokenized);

    expect(detokenized).toBe(original);
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
    tokenizer.tokenize('john@example.com and 555-1234');
    const counts = tokenizer.getTokenCountByType();

    expect(counts.email).toBe(1);
    expect(counts.phone).toBe(1);
  });
});
