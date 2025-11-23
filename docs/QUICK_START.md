# Quick Start Tutorial
## Get productive with code-assistant-claude in 5 minutes

This hands-on tutorial gets you up and running fast. Perfect for first-time users.

---

## ⏱️ 5-Minute Setup

### Minute 1: Install

```bash
# Install globally (30 seconds)
npm install -g code-assistant-claude

# Verify
code-assistant-claude --version
# v1.0.0 ✅
```

### Minute 2-4: Configure

```bash
# Navigate to project
cd your-project

# Run setup wizard
code-assistant-claude init

# Answer prompts (choose defaults for quick start):
# ✓ Reset to vanilla? → Yes (if existing config)
# ✓ Configuration scope? → Both
# ✓ Verbosity? → Balanced
# ✓ Auto-optimization? → Yes
# ✓ Security? → Docker

# Installation runs automatically
# ✅ Complete in ~2 minutes
```

### Minute 5: Test

```bash
# Start Claude Code
claude

# Test 1: UI Component
> "Create a button component with primary and secondary variants"

# Should see:
# ✅ frontend-design skill activated
# ✅ Magic MCP generated shadcn/ui component
# ✅ Tests included
# ⏱️ 30 seconds

# Test 2: Token optimization
> /sc:optimize-tokens

# Should see:
# 📊 Token usage dashboard
# 💡 Optimization recommendations
# ✅ 60-70% savings confirmed
```

**Done!** You're now using code-assistant-claude. 🎉

---

## 🎯 Core Workflow Patterns

### Pattern 1: Create Components

**Traditional** (manual):
```
1. Create component file
2. Write component code
3. Create test file
4. Write tests
5. Create stories
6. Configure TypeScript
⏱️ 15-20 minutes
```

**With code-assistant**:
```bash
> /sc:scaffold react-component Button --variants --tests --stories

Generated:
✅ Button.tsx (with TypeScript)
✅ Button.test.tsx (comprehensive tests)
✅ Button.stories.tsx (Storybook stories)
✅ types.ts (interfaces)

⏱️ 45 seconds
💾 Token savings: 90%
```

### Pattern 2: Research

**Traditional** (manual Google):
```
1. Google search
2. Read 10+ articles
3. Take notes
4. Synthesize findings
5. Lose track of sources
⏱️ 30-60 minutes
📊 No confidence scoring
```

**With code-assistant**:
```bash
> /sc:research "React Server Components best practices"

Result:
✅ 15 sources analyzed
✅ Official docs prioritized
✅ Synthesis with confidence scores
✅ Full citations
✅ Saved to claudedocs/

⏱️ 2 minutes
📊 Confidence: 0.87 (High)
💾 Token savings: 82%
```

### Pattern 3: Code Review

**Traditional** (manual review):
```
1. Read through changes
2. Check for patterns
3. Look for vulnerabilities
4. Review tests
5. Provide feedback
⏱️ 20-30 minutes per PR
🎯 Consistency: Variable
```

**With code-assistant**:
```bash
> /sc:review

Result:
✅ Multi-persona analysis
   ├─ Security Auditor
   ├─ Performance Tuner
   ├─ Code Reviewer
   └─ Test Engineer
✅ 47 files analyzed
✅ 12 issues found (prioritized)
✅ Specific recommendations

⏱️ 2 minutes
🎯 Consistency: >90%
💾 Token savings: 86%
```

---

## 🎪 Feature Showcase

### SuperClaude Modes

#### Brainstorming Mode

```bash
> /sc:brainstorm "AI-powered project management tool"

🧠 Brainstorming Mode Activated

Socratic Discovery Questions:
1. What specific problem does this solve for users?
2. Who are your target users?
3. What's the core value proposition?
4. Integration requirements?

[Interactive dialogue continues...]

Generated Brief:
✅ Clear requirements
✅ User stories
✅ Technical specifications
✅ Implementation roadmap

Saved: claudedocs/brief_ai_pm_tool.md
```

#### Business Panel Mode

```bash
> /sc:business-panel @product_strategy.pdf --mode discussion

💼 Business Panel Activated

Auto-selected experts:
✅ Porter (Competitive Strategy)
✅ Christensen (Innovation)
✅ Kim/Mauborgne (Blue Ocean)
✅ Meadows (Systems Thinking)

Analysis:

📊 PORTER - Competitive Strategy:
"Five forces analysis reveals weak supplier power
but intense rivalry in the space..."

📚 CHRISTENSEN building on PORTER:
"From a jobs-to-be-done lens, customers aren't
hiring competitors for the same job..."

🌊 KIM/MAUBORGNE - Blue Ocean:
"Opportunity for value innovation by eliminating..."

🕸️ MEADOWS - Systems Thinking:
"The reinforcing loop between user adoption and
network effects suggests..."

Synthesis:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Convergent Insights
✓ Productive Tensions
✓ Strategic Recommendations
✓ Next Steps

Saved: claudedocs/business_analysis_[timestamp].md
```

### Automatic Skills

