/**
 * Resource limiter for sandbox execution
 * Enforces CPU, memory, disk, and timeout limits
 */
export class ResourceLimiter {
  /**
   * Parse memory string to bytes
   */
  parseMemory(memory: string): number {
    const match = memory.match(/^(\d+)([KMG])$/);
    if (!match) {
      throw new Error(`Invalid memory format: ${memory}. Use format like: 512M, 1G`);
    }

    const [, amount, unit] = match;
    const multipliers = {
      K: 1024,
      M: 1024 ** 2,
      G: 1024 ** 3
    };

    return parseInt(amount) * multipliers[unit as keyof typeof multipliers];
  }

  /**
   * Parse disk string to bytes
   */
  parseDisk(disk: string): number {
    return this.parseMemory(disk); // Same format
  }

  /**
   * Format bytes to human-readable string
   */
  formatBytes(bytes: number): string {
    if (bytes === 0) return '0B';
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(2)}K`;
    if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(2)}M`;
    return `${(bytes / 1024 ** 3).toFixed(2)}G`;
  }

  /**
   * Calculate CPU quota for Docker
   * Returns NanoCPUs (1 CPU = 1e9 NanoCPUs)
   */
  calculateCPUQuota(cpuCores: number): number {
    if (cpuCores <= 0) {
      throw new Error('CPU cores must be positive');
    }
    return Math.floor(cpuCores * 1e9);
  }

  /**
   * Validate resource limits
   */
  validateLimits(limits: {
    cpu: number;
    memory: string;
    disk: string;
    timeout: number;
  }): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate CPU
    if (limits.cpu < 0.1) {
      errors.push('CPU cores must be at least 0.1');
    }
    if (limits.cpu > 8) {
      errors.push('CPU cores cannot exceed 8');
    }

    // Validate memory
    try {
      const memoryBytes = this.parseMemory(limits.memory);
      if (memoryBytes < 64 * 1024 * 1024) { // 64MB minimum
        errors.push('Memory must be at least 64M');
      }
      if (memoryBytes > 8 * 1024 ** 3) { // 8GB maximum
        errors.push('Memory cannot exceed 8G');
      }
    } catch (error) {
      errors.push(`Invalid memory format: ${limits.memory}`);
    }

    // Validate disk
    try {
      const diskBytes = this.parseDisk(limits.disk);
      if (diskBytes < 100 * 1024 * 1024) { // 100MB minimum
        errors.push('Disk must be at least 100M');
      }
      if (diskBytes > 50 * 1024 ** 3) { // 50GB maximum
        errors.push('Disk cannot exceed 50G');
      }
    } catch (error) {
      errors.push(`Invalid disk format: ${limits.disk}`);
    }

    // Validate timeout
    if (limits.timeout < 1000) {
      errors.push('Timeout must be at least 1000ms (1 second)');
    }
    if (limits.timeout > 300000) {
      errors.push('Timeout cannot exceed 300000ms (5 minutes)');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Get recommended limits based on workload type
   */
  getRecommendedLimits(workloadType: 'light' | 'medium' | 'heavy'): {
    cpu: number;
    memory: string;
    disk: string;
    timeout: number;
  } {
    switch (workloadType) {
      case 'light':
        return {
          cpu: 0.5,
          memory: '256M',
          disk: '500M',
          timeout: 10000
        };
      case 'medium':
        return {
          cpu: 1,
          memory: '512M',
          disk: '1G',
          timeout: 30000
        };
      case 'heavy':
        return {
          cpu: 2,
          memory: '1G',
          disk: '2G',
          timeout: 60000
        };
    }
  }
}
