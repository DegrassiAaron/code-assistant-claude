---
name: "rollback-procedures"
version: "1.0.0"
description: "Automated rollback procedures with health checks, data integrity validation, and incident response"
author: "Code-Assistant-Claude"
category: "maintenance"

triggers:
  keywords: ["rollback", "revert", "undo deployment", "emergency", "incident"]
  patterns: ["rollback.*deployment", "revert.*changes", "emergency.*rollback"]
  filePatterns: []
  commands: ["/sc:rollback", "/sc:emergency-rollback"]

tokenCost:
  metadata: 46
  fullContent: 3600
  resources: 1000

dependencies:
  skills: []
  mcps: []

composability:
  compatibleWith: ["security-auditor", "performance-monitor"]
  conflictsWith: []

context:
  projectTypes: ["javascript", "typescript", "python", "ruby", "go", "java", "nodejs", "react"]
  minNodeVersion: "18.0.0"
  requiredTools: ["git", "kubectl"]

priority: "critical"
autoActivate: true
cacheStrategy: "normal"
---

# Rollback Procedures Skill

Comprehensive rollback and disaster recovery procedures with automated health checks, data integrity validation, multi-environment support, and incident response workflows.

## Rollback Strategy

```markdown
🔄 Rollback Decision Tree

Incident Detected
├─ Assess Severity
│   ├─ CRITICAL: Immediate rollback
│   │   ├─ Data loss
│   │   ├─ Security breach
│   │   ├─ Complete service outage
│   │   └─ Execute: Emergency Rollback (Auto)
│   │
│   ├─ HIGH: Rapid rollback (within 15 min)
│   │   ├─ Major feature broken
│   │   ├─ Performance degradation >50%
│   │   ├─ Error rate >5%
│   │   └─ Execute: Fast Rollback (Manual approval)
│   │
│   ├─ MEDIUM: Planned rollback (within 1 hour)
│   │   ├─ Minor feature issues
│   │   ├─ Performance degradation <50%
│   │   ├─ Error rate 1-5%
│   │   └─ Execute: Standard Rollback
│   │
│   └─ LOW: Forward fix preferred
│       ├─ Cosmetic issues
│       ├─ Non-critical bugs
│       ├─ Error rate <1%
│       └─ Execute: Hot Fix instead
│
├─ Validate Rollback Readiness
│   ├─ Check previous version availability
│   ├─ Verify database compatibility
│   ├─ Assess data migration requirements
│   ├─ Review infrastructure changes
│   └─ Confirm rollback window
│
├─ Execute Rollback
│   ├─ Application rollback
│   ├─ Database rollback (if needed)
│   ├─ Configuration rollback
│   └─ Cache invalidation
│
├─ Validate Post-Rollback
│   ├─ Health checks passing
│   ├─ Error rate normalized
│   ├─ Performance metrics stable
│   └─ User impact minimized
│
└─ Incident Response
    ├─ Document incident
    ├─ Root cause analysis
    ├─ Create post-mortem
    └─ Implement prevention measures
```

## Rollback Types

### 1. Application Rollback

```markdown
📦 Application Rollback

Method 1: Blue-Green Deployment (Instant)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Current: Blue (v2.1.0) ← Traffic
Previous: Green (v2.0.5)

Rollback:
1. Switch traffic: Blue → Green
2. Downtime: ~0 seconds
3. Monitor: Green environment

bash
# Kubernetes example
kubectl set image deployment/app app=app:v2.0.5
kubectl rollout status deployment/app


Method 2: Rolling Rollback (Gradual)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Current: v2.1.0 (5 pods)
Target: v2.0.5

Rollback:
1. Replace pods one by one
2. Validate each pod before continuing
3. Downtime: ~0 seconds
4. Duration: 5-10 minutes

bash
# Kubernetes rollback
kubectl rollout undo deployment/app
kubectl rollout status deployment/app

# Or specific revision
kubectl rollout undo deployment/app --to-revision=3


Method 3: Canary Rollback (Safe)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Current: 95% v2.1.0, 5% v2.0.5 (canary)
Target: 100% v2.0.5

Rollback:
1. Shift 10% traffic to v2.0.5
2. Monitor metrics
3. Gradually increase to 100%
4. Duration: 30-60 minutes

Method 4: Git Revert (Code-level)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
bash
# Revert last commit
git revert HEAD
git push origin main

# Revert specific commit
git revert abc123
git push origin main

# Revert range
git revert HEAD~3..HEAD
git push origin main

# Force rollback (use carefully!)
git reset --hard abc123
git push --force origin main

```

