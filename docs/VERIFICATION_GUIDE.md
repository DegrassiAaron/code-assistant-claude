# Framework Verification Guide

Guida completa per verificare che tutte le funzionalità di **code-assistant-claude** siano attive e funzionanti correttamente.

## 🎯 Prerequisiti

Prima di iniziare, assicurati di avere:
- ✅ Node.js ≥18.0.0: `node --version`
- ✅ npm ≥9.0.0: `npm --version`
- ✅ Git installato: `git --version`
- ✅ Python 3.x (opzionale per test reali): `python --version`
- ✅ Docker (opzionale per test Docker): `docker --version`

## 📋 Checklist Verifica Completa

### 1. ✅ Build e Compilazione

```bash
# Pulisci build precedenti
rm -rf dist/

# Build produzione
npm run build

# Verifica output
ls dist/cli/index.js dist/core/index.js

# Typecheck
npm run typecheck
```

**Successo atteso:**
- ✅ Build completa senza errori
- ✅ File dist/cli/index.js e dist/core/index.js creati
- ✅ Nessun errore TypeScript

---

### 2. ✅ Test Suite

#### Test Veloci (Unit)
```bash
npm run test:fast
```

**Successo atteso:**
- ✅ ~190+ test passati
- ✅ Durata: 10-30 secondi
- ✅ Nessun errore

#### Test Integration (Mock-based)
```bash
npm run test:integration
```

**Successo atteso:**
- ✅ Test agent orchestrator passati
- ✅ Test workflow passati
- ✅ Test optimizers passati

#### Test Reali (con Python)
```bash
npm run test:real:python
```

**Successo atteso:**
- ✅ 16/16 test passati
- ✅ Python rilevato automaticamente
- ✅ Security env filtering funzionante
- ✅ Durata: ~6 secondi

#### Test Reali (con Docker - opzionale)
```bash
npm run test:real:docker
```

**Nota:** Richiede Docker daemon attivo

---

### 3. ✅ Linting e Formattazione

```bash
# Check linting
npm run lint

# Auto-fix linting
npm run lint:fix

# Check formattazione
npm run format:check

# Auto-format
npm run format
```

**Successo atteso:**
- ✅ Max 5 warning (no-explicit-any non bloccanti)
- ✅ Nessun errore critico
- ✅ Formattazione Prettier conforme

---

### 4. ✅ CLI Commands

#### Installazione Locale
```bash
# Build e linka localmente
npm run build
npm link

# Verifica comando disponibile
code-assistant-claude --version
```

**Successo atteso:**
- ✅ Output: `1.0.0`

#### Command: Init
```bash
# Crea progetto test
mkdir test-project
cd test-project
npm init -y

# Inizializza framework
code-assistant-claude init
```

**Interazioni attese:**
1. Prompt: Select project type → Scegli "Node.js"
2. Prompt: Git workflow → Scegli "GitFlow"
3. Prompt: Verbosity → Scegli "Balanced"

**Successo atteso:**
- ✅ File `.claude/config.json` creato
- ✅ Configurazione salvata correttamente
- ✅ Tech stack rilevato

#### Command: Validate
```bash
code-assistant-claude validate
```

**Successo atteso:**
- ✅ "Configuration is valid"
- ✅ Nessun errore di validazione

#### Command: Config
```bash
code-assistant-claude config
```

**Successo atteso:**
- ✅ Mostra configurazione JSON corretta
- ✅ Skills elencati
- ✅ MCP servers configurati

#### Command: MCP Add (opzionale)
```bash
code-assistant-claude mcp-add
```

**Interazioni attese:**
1. Prompt: MCP server type
2. Configurazione interattiva

---

### 5. ✅ Skills System

#### Verifica Skills Disponibili

Crea file `.claude/test-skills.md` nel test-project:

```markdown
Test Skills Loading

Let me verify the skills system is working.
```

Poi verifica che:
1. Skills metadata caricati (check logs)
2. Progressive loading funzionante
3. Token tracking attivo

**Validazione:**
```bash
# Check skills directory
ls templates/skills/

# Count skills
find templates/skills -name "SKILL.md" | wc -l
```

**Successo atteso:**
- ✅ 25+ skills disponibili
- ✅ Categorie: core, domain, superclaude, meta

---

### 6. ✅ Execution Engine

#### Verifica Code Generation

Test manuale in Node REPL:

