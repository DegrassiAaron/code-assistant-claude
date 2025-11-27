import { execSync } from 'child_process';

export type GitWorkflow = 'gitflow' | 'github-flow' | 'trunk-based' | 'custom';

export interface GitConventions {
  workflow: GitWorkflow;
  branchPrefixes: string[];
  mainBranch: string;
  developBranch?: string;
  releaseBranches?: string[];
  hotfixPattern?: string;
}

export class GitWorkflowAnalyzer {
  async detect(projectRoot: string): Promise<GitConventions> {
    try {
      // Check if it's a git repository
      const isGitRepo = this.isGitRepository(projectRoot);
      if (!isGitRepo) {
        throw new Error('Not a git repository');
      }

      // Get all branches
      const branches = this.getAllBranches(projectRoot);

      // Detect workflow from branch patterns
      if (this.isGitFlow(branches)) {
        return this.detectGitFlowConventions(branches);
      } else if (this.isGitHubFlow(branches)) {
        return this.detectGitHubFlowConventions(branches);
      } else if (this.isTrunkBased(branches)) {
        return this.detectTrunkBasedConventions(branches);
      }

      return this.detectCustomWorkflow(branches);
    } catch (error) {
      throw new Error(
        'Git workflow detection failed: ' +
          (error instanceof Error ? error.message : 'Unknown error')
      );
    }
  }

  private isGitRepository(projectRoot: string): boolean {
    try {
      execSync('git rev-parse --git-dir', { cwd: projectRoot, stdio: 'pipe' });
      return true;
    } catch {
      return false;
    }
  }

  private getAllBranches(projectRoot: string): string[] {
    try {
      const output = execSync('git branch -a', {
        cwd: projectRoot,
        encoding: 'utf-8',
      });
      return output
        .split('\n')
        .map((line) => line.replace('*', '').trim())
        .filter((line) => line && !line.includes('HEAD'))
        .map((line) => line.replace(/^remotes\/origin\//, ''));
    } catch {
      return [];
    }
  }

  private isGitFlow(branches: string[]): boolean {
    // GitFlow has 'develop' branch and feature/release/hotfix patterns
    const hasDevelop = branches.some(
      (b) => b === 'develop' || b === 'development'
    );
    const hasFeatureBranches = branches.some(
      (b) =>
        b.startsWith('feature/') ||
        b.startsWith('release/') ||
        b.startsWith('hotfix/')
    );

    return hasDevelop && hasFeatureBranches;
  }

  private isGitHubFlow(branches: string[]): boolean {
    // GitHub Flow typically has main/master and feature branches without develop
    const hasMain = branches.some((b) => b === 'main' || b === 'master');
    const noDevelop = !branches.some(
      (b) => b === 'develop' || b === 'development'
    );
    const nonMainBranches = branches.filter(
      (b) => b !== 'main' && b !== 'master'
    );
    const hasFeatureBranches = branches.some(
      (b) =>
        b.includes('feature') ||
        b.includes('fix') ||
        b.includes('add') ||
        b.match(/^\d+/) // Issue numbers
    );

    return (
      hasMain && noDevelop && hasFeatureBranches && nonMainBranches.length > 0
    );
  }

  private isTrunkBased(branches: string[]): boolean {
    // Trunk-based has only main/master or very few short-lived branches
    const hasMain = branches.some(
      (b) => b === 'main' || b === 'master' || b === 'trunk'
    );
    const fewBranches = branches.length <= 3;

    return hasMain && fewBranches;
  }

  private detectGitFlowConventions(branches: string[]): GitConventions {
    const prefixes = this.extractBranchPrefixes(branches);

    return {
      workflow: 'gitflow',
      branchPrefixes: prefixes,
      mainBranch:
        branches.find((b) => b === 'main' || b === 'master') || 'main',
      developBranch:
        branches.find((b) => b === 'develop' || b === 'development') ||
        'develop',
      releaseBranches: branches.filter((b) => b.startsWith('release/')),
      hotfixPattern: 'hotfix/*',
    };
  }

  private detectGitHubFlowConventions(branches: string[]): GitConventions {
    const prefixes = this.extractBranchPrefixes(branches);

    return {
      workflow: 'github-flow',
      branchPrefixes: prefixes,
      mainBranch:
        branches.find((b) => b === 'main' || b === 'master') || 'main',
    };
  }

  private detectTrunkBasedConventions(branches: string[]): GitConventions {
    return {
      workflow: 'trunk-based',
      branchPrefixes: [],
      mainBranch:
        branches.find((b) => b === 'main' || b === 'master' || b === 'trunk') ||
        'main',
    };
  }

  private detectCustomWorkflow(branches: string[]): GitConventions {
    const prefixes = this.extractBranchPrefixes(branches);

    return {
      workflow: 'custom',
      branchPrefixes: prefixes,
      mainBranch:
        branches.find((b) => b === 'main' || b === 'master') || 'main',
    };
  }

  private extractBranchPrefixes(branches: string[]): string[] {
    const prefixes = new Set<string>();

    for (const branch of branches) {
      const parts = branch.split('/');
      if (parts.length > 1 && parts[0]) {
        prefixes.add(parts[0]);
      }
    }

    return Array.from(prefixes);
  }
}
