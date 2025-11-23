export class CleanupManager {
  private cleanupHandlers: Map<string, Array<() => Promise<void> | void>>;
  private autoCleanup: boolean;

  constructor(options: { autoCleanup?: boolean } = {}) {
    this.cleanupHandlers = new Map();
    this.autoCleanup = options.autoCleanup ?? false;
    if (this.autoCleanup) this.registerProcessHandlers();
  }

  registerCleanup(resourceId: string, handler: () => Promise<void> | void): void {
    if (!this.cleanupHandlers.has(resourceId)) {
      this.cleanupHandlers.set(resourceId, []);
    }
    this.cleanupHandlers.get(resourceId)!.push(handler);
  }

  hasCleanupHandler(resourceId: string): boolean {
    return this.cleanupHandlers.has(resourceId) && 
           this.cleanupHandlers.get(resourceId)!.length > 0;
  }

  removeCleanupHandler(resourceId: string): void {
    this.cleanupHandlers.delete(resourceId);
  }

  async cleanupResource(resourceId: string): Promise<void> {
    const handlers = this.cleanupHandlers.get(resourceId);
    if (!handlers) return;
    for (const handler of handlers) {
      try {
        await handler();
      } catch (error) {
        console.error(`Cleanup failed for ${resourceId}:`, error);
      }
    }
    this.cleanupHandlers.delete(resourceId);
  }

  async cleanup(): Promise<void> {
    const resourceIds = Array.from(this.cleanupHandlers.keys()).reverse();
    for (const resourceId of resourceIds) {
      await this.cleanupResource(resourceId);
    }
  }

  private registerProcessHandlers(): void {
    const cleanupAndExit = async (signal: string) => {
      console.log(`\nReceived ${signal}, cleaning up...`);
      await this.cleanup();
      process.exit(0);
    };
    process.on('exit', () => console.log('Process exiting...'));
    process.on('SIGINT', () => cleanupAndExit('SIGINT'));
    process.on('SIGTERM', () => cleanupAndExit('SIGTERM'));
  }
}
