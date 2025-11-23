# React Application Example

Complete example of Code-Assistant-Claude setup for a React + TypeScript + Vite project.

## Project Overview

This example demonstrates:
- ✅ Automatic project detection
- ✅ Recommended skills for React development
- ✅ MCP integration for frontend workflows
- ✅ Token optimization achieving 87% savings
- ✅ Complete development workflow

## Project Structure

```
react-app/
├── .claude/
│   ├── CLAUDE.md                      # Generated configuration
│   ├── settings.json                  # System settings
│   ├── .mcp.json                      # MCP server config
│   ├── skills/
│   │   ├── code-reviewer/
│   │   ├── frontend-design/
│   │   ├── test-generator/
│   │   └── performance-tuner/
│   └── commands/
│       ├── sc-implement.md
│       ├── sc-scaffold.md
│       └── sc-review.md
│
├── src/
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
│
├── tests/
│   └── setup.ts
│
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Setup

### 1. Install Code-Assistant-Claude

```bash
npm install -g code-assistant-claude
```

### 2. Initialize in Project

```bash
cd react-app
code-assistant-claude init
```

### 3. Interactive Setup

```
🎯 Project Detection
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Project Type: React Application
✅ Framework: React 18.2.0
✅ Language: TypeScript 5.0.2
✅ Build Tool: Vite 4.3.9
✅ Testing: Vitest + React Testing Library
✅ Git Workflow: GitHub Flow

📦 Recommended Skills
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ code-reviewer
✅ frontend-design
✅ test-generator
✅ performance-tuner

🔌 Recommended MCPs
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ magic (Code execution)
✅ serena (Token compression)
✅ sequential (Workflows)
✅ playwright (E2E testing)

⚙️ Configuration
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Verbosity Mode: Compressed (90% token savings)
Installation Scope: Local
Token Optimization: Enabled (All)

✅ Setup Complete!
```

## Generated Configuration

### .claude/CLAUDE.md

```markdown
# Code Assistant Claude Configuration

**Project**: React E-Commerce Application
**Tech Stack**: React 18, TypeScript, Vite
**Generated**: 2025-01-23

## Project Overview
Modern e-commerce frontend built with React, TypeScript, and Vite.
Uses shadcn/ui for components and TailwindCSS for styling.

## Tech Stack Detected
- Framework: React 18.2.0
- Language: TypeScript 5.0.2
- Build Tool: Vite 4.3.9
- Testing: Vitest, React Testing Library
- UI Library: shadcn/ui
- Styling: TailwindCSS

## Skills Configuration
Progressive loading enabled. Skills activate based on task type.

Available Skills:
- code-reviewer: Code quality and best practices
- frontend-design: UI/UX component design with shadcn/ui
- test-generator: Test generation (unit + E2E)
- performance-tuner: React performance optimization

## Commands Configuration
Custom slash commands via `/sc:` prefix.

Available Commands:
- /sc:implement: Feature implementation
- /sc:scaffold: Component/feature scaffolding
- /sc:review: Code review
- /sc:test: Test generation
- /sc:performance: Performance analysis

## MCP Integration
Code execution via MCP (98.7% token reduction).

Active MCPs:
- magic: Code generation and execution
- serena: Token compression
- sequential: Workflow automation
- playwright: E2E testing

## Token Optimization
- MCP Code Execution: ✅ (98.7% reduction)
- Progressive Skills: ✅ (95% reduction)
- Symbol Compression: ✅ (40% reduction)

