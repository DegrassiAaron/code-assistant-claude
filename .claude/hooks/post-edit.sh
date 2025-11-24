#!/bin/bash
# Hook eseguito automaticamente dopo ogni modifica di file da Claude
# Questo garantisce che ogni modifica venga verificata immediatamente

set -e

echo "🔍 Verifica automatica post-modifica..."

# 1. Controllo TypeScript
echo "📘 Controllo tipi TypeScript..."
npm run typecheck

# 2. Linting
echo "🔧 Verifica linting..."
npm run lint

# 3. Formattazione
echo "✨ Verifica formattazione..."
npm run format:check

# 4. Test unitari relativi ai file modificati
echo "🧪 Esecuzione test unitari..."
npm run test:unit -- --run

echo "✅ Tutte le verifiche sono passate!"
