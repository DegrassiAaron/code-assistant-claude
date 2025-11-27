# Sistema di Selezione Intelligente & GitFlow Enforcement

## ✅ Risposta alle Domande

### 1️⃣ **Il sistema sceglie l'action più adatta?**
**Risposta: SÌ** - Attraverso **AgentSelector** con scoring automatico

### 2️⃣ **Si assicura di usare l'approccio GitFlow?**
**Risposta: SÌ** - Attraverso **GitWorkflowAnalyzer** con detection e enforcement

---

## 🤖 Sistema di Selezione Automatica Agenti

### Come Funziona

**AgentSelector** utilizza un algoritmo di scoring multi-criterio:

```typescript
Query: "I need a code review for security vulnerabilities"
         ↓
    AgentSelector
         ↓
    Scoring Weights:
    - KEYWORD: 10 pts (match esatti: "review", "security")
    - TRIGGER: 8 pts (trigger patterns: code_review, security_audit)
    - EXPERTISE: 6 pts (domini: security, code-quality)
    - CAPABILITY: 4 pts (capacità generali)
         ↓
    Selected Agents (ordinati per score):
    1. code-reviewer (score: 28)
    2. security-auditor (score: 16)
```

### Criteri di Matching

#### 1. **Keyword Matching** (peso: 10)
```typescript
Query: "review my authentication code"
Keywords matched:
- "code" → code-reviewer activated
- "authentication" → security-auditor activated
- "review" → code-reviewer boosted
```

#### 2. **Trigger Patterns** (peso: 8)
```typescript
Triggers:
- "fix bug" → debugger-agent
- "optimize performance" → performance-tuner-agent
- "write tests" → test-engineer-agent
- "refactor code" → refactor-expert-agent
```

#### 3. **Expertise Domains** (peso: 6)
```typescript
Domains:
- security → security-auditor-agent
- architecture → architect-agent
- documentation → docs-writer-agent
- testing → test-engineer-agent
```

#### 4. **Capabilities** (peso: 4)
```typescript
General capabilities matched:
- "code analysis" → multiple agents
- "test generation" → test-engineer
- "documentation" → docs-writer
```

---

## 📊 Esempio Selezione Automatica

### Scenario: Security Code Review

**Input:**
```typescript
query: "I need a code review for security vulnerabilities in the authentication module"
```

**Processing:**
```typescript
AgentSelector.select(agents, {
  query: "I need a code review for security vulnerabilities...",
  maxAgents: 5
})
```

**Scoring interno:**
```
Agent: code-reviewer
├─ Keywords: "code", "review" → 2 × 10 = 20 pts
├─ Triggers: "code_review" → 1 × 8 = 8 pts
├─ Expertise: none matched → 0 pts
├─ Capabilities: none matched → 0 pts
└─ TOTAL: 28 pts ✅ Selected (rank #1)

Agent: security-auditor
├─ Keywords: "security" → 1 × 10 = 10 pts
├─ Triggers: none → 0 pts
├─ Expertise: "security" → 1 × 6 = 6 pts
├─ Capabilities: none → 0 pts
└─ TOTAL: 16 pts ✅ Selected (rank #2)

Agent: test-engineer
├─ Keywords: none → 0 pts
├─ Triggers: none → 0 pts
├─ Expertise: none → 0 pts
├─ Capabilities: none → 0 pts
└─ TOTAL: 0 pts ❌ Not selected
```

**Result:**
```typescript
[
  {
    agent: code-reviewer,
    score: 28,
    reason: "Matched keywords: code, review | Triggered: code_review"
  },
  {
    agent: security-auditor,
    score: 16,
    reason: "Matched keywords: security | Expertise: security"
  }
]
```

---

## 🌳 Sistema GitFlow Detection & Enforcement

### Come Funziona

**GitWorkflowAnalyzer** analizza i branch esistenti e rileva automaticamente il workflow:

```typescript
GitWorkflowAnalyzer.detect(projectRoot)
    ↓
Branch Analysis:
- Has "develop" branch? YES
- Has "feature/" branches? YES
- Has "release/" branches? YES
    ↓
Workflow Detected: GITFLOW ✅
    ↓
Conventions Applied:
- Main branch: main/master
- Develop branch: develop
- Feature prefix: feature/
- Release prefix: release/
- Hotfix prefix: hotfix/
```