```javascript
const { ExecutionOrchestrator } = require('./dist/core/index.js');
const path = require('path');

const templatesPath = path.join(process.cwd(), 'templates', 'mcp-tools');
const orchestrator = new ExecutionOrchestrator(templatesPath);

await orchestrator.initialize();
console.log('✅ Orchestrator initialized');

// Test discovery
// (disco very avviene durante initialize)

const result = await orchestrator.execute(
  'Calculate 2 + 2',
  'python',
  { timeout: 5000, sandboxType: 'process' }
);

console.log('Result:', result);
```

**Successo atteso:**
- ✅ Orchestrator inizializza senza errori
- ✅ Tool discovery funziona
- ✅ Code generation produce codice valido
- ✅ Execution ritorna risultato

---

### 7. ✅ Token Optimization

#### Test Budget Manager

```javascript
const { TokenTracker } = require('./dist/core/index.js');

const tracker = TokenTracker.getInstance();
const usage = tracker.getCurrentUsage();

console.log('Token Usage:', usage);
console.log('Reserved:', usage.reserved);
console.log('Available:', usage.available);
```

**Successo atteso:**
- ✅ Budget manager funzionante
- ✅ Token tracking attivo
- ✅ Limiti rispettati

#### Test Symbol System

```javascript
const { SymbolSystem } = require('./dist/core/index.js');

const symbols = SymbolSystem.getInstance();
const compressed = symbols.compress('The function returns true if successful');

console.log('Original:', 'The function returns true if successful'.length);
console.log('Compressed:', compressed.length);
console.log('Reduction:', ((1 - compressed.length / 49) * 100).toFixed(1) + '%');
```

**Successo atteso:**
- ✅ Compressione 30-50%
- ✅ Simboli applicati correttamente

---

### 8. ✅ Security Features

#### Test PII Tokenization

```javascript
const { PIITokenizer } = require('./dist/core/index.js');

const tokenizer = new PIITokenizer();
const text = 'My email is user@example.com and SSN is 123-45-6789';
const tokenized = tokenizer.tokenize(text);

console.log('Original:', text);
console.log('Tokenized:', tokenized.text);
console.log('Tokens:', tokenized.tokens);
```

**Successo atteso:**
- ✅ Email sostituita con `[EMAIL_1]`
- ✅ SSN sostituito con `[SSN_1]`
- ✅ Token mappatura salvata

#### Test Code Validation

```javascript
const { CodeValidator } = require('./dist/core/index.js');

const validator = new CodeValidator();

const maliciousCode = `
eval("dangerous code");
fs.unlinkSync("/etc/passwd");
`;

const result = validator.validate(maliciousCode, 'javascript');
console.log('Risk Score:', result.riskScore);
console.log('Blocked:', result.blocked);
console.log('Violations:', result.violations);
```

**Successo atteso:**
- ✅ Risk score >70
- ✅ Code bloccato
- ✅ Violations rilevate (eval, fs.unlinkSync)

---

### 9. ✅ Sandbox Execution (Real)

#### Test ProcessSandbox

```bash
npm run test:real:python
```

**Successo atteso:**
- ✅ Python runtime rilevato
- ✅ 16/16 test passati
- ✅ Env filtering funzionante
- ✅ Security isolation verificata

#### Test DockerSandbox (se Docker disponibile)

```bash
# Check Docker disponibile
docker ps

# Run test
npm run test:real:docker
```

**Successo atteso (se Docker disponibile):**
- ✅ Docker runtime rilevato
- ✅ Container creati e puliti
- ✅ Isolation verificata

---

### 10. ✅ Performance Benchmarks

```bash
# Token reduction benchmark
npm run benchmark:token-reduction

# Performance benchmarks
npm run benchmark:performance

# All benchmarks
npm run benchmark
```

**Successo atteso:**
- ✅ Token reduction ≥98%
- ✅ Code generation <50ms
- ✅ Sandbox startup <500ms

---

### 11. ✅ Git Workflow Integration

```bash
cd test-project

# Initialize git
git init
git add .
git commit -m "Initial commit"

# Test git workflow detection
code-assistant-claude validate
```

**Successo atteso:**
- ✅ Git workflow rilevato
- ✅ Branch naming conventions applicate
- ✅ Commit templates disponibili

---

### 12. ✅ Agents System

Verifica agents disponibili:

```bash
# Check agents directory
ls templates/agents/

# Count agents
find templates/agents -name "AGENT.md" -o -name "*-agent.md" | wc -l
```

**Successo atteso:**
- ✅ 8+ agents disponibili
- ✅ business-panel con 9 esperti
- ✅ Multi-agent coordination pronta

---

