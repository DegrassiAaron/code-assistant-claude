# Skills Guide

Complete guide to using and managing skills in Code-Assistant-Claude.

## What Are Skills?

Skills are specialized capabilities that extend Claude's functionality. Each skill:
- ✅ Focuses on a specific domain or task type
- ✅ Loads progressively (only when needed)
- ✅ Achieves 95% token reduction through efficient loading
- ✅ Auto-activates based on task context

## Available Skills

### Core Skills (5)

#### 1. code-reviewer
**Purpose**: Code quality and best practices analysis

**Activates For**:
- Code review requests
- Quality assessments
- Best practice validation
- Technical debt analysis

**Capabilities**:
- Static code analysis
- Design pattern recognition
- Performance issue detection
- Security vulnerability identification
- Test coverage analysis

**Example Usage**:
```
You: /sc:review src/components/UserProfile

Claude: [Activating code-reviewer skill]

        📊 Code Review: UserProfile.tsx
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        Quality Score: 8.5/10

        ✅ Strengths:
        - Well-structured component hierarchy
        - Type-safe props with TypeScript
        - Good separation of concerns
        - Test coverage at 92%

        ⚠️ Issues (3):
        1. Missing error boundary (Medium)
           → Add ErrorBoundary wrapper

        2. Accessibility issues (High)
           → Missing ARIA labels on buttons
           → Insufficient color contrast

        3. Performance (Low)
           → Unnecessary re-renders on parent updates
           → Consider React.memo()

        🔧 Suggested Fixes:
        [Detailed code examples provided]

        Token usage: 4,200
```

#### 2. frontend-design
**Purpose**: UI/UX component design and implementation

**Activates For**:
- Component creation requests
- UI/UX design tasks
- Responsive layout needs
- Design system implementation

**Capabilities**:
- shadcn/ui component generation
- Responsive design patterns
- Accessibility compliance (WCAG 2.1 AA)
- Modern CSS techniques
- Component composition

**Example Usage**:
```
You: Create a responsive product card with image, title, price, and add-to-cart button

Claude: [Activating frontend-design skill]

        ✅ Generated: ProductCard.tsx
        - Responsive grid layout (mobile/tablet/desktop)
        - Optimized images with lazy loading
        - shadcn/ui Button and Card components
        - Accessibility: ARIA labels, keyboard navigation
        - Hover states and transitions

        ✅ Generated: ProductCard.test.tsx
        - Rendering tests
        - Interaction tests
        - Accessibility tests

        ✅ Generated: ProductCard.stories.tsx
        - Default state
        - Loading state
        - Out of stock state

        Token usage: 5,800
```

#### 3. test-generator
**Purpose**: Automated test generation and validation

**Activates For**:
- Test creation requests
- Test coverage improvements
- Test strategy discussions
- TDD workflows

**Capabilities**:
- Unit test generation
- Integration test creation
- E2E test scenarios
- Test coverage analysis
- Mock generation

**Example Usage**:
```
You: Generate tests for the authentication service

Claude: [Activating test-generator skill]

        ✅ Generated: authService.test.ts

        Test Suite Structure:
        ├── Authentication
        │   ├── should login with valid credentials ✅
        │   ├── should reject invalid credentials ✅
        │   ├── should handle rate limiting ✅
        │   └── should refresh expired tokens ✅
        ├── Authorization
        │   ├── should enforce role-based access ✅
        │   └── should handle permission checks ✅
        └── Edge Cases
            ├── should handle network errors ✅
            └── should timeout long requests ✅

        Coverage: 96% (target: 90%)
        Test Count: 24 tests
        Token usage: 6,400
```

#### 4. security-auditor
**Purpose**: Security analysis and vulnerability detection

**Activates For**:
- Security audits
- Vulnerability assessments
- Compliance checks
- Secure coding reviews

**Capabilities**:
- OWASP Top 10 detection
- SQL injection prevention
- XSS vulnerability scanning
- Authentication/authorization review
- Dependency vulnerability checking

**Example Usage**:
```
You: /sc:security-audit src/api/users

Claude: [Activating security-auditor skill]

        🛡️ Security Audit Report
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        Overall Risk: MEDIUM

        🔴 Critical (1):
        - SQL Injection vulnerability in user search
          File: userController.ts:45
          Fix: Use parameterized queries

        🟡 Medium (3):
        - Missing rate limiting on login endpoint
        - Weak password validation (min 6 chars)
        - Session tokens not rotated

        🟢 Low (2):
        - Missing security headers (CSP, HSTS)
        - Verbose error messages

        ✅ Passed (8):
        - CSRF protection enabled
        - JWT validation secure
        - Password hashing (bcrypt)
        - Input sanitization

        📝 Remediation Plan:
        [Detailed fixes with code examples]

        Token usage: 7,200
```

#### 5. business-panel
**Purpose**: Strategic business analysis with multiple expert perspectives

