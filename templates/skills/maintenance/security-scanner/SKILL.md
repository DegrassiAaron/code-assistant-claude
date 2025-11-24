---
name: "security-scanner"
version: "1.0.0"
description: "Scheduled and on-demand security scanning with vulnerability detection, compliance checking, and automated remediation"
author: "Code-Assistant-Claude"
category: "maintenance"

triggers:
  keywords: ["security scan", "vulnerability", "security check", "audit security"]
  patterns: ["scan.*security", "check.*vulnerabilities", "security.*audit"]
  filePatterns: ["*.ts", "*.js", "*.py", "*.java", "*.go", "*.rb", "package.json", "requirements.txt"]
  commands: ["/sc:security-scan", "/sc:vuln-check"]

tokenCost:
  metadata: 48
  fullContent: 3200
  resources: 1000

dependencies:
  skills: ["security-auditor"]
  mcps: []

composability:
  compatibleWith: ["security-auditor", "dependency-updater", "code-reviewer"]
  conflictsWith: []

context:
  projectTypes: ["javascript", "typescript", "python", "ruby", "go", "java", "rust", "php"]
  minNodeVersion: "18.0.0"
  requiredTools: ["npm", "git"]

priority: "high"
autoActivate: true
cacheStrategy: "normal"
---

# Security Scanner Skill

Comprehensive security scanning with scheduled audits, vulnerability detection, compliance checking, threat analysis, and automated remediation suggestions.

## Security Scanning Layers

```markdown
🔒 Multi-Layer Security Scanning

Layer 1: DEPENDENCY VULNERABILITIES
├─ npm audit / yarn audit
├─ Snyk vulnerability database
├─ GitHub Security Advisories
├─ CVE database lookups
└─ CVSS score analysis

Layer 2: CODE SECURITY (SAST)
├─ SQL Injection detection
├─ XSS vulnerability patterns
├─ Command Injection risks
├─ Path Traversal issues
├─ Insecure Deserialization
├─ Hardcoded secrets/credentials
└─ Weak cryptography usage

Layer 3: CONFIGURATION SECURITY
├─ Exposed API keys/tokens
├─ Insecure CORS settings
├─ Missing security headers
├─ Weak authentication configs
├─ Insecure cookie settings
└─ Debug mode in production

Layer 4: SECRETS DETECTION
├─ API keys
├─ Database credentials
├─ Private keys
├─ OAuth tokens
├─ AWS/Cloud credentials
└─ Environment variables

Layer 5: COMPLIANCE & STANDARDS
├─ OWASP Top 10 compliance
├─ CWE (Common Weakness Enumeration)
├─ PCI-DSS requirements
├─ GDPR data protection
├─ SOC 2 controls
└─ HIPAA compliance (if applicable)

Layer 6: SUPPLY CHAIN SECURITY
├─ Package integrity verification
├─ Dependency typosquatting
├─ Malicious package detection
├─ License compliance
└─ Outdated signature verification
```

## Security Scan Report

```markdown
🔒 Security Scan Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Scan Date: {{timestamp}}
Scan Type: COMPREHENSIVE
Environment: Production
Duration: 45 seconds

Overall Security Score: 72/100 (B)
Risk Level: 🟡 MEDIUM

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚨 CRITICAL Vulnerabilities (Fix Immediately)

[VULN-001] SQL Injection Vulnerability
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Severity: CRITICAL (CVSS 9.8)
Type: CWE-89 (SQL Injection)
File: src/api/users/userService.ts:45
Code:
  const query = `SELECT * FROM users WHERE email = '${email}'`;
  db.query(query);

Issue:
User input directly concatenated into SQL query without sanitization.
Allows attacker to inject malicious SQL code.

Attack Vector:
  email = "' OR '1'='1'; DROP TABLE users; --"

Impact:
- Data breach (read all user data)
- Data manipulation (modify/delete records)
- Authentication bypass
- Potential RCE if db has elevated privileges

Exploitation Likelihood: HIGH
Public Exploits Available: YES

Remediation:
1. Use parameterized queries:
   ```typescript
   const query = 'SELECT * FROM users WHERE email = ?';
   db.query(query, [email]);
   ```

2. Or use ORM:
   ```typescript
   await User.findOne({ where: { email } });
   ```

3. Implement input validation:
   ```typescript
   if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
     throw new Error('Invalid email');
   }
   ```

References:
- OWASP SQL Injection: https://owasp.org/www-community/attacks/SQL_Injection
- CWE-89: https://cwe.mitre.org/data/definitions/89.html

Status: ❌ UNRESOLVED
Priority: P0 (Fix within 24 hours)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[VULN-002] Hardcoded AWS Credentials
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Severity: CRITICAL (CVSS 9.1)
Type: CWE-798 (Hard-coded Credentials)
File: src/services/s3/config.ts:8
Code:
  const AWS_ACCESS_KEY = 'AKIAIOSFODNN7EXAMPLE';
  const AWS_SECRET_KEY = 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY';

Issue:
AWS credentials hardcoded in source code. Exposed in version control.

Impact:
- Unauthorized access to AWS account
- Potential data breach of S3 buckets
- Resource abuse (EC2, Lambda, etc.)
- Financial damage from resource usage
- Compliance violations (PCI-DSS, SOC 2)

Exploitation Likelihood: CRITICAL
Exposed in Git History: YES (commit a3f2b1c)

Remediation:
1. IMMEDIATELY rotate compromised credentials
2. Move to environment variables:
   ```typescript
   const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID;
   const AWS_SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY;
   ```

3. Use AWS IAM roles (preferred):
   ```typescript
   // Let AWS SDK use instance role
   const s3 = new AWS.S3();
   ```

4. Remove from git history:
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch src/services/s3/config.ts" \
     --prune-empty --tag-name-filter cat -- --all
   ```

