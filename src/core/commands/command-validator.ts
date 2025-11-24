/**
 * Phase 3: Command System - Command Validator
 * Validates command definitions and execution prerequisites
 */

import {
  Command,
  CommandMetadata,
  ValidationResult,
  ParsedCommand,
} from './types';
import { ParameterParser } from './parameter-parser';

export class CommandValidator {
  private parameterParser: ParameterParser;

  constructor() {
    this.parameterParser = new ParameterParser();
  }

  /**
   * Validates a command definition for correctness
   */
  validateCommandDefinition(command: Command): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const metadata = command.metadata;

    // Validate required fields
    if (!metadata.name || metadata.name.trim() === '') {
      errors.push('Command name is required');
    }

    if (!metadata.description || metadata.description.trim() === '') {
      errors.push('Command description is required');
    }

    if (!metadata.category) {
      errors.push('Command category is required');
    } else if (
      !['workflow', 'superclaude', 'optimization', 'git'].includes(
        metadata.category
      )
    ) {
      errors.push(`Invalid category: ${metadata.category}`);
    }

    if (!metadata.version) {
      warnings.push('Command version is missing');
    }

    // Validate triggers
    if (!metadata.triggers || !metadata.triggers.exact) {
      errors.push('Command must have an exact trigger');
    } else {
      if (!metadata.triggers.exact.startsWith('/')) {
        errors.push('Exact trigger must start with /');
      }
    }

    // Validate parameters
    if (metadata.parameters) {
      for (const param of metadata.parameters) {
        if (!param.name) {
          errors.push('Parameter must have a name');
        }

        if (!['string', 'number', 'boolean', 'array'].includes(param.type)) {
          errors.push(`Invalid parameter type: ${param.type}`);
        }

        if (param.required && param.default !== undefined) {
          warnings.push(
            `Parameter ${param.name} is marked required but has a default value`
          );
        }
      }
    }

    // Validate token estimate
    if (metadata.tokenEstimate <= 0) {
      warnings.push('Token estimate should be positive');
    }

    // Validate content
    if (!command.content || command.content.trim() === '') {
      errors.push('Command content is required');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validates command execution prerequisites
   */
  validateExecution(
    command: Command,
    parsedCommand: ParsedCommand,
    availableSkills: string[] = [],
    availableMCPs: string[] = [],
    availableAgents: string[] = []
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const metadata = command.metadata;

    // Validate parameters
    const paramValidation = this.parameterParser.validateParameters(
      parsedCommand.parameters,
      parsedCommand.flags,
      metadata.parameters
    );

    errors.push(...paramValidation.errors);

    // Check required skills
    if (metadata.requires?.skills) {
      for (const skill of metadata.requires.skills) {
        if (!availableSkills.includes(skill)) {
          warnings.push(`Required skill not available: ${skill}`);
        }
      }
    }

    // Check required MCPs
    if (metadata.requires?.mcps) {
      for (const mcp of metadata.requires.mcps) {
        if (!availableMCPs.includes(mcp)) {
          warnings.push(`Required MCP not available: ${mcp}`);
        }
      }
    }

    // Check required agents
    if (metadata.requires?.agents) {
      for (const agent of metadata.requires.agents) {
        if (!availableAgents.includes(agent)) {
          warnings.push(`Required agent not available: ${agent}`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validates command metadata structure
   */
  validateMetadata(metadata: Partial<CommandMetadata>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for common issues
    if (metadata.autoExecute && metadata.parameters?.some((p) => p.required)) {
      warnings.push(
        'Auto-execute commands with required parameters may fail if parameters are not provided'
      );
    }

    if (metadata.tokenEstimate && metadata.tokenEstimate > 50000) {
      warnings.push(
        `High token estimate (${metadata.tokenEstimate}). Consider breaking into smaller commands.`
      );
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Checks if a command can be safely executed
   */
  canExecute(
    command: Command,
    availableTokens: number = Infinity
  ): { canExecute: boolean; reason?: string } {
    // Check if command is loaded
    if (!command.loaded) {
      return { canExecute: false, reason: 'Command not loaded' };
    }

    // Check token budget
    if (command.metadata.tokenEstimate > availableTokens) {
      return {
        canExecute: false,
        reason: `Insufficient tokens. Required: ${command.metadata.tokenEstimate}, Available: ${availableTokens}`,
      };
    }

    // Validate definition
    const validation = this.validateCommandDefinition(command);
    if (!validation.valid) {
      return {
        canExecute: false,
        reason: `Invalid command: ${validation.errors.join(', ')}`,
      };
    }

    return { canExecute: true };
  }
}
