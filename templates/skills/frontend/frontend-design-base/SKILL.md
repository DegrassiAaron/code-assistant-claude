---
name: "frontend-design"
version: "1.0.0"
description: "Modern UI/UX design system with customizable aesthetic guidelines. Use when creating, updating, or improving frontend components and interfaces. Do NOT use for backend logic, API endpoints, or data processing tasks."
author: "Code-Assistant-Claude"
category: "domain"

triggers:
  keywords: ["frontend", "ui", "ux", "component", "interface", "design", "landing page", "website"]
  patterns: ["create.*component", "build.*ui", "design.*interface", "landing.*page"]
  filePatterns: ["*.tsx", "*.jsx", "*.vue", "*.svelte"]
  commands: ["/design", "/ui-create"]
  events: []

tokenCost:
  metadata: 65
  fullContent: 3200
  resources: 800

dependencies:
  skills: []
  mcps: []

composability:
  compatibleWith: ["code-reviewer", "test-generator"]
  conflictsWith: []

context:
  projectTypes: ["react", "nextjs", "vue", "svelte", "javascript", "typescript"]
  minNodeVersion: "18.0.0"
  requiredTools: []

priority: "high"
autoActivate: true
cacheStrategy: "normal"
---

# Frontend Design Skill

Professional UI/UX design system for creating beautiful, accessible, and performant frontend components.

## Design Philosophy

This skill helps you create distinctive, polished frontend designs by focusing on:

- **Typography**: Moving beyond generic fonts to distinctive, purposeful type choices
- **Themes**: Applying cohesive visual identities through aesthetic frameworks
- **Motion**: Implementing high-impact animations that enhance user experience
- **Backgrounds**: Creating atmospheric depth with gradients, patterns, and effects
- **Accessibility**: Ensuring WCAG 2.1 AA compliance throughout

## Core Principles

### 1. Avoid Generic Aesthetics

❌ **Generic Pattern** (to avoid):
```tsx
// Default Inter font, basic purple gradient, minimal styling
<div className="bg-gradient-to-r from-purple-500 to-blue-500">
  <h1 className="font-inter">Welcome</h1>
</div>
```

✅ **Distinctive Approach**:
```tsx
// Purposeful typography, unique color palette, atmospheric design
<div className="relative bg-gradient-to-br from-amber-50 via-rose-50 to-purple-50">
  <h1 className="font-playfair text-5xl tracking-tight">Welcome</h1>
</div>
```

### 2. Design Vectors to Customize

When creating frontend designs, customize these key vectors:

#### Typography
- **Heading Font**: Choose distinctive fonts like:
  - Playfair Display (editorial elegance)
  - IBM Plex Mono (technical precision)
  - Space Grotesk (modern geometric)
  - Crimson Pro (sophisticated serif)
- **Body Font**: Pair with complementary body fonts
- **Scale**: Use intentional type scales (not random sizes)

#### Color Palette
- **Beyond Purple**: Create unique palettes
  - Earth tones: amber, terracotta, sage
  - Editorial: crimson, ivory, slate
  - Technical: cyan, slate, zinc
- **Gradients**: Multi-stop gradients with purpose
- **Contrast**: Ensure 4.5:1 minimum ratio

#### Motion
- **High-Impact Animations**: Focus on key interactions
  - Page transitions
  - Hero reveals
  - Navigation states
- **Avoid Scattered Micro-Interactions**: Less is more
- **Use spring physics** for natural movement

#### Backgrounds
- **Depth**: Layer backgrounds for atmosphere
- **Patterns**: Subtle textures and grids
- **Effects**: Blur, grain, noise for richness

## Component Guidelines

### Layout Components

When building layouts:

```tsx
// ✅ Good: Atmospheric, distinctive layout
<main className="relative min-h-screen">
  {/* Background layers for depth */}
  <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-purple-50" />
  <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />

  {/* Content */}
  <div className="relative max-w-7xl mx-auto px-8 py-24">
    <h1 className="font-playfair text-6xl tracking-tight mb-6">
      Your Content
    </h1>
  </div>
</main>
```

### Interactive Components

When building buttons, forms, cards:

```tsx
// ✅ Good: Distinctive button with purpose
<button className="group relative px-8 py-4 bg-slate-900 text-white rounded-lg
                   overflow-hidden transition-all duration-300
                   hover:scale-105 hover:shadow-2xl">
  <span className="relative z-10 font-medium">Get Started</span>
  <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-rose-500
                  opacity-0 group-hover:opacity-100 transition-opacity" />
</button>
```

