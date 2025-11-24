#!/bin/bash
# Hook pre-commit per verifiche prima di committare
# Esegue una suite completa di test

set -e

echo "🚀 Verifica pre-commit completa..."

# 1. Build
echo "🏗️  Build del progetto..."
npm run build

# 2. Test completi
echo "🧪 Esecuzione test completi..."
npm test

# 3. Coverage (opzionale, commentare se troppo lento)
# echo "📊 Verifica coverage..."
# npm run test:coverage

# 4. Audit sicurezza
echo "🔒 Audit sicurezza..."
npm run audit:production

echo "✅ Pronto per il commit!"