### 2. Database Rollback

```markdown
🗄️  Database Rollback

Method 1: Migration Rollback
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
bash
# Run down migration
npm run migrate:down
# or
python manage.py migrate app_name 0023_previous_migration


Method 2: Backup Restore
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
bash
# Stop application
kubectl scale deployment/app --replicas=0

# Restore database backup
pg_restore -d mydb backup_20240115_1200.dump

# Restart application
kubectl scale deployment/app --replicas=5


Method 3: Point-in-Time Recovery (PITR)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
bash
# AWS RDS example
aws rds restore-db-instance-to-point-in-time \
  --source-db-instance-identifier mydb \
  --target-db-instance-identifier mydb-restored \
  --restore-time 2024-01-15T12:00:00Z


Method 4: Shadow Tables (Zero Downtime)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
sql
-- Keep old data in shadow table
CREATE TABLE users_v2_0_5 AS TABLE users;

-- Rollback: Swap tables
BEGIN;
ALTER TABLE users RENAME TO users_v2_1_0;
ALTER TABLE users_v2_0_5 RENAME TO users;
COMMIT;

```

### 3. Infrastructure Rollback

```markdown
☁️  Infrastructure Rollback

Terraform Rollback:
bash
# Revert to previous state
terraform state pull > backup.tfstate
terraform state push previous.tfstate
terraform apply

# Or revert specific resource
terraform import aws_instance.web i-1234567890abcdef0
terraform apply


CloudFormation Rollback:
bash
# AWS automatically rolls back on failure
# Or manual rollback
aws cloudformation cancel-update-stack --stack-name mystack
aws cloudformation continue-update-rollback --stack-name mystack


Kubernetes Config Rollback:
bash
# Rollback to previous configuration
kubectl rollout undo deployment/app
kubectl rollout undo service/app-service

# Rollback specific resource
kubectl rollout undo deployment/app --to-revision=3

```

## Rollback Execution Plan

