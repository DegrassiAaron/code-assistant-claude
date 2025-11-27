#!/bin/bash

# Code Assistant Claude - Smoke Test Script
# Quick validation of core functionality

echo "🔍 Code Assistant Claude - Smoke Test"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

FAILED=0

# Test 1: Build
echo -n "1️⃣ Build...                     "
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✅ OK${NC}"
else
    echo -e "${RED}❌ FAILED${NC}"
    FAILED=1
fi

# Test 2: TypeCheck
echo -n "2️⃣ TypeCheck...                 "
if npm run typecheck > /dev/null 2>&1; then
    echo -e "${GREEN}✅ OK${NC}"
else
    echo -e "${RED}❌ FAILED${NC}"
    FAILED=1
fi

# Test 3: Linting
echo -n "3️⃣ Linting...                   "
if npm run lint > /dev/null 2>&1; then
    echo -e "${GREEN}✅ OK${NC}"
else
    # Check if only warnings
    if npm run lint 2>&1 | grep -q "0 errors"; then
        echo -e "${YELLOW}⚠️ Warnings only${NC}"
    else
        echo -e "${RED}❌ FAILED${NC}"
        FAILED=1
    fi
fi

# Test 4: Fast Tests
echo -n "4️⃣ Fast Tests...                "
if timeout 60 npm run test:fast > /dev/null 2>&1; then
    echo -e "${GREEN}✅ OK${NC}"
else
    echo -e "${RED}❌ FAILED${NC}"
    FAILED=1
fi

# Test 5: Security Audit
echo -n "5️⃣ Security Audit (production)..."
if npm run audit:production > /dev/null 2>&1; then
    echo -e "${GREEN}✅ OK${NC}"
else
    echo -e "${YELLOW}⚠️ Vulnerabilities found${NC}"
fi

# Test 6: CLI Availability (optional)
echo -n "6️⃣ CLI Global Install...        "
if command -v code-assistant-claude > /dev/null 2>&1; then
    VERSION=$(code-assistant-claude --version 2>&1)
    echo -e "${GREEN}✅ Installed (v${VERSION})${NC}"
else
    echo -e "${YELLOW}⚠️ Not linked (run: npm link)${NC}"
fi

# Test 7: Skills Available
echo -n "7️⃣ Skills System...             "
SKILL_COUNT=$(find templates/skills -name "SKILL.md" 2>/dev/null | wc -l)
if [ "$SKILL_COUNT" -gt 20 ]; then
    echo -e "${GREEN}✅ ${SKILL_COUNT} skills${NC}"
else
    echo -e "${RED}❌ Only ${SKILL_COUNT} skills found${NC}"
    FAILED=1
fi

# Test 8: Templates Available
echo -n "8️⃣ Templates Structure...       "
if [ -d "templates/skills" ] && [ -d "templates/agents" ] && [ -d "templates/commands" ]; then
    echo -e "${GREEN}✅ OK${NC}"
else
    echo -e "${RED}❌ Missing templates${NC}"
    FAILED=1
fi

# Test 9: Python Runtime (optional)
echo -n "9️⃣ Python Runtime...            "
if command -v python > /dev/null 2>&1 || command -v python3 > /dev/null 2>&1; then
    PYTHON_VER=$(python --version 2>&1 || python3 --version 2>&1)
    echo -e "${GREEN}✅ ${PYTHON_VER}${NC}"
else
    echo -e "${YELLOW}⚠️ Not installed (optional)${NC}"
fi

# Test 10: Docker Runtime (optional)
echo -n "🔟 Docker Runtime...            "
if command -v docker > /dev/null 2>&1; then
    DOCKER_VER=$(docker --version 2>&1 | head -1)
    echo -e "${GREEN}✅ ${DOCKER_VER}${NC}"
else
    echo -e "${YELLOW}⚠️ Not installed (optional)${NC}"
fi

echo ""
echo "======================================"

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All critical tests passed!${NC}"
    echo ""
    echo "🎉 Framework is fully operational"
    echo ""
    echo "Next steps:"
    echo "  - Run: npm link (to install CLI globally)"
    echo "  - Run: npm run test:real:python (to test real execution)"
    echo "  - Read: docs/VERIFICATION_GUIDE.md (for detailed testing)"
    exit 0
else
    echo -e "${RED}❌ Some tests failed${NC}"
    echo ""
    echo "Please review the errors above and:"
    echo "  1. Check build output: npm run build"
    echo "  2. Check test output: npm run test:fast"
    echo "  3. Verify dependencies: npm install"
    exit 1
fi
