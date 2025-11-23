---
name: "task-management-mode"
version: "1.0.0"
description: "Hierarchical task organization with persistent memory and progress tracking"
author: "SuperClaude Framework"
category: "superclaude"

triggers:
  keywords: ["plan", "organize", "tasks", "todo", "project"]
  patterns: ["create.*plan", "organize.*tasks"]
  commands: ["/sc:plan", "/sc:tasks"]

tokenCost:
  metadata: 36
  fullContent: 1500
  resources: 200

dependencies:
  skills: []
  mcps: ["serena"]

composability:
  compatibleWith: ["orchestration-mode", "brainstorming-mode"]
  conflictsWith: []

context:
  projectTypes: []
  minNodeVersion: "18.0.0"
  requiredTools: []

priority: "medium"
autoActivate: false
cacheStrategy: "normal"
---

# Task Management Mode

Hierarchical task breakdown, progress tracking, and persistent memory.

## Features

### 1. Task Hierarchy
Organize tasks in parent-child relationships:
```
Project: User Authentication System
├── Epic: Backend API
│   ├── Task: Create auth endpoints
│   │   ├── Subtask: POST /login
│   │   ├── Subtask: POST /register
│   │   └── Subtask: POST /refresh
│   └── Task: Implement JWT handling
│
├── Epic: Frontend UI
│   ├── Task: Login component
│   └── Task: Registration form
│
└── Epic: Security
    ├── Task: Input validation
    └── Task: Rate limiting
```

### 2. Progress Tracking
Monitor completion at all levels:
- Individual subtask completion
- Parent task aggregation
- Epic-level progress
- Overall project status

### 3. Persistent Memory
Store and recall:
- Project context
- Decision history
- Implementation details
- Lessons learned

## Task Structure

```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  priority: 'high' | 'medium' | 'low';
  dependencies: string[];
  subtasks: Task[];
  estimatedTokens?: number;
  actualTokens?: number;
  completedAt?: Date;
  blockedBy?: string;
}
```

## Usage Example

```
User: "Plan the implementation of a real-time chat system"

Task Management Mode:

📋 Project Plan: Real-Time Chat System
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 Epic 1: Core Infrastructure (Priority: High)
├─ [PENDING] Setup WebSocket server
│  Estimated: 5,000 tokens
│  Dependencies: None
│
├─ [PENDING] Database schema for messages
│  Estimated: 3,000 tokens
│  Dependencies: None
│
└─ [PENDING] Redis for pub/sub
   Estimated: 4,000 tokens
   Dependencies: WebSocket server

🎨 Epic 2: Frontend Components (Priority: High)
├─ [PENDING] Chat message list
│  Estimated: 6,000 tokens
│  Dependencies: WebSocket client
│
├─ [PENDING] Message input
│  Estimated: 3,000 tokens
│  Dependencies: None
│
└─ [PENDING] User list sidebar
   Estimated: 4,000 tokens
   Dependencies: None

🔒 Epic 3: Security & Auth (Priority: High)
├─ [PENDING] JWT authentication
│  Estimated: 5,000 tokens
│  Dependencies: None
│
└─ [PENDING] Message encryption
   Estimated: 7,000 tokens
   Dependencies: JWT auth

Total Estimated: 37,000 tokens
Ready to start? [Y/n]
```

## Memory Integration

Uses Serena MCP to:
- Persist task state across sessions
- Recall previous decisions
- Track implementation patterns
- Store project-specific context

## Progress Report

```
📊 Project Progress Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Overall: 12/24 tasks completed (50%)

Epic 1: Core Infrastructure
├─ Status: 4/6 completed (67%)
├─ Tokens: 15,234 / 18,000 (85%)
└─ Blocking: None

Epic 2: Frontend Components
├─ Status: 5/10 completed (50%)
├─ Tokens: 22,451 / 28,000 (80%)
└─ Blocking: WebSocket integration

Epic 3: Security & Auth
├─ Status: 3/8 completed (38%)
├─ Tokens: 8,932 / 22,000 (41%)
└─ Blocking: Backend API completion

Next Priority:
1. Complete WebSocket integration (unblocks 3 tasks)
2. Finish backend API (unblocks security epic)
3. Implement remaining UI components
```

## Integration

Works seamlessly with:
- Orchestration Mode (for execution)
- Serena MCP (for persistence)
- Brainstorming Mode (for planning)
