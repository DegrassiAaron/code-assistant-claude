# Installation Workflow

## Overview

Complete installation and setup process from initial install to production-ready configuration.

---

## Installation Flow

```mermaid
flowchart TB
    Start([User starts installation]) --> Install[npm install -g<br/>code-assistant-claude]

    Install --> Verify{Verify<br/>installation}
    Verify -->|Failed| Error1[Show error message]
    Error1 --> Troubleshoot[Provide troubleshooting guide]
    Verify -->|Success| Init[code-assistant-claude init]

    Init --> ProjectAnalysis[Project Analysis Phase]

    ProjectAnalysis --> DetectTech[Detect Tech Stack]
    DetectTech --> DetectGit[Detect Git Workflow]
    DetectGit --> DetectDocs[Read Documentation]
    DetectDocs --> GenerateProfile[Generate Project Profile]

    GenerateProfile --> Wizard[Interactive Wizard]

    Wizard --> Q1{Installation<br/>Scope?}
    Q1 -->|Local| LocalOnly[.claude/ only]
    Q1 -->|Global| GlobalOnly[~/.claude/ only]
    Q1 -->|Both| BothScopes[Both locations]

    LocalOnly & GlobalOnly & BothScopes --> Q2{Verbosity<br/>Mode?}

    Q2 -->|Verbose| Verbose[0% compression]
    Q2 -->|Balanced| Balanced[50% compression]
    Q2 -->|Compressed| Compressed[90% compression]

    Verbose & Balanced & Compressed --> SkillSelect[Select Skills]

    SkillSelect --> Recommended[Show Recommended<br/>Based on Project]
    Recommended --> CustomSkills{Add Custom<br/>Skills?}
    CustomSkills -->|Yes| AddSkills[Select Additional Skills]
    CustomSkills -->|No| MCPConfig[Configure MCPs]
    AddSkills --> MCPConfig

    MCPConfig --> Security[Security Settings]
    Security --> Validation[Validate Configuration]

    Validation --> Valid{Valid?}
    Valid -->|No| ShowErrors[Show Errors]
    ShowErrors --> Wizard
    Valid -->|Yes| Generate[Generate Configuration]

    Generate --> WriteConfig[Write .claude/ files]
    WriteConfig --> InstallDeps[Install Dependencies]
    InstallDeps --> TestConfig[Test Configuration]

    TestConfig --> TestResult{All tests<br/>passed?}
    TestResult -->|No| ShowIssues[Show Issues & Fixes]
    ShowIssues --> Wizard
    TestResult -->|Yes| Success[✅ Setup Complete]

    Success --> ShowSummary[Show Configuration Summary]
    ShowSummary --> End([Ready to Use])

    style Start fill:#4A90E2,color:#fff
    style Success fill:#51CF66,color:#fff
    style End fill:#51CF66,color:#fff
    style Error1 fill:#FF6B6B,color:#fff
```

---

## Project Analysis Deep Dive

```mermaid
sequenceDiagram
    autonumber
    participant CLI
    participant FileSystem
    participant Analyzer
    participant GitAnalyzer
    participant DocAnalyzer
    participant Profile

    CLI->>FileSystem: Scan project directory

    par Tech Stack Detection
        FileSystem->>Analyzer: Read package.json
        FileSystem->>Analyzer: Read requirements.txt
        FileSystem->>Analyzer: Read Cargo.toml
        FileSystem->>Analyzer: Read go.mod
    end

    Analyzer->>Analyzer: Determine primary language
    Analyzer->>Analyzer: Detect frameworks
    Analyzer-->>CLI: Tech stack identified

    CLI->>GitAnalyzer: Analyze Git workflow

    GitAnalyzer->>FileSystem: Check branch structure
    GitAnalyzer->>FileSystem: Read .git/config
    GitAnalyzer->>GitAnalyzer: Detect workflow pattern

    alt GitFlow detected
        GitAnalyzer-->>CLI: GitFlow (develop/master)
    else GitHub Flow detected
        GitAnalyzer-->>CLI: GitHub Flow (main + features)
    else Trunk-based detected
        GitAnalyzer-->>CLI: Trunk-based (main only)
    end

    CLI->>DocAnalyzer: Read documentation

    par Documentation Analysis
        DocAnalyzer->>FileSystem: Read CLAUDE.md
        DocAnalyzer->>FileSystem: Read README.md
        DocAnalyzer->>FileSystem: Read docs/
        DocAnalyzer->>FileSystem: Read CONTRIBUTING.md
    end

    DocAnalyzer->>DocAnalyzer: Extract project purpose
    DocAnalyzer->>DocAnalyzer: Extract coding standards
    DocAnalyzer->>DocAnalyzer: Extract team conventions
    DocAnalyzer-->>CLI: Documentation profile

    CLI->>Profile: Generate comprehensive profile
    Profile-->>CLI: Project profile complete

    Note over CLI,Profile: Profile includes:<br/>- Tech stack<br/>- Git workflow<br/>- Project purpose<br/>- Standards<br/>- Team size<br/>- Recommended config
```