### Animation Patterns

Focus on high-impact animations:

```tsx
// ✅ Good: Meaningful page transition
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
>
  {content}
</motion.div>
```

## Technology Stack

### Recommended Libraries

- **Styling**: Tailwind CSS (with custom config)
- **Components**: Radix UI or Headless UI (for accessibility)
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Fonts**: Google Fonts or Fontsource

### Configuration Templates

See `resources/tailwind-configs/` for pre-configured themes:
- `editorial-theme.js` - Editorial aesthetic
- `technical-theme.js` - Technical/developer aesthetic
- `organic-theme.js` - Warm, organic aesthetic

## Accessibility Requirements

ALWAYS implement:

- ✅ ARIA labels for interactive elements
- ✅ Keyboard navigation (Tab, Enter, Escape)
- ✅ Focus indicators (visible outlines)
- ✅ Color contrast ratio ≥ 4.5:1 for text
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Reduced motion support (`prefers-reduced-motion`)

## When to Use This Skill

**Auto-activate when**:
- User requests UI/UX components
- Creating landing pages or marketing sites
- Building dashboards or admin interfaces
- Implementing design systems

**Do NOT activate for**:
- Backend API development
- Database queries or models
- Server-side logic
- CLI tools or scripts

## Customization

This skill can be customized for specific aesthetic preferences. See the guide: `docs/guides/CUSTOM_FRONTEND_DESIGN.md` for instructions on creating your own frontend design skill with custom:

- Typography preferences
- Color palettes
- Animation styles
- Component patterns
- Brand guidelines

## Examples

### Example 1: Landing Page Hero

**Input**: "Create a hero section for a SaaS landing page"

**Output**:
```tsx
<section className="relative min-h-screen flex items-center overflow-hidden">
  {/* Background layers */}
  <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
  <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

  {/* Content */}
  <div className="relative z-10 max-w-7xl mx-auto px-8 py-32">
    <motion.h1
      className="font-playfair text-7xl md:text-8xl font-bold text-white mb-8 tracking-tight"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      Build Something
      <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-400">
        Extraordinary
      </span>
    </motion.h1>

    <motion.p
      className="text-xl text-slate-300 mb-12 max-w-2xl"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      The modern platform for teams who ship fast and build better.
    </motion.p>

    <motion.div
      className="flex gap-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <button className="px-8 py-4 bg-white text-slate-900 rounded-lg font-semibold
                       hover:scale-105 transition-transform">
        Get Started
      </button>
      <button className="px-8 py-4 border-2 border-white/20 text-white rounded-lg font-semibold
                       hover:bg-white/10 transition-colors">
        Learn More
      </button>
    </motion.div>
  </div>

  {/* Decorative elements */}
  <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />
  <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-amber-500/30 rounded-full blur-3xl" />
</section>
```

### Example 2: Dashboard Card

**Input**: "Create a stats card for a dashboard"

**Output**:
```tsx
<motion.div
  className="relative p-6 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden"
  whileHover={{ y: -4, shadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
  transition={{ duration: 0.2 }}
>
  {/* Background decoration */}
  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-100 to-rose-100 rounded-full blur-3xl opacity-50 -z-10" />

  {/* Content */}
  <div className="flex items-start justify-between mb-4">
    <div className="p-3 bg-amber-100 rounded-lg">
      <TrendingUpIcon className="w-6 h-6 text-amber-600" />
    </div>
    <span className="text-sm font-medium text-green-600 flex items-center gap-1">
      <ArrowUpIcon className="w-4 h-4" />
      12.5%
    </span>
  </div>

  <h3 className="text-3xl font-bold text-slate-900 mb-1">
    24,586
  </h3>
  <p className="text-sm text-slate-600">
    Total Users
  </p>

  <div className="mt-4 pt-4 border-t border-slate-100">
    <p className="text-xs text-slate-500">
      vs. last month: <span className="font-semibold text-slate-900">+2,145</span>
    </p>
  </div>
</motion.div>
```

## Resources

Additional resources in `resources/`:
- `design-tokens.json` - Design system tokens
- `component-patterns.md` - Reusable component patterns
- `animation-recipes.md` - Animation cookbook
- `accessibility-checklist.md` - A11y verification checklist

## Limitations

This skill does NOT:
- Generate backend logic or APIs
- Handle database operations
- Implement authentication/authorization logic
- Create server-side rendering configuration
- Handle state management patterns (use appropriate framework skills)

For these tasks, use the appropriate specialized skills.
