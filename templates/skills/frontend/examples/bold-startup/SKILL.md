---
name: "bold-startup"
version: "1.0.0"
description: "Bold, energetic startup aesthetic inspired by Spotify, Figma, and Notion. Vibrant colors, strong gradients, playful animations, and confident design. Use for startup products, consumer apps, creative tools, and dynamic web applications. Do NOT use for corporate/banking, editorial content, or minimal agency sites."
author: "Code-Assistant-Claude"
category: "domain"

triggers:
  keywords: ["bold", "vibrant", "startup", "energetic", "colorful", "dynamic"]
  patterns: ["bold.*design", "startup.*ui", "vibrant.*interface"]
  filePatterns: ["*.tsx", "*.jsx"]
  commands: ["/bold-design"]

tokenCost:
  metadata: 72
  fullContent: 3600
  resources: 700

priority: "high"
autoActivate: true
---

# Bold Startup Design Skill

Vibrant, energetic design inspired by Spotify, Figma, and Notion.

## Design Philosophy

**Bold and Confident**: Embrace color and energy
- **Vibrant Colors**: Rich purples, pinks, oranges, greens
- **Strong Gradients**: Multi-stop gradients everywhere
- **Dark Backgrounds**: Dark mode first for vibrancy
- **Playful Motion**: Bouncy, spring-based animations
- **Confident Typography**: Bold weights, strong statements

## Typography

```tsx
fonts: {
  sans: "Inter"              // Clean, modern
  display: "Inter"           // Same but heavier weights
}

// Bold type scale
text-xl: 1.25rem (20px) - font-semibold
text-2xl: 1.5rem (24px) - font-bold
text-3xl: 1.875rem (30px) - font-bold
text-4xl: 2.25rem (36px) - font-bold
text-5xl: 3rem (48px) - font-extrabold
text-6xl: 3.75rem (60px) - font-extrabold
text-7xl: 4.5rem (72px) - font-extrabold
```

### Usage

```tsx
// ✅ Good: Bold, confident
<h1 className="text-7xl font-extrabold bg-clip-text text-transparent
               bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500">
  Build the future
</h1>

// ✅ Good: Strong statements
<p className="text-2xl font-bold text-white">
  Ship 10x faster with AI
</p>
```

## Color Palette

```tsx
colors: {
  primary: {
    purple: "#8B5CF6",      // Vibrant purple
    pink: "#EC4899",        // Hot pink
    orange: "#F97316",      // Bright orange
  },
  secondary: {
    cyan: "#06B6D4",        // Cyan
    green: "#10B981",       // Green
    yellow: "#FBBF24",      // Yellow
  },
  background: {
    dark: "#0F172A",        // Slate 900
    darker: "#020617",      // Slate 950
    elevated: "#1E293B",    // Slate 800
  },
  text: {
    primary: "#FFFFFF",     // White
    secondary: "#CBD5E1",   // Slate 300
    tertiary: "#94A3B8",    // Slate 400
  }
}
```

### Gradient Recipes

```tsx
// Primary gradient
bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500

// Cool gradient
bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-700

// Warm gradient
bg-gradient-to-r from-orange-500 via-red-500 to-pink-600

// Success gradient
bg-gradient-to-r from-green-400 to-cyan-500

// Background gradient
bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900
```

## Component Examples

### Hero Section