5. Add to .gitignore:
   ```
   .env
   .env.local
   config/credentials.json
   ```

Status: ❌ UNRESOLVED
Priority: P0 (Fix IMMEDIATELY - credentials are exposed!)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️  HIGH Severity Vulnerabilities

[VULN-003] Cross-Site Scripting (XSS)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Severity: HIGH (CVSS 7.4)
Type: CWE-79 (Cross-site Scripting)
File: src/components/Comment/Comment.tsx:23
Code:
  <div dangerouslySetInnerHTML={{ __html: comment.body }} />

Issue:
User-generated content rendered without sanitization using dangerouslySetInnerHTML.

Attack Vector:
  comment.body = "<img src=x onerror='alert(document.cookie)'>"

Impact:
- Session hijacking (steal auth tokens)
- Phishing attacks
- Defacement
- Malware distribution
- Data theft

Remediation:
1. Remove dangerouslySetInnerHTML
2. Use sanitization library:
   ```typescript
   import DOMPurify from 'dompurify';

   <div dangerouslySetInnerHTML={{
     __html: DOMPurify.sanitize(comment.body)
   }} />
   ```

3. Or render as text:
   ```typescript
   <div>{comment.body}</div>
   ```

Status: ❌ UNRESOLVED
Priority: P1 (Fix within 48 hours)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[VULN-004] Missing Authentication on API Endpoint
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Severity: HIGH (CVSS 8.2)
Type: CWE-306 (Missing Authentication)
File: src/api/routes/admin.ts:12
Code:
  router.get('/admin/users', async (req, res) => {
    const users = await User.findAll();
    res.json(users);
  });

Issue:
Admin endpoint accessible without authentication check.

Impact:
- Unauthorized access to user data
- Privacy violation
- Compliance breach (GDPR, CCPA)
- Potential data modification

Remediation:
1. Add authentication middleware:
   ```typescript
   router.get('/admin/users',
     authenticateToken,
     requireAdmin,
     async (req, res) => {
       const users = await User.findAll();
       res.json(users);
     }
   );
   ```

2. Implement RBAC:
   ```typescript
   function requireAdmin(req, res, next) {
     if (req.user.role !== 'admin') {
       return res.status(403).json({ error: 'Forbidden' });
     }
     next();
   }
   ```

Status: ❌ UNRESOLVED
Priority: P1 (Fix within 48 hours)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[VULN-005] Insecure Direct Object Reference (IDOR)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Severity: HIGH (CVSS 7.7)
Type: CWE-639 (Insecure Direct Object Reference)
File: src/api/routes/documents.ts:34
Code:
  router.get('/documents/:id', async (req, res) => {
    const doc = await Document.findById(req.params.id);
    res.json(doc);
  });

Issue:
No authorization check to verify user owns the document.

Attack Vector:
  GET /documents/123  (attacker can access any document by ID)

Impact:
- Unauthorized data access
- Privacy violation
- Compliance risk

Remediation:
1. Add ownership check:
   ```typescript
   router.get('/documents/:id', authenticateToken, async (req, res) => {
     const doc = await Document.findOne({
       where: {
         id: req.params.id,
         userId: req.user.id  // Check ownership
       }
     });

     if (!doc) {
       return res.status(404).json({ error: 'Not found' });
     }

     res.json(doc);
   });
   ```

Status: ❌ UNRESOLVED
Priority: P1 (Fix within 48 hours)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🟡 MEDIUM Severity Issues