```markdown
🚨 EMERGENCY ROLLBACK PROCEDURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Incident: Production deployment v2.1.0 causing errors
Severity: CRITICAL
Decision: Immediate rollback to v2.0.5
Started: 2024-01-15 14:32:00 UTC
Operator: @oncall-engineer

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PHASE 1: PRE-ROLLBACK CHECKS (2 minutes)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[14:32:00] ✅ Verify incident severity
├─ Error rate: 15.3% ❌ (target: <1%)
├─ Response time p99: 8.2s ❌ (target: <1s)
├─ Affected users: 45,000 (89%)
└─ Decision: PROCEED WITH ROLLBACK

[14:32:15] ✅ Identify target version
├─ Current: v2.1.0 (deployed 14:15:00)
├─ Previous: v2.0.5 (stable)
├─ Previous deployment date: 2024-01-10
└─ Previous version verified in registry

[14:32:30] ✅ Check rollback compatibility
├─ Database migrations: 1 new migration
│   └─ Migration reversible: YES ✅
├─ Configuration changes: API key rotation
│   └─ Compatible with v2.0.5: YES ✅
├─ Infrastructure changes: None
└─ Data compatibility: YES ✅

[14:32:45] ✅ Notify stakeholders
├─ Engineering team: Notified via Slack
├─ Management: Escalation sent
├─ Customer support: Alert sent
└─ Status page: Updated (investigating)

[14:33:00] ✅ Capture diagnostic data
├─ Error logs: Saved (last 30 minutes)
├─ Metrics snapshot: Captured
├─ User reports: Documented
└─ Database state: Checkpoint created

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PHASE 2: APPLICATION ROLLBACK (5 minutes)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[14:33:30] ⏳ Start application rollback
├─ Method: Kubernetes rolling update
├─ Target: v2.0.5
└─ Replicas: 10 pods

[14:33:45] ⏳ Rollback pod 1/10
├─ Terminate v2.1.0 pod
├─ Start v2.0.5 pod
├─ Health check: PASS ✅
└─ Duration: 15s

[14:34:00] ⏳ Rollback pod 2/10
├─ Health check: PASS ✅
└─ Duration: 12s

[14:34:12] ⏳ Rollback pod 3/10
├─ Health check: PASS ✅
└─ Duration: 14s

[14:34:26] ⏳ Rollback pods 4-10
├─ Batch rollback (7 pods)
├─ All health checks: PASS ✅
└─ Duration: 2m 15s

[14:36:41] ✅ Application rollback complete
├─ All 10 pods running v2.0.5
├─ Health checks: 10/10 passing
└─ Ready to serve traffic

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PHASE 3: DATABASE ROLLBACK (3 minutes)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[14:36:45] ⏳ Analyze database changes
├─ New migration: 20240115_add_user_preferences
├─ Changes: New table user_preferences
├─ Data: 3,456 rows inserted
└─ Reversible: YES (down migration available)

[14:37:00] ⏳ Run down migration
bash
npm run migrate:down 20240115_add_user_preferences

├─ Drop table user_preferences: SUCCESS ✅
├─ Duration: 1.2s
└─ Database at previous schema version

[14:37:30] ✅ Validate database state
├─ Schema version: Matches v2.0.5 ✅
├─ Data integrity: Verified ✅
├─ Constraints: All valid ✅
└─ Database rollback complete

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PHASE 4: CONFIGURATION ROLLBACK (1 minute)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[14:37:45] ⏳ Revert configuration changes
├─ ConfigMap: Reverted to v2.0.5
├─ Secrets: No changes needed
├─ Environment variables: Reverted
└─ Feature flags: Reverted to previous state

[14:38:00] ⏳ Restart services (if needed)
├─ Application pods: Already restarted
├─ Background workers: Restarted (2 pods)
├─ Cron jobs: Updated to v2.0.5
└─ Cache: Flushed

[14:38:30] ✅ Configuration rollback complete

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PHASE 5: POST-ROLLBACK VALIDATION (5 minutes)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[14:39:00] ⏳ Run health checks
├─ HTTP health: 10/10 pods healthy ✅
├─ Database connection: OK ✅
├─ External APIs: OK ✅
└─ Cache: OK ✅

[14:39:30] ⏳ Validate metrics
├─ Error rate: 0.3% ✅ (was 15.3%)
├─ Response time p99: 450ms ✅ (was 8.2s)
├─ CPU usage: 45% ✅ (normal)
├─ Memory usage: 62% ✅ (normal)
└─ Metrics: NORMALIZED ✅

[14:40:00] ⏳ Test critical user flows
├─ User login: SUCCESS ✅
├─ Create order: SUCCESS ✅
├─ Payment processing: SUCCESS ✅
├─ Dashboard load: SUCCESS ✅
└─ All critical flows: WORKING ✅

[14:40:30] ⏳ Monitor error logs
├─ Application errors: 2 errors/min ✅ (normal)
├─ Database errors: 0 errors/min ✅
├─ 5xx errors: 0.1% ✅
└─ Error rate: ACCEPTABLE ✅

[14:41:00] ⏳ Check user impact
├─ Active users: 48,500 (96%) ✅
├─ User reports: Decreasing ✅
├─ Support tickets: 3 new (down from 45) ✅
└─ User impact: MINIMAL ✅

[14:42:00] ✅ Post-rollback validation complete
├─ System stable: YES ✅
├─ Metrics normalized: YES ✅
├─ Users restored: YES ✅
└─ Rollback successful: YES ✅

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PHASE 6: INCIDENT RESPONSE (Ongoing)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[14:43:00] ✅ Update status page
├─ Status: RESOLVED
├─ Message: "Service restored to previous version"
└─ Published: 14:43:00 UTC

[14:45:00] ⏳ Stakeholder communication
├─ Engineering team: Updated
├─ Management: Notified of resolution
├─ Customer support: Service restored
└─ Customers: Status page updated

[14:50:00] 📋 Create incident ticket
├─ Ticket: INC-2024-0115-001
├─ Severity: CRITICAL (P0)
├─ Duration: 18 minutes (14:32 - 14:50)
├─ Impact: 45,000 users (89%)
└─ Status: Resolved (rollback complete)

[15:00:00] 📊 Initial root cause analysis
├─ Symptom: High error rate (15.3%)
├─ Cause: Null pointer exception in new feature
├─ Trigger: Incompatible data format
├─ Prevention: Add integration tests
└─ Full RCA: Scheduled for tomorrow

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ROLLBACK SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Start Time: 14:32:00 UTC
End Time: 14:42:00 UTC
Duration: 10 minutes
Status: ✅ SUCCESS

Timeline:
├─ Decision: 2 minutes
├─ Application rollback: 5 minutes
├─ Database rollback: 3 minutes
├─ Configuration rollback: 1 minute
└─ Validation: 5 minutes

Impact:
├─ Users affected: 45,000 (89%)
├─ Error rate: 15.3% → 0.3%
├─ Response time: 8.2s → 450ms
├─ Downtime: 0 seconds (rolling update)
└─ Data loss: None ✅

Next Steps:
1. ⏳ Complete root cause analysis (Due: Tomorrow)
2. ⏳ Add integration tests (Priority: HIGH)
3. ⏳ Review deployment process (Priority: MEDIUM)
4. ⏳ Post-mortem meeting (Scheduled: Tomorrow 10 AM)
5. ⏳ Update runbooks (Priority: MEDIUM)

Lessons Learned:
- Monitoring caught issue within 2 minutes ✅
- Rollback procedure executed smoothly ✅
- Rolling update prevented downtime ✅
- Need better pre-deployment testing ⚠️
```

