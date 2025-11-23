# Agents Guide

Complete guide to agents and multi-agent coordination in Code-Assistant-Claude.

## What Are Agents?

Agents are specialized AI assistants that focus on specific domains. Code-Assistant-Claude includes 8 specialized sub-agents that can work independently or collaborate.

### Agent Architecture

```
Main Orchestrator
├── code-reviewer-agent (Quality & best practices)
├── test-engineer-agent (Testing strategies)
├── docs-writer-agent (Documentation)
├── architect-agent (System design)
├── debugger-agent (Systematic debugging)
├── security-auditor-agent (Security)
├── performance-tuner-agent (Optimization)
└── refactor-expert-agent (Code refactoring)
```

## Available Agents

### 1. code-reviewer-agent

**Specialization**: Code quality and best practices

**Expertise**:
- Design patterns
- SOLID principles
- Code smells detection
- Refactoring recommendations
- Technical debt assessment

**Activation Triggers**:
- Code review requests
- Quality assessments
- Best practice validations

**Example**:
```
You: Review this authentication service for code quality

Agent: code-reviewer-agent

Analysis:
✅ Strengths:
- Well-structured service layer
- Good separation of concerns
- Comprehensive error handling

⚠️ Issues:
1. Violation of Single Responsibility (Medium)
   - AuthService handles both auth and session management
   - Recommend: Split into AuthService and SessionService

2. Code duplication (Low)
   - Validation logic duplicated in 3 methods
   - Recommend: Extract to validateCredentials()

3. Missing documentation (Medium)
   - Public methods lack JSDoc comments

🔧 Refactoring Plan:
[Detailed implementation steps]

Token usage: 4,800
```

### 2. test-engineer-agent

**Specialization**: Testing strategies and test generation

**Expertise**:
- Test pyramid strategy
- TDD/BDD approaches
- Test coverage optimization
- Mock/stub strategies
- E2E test design

**Example**:
```
You: Create comprehensive test strategy for payment processing

Agent: test-engineer-agent

Test Strategy:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Unit Tests (70%):
   ✅ Payment validation logic
   ✅ Currency conversion
   ✅ Refund calculations
   ✅ Transaction state management

2. Integration Tests (20%):
   ✅ Payment gateway integration
   ✅ Database transactions
   ✅ Webhook handling

3. E2E Tests (10%):
   ✅ Complete payment flow
   ✅ Refund flow
   ✅ Failed payment recovery

Coverage Target: 95%
Estimated Test Count: 47 tests

[Detailed test implementations follow]

Token usage: 6,200
```

### 3. docs-writer-agent

**Specialization**: Technical documentation

**Expertise**:
- API documentation
- User guides
- Architecture documentation
- Code comments
- README files

**Example**:
```
You: Generate API documentation for user management endpoints

Agent: docs-writer-agent

# User Management API

## Endpoints

### GET /api/users
Retrieve list of users with pagination

**Query Parameters**:
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 20)
- `search` (string, optional): Search by name or email

**Response**:
\`\`\`json
{
  "data": [...],
  "pagination": {
    "total": 150,
    "page": 1,
    "pages": 8
  }
}
\`\`\`

[Complete API documentation]

Token usage: 3,900
```

### 4. architect-agent

**Specialization**: System architecture and design

**Expertise**:
- Microservices architecture
- System design patterns
- Database design
- API design
- Scalability planning

**Example**:
```
You: Design architecture for real-time chat application

Agent: architect-agent

Architecture Design:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

System Components:
1. API Gateway (Kong)
   - Rate limiting
   - Authentication
   - Load balancing

2. Chat Service (Node.js + Socket.io)
   - Real-time messaging
   - Presence management
   - Horizontal scaling with Redis pub/sub

3. User Service (Node.js + Express)
   - User management
   - Authentication

4. Message Store (MongoDB)
   - Chat history
   - Sharded by user_id

5. Cache Layer (Redis)
   - Online users
   - Recent messages
   - Session data

6. CDN (CloudFront)
   - Static assets
   - Media files

Data Flow:
[Detailed diagrams and explanations]

Scalability:
- Supports 100K concurrent users
- Message latency <100ms
- 99.9% uptime

Token usage: 8,900
```

