import { promises as fs } from "fs";
import path from "path";
import yaml from "js-yaml";
import { Skill, SkillMetadata, LoadingStage, SkillResource } from "./types";
import { Logger, ConsoleLogger } from "./logger";
import { VALID_CATEGORIES, RESOURCES_DIR_NAME } from "./constants";
import { TokenEstimator, defaultTokenEstimator } from "./token-estimator";
import { withRetry } from "./retry-utils";
import { SkillParseError, SkillValidationError } from "./errors";

/**
 * Parses skill files and extracts metadata and content
 *
 * Implements progressive loading:
 * - METADATA_ONLY: Parse only YAML frontmatter (~30-50 tokens)
 * - FULL_CONTENT: Parse frontmatter + markdown body (~1500-3000 tokens)
 * - WITH_RESOURCES: Load all resources (~500-2000 additional tokens)
 */
export class SkillParser {
  private logger: Logger;
  private tokenEstimator: TokenEstimator;

  /**
   * Creates a new SkillParser
   * @param logger - Logger instance for debugging
   * @param tokenEstimator - Token estimator for accurate token counting
   */
  constructor(
    logger: Logger = new ConsoleLogger("[SkillParser]"),
    tokenEstimator: TokenEstimator = defaultTokenEstimator,
  ) {
    this.logger = logger;
    this.tokenEstimator = tokenEstimator;
  }
  /**
   * Parse skill file and extract metadata + content
   * @param skillPath - Absolute path to SKILL.md file
   * @param stage - Loading stage (metadata only or full content)
   */
  async parseSkill(
    skillPath: string,
    stage: LoadingStage = LoadingStage.METADATA_ONLY,
  ): Promise<Skill> {
    const content = await withRetry(() => fs.readFile(skillPath, "utf-8"), {
      logger: this.logger,
    });

    // Extract YAML frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]+?)\n---/);
    if (!frontmatterMatch) {
      throw SkillParseError.missingFrontmatter(skillPath);
    }

    const yamlContent = frontmatterMatch[1];
    if (!yamlContent) {
      throw SkillParseError.emptyFrontmatter(skillPath);
    }

    let metadata: SkillMetadata;
    try {
      metadata = yaml.load(yamlContent) as SkillMetadata;
      if (!metadata) {
        throw SkillParseError.emptyFrontmatter(skillPath);
      }
    } catch (error) {
      throw SkillParseError.invalidYaml(skillPath, error as Error);
    }

    // Validate metadata
    this.validateMetadata(metadata);

    // Calculate tokens for metadata
    const metadataTokens = this.estimateTokens(frontmatterMatch[0]);

    this.logger.debug?.(`Parsed metadata for skill: ${metadata.name}`);

    // Return based on loading stage
    if (stage === LoadingStage.METADATA_ONLY) {
      return {
        metadata,
        content: "",
        loaded: LoadingStage.METADATA_ONLY,
        loadedAt: new Date(),
        tokensConsumed: metadataTokens,
      };
    }

    // Extract full content (everything after frontmatter)
    const bodyContent = content.substring(frontmatterMatch[0].length).trim();
    const fullTokens = metadataTokens + this.estimateTokens(bodyContent);

    const skill: Skill = {
      metadata,
      content: bodyContent,
      loaded: LoadingStage.FULL_CONTENT,
      loadedAt: new Date(),
      tokensConsumed: fullTokens,
    };

    // Load resources if requested
    if (stage === LoadingStage.WITH_RESOURCES) {
      const resources = await this.loadResources(skillPath);
      skill.resources = resources;
      skill.loaded = LoadingStage.WITH_RESOURCES;
      skill.tokensConsumed =
        fullTokens + this.calculateResourceTokens(resources);
      this.logger.debug?.(
        `Loaded ${resources.length} resources for skill: ${metadata.name}`,
      );
    }

    return skill;
  }

  /**
   * Load skill resources (templates, scripts, etc.)
   */
  private async loadResources(skillPath: string): Promise<SkillResource[]> {
    const skillDir = path.dirname(skillPath);
    const resourcesDir = path.join(skillDir, RESOURCES_DIR_NAME);

    try {
      const files = await withRetry(() => fs.readdir(resourcesDir), {
        logger: this.logger,
      });
      const resources: SkillResource[] = [];

      for (const file of files) {
        if (file === ".gitkeep") continue;

        const resourcePath = path.join(resourcesDir, file);
        const stat = await withRetry(() => fs.stat(resourcePath), {
          logger: this.logger,
        });

        if (stat.isFile()) {
          const content = await withRetry(
            () => fs.readFile(resourcePath, "utf-8"),
            { logger: this.logger },
          );
          resources.push({
            name: file,
            type: this.detectResourceType(file),
            path: resourcePath,
            content,
            loaded: true,
          });
        }
      }

      return resources;
    } catch (error) {
      // Resources directory doesn't exist or is empty
      return [];
    }
  }

  /**
   * Detect resource type from file extension
   */
  private detectResourceType(filename: string): SkillResource["type"] {
    const ext = path.extname(filename).toLowerCase();

    if (ext === ".json") return "config";
    if (ext === ".js" || ext === ".ts") return "script";
    if (ext === ".md") return "reference";
    return "template";
  }

  /**
   * Validate skill metadata against schema
   * @throws {SkillValidationError} If validation fails
   */
  private validateMetadata(metadata: SkillMetadata): void {
    const name = metadata.name || "unknown";

    // Required fields
    if (!metadata.name) {
      throw SkillValidationError.missingField(name, "name");
    }
    if (!metadata.description) {
      throw SkillValidationError.missingField(name, "description");
    }
    if (!metadata.category) {
      throw SkillValidationError.missingField(name, "category");
    }

    // Validate category
    if (!VALID_CATEGORIES.includes(metadata.category)) {
      throw SkillValidationError.invalidCategory(name, metadata.category);
    }

    // Validate triggers
    if (!metadata.triggers || Object.keys(metadata.triggers).length === 0) {
      throw SkillValidationError.noTriggers(name);
    }

    // Validate token costs
    if (!metadata.tokenCost) {
      throw SkillValidationError.missingTokenCost(name);
    }
  }

  /**
   * Estimate token count for text using tiktoken
   *
   * Uses tiktoken for accurate counting when available, falls back to
   * simple character-based estimation (~4 chars per token) otherwise.
   *
   * @param text - The text to estimate tokens for
   * @returns Estimated token count
   */
  private estimateTokens(text: string): number {
    return this.tokenEstimator.estimateTokens(text);
  }

  /**
   * Calculate total tokens for resources
   */
  private calculateResourceTokens(resources: SkillResource[]): number {
    return resources.reduce((total, resource) => {
      return (
        total + (resource.content ? this.estimateTokens(resource.content) : 0)
      );
    }, 0);
  }
}
