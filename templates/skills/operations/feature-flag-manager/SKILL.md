---
name: "feature-flag-manager"
version: "1.0.0"
description: "Feature flag management with gradual rollouts, A/B testing, and kill switches"
author: "Code-Assistant-Claude"
category: "operations"

triggers:
  keywords: ["feature flag", "rollout", "a/b test", "canary"]
  patterns: ["feature.*flag", "gradual.*rollout"]
  filePatterns: ["**/flags/**", "**/features/**"]
  commands: ["/sc:feature-flag", "/sc:flag"]

tokenCost:
  metadata: 46
  fullContent: 2800
  resources: 950

dependencies:
  skills: []
  mcps: []

composability:
  compatibleWith: ["rollback-procedures"]
  conflictsWith: []

context:
  projectTypes: []
  minNodeVersion: "18.0.0"
  requiredTools: []

priority: "high"
autoActivate: true
cacheStrategy: "normal"
---

# Feature Flag Manager Skill

Comprehensive feature flag management with gradual rollouts, A/B testing, user targeting, and instant kill switches.

## Feature Flag Dashboard

```bash
/sc:feature-flag dashboard

Feature Flags Dashboard
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ACTIVE FLAGS:
┌──────────────────────────────────────────────┐
│ new-dashboard (v2.1.0)                       │
│ ├─ Status: ENABLED (50% rollout)            │
│ ├─ Created: 2024-01-10                      │
│ ├─ Users affected: 24,500 (50%)             │
│ ├─ A/B test: Running                        │
│ ├─ Metrics:                                 │
│ │  ├─ Conversion: +12% ✅                   │
│ │  ├─ Page load: 890ms ✅                   │
│ │  └─ Errors: 0.3% ✅                       │
│ └─ Next: Increase to 100%                   │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ payment-v3 (v2.1.0)                          │
│ ├─ Status: ENABLED (100%)                   │
│ ├─ Ready to remove: YES ⚠️                   │
│ └─ Action: Remove from code                 │
└──────────────────────────────────────────────┘

DEAD FLAGS (Unused):
├─ old-checkout (3 months) ⚠️
└─ Action: Cleanup recommended
```

## Gradual Rollout

```bash
# Start with 10%
/sc:feature-flag rollout new-dashboard --percentage=10

Rollout Plan:
├─ Target: 10% of users
├─ Selection: Random sampling
├─ Duration: Monitor for 24 hours
└─ Metrics tracked:
   ├─ Error rate
   ├─ Performance
   └─ User engagement

# Increase gradually
/sc:feature-flag rollout new-dashboard --percentage=25
/sc:feature-flag rollout new-dashboard --percentage=50
/sc:feature-flag rollout new-dashboard --percentage=100

# Instant rollback if issues
/sc:feature-flag disable new-dashboard  # 0 seconds downtime
```

## User Targeting

```typescript
// Target specific users
{
  "new-dashboard": {
    "enabled": true,
    "targeting": {
      "userIds": [123, 456, 789],
      "betaUsers": true,
      "regions": ["US", "EU"],
      "percentage": 50
    }
  }
}

// Usage in code
if (featureFlags.isEnabled('new-dashboard', user)) {
  return <NewDashboard />;
} else {
  return <OldDashboard />;
}
```

## A/B Testing

```bash
/sc:feature-flag ab-test new-checkout

A/B Test: new-checkout
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Variant A (Control - 50%):
├─ Old checkout flow
├─ Conversion: 3.2%
├─ Avg time: 2m 15s
└─ Users: 12,500

Variant B (Test - 50%):
├─ New checkout flow
├─ Conversion: 3.8% (+19%) ✅
├─ Avg time: 1m 45s (-22%) ✅
└─ Users: 12,500

Statistical Significance: 95% ✅
Winner: Variant B
Recommendation: Roll out to 100%
```

## Kill Switch

```bash
# Emergency disable
/sc:feature-flag kill new-feature

Kill Switch Activated
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Feature: new-feature
Status: DISABLED (instant)
Affected: 0 users (rolled back)
Reason: High error rate detected

Timeline:
├─ 10:15:00 - Error spike detected
├─ 10:15:05 - Kill switch activated
├─ 10:15:05 - All users on old version
└─ Downtime: 0 seconds ✅
```

## Usage

```bash
/sc:feature-flag create "new-dashboard"
/sc:feature-flag rollout "new-dashboard" --percentage=10
/sc:feature-flag enable "new-dashboard" --for=beta-users
/sc:feature-flag disable "new-dashboard"     # Kill switch
/sc:feature-flag analytics "new-dashboard"
/sc:feature-flag cleanup                     # Remove unused
```

## Success Metrics

- Zero-downtime feature deployment
- Instant rollback capability
- A/B testing integrated
- 80% reduction deployment risk
