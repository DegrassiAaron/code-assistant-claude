import { WorkspaceManager } from './workspace-manager';
import { CacheManager } from './cache-manager';

/**
 * Manages cleanup of workspaces and cache
 */
export class CleanupManager {
  private workspaceManager: WorkspaceManager;
  private cacheManager: CacheManager;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(workspaceManager: WorkspaceManager, cacheManager: CacheManager) {
    this.workspaceManager = workspaceManager;
    this.cacheManager = cacheManager;
  }

  /**
   * Start automatic cleanup
   */
  startAutoCleanup(intervalMinutes: number = 60): void {
    if (this.cleanupInterval) {
      this.stopAutoCleanup();
    }

    this.cleanupInterval = setInterval(
      () => this.performCleanup(),
      intervalMinutes * 60 * 1000
    );

    console.log(`✓ Auto-cleanup started (every ${intervalMinutes} minutes)`);
  }

  /**
   * Stop automatic cleanup
   */
  stopAutoCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
      console.log('✓ Auto-cleanup stopped');
    }
  }

  /**
   * Perform cleanup
   */
  async performCleanup(): Promise<CleanupResult> {
    console.log('Running cleanup...');

    const startTime = Date.now();

    // Cleanup old workspaces (older than 24 hours)
    const workspacesRemoved = await this.workspaceManager.cleanup(24);

    // Cleanup expired cache entries
    const cacheEntriesRemoved = this.cacheManager.cleanup();

    const duration = Date.now() - startTime;

    const result: CleanupResult = {
      workspacesRemoved,
      cacheEntriesRemoved,
      duration,
      timestamp: new Date()
    };

    console.log(`✓ Cleanup completed:`, result);

    return result;
  }

  /**
   * Force cleanup of all resources
   */
  async forceCleanup(): Promise<CleanupResult> {
    console.log('Running force cleanup...');

    const startTime = Date.now();

    // Get all workspaces
    const allWorkspaces = this.workspaceManager.getAllWorkspaces();

    // Delete all workspaces
    let workspacesRemoved = 0;
    for (const workspace of allWorkspaces) {
      await this.workspaceManager.deleteWorkspace(workspace.id);
      workspacesRemoved++;
    }

    // Clear all cache
    this.cacheManager.clear();
    const cacheEntriesRemoved = 0; // Already cleared

    const duration = Date.now() - startTime;

    const result: CleanupResult = {
      workspacesRemoved,
      cacheEntriesRemoved,
      duration,
      timestamp: new Date()
    };

    console.log(`✓ Force cleanup completed:`, result);

    return result;
  }

  /**
   * Get cleanup statistics
   */
  getStats(): {
    autoCleanupEnabled: boolean;
    lastCleanup?: Date;
    workspaceStats: ReturnType<WorkspaceManager['getStats']>;
    cacheStats: ReturnType<CacheManager['getStats']>;
  } {
    return {
      autoCleanupEnabled: this.cleanupInterval !== null,
      workspaceStats: this.workspaceManager.getStats(),
      cacheStats: this.cacheManager.getStats()
    };
  }
}

/**
 * Cleanup result
 */
export interface CleanupResult {
  workspacesRemoved: number;
  cacheEntriesRemoved: number;
  duration: number;
  timestamp: Date;
}
