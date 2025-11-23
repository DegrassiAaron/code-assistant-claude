import { WorkspaceState, ExecutionResult } from '../types';
import { promises as fs } from 'fs';
import path from 'path';
import * as os from 'os';

/**
 * Manages execution workspaces
 * Each workspace is an isolated environment for code execution
 */
export class WorkspaceManager {
  private workspaces: Map<string, WorkspaceState> = new Map();
  private baseDir: string;

  constructor(baseDir?: string) {
    this.baseDir = baseDir || path.join(os.tmpdir(), 'mcp-workspaces');
  }

  /**
   * Create new workspace
   */
  async createWorkspace(
    code: string,
    language: 'typescript' | 'python'
  ): Promise<WorkspaceState> {
    const id = this.generateWorkspaceId();
    const workspaceDir = path.join(this.baseDir, id);

    // Create workspace directory
    await fs.mkdir(workspaceDir, { recursive: true });

    const workspace: WorkspaceState = {
      id,
      createdAt: new Date(),
      lastAccessedAt: new Date(),
      code,
      language,
      status: 'pending'
    };

    this.workspaces.set(id, workspace);

    return workspace;
  }

  /**
   * Get workspace by ID
   */
  getWorkspace(id: string): WorkspaceState | undefined {
    const workspace = this.workspaces.get(id);

    if (workspace) {
      workspace.lastAccessedAt = new Date();
    }

    return workspace;
  }

  /**
   * Update workspace status
   */
  updateStatus(
    id: string,
    status: WorkspaceState['status'],
    result?: ExecutionResult
  ): void {
    const workspace = this.workspaces.get(id);

    if (workspace) {
      workspace.status = status;
      workspace.lastAccessedAt = new Date();
      if (result) {
        workspace.result = result;
      }
    }
  }

  /**
   * Get workspace directory path
   */
  getWorkspaceDir(id: string): string {
    return path.join(this.baseDir, id);
  }

  /**
   * Delete workspace
   */
  async deleteWorkspace(id: string): Promise<void> {
    const workspaceDir = this.getWorkspaceDir(id);

    try {
      await fs.rm(workspaceDir, { recursive: true, force: true });
      this.workspaces.delete(id);
    } catch (error) {
      console.error(`Failed to delete workspace ${id}:`, error);
    }
  }

  /**
   * Cleanup old workspaces
   */
  async cleanup(olderThanHours: number = 24): Promise<number> {
    const cutoff = new Date();
    cutoff.setHours(cutoff.getHours() - olderThanHours);

    let cleaned = 0;

    for (const [id, workspace] of this.workspaces.entries()) {
      if (workspace.lastAccessedAt < cutoff) {
        await this.deleteWorkspace(id);
        cleaned++;
      }
    }

    return cleaned;
  }

  /**
   * Get all workspaces
   */
  getAllWorkspaces(): WorkspaceState[] {
    return Array.from(this.workspaces.values());
  }

  /**
   * Get workspaces by status
   */
  getWorkspacesByStatus(status: WorkspaceState['status']): WorkspaceState[] {
    return Array.from(this.workspaces.values())
      .filter(w => w.status === status);
  }

  /**
   * Generate unique workspace ID
   */
  private generateWorkspaceId(): string {
    return `ws-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get workspace statistics
   */
  getStats(): {
    total: number;
    pending: number;
    running: number;
    completed: number;
    failed: number;
  } {
    const workspaces = Array.from(this.workspaces.values());

    return {
      total: workspaces.length,
      pending: workspaces.filter(w => w.status === 'pending').length,
      running: workspaces.filter(w => w.status === 'running').length,
      completed: workspaces.filter(w => w.status === 'completed').length,
      failed: workspaces.filter(w => w.status === 'failed').length
    };
  }
}