### 13. ✅ Commands System

Verifica commands disponibili:

```bash
# Check commands directory
ls templates/commands/

# Count commands
find templates/commands -name "*.md" | wc -l
```

**Successo atteso:**
- ✅ 20+ comandi disponibili
- ✅ Categorie: agile, git, optimization, superclaude, workflow

---

### 14. ✅ MCP Integration

#### Verifica Template MCP Tools

```bash
# Check MCP tools templates
ls templates/mcp-tools/

# Verify structure
cat templates/mcp-tools/core/example-tools.json
```

**Successo atteso:**
- ✅ Templates MCP disponibili
- ✅ JSON schemas validi

---

### 15. ✅ Audit & Compliance

#### Test Audit Logging

```javascript
const { AuditLogger } = require('./dist/core/index.js');

const logger = new AuditLogger();

await logger.logDiscovery('Tool discovered', { toolName: 'calculator' });
await logger.logExecution('workspace-123', 'print(2+2)', { result: 4 });
await logger.logSecurity('Validation passed', { riskScore: 10 });

console.log('✅ Audit logging functional');
```

**Successo atteso:**
- ✅ Logs scritti senza errori
- ✅ Metadata correttamente salvati

---

### 16. ✅ Dependency Security

```bash
# Security audit
npm run audit

# Production audit only
npm run audit:production

# Check outdated deps
npm run check:deps

# License compliance
npm run check:licenses
```

**Successo atteso:**
- ✅ Nessuna vulnerabilità critica
- ✅ Dependencies aggiornate
- ✅ License compliance OK (MIT)

---

### 17. ✅ End-to-End Workflow Test

**Scenario completo:**

```bash
# 1. Crea nuovo progetto
mkdir e2e-test-project
cd e2e-test-project
npm init -y

# 2. Inizializza framework
code-assistant-claude init
# Seleziona: Node.js, GitFlow, Balanced

# 3. Valida configurazione
code-assistant-claude validate

# 4. Genera documentazione
echo "# Test Project" > README.md

# 5. Init git
git init
git add .
git commit -m "Initial setup"

# 6. Crea feature branch
git checkout -b feature/test-feature

# 7. Modifica codice
echo "console.log('test');" > index.js

# 8. Commit
git add .
git commit -m "Add test code"

# 9. Verifica stato
git status
git log --oneline
```

**Successo atteso:**
- ✅ Framework inizializzato
- ✅ Git workflow funzionante
- ✅ Branch naming corretto
- ✅ Commits con template applicato

---

## 🧪 Quick Smoke Test

Script rapido per verificare funzionalità core:

```bash
#!/bin/bash

echo "🔍 Code Assistant Claude - Smoke Test"
echo "======================================"

echo ""
echo "1️⃣ Build..."
npm run build > /dev/null 2>&1 && echo "✅ Build OK" || echo "❌ Build FAILED"

echo ""
echo "2️⃣ Type Check..."
npm run typecheck > /dev/null 2>&1 && echo "✅ TypeCheck OK" || echo "❌ TypeCheck FAILED"

echo ""
echo "3️⃣ Linting..."
npm run lint > /dev/null 2>&1 && echo "✅ Lint OK (or warnings only)" || echo "⚠️ Lint issues"

echo ""
echo "4️⃣ Fast Tests..."
timeout 45 npm run test:fast > /dev/null 2>&1 && echo "✅ Tests OK" || echo "❌ Tests FAILED"

echo ""
echo "5️⃣ Security Audit..."
npm run audit:production > /dev/null 2>&1 && echo "✅ Audit OK" || echo "⚠️ Vulnerabilities found"

echo ""
echo "6️⃣ CLI Availability..."
npm list -g code-assistant-claude > /dev/null 2>&1 && echo "✅ CLI installed" || echo "⚠️ CLI not linked (run: npm link)"

echo ""
echo "======================================"
echo "✅ Smoke test complete!"
```

Salva come `scripts/smoke-test.sh` ed esegui:

```bash
chmod +x scripts/smoke-test.sh
./scripts/smoke-test.sh
```

---

## 🔬 Verifica Approfondita per Componente

### A. Skills System

**1. Verifica Metadata Loading:**
```javascript
const { SkillLoader } = require('./dist/core/index.js');

const loader = new SkillLoader('./templates/skills');
await loader.initialize();

const skills = loader.getAllSkills();
console.log('Skills loaded:', skills.length);
console.log('Token cost (metadata only):', skills.reduce((sum, s) => sum + (s.tokenCost?.metadata || 0), 0));
```

