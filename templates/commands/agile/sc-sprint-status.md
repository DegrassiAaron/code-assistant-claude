---
name: "sc-sprint-status"
description: "Daily standup report with progress tracking, blocker identification, and burndown analysis"
category: "agile"
version: "1.0.0"

triggers:
  exact: "/sc:sprint-status"
  aliases: ["/standup", "/daily-status", "/sprint-progress"]
  keywords: ["sprint status", "standup", "daily", "progress"]

requires:
  skills: ["task-management-mode"]
  mcps: ["serena"]

parameters:
  - name: "format"
    type: "string"
    required: false
    default: "full"
    description: "Report format: full, summary, blockers-only"
  - name: "team_member"
    type: "string"
    required: false
    description: "Filter by team member (optional)"

autoExecute: false
tokenEstimate: 5000
executionTime: "10-20s"
---

# /sc:sprint-status - Daily Sprint Status Report

Comprehensive daily standup report with progress tracking, blocker identification, burndown analysis, and actionable insights.

## Daily Standup Framework

```
Three Key Questions:
1. What did I complete yesterday?
2. What will I work on today?
3. Are there any blockers or impediments?

Plus:
- Sprint progress overview
- Burndown chart status
- Risk indicators
- Action items
```

## Report Structure

### 1. Sprint Overview Header

```markdown
🏃 Sprint Status Report - Day {{current_day}}/{{total_days}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sprint: {{sprint_number}}
Date: {{current_date}}
Days Remaining: {{days_remaining}}
Team: {{team_size}} members

Sprint Goal: {{sprint_goal}}
Overall Health: 🟢 ON TRACK | 🟡 AT RISK | 🔴 BLOCKED
```

### 2. Progress Metrics

```markdown
📊 Progress Overview

Story Points:
├─ Committed: 32 points
├─ Completed: 18 points (56%)
├─ In Progress: 8 points (25%)
├─ Remaining: 6 points (19%)
└─ Projected: 30 points (94% of commitment)

Stories:
├─ Total: 6 stories
├─ Done: 3 stories ✅
├─ In Progress: 2 stories ⚙️
├─ Not Started: 1 story ⏳
└─ Blocked: 0 stories 🚫

Tasks:
├─ Total: 34 tasks
├─ Completed: 21 tasks (62%)
├─ In Progress: 8 tasks (24%)
├─ Remaining: 5 tasks (14%)
└─ Blocked: 0 tasks (0%)
```

### 3. Burndown Chart (ASCII)

```markdown
📉 Burndown Chart

Story Points
35 │ ╲
30 │   ╲ ← Ideal
25 │     ╲
20 │ ●●●  ╲ ← Actual
15 │       ●╲
10 │         ●╲
 5 │          ●╲
 0 │___________●╲____
   D1 D2 D3 D4 D5 D6 D7 D8 D9 D10

Status: 🟢 AHEAD OF SCHEDULE
- Actual: 14 points remaining
- Ideal: 16 points remaining
- Variance: +2 points (Better than plan)
```

### 4. Yesterday's Accomplishments

```markdown
✅ Completed Yesterday (Day {{yesterday_day}})

[USER-123] Fix Authentication Flow - COMPLETED ✅
├─ All tasks finished
├─ Deployed to staging
├─ QA approved
└─ Story points: 8 (100%)

[FEAT-456] Payment Gateway Integration - IN PROGRESS ⚙️
├─ Completed Tasks:
│  ✅ Setup Stripe client
│  ✅ Create payment endpoints
│  ✅ Build checkout component
├─ Remaining Tasks:
│  ⏳ Implement webhook handler
│  ⏳ Add error handling
│  ⏳ Security audit
└─ Story points: 13 (60% complete)

Team Velocity Yesterday: 8 story points
Cumulative Velocity: 18 story points
```

### 5. Today's Plan

```markdown
🎯 Today's Focus (Day {{current_day}})

Priority 1: Complete FEAT-456 Payment Integration
├─ Task: Implement Stripe webhook handler
│  Assigned: @developer1
│  Estimated: 4 hours
│  Risk: Medium (external API dependency)
│
├─ Task: Add error handling & retry logic
│  Assigned: @developer2
│  Estimated: 4 hours
│  Risk: Low
│
└─ Task: Security audit
   Assigned: @developer3
   Estimated: 3 hours
   Risk: Low

Priority 2: Start FEAT-789 Dashboard Performance
├─ Task: Profile current performance
│  Assigned: @developer2
│  Estimated: 2 hours
│  Risk: Low
│
└─ Task: Implement lazy loading
   Assigned: @developer1
   Estimated: 3 hours
   Risk: Low

Expected Completion Today: 8-10 story points
Projected Status by EOD: 24-26 points complete (75-81%)
```