Expected Token Savings: 87% overall
```

### .claude/settings.json

```json
{
  "version": "1.0.0",
  "projectType": "react",
  "techStack": ["react", "typescript", "vite", "tailwindcss"],

  "verbosityMode": "compressed",
  "installationScope": "local",

  "tokenOptimization": {
    "mcpCodeExecution": true,
    "progressiveSkills": true,
    "symbolCompression": true,
    "compressionLevel": 90
  },

  "skills": {
    "autoActivation": true,
    "progressiveLoading": true,
    "recommended": [
      "code-reviewer",
      "frontend-design",
      "test-generator",
      "performance-tuner"
    ]
  },

  "commands": {
    "prefix": "/sc:",
    "enabled": [
      "implement",
      "scaffold",
      "review",
      "test",
      "performance"
    ]
  },

  "mcpServers": {
    "enabled": true,
    "servers": ["magic", "serena", "sequential", "playwright"]
  },

  "git": {
    "workflow": "github-flow",
    "branchPrefix": "feature/"
  }
}
```

### .claude/.mcp.json

```json
{
  "mcpServers": {
    "magic": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-magic"]
    },
    "serena": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-serena"]
    },
    "sequential": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential"]
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-playwright"]
    }
  }
}
```

## Example Workflows

### 1. Create Component

```
You: Create a product card component with image, title, price, and add-to-cart button

Claude: [Auto-activates frontend-design skill]
        [Uses magic MCP for code generation]

        ✅ Generated: ProductCard.tsx
        ✅ Generated: ProductCard.test.tsx
        ✅ Generated: ProductCard.stories.tsx

        Token usage: 5,200 (vs 52,000 traditional)
        Savings: 90%
```

Generated files:

**src/components/ProductCard/ProductCard.tsx**:
```tsx
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ProductCardProps {
  image: string;
  title: string;
  price: number;
  onAddToCart: () => void;
}

export function ProductCard({ image, title, price, onAddToCart }: ProductCardProps) {
  return (
    <Card className="overflow-hidden">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-xl font-bold mt-2">${price.toFixed(2)}</p>
        <Button onClick={onAddToCart} className="w-full mt-4">
          Add to Cart
        </Button>
      </div>
    </Card>
  );
}
```

### 2. Implement Feature

```
You: /sc:implement "user authentication with login and registration"

Claude: [Coordinating implementation]
        Agents: architect + security-auditor + test-generator

        ✅ Generated authentication architecture
        ✅ Implemented login component
        ✅ Implemented registration component
        ✅ Implemented auth service
        ✅ Generated comprehensive tests
        ✅ Security audit passed

        Token usage: 18,500 (vs 125,000 traditional)
        Savings: 85%
```

### 3. Performance Optimization

```
You: /sc:performance src/pages/ProductList

Claude: [Activating performance-tuner skill]

        Performance Analysis:
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        Issues Found:
        1. Unnecessary re-renders (High)
        2. Large bundle size (Medium)
        3. Unoptimized images (Medium)

        Optimizations Applied:
        ✅ Added React.memo()
        ✅ Implemented code splitting
        ✅ Added lazy loading for images

        Results:
        - Render time: -65%
        - Bundle size: -40%
        - Load time: -55%

        Token usage: 6,800
```

## Token Savings Breakdown

| Task | Traditional | Optimized | Savings |
|------|------------|-----------|---------|
| Component Creation | 52,000 | 5,200 | 90% |
| Feature Implementation | 125,000 | 18,500 | 85% |
| Code Review | 38,000 | 4,200 | 89% |
| Performance Optimization | 42,000 | 6,800 | 84% |
| **Average Session** | **180,000** | **22,000** | **87%** |

## Best Practices

### 1. Use Component Scaffolding
```
/sc:scaffold react-component UserProfile
```

### 2. Leverage Auto-Activation
Let skills activate automatically based on task type.

### 3. Batch Related Operations
```
Create login, register, and password reset forms in one request
```

### 4. Monitor Token Usage
```
/sc:optimize-tokens
```

### 5. Use shadcn/ui Components
Frontend-design skill generates shadcn/ui components by default.

## Troubleshooting

### Issue: Playwright Not Working

**Solution**:
```bash
npx playwright install
```

### Issue: Build Errors

**Solution**:
```bash
npm run typecheck
npm run lint
```

## Next Steps

- Explore other [Example Projects](../nodejs-api/)
- Read [Skills Guide](../../user-guides/04-skills-guide.md)
- Learn [Token Optimization](../../user-guides/08-token-optimization.md)

---

**Questions?** See [Troubleshooting Guide](../../user-guides/10-troubleshooting.md)
