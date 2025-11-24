---
name: "environment-sync"
version: "1.0.0"
description: "Environment synchronization with config sync, data anonymization, and drift detection"
author: "Code-Assistant-Claude"
category: "devops"

triggers:
  keywords: ["sync environment", "env sync", "environment drift"]
  patterns: ["sync.*environment", "compare.*environments"]
  filePatterns: [".env*", "config/*"]
  commands: ["/sc:env-sync"]

tokenCost:
  metadata: 48
  fullContent: 2700
  resources: 950

dependencies:
  skills: ["migration-manager"]
  mcps: []

composability:
  compatibleWith: ["migration-manager", "rollback-procedures"]
  conflictsWith: []

context:
  projectTypes: []
  minNodeVersion: "18.0.0"
  requiredTools: []

priority: "medium"
autoActivate: true
cacheStrategy: "normal"
---

# Environment Sync Manager Skill

Automated environment synchronization with config sync, data anonymization, schema comparison, and drift detection.

## Environment Comparison

```bash
/sc:env-sync compare dev staging production

Environment Comparison
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CONFIGURATION:
├─ DATABASE_URL: ✅ Different (expected)
├─ API_KEY: ⚠️  Different (should match?)
├─ FEATURE_FLAGS: ❌ Missing in staging
└─ NODE_ENV: ✅ Different (expected)

DATABASE:
├─ Schema: staging=v2.0.5, prod=v2.1.0 ❌
├─ Tables: 42 in both ✅
├─ Indexes: staging=87, prod=92 ⚠️
└─ Rows: staging=1.2M, prod=5.4M ✅

DEPENDENCIES:
├─ react: staging=18.2.0, prod=18.3.1 ⚠️
├─ typescript: Both on 5.3.3 ✅
└─ 12 other differences ⚠️

Drift Score: 23/100 (High drift)
Action Required: Sync recommended
```

## Safe Data Sync

```bash
/sc:env-sync database prod→staging --anonymize

Data Sync with Anonymization
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Source: production (5.4M rows)
Target: staging
Mode: ANONYMIZE (GDPR compliant)

Anonymization Rules:
├─ users.email → fake emails
├─ users.phone → masked
├─ users.name → fake names
├─ orders.address → generic addresses
└─ payments.card_number → REDACTED

Progress:
├─ Schema sync: ✅ Complete
├─ Data copy: ⏳ 45% (2.4M/5.4M rows)
├─ Anonymization: ⏳ Processing
└─ ETA: 8 minutes

Status: 🟢 Safe to use for testing
```

## Snapshot Management

```bash
/sc:env-sync snapshot production

Snapshot created:
├─ ID: snapshot-20240116-143000
├─ Size: 2.4 GB (compressed)
├─ Tables: 42
├─ Rows: 5.4M
├─ Duration: 45 seconds
└─ Retention: 7 days

Restore:
/sc:env-sync restore snapshot-20240116-143000 staging
```

## Usage

```bash
/sc:env-sync compare dev staging prod   # Compare all
/sc:env-sync config dev→staging         # Sync config only
/sc:env-sync database prod→staging --anonymize
/sc:env-sync snapshot production        # Create snapshot
/sc:env-sync restore snapshot-id env    # Restore
```

## Success Metrics

- Drift detection: 100%
- Data anonymization: GDPR compliant
- Sync speed: <10 min for 5M rows
- Zero production data leaks