[VULN-006] Weak Password Requirements
Severity: MEDIUM (CVSS 5.3)
File: src/api/auth/register.ts:18
Issue: Password minimum length is only 6 characters
Remediation: Require 12+ characters, complexity rules

[VULN-007] Missing CSRF Protection
Severity: MEDIUM (CVSS 6.5)
File: src/middleware/security.ts
Issue: No CSRF tokens on state-changing operations
Remediation: Implement CSRF middleware (csurf package)

[VULN-008] Insecure Cookie Settings
Severity: MEDIUM (CVSS 5.9)
File: src/config/session.ts:12
Issue: Session cookie missing 'secure' and 'httpOnly' flags
Remediation: Set secure=true, httpOnly=true, sameSite='strict'

[VULN-009] Missing Rate Limiting
Severity: MEDIUM (CVSS 5.0)
File: src/api/routes/auth.ts
Issue: Login endpoint has no rate limiting
Remediation: Add express-rate-limit middleware

[VULN-010] Verbose Error Messages
Severity: MEDIUM (CVSS 4.3)
File: src/middleware/errorHandler.ts:23
Issue: Stack traces exposed in production
Remediation: Only show generic errors in production

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🟢 LOW Severity Issues

[VULN-011] Missing Security Headers
Severity: LOW (CVSS 3.1)
Issue: Missing Content-Security-Policy header
Remediation: Use helmet middleware

[VULN-012] Outdated TLS Configuration
Severity: LOW (CVSS 3.7)
Issue: TLS 1.0 and 1.1 still enabled
Remediation: Enforce TLS 1.2+ only

[VULN-013] Inadequate Logging
Severity: LOW (CVSS 2.0)
Issue: Authentication failures not logged
Remediation: Add comprehensive audit logging

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Vulnerability Summary

By Severity:
├─ 🔴 CRITICAL: 2 (Fix immediately!)
├─ 🟠 HIGH: 3 (Fix within 48h)
├─ 🟡 MEDIUM: 5 (Fix this sprint)
└─ 🟢 LOW: 3 (Schedule for backlog)

By Category:
├─ Injection: 1
├─ Authentication: 2
├─ Authorization: 1
├─ XSS: 1
├─ Hardcoded Secrets: 1
├─ Configuration: 4
└─ Other: 3

OWASP Top 10 Coverage:
├─ A01:2021 - Broken Access Control: 2 issues
├─ A02:2021 - Cryptographic Failures: 1 issue
├─ A03:2021 - Injection: 1 issue
├─ A05:2021 - Security Misconfiguration: 4 issues
├─ A07:2021 - Identification and Authentication: 2 issues
└─ A09:2021 - Security Logging Failures: 1 issue

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 Security Trend Analysis

Previous Scan (7 days ago):
├─ Critical: 3 (↓ 1 fixed!)
├─ High: 4 (↓ 1 fixed!)
├─ Medium: 5 (→ same)
└─ Low: 4 (↓ 1 fixed!)

Progress: 🟢 IMPROVING
Fixes Completed: 3 vulnerabilities (last week)
New Vulnerabilities: 0 (this scan)

Mean Time to Remediate:
├─ Critical: 18 hours (Target: <24h) ✅
├─ High: 52 hours (Target: <48h) ⚠️
├─ Medium: 6 days (Target: <14 days) ✅
└─ Low: 18 days (Target: <30 days) ✅

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 Recommended Actions (Priority Order)

Immediate (Today):
1. ❌ Rotate AWS credentials (VULN-002)
2. ❌ Remove credentials from git history
3. ❌ Fix SQL injection in userService.ts (VULN-001)
4. ❌ Add authentication to admin endpoints (VULN-004)

This Week:
5. ⏳ Sanitize user content to prevent XSS (VULN-003)
6. ⏳ Implement IDOR protection (VULN-005)
7. ⏳ Add CSRF protection
8. ⏳ Strengthen password requirements

This Sprint:
9. 📅 Implement rate limiting
10. 📅 Fix insecure cookie settings
11. 📅 Add security headers (helmet)
12. 📅 Improve error handling

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🤖 Automated Remediation Available

Auto-fixable issues: 4/13 (31%)

/sc:fix-security VULN-011  # Add helmet middleware
/sc:fix-security VULN-008  # Fix cookie settings
/sc:fix-security VULN-009  # Add rate limiting
/sc:fix-security VULN-013  # Add audit logging

Manual review required: 9 issues
Estimated remediation time: 12-16 hours

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Compliance Status