---

## Configuration Generation

```mermaid
graph TB
    Profile[Project Profile]

    subgraph "Skill Selection"
        S1{Project Type?}
        S1 -->|React/Vue/Angular| Frontend[frontend-design<br/>test-generator<br/>accessibility-checker]
        S1 -->|Node.js/Express| Backend[api-designer<br/>security-auditor<br/>db-optimizer]
        S1 -->|Full-stack| Fullstack[All above +<br/>integration-tester]
    end

    subgraph "MCP Selection"
        M1{Language?}
        M1 -->|JavaScript/TS| JSMCPs[magic<br/>playwright<br/>eslint]
        M1 -->|Python| PyMCPs[ruff<br/>black<br/>pytest]
        M1 -->|Multi-language| AllMCPs[context7<br/>sequential<br/>serena]
    end

    subgraph "Command Selection"
        C1{Workflow?}
        C1 -->|GitFlow| GitFlowCmds[/sc:feature<br/>/sc:release<br/>/sc:hotfix]
        C1 -->|GitHub Flow| GHFlowCmds[/sc:implement<br/>/sc:review<br/>/sc:deploy]
        C1 -->|Both| AllCmds[All workflow commands]
    end

    Profile --> S1 & M1 & C1

    Frontend & Backend & Fullstack --> Config[Generate .claude/<br/>Configuration]
    JSMCPs & PyMCPs & AllMCPs --> Config
    GitFlowCmds & GHFlowCmds & AllCmds --> Config

    Config --> Validate[Validate & Test]
    Validate --> Output[Ready to Use]

    style Profile fill:#4A90E2,color:#fff
    style Config fill:#F5A623,color:#fff
    style Output fill:#51CF66,color:#fff
```

---

## Interactive Wizard Screens

### Screen 1: Installation Scope

```mermaid
graph LR
    subgraph "Installation Scope Selection"
        Title[Where should we install?]

        Local[📁 Local Only<br/>.claude/ in project<br/>Project-specific config]
        Global[🌍 Global Only<br/>~/.claude/<br/>Shared across projects]
        Both[🔄 Both<br/>Global base + local overrides<br/>Recommended]

        Title --> Local & Global & Both
    end

    Local --> Impact1[Impact: This project only]
    Global --> Impact2[Impact: All projects]
    Both --> Impact3[Impact: Best of both worlds]

    style Both fill:#51CF66,color:#fff
```

### Screen 2: Verbosity Mode

```mermaid
graph TB
    subgraph "Verbosity Mode Selection"
        Title[Choose communication style:]

        Verbose[💬 Verbose<br/>Full detailed explanations<br/>~200K tokens/session<br/>Best for learning]

        Balanced[⚖️ Balanced<br/>Moderate compression<br/>~100K tokens/session<br/>Recommended]

        Compressed[🎯 Compressed<br/>Symbol-based communication<br/>~20K tokens/session<br/>Maximum efficiency]

        Title --> Verbose & Balanced & Compressed
    end

    Verbose --> V_Save[Token Savings: 0%]
    Balanced --> B_Save[Token Savings: 50%]
    Compressed --> C_Save[Token Savings: 90%]

    style Balanced fill:#FFD43B,color:#000
    style Compressed fill:#51CF66,color:#fff
```

---

## Generated File Structure

```mermaid
graph TB
    subgraph ".claude/ Directory"
        Root[.claude/]

        Files[Files Created]
        Dirs[Directories Created]

        Root --> Files
        Root --> Dirs

        Files --> F1[CLAUDE.md<br/>Project context]
        Files --> F2[settings.json<br/>Configuration]
        Files --> F3[.mcp.json<br/>MCP servers]

        Dirs --> D1[skills/<br/>Progressive loading]
        Dirs --> D2[commands/<br/>Slash commands]
        Dirs --> D3[agents/<br/>Sub-agents]
    end

    subgraph "Skill Files"
        D1 --> S1[code-reviewer/]
        D1 --> S2[frontend-design/]
        D1 --> S3[test-generator/]

        S1 --> S1F[SKILL.md<br/>resources/]
    end

    subgraph "Command Files"
        D2 --> C1[sc-implement.md]
        D2 --> C2[sc-review.md]
        D2 --> C3[sc-feature.md]
    end

    subgraph "Agent Files"
        D3 --> A1[code-reviewer-agent.md]
        D3 --> A2[test-engineer-agent.md]
    end

    style Root fill:#4A90E2,color:#fff
    style Files fill:#F5A623,color:#fff
    style Dirs fill:#7ED321,color:#fff
```

