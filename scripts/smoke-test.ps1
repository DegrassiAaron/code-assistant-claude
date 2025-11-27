# Code Assistant Claude - Smoke Test Script (PowerShell)
# Quick validation of core functionality

Write-Host "`n🔍 Code Assistant Claude - Smoke Test" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

$Failed = 0

# Test 1: Build
Write-Host "1️⃣ Build...                     " -NoNewline
$null = npm run build 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ OK" -ForegroundColor Green
} else {
    Write-Host "❌ FAILED" -ForegroundColor Red
    $Failed = 1
}

# Test 2: TypeCheck
Write-Host "2️⃣ TypeCheck...                 " -NoNewline
$null = npm run typecheck 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ OK" -ForegroundColor Green
} else {
    Write-Host "❌ FAILED" -ForegroundColor Red
    $Failed = 1
}

# Test 3: Linting
Write-Host "3️⃣ Linting...                   " -NoNewline
$lintOutput = npm run lint 2>&1 | Out-String
if ($lintOutput -match "0 errors") {
    Write-Host "⚠️ Warnings only" -ForegroundColor Yellow
} elseif ($LASTEXITCODE -eq 0) {
    Write-Host "✅ OK" -ForegroundColor Green
} else {
    Write-Host "❌ FAILED" -ForegroundColor Red
    $Failed = 1
}

# Test 4: Fast Tests
Write-Host "4️⃣ Fast Tests...                " -NoNewline
$testOutput = npm run test:fast 2>&1 | Out-String
if ($testOutput -match "passed" -and $LASTEXITCODE -eq 0) {
    Write-Host "✅ OK" -ForegroundColor Green
} else {
    Write-Host "❌ FAILED" -ForegroundColor Red
    $Failed = 1
}

# Test 5: Security Audit
Write-Host "5️⃣ Security Audit (production)..." -NoNewline
$null = npm run audit:production 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ OK" -ForegroundColor Green
} else {
    Write-Host "⚠️ Vulnerabilities found" -ForegroundColor Yellow
}

# Test 6: CLI Availability
Write-Host "6️⃣ CLI Global Install...        " -NoNewline
$cliCheck = Get-Command code-assistant-claude -ErrorAction SilentlyContinue
if ($cliCheck) {
    $version = & code-assistant-claude --version 2>&1
    Write-Host "✅ Installed (v$version)" -ForegroundColor Green
} else {
    Write-Host "⚠️ Not linked (run: npm link)" -ForegroundColor Yellow
}

# Test 7: Skills Available
Write-Host "7️⃣ Skills System...             " -NoNewline
$skillCount = (Get-ChildItem -Path "templates\skills" -Recurse -Filter "SKILL.md" -ErrorAction SilentlyContinue | Measure-Object).Count
if ($skillCount -gt 20) {
    Write-Host "✅ $skillCount skills" -ForegroundColor Green
} else {
    Write-Host "❌ Only $skillCount skills found" -ForegroundColor Red
    $Failed = 1
}

# Test 8: Templates Structure
Write-Host "8️⃣ Templates Structure...       " -NoNewline
$hasTemplates = (Test-Path "templates\skills") -and (Test-Path "templates\agents") -and (Test-Path "templates\commands")
if ($hasTemplates) {
    Write-Host "✅ OK" -ForegroundColor Green
} else {
    Write-Host "❌ Missing templates" -ForegroundColor Red
    $Failed = 1
}

# Test 9: Python Runtime
Write-Host "9️⃣ Python Runtime...            " -NoNewline
$pythonCheck = Get-Command python -ErrorAction SilentlyContinue
if (-not $pythonCheck) {
    $pythonCheck = Get-Command python3 -ErrorAction SilentlyContinue
}
if ($pythonCheck) {
    $pythonVer = & $pythonCheck.Name --version 2>&1
    Write-Host "✅ $pythonVer" -ForegroundColor Green
} else {
    Write-Host "⚠️ Not installed (optional)" -ForegroundColor Yellow
}

# Test 10: Docker Runtime
Write-Host "🔟 Docker Runtime...            " -NoNewline
$dockerCheck = Get-Command docker -ErrorAction SilentlyContinue
if ($dockerCheck) {
    $dockerVer = (& docker --version 2>&1) -split "`n" | Select-Object -First 1
    Write-Host "✅ $dockerVer" -ForegroundColor Green
} else {
    Write-Host "⚠️ Not installed (optional)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "======================================"  -ForegroundColor Cyan

if ($Failed -eq 0) {
    Write-Host "✅ All critical tests passed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎉 Framework is fully operational" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:"
    Write-Host "  - Run: npm link (to install CLI globally)"
    Write-Host "  - Run: npm run test:real:python (to test real execution)"
    Write-Host "  - Read: docs/VERIFICATION_GUIDE.md (for detailed testing)"
    exit 0
} else {
    Write-Host "❌ Some tests failed" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please review the errors above and:"
    Write-Host "  1. Check build output: npm run build"
    Write-Host "  2. Check test output: npm run test:fast"
    Write-Host "  3. Verify dependencies: npm install"
    exit 1
}
