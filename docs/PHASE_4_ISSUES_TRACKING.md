# Phase 4: MCP Execution Engine - Issue Tracking

**Created**: 2025-11-23
**Status**: In Progress
**Total Issues**: 18 (5 Critical, 5 High, 8 Medium)

---

## 🔴 CRITICAL Issues (Priority 1 - Must Fix Before Production)

### Issue #1: PII Storage Security Vulnerability 🔴
- **Severity**: Critical
- **Status**: ⏳ Open
- **File**: `src/core/execution-engine/security/pii-tokenizer.ts:102`
- **Issue**: `reverseMap` stores original PII values in plaintext memory
- **Impact**:
  - GDPR/HIPAA compliance violation
  - PII exposed in memory dumps
  - Sensitive data visible in debugging sessions
  - Risk of data breach if process memory is compromised
- **Fix Required**:
  ```typescript
  // Option 1: Remove detokenize functionality entirely (one-way only)
  // Option 2: Encrypt reverse map values with AES-256
  // Option 3: Use secure enclave or key vault
  ```
- **Assignee**: TBD
- **Due Date**: ASAP
- **Blocking**: Production deployment, compliance certification

---

### Issue #2: Audit Log Race Condition 🔴
- **Severity**: Critical
- **Status**: ⏳ Open
- **File**: `src/core/execution-engine/orchestrator.ts:199`
- **Issue**: `auditLogger.logExecution()` is async but not awaited
- **Impact**:
  - Lost audit logs
  - Compliance violations (SOC2, GDPR)
  - Incomplete audit trail
  - Race conditions in log writing
- **Fix Required**:
  ```typescript
  // Line 199
  await this.auditLogger.logExecution(workspace.id, wrapper.code, result);
  ```
- **Assignee**: TBD
- **Due Date**: ASAP
- **Blocking**: Compliance certification, production deployment

---

### Issue #3: Docker Container Resource Leak 🔴
- **Severity**: Critical
- **Status**: ⏳ Open
- **File**: `src/core/execution-engine/sandbox/docker-sandbox.ts:41-54`
- **Issue**: Containers not cleaned up on error, causing resource leaks
- **Impact**:
  - Resource exhaustion (CPU, memory, disk)
  - Zombie containers running indefinitely
  - Security breach from untrusted code containers
  - System instability
- **Fix Required**:
  ```typescript
  } catch (error) {
    // Ensure cleanup even on error
    try {
      await container.stop({ t: 0 });
      await container.remove({ force: true });
    } catch (cleanupError) {
      console.error('Container cleanup failed:', cleanupError);
    }

    return { success: false, error: ... };
  }
  ```
- **Assignee**: TBD
- **Due Date**: ASAP
- **Blocking**: Production deployment

---

### Issue #4: Environment Variable Credential Leak 🔴
- **Severity**: Critical
- **Status**: ⏳ Open
- **File**: `src/core/execution-engine/sandbox/process-sandbox.ts:81-86`
- **Issue**: Spreading `process.env` exposes all secrets to sandbox
- **Impact**:
  - API keys exposed to untrusted code
  - Database credentials leaked
  - AWS/cloud credentials accessible
  - Complete security compromise
- **Fix Required**:
  ```typescript
  env: {
    // Only whitelist safe variables
    NODE_ENV: 'sandbox',
    PATH: '/usr/local/bin:/usr/bin:/bin'
    // DO NOT spread process.env
  }
  ```
- **Assignee**: TBD
- **Due Date**: ASAP
- **Blocking**: Production deployment, security audit

---

### Issue #5: Code Validator Race Condition 🔴
- **Severity**: Critical
- **Status**: ⏳ Open
- **File**: `src/core/execution-engine/security/code-validator.ts:22-24`
- **Issue**: Concurrent calls to `validate()` cause multiple pattern loads
- **Impact**:
  - Inconsistent security validation
  - Resource exhaustion from multiple file reads
  - Race conditions in pattern loading
  - Potential validation bypass
- **Fix Required**:
  ```typescript
  private initPromise: Promise<void> | null = null;

  async validate(code: string): Promise<SecurityValidation> {
    if (!this.initialized) {
      if (!this.initPromise) {
        this.initPromise = this.loadPatterns();
      }
      await this.initPromise;
    }
    // ... rest
  }
  ```
- **Assignee**: TBD
- **Due Date**: ASAP
- **Blocking**: Security certification

---

## ⚡ HIGH Priority Issues (Priority 2 - Fix This Sprint)

