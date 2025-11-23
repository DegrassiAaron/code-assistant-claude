---
name: "token-efficiency-mode"
version: "1.0.0"
description: "Symbol systems and compression for 30-50% token reduction"
author: "SuperClaude Framework"
category: "superclaude"

triggers:
  keywords: ["compress", "optimize tokens", "reduce tokens"]
  patterns: ["save.*tokens", "token.*budget"]
  commands: ["/sc:compress", "/sc:optimize-tokens"]

tokenCost:
  metadata: 34
  fullContent: 1400
  resources: 350

dependencies:
  skills: []
  mcps: []

composability:
  compatibleWith: []
  conflictsWith: []

context:
  projectTypes: []
  minNodeVersion: "18.0.0"
  requiredTools: []

priority: "low"
autoActivate: false
cacheStrategy: "aggressive"
---

# Token Efficiency Mode

Aggressive token optimization through symbol systems and semantic compression.

## Symbol System

Replace verbose text with compact symbols:

### Status Symbols
- ✅ Success/Completed
- ❌ Error/Failed
- ⚠️ Warning
- ℹ️ Info
- 🔄 In Progress
- ⏸️ Paused
- 🚫 Blocked

### Action Symbols
- → Next/Then
- ← Back/Previous
- ⬆️ Increase/Up
- ⬇️ Decrease/Down
- ➕ Add
- ➖ Remove
- 🔍 Search/Inspect
- 🔧 Fix/Configure

### Code Symbols
- 📁 Directory
- 📄 File
- 🔑 Key/Important
- 💾 Database
- 🌐 Network/API
- 🔒 Security
- ⚡ Performance
- 🧪 Test

## Compression Techniques

### 1. Abbreviated References
```
Before (verbose):
"The function calculateUserMetrics in the file src/analytics/metrics.ts"

After (compressed):
"calculateUserMetrics (src/analytics/metrics.ts)"

Savings: 40% (~12 tokens)
```

### 2. Tabular Format
```
Before (verbose):
Feature 1 has a status of completed with high priority.
Feature 2 has a status of in progress with medium priority.
Feature 3 has a status of pending with low priority.

After (compressed):
Feature | Status | Priority
1       | ✅     | High
2       | 🔄     | Medium
3       | ⏸️     | Low

Savings: 65% (~25 tokens)
```

### 3. Nested Lists
```
Before (prose):
The project has three main components. The first is the backend API which includes authentication and data management. The second is the frontend interface which includes the user dashboard and settings page. The third is the database layer which includes the schema and migrations.

After (compressed):
Project:
├─ Backend API
│  ├─ Authentication
│  └─ Data management
├─ Frontend
│  ├─ Dashboard
│  └─ Settings
└─ Database
   ├─ Schema
   └─ Migrations

Savings: 50% (~30 tokens)
```

### 4. Code Blocks
```
Before (explanation):
You need to import the useState hook from React, then declare a state variable called count initialized to 0, and a function to update it.

After (code):
import { useState } from 'react';
const [count, setCount] = useState(0);

Savings: 45% (~15 tokens)
```

## Token Budget Visualization

```
📊 Budget: 50K tokens
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Used:    ████████░░░░░░░░░░░░ 20K (40%)
System:  ██░░░░░░░░░░░░░░░░░░  5K (10%)
Reserve: ░░░░░░░░░░░░░░░░░░░░ 25K (50%)

💡 Recommendations:
→ Can activate 2 more skills (6K tokens)
→ 19K tokens available for implementation
→ Reserve buffer: healthy (50%)
```

## Compression Example

### Verbose Mode (2,345 tokens)
```
I have analyzed the codebase and found several issues that need to be addressed. First, there is a potential security vulnerability in the authentication module located in the file src/auth/login.ts at line 45 where user input is not being properly validated before being used in a database query. This could lead to SQL injection attacks. Second, there is a performance issue in the user profile component located in src/components/UserProfile.tsx where the component is re-rendering unnecessarily on every state change, which could be optimized using React.memo. Third, there are several code quality issues including inconsistent naming conventions and missing error handling in multiple places throughout the codebase.
```

### Compressed Mode (892 tokens)
```
🔍 Code Analysis:

🚨 SECURITY (src/auth/login.ts:45)
→ SQL injection risk: unvalidated user input
Fix: Use parameterized queries

⚡ PERFORMANCE (src/components/UserProfile.tsx)
→ Unnecessary re-renders
Fix: Apply React.memo

⚠️ CODE QUALITY
→ Inconsistent naming
→ Missing error handling

Tokens saved: 1,453 (62%)
```

## When to Use

Token Efficiency Mode is ideal for:
- Token budget constraints (<30% remaining)
- Large-scale reviews or reports
- Repetitive information
- Technical documentation
- Status updates

**Note**: Use sparingly - clarity is more important than compression for complex explanations.

## Integration

Automatically activated when:
- Token budget <30%
- User requests compression
- Large batch operations
- Report generation
