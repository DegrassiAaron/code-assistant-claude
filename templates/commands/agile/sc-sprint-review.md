---
name: "sc-sprint-review"
description: "Comprehensive sprint review and retrospective with metrics, insights, and action items"
category: "agile"
version: "1.0.0"

triggers:
  exact: "/sc:sprint-review"
  aliases: ["/sprint-retro", "/review-sprint", "/retrospective"]
  keywords: ["sprint review", "retrospective", "sprint retro"]

requires:
  skills: ["task-management-mode"]
  mcps: ["serena"]

parameters:
  - name: "sprint_number"
    type: "string"
    required: true
    description: "Sprint number to review (e.g., Sprint-42)"
  - name: "include_retro"
    type: "boolean"
    required: false
    default: true
    description: "Include retrospective section"
  - name: "generate_report"
    type: "boolean"
    required: false
    default: true
    description: "Generate detailed report document"

autoExecute: false
tokenEstimate: 10000
executionTime: "30-60s"
---

# /sc:sprint-review - Sprint Review & Retrospective

Comprehensive sprint review meeting with stakeholder demo, retrospective session, metrics analysis, and action items for continuous improvement.

## Sprint Review Ceremony

```
Sprint Review Structure:
1. Sprint Overview & Goals
2. Completed Work Demo
3. Incomplete Work Discussion
4. Metrics & Analytics
5. Stakeholder Feedback
6. Retrospective (What went well / What to improve)
7. Action Items for Next Sprint
```

## Part 1: Sprint Overview

```markdown
🏆 Sprint {{sprint_number}} - Review & Retrospective
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Date: {{review_date}}
Duration: {{duration_weeks}} weeks
Team: {{team_members}}

Sprint Goal: {{sprint_goal}}
Goal Achievement: ✅ ACHIEVED | 🟡 PARTIALLY | ❌ NOT ACHIEVED

Executive Summary:
{{executive_summary}}
```

## Part 2: Commitment vs Delivery

```markdown
📊 Commitment vs Delivery Analysis

┌──────────────────────────────────────────────┐
│ COMMITTED vs COMPLETED                       │
├──────────────────────────────────────────────┤
│ Story Points                                 │
│ ├─ Committed: 32 points                     │
│ ├─ Completed: 30 points (94%)               │
│ ├─ Incomplete: 2 points (6%)                │
│ └─ Added mid-sprint: 0 points               │
│                                              │
│ Stories                                      │
│ ├─ Committed: 6 stories                     │
│ ├─ Completed: 5 stories (83%)               │
│ ├─ Incomplete: 1 story (17%)                │
│ └─ Spilled to next sprint: 1 story          │
└──────────────────────────────────────────────┘

Overall Performance: 🟢 EXCELLENT (>90%)
Velocity: 30 story points (vs 31 average)
Predictability: 94% (High)
```

## Part 3: Completed Work Showcase