```tsx
<section className="relative min-h-screen flex items-center overflow-hidden bg-slate-950">
  {/* Animated background */}
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-slate-900 to-cyan-900/50" />

    {/* Floating orbs */}
    <motion.div
      className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"
      animate={{ y: [0, 50, 0], scale: [1, 1.1, 1] }}
      transition={{ duration: 8, repeat: Infinity }}
    />
    <motion.div
      className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl"
      animate={{ y: [0, -50, 0], scale: [1, 1.2, 1] }}
      transition={{ duration: 10, repeat: Infinity }}
    />
  </div>

  {/* Content */}
  <div className="relative z-10 max-w-6xl mx-auto px-8 py-32 text-center">
    {/* Badge */}
    <motion.div
      className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20
                 border border-purple-500/30 rounded-full mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
      <span className="text-sm font-semibold text-purple-300">Now in Beta</span>
    </motion.div>

    {/* Headline */}
    <motion.h1
      className="text-7xl md:text-8xl font-extrabold mb-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <span className="bg-clip-text text-transparent bg-gradient-to-r
                     from-purple-400 via-pink-400 to-orange-400">
        Build the future
      </span>
    </motion.h1>

    {/* Subheadline */}
    <motion.p
      className="text-2xl text-slate-300 mb-12 max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      The AI-powered platform that helps you ship 10x faster
    </motion.p>

    {/* CTAs */}
    <motion.div
      className="flex flex-col sm:flex-row gap-4 justify-center"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <button className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600
                       rounded-xl font-bold text-lg text-white overflow-hidden">
        <span className="relative z-10">Get Started Free</span>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500
                       opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>

      <button className="px-8 py-4 bg-slate-800/50 border-2 border-slate-700
                       rounded-xl font-bold text-lg text-white backdrop-blur-sm
                       hover:border-purple-500 hover:bg-slate-800 transition-all">
        Watch Demo
      </button>
    </motion.div>
  </div>
</section>
```

### Feature Card

```tsx
<motion.div
  className="group relative p-8 bg-gradient-to-br from-slate-800 to-slate-900
             rounded-2xl border border-slate-700 overflow-hidden"
  whileHover={{ scale: 1.02, y: -4 }}
  transition={{ type: 'spring', stiffness: 300 }}
>
  {/* Glow effect */}
  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0
                 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all" />

  {/* Icon */}
  <div className="relative w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600
                 rounded-xl flex items-center justify-center mb-6
                 group-hover:scale-110 transition-transform">
    <Icon className="w-7 h-7 text-white" />
  </div>

  {/* Content */}
  <h3 className="relative text-2xl font-bold text-white mb-3">
    {title}
  </h3>
  <p className="relative text-slate-400 leading-relaxed">
    {description}
  </p>

  {/* Accent line */}
  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-pink-600
                 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
</motion.div>
```

### Glassmorphic Card

```tsx
<div className="relative p-6 bg-white/10 backdrop-blur-xl rounded-2xl
               border border-white/20 shadow-2xl">
  <div className="flex items-center gap-4 mb-4">
    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full" />
    <div>
      <h4 className="font-bold text-white">{name}</h4>
      <p className="text-sm text-slate-400">{role}</p>
    </div>
  </div>

  <p className="text-slate-300 leading-relaxed">
    {content}
  </p>
</div>
```

### Stat Card

```tsx
<div className="relative p-8 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800
               rounded-2xl border border-slate-700 overflow-hidden">
  {/* Background accent */}
  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-transparent
                 rounded-full blur-3xl" />

  {/* Content */}
  <div className="relative">
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2 bg-purple-500/20 rounded-lg">
        <Icon className="w-5 h-5 text-purple-400" />
      </div>
      <span className="text-sm font-semibold text-slate-400">{label}</span>
    </div>

    <div className="text-5xl font-extrabold bg-clip-text text-transparent
                   bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
      {value}
    </div>

    <div className="flex items-center gap-2 text-sm">
      <span className="text-green-400 font-semibold">↑ {change}%</span>
      <span className="text-slate-500">vs last month</span>
    </div>
  </div>
</div>
```

### Button Variants

```tsx
// Primary Gradient
<button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600
                 rounded-xl font-bold text-white shadow-lg shadow-purple-500/50
                 hover:shadow-xl hover:shadow-purple-500/60 hover:scale-105
                 transition-all">
  Get Started
</button>

// Secondary Glow
<button className="px-8 py-4 bg-slate-800 border-2 border-purple-500
                 rounded-xl font-bold text-white
                 hover:bg-slate-700 hover:shadow-lg hover:shadow-purple-500/50
                 transition-all">
  Learn More
</button>

// Ghost Gradient
<button className="group px-8 py-4 border-2 border-slate-700 rounded-xl font-bold
                 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400
                 hover:border-purple-500 transition-all">
  Explore
</button>
```

