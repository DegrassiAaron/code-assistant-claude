---
name: "security-auditor"
version: "1.0.0"
description: "Comprehensive security audit focusing on OWASP Top 10 and common vulnerabilities"
author: "Code-Assistant-Claude"
category: "core"

triggers:
  keywords: ["security", "audit", "vulnerability", "owasp"]
  patterns: ["security.*check", "audit.*code"]
  filePatterns: ["*.ts", "*.js", "*.py", "*.java"]
  commands: ["/sc:security"]

tokenCost:
  metadata: 42
  fullContent: 1900
  resources: 600

dependencies:
  skills: []
  mcps: []

composability:
  compatibleWith: ["code-reviewer"]
  conflictsWith: []

context:
  projectTypes: ["javascript", "typescript", "python", "java", "nodejs", "react"]
  minNodeVersion: "18.0.0"
  requiredTools: []

priority: "high"
autoActivate: true
cacheStrategy: "normal"
---

# Security Auditor Skill

Performs comprehensive security audits based on OWASP Top 10 and industry best practices.

## Security Checks

### 1. Injection Vulnerabilities
- SQL Injection
- NoSQL Injection
- Command Injection
- LDAP Injection

### 2. Broken Authentication
- Weak password policies
- Session management issues
- Credential exposure

### 3. Sensitive Data Exposure
- Unencrypted data transmission
- Hardcoded secrets
- Inadequate encryption

### 4. XML External Entities (XXE)
- XML parser configuration
- External entity references

### 5. Broken Access Control
- Improper authorization checks
- Insecure direct object references

### 6. Security Misconfiguration
- Default configurations
- Unnecessary features enabled
- Missing security headers

### 7. Cross-Site Scripting (XSS)
- Reflected XSS
- Stored XSS
- DOM-based XSS

### 8. Insecure Deserialization
- Unsafe object deserialization
- Remote code execution risks

### 9. Using Components with Known Vulnerabilities
- Outdated dependencies
- Known CVEs

### 10. Insufficient Logging & Monitoring
- Missing security events
- Inadequate logging

## Audit Report Format

```
🔒 Security Audit Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Severity: CRITICAL | HIGH | MEDIUM | LOW

🚨 CRITICAL
- SQL Injection vulnerability in user.service.ts:45
- Hardcoded API key in config.ts:12

⚠️  HIGH
- Missing input validation in api/users.ts:67
- XSS vulnerability in comment rendering

ℹ️  MEDIUM
- Weak password requirements
- Missing CSRF protection

✅ PASSED
- Proper authentication implementation
- Secure session management
- HTTPS enforcement
```

## Integration

Works with:
- npm audit
- Snyk
- OWASP Dependency-Check
- SonarQube
