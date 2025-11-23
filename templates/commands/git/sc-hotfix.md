---
name: "sc-hotfix"
description: "Create emergency hotfix branch for critical production issues"
category: "git"
version: "1.0.0"

triggers:
  exact: "/sc:hotfix"
  aliases: ["/hotfix", "/emergency-fix"]
  keywords: ["hotfix", "emergency", "critical bug"]

requires:
  mcps: []

parameters:
  - name: "version"
    type: "string"
    required: true
    description: "Hotfix version (e.g., 1.2.4)"
  - name: "description"
    type: "string"
    required: true
    description: "Brief description of the issue"

autoExecute: false
tokenEstimate: 4000
executionTime: "5-15s"
---

# /sc:hotfix - Emergency Hotfix

Creates emergency hotfix branch for critical production issues.

## When to Use Hotfix

### Use Hotfix For 🚨:
- Critical security vulnerabilities
- Data loss or corruption
- System crashes or downtime
- Payment/transaction failures
- Authentication/authorization breaks
- Compliance violations

### Don't Use Hotfix For ⚠️:
- Minor bugs (use regular fix)
- Feature requests (use feature branch)
- Performance optimizations (use regular flow)
- UI tweaks (use regular flow)
- Non-critical issues (use regular flow)

## Hotfix Workflow

```
Hotfix Flow (Emergency):
1. Create hotfix branch from main/master
2. Implement minimal fix
3. Test thoroughly
4. Merge to main (deploy immediately)
5. Merge to develop
6. Tag version
7. Delete hotfix branch
```

## Execution Flow

### 1. Incident Assessment

```markdown
🚨 CRITICAL INCIDENT

Severity: {Critical|High}
Impact: {Number} users affected
Issue: {description}
Reported: {timestamp}
SLA: Fix within {time}

Impact Assessment:
- Revenue impact: ${amount}/hour
- User impact: {percentage}% of users
- System impact: {description}
- Security risk: {level}

Immediate Actions:
1. ⏳ Create hotfix branch
2. ⏳ Implement fix
3. ⏳ Emergency testing
4. ⏳ Deploy to production
5. ⏳ Monitor and verify
6. ⏳ Post-mortem
```

### 2. Hotfix Branch Creation

```bash
# Get latest production code
git checkout main
git pull origin main

# Create hotfix branch
git checkout -b hotfix/{version}-{description}

# Example: hotfix/1.2.4-sql-injection

# Push immediately
git push -u origin hotfix/{version}-{description}
```

### 3. Rapid Fix Implementation

```markdown
⚡ Hotfix Implementation

Branch: hotfix/{version}-{description}
Base: main (production code)
Target Version: {version}

Fix Strategy:
- ✅ Minimal changes only
- ✅ Direct solution, no refactoring
- ✅ No new features
- ✅ No cosmetic changes
- ✅ Focus on stability

Time Box: {duration} minutes
```

### 4. Emergency Testing

```markdown
🧪 Emergency Testing Protocol

Required Tests (Cannot Skip):
- [ ] Reproducer test (issue must fail before fix)
- [ ] Fix verification (issue must pass after fix)
- [ ] Smoke tests (critical paths working)
- [ ] Regression tests (no new bugs introduced)

Optional Tests (If Time Permits):
- [ ] Full test suite
- [ ] Load testing
- [ ] E2E testing

Testing Timeline: {minutes} minutes
Risk Acceptance: Documented
```

### 5. Emergency Deployment

```bash
# Fast-track merge to main
git checkout main
git merge --no-ff hotfix/{version}-{description}

# Create version tag
git tag -a v{version} -m "Hotfix: {description}"

# Push to production
git push origin main --tags

# Emergency deployment
/sc:deploy production --skip-checks --emergency

# Merge back to develop
git checkout develop
git merge --no-ff hotfix/{version}-{description}
git push origin develop

# Delete hotfix branch
git branch -d hotfix/{version}-{description}
git push origin --delete hotfix/{version}-{description}
```

