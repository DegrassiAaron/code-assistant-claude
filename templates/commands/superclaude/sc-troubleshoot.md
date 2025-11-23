---
name: "sc-troubleshoot"
description: "Systematic debugging and problem resolution"
category: "superclaude"
version: "1.0.0"

triggers:
  exact: "/sc:troubleshoot"
  aliases: ["/troubleshoot", "/debug", "/fix"]
  keywords: ["troubleshoot", "debug", "error", "bug", "fix"]

requires:
  skills: ["debugger", "root-cause-analyzer"]
  mcps: ["serena", "sequential"]

parameters:
  - name: "issue"
    type: "string"
    required: true
    description: "Problem description or error message"
  - name: "context"
    type: "string"
    required: false
    description: "File path or component where issue occurs"
  - name: "urgency"
    type: "string"
    required: false
    default: "normal"
    options: ["low", "normal", "high", "critical"]

autoExecute: false
tokenEstimate: 14000
executionTime: "20-60s"
---

# /sc:troubleshoot - Systematic Debugging

Comprehensive troubleshooting using root cause analysis and systematic debugging.

## Troubleshooting Methodology

### 1. Problem Definition (5W1H)
- **What**: What is the problem?
- **When**: When does it occur?
- **Where**: Where does it occur?
- **Who**: Who experiences it?
- **Why**: Why is it a problem?
- **How**: How does it manifest?

### 2. Information Gathering
- Error messages and stack traces
- Logs and metrics
- Recent changes
- Environment details
- User reports

### 3. Root Cause Analysis
- **5 Whys**: Drill down to root cause
- **Fishbone Diagram**: Categorize causes
- **Timeline Analysis**: Sequence of events
- **Differential Diagnosis**: Eliminate possibilities

### 4. Solution Development
- Immediate fix (workaround)
- Permanent solution
- Prevention measures
- Testing strategy

## Execution Flow

### Phase 1: Understand the Problem

```markdown
🔍 Problem Analysis

**Issue**: {issue}
**Context**: {context}
**Urgency**: {urgency}

### Symptoms
- Error message: [Exact error text]
- When it occurs: [Conditions]
- Affected users/systems: [Scope]
- First occurrence: [Timestamp]
- Frequency: [How often]

### Impact Assessment
- **Users affected**: [Number/percentage]
- **Business impact**: [Revenue, reputation, etc.]
- **System impact**: [Performance, availability]
- **Urgency level**: [Critical/High/Normal/Low]
```

### Phase 2: Gather Evidence

**Data Collection**:
1. **Error Logs**
   ```bash
   # Recent errors
   tail -n 100 /var/log/app.log | grep ERROR

   # Stack traces
   grep -A 20 "Error" application.log
   ```

2. **System Metrics**
   - CPU usage
   - Memory consumption
   - Disk I/O
   - Network traffic

3. **Application State**
   - Database queries
   - API calls
   - Cache status
   - Queue depth

4. **Recent Changes** (Serena MCP)
   ```bash
   # Git changes in last 24 hours
   git log --since="24 hours ago" --oneline

   # Modified files
   git diff HEAD~5
   ```

### Phase 3: Root Cause Analysis

```markdown
🎯 Root Cause Analysis

### 5 Whys Analysis
1. **Why** does the application crash?
   → Because it runs out of memory

2. **Why** does it run out of memory?
   → Because of a memory leak in the data processing

3. **Why** is there a memory leak?
   → Because objects aren't being garbage collected

4. **Why** aren't they being garbage collected?
   → Because we keep references in a global array

5. **Why** do we keep references?
   → Because we forgot to clear the cache

**Root Cause**: Missing cache cleanup logic

### Fishbone Diagram

```
                    APPLICATION CRASH
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
     People            Process           Technology
        │                 │                 │
   Missing review    No load testing    Memory leak
   Knowledge gap     Unclear spec       Old library
        │                 │                 │
        └─────────────────┴─────────────────┘
                     ROOT CAUSES
