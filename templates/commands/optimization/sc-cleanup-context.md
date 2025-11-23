---
name: "sc-cleanup-context"
description: "Clean up conversation context and free tokens"
category: "optimization"
version: "1.0.0"

triggers:
  exact: "/sc:cleanup-context"
  aliases: ["/cleanup", "/clear"]
  keywords: ["cleanup", "clear context", "free tokens"]

requires:
  mcps: []

autoExecute: false
tokenEstimate: 2000
executionTime: "3-8s"
---

# /sc:cleanup-context - Context Cleanup

Intelligent context cleanup to free tokens while preserving important information.

## Cleanup Strategies

### Safe Cleanup (Default)
- Removes old messages (keep last 10)
- Clears completed task context
- Removes duplicate information
- Archives large code blocks

**Impact**: Minimal, safe for ongoing work
**Savings**: 5,000-10,000 tokens

### Moderate Cleanup
- All safe cleanup actions
- Reduces message history (keep last 5)
- Compresses remaining messages
- Removes inactive file context

**Impact**: Low, may lose some older context
**Savings**: 10,000-20,000 tokens

### Aggressive Cleanup
- All moderate cleanup actions
- Minimal message history (keep last 2)
- Removes all file context
- Unloads all inactive resources

**Impact**: Moderate, loses most context
**Savings**: 20,000-40,000 tokens

### Fresh Start
- Clears all context
- Keeps only system settings
- Unloads all resources
- Starts new session

**Impact**: High, complete reset
**Savings**: All tokens (back to baseline)

## Execution Flow

### 1. Analyze Current Context

```markdown
📊 Context Analysis

Current Context Size: 45,000 tokens

Breakdown:
├─ Messages (28,000 tokens)
│  ├─ Last 5 messages: 8,000 tokens (important)
│  ├─ Messages 6-10: 7,000 tokens (keep)
│  ├─ Messages 11-20: 9,000 tokens (can remove)
│  └─ Messages 21+: 4,000 tokens (can remove)
├─ File Context (12,000 tokens)
│  ├─ Active files: 5,000 tokens (keep)
│  ├─ Referenced files: 4,000 tokens (keep)
│  └─ Unused files: 3,000 tokens (can remove)
├─ Skills (6,500 tokens)
│  ├─ Active: 4,000 tokens (keep)
│  └─ Inactive: 2,500 tokens (can remove)
└─ MCPs (8,500 tokens)
   ├─ Used recently: 3,000 tokens (keep)
   └─ Unused: 5,500 tokens (can remove)

Removable: 24,000 tokens (53%)
```

### 2. Identify Cleanup Targets

**Messages**:
```
Age-based:
- Messages older than 30 min: 13,000 tokens
- Messages older than 1 hour: 8,000 tokens
- Messages older than 2 hours: 4,000 tokens

Importance-based:
- Low importance: 9,000 tokens
- Medium importance: 7,000 tokens
- High importance: 12,000 tokens
```

**Files**:
```
Usage-based:
- Not accessed in 20 messages: 3,000 tokens
- Not modified: 2,000 tokens
- Duplicate content: 1,500 tokens
```

**Resources**:
```
Activity-based:
- Inactive skills: 2,500 tokens
- Unused MCPs: 5,500 tokens
- Completed tasks: 1,200 tokens
```

### 3. Smart Cleanup Algorithm

```javascript
function smartCleanup(strategy = 'safe') {
  const priorities = {
    'keep': [
      'recent_messages',      // Last 10 messages
      'active_files',         // Currently editing
      'critical_context',     // Error messages, decisions
      'active_resources'      // Recently used skills/MCPs
    ],
    'compress': [
      'old_code_blocks',      // Summarize large code
      'repeated_info',        // Deduplicate
      'verbose_responses'     // Condense
    ],
    'remove': [
      'very_old_messages',    // >2 hours old
      'unused_files',         // Not accessed
      'inactive_resources',   // Not triggered
      'transient_data'        // Temporary results
    ]
  };

  return executeCleanu(priorities, strategy);
}
```

### 4. Cleanup Execution

```markdown
🧹 Cleanup Report

Strategy: Safe Cleanup
Duration: 5 seconds

Actions Taken:
✅ Removed 15 old messages (13,000 tokens)
✅ Cleared 3 unused files (3,000 tokens)
✅ Unloaded 1 inactive skill (2,500 tokens)
✅ Unloaded 2 unused MCPs (5,500 tokens)
✅ Compressed 5 large code blocks (2,000 tokens)

Results:
- Tokens freed: 26,000
- Context size: 45,000 → 19,000 (58% reduction)
- Important context: Preserved
- Active work: Unaffected

New State:
📊 Token Usage: 19,000 / 200,000 (9.5%) 🟢
```

## Usage Examples

### Basic Cleanup
```bash
/sc:cleanup-context

# Safe cleanup (default)
# Removes old messages and unused resources
# Preserves recent context
#
# Result: ~10,000 tokens freed
```

### Moderate Cleanup
```bash
/sc:cleanup-context --level moderate

# More aggressive cleanup
# Keeps last 5 messages
# Removes more context
#
# Result: ~20,000 tokens freed
```

### Aggressive Cleanup
```bash
/sc:cleanup-context --level aggressive

# Heavy cleanup
# Minimal message history
# Removes most context
#
# Result: ~40,000 tokens freed
```

### Fresh Start
```bash
/sc:cleanup-context --level fresh

# Complete reset
# Clears all context
# Back to baseline
#
# Result: All tokens freed
```

### Selective Cleanup
```bash
/sc:cleanup-context --keep messages --remove files

# Keep message history
# Remove file context only
```

```bash
/sc:cleanup-context --keep "last 15 messages"

# Keep specific number of messages
# Clean up everything else
```

### Preview Mode
```bash
/sc:cleanup-context --dry-run

# Shows what would be cleaned up
# No changes applied
# Useful for reviewing before cleanup
```

## Context Preservation

### Always Keep
```
Critical Context (Never Removed):
- System configuration
- User preferences
- Current task definition
- Active file being edited
- Recent errors/warnings
- Important decisions made
- Security context
```

### Conditionally Keep
```
Important Context (Keep based on age/usage):
- Last 10 messages (safe)
- Last 5 messages (moderate)
- Last 2 messages (aggressive)
- Referenced files
- Active skills/MCPs
- Pending tasks
```

### Safe to Remove
```
Removable Context:
- Very old messages (>2 hours)
- Completed tasks
- Unused file context
- Inactive skills
- Unused MCPs
- Temporary calculations
- Duplicate information
```

## Compression Techniques

### Message Compression
```markdown
Before (1,500 tokens):
User: Can you help me implement a user authentication system with JWT tokens?
I need it to support login, logout, and refresh tokens. Also need to handle
password hashing with bcrypt and store sessions in Redis. The API should be
RESTful and follow best practices.