## Usage Examples

### Security Hotfix
```bash
/sc:hotfix "1.2.4" "SQL injection in user search"

# Creates: hotfix/1.2.4-sql-injection
# Severity: Critical
# Priority: Immediate deployment
#
# Workflow:
# 1. Fix SQL injection vulnerability
# 2. Security test
# 3. Deploy immediately
# 4. Notify security team
# 5. Post-mortem analysis
```

### Data Corruption Hotfix
```bash
/sc:hotfix "1.2.5" "data corruption in user profiles"

# Creates: hotfix/1.2.5-data-corruption
# Severity: Critical
# Priority: Immediate + data recovery
#
# Workflow:
# 1. Stop data corruption
# 2. Implement fix
# 3. Data recovery script
# 4. Deploy and verify
# 5. Monitor data integrity
```

### Service Outage Hotfix
```bash
/sc:hotfix "1.2.6" "api timeout causing service outage"

# Creates: hotfix/1.2.6-api-timeout
# Severity: High
# Priority: Restore service
#
# Workflow:
# 1. Identify timeout cause
# 2. Implement quick fix
# 3. Verify service restoration
# 4. Deploy
# 5. Monitor performance
```

## Hotfix Severity Levels

### Critical (P0) 🔴
```
Criteria:
- Complete service outage
- Data loss/corruption
- Security breach
- Legal/compliance violation

Response Time: Immediate
Fix Timeline: <1 hour
Deployment: Emergency (skip normal process)
Stakeholder Notification: CEO, CTO, all executives
```

### High (P1) 🟠
```
Criteria:
- Major feature broken
- Significant user impact (>20%)
- Payment processing issues
- Performance degradation

Response Time: <15 minutes
Fix Timeline: <4 hours
Deployment: Fast-tracked
Stakeholder Notification: VP Engineering, Product
```

### Medium (P2) 🟡
```
Criteria:
- Important feature broken
- Moderate user impact (5-20%)
- Workaround available
- Non-critical functionality

Response Time: <1 hour
Fix Timeline: <8 hours
Deployment: Expedited
Stakeholder Notification: Engineering manager
```

## Emergency Procedures

### Hotfix Communication Template

```markdown
🚨 HOTFIX DEPLOYMENT NOTICE

**Incident ID**: HOT-{date}-{number}
**Severity**: {level}
**Status**: {In Progress|Deployed|Monitoring}

**Issue**: {description}
**Impact**: {description}
**Affected Users**: {count} ({percentage}%)
**Started**: {timestamp}

**Timeline**:
- {time} - Issue detected
- {time} - Hotfix branch created
- {time} - Fix implemented
- {time} - Testing completed
- {time} - Deployed to production
- {time} - Verified fixed

**Fix Summary**:
- Root cause: {description}
- Solution: {description}
- Changes made: {list}

**Verification**:
- [ ] Issue no longer reproducible
- [ ] Service fully operational
- [ ] No new errors introduced
- [ ] Metrics returning to normal

**Next Steps**:
- Continued monitoring for {duration}
- Post-mortem scheduled for {date}
- Preventive measures: {list}

**Contact**: {on-call engineer}
```

### Rollback Plan

```markdown
⏪ Hotfix Rollback Plan

If Hotfix Makes Things Worse:

**Immediate Actions**:
1. ⚡ Revert deployment
   ```bash
   git revert HEAD
   git push origin main
   /sc:deploy production --emergency
   ```

2. ⚡ Notify stakeholders
   - Send rollback notice
   - Explain current state
   - Provide new timeline

3. ⚡ Return to previous version
   ```bash
   git checkout main
   git reset --hard v{previous_version}
   git push --force origin main
   ```

**Recovery Steps**:
- Verify service restored
- Review what went wrong
- Create new hotfix approach
- Implement with extra caution
```

## Hotfix Best Practices

### Do's ✅

1. **Minimal Changes**
   - Fix only the specific issue
   - No refactoring
   - No additional features
   - Keep diff small