```

### Timeline Analysis
```
10:00 AM - Deployment completed
10:15 AM - Normal operation
10:30 AM - Memory usage starts increasing
10:45 AM - First warning logs
11:00 AM - Error rate increases
11:15 AM - Application crash
```

**Conclusion**: Issue started 15 minutes after deployment
**Suspect**: Recent code changes

### Hypothesis Testing

**Hypothesis 1**: Memory leak in new feature
- ✅ Timeline matches deployment
- ✅ Memory pattern consistent with leak
- ✅ Affects only users using new feature
- **Probability**: 90%

**Hypothesis 2**: Database connection leak
- ❌ Database metrics normal
- ❌ Affects all features equally
- ❌ Doesn't explain timeline
- **Probability**: 10%

**Selected Hypothesis**: Memory leak in new feature
```

### Phase 4: Solution Development

```markdown
💡 Solution Plan

### Immediate Fix (Workaround)
**Goal**: Restore service in <15 minutes

**Actions**:
1. ⚡ Rollback to previous version
   ```bash
   git revert <commit-hash>
   npm run build
   npm run deploy
   ```

2. ⚡ Increase memory limit temporarily
   ```bash
   NODE_OPTIONS="--max-old-space-size=4096"
   ```

3. ⚡ Restart affected services
   ```bash
   pm2 restart all
   ```

**Expected Result**: Service restored, buy time for permanent fix

### Permanent Solution
**Goal**: Fix root cause

**Root Cause**: Cache not being cleared in DataProcessor.ts:145

**Fix**:
```typescript
// Before (ISSUE)
class DataProcessor {
  private cache: Map<string, any> = new Map();

  async processData(data: any[]) {
    data.forEach(item => {
      this.cache.set(item.id, item); // Never cleared!
      // ... process
    });
  }
}

// After (FIXED)
class DataProcessor {
  private cache: Map<string, any> = new Map();
  private readonly MAX_CACHE_SIZE = 1000;

  async processData(data: any[]) {
    data.forEach(item => {
      this.cache.set(item.id, item);

      // Clear cache if it gets too large
      if (this.cache.size > this.MAX_CACHE_SIZE) {
        const firstKey = this.cache.keys().next().value;
        this.cache.delete(firstKey);
      }

      // ... process
    });
  }

  // Add cleanup method
  clearCache() {
    this.cache.clear();
  }
}
```

**Testing Plan**:
1. Unit test for cache cleanup
2. Load test with 10K items
3. Memory profiling
4. Staging deployment
5. Monitor for 24 hours

### Prevention Measures

**Short-term** (This sprint):
- [ ] Add memory monitoring alerts
- [ ] Implement cache size limits globally
- [ ] Code review checklist item: "Are resources cleaned up?"

**Long-term** (Next quarter):
- [ ] Automated memory leak detection in CI
- [ ] Regular load testing
- [ ] Memory profiling in staging
- [ ] Developer training on memory management

### Validation

**Acceptance Criteria**:
- ✅ Memory usage stable over 24 hours
- ✅ No crashes under load
- ✅ All tests passing
- ✅ Code review approved
- ✅ Staging validation complete

**Monitoring**:
- Memory usage < 2GB
- No error rate increase
- Response time < 200ms
- Zero crashes for 7 days
```

### Phase 5: Post-Mortem

