import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { MonorepoDetector } from "../../../src/core/analyzers/monorepo-detector";
import { promises as fs } from "fs";
import * as path from "path";
import * as os from "os";

describe("MonorepoDetector", () => {
  let tempDir: string;

  beforeEach(async () => {
    // Crea una directory temporanea per ogni test
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "monorepo-test-"));
  });

  afterEach(async () => {
    // Pulisci la directory temporanea
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  describe("Lerna Monorepo Detection", () => {
    it("should detect a Lerna monorepo", async () => {
      const lernaConfig = {
        packages: ["packages/*"],
        version: "independent",
      };
      await fs.writeFile(
        path.join(tempDir, "lerna.json"),
        JSON.stringify(lernaConfig)
      );

      // Crea un workspace di esempio
      const packagesDir = path.join(tempDir, "packages");
      const package1Dir = path.join(packagesDir, "package1");
      await fs.mkdir(package1Dir, { recursive: true });
      await fs.writeFile(
        path.join(package1Dir, "package.json"),
        JSON.stringify({ name: "package1", version: "1.0.0" })
      );

      const detector = new MonorepoDetector(tempDir);
      const result = await detector.detect();

      expect(result.isMonorepo).toBe(true);
      expect(result.tool).toBe("lerna");
      expect(result.workspaces.length).toBeGreaterThan(0);
      expect(result.workspaces[0]?.name).toBe("package1");
    });
  });

  describe("pnpm Workspaces Detection", () => {
    it("should detect a pnpm workspace", async () => {
      const pnpmWorkspace = `packages:
  - 'packages/*'
  - 'apps/*'`;
      await fs.writeFile(
        path.join(tempDir, "pnpm-workspace.yaml"),
        pnpmWorkspace
      );

      // Crea workspaces
      const packagesDir = path.join(tempDir, "packages");
      const pkg1Dir = path.join(packagesDir, "pkg1");
      await fs.mkdir(pkg1Dir, { recursive: true });
      await fs.writeFile(
        path.join(pkg1Dir, "package.json"),
        JSON.stringify({ name: "@myorg/pkg1", version: "1.0.0" })
      );

      const detector = new MonorepoDetector(tempDir);
      const result = await detector.detect();

      expect(result.isMonorepo).toBe(true);
      expect(result.tool).toBe("pnpm");
      expect(result.workspaces.length).toBeGreaterThan(0);
    });
  });

  describe("Yarn/npm Workspaces Detection", () => {
    it("should detect Yarn workspaces", async () => {
      const packageJson = {
        name: "my-monorepo",
        private: true,
        workspaces: ["packages/*"],
      };
      await fs.writeFile(
        path.join(tempDir, "package.json"),
        JSON.stringify(packageJson)
      );
      await fs.writeFile(path.join(tempDir, "yarn.lock"), "");

      // Crea workspace
      const packagesDir = path.join(tempDir, "packages");
      const pkg1Dir = path.join(packagesDir, "web");
      await fs.mkdir(pkg1Dir, { recursive: true });
      await fs.writeFile(
        path.join(pkg1Dir, "package.json"),
        JSON.stringify({
          name: "web",
          dependencies: { react: "^18.0.0" },
        })
      );

      const detector = new MonorepoDetector(tempDir);
      const result = await detector.detect();

      expect(result.isMonorepo).toBe(true);
      expect(result.tool).toBe("yarn");
      expect(result.workspaces[0]?.technologies ?? []).toContain("React");
    });

    it("should detect npm workspaces", async () => {
      const packageJson = {
        name: "my-monorepo",
        private: true,
        workspaces: ["packages/*"],
      };
      await fs.writeFile(
        path.join(tempDir, "package.json"),
        JSON.stringify(packageJson)
      );
      await fs.writeFile(path.join(tempDir, "package-lock.json"), "{}");

      // Crea workspace
      const packagesDir = path.join(tempDir, "packages");
      const pkg1Dir = path.join(packagesDir, "api");
      await fs.mkdir(pkg1Dir, { recursive: true });
      await fs.writeFile(
        path.join(pkg1Dir, "package.json"),
        JSON.stringify({
          name: "api",
          dependencies: { express: "^4.0.0" },
        })
      );

      const detector = new MonorepoDetector(tempDir);
      const result = await detector.detect();

      expect(result.isMonorepo).toBe(true);
      expect(result.tool).toBe("npm");
      expect(result.workspaces[0]?.technologies ?? []).toContain("Express");
    });
  });

  describe("Go Workspace Detection", () => {
    it("should detect a Go workspace", async () => {
      const goWork = `go 1.21

use (
    ./service1
    ./service2
)`;
      await fs.writeFile(path.join(tempDir, "go.work"), goWork);

      // Crea moduli Go
      const service1Dir = path.join(tempDir, "service1");
      await fs.mkdir(service1Dir, { recursive: true });
      await fs.writeFile(
        path.join(service1Dir, "go.mod"),
        "module github.com/org/service1\n\ngo 1.21"
      );

      const service2Dir = path.join(tempDir, "service2");
      await fs.mkdir(service2Dir, { recursive: true });
      await fs.writeFile(
        path.join(service2Dir, "go.mod"),
        "module github.com/org/service2\n\ngo 1.21"
      );

      const detector = new MonorepoDetector(tempDir);
      const result = await detector.detect();

      expect(result.isMonorepo).toBe(true);
      expect(result.tool).toBe("go-workspace");
      expect(result.workspaces.length).toBe(2);
      expect(result.rootTechnologies).toContain("Go");
    });
  });

  describe("Rust Workspace Detection", () => {
    it("should detect a Cargo workspace", async () => {
      const cargoToml = `[workspace]
members = [
    "crate1",
    "crate2"
]

[workspace.package]
version = "0.1.0"
edition = "2021"`;
      await fs.writeFile(path.join(tempDir, "Cargo.toml"), cargoToml);

      // Crea crates
      const crate1Dir = path.join(tempDir, "crate1");
      await fs.mkdir(crate1Dir, { recursive: true });
      await fs.writeFile(
        path.join(crate1Dir, "Cargo.toml"),
        '[package]\nname = "crate1"\nversion = "0.1.0"'
      );

      const crate2Dir = path.join(tempDir, "crate2");
      await fs.mkdir(crate2Dir, { recursive: true });
      await fs.writeFile(
        path.join(crate2Dir, "Cargo.toml"),
        '[package]\nname = "crate2"\nversion = "0.1.0"'
      );

      const detector = new MonorepoDetector(tempDir);
      const result = await detector.detect();

      expect(result.isMonorepo).toBe(true);
      expect(result.tool).toBe("cargo-workspace");
      expect(result.workspaces.length).toBe(2);
      expect(result.rootTechnologies).toContain("Rust");
    });
  });

  describe("Maven Multi-Module Detection", () => {
    it("should detect a Maven multi-module project", async () => {
      const pomXml = `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.example</groupId>
  <artifactId>parent</artifactId>
  <version>1.0.0</version>
  <packaging>pom</packaging>

  <modules>
    <module>module1</module>
    <module>module2</module>
  </modules>
</project>`;
      await fs.writeFile(path.join(tempDir, "pom.xml"), pomXml);

      // Crea moduli
      const module1Dir = path.join(tempDir, "module1");
      await fs.mkdir(module1Dir, { recursive: true });
      const module1Pom = `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
  <modelVersion>4.0.0</modelVersion>
  <artifactId>module1</artifactId>
</project>`;
      await fs.writeFile(path.join(module1Dir, "pom.xml"), module1Pom);

      const detector = new MonorepoDetector(tempDir);
      const result = await detector.detect();

      expect(result.isMonorepo).toBe(true);
      expect(result.tool).toBe("maven");
      expect(result.workspaces.length).toBeGreaterThan(0);
      expect(result.rootTechnologies).toContain("Java");
    });
  });

  describe("Gradle Multi-Project Detection", () => {
    it("should detect a Gradle multi-project", async () => {
      const settingsGradle = `rootProject.name = 'my-project'

include 'subproject1'
include 'subproject2'`;
      await fs.writeFile(
        path.join(tempDir, "settings.gradle"),
        settingsGradle
      );

      // Crea subprojects
      const sub1Dir = path.join(tempDir, "subproject1");
      await fs.mkdir(sub1Dir, { recursive: true });
      await fs.writeFile(path.join(sub1Dir, "build.gradle"), "");

      const sub2Dir = path.join(tempDir, "subproject2");
      await fs.mkdir(sub2Dir, { recursive: true });
      await fs.writeFile(path.join(sub2Dir, "build.gradle"), "");

      const detector = new MonorepoDetector(tempDir);
      const result = await detector.detect();

      expect(result.isMonorepo).toBe(true);
      expect(result.tool).toBe("gradle");
      expect(result.workspaces.length).toBe(2);
    });
  });

  describe(".NET Solution Detection", () => {
    it("should detect a .NET solution with multiple projects", async () => {
      const slnContent = `
Microsoft Visual Studio Solution File, Format Version 12.00
Project("{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}") = "Project1", "Project1\\Project1.csproj", "{GUID1}"
EndProject
Project("{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}") = "Project2", "Project2\\Project2.csproj", "{GUID2}"
EndProject`;
      await fs.writeFile(path.join(tempDir, "MySolution.sln"), slnContent);

      const detector = new MonorepoDetector(tempDir);
      const result = await detector.detect();

      expect(result.isMonorepo).toBe(true);
      expect(result.tool).toBe("dotnet-solution");
      expect(result.workspaces.length).toBe(2);
      const firstWorkspace = result.workspaces[0];
      expect(firstWorkspace?.name).toBe("Project1");
      expect(firstWorkspace?.technologies ?? []).toContain("C#");
    });
  });

  describe("Cross-Language Detection", () => {
    it("should detect cross-language monorepos", async () => {
      // Crea un monorepo con Go workspace che include anche progetti JS
      const goWork = `go 1.21

use ./backend`;
      await fs.writeFile(path.join(tempDir, "go.work"), goWork);

      // Backend Go
      const backendDir = path.join(tempDir, "backend");
      await fs.mkdir(backendDir, { recursive: true });
      await fs.writeFile(
        path.join(backendDir, "go.mod"),
        "module github.com/org/backend\n\ngo 1.21"
      );

      const detector = new MonorepoDetector(tempDir);
      const result = await detector.detect();

      expect(result.isMonorepo).toBe(true);
      expect(result.tool).toBe("go-workspace");
    });
  });

  describe("Single Project Detection", () => {
    it("should not detect a single project as monorepo", async () => {
      const packageJson = {
        name: "single-project",
        version: "1.0.0",
      };
      await fs.writeFile(
        path.join(tempDir, "package.json"),
        JSON.stringify(packageJson)
      );

      const detector = new MonorepoDetector(tempDir);
      const result = await detector.detect();

      expect(result.isMonorepo).toBe(false);
      expect(result.workspaces.length).toBe(0);
    });

    it("should not detect a .NET solution with only one project as monorepo", async () => {
      const slnContent = `
Microsoft Visual Studio Solution File, Format Version 12.00
Project("{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}") = "SingleProject", "SingleProject\\SingleProject.csproj", "{GUID1}"
EndProject`;
      await fs.writeFile(path.join(tempDir, "MySolution.sln"), slnContent);

      const detector = new MonorepoDetector(tempDir);
      const result = await detector.detect();

      expect(result.isMonorepo).toBe(false);
    });
  });

  describe("Python Monorepo Detection", () => {
    it("should detect Python monorepo with multiple packages", async () => {
      // Crea pyproject.toml root
      await fs.writeFile(
        path.join(tempDir, "pyproject.toml"),
        "[tool.poetry]\nname = \"root\""
      );

      // Crea multiple package directories
      for (let i = 1; i <= 3; i++) {
        const pkgDir = path.join(tempDir, `package${i}`);
        await fs.mkdir(pkgDir, { recursive: true });
        await fs.writeFile(
          path.join(pkgDir, "setup.py"),
          `from setuptools import setup\nsetup(name='package${i}')`
        );
      }

      const detector = new MonorepoDetector(tempDir);
      const result = await detector.detect();

      expect(result.isMonorepo).toBe(true);
      expect(result.tool).toBe("python-custom");
      expect(result.workspaces.length).toBeGreaterThanOrEqual(3);
    });
  });
});