2. **Thorough Testing**
   - Test the exact issue
   - Test affected systems
   - Test critical paths
   - Manual verification

3. **Clear Communication**
   - Notify all stakeholders
   - Document the issue
   - Explain the fix
   - Set expectations

4. **Fast Deployment**
   - Skip non-essential checks
   - Use emergency procedures
   - Monitor closely after
   - Be ready to rollback

### Don'ts ❌

1. **Don't Refactor**
   - No code cleanup
   - No reorganization
   - No optimization (unless needed for fix)

2. **Don't Add Features**
   - No "while we're at it" changes
   - No improvements
   - Only fix the issue

3. **Don't Skip Critical Tests**
   - Always test the fix
   - Always verify critical paths
   - Always have rollback ready

4. **Don't Panic**
   - Follow the process
   - Take time to think
   - Communicate clearly
   - Don't rush into broken fixes

## Post-Hotfix Procedures

### Post-Mortem Template

```markdown
# Post-Mortem: Hotfix v{version}

## Incident Summary
**Date**: {date}
**Duration**: {total_time}
**Severity**: {level}
**Impact**: {description}

## Timeline
| Time | Event |
|------|-------|
| {time} | Issue detected |
| {time} | Incident declared |
| {time} | Hotfix started |
| {time} | Fix deployed |
| {time} | Issue resolved |

## Root Cause
{Detailed explanation of why the issue occurred}

## What Went Well ✅
- Fast detection
- Quick response
- Effective communication
- Successful fix

## What Went Wrong ❌
- Late detection
- Unclear initial diagnosis
- Deployment delays
- Communication gaps

## Action Items
1. [ ] {Action 1} - @owner - Due: {date}
2. [ ] {Action 2} - @owner - Due: {date}
3. [ ] {Action 3} - @owner - Due: {date}

## Prevention Measures
- Add monitoring for {metric}
- Implement {test} tests
- Review {process}
- Update {documentation}

## Lessons Learned
{Key takeaways and how to prevent similar issues}
```

## Monitoring After Hotfix

```markdown
📊 Post-Deployment Monitoring

Critical Metrics (30 min):
- [ ] Error rate normal
- [ ] Response time normal
- [ ] User traffic stable
- [ ] Database healthy
- [ ] No new errors

Extended Monitoring (24 hours):
- [ ] All metrics within range
- [ ] No related issues
- [ ] User feedback positive
- [ ] System stable

Sign-off: {engineer} at {timestamp}
```

## Integration

### With Incident Management

```javascript
// Auto-create incident ticket
async function createHotfixIncident(version, description) {
  const incident = await jira.createIssue({
    type: 'Incident',
    priority: 'Critical',
    summary: `Hotfix ${version}: ${description}`,
    description: generateIncidentDescription(),
    labels: ['hotfix', 'production'],
    assignee: getOnCallEngineer()
  });

  await notifyTeam(incident);
  return incident;
}
```

### With Monitoring

```javascript
// Enhanced monitoring during hotfix
async function enableHotfixMonitoring(version) {
  await monitoring.increaseAlertSensitivity();
  await monitoring.enableDetailedLogging();
  await monitoring.notifyOnCallEngineer();
  await monitoring.recordDeployment(version, 'hotfix');
}
```

## Configuration

`.claude/settings.json`:
```json
{
  "commands": {
    "sc-hotfix": {
      "branchPrefix": "hotfix/",
      "requireApproval": false,
      "skipNonCriticalTests": true,
      "autoNotify": true,
      "createIncident": true,
      "enhancedMonitoring": true,
      "rollbackThreshold": "error_rate > 5%",
      "postMortemRequired": true
    }
  }
}
```

## Success Metrics

- Mean Time to Fix (MTTF): <1 hour
- Deployment success rate: >98%
- Rollback rate: <3%
- Post-hotfix incidents: <5%
- Communication effectiveness: >95%
- User satisfaction: Service restored
