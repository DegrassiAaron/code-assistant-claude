# 🧪 Guida Testing Continuo con Claude Code

Questa guida spiega come verificare il funzionamento dell'applicazione in ogni fase durante lo sviluppo con Claude.

## 📋 Indice

1. [Comandi Rapidi](#comandi-rapidi)
2. [Workflow Consigliati](#workflow-consigliati)
3. [Hook Automatici](#hook-automatici)
4. [Livelli di Testing](#livelli-di-testing)
5. [Best Practices](#best-practices)

---

## ⚡ Comandi Rapidi

### Durante lo Sviluppo

```bash
# Verifica rapida (< 30 secondi) - USA QUESTO SPESSO!
/quick-check

# Verifica completa (2-3 minuti) - Prima di commit importanti
/verify

# Test specifica feature
/test-feature [nome-feature]

# Test in watch mode (si rieseguono automaticamente)
npm run test:watch
```

### Comandi npm Disponibili

```bash
# Test
npm test                    # Tutti i test (veloce)
npm run test:watch         # Watch mode (consigliato durante sviluppo)
npm run test:unit          # Solo test unitari
npm run test:integration   # Solo test di integrazione
npm run test:e2e          # Solo test end-to-end
npm run test:coverage     # Con coverage report

# Qualità Codice
npm run lint              # Controllo linting
npm run lint:fix          # Fix automatico linting
npm run typecheck         # Controllo TypeScript
npm run format:check      # Verifica formattazione
npm run format            # Fix formattazione

# Sicurezza
npm run audit             # Audit dipendenze
npm run audit:production  # Audit solo dipendenze produzione

# Build
npm run build             # Build produzione
npm run dev              # Build development (watch mode)
```

---

## 🔄 Workflow Consigliati

### 1. Sviluppo Attivo (Iterazione Rapida)

```bash
# Terminale 1: Build automatica
npm run dev

# Terminale 2: Test automatici
npm run test:watch

# Ora ogni modifica:
# ✅ Viene compilata automaticamente
# ✅ I test si rieseguono automaticamente
# ✅ Feedback immediato (< 5 secondi)
```

**Quando usare:** Durante sviluppo attivo di una feature

### 2. Verifica Pre-Modifica

Prima di chiedere a Claude di modificare codice:

```bash
# Verifica stato attuale
/quick-check

# Se passa, chiedi modifiche a Claude
# Se fallisce, risolvi prima i problemi
```

**Perché:** Isola nuovi problemi da problemi esistenti

### 3. Verifica Post-Modifica

Dopo ogni modifica significativa di Claude:

```bash
# Verifica immediata
/quick-check

# Se passa, continua
# Se fallisce, chiedi a Claude di fixare
```

**Automatico con hook:** L'hook `post-edit.sh` fa questo automaticamente!

### 4. Verifica Pre-Commit

Prima di ogni commit:

```bash
# Verifica completa
/verify

# Include:
# - TypeCheck
# - Linting
# - Formattazione
# - Tutti i test
# - Build
# - Security audit
```

**Automatico con hook:** L'hook `pre-commit.sh` fa questo automaticamente!

### 5. Test Specifica Feature

Quando lavori su una feature specifica:

```bash
/test-feature user-authentication

# Testa solo i file relativi all'autenticazione
# Più veloce della suite completa
# Mostra coverage specifico
```

---

## 🎣 Hook Automatici

### Hook Disponibili

#### 1. `post-edit.sh` - Dopo Ogni Modifica
```bash
.claude/hooks/post-edit.sh
```

**Esegue automaticamente:**
- ✅ TypeCheck
- ✅ Linting
- ✅ Formattazione
- ✅ Test unitari

**Quando:** Dopo ogni modifica di Claude

**Configurazione Claude Code:**
Aggiungi al file `~/.claude/settings.json` o `.claude/settings.json`:

```json
{
  "hooks": {
    "afterEdit": ".claude/hooks/post-edit.sh"
  }
}
```

#### 2. `pre-commit.sh` - Prima di Commit
```bash
.claude/hooks/pre-commit.sh
```

**Esegue automaticamente:**
- ✅ Build completa
- ✅ Tutti i test
- ✅ Security audit

**Quando:** Prima di ogni commit

**Già configurato:** Husky (vedi `.husky/pre-commit`)

### Personalizzare gli Hook

Puoi modificare gli script in `.claude/hooks/` per adattarli alle tue esigenze:

```bash
# Esempio: Hook più veloce (solo typecheck e lint)
# Edit: .claude/hooks/post-edit.sh

#!/bin/bash
echo "🔍 Verifica rapida..."
npm run typecheck
npm run lint
echo "✅ OK!"
```

---

## 📊 Livelli di Testing

### Livello 1: Sviluppo Attivo ⚡ (< 10s)
```bash
/quick-check
# o
npm run typecheck && npm run test:unit -- --run
```

**Quando:** Ogni 5-10 minuti durante sviluppo

### Livello 2: Feature Completa 🔧 (< 1m)
```bash
/test-feature [feature-name]
# o
npm run test:unit && npm run test:integration
```

**Quando:** Feature completata, prima di passare alla prossima

### Livello 3: Pre-Commit 🚀 (2-3m)
```bash
/verify
# o
npm run lint && npm run typecheck && npm test && npm run build
```

**Quando:** Prima di ogni commit

### Livello 4: Pre-Push 🔒 (5-10m)
```bash
npm run test:coverage && npm run test:e2e && npm run audit
```

**Quando:** Prima di push su branch condivisi

---

## 💡 Best Practices

### 1. Test in Watch Mode Durante Sviluppo

**✅ CONSIGLIATO:**
```bash
# Terminale sempre aperto con:
npm run test:watch
```

**Perché:**
- Feedback immediato (< 5s)
- Vedi subito se hai rotto qualcosa
- Non devi ricordarti di lanciare test

### 2. Verifica Prima di Chiedere Modifiche

**✅ CONSIGLIATO:**
```bash
# Prima di chiedere a Claude:
/quick-check

# Se passa:
"Claude, puoi aggiungere la validazione email?"

# Se fallisce:
"Claude, ci sono 3 test che falliscono, puoi fixarli prima?"
```

**Perché:**
- Isoli problemi nuovi da problemi esistenti
- Eviti di accumulare debito tecnico

### 3. Usa /quick-check Frequentemente

**✅ CONSIGLIATO:**
```bash
# Dopo ogni modifica significativa di Claude:
/quick-check
```

**Perché:**
- 10-15 secondi per feedback completo
- Catturaproblemi subito (più facili da fixare)

### 4. Usa /verify Prima di Commit Importanti

**✅ CONSIGLIATO:**
```bash
# Prima di commit su branch principale:
/verify

# Se passa:
git add . && git commit -m "feat: ..."

# Se fallisce:
# Fix i problemi prima
```

**Perché:**
- Garantisci qualità costante
- Eviti di rompere il branch principale

### 5. Test di Regressione

Quando Claude modifica codice esistente:

**✅ CONSIGLIATO:**
```bash
# Prima della modifica:
npm test > before.txt

# Dopo la modifica:
npm test > after.txt

# Confronta:
diff before.txt after.txt
```

**Perché:**
- Verifichi che non abbia rotto test esistenti
- Identifichi regressioni immediatamente

### 6. Coverage Minimo

**✅ CONSIGLIATO:**
```bash
# Verifica coverage periodicamente:
npm run test:coverage

# Target minimo:
# - Lines: > 80%
# - Functions: > 80%
# - Branches: > 70%
```

**Quando Claude aggiunge nuovo codice:**
```
"Claude, il coverage è sceso sotto 80%.
Puoi aggiungere test per il nuovo codice?"
```

### 7. TDD con Claude

**✅ WORKFLOW CONSIGLIATO:**

```bash
# 1. Chiedi a Claude di scrivere il test PRIMA
"Claude, scrivi un test per la funzione validateEmail che dovrebbe:
- Accettare email valide
- Rifiutare email senza @
- Rifiutare email senza dominio"

# 2. Verifica che il test fallisca (Red)
npm test

# 3. Chiedi l'implementazione
"Claude, ora implementa la funzione validateEmail"

# 4. Verifica che il test passi (Green)
npm test

# 5. Chiedi refactoring se necessario
"Claude, puoi ottimizzare la regex?"

# 6. Verifica che test passino ancora
npm test
```

**Perché:**
- Test prima = migliore design
- Verifichi che test catturaveramente i bug
- Refactoring sicuro

---

## 🔧 Configurazione IDE

### VS Code

Installa estensioni per feedback continuo:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "vitest.explorer"
  ]
}
```

Configura task per testing rapido:

```json
// .vscode/tasks.json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Quick Check",
      "type": "shell",
      "command": "npm run typecheck && npm run lint && npm test",
      "group": {
        "kind": "test",
        "isDefault": true
      }
    }
  ]
}
```

**Shortcut:** `Cmd+Shift+B` (Mac) o `Ctrl+Shift+B` (Win/Linux)

---

## 🎯 Checklist Veloce

### Ogni Modifica
- [ ] Watch mode attivo (`npm run test:watch`)
- [ ] Test passano automaticamente

### Ogni Feature
- [ ] `/quick-check` passa
- [ ] Coverage > 80% per nuovo codice
- [ ] Nessun warning TypeScript

### Ogni Commit
- [ ] `/verify` passa
- [ ] Commit message descrittivo
- [ ] No file debug/temp

### Ogni Push
- [ ] Branch aggiornato con main
- [ ] Tutti i test passano
- [ ] Build successo
- [ ] Security audit pulito

---

## 🆘 Risoluzione Problemi

### Test Falliscono Dopo Modifica di Claude

```bash
# 1. Chiedi a Claude di vedere l'errore
"Claude, il test X sta fallendo con questo errore: [copia errore]"

# 2. Claude analizza e fixa
# (Se non funziona)

# 3. Torna alla versione precedente
git checkout -- [file-modificato]

# 4. Chiedi a Claude di riprovare con approccio diverso
"Claude, l'approccio precedente ha rotto i test.
Puoi provare con [approccio alternativo]?"
```

### Build Fallisce

```bash
# 1. Verifica errori TypeScript
npm run typecheck

# 2. Mostra errori a Claude
"Claude, ho questi errori TypeScript: [errori]"

# 3. Claude fixa i type errors
```

### Test Troppo Lenti

```bash
# 1. Esegui solo test modificati
npm test -- --changed

# 2. Oppure test specifici
npm test -- [pattern]

# 3. Per sviluppo, disabilita test E2E
# (sono i più lenti)
```

---

## 📚 Risorse Aggiuntive

- [Vitest Documentation](https://vitest.dev/)
- [Testing Best Practices](https://testingjavascript.com/)
- [TDD with Claude](link-to-guide)

---

**✅ Con questi workflow, avrai sempre codice verificato e funzionante ad ogni passo!**