## Backgrounds

### Vibrant Gradient Mesh

```tsx
<div className="relative min-h-screen overflow-hidden bg-slate-950">
  {/* Base gradient */}
  <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />

  {/* Animated gradient orbs */}
  <motion.div
    className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-3xl"
    animate={{
      x: [0, 100, 0],
      y: [0, 50, 0],
      scale: [1, 1.2, 1]
    }}
    transition={{ duration: 10, repeat: Infinity }}
  />

  <motion.div
    className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-pink-500/30 rounded-full blur-3xl"
    animate={{
      x: [0, -100, 0],
      y: [0, -50, 0],
      scale: [1, 1.3, 1]
    }}
    transition={{ duration: 12, repeat: Infinity }}
  />

  <motion.div
    className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-3xl"
    animate={{
      x: [-50, 50, -50],
      y: [-50, 50, -50],
      scale: [1, 1.1, 1]
    }}
    transition={{ duration: 15, repeat: Infinity }}
  />

  {/* Noise texture */}
  <div className="absolute inset-0 opacity-[0.03] bg-[url('/noise.png')]" />

  {/* Content */}
  <div className="relative z-10">
    {content}
  </div>
</div>
```

## Animations

### Spring-Based Interactions

```tsx
// Button press
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
>
  Click Me
</motion.button>

// Card hover
<motion.div
  whileHover={{ y: -8, scale: 1.02 }}
  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
>
  {content}
</motion.div>

// Floating animation
<motion.div
  animate={{
    y: [0, -20, 0],
    rotate: [0, 5, 0, -5, 0]
  }}
  transition={{
    duration: 6,
    repeat: Infinity,
    ease: 'easeInOut'
  }}
>
  {floatingElement}
</motion.div>
```

### Page Transitions

```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.95 }}
  transition={{ duration: 0.3 }}
>
  {pageContent}
</motion.div>
```

## Navigation

```tsx
<header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl
                   border-b border-slate-800">
  <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
    {/* Logo */}
    <a href="/" className="flex items-center gap-2">
      <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl" />
      <span className="text-2xl font-bold text-white">Brand</span>
    </a>

    {/* Nav */}
    <nav className="hidden md:flex items-center gap-8">
      {navItems.map(item => (
        <a
          key={item.href}
          href={item.href}
          className="text-slate-300 hover:text-white font-medium transition-colors"
        >
          {item.label}
        </a>
      ))}
    </nav>

    {/* CTA */}
    <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600
                     rounded-lg font-bold text-white shadow-lg shadow-purple-500/30
                     hover:shadow-xl hover:shadow-purple-500/40 hover:scale-105 transition-all">
      Get Started
    </button>
  </div>
</header>
```

## When to Use

✅ **Use bold startup design for:**
- Consumer-facing startups
- Creative tools and platforms
- Social media applications
- Entertainment products
- Youth-oriented brands
- Dynamic web applications

❌ **Do NOT use for:**
- Banking and financial services
- Corporate/enterprise software
- Editorial/news content
- Minimal/professional services
- Government websites
- Healthcare applications

## Examples

### Product Launch

**Request:** "Create a product launch page"

**Output:** Bold hero with animated gradient, feature cards with glassmorphism, vibrant CTAs

### Dashboard

**Request:** "Create an analytics dashboard"

**Output:** Dark theme, gradient stat cards, colorful charts, animated transitions

### Pricing Page

**Request:** "Create a pricing section"

**Output:** Three gradient cards, bold typography, glowing buttons, animated features

## Resources

- **Inspiration:** Spotify.com, Figma.com, Notion.so, Linear.app (brand page)
- **Font:** Inter (Google Fonts)
- **Animation:** Framer Motion
- **Icons:** Lucide React

## Pro Tips

1. **Layer gradients** - Combine multiple gradient layers for depth
2. **Animate with purpose** - Spring physics for playful interactions
3. **Dark first** - Vibrant colors pop on dark backgrounds
4. **Balance boldness** - Not everything needs to be gradient/animated
5. **Accessibility** - Ensure text contrast even on gradients