**2. Verifica Progressive Loading:**
```javascript
const skill = await loader.loadSkill('code-reviewer');
console.log('Skill activated:', skill.name);
console.log('Full content loaded:', skill.fullContent !== undefined);
```

**3. Verifica Categories:**
```javascript
const byCategory = loader.getSkillsByCategory('core');
console.log('Core skills:', byCategory.map(s => s.name));
```

---

### B. Execution Engine

**1. Tool Discovery:**
```javascript
const { ToolIndexer } = require('./dist/core/index.js');

const indexer = new ToolIndexer();
const tools = await indexer.indexDirectory('./templates/mcp-tools');

console.log('Tools discovered:', tools.length);
tools.forEach(t => console.log(`- ${t.name}: ${t.description}`));
```

**2. Code Generation:**
```javascript
const { CodeGenerator } = require('./dist/core/index.js');

const generator = new CodeGenerator();
const toolSchema = {
  name: 'calculator',
  parameters: {
    operation: { type: 'string' },
    a: { type: 'number' },
    b: { type: 'number' }
  }
};

const code = generator.generateFromSchema(toolSchema, 'typescript');
console.log('Generated code:', code);
```

**3. Security Validation:**
```javascript
const { CodeValidator } = require('./dist/core/index.js');

const validator = new CodeValidator();
const testCases = [
  { code: 'print(2+2)', expected: 'safe' },
  { code: 'eval("malicious")', expected: 'blocked' },
  { code: 'import os; os.system("rm -rf /")', expected: 'blocked' }
];

testCases.forEach(({ code, expected }) => {
  const result = validator.validate(code, 'python');
  console.log(`${code.substring(0, 30)}... → ${result.blocked ? 'BLOCKED' : 'ALLOWED'} (expected: ${expected})`);
});
```

---

### C. Optimizers

**1. Budget Manager:**
```javascript
const { BudgetManager } = require('./dist/core/index.js');

const budget = new BudgetManager(200000);
console.log('Total budget:', budget.getTotalBudget());
console.log('Allocations:', budget.getAllocations());

budget.trackUsage('skills', 1000);
budget.trackUsage('conversation', 5000);

console.log('Current usage:', budget.getCurrentUsage());
console.log('Available:', budget.getAvailableBudget());
```

**2. Symbol System:**
```javascript
const { SymbolSystem } = require('./dist/core/index.js');

const symbols = SymbolSystem.getInstance();

const testTexts = [
  'The function returns true if the condition is met',
  'This will cause an error because the variable is undefined',
  'Performance optimization reduces token usage by 50%'
];

testTexts.forEach(text => {
  const compressed = symbols.compress(text);
  const reduction = ((1 - compressed.length / text.length) * 100).toFixed(1);
  console.log(`Reduction: ${reduction}% → "${compressed}"`);
});
```

**3. Abbreviation Engine:**
```javascript
const { AbbreviationEngine } = require('./dist/core/index.js');

const engine = new AbbreviationEngine();

const terms = ['configuration', 'implementation', 'performance', 'architecture'];
terms.forEach(term => {
  const abbr = engine.abbreviate(term);
  console.log(`${term} → ${abbr}`);
});
```

---

### D. Analyzers

**1. Tech Stack Detection:**
```bash
cd test-project
echo '{"dependencies": {"react": "^18.0.0", "typescript": "^5.0.0"}}' > package.json

node -e "
const { TechStackDetector } = require('../dist/core/index.js');
const detector = new TechStackDetector();
detector.analyze('.').then(stack => {
  console.log('Detected:', stack);
});
"
```

**2. Git Workflow Detection:**
```bash
git init
git checkout -b develop
git checkout -b feature/test

node -e "
const { GitWorkflowAnalyzer } = require('../dist/core/index.js');
const analyzer = new GitWorkflowAnalyzer();
analyzer.analyze('.').then(workflow => {
  console.log('Workflow type:', workflow.type);
  console.log('Branches:', workflow.branches);
});
"
```

**3. Monorepo Detection:**
```bash
mkdir packages packages/app packages/lib
echo '{"workspaces": ["packages/*"]}' > package.json

node -e "
const { MonorepoDetector } = require('../dist/core/index.js');
const detector = new MonorepoDetector();
detector.detect('.').then(result => {
  console.log('Is monorepo:', result.isMonorepo);
  console.log('Packages:', result.packages);
});
"
```

---

## ✅ Checklist Finale

Marca ogni item quando verificato:

