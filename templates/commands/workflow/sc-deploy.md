---
name: "sc-deploy"
description: "Automated deployment with pre-flight checks"
category: "workflow"
version: "1.0.0"

triggers:
  exact: "/sc:deploy"
  aliases: ["/deploy", "/ship"]
  keywords: ["deploy", "publish", "release"]

requires:
  skills: ["deployment-manager"]
  mcps: ["serena"]

parameters:
  - name: "environment"
    type: "string"
    required: true
    options: ["dev", "staging", "production"]
    description: "Target deployment environment"
  - name: "skipTests"
    type: "boolean"
    required: false
    default: false
  - name: "skipChecks"
    type: "boolean"
    required: false
    default: false

autoExecute: false
tokenEstimate: 8000
executionTime: "30-180s"
---

# /sc:deploy - Automated Deployment

Safe deployment with comprehensive pre-flight checks and rollback capability.

## Execution Flow

### 1. Pre-Flight Checks

**Critical Checks** (Cannot be skipped for production):
- ✅ All tests passing
- ✅ Build successful
- ✅ No linting errors
- ✅ Security scan clean
- ✅ Dependencies up to date
- ✅ Environment variables configured
- ✅ Database migrations ready
- ✅ No uncommitted changes (production only)

**Warning Checks** (Can proceed with confirmation):
- ⚠️ Test coverage below threshold
- ⚠️ Large bundle size increase
- ⚠️ Breaking API changes
- ⚠️ Performance regression

### 2. Environment-Specific Flows

**Development**:
1. Run tests
2. Build application
3. Deploy to dev server
4. Run smoke tests

**Staging**:
1. All dev checks
2. Integration tests
3. Security scan
4. Deploy to staging
5. E2E tests
6. Performance tests

**Production**:
1. All staging checks
2. Create git tag
3. Backup database
4. Deploy with zero-downtime
5. Health check monitoring
6. Rollback plan ready

### 3. Deployment Steps

1. **Validate Environment**
   ```bash
   # Check environment config
   # Verify credentials
   # Test connectivity
   ```

2. **Run Pre-Deployment Tests**
   ```bash
   npm test              # Unit + integration tests
   npm run lint          # Code quality
   npm run type-check    # TypeScript validation
   npm run security-scan # Vulnerability check
   ```

3. **Build Application**
   ```bash
   npm run build:{environment}
   # Optimized build
   # Asset generation
   # Bundle analysis
   ```

4. **Deploy**
   ```bash
   # Platform-specific deployment
   # - Vercel: vercel deploy --prod
   # - AWS: aws deploy push
   # - Docker: docker-compose up -d
   # - Kubernetes: kubectl apply -f
   ```

5. **Post-Deployment Verification**
   ```bash
   # Health check endpoint
   # Smoke tests
   # Monitor errors
   # Verify metrics
   ```

6. **Notify Stakeholders**
   ```
   📢 Deployment Notification
   Environment: {environment}
   Version: v1.2.3
   Deployed by: AI Assistant
   Status: ✅ Success
   URL: https://app.example.com
   ```

### 4. Rollback Strategy

**Automatic Rollback** (if post-deployment checks fail):
```bash
# Revert to previous version
# Restore database backup
# Clear cache
# Notify team
```

**Manual Rollback**:
```bash
/sc:rollback {environment}
# Quick revert to last stable version
```

## Examples

### Deploy to Development
```bash
/sc:deploy dev

# Quick deployment:
# 1. Run tests
# 2. Build
# 3. Deploy
# 4. Smoke tests
```

### Deploy to Staging
```bash
/sc:deploy staging

# Thorough deployment:
# 1. All tests
# 2. Security scan
# 3. Build
# 4. Deploy
# 5. E2E tests
# 6. Performance tests
```

### Deploy to Production
```bash
/sc:deploy production

# Full deployment workflow:
# 1. Comprehensive pre-flight checks
# 2. Create release tag
# 3. Backup database
# 4. Zero-downtime deployment
# 5. Health monitoring
# 6. Stakeholder notification
```

### Skip Tests (Development Only)
```bash
/sc:deploy dev --skipTests=true

# Fast deployment for quick iterations
# NOT allowed for staging or production
```

## Deployment Platforms

**Supported Platforms**:
- Vercel / Netlify (Frontend)
- AWS (EC2, ECS, Lambda)
- Google Cloud Platform
- Azure
- Heroku
- DigitalOcean
- Kubernetes
- Docker Swarm

**Auto-Detection**:
- Reads package.json scripts
- Detects platform from config
- Uses platform-specific commands

## Safety Features

### Production Safeguards
1. **Confirmation Required**
   ```
   ⚠️  Production Deployment

   Environment: production
   Version: v1.2.3
   Changes: 15 commits since last deployment

   Pre-flight Status:
   ✅ Tests passed (100%)
   ✅ Build successful
   ✅ Security scan clean
   ✅ Database migrations ready

   Type 'DEPLOY' to confirm:
   ```

2. **Deployment Window**
   - Configurable deployment hours
   - Avoid high-traffic periods
   - Weekend/holiday restrictions

3. **Gradual Rollout**
   - Canary deployment (5% → 50% → 100%)
   - Feature flags
   - A/B testing support

### Error Handling

```
❌ Deployment Failed

Environment: staging
Error: Tests failed (2/150)

Failed Tests:
- UserService.test.ts: testCreateUser()
- AuthController.test.ts: testLogin()

Action Required:
1. Fix failing tests
2. Re-run deployment
3. Or use --skipTests (not recommended)

Logs: /var/log/deploy/2025-11-23.log
```

## Monitoring

### Real-Time Metrics
```
📊 Deployment Progress

[████████████████░░░░] 80%

✅ Tests passed
✅ Build successful
✅ Deployed to server
⏳ Running health checks
⏳ Verifying endpoints

Estimated time remaining: 30s
```

### Post-Deployment Monitoring
```
📈 Deployment Health

Status: 🟢 Healthy
Uptime: 5 minutes
Error Rate: 0.01%
Response Time: 45ms (avg)
Active Users: 1,247

Recent Errors: None
Performance: Normal
Database: Healthy
```

## Integration

### With Skills
- deployment-manager: Orchestration
- test-runner: Pre-flight tests
- monitoring: Health checks

### With MCPs
- Serena: Code analysis
- Infrastructure tools: Platform deployment

### With CI/CD
- GitHub Actions
- GitLab CI
- Jenkins
- CircleCI

## Configuration

`.claude/settings.json`:
```json
{
  "commands": {
    "sc-deploy": {
      "platforms": {
        "dev": "vercel",
        "staging": "aws-ecs",
        "production": "kubernetes"
      },
      "checks": {
        "tests": true,
        "linting": true,
        "security": true,
        "coverage": 80
      },
      "notifications": {
        "slack": "#deployments",
        "email": "team@example.com"
      },
      "rollback": {
        "automatic": true,
        "threshold": "error_rate > 5%"
      }
    }
  }
}
```

## Success Metrics

- Deployment success rate: >99%
- Average deployment time: <5 minutes
- Zero-downtime deployments: 100%
- Rollback time: <2 minutes
- Error detection rate: >95%