OWASP Top 10 (2021): ⚠️  6/10 categories have issues
PCI-DSS: ❌ FAIL (hardcoded credentials)
SOC 2: ⚠️  AT RISK (auth/access control issues)
GDPR: ⚠️  AT RISK (data access control issues)
HIPAA: N/A (not applicable)

Compliance Actions Required:
1. Fix all critical vulnerabilities
2. Implement encryption at rest
3. Add comprehensive audit logging
4. Document security procedures

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Next Scan: {{next_scan_date}}
Report Generated: {{timestamp}}
```

## Scheduled Scanning

```markdown
🕐 Security Scan Schedule

CONTINUOUS (Real-time):
├─ Pre-commit hooks: Secret scanning
├─ PR checks: SAST analysis
├─ Dependency updates: Vuln check
└─ Code review: Security checklist

DAILY (3:00 AM):
├─ Dependency vulnerability scan
├─ Secret detection in new commits
├─ Configuration drift detection
└─ Quick SAST scan of changed files

WEEKLY (Monday 9:00 AM):
├─ Full SAST scan
├─ Compliance check
├─ Security header audit
├─ Authentication/authorization review
└─ Generate weekly report

MONTHLY (First Monday):
├─ Comprehensive security audit
├─ Penetration testing (automated)
├─ Dependency license audit
├─ Security metrics review
└─ Stakeholder report generation

QUARTERLY:
├─ External security assessment
├─ Threat modeling update
├─ Incident response drill
└─ Security training refresh
```

## Integration with CI/CD

```yaml
# .github/workflows/security-scan.yml
name: Security Scan

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 3 * * *'  # Daily at 3 AM

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Dependency vulnerability scan
        run: npm audit --audit-level=moderate

      - name: Secret scanning
        uses: trufflesecurity/trufflehog@main

      - name: SAST scan
        run: /sc:security-scan --type=sast

      - name: Generate security report
        run: /sc:security-scan --report

      - name: Upload results
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: security-report.sarif

      - name: Notify on critical findings
        if: failure()
        run: |
          /sc:notify-team --channel=security --severity=critical
```

## Automated Fixes

```markdown
🤖 Automated Security Fixes

Auto-Fixable Issues:

1. Missing Security Headers
   ```typescript
   // Before
   app.use(express.json());

   // After (auto-fixed)
   import helmet from 'helmet';
   app.use(helmet());
   app.use(express.json());
   ```

2. Insecure Cookie Settings
   ```typescript
   // Before
   app.use(session({ secret: 'secret' }));

   // After (auto-fixed)
   app.use(session({
     secret: process.env.SESSION_SECRET,
     cookie: {
       secure: true,
       httpOnly: true,
       sameSite: 'strict',
       maxAge: 24 * 60 * 60 * 1000
     }
   }));
   ```

3. Missing Rate Limiting
   ```typescript
   // Before
   app.post('/login', loginHandler);

   // After (auto-fixed)
   import rateLimit from 'express-rate-limit';

   const loginLimiter = rateLimit({
     windowMs: 15 * 60 * 1000,
     max: 5
   });

   app.post('/login', loginLimiter, loginHandler);
   ```

Manual Review Required:
- SQL Injection fixes (require code logic changes)
- XSS fixes (need context-aware sanitization)
- Authentication implementation (architectural decision)
```

## Configuration

`.claude/settings.json`:
```json
{
  "skills": {
    "security-scanner": {
      "schedule": {
        "daily": true,
        "weekly": true,
        "monthly": true
      },
      "scanTypes": {
        "dependencies": true,
        "sast": true,
        "secrets": true,
        "config": true,
        "compliance": true
      },
      "severity": {
        "failOnCritical": true,
        "failOnHigh": false,
        "reportAll": true
      },
      "notifications": {
        "slack": true,
        "email": true,
        "githubIssues": true
      },
      "autoFix": {
        "enabled": true,
        "requireApproval": true,
        "createPR": true
      }
    }
  }
}
```

## Usage

```bash
# Full security scan
/sc:security-scan

# Scan specific type
/sc:security-scan --type=sast
/sc:security-scan --type=dependencies
/sc:security-scan --type=secrets

# Quick scan (critical only)
/sc:security-scan --quick

# Generate report
/sc:security-scan --report --format=pdf

# Auto-fix (safe fixes only)
/sc:security-scan --auto-fix

# Compliance check
/sc:security-scan --compliance=pci-dss
```

## Success Metrics

- Mean Time to Detect (MTTD): <1 hour
- Mean Time to Remediate (MTTR): <24h (critical)
- False Positive Rate: <10%
- Security Score: >85/100
- Zero-day response: <4 hours