```markdown
✅ COMPLETED WORK - Demo to Stakeholders

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### Story 1: [USER-123] Fix Authentication Flow ✅
**Business Value:** Critical production bug resolved
**Story Points:** 8
**Demo:**
- ✅ Users can now login without token expiration errors
- ✅ Session management improved (30-day persistence)
- ✅ Password reset flow streamlined
- ✅ Security audit passed with 0 vulnerabilities

**Technical Highlights:**
- Refactored JWT validation logic
- Added refresh token mechanism
- Implemented better error handling
- 95% test coverage

**Stakeholder Impact:**
- Resolved 45 support tickets
- User satisfaction score improved +12%
- Zero authentication-related incidents since deploy

**Files Changed:** 12 files, +450 / -230 lines
**PR:** #123 (Approved by 3 reviewers)
**Deployed:** Day 2, Production since Day 3

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### Story 2: [FEAT-456] Payment Gateway Integration ✅
**Business Value:** Enable online payments (revenue driver)
**Story Points:** 13
**Demo:**
- ✅ Stripe integration fully functional
- ✅ Checkout flow: Cart → Payment → Confirmation
- ✅ Webhook handling for payment events
- ✅ Error handling & retry logic
- ✅ Support for credit cards, Apple Pay, Google Pay

**Technical Highlights:**
- Backend: Express + Stripe SDK
- Frontend: React checkout component
- Security: PCI-DSS compliant implementation
- Testing: 87% coverage, 45 test cases

**Stakeholder Impact:**
- Unblocks Q4 revenue targets
- Competitive parity with major players
- Average checkout time: 45 seconds

**Files Changed:** 28 files, +1,240 / -45 lines
**PR:** #456 (Approved by 4 reviewers + security team)
**Deployed:** Day 8, Production since Day 9

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### Story 3: [FEAT-789] Dashboard Performance Optimization ✅
**Business Value:** Improved user experience
**Story Points:** 5
**Demo:**
- ✅ Page load time reduced from 3.2s to 0.8s (75% faster)
- ✅ First contentful paint: 0.3s (Excellent)
- ✅ Lazy loading for charts and widgets
- ✅ Code splitting implemented
- ✅ Lighthouse score: 95/100 (was 62)

**Technical Highlights:**
- React.lazy() for dynamic imports
- Virtualized lists for large datasets
- Image optimization (WebP format)
- Bundle size reduced by 42%

**Stakeholder Impact:**
- User engagement increased +18%
- Bounce rate decreased -23%
- Mobile experience significantly improved

**Files Changed:** 18 files, +320 / -180 lines
**PR:** #789 (Approved by 2 reviewers)
**Deployed:** Day 10, Production since Day 10

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### Story 4: [BUG-321] Fix Mobile Responsive Issues ✅
**Business Value:** Critical UX issues on mobile
**Story Points:** 3
**Demo:**
- ✅ All pages responsive across devices
- ✅ Touch interactions improved
- ✅ Menu navigation fixed
- ✅ Tested on iOS 14-17, Android 11-14

**Stakeholder Impact:**
- Mobile user satisfaction +15%
- Mobile bounce rate -12%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### Story 5: [TECH-111] Migrate to TypeScript 5.0 ✅
**Business Value:** Technical debt reduction
**Story Points:** 1 (small migration)
**Demo:**
- ✅ All dependencies updated
- ✅ No breaking changes
- ✅ Build time improved by 15%
- ✅ Better type inference

**Technical Highlights:**
- Zero runtime errors post-migration
- Improved developer experience

Total Completed: 30 story points across 5 stories
```

## Part 4: Incomplete Work

```markdown
⏳ INCOMPLETE WORK - Carried Over

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### Story 6: [FEAT-234] Multi-Language Support (Incomplete)
**Story Points:** 2 (of 8 planned)
**Status:** 25% complete

**What was completed:**
- ✅ i18n library installed and configured
- ✅ Translation infrastructure setup
- ✅ English and Spanish translation files created

**What remains:**
- ⏳ Translate all UI components
- ⏳ Date/number formatting by locale
- ⏳ Language switcher component
- ⏳ Testing across languages

**Why incomplete:**
- Root cause: Underestimated translation effort
- Complexity: More strings than expected (2,000+ vs estimated 500)
- Dependency: Needed design approval for language switcher

**Action:**
- ✅ Added to Sprint {{next_sprint}} with adjusted estimate (6 points)
- ✅ Design approval scheduled for next week
- ✅ Translation service engaged for professional translations

**Lessons Learned:**
- Always audit full string count before estimating i18n
- Engage translators earlier in process
- Consider machine translation for initial pass

Spilled Story Points: 2 (6% of commitment)
Impact on Sprint Goal: Minimal (stretch goal)
```

## Part 5: Sprint Metrics & Analytics

