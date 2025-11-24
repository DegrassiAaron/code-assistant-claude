---
name: "changelog-generator"
version: "1.0.0"
description: "Automatic changelog generation from git commits, PRs, and issues with semantic versioning"
author: "Code-Assistant-Claude"
category: "documentation"

triggers:
  keywords: ["changelog", "release notes", "version"]
  patterns: ["generate.*changelog", "release.*notes"]
  filePatterns: ["CHANGELOG.md"]
  commands: ["/sc:changelog"]

tokenCost:
  metadata: 42
  fullContent: 2200
  resources: 700

dependencies:
  skills: []
  mcps: []

composability:
  compatibleWith: []
  conflictsWith: []

context:
  projectTypes: []
  minNodeVersion: "18.0.0"
  requiredTools: ["git"]

priority: "low"
autoActivate: true
cacheStrategy: "normal"
---

# Changelog Generator Skill

Automatic changelog generation from git commits with semantic versioning, PR linking, and multi-format output.

## Changelog Generation

```bash
/sc:changelog generate

# Changelog

## [2.1.0] - 2024-01-16

### ✨ Features
- Add dark mode toggle (#456) by @developer1
- Implement payment gateway integration (#478) by @developer2
- Add multi-language support (Spanish, French) (#489) by @developer3

### 🐛 Bug Fixes
- Fix authentication token expiration (#123) by @developer1
- Resolve mobile responsive issues (#456) by @developer4

### ⚡ Performance
- Optimize dashboard load time (-75%) (#789) by @developer2
- Reduce bundle size by 176 KB (#801) by @developer1

### 🔒 Security
- Update axios to fix CVE-2023-45857 (#234) by @security-bot

### ⚠️  Breaking Changes
- **API**: Changed response format for /api/users
  - Migration guide: [docs/migration-v2.1.md]

### 📚 Documentation
- Update API documentation (#345) by @developer3

### 🛠️  Maintenance
- Migrate to TypeScript 5.3 (#567) by @developer1
- Update dependencies (#578) by @dependabot

### Contributors
@developer1, @developer2, @developer3, @developer4, @security-bot

[Full Changelog](https://github.com/user/repo/compare/v2.0.0...v2.1.0)
```

## Semantic Versioning

```markdown
Automatic Version Bump:

MAJOR (breaking): v2.0.0 → v3.0.0
- feat!: redesign API
- BREAKING CHANGE in commit

MINOR (features): v2.0.0 → v2.1.0
- feat: add dark mode
- feat: payment integration

PATCH (fixes): v2.0.0 → v2.0.1
- fix: auth bug
- fix: responsive issue
```

## Conventional Commits

```bash
# Auto-parsed from commits
feat: add user preferences
fix: resolve login issue
perf: optimize database queries
docs: update API documentation
style: format code
refactor: restructure auth
test: add unit tests
chore: update dependencies
```

## Usage

```bash
/sc:changelog generate              # Since last release
/sc:changelog generate --since=v2.0.0
/sc:changelog preview               # Preview next release
/sc:changelog update CHANGELOG.md   # Update file
/sc:changelog release-notes v2.1.0  # Release notes
```

## Success Metrics

- 100% automated generation
- 95% time saved vs manual
- Semantic versioning compliance
- Professional release notes
