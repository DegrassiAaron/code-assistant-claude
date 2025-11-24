---
name: "migration-manager"
version: "1.0.0"
description: "Automated database migration management with rollback safety, validation, and zero-downtime deployments"
author: "Code-Assistant-Claude"
category: "database"

triggers:
  keywords: ["migration", "database", "schema", "migrate"]
  patterns: ["create.*migration", "migrate.*database", "rollback.*migration"]
  filePatterns: ["migrations/**", "*.sql", "prisma/schema.prisma", "alembic/**"]
  commands: ["/sc:db-migrate", "/sc:migration"]

tokenCost:
  metadata: 52
  fullContent: 3800
  resources: 1400

dependencies:
  skills: []
  mcps: []

composability:
  compatibleWith: ["rollback-procedures", "environment-sync-manager"]
  conflictsWith: []

context:
  projectTypes: ["nodejs", "python", "ruby", "java", "go", "php"]
  minNodeVersion: "18.0.0"
  requiredTools: ["psql", "mysql", "mongodb"]

priority: "high"
autoActivate: true
cacheStrategy: "normal"
---

# Database Migration Manager Skill

Comprehensive database migration management with automatic generation, validation, safe rollback, and zero-downtime deployment strategies.

## Migration Strategies

```markdown
🗄️  Migration Deployment Strategies

Strategy 1: OFFLINE (Traditional - WITH Downtime)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Stop application
2. Backup database
3. Run migrations
4. Validate
5. Start application

Downtime: 5-30 minutes
Risk: LOW
Use Case: Small apps, maintenance windows

Strategy 2: ONLINE (Zero Downtime)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Run backward-compatible migrations
2. Deploy new app version (gradual)
3. Remove backward compatibility (next deploy)

Downtime: 0 seconds
Risk: MEDIUM
Use Case: Production systems, 24/7 availability

Strategy 3: SHADOW TABLES (Zero Downtime)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Create shadow table with new schema
2. Dual-write to both tables
3. Backfill data
4. Swap tables atomically
5. Remove old table

Downtime: 0 seconds
Risk: LOW
Use Case: Large tables, critical systems

Strategy 4: BLUE-GREEN DATABASE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Clone database (blue → green)
2. Run migrations on green
3. Test green database
4. Switch application to green
5. Keep blue for rollback

Downtime: <1 second (switch time)
Risk: LOW
Use Case: Critical systems, easy rollback needed
```

## Migration Generation

```markdown
🔨 Automatic Migration Generation

From ORM Models:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
bash
# Prisma (Node.js)
/sc:db-migrate create --from=schema

# Generates:
-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "name" TEXT,
    "createdAt" TIMESTAMP DEFAULT NOW()
);


# Django (Python)
/sc:db-migrate create --from=models

# Generates:
# migrations/0002_add_user_preferences.py
operations = [
    migrations.CreateModel(
        name='UserPreferences',
        fields=[
            ('id', models.AutoField(primary_key=True)),
            ('user', models.ForeignKey('User')),
            ('theme', models.CharField(max_length=20)),
        ],
    ),
]


From Schema Changes:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
bash
/sc:db-migrate create "add_user_preferences"

# Interactive prompts:
# - Migration type: [add_column, remove_column, create_table, etc.]
# - Table name: users
# - Column details: preferences JSONB DEFAULT '{}'


Manual SQL:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
bash
/sc:db-migrate create "custom_migration" --sql

# Creates template with up/down:
-- migrations/20240116_custom_migration.sql
-- UP
BEGIN;
  -- Your SQL here
COMMIT;

-- DOWN
BEGIN;
  -- Rollback SQL here
COMMIT;

```

## Migration Validation

```markdown
✅ Pre-Flight Validation

Syntax Validation:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
bash
/sc:db-migrate validate

Checks:
├─ ✅ SQL syntax valid
├─ ✅ All referenced tables exist
├─ ✅ Foreign key constraints valid
├─ ✅ Data types compatible
├─ ✅ Index names unique
└─ ✅ No conflicting migrations

Result: ✅ SAFE TO APPLY


Safety Checks:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Automatic Detection of Dangerous Operations:

⚠️  WARNING: Potentially Dangerous Operations Detected

1. DROP COLUMN users.legacy_field
   Risk: Data loss (200,000 rows affected)
   Recommendation:
   - Backup table first
   - Consider soft-delete pattern
   - Or create archive table

2. ALTER COLUMN users.email TYPE VARCHAR(100)
   Risk: Data truncation (15 rows exceed 100 chars)
   Recommendation:
   - Check max length first: SELECT MAX(LENGTH(email))
   - Update long values before migration
   - Or increase limit to VARCHAR(255)

3. ADD CONSTRAINT users_email_unique UNIQUE(email)
   Risk: Constraint violation (45 duplicate emails)
   Recommendation:
   - Find duplicates: SELECT email, COUNT(*) GROUP BY email HAVING COUNT(*) > 1
   - Clean duplicates first
   - Then add constraint

Proceed? [y/N]:


Performance Impact Analysis:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
bash
/sc:db-migrate analyze migration_20240116

Performance Impact Report:

Migration: add_index_users_email
Estimated Duration: 45 seconds
Table Size: 2.1 GB (1.5M rows)
Lock Type: SHARE (reads allowed, writes blocked)

Impact:
├─ Reads: ✅ Allowed (no impact)
├─ Writes: ❌ BLOCKED for 45 seconds
├─ Disk Space: +180 MB (index size)
└─ Overall Impact: 🟡 MEDIUM

Recommendations:
1. Use CREATE INDEX CONCURRENTLY (PostgreSQL)
   - No write blocking
   - Takes longer but safer

2. Schedule during low-traffic window
   - Suggested: 2-4 AM UTC
   - Current traffic: 250 writes/min
   - Low traffic: <50 writes/min

3. Monitor locks:
   SELECT * FROM pg_locks WHERE relation = 'users'::regclass;

```

