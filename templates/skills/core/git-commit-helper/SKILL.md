---
name: "git-commit-helper"
version: "1.0.0"
description: "Generates conventional commit messages following best practices"
author: "Code-Assistant-Claude"
category: "core"

triggers:
  keywords: ["commit", "commit message", "git commit"]
  patterns: ["commit.*changes"]
  commands: ["/sc:commit"]
  events: ["pre_commit"]

tokenCost:
  metadata: 35
  fullContent: 1200
  resources: 300

dependencies:
  skills: []
  mcps: ["serena"]

composability:
  compatibleWith: []
  conflictsWith: []

context:
  projectTypes: ["javascript", "typescript", "python", "java", "go", "rust"]
  minNodeVersion: "18.0.0"
  requiredTools: ["git"]

priority: "medium"
autoActivate: true
cacheStrategy: "minimal"
---

# Git Commit Helper

Generates semantic, conventional commit messages automatically.

## Conventional Commits Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

## Commit Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, missing semicolons, etc.)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **build**: Changes to build system or dependencies
- **ci**: CI/CD changes
- **chore**: Other changes that don't modify src or test files

## Examples

```
feat(auth): add OAuth2 authentication support

Implement OAuth2 flow for Google and GitHub providers.
Includes token refresh and secure storage.

Closes #123
```

```
fix(api): handle null response in user endpoint

Add null check to prevent TypeError when API returns
empty response. Includes additional error logging.
```

## Configuration

Analyzes:
- Staged changes
- Modified files
- Recent commit history
- Project conventions

Generates appropriate commit message following team's established patterns.
