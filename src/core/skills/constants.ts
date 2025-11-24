/**
 * Constants for the Skills System
 */

/**
 * Cache configuration
 */
export const DEFAULT_CACHE_SIZE = 50;
export const DEFAULT_CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Token estimation
 */
export const CHARS_PER_TOKEN_ESTIMATE = 4;

/**
 * File system
 */
export const SKILL_FILE_NAME = "SKILL.md";
export const RESOURCES_DIR_NAME = "resources";
export const EXAMPLES_DIR_NAME = "examples";

/**
 * Retry configuration
 */
export const DEFAULT_MAX_RETRIES = 3;
export const DEFAULT_RETRY_BASE_DELAY_MS = 100;

/**
 * Valid skill categories
 */
export const VALID_CATEGORIES = [
  "core",
  "domain",
  "superclaude",
  "meta",
] as const;

/**
 * Priority values for sorting
 */
export const PRIORITY_VALUES = {
  high: 3,
  medium: 2,
  low: 1,
} as const;
