# Quick Start Tutorial
## Your First 5 Minutes with Code-Assistant-Claude

This guide will get you up and running with Code-Assistant-Claude in just 5 minutes.

## Step 1: Install (1 minute)

```bash
# Install globally
npm install -g code-assistant-claude

# Navigate to your project
cd your-react-app

# Initialize
code-assistant-claude init
```

The interactive wizard will:
- ✅ Detect your tech stack (React, TypeScript, Vite)
- ✅ Select recommended skills automatically
- ✅ Configure MCP servers
- ✅ Set up token optimization

## Step 2: First Component (2 minutes)

Open Claude Code CLI in your project directory:

```
You: Create a responsive user profile card component

Claude: [Auto-activates]
        Skills: frontend-design ✅
        MCPs: magic ✅

        [Generates]
        src/components/UserProfile/
        ├── UserProfile.tsx
        ├── UserProfile.test.tsx
        ├── UserProfile.stories.tsx
        └── index.ts

        ✅ Done! Token usage: 5,200 (vs 52,000 traditional)
        💰 Savings: 90%
```

### What Happened?

1. **Auto-Detection**: System recognized this as a frontend task
2. **Skill Activation**: `frontend-design` skill loaded progressively
3. **MCP Execution**: Code generated via MCP (98.7% token reduction)
4. **Quality Output**: Production-ready component with tests and stories

## Step 3: Use Slash Commands (2 minutes)

### Scaffold a Feature
```
You: /sc:scaffold react-feature DashboardPage

Claude: [Scaffolding React feature]

        Generated:
        src/features/dashboard/
        ├── components/
        │   ├── DashboardHeader.tsx
        │   ├── DashboardStats.tsx
        │   └── DashboardChart.tsx
        ├── hooks/
        │   └── useDashboardData.ts
        ├── tests/
        │   └── Dashboard.test.tsx
        └── index.ts

        Token usage: 3,800 (vs 45,000 traditional)
```

### Business Analysis
```
You: /sc:business-panel @product_strategy.pdf --mode discussion

Claude: [Activating business-panel skill]
        Loading experts: Porter, Christensen, Kim/Mauborgne, Meadows

        🎯 PORTER (Competitive Strategy):
        Five forces analysis reveals low barriers to entry but high
        switching costs. Competitive advantage lies in network effects.

        💡 CHRISTENSEN (Disruption):
        From jobs-to-be-done perspective, customers hire this product
        for collaboration, not just communication.

        🌊 KIM/MAUBORGNE (Blue Ocean):
        Value innovation opportunity: eliminate features competitors
        compete on, create new value curve.

        🔄 MEADOWS (Systems Thinking):
        Feedback loops suggest focusing on user activation drives
        retention more than feature additions.

        Synthesis:
        ✅ 3 competitive advantages identified
        ⚖️ 5 strategic trade-offs revealed
        🎯 2 market opportunities discovered

        Token usage: 11,500 (vs 58,000 traditional)
```

### Code Review
```
You: /sc:review src/components/UserProfile/

Claude: [Activating code-reviewer skill]

        📊 Code Review Results
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        Quality Score: 8.5/10

        ✅ Strengths:
        - TypeScript types well-defined
        - Component composition follows best practices
        - Test coverage at 92%

        ⚠️ Issues Found:
        1. Missing error boundary (Medium)
        2. Accessibility: Missing ARIA labels (High)
        3. Performance: Unnecessary re-renders (Low)

        🔧 Recommendations:
        [Detailed fixes with code examples...]

        Token usage: 4,200 (vs 38,000 traditional)
```

## Step 4: Advanced Usage (Bonus)

### Multi-Agent Collaboration
```
You: Implement user authentication with security best practices

Claude: [Coordinating multiple agents]

        Agents Activated:
        ✅ architect-agent (System design)
        ✅ security-auditor-agent (Security validation)
        ✅ test-engineer-agent (Test strategy)
        ✅ docs-writer-agent (Documentation)

        [Implementation proceeds with coordinated effort]

        Results:
        ✅ Secure authentication flow implemented
        ✅ JWT handling with refresh tokens
        ✅ Rate limiting and brute force protection
        ✅ Comprehensive test suite (95% coverage)
        ✅ Security documentation generated

        Token usage: 18,500 (vs 125,000 traditional)
        💰 Savings: 85%
```

### Token Optimization Analysis
```
You: /sc:optimize-tokens

Claude: 📊 Token Budget Analysis
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        Total Budget: 200,000 tokens
        Current Usage: 12,300 tokens (6.2%)
        Status: Excellent 🟢

        Optimizations Active:
        ✅ MCP Code Execution: 98.7% reduction
        ✅ Progressive Skills: 95% reduction
        ✅ Symbol Compression: 40% reduction

        Session Breakdown:
        - Reserved (5%): 10,000 tokens 🔒
        - System (5%): 10,000 tokens 🔧
        - Dynamic (15%): 30,000 tokens 🔄
        - Working (75%): 150,000 tokens 💬

        Used: 12,300 / Available: 187,700

        💡 Recommendation: You can handle 15 more
        similar tasks before approaching budget limits.
```

## What You've Learned