**Activates For**:
- Business strategy questions
- Market analysis
- Strategic planning
- Document review

**Capabilities**:
- Multi-expert analysis (9 thought leaders)
- Three analysis modes (Discussion, Debate, Socratic)
- Framework integration
- Strategic synthesis

**Experts**:
- Porter (Competitive Strategy)
- Christensen (Disruption Theory)
- Drucker (Management)
- Godin (Marketing)
- Kim/Mauborgne (Blue Ocean Strategy)
- Collins (Business Excellence)
- Taleb (Antifragility)
- Meadows (Systems Thinking)
- Doumont (Communication)

**Example Usage**:
```
You: /sc:business-panel @market_analysis.pdf --mode discussion

Claude: [Activating business-panel skill]
        Mode: Discussion
        Experts: Porter, Christensen, Kim/Mauborgne, Meadows

        🎯 PORTER (Competitive Strategy):
        Five forces analysis reveals:
        - Low barriers to entry (⚠️ Risk)
        - High buyer power due to low switching costs
        - Moderate supplier power
        Recommendation: Build network effects for defensibility

        💡 CHRISTENSEN (Disruption):
        Jobs-to-be-done analysis:
        - Customers "hire" this product for convenience
        - Overserving on features, underserving on simplicity
        Opportunity: Simplified version for new market

        🌊 KIM/MAUBORGNE (Blue Ocean):
        Value curve shows:
        - Competing on same dimensions as rivals
        - Opportunity to eliminate/reduce/raise/create
        Recommendation: Create new value curve

        🔄 MEADOWS (Systems Thinking):
        Feedback loops identified:
        - User growth → network value → more users (✅)
        - Feature bloat → complexity → churn (⚠️)

        📊 SYNTHESIS:
        ✅ 3 competitive advantages identified
        ⚖️ 5 strategic trade-offs mapped
        🎯 2 market opportunities discovered
        ⚠️ 3 risks to mitigate

        Token usage: 11,500
```

### SuperClaude Modes (6)

#### 1. sc-code-architect
**Purpose**: System design and architecture

**Activates For**:
- Architecture design
- System planning
- Technology selection
- Scalability planning

**Example**:
```
You: /sc:implement "microservices architecture for e-commerce platform"

Claude: [Activating sc-code-architect mode]

        🏗️ Architecture Design
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        Services:
        - API Gateway (Kong)
        - User Service (Node.js)
        - Product Service (Go)
        - Order Service (Node.js)
        - Payment Service (Python)
        - Notification Service (Node.js)

        Infrastructure:
        - Message Queue: RabbitMQ
        - Database: PostgreSQL (per service)
        - Cache: Redis
        - Service Mesh: Istio

        [Detailed implementation follows]
```

#### 2. sc-debugger
**Purpose**: Systematic debugging and troubleshooting

**Activates For**:
- Bug fixing
- Error investigation
- Performance debugging
- Root cause analysis

**Example**:
```
You: Debug why users are seeing intermittent 500 errors

Claude: [Activating sc-debugger mode]

        🔍 Systematic Debugging
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        Phase 1: Data Collection
        - Error logs analyzed
        - 500 errors spike during peak hours
        - Pattern: Database connection timeouts

        Phase 2: Hypothesis
        - Connection pool exhaustion suspected
        - Peak load exceeds pool capacity

        Phase 3: Verification
        - Connection pool: max 10
        - Peak concurrent requests: 50+
        - ✅ Confirmed: Pool exhaustion

        Phase 4: Resolution
        [Implementation of connection pool scaling]

        ✅ Bug Fixed
        Token usage: 5,600
```

#### 3. sc-performance-optimizer
**Purpose**: Performance analysis and optimization

#### 4. sc-test-specialist
**Purpose**: Advanced testing strategies

#### 5. sc-security-specialist
**Purpose**: Deep security analysis

#### 6. sc-docs-specialist
**Purpose**: Comprehensive documentation generation

## Progressive Loading

### How It Works

Skills load in stages:

**Stage 1: Detection** (0 tokens)
- System analyzes task type
- Determines which skills needed
- No content loaded yet

**Stage 2: Activation** (minimal tokens)
- Skill metadata loaded (~200 tokens)
- Core capabilities available
- Detailed examples not yet loaded

**Stage 3: Progressive Detail** (as needed)
- Examples loaded on-demand
- Advanced patterns loaded if needed
- Full documentation if requested

### Token Savings

Traditional approach:
```
All skills always loaded: 95,000 tokens
```

Progressive loading:
```
Only needed skill loaded: 4,500 tokens
Savings: 95% ✅
```

## Auto-Activation

Skills activate automatically based on task analysis.

### Activation Examples

**Code Review Task**:
```
You: Review the user authentication code

Detected: Code review task
Activated: code-reviewer skill
Token usage: 4,200
```

