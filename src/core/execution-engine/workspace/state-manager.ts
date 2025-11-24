import { WorkspaceState } from "../types";
import { promises as fs } from "fs";
import path from "path";

/**
 * Manages persistence of workspace state
 */
export class StateManager {
  private stateFile: string;

  constructor(stateFile?: string) {
    this.stateFile = stateFile || path.join(process.cwd(), ".mcp-state.json");
  }

  /**
   * Save workspace state to disk
   */
  async saveState(workspaces: Map<string, WorkspaceState>): Promise<void> {
    const state = {
      version: "1.0.0",
      savedAt: new Date().toISOString(),
      workspaces: Array.from(workspaces.entries()).map(
        ([workspaceId, workspace]) => ({
          id: workspaceId,
          ...workspace,
          createdAt: workspace.createdAt.toISOString(),
          lastAccessedAt: workspace.lastAccessedAt.toISOString(),
        }),
      ),
    };

    await fs.writeFile(this.stateFile, JSON.stringify(state, null, 2));
  }

  /**
   * Load workspace state from disk
   */
  async loadState(): Promise<Map<string, WorkspaceState>> {
    try {
      const content = await fs.readFile(this.stateFile, "utf-8");
      const state = JSON.parse(content);

      const workspaces = new Map<string, WorkspaceState>();

      for (const workspace of state.workspaces) {
        workspaces.set(workspace.id, {
          ...workspace,
          createdAt: new Date(workspace.createdAt),
          lastAccessedAt: new Date(workspace.lastAccessedAt),
        });
      }

      return workspaces;
    } catch (error) {
      // State file doesn't exist or is invalid
      return new Map();
    }
  }

  /**
   * Clear saved state
   */
  async clearState(): Promise<void> {
    try {
      await fs.unlink(this.stateFile);
    } catch (error) {
      // File doesn't exist, ignore
    }
  }

  /**
   * Check if state file exists
   */
  async exists(): Promise<boolean> {
    try {
      await fs.access(this.stateFile);
      return true;
    } catch {
      return false;
    }
  }
}
