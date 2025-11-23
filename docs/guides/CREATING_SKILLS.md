# Creating Custom Skills
## Build specialized expertise for Claude Code

Complete guide to creating production-ready Claude skills with code execution, progressive loading, and token optimization.

---

## 📋 Table of Contents

1. [What Makes a Good Skill](#what-makes-a-good-skill)
2. [Skill Structure](#skill-structure)
3. [YAML Frontmatter](#yaml-frontmatter)
4. [Writing Effective Instructions](#writing-effective-instructions)
5. [Adding Executable Code](#adding-executable-code)
6. [Progressive Disclosure](#progressive-disclosure)
7. [Testing Your Skill](#testing-your-skill)
8. [Examples](#examples)
9. [Best Practices](#best-practices)

---

## What Makes a Good Skill?

### Characteristics of Effective Skills

✅ **Focused** - Solves one specific problem well
✅ **Repeatable** - Useful across multiple sessions/projects
✅ **Clear** - Unambiguous instructions for Claude
✅ **Token-Efficient** - Compact yet comprehensive
✅ **Testable** - Verifiable outcomes
✅ **Composable** - Works well with other skills

### Anti-Patterns to Avoid

❌ **Too Broad** - "Help with programming" (too vague)
❌ **Too Specific** - "Fix bug in line 42 of auth.js" (one-time use)
❌ **Redundant** - Repeats Claude's existing knowledge
❌ **Token-Heavy** - 10K+ tokens of instructions
❌ **Untestable** - No way to verify it works
❌ **Isolated** - Doesn't complement other skills

---

## Skill Structure

### Basic Structure

```
my-skill/
├── SKILL.md              # Required: Main skill file
├── README.md             # Optional: Documentation
├── scripts/              # Optional: Executable code
│   ├── helper.py
│   └── processor.js
├── templates/            # Optional: Templates
│   └── output-template.md
└── examples/             # Optional: Usage examples
    └── example-1.md
```

### SKILL.md Anatomy

```markdown
---
# YAML Frontmatter (Required)
name: skill-name
description: Clear, concise description of what this skill does
---

# Skill Title

## Overview
Brief explanation of the skill's purpose and when to use it.

## When to Use
Explicit triggers and use cases.

## Instructions
Step-by-step guidance for Claude.

## Examples
Concrete examples showing expected behavior.

## Limitations
What this skill doesn't handle.
```

---

## YAML Frontmatter

### Required Fields

```yaml
---
name: my-skill-name
description: When to use this skill and what it does. Use WHEN + WHEN NOT pattern.
---
```

**Description Best Practices**:

✅ **Good Description** (WHEN + WHEN NOT):
```yaml
description: >
  Code review automation for TypeScript/React projects.
  Auto-invoke when user saves files in src/, lib/, or app/ directories.
  Use for quality checks, security audits, and best practice enforcement.
  Do NOT load for markdown files, config files, or test utilities.
```

❌ **Bad Description** (too vague):
```yaml
description: Helps with code quality
```

### Optional Fields

```yaml
---
name: advanced-skill
description: Detailed description with WHEN + WHEN NOT

# Optional metadata
version: 1.0.0
author: Your Name
created: 2025-11-23
updated: 2025-11-23

# Skill configuration
triggers:
  - file_save       # Auto-activate on file save
  - pre_commit      # Auto-activate on git pre-commit
  - keyword:test    # Activate when "test" mentioned

dependencies:
  - other-skill-name   # Load this skill first

composability:
  - complementary-skill  # Works well with this skill

token_cost:
  metadata: 45
  full: 2000

priority: high   # high, medium, low

project_types:
  - javascript
  - typescript
  - react

domains:
  - frontend
  - testing
---
```

---

## Writing Effective Instructions

### Structure Your Instructions

**1. Overview Section**:
```markdown
## Overview

This skill provides automated code review for TypeScript React applications,
focusing on:
- Security vulnerabilities (XSS, injection attacks)
- Performance anti-patterns (N+1 queries, unnecessary re-renders)
- Code quality (naming, structure, maintainability)
- Test coverage gaps
```

**2. When to Use Section**:
```markdown
## When to Use

Automatically activate when:
- User saves files in `src/`, `lib/`, or `app/` directories
- User explicitly requests code review
- Pre-commit git hook triggers

Do NOT activate when:
- Editing test files (*.test.*, *.spec.*)
- Editing configuration files
- Editing documentation (*.md)
```

**3. Instructions Section**:
```markdown
## Instructions

### Step 1: Read the File
Use the Read tool to access the file content.

### Step 2: Analyze with Checklist
Run through this checklist:
- [ ] Security: No hardcoded secrets, no injection vulnerabilities
- [ ] Performance: No N+1 queries, efficient algorithms
- [ ] Quality: Clear naming, proper separation of concerns
- [ ] Tests: Coverage for critical paths

### Step 3: Provide Feedback
Format feedback as:
```
🛡️ SECURITY: [Issue description]
   Line 45: [specific problem]
   Fix: [actionable recommendation]
```

Use symbols for quick scanning:
- 🛡️ Security issues
- ⚡ Performance issues
- ✅ Good patterns
- ⚠️ Warnings
```

**4. Examples Section**:
```markdown
## Examples

### Example 1: Security Issue

**Input**: User saves `auth/login.ts`
**Skill activates**: security-auditor
**Output**:
```
🛡️ SECURITY - SQL Injection Vulnerability
   Line 34: `SELECT * FROM users WHERE email = '${email}'`
   Fix: Use parameterized queries

   Suggested fix:
   ```typescript
   const user = await db.query(
     'SELECT * FROM users WHERE email = $1',
     [email]
   );
   ```
```

### Example 2: Performance Issue

**Input**: User saves `components/UserList.tsx`
**Skill activates**: performance-optimizer
**Output**:
```
⚡ PERFORMANCE - N+1 Query Pattern
   Line 67: Fetching user details in loop (100 iterations)
   Fix: Batch query with single database call

   Suggested fix:
   ```typescript
   const userIds = users.map(u => u.id);
   const details = await db.users.findMany({
     where: { id: { in: userIds } }
   });
   ```
```
```

**5. Limitations Section**:
```markdown
## Limitations

This skill does NOT:
- Generate code (use code-generator skill instead)
- Run tests (use test-generator skill instead)
- Deploy changes (use deployment-automation skill instead)
- Handle non-TypeScript files (Python, Java, etc.)

For these tasks, use the appropriate specialized skills.
```

---

## Adding Executable Code

### Why Add Code to Skills?

**Use code for**:
- Deterministic operations (sorting, calculations)
- Heavy computation (parsing large files)
- External tool integration (API calls, database queries)
- File processing (PDF extraction, data transformation)

**Don't use code for**:
- Tasks LLMs do well (text generation, analysis)
- Simple operations (reading files, basic logic)

### Python Script Example

**File structure**:
```
data-analyzer/
├── SKILL.md
└── scripts/
    ├── analyze.py
    └── requirements.txt
```

**SKILL.md**:
```markdown
---
name: data-analyzer
description: Analyze CSV/Excel data with statistical computations
---

# Data Analyzer Skill

## Usage

When user requests data analysis, use the Python script in this folder:

```bash
python3 ./scripts/analyze.py <input-file> --stats --visualize
```

The script will:
1. Load data from CSV/Excel
2. Compute statistics (mean, median, std dev)
3. Generate visualizations
4. Save results to `./workspace/analysis-results.json`

## Example

```typescript
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Run analysis
const { stdout } = await execAsync(
  `python3 ${__dirname}/scripts/analyze.py data.csv --stats`
);

const results = JSON.parse(stdout);
console.log('Analysis complete:', results.summary);
```

## Script Output Format

```json
{
  "summary": {
    "row_count": 1000,
    "column_count": 15,
    "missing_values": 23
  },
  "statistics": {
    "revenue": { "mean": 45000, "median": 42000, "std": 12000 },
    "users": { "mean": 1200, "median": 980, "std": 340 }
  },
  "insights": [
    "Revenue shows normal distribution",
    "23 records with missing user data"
  ]
}
```
```

**scripts/analyze.py**:
```python
#!/usr/bin/env python3
"""
Data analysis script for CSV/Excel files
"""
import sys
import json
import pandas as pd
import argparse

def analyze_data(filepath: str, compute_stats: bool = True):
    """Analyze data file and return statistics"""

    # Load data
    if filepath.endswith('.csv'):
        df = pd.read_csv(filepath)
    elif filepath.endswith('.xlsx'):
        df = pd.read_excel(filepath)
    else:
        raise ValueError("Unsupported file format")

    # Basic summary
    summary = {
        "row_count": len(df),
        "column_count": len(df.columns),
        "missing_values": df.isnull().sum().sum()
    }

    # Statistics
    statistics = {}
    if compute_stats:
        numeric_columns = df.select_dtypes(include=['number']).columns
        for col in numeric_columns:
            statistics[col] = {
                "mean": float(df[col].mean()),
                "median": float(df[col].median()),
                "std": float(df[col].std())
            }

    # Generate insights
    insights = []
    if df.isnull().sum().sum() > 0:
        insights.append(f"{summary['missing_values']} records with missing data")

    return {
        "summary": summary,
        "statistics": statistics,
        "insights": insights
    }

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("filepath", help="Path to CSV/Excel file")
    parser.add_argument("--stats", action="store_true", help="Compute statistics")

    args = parser.parse_args()

    results = analyze_data(args.filepath, args.stats)
    print(json.dumps(results, indent=2))
```

### TypeScript Script Example

**SKILL.md**:
```markdown
---
name: mcp-tool-wrapper
description: Generate TypeScript wrappers for MCP tools
---

# MCP Tool Wrapper Generator

## Usage

```typescript
import { generateWrapper } from './scripts/generate-wrapper';

const wrapper = await generateWrapper({
  toolName: 'salesforce.updateRecord',
  mcpServer: 'salesforce',
  schema: toolSchema
});

console.log('Generated wrapper:', wrapper);
```

See `./scripts/generate-wrapper.ts` for implementation.
```

**scripts/generate-wrapper.ts**:
```typescript
#!/usr/bin/env node
import { JSONSchema } from './types';

interface WrapperOptions {
  toolName: string;
  mcpServer: string;
  schema: JSONSchema;
}

export async function generateWrapper(
  options: WrapperOptions
): Promise<string> {
  const { toolName, mcpServer, schema } = options;

  // Generate TypeScript interface from JSON Schema
  const inputInterface = generateInterface(
    `${capitalize(toolName)}Input`,
    schema.parameters
  );

  const outputInterface = generateInterface(
    `${capitalize(toolName)}Response`,
    schema.response
  );

  // Generate function wrapper
  return `
import { callMCPTool } from "../../../client.js";

${inputInterface}

${outputInterface}

/**
 * ${schema.description}
 */
export async function ${toolName}(
  input: ${capitalize(toolName)}Input
): Promise<${capitalize(toolName)}Response> {
  return callMCPTool<${capitalize(toolName)}Response>(
    '${mcpServer}__${toolName}',
    input
  );
}
`;
}

function generateInterface(name: string, schema: JSONSchema): string {
  const fields = Object.entries(schema.properties || {})
    .map(([key, value]) => {
      const optional = !schema.required?.includes(key) ? '?' : '';
      const type = jsonSchemaToTS(value);
      return `  ${key}${optional}: ${type};`;
    })
    .join('\n');

  return `interface ${name} {\n${fields}\n}`;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
```

---

## Progressive Disclosure

### Three-Level Loading

**Level 1: Metadata** (always loaded)
```yaml
---
name: complex-skill
description: Multi-phase data processing skill
---
```
**Token cost**: 45 tokens

**Level 2: Core Instructions** (loaded when activated)
```markdown
# Core Instructions

## Step 1: Initial Processing
[Core logic here]

## Step 2: Validation
[Validation logic]

For advanced options, see advanced-options.md
```
**Token cost**: 1,500 tokens

**Level 3: Advanced Resources** (loaded on-demand)
```markdown
<!-- advanced-options.md -->
# Advanced Options

## Custom Filters
[Detailed filter specifications]

## Performance Tuning
[Optimization parameters]
```
**Token cost**: 2,000 tokens (only if Claude reads this file)

### Implementation

**SKILL.md**:
```markdown
---
name: progressive-skill
description: Example of progressive disclosure pattern
---

# Progressive Skill

## Basic Usage

For simple use cases, follow these steps:
1. Load data
2. Process with defaults
3. Return results

**Most users can stop here** (1,500 tokens loaded)

---

## Advanced Usage

For advanced options, read:
- `advanced-filters.md` - Custom filtering options
- `performance-tuning.md` - Optimization parameters
- `custom-transformations.md` - Extend with custom logic

Claude will only read these if needed (saves 5,000+ tokens)
```

**Token Savings**:
- Basic use: 1,545 tokens (metadata + core)
- Advanced use: 6,545 tokens (metadata + core + advanced files)
- **Savings: 5,000 tokens for 90% of use cases**

---

## Testing Your Skill

### Manual Testing

```bash
# 1. Create skill folder
mkdir -p ~/.claude/skills/test-skill

# 2. Create SKILL.md
cat > ~/.claude/skills/test-skill/SKILL.md << 'EOF'
---
name: test-skill
description: Test skill for validation. Use when user says "test skill".
---

# Test Skill

When user says "test skill", respond with: "Test skill activated successfully! ✅"
EOF

# 3. Start Claude Code
claude

# 4. Test activation
> "test skill"

# Expected output:
# Test skill activated successfully! ✅
```

### Automated Testing

**Create test suite**:
```typescript
// tests/skills/test-skill.test.ts
import { testSkillActivation } from '../utils/skill-tester';

describe('test-skill', () => {
  it('should activate on keyword trigger', async () => {
    const result = await testSkillActivation({
      skillName: 'test-skill',
      input: 'test skill',
      expectedActivation: true
    });

    expect(result.activated).toBe(true);
    expect(result.output).toContain('Test skill activated');
  });

  it('should NOT activate on unrelated input', async () => {
    const result = await testSkillActivation({
      skillName: 'test-skill',
      input: 'create a button component',
      expectedActivation: false
    });

    expect(result.activated).toBe(false);
  });

  it('should load within token budget', async () => {
    const tokens = await measureSkillTokens('test-skill');

    expect(tokens.metadata).toBeLessThan(100);
    expect(tokens.full).toBeLessThan(3000);
  });
});
```

### Validation Checklist

Before publishing your skill:

- [ ] **Description Quality**
  - [ ] Uses WHEN + WHEN NOT pattern
  - [ ] Clear, specific triggers
  - [ ] Explains what skill does

- [ ] **Instructions Clarity**
  - [ ] Step-by-step instructions
  - [ ] Concrete examples provided
  - [ ] Limitations documented

- [ ] **Token Efficiency**
  - [ ] Metadata <100 tokens
  - [ ] Full content <3,000 tokens
  - [ ] Uses progressive disclosure if complex

- [ ] **Code Quality** (if applicable)
  - [ ] Scripts are tested
  - [ ] Error handling included
  - [ ] Dependencies documented

- [ ] **Testing**
  - [ ] Manual activation test passed
  - [ ] Automated tests written
  - [ ] Token budget validated

- [ ] **Documentation**
  - [ ] README.md included
  - [ ] Examples provided
  - [ ] Usage instructions clear

---

## Examples

### Example 1: Simple Skill (Instructions Only)

**Use case**: Git commit message formatter

```markdown
---
name: git-commit-helper
description: >
  Generate conventional commit messages following Angular convention.
  Auto-invoke when user commits code or requests commit message help.
  Do NOT activate for general git operations (status, log, etc.).
---

# Git Commit Helper

## Overview

Generates commit messages following Conventional Commits specification.

## Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting, no code change
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

## Instructions

### Step 1: Analyze Changes
Review git diff to understand what changed.

### Step 2: Determine Type
Classify the change:
- New functionality → `feat`
- Bug fix → `fix`
- Documentation → `docs`
- Code cleanup → `refactor`

### Step 3: Write Subject
- Use imperative mood ("add" not "added")
- No period at end
- Max 50 characters
- Be specific

### Step 4: Add Body (if needed)
- Explain WHY, not WHAT
- Wrap at 72 characters
- Separate from subject with blank line

### Step 5: Add Footer (if applicable)
- Breaking changes: `BREAKING CHANGE: description`
- Issue references: `Closes #123`

## Examples

### Example 1: New Feature
```
feat(auth): add JWT token refresh mechanism

Implements automatic token refresh to improve UX.
Users no longer need to re-login every hour.

Closes #456
```

### Example 2: Bug Fix
```
fix(checkout): resolve cart total calculation error

Cart was including tax twice in total calculation.
Now correctly applies tax once.

Fixes #789
```

## Usage

When user is ready to commit:
1. Run `git diff` to see changes
2. Analyze the changes
3. Generate commit message in conventional format
4. Suggest git command:
   ```bash
   git commit -m "feat(scope): description"
   ```
```

**Token cost**:
- Metadata: 52 tokens
- Full: 890 tokens
- Total: 942 tokens ✅

### Example 2: Skill with Code

**Use case**: PDF form filler

```markdown
---
name: pdf-form-filler
description: >
  Extract and fill PDF form fields using Python script.
  Use when user needs to fill PDF forms, extract form data,
  or manipulate PDF documents.
  Do NOT use for simple PDF reading (use pdf-reader skill instead).
---

# PDF Form Filler

## Overview

Extracts form fields from PDFs and fills them programmatically using PyPDF2.

## Installation

Install dependencies:
```bash
cd ~/.claude/skills/pdf-form-filler
pip install -r requirements.txt
```

## Usage

### Extract Form Fields

```bash
python3 ./scripts/pdf-tools.py extract <input.pdf>
```

Output:
```json
{
  "fields": [
    { "name": "Name", "type": "text", "value": "" },
    { "name": "Email", "type": "text", "value": "" },
    { "name": "Agree", "type": "checkbox", "value": false }
  ]
}
```

### Fill Form Fields

```bash
python3 ./scripts/pdf-tools.py fill <input.pdf> <output.pdf> --data data.json
```

## Instructions for Claude

### Step 1: Extract Fields
```typescript
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const { stdout } = await execAsync(
  `python3 ~/.claude/skills/pdf-form-filler/scripts/pdf-tools.py extract input.pdf`
);

const fields = JSON.parse(stdout).fields;
console.log('Form fields:', fields);
```

### Step 2: Prepare Data
```typescript
const formData = {
  "Name": "John Doe",
  "Email": "john@example.com",
  "Agree": true
};

await fs.writeFile('./form-data.json', JSON.stringify(formData, null, 2));
```

### Step 3: Fill PDF
```typescript
await execAsync(
  `python3 ~/.claude/skills/pdf-form-filler/scripts/pdf-tools.py fill input.pdf output.pdf --data form-data.json`
);

console.log('✅ PDF form filled: output.pdf');
```

## Examples

### Example 1: Job Application
**Input**: "Fill out job application PDF with my details"
**Process**:
1. Extract fields from application.pdf
2. Map user details to form fields
3. Fill PDF with data
4. Save as application-filled.pdf

### Example 2: Batch Processing
**Input**: "Fill 100 W-9 forms with vendor data from CSV"
**Process**:
1. Load vendor data from CSV
2. For each vendor, extract W-9 fields
3. Map vendor data to fields
4. Generate filled PDF per vendor
5. Save to ./output/

## Limitations

- Only supports PDF forms with editable fields
- Does not create new form fields
- Requires PyPDF2 installation
```

**scripts/pdf-tools.py**:
```python
#!/usr/bin/env python3
import sys
import json
import argparse
from PyPDF2 import PdfReader, PdfWriter

def extract_fields(pdf_path):
    """Extract form fields from PDF"""
    reader = PdfReader(pdf_path)
    fields = []

    if "/AcroForm" in reader.trailer["/Root"]:
        for field in reader.get_fields().values():
            fields.append({
                "name": field.get("/T", ""),
                "type": field.get("/FT", ""),
                "value": field.get("/V", "")
            })

    return {"fields": fields}

def fill_fields(input_path, output_path, data_path):
    """Fill PDF form fields with data"""
    # Load data
    with open(data_path) as f:
        data = json.load(f)

    # Read PDF
    reader = PdfReader(input_path)
    writer = PdfWriter()

    # Copy pages
    for page in reader.pages:
        writer.add_page(page)

    # Fill fields
    if hasattr(writer, 'update_page_form_field_values'):
        for page in writer.pages:
            writer.update_page_form_field_values(page, data)

    # Write output
    with open(output_path, 'wb') as output_file:
        writer.write(output_file)

    return {"success": True, "output": output_path}

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("command", choices=["extract", "fill"])
    parser.add_argument("input_pdf")
    parser.add_argument("output_pdf", nargs="?")
    parser.add_argument("--data", help="Path to JSON data file")

    args = parser.parse_args()

    if args.command == "extract":
        result = extract_fields(args.input_pdf)
    elif args.command == "fill":
        result = fill_fields(args.input_pdf, args.output_pdf, args.data)

    print(json.dumps(result, indent=2))
```

**Token cost**:
- Metadata: 58 tokens
- Full instructions: 1,950 tokens
- **Scripts: 0 tokens** (executed, not loaded into context)
- Total: 2,008 tokens ✅

---

## Best Practices

### 1. Description Engineering

**Use WHEN + WHEN NOT pattern**:
```yaml
# ✅ Good
description: >
  Automatic code review for TypeScript React files.
  Auto-invoke WHEN user saves files in src/, lib/, app/ directories.
  Auto-invoke WHEN user explicitly requests code review.
  Do NOT load for test files, config files, or documentation.
  Do NOT load when editing markdown or JSON files.

# ❌ Bad
description: Code quality checking
```

**Use possessive pronouns for scoping**:
```yaml
# ✅ Good - Scoped to specific user
description: >
  Personal work preferences for John's projects.
  Auto-invoke when drafting HIS emails, planning HIS work,
  or discussing HIS collaboration approach.

# ❌ Bad - Too generic
description: Work preferences and collaboration style
```

### 2. Token Optimization

**Keep instructions concise**:
```markdown
# ✅ Good (300 tokens)
## Instructions
1. Parse user input
2. Validate format
3. Generate output
4. Return result

# ❌ Bad (1,500 tokens)
## Instructions
First, you need to carefully parse the user input by reading
each character and considering all possible interpretations.
Then, after you've thoroughly analyzed the input, you should
validate the format by checking if it matches any of the following
patterns: pattern1, pattern2, pattern3... [excessive detail]
```

**Use references instead of inline**:
```markdown
# ✅ Good
For detailed filter options, see filters-reference.md
(Loaded only if needed)

# ❌ Bad
Here are all 47 filter options with full descriptions:
[Embedded 3,000 token reference]
```

### 3. Skill Composition

**Declare dependencies**:
```yaml
---
name: api-security-tester
description: Security testing for API endpoints
dependencies:
  - security-auditor    # Load this first
  - api-designer        # For API context
---
```

**Declare composability**:
```yaml
---
name: code-reviewer
composability:
  - test-generator      # Works well together
  - performance-optimizer
  - security-auditor
---
```

**Result**: Claude loads related skills efficiently.

### 4. Testing

**Test activation accuracy**:
```bash
# Should activate
> "Review this code for security issues"
# ✅ security-auditor activated

# Should NOT activate
> "Review our business strategy"
# ❌ security-auditor NOT activated (correct)
```

**Test token usage**:
```typescript
const tokens = await measureSkillTokens('my-skill');
console.log('Metadata:', tokens.metadata);    // Should be <100
console.log('Full:', tokens.full);            // Should be <3000
```

### 5. Documentation

**Include README.md**:
```markdown
# My Skill

## What it does
Clear explanation of purpose

## When to use
Specific use cases

## Installation
```bash
# If skill has dependencies
cd ~/.claude/skills/my-skill
npm install
# or
pip install -r requirements.txt
```

## Examples
Real-world usage examples

## Troubleshooting
Common issues and solutions
```

---

## Advanced Topics

### Multi-File Skills

**Complex skill structure**:
```
advanced-skill/
├── SKILL.md                 # Core (1,500 tokens)
├── README.md                # Documentation
├── concepts/
│   ├── fundamentals.md      # Load if user is beginner
│   └── advanced.md          # Load if user is expert
├── workflows/
│   ├── workflow-1.md        # Specific workflow
│   └── workflow-2.md
├── scripts/
│   ├── analyze.py
│   ├── process.js
│   └── validate.sh
└── templates/
    ├── output-template.md
    └── report-template.html
```

**Progressive loading in SKILL.md**:
```markdown
## Instructions

### For Beginners
Read `concepts/fundamentals.md` for basic concepts.

### For Experts
Skip fundamentals, see `workflows/workflow-1.md` directly.

### Processing
Use `scripts/analyze.py` for data analysis.
Use `scripts/process.js` for transformations.

Claude loads only what's needed for current user level.
```

### Skill Hooks Integration

**Auto-activate on events**:
```yaml
---
name: auto-reviewer
triggers:
  - file_save           # Activate on file save
  - pre_commit          # Activate before git commit
  events:
    file_save:
      patterns:
        - "src/**/*.ts"   # Only TypeScript in src/
        - "lib/**/*.tsx"  # Only TSX in lib/
    pre_commit:
      exclude:
        - "*.md"          # Skip markdown
        - "*.json"        # Skip config
---
```

**Hook configuration** (generated in `.claude/settings.json`):
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write(src/**/*.ts)|Edit(src/**/*.ts)",
        "hooks": [
          {
            "type": "skill",
            "skill": "auto-reviewer"
          }
        ]
      }
    ],
    "PreCommit": [
      {
        "hooks": [
          {
            "type": "skill",
            "skill": "security-auditor"
          },
          {
            "type": "skill",
            "skill": "secret-scanner"
          }
        ]
      }
    ]
  }
}
```

---

## Publishing Your Skill

### Share with Team

**Option 1: Git Repository**
```bash
# Create skill repo
mkdir my-team-skills
cd my-team-skills
git init

# Add skills
mkdir -p skills/team-skill
cp -r ~/.claude/skills/team-skill skills/

# Commit and push
git add .
git commit -m "Add team skill"
git push origin main

# Team installation
git clone https://github.com/team/skills.git
cd skills
./install.sh
```

**Option 2: Plugin Bundle**
```bash
# Create plugin
code-assistant-claude create-plugin team-toolkit

# Add skills to plugin
cp -r ~/.claude/skills/skill-1 plugins/team-toolkit/skills/
cp -r ~/.claude/skills/skill-2 plugins/team-toolkit/skills/

# Publish
git push

# Team installation
/plugin marketplace add github.com/team/plugins
/plugin install team-toolkit
```

### Share with Community

**Submit to code-assistant marketplace**:
```bash
# Fork code-assistant repository
git clone https://github.com/your-fork/code-assistant

# Add skill to community skills
cp -r my-skill code-assistant/skills/community/

# Create PR
git checkout -b add-my-skill
git add skills/community/my-skill
git commit -m "Add my-skill to community skills"
git push
```

---

## Skill Templates

### Template 1: Analysis Skill

```markdown
---
name: analyzer-template
description: Template for analysis skills
---

# [Analysis Type] Analyzer

## Overview
Performs [specific analysis] on [target].

## When to Use
Use when user requests [trigger phrases].

## Instructions

### Step 1: Load Target
Use Read tool to access [target file/data].

### Step 2: Analyze
Apply [analysis methodology]:
- Check for [criterion 1]
- Verify [criterion 2]
- Assess [criterion 3]

### Step 3: Generate Report
Format findings as:
```
## Analysis Results

### ✅ Strengths
- [strength 1]

### ⚠️  Issues Found
- [issue 1]

### 💡 Recommendations
- [recommendation 1]
```

## Examples
[Concrete examples]

## Limitations
[What this skill doesn't do]
```

### Template 2: Generator Skill

```markdown
---
name: generator-template
description: Template for code/content generation skills
---

# [Output Type] Generator

## Overview
Generates [output type] following [standards/patterns].

## When to Use
Use when user requests [generation triggers].

## Instructions

### Step 1: Gather Requirements
Ask user for:
- [requirement 1]
- [requirement 2]

### Step 2: Generate Structure
Create [output structure]:
```
[example structure]
```

### Step 3: Fill Content
Populate with:
- [content type 1]
- [content type 2]

### Step 4: Validate
Check:
- [ ] [validation criterion 1]
- [ ] [validation criterion 2]

## Examples
[Generation examples]

## Customization
[How to customize output]
```

### Template 3: Workflow Skill

```markdown
---
name: workflow-template
description: Template for multi-step workflow skills
---

# [Workflow Name] Workflow

## Overview
Automates [workflow description] through [number] phases.

## When to Use
Use for [workflow trigger].

## Workflow Phases

### Phase 1: [Phase Name]
**Goal**: [Phase objective]

**Steps**:
1. [Step 1]
2. [Step 2]

**Output**: [Phase deliverable]

### Phase 2: [Phase Name]
**Goal**: [Phase objective]

**Steps**:
1. [Step 1]
2. [Step 2]

**Output**: [Phase deliverable]

### Phase 3: [Phase Name]
**Goal**: [Phase objective]

**Steps**:
1. [Step 1]
2. [Step 2]

**Output**: [Final deliverable]

## Complete Example
[End-to-end workflow example]

## Quality Gates
Between phases, verify:
- [ ] [Gate criterion 1]
- [ ] [Gate criterion 2]
```

---

## Next Steps

**You're now ready to create custom skills!**

**Recommended progression**:
1. ✅ Understand skill structure (this guide)
2. 🛠️ Create your first skill (use template)
3. 🧪 Test with manual activation
4. 📊 Measure token efficiency
5. 🚀 Share with team/community

**Further reading**:
- [Creating Commands](CREATING_COMMANDS.md) - Workflow automation
- [MCP Integration](MCP_INTEGRATION.md) - Connect external tools
- [Advanced Patterns](../api/ADVANCED_PATTERNS.md) - Expert techniques

---

**Need help?** Visit [GitHub Discussions](https://github.com/your-org/code-assistant/discussions)