**Code Review on Save**:
```bash
# Just save any file
# code-reviewer skill auto-activates

💾 Saved: src/auth/login.ts

🔍 Code Reviewer (automatic):
✅ No security issues
⚠️  Consider extracting validation to util
💡 Add JSDoc comments for public methods

Auto-review complete (2.1 seconds)
```

**Security Scan on Commit**:
```bash
git commit -m "Add login feature"

# Pre-commit hook activates:
🛡️ Security Auditor:
✅ No hardcoded secrets
✅ No SQL injection vulnerabilities
✅ Input validation present

🔍 Secret Scanner:
✅ No API keys detected
✅ No passwords in code

✅ Safe to commit
```

---

## 💡 Pro Tips

### Tip 1: Use Dry Run for Experimentation

```bash
# Preview changes without executing
code-assistant-claude init --dry-run

# See what would happen
# No files modified
# Review recommendations
# Then run actual install
```

### Tip 2: Optimize Token Usage Regularly

```bash
# In Claude session
> /sc:optimize-tokens

# Review recommendations
# Disable unused MCPs
# Unload inactive skills
# 5-10% additional savings possible
```

### Tip 3: Leverage Progressive Discovery

```bash
# Instead of loading all tools
# Start minimal, load on-demand

# Example:
> "List available MCP servers"
# Filesystem discovery: 50 tokens

> "Show tools for Salesforce MCP"
# Explore specific server: 100 tokens

> "Use updateRecord tool"
# Load only when needed: 500 tokens

# vs 150,000 tokens loading everything upfront
```

### Tip 4: Combine Skills for Power

```bash
# Multiple skills work together automatically

> "Implement user authentication with tests and security review"

Auto-activated:
✅ security-auditor skill
✅ test-generator skill
✅ code-reviewer skill

All three coordinate for comprehensive implementation
```

### Tip 5: Use Appropriate Verbosity

```bash
# Exploring/learning? → Verbose
claude --mode verbose

# Production work? → Balanced
claude --mode balanced

# Quick tasks/tight budget? → Compressed
claude --mode compressed

# Compressed uses symbols:
# → (leads to), ✅ (done), ⚡ (performance), 🛡️ (security)
```

---

## 🎬 Complete Workflows

### Workflow 1: New Feature Implementation

```bash
# 1. Brainstorm requirements
> /sc:brainstorm "social sharing feature"

# Interactive discovery
# Saves: claudedocs/brief_social_sharing.md

# 2. Implement feature
> /sc:implement social-sharing

# Auto-activates:
# - Orchestration mode
# - Appropriate skills
# - Test generation
# - Documentation

# 3. Review
> /sc:review

# Multi-persona review
# Security, performance, quality checks

# 4. Deploy
> /sc:deploy staging

# Safe deployment with validation

Total time: 20 minutes (vs 2-3 hours manual)
```

### Workflow 2: Bug Investigation

```bash
# 1. Report issue
> "Users report checkout flow is slow"

# Auto-activates:
# - Introspection mode
# - performance-optimizer skill
# - Chrome DevTools MCP

# 2. Systematic debugging
> /sc:troubleshoot performance

# Automated profiling
# Bottleneck identification
# Fix recommendations

# 3. Apply fixes
# Agent generates fixes with tests

# 4. Validate
> /sc:test checkout

# Comprehensive testing
# Performance benchmarks

Total time: 15 minutes (vs 1-2 hours manual)
```

### Workflow 3: Strategic Planning

```bash
# 1. Research market
> /sc:research "project management tools market 2025"

# Deep research with citations
# Saved to claudedocs/

# 2. Analyze strategy
> /sc:business-panel @current_strategy.pdf --mode debate

# 9 experts debate approach
# Identify risks and opportunities

# 3. Generate plan
# Based on research + expert analysis

# Saved: strategy_analysis_[timestamp].md

Total time: 10 minutes (vs 3-4 hours manual)
```

---

## 🎯 Next Steps

You're now ready to use code-assistant-claude productively!

**Recommended Learning Path**:

1. ✅ Complete this Quick Start ← You are here
2. 📖 Read [Intelligent Routing](INTELLIGENT_ROUTING.md) - Understand task classification
3. 🔬 Read [MCP Code Execution](MCP_CODE_EXECUTION.md) - Deep dive on token optimization
4. 🛠️ Try [Creating Skills](guides/CREATING_SKILLS.md) - Build your first custom skill
5. 🚀 Explore [Examples](../examples/) - Real-world projects

**Advanced Topics**:
- [Business Panel Guide](guides/BUSINESS_PANEL.md) - Strategic analysis
- [Security Best Practices](guides/SECURITY.md) - Secure configurations
- [Team Collaboration](guides/TEAM_SETUP.md) - Share with team
- [Performance Tuning](guides/PERFORMANCE.md) - Maximize efficiency

---

## 📞 Get Help

**Stuck?** Check [Troubleshooting](GETTING_STARTED.md#troubleshooting)

**Questions?** Visit [GitHub Discussions](https://github.com/your-org/code-assistant/discussions)

**Bug?** Report on [GitHub Issues](https://github.com/your-org/code-assistant/issues)

---

**Happy coding with code-assistant-claude!** 🚀
