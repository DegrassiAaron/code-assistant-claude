import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { WorkspaceManager } from '../../../src/core/execution-engine/workspace/workspace-manager';
import * as fs from 'fs/promises';
import * as path from 'path';

// Mock file system
vi.mock('fs/promises');

describe('WorkspaceManager', () => {
  let workspaceManager: WorkspaceManager;
  const testWorkspaceDir = '/tmp/test-workspace';

  beforeEach(() => {
    workspaceManager = new WorkspaceManager(testWorkspaceDir);
    vi.clearAllMocks();
  });

  afterEach(async () => {
    vi.restoreAllMocks();
  });

  describe('initialization', () => {
    it('should create workspace directory if it does not exist', async () => {
      vi.mocked(fs.access).mockRejectedValue(new Error('ENOENT'));
      vi.mocked(fs.mkdir).mockResolvedValue(undefined);

      await workspaceManager.initialize();

      expect(fs.mkdir).toHaveBeenCalledWith(testWorkspaceDir, { recursive: true });
    });

    it('should not create workspace directory if it already exists', async () => {
      vi.mocked(fs.access).mockResolvedValue(undefined);

      await workspaceManager.initialize();

      expect(fs.mkdir).not.toHaveBeenCalled();
    });
  });

  describe('createSession', () => {
    it('should create a new session workspace', async () => {
      const sessionId = 'test-session-123';
      vi.mocked(fs.mkdir).mockResolvedValue(undefined);

      const sessionPath = await workspaceManager.createSession(sessionId);

      expect(sessionPath).toBe(path.join(testWorkspaceDir, sessionId));
      expect(fs.mkdir).toHaveBeenCalledWith(
        expect.stringContaining(sessionId),
        { recursive: true }
      );
    });

    it('should throw error if session already exists', async () => {
      const sessionId = 'existing-session';
      vi.mocked(fs.access).mockResolvedValue(undefined);

      await expect(workspaceManager.createSession(sessionId)).rejects.toThrow();
    });
  });

  describe('cleanupSession', () => {
    it('should remove session workspace', async () => {
      const sessionId = 'cleanup-session';
      vi.mocked(fs.rm).mockResolvedValue(undefined);

      await workspaceManager.cleanupSession(sessionId);

      expect(fs.rm).toHaveBeenCalledWith(
        expect.stringContaining(sessionId),
        { recursive: true, force: true }
      );
    });

    it('should not throw if session does not exist', async () => {
      const sessionId = 'non-existent';
      vi.mocked(fs.rm).mockResolvedValue(undefined);

      await expect(workspaceManager.cleanupSession(sessionId)).resolves.not.toThrow();
    });
  });

  describe('getSessionPath', () => {
    it('should return correct session path', () => {
      const sessionId = 'path-test';
      const sessionPath = workspaceManager.getSessionPath(sessionId);

      expect(sessionPath).toBe(path.join(testWorkspaceDir, sessionId));
    });
  });

  describe('listSessions', () => {
    it('should return all active sessions', async () => {
      const mockSessions = ['session-1', 'session-2', 'session-3'];
      vi.mocked(fs.readdir).mockResolvedValue(mockSessions as any);

      const sessions = await workspaceManager.listSessions();

      expect(sessions).toEqual(mockSessions);
    });

    it('should return empty array if no sessions exist', async () => {
      vi.mocked(fs.readdir).mockResolvedValue([] as any);

      const sessions = await workspaceManager.listSessions();

      expect(sessions).toEqual([]);
    });
  });

  describe('cleanupOldSessions', () => {
    it('should cleanup sessions older than specified age', async () => {
      const mockSessions = ['session-1', 'session-2'];
      const maxAge = 3600000; // 1 hour

      vi.mocked(fs.readdir).mockResolvedValue(mockSessions as any);
      vi.mocked(fs.stat).mockResolvedValue({
        mtimeMs: Date.now() - maxAge - 1000
      } as any);
      vi.mocked(fs.rm).mockResolvedValue(undefined);

      const cleaned = await workspaceManager.cleanupOldSessions(maxAge);

      expect(cleaned).toBeGreaterThan(0);
      expect(fs.rm).toHaveBeenCalled();
    });

    it('should not cleanup recent sessions', async () => {
      const mockSessions = ['session-1'];
      const maxAge = 3600000; // 1 hour

      vi.mocked(fs.readdir).mockResolvedValue(mockSessions as any);
      vi.mocked(fs.stat).mockResolvedValue({
        mtimeMs: Date.now() - 1000 // Very recent
      } as any);
      vi.mocked(fs.rm).mockResolvedValue(undefined);

      const cleaned = await workspaceManager.cleanupOldSessions(maxAge);

      expect(cleaned).toBe(0);
      expect(fs.rm).not.toHaveBeenCalled();
    });
  });
});
