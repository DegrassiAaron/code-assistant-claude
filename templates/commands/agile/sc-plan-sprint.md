---
name: "sc-plan-sprint"
description: "Sprint planning session with backlog prioritization and capacity planning"
category: "agile"
version: "1.0.0"

triggers:
  exact: "/sc:plan-sprint"
  aliases: ["/sprint-planning", "/plan-sprint"]
  keywords: ["sprint planning", "plan sprint", "agile planning"]

requires:
  skills: ["task-management-mode"]
  mcps: ["serena"]

parameters:
  - name: "sprint_number"
    type: "string"
    required: true
    description: "Sprint number (e.g., Sprint-42)"
  - name: "duration_weeks"
    type: "number"
    required: false
    default: 2
    description: "Sprint duration in weeks (default: 2)"
  - name: "team_capacity"
    type: "number"
    required: false
    description: "Team capacity in story points or hours"

autoExecute: false
tokenEstimate: 8000
executionTime: "20-40s"
---

# /sc:plan-sprint - Sprint Planning

Comprehensive sprint planning session following Scrum methodology with backlog prioritization, story breakdown, and capacity planning.

## Sprint Planning Flow

```
Sprint Planning Phases:
1. Product Backlog Review
2. Sprint Goal Definition
3. Story Selection & Estimation
4. Task Breakdown
5. Capacity Validation
6. Sprint Backlog Creation
7. Commitment & Kickoff
```

## Execution Steps

### Phase 1: Sprint Context Setup

```markdown
🏃 Sprint Planning Session
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sprint: {{sprint_number}}
Duration: {{duration_weeks}} weeks
Start Date: {{start_date}}
End Date: {{end_date}}
Team Capacity: {{team_capacity}} points/hours

Planning Goals:
- Review product backlog priorities
- Define sprint goal
- Select stories for sprint
- Break down into tasks
- Estimate effort
- Commit to deliverables
```

### Phase 2: Product Backlog Review

Analyze existing backlog:

```bash
# Use Serena MCP to retrieve product backlog
# Look for:
# - High priority user stories
# - Bug fixes
# - Technical debt items
# - Dependencies on previous sprints
```

Generate backlog summary:

```markdown
📋 Product Backlog (Top Priority Items)

🔴 CRITICAL Priority
1. [USER-123] User authentication flow broken (Bug) - 8 points
   Dependencies: None
   Risk: High - Production issue

2. [FEAT-456] Payment gateway integration - 13 points
   Dependencies: Backend API refactor
   Risk: Medium - External API dependency

🟡 HIGH Priority
3. [FEAT-789] Dashboard performance optimization - 5 points
   Dependencies: None
   Risk: Low

4. [FEAT-234] Multi-language support - 8 points
   Dependencies: i18n library setup
   Risk: Medium

🟢 MEDIUM Priority
5. [TECH-567] Migrate to TypeScript 5.0 - 8 points
   Dependencies: None
   Risk: Low - Technical debt

Total Top 10 Items: 87 story points
```

### Phase 3: Sprint Goal Definition

Collaboratively define sprint goal:

```markdown
🎯 Sprint Goal - Sprint {{sprint_number}}

Primary Objective:
[One sentence describing the sprint goal]

Success Criteria:
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

Business Value:
[Why this sprint matters to stakeholders]

Technical Value:
[How this sprint improves the codebase/architecture]
```

**Examples of Good Sprint Goals:**
- "Enable users to complete checkout without authentication friction"
- "Reduce page load time by 40% for dashboard views"
- "Establish foundation for internationalization"

### Phase 4: Story Selection

Select stories aligned with sprint goal:

```markdown
✅ Selected Stories for Sprint {{sprint_number}}

Story 1: [USER-123] Fix authentication flow
├─ Priority: Critical
├─ Story Points: 8
├─ Business Value: Critical production issue
├─ Dependencies: None
└─ Assigned To: [Team member or TBD]

Story 2: [FEAT-456] Payment gateway integration
├─ Priority: High
├─ Story Points: 13
├─ Business Value: Revenue-critical feature
├─ Dependencies: Backend API ready
└─ Assigned To: [Team member or TBD]

Story 3: [FEAT-789] Dashboard performance
├─ Priority: High
├─ Story Points: 5
├─ Business Value: User experience improvement
├─ Dependencies: None
└─ Assigned To: [Team member or TBD]

Total Selected: 26 story points
Team Capacity: {{team_capacity}} points
Buffer: {{team_capacity - 26}} points (for unknowns)
```