### 6. Blockers & Impediments

```markdown
🚫 Blockers & Impediments

ACTIVE BLOCKERS (Immediate Attention Required):
[None - All clear! 🎉]

POTENTIAL RISKS:
🟡 MEDIUM Risk
- Stripe API webhook testing requires production keys
  Impact: May delay FEAT-456 completion
  Mitigation: Using test mode webhooks, fallback plan ready
  Owner: @tech-lead
  ETA Resolution: Today EOD

🟢 LOW Risk
- Dashboard performance baseline unclear
  Impact: May affect estimation accuracy
  Mitigation: Quick profiling session planned
  Owner: @developer2
  ETA Resolution: This morning

RESOLVED YESTERDAY:
✅ JWT token validation issue → Fixed in USER-123
✅ Build pipeline timeout → Infrastructure team resolved
```

### 7. Team Member Updates

```markdown
👥 Team Updates

@developer1 (Frontend Lead)
├─ Yesterday: Completed authentication UI fixes, deployed to staging
├─ Today: Implement webhook handler, start lazy loading
├─ Blockers: None
└─ Capacity: 8 hours

@developer2 (Backend Lead)
├─ Yesterday: Built payment endpoints, integrated Stripe client
├─ Today: Error handling for payments, profile dashboard performance
├─ Blockers: None
└─ Capacity: 8 hours

@developer3 (Full Stack)
├─ Yesterday: Code reviews, testing support
├─ Today: Security audit for payment integration
├─ Blockers: None
└─ Capacity: 6 hours (Meeting 2-4 PM)

@developer4 (QA)
├─ Yesterday: Tested USER-123, regression testing
├─ Today: Test FEAT-456 on staging, prepare test cases for FEAT-789
├─ Blockers: None
└─ Capacity: 8 hours
```

### 8. Sprint Health Indicators

```markdown
🏥 Sprint Health Check

Velocity Trend: 🟢 HEALTHY
├─ Target: 32 points in 10 days (3.2 points/day)
├─ Actual: 18 points in 6 days (3.0 points/day)
├─ Forecast: 30 points by sprint end
└─ Status: On track for 94% completion

Scope Stability: 🟢 STABLE
├─ Original commitment: 32 points (6 stories)
├─ Added: 0 points
├─ Removed: 0 points
└─ Current scope: 32 points (unchanged)

Team Capacity: 🟢 OPTIMAL
├─ Planned capacity: 32 points
├─ Actual availability: 30 hours today
├─ Utilization: 94%
└─ No team member overload

Quality Metrics: 🟢 EXCELLENT
├─ Code review approval rate: 100%
├─ Test coverage: 87% (target: 80%)
├─ Bug discovery rate: 0.5 bugs/story (low)
└─ Technical debt: Minimal

Risk Level: 🟢 LOW
├─ No critical blockers
├─ Dependencies managed
├─ External APIs tested
└─ Team morale: High
```

### 9. Burnup Chart (Scope vs Completion)

```markdown
📈 Scope vs Completion

Story Points
35 │         ┌──── Total Scope
30 │        ╱│
25 │       ╱ │
20 │      ╱  ●●●●── Completed
15 │     ╱ ●●●
10 │    ●●●
 5 │  ●●
 0 │●●________________
   D1 D2 D3 D4 D5 D6 D7 D8 D9 D10

Scope Changes: None (Stable)
Completion Rate: Linear and healthy
Projected Completion: Day 10 (on time)
```

### 10. Key Metrics Dashboard

```markdown
📊 Key Sprint Metrics

Commitment: 32 points │ ███████████████░░░░░ │ 56% complete
Days: 6/10 days       │ ████████████░░░░░░░░ │ 60% elapsed
Velocity: 3.0 pts/day │ ████████████████░░░░ │ 94% of target

Cycle Time (avg):     2.3 days per story
Lead Time (avg):      4.1 days per story
Work In Progress:     2 stories (optimal)
Defect Rate:          0.5 bugs per story (excellent)
Code Review Time:     3.2 hours (fast)

Team Happiness:       😊😊😊😊😃 (4.2/5)
Sprint Confidence:    🟢 HIGH (Team believes goal achievable)
```

### 11. Action Items & Follow-ups

