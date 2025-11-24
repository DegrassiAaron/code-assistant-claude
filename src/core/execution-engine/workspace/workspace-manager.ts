/* eslint-disable @typescript-eslint/no-explicit-any */
import * as fs from "fs/promises";
import * as path from "path";

/**
 * WorkspaceManager - Manages workspace directories and session isolation
 */
export class WorkspaceManager {
  private workspaceDir: string;
  private sessions: Map<string, string>;

  constructor(workspaceDir: string = path.join(process.cwd(), ".workspace")) {
    this.workspaceDir = workspaceDir;
    this.sessions = new Map();
  }

  async initialize(): Promise<void> {
    try {
      await fs.access(this.workspaceDir);
    } catch {
      await fs.mkdir(this.workspaceDir, { recursive: true });
    }
  }

  async createSession(sessionId: string): Promise<string> {
    const sessionPath = path.join(this.workspaceDir, sessionId);
    try {
      await fs.access(sessionPath);
      throw new Error(`Session ${sessionId} already exists`);
    } catch (error: unknown) {
      if (error instanceof Error && error.message?.includes("already exists"))
        throw error;
    }
    await fs.mkdir(sessionPath, { recursive: true });
    this.sessions.set(sessionId, sessionPath);
    return sessionPath;
  }

  async cleanupSession(sessionId: string): Promise<void> {
    const sessionPath = path.join(this.workspaceDir, sessionId);
    try {
      await fs.rm(sessionPath, { recursive: true, force: true });
      this.sessions.delete(sessionId);
    } catch (_error) {
      // Ignore cleanup errors
    }
  }

  getSessionPath(sessionId: string): string {
    return path.join(this.workspaceDir, sessionId);
  }

  async listSessions(): Promise<string[]> {
    try {
      return await fs.readdir(this.workspaceDir);
    } catch {
      return [];
    }
  }

  async cleanupOldSessions(maxAge: number): Promise<number> {
    const sessions = await this.listSessions();
    let cleaned = 0;
    for (const session of sessions) {
      const sessionPath = path.join(this.workspaceDir, session);
      try {
        const stats = await fs.stat(sessionPath);
        if (Date.now() - stats.mtimeMs > maxAge) {
          await fs.rm(sessionPath, { recursive: true, force: true });
          this.sessions.delete(session);
          cleaned++;
        }
      } catch {
        // Ignore errors for individual session cleanup
      }
    }
    return cleaned;
  }

  createWorkspace(
    sessionId: string,
    _language?: string,
  ): { id: string; path: string } {
    return { id: sessionId, path: this.workspaceDir };
  }

  updateStatus(_sessionId: string, _status: string, _result?: any): void {
    // Update status logic
  }

  getStats(): { totalSessions: number; activeSessions: number } {
    return {
      totalSessions: this.sessions.size,
      activeSessions: this.sessions.size,
    };
  }
}
