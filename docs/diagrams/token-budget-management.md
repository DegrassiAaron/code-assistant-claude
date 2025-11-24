# Token Budget Management

## Overview

The token budget management system ensures efficient use of the 200K token context window through dynamic allocation, monitoring, and optimization.

---

## Token Budget Allocation

```mermaid
pie title Token Budget Distribution (200K Total)
    "Working Context (75%)" : 150000
    "Dynamic Resources (15%)" : 30000
    "System Layer (5%)" : 10000
    "Reserved Buffer (5%)" : 10000
```

---

## Budget Allocation Strategy

```mermaid
graph TB
    Total[Total Budget<br/>200,000 tokens]

    subgraph "Reserved (5%)"
        R1[Emergency Buffer<br/>10,000 tokens]
        R2[Always available<br/>for critical operations]
        R1 --- R2
    end

    subgraph "System (5%)"
        S1[System Prompt: 2,000]
        S2[SuperClaude Modes: 3,000]
        S3[Symbol Definitions: 5,000]
    end

    subgraph "Dynamic (15%)"
        D1[MCP Servers: 15,000<br/>On-demand loading]
        D2[Skills: 10,000<br/>Progressive activation]
        D3[Agents: 5,000<br/>As-needed spawning]
    end

    subgraph "Working (75%)"
        W1[Conversation: 100,000<br/>User messages + responses]
        W2[Context: 30,000<br/>Code files, docs]
        W3[Buffer: 20,000<br/>Temporary operations]
    end

    Total --> R1
    Total --> S1 & S2 & S3
    Total --> D1 & D2 & D3
    Total --> W1 & W2 & W3

    style Total fill:#4A90E2,color:#fff
    style R1 fill:#FF6B6B,color:#fff
    style D1 fill:#FFD43B,color:#000
    style W1 fill:#51CF66,color:#fff
```

---

## Real-Time Monitoring Dashboard

```mermaid
graph LR
    subgraph "Current Usage"
        U1[System: 2,500 tokens 1.3%]
        U2[MCPs: 6,500 tokens 3.3%]
        U3[Skills: 3,500 tokens 1.8%]
        U4[Messages: 8,000 tokens 4.0%]
        U5[Context: 4,500 tokens 2.3%]
    end

    Total[Total: 25,000 tokens<br/>12.5% used]

    subgraph "Status"
        Status[🟢 Healthy<br/>175,000 available]
    end

    U1 & U2 & U3 & U4 & U5 --> Total
    Total --> Status

    subgraph "Recommendations"
        Rec1[✓ Budget healthy]
        Rec2[✓ No optimization needed]
        Rec3[✓ All systems nominal]
    end

    Status --> Rec1 & Rec2 & Rec3

    style Total fill:#4A90E2,color:#fff
    style Status fill:#51CF66,color:#fff
```

---

## Dynamic Adjustment Flow

```mermaid
sequenceDiagram
    autonumber
    participant Monitor
    participant Analyzer
    participant Optimizer
    participant Resources

    loop Every 5 seconds
        Monitor->>Analyzer: Check token usage
        Analyzer->>Analyzer: Calculate percentages

        alt Usage < 50%
            Analyzer-->>Monitor: Status: Healthy 🟢
        else Usage 50-75%
            Analyzer->>Optimizer: Status: Warning 🟡
            Optimizer->>Optimizer: Analyze loaded resources
            Optimizer->>Resources: Unload rarely used skills
            Resources-->>Optimizer: 2,000 tokens freed
            Optimizer-->>Monitor: Optimized
        else Usage > 75%
            Analyzer->>Optimizer: Status: Critical 🔴
            Optimizer->>Optimizer: Emergency cleanup
            Optimizer->>Resources: Unload non-essential MCPs
            Optimizer->>Resources: Compress message history
            Optimizer->>Resources: Clear temp context
            Resources-->>Optimizer: 15,000 tokens freed
            Optimizer-->>Monitor: Crisis averted
        end
    end
```

---

## Token Saving Strategies

