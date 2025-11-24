import { promises as fs } from 'fs';
import * as path from 'path';
import { glob } from 'glob';
import * as yaml from 'js-yaml';
import { createLogger } from '../utils/logger';

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
  // Costanti di configurazione
  private static readonly DEFAULT_TIMEOUT_MS = 30000; // 30 secondi
  private static readonly DEFAULT_MAX_WORKSPACES = 1000;
  private static readonly MAX_TIMEOUT_MS = 300000; // 5 minuti massimo
  private static readonly MIN_PYTHON_PACKAGES = 3;
  private static readonly MIN_DOTNET_PROJECTS = 2;
  private static readonly CACHE_TTL_MS = 60000; // 1 minuto
  private static readonly MAX_CACHE_ENTRIES = 100; // Limite LRU cache
  private static readonly MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

  private readonly logger = createLogger('MonorepoDetector');
  private readonly maxWorkspaces: number;
  private readonly timeoutMs: number;
  private readonly enableCache: boolean;
  private globCache: Map<string, GlobCacheEntry> = new Map();

  constructor(
    private projectRoot: string,
    options: MonorepoDetectorOptions = {}
  ) {
    // Validazione configurazione
    if (options.maxWorkspaces !== undefined && options.maxWorkspaces <= 0) {
      throw new Error('maxWorkspaces must be greater than 0');
    }
    if (options.timeoutMs !== undefined && options.timeoutMs <= 0) {
      throw new Error('timeoutMs must be greater than 0');
    }

    this.maxWorkspaces =
      options.maxWorkspaces ?? MonorepoDetector.DEFAULT_MAX_WORKSPACES;
    this.timeoutMs = Math.min(
      options.timeoutMs ?? MonorepoDetector.DEFAULT_TIMEOUT_MS,
      MonorepoDetector.MAX_TIMEOUT_MS
    );
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
        this.detectNxMonorepo.bind(this),
        this.detectTurborepo.bind(this),
        this.detectRushMonorepo.bind(this),
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
          'Detector timeout'
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
          `Cross-language: ${result.crossLanguage ? 'yes' : 'no'}`
        );
      }

      const elapsedMs = Date.now() - startTime;
      result.detectionTimeMs = elapsedMs;
      this.logger.debug(`Detection completed in ${elapsedMs}ms`);

      return result;
    } catch (error) {
      this.logger.error('Monorepo detection failed', error);
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

  // Helper: lettura file sicura con limite dimensione
  private async readFileSafe(
    filePath: string,
    maxSizeBytes: number = MonorepoDetector.MAX_FILE_SIZE_BYTES
  ): Promise<string> {
    const stats = await fs.stat(filePath);
    if (stats.size > maxSizeBytes) {
      throw new Error(
        `File too large: ${filePath} (${stats.size} bytes, max ${maxSizeBytes})`
      );
    }
    return fs.readFile(filePath, 'utf-8');
  }

  // Helper: validazione path sicura (protegge da symlink attacks)
  private async isPathSafe(relativePath: string): Promise<boolean> {
    try {
      const resolved = path.resolve(this.projectRoot, relativePath);

      // Risolvi symlink per prevenire path traversal
      const realPath = await fs.realpath(resolved).catch(() => resolved);
      const realRoot = await fs
        .realpath(this.projectRoot)
        .catch(() => this.projectRoot);

      return realPath.startsWith(realRoot);
    } catch {
      return false;
    }
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

  // Helper: glob con cache LRU
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

    if (cached && now - cached.timestamp < MonorepoDetector.CACHE_TTL_MS) {
      this.logger.verbose(`Cache hit for pattern: ${pattern}`);
      return cached.results;
    }

    const results = await glob(pattern, options);
    this.globCache.set(cacheKey, {
      pattern,
      results,
      timestamp: now,
    });

    // Implementazione LRU: rimuovi entry più vecchia se superato limite
    if (this.globCache.size > MonorepoDetector.MAX_CACHE_ENTRIES) {
      const entries = Array.from(this.globCache.entries()).sort(
        (a, b) => a[1].timestamp - b[1].timestamp
      );
      const oldestEntry = entries[0];
      if (oldestEntry) {
        const oldestKey = oldestEntry[0];
        this.globCache.delete(oldestKey);
        this.logger.verbose(`Cache evicted oldest entry: ${oldestKey}`);
      }
    }

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

  // Helper: parse XML semplice per Maven (migliorato per gestire commenti)
  private parseSimpleXml(content: string, tagName: string): string[] | null {
    // Rimuovi commenti XML prima del parsing
    const cleanContent = content.replace(/<!--[\s\S]*?-->/g, '');

    const results: string[] = [];
    // Pattern più robusto che gestisce whitespace e newlines
    const tagPattern = new RegExp(
      `<${tagName}>\\s*([^<]+?)\\s*</${tagName}>`,
      'g'
    );
    let match;

    while ((match = tagPattern.exec(cleanContent)) !== null) {
      if (match[1]) {
        const value = match[1].trim();
        if (value) {
          results.push(value);
        }
      }
    }

    return results.length > 0 ? results : null;
  }

  private async detectLernaMonorepo(): Promise<MonorepoInfo> {
    const lernaPath = path.join(this.projectRoot, 'lerna.json');
    try {
      if (!(await this.fileExists(lernaPath))) {
        return this.emptyResult();
      }

      const lernaConfig = JSON.parse(await this.readFileSafe(lernaPath));
      const packages = lernaConfig.packages ||
        lernaConfig.workspaces || ['packages/*'];

      const workspaces = await this.findWorkspaces(packages);

      return {
        isMonorepo: true,
        tool: 'lerna',
        rootPath: this.projectRoot,
        workspaces: this.limitWorkspaces(workspaces),
        rootTechnologies: ['JavaScript', 'TypeScript'],
        crossLanguage: false,
      };
    } catch (error) {
      this.logger.debug('Lerna detection failed', error);
      return this.emptyResult();
    }
  }

  private async detectPnpmWorkspaces(): Promise<MonorepoInfo> {
    const pnpmPath = path.join(this.projectRoot, 'pnpm-workspace.yaml');
    try {
      if (!(await this.fileExists(pnpmPath))) {
        return this.emptyResult();
      }

      const content = await this.readFileSafe(pnpmPath);
      const rawConfig = yaml.load(content);

      // Validazione type-safe
      if (!rawConfig || typeof rawConfig !== 'object') {
        this.logger.warn('Invalid pnpm-workspace.yaml format');
        return this.emptyResult();
      }

      const config = rawConfig as PnpmWorkspaceConfig;
      const packages = Array.isArray(config.packages) ? config.packages : [];

      const workspaces = await this.findWorkspaces(packages);

      return {
        isMonorepo: true,
        tool: 'pnpm',
        rootPath: this.projectRoot,
        workspaces: this.limitWorkspaces(workspaces),
        rootTechnologies: ['JavaScript', 'TypeScript'],
        crossLanguage: false,
      };
    } catch (error) {
      this.logger.debug('pnpm detection failed', error);
      return this.emptyResult();
    }
  }

  private async detectYarnWorkspaces(): Promise<MonorepoInfo> {
    const packageJsonPath = path.join(this.projectRoot, 'package.json');
    try {
      if (!(await this.fileExists(packageJsonPath))) {
        return this.emptyResult();
      }

      const packageJson: PackageJson = JSON.parse(
        await this.readFileSafe(packageJsonPath)
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
        path.join(this.projectRoot, 'yarn.lock')
      );
      const tool = yarnLock ? 'yarn' : 'npm';

      return {
        isMonorepo: true,
        tool,
        rootPath: this.projectRoot,
        workspaces: this.limitWorkspaces(workspaces),
        rootTechnologies: ['JavaScript', 'TypeScript'],
        crossLanguage: false,
      };
    } catch (error) {
      this.logger.debug('Yarn/npm workspace detection failed', error);
      return this.emptyResult();
    }
  }

  private async detectGoWorkspace(): Promise<MonorepoInfo> {
    const goWorkPath = path.join(this.projectRoot, 'go.work');
    try {
      if (!(await this.fileExists(goWorkPath))) {
        return this.emptyResult();
      }

      const content = await this.readFileSafe(goWorkPath);
      const useModules: string[] = [];

      // Parse go.work file (formato semplice, migliore gestione commenti)
      const lines = content.split('\n');
      let inUseBlock = false;
      for (const line of lines) {
        const trimmed = line.trim();
        // Ignora commenti
        if (trimmed.startsWith('//') || trimmed.startsWith('#')) {
          continue;
        }

        if (trimmed.startsWith('use')) {
          inUseBlock = true;
          // Gestisci "use ./path"
          const match = trimmed.match(/use\s+(.+)/);
          if (match && match[1]) {
            const modulePath = match[1].replace(/[()]/g, '').trim();
            if (modulePath && !modulePath.startsWith('(')) {
              if (await this.isPathSafe(modulePath)) {
                useModules.push(modulePath);
              }
              continue;
            }
          }
        }
        if (inUseBlock) {
          if (trimmed === ')') {
            inUseBlock = false;
          } else if (trimmed && !trimmed.startsWith('//')) {
            const modulePath = trimmed.replace(/[()]/g, '').trim();
            if (modulePath && (await this.isPathSafe(modulePath))) {
              useModules.push(modulePath);
            }
          }
        }
      }

      // Parallelizza lettura moduli Go
      const workspacePromises = useModules.map(async (modulePath) => {
        const fullPath = path.join(this.projectRoot, modulePath);
        const goModPath = path.join(fullPath, 'go.mod');

        if (await this.fileExists(goModPath)) {
          const goModContent = await this.readFileSafe(goModPath);
          const moduleMatch = goModContent.match(/module\s+(.+)/);
          const moduleName =
            moduleMatch && moduleMatch[1] ? moduleMatch[1].trim() : modulePath;

          return {
            name: moduleName,
            path: modulePath,
            type: 'Go Module',
            technologies: ['Go'],
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
        tool: 'go-workspace',
        rootPath: this.projectRoot,
        workspaces: this.limitWorkspaces(workspaces),
        rootTechnologies: ['Go'],
        crossLanguage: false,
      };
    } catch (error) {
      this.logger.debug('Go workspace detection failed', error);
      return this.emptyResult();
    }
  }

  private async detectRustWorkspace(): Promise<MonorepoInfo> {
    const cargoTomlPath = path.join(this.projectRoot, 'Cargo.toml');
    try {
      if (!(await this.fileExists(cargoTomlPath))) {
        return this.emptyResult();
      }

      const content = await this.readFileSafe(cargoTomlPath);

      // Check per [workspace] section
      if (!content.includes('[workspace]')) {
        return this.emptyResult();
      }

      // Parse TOML semplice per trovare members
      const workspaceMatch = content.match(/\[workspace\]([\s\S]*?)(?=\n\[|$)/);
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
        .split(',')
        .map((m) => m.trim().replace(/['"]/g, ''))
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
        if (!(await this.isPathSafe(match))) return null;

        const cargoPath = path.join(this.projectRoot, match, 'Cargo.toml');
        if (await this.fileExists(cargoPath)) {
          const cargoContent = await this.readFileSafe(cargoPath);
          const nameMatch = cargoContent.match(/name\s*=\s*"(.+?)"/);
          const name =
            nameMatch && nameMatch[1] ? nameMatch[1] : path.basename(match);

          return {
            name,
            path: match,
            type: 'Rust Crate',
            technologies: ['Rust'],
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
        tool: 'cargo-workspace',
        rootPath: this.projectRoot,
        workspaces: this.limitWorkspaces(workspaces),
        rootTechnologies: ['Rust'],
        crossLanguage: false,
      };
    } catch (error) {
      this.logger.debug('Rust workspace detection failed', error);
      return this.emptyResult();
    }
  }

  private async detectMavenMultiModule(): Promise<MonorepoInfo> {
    const pomPath = path.join(this.projectRoot, 'pom.xml');
    try {
      if (!(await this.fileExists(pomPath))) {
        return this.emptyResult();
      }

      const content = await this.readFileSafe(pomPath);

      // Parse XML per trovare <modules>
      const modulesMatch = content.match(/<modules>([\s\S]*?)<\/modules>/);
      if (!modulesMatch || !modulesMatch[1]) {
        return this.emptyResult();
      }

      const modulesSection = modulesMatch[1];
      const modules = this.parseSimpleXml(modulesSection, 'module');

      if (!modules || modules.length === 0) {
        return this.emptyResult();
      }

      // Parallelizza lettura moduli Maven
      const workspacePromises = modules.map(async (modulePath) => {
        if (!(await this.isPathSafe(modulePath))) return null;

        const modulePomPath = path.join(
          this.projectRoot,
          modulePath,
          'pom.xml'
        );

        if (await this.fileExists(modulePomPath)) {
          const moduleContent = await this.readFileSafe(modulePomPath);
          const artifactIds = this.parseSimpleXml(moduleContent, 'artifactId');
          const artifactId = artifactIds?.[0] || path.basename(modulePath);

          return {
            name: artifactId,
            path: modulePath,
            type: 'Maven Module',
            technologies: ['Java'],
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
        tool: 'maven',
        rootPath: this.projectRoot,
        workspaces: this.limitWorkspaces(workspaces),
        rootTechnologies: ['Java'],
        crossLanguage: false,
      };
    } catch (error) {
      this.logger.debug('Maven multi-module detection failed', error);
      return this.emptyResult();
    }
  }

  private async detectGradleMultiProject(): Promise<MonorepoInfo> {
    const settingsPath = path.join(this.projectRoot, 'settings.gradle');
    const settingsKtsPath = path.join(this.projectRoot, 'settings.gradle.kts');

    try {
      let content = '';

      if (await this.fileExists(settingsPath)) {
        content = await this.readFileSafe(settingsPath);
      } else if (await this.fileExists(settingsKtsPath)) {
        content = await this.readFileSafe(settingsKtsPath);
      }

      if (!content) {
        return this.emptyResult();
      }

      // Parse include statements (supports: include 'app', include(":core", ":lib"))
      const includes: string[] = [];
      const includeRegex = /include\s+([^\n]+)/g;
      let match;
      while ((match = includeRegex.exec(content)) !== null) {
        const remainder = match[1]
          .replace(/[()]/g, '') // drop optional parentheses
          .trim();

        const parts = remainder.split(',').map((p) => p.trim());
        for (const part of parts) {
          if (!part) continue;
          const cleaned = part.replace(/^['"]|['"]$/g, '');
          if (cleaned) {
            includes.push(cleaned);
          }
        }
      }

      if (includes.length === 0) {
        return this.emptyResult();
      }

      // Parallelizza verifica progetti Gradle
      const workspacePromises = includes.map(async (projectPath) => {
        // Converti ":subproject" in "subproject"
        const relativePath = projectPath.replace(/^:/, '').replace(/:/g, '/');

        if (!(await this.isPathSafe(relativePath))) return null;

        const fullPath = path.join(this.projectRoot, relativePath);

        const buildGradle = await this.fileExists(
          path.join(fullPath, 'build.gradle')
        );
        const buildGradleKts = await this.fileExists(
          path.join(fullPath, 'build.gradle.kts')
        );

        if (buildGradle || buildGradleKts) {
          return {
            name: projectPath,
            path: relativePath,
            type: 'Gradle Project',
            technologies: ['Java', 'Kotlin'],
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
        tool: 'gradle',
        rootPath: this.projectRoot,
        workspaces: this.limitWorkspaces(workspaces),
        rootTechnologies: ['Java', 'Kotlin'],
        crossLanguage: false,
      };
    } catch (error) {
      this.logger.debug('Gradle multi-project detection failed', error);
      return this.emptyResult();
    }
  }

  private async detectPythonMonorepo(): Promise<MonorepoInfo> {
    const pyprojectPath = path.join(this.projectRoot, 'pyproject.toml');
    try {
      if (!(await this.fileExists(pyprojectPath))) {
        return this.emptyResult();
      }

      const content = await this.readFileSafe(pyprojectPath);

      // Poetry workspace support (experimental)
      if (content.includes('[tool.poetry.workspace]')) {
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
              .split(',')
              .map((m) => m.trim().replace(/['"]/g, ''))
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
              if (!(await this.isPathSafe(match))) return null;

              const pyprojectExists = await this.fileExists(
                path.join(this.projectRoot, match, 'pyproject.toml')
              );
              const setupExists = await this.fileExists(
                path.join(this.projectRoot, match, 'setup.py')
              );

              if (pyprojectExists || setupExists) {
                return {
                  name: path.basename(match),
                  path: match,
                  type: 'Python Package',
                  technologies: ['Python'],
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
                tool: 'poetry',
                rootPath: this.projectRoot,
                workspaces: this.limitWorkspaces(workspaces),
                rootTechnologies: ['Python'],
                crossLanguage: false,
              };
            }
          }
        }
      }

      // Fallback: cerca directory con setup.py o pyproject.toml
      const potentialPackages = await this.cachedGlob(
        '*/+(pyproject.toml|setup.py)',
        {
          cwd: this.projectRoot,
          absolute: false,
        }
      );

      // Usa costante per minimo packages
      if (potentialPackages.length >= MonorepoDetector.MIN_PYTHON_PACKAGES) {
        const workspaces: WorkspaceInfo[] = [];
        const seen = new Set<string>();

        for (const pkg of potentialPackages) {
          const dirName = path.dirname(pkg);
          if (!seen.has(dirName) && (await this.isPathSafe(dirName))) {
            seen.add(dirName);
            workspaces.push({
              name: dirName,
              path: dirName,
              type: 'Python Package',
              technologies: ['Python'],
              hasOwnPackageManager: true,
            });
          }
        }

        return {
          isMonorepo: true,
          tool: 'python-custom',
          rootPath: this.projectRoot,
          workspaces: this.limitWorkspaces(workspaces),
          rootTechnologies: ['Python'],
          crossLanguage: false,
        };
      }

      return this.emptyResult();
    } catch (error) {
      this.logger.debug('Python monorepo detection failed', error);
      return this.emptyResult();
    }
  }

  private async detectDotNetSolution(): Promise<MonorepoInfo> {
    try {
      const slnFiles = await this.cachedGlob('*.sln', {
        cwd: this.projectRoot,
        absolute: false,
      });

      if (slnFiles.length === 0 || !slnFiles[0]) {
        return this.emptyResult();
      }

      const slnPath = path.join(this.projectRoot, slnFiles[0]);
      const content = await this.readFileSafe(slnPath);

      // Parse .sln file per trovare progetti
      const projectPattern =
        /Project\("[^"]+"\)\s*=\s*"([^"]+)"\s*,\s*"([^"]+)"/g;
      const projects: Array<{ name: string; path: string }> = [];
      let match;

      while ((match = projectPattern.exec(content)) !== null) {
        if (!match[1] || !match[2]) continue;

        const projectName = match[1];
        const projectPath = match[2].replace(/\\/g, '/');

        // Verifica che sia un progetto C# (.csproj)
        if (projectPath.endsWith('.csproj')) {
          const projectDir = path.dirname(projectPath);
          if (await this.isPathSafe(projectDir)) {
            projects.push({
              name: projectName,
              path: projectDir,
            });
          }
        }
      }

      // Usa costante per minimo progetti
      if (projects.length < MonorepoDetector.MIN_DOTNET_PROJECTS) {
        return this.emptyResult();
      }

      const workspaces: WorkspaceInfo[] = projects.map((project) => ({
        name: project.name,
        path: project.path,
        type: 'C# Project',
        technologies: ['C#'],
        hasOwnPackageManager: true,
      }));

      return {
        isMonorepo: true,
        tool: 'dotnet-solution',
        rootPath: this.projectRoot,
        workspaces: this.limitWorkspaces(workspaces),
        rootTechnologies: ['C#'],
        crossLanguage: false,
      };
    } catch (error) {
      this.logger.debug('.NET solution detection failed', error);
      return this.emptyResult();
    }
  }

  private async detectNxMonorepo(): Promise<MonorepoInfo> {
    const nxPath = path.join(this.projectRoot, 'nx.json');
    try {
      if (!(await this.fileExists(nxPath))) {
        return this.emptyResult();
      }

      // Verifica che nx.json esista (configurazione validata implicitamente)
      await this.readFileSafe(nxPath);
      const packageJsonPath = path.join(this.projectRoot, 'package.json');

      if (!(await this.fileExists(packageJsonPath))) {
        return this.emptyResult();
      }

      const packageJson: PackageJson = JSON.parse(
        await this.readFileSafe(packageJsonPath)
      );
      const workspacesField = packageJson.workspaces;

      if (!workspacesField) {
        // Nx può usare project.json in ogni directory
        return this.emptyResult();
      }

      const packages = Array.isArray(workspacesField)
        ? workspacesField
        : workspacesField.packages || [];

      const workspaces = await this.findWorkspaces(packages);

      return {
        isMonorepo: true,
        tool: 'nx',
        rootPath: this.projectRoot,
        workspaces: this.limitWorkspaces(workspaces),
        rootTechnologies: ['JavaScript', 'TypeScript'],
        crossLanguage: false,
      };
    } catch (error) {
      this.logger.debug('Nx monorepo detection failed', error);
      return this.emptyResult();
    }
  }

  private async detectTurborepo(): Promise<MonorepoInfo> {
    const turboPath = path.join(this.projectRoot, 'turbo.json');
    try {
      if (!(await this.fileExists(turboPath))) {
        return this.emptyResult();
      }

      const packageJsonPath = path.join(this.projectRoot, 'package.json');

      if (!(await this.fileExists(packageJsonPath))) {
        return this.emptyResult();
      }

      const packageJson: PackageJson = JSON.parse(
        await this.readFileSafe(packageJsonPath)
      );
      const workspacesField = packageJson.workspaces;

      if (!workspacesField) {
        return this.emptyResult();
      }

      const packages = Array.isArray(workspacesField)
        ? workspacesField
        : workspacesField.packages || [];

      const workspaces = await this.findWorkspaces(packages);

      return {
        isMonorepo: true,
        tool: 'turborepo',
        rootPath: this.projectRoot,
        workspaces: this.limitWorkspaces(workspaces),
        rootTechnologies: ['JavaScript', 'TypeScript'],
        crossLanguage: false,
      };
    } catch (error) {
      this.logger.debug('Turborepo detection failed', error);
      return this.emptyResult();
    }
  }

  private async detectRushMonorepo(): Promise<MonorepoInfo> {
    const rushPath = path.join(this.projectRoot, 'rush.json');
    try {
      if (!(await this.fileExists(rushPath))) {
        return this.emptyResult();
      }

      const rushConfig = JSON.parse(await this.readFileSafe(rushPath));
      const projects = rushConfig.projects || [];

      if (projects.length === 0) {
        return this.emptyResult();
      }

      // Parallelizza lettura progetti Rush
      const workspacePromises = projects.map(async (project: any) => {
        const projectPath = project.projectFolder;
        if (!projectPath || !(await this.isPathSafe(projectPath))) {
          return null;
        }

        const packageJsonPath = path.join(
          this.projectRoot,
          projectPath,
          'package.json'
        );

        if (await this.fileExists(packageJsonPath)) {
          try {
            const packageJson: PackageJson = JSON.parse(
              await this.readFileSafe(packageJsonPath)
            );
            const name =
              packageJson.name ||
              project.packageName ||
              path.basename(projectPath);

            const technologies =
              this.detectTechnologiesFromPackageJson(packageJson);

            return {
              name,
              path: projectPath,
              type: 'NPM Package',
              technologies,
              hasOwnPackageManager: true,
            };
          } catch (error) {
            this.logger.debug(
              `Failed to parse package.json at ${projectPath}`,
              error
            );
            return null;
          }
        }
        return null;
      });

      const workspaceResults = await Promise.all(workspacePromises);
      const workspaces = workspaceResults.filter(
        (w): w is WorkspaceInfo => w !== null
      );

      return {
        isMonorepo: true,
        tool: 'rush',
        rootPath: this.projectRoot,
        workspaces: this.limitWorkspaces(workspaces),
        rootTechnologies: ['JavaScript', 'TypeScript'],
        crossLanguage: false,
      };
    } catch (error) {
      this.logger.debug('Rush monorepo detection failed', error);
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
        ignore: ['**/node_modules/**'],
      })
    );

    const results = await Promise.all(globPromises);
    results.forEach((matches) => allMatches.push(...matches));

    // Parallelizza lettura package.json
    const workspacePromises = allMatches.map(async (match) => {
      if (!(await this.isPathSafe(match))) return null;

      const packageJsonPath = path.join(
        this.projectRoot,
        match,
        'package.json'
      );

      if (await this.fileExists(packageJsonPath)) {
        try {
          const packageJson: PackageJson = JSON.parse(
            await this.readFileSafe(packageJsonPath)
          );
          const name = packageJson.name || path.basename(match);

          // Determina le tecnologie dal package.json
          const technologies =
            this.detectTechnologiesFromPackageJson(packageJson);

          return {
            name,
            path: match,
            type: 'NPM Package',
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
      technologies.add('TypeScript');
    } else {
      technologies.add('JavaScript');
    }

    // Frameworks Frontend
    if (allDeps.react) technologies.add('React');
    if (allDeps.vue) technologies.add('Vue');
    if (allDeps.angular || allDeps['@angular/core'])
      technologies.add('Angular');
    if (allDeps.next) technologies.add('Next.js');
    if (allDeps.svelte) technologies.add('Svelte');
    if (allDeps['solid-js']) technologies.add('SolidJS');
    if (allDeps['@solidjs/start']) technologies.add('SolidStart');
    if (allDeps['@remix-run/react']) technologies.add('Remix');
    if (allDeps.astro) technologies.add('Astro');
    if (allDeps.nuxt) technologies.add('Nuxt');
    if (allDeps.qwik) technologies.add('Qwik');
    if (allDeps['@builder.io/qwik-city']) technologies.add('Qwik City');

    // Frameworks Backend
    if (allDeps.express) technologies.add('Express');
    if (allDeps['@nestjs/core']) technologies.add('NestJS');
    if (allDeps.fastify) technologies.add('Fastify');
    if (allDeps.koa) technologies.add('Koa');
    if (allDeps.hapi || allDeps['@hapi/hapi']) technologies.add('Hapi');
    if (allDeps['@trpc/server']) technologies.add('tRPC');

    // Meta-frameworks & Tools
    if (allDeps.vite) technologies.add('Vite');
    if (allDeps.webpack) technologies.add('Webpack');
    if (allDeps.turbopack) technologies.add('Turbopack');
    if (allDeps.gatsby) technologies.add('Gatsby');
    if (allDeps['@11ty/eleventy']) technologies.add('Eleventy');

    return Array.from(technologies);
  }

  private isCrossLanguage(workspaces: WorkspaceInfo[]): boolean {
    const languageGroups = new Set<string>();

    for (const workspace of workspaces) {
      for (const tech of workspace.technologies) {
        // Raggruppa per linguaggio principale
        if (['JavaScript', 'TypeScript'].includes(tech)) {
          languageGroups.add('JS');
        } else if (['Python'].includes(tech)) {
          languageGroups.add('Python');
        } else if (['Java', 'Kotlin'].includes(tech)) {
          languageGroups.add('JVM');
        } else if (['Go'].includes(tech)) {
          languageGroups.add('Go');
        } else if (['Rust'].includes(tech)) {
          languageGroups.add('Rust');
        } else if (['C#'].includes(tech)) {
          languageGroups.add('DotNet');
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
    this.logger.verbose('Cache cleared');
  }
}