### Phase 5: Story Breakdown & Estimation

Break each story into technical tasks:

```markdown
📝 Story Breakdown

[USER-123] Fix Authentication Flow (8 points)
├─ Task 1.1: Investigate root cause (2h)
│  Technical Details: Check JWT token validation, session management
│
├─ Task 1.2: Fix backend validation logic (4h)
│  Files: src/api/auth/validator.ts, src/middleware/auth.ts
│
├─ Task 1.3: Update frontend error handling (3h)
│  Files: src/components/Login.tsx, src/hooks/useAuth.ts
│
├─ Task 1.4: Add integration tests (3h)
│  Files: tests/integration/auth.test.ts
│
└─ Task 1.5: Deploy to staging & verify (1h)
   QA Requirements: Test all auth flows

Total Estimated: 13 hours (8 story points)

[FEAT-456] Payment Gateway Integration (13 points)
├─ Task 2.1: Research Stripe API documentation (2h)
├─ Task 2.2: Setup backend Stripe client (4h)
│  Files: src/services/payment/stripe.ts
│
├─ Task 2.3: Create payment endpoints (6h)
│  Files: src/api/routes/payment.ts
│
├─ Task 2.4: Build frontend checkout component (8h)
│  Files: src/components/Checkout/Checkout.tsx
│
├─ Task 2.5: Implement webhook handler (4h)
│  Files: src/api/webhooks/stripe.ts
│
├─ Task 2.6: Add error handling & retry logic (4h)
├─ Task 2.7: Write unit & integration tests (6h)
└─ Task 2.8: Security audit (3h)

Total Estimated: 37 hours (13 story points)
```

### Phase 6: Capacity Validation

Validate team capacity vs commitment:

```markdown
⚖️ Capacity Planning

Team Velocity (3-sprint average): 32 story points
Current Sprint Capacity: {{team_capacity}} points

Selected Stories: 26 story points
Buffer (20%): 6 points
Total: 32 points

Status: ✅ HEALTHY
- Within team velocity
- Adequate buffer for unknowns
- Stories align with sprint goal

Risk Factors:
- [ ] External dependencies (APIs, third-party services)
- [ ] Team availability (holidays, PTO)
- [ ] Technical unknowns
- [ ] Cross-team dependencies

Mitigation Strategies:
1. Early integration of payment API (first 3 days)
2. Daily standups to identify blockers
3. Pair programming for complex tasks
4. Buffer story ready if capacity allows
```

### Phase 7: Sprint Backlog Creation

Create comprehensive sprint backlog:

```markdown
📊 Sprint {{sprint_number}} Backlog
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Sprint Goal: {{sprint_goal}}
Duration: {{duration_weeks}} weeks
Team: {{team_members}}
Capacity: {{team_capacity}} points

┌─────────────────────────────────────────────────┐
│ Week 1 (Days 1-5)                               │
├─────────────────────────────────────────────────┤
│ Day 1-2: USER-123 (Authentication Fix)         │
│ Day 3-5: FEAT-456 Start (Payment Backend)      │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ Week 2 (Days 6-10)                              │
├─────────────────────────────────────────────────┤
│ Day 6-8: FEAT-456 Continue (Payment Frontend)  │
│ Day 9-10: FEAT-789 (Dashboard Performance)     │
└─────────────────────────────────────────────────┘

Daily Ceremonies:
- Daily Standup: 9:00 AM (15 min)
- Ad-hoc pair programming sessions
- Code reviews: Ongoing

Sprint Ceremonies:
- Sprint Review: Day 10, 2:00 PM
- Sprint Retrospective: Day 10, 3:00 PM
```

### Phase 8: Task Management Integration

Create tasks in TodoWrite:

```typescript
// Automatically generate TodoWrite tasks
const sprintTasks = [
  {
    id: 'USER-123',
    title: 'Fix authentication flow',
    status: 'pending',
    priority: 'high',
    estimatedTokens: 12000,
    subtasks: [
      'Investigate root cause',
      'Fix backend validation',
      'Update frontend error handling',
      'Add integration tests',
      'Deploy and verify'
    ]
  },
  // ... more stories
];

// Store in Serena MCP for persistence
```

### Phase 9: Sprint Commitment

Team commitment and kickoff:

```markdown
🤝 Sprint Commitment

Team commits to delivering:
✅ [USER-123] Fix authentication flow (8 points)
✅ [FEAT-456] Payment gateway integration (13 points)
✅ [FEAT-789] Dashboard performance (5 points)

Total Commitment: 26 story points

Stretch Goals (if capacity allows):
⏳ [FEAT-234] Multi-language support (8 points)

Definition of Done:
- [ ] All acceptance criteria met
- [ ] Code reviewed and approved
- [ ] Unit tests coverage >80%
- [ ] Integration tests passing
- [ ] Documentation updated
- [ ] Deployed to staging
- [ ] QA approval
- [ ] No critical bugs

Sprint Agreements:
1. No scope changes without team consent
2. Daily standups mandatory
3. Blockers escalated within 24 hours
4. Code review turnaround <4 hours
5. Pair programming encouraged

Let's build great software! 🚀
```

## Integration with Tools

### Serena MCP Integration

Store sprint data for tracking:

```javascript
// Store sprint plan in Serena memory
await serena.store({
  type: 'sprint_plan',
  sprint: '{{sprint_number}}',
  goal: '{{sprint_goal}}',
  stories: selectedStories,
  capacity: teamCapacity,
  startDate: '{{start_date}}',
  endDate: '{{end_date}}'
});
```

### Task Management Mode

Automatically populate TodoWrite with sprint backlog:

```bash
# Activate task-management-mode skill
# Create hierarchical task structure:
# Sprint → Stories → Tasks → Subtasks
```

## Velocity Tracking

Calculate and display team velocity:

```markdown
📈 Team Velocity Analysis

Last 5 Sprints:
Sprint 37: 28 points (committed: 30, completed: 28)
Sprint 38: 35 points (committed: 32, completed: 35)
Sprint 39: 29 points (committed: 34, completed: 29)
Sprint 40: 32 points (committed: 32, completed: 32)
Sprint 41: 31 points (committed: 33, completed: 31)

Average Velocity: 31 story points
Commitment Accuracy: 94%
Trend: Stable

Recommendation: Commit to 28-32 story points
Buffer: 20% (6 points)
```

## Risk Assessment

Identify and document risks:

```markdown
⚠️ Sprint Risks

🔴 HIGH Risk
- Payment API integration unknown complexity
  Mitigation: Early spike, daily check-ins

🟡 MEDIUM Risk
- Team member PTO days 8-9
  Mitigation: Knowledge sharing, pair programming

🟢 LOW Risk
- Minor dependency on external API
  Mitigation: Mock implementation ready
```

## Configuration

`.claude/settings.json`:
```json
{
  "commands": {
    "sc-plan-sprint": {
      "defaultDuration": 2,
      "defaultBuffer": 0.2,
      "storyPointScale": "fibonacci",
      "autoCreateTasks": true,
      "integrateWithSerena": true,
      "velocityWindowSprints": 5
    }
  }
}
```

## Usage Examples

### Basic Sprint Planning
```bash
/sc:plan-sprint "Sprint-42" --duration_weeks=2 --team_capacity=32

# Generates:
# - Sprint backlog
# - Task breakdown
# - Capacity analysis
# - Risk assessment
```

### Sprint Planning with Custom Capacity
```bash
/sc:plan-sprint "Sprint-43" --duration_weeks=1 --team_capacity=16

# For shorter sprint cycles
```

### Sprint Planning with Previous Sprint Context
```bash
/sc:plan-sprint "Sprint-44"

# Automatically retrieves:
# - Previous sprint velocity
# - Unfinished stories
# - Team patterns
```

## Success Metrics

- Sprint goal clarity: 100%
- Team understanding of commitment: 100%
- Capacity accuracy: ±10%
- Risk identification: Comprehensive
- Backlog grooming quality: >90%