### Core Functionality
- [ ] Build completa senza errori
- [ ] TypeCheck passa
- [ ] Linting OK (max 5 warnings)
- [ ] Test fast passa (190+ test)
- [ ] Test real Python passa (16 test)

### CLI Commands
- [ ] `code-assistant-claude --version` funziona
- [ ] `init` command configura progetto
- [ ] `validate` verifica configurazione
- [ ] `config` mostra settings
- [ ] `mcp-add` aggiunge MCP servers

### Systems
- [ ] Skills loader funziona (25+ skills)
- [ ] Progressive loading attivo
- [ ] Token tracker operativo
- [ ] Execution orchestrator inizializza
- [ ] Code generator produce codice

### Security
- [ ] PII tokenizer rileva e sostituisce
- [ ] Code validator blocca codice pericoloso
- [ ] Env filtering funziona
- [ ] Sandbox isolation verificata
- [ ] Audit logging attivo

### Optimization
- [ ] Token budget manager funziona
- [ ] Symbol compression 30-50%
- [ ] Abbreviation engine attivo
- [ ] Cache manager funzionante

### Integration
- [ ] MCP tools discovery funziona
- [ ] Git workflow detection corretta
- [ ] Tech stack analyzer preciso
- [ ] Monorepo detection funzionante

---

## 🚨 Troubleshooting

### Build Fallisce
```bash
# Pulisci e riprova
rm -rf dist/ node_modules/
npm install
npm run build
```

### Test Timeout
```bash
# Usa test fast per sviluppo
npm run test:fast

# Test completi solo per pre-release
npm test
```

### Python Non Trovato
```bash
# Installa Python 3.x
# Windows: https://python.org
# Linux: sudo apt install python3
# macOS: brew install python3

# Verifica PATH
python --version
python3 --version
```

### Docker Non Disponibile
```bash
# Installa Docker
# https://docs.docker.com/get-docker/

# Start daemon
sudo systemctl start docker  # Linux
# o apri Docker Desktop (Windows/macOS)

# Verifica
docker ps
```

### CLI Non Trovato
```bash
# Link globalmente
npm link

# Oppure installa da npm
npm install -g code-assistant-claude
```

---

## 📊 Success Criteria

Il framework è **completamente funzionante** quando:

✅ **Build & Quality**
- Build completa <10s
- Zero errori TypeScript
- Max 5 warning non bloccanti
- Test fast <30s

✅ **Execution**
- ProcessSandbox esegue Python
- DockerSandbox funziona (se Docker disponibile)
- Orchestrator genera e esegue codice
- Token reduction ≥98%

✅ **Security**
- PII tokenization attiva
- Code validation blocca malicious code
- Env filtering funzionante
- Audit logs creati

✅ **Integration**
- CLI commands operativi
- Skills system carica correttamente
- Git workflow detection accurata
- MCP tools discovery funzionante

---

## 🎯 Next Steps dopo Verifica

1. **Development:**
   ```bash
   npm run dev          # Watch mode
   npm run test:watch   # Auto-run tests
   ```

2. **Publishing:**
   ```bash
   npm run prepublishOnly  # Pre-publish validation
   npm publish             # Publish to npm
   ```

3. **CI/CD:**
   - Configure GitHub Actions con test reali
   - Setup coverage reporting
   - Automated release workflow

4. **Documentation:**
   - API reference generation
   - User guides update
   - Example projects

---

## 📝 Report Template

Usa questo template per documentare la verifica:

```markdown
# Verification Report - [DATE]

## Environment
- Node.js: [version]
- Python: [version]
- Docker: [available/not available]
- OS: [platform]

## Results

### Build & Quality
- Build: ✅/❌
- TypeCheck: ✅/❌
- Linting: ✅/❌
- Tests: [passed]/[total]

### Execution
- ProcessSandbox: ✅/❌
- DockerSandbox: ✅/❌/⏭️ (skipped)
- Orchestrator: ✅/❌
- Token Reduction: [%]

### Security
- PII Tokenization: ✅/❌
- Code Validation: ✅/❌
- Env Filtering: ✅/❌
- Audit Logging: ✅/❌

### Integration
- CLI Commands: ✅/❌
- Skills System: ✅/❌
- Git Detection: ✅/❌
- MCP Discovery: ✅/❌

## Issues Found
[List any issues]

## Recommendations
[Any improvement suggestions]

## Conclusion
✅ Framework fully operational
❌ Issues require attention
```

---

**Tempo totale verifica completa:** ~30-45 minuti
**Quick smoke test:** ~5 minuti
