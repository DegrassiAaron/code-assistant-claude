#!/bin/bash
# Script to normalize line endings to LF

echo "🔧 Normalizing line endings to LF..."

# Remove all files from Git's index
git rm --cached -r .

# Re-add all files (Git will normalize line endings based on .gitattributes)
git add .

# Show status
git status

echo "✅ Line endings normalized! Now run 'git commit' if there are changes."