---

## Validation & Testing

```mermaid
sequenceDiagram
    autonumber
    participant Config
    participant Validator
    participant FS
    participant MCP
    participant Skills

    Config->>Validator: Validate configuration

    Validator->>Validator: Check JSON syntax
    Validator->>Validator: Validate schema

    alt Invalid schema
        Validator-->>Config: ❌ Errors found
    else Valid schema
        Validator->>FS: Test file permissions
        FS-->>Validator: ✅ Permissions OK

        Validator->>MCP: Test MCP connectivity
        MCP-->>Validator: ✅ MCPs accessible

        Validator->>Skills: Test skill loading
        Skills-->>Validator: ✅ Skills loadable

        Validator-->>Config: ✅ All tests passed
    end
```

---

## Post-Installation Summary

```mermaid
graph TB
    Success[✅ Setup Complete]

    subgraph "Configuration Summary"
        Sum1[📦 Installed Skills: 5]
        Sum2[🔌 Configured MCPs: 3]
        Sum3[⚡ Commands Available: 12]
        Sum4[🎯 Token Optimization: 90%]
    end

    subgraph "Estimated Savings"
        Sav1[💰 Cost per Session: $0.15<br/>vs $0.60 traditional]
        Sav2[⚡ Token Usage: 20K<br/>vs 200K traditional]
        Sav3[📊 Efficiency: 10x more<br/>tasks per budget]
    end

    subgraph "Next Steps"
        Next1[1. Read Quick Start Guide]
        Next2[2. Try: /sc:optimize-tokens]
        Next3[3. Create first component]
    end

    Success --> Sum1 & Sum2 & Sum3 & Sum4
    Sum1 & Sum2 & Sum3 & Sum4 --> Sav1 & Sav2 & Sav3
    Sav1 & Sav2 & Sav3 --> Next1 & Next2 & Next3

    style Success fill:#51CF66,color:#fff
    style Sav1 fill:#4A90E2,color:#fff
    style Sav2 fill:#4A90E2,color:#fff
    style Sav3 fill:#4A90E2,color:#fff
```

---

## Troubleshooting During Installation

```mermaid
graph TB
    Issue{Installation<br/>Issue?}

    Issue -->|Command not found| I1[Check npm global bin in PATH]
    Issue -->|Permission denied| I2[Use npm prefix configuration]
    Issue -->|MCP not found| I3[MCPs install on first use]
    Issue -->|Skill load error| I4[Verify skill directory structure]

    I1 --> Fix1[export PATH=$PATH:$(npm config get prefix)/bin]
    I2 --> Fix2[npm config set prefix ~/.npm-global]
    I3 --> Fix3[npx -y @modelcontextprotocol/server-*]
    I4 --> Fix4[Check .claude/skills/*/SKILL.md exists]

    Fix1 & Fix2 & Fix3 & Fix4 --> Retry[Retry Installation]
    Retry --> Success[✅ Resolved]

    style Issue fill:#FFD43B,color:#000
    style Success fill:#51CF66,color:#fff
```

---

## Performance Metrics

| Phase | Time | Description |
|-------|------|-------------|
| **npm install** | 30s | Download and install package |
| **Project Analysis** | 15s | Detect tech stack and workflow |
| **Interactive Wizard** | 2-3min | User answers prompts |
| **Configuration Gen** | 10s | Generate .claude/ files |
| **Dependency Install** | 30s | Install required MCPs |
| **Validation** | 5s | Test configuration |
| **Total** | **4-5min** | Complete setup |

---

## Best Practices

### For Solo Developers

- Choose **Both** installation scope for flexibility
- Start with **Balanced** verbosity mode
- Accept recommended skills (can add more later)
- Enable all optimizations

### For Teams

- Use **Global** installation for shared base config
- Each dev can have **Local** overrides
- Document custom skills in team wiki
- Share plugin configurations

---

**See Also:**
- [Installation Guide](../user-guides/01-installation.md)
- [Quick Start Tutorial](../user-guides/02-quick-start.md)
- [Configuration Guide](../user-guides/03-configuration.md)
