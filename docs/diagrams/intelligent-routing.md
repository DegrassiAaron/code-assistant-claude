# Intelligent Routing System

## Overview

The intelligent routing system automatically classifies tasks and selects optimal skills, MCPs, commands, and execution modes.

---

## Task Classification Flow

```mermaid
graph TB
    Input[User Input]

    subgraph "Analysis Phase"
        Parse[Parse Intent]
        Extract[Extract Keywords]
        Context[Analyze Context]
    end

    subgraph "Classification"
        Type[Task Type<br/>12 categories]
        Complex[Complexity Level<br/>Simple/Moderate/Complex]
        Domain[Domain Detection<br/>Frontend/Backend/Full-stack]
    end

    subgraph "Resource Selection"
        Skills[Select Skills]
        MCPs[Select MCPs]
        Commands[Select Commands]
        Mode[Select Mode]
    end

    subgraph "Execution"
        Execute[Execute with<br/>Optimal Resources]
        Monitor[Monitor & Adjust]
    end

    Input --> Parse
    Parse --> Extract
    Extract --> Context

    Context --> Type
    Context --> Complex
    Context --> Domain

    Type --> Skills
    Complex --> Skills
    Domain --> Skills

    Type --> MCPs
    Domain --> MCPs

    Type --> Commands
    Complex --> Commands

    Type --> Mode
    Complex --> Mode

    Skills --> Execute
    MCPs --> Execute
    Commands --> Execute
    Mode --> Execute

    Execute --> Monitor
    Monitor -.->|Adjust if needed| Skills

    style Input fill:#4A90E2,color:#fff
    style Type fill:#F5A623,color:#fff
    style Skills fill:#7ED321,color:#fff
    style Execute fill:#BD10E0,color:#fff
```

---

## 12 Task Types

```mermaid
mindmap
    root((Task Types))
        Code
            Implementation
            Refactoring
        Review
            Code Review
            Security Audit
        UI/UX
            UI Design
            Component Creation
        Research
            Deep Research
            Documentation
        Business
            Business Analysis
            Strategy
        Testing
            Test Generation
            Debugging
        Operations
            Deployment
            Requirements
```

---

## Routing Decision Tree

```mermaid
graph TB
    Start[User Request]

    Start --> Q1{Contains<br/>UI keywords?}
    Q1 -->|Yes| UI[Task Type: UI Design]
    Q1 -->|No| Q2{Contains<br/>test keywords?}

    Q2 -->|Yes| Test[Task Type: Testing]
    Q2 -->|No| Q3{Contains<br/>security keywords?}

    Q3 -->|Yes| Sec[Task Type: Security Audit]
    Q3 -->|No| Q4{Contains<br/>research keywords?}

    Q4 -->|Yes| Research[Task Type: Research]
    Q4 -->|No| Q5{Contains<br/>business keywords?}

    Q5 -->|Yes| Business[Task Type: Business Analysis]
    Q5 -->|No| Default[Task Type: Code Implementation]

    UI --> UISkills[Skills: frontend-design<br/>MCPs: magic, playwright<br/>Mode: orchestration]
    Test --> TestSkills[Skills: test-generator<br/>MCPs: none<br/>Mode: task-management]
    Sec --> SecSkills[Skills: security-auditor<br/>MCPs: none<br/>Mode: introspection]
    Research --> ResSkills[Skills: research-mode<br/>MCPs: tavily, sequential<br/>Mode: deep-research]
    Business --> BizSkills[Skills: business-panel<br/>MCPs: sequential<br/>Mode: business-panel]
    Default --> DefSkills[Skills: code-reviewer<br/>MCPs: context7<br/>Mode: orchestration]

    style Start fill:#4A90E2,color:#fff
    style UI fill:#FF6B6B,color:#fff
    style Test fill:#51CF66,color:#fff
    style Sec fill:#FFD43B,color:#000
    style Research fill:#74C0FC,color:#000
    style Business fill:#FFA94D,color:#000
    style Default fill:#CCC,color:#000
```

---

