import { promises as fs } from "fs";
import * as path from "path";
import { glob } from "glob";
import * as yaml from "js-yaml";
import { createLogger } from "../utils/logger";

// Interfacce TypeScript per sostituire 'any'
export interface PnpmWorkspaceConfig {
  packages?: string[];
}

export interface PackageJson {
  name?: string;
  workspaces?: string[] | { packages?: string[] };
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  types?: string;
}

export interface WorkspaceInfo {
  name: string;
  path: string;
  type: string;
  technologies: string[];
  hasOwnPackageManager: boolean;
}

export interface MonorepoInfo {
  isMonorepo: boolean;
  tool?: string;
  rootPath: string;
  workspaces: WorkspaceInfo[];
  rootTechnologies: string[];
  crossLanguage: boolean;
  detectionTimeMs?: number;
}

export interface MonorepoDetectorOptions {
  maxWorkspaces?: number;
  timeoutMs?: number;
  enableCache?: boolean;
}

// Cache per glob patterns
interface GlobCacheEntry {
  pattern: string;
  results: string[];
  timestamp: number;
}

export class MonorepoDetector {
  private readonly logger = createLogger("MonorepoDetector");
  private readonly maxWorkspaces: number;
  private readonly timeoutMs: number;
  private readonly enableCache: boolean;
  private globCache: Map<string, GlobCacheEntry> = new Map();
  private readonly CACHE_TTL_MS = 60000; // 1 minuto

  constructor(
    private projectRoot: string,
    options: MonorepoDetectorOptions = {}
  ) {
    this.maxWorkspaces = options.maxWorkspaces ?? 1000;
    this.timeoutMs = options.timeoutMs ?? 30000; // 30 secondi default
    this.enableCache = options.enableCache ?? true;
  }

  async detect(): Promise<MonorepoInfo> {
    const startTime = Date.now();
    this.logger.debug(`Starting monorepo detection for: ${this.projectRoot}`);

    const result: MonorepoInfo = {
      isMonorepo: false,
      rootPath: this.projectRoot,
      workspaces: [],
      rootTechnologies: [],
      crossLanguage: false,
    };

    try {
      // Rileva diversi tipi di monorepo con timeout
      const detectors = [
        this.detectLernaMonorepo.bind(this),
        this.detectPnpmWorkspaces.bind(this),
        this.detectYarnWorkspaces.bind(this),
        this.detectNpmWorkspaces.bind(this),
        this.detectGoWorkspace.bind(this),
        this.detectRustWorkspace.bind(this),
        this.detectMavenMultiModule.bind(this),
        this.detectGradleMultiProject.bind(this),
        this.detectPythonMonorepo.bind(this),
        this.detectDotNetSolution.bind(this),
      ];

      for (const detector of detectors) {
        const detected = await this.withTimeout(
          detector(),
          this.timeoutMs,
          "Detector timeout"
        );
        if (detected.isMonorepo) {
          Object.assign(result, detected);
          this.logger.verbose(
            `Detected ${detected.tool} monorepo with ${detected.workspaces.length} workspaces`
          );
          break;
        }
      }

      // Determina se è cross-language
      if (result.isMonorepo) {
        result.crossLanguage = this.isCrossLanguage(result.workspaces);
        this.logger.verbose(
          `Cross-language: ${result.crossLanguage ? "yes" : "no"}`
        );
      }

      const elapsedMs = Date.now() - startTime;
      result.detectionTimeMs = elapsedMs;
      this.logger.debug(`Detection completed in ${elapsedMs}ms`);

      return result;
    } catch (error) {
      this.logger.error("Monorepo detection failed", error);
      const elapsedMs = Date.now() - startTime;
      result.detectionTimeMs = elapsedMs;
      return result;
    }
  }

  // Helper: controlla esistenza file
  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  // Helper: validazione path sicura
  private isPathSafe(relativePath: string): boolean {
    const resolved = path.resolve(this.projectRoot, relativePath);
    const normalized = path.normalize(resolved);
    return normalized.startsWith(this.projectRoot);
  }

