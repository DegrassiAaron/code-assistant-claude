---
name: "technical-design"
version: "1.0.0"
description: "Technical developer-focused aesthetic with monospace fonts, cyan/purple accents, dark themes, and precision. Use when creating developer tools, code editors, technical dashboards, or dev-focused products. Do NOT use for consumer marketing or editorial content."
author: "Code-Assistant-Claude"
category: "domain"

triggers:
  keywords: ["technical", "developer", "code", "terminal", "dashboard", "devtool"]
  patterns: ["technical.*ui", "developer.*dashboard", "code.*interface"]
  filePatterns: ["*.tsx", "*.jsx"]
  commands: ["/technical-design"]

tokenCost:
  metadata: 70
  fullContent: 3200
  resources: 500

priority: "high"
autoActivate: true
---

# Technical Design Skill

Developer-focused design with precision, clarity, and technical aesthetics.

## Design Philosophy

- **Monospace Everything**: IBM Plex Mono for authority and precision
- **Dark First**: Dark mode as primary, optimized for long coding sessions
- **Cyan & Purple**: Technical accent colors inspired by syntax highlighting
- **Grid Systems**: Visible structure, technical precision
- **Code-Like**: Interfaces that feel like home to developers

## Typography

```tsx
fonts: {
  mono: "IBM Plex Mono"      // All headings and important text
  sans: "Inter"              // UI labels and body text
}

// Usage
<h1 className="font-mono text-4xl font-bold text-cyan-400">
  $ ./deploy.sh
</h1>
```

## Colors

```tsx
colors: {
  background: "#0F172A"      // Deep slate
  surface: "#1E293B"         // Elevated surfaces
  primary: "#06B6D4"         // Cyan (functions, keywords)
  accent: "#A855F7"          // Purple (strings, special)
  success: "#22C55E"         // Green (success states)
  text: {
    primary: "#F8FAFC",      // White
    secondary: "#94A3B8",    // Muted
    tertiary: "#475569"      // Subtle
  }
}
```

## Component Examples

### Terminal-Style Card

```tsx
<div className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden">
  {/* Header with terminal styling */}
  <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 border-b border-slate-700">
    <div className="flex gap-1.5">
      <div className="w-3 h-3 rounded-full bg-red-500" />
      <div className="w-3 h-3 rounded-full bg-yellow-500" />
      <div className="w-3 h-3 rounded-full bg-green-500" />
    </div>
    <span className="font-mono text-sm text-slate-400">~/projects/api</span>
  </div>

  {/* Content with code-like appearance */}
  <div className="p-4 font-mono text-sm">
    <div className="flex items-start gap-4">
      <div className="text-slate-600">1</div>
      <div>
        <span className="text-cyan-400">const</span>{' '}
        <span className="text-white">response</span>{' '}
        <span className="text-slate-400">=</span>{' '}
        <span className="text-purple-400">await</span>{' '}
        <span className="text-green-400">fetch</span>
        <span className="text-slate-400">(</span>
        <span className="text-amber-400">'/api/data'</span>
        <span className="text-slate-400">)</span>
      </div>
    </div>
  </div>
</div>
```

### Stats Dashboard

```tsx
<div className="grid grid-cols-3 gap-4">
  {stats.map(stat => (
    <div key={stat.label} className="p-6 bg-slate-800 rounded-lg border border-slate-700">
      <div className="flex items-center gap-2 mb-2">
        <stat.icon className="w-5 h-5 text-cyan-400" />
        <span className="font-mono text-sm text-slate-400">{stat.label}</span>
      </div>
      <div className="font-mono text-3xl font-bold text-white mb-1">
        {stat.value}
      </div>
      <div className="flex items-center gap-2 text-sm">
        <span className={stat.change > 0 ? "text-green-400" : "text-red-400"}>
          {stat.change > 0 ? "↑" : "↓"} {Math.abs(stat.change)}%
        </span>
        <span className="text-slate-500">vs last week</span>
      </div>
    </div>
  ))}
</div>
```

### Code Block

```tsx
<div className="relative bg-slate-900 rounded-lg overflow-hidden">
  {/* Header */}
  <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
    <span className="font-mono text-sm text-slate-400">{filename}</span>
    <button className="text-slate-400 hover:text-cyan-400 transition-colors">
      <CopyIcon className="w-4 h-4" />
    </button>
  </div>

  {/* Code content */}
  <pre className="p-4 overflow-x-auto">
    <code className="font-mono text-sm">
      {codeContent}
    </code>
  </pre>
</div>
```

## Backgrounds

### Grid Pattern

```tsx
<div className="relative min-h-screen bg-slate-950">
  {/* Grid overlay */}
  <div className="absolute inset-0 bg-grid-pattern opacity-10" />

  {/* Gradient accent */}
  <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

  {/* Content */}
  <div className="relative z-10">
    {content}
  </div>
</div>
```

## Animations

Minimal, purposeful animations:

```tsx
// Subtle hover state
<div className="transition-all duration-200 hover:border-cyan-400 hover:shadow-glow">
  {content}
</div>

// Loading indicator
<div className="flex items-center gap-2 font-mono text-sm text-slate-400">
  <div className="animate-pulse">Loading</div>
  <div className="flex gap-1">
    <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" />
    <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
    <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
  </div>
</div>
```

## When to Use

✅ Developer tools, Code editors, Technical dashboards, API documentation
❌ Consumer apps, Marketing sites, Editorial content, E-commerce

See `resources/tailwind-configs/technical-theme.js` for full configuration.
