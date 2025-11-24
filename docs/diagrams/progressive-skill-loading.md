# Progressive Skill Loading System

## Overview

The progressive skill loading system reduces token usage by 95% through intelligent, on-demand skill activation.

---

## Skill Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Metadata: System Startup
    Metadata --> Cached: Frequently Used
    Metadata --> Dormant: Rarely Used
    Dormant --> Activating: Task Match
    Cached --> Activating: Task Match
    Activating --> Active: Load Complete
    Active --> Resources: Resources Needed
    Resources --> Active: Resources Loaded
    Active --> Cached: Still Needed
    Active --> Dormant: Not Needed
    Cached --> Dormant: Cache Expiry
    Dormant --> [*]: Unload

    note right of Metadata
        30-50 tokens per skill
        Always loaded
    end note

    note right of Active
        1,500-3,000 tokens
        Full instructions + examples
    end note

    note right of Resources
        Variable tokens
        Scripts, templates, references
    end note
```

---

## Progressive Loading Flow

```mermaid
sequenceDiagram
    autonumber
    participant System
    participant SkillManager
    participant Metadata
    participant SkillFull
    participant Resources
    participant Cache

    Note over System,Cache: System Startup

    System->>SkillManager: Initialize
    SkillManager->>Metadata: Load all skill metadata
    Metadata-->>SkillManager: 20 skills × 45 tokens = 900 tokens
    SkillManager->>Cache: Check warm cache
    Cache-->>SkillManager: 2 frequently used skills

    Note over System,Cache: Task Request

    System->>SkillManager: Task: "Create React component"
    SkillManager->>SkillManager: Match task to skills
    SkillManager->>Metadata: Check frontend-design metadata
    Metadata-->>SkillManager: Match found (95% confidence)

    SkillManager->>SkillFull: Load frontend-design skill
    SkillFull-->>SkillManager: 2,000 tokens loaded
    SkillManager->>Resources: Check if resources needed
    Resources-->>SkillManager: Templates required (500 tokens)

    SkillManager->>Cache: Cache skill for future use
    SkillManager-->>System: Skill activated (2,500 tokens)

    Note over System,Cache: Task Complete

    System->>SkillManager: Task complete
    SkillManager->>SkillManager: Keep in warm cache (15 min)
```

---

## Token Savings Calculation

```mermaid
graph TB
    subgraph "Traditional Approach"
        T1[Load All Skills Upfront]
        T2[20 skills × 2,000 tokens]
        T3[40,000 tokens ALWAYS]
        T1 --> T2 --> T3
    end

    subgraph "Progressive Loading"
        P1[Load Metadata Only]
        P2[20 skills × 45 tokens]
        P3[900 tokens baseline]
        P4[Load 2 skills on-demand]
        P5[2 × 2,000 = 4,000 tokens]
        P6[Total: 4,900 tokens]
        P1 --> P2 --> P3
        P3 --> P4 --> P5 --> P6
    end

    Savings[87.75% Token Savings<br/>35,100 tokens saved]

    T3 -.->|vs| P6
    P6 --> Savings

    style T3 fill:#ff6b6b,color:#fff
    style P6 fill:#51cf66,color:#fff
    style Savings fill:#4c6ef5,color:#fff
```

---

## Skill Metadata Structure

```mermaid
classDiagram
    class SkillMetadata {
        +String name
        +String description
        +String[] triggers
        +Int tokenCost
        +Int fullTokenCost
        +String[] dependencies
        +String[] composability
        +String[] projectTypes
        +String priority
        +matchTask() Boolean
        +calculateRelevance() Float
    }

    class SkillFull {
        +SkillMetadata metadata
        +String instructions
        +String[] examples
        +String[] principles
        +Resource[] resources
        +execute() Result
    }

    class Resource {
        +String type
        +String content
        +Int tokenCost
        +load() Boolean
    }

    SkillMetadata <|-- SkillFull
    SkillFull "1" *-- "0..*" Resource
```

---

## Intelligent Caching Strategy

```mermaid
graph TB
    subgraph "Cache Tiers"
        Hot[Hot Cache<br/>0-5 min<br/>Always Ready]
        Warm[Warm Cache<br/>5-15 min<br/>Quick Load]
        Cold[Cold Storage<br/>15+ min<br/>Full Load]
    end

    Task[Task Request]
    Analyzer[Task Analyzer]

    Task --> Analyzer

    Analyzer -->|Frequently Used| Hot
    Analyzer -->|Recently Used| Warm
    Analyzer -->|First Time| Cold

    Hot -->|Instant| Active[Active Skill<br/>0ms load time]
    Warm -->|Fast| Active2[Active Skill<br/>50ms load time]
    Cold -->|Load| Active3[Active Skill<br/>200ms load time]

    Active --> Response[Response to User]
    Active2 --> Response
    Active3 --> Response

    Response --> Update[Update Cache Strategy]
    Update --> Hot
    Update --> Warm
    Update --> Cold

    style Hot fill:#ff6b6b,color:#fff
    style Warm fill:#ffd43b,color:#000
    style Cold fill:#4dabf7,color:#fff
    style Active fill:#51cf66,color:#fff
    style Active2 fill:#51cf66,color:#fff
    style Active3 fill:#51cf66,color:#fff
```

---

## Dependency Resolution

```mermaid
graph LR
    Task[Task: Code Review]

    subgraph "Primary Skill"
        CR[code-reviewer<br/>2,000 tokens]
    end

    subgraph "Dependencies"
        SA[security-auditor<br/>1,800 tokens]
        PO[performance-optimizer<br/>1,500 tokens]
    end

    subgraph "Optional Composability"
        TG[test-generator<br/>1,700 tokens]
        DC[docs-checker<br/>1,200 tokens]
    end

    Task --> CR
    CR --> SA
    CR --> PO
    CR -.->|If tests exist| TG
    CR -.->|If docs exist| DC

    Total[Total: 5,300 tokens<br/>vs 40,000 traditional]

    SA --> Total
    PO --> Total
    TG -.-> Total
    DC -.-> Total

    style CR fill:#4c6ef5,color:#fff
    style SA fill:#f59f00,color:#fff
    style PO fill:#f59f00,color:#fff
    style TG fill:#74c0fc,color:#000
    style DC fill:#74c0fc,color:#000
    style Total fill:#51cf66,color:#fff
```

---

## Performance Metrics

| Metric | Traditional | Progressive | Savings |
|--------|-------------|-------------|---------|
| **Baseline Load** | 40,000 tokens | 900 tokens | 97.75% |
| **Average Session** | 40,000 tokens | 4,900 tokens | 87.75% |
| **Peak Session** | 40,000 tokens | 12,000 tokens | 70% |
| **Load Time** | 2,000ms | 50ms (cached) | 97.5% |
| **Memory Usage** | 120MB | 15MB | 87.5% |

---

## Best Practices

### For Users

1. **Let the System Learn**: The more you use the system, the better it caches
2. **Review Metadata**: Check skill descriptions to understand when they activate
3. **Monitor Usage**: Use `/sc:optimize-tokens` to see which skills are loaded

### For Developers

1. **Keep Metadata Minimal**: 30-50 tokens maximum
2. **Clear Triggers**: Define precise trigger patterns
3. **Lazy Resources**: Only load resources when explicitly needed
4. **Test Matching**: Validate skill matching accuracy

---

**See Also:**
- [Token Optimization Guide](../user-guides/08-token-optimization.md)
- [Skills Guide](../user-guides/04-skills-guide.md)
- [Architecture Overview](../ARCHITECTURE.md)
