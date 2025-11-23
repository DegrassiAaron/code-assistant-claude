import Docker from 'dockerode';
import { SandboxLogger, ConsoleLogger } from './sandbox-logger';

/**
 * Configuration for ContainerCleanupJob
 */
export interface CleanupJobConfig {
  maxAgeHours?: number;
  maxCleanupPerRun?: number;
  logger?: SandboxLogger;
}

/**
 * Background job to cleanup zombie containers
 * Periodically scans for old mcp-sandbox containers and removes them
 */
export class ContainerCleanupJob {
  private docker: Docker;
  private interval: NodeJS.Timeout | null = null;
  private isRunning: boolean = false;
  private cleanupInProgress: boolean = false;
  private readonly maxAgeHours: number;
  private readonly maxCleanupPerRun: number;
  private readonly logger: SandboxLogger;

  constructor(config: CleanupJobConfig = {}) {
    this.docker = new Docker();
    this.maxAgeHours = config.maxAgeHours ?? 1;
    this.maxCleanupPerRun = config.maxCleanupPerRun ?? 100;
    this.logger = config.logger || new ConsoleLogger();
  }

  /**
   * Start the periodic cleanup job
   * @param intervalMs - Interval in milliseconds between cleanup runs (default: 60000 = 1 minute)
   */
  start(intervalMs: number = 60000): void {
    if (this.isRunning) {
      this.logger.warn('ContainerCleanupJob is already running');
      return;
    }

    this.isRunning = true;
    this.logger.info('Starting container cleanup job', {
      intervalMs,
      maxAgeHours: this.maxAgeHours,
      maxPerRun: this.maxCleanupPerRun
    });

    // Run immediately on start
    this.cleanup().catch(error => {
      this.logger.error('Initial cleanup failed', error instanceof Error ? error : undefined);
    });

    // Then run periodically with concurrency protection
    this.interval = setInterval(async () => {
      // Skip if previous cleanup still running
      if (this.cleanupInProgress) {
        this.logger.warn('Skipping cleanup cycle - previous cleanup still in progress');
        return;
      }

      this.cleanupInProgress = true;
      try {
        await this.cleanup();
      } catch (error) {
        this.logger.error('Periodic cleanup failed', error instanceof Error ? error : undefined);
      } finally {
        this.cleanupInProgress = false;
      }
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
    this.logger.info('Container cleanup job stopped');
  }

  /**
   * Perform cleanup of zombie containers
   * Removes containers that:
   * - Have the mcp.sandbox=true label
   * - Are older than maxAgeHours
   */
  private async cleanup(): Promise<void> {
    const cleanupStartTime = Date.now();

    try {
      // List all containers with mcp.sandbox label
      const containers = await this.docker.listContainers({
        all: true,
        filters: {
          label: ['mcp.sandbox=true']
        }
      });

      const zombieCount = containers.filter(c => {
        const ageMs = Date.now() - (c.Created * 1000);
        const ageHours = ageMs / (1000 * 60 * 60);
        return ageHours > this.maxAgeHours;
      }).length;

      if (zombieCount > 0) {
        this.logger.info('Zombie containers found', { count: zombieCount });
        this.logger.metric('containers.zombies_found', zombieCount);
      }

      const now = Date.now();
      let cleanedCount = 0;

      for (const containerInfo of containers) {
        // Check batch limit
        if (cleanedCount >= this.maxCleanupPerRun) {
          this.logger.warn('Reached batch limit', {
            limit: this.maxCleanupPerRun,
            remaining: containers.length - cleanedCount
          });
          break;
        }

        // Calculate container age
        const created = new Date(containerInfo.Created * 1000);
        const ageMs = now - created.getTime();
        const ageHours = ageMs / (1000 * 60 * 60);

        // Remove containers older than threshold
        if (ageHours > this.maxAgeHours) {
          try {
            const language = containerInfo.Labels['mcp.sandbox.language'] || 'unknown';
            const containerId = containerInfo.Id.substring(0, 12);

            this.logger.info('Cleaning up zombie container', {
              containerId,
              language,
              ageHours: ageHours.toFixed(2)
            });

            const container = this.docker.getContainer(containerInfo.Id);

            // Force remove handles all states (running, stopped, paused, etc.)
            await container.remove({ force: true, v: true });

            cleanedCount++;
          } catch (error) {
            this.logger.error(
              'Failed to cleanup container',
              error instanceof Error ? error : undefined,
              { containerId: containerInfo.Id.substring(0, 12) }
            );
          }
        }
      }

      const cleanupDuration = Date.now() - cleanupStartTime;

      if (cleanedCount > 0) {
        this.logger.info('Cleanup job completed', {
          cleanedCount,
          durationMs: cleanupDuration
        });
        this.logger.metric('containers.cleaned', cleanedCount);
      }

      this.logger.metric('cleanup.duration_ms', cleanupDuration);

    } catch (error) {
      this.logger.error('Cleanup job failed', error instanceof Error ? error : undefined);
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