```markdown
📈 Sprint Metrics Dashboard

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### Velocity Metrics

Current Sprint Velocity: 30 points
Previous Sprint: 31 points
5-Sprint Average: 30.6 points
Trend: Stable ━━━━━━━━━━━

Velocity Chart (Last 6 Sprints):
35 │               ●
30 │     ●   ●   ●   ● ●
25 │   ●
20 │
   └─────────────────────
   S36 S37 S38 S39 S40 S41 S42

Velocity Stability: 🟢 EXCELLENT
Standard Deviation: 2.4 points (8% variance)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### Commitment Accuracy

Commitment: 32 points
Delivered: 30 points
Accuracy: 94% (Target: >85%)

Sprint Commitment History:
Sprint 37: 95% accuracy
Sprint 38: 109% accuracy (over-delivered)
Sprint 39: 85% accuracy
Sprint 40: 100% accuracy
Sprint 41: 94% accuracy
Sprint 42: 94% accuracy

Average Accuracy: 96% 🎯 EXCELLENT

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### Quality Metrics

Code Quality:
├─ Test Coverage: 87% (Target: >80%) ✅
├─ Code Review Approval Rate: 100% ✅
├─ Average Review Time: 3.2 hours ✅
├─ Build Success Rate: 98% ✅
└─ Linting Compliance: 100% ✅

Defect Metrics:
├─ Bugs Found: 3 (0.6 per story)
├─ Bugs Fixed: 3 (100%)
├─ Critical Bugs: 0 ✅
├─ Production Incidents: 0 ✅
└─ Defect Escape Rate: 0% 🏆

Technical Debt:
├─ New Debt Added: Minimal
├─ Debt Resolved: 5 hours (TypeScript migration)
├─ Net Change: -3 hours (Improved!)
└─ Total Debt: 12 hours (Manageable)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### Cycle Time & Lead Time

Average Cycle Time: 2.1 days (Time from start to done)
Average Lead Time: 4.3 days (Time from request to done)

Cycle Time Distribution:
User-123: 2 days
Feat-456: 6 days (complex)
Feat-789: 3 days
Bug-321: 1 day
Tech-111: 0.5 days

Target: <3 days for standard stories ✅

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### Team Capacity & Utilization

Total Capacity: 320 hours (4 devs × 8 hours × 10 days)
Actual Work: 298 hours
Utilization: 93% (Optimal: 85-95%) ✅

Time Breakdown:
├─ Feature Development: 65%
├─ Bug Fixes: 10%
├─ Code Review: 12%
├─ Meetings/Ceremonies: 8%
└─ Other: 5%

Overtime: 0 hours ✅ (Work-life balance maintained)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### Blocker Analysis

Total Blockers: 2
Average Resolution Time: 4.2 hours ✅
Max Blocker Duration: 8 hours

Blocker Types:
├─ External Dependency: 1 (Stripe API keys)
├─ Technical Issue: 1 (Build pipeline)
└─ Resource Contention: 0

Resolution Effectiveness: 🟢 EXCELLENT
No blockers lasted >1 day
```

## Part 6: Stakeholder Feedback

```markdown
💬 Stakeholder Feedback

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### Product Owner Feedback
Rating: ⭐⭐⭐⭐⭐ (5/5)

"Excellent sprint! The payment integration was delivered ahead of schedule and exceeds expectations. The authentication fix resolved a major pain point for our users. Very happy with the velocity and quality."

Key Highlights:
✅ Sprint goal fully achieved
✅ High-priority items completed
✅ Quality exceeded expectations
✅ Great communication throughout

Areas for Next Sprint:
- Consider adding automated release notes
- Explore A/B testing for checkout flow

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### Engineering Manager Feedback
Rating: ⭐⭐⭐⭐⭐ (5/5)

"Team delivered high-quality work with excellent test coverage. The TypeScript migration was a nice bonus. Code reviews were thorough and timely."

Key Highlights:
✅ Zero production incidents
✅ Strong technical execution
✅ Good balance of features vs technical debt
✅ Team collaboration excellent

Areas for Improvement:
- Could improve estimation for i18n stories
- Consider performance budgets for future work

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### Customer Success Feedback
Rating: ⭐⭐⭐⭐☆ (4/5)

"Authentication fix immediately reduced support tickets. Dashboard performance improvements are very noticeable. Customers are happy!"

Customer Impact:
✅ Support tickets down 35%
✅ User satisfaction up 12%
✅ Feature requests for payment options
✅ Positive feedback on performance

Requests:
- Add more payment methods (PayPal, Venmo)
- Consider dark mode for dashboard
```

## Part 7: Retrospective

