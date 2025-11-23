---
name: "sc-release"
description: "Prepare release branch following GitFlow"
category: "git"
version: "1.0.0"

triggers:
  exact: "/sc:release"
  aliases: ["/release", "/prepare-release"]
  keywords: ["release", "version", "deploy"]

requires:
  mcps: []

parameters:
  - name: "version"
    type: "string"
    required: true
    description: "Release version (e.g., 1.2.0)"
  - name: "from"
    type: "string"
    required: false
    default: "develop"

autoExecute: false
tokenEstimate: 5000
executionTime: "10-30s"
---

# /sc:release - Release Preparation

Creates and prepares a release branch following GitFlow and semantic versioning.

## Release Process Overview

```
Release Flow:
1. Create release branch from develop
2. Version bump and changelog
3. Final testing and bug fixes
4. Merge to main and develop
5. Tag version
6. Deploy to production
```

## Execution Flow

### 1. Pre-Release Validation

```markdown
✅ Pre-Release Checklist

Code Quality:
- [ ] All tests passing
- [ ] No failing CI/CD pipelines
- [ ] Code coverage ≥80%
- [ ] No critical bugs
- [ ] Security scan clean

Documentation:
- [ ] CHANGELOG.md updated
- [ ] README.md accurate
- [ ] API docs current
- [ ] Migration guides written

Dependencies:
- [ ] No vulnerable dependencies
- [ ] Dependencies up to date
- [ ] License compliance verified

Testing:
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] E2E tests passing
- [ ] Performance tests passing
- [ ] Manual QA completed
```

### 2. Version Management

```markdown
📦 Version Bump

Current Version: 1.1.5
New Version: {version}

Version Type: {major|minor|patch}
- Major (1.x.x): Breaking changes
- Minor (x.2.x): New features, backwards compatible
- Patch (x.x.3): Bug fixes only

Files to Update:
- package.json
- package-lock.json
- VERSION file (if exists)
- CHANGELOG.md
- Documentation
```

### 3. Branch Creation

```bash
# Ensure develop is up to date
git checkout develop
git pull origin develop

# Create release branch
git checkout -b release/{version}

# Version bump
npm version {version} --no-git-tag-version

# Update changelog
echo "Updating CHANGELOG.md..."

# Commit version bump
git add package.json package-lock.json CHANGELOG.md
git commit -m "chore: bump version to {version}"

# Push release branch
git push -u origin release/{version}
```

### 4. Changelog Generation

```markdown
# CHANGELOG.md

## [{version}] - {date}

### Added ✨
- New feature 1
- New feature 2
- New feature 3

### Changed 🔄
- Updated component X
- Improved performance of Y
- Refactored Z

### Fixed 🐛
- Fixed bug #123
- Resolved issue #456
- Corrected typo in docs

### Deprecated ⚠️
- Old API endpoint (use /v2/endpoint instead)

### Removed 🗑️
- Legacy feature X
- Unused dependency Y

### Security 🔒
- Fixed XSS vulnerability
- Updated authentication flow

### Breaking Changes ⚠️
- API endpoint /old changed to /new
- Configuration format updated
```

### 5. Release Preparation

```markdown
🚀 Release Preparation

Release Branch: release/{version}
Target Version: {version}
Expected Release Date: {date}

Tasks:
1. ✅ Version bumped
2. ✅ CHANGELOG.md updated
3. ⏳ Final testing in progress
4. ⏳ Documentation review
5. ⏳ Performance validation
6. ⏳ Security audit

Blockers: None
Risk Level: Low
Go/No-Go Decision: Pending QA sign-off
```

## Usage Examples

### Patch Release
```bash
/sc:release "1.2.1"

# Bug fix release
# No new features
# Only backwards-compatible fixes

# Updates:
# - Version: 1.2.0 → 1.2.1
# - CHANGELOG: Bug fixes section
# - Creates release/1.2.1 branch
```

### Minor Release
```bash
/sc:release "1.3.0"

# New features release
# Backwards compatible
# May include bug fixes

# Updates:
# - Version: 1.2.1 → 1.3.0
# - CHANGELOG: Added + Fixed sections
# - Creates release/1.3.0 branch
```

### Major Release
```bash
/sc:release "2.0.0"

# Breaking changes release
# New architecture or major features
# Migration guide required

# Updates:
# - Version: 1.3.0 → 2.0.0
# - CHANGELOG: Breaking changes section
# - Creates release/2.0.0 branch
# - Generates migration guide
```

## Semantic Versioning (SemVer)

### Version Format: MAJOR.MINOR.PATCH

```
MAJOR version (X.0.0):
- Breaking changes
- Incompatible API changes
- Major architectural changes
- Examples: 1.0.0 → 2.0.0

MINOR version (x.Y.0):
- New features
- Backwards compatible
- Deprecations (with warnings)
- Examples: 1.2.0 → 1.3.0

PATCH version (x.x.Z):
- Bug fixes
- Security patches
- Performance improvements (no API changes)
- Examples: 1.2.3 → 1.2.4
```

