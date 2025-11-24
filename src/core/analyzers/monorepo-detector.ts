import { promises as fs } from "fs";
import * as path from "path";
import { glob } from "glob";
import * as yaml from "js-yaml";

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
}

export class MonorepoDetector {
  constructor(private projectRoot: string) {}

  async detect(): Promise<MonorepoInfo> {
    const result: MonorepoInfo = {
      isMonorepo: false,
      rootPath: this.projectRoot,
      workspaces: [],
      rootTechnologies: [],
      crossLanguage: false,
    };

    // Rileva diversi tipi di monorepo
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
      const detected = await detector();
      if (detected.isMonorepo) {
        Object.assign(result, detected);
        break;
      }
    }

    // Determina se è cross-language
    if (result.isMonorepo) {
      result.crossLanguage = this.isCrossLanguage(result.workspaces);
    }

    return result;
  }

  private async detectLernaMonorepo(): Promise<MonorepoInfo> {
    const lernaPath = path.join(this.projectRoot, "lerna.json");
    try {
      const exists = await fs
        .access(lernaPath)
        .then(() => true)
        .catch(() => false);
      if (!exists) {
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
        workspaces,
        rootTechnologies: ["JavaScript", "TypeScript"],
        crossLanguage: false,
      };
    } catch (error) {
      return this.emptyResult();
    }
  }

  private async detectPnpmWorkspaces(): Promise<MonorepoInfo> {
    const pnpmPath = path.join(this.projectRoot, "pnpm-workspace.yaml");
    try {
      const exists = await fs
        .access(pnpmPath)
        .then(() => true)
        .catch(() => false);
      if (!exists) {
        return this.emptyResult();
      }

      const content = await fs.readFile(pnpmPath, "utf-8");
      const config = yaml.load(content) as any;
      const packages = config.packages || [];

      const workspaces = await this.findWorkspaces(packages);

      return {
        isMonorepo: true,
        tool: "pnpm",
        rootPath: this.projectRoot,
        workspaces,
        rootTechnologies: ["JavaScript", "TypeScript"],
        crossLanguage: false,
      };
    } catch (error) {
      return this.emptyResult();
    }
  }

  private async detectYarnWorkspaces(): Promise<MonorepoInfo> {
    const packageJsonPath = path.join(this.projectRoot, "package.json");
    try {
      const exists = await fs
        .access(packageJsonPath)
        .then(() => true)
        .catch(() => false);
      if (!exists) {
        return this.emptyResult();
      }

      const packageJson = JSON.parse(
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
      const yarnLock = await fs
        .access(path.join(this.projectRoot, "yarn.lock"))
        .then(() => true)
        .catch(() => false);
      const tool = yarnLock ? "yarn" : "npm";

      return {
        isMonorepo: true,
        tool,
        rootPath: this.projectRoot,
        workspaces,
        rootTechnologies: ["JavaScript", "TypeScript"],
        crossLanguage: false,
      };
    } catch (error) {
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
      const exists = await fs
        .access(goWorkPath)
        .then(() => true)
        .catch(() => false);
      if (!exists) {
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
              useModules.push(modulePath);
              continue;
            }
          }
        }
        if (inUseBlock) {
          if (trimmed === ")") {
            inUseBlock = false;
          } else if (trimmed && !trimmed.startsWith("//")) {
            useModules.push(trimmed.replace(/[()]/g, "").trim());
          }
        }
      }

      const workspaces: WorkspaceInfo[] = [];
      for (const modulePath of useModules) {
        const fullPath = path.join(this.projectRoot, modulePath);
        const goModPath = path.join(fullPath, "go.mod");
        const exists = await fs
          .access(goModPath)
          .then(() => true)
          .catch(() => false);
        if (exists) {
          const goModContent = await fs.readFile(goModPath, "utf-8");
          const moduleMatch = goModContent.match(/module\s+(.+)/);
          const moduleName = moduleMatch && moduleMatch[1] ? moduleMatch[1].trim() : modulePath;

          workspaces.push({
            name: moduleName,
            path: modulePath,
            type: "Go Module",
            technologies: ["Go"],
            hasOwnPackageManager: true,
          });
        }
      }

      return {
        isMonorepo: true,
        tool: "go-workspace",
        rootPath: this.projectRoot,
        workspaces,
        rootTechnologies: ["Go"],
        crossLanguage: false,
      };
    } catch (error) {
      return this.emptyResult();
    }
  }

  private async detectRustWorkspace(): Promise<MonorepoInfo> {
    const cargoTomlPath = path.join(this.projectRoot, "Cargo.toml");
    try {
      const exists = await fs
        .access(cargoTomlPath)
        .then(() => true)
        .catch(() => false);
      if (!exists) {
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

      const workspaces: WorkspaceInfo[] = [];
      for (const memberPattern of members) {
        // Gestisci pattern glob come "crates/*"
        const matches = await glob(memberPattern, {
          cwd: this.projectRoot,
          absolute: false,
        });

        for (const match of matches) {
          const cargoPath = path.join(this.projectRoot, match, "Cargo.toml");
          const exists = await fs
            .access(cargoPath)
            .then(() => true)
            .catch(() => false);
          if (exists) {
            const cargoContent = await fs.readFile(cargoPath, "utf-8");
            const nameMatch = cargoContent.match(/name\s*=\s*"(.+?)"/);
            const name = nameMatch && nameMatch[1] ? nameMatch[1] : path.basename(match);

            workspaces.push({
              name,
              path: match,
              type: "Rust Crate",
              technologies: ["Rust"],
              hasOwnPackageManager: true,
            });
          }
        }
      }

      return {
        isMonorepo: true,
        tool: "cargo-workspace",
        rootPath: this.projectRoot,
        workspaces,
        rootTechnologies: ["Rust"],
        crossLanguage: false,
      };
    } catch (error) {
      return this.emptyResult();
    }
  }

  private async detectMavenMultiModule(): Promise<MonorepoInfo> {
    const pomPath = path.join(this.projectRoot, "pom.xml");
    try {
      const exists = await fs
        .access(pomPath)
        .then(() => true)
        .catch(() => false);
      if (!exists) {
        return this.emptyResult();
      }

      const content = await fs.readFile(pomPath, "utf-8");

      // Parse XML con regex per trovare <modules>
      const modulesMatch = content.match(
        /<modules>([\s\S]*?)<\/modules>/
      );
      if (!modulesMatch || !modulesMatch[1]) {
        return this.emptyResult();
      }

      const modulesSection = modulesMatch[1];
      const modulePattern = /<module>([^<]+)<\/module>/g;
      const modules: string[] = [];
      let match;
      while ((match = modulePattern.exec(modulesSection)) !== null) {
        if (match[1]) {
          modules.push(match[1].trim());
        }
      }

      if (modules.length === 0) {
        return this.emptyResult();
      }

      const workspaces: WorkspaceInfo[] = [];
      for (const modulePath of modules) {
        const modulePomPath = path.join(
          this.projectRoot,
          modulePath,
          "pom.xml"
        );
        const exists = await fs
          .access(modulePomPath)
          .then(() => true)
          .catch(() => false);
        if (exists) {
          const moduleContent = await fs.readFile(modulePomPath, "utf-8");
          // Estrai artifactId con regex
          const artifactIdMatch = moduleContent.match(
            /<artifactId>([^<]+)<\/artifactId>/
          );
          const artifactId = artifactIdMatch && artifactIdMatch[1]
            ? artifactIdMatch[1].trim()
            : path.basename(modulePath);

          workspaces.push({
            name: artifactId,
            path: modulePath,
            type: "Maven Module",
            technologies: ["Java"],
            hasOwnPackageManager: true,
          });
        }
      }

      return {
        isMonorepo: true,
        tool: "maven",
        rootPath: this.projectRoot,
        workspaces,
        rootTechnologies: ["Java"],
        crossLanguage: false,
      };
    } catch (error) {
      return this.emptyResult();
    }
  }

  private async detectGradleMultiProject(): Promise<MonorepoInfo> {
    const settingsPath = path.join(this.projectRoot, "settings.gradle");
    const settingsKtsPath = path.join(this.projectRoot, "settings.gradle.kts");

    try {
      let content = "";
      let exists = false;

      // Prova settings.gradle
      exists = await fs
        .access(settingsPath)
        .then(() => true)
        .catch(() => false);
      if (exists) {
        content = await fs.readFile(settingsPath, "utf-8");
      } else {
        // Prova settings.gradle.kts
        exists = await fs
          .access(settingsKtsPath)
          .then(() => true)
          .catch(() => false);
        if (exists) {
          content = await fs.readFile(settingsKtsPath, "utf-8");
        }
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

      const workspaces: WorkspaceInfo[] = [];
      for (const projectPath of includes) {
        // Converti ":subproject" in "subproject"
        const relativePath = projectPath.replace(/^:/, "").replace(/:/g, "/");
        const fullPath = path.join(this.projectRoot, relativePath);

        const buildGradle = await fs
          .access(path.join(fullPath, "build.gradle"))
          .then(() => true)
          .catch(() => false);
        const buildGradleKts = await fs
          .access(path.join(fullPath, "build.gradle.kts"))
          .then(() => true)
          .catch(() => false);

        if (buildGradle || buildGradleKts) {
          workspaces.push({
            name: projectPath,
            path: relativePath,
            type: "Gradle Project",
            technologies: ["Java", "Kotlin"],
            hasOwnPackageManager: true,
          });
        }
      }

      return {
        isMonorepo: true,
        tool: "gradle",
        rootPath: this.projectRoot,
        workspaces,
        rootTechnologies: ["Java", "Kotlin"],
        crossLanguage: false,
      };
    } catch (error) {
      return this.emptyResult();
    }
  }

  private async detectPythonMonorepo(): Promise<MonorepoInfo> {
    // Python monorepo è più complesso, spesso basato su convenzioni
    // Cerchiamo pyproject.toml con workspace o setup.py con multiple packages

    const pyprojectPath = path.join(this.projectRoot, "pyproject.toml");
    try {
      const exists = await fs
        .access(pyprojectPath)
        .then(() => true)
        .catch(() => false);
      if (!exists) {
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

            const workspaces: WorkspaceInfo[] = [];
            for (const memberPattern of members) {
              const matches = await glob(memberPattern, {
                cwd: this.projectRoot,
                absolute: false,
              });

              for (const match of matches) {
                const pyprojectExists = await fs
                  .access(path.join(this.projectRoot, match, "pyproject.toml"))
                  .then(() => true)
                  .catch(() => false);
                const setupExists = await fs
                  .access(path.join(this.projectRoot, match, "setup.py"))
                  .then(() => true)
                  .catch(() => false);

                if (pyprojectExists || setupExists) {
                  workspaces.push({
                    name: path.basename(match),
                    path: match,
                    type: "Python Package",
                    technologies: ["Python"],
                    hasOwnPackageManager: true,
                  });
                }
              }
            }

            if (workspaces.length > 0) {
              return {
                isMonorepo: true,
                tool: "poetry",
                rootPath: this.projectRoot,
                workspaces,
                rootTechnologies: ["Python"],
                crossLanguage: false,
              };
            }
          }
        }
      }

      // Fallback: cerca directory con setup.py o pyproject.toml
      const potentialPackages = await glob("*/+(pyproject.toml|setup.py)", {
        cwd: this.projectRoot,
        absolute: false,
      });

      if (potentialPackages.length > 2) {
        // Almeno 3 package per considerarlo monorepo
        const workspaces: WorkspaceInfo[] = [];
        const seen = new Set<string>();

        for (const pkg of potentialPackages) {
          const dirName = path.dirname(pkg);
          if (!seen.has(dirName)) {
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
          workspaces,
          rootTechnologies: ["Python"],
          crossLanguage: false,
        };
      }

      return this.emptyResult();
    } catch (error) {
      return this.emptyResult();
    }
  }

  private async detectDotNetSolution(): Promise<MonorepoInfo> {
    // Cerca file .sln che definiscono una solution con multiple progetti
    const slnFiles = await glob("*.sln", {
      cwd: this.projectRoot,
      absolute: false,
    });

    if (slnFiles.length === 0 || !slnFiles[0]) {
      return this.emptyResult();
    }

    try {
      // Prendi il primo .sln file (dovrebbe essercene solo uno nel root)
      const slnPath = path.join(this.projectRoot, slnFiles[0]);
      const content = await fs.readFile(slnPath, "utf-8");

      // Parse .sln file per trovare progetti
      // Formato: Project("{GUID}") = "ProjectName", "RelativePath\ProjectName.csproj", "{ProjectGUID}"
      const projectPattern =
        /Project\("[^"]+"\)\s*=\s*"([^"]+)"\s*,\s*"([^"]+)"/g;
      const projects: Array<{ name: string; path: string }> = [];
      let match;

      while ((match = projectPattern.exec(content)) !== null) {
        if (!match[1] || !match[2]) continue;

        const projectName = match[1];
        const projectPath = match[2].replace(/\\/g, "/"); // Converti backslash in forward slash

        // Verifica che sia un progetto C# (.csproj)
        if (projectPath.endsWith(".csproj")) {
          projects.push({
            name: projectName,
            path: path.dirname(projectPath),
          });
        }
      }

      // Deve avere almeno 2 progetti per essere considerato monorepo
      if (projects.length < 2) {
        return this.emptyResult();
      }

      const workspaces: WorkspaceInfo[] = [];
      for (const project of projects) {
        workspaces.push({
          name: project.name,
          path: project.path,
          type: "C# Project",
          technologies: ["C#"],
          hasOwnPackageManager: true,
        });
      }

      return {
        isMonorepo: true,
        tool: "dotnet-solution",
        rootPath: this.projectRoot,
        workspaces,
        rootTechnologies: ["C#"],
        crossLanguage: false,
      };
    } catch (error) {
      return this.emptyResult();
    }
  }

  private async findWorkspaces(
    patterns: string[]
  ): Promise<WorkspaceInfo[]> {
    const workspaces: WorkspaceInfo[] = [];

    for (const pattern of patterns) {
      const matches = await glob(pattern, {
        cwd: this.projectRoot,
        absolute: false,
        ignore: ["**/node_modules/**"],
      });

      for (const match of matches) {
        const packageJsonPath = path.join(
          this.projectRoot,
          match,
          "package.json"
        );
        const exists = await fs
          .access(packageJsonPath)
          .then(() => true)
          .catch(() => false);
        if (exists) {
          const packageJson = JSON.parse(
            await fs.readFile(packageJsonPath, "utf-8")
          );
          const name = packageJson.name || path.basename(match);

          // Determina le tecnologie dal package.json
          const technologies = this.detectTechnologiesFromPackageJson(packageJson);

          workspaces.push({
            name,
            path: match,
            type: "NPM Package",
            technologies,
            hasOwnPackageManager: true,
          });
        }
      }
    }

    return workspaces;
  }

  private detectTechnologiesFromPackageJson(packageJson: any): string[] {
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
    const uniqueTechs = new Set<string>();
    const languageGroups = new Set<string>();

    for (const workspace of workspaces) {
      for (const tech of workspace.technologies) {
        uniqueTechs.add(tech);

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
}
