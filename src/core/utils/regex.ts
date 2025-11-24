/**
 * Regex Utilities
 * Shared regex helper functions
 */

/**
 * Escape special regex characters in a string
 * @param str - String to escape
 * @returns Escaped string safe for use in RegExp
 */
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Create a word boundary regex pattern
 * @param word - Word to match
 * @param flags - Regex flags (default: 'gi')
 * @returns Compiled RegExp
 */
export function createWordBoundaryPattern(
  word: string,
  flags: string = "gi",
): RegExp {
  const escaped = escapeRegex(word);
  return new RegExp(`\\b${escaped}\\b`, flags);
}

/**
 * Create a pattern matching any of the provided strings
 * @param strings - Array of strings to match
 * @param flags - Regex flags (default: 'g')
 * @returns Compiled RegExp
 */
export function createAlternationPattern(
  strings: string[],
  flags: string = "g",
): RegExp {
  const escaped = strings.map(escapeRegex);
  return new RegExp(escaped.join("|"), flags);
}
