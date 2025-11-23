import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { CleanupManager } from '../../../src/core/execution-engine/workspace/cleanup-manager';
import * as fs from 'fs/promises';

vi.mock('fs/promises');

describe('CleanupManager', () => {
  let cleanupManager: CleanupManager;

  beforeEach(() => {
    cleanupManager = new CleanupManager();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('registerCleanup', () => {
    it('should register cleanup handlers', () => {
      const handler = vi.fn();

      cleanupManager.registerCleanup('test-resource', handler);

      expect(cleanupManager.hasCleanupHandler('test-resource')).toBe(true);
    });

    it('should allow multiple handlers for same resource', () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      cleanupManager.registerCleanup('resource', handler1);
      cleanupManager.registerCleanup('resource', handler2);

      expect(cleanupManager.hasCleanupHandler('resource')).toBe(true);
    });
  });

  describe('cleanup', () => {
    it('should execute all registered cleanup handlers', async () => {
      const handler1 = vi.fn().mockResolvedValue(undefined);
      const handler2 = vi.fn().mockResolvedValue(undefined);

      cleanupManager.registerCleanup('resource-1', handler1);
      cleanupManager.registerCleanup('resource-2', handler2);

      await cleanupManager.cleanup();

      expect(handler1).toHaveBeenCalled();
      expect(handler2).toHaveBeenCalled();
    });

    it('should handle cleanup errors gracefully', async () => {
      const errorHandler = vi.fn().mockRejectedValue(new Error('Cleanup failed'));
      const successHandler = vi.fn().mockResolvedValue(undefined);

      cleanupManager.registerCleanup('error-resource', errorHandler);
      cleanupManager.registerCleanup('success-resource', successHandler);

      await expect(cleanupManager.cleanup()).resolves.not.toThrow();
      expect(successHandler).toHaveBeenCalled();
    });

    it('should execute cleanup handlers in reverse registration order', async () => {
      const order: number[] = [];
      const handler1 = vi.fn().mockImplementation(() => order.push(1));
      const handler2 = vi.fn().mockImplementation(() => order.push(2));
      const handler3 = vi.fn().mockImplementation(() => order.push(3));

      cleanupManager.registerCleanup('r1', handler1);
      cleanupManager.registerCleanup('r2', handler2);
      cleanupManager.registerCleanup('r3', handler3);

      await cleanupManager.cleanup();

      expect(order).toEqual([3, 2, 1]);
    });
  });

  describe('cleanupResource', () => {
    it('should cleanup specific resource only', async () => {
      const targetHandler = vi.fn().mockResolvedValue(undefined);
      const otherHandler = vi.fn().mockResolvedValue(undefined);

      cleanupManager.registerCleanup('target', targetHandler);
      cleanupManager.registerCleanup('other', otherHandler);

      await cleanupManager.cleanupResource('target');

      expect(targetHandler).toHaveBeenCalled();
      expect(otherHandler).not.toHaveBeenCalled();
    });

    it('should do nothing if resource does not exist', async () => {
      await expect(
        cleanupManager.cleanupResource('non-existent')
      ).resolves.not.toThrow();
    });
  });

  describe('removeCleanupHandler', () => {
    it('should remove specific cleanup handler', () => {
      const handler = vi.fn();

      cleanupManager.registerCleanup('resource', handler);
      expect(cleanupManager.hasCleanupHandler('resource')).toBe(true);

      cleanupManager.removeCleanupHandler('resource');
      expect(cleanupManager.hasCleanupHandler('resource')).toBe(false);
    });
  });

  describe('cleanup on process exit', () => {
    it('should register process exit handlers', () => {
      const processSpy = vi.spyOn(process, 'on');

      new CleanupManager({ autoCleanup: true });

      expect(processSpy).toHaveBeenCalledWith('exit', expect.any(Function));
      expect(processSpy).toHaveBeenCalledWith('SIGINT', expect.any(Function));
      expect(processSpy).toHaveBeenCalledWith('SIGTERM', expect.any(Function));
    });
  });
});
