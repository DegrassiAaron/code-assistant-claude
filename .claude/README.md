# 🤖 Configurazione Claude Code per Testing Continuo

Questa directory contiene la configurazione per verificare automaticamente il funzionamento dell'applicazione durante lo sviluppo con Claude.

## 📁 Struttura

```
.claude/
├── README.md              # Questo file
├── TESTING.md            # Guida completa testing continuo
├── hooks/                # Script automatici
│   ├── post-edit.sh     # Eseguito dopo ogni modifica di Claude
│   └── pre-commit.sh    # Eseguito prima di ogni commit
└── commands/             # Comandi slash personalizzati
    ├── verify.md        # /verify - Verifica completa
    ├── quick-check.md   # /quick-check - Verifica rapida
    └── test-feature.md  # /test-feature - Test feature specifica
```

## 🚀 Quick Start

### 1. Comandi Disponibili

Usa questi comandi durante la conversazione con Claude:

```bash
# Verifica rapida (10-15 secondi)
/quick-check

# Verifica completa (2-3 minuti)
/verify

# Test feature specifica
/test-feature [nome-feature]
```

### 2. Workflow Consigliato

**Durante sviluppo attivo:**
```bash
# Terminale 1: Test automatici (sempre attivo)
npm run test:watch

# Terminale 2: Claude Code
# Ogni modifica di Claude viene testata automaticamente
```

**Prima di commit:**
```bash
/verify
```

### 3. Attivare Hook Automatici

Per far eseguire verifiche automatiche dopo ogni modifica di Claude:

#### Opzione A: Configurazione Globale
Aggiungi a `~/.claude/settings.json`:
```json
{
  "hooks": {
    "afterEdit": ".claude/hooks/post-edit.sh",
    "beforeCommit": ".claude/hooks/pre-commit.sh"
  }
}
```

#### Opzione B: Configurazione Locale
Aggiungi a `.claude/settings.json` (nella root del progetto):
```json
{
  "hooks": {
    "afterEdit": ".claude/hooks/post-edit.sh"
  }
}
```

## 📖 Documentazione Completa

Leggi [TESTING.md](./TESTING.md) per:
- ✅ Workflow dettagliati
- ✅ Best practices
- ✅ Livelli di testing
- ✅ Risoluzione problemi
- ✅ Configurazione IDE
- ✅ Checklist

## 🎯 Cosa Fare Ora

1. **Leggi TESTING.md** per capire i workflow
2. **Avvia watch mode** in un terminale: `npm run test:watch`
3. **Usa /quick-check** dopo ogni modifica di Claude
4. **Usa /verify** prima di commit importanti

## 💡 Esempi

### Esempio 1: Sviluppo Feature

```
Tu: "Claude, aggiungi validazione email al form di registrazione"

Claude: [Modifica i file]

Tu: "/quick-check"

Claude:
⚡ QUICK CHECK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Types  | OK
✅ Lint   | OK
✅ Tests  | 158 passed (2 new)
⏱️  12s

✅ Pronto per continuare!

Tu: "Perfetto, ora aggiungi anche validazione password"
```

### Esempio 2: Pre-Commit

```
Tu: "/verify"

Claude:
🔍 VERIFICA COMPLETA - Progetto: code-assistant-claude
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ TypeCheck      | 0 errori
✅ Lint           | 0 problemi
✅ Format         | OK
✅ Test Unit      | 156/156 passati
✅ Test Integration| 23/23 passati
✅ Build          | Successo
✅ Security Audit | OK

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ TUTTE LE VERIFICHE PASSATE
⏱️  Tempo totale: 2m 18s

Tu: "Perfetto! git commit -m 'feat: add email validation'"
```

### Esempio 3: Test Fallisce

```
Tu: "/quick-check"

Claude:
⚡ QUICK CHECK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Types  | OK
✅ Lint   | OK
❌ Tests  | 1 failed

Test Failed: user-validation.test.ts
Expected email "invalid" to be rejected, but was accepted

Tu: "Claude, puoi fixare il test che sta fallendo?"

Claude: "Ho trovato il problema. La regex di validazione email non copriva
quel caso. Ho aggiornato la regex e ora il test passa."

Tu: "/quick-check"

Claude:
⚡ QUICK CHECK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Types  | OK
✅ Lint   | OK
✅ Tests  | 157 passed
⏱️  11s

✅ Pronto per continuare!
```

## 🎓 Best Practices

1. **Test Watch sempre attivo** durante sviluppo
2. **`/quick-check`** dopo ogni modifica significativa di Claude
3. **`/verify`** prima di commit
4. **Chiedi fix immediato** se test falliscono
5. **Coverage > 80%** per nuovo codice

## 🔧 Personalizzazione

### Modificare Hook

Puoi personalizzare gli hook in `.claude/hooks/`:

```bash
# Esempio: Hook più veloce (solo typecheck)
# Edit: .claude/hooks/post-edit.sh

#!/bin/bash
npm run typecheck
```

### Aggiungere Comandi

Crea nuovi file `.md` in `.claude/commands/`:

```bash
# .claude/commands/my-command.md

# Comando /my-command

[Istruzioni per Claude su cosa fare quando esegui questo comando]
```

## 🆘 Aiuto

- Problemi con hook? Verifica permessi: `chmod +x .claude/hooks/*.sh`
- Comandi non funzionano? Verifica sintassi markdown
- Test troppo lenti? Usa `/quick-check` invece di `/verify`

Per maggiori dettagli, vedi [TESTING.md](./TESTING.md)

---

**Buon coding! 🚀**
