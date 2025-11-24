# Getting Started with Code-Assistant-Claude

Complete installation and setup guide for the intelligent Claude Code configuration framework.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [First-Time Setup](#first-time-setup)
4. [Verify Installation](#verify-installation)
5. [Your First Session](#your-first-session)
6. [Understanding Token Savings](#understanding-token-savings)
7. [Next Steps](#next-steps)

---

## Prerequisites

### Required

✅ **Node.js 18.0.0 or higher**
```bash
node --version
# v18.0.0 or higher required
```

✅ **Claude Code CLI installed**
```bash
# If not installed, visit:
# https://www.claude.com/product/claude-code
```

✅ **npm or yarn**
```bash
npm --version
# or
yarn --version
```

### Recommended

- **Git** - For version control integration
- **Docker** - For secure sandbox execution (optional but recommended)
- **Anthropic API Key** - For Claude Code access

---

## Installation

### Option 1: NPM (Recommended)

```bash
# Install globally
npm install -g code-assistant-claude

# Verify installation
code-assistant-claude --version
# v1.0.0
```

### Option 2: From Source

```bash
# Clone repository
git clone https://github.com/your-org/code-assistant-claude.git
cd code-assistant-claude

# Install dependencies
npm install

# Build
npm run build

# Link globally
npm link

# Verify
code-assistant-claude --version
```

---

## First-Time Setup

### Step 1: Navigate to Your Project

```bash
cd your-project-directory
```

### Step 2: Run Interactive Setup

```bash
code-assistant-claude init
```

### Step 3: Handle Existing Configuration (if any)

```
⚠️  Existing Claude Code Configuration Detected

Found configurations in:
• Global: ~/.claude/ (12 skills, 8 commands, 5 agents)
• Local: ./.claude/ (3 skills, 2 commands)

? What would you like to do?
  ○ Keep existing and merge with code-assistant
  ○ Reset to vanilla and install fresh (⚠️  creates backup)
❯ ○ Cancel installation
```

**Recommendations**:
- **First time using code-assistant**: Choose "Reset to vanilla" for clean slate
- **Have important customizations**: Choose "Merge with existing"
- **Unsure**: Choose "Cancel" and backup manually first

### Step 4: Project Analysis

```
┌─────────────────────────────────────────────────────────────────┐
│ 🔍 Step 1/7: Project Analysis                                   │
└─────────────────────────────────────────────────────────────────┘

Analyzing project structure...

✅ Detected Tech Stack:
   • TypeScript React Application
   • Node.js 18.x
   • Testing: Jest + React Testing Library
   • Build: Vite
   • State: Redux Toolkit
   • Routing: React Router v6

Analyzing workflow patterns (git history, file structure):
   • UI component creation: 42% of commits
   • Bug fixes: 28% of commits
   • API integration: 18% of commits
   • Testing: 12% of commits

⏱️  Analysis complete (3.2 seconds)
```

### Step 5: Resource Recommendations

```
┌─────────────────────────────────────────────────────────────────┐
│ 🎯 Step 2/7: Intelligent Resource Recommendation                │
└─────────────────────────────────────────────────────────────────┘

Based on your project, we recommend:

Skills (Auto-activate when relevant):
✅ frontend-design        UI best practices, eliminates "AI slop"
✅ code-reviewer          Automatic quality checks on file save
✅ test-generator         React Testing Library test generation
✅ security-auditor       Input validation, XSS prevention
✅ performance-optimizer   Performance analysis and fixes

MCP Servers (Dynamic loading):
✅ magic                  21st.dev UI components
✅ serena                 Project memory & symbol operations
✅ sequential             Multi-step reasoning (--think mode)
✅ playwright             E2E testing & visual validation
✅ context7               React/Redux official documentation

Commands (Workflow shortcuts):
✅ /sc:scaffold          Component generation with tests
✅ /sc:review            Multi-persona code review
✅ /sc:test              Auto-generate and run tests
✅ /sc:implement         Full feature implementation

SuperClaude Framework:
✅ All 6 behavioral modes
✅ Business Panel (9 expert thought leaders)
✅ Symbol systems for token compression

Estimated Token Savings:
• MCP Code Execution: 98.7% reduction
• Progressive Skills: 95% reduction
• Symbol System: 30-50% in compressed mode
• Total Average: 60-70% per session

? Continue with this configuration? [Y/n]
```

### Step 6: Configuration Preferences

```
┌─────────────────────────────────────────────────────────────────┐
│ ⚙️  Step 3/7: Configuration Preferences                          │
└─────────────────────────────────────────────────────────────────┘

? Where should configurations be saved?
  ○ Local (project only) - ./.claude/
  ○ Global (all projects) - ~/.claude/
❯ ○ Both (local overrides global)

? Default verbosity mode?
  ○ Verbose - Detailed explanations (~50K tokens/session)
❯ ○ Balanced - Optimized detail (~35K tokens/session)
  ○ Compressed - Minimal output (~25K tokens/session)

? Enable automatic token optimization?
❯ ○ Yes - Auto-disable unused MCPs, cleanup context
  ○ No - Manual optimization only

? Security level for code execution?
  ○ Maximum - VM isolation (slowest, safest)
❯ ○ High - Docker isolation (balanced)
  ○ Moderate - Process isolation (fastest, dev only)
```

### Step 7: Installing Resources

```
┌─────────────────────────────────────────────────────────────────┐
│ 📦 Step 4/7: Installing Resources                               │
└─────────────────────────────────────────────────────────────────┘

Installing skills...
✅ code-reviewer → ~/.claude/skills/code-reviewer/
✅ test-generator → ~/.claude/skills/test-generator/
✅ frontend-design → ~/.claude/skills/frontend-design/
✅ security-auditor → ~/.claude/skills/security-auditor/
✅ performance-optimizer → ~/.claude/skills/performance-optimizer/

Installing commands...
✅ /sc:implement → ~/.claude/commands/sc-implement.md
✅ /sc:scaffold → ~/.claude/commands/sc-scaffold.md
✅ /sc:review → ~/.claude/commands/sc-review.md
✅ /sc:test → ~/.claude/commands/sc-test.md

Installing agents...
✅ code-reviewer-agent → ~/.claude/agents/code-reviewer-agent.md
✅ test-engineer-agent → ~/.claude/agents/test-engineer-agent.md
✅ deep-research-agent → ~/.claude/agents/deep-research-agent.md

Configuring MCP servers...
✅ Magic MCP configured
✅ Serena MCP configured
✅ Sequential MCP configured
✅ Playwright MCP configured
✅ Context7 MCP configured

Generating project context...
✅ Created: ./.claude/CLAUDE.md

⏱️  Installation complete (12.4 seconds)
```

### Step 8: Validation

```
┌─────────────────────────────────────────────────────────────────┐
│ ✅ Step 5/7: Validation                                          │
└─────────────────────────────────────────────────────────────────┘

Testing configuration...
✅ Skills discoverable
✅ Commands registered
✅ Agents accessible
✅ MCP servers connected
✅ Token optimization active

Running health checks...
✅ Serena MCP connected
✅ Sequential MCP connected
✅ Magic MCP connected
✅ Playwright MCP connected
✅ Context7 MCP connected

Estimating baseline...
✅ Baseline token usage: 48,500 tokens/session
✅ Optimized token usage: 16,200 tokens/session
✅ Estimated savings: 66.6% per session

All checks passed! ✅
```

### Step 9: Setup Complete

```
┌─────────────────────────────────────────────────────────────────┐
│ 🎉 Installation Complete!                                       │
└─────────────────────────────────────────────────────────────────┘

Code Assistant Claude is now configured for your project!

📊 Configuration Summary:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Skills:       5 installed  (progressive loading)
Commands:     4 available  (workflow automation)
Agents:       3 configured (specialized analysis)
MCPs:         5 connected  (dynamic loading)
Modes:        7 available  (SuperClaude + Business Panel)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 Try These Commands:

Development:
• "Create a user profile component"
  → Auto-activates: frontend-design skill + Magic MCP

• "/sc:implement user authentication"
  → Full workflow: planning → coding → testing

Research & Analysis:
• "/sc:research best React patterns 2025"
  → Deep research: Tavily + Sequential + citations

• "/sc:business-panel @strategy.pdf"
  → 9-expert strategic analysis

Optimization:
• "/sc:optimize-tokens"
  → View token usage breakdown + recommendations

• "/sc:optimize-mcp"
  → Optimize MCP server configuration

📖 Documentation: Run 'code-assistant-claude docs' or visit docs/
🆘 Help: Run 'code-assistant-claude --help'

Happy coding! 🚀
```

---

## Verify Installation

### Check Installed Components

```bash
# List all installed skills
ls ~/.claude/skills/
# code-reviewer  test-generator  frontend-design  security-auditor  performance-optimizer

# List all commands
ls ~/.claude/commands/
# sc-implement.md  sc-scaffold.md  sc-review.md  sc-test.md

# List all agents
ls ~/.claude/agents/
# code-reviewer-agent.md  test-engineer-agent.md  deep-research-agent.md

# Check MCP configuration
cat ~/.claude/.mcp.json
```

### Test Configuration

```bash
# Start Claude Code
claude

# Test skill activation
> "Review this code for security issues"
# Should activate: security-auditor skill ✅

# Test command
> /sc:optimize-tokens
# Should show token usage dashboard ✅

# Test MCP
> "Search for React hooks documentation"
# Should use: Context7 MCP ✅
```

### View Configuration

```bash
# Show current configuration
code-assistant-claude config

📊 Current Configuration
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Version:        1.0.0
Install Date:   2025-11-23
Scope:          Both (global + local)

Skills (5):
├─ code-reviewer        (2,000 tokens when loaded)
├─ test-generator       (1,800 tokens)
├─ frontend-design      (1,500 tokens)
├─ security-auditor     (2,200 tokens)
└─ performance-optimizer (1,900 tokens)

MCPs (5):
├─ magic        (1,500 tokens) - Dynamic
├─ serena       (500 tokens)   - Always loaded
├─ sequential   (3,000 tokens) - Dynamic
├─ playwright   (2,500 tokens) - Dynamic
└─ context7     (2,500 tokens) - Dynamic

Commands (4):
├─ /sc:implement
├─ /sc:scaffold
├─ /sc:review
└─ /sc:test

Modes (7):
├─ Brainstorming
├─ Deep Research
├─ Orchestration
├─ Task Management
├─ Token Efficiency
├─ Introspection
└─ Business Panel

Verbosity: Balanced
Optimization: Auto-enabled
Security: Docker sandbox
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Your First Session

### Example 1: Create UI Component

**What you type**:
```
Create a responsive user profile card with avatar, name, bio, and social links
```

**What happens automatically**:
```
🎯 Intelligent Routing Activated

Task Analysis:
├─ Type: UI Development
├─ Complexity: Moderate
└─ Domains: frontend, accessibility

Resource Selection:
✅ Skill: frontend-design (loaded, 1,500 tokens)
✅ MCP: magic (activated, 1,500 tokens)
✅ MCP: playwright (for testing, 2,500 tokens)
✅ Command: /sc:scaffold react-component
✅ Mode: Orchestration

Generating UserProfileCard component...

Generated:
├─ src/components/UserProfileCard/
│  ├─ UserProfileCard.tsx          ✅ Component with shadcn/ui
│  ├─ UserProfileCard.test.tsx     ✅ React Testing Library tests
│  ├─ UserProfileCard.stories.tsx  ✅ Storybook stories
│  ├─ types.ts                     ✅ TypeScript interfaces
│  └─ index.ts                     ✅ Barrel export

Running tests...
✅ All 8 tests passing
✅ Coverage: 94%

Token Usage: 5,800 tokens (vs 52,000 traditional)
Time: 42 seconds
```

### Example 2: Research Task

**What you type**:
```
/sc:research "microservices architecture best practices 2025"
```

**What happens automatically**:
```
🔬 Deep Research Mode Activated

Planning research strategy...
✅ Multi-hop plan created (4 hops)
✅ Token budget allocated: 25,000 tokens

Executing research...

Hop 1: Initial broad search (Tavily)
├─ Query: "microservices best practices 2025"
├─ Results: 15 sources found
└─ Tokens: 2,500

Hop 2: Targeted follow-ups (Tavily + Context7)
├─ Official documentation (Spring Boot, NestJS)
├─ Industry reports (ThoughtWorks, Martin Fowler)
└─ Tokens: 4,200

Hop 3: Deep analysis (Sequential MCP)
├─ Synthesis across sources
├─ Identify patterns and contradictions
└─ Tokens: 5,800

Hop 4: Validation and gaps (Tavily)
├─ Fill information gaps
├─ Verify conclusions
└─ Tokens: 2,100

Synthesizing findings...

Report saved: claudedocs/research_microservices_2025-11-23.md

📊 Research Summary:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sources: 15 (8 tier-1, 5 tier-2, 2 tier-3)
Confidence: 0.87 (High)
Key Findings: 8
Contradictions: 2 (resolved)
Token Usage: 14,600 (vs 85,000 traditional)
Time: 2m 15s
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Top Recommendations:
1. API Gateway pattern for service communication
2. Saga pattern for distributed transactions
3. Circuit breaker for resilience
[... more recommendations ...]

Sources with citations provided in full report.
```

### Example 3: Code Review

**What you type**:
```
/sc:review
```

**What happens automatically**:
```
🔍 Multi-Persona Code Review Activated

Analyzing codebase...
✅ 47 files changed since last review
✅ Focus areas identified: authentication, API endpoints

Activating review personas:
✅ Code Reviewer: Quality and maintainability
✅ Security Auditor: Security vulnerabilities
✅ Performance Tuner: Performance bottlenecks
✅ Test Engineer: Test coverage and quality

Reviewing src/auth/login.ts:712
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🛡️ SECURITY AUDITOR:
⚠️  Line 45: Potential SQL injection vulnerability
   Replace: `SELECT * FROM users WHERE email = '${email}'`
   With: Parameterized query

⚡ PERFORMANCE TUNER:
💡 Line 67: N+1 query detected in user lookup loop
   Suggestion: Batch query with single database call

✅ CODE REVIEWER:
💚 Line 89: Excellent error handling pattern
⚠️  Line 102: Consider extracting validation logic

🧪 TEST ENGINEER:
❌ Missing tests for password reset flow
📝 Suggestion: Add integration tests

Review complete!

Summary:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Files Reviewed: 47
Issues Found: 12 (3 critical, 5 medium, 4 minor)
Suggestions: 8
Test Coverage: 76% (target: 80%)

Token Usage: 9,200 (vs 68,000 traditional)
Time: 1m 45s
```

---

## Understanding Token Savings

### Traditional Claude Code Session

```
Without Code-Assistant:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
System Prompt:           2,000 tokens
MCP Servers (all loaded): 150,000 tokens (75% of budget!)
  ├─ 20 tools × 7,500 avg
  └─ Loaded even if unused
Skills (always loaded):   10,000 tokens
Conversation:            38,000 tokens
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total: 200,000 tokens (100% budget used)
Available: 0 tokens ❌

Problem: Context window full before work starts!
```

### With Code-Assistant

```
With Code-Assistant:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
System Prompt:           2,000 tokens
MCP Code Execution:      2,000 tokens (98.7% reduction!)
  ├─ Load only needed tools
  └─ Progressive filesystem discovery
Skills (progressive):      400 tokens (metadata only)
  ├─ 5 skills × 80 tokens
  └─ Full content loaded on-demand
Conversation:           16,000 tokens
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total: 20,400 tokens (10% budget used)
Available: 179,600 tokens (90%) ✅

Result: 90% more context available for actual work!
```

### Cost Comparison

**Monthly usage (100 sessions)**:

```
Traditional:
100 sessions × 200K tokens = 20M tokens
Input cost: 20M × $3/MTok = $60
Output cost: 10M × $15/MTok = $150
Total: $210/month

With Code-Assistant:
100 sessions × 20K tokens = 2M tokens
Input cost: 2M × $3/MTok = $6
Output cost: 1M × $15/MTok = $15
Total: $21/month

Savings: $189/month (90%) ✅
Annual savings: $2,268
```

---

## Next Steps

### 1. Explore Features

```bash
# View all available commands
code-assistant-claude --help

# Show configuration
code-assistant-claude config

# View token usage
claude # Start session
> /sc:optimize-tokens

# Try different modes
> /sc:brainstorm "mobile app idea"
> /sc:research "React Server Components"
> /sc:business-panel @business_plan.pdf
```

### 2. Customize Configuration

```bash
# Add custom skill
code-assistant-claude create-skill

# Add custom command
code-assistant-claude create-command

# Configure verbosity
code-assistant-claude config set verbosity compressed

# Optimize MCP servers
code-assistant-claude optimize-mcp
```

### 3. Learn Advanced Features

**Read documentation**:
- [Intelligent Routing](INTELLIGENT_ROUTING.md) - Task classification and routing
- [MCP Code Execution](MCP_CODE_EXECUTION.md) - 98.7% token reduction details
- [Creating Skills](guides/CREATING_SKILLS.md) - Build custom skills
- [Creating Commands](guides/CREATING_COMMANDS.md) - Workflow automation

**Try examples**:
```bash
# Browse example projects
cd examples/react-app
cat README.md

# Run example workflows
cd examples/tutorials
./01-basic-setup.sh
```

### 4. Join Community

- **GitHub Discussions**: Ask questions, share tips
- **Discord**: Real-time community support
- **Blog**: Weekly tips and best practices

---

## Troubleshooting

### Skills Not Activating

**Check skill status**:
```bash
claude --debug

# In Claude session
> "Test skill activation"

# Look for: "Reading skill: code-reviewer"
```

**Fix**:
```bash
# Restart Claude Code
# Or manually trigger
> "Use code-reviewer skill to analyze this file"
```

### MCP Connection Failed

**Check MCP status**:
```bash
# In Claude session
> /mcp

# Should show all connected MCPs
```

**Fix**:
```bash
# Reinstall MCP configuration
code-assistant-claude install-mcps

# Or check .mcp.json
cat ~/.claude/.mcp.json
```

### Token Budget Exceeded

**Check usage**:
```bash
# In Claude session
> /sc:optimize-tokens
```

**Fix**:
```bash
# Enable auto-optimization
code-assistant-claude config set autoOptimize true

# Or manually cleanup
> /sc:cleanup-context
> /clear
```

### Commands Not Found

**Check command registration**:
```bash
# In Claude session
> /help

# Should list all custom commands
```

**Fix**:
```bash
# Reinstall commands
code-assistant-claude install-commands

# Or verify files exist
ls ~/.claude/commands/
```

---

## Common Issues

### Issue: "Existing configuration detected"

**Solution**:
```bash
# Option 1: Merge with existing
code-assistant-claude init --merge

# Option 2: Reset to vanilla (creates backup)
code-assistant-claude reset
code-assistant-claude init

# Option 3: Backup manually first
cp -r ~/.claude ~/.claude-manual-backup
code-assistant-claude init --reset
```

### Issue: "Token budget exceeded in first minute"

**Cause**: Too many MCPs loaded

**Solution**:
```bash
# Disable unused MCPs
claude
> /mcp

# Find unused MCPs
> /sc:optimize-mcp

# Disable specific MCP
> @mcp-name disable
```

### Issue: "Skills taking too much context"

**Cause**: Too many skills loaded simultaneously

**Solution**:
```bash
# Check loaded skills
> /sc:optimize-tokens

# Unload unused skills
code-assistant-claude config set skillAutoUnload true

# Or disable auto-activation
code-assistant-claude config set skills.code-reviewer.autoActivate false
```

---

## FAQ

**Q: Can I use code-assistant with existing Claude Code setup?**
A: Yes! Choose "Merge with existing" during init. Your customizations are preserved.

**Q: What happens to my custom skills/commands?**
A: They're preserved if you choose "Merge". If you choose "Reset", they're backed up first.

**Q: Can I restore my old configuration?**
A: Yes! All resets create automatic backups. Use `code-assistant-claude restore <backup-name>`.

**Q: How do I update code-assistant-claude?**
A: Run `code-assistant-claude update`. Checks for new version, shows changelog, updates if approved.

**Q: Does this work with Claude.ai (web) or just Claude Code CLI?**
A: Skills work everywhere (web, API, CLI). Commands and some features are Claude Code CLI specific.

**Q: What's the performance overhead?**
A: Minimal. Routing adds ~50ms. Token savings far outweigh routing cost.

**Q: Can I disable features I don't use?**
A: Yes! Use `code-assistant-claude config` to enable/disable any feature.

**Q: Is my code/data secure?**
A: Yes. Code executes in sandboxed environments (Docker/VM). PII is tokenized. Full audit logging.

**Q: Can I share my configuration with my team?**
A: Yes! Commit `.claude/` directory to git. Team members run `code-assistant-claude init --local`.

---

## Support

**Documentation**: Full docs in `docs/` directory
**Issues**: Report bugs on GitHub Issues
**Discussions**: Ask questions on GitHub Discussions
**Email**: support@code-assistant-claude.dev

---

**Next**: [Quick Start Tutorial](QUICK_START.md) - 5-minute hands-on intro

**Back**: [README](../README.md) - Project overview
