import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ResourceLimiter } from '../../../src/core/execution-engine/sandbox/resource-limiter';

describe('ResourceLimiter', () => {
  let resourceLimiter: ResourceLimiter;

  beforeEach(() => {
    resourceLimiter = new ResourceLimiter({
      maxMemoryMB: 256,
      maxCpuPercent: 80,
      maxExecutionTime: 30000
    });
  });

  describe('initialization', () => {
    it('should initialize with custom limits', () => {
      const limiter = new ResourceLimiter({
        maxMemoryMB: 512,
        maxCpuPercent: 50,
        maxExecutionTime: 60000
      });

      expect(limiter).toBeDefined();
    });

    it('should use default limits when not specified', () => {
      const limiter = new ResourceLimiter({});

      expect(limiter).toBeDefined();
    });
  });

  describe('checkMemoryUsage', () => {
    it('should return true when memory is within limits', () => {
      const withinLimits = resourceLimiter.checkMemoryUsage(100);

      expect(withinLimits).toBe(true);
    });

    it('should return false when memory exceeds limits', () => {
      const exceedsLimits = resourceLimiter.checkMemoryUsage(300);

      expect(exceedsLimits).toBe(false);
    });

    it('should handle zero memory usage', () => {
      const result = resourceLimiter.checkMemoryUsage(0);

      expect(result).toBe(true);
    });
  });

  describe('checkCpuUsage', () => {
    it('should return true when CPU is within limits', () => {
      const withinLimits = resourceLimiter.checkCpuUsage(50);

      expect(withinLimits).toBe(true);
    });

    it('should return false when CPU exceeds limits', () => {
      const exceedsLimits = resourceLimiter.checkCpuUsage(90);

      expect(exceedsLimits).toBe(false);
    });

    it('should handle 100% CPU usage', () => {
      const result = resourceLimiter.checkCpuUsage(100);

      expect(result).toBe(false);
    });
  });

  describe('checkExecutionTime', () => {
    it('should return true when execution time is within limits', () => {
      const startTime = Date.now();

      const withinLimits = resourceLimiter.checkExecutionTime(startTime);

      expect(withinLimits).toBe(true);
    });

    it('should return false when execution time exceeds limits', () => {
      const startTime = Date.now() - 40000; // 40 seconds ago

      const exceedsLimits = resourceLimiter.checkExecutionTime(startTime);

      expect(exceedsLimits).toBe(false);
    });
  });

  describe('enforceLimit', () => {
    it('should throw error when limit is exceeded', () => {
      expect(() => {
        resourceLimiter.enforceLimit('memory', false);
      }).toThrow('Resource limit exceeded: memory');
    });

    it('should not throw when limit is not exceeded', () => {
      expect(() => {
        resourceLimiter.enforceLimit('memory', true);
      }).not.toThrow();
    });

    it('should include custom message in error', () => {
      expect(() => {
        resourceLimiter.enforceLimit('cpu', false, 'Custom CPU message');
      }).toThrow('Custom CPU message');
    });
  });

  describe('getResourceStats', () => {
    it('should return current resource statistics', async () => {
      const stats = await resourceLimiter.getResourceStats();

      expect(stats).toHaveProperty('memoryUsageMB');
      expect(stats).toHaveProperty('cpuUsagePercent');
      expect(stats).toHaveProperty('executionTimeMs');
      expect(typeof stats.memoryUsageMB).toBe('number');
      expect(typeof stats.cpuUsagePercent).toBe('number');
    });

    it('should update statistics over time', async () => {
      const stats1 = await resourceLimiter.getResourceStats();

      await new Promise(resolve => setTimeout(resolve, 100));

      const stats2 = await resourceLimiter.getResourceStats();

      expect(stats2.executionTimeMs).toBeGreaterThan(stats1.executionTimeMs);
    });
  });

  describe('resetLimits', () => {
    it('should reset all limits to new values', () => {
      resourceLimiter.resetLimits({
        maxMemoryMB: 1024,
        maxCpuPercent: 90,
        maxExecutionTime: 120000
      });

      expect(resourceLimiter.checkMemoryUsage(512)).toBe(true);
      expect(resourceLimiter.checkCpuUsage(85)).toBe(true);
    });

    it('should partially update limits', () => {
      resourceLimiter.resetLimits({
        maxMemoryMB: 128
      });

      expect(resourceLimiter.checkMemoryUsage(100)).toBe(true);
      expect(resourceLimiter.checkMemoryUsage(200)).toBe(false);
    });
  });
});