## Zero-Downtime Migration Example

```markdown
🚀 Zero-Downtime Migration: Adding NOT NULL Column

Problem: Add required column to large table without downtime

Bad Approach (Causes Downtime):
sql
-- ❌ This locks table and fails on existing rows
ALTER TABLE users ADD COLUMN phone VARCHAR(20) NOT NULL;


Good Approach (Zero Downtime):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Step 1: Add nullable column (fast, no lock)
sql
-- Migration 001: Add column as nullable
ALTER TABLE users ADD COLUMN phone VARCHAR(20) DEFAULT NULL;


Step 2: Deploy app with dual-write (Deploy v1.1)
typescript
// App writes to new column
await User.create({
  email: 'user@example.com',
  phone: '+1234567890'  // ✅ Now writing to phone
});


Step 3: Backfill existing data (background job)
sql
-- Run in batches to avoid long locks
UPDATE users
SET phone = ''
WHERE phone IS NULL
LIMIT 1000;

-- Progress tracking:
SELECT
  COUNT(*) FILTER (WHERE phone IS NOT NULL) as filled,
  COUNT(*) FILTER (WHERE phone IS NULL) as remaining
FROM users;


Step 4: Add NOT NULL constraint (after backfill complete)
sql
-- Migration 002: Make column required
ALTER TABLE users
ALTER COLUMN phone SET NOT NULL,
ALTER COLUMN phone SET DEFAULT '';


Total Downtime: 0 seconds ✅
Total Time: ~1 hour (backfill)
Risk: LOW

```

## Migration Rollback

```markdown
🔙 Safe Rollback Procedures

Automatic Rollback:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
bash
/sc:db-migrate rollback

# Rolls back last migration

Rollback Log:
├─ 14:30:00 - Creating backup
├─ 14:30:15 - Backup complete (users_backup_20240116)
├─ 14:30:20 - Running DOWN migration
├─ 14:30:25 - Migration rolled back
├─ 14:30:30 - Validating schema
└─ 14:30:35 - Rollback successful ✅


Rollback to Specific Version:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
bash
/sc:db-migrate rollback --to=20240115_add_user_table

Rollback Plan:
Will rollback 3 migrations:
├─ 20240116_add_preferences (can rollback: YES)
├─ 20240116_add_avatar (can rollback: YES)
└─ 20240115_add_phone (can rollback: YES)

⚠️  Warning: This will:
- Drop table user_preferences (3,456 rows)
- Drop column users.avatar
- Drop column users.phone

Backup required: YES
Estimated time: 2 minutes

Proceed? [y/N]:


Point-in-Time Recovery:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
bash
/sc:db-migrate restore --timestamp="2024-01-16 12:00:00"

# Uses database PITR features
# AWS RDS, Google Cloud SQL, etc.


Emergency Rollback (Fast):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
bash
/sc:db-migrate rollback --emergency

# Skips validation, immediate rollback
# Use only when service is down
```

## Migration Monitoring

```markdown
📊 Migration Status Dashboard

bash
/sc:db-migrate status

Database Migration Status
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Current Schema Version: 20240116_add_preferences
Last Migration: 2024-01-16 14:30:00
Status: ✅ UP TO DATE

Migration History:
┌──────────────────────────────────────────────┐
│ ✅ 20240116_add_preferences                  │
│    Applied: 2024-01-16 14:30:00              │
│    Duration: 0.8 seconds                     │
│    Author: @developer1                       │
│                                              │
│ ✅ 20240115_add_avatar                       │
│    Applied: 2024-01-15 10:00:00              │
│    Duration: 1.2 seconds                     │
│    Author: @developer2                       │
│                                              │
│ ✅ 20240114_add_phone                        │
│    Applied: 2024-01-14 09:00:00              │
│    Duration: 45.3 seconds (backfill)         │
│    Author: @developer1                       │
└──────────────────────────────────────────────┘

Pending Migrations: 0
Rollback Available: YES (last 10 migrations)

Database Health:
├─ Connection: ✅ OK
├─ Disk Space: 45% used (22 GB free)
├─ Slow Queries: 12 (check indexes)
└─ Lock Contention: None

Next Action: Run /sc:db-migrate validate
```