### Issue #6: Unbounded Cache Memory Growth
- **Severity**: High
- **Status**: ⏳ Open
- **File**: `src/core/execution-engine/workspace/cache-manager.ts`
- **Issue**: No maximum size limit on cache Map
- **Impact**: Memory exhaustion, DoS vulnerability
- **Fix**: Implement LRU eviction with configurable max size (default 1000)
- **Assignee**: TBD
- **Due Date**: End of sprint

---

### Issue #7: Network Policy Not Enforced in Docker Sandbox
- **Severity**: High
- **Status**: ⏳ Open
- **File**: `src/core/execution-engine/sandbox/docker-sandbox.ts:88`
- **Issue**: Whitelist/blacklist modes don't actually filter network traffic
- **Impact**: Untrusted code can make arbitrary network requests
- **Fix**: Implement actual network filtering with iptables or Docker network config
- **Assignee**: TBD
- **Due Date**: End of sprint

---

### Issue #8: Unsafe PII Tokenization Corrupts JSON
- **Severity**: High
- **Status**: ⏳ Open
- **File**: `src/core/execution-engine/orchestrator.ts:169-172`
- **Issue**: Tokenizing `JSON.stringify(output)` corrupts JSON structure
- **Impact**: Invalid JSON, data loss, type errors
- **Fix**: Parse JSON after tokenization, handle nested objects properly
- **Assignee**: TBD
- **Due Date**: End of sprint

---

### Issue #9: Template Loading Has No Error Handling
- **Severity**: High
- **Status**: ⏳ Open
- **File**: `src/core/execution-engine/mcp-code-api/generator.ts:77-84`
- **Issue**: Missing template files cause unhandled promise rejection
- **Impact**: Application crashes on startup
- **Fix**: Add try-catch with helpful error message and fallback
- **Assignee**: TBD
- **Due Date**: End of sprint

---

### Issue #10: Process Sandbox Timeout Race Condition
- **Severity**: High
- **Status**: ⏳ Open
- **File**: `src/core/execution-engine/sandbox/process-sandbox.ts:124-130`
- **Issue**: Manual setTimeout races with spawn timeout option
- **Impact**: Double promise resolution, zombie processes, incorrect errors
- **Fix**: Use flag to prevent double resolution
- **Assignee**: TBD
- **Due Date**: End of sprint

---

## 🟡 MEDIUM Priority Issues (Priority 3 - Next Sprint)

### Issue #11: Orchestrator God Class Anti-pattern
- **Severity**: Medium
- **Status**: ⏳ Open
- **File**: `src/core/execution-engine/orchestrator.ts`
- **Issue**: Orchestrator manages 13 dependencies, violates SRP
- **Impact**: Difficult to test, maintain, extend
- **Fix**: Split into SecurityOrchestrator, ExecutionOrchestrator, AuditOrchestrator
- **Assignee**: TBD
- **Due Date**: Next sprint

---

### Issue #12: No Dependency Injection
- **Severity**: Medium
- **Status**: ⏳ Open
- **File**: `src/core/execution-engine/orchestrator.ts:35-54`
- **Issue**: All dependencies hard-coded in constructor
- **Impact**: Difficult to test, tight coupling
- **Fix**: Accept dependencies as constructor parameters
- **Assignee**: TBD
- **Due Date**: Next sprint

---

### Issue #13: Duplicate Utility Functions
- **Severity**: Medium
- **Status**: ⏳ Open
- **Files**: Multiple (docker-sandbox.ts, process-sandbox.ts, orchestrator.ts, etc.)
- **Issue**: `parseMemory()`, `formatMemory()`, `estimateTokens()` duplicated
- **Impact**: Inconsistent implementations, maintenance burden
- **Fix**: Extract to shared `src/core/execution-engine/utils/` module
- **Assignee**: TBD
- **Due Date**: Next sprint

---

### Issue #14: Unsalted PII Hash Vulnerable to Rainbow Tables
- **Severity**: Medium
- **Status**: ⏳ Open
- **File**: `src/core/execution-engine/security/pii-tokenizer.ts:128`
- **Issue**: SHA-256 without salt vulnerable to rainbow table attacks
- **Impact**: If hashes exposed, PII could be recovered
- **Fix**: Add cryptographic salt to hash function
- **Assignee**: TBD
- **Due Date**: Next sprint

---

### Issue #15: Magic Numbers Throughout Codebase
- **Severity**: Medium
- **Status**: ⏳ Open
- **Files**: Multiple
- **Issue**: Hardcoded values (60, 200000, 0.4, etc.) without named constants
- **Impact**: Unclear intent, difficult to maintain
- **Fix**: Extract to named constants with clear documentation
- **Assignee**: TBD
- **Due Date**: Next sprint

---

