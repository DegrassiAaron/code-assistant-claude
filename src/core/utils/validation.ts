import path from 'path';
import os from 'os';

/**
 * Validate that a project root path is safe and within allowed boundaries
 *
 * @param projectRoot - Path to validate
 * @throws {Error} If path is invalid or potentially malicious
 */
export function validateProjectRoot(projectRoot: string): void {
  // Resolve to absolute path
  const resolved = path.resolve(projectRoot);
  const cwd = process.cwd();

  // Check for path traversal attempts
  if (projectRoot.includes('..') || projectRoot.includes('~')) {
    throw new Error('Invalid path: path traversal detected');
  }

  // Check for suspicious system directory patterns FIRST (before cwd check)
  const suspiciousPatterns = [
    '/etc',
    '/root',
    '/sys',
    '/proc',
    'C:\\Windows',
    'C:\\Program Files',
  ];

  for (const pattern of suspiciousPatterns) {
    if (resolved.startsWith(pattern) || resolved.includes(pattern + '/')) {
      throw new Error(`Access to system directory denied: ${pattern}`);
    }
  }

  const isWithin = (root: string): boolean => {
    const normalizedRoot = path.resolve(root);
    if (!resolved.startsWith(normalizedRoot)) {
      return false;
    }
    const relative = path.relative(normalizedRoot, resolved);
    return (
      relative === '' ||
      (!relative.startsWith('..') && !path.isAbsolute(relative))
    );
  };

  const allowedRoots = [cwd, os.tmpdir()].filter(Boolean);

  if (!allowedRoots.some((root) => isWithin(root))) {
    throw new Error(
      'Project root must be within the repository or the system temporary directory'
    );
  }
}

/**
 * Sanitize a file path to prevent injection attacks
 *
 * @param filePath - Path to sanitize
 * @returns Sanitized path
 */
export function sanitizePath(filePath: string): string {
  // Remove null bytes
  let sanitized = filePath.replace(/\0/g, '');

  // Normalize path separators
  sanitized = path.normalize(sanitized);

  // Remove leading/trailing whitespace
  sanitized = sanitized.trim();

  return sanitized;
}

/**
 * Validate a configuration key
 *
 * @param key - Configuration key to validate
 * @throws {Error} If key is invalid
 */
export function validateConfigKey(key: string): void {
  // Only allow alphanumeric, dots, and underscores
  if (!/^[a-zA-Z0-9._]+$/.test(key)) {
    throw new Error(
      'Invalid configuration key: only alphanumeric, dots, and underscores allowed'
    );
  }

  // Check for injection attempts
  if (
    key.includes('__proto__') ||
    key.includes('constructor') ||
    key.includes('prototype')
  ) {
    throw new Error('Invalid configuration key: prototype pollution detected');
  }
}