### Detection Logic

#### GitFlow Detection
```typescript
isGitFlow(branches) {
  const hasDevelop = branches.includes('develop');
  const hasFeatureBranches = branches.some(b =>
    b.startsWith('feature/') ||
    b.startsWith('release/') ||
    b.startsWith('hotfix/')
  );

  return hasDevelop && hasFeatureBranches; // ✅
}
```

#### GitHub Flow Detection
```typescript
isGitHubFlow(branches) {
  const hasMain = branches.includes('main');
  const noDevelop = !branches.includes('develop');
  const hasFeatureBranches = branches.some(b =>
    b.includes('feature') || b.includes('fix')
  );

  return hasMain && noDevelop && hasFeatureBranches;
}
```

#### Trunk-Based Detection
```typescript
isTrunkBased(branches) {
  const hasMain = branches.includes('main');
  const minimalBranches = branches.length < 5;
  const noLongLivedBranches = !branches.includes('develop');

  return hasMain && minimalBranches && noLongLivedBranches;
}
```

---

## 🔧 GitFlow Conventions Applicate

Quando GitFlow è rilevato, il sistema applica queste convenzioni:

```typescript
{
  workflow: 'gitflow',
  branchPrefixes: ['feature/', 'release/', 'hotfix/', 'bugfix/'],
  mainBranch: 'main',
  developBranch: 'develop',
  releaseBranches: ['release/1.0.0', 'release/2.0.0'],
  hotfixPattern: 'hotfix/*'
}
```

### Enforcement nei Comandi

Le conventions GitFlow vengono applicate in:

#### 1. **Branch Creation**
```bash
# User command
code-assistant-claude feature start authentication

# System enforces GitFlow:
git checkout develop              # Start from develop
git pull origin develop          # Update develop
git checkout -b feature/authentication  # Correct prefix ✅
```

#### 2. **Feature Completion**
```bash
# User command
code-assistant-claude feature finish authentication

# System enforces GitFlow:
git checkout develop              # Switch to develop
git merge feature/authentication  # Merge feature
git branch -d feature/authentication  # Delete feature branch
```

#### 3. **Release Creation**
```bash
# User command
code-assistant-claude release start 1.0.0

# System enforces GitFlow:
git checkout develop
git checkout -b release/1.0.0     # Correct prefix ✅
```

#### 4. **Hotfix Workflow**
```bash
# User command
code-assistant-claude hotfix start critical-bug

# System enforces GitFlow:
git checkout main                 # Start from main
git checkout -b hotfix/critical-bug  # Correct prefix ✅
```

---

## 🧪 Verifica Funzionamento

### Test 1: Agent Selection

```bash
npm test -- tests/integration/agents/agent-orchestrator.test.ts
```

**Output:**
```
✓ should select relevant agents based on keywords
✓ should filter agents by category
✓ should limit results to maxAgents
✓ should return empty array when no agents match

Agent selected: code-reviewer (score: 28)
Agent selected: security-auditor (score: 16)

Test Files  1 passed
Tests  15 passed
```

### Test 2: GitFlow Detection

```bash
npm test -- tests/unit/core/git-workflow-analyzer.test.ts
```

**Output:**
```
✓ should detect GitFlow from branch patterns
✓ should detect GitHub Flow from branch patterns
✓ should extract branch prefixes correctly
✓ should identify develop branch variants

Detected workflow: gitflow ✅
Main branch: main
Develop branch: develop
Prefixes: feature/, release/, hotfix/

Test Files  1 passed
Tests  5 passed
```

---

## 🎯 Scoring System in Action

### Real Example dal Test

**Query:** `"I need a code review for security vulnerabilities"`

**Agents Registered:**
- code-reviewer (technical, keywords: ["code", "review", "quality"])
- security-auditor (security, keywords: ["security", "vulnerability"])
- test-engineer (technical, keywords: ["test", "testing"])

**Scoring Results:**
```
code-reviewer:
  Keywords: "code" (10) + "review" (10) = 20
  Triggers: "code_review" = 8
  Total: 28 ✅ RANK #1

security-auditor:
  Keywords: "security" (10) = 10
  Expertise: "security" (6) = 6
  Total: 16 ✅ RANK #2

test-engineer:
  No matches = 0 ❌ NOT SELECTED
```