```markdown
🔄 Sprint Retrospective

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### 😊 What Went Well (Keep Doing)

1. **Excellent Team Collaboration** ⭐
   - Daily standups were focused and efficient
   - Pair programming on complex payment integration
   - Knowledge sharing sessions
   - Quick code reviews (avg 3.2 hours)

   Action: Continue current collaboration practices

2. **Early Testing of External Dependencies**
   - Stripe API integration tested early
   - Caught issues before they became blockers
   - Test environment setup was smooth

   Action: Apply same approach to future integrations

3. **Proactive Technical Debt Management**
   - TypeScript migration completed
   - Reduced overall debt by 3 hours
   - Maintained code quality while delivering features

   Action: Continue allocating 10% capacity to tech debt

4. **Clear Sprint Goal**
   - Everyone understood priorities
   - Team alignment on what matters
   - Made trade-off decisions easily

   Action: Maintain clear goal-setting in planning

5. **Zero Production Incidents**
   - Quality gates working well
   - Testing strategy effective
   - Deployment process smooth

   Action: Document and share best practices

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### 😕 What Didn't Go Well (Problems)

1. **Underestimated i18n Complexity**
   - Story FEAT-234 spilled to next sprint
   - Didn't account for full string audit
   - Missing design artifacts

   Root Cause: Inadequate research during estimation

2. **Mid-Sprint API Key Delay**
   - Waited 6 hours for production Stripe keys
   - Could have been requested earlier
   - Minor impact but avoidable

   Root Cause: Assumption that test keys sufficient

3. **Code Review Bottleneck on Day 8**
   - Multiple PRs ready simultaneously
   - 1 reviewer on PTO
   - 8-hour delay for approval

   Root Cause: Concentration of work at sprint end

4. **Documentation Created After Deployment**
   - Payment integration docs written post-deploy
   - Caused questions from other team members
   - Not following definition of done

   Root Cause: Time pressure at sprint end

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### 💡 Ideas for Improvement (Experiments)

1. **Pre-Sprint Research Spike** 🆕
   - Allocate 2-4 hours before sprint for complex stories
   - Research dependencies, APIs, string counts
   - More accurate estimation

   Owner: @tech-lead
   Try in: Sprint {{next_sprint}}
   Success Metric: Estimation accuracy >95%

2. **Early Access Checklist** 🆕
   - Document all external dependencies in planning
   - Request credentials/keys Day 1
   - Create template checklist

   Owner: @developer1
   Try in: Sprint {{next_sprint}}
   Success Metric: Zero delays from missing access

3. **Staggered PR Schedule** 🆕
   - Aim to submit PRs throughout sprint
   - Avoid concentration on final days
   - Set internal deadline: Day 8 for Day 10 sprint

   Owner: @scrum-master
   Try in: Sprint {{next_sprint}}
   Success Metric: Max 2 PRs per day

4. **Documentation-First Approach** 🆕
   - Write docs before implementation
   - Update as you build
   - Include in PR checklist

   Owner: @developer2
   Try in: Sprint {{next_sprint}}
   Success Metric: 100% docs complete with PR

5. **Dedicated i18n Estimation Workshop** 🆕
   - Run string audit before estimation
   - Review with design team
   - Use checklist for translation stories

   Owner: @product-owner
   Try in: When next i18n story planned
   Success Metric: No i18n story spills

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### 🎬 Action Items for Next Sprint

Priority: HIGH 🔴
- [ ] Create pre-sprint research spike template
      Owner: @tech-lead | Due: Before Sprint {{next_sprint}} planning

- [ ] Create external dependency checklist
      Owner: @developer1 | Due: Day 1 of Sprint {{next_sprint}}

- [ ] Establish PR submission guidelines
      Owner: @scrum-master | Due: Before Sprint {{next_sprint}} planning

Priority: MEDIUM 🟡
- [ ] Update definition of done to emphasize docs
      Owner: @product-owner | Due: Week 1 of Sprint {{next_sprint}}

- [ ] Schedule i18n estimation workshop
      Owner: @product-owner | Due: When FEAT-234 resumed

- [ ] Document payment integration best practices
      Owner: @developer2 | Due: Week 1 of Sprint {{next_sprint}}

Priority: LOW 🟢
- [ ] Create knowledge sharing session for Stripe integration
      Owner: @developer3 | Due: Week 2 of Sprint {{next_sprint}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### 📊 Retrospective Metrics

Team Happiness: 😊😊😊😊😃 (4.2/5)
Sprint Difficulty: 😐😐😐 (3/5 - Moderate)
Team Confidence: 🟢 HIGH (93%)
Would Repeat Process: ✅ YES (100% of team)

Sentiment Analysis:
├─ Positive mentions: 18
├─ Negative mentions: 4
├─ Neutral mentions: 6
└─ Overall: 🟢 POSITIVE (77%)
```

