# Quick Start - Test Your Framework

Guida rapida per verificare che il framework funzioni correttamente.

## 🚀 Setup Iniziale (5 minuti)

### 1. Build del Progetto
```bash
npm run build
```
**Atteso:** Build completa in ~5-10s senza errori

### 2. Smoke Test Automatico
```bash
# Rendi eseguibile lo script
chmod +x scripts/smoke-test.sh

# Esegui smoke test
./scripts/smoke-test.sh
```

**Atteso:** Tutti i check ✅ verdi (o ⚠️ gialli per opzionali)

---

## 🎯 Test Funzionalità Core (10 minuti)

### Test 1: CLI Installation
```bash
npm link
code-assistant-claude --version
```
**Atteso:** Output `1.0.0`

### Test 2: Project Init
```bash
mkdir ../test-framework
cd ../test-framework
npm init -y

code-assistant-claude init
```

**Interazione:**
1. Tipo progetto → Seleziona `Node.js`
2. Git workflow → Seleziona `GitFlow`
3. Verbosity → Seleziona `Balanced`

**Atteso:**
- File `.claude/config.json` creato
- Configurazione salvata

### Test 3: Validation
```bash
code-assistant-claude validate
```
**Atteso:** "Configuration is valid ✅"

### Test 4: Test Rapidi
```bash
cd ../code-assistant-claude
npm run test:fast
```
**Atteso:** 190+ test passati in 10-30s

### Test 5: Test Python Reali
```bash
npm run test:real:python
```
**Atteso:** 16/16 test passati in ~6s

---

## 🔬 Test Avanzati (20 minuti)

### Execution Engine Test

Crea file `test-execution.js`:

```javascript
const { ExecutionOrchestrator } = require('./dist/core/index.js');
const path = require('path');

async function test() {
  console.log('🔧 Testing Execution Engine...\n');

  // 1. Initialize
  const templatesPath = path.join(process.cwd(), 'templates', 'mcp-tools');
  const orchestrator = new ExecutionOrchestrator(templatesPath);

  await orchestrator.initialize();
  console.log('✅ Orchestrator initialized\n');

  // 2. Test Python execution
  console.log('Testing Python execution...');
  const pythonResult = await orchestrator.execute(
    'Calculate 15 + 27',
    'python',
    { timeout: 5000, sandboxType: 'process' }
  );

  console.log('Python Result:', pythonResult.success ? '✅' : '❌');
  console.log('Output:', pythonResult.output);
  console.log('');

  // 3. Test JavaScript execution
  console.log('Testing JavaScript execution...');
  const jsResult = await orchestrator.execute(
    'Calculate factorial of 5',
    'javascript',
    { timeout: 5000, sandboxType: 'process' }
  );

  console.log('JavaScript Result:', jsResult.success ? '✅' : '❌');
  console.log('Output:', jsResult.output);
  console.log('');

  console.log('🎉 Execution engine functional!');
}

test().catch(console.error);
```

Esegui:
```bash
node test-execution.js
```

**Atteso:**
- ✅ Orchestrator inizializza
- ✅ Python execution funziona
- ✅ JavaScript execution funziona

### Security Test

Crea file `test-security.js`:

```javascript
const { CodeValidator, PIITokenizer } = require('./dist/core/index.js');

async function testSecurity() {
  console.log('🛡️ Testing Security Features...\n');

  // 1. Code Validation
  console.log('1. Code Validation:');
  const validator = new CodeValidator();

  const testCases = [
    { code: 'print(2+2)', lang: 'python', safe: true },
    { code: 'eval("malicious")', lang: 'javascript', safe: false },
    { code: 'import os; os.system("rm -rf /")', lang: 'python', safe: false }
  ];

  testCases.forEach(({ code, lang, safe }) => {
    const result = validator.validate(code, lang);
    const status = result.blocked ? '🚫 BLOCKED' : '✅ ALLOWED';
    const expected = safe ? '✅ ALLOWED' : '🚫 BLOCKED';
    const match = (result.blocked === !safe) ? '✅' : '❌';

    console.log(`  ${match} ${code.substring(0, 30)}... → ${status} (expected: ${expected})`);
  });

  // 2. PII Tokenization
  console.log('\n2. PII Tokenization:');
  const tokenizer = new PIITokenizer();

  const piiText = 'Contact: john.doe@example.com, SSN: 123-45-6789, Phone: 555-1234';
  const tokenized = tokenizer.tokenize(piiText);

  console.log('  Original:', piiText);
  console.log('  Tokenized:', tokenized.text);
  console.log('  Tokens found:', Object.keys(tokenized.tokens).length);

  const hasEmailToken = tokenized.text.includes('[EMAIL_');
  const hasSSNToken = tokenized.text.includes('[SSN_');

  console.log('  Email tokenized:', hasEmailToken ? '✅' : '❌');
  console.log('  SSN tokenized:', hasSSNToken ? '✅' : '❌');

  console.log('\n🎉 Security features functional!');
}

testSecurity().catch(console.error);
```

Esegui:
```bash
node test-security.js
```