```markdown
📋 Post-Mortem Report

### Incident Summary
**Date**: 2025-11-23
**Duration**: 1h 15min
**Severity**: High
**Impact**: 30% of users affected

### Timeline
- 10:00 - Deployment
- 10:30 - Issue started
- 11:00 - Alerts triggered
- 11:15 - Service down
- 11:20 - Rollback initiated
- 11:30 - Service restored

### Root Cause
Memory leak due to unbounded cache in DataProcessor

### Resolution
1. Immediate: Rollback deployment
2. Permanent: Add cache size limits and cleanup

### Lessons Learned

**What Went Well** ✅:
- Quick detection (15 min)
- Fast rollback (15 min)
- Clear communication
- Team coordination

**What Went Wrong** ❌:
- No load testing before deployment
- Missing memory monitoring
- No cache size limits
- Insufficient code review

**Action Items**:
1. [P0] Add memory alerts - @devops - By Nov 25
2. [P0] Implement load testing - @qa - By Nov 27
3. [P1] Update code review checklist - @lead - By Nov 24
4. [P1] Team training on memory - @lead - By Dec 1
5. [P2] Automated memory profiling - @devops - By Dec 15
```

## Examples

### Application Crash
```bash
/sc:troubleshoot "Application crashes after 1 hour of runtime" --context="src/services/DataProcessor.ts" --urgency=high

# Provides:
# - Root cause analysis
# - Memory leak detection
# - Immediate fix + permanent solution
# - Prevention measures
```

### Performance Issue
```bash
/sc:troubleshoot "API response time increased from 100ms to 2s"

# Analyzes:
# - Database query performance
# - Network latency
# - Code changes
# - Provides optimization plan
```

### Build Failure
```bash
/sc:troubleshoot "Build failing with TypeScript error" --context="src/components/UserForm.tsx"

# Identifies:
# - Type errors
# - Dependency issues
# - Configuration problems
# - Provides fixes
```

### Production Error
```bash
/sc:troubleshoot "Users getting 500 error on checkout" --urgency=critical

# Emergency response:
# - Immediate mitigation
# - Root cause
# - Permanent fix
# - Post-mortem
```

## Debugging Techniques

### For Different Issue Types

**Memory Leaks**:
- Heap snapshots
- Memory profiling
- Garbage collection analysis
- Reference tracking

**Performance**:
- Profiling (CPU, memory)
- Database query analysis
- Network waterfall
- Bundle analysis

**Logic Errors**:
- Debugger + breakpoints
- Console logging
- Unit test isolation
- Input/output analysis

**Integration Issues**:
- API request/response logging
- Network monitoring
- Contract testing
- Environment comparison

## Diagnostic Commands

### Application Logs
```bash
# Real-time logs
tail -f /var/log/app.log

# Error-only logs
grep ERROR /var/log/app.log

# Last hour
journalctl --since "1 hour ago"
```

### System Metrics
```bash
# Memory usage
free -h
ps aux --sort=-%mem | head

# CPU usage
top -o %CPU

# Disk I/O
iostat -x 1
```

### Network
```bash
# Active connections
netstat -an | grep ESTABLISHED

# DNS lookup
nslookup api.example.com

# Trace route
traceroute api.example.com
```

### Database
```sql
-- Slow queries
SELECT * FROM pg_stat_statements
ORDER BY mean_time DESC LIMIT 10;

-- Active connections
SELECT count(*) FROM pg_stat_activity;

-- Locks
SELECT * FROM pg_locks;
```

## Integration

### With Skills
- debugger: Advanced debugging
- root-cause-analyzer: RCA techniques
- performance-optimizer: Performance fixes

### With MCPs
- Serena: Code analysis and navigation
- Sequential: Multi-step reasoning
- Context7: Documentation search

## Configuration

`.claude/settings.json`:
```json
{
  "commands": {
    "sc-troubleshoot": {
      "includePostMortem": true,
      "autoGatherLogs": true,
      "createIssue": true,
      "notifyTeam": true,
      "urgencyThresholds": {
        "critical": "5min response",
        "high": "15min response",
        "normal": "1hour response",
        "low": "next day"
      }
    }
  }
}
```

## Success Metrics

- Root cause accuracy: >95%
- Time to resolution: <1 hour
- Recurrence rate: <5%
- Fix effectiveness: >90%
- User satisfaction: >4.5/5