### Pre-Release Versions

```
Alpha: 1.3.0-alpha.1
- Early testing
- Unstable
- Feature incomplete

Beta: 1.3.0-beta.1
- Feature complete
- Testing phase
- May have bugs

RC (Release Candidate): 1.3.0-rc.1
- Final testing
- Production-ready features
- No new features added
```

## Release Checklist

### Code Quality
```
- [ ] All tests passing (unit, integration, E2E)
- [ ] Code coverage ≥ 80%
- [ ] No TypeScript errors
- [ ] Linting passing
- [ ] Build successful
- [ ] Bundle size acceptable
```

### Documentation
```
- [ ] CHANGELOG.md complete
- [ ] API documentation updated
- [ ] README.md accurate
- [ ] Migration guide (if breaking changes)
- [ ] Release notes drafted
```

### Testing
```
- [ ] Smoke tests passing
- [ ] Regression tests passing
- [ ] Performance tests passing
- [ ] Security scan clean
- [ ] Cross-browser testing (if web app)
- [ ] Mobile testing (if applicable)
```

### Dependencies
```
- [ ] Dependencies updated
- [ ] No security vulnerabilities
- [ ] License compliance
- [ ] Bundle size analyzed
```

### Infrastructure
```
- [ ] Deployment scripts tested
- [ ] Rollback plan ready
- [ ] Monitoring configured
- [ ] Alerts set up
- [ ] Database migrations prepared
```

## Release Workflow

### Standard Release Process

```bash
# 1. Create release branch
/sc:release "1.3.0"

# 2. Final testing and fixes
git checkout release/1.3.0
# Make final bug fixes
git commit -am "fix: final issues"

# 3. Merge to main
git checkout main
git merge --no-ff release/1.3.0
git tag -a v1.3.0 -m "Release version 1.3.0"
git push origin main --tags

# 4. Merge back to develop
git checkout develop
git merge --no-ff release/1.3.0
git push origin develop

# 5. Delete release branch
git branch -d release/1.3.0
git push origin --delete release/1.3.0

# 6. Deploy
/sc:deploy production
```

## Automation

### Auto-Generated Changelog

```javascript
// Generate changelog from git commits
async function generateChangelog(fromVersion, toVersion) {
  const commits = await getCommitsBetween(fromVersion, toVersion);

  const changelog = {
    added: commits.filter(c => c.type === 'feat'),
    changed: commits.filter(c => c.type === 'refactor'),
    fixed: commits.filter(c => c.type === 'fix'),
    breaking: commits.filter(c => c.breaking)
  };

  return formatChangelog(changelog, toVersion);
}
```

### Release Notes Generation

```markdown
# Release Notes v{version}

## Highlights 🌟
- Most important feature 1
- Critical bug fix 2
- Performance improvement 3

## What's New ✨
[Auto-generated from CHANGELOG Added section]

## Bug Fixes 🐛
[Auto-generated from CHANGELOG Fixed section]

## Improvements 🔄
[Auto-generated from CHANGELOG Changed section]

## Breaking Changes ⚠️
[Auto-generated from CHANGELOG Breaking section]
**Migration Guide**: [link]

## Contributors 👥
- @developer1 (15 commits)
- @developer2 (8 commits)
- @developer3 (5 commits)

Thank you to all contributors! 🎉

## Installation

```bash
npm install package@{version}
```

## Full Changelog
[v{prev_version}...v{version}](github_compare_url)
```

## Integration

### With CI/CD

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    branches:
      - 'release/**'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2

      - name: Install
        run: npm install

      - name: Test
        run: npm test

      - name: Build
        run: npm run build

      - name: Security Audit
        run: npm audit

  notify:
    needs: validate
    runs-on: ubuntu-latest
    steps:
      - name: Notify Team
        uses: slack-github-action@v1
        with:
          payload: |
            {
              "text": "Release ${{ github.ref }} ready for review"
            }
```

### With Project Management

```javascript
// Auto-close issues in release
async function closeReleasedIssues(version) {
  const changelog = parseChangelog(version);
  const issueNumbers = extractIssueNumbers(changelog);

  for (const issueNumber of issueNumbers) {
    await github.issues.update({
      issue_number: issueNumber,
      state: 'closed',
      labels: ['released'],
      comment: `Released in v${version}`
    });
  }
}
```

## Configuration

`.claude/settings.json`:
```json
{
  "commands": {
    "sc-release": {
      "branchPrefix": "release/",
      "generateChangelog": true,
      "generateReleaseNotes": true,
      "runTests": true,
      "notifyTeam": true,
      "autoCloseIssues": true,
      "requireChecklist": true,
      "minimumCoverage": 80
    }
  }
}
```

## Success Metrics

- Release success rate: >99%
- Average release time: <2 hours
- Rollback rate: <2%
- Post-release bugs: <5
- Deployment confidence: >95%
- User satisfaction: >4.8/5
