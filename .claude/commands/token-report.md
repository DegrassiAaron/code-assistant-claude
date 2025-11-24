# Comando /token-report - Report Uso Token

Quando l'utente esegue `/token-report`, fornisci un report dettagliato sull'uso dei token nella sessione corrente.

## Report da Generare

### 1. Uso Token Corrente

```typescript
// Usa il TokenTracker per ottenere dati
import { tokenTracker } from '@/core/skills/token-tracker';
import { budgetManager } from '@/core/optimizers/budget/budget-manager';

const report = tokenTracker.getReport();
const budgetStatus = budgetManager.getStatus();
```

### 2. Formato Output

```
📊 TOKEN USAGE REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 Overall Status
• Total Used: [X,XXX] tokens
• Budget: 200,000 tokens
• Remaining: [XXX,XXX] tokens ([XX]%)
• Status: [healthy/warning/critical]

🎯 Budget Allocation
• Reserved: [X,XXX] / [XX,XXX] tokens
• System: [X,XXX] / [XX,XXX] tokens
• Dynamic: [X,XXX] / [XX,XXX] tokens
• Working: [XX,XXX] / [XXX,XXX] tokens

📦 Skills Usage
• [skill-name]: [X,XXX] tokens
• [skill-name]: [X,XXX] tokens
• Other skills: 0 tokens (not loaded)

✅ Savings Analysis
• Progressive Loading Saved: [XX,XXX] tokens
• vs Always-Loaded: [XXX,XXX] tokens
• Reduction: [XX]% ✅

💡 Recommendations
[Lista raccomandazioni dal BudgetManager]
```

### 3. Calcoli

#### Progressive Loading Savings

```typescript
// Calcola quanti token avresti usato se tutti gli skill fossero caricati
const allSkillsFullyLoaded = totalSkills * averageSkillSize;
const actualSkillsUsage = loadedSkills * actualAverageSize;
const savedTokens = allSkillsFullyLoaded - actualSkillsUsage;
const reductionPercent = (savedTokens / allSkillsFullyLoaded) * 100;
```

#### MCP Savings

Se MCP code execution è stato usato, mostra:
```
🔧 MCP Code Execution
• Operations: [X]
• Traditional: ~[XX,XXX] tokens
• With MCP: [X,XXX] tokens
• Saved: [XX,XXX] tokens ([XX]%)
```

### 4. Visualizzazione Grafica

Se possibile, mostra barra di progresso:

```
Budget Usage: ████░░░░░░░░░░░░░░░░ 20%

Breakdown:
Reserved  ██░ 10%
System    ███░ 15%
Dynamic   ████░ 20%
Working   ████████████░ 60%
```

## Esempio Completo

```
📊 TOKEN USAGE REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 Overall Status
• Total Used: 18,450 tokens
• Budget: 200,000 tokens
• Remaining: 181,550 tokens (90.8%)
• Status: healthy ✅

🎯 Budget Allocation
• Reserved: 1,200 / 10,000 tokens (12%)
• System: 850 / 10,000 tokens (8.5%)
• Dynamic: 3,620 / 30,000 tokens (12.1%)
• Working: 12,780 / 150,000 tokens (8.5%)

📦 Skills Usage (Progressive Loading)
• frontend-design: 3,200 tokens (ACTIVE)
• code-reviewer: 420 tokens (METADATA_ONLY)
• test-generator: 0 tokens (NOT_LOADED)
• security-auditor: 0 tokens (NOT_LOADED)
• business-panel: 0 tokens (NOT_LOADED)

🔧 MCP Code Execution
• Operations: 3
• Traditional estimate: ~8,500 tokens
• With MCP: 450 tokens
• Saved: 8,050 tokens (94.7%) ✅

✅ Total Savings This Session
• Without optimization: ~95,000 tokens (estimated)
• With optimization: 18,450 tokens (actual)
• Saved: 76,550 tokens
• Reduction: 80.6% ✅✅✅

💡 Recommendations
✓ Excellent! Token usage is well within budget.
✓ Progressive loading is working optimally.
✓ Consider using /sc:optimize-tokens for further optimizations.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Note Implementative

1. **Dati Real-Time**: Usa sempre dati aggiornati dal TokenTracker
2. **Stime Accurate**: Basa stime su dati reali quando possibile
3. **Warnings**: Se usage > 75%, aggiungi warning e suggerimenti
4. **Context**: Se alcune metriche non sono disponibili, spiega perché

## Varianti

### Quick Report
```bash
/token-report --quick

# Output conciso:
Token Usage: 18,450 / 200,000 (9.2%)
Status: Healthy ✅
Savings: 80.6%
```

### Detailed Report
```bash
/token-report --detailed

# Include anche:
# - History/trends
# - Per-operation breakdown
# - Time series data
```

### Export Report
```bash
/token-report --export

# Salva in: .claude/reports/token-usage-[timestamp].json
```