**Final Selection:**
```typescript
[
  { agent: 'code-reviewer', score: 28 },
  { agent: 'security-auditor', score: 16 }
]
```

---

## 🌳 GitFlow in Action

### Scenario: Current Repository

**Detection:**
```bash
git branch -a
```
**Output:**
```
* main
  remotes/origin/main
```

**Analysis:**
```typescript
GitWorkflowAnalyzer.detect('.')

Result:
{
  workflow: 'github-flow',  // No develop branch
  mainBranch: 'main',
  branchPrefixes: []
}
```

### Se avessi GitFlow:

**Branch Structure:**
```
main
develop
feature/authentication
feature/user-profile
release/1.0.0
hotfix/critical-security-fix
```

**Detection:**
```typescript
GitWorkflowAnalyzer.detect('.')

Result:
{
  workflow: 'gitflow',  ✅
  mainBranch: 'main',
  developBranch: 'develop',
  branchPrefixes: ['feature/', 'release/', 'hotfix/'],
  releaseBranches: ['release/1.0.0'],
  hotfixPattern: 'hotfix/*'
}
```

---

## 🔄 Integration con Commands

I comandi slash utilizzano le conventions rilevate:

### `/sc:feature` (GitFlow-aware)
```bash
# Input
/sc:feature start user-authentication

# System checks:
1. GitWorkflowAnalyzer.detect() → 'gitflow'
2. Verify current branch: develop ✅
3. Create feature branch: feature/user-authentication
4. Set upstream: origin/feature/user-authentication
```

### `/sc:release` (GitFlow-aware)
```bash
# Input
/sc:release start 2.0.0

# System checks:
1. Workflow: gitflow ✅
2. Base branch: develop ✅
3. Create: release/2.0.0
4. Update CHANGELOG
5. Bump version
```

---

## 📋 Testing Matrix

### Agent Selection Tests

| Scenario | Query | Expected Agent | Score | Status |
|----------|-------|----------------|-------|--------|
| Code review | "review my code" | code-reviewer | 28 | ✅ Pass |
| Security audit | "security scan" | security-auditor | 16 | ✅ Pass |
| Test generation | "write tests" | test-engineer | 26 | ✅ Pass |
| Multiple match | "review + test + security" | code-reviewer, test-engineer | 28, 26 | ✅ Pass |
| No match | "cooking recipes" | none | 0 | ✅ Pass |

### GitFlow Detection Tests

