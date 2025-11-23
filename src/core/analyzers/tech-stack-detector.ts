import { promises as fs } from "fs";
import path from "path";
import { fileExists } from "../utils/file-utils";

export interface TechStack {
  languages: string[];
  frameworks: string[];
  tools: string[];
  confidence: number;
}

// Constants
const MAX_FILES_TO_SCAN = 10000;
const MAX_SCAN_DEPTH = 3;

export class TechStackDetector {
  /**
   * Detects programming languages, frameworks, and tools from project files.
   *
   * @param projectRoot - Absolute path to project directory
   * @returns TechStack with detected languages, frameworks, and tools
   */
  async detect(projectRoot: string): Promise<TechStack> {
    const stack: TechStack = {
      languages: [],
      frameworks: [],
      tools: [],
      confidence: 0,
    };

    // Parallelize all detection operations for better performance
    await Promise.all([
      this.detectFromPackageJson(projectRoot, stack),
      this.detectFromPython(projectRoot, stack),
      this.detectFromJava(projectRoot, stack),
      this.detectFromGo(projectRoot, stack),
      this.detectFromRust(projectRoot, stack),
      this.detectFromCSharp(projectRoot, stack),
    ]);

    // Fallback: detect from file extensions
    if (stack.languages.length === 0) {
      await this.detectFromFileExtensions(projectRoot, stack);
    }

    // Calculate confidence
    stack.confidence = this.calculateConfidence(stack);

    return stack;
  }

  private async detectFromPackageJson(
    root: string,
    stack: TechStack,
  ): Promise<void> {
    try {
      const content = await fs.readFile(
        path.join(root, "package.json"),
        "utf-8",
      );
      const pkg = JSON.parse(content);

      const deps = { ...pkg.dependencies, ...pkg.devDependencies };

      // Detect TypeScript
      if (
        deps.typescript ||
        (await fileExists(path.join(root, "tsconfig.json")))
      ) {
        stack.languages.push("typescript");
      } else {
        stack.languages.push("javascript");
      }

      // Detect frameworks
      if (deps.react) stack.frameworks.push("react");
      if (deps.vue) stack.frameworks.push("vue");
      if (deps["@angular/core"]) stack.frameworks.push("angular");
      if (deps.next) stack.frameworks.push("next");
      if (deps.svelte) stack.frameworks.push("svelte");
      if (deps.express) stack.frameworks.push("express");
      if (deps["@nestjs/core"]) stack.frameworks.push("nestjs");
      if (deps["react-native"]) stack.frameworks.push("react-native");

      // Detect tools
      if (deps.vite || deps["@vitejs/plugin-react"]) stack.tools.push("vite");
      if (deps.webpack) stack.tools.push("webpack");
      if (deps.jest) stack.tools.push("jest");
      if (deps.vitest) stack.tools.push("vitest");
      if (deps.eslint) stack.tools.push("eslint");
      if (deps.prettier) stack.tools.push("prettier");
    } catch {
      // package.json doesn't exist
    }
  }

  private async detectFromPython(
    root: string,
    stack: TechStack,
  ): Promise<void> {
    try {
      // Check requirements.txt
      if (await fileExists(path.join(root, "requirements.txt"))) {
        stack.languages.push("python");

        const content = await fs.readFile(
          path.join(root, "requirements.txt"),
          "utf-8",
        );

        if (content.includes("django")) stack.frameworks.push("django");
        if (content.includes("flask")) stack.frameworks.push("flask");
        if (content.includes("fastapi")) stack.frameworks.push("fastapi");
        if (content.includes("pytest")) stack.tools.push("pytest");
      }

      // Check setup.py or pyproject.toml
      if (
        (await fileExists(path.join(root, "setup.py"))) ||
        (await fileExists(path.join(root, "pyproject.toml")))
      ) {
        if (!stack.languages.includes("python")) {
          stack.languages.push("python");
        }
      }
    } catch {
      // Python files don't exist
    }
  }

  private async detectFromJava(root: string, stack: TechStack): Promise<void> {
    try {
      // Check pom.xml (Maven)
      if (await fileExists(path.join(root, "pom.xml"))) {
        stack.languages.push("java");

        const content = await fs.readFile(path.join(root, "pom.xml"), "utf-8");

        if (content.includes("spring-boot")) stack.frameworks.push("spring");
        if (content.includes("junit")) stack.tools.push("junit");
      }

      // Check build.gradle (Gradle)
      if (
        (await fileExists(path.join(root, "build.gradle"))) ||
        (await fileExists(path.join(root, "build.gradle.kts")))
      ) {
        if (!stack.languages.includes("java")) {
          stack.languages.push("java");
        }
      }
    } catch {
      // Java files don't exist
    }
  }

