/**
 * Agent Loader
 *
 * Loads agents from markdown files with frontmatter metadata.
 */

import * as fs from "fs/promises";
import * as path from "path";
import type { Agent, AgentMetadata, IAgentLoader } from "./types";
import { Logger } from "./logger";

export class AgentLoader implements IAgentLoader {
  private logger = new Logger("AgentLoader");

  /**
   * Load agent from markdown file
   */
  async loadAgent(filePath: string): Promise<Agent> {
    this.logger.debug("Loading agent", { filePath });

    try {
      const content = await fs.readFile(filePath, "utf-8");
      const metadata = this.parseFrontmatter(content);

      // Remove frontmatter from content
      const contentWithoutFrontmatter = this.removeFrontmatter(content);

      return {
        metadata,
        content: contentWithoutFrontmatter,
        path: filePath,
      };
    } catch (error) {
      this.logger.error("Failed to load agent", {
        filePath,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      throw new Error(
        `Failed to load agent from ${filePath}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    }
  }

  /**
   * Load all agents from directory
   */
  async loadAgentsFromDirectory(directory: string): Promise<Agent[]> {
    this.logger.info("Loading agents from directory", { directory });

    try {
      const files = await this.findAgentFiles(directory);
      const agents: Agent[] = [];

      for (const file of files) {
        try {
          const agent = await this.loadAgent(file);
          agents.push(agent);
        } catch (error) {
          this.logger.warn("Skipping invalid agent file", {
            file,
            error: error instanceof Error ? error.message : "Unknown error",
          });
          // Continue loading other agents
        }
      }

      this.logger.info("Agents loaded", {
        directory,
        count: agents.length,
        agents: agents.map((a) => a.metadata.name),
      });

      return agents;
    } catch (error) {
      this.logger.error("Failed to load agents from directory", {
        directory,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      throw new Error(
        `Failed to load agents from directory ${directory}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    }
  }

  /**
   * Parse agent frontmatter
   */
  parseFrontmatter(content: string): AgentMetadata {
    const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);

    if (!frontmatterMatch) {
      throw new Error("No frontmatter found in agent file");
    }

    const frontmatterText = frontmatterMatch[1];
    const metadata = this.parseYAML(frontmatterText);

    // Validate required fields
    this.validateMetadata(metadata);

    return metadata as AgentMetadata;
  }

  /**
   * Find all agent markdown files in directory
   */
  private async findAgentFiles(directory: string): Promise<string[]> {
    const files: string[] = [];

    const entries = await fs.readdir(directory, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        // Recursively search subdirectories
        const subFiles = await this.findAgentFiles(fullPath);
        files.push(...subFiles);
      } else if (entry.isFile() && entry.name.endsWith("-agent.md")) {
        files.push(fullPath);
      } else if (entry.isFile() && entry.name === "AGENT.md") {
        files.push(fullPath);
      }
    }

    return files;
  }

  /**
   * Remove frontmatter from content
   */
  private removeFrontmatter(content: string): string {
    return content.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, "");
  }

  /**
   * Simple YAML parser for frontmatter
   * For production, use a proper YAML library like 'yaml' or 'js-yaml'
   */
  private parseYAML(yaml: string): Record<string, any> {
    const result: Record<string, any> = {};
    const lines = yaml.split("\n");
    let currentKey: string | null = null;
    let currentArray: any[] = [];
    let inArray = false;
    let inObject = false;
    let currentObject: Record<string, any> = {};

    for (const line of lines) {
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith("#")) {
        continue;
      }

      // Handle array items
      if (trimmed.startsWith("- ")) {
        if (!inArray) {
          inArray = true;
          currentArray = [];
        }
        const value = trimmed.substring(2).trim();
        // Remove quotes if present
        currentArray.push(value.replace(/^["']|["']$/g, ""));
        continue;
      }

      // Handle object properties
      if (trimmed.match(/^\w+:/) && inObject) {
        const [key, ...valueParts] = trimmed.split(":");
        const value = valueParts.join(":").trim();
        currentObject[key.trim()] = this.parseValue(value);
        continue;
      }

      // End of array or object
      if (inArray && currentKey) {
        result[currentKey] = currentArray;
        inArray = false;
        currentArray = [];
        currentKey = null;
      }

      if (inObject && currentKey) {
        result[currentKey] = currentObject;
        inObject = false;
        currentObject = {};
        currentKey = null;
      }

      // Handle key-value pairs
      const match = trimmed.match(/^(\w+):\s*(.*)$/);
      if (match) {
        const [, key, value] = match;

        if (!value) {
          // Object or array follows
          currentKey = key;
          // Peek at next line to determine type
          inObject = true;
          inArray = false;
          currentObject = {};
        } else {
          result[key] = this.parseValue(value);
        }
      }
    }

    // Handle trailing array or object
    if (inArray && currentKey) {
      result[currentKey] = currentArray;
    }
    if (inObject && currentKey) {
      result[currentKey] = currentObject;
    }

    return result;
  }

  /**
   * Parse a YAML value
   */
  private parseValue(value: string): any {
    const trimmed = value.trim();

    // Remove quotes
    if (
      (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'"))
    ) {
      return trimmed.slice(1, -1);
    }

    // Parse arrays
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      const items = trimmed
        .slice(1, -1)
        .split(",")
        .map((item) => this.parseValue(item));
      return items;
    }

    // Parse booleans
    if (trimmed === "true") return true;
    if (trimmed === "false") return false;

    // Parse numbers
    if (!isNaN(Number(trimmed))) {
      return Number(trimmed);
    }

    return trimmed;
  }

  /**
   * Validate agent metadata
   */
  private validateMetadata(metadata: any): void {
    const required = [
      "name",
      "description",
      "category",
      "expertise",
      "activation",
      "capabilities",
    ];

    for (const field of required) {
      if (!(field in metadata)) {
        throw new Error(`Missing required field in frontmatter: ${field}`);
      }
    }

    // Validate activation
    if (
      !metadata.activation.keywords ||
      !Array.isArray(metadata.activation.keywords)
    ) {
      throw new Error("activation.keywords must be an array");
    }

    if (
      !metadata.activation.complexity ||
      !Array.isArray(metadata.activation.complexity)
    ) {
      throw new Error("activation.complexity must be an array");
    }

    if (
      !metadata.activation.triggers ||
      !Array.isArray(metadata.activation.triggers)
    ) {
      throw new Error("activation.triggers must be an array");
    }

    // Validate category
    if (metadata.category !== "technical" && metadata.category !== "business") {
      throw new Error('category must be either "technical" or "business"');
    }
  }
}
