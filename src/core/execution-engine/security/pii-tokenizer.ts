import crypto from 'crypto';
import { PIIToken } from '../types';

/**
 * Tokenizes PII data for privacy protection
 * Converts sensitive data to tokens like [EMAIL_1], [PHONE_1]
 */
export class PIITokenizer {
  private tokenMap: Map<string, PIIToken> = new Map();
  private counters: Map<string, number> = new Map();

  /**
   * Tokenize text containing PII
   */
  tokenize(text: string): string {
    let tokenized = text;

    // Tokenize emails
    tokenized = tokenized.replace(
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      (email) => this.getOrCreateToken(email, 'email')
    );

    // Tokenize phone numbers (various formats)
    tokenized = tokenized.replace(
      /\b(\+\d{1,3}[-.]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
      (phone) => this.getOrCreateToken(phone, 'phone')
    );

    // Tokenize credit cards (various formats)
    tokenized = tokenized.replace(
      /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g,
      (cc) => this.getOrCreateToken(cc, 'credit_card')
    );

    // Tokenize SSN (US format)
    tokenized = tokenized.replace(
      /\b\d{3}-\d{2}-\d{4}\b/g,
      (ssn) => this.getOrCreateToken(ssn, 'ssn')
    );

    // Tokenize common name patterns (simplified)
    // This is a basic implementation - real-world would use NER
    tokenized = this.tokenizeNames(tokenized);

    return tokenized;
  }


  /**
   * Check if text contains PII
   */
  containsPII(text: string): boolean {
    // Quick regex checks
    const piiPatterns = [
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email
      /\b(\+\d{1,3}[-.]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/, // Phone
      /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/, // Credit card
      /\b\d{3}-\d{2}-\d{4}\b/, // SSN
    ];

    return piiPatterns.some(pattern => pattern.test(text));
  }

  /**
   * Get or create token for PII value
   */
  private getOrCreateToken(value: string, type: PIIToken['type']): string {
    const hash = this.hash(value);

    // Check if already tokenized
    if (this.tokenMap.has(hash)) {
      return this.tokenMap.get(hash)!.token;
    }

    // Create new token
    const counter = (this.counters.get(type) || 0) + 1;
    this.counters.set(type, counter);

    const token = `[${type.toUpperCase()}_${counter}]`;

    const piiToken: PIIToken = {
      token,
      type,
      hashedValue: hash
    };

    this.tokenMap.set(hash, piiToken);

    return token;
  }

  /**
   * Tokenize names (simplified implementation)
   */
  private tokenizeNames(text: string): string {
    // This is a basic implementation
    // Real-world would use Named Entity Recognition (NER)

    // Pattern for "Mr./Mrs./Ms./Dr. FirstName LastName"
    const titlePattern = /\b(Mr\.|Mrs\.|Ms\.|Dr\.)\s+([A-Z][a-z]+\s+[A-Z][a-z]+)\b/g;

    let result = text.replace(titlePattern, (match, title, name) => {
      return `${title} ${this.getOrCreateToken(name, 'name')}`;
    });

    return result;
  }

  /**
   * Hash PII value for lookup
   */
  private hash(value: string): string {
    return crypto.createHash('sha256').update(value).digest('hex');
  }

  /**
   * Get all tokens created
   */
  getTokens(): PIIToken[] {
    return Array.from(this.tokenMap.values());
  }

  /**
   * Get token count by type
   */
  getTokenCountByType(): Record<string, number> {
    const counts: Record<string, number> = {};

    for (const [type, count] of this.counters.entries()) {
      counts[type] = count;
    }

    return counts;
  }

  /**
   * Clear all tokens (for cleanup)
   */
  clear(): void {
    this.tokenMap.clear();
    this.counters.clear();
  }
}
