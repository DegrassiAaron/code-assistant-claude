# Comando /quick-check - Verifica Rapida

Quando l'utente esegue `/quick-check`, esegui solo le verifiche essenziali e veloci:

## Verifiche Rapide (< 30 secondi)

### 1. TypeScript (5-10s)
```bash
npm run typecheck
```

### 2. Linting (5-10s)
```bash
npm run lint
```

### 3. Test Unitari (10-20s)
```bash
npm run test:unit -- --run
```

## Report Rapido

Fornisci un output conciso:

```
⚡ QUICK CHECK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Types  | OK
✅ Lint   | OK
✅ Tests  | 156 passed
⏱️  12s

✅ Pronto per continuare!
```

Se ci sono errori, mostra solo il primo errore critico e chiedi se procedere con verifica completa (`/verify`).

## Quando Usare

- Durante sviluppo attivo
- Prima di committare modifiche minori
- Dopo ogni refactoring piccolo
- Per feedback immediato
