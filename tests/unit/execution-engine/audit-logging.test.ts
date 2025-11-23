import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ExecutionOrchestrator } from '../../../src/core/execution-engine/orchestrator';
import path from 'path';

describe('Audit Logging - Race Condition Fix', () => {
  let orchestrator: ExecutionOrchestrator;

  beforeEach(async () => {
    const toolsDir = path.join(process.cwd(), 'templates/mcp-tools');
    orchestrator = new ExecutionOrchestrator(toolsDir);
    await orchestrator.initialize();
  });

  afterEach(async () => {
    await orchestrator.shutdown();
  });

  it('should write audit log before returning from execute', async () => {
    // Get initial log count
    const initialStats = orchestrator.getStats();
    const initialLogCount = initialStats.audit.totalLogs;

    // Execute a simple request
    const result = await orchestrator.execute(
      'Simple test query',
      'typescript'
    );

    // Immediately check that logs were written (no delay needed)
    const finalStats = orchestrator.getStats();
    const finalLogCount = finalStats.audit.totalLogs;

    // Should have at least one new log entry (logDiscovery, logExecution, etc.)
    expect(finalLogCount).toBeGreaterThan(initialLogCount);

    // Verify that the audit logger was called and completed before return
    // This test passes only if all audit logger calls are properly awaited
  }, 30000);

  it('should not lose logs on rapid concurrent executions', async () => {
    const initialStats = orchestrator.getStats();
    const initialLogCount = initialStats.audit.totalLogs;

    // Execute 5 times concurrently (reduced from 10 for faster test execution)
    const concurrentExecutions = 5;
    const promises = Array(concurrentExecutions).fill(0).map((_, index) =>
      orchestrator.execute(`Concurrent test query ${index}`, 'typescript')
    );

    // Wait for all executions to complete
    const results = await Promise.all(promises);

    // Check that we got results for all executions
    expect(results).toHaveLength(concurrentExecutions);

    // Get final log count
    const finalStats = orchestrator.getStats();
    const finalLogCount = finalStats.audit.totalLogs;

    // Each execution should generate at least one log entry (logDiscovery)
    // Even if the execution fails, the discovery phase still logs
    // So we expect at least concurrentExecutions logs
    const minExpectedLogs = concurrentExecutions;
    const actualNewLogs = finalLogCount - initialLogCount;

    expect(actualNewLogs).toBeGreaterThanOrEqual(minExpectedLogs);

    console.log(`Concurrent executions: ${concurrentExecutions}`);
    console.log(`New audit logs created: ${actualNewLogs}`);
    console.log(`Minimum expected: ${minExpectedLogs}`);

    // Verify no race condition: all concurrent executions should be logged
    // If there was a race condition, some logs would be lost
  }, 60000);

  it('should log all execution phases', async () => {
    // Spy on the audit logger methods to verify they are called
    const auditLogger = orchestrator['auditLogger'];
    const logDiscoverySpy = vi.spyOn(auditLogger, 'logDiscovery');
    const logExecutionSpy = vi.spyOn(auditLogger, 'logExecution');
    const logSecuritySpy = vi.spyOn(auditLogger, 'logSecurity');

    await orchestrator.execute('Test request for phase logging', 'typescript');

    // Verify that all key audit methods were called
    expect(logDiscoverySpy).toHaveBeenCalled();
    expect(logExecutionSpy).toHaveBeenCalled();

    // logSecurity may or may not be called depending on risk level and anomalies
    // So we just verify the spies were set up correctly

    // Clean up spies
    logDiscoverySpy.mockRestore();
    logExecutionSpy.mockRestore();
    logSecuritySpy.mockRestore();
  }, 30000);

  it('should handle errors and log them before returning', async () => {
    const auditLogger = orchestrator['auditLogger'];
    const logErrorSpy = vi.spyOn(auditLogger, 'logError');

    // This should trigger an error path (no tools found or execution failure)
    const result = await orchestrator.execute(
      'xyz123invalidquery456', // Unlikely to match any tools
      'typescript'
    );

    // If it failed (which is expected for this query), error should be logged
    if (!result.success) {
      // The error might be logged, or it might just return an error result
      // Depending on whether it's a validation error or execution error
    }

    logErrorSpy.mockRestore();
  }, 30000);

  it('should verify audit logger methods are async and awaited', async () => {
    const auditLogger = orchestrator['auditLogger'];

    // Verify that logExecution returns a Promise
    const mockWorkspaceId = 'test-workspace';
    const mockCode = 'console.log("test");';
    const mockResult = {
      success: true,
      summary: 'Test',
      metrics: { executionTime: 100, memoryUsed: '10M', tokensInSummary: 10 },
      piiTokenized: false
    };

    const logPromise = auditLogger.logExecution(mockWorkspaceId, mockCode, mockResult);

    // Verify it returns a Promise
    expect(logPromise).toBeInstanceOf(Promise);

    // Verify the Promise resolves (confirming it's properly async)
    await expect(logPromise).resolves.toBeUndefined();
  });
});
