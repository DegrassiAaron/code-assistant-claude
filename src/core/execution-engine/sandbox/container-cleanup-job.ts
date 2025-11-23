import Docker from 'dockerode';

/**
 * Background job to cleanup zombie containers
 * Periodically scans for old mcp-sandbox containers and removes them
 */
export class ContainerCleanupJob {
  private docker: Docker;
  private interval: NodeJS.Timeout | null = null;
  private isRunning: boolean = false;

  constructor() {
    this.docker = new Docker();
  }

  /**
   * Start the periodic cleanup job
   * @param intervalMs - Interval in milliseconds between cleanup runs (default: 60000 = 1 minute)
   */
  start(intervalMs: number = 60000): void {
    if (this.isRunning) {
      console.warn('ContainerCleanupJob is already running');
      return;
    }

    this.isRunning = true;
    console.log(`Starting container cleanup job with ${intervalMs}ms interval`);

    // Run immediately on start
    this.cleanup().catch(error => {
      console.error('Initial cleanup failed:', error);
    });

    // Then run periodically
    this.interval = setInterval(() => {
      this.cleanup().catch(error => {
        console.error('Periodic cleanup failed:', error);
      });
    }, intervalMs);
  }

  /**
   * Stop the periodic cleanup job
   */
  stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.isRunning = false;
    console.log('Container cleanup job stopped');
  }

  /**
   * Perform cleanup of zombie containers
   * Removes containers that:
   * - Match the mcp-sandbox image pattern
   * - Are older than 1 hour
   */
  private async cleanup(): Promise<void> {
    try {
      const containers = await this.docker.listContainers({ all: true });
      const now = Date.now();
      let cleanedCount = 0;

      for (const containerInfo of containers) {
        // Check if this is an mcp-sandbox container
        const isSandboxContainer =
          containerInfo.Image.includes('mcp-sandbox') ||
          containerInfo.Image.includes('node:18-alpine') ||
          containerInfo.Image.includes('python:3.11-alpine');

        if (!isSandboxContainer) {
          continue;
        }

        // Calculate container age
        const created = new Date(containerInfo.Created * 1000);
        const ageMs = now - created.getTime();
        const ageHours = ageMs / (1000 * 60 * 60);

        // Remove containers older than 1 hour
        if (ageHours > 1) {
          try {
            console.log(`Cleaning up zombie container: ${containerInfo.Id} (age: ${ageHours.toFixed(2)} hours)`);

            const container = this.docker.getContainer(containerInfo.Id);

            // Stop if running
            if (containerInfo.State === 'running') {
              await container.stop({ t: 0 });
            }

            // Force remove
            await container.remove({ force: true, v: true });

            cleanedCount++;
          } catch (error) {
            console.error(`Failed to cleanup container ${containerInfo.Id}:`, error);
          }
        }
      }

      if (cleanedCount > 0) {
        console.log(`Cleanup job removed ${cleanedCount} zombie container(s)`);
      }
    } catch (error) {
      console.error('Cleanup job failed:', error);
    }
  }

  /**
   * Run a one-time cleanup immediately
   * Useful for manual cleanup or testing
   */
  async runOnce(): Promise<void> {
    await this.cleanup();
  }

  /**
   * Get cleanup job status
   */
  getStatus(): { isRunning: boolean } {
    return { isRunning: this.isRunning };
  }
}