### 5. debugger-agent

**Specialization**: Systematic debugging and troubleshooting

**Expertise**:
- Root cause analysis
- Performance debugging
- Memory leak detection
- Race condition identification
- Systematic debugging methodology

**Example**:
```
You: Debug why the application crashes intermittently

Agent: debugger-agent

Systematic Debugging Process:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Phase 1: Data Collection
✅ Error logs analyzed
✅ Crash dumps examined
✅ Pattern identified: Crashes during peak load

Phase 2: Hypothesis Formation
Potential causes:
1. Memory leak (High probability)
2. Race condition (Medium probability)
3. Resource exhaustion (Medium probability)

Phase 3: Investigation
✅ Memory profiling: Heap growth confirmed
✅ Leak source: Event listeners not cleaned up
✅ Root cause: componentWillUnmount missing cleanup

Phase 4: Solution
[Fix implementation]

Phase 5: Verification
✅ Memory leak resolved
✅ No crashes after 24h load test

Token usage: 5,600
```

### 6. security-auditor-agent

**Specialization**: Security analysis and vulnerability detection

**Expertise**:
- OWASP Top 10
- Security best practices
- Penetration testing
- Compliance (GDPR, SOC 2)
- Threat modeling

**Example**:
```
You: Security audit for authentication system

Agent: security-auditor-agent

Security Audit Report:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Risk Level: MEDIUM

🔴 Critical (0)
(none)

🟡 High (2):
1. Weak password policy
   - Min length: 6 (should be 12+)
   - No complexity requirements
   Impact: Brute force vulnerability

2. JWT token not rotated
   - Long-lived tokens (24h)
   - No refresh mechanism
   Impact: Token theft risk

🟢 Medium (3):
[Additional findings]

Compliance:
✅ GDPR: Compliant
⚠️ SOC 2: Missing audit logging
✅ OWASP: 8/10 checks passed

Remediation Priority:
1. Implement password policy
2. Add token rotation
3. Enable audit logging

Token usage: 7,400
```

### 7. performance-tuner-agent

**Specialization**: Performance optimization

**Expertise**:
- Performance profiling
- Query optimization
- Caching strategies
- Bundle optimization
- Resource optimization

**Example**:
```
You: Optimize performance of product listing page

Agent: performance-tuner-agent

Performance Analysis:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Current Metrics:
- Page load: 3.2s (Target: <1s)
- Time to Interactive: 4.1s (Target: <2s)
- First Contentful Paint: 1.8s (Target: <1s)

Bottlenecks Identified:
1. Database Query (1.5s)
   - N+1 query problem
   - Solution: Eager loading with JOIN

2. Large Bundle Size (800KB)
   - Unnecessary dependencies
   - Solution: Code splitting, tree shaking

3. No Caching (500ms)
   - Repeated API calls
   - Solution: Redis caching (TTL: 5min)

4. Unoptimized Images (600ms)
   - Large PNG files
   - Solution: WebP format, lazy loading

Optimizations Applied:
[Detailed implementations]

Results:
- Page load: 0.8s (-75%)
- Time to Interactive: 1.3s (-68%)
- Bundle size: 250KB (-69%)

Token usage: 6,800
```

### 8. refactor-expert-agent

**Specialization**: Code refactoring

**Expertise**:
- Code smell elimination
- Design pattern application
- Architecture migration
- Legacy code modernization
- Extract/merge refactoring

**Example**:
```
You: Refactor legacy jQuery code to React

Agent: refactor-expert-agent

Refactoring Plan:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Phase 1: Analysis
✅ jQuery codebase analyzed
✅ 15 components identified
✅ Dependencies mapped

Phase 2: Strategy
Migration approach: Gradual (hybrid jQuery + React)
1. Create React wrapper
2. Migrate components one by one
3. Remove jQuery when complete

Phase 3: Component Migration
Priority order:
1. UserProfile (Low coupling)
2. ProductList (Medium coupling)
3. ShoppingCart (High coupling)

Phase 4: Implementation
[Detailed refactoring for each component]

Phase 5: Testing
✅ Unit tests for React components
✅ Integration tests for hybrid state
✅ E2E tests for full flows

Timeline: 15 components over 3 sprints

Token usage: 9,200
```

