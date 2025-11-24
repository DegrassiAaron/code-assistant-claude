# 🏃 Agile & GitFlow Framework Setup

Documentazione completa per l'utilizzo dei comandi Agile e delle skill di manutenzione integrate nel framework.

## 📚 Indice

- [Comandi Agile](#comandi-agile)
  - [Sprint Planning](#sprint-planning)
  - [Daily Standup](#daily-standup)
  - [Sprint Review & Retrospective](#sprint-review--retrospective)
- [Skill di Manutenzione](#skill-di-manutenzione)
  - [Dependency Updater](#dependency-updater)
  - [Security Scanner](#security-scanner)
  - [Performance Monitor](#performance-monitor)
  - [Rollback Procedures](#rollback-procedures)
- [Workflow Completo](#workflow-completo)
- [Configurazione](#configurazione)
- [Best Practices](#best-practices)

---

## 🎯 Comandi Agile

### Sprint Planning

**Comando:** `/sc:plan-sprint`

Sessione completa di sprint planning con analisi del backlog, definizione del goal, stima, e capacity planning.

#### Utilizzo

```bash
# Sprint planning base
/sc:plan-sprint "Sprint-42" --duration_weeks=2 --team_capacity=32

# Sprint planning con capacity custom
/sc:plan-sprint "Sprint-43" --duration_weeks=1 --team_capacity=16
```

#### Cosa fa

1. **Revisione Product Backlog**
   - Analizza item ad alta priorità
   - Identifica dipendenze
   - Valuta rischi

2. **Definizione Sprint Goal**
   - Obiettivo chiaro e misurabile
   - Allineato con business value
   - Criteri di successo definiti

3. **Selezione Stories**
   - Storie allineate con goal
   - Stima in story points
   - Validazione capacity team

4. **Task Breakdown**
   - Breakdown stories in task
   - Stima ore per task
   - Identificazione file coinvolti

5. **Capacity Validation**
   - Confronto con velocity storica
   - Identificazione rischi
   - Buffer per imprevisti

#### Output

```markdown
📋 Sprint 42 Backlog
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sprint Goal: Enable seamless payment processing
Duration: 2 weeks (10 days)
Team Capacity: 32 story points

Selected Stories:
✅ [USER-123] Fix authentication flow (8 points)
✅ [FEAT-456] Payment gateway integration (13 points)
✅ [FEAT-789] Dashboard performance (5 points)
✅ [BUG-321] Mobile responsive issues (3 points)

Total: 29 story points (91% capacity)
Buffer: 3 points for unknowns

Next: Daily standups with /sc:sprint-status
```

---

### Daily Standup

**Comando:** `/sc:sprint-status`

Report giornaliero con progresso, metriche, burndown, e blockers.

#### Utilizzo

```bash
# Report completo
/sc:sprint-status

# Report sommario
/sc:sprint-status --format=summary

# Solo blockers
/sc:sprint-status --format=blockers-only

# Report per sviluppatore
/sc:sprint-status --team_member=@developer1
```

#### Cosa fa

1. **Sprint Overview**
   - Giorni rimanenti
   - Sprint goal
   - Stato generale

2. **Progress Metrics**
   - Story points: committed vs completed
   - Stories: totali vs completate
   - Tasks: in progress vs remaining

3. **Burndown Chart**
   - Grafico ASCII con trend
   - Confronto ideal vs actual
   - Proiezione completamento

4. **Yesterday's Work**
   - Stories completate
   - Tasks finiti
   - Velocity giornaliera

5. **Today's Plan**
   - Task prioritari
   - Assegnazioni
   - Stime completamento

6. **Blockers & Risks**
   - Blockers attivi
   - Potenziali rischi
   - Mitigazioni

#### Output

```markdown
🏃 Sprint Status - Day 6/10
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Overall Health: 🟢 ON TRACK

Progress: 18/32 points (56%)
Burndown: 🟢 AHEAD OF SCHEDULE

✅ Completed Yesterday:
├─ [USER-123] Authentication fix ✅
└─ 8 story points

🎯 Today's Focus:
├─ [FEAT-456] Payment integration (in progress)
└─ Expected: 6-8 points by EOD

🚫 Blockers: None 🎉

Next: /sc:sprint-review at sprint end
```

---

### Sprint Review & Retrospective

**Comando:** `/sc:sprint-review`

Review completa con demo, metriche, stakeholder feedback, e retrospettiva.

#### Utilizzo

```bash
# Review completa con retrospettiva
/sc:sprint-review "Sprint-42"

# Solo review (senza retro)
/sc:sprint-review "Sprint-42" --include_retro=false

# Con report generato
/sc:sprint-review "Sprint-42" --generate_report=true
```

#### Cosa fa

1. **Sprint Overview**
   - Goal achievement
   - Commitment vs delivery
   - Executive summary

2. **Completed Work Showcase**
   - Demo per ogni story
   - Business value
   - Impact metrics

3. **Incomplete Work**
   - Stories non completate
   - Motivi
   - Piano per next sprint

4. **Sprint Metrics**
   - Velocity
   - Commitment accuracy
   - Quality metrics
   - Cycle time

5. **Stakeholder Feedback**
   - Product owner
   - Engineering manager
   - Customer success

6. **Retrospective**
   - What went well
   - What didn't go well
   - Ideas for improvement
   - Action items

#### Output

```markdown
🏆 Sprint 42 - Review & Retrospective
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Goal Achievement: ✅ ACHIEVED
Delivery: 30/32 points (94%)

✅ COMPLETED WORK:
- Authentication fix (production impact: +12% satisfaction)
- Payment integration (revenue-critical feature)
- Dashboard performance (-75% load time)
- Mobile responsive (zero responsive issues)

⏳ CARRIED OVER:
- Multi-language support (25% complete → Sprint 43)

📊 METRICS:
- Velocity: 30 points (vs 31 avg) ✅
- Quality: 87% test coverage ✅
- Cycle time: 2.1 days ✅

💬 RETROSPECTIVE:

😊 What Went Well:
- Excellent team collaboration
- Early testing of external APIs
- Zero production incidents

😕 What Didn't Go Well:
- Underestimated i18n complexity
- Mid-sprint API key delay

💡 Action Items:
- Pre-sprint research spike for complex stories
- Request external access Day 1

Next Sprint: /sc:plan-sprint "Sprint-43"
```

---

## 🛠️ Skill di Manutenzione

### Dependency Updater

**Skill:** `dependency-updater`

Gestione automatica aggiornamenti dipendenze con security scanning e testing.

#### Attivazione

```bash
# Scan dipendenze
/sc:update-deps scan

# Update security issues only
/sc:update-deps security

# Update con strategia conservative
/sc:update-deps conservative

# Update specifica package
/sc:update-deps package react

# Test senza commit
/sc:update-deps test
```

#### Features

- ✅ Rilevamento automatico outdated packages
- ✅ Security vulnerability scanning (CVE)
- ✅ Strategie update (security, conservative, moderate, aggressive)
- ✅ Testing automatico post-update
- ✅ Changelog generation
- ✅ Rollback automatico se test falliscono
- ✅ Scheduling (weekly, monthly)

#### Report Esempio

```markdown
📦 Dependency Update Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔴 SECURITY UPDATES (2):
- axios: 0.21.1 → 1.6.2 (CVE-2023-45857)
- json5: 2.2.0 → 2.2.3 (CVE-2022-46175)

🟢 FEATURE UPDATES (8):
- react: 18.2.0 → 18.3.1
- typescript: 5.0.4 → 5.3.3

Actions:
1. ❌ Update security issues IMMEDIATELY
2. ⏳ Schedule feature updates for Sprint 43
```

---

### Security Scanner

**Skill:** `security-scanner`

Scanning di sicurezza completo con vulnerability detection e remediation.

#### Attivazione

```bash
# Scan completo
/sc:security-scan

# Scan specifico
/sc:security-scan --type=sast
/sc:security-scan --type=dependencies
/sc:security-scan --type=secrets

# Quick scan (solo critici)
/sc:security-scan --quick

# Auto-fix
/sc:security-scan --auto-fix
```

#### Features

- ✅ Dependency vulnerabilities (npm audit, Snyk)
- ✅ Code security (SQL injection, XSS, etc.)
- ✅ Configuration security (CORS, headers, cookies)
- ✅ Secrets detection (API keys, credentials)
- ✅ OWASP Top 10 compliance
- ✅ Automated remediation suggestions
- ✅ Scheduled scanning (daily, weekly)

#### Report Esempio

```markdown
🔒 Security Scan Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Security Score: 72/100 (B)

🚨 CRITICAL (2):
- [VULN-001] SQL Injection in userService.ts:45
- [VULN-002] Hardcoded AWS credentials in config.ts

⚠️  HIGH (3):
- [VULN-003] XSS in Comment.tsx:23
- [VULN-004] Missing auth on /admin endpoint
- [VULN-005] IDOR in documents.ts:34

Actions:
1. ❌ Fix SQL injection IMMEDIATELY
2. ❌ Rotate AWS credentials NOW
3. ⏳ Fix high severity within 48h
```

---

### Performance Monitor

**Skill:** `performance-monitor`

Monitoraggio performance continuo con bottleneck detection e optimization.

#### Attivazione

```bash
# Full check
/sc:perf-monitor

# Monitor specifico
/sc:perf-monitor --type=frontend
/sc:perf-monitor --type=backend
/sc:perf-monitor --type=database

# Generate report
/sc:perf-monitor --report

# Auto-optimize
/sc:perf-monitor --optimize
```

#### Features

- ✅ Core Web Vitals (LCP, FID, CLS)
- ✅ API response times (p50, p95, p99)
- ✅ Database query performance
- ✅ Bundle size analysis
- ✅ Memory leak detection
- ✅ Bottleneck identification
- ✅ Optimization recommendations

#### Report Esempio

```markdown
⚡ Performance Monitor Dashboard
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Status: 🟡 NEEDS ATTENTION

Frontend:
├─ LCP: 3.2s ⚠️ (target: <2.5s)
├─ FID: 85ms ✅
└─ CLS: 0.18 ⚠️ (target: <0.1)

Backend:
├─ API p99: 2.8s ❌ (target: <1s)
├─ Error rate: 1.2% ⚠️
└─ Database: 156 slow queries ❌

Issues Detected:
1. ❌ Missing database index (1,245ms query)
2. ❌ N+1 query pattern (680ms avg)
3. ❌ Large bundle size (847 KB)

Actions:
1. Add database index (30 min) - Priority P0
2. Fix N+1 queries (2 hours) - Priority P1
3. Reduce bundle size (4 hours) - Priority P1
```

---

### Rollback Procedures

**Skill:** `rollback-procedures`

Procedure di rollback automatiche con health checks e validation.

#### Attivazione

```bash
# Emergency rollback (automatico)
/sc:rollback emergency

# Standard rollback
/sc:rollback --version=v2.0.5

# Rollback con validation
/sc:rollback --version=v2.0.5 --validate

# Solo database
/sc:rollback database --migration=20240115

# Dry-run
/sc:rollback --dry-run --version=v2.0.5
```

#### Features

- ✅ Application rollback (blue-green, rolling, canary)
- ✅ Database rollback (migrations, PITR)
- ✅ Configuration rollback
- ✅ Health checks automatici
- ✅ Validation post-rollback
- ✅ Incident tracking
- ✅ Automated decision tree

#### Execution Plan Esempio

```markdown
🚨 EMERGENCY ROLLBACK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Incident: High error rate (15.3%)
Decision: Rollback v2.1.0 → v2.0.5

Timeline:
├─ 14:32:00 - Decision (2 min)
├─ 14:34:00 - Application rollback (5 min)
├─ 14:39:00 - Database rollback (3 min)
├─ 14:42:00 - Validation complete ✅

Result:
├─ Duration: 10 minutes
├─ Downtime: 0 seconds (rolling update)
├─ Error rate: 15.3% → 0.3% ✅
├─ Users restored: 100% ✅

Status: ✅ SUCCESS
```

---

## 🔄 Workflow Completo

### Setup Iniziale

```bash
# 1. Configurazione GitFlow
git flow init

# 2. Attivazione skill
/sc:skill activate dependency-updater
/sc:skill activate security-scanner
/sc:skill activate performance-monitor
/sc:skill activate rollback-procedures
```

### Sprint Cycle

```bash
# === SPRINT START ===
# 1. Sprint Planning (Monday Week 1)
/sc:plan-sprint "Sprint-42" --duration_weeks=2 --team_capacity=32

# 2. Feature Development
/sc:feature "user-authentication"  # Create feature branch
# ... develop ...
/sc:finish-feature "user-authentication"  # Complete feature

# === DAILY ===
# 3. Daily Standup (Every day)
/sc:sprint-status

# === MAINTENANCE (Continuous) ===
# 4. Security & Dependencies
/sc:security-scan --quick          # Quick daily scan
/sc:update-deps security           # Auto-update security issues

# 5. Performance Monitoring
/sc:perf-monitor                   # Check performance

# === SPRINT END ===
# 6. Sprint Review & Retro (Friday Week 2)
/sc:sprint-review "Sprint-42"

# 7. Release (if needed)
/sc:release "v2.1.0"

# === EMERGENCY ===
# 8. Rollback (if issues)
/sc:rollback emergency
```

### Weekly Maintenance

```bash
# Every Monday
/sc:update-deps scan               # Full dependency scan
/sc:security-scan                  # Comprehensive security scan
/sc:perf-monitor --report          # Performance report
```

### Monthly Review

```bash
# First Monday of month
/sc:update-deps moderate           # Update minor versions
/sc:tech-debt scan                 # Technical debt analysis
/sc:quality report                 # Quality metrics
```

---

## ⚙️ Configurazione

### `.claude/settings.json`

```json
{
  "version": "1.0.0",
  "project": {
    "type": "Full-Stack Application",
    "techStack": ["react", "typescript", "nodejs"],
    "gitWorkflow": "gitflow"
  },
  "commands": {
    "sc-plan-sprint": {
      "defaultDuration": 2,
      "defaultBuffer": 0.2,
      "velocityWindowSprints": 5
    },
    "sc-sprint-status": {
      "showBurndown": true,
      "alertThresholds": {
        "velocityWarning": 0.8
      }
    }
  },
  "skills": {
    "dependency-updater": {
      "strategy": "moderate",
      "autoUpdate": {
        "security": true,
        "patch": false
      },
      "schedule": {
        "securityScan": "daily",
        "fullAudit": "weekly"
      }
    },
    "security-scanner": {
      "schedule": {
        "daily": true,
        "weekly": true
      },
      "severity": {
        "failOnCritical": true,
        "failOnHigh": false
      }
    },
    "performance-monitor": {
      "alerts": {
        "lcp": 2500,
        "apiP99": 1000
      },
      "budgets": {
        "bundle": "700KB",
        "lcp": "2.5s"
      }
    },
    "rollback-procedures": {
      "autoRollback": {
        "enabled": true,
        "errorRateThreshold": 0.10
      }
    }
  }
}
```

---

## 📋 Best Practices

### Sprint Planning

1. **Pre-Planning**
   - Backlog grooming fatto in anticipo
   - Stories con acceptance criteria chiari
   - Dependencies identificate

2. **During Planning**
   - Team completo partecipa
   - Sprint goal chiaro e misurabile
   - Capacity con buffer (15-20%)
   - Break down stories >8 points

3. **Post-Planning**
   - Sprint backlog condiviso con team
   - Task assegnati Day 1
   - Definition of Done chiara

### Daily Standup

1. **Timing**
   - Stesso orario ogni giorno
   - Massimo 15 minuti
   - Focus su blockers

2. **Format**
   - Cosa ho fatto ieri
   - Cosa farò oggi
   - Ci sono blockers?

3. **Follow-up**
   - Discussioni dettagliate dopo standup
   - Blockers escalati immediatamente

### Security & Maintenance

1. **Security**
   - Critical vulnerabilities: fix entro 24h
   - High severity: fix entro 48h
   - Scan giornaliero automatico

2. **Dependencies**
   - Security updates automatici
   - Feature updates schedulati
   - Major versions con review

3. **Performance**
   - Monitoring continuo
   - Alert su degradation
   - Budget performance enforced

4. **Rollback**
   - Rollback plan per ogni deploy
   - Health checks automatici
   - Decision tree chiaro

---

## 🎓 Training Resources

### Video Tutorials
- [Sprint Planning Walkthrough](https://example.com/sprint-planning)
- [Daily Standup Best Practices](https://example.com/daily-standup)
- [Emergency Rollback Procedures](https://example.com/rollback)

### Documentation
- [GitFlow Workflow Guide](../guides/gitflow-workflow.md)
- [Agile Ceremonies](../guides/agile-ceremonies.md)
- [Security Best Practices](../guides/security.md)

### Templates
- [Sprint Planning Template](../templates/sprint-planning.md)
- [Retrospective Template](../templates/retrospective.md)
- [Incident Response Runbook](../templates/incident-response.md)

---

## 🆘 Troubleshooting

### Common Issues

**Q: Sprint velocity inconsistente**
```bash
# A: Analizza velocity trend
/sc:sprint-review --analyze-velocity

# Possibili cause:
# - Estimation non accurata
# - Team capacity variabile
# - External dependencies non gestite
```

**Q: Security scan troppo lento**
```bash
# A: Usa quick scan per daily
/sc:security-scan --quick

# Full scan solo weekly
/sc:security-scan --scheduled=weekly
```

**Q: Performance degradation non rilevata**
```bash
# A: Configura alert più stringenti
# In .claude/settings.json:
{
  "skills": {
    "performance-monitor": {
      "alerts": {
        "lcp": 2000,  # Più stringente
        "apiP99": 800
      }
    }
  }
}
```

**Q: Rollback fallito**
```bash
# A: Check pre-requisiti
/sc:rollback --dry-run --version=v2.0.5

# Verifica:
# - Previous version disponibile
# - Database compatible
# - No data migration issues
```

---

## 📞 Support

Per domande o problemi:

- **Documentation**: [docs/](../README.md)
- **Issues**: [GitHub Issues](https://github.com/your-org/repo/issues)
- **Slack**: #engineering-support
- **Email**: engineering@company.com

---

**Ultima revisione**: 2024-01-16
**Versione**: 1.0.0
