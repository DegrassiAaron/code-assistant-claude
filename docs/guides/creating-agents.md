# Creating Custom Agents

Guide to developing specialized sub-agents for Code-Assistant-Claude.

## What Are Agents?

Agents are specialized AI assistants that focus on specific domains with deep expertise. They can work independently or collaborate with other agents.

## Agent Structure

```
templates/agents/my-agent/
├── AGENT.md                # Agent definition
├── config.json            # Configuration
├── expertise/             # Domain knowledge
│   └── patterns.md
└── examples/
    └── usage.md
```

## Creating an Agent

### 1. Define Expertise

```markdown
---
name: "api-designer-agent"
specialization: "RESTful API design and best practices"
expertise:
  - REST principles
  - API versioning
  - Documentation (OpenAPI)
  - Authentication patterns
---

# API Designer Agent

Expert in RESTful API design following industry best practices.

## Core Competencies

1. **Endpoint Design**: Resource-oriented URLs, HTTP methods
2. **Versioning**: URL vs header-based strategies
3. **Authentication**: OAuth2, JWT, API keys
4. **Documentation**: OpenAPI/Swagger specs
5. **Error Handling**: Consistent error responses
```

### 2. Implementation Pattern

Agents provide structured analysis and recommendations:

```
Input: Design API for user management system

Agent Process:
1. Analyze requirements
2. Design resource hierarchy
3. Define endpoints
4. Specify authentication
5. Document with OpenAPI
6. Review security

Output: Complete API specification
```

## Best Practices

- Focus on single domain
- Provide actionable recommendations
- Include code examples
- Document decision rationale

## See Also

- [Agents Guide](../user-guides/07-agents-guide.md)
- [Creating Skills](creating-skills.md)