## Multi-Agent Coordination

### Automatic Coordination

Agents can work together automatically:

```
You: Implement secure authentication with full test coverage

Orchestrator Analysis:
- Feature implementation needed → architect-agent
- Security critical → security-auditor-agent
- Tests required → test-engineer-agent
- Documentation needed → docs-writer-agent

Execution Plan:
1. architect-agent: Design auth architecture
2. security-auditor-agent: Security review of design
3. [Implementation by main system]
4. test-engineer-agent: Comprehensive tests
5. security-auditor-agent: Security testing
6. docs-writer-agent: API documentation
7. code-reviewer-agent: Final quality review

Total Token Usage: 24,500 (vs 180,000 traditional)
Savings: 86%
```

### Manual Coordination

Request specific agent collaboration:

```
You: I need architect-agent and security-auditor-agent to review this design

[Both agents collaborate on analysis]
```

## Agent Modes

### Discussion Mode
Agents collaborate through discussion:
```
architect-agent: "I recommend microservices for scalability"
security-auditor-agent: "Microservices increase attack surface, need API gateway"
performance-tuner-agent: "Network latency concern with too many services"

Synthesis: Hybrid approach with 3 core services + API gateway
```

### Debate Mode
Agents present opposing viewpoints:
```
FOR (architect-agent): "Microservices enable independent scaling"
AGAINST (debugger-agent): "Debugging distributed systems is complex"

Result: Informed decision with trade-offs clearly understood
```

### Sequential Mode
Agents work in sequence:
```
1. architect-agent → Design
2. security-auditor-agent → Security review
3. performance-tuner-agent → Performance review
4. Implementation → Main system
5. test-engineer-agent → Testing
6. code-reviewer-agent → Final review
```

## Configuration

### Enable/Disable Agents

`.claude/settings.json`:
```json
{
  "agents": {
    "enabled": true,
    "autoCoordination": true,
    "available": [
      "code-reviewer-agent",
      "test-engineer-agent",
      "docs-writer-agent",
      "architect-agent",
      "debugger-agent",
      "security-auditor-agent",
      "performance-tuner-agent",
      "refactor-expert-agent"
    ]
  }
}
```

### Agent Priority

```json
{
  "agents": {
    "priority": {
      "security-auditor-agent": "high",
      "architect-agent": "high",
      "test-engineer-agent": "medium",
      "docs-writer-agent": "low"
    }
  }
}
```

## Best Practices

### 1. Trust Auto-Coordination
Let the orchestrator decide which agents to use:
- ✅ Good: "Implement secure payment processing"
- ❌ Unnecessary: "Use architect-agent, security-auditor-agent, and test-engineer-agent to implement..."

### 2. Use Specific Agent for Specialized Tasks
For focused work, request specific agent:
- ✅ Good: "security-auditor-agent: Audit this authentication code"

### 3. Leverage Multi-Agent for Complex Tasks
Complex features benefit from multiple agents:
- ✅ Good: "Build production-ready authentication system"
- System coordinates: architect + security + test + docs agents

### 4. Review Agent Recommendations
Agents provide recommendations, final decisions are yours:
- Always review security recommendations
- Evaluate performance trade-offs
- Assess refactoring priorities

## Troubleshooting

### Agent Not Activating

**Check configuration**:
```bash
cat .claude/settings.json | grep agents
```

### Multiple Agents Conflicting

**Solution**: Use debate mode to explore trade-offs:
```
/agents --mode debate
```

### Agent Token Usage High

**Solution**: Limit concurrent agents:
```json
{
  "agents": {
    "maxConcurrent": 2
  }
}
```

## Next Steps

- 💾 [Token Optimization Guide](08-token-optimization.md)
- 🛡️ [Security Best Practices](09-security-best-practices.md)
- 📚 [Creating Custom Agents](../guides/creating-agents.md)

---

**Need Help?** See [Troubleshooting Guide](10-troubleshooting.md)