```markdown
🎬 Action Items

From Yesterday:
✅ @tech-lead: Obtain Stripe webhook test keys → DONE
✅ @developer2: Fix build pipeline timeout → DONE
⏳ @developer1: Document payment flow → IN PROGRESS (Due: Today)

New Today:
🆕 @tech-lead: Schedule security review for payment integration (Priority: High)
🆕 @developer3: Prepare performance baseline report (Priority: Medium)
🆕 @scrum-master: Book sprint review room (Priority: Low)

Upcoming (Next 2 Days):
📅 Day 7: Complete FEAT-456, start FEAT-789
📅 Day 8: Complete FEAT-789, buffer for polish
📅 Day 9: Testing, bug fixes, documentation
📅 Day 10: Sprint review & retrospective
```

### 12. Recommendations

```markdown
💡 Recommendations

Based on current progress:

✅ GOOD:
- Team velocity is excellent (on track)
- No blockers impeding progress
- Quality metrics are strong
- Team collaboration effective

⚠️ WATCH:
- FEAT-456 completion critical for staying on schedule
  → Recommend: Focus testing resources on payment integration
  → Risk: Medium if delayed to Day 7

- Buffer time only 2 days
  → Recommend: Identify optional tasks that can be descoped
  → Risk: Low with current velocity

🎯 ACTION:
- Continue current pace
- Daily check-in on FEAT-456 webhook integration
- Prepare contingency if payment testing reveals issues
- Consider pulling in stretch goal if ahead by Day 8
```

## Report Formats

### Summary Format

```bash
/sc:sprint-status --format=summary

# Output:
Sprint 42 - Day 6/10
Progress: 18/32 points (56%) 🟢
Blockers: 0 🎉
Velocity: On track for 94% completion
Status: HEALTHY
```

### Blockers-Only Format

```bash
/sc:sprint-status --format=blockers-only

# Output:
🚫 Active Blockers: 0
🟡 Risks: 1 (Stripe webhook testing)
🎯 Action Required: Schedule security review
```

### Individual Developer Report

```bash
/sc:sprint-status --team_member=@developer1

# Output:
@developer1 Sprint Status
Yesterday: ✅ Completed auth UI, deployed to staging (8 points)
Today: 🎯 Webhook handler, lazy loading (6 points planned)
Blockers: None
Overall: 🟢 On track
```

## Integration with Serena MCP

Retrieve historical sprint data:

```javascript
// Fetch current sprint status
const sprintData = await serena.query({
  type: 'sprint_status',
  sprint: currentSprint
});

// Calculate burndown
const burndown = calculateBurndown(sprintData);

// Identify trends
const velocityTrend = analyzeVelocity(last5Sprints);
```

## Automation Features

### Auto-Detection of Status

```markdown
Automatically detects:
✅ Completed stories (via git commits + closed PRs)
⚙️ In-progress work (open branches, WIP PRs)
🚫 Blockers (via task comments, Serena memory)
📊 Velocity (story point completion rate)
```

### Smart Alerts

```markdown
🚨 Smart Alerts

CRITICAL: Sprint at risk (velocity <80% of target)
WARNING: Blocker >24 hours old (escalate)
INFO: Story completed (celebrate!)
TIP: Ahead of schedule (consider stretch goal)
```

## Configuration

`.claude/settings.json`:
```json
{
  "commands": {
    "sc-sprint-status": {
      "defaultFormat": "full",
      "showBurndown": true,
      "showTeamUpdates": true,
      "alertThresholds": {
        "velocityWarning": 0.8,
        "blockerEscalation": 24
      },
      "metricsWindow": 5,
      "autoDetectCompletion": true
    }
  }
}
```

## Usage Examples

### Daily Standup
```bash
/sc:sprint-status

# Full status report for daily standup meeting
```

### Quick Check
```bash
/sc:sprint-status --format=summary

# Quick status check without entering meeting
```

### Individual Update
```bash
/sc:sprint-status --team_member=@developer1

# Personal status for async standup
```

### Focus on Blockers
```bash
/sc:sprint-status --format=blockers-only

# Quickly identify what needs attention
```

## Integration with Other Commands

```bash
# Complete workflow
/sc:plan-sprint "Sprint-42"        # Start of sprint
/sc:sprint-status                  # Daily during sprint
/sc:sprint-review                  # End of sprint
```

## Success Metrics

- Report generation time: <10s
- Data accuracy: >95%
- Blocker identification rate: 100%
- Team satisfaction with reports: >4.5/5
- Daily standup duration: Reduced by 40%