**UI Component Task**:
```
You: Create a navigation bar

Detected: Frontend component task
Activated: frontend-design skill
Token usage: 5,100
```

**Security Task**:
```
You: Check for security vulnerabilities

Detected: Security audit task
Activated: security-auditor skill
Token usage: 6,800
```

**Multiple Skills**:
```
You: Implement and test a payment processing feature

Detected: Implementation + Testing + Security
Activated:
- code-reviewer (code quality)
- test-generator (test coverage)
- security-auditor (payment security)
Token usage: 15,200 (vs 95,000 traditional)
```

## Manual Activation

Force skill activation when auto-detection isn't sufficient:

```
You: /skill:business-panel analyze this strategy

Claude: [Manually activating business-panel skill]
```

## Managing Skills

### List Available Skills
```
You: /skills

Claude: Available Skills:
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        Core Skills (5):
        ✅ code-reviewer
        ✅ frontend-design
        ✅ test-generator
        ✅ security-auditor
        ✅ business-panel

        SuperClaude Modes (6):
        ✅ sc-code-architect
        ✅ sc-debugger
        ✅ sc-performance-optimizer
        ✅ sc-test-specialist
        ✅ sc-security-specialist
        ✅ sc-docs-specialist

        Custom Skills (0):
        (none installed)
```

### Install Additional Skills
```bash
code-assistant-claude install-skill <skill-name>
```

### Disable Skills
Edit `.claude/settings.json`:
```json
{
  "skills": {
    "recommended": [
      "code-reviewer",
      "frontend-design"
      // Remove skills you don't want
    ]
  }
}
```

### Create Custom Skills
See [Creating Skills Guide](../guides/creating-skills.md)

## Skill Configuration

### Per-Skill Settings

Edit `.claude/skills/<skill-name>/config.json`:

```json
{
  "enabled": true,
  "autoActivate": true,
  "priority": "high",
  "tokenBudget": 5000,
  "progressiveLoading": true,
  "cacheResponses": true
}
```

### Global Skill Settings

Edit `.claude/settings.json`:

```json
{
  "skills": {
    "autoActivation": true,
    "progressiveLoading": true,
    "maxConcurrent": 3,
    "tokenBudgetPerSkill": 5000,
    "caching": {
      "enabled": true,
      "ttl": 3600
    }
  }
}
```

## Best Practices

### 1. Trust Auto-Activation
Let the system choose skills automatically:
- ✅ Good: "Create a login component"
- ❌ Unnecessary: "Using frontend-design skill, create a login component"

### 2. Combine Skills Naturally
Describe complex tasks naturally:
- ✅ Good: "Implement user authentication with tests and security review"
- System activates: code-reviewer, test-generator, security-auditor

### 3. Use Progressive Loading
Don't request everything upfront:
- ✅ Good: "Review this code" → detailed analysis if issues found
- ❌ Wasteful: "Give me every possible code review insight"

### 4. Leverage Business Panel for Strategy
For business questions, use the business panel:
- ✅ Good: `/sc:business-panel @doc.pdf --mode discussion`
- Engages multiple expert perspectives

### 5. Monitor Token Usage
Check token consumption:
```
You: /sc:optimize-tokens

Claude: [Shows token breakdown by skill]
```

## Troubleshooting

### Issue: Skill Not Activating

**Check**:
```bash
ls .claude/skills/<skill-name>/SKILL.md
```

**Fix**:
```bash
code-assistant-claude install-skill <skill-name>
```

### Issue: Wrong Skill Activated

**Solution**: Be more specific in your request:
- ❌ Vague: "Help with this code"
- ✅ Specific: "Review this code for security issues"

### Issue: Token Budget Exceeded

**Solution**: Reduce concurrent skills:
```json
{
  "skills": {
    "maxConcurrent": 2  // Reduce from 3
  }
}
```

## Advanced Usage

### Skill Composition

Chain multiple skills:
```
You: Implement feature X, then review it, then generate tests, then audit security

Claude: [Sequential skill activation]
        1. sc-code-architect (implement)
        2. code-reviewer (review)
        3. test-generator (tests)
        4. security-auditor (audit)

        Token usage: 22,000 (vs 190,000 traditional)
        Savings: 88%
```

### Conditional Activation

Skills activate conditionally based on findings:
```
You: Review this authentication code

Claude: [Activating code-reviewer]
        Found security issues
        [Auto-activating security-auditor for deep analysis]
```

## Next Steps

- ⚡ [Commands Guide](05-commands-guide.md) - Learn slash commands
- 🔌 [MCP Integration](06-mcp-integration.md) - Understand MCP servers
- 🤖 [Agents Guide](07-agents-guide.md) - Work with agents
- 📚 [Creating Custom Skills](../guides/creating-skills.md)

---

**Need Help?** See [Troubleshooting Guide](10-troubleshooting.md)