**Atteso:**
- ✅ Malicious code bloccato
- ✅ Safe code permesso
- ✅ Email e SSN tokenizzati

### Token Optimization Test

Crea file `test-optimization.js`:

```javascript
const { TokenTracker, SymbolSystem } = require('./dist/core/index.js');

async function testOptimization() {
  console.log('⚡ Testing Token Optimization...\n');

  // 1. Budget Tracker
  console.log('1. Token Budget:');
  const tracker = TokenTracker.getInstance();
  const usage = tracker.getCurrentUsage();

  console.log('  Total Budget:', usage.total);
  console.log('  Used:', usage.used);
  console.log('  Available:', usage.available);
  console.log('  Percentage:', (usage.used / usage.total * 100).toFixed(1) + '%');

  // 2. Symbol Compression
  console.log('\n2. Symbol Compression:');
  const symbols = SymbolSystem.getInstance();

  const testTexts = [
    'The function returns true if the operation was successful and no errors occurred',
    'This implementation provides performance optimization through caching mechanism',
    'The system architecture follows microservices design pattern with REST API'
  ];

  testTexts.forEach(text => {
    const compressed = symbols.compress(text);
    const reduction = ((1 - compressed.length / text.length) * 100).toFixed(1);
    console.log(`  ${reduction}% reduction → "${compressed.substring(0, 50)}..."`);
  });

  console.log('\n🎉 Optimization features functional!');
}

testOptimization().catch(console.error);
```

Esegui:
```bash
node test-optimization.js
```

**Atteso:**
- ✅ Token budget tracking attivo
- ✅ Symbol compression 30-50%

---

## 🎬 Quick Start Command Sequence

Esegui questa sequenza per test rapido completo:

```bash
# 1. Build
npm run build

# 2. Smoke test
chmod +x scripts/smoke-test.sh
./scripts/smoke-test.sh

# 3. Link CLI
npm link

# 4. Test CLI
code-assistant-claude --version

# 5. Test rapidi
npm run test:fast

# 6. Test Python reali
npm run test:real:python

# 7. Test security
node test-security.js

# 8. Test optimization
node test-optimization.js
```

**Tempo totale:** ~15 minuti
**Se tutto passa:** ✅ Framework completamente funzionante!

---

## 🐛 Se Qualcosa Fallisce

### Build Error
```bash
rm -rf dist/ node_modules/
npm install
npm run build
```

### Test Timeout
```bash
# Aumenta timeout in package.json
# O usa solo test veloci
npm run test:fast
```

### Python Non Trovato
```bash
# Installa Python 3.x
# Poi verifica
python --version
# o
python3 --version
```

### CLI Non Funziona
```bash
npm unlink
npm link
# oppure
npm install -g .
```

---

## 📊 Output Atteso

### Smoke Test Success
```
🔍 Code Assistant Claude - Smoke Test
======================================

1️⃣ Build...                     ✅ OK
2️⃣ TypeCheck...                 ✅ OK
3️⃣ Linting...                   ⚠️ Warnings only
4️⃣ Fast Tests...                ✅ OK
5️⃣ Security Audit (production)...✅ OK
6️⃣ CLI Global Install...        ✅ Installed (v1.0.0)
7️⃣ Skills System...             ✅ 25 skills
8️⃣ Templates Structure...       ✅ OK
9️⃣ Python Runtime...            ✅ Python 3.13.7
🔟 Docker Runtime...            ⚠️ Not installed (optional)

======================================
✅ All critical tests passed!

🎉 Framework is fully operational
```

### Test Fast Success
```
Test Files  1 passed (40)
      Tests  190 passed (190+)
   Duration  15-30s
```

### Test Real Python Success
```
Python runtime available: Python 3.13.7

Test Files  1 passed (1)
      Tests  16 passed (16)
   Duration  ~6s
```

---

## 🎯 Milestone Verification

Marca ogni milestone:

**Build & Deploy:**
- [ ] Build completa
- [ ] Nessun errore TypeScript
- [ ] Pubblicato su npm v1.0.0

**Testing:**
- [ ] Test fast passa (190+ test)
- [ ] Test real Python passa (16 test)
- [ ] Security test passa
- [ ] Optimization test passa

**CLI:**
- [ ] Installazione globale funziona
- [ ] Init command operativo
- [ ] Validate command operativo
- [ ] Version command operativo

**Components:**
- [ ] Skills system attivo (25+ skills)
- [ ] Agents disponibili (8+ agents)
- [ ] Commands configurati (20+ commands)
- [ ] MCP templates pronti

**Security:**
- [ ] PII tokenization funzionante
- [ ] Code validation blocca malicious code
- [ ] Env filtering attivo
- [ ] Audit logging operativo

**Optimization:**
- [ ] Token reduction ≥98%
- [ ] Symbol compression 30-50%
- [ ] Budget tracking attivo
- [ ] Cache manager funzionante

---

## 🚀 Sei Pronto!

Quando tutti i check passano:
✅ Framework completamente operativo
✅ Pronto per sviluppo
✅ Pronto per produzione
✅ Pubblicato su npm

**Documentazione completa:** `docs/VERIFICATION_GUIDE.md`