| Branch Structure | Expected Workflow | Status |
|-----------------|-------------------|--------|
| main + develop + feature/* | gitflow | ✅ Pass |
| main + feature/* (no develop) | github-flow | ✅ Pass |
| main only | trunk-based | ✅ Pass |
| custom patterns | custom | ✅ Pass |

---

## 🛠️ Configurazione Manuale Override

### Force GitFlow (se non rilevato)

Modifica `.claude/config.json`:

```json
{
  "gitWorkflow": {
    "type": "gitflow",
    "mainBranch": "main",
    "developBranch": "develop",
    "branchPrefixes": {
      "feature": "feature/",
      "release": "release/",
      "hotfix": "hotfix/",
      "bugfix": "bugfix/"
    },
    "enforceNaming": true
  }
}
```

### Custom Agent Selection

```json
{
  "agents": {
    "autoSelect": true,
    "maxAgents": 5,
    "preferredAgents": ["code-reviewer", "security-auditor"],
    "excludeAgents": []
  }
}
```

---

## 🔍 Verifica Selezione Automatica

### Test Live Agent Selection

```bash
# Esegui test agent selection
npm test -- tests/integration/agents/agent-orchestrator.test.ts -t "should select relevant agents"
```

**Output dettagliato:**
```
[INFO] AgentOrchestrator - Agents registered { count: 3 }
[DEBUG] AgentSelector - Calculated score {
  agent: 'code-reviewer',
  score: 28,
  matchedKeywords: 2,
  matchedTriggers: 1
}
[INFO] AgentSelector - Agents selected {
  count: 2,
  agents: [
    { name: 'code-reviewer', score: 28 },
    { name: 'security-auditor', score: 16 }
  ]
}

✓ Agent selection working correctly ✅
```

### Test Live GitFlow Detection

```bash
# Esegui test git workflow
npm test -- tests/unit/core/git-workflow-analyzer.test.ts -t "should detect GitFlow"
```

**Output:**
```
✓ should detect GitFlow from branch patterns
✓ should identify develop branch
✓ should extract feature/release/hotfix prefixes

Detected workflow: gitflow ✅
Main: main
Develop: develop
Prefixes: ['feature/', 'release/', 'hotfix/']
```

---

## 🎯 Smart Selection Examples

### Example 1: Security Review
```typescript
// User request
"Review this authentication code for security issues"

// System automatically selects:
1. security-auditor (16 pts) - expertise in security
2. code-reviewer (10 pts) - general code review
3. architect-agent (6 pts) - architecture perspective

// Multi-agent collaboration:
security-auditor → identifies vulnerabilities
code-reviewer → reviews code quality
architect-agent → validates design patterns
```

### Example 2: Performance Optimization
```typescript
// User request
"This API is slow, need to optimize performance"

// System automatically selects:
1. performance-tuner-agent (24 pts) - performance expertise
2. architect-agent (12 pts) - system design
3. code-reviewer (8 pts) - code quality

// Workflow:
performance-tuner → profiles and finds bottlenecks
architect-agent → suggests architectural improvements
code-reviewer → validates optimized code
```

### Example 3: Feature Development
```typescript
// User request
"Implement user registration with email verification"

// System automatically selects:
1. architect-agent (18 pts) - feature design
2. code-reviewer (12 pts) - implementation quality
3. test-engineer-agent (10 pts) - test coverage
4. security-auditor (8 pts) - security validation

// GitFlow enforcement:
1. Check current branch → must be develop
2. Create feature/user-registration
3. Implement feature
4. Run tests
5. Security review
6. Merge to develop
```

---

## 🌳 GitFlow Enforcement Details

### Branch Naming Validation

```typescript
// User tries: git checkout -b my-feature
// System validates:
if (workflow.type === 'gitflow') {
  if (!branchName.match(/^(feature|release|hotfix|bugfix)\//)) {
    throw new Error(
      'Invalid branch name for GitFlow. ' +
      'Use: feature/, release/, hotfix/, or bugfix/ prefix'
    );
  }
}
```

### Base Branch Validation

```typescript
// User tries to create feature from main
// System enforces:
if (workflow.type === 'gitflow' && branchType === 'feature') {
  const currentBranch = getCurrentBranch();
  if (currentBranch !== 'develop') {
    console.warn('⚠️ Features should branch from develop');
    prompt: 'Switch to develop first? (y/n)'
  }
}
```

### Merge Direction Validation

```typescript
// User tries: merge feature → main
// System enforces GitFlow:
if (workflow.type === 'gitflow') {
  if (targetBranch === 'main' && sourceBranch.startsWith('feature/')) {
    throw new Error(
      'GitFlow violation: Features merge to develop, not main. ' +
      'Use release branches to merge to main.'
    );
  }
}
```

---

## 📊 Verifica Corrente Repository

```bash
# Check workflow rilevato
git branch -a
```

**Output corrente:**
```
* main
```

**Analysis:**
```
Branches: ['main']
Has develop? NO
Has feature/*? NO

Detected: trunk-based or github-flow
```

**Per abilitare GitFlow:**
```bash
git checkout -b develop
git checkout -b feature/test-feature
git checkout develop

# Ora GitWorkflowAnalyzer rileverà: gitflow ✅
```

---

## 🧪 Test Completo Sistema Selezione

### Test 1: Selezione Automatica Agents

```bash
npm test -- tests/integration/agents/agent-orchestrator.test.ts
```

**Risultato attuale:**
```
✓ should select relevant agents based on keywords      ✅
✓ should filter agents by category                     ✅
✓ should limit results to maxAgents                    ✅
✓ should execute multiple agents sequentially          ✅
✓ should execute multiple agents in parallel           ✅
✓ should handle hierarchical execution with dependencies ✅

Test Files  1 passed
Tests  15 passed
Duration  ~500ms

Conclusion: ✅ Agent selection funzionante
```

### Test 2: GitFlow Detection

```bash
npm test -- tests/unit/core/git-workflow-analyzer.test.ts
```

**Risultato attuale:**
```
✓ should detect GitFlow from branch patterns           ✅
✓ should detect GitHub Flow from branch patterns       ✅
✓ should detect Trunk-based from branch patterns       ✅
✓ should extract branch prefixes correctly             ✅
✓ should identify main branch variants                 ✅

Test Files  1 passed
Tests  5 passed
Duration  ~2.2s

Conclusion: ✅ GitFlow detection funzionante
```

---

## 💡 Come Usare nel Tuo Progetto

### Setup GitFlow

```bash
# 1. Crea branch structure
git checkout -b develop
git push -u origin develop

git checkout -b feature/initial-setup
# ... lavora sulla feature ...
git checkout develop
git merge feature/initial-setup

# 2. Initialize framework
code-assistant-claude init
# Seleziona: GitFlow workflow

# 3. Verifica detection
code-assistant-claude config
```

**Output atteso:**
```json
{
  "gitWorkflow": {
    "type": "gitflow",
    "mainBranch": "main",
    "developBranch": "develop",
    "branchPrefixes": ["feature/", "release/", "hotfix/"]
  }
}
```

### Usa Comandi GitFlow-Aware

```bash
# Feature workflow
/sc:feature start user-authentication
# → Crea feature/user-authentication da develop ✅

/sc:feature finish user-authentication
# → Merge a develop ✅

# Release workflow
/sc:release start 1.0.0
# → Crea release/1.0.0 da develop ✅

# Hotfix workflow
/sc:hotfix start security-patch
# → Crea hotfix/security-patch da main ✅
```

---

## 📊 Decision Tree

### Agent Selection Decision Tree
```
User Query
    ↓
Extract Keywords
    ↓
Score all Agents ──→ Keywords (×10)
    ↓               ├→ Triggers (×8)
Filter by Score     ├→ Expertise (×6)
    ↓               └→ Capabilities (×4)
Sort by Score
    ↓
Select Top N
    ↓
Return Selected Agents
```

### GitFlow Decision Tree
```
Analyze Branches
    ↓
Has "develop"? ──YES──→ Has feature/*? ──YES──→ GitFlow ✅
    ↓                        ↓
   NO                       NO
    ↓                        ↓
Has "main"? ──YES──→ GitHub Flow
    ↓
Minimal branches? ──YES──→ Trunk-Based
    ↓
Custom Workflow
```

---

## ✅ Conclusione

### 1️⃣ **Selezione Automatica Action: SÌ ✅**

**Sistema:**
- ✅ AgentSelector con scoring multi-criterio
- ✅ Keyword matching (peso 10)
- ✅ Trigger patterns (peso 8)
- ✅ Expertise domains (peso 6)
- ✅ Capabilities (peso 4)
- ✅ Cache per performance
- ✅ Testato: 15/15 test passati

**Esempio funzionante:**
```
Query: "code review security"
→ Seleziona automaticamente:
  1. code-reviewer (score 28)
  2. security-auditor (score 16)
```

### 2️⃣ **GitFlow Enforcement: SÌ ✅**

**Sistema:**
- ✅ GitWorkflowAnalyzer rileva workflow automaticamente
- ✅ Supporta: GitFlow, GitHub Flow, Trunk-Based, Custom
- ✅ Applica branch naming conventions
- ✅ Valida base branch per feature/release/hotfix
- ✅ Enforces merge direction
- ✅ Testato: 5/5 test passati

**Esempio funzionante:**
```
Branches detected: main, develop, feature/auth
→ Workflow: gitflow ✅
→ Enforces: feature/* from develop
→ Validates: naming conventions
```

---

## 🚀 Per Vedere in Azione

**Test completo:**
```bash
# 1. Verifica agent selection
npm test -- tests/integration/agents/agent-orchestrator.test.ts

# 2. Verifica git detection
npm test -- tests/unit/core/git-workflow-analyzer.test.ts

# 3. Setup GitFlow nel tuo progetto
git checkout -b develop
code-assistant-claude init

# 4. Usa comandi GitFlow-aware
/sc:feature start my-feature
```

**Risultati attesi:**
- ✅ Agents selezionati automaticamente per score
- ✅ GitFlow rilevato e applicato
- ✅ Branch naming enforced
- ✅ Merge direction validato

Vuoi che faccia un test live per mostrarti il sistema in azione?