### Issue #16: Regex Vulnerabilities (lastIndex issues)
- **Severity**: Medium
- **Status**: ⏳ Open
- **File**: `src/core/execution-engine/security/code-validator.ts:127-140`
- **Issue**: RegExp patterns with 'g' flag not properly reset
- **Impact**: Missed detections, inconsistent validation
- **Fix**: Create new RegExp instances or use matchAll properly
- **Assignee**: TBD
- **Due Date**: Next sprint

---

### Issue #17: Inefficient Cache Cleanup (O(n) iteration)
- **Severity**: Medium
- **Status**: ⏳ Open
- **File**: `src/core/execution-engine/workspace/cache-manager.ts:72-83`
- **Issue**: Iterating entire cache on every cleanup
- **Impact**: Slow cleanup with large caches
- **Fix**: Use sorted expiry queue for O(1) cleanup
- **Assignee**: TBD
- **Due Date**: Next sprint

---

### Issue #18: Missing Test Coverage
- **Severity**: Medium
- **Status**: ⏳ Open
- **Files**: tests/
- **Issue**: No tests for concurrent execution, error paths, edge cases
- **Impact**: Unknown behavior in production scenarios
- **Fix**: Add comprehensive test suite:
  - Concurrent execution scenarios
  - Error handling paths
  - Resource cleanup verification
  - Cache eviction policies
  - PII tokenization edge cases
  - Sandbox escape attempts
- **Assignee**: TBD
- **Due Date**: Next sprint

---

## 📊 Issue Statistics

### By Severity
- 🔴 Critical: 5 (28%)
- ⚡ High: 5 (28%)
- 🟡 Medium: 8 (44%)

### By Status
- ⏳ Open: 18 (100%)
- 🔧 In Progress: 0 (0%)
- ✅ Completed: 0 (0%)

### By Component
- Security: 6 issues
- Sandbox: 4 issues
- Orchestrator: 3 issues
- Cache/Workspace: 2 issues
- Code Generation: 1 issue
- Testing: 1 issue
- Utils: 1 issue

---

## 🎯 Sprint Planning

### Sprint 1 (This Week) - Critical Fixes
**Goal**: Make Phase 4 production-safe

- [ ] Issue #1: PII Storage Security Vulnerability
- [ ] Issue #2: Audit Log Race Condition
- [ ] Issue #3: Docker Container Resource Leak
- [ ] Issue #4: Environment Variable Credential Leak
- [ ] Issue #5: Code Validator Race Condition

**Success Criteria**: All critical security issues resolved

---

### Sprint 2 (Next Week) - High Priority Fixes
**Goal**: Stabilize execution engine

- [ ] Issue #6: Unbounded Cache Memory Growth
- [ ] Issue #7: Network Policy Not Enforced
- [ ] Issue #8: Unsafe PII Tokenization
- [ ] Issue #9: Template Loading Error Handling
- [ ] Issue #10: Process Sandbox Timeout Race

**Success Criteria**: All high-priority stability issues resolved

---

### Sprint 3 (Following Sprint) - Architecture & Quality
**Goal**: Improve maintainability and test coverage

- [ ] Issue #11: Orchestrator God Class
- [ ] Issue #12: Dependency Injection
- [ ] Issue #13: Duplicate Utility Functions
- [ ] Issue #14: Unsalted PII Hash
- [ ] Issue #15: Magic Numbers
- [ ] Issue #16: Regex Vulnerabilities
- [ ] Issue #17: Inefficient Cache Cleanup
- [ ] Issue #18: Missing Test Coverage

**Success Criteria**: 80%+ test coverage, refactored architecture

---

## 📋 Definition of Done

For each issue to be marked as ✅ Completed:

- [ ] Code changes implemented and reviewed
- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] Documentation updated
- [ ] Security review completed (for security issues)
- [ ] Performance impact assessed
- [ ] PR approved and merged
- [ ] Issue verified in staging environment

---

## 🔒 Security Sign-off Required

Before production deployment, the following must be completed:

- [ ] All 5 critical issues resolved
- [ ] Security audit passed
- [ ] Penetration testing completed
- [ ] Compliance review (GDPR, SOC2, HIPAA)
- [ ] Load testing completed
- [ ] Disaster recovery tested

---

## 📝 Notes

- **vm2 deprecation**: The `vm2` package is deprecated. Consider migrating to `isolated-vm` or other alternatives for VM sandboxing.
- **Docker alternatives**: Consider Firecracker or gVisor for enhanced security
- **Monitoring**: Add Prometheus metrics for execution times, cache hit rates, security incidents
- **Alerting**: Set up alerts for anomaly detection, resource exhaustion, security violations

---

**Last Updated**: 2025-11-23
**Next Review**: After Sprint 1 completion