```mermaid
graph TB
    subgraph "Strategy 1: MCP Code Execution"
        M1[Traditional MCP: 150K tokens]
        M2[Code Execution: 2K tokens]
        M3[Savings: 98.7%]
        M1 --> M2 --> M3
    end

    subgraph "Strategy 2: Progressive Skills"
        S1[All Skills Loaded: 40K tokens]
        S2[Progressive Loading: 4.9K tokens]
        S3[Savings: 87.75%]
        S1 --> S2 --> S3
    end

    subgraph "Strategy 3: Symbol Compression"
        Y1[Verbose Mode: 10K tokens]
        Y2[Symbol Mode: 6K tokens]
        Y3[Savings: 40%]
        Y1 --> Y2 --> Y3
    end

    subgraph "Strategy 4: Smart Context"
        C1[Full File Context: 20K tokens]
        C2[Relevant Sections: 5K tokens]
        C3[Savings: 75%]
        C1 --> C2 --> C3
    end

    Combined[Combined Savings<br/>Average: 90%]

    M3 --> Combined
    S3 --> Combined
    Y3 --> Combined
    C3 --> Combined

    style M3 fill:#BD10E0,color:#fff
    style S3 fill:#7ED321,color:#fff
    style Y3 fill:#F5A623,color:#fff
    style C3 fill:#4A90E2,color:#fff
    style Combined fill:#51CF66,color:#fff
```

---

## Usage Patterns Over Time

```mermaid
graph LR
    subgraph "Session Start"
        Start1[System: 2K]
        Start2[Total: 2K 1%]
        Start1 --> Start2
    end

    subgraph "Task 1: UI Component"
        T1_1[+Skills: 4K]
        T1_2[+MCPs: 3K]
        T1_3[+Context: 2K]
        T1_4[Total: 11K 5.5%]
        T1_1 --> T1_2 --> T1_3 --> T1_4
    end

    subgraph "Task 2: Code Review"
        T2_1[+Skills: 3K]
        T2_2[+Context: 5K]
        T2_3[Total: 19K 9.5%]
        T2_1 --> T2_2 --> T2_3
    end

    subgraph "Task 3: Research"
        T3_1[+Skills: 2.5K]
        T3_2[+MCPs: 5K]
        T3_3[+Context: 8K]
        T3_4[Total: 34.5K 17.3%]
        T3_1 --> T3_2 --> T3_3 --> T3_4
    end

    subgraph "Auto-Cleanup"
        Clean1[-Unused Skills: -4K]
        Clean2[-Old Context: -3K]
        Clean3[Total: 27.5K 13.8%]
        Clean1 --> Clean2 --> Clean3
    end

    Start2 --> T1_4 --> T2_3 --> T3_4 --> Clean3

    style Start2 fill:#51CF66,color:#fff
    style T1_4 fill:#51CF66,color:#fff
    style T2_3 fill:#51CF66,color:#fff
    style T3_4 fill:#FFD43B,color:#000
    style Clean3 fill:#51CF66,color:#fff
```

---

## Optimization Triggers

```mermaid
stateDiagram-v2
    [*] --> Monitor: Start Monitoring

    Monitor --> Healthy: <50% used
    Monitor --> Warning: 50-75% used
    Monitor --> Critical: >75% used

    Healthy --> Monitor: Continue

    Warning --> AnalyzeWarning: Identify candidates
    AnalyzeWarning --> UnloadSoft: Soft cleanup
    UnloadSoft --> Monitor: Re-check

    Critical --> AnalyzeCritical: Emergency analysis
    AnalyzeCritical --> UnloadHard: Aggressive cleanup
    UnloadHard --> Compress: Compress history
    Compress --> Monitor: Re-check

    note right of Healthy
        No action needed
        All systems optimal
    end note

    note right of Warning
        Unload rarely used skills
        Clear old temp context
    end note

    note right of Critical
        Unload non-essential MCPs
        Compress message history
        Clear all temp data
    end note
```

---

## Cost Analysis

### Token Cost Breakdown