## Rollback Decision Matrix

```markdown
📊 Rollback Decision Matrix

┌─────────────────────────────────────────────────────────┐
│ AUTOMATIC ROLLBACK (No approval needed)                │
├─────────────────────────────────────────────────────────┤
│ ✅ Error rate >10% for >2 minutes                      │
│ ✅ Response time p99 >5s for >5 minutes                │
│ ✅ Complete service outage                             │
│ ✅ Security breach detected                            │
│ ✅ Data corruption detected                            │
│ ✅ Critical compliance violation                       │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ MANUAL ROLLBACK (Requires approval)                    │
├─────────────────────────────────────────────────────────┤
│ ⚠️  Error rate 5-10% for >5 minutes                    │
│ ⚠️  Response time p99 2-5s for >10 minutes             │
│ ⚠️  Major feature broken                               │
│ ⚠️  Performance degradation >50%                       │
│ ⚠️  Database migration concerns                        │
│ ⚠️  Partial service outage                             │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ FORWARD FIX PREFERRED (Avoid rollback)                 │
├─────────────────────────────────────────────────────────┤
│ ✨ Error rate <5%                                       │
│ ✨ Response time degradation <50%                      │
│ ✨ Non-critical feature issues                         │
│ ✨ Cosmetic bugs                                        │
│ ✨ Fix can be deployed within 30 minutes               │
│ ✨ Rollback would cause data loss                      │
└─────────────────────────────────────────────────────────┘
```

## Automated Rollback Triggers

```yaml
# Automated rollback configuration
rollback:
  triggers:
    - name: high_error_rate
      condition: error_rate > 0.10
      duration: 2m
      action: immediate_rollback

    - name: critical_performance
      condition: response_time_p99 > 5000ms
      duration: 5m
      action: immediate_rollback

    - name: service_outage
      condition: health_check_failures > 80%
      duration: 1m
      action: immediate_rollback

  validation:
    - health_checks_passing: true
    - error_rate: <0.01
    - response_time_p99: <1000ms
    - cpu_usage: <80%
    - memory_usage: <85%

  notifications:
    - slack: "#incidents"
    - pagerduty: "oncall-team"
    - email: "engineering@company.com"
```

## Configuration

`.claude/settings.json`:
```json
{
  "skills": {
    "rollback-procedures": {
      "autoRollback": {
        "enabled": true,
        "errorRateThreshold": 0.10,
        "responseTimeThreshold": 5000,
        "requireApproval": false
      },
      "manualRollback": {
        "errorRateThreshold": 0.05,
        "responseTimeThreshold": 2000,
        "requireApproval": true,
        "approvers": ["@tech-lead", "@oncall"]
      },
      "validation": {
        "runHealthChecks": true,
        "validateMetrics": true,
        "testCriticalFlows": true,
        "monitorDuration": "5m"
      },
      "notifications": {
        "slack": true,
        "pagerduty": true,
        "statusPage": true
      }
    }
  }
}
```

## Usage

```bash
# Emergency rollback (automatic)
/sc:rollback emergency

# Standard rollback (with approval)
/sc:rollback --version=v2.0.5

# Rollback with validation
/sc:rollback --version=v2.0.5 --validate

# Database-only rollback
/sc:rollback database --migration=20240115

# Dry-run (test without executing)
/sc:rollback --dry-run --version=v2.0.5

# Rollback status
/sc:rollback status
```

## Success Metrics

- Rollback decision time: <2 minutes
- Rollback execution time: <10 minutes
- Rollback success rate: >99%
- Zero data loss: 100%
- Post-rollback stability: >99.9%