  // Helper: timeout wrapper
  private async withTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number,
    errorMessage: string
  ): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error(errorMessage)), timeoutMs)
      ),
    ]);
  }

  // Helper: glob con cache
  private async cachedGlob(
    pattern: string,
    options: { cwd: string; absolute?: boolean; ignore?: string[] }
  ): Promise<string[]> {
    if (!this.enableCache) {
      return glob(pattern, options);
    }

    const cacheKey = `${pattern}:${options.cwd}`;
    const cached = this.globCache.get(cacheKey);
    const now = Date.now();

    if (cached && now - cached.timestamp < this.CACHE_TTL_MS) {
      this.logger.verbose(`Cache hit for pattern: ${pattern}`);
      return cached.results;
    }

    const results = await glob(pattern, options);
    this.globCache.set(cacheKey, {
      pattern,
      results,
      timestamp: now,
    });

    return results;
  }

  // Helper: limita workspaces
  private limitWorkspaces(workspaces: WorkspaceInfo[]): WorkspaceInfo[] {
    if (workspaces.length > this.maxWorkspaces) {
      this.logger.warn(
        `Limiting workspaces from ${workspaces.length} to ${this.maxWorkspaces}`
      );
      return workspaces.slice(0, this.maxWorkspaces);
    }
    return workspaces;
  }

  // Helper: parse XML semplice per Maven (sostituzione regex)
  private parseSimpleXml(
    content: string,
    tagName: string
  ): string[] | null {
    const results: string[] = [];
    const tagPattern = new RegExp(
      `<${tagName}>([^<]+)</${tagName}>`,
      "g"
    );
    let match;

    while ((match = tagPattern.exec(content)) !== null) {
      if (match[1]) {
        results.push(match[1].trim());
      }
    }

    return results.length > 0 ? results : null;
  }

  private async detectLernaMonorepo(): Promise<MonorepoInfo> {
    const lernaPath = path.join(this.projectRoot, "lerna.json");
    try {
      if (!(await this.fileExists(lernaPath))) {
        return this.emptyResult();
      }

      const lernaConfig = JSON.parse(await fs.readFile(lernaPath, "utf-8"));
      const packages =
        lernaConfig.packages || lernaConfig.workspaces || ["packages/*"];

      const workspaces = await this.findWorkspaces(packages);

      return {
        isMonorepo: true,
        tool: "lerna",
        rootPath: this.projectRoot,
        workspaces: this.limitWorkspaces(workspaces),
        rootTechnologies: ["JavaScript", "TypeScript"],
        crossLanguage: false,
      };
    } catch (error) {
      this.logger.debug("Lerna detection failed", error);
      return this.emptyResult();
    }
  }

  private async detectPnpmWorkspaces(): Promise<MonorepoInfo> {
    const pnpmPath = path.join(this.projectRoot, "pnpm-workspace.yaml");
    try {
      if (!(await this.fileExists(pnpmPath))) {
        return this.emptyResult();
      }

      const content = await fs.readFile(pnpmPath, "utf-8");
      const config = yaml.load(content) as PnpmWorkspaceConfig;
      const packages = config.packages || [];

      const workspaces = await this.findWorkspaces(packages);

      return {
        isMonorepo: true,
        tool: "pnpm",
        rootPath: this.projectRoot,
        workspaces: this.limitWorkspaces(workspaces),
        rootTechnologies: ["JavaScript", "TypeScript"],
        crossLanguage: false,
      };
    } catch (error) {
      this.logger.debug("pnpm detection failed", error);
      return this.emptyResult();
    }
  }

  private async detectYarnWorkspaces(): Promise<MonorepoInfo> {
    const packageJsonPath = path.join(this.projectRoot, "package.json");
    try {
      if (!(await this.fileExists(packageJsonPath))) {
        return this.emptyResult();
      }

      const packageJson: PackageJson = JSON.parse(
        await fs.readFile(packageJsonPath, "utf-8")
      );
      const workspacesField = packageJson.workspaces;

      if (!workspacesField) {
        return this.emptyResult();
      }

      // workspaces può essere un array o un oggetto con packages
      const packages = Array.isArray(workspacesField)
        ? workspacesField
        : workspacesField.packages || [];

      const workspaces = await this.findWorkspaces(packages);

      // Determina il tool (yarn o npm) in base al lockfile
      const yarnLock = await this.fileExists(
        path.join(this.projectRoot, "yarn.lock")
      );
      const tool = yarnLock ? "yarn" : "npm";

      return {
        isMonorepo: true,
        tool,
        rootPath: this.projectRoot,
        workspaces: this.limitWorkspaces(workspaces),
        rootTechnologies: ["JavaScript", "TypeScript"],
        crossLanguage: false,
      };
    } catch (error) {
      this.logger.debug("Yarn/npm workspace detection failed", error);
      return this.emptyResult();
    }
  }

  private async detectNpmWorkspaces(): Promise<MonorepoInfo> {
    // NPM workspaces usa lo stesso formato di yarn nel package.json
    // Questo metodo è già gestito da detectYarnWorkspaces
    return this.emptyResult();
  }

  private async detectGoWorkspace(): Promise<MonorepoInfo> {
    const goWorkPath = path.join(this.projectRoot, "go.work");
    try {
      if (!(await this.fileExists(goWorkPath))) {
        return this.emptyResult();
      }

      const content = await fs.readFile(goWorkPath, "utf-8");
      const useModules: string[] = [];

      // Parse go.work file (formato semplice)
      const lines = content.split("\n");
      let inUseBlock = false;
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith("use")) {
          inUseBlock = true;
          // Gestisci "use ./path"
          const match = trimmed.match(/use\s+(.+)/);
          if (match && match[1]) {
            const modulePath = match[1].replace(/[()]/g, "").trim();
            if (modulePath && !modulePath.startsWith("(")) {
              if (this.isPathSafe(modulePath)) {
                useModules.push(modulePath);
              }
              continue;
            }
          }
        }
        if (inUseBlock) {
          if (trimmed === ")") {
            inUseBlock = false;
          } else if (trimmed && !trimmed.startsWith("//")) {
            const modulePath = trimmed.replace(/[()]/g, "").trim();
            if (this.isPathSafe(modulePath)) {
              useModules.push(modulePath);
            }
          }
        }
      }

      // Parallelizza lettura moduli Go
      const workspacePromises = useModules.map(async (modulePath) => {
        const fullPath = path.join(this.projectRoot, modulePath);
        const goModPath = path.join(fullPath, "go.mod");

        if (await this.fileExists(goModPath)) {
          const goModContent = await fs.readFile(goModPath, "utf-8");
          const moduleMatch = goModContent.match(/module\s+(.+)/);
          const moduleName =
            moduleMatch && moduleMatch[1] ? moduleMatch[1].trim() : modulePath;

          return {
            name: moduleName,
            path: modulePath,
            type: "Go Module",
            technologies: ["Go"],
            hasOwnPackageManager: true,
          };
        }
        return null;
      });

      const workspaceResults = await Promise.all(workspacePromises);
      const workspaces = workspaceResults.filter(
        (w): w is WorkspaceInfo => w !== null
      );

      return {
        isMonorepo: true,
        tool: "go-workspace",
        rootPath: this.projectRoot,
        workspaces: this.limitWorkspaces(workspaces),
        rootTechnologies: ["Go"],
        crossLanguage: false,
      };
    } catch (error) {
      this.logger.debug("Go workspace detection failed", error);
      return this.emptyResult();
    }
  }

  private async detectRustWorkspace(): Promise<MonorepoInfo> {
    const cargoTomlPath = path.join(this.projectRoot, "Cargo.toml");
    try {
      if (!(await this.fileExists(cargoTomlPath))) {
        return this.emptyResult();
      }

      const content = await fs.readFile(cargoTomlPath, "utf-8");

      // Check per [workspace] section
      if (!content.includes("[workspace]")) {
        return this.emptyResult();
      }

      // Parse TOML semplice per trovare members
      const workspaceMatch = content.match(
        /\[workspace\]([\s\S]*?)(?=\n\[|$)/
      );
      if (!workspaceMatch || !workspaceMatch[1]) {
        return this.emptyResult();
      }

      const workspaceSection = workspaceMatch[1];
      const membersMatch = workspaceSection.match(
        /members\s*=\s*\[([\s\S]*?)\]/
      );
      if (!membersMatch || !membersMatch[1]) {
        return this.emptyResult();
      }

      const members = membersMatch[1]
        .split(",")
        .map((m) => m.trim().replace(/['"]/g, ""))
        .filter((m) => m);

      // Parallelizza processing crates
      const allMatches: string[] = [];
      for (const memberPattern of members) {
        const matches = await this.cachedGlob(memberPattern, {
          cwd: this.projectRoot,
          absolute: false,
        });
        allMatches.push(...matches);
      }

      const workspacePromises = allMatches.map(async (match) => {
        if (!this.isPathSafe(match)) return null;

        const cargoPath = path.join(this.projectRoot, match, "Cargo.toml");
        if (await this.fileExists(cargoPath)) {
          const cargoContent = await fs.readFile(cargoPath, "utf-8");
          const nameMatch = cargoContent.match(/name\s*=\s*"(.+?)"/);
          const name =
            nameMatch && nameMatch[1] ? nameMatch[1] : path.basename(match);

          return {
            name,
            path: match,
            type: "Rust Crate",
            technologies: ["Rust"],
            hasOwnPackageManager: true,
          };
        }
        return null;
      });

      const workspaceResults = await Promise.all(workspacePromises);
      const workspaces = workspaceResults.filter(
        (w): w is WorkspaceInfo => w !== null
      );

      return {
        isMonorepo: true,
        tool: "cargo-workspace",
        rootPath: this.projectRoot,
        workspaces: this.limitWorkspaces(workspaces),
        rootTechnologies: ["Rust"],
        crossLanguage: false,
      };
    } catch (error) {
      this.logger.debug("Rust workspace detection failed", error);
      return this.emptyResult();
    }
  }

  private async detectMavenMultiModule(): Promise<MonorepoInfo> {
    const pomPath = path.join(this.projectRoot, "pom.xml");
    try {
      if (!(await this.fileExists(pomPath))) {
        return this.emptyResult();
      }

      const content = await fs.readFile(pomPath, "utf-8");

      // Parse XML per trovare <modules>
      const modulesMatch = content.match(/<modules>([\s\S]*?)<\/modules>/);
      if (!modulesMatch || !modulesMatch[1]) {
        return this.emptyResult();
      }

      const modulesSection = modulesMatch[1];
      const modules = this.parseSimpleXml(modulesSection, "module");

      if (!modules || modules.length === 0) {
        return this.emptyResult();
      }

      // Parallelizza lettura moduli Maven
      const workspacePromises = modules.map(async (modulePath) => {
        if (!this.isPathSafe(modulePath)) return null;

        const modulePomPath = path.join(
          this.projectRoot,
          modulePath,
          "pom.xml"
        );

        if (await this.fileExists(modulePomPath)) {
          const moduleContent = await fs.readFile(modulePomPath, "utf-8");
          const artifactIds = this.parseSimpleXml(moduleContent, "artifactId");
          const artifactId = artifactIds?.[0] || path.basename(modulePath);

          return {
            name: artifactId,
            path: modulePath,
            type: "Maven Module",
            technologies: ["Java"],
            hasOwnPackageManager: true,
          };
        }
        return null;
      });

      const workspaceResults = await Promise.all(workspacePromises);
      const workspaces = workspaceResults.filter(
        (w): w is WorkspaceInfo => w !== null
      );

      return {
        isMonorepo: true,
        tool: "maven",
        rootPath: this.projectRoot,
        workspaces: this.limitWorkspaces(workspaces),
        rootTechnologies: ["Java"],
        crossLanguage: false,
      };
    } catch (error) {
      this.logger.debug("Maven multi-module detection failed", error);
      return this.emptyResult();
    }
  }

  private async detectGradleMultiProject(): Promise<MonorepoInfo> {
    const settingsPath = path.join(this.projectRoot, "settings.gradle");
    const settingsKtsPath = path.join(this.projectRoot, "settings.gradle.kts");

    try {
      let content = "";

      if (await this.fileExists(settingsPath)) {
        content = await fs.readFile(settingsPath, "utf-8");
      } else if (await this.fileExists(settingsKtsPath)) {
        content = await fs.readFile(settingsKtsPath, "utf-8");
      }

      if (!content) {
        return this.emptyResult();
      }

      // Parse per trovare include() statements
      const includePattern = /include\s*\(\s*['"](.+?)['"]\s*\)/g;
      const includes: string[] = [];
      let match;
      while ((match = includePattern.exec(content)) !== null) {
        if (match[1]) {
          includes.push(match[1]);
        }
      }

      if (includes.length === 0) {
        return this.emptyResult();
      }

      // Parallelizza verifica progetti Gradle
      const workspacePromises = includes.map(async (projectPath) => {
        // Converti ":subproject" in "subproject"
        const relativePath = projectPath.replace(/^:/, "").replace(/:/g, "/");

        if (!this.isPathSafe(relativePath)) return null;

        const fullPath = path.join(this.projectRoot, relativePath);

        const buildGradle = await this.fileExists(
          path.join(fullPath, "build.gradle")
        );
        const buildGradleKts = await this.fileExists(
          path.join(fullPath, "build.gradle.kts")
        );

        if (buildGradle || buildGradleKts) {
          return {
            name: projectPath,
            path: relativePath,
            type: "Gradle Project",
            technologies: ["Java", "Kotlin"],
            hasOwnPackageManager: true,
          };
        }
        return null;
      });

      const workspaceResults = await Promise.all(workspacePromises);
      const workspaces = workspaceResults.filter(
        (w): w is WorkspaceInfo => w !== null
      );

      return {
        isMonorepo: true,
        tool: "gradle",
        rootPath: this.projectRoot,
        workspaces: this.limitWorkspaces(workspaces),
        rootTechnologies: ["Java", "Kotlin"],
        crossLanguage: false,
      };
    } catch (error) {
      this.logger.debug("Gradle multi-project detection failed", error);
      return this.emptyResult();
    }
  }

  private async detectPythonMonorepo(): Promise<MonorepoInfo> {
    const pyprojectPath = path.join(this.projectRoot, "pyproject.toml");
    try {
      if (!(await this.fileExists(pyprojectPath))) {
        return this.emptyResult();
      }

      const content = await fs.readFile(pyprojectPath, "utf-8");

      // Poetry workspace support (experimental)
      if (content.includes("[tool.poetry.workspace]")) {
        const workspaceMatch = content.match(
          /\[tool\.poetry\.workspace\]([\s\S]*?)(?=\n\[|$)/
        );
        if (workspaceMatch && workspaceMatch[1]) {
          const workspaceSection = workspaceMatch[1];
          const membersMatch = workspaceSection.match(
            /members\s*=\s*\[([\s\S]*?)\]/
          );
          if (membersMatch && membersMatch[1]) {
            const members = membersMatch[1]
              .split(",")
              .map((m) => m.trim().replace(/['"]/g, ""))
              .filter((m) => m);

            const allMatches: string[] = [];
            for (const memberPattern of members) {
              const matches = await this.cachedGlob(memberPattern, {
                cwd: this.projectRoot,
                absolute: false,
              });
              allMatches.push(...matches);
            }

            // Parallelizza verifica package Python
            const workspacePromises = allMatches.map(async (match) => {
              if (!this.isPathSafe(match)) return null;

              const pyprojectExists = await this.fileExists(
                path.join(this.projectRoot, match, "pyproject.toml")
              );
              const setupExists = await this.fileExists(
                path.join(this.projectRoot, match, "setup.py")
              );

              if (pyprojectExists || setupExists) {
                return {
                  name: path.basename(match),
                  path: match,
                  type: "Python Package",
                  technologies: ["Python"],
                  hasOwnPackageManager: true,
                };
              }
              return null;
            });

            const workspaceResults = await Promise.all(workspacePromises);
            const workspaces = workspaceResults.filter(
              (w): w is WorkspaceInfo => w !== null
            );

            if (workspaces.length > 0) {
              return {
                isMonorepo: true,
                tool: "poetry",
                rootPath: this.projectRoot,
                workspaces: this.limitWorkspaces(workspaces),
                rootTechnologies: ["Python"],
                crossLanguage: false,
              };
            }
          }
        }
      }

      // Fallback: cerca directory con setup.py o pyproject.toml
      const potentialPackages = await this.cachedGlob(
        "*/+(pyproject.toml|setup.py)",
        {
          cwd: this.projectRoot,
          absolute: false,
        }
      );

      // Almeno 3 package per considerarlo monorepo (configurabile)
      const minPackages = 3;
      if (potentialPackages.length >= minPackages) {
        const workspaces: WorkspaceInfo[] = [];
        const seen = new Set<string>();

        for (const pkg of potentialPackages) {
          const dirName = path.dirname(pkg);
          if (!seen.has(dirName) && this.isPathSafe(dirName)) {
            seen.add(dirName);
            workspaces.push({
              name: dirName,
              path: dirName,
              type: "Python Package",
              technologies: ["Python"],
              hasOwnPackageManager: true,
            });
          }
        }

        return {
          isMonorepo: true,
          tool: "python-custom",
          rootPath: this.projectRoot,
          workspaces: this.limitWorkspaces(workspaces),
          rootTechnologies: ["Python"],
          crossLanguage: false,
        };
      }

      return this.emptyResult();
    } catch (error) {
      this.logger.debug("Python monorepo detection failed", error);
      return this.emptyResult();
    }
  }

  private async detectDotNetSolution(): Promise<MonorepoInfo> {
    try {
      const slnFiles = await this.cachedGlob("*.sln", {
        cwd: this.projectRoot,
        absolute: false,
      });

      if (slnFiles.length === 0 || !slnFiles[0]) {
        return this.emptyResult();
      }

      const slnPath = path.join(this.projectRoot, slnFiles[0]);
      const content = await fs.readFile(slnPath, "utf-8");

      // Parse .sln file per trovare progetti
      const projectPattern =
        /Project\("[^"]+"\)\s*=\s*"([^"]+)"\s*,\s*"([^"]+)"/g;
      const projects: Array<{ name: string; path: string }> = [];
      let match;

      while ((match = projectPattern.exec(content)) !== null) {
        if (!match[1] || !match[2]) continue;

        const projectName = match[1];
        const projectPath = match[2].replace(/\\/g, "/");

        // Verifica che sia un progetto C# (.csproj)
        if (projectPath.endsWith(".csproj")) {
          const projectDir = path.dirname(projectPath);
          if (this.isPathSafe(projectDir)) {
            projects.push({
              name: projectName,
              path: projectDir,
            });
          }
        }
      }

      // Deve avere almeno 2 progetti per essere considerato monorepo
      if (projects.length < 2) {
        return this.emptyResult();
      }

      const workspaces: WorkspaceInfo[] = projects.map((project) => ({
        name: project.name,
        path: project.path,
        type: "C# Project",
        technologies: ["C#"],
        hasOwnPackageManager: true,
      }));

      return {
        isMonorepo: true,
        tool: "dotnet-solution",
        rootPath: this.projectRoot,
        workspaces: this.limitWorkspaces(workspaces),
        rootTechnologies: ["C#"],
        crossLanguage: false,
      };
    } catch (error) {
      this.logger.debug(".NET solution detection failed", error);
      return this.emptyResult();
    }
  }

  private async findWorkspaces(patterns: string[]): Promise<WorkspaceInfo[]> {
    const allMatches: string[] = [];

    // Parallelizza glob patterns
    const globPromises = patterns.map((pattern) =>
      this.cachedGlob(pattern, {
        cwd: this.projectRoot,
        absolute: false,
        ignore: ["**/node_modules/**"],
      })
    );

    const results = await Promise.all(globPromises);
    results.forEach((matches) => allMatches.push(...matches));

    // Parallelizza lettura package.json
    const workspacePromises = allMatches.map(async (match) => {
      if (!this.isPathSafe(match)) return null;

      const packageJsonPath = path.join(
        this.projectRoot,
        match,
        "package.json"
      );

      if (await this.fileExists(packageJsonPath)) {
        try {
          const packageJson: PackageJson = JSON.parse(
            await fs.readFile(packageJsonPath, "utf-8")
          );
          const name = packageJson.name || path.basename(match);

          // Determina le tecnologie dal package.json
          const technologies =
            this.detectTechnologiesFromPackageJson(packageJson);

          return {
            name,
            path: match,
            type: "NPM Package",
            technologies,
            hasOwnPackageManager: true,
          };
        } catch (error) {
          this.logger.debug(`Failed to parse package.json at ${match}`, error);
          return null;
        }
      }
      return null;
    });

    const workspaceResults = await Promise.all(workspacePromises);
    return workspaceResults.filter((w): w is WorkspaceInfo => w !== null);
  }

  private detectTechnologiesFromPackageJson(
    packageJson: PackageJson
  ): string[] {
    const technologies = new Set<string>();

    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    // JavaScript/TypeScript
    if (allDeps.typescript || packageJson.types) {
      technologies.add("TypeScript");
    } else {
      technologies.add("JavaScript");
    }

    // Frameworks
    if (allDeps.react) technologies.add("React");
    if (allDeps.vue) technologies.add("Vue");
    if (allDeps.angular || allDeps["@angular/core"])
      technologies.add("Angular");
    if (allDeps.next) technologies.add("Next.js");
    if (allDeps.svelte) technologies.add("Svelte");
    if (allDeps.express) technologies.add("Express");
    if (allDeps["@nestjs/core"]) technologies.add("NestJS");

    return Array.from(technologies);
  }

  private isCrossLanguage(workspaces: WorkspaceInfo[]): boolean {
    const languageGroups = new Set<string>();

    for (const workspace of workspaces) {
      for (const tech of workspace.technologies) {
        // Raggruppa per linguaggio principale
        if (["JavaScript", "TypeScript"].includes(tech)) {
          languageGroups.add("JS");
        } else if (["Python"].includes(tech)) {
          languageGroups.add("Python");
        } else if (["Java", "Kotlin"].includes(tech)) {
          languageGroups.add("JVM");
        } else if (["Go"].includes(tech)) {
          languageGroups.add("Go");
        } else if (["Rust"].includes(tech)) {
          languageGroups.add("Rust");
        } else if (["C#"].includes(tech)) {
          languageGroups.add("DotNet");
        }
      }
    }

    // È cross-language se ci sono più di 1 gruppo linguistico diverso
    return languageGroups.size > 1;
  }

  private emptyResult(): MonorepoInfo {
    return {
      isMonorepo: false,
      rootPath: this.projectRoot,
      workspaces: [],
      rootTechnologies: [],
      crossLanguage: false,
    };
  }

  // Metodo per pulire la cache (utile per test)
  clearCache(): void {
    this.globCache.clear();
    this.logger.verbose("Cache cleared");
  }
}