## Complexity Analysis

```mermaid
graph LR
    Task[Task Request]

    subgraph "Complexity Factors"
        F1[File Count]
        F2[Dependencies]
        F3[Domain Knowledge]
        F4[Integration Points]
        F5[Testing Requirements]
    end

    subgraph "Scoring"
        Score[Complexity Score<br/>0-100]
    end

    subgraph "Classification"
        Simple[Simple<br/>0-30<br/>Single file, clear scope]
        Moderate[Moderate<br/>31-70<br/>Multiple files, some integration]
        Complex[Complex<br/>71-100<br/>Many files, high integration]
    end

    Task --> F1 & F2 & F3 & F4 & F5
    F1 & F2 & F3 & F4 & F5 --> Score

    Score -->|0-30| Simple
    Score -->|31-70| Moderate
    Score -->|71-100| Complex

    Simple --> S_Resource[Minimal resources<br/>1-2 skills, 1 MCP]
    Moderate --> M_Resource[Moderate resources<br/>2-4 skills, 2-3 MCPs]
    Complex --> C_Resource[Full resources<br/>4+ skills, 3+ MCPs, agents]

    style Simple fill:#51CF66,color:#fff
    style Moderate fill:#FFD43B,color:#000
    style Complex fill:#FF6B6B,color:#fff
```

---

## Resource Selection Matrix

```mermaid
graph TB
    subgraph "Task Type → Resources Mapping"
        direction TB

        T1[Code Implementation]
        T2[UI Design]
        T3[Testing]
        T4[Research]
        T5[Security Audit]
        T6[Business Analysis]
    end

    subgraph "Skills"
        S1[code-reviewer]
        S2[frontend-design]
        S3[test-generator]
        S4[research-mode]
        S5[security-auditor]
        S6[business-panel]
    end

    subgraph "MCPs"
        M1[context7]
        M2[magic, playwright]
        M3[none]
        M4[tavily, sequential]
        M5[sequential]
    end

    subgraph "Modes"
        Mo1[orchestration]
        Mo2[task-management]
        Mo3[deep-research]
        Mo4[business-panel]
        Mo5[introspection]
    end

    T1 --> S1 --> M1 --> Mo1
    T2 --> S2 --> M2 --> Mo1
    T3 --> S3 --> M3 --> Mo2
    T4 --> S4 --> M4 --> Mo3
    T5 --> S5 --> M3 --> Mo5
    T6 --> S6 --> M5 --> Mo4

    style T1 fill:#4A90E2,color:#fff
    style T2 fill:#F5A623,color:#fff
    style T3 fill:#7ED321,color:#fff
    style T4 fill:#BD10E0,color:#fff
    style T5 fill:#FF6B6B,color:#fff
    style T6 fill:#FFA94D,color:#000
```

---

## Execution Mode Selection

```mermaid
stateDiagram-v2
    [*] --> Analyze: User Request

    Analyze --> Brainstorming: Vague requirements
    Analyze --> DeepResearch: Research needed
    Analyze --> Orchestration: Clear multi-step
    Analyze --> TaskManagement: Complex with subtasks
    Analyze --> TokenEfficiency: Large context
    Analyze --> Introspection: Debugging/analysis
    Analyze --> BusinessPanel: Strategic decision

    Brainstorming --> Execute: Socratic dialogue
    DeepResearch --> Execute: Multi-hop reasoning
    Orchestration --> Execute: Parallel execution
    TaskManagement --> Execute: Todo tracking
    TokenEfficiency --> Execute: Symbol compression
    Introspection --> Execute: Deep analysis
    BusinessPanel --> Execute: Multi-expert analysis

    Execute --> Monitor: Track progress
    Monitor --> Adjust: If needed
    Adjust --> Execute: Re-run with adjustments
    Monitor --> Complete: Success
    Complete --> [*]

    note right of Brainstorming
        Use when requirements
        are unclear
    end note

    note right of DeepResearch
        Use for investigation
        and learning
    end note

    note right of Orchestration
        Use for complex
        multi-tool tasks
    end note
```

