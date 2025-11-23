/**
 * Base error class for all skills system errors
 *
 * Provides structured error handling with error codes and context.
 */
export class SkillError extends Error {
  /**
   * Error code for programmatic error handling
   */
  public readonly code: string;

  /**
   * Additional context about the error
   */
  public readonly context?: Record<string, unknown>;

  /**
   * Original error that caused this error (if any)
   */
  public readonly cause?: Error;

  constructor(
    message: string,
    code: string,
    context?: Record<string, unknown>,
    cause?: Error
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.context = context;
    this.cause = cause;

    // Maintains proper stack trace for where error was thrown (V8 only)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Convert error to JSON for logging
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      context: this.context,
      stack: this.stack,
      cause: this.cause?.message
    };
  }
}

/**
 * Error thrown when a skill file cannot be parsed
 */
export class SkillParseError extends SkillError {
  constructor(
    message: string,
    skillPath: string,
    cause?: Error
  ) {
    super(
      message,
      'SKILL_PARSE_ERROR',
      { skillPath },
      cause
    );
  }

  static missingFrontmatter(skillPath: string): SkillParseError {
    return new SkillParseError(
      'Skill file missing YAML frontmatter',
      skillPath
    );
  }

  static emptyFrontmatter(skillPath: string): SkillParseError {
    return new SkillParseError(
      'Skill file has empty YAML frontmatter',
      skillPath
    );
  }

  static invalidYaml(skillPath: string, cause: Error): SkillParseError {
    return new SkillParseError(
      'Failed to parse YAML frontmatter',
      skillPath,
      cause
    );
  }
}

/**
 * Error thrown when skill metadata validation fails
 */
export class SkillValidationError extends SkillError {
  constructor(
    message: string,
    skillName: string,
    field?: string,
    cause?: Error
  ) {
    super(
      message,
      'SKILL_VALIDATION_ERROR',
      { skillName, field },
      cause
    );
  }

  static missingField(skillName: string, field: string): SkillValidationError {
    return new SkillValidationError(
      `Skill metadata missing required field: ${field}`,
      skillName,
      field
    );
  }

  static invalidCategory(skillName: string, category: string): SkillValidationError {
    return new SkillValidationError(
      `Invalid skill category: ${category}. Must be one of: core, domain, superclaude, meta`,
      skillName,
      'category'
    );
  }

  static noTriggers(skillName: string): SkillValidationError {
    return new SkillValidationError(
      'Skill must have at least one trigger',
      skillName,
      'triggers'
    );
  }

  static missingTokenCost(skillName: string): SkillValidationError {
    return new SkillValidationError(
      'Skill metadata missing required field: tokenCost',
      skillName,
      'tokenCost'
    );
  }
}

/**
 * Error thrown when a skill cannot be loaded
 */
export class SkillLoadError extends SkillError {
  constructor(
    message: string,
    skillName: string,
    stage?: string,
    cause?: Error
  ) {
    super(
      message,
      'SKILL_LOAD_ERROR',
      { skillName, stage },
      cause
    );
  }

  static fileNotFound(skillName: string, path: string): SkillLoadError {
    return new SkillLoadError(
      `Skill file not found: ${path}`,
      skillName,
      undefined
    );
  }

  static resourceLoadFailed(skillName: string, resourcePath: string, cause: Error): SkillLoadError {
    return new SkillLoadError(
      `Failed to load skill resource: ${resourcePath}`,
      skillName,
      'resources',
      cause
    );
  }
}

/**
 * Error thrown when skill indexing fails
 */
export class SkillIndexError extends SkillError {
  constructor(
    message: string,
    skillPath: string,
    cause?: Error
  ) {
    super(
      message,
      'SKILL_INDEX_ERROR',
      { skillPath },
      cause
    );
  }

  static indexFailed(skillPath: string, cause: Error): SkillIndexError {
    return new SkillIndexError(
      `Failed to index skill: ${skillPath}`,
      skillPath,
      cause
    );
  }
}

/**
 * Error thrown when skill activation logic fails
 */
export class SkillActivationError extends SkillError {
  constructor(
    message: string,
    skillName: string,
    cause?: Error
  ) {
    super(
      message,
      'SKILL_ACTIVATION_ERROR',
      { skillName },
      cause
    );
  }

  static matchFailed(skillName: string, cause: Error): SkillActivationError {
    return new SkillActivationError(
      `Failed to match skill: ${skillName}`,
      skillName,
      cause
    );
  }
}

/**
 * Error thrown when cache operations fail
 */
export class CacheError extends SkillError {
  constructor(
    message: string,
    operation: string,
    key?: string,
    cause?: Error
  ) {
    super(
      message,
      'CACHE_ERROR',
      { operation, key },
      cause
    );
  }

  static setFailed(key: string, cause: Error): CacheError {
    return new CacheError(
      `Failed to cache skill: ${key}`,
      'set',
      key,
      cause
    );
  }

  static getFailed(key: string, cause: Error): CacheError {
    return new CacheError(
      `Failed to retrieve cached skill: ${key}`,
      'get',
      key,
      cause
    );
  }
}