```mermaid
graph TB
    subgraph "Input Tokens (Cheaper)"
        I1[System Prompt: $0.003 per 1K]
        I2[User Messages: $0.003 per 1K]
        I3[Skills/MCPs: $0.003 per 1K]
    end

    subgraph "Output Tokens (More Expensive)"
        O1[Claude Responses: $0.015 per 1K]
        O2[Generated Code: $0.015 per 1K]
    end

    subgraph "Session Cost Example"
        Session[Typical Session]
        Input[25K input tokens<br/>$0.075]
        Output[5K output tokens<br/>$0.075]
        Total[Total: $0.15]
    end

    I1 & I2 & I3 --> Input
    O1 & O2 --> Output
    Session --> Input
    Session --> Output
    Input --> Total
    Output --> Total

    subgraph "Traditional Approach"
        TradInput[150K input tokens<br/>$0.45]
        TradOutput[10K output tokens<br/>$0.15]
        TradTotal[Total: $0.60]
    end

    Savings[Cost Savings<br/>75% reduction<br/>$0.45 saved per session]

    Total -.->|vs| TradTotal
    TradTotal --> Savings

    style Total fill:#51CF66,color:#fff
    style TradTotal fill:#FF6B6B,color:#fff
    style Savings fill:#4A90E2,color:#fff
```

---

## Budget Health States

```mermaid
graph LR
    subgraph "Health States"
        H1[🟢 Healthy<br/>0-50% used<br/>No action needed]
        H2[🟡 Warning<br/>50-75% used<br/>Soft optimization]
        H3[🔴 Critical<br/>75-90% used<br/>Hard optimization]
        H4[⚫ Emergency<br/>90-100% used<br/>Emergency cleanup]
    end

    H1 -->|Usage increases| H2
    H2 -->|Usage increases| H3
    H3 -->|Usage increases| H4

    H2 -->|Cleanup successful| H1
    H3 -->|Cleanup successful| H2
    H4 -->|Cleanup successful| H3

    style H1 fill:#51CF66,color:#fff
    style H2 fill:#FFD43B,color:#000
    style H3 fill:#FF9F43,color:#fff
    style H4 fill:#FF6B6B,color:#fff
```

---

## CLI Commands for Budget Management

### View Current Budget
```bash
# Show detailed token breakdown
claude /sc:optimize-tokens

# Output:
📊 Token Budget Status
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Budget:     200,000 tokens
Current Usage:     25,000 tokens (12.5%)
Available:        175,000 tokens (87.5%)

Breakdown:
├─ System:          2,500 tokens (1.3%)
├─ MCPs (active):   6,500 tokens (3.3%)
├─ Skills (loaded): 3,500 tokens (1.8%)
├─ Messages:        8,000 tokens (4.0%)
└─ Context:         4,500 tokens (2.3%)

Status: 🟢 Healthy
```

### Manual Optimization
```bash
# Force cleanup
claude /sc:cleanup-context

# Compress messages
claude /sc:mode compressed
```

---

## Best Practices

### For Maximum Efficiency

1. **Use Compressed Mode** when possible (30-50% savings)
2. **Monitor Regularly** with `/sc:optimize-tokens`
3. **Enable Auto-Cleanup** in settings
4. **Leverage MCP Code Execution** (98.7% savings)
5. **Use Progressive Skills** (95% savings vs always-loaded)

### Configuration

```json
{
  "tokenManagement": {
    "autoOptimize": true,
    "warningThreshold": 0.5,
    "criticalThreshold": 0.75,
    "autoCleanup": true,
    "compressionMode": "balanced"
  }
}
```

---

## Performance Metrics

| Metric | Traditional | Optimized | Improvement |
|--------|-------------|-----------|-------------|
| **Average Session** | 200K tokens | 20K tokens | 90% |
| **Cost per Session** | $0.60 | $0.15 | 75% |
| **Sessions per Budget** | 1 | 10 | 10x |
| **Context Remaining** | 0% | 90% | +90% |

---

**See Also:**
- [Token Optimization Guide](../user-guides/08-token-optimization.md)
- [Token Efficiency Layer](../reference/TOKEN_EFFICIENCY_LAYER.md)
- [Architecture Overview](../ARCHITECTURE.md)