## Part 8: Team Recognition

```markdown
🏆 Sprint Awards & Recognition

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🥇 MVP: @developer1
- Led payment integration from design to deployment
- Mentored junior dev on webhook handling
- Delivered 13 story points (43% of team total)

🌟 Code Quality Champion: @developer3
- Security audit caught 5 potential issues
- Maintained >90% test coverage on all PRs
- Thorough and fast code reviews

🚀 Problem Solver: @developer2
- Debugged authentication issue quickly
- Found creative performance optimization solutions
- Dashboard speed improvements exceeded expectations

💡 Innovation Award: @developer4 (QA)
- Created automated test suite for payment flows
- Reduced manual testing time by 60%
- Identified edge cases before production

🤝 Team Player: Entire Team
- Zero conflicts or blockers escalated
- Strong collaboration and support
- Positive and professional throughout

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Thank you for an excellent sprint! 🎉
```

## Part 9: Looking Ahead

```markdown
🔮 Next Sprint Preview

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Sprint {{next_sprint}} Focus:
🎯 Complete multi-language support
🎯 Add additional payment methods
🎯 Implement dark mode (stretch)

Estimated Capacity: 30 points (based on velocity trend)

Carry-Over from Sprint {{sprint_number}}:
- [FEAT-234] Multi-language support (6 points adjusted)

High Priority for Sprint {{next_sprint}}:
- [FEAT-890] PayPal integration (8 points)
- [FEAT-891] Dark mode toggle (5 points)
- [BUG-567] Mobile cart issues (3 points)
- [TECH-222] Database query optimization (5 points)

Planning Session: {{planning_date}}
```

## Report Generation

```markdown
📄 Sprint Review Report Generated

Report saved to: /docs/sprints/sprint-{{sprint_number}}-review.md

Sections included:
✅ Executive summary
✅ Commitment vs delivery
✅ Completed work showcase
✅ Incomplete work analysis
✅ Sprint metrics dashboard
✅ Stakeholder feedback
✅ Retrospective findings
✅ Action items
✅ Team recognition

Report shared with:
- Product Owner
- Engineering Manager
- Team Members
- Stakeholders

Next Steps:
1. Review action items in Sprint {{next_sprint}} planning
2. Apply lessons learned
3. Celebrate successes! 🎉
```

## Configuration

`.claude/settings.json`:
```json
{
  "commands": {
    "sc-sprint-review": {
      "autoGenerateReport": true,
      "includeMetrics": true,
      "includeRetrospective": true,
      "reportFormat": "markdown",
      "shareWithStakeholders": true,
      "archiveLocation": "docs/sprints/"
    }
  }
}
```

## Usage Examples

### Full Review + Retro
```bash
/sc:sprint-review "Sprint-42" --include_retro=true --generate_report=true

# Complete review with retrospective and report
```

### Review Only (No Retro)
```bash
/sc:sprint-review "Sprint-42" --include_retro=false

# Stakeholder demo only, skip retrospective
```

### Quick Summary
```bash
/sc:sprint-review "Sprint-42" --generate_report=false

# Verbal summary without document
```

## Integration with Other Commands

```bash
# Complete sprint cycle
/sc:plan-sprint "Sprint-42"        # Start
/sc:sprint-status                  # Daily
/sc:sprint-review "Sprint-42"      # End
/sc:plan-sprint "Sprint-43"        # Next sprint
```

## Success Metrics

- Review completion time: <60 minutes
- Action item completion rate: >85%
- Team satisfaction with review: >4.5/5
- Continuous improvement: Measurable
- Velocity predictability: Improving trend
