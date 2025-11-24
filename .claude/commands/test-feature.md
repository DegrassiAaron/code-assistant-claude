# Comando /test-feature - Test di una Feature Specifica

Quando l'utente esegue `/test-feature [nome-feature]`, segui questo workflow:

## 1. Identifica i File Coinvolti
- Cerca file sorgente relativi alla feature
- Identifica test esistenti
- Verifica dipendenze

## 2. Esegui Test Mirati
```bash
# Test unitari specifici
npm run test:unit -- [file-pattern]

# Test di integrazione correlati
npm run test:integration -- [file-pattern]
```

## 3. Verifica Coverage
```bash
npm run test:coverage -- [file-pattern]
```

## 4. Analisi Risultati

Fornisci:
- ✅ Test passati vs totali
- 📊 Coverage percentuale (linee, funzioni, branch)
- ⚠️  Aree non coperte da test
- 💡 Suggerimenti per migliorare test

## 5. Test Interattivi (opzionale)

Se necessario, avvia test in watch mode:
```bash
npm run test:watch -- [file-pattern]
```

## Esempio:
```
/test-feature project-analyzer

🧪 TEST FEATURE: project-analyzer
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📁 File identificati:
  - src/core/project-analyzer.ts
  - tests/unit/core/project-analyzer.test.ts

✅ Test Unit: 12/12 passati
✅ Test Integration: 3/3 passati

📊 Coverage:
  - Linee: 94.2%
  - Funzioni: 100%
  - Branch: 88.5%

⚠️  Branch non coperti:
  - project-analyzer.ts:142 (gestione errore edge case)

💡 Suggerimento: Aggiungi test per il caso edge alla riga 142
```
