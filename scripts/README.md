# Scripts

Utility scripts for project maintenance.

## Line Endings Fix

If you're getting Prettier errors like `Delete ␍` (CRLF issues), use these scripts:

### On Windows (PowerShell)

```powershell
.\scripts\fix-line-endings.ps1
```

This script will:
- Configure Git to use LF line endings
- Re-normalize all files in the repository
- Fix the Prettier CRLF errors

### On Linux/Mac

```bash
bash scripts/fix-line-endings.sh
```

## After Running the Script

After the script completes, commit the normalized files:

```bash
git commit -m "fix: normalize line endings to LF"
```