  private async detectFromGo(root: string, stack: TechStack): Promise<void> {
    try {
      if (await fileExists(path.join(root, "go.mod"))) {
        stack.languages.push("go");
      }
    } catch {
      // Go files don't exist
    }
  }

  private async detectFromRust(root: string, stack: TechStack): Promise<void> {
    try {
      if (await fileExists(path.join(root, "Cargo.toml"))) {
        stack.languages.push("rust");
      }
    } catch {
      // Rust files don't exist
    }
  }

  private async detectFromCSharp(
    root: string,
    stack: TechStack,
  ): Promise<void> {
    try {
      const files = await fs.readdir(root);
      const hasCsproj = files.some((f) => f.endsWith(".csproj"));

      if (hasCsproj) {
        stack.languages.push("csharp");
      }
    } catch {
      // C# files don't exist
    }
  }

  private async detectFromFileExtensions(
    root: string,
    stack: TechStack,
  ): Promise<void> {
    try {
      const fileCount = { count: 0 };
      const files = await this.getFilesRecursive(
        root,
        MAX_SCAN_DEPTH,
        0,
        fileCount,
      );

      if (fileCount.count >= MAX_FILES_TO_SCAN) {
        console.warn(
          `File scan limit reached (${MAX_FILES_TO_SCAN} files). Detection may be incomplete.`,
        );
      }

      const extensions = new Set(
        files.map((f) => path.extname(f).toLowerCase()),
      );

      if (extensions.has(".ts") || extensions.has(".tsx"))
        stack.languages.push("typescript");
      else if (extensions.has(".js") || extensions.has(".jsx"))
        stack.languages.push("javascript");

      if (extensions.has(".py")) stack.languages.push("python");
      if (extensions.has(".java")) stack.languages.push("java");
      if (extensions.has(".go")) stack.languages.push("go");
      if (extensions.has(".rs")) stack.languages.push("rust");
      if (extensions.has(".cs")) stack.languages.push("csharp");
      if (extensions.has(".rb")) stack.languages.push("ruby");
      if (extensions.has(".php")) stack.languages.push("php");
    } catch {
      // Fallback failed
    }
  }

  /**
   * Recursively scan directory for files with memory limit protection.
   *
   * @param dir - Directory to scan
   * @param maxDepth - Maximum recursion depth
   * @param currentDepth - Current depth level
   * @param fileCount - Mutable counter to track total files scanned
   * @returns Array of file paths (limited to MAX_FILES_TO_SCAN)
   */
  private async getFilesRecursive(
    dir: string,
    maxDepth: number,
    currentDepth: number = 0,
    fileCount: { count: number } = { count: 0 },
  ): Promise<string[]> {
    // Stop if max depth or file limit reached
    if (currentDepth >= maxDepth || fileCount.count >= MAX_FILES_TO_SCAN) {
      return [];
    }

    try {
      const files: string[] = [];
      const entries = await fs.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        // Check limit before processing each entry
        if (fileCount.count >= MAX_FILES_TO_SCAN) {
          break;
        }

        // Skip node_modules, .git, dist, build, etc.
        if (
          [
            "node_modules",
            ".git",
            "dist",
            "build",
            "out",
            ".next",
            "__pycache__",
            "target",
            "vendor",
          ].includes(entry.name)
        ) {
          continue;
        }

        const fullPath = path.join(dir, entry.name);

        if (entry.isFile()) {
          files.push(fullPath);
          fileCount.count++;
        } else if (entry.isDirectory()) {
          const subFiles = await this.getFilesRecursive(
            fullPath,
            maxDepth,
            currentDepth + 1,
            fileCount,
          );
          files.push(...subFiles);
        }
      }

      return files;
    } catch {
      return [];
    }
  }

  private calculateConfidence(stack: TechStack): number {
    let confidence = 0;

    if (stack.languages.length > 0) confidence += 0.5;
    if (stack.frameworks.length > 0) confidence += 0.3;
    if (stack.tools.length > 0) confidence += 0.2;

    return Math.min(confidence, 1.0);
  }
}