### Core Concepts
✅ **Auto-Activation**: Skills and MCPs activate automatically based on task type
✅ **Token Efficiency**: 90% reduction in token usage across all operations
✅ **Production Quality**: Generated code includes tests, documentation, and best practices
✅ **Multi-Agent Coordination**: Complex tasks leverage multiple specialized agents

### Key Features Used
1. **Progressive Skills**: Load only what you need, when you need it
2. **MCP Code Execution**: Generate code outside context (98.7% savings)
3. **Slash Commands**: Powerful shortcuts for common workflows
4. **Business Panel**: Strategic analysis with multiple expert perspectives
5. **Symbol Compression**: Automatic text compression (30-50% savings)

### Token Savings Demonstrated
| Task | Traditional | With Code-Assistant | Savings |
|------|------------|---------------------|---------|
| Component Generation | 52,000 | 5,200 | 90% |
| Feature Scaffold | 45,000 | 3,800 | 92% |
| Business Analysis | 58,000 | 11,500 | 80% |
| Code Review | 38,000 | 4,200 | 89% |
| **Total** | **193,000** | **24,700** | **87%** |

## Real-World Examples

### E-commerce Product Page
```
You: Create a product detail page with image gallery,
     reviews, and add-to-cart functionality

Generated:
- ProductDetailPage.tsx (responsive design)
- ImageGallery.tsx (with zoom, thumbnails)
- ReviewSection.tsx (star ratings, filtering)
- AddToCart.tsx (quantity selector, variants)
- All components with full test coverage
- Storybook stories for visual testing
- Accessibility compliance (WCAG 2.1 AA)

Time: 45 seconds
Tokens: 8,900 (vs 78,000 traditional)
```

### REST API Endpoint
```
You: Create a user management API with CRUD operations

Generated:
- routes/users.ts (Express routes)
- controllers/userController.ts (business logic)
- middleware/auth.ts (JWT validation)
- validation/userSchema.ts (Zod validation)
- tests/users.test.ts (integration tests)
- docs/api/users.md (API documentation)

Time: 38 seconds
Tokens: 6,400 (vs 62,000 traditional)
```

## Common Patterns

### Pattern 1: Feature Development
```bash
/sc:scaffold react-feature FeatureName
# Review generated structure
# Implement business logic
/sc:review src/features/FeatureName
# Fix any issues
/sc:test src/features/FeatureName
```

### Pattern 2: Code Quality
```bash
# Review existing code
/sc:review src/components/

# Run security audit
/sc:security-audit

# Optimize performance
/sc:performance-audit

# Generate documentation
/sc:generate-docs
```

### Pattern 3: Strategic Analysis
```bash
# Load document and analyze
/sc:business-panel @document.pdf --mode discussion

# Deep dive with debate
/sc:business-panel @document.pdf --mode debate

# Socratic questioning
/sc:business-panel @document.pdf --mode socratic
```

## Tips for Success

### 1. Let Skills Auto-Activate
Don't manually specify skills unless needed. The system knows when to activate them:
- ✅ Good: "Create a login form"
- ❌ Unnecessary: "Using frontend-design skill, create a login form"

### 2. Use Slash Commands
Slash commands are optimized shortcuts:
- ✅ Good: `/sc:scaffold react-component LoginForm`
- ⚠️ Less efficient: "Please scaffold a React component called LoginForm"

### 3. Leverage MCP Code Execution
Let the system generate code via MCP:
- ✅ Good: "Create a user profile component"
- ❌ Inefficient: "Show me the code for a user profile component" (then asking to write it)

### 4. Batch Related Tasks
Group similar operations for better efficiency:
- ✅ Good: "Create login, register, and password reset forms"
- ⚠️ Less efficient: Three separate requests

### 5. Trust the Optimizations
The system handles compression automatically:
- ✅ Good: Use natural language
- ❌ Don't: Try to manually compress your requests

## Next Steps

### Beginner Path
1. 📖 [Configuration Guide](03-configuration.md) - Customize your setup
2. 🎯 [Skills Guide](04-skills-guide.md) - Learn all available skills
3. ⚡ [Commands Guide](05-commands-guide.md) - Master slash commands

### Intermediate Path
1. 🔌 [MCP Integration](06-mcp-integration.md) - Deep dive into MCP servers
2. 🤖 [Agents Guide](07-agents-guide.md) - Understand agent coordination
3. 💾 [Token Optimization](08-token-optimization.md) - Advanced optimization

### Advanced Path
1. 🛡️ [Security Best Practices](09-security-best-practices.md)
2. 📚 [Creating Custom Skills](../guides/creating-skills.md)
3. 🔧 [Advanced Optimization](../guides/advanced-optimization.md)

## Getting Help

### Built-in Help
```
/help                    # General help
/sc:help                 # Slash commands help
/skills                  # List available skills
/agents                  # List available agents
```

### Documentation
- [Troubleshooting Guide](10-troubleshooting.md)
- [API Reference](../api-reference/)
- [Example Projects](../examples/)

### Community
- GitHub Issues: Report bugs or request features
- Discussions: Ask questions, share tips
- Examples: Browse community-contributed examples

---

**Congratulations!** 🎉 You've completed the quick start tutorial. You're now ready to boost your productivity with 90% token savings!
