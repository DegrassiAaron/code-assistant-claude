# PowerShell script to fix line endings on Windows

Write-Host "🔧 Normalizing line endings to LF..." -ForegroundColor Cyan

# Configure Git to not convert line endings
Write-Host "`nConfiguring Git..." -ForegroundColor Yellow
git config core.autocrlf false
git config core.eol lf

# Remove all files from Git's index
Write-Host "`nRemoving files from Git index..." -ForegroundColor Yellow
git rm --cached -r . 2>$null

# Re-normalize the repository
Write-Host "`nRe-adding files with correct line endings..." -ForegroundColor Yellow
git add --renormalize .

# Show status
Write-Host "`nGit Status:" -ForegroundColor Yellow
git status

Write-Host "`n✅ Line endings normalized!" -ForegroundColor Green
Write-Host "`nNow you can commit the changes with:" -ForegroundColor Cyan
Write-Host "`ngit commit -m test" -ForegroundColor White