---
name: "incident-coordinator"
version: "1.0.0"
description: "Automated incident response coordination with runbook automation, communication tracking, and post-mortem generation"
author: "Code-Assistant-Claude"
category: "operations"

triggers:
  keywords: ["incident", "outage", "emergency", "p0", "sev1"]
  patterns: ["incident.*response", "create.*incident", "outage"]
  filePatterns: []
  commands: ["/sc:incident"]

tokenCost:
  metadata: 46
  fullContent: 2800
  resources: 1000

dependencies:
  skills: ["rollback-procedures"]
  mcps: []

composability:
  compatibleWith: ["rollback-procedures", "performance-monitor"]
  conflictsWith: []

context:
  projectTypes: []
  minNodeVersion: "18.0.0"
  requiredTools: []

priority: "critical"
autoActivate: true
cacheStrategy: "normal"
---

# Incident Response Coordinator Skill

Automated incident response with severity classification, stakeholder notification, timeline tracking, and post-mortem generation.

## Incident Workflow

```bash
# Detect incident (auto or manual)
/sc:incident create --severity=P0 "Production database unavailable"

🚨 INCIDENT: INC-2024-001
Severity: P0 (Critical)
Started: 10:15:00 UTC

Timeline:
├─ 10:15:00 - Incident detected
├─ 10:15:30 - On-call paged
├─ 10:16:00 - War room created
├─ 10:16:15 - Status page updated
└─ 10:17:00 - Root cause investigation

Stakeholders notified:
✅ Engineering team (Slack)
✅ Management (Email)
✅ Customers (Status page)

Next: /sc:incident update "status"
```

## Post-Mortem Generation

```markdown
# Auto-generated Post-Mortem

## Incident Summary
- Duration: 18 minutes
- Impact: 45,000 users (89%)
- Severity: P0
- MTTR: 10 minutes

## Timeline
[Automatic from logs]

## Root Cause
[Extracted from investigation]

## Action Items
1. Add database monitoring
2. Improve runbook
3. Setup auto-scaling

## Lessons Learned
[Aggregated from team input]
```

## Usage

```bash
/sc:incident create --severity=P0 "description"
/sc:incident update "status update"
/sc:incident close
/sc:incident postmortem
```

## Success Metrics

- 50% reduction MTTR
- 100% incident documentation
- Automated stakeholder communication
- Post-mortem completion rate: 100%
