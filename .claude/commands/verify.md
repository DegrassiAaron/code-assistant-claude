# Comando /verify - Verifica Completa del Progetto

Quando l'utente esegue `/verify`, esegui questa sequenza di verifiche complete:

## 1. Analisi Statica
```bash
npm run typecheck
npm run lint
npm run format:check
```

## 2. Test Progressivi
```bash
# Test unitari (veloci)
npm run test:unit

# Test di integrazione (moderati)
npm run test:integration

# Test E2E (lenti, opzionale)
# npm run test:e2e
```

## 3. Build e Sicurezza
```bash
npm run build
npm run audit:production
```

## 4. Report Finale

Crea un report dettagliato con:
- ✅/❌ Status di ogni verifica
- Numero di test eseguiti e passati
- Eventuali warning o errori
- Tempo totale di esecuzione
- Suggerimenti per risolvere problemi

## Esempio Output:

```
🔍 VERIFICA COMPLETA - Progetto: code-assistant-claude
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ TypeCheck      | 0 errori
✅ Lint           | 0 problemi
✅ Format         | Tutto formattato correttamente
✅ Test Unit      | 156/156 passati
✅ Test Integration| 23/23 passati
✅ Build          | Successo
✅ Security Audit | Nessuna vulnerabilità

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ TUTTE LE VERIFICHE PASSATE
⏱️  Tempo totale: 2m 34s
```

Se ci sono errori, fornisci istruzioni dettagliate su come risolverli.