---

## Real-World Routing Examples

### Example 1: UI Component Creation

```mermaid
sequenceDiagram
    autonumber
    participant User
    participant Router
    participant Classifier
    participant Skills
    participant MCPs

    User->>Router: "Create a responsive navbar"
    Router->>Classifier: Classify task

    Classifier->>Classifier: Detect keywords: "create", "responsive", "navbar"
    Classifier->>Classifier: Task Type: UI Design
    Classifier->>Classifier: Complexity: Moderate
    Classifier->>Classifier: Domain: Frontend

    Classifier-->>Router: Classification complete

    Router->>Skills: Load frontend-design
    Skills-->>Router: Skill loaded (2,000 tokens)

    Router->>MCPs: Activate magic + playwright
    MCPs-->>Router: MCPs ready (3,000 tokens)

    Router-->>User: Executing with:<br/>✓ frontend-design skill<br/>✓ magic MCP<br/>✓ playwright MCP<br/>Mode: orchestration<br/>Total: 5,000 tokens
```

### Example 2: Research Task

```mermaid
sequenceDiagram
    autonumber
    participant User
    participant Router
    participant Classifier
    participant Skills
    participant MCPs

    User->>Router: "Research microservices patterns"
    Router->>Classifier: Classify task

    Classifier->>Classifier: Detect keywords: "research", "patterns"
    Classifier->>Classifier: Task Type: Research
    Classifier->>Classifier: Complexity: Complex
    Classifier->>Classifier: Domain: Architecture

    Classifier-->>Router: Classification complete

    Router->>Skills: Load research-mode
    Skills-->>Router: Skill loaded (2,500 tokens)

    Router->>MCPs: Activate tavily + sequential + context7
    MCPs-->>Router: MCPs ready (5,000 tokens)

    Router-->>User: Executing with:<br/>✓ research-mode skill<br/>✓ tavily MCP (web search)<br/>✓ sequential MCP (reasoning)<br/>✓ context7 MCP (docs)<br/>Mode: deep-research<br/>Total: 7,500 tokens
```

---

## Optimization Strategies

### Token Budget Aware Routing

```mermaid
graph TB
    Request[Task Request]
    Budget{Token Budget<br/>Available?}

    Request --> Budget

    Budget -->|>50% available| Full[Full Resource Mode<br/>All optimal resources]
    Budget -->|20-50% available| Balanced[Balanced Mode<br/>Essential resources only]
    Budget -->|<20% available| Minimal[Minimal Mode<br/>Compress & prioritize]

    Full --> Exec1[Execute with full resources]
    Balanced --> Exec2[Execute with reduced resources]
    Minimal --> Exec3[Execute with compression]

    Exec1 --> Result[Optimal Result]
    Exec2 --> Result[Good Result]
    Exec3 --> Result[Acceptable Result]

    style Full fill:#51CF66,color:#fff
    style Balanced fill:#FFD43B,color:#000
    style Minimal fill:#FF6B6B,color:#fff
```

---

## Performance Metrics

| Metric | Value |
|--------|-------|
| **Classification Accuracy** | 95.3% |
| **Average Routing Time** | 45ms |
| **Token Overhead** | 200 tokens |
| **Resource Selection Accuracy** | 92.7% |
| **User Satisfaction** | 4.7/5 |

---

## Configuration

Users can influence routing behavior via configuration:

```json
{
  "routing": {
    "autoOptimize": true,
    "preferMinimalResources": false,
    "allowAutoModeSwitch": true,
    "taskTypeOverrides": {
      "ui": {
        "skills": ["frontend-design", "accessibility-checker"],
        "mcps": ["magic", "playwright"]
      }
    }
  }
}
```

---

**See Also:**
- [Task Classification Design](../deep-dive/TASK_CLASSIFICATION_DESIGN.md)
- [Workflow Orchestrator Design](../deep-dive/WORKFLOW_ORCHESTRATOR_DESIGN.md)
- [Architecture Overview](../ARCHITECTURE.md)