## Multi-Environment Management

```markdown
🌍 Environment Synchronization

Check Drift:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
bash
/sc:db-migrate compare dev staging production

Environment Comparison:
┌────────────┬──────────┬──────────┬──────────┐
│ Migration  │ Dev      │ Staging  │ Prod     │
├────────────┼──────────┼──────────┼──────────┤
│ 001_init   │ ✅       │ ✅       │ ✅       │
│ 002_users  │ ✅       │ ✅       │ ✅       │
│ 003_prefs  │ ✅       │ ✅       │ ❌       │
│ 004_avatar │ ✅       │ ❌       │ ❌       │
└────────────┴──────────┴──────────┴──────────┘

Schema Drift Detected:
⚠️  Staging is 1 migration behind dev
⚠️  Production is 2 migrations behind dev

Recommendation:
1. Test 003_prefs on staging
2. If successful, apply to production
3. Then repeat for 004_avatar


Sync Environments:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
bash
/sc:db-migrate sync dev→staging

Sync Plan:
Will apply 1 migration to staging:
├─ 004_avatar

Pre-checks:
├─ ✅ Migration validated
├─ ✅ Backup created
├─ ✅ Rollback plan ready
└─ ✅ Safe to proceed

Apply? [y/N]:
```

## Migration Testing

```markdown
🧪 Migration Testing

Test on Copy:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
bash
/sc:db-migrate test migration_20240116

Test Plan:
1. Create database copy
2. Apply migration
3. Run validation queries
4. Check data integrity
5. Measure performance
6. Generate report

Test Results:
├─ ✅ Migration applied successfully (0.8s)
├─ ✅ All constraints valid
├─ ✅ No data loss (1.5M rows verified)
├─ ✅ Performance acceptable (<1s queries)
└─ ✅ SAFE TO APPLY TO PRODUCTION


Dry Run:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
bash
/sc:db-migrate apply --dry-run

Dry Run Report:
Would execute:
sql
BEGIN;
ALTER TABLE users ADD COLUMN preferences JSONB DEFAULT '{}';
CREATE INDEX idx_users_preferences ON users USING GIN(preferences);
COMMIT;


Estimated impact:
├─ Lock duration: ~0.8 seconds
├─ Disk space: +45 MB
├─ Affected rows: 1,500,000
└─ Risk level: 🟢 LOW

No changes made (dry run mode)
```

## Automated Backup

```markdown
💾 Automatic Backup Strategy

Pre-Migration Backup:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
bash
# Automatic before each migration
/sc:db-migrate apply migration_20240116

Backup Process:
├─ 14:30:00 - Creating snapshot
├─ 14:30:15 - Snapshot complete
│   Location: backups/pre_migration_20240116.dump
│   Size: 2.4 GB (compressed)
│   Retention: 7 days
│
├─ 14:30:20 - Applying migration
├─ 14:30:21 - Migration successful
└─ 14:30:25 - Backup marked as recoverable ✅


Backup Strategies by Database:

PostgreSQL:
sql
-- Logical backup
pg_dump -Fc mydb > backup.dump

-- Physical backup (faster for large DBs)
pg_basebackup -D backup_dir


MySQL:
bash
mysqldump --single-transaction mydb > backup.sql


MongoDB:
bash
mongodump --out=backup_dir


AWS RDS:
bash
# Automated snapshot
aws rds create-db-snapshot \
  --db-instance-identifier mydb \
  --db-snapshot-identifier pre-migration-20240116

```

## Configuration

`.claude/settings.json`:
```json
{
  "skills": {
    "migration-manager": {
      "strategy": "online",
      "autoBackup": true,
      "validation": {
        "preCheck": true,
        "safetyCheck": true,
        "performanceAnalysis": true
      },
      "rollback": {
        "autoOnFailure": true,
        "keepBackups": 7
      },
      "environments": {
        "dev": {
          "url": "postgresql://localhost/mydb_dev"
        },
        "staging": {
          "url": "postgresql://staging/mydb"
        },
        "production": {
          "url": "postgresql://prod/mydb",
          "requireApproval": true,
          "maintenanceWindow": "02:00-04:00 UTC"
        }
      }
    }
  }
}
```

## Usage

```bash
# Create migration
/sc:db-migrate create "add_user_preferences"

# Validate before apply
/sc:db-migrate validate

# Apply migration
/sc:db-migrate apply

# Apply to specific environment
/sc:db-migrate apply --environment=staging

# Rollback last migration
/sc:db-migrate rollback

# Check status
/sc:db-migrate status

# Compare environments
/sc:db-migrate compare dev staging prod

# Test migration safely
/sc:db-migrate test migration_20240116
```

## Success Metrics

- Migration success rate: >99.5%
- Zero data loss: 100%
- Rollback time: <2 minutes
- Zero-downtime deployments: 95%
- Schema drift detection: 100%
