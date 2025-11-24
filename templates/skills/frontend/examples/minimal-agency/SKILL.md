---
name: "minimal-agency"
version: "1.0.0"
description: "Minimal agency aesthetic inspired by Apple, Linear, and Stripe. Clean, sophisticated design with generous white space and refined typography. Use for agency websites, SaaS products, portfolio sites, and modern web applications. Do NOT use for gaming, editorial content, or technical dashboards."
author: "Code-Assistant-Claude"
category: "domain"

triggers:
  keywords: ["minimal", "clean", "agency", "modern", "sophisticated", "saas"]
  patterns: ["minimal.*design", "clean.*ui", "agency.*website"]
  filePatterns: ["*.tsx", "*.jsx"]
  commands: ["/minimal-design"]

tokenCost:
  metadata: 70
  fullContent: 3400
  resources: 600

priority: "high"
autoActivate: true
---

# Minimal Agency Design Skill

Clean, sophisticated design inspired by Apple, Linear, and Stripe.

## Design Philosophy

**Less is More**: Embrace minimalism with purpose
- **White Space**: Generous spacing, breathing room
- **Typography**: Clean sans-serif, clear hierarchy
- **Monochrome**: Black/white with subtle color accents
- **Precision**: Pixel-perfect alignment and spacing
- **Subtlety**: Refined details over bold statements

## Typography

```tsx
fonts: {
  sans: "Inter"              // All text (clean, neutral)
  display: "Space Grotesk"   // Optional: Hero headlines
}

// Minimal type scale
text-xs: 0.75rem
text-sm: 0.875rem
text-base: 1rem
text-lg: 1.125rem
text-xl: 1.25rem
text-2xl: 1.5rem
text-3xl: 1.875rem
text-4xl: 2.25rem
text-5xl: 3rem
```

### Usage

```tsx
// ✅ Good: Clean hierarchy
<div>
  <h1 className="text-5xl font-semibold tracking-tight text-black">
    Ship faster
  </h1>
  <p className="text-xl text-gray-600 mt-6">
    Build products people love with modern tools
  </p>
</div>

// ❌ Avoid: Overly decorative
<h1 className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r">
  Too Much
</h1>
```

## Color Palette

```tsx
colors: {
  background: {
    primary: "#FFFFFF",     // White
    secondary: "#FAFAFA",   // Off-white
    tertiary: "#F5F5F5"     // Light gray
  },
  text: {
    primary: "#000000",     // Black
    secondary: "#525252",   // Gray 600
    tertiary: "#A3A3A3"     // Gray 400
  },
  accent: {
    primary: "#3B82F6",     // Blue (subtle)
    secondary: "#000000"    // Black for CTAs
  },
  border: {
    light: "#F5F5F5",       // Subtle dividers
    medium: "#E5E5E5",      // Standard borders
    dark: "#D4D4D4"         // Emphasized borders
  }
}
```

### Usage Guidelines

```tsx
// Backgrounds: Pure white or subtle grays
className="bg-white"
className="bg-gray-50"

// Text: Black or grays, never pure black on pure white for body
className="text-black"          // Headlines
className="text-gray-600"       // Body text
className="text-gray-400"       // Secondary text

// Accent sparingly: Blue for links, black for CTAs
className="text-blue-600"       // Links
className="bg-black text-white" // Primary CTA
```

## Component Examples

### Hero Section

```tsx
<section className="max-w-5xl mx-auto px-8 py-32 text-center">
  {/* Overline */}
  <div className="mb-6">
    <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
      Introducing v2.0
    </span>
  </div>

  {/* Headline */}
  <h1 className="text-6xl md:text-7xl font-semibold tracking-tight text-black mb-6">
    Ship products faster
  </h1>

  {/* Subheadline */}
  <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12">
    The modern platform for teams who want to build better products
  </p>

  {/* CTAs */}
  <div className="flex flex-col sm:flex-row gap-4 justify-center">
    <button className="px-6 py-3 bg-black text-white rounded-lg font-medium
                     hover:bg-gray-900 transition-colors">
      Get Started
    </button>
    <button className="px-6 py-3 border border-gray-300 text-black rounded-lg font-medium
                     hover:border-gray-400 transition-colors">
      Learn More
    </button>
  </div>
</section>
```

### Feature Card

```tsx
<div className="p-8 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
  {/* Icon */}
  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
    <Icon className="w-6 h-6 text-black" />
  </div>

  {/* Content */}
  <h3 className="text-xl font-semibold text-black mb-3">
    {title}
  </h3>
  <p className="text-gray-600 leading-relaxed">
    {description}
  </p>
</div>
```

### Navigation

```tsx
<header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
  <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
    {/* Logo */}
    <a href="/" className="text-xl font-semibold text-black">
      Brand
    </a>

    {/* Nav */}
    <nav className="hidden md:flex items-center gap-8">
      {navItems.map(item => (
        <a
          key={item.href}
          href={item.href}
          className="text-sm text-gray-600 hover:text-black transition-colors"
        >
          {item.label}
        </a>
      ))}
    </nav>

    {/* CTA */}
    <button className="px-4 py-2 bg-black text-white text-sm rounded-lg font-medium
                     hover:bg-gray-900 transition-colors">
      Sign In
    </button>
  </div>
</header>
```

### Card Grid

```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  {items.map(item => (
    <article
      key={item.id}
      className="group cursor-pointer"
    >
      {/* Image */}
      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500
                   group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <h3 className="text-lg font-semibold text-black mb-2 group-hover:text-gray-600 transition-colors">
        {item.title}
      </h3>
      <p className="text-sm text-gray-600">
        {item.description}
      </p>
    </article>
  ))}
</div>
```

### Input Field

```tsx
<div className="space-y-2">
  <label htmlFor={id} className="block text-sm font-medium text-gray-700">
    {label}
  </label>
  <input
    id={id}
    type={type}
    className="w-full px-4 py-2 border border-gray-300 rounded-lg
               focus:outline-none focus:border-black focus:ring-1 focus:ring-black
               transition-colors"
    placeholder={placeholder}
  />
</div>
```

### Button Variants

```tsx
// Primary (Black)
<button className="px-6 py-3 bg-black text-white rounded-lg font-medium
                 hover:bg-gray-900 transition-colors">
  Primary Action
</button>

// Secondary (Border)
<button className="px-6 py-3 border border-gray-300 text-black rounded-lg font-medium
                 hover:border-gray-400 hover:bg-gray-50 transition-colors">
  Secondary Action
</button>

// Ghost
<button className="px-6 py-3 text-gray-600 rounded-lg font-medium
                 hover:text-black hover:bg-gray-100 transition-colors">
  Ghost Action
</button>
```

## Backgrounds

### Clean and Simple

```tsx
// Pure white
<div className="min-h-screen bg-white">
  {content}
</div>

// With subtle gradient
<div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
  {content}
</div>

// With subtle pattern
<div className="relative min-h-screen bg-white">
  <div className="absolute inset-0 bg-[radial-gradient(#e5e5e5_1px,transparent_1px)] [background-size:20px_20px] opacity-30" />
  <div className="relative z-10">
    {content}
  </div>
</div>
```

## Animations

### Minimal and Purposeful

```tsx
// Subtle fade in
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: 'easeOut' }}
>
  {content}
</motion.div>

// Smooth hover states (CSS)
className="transition-colors duration-200"
className="transition-transform duration-300 hover:scale-105"

// Smooth border transitions
className="border border-gray-200 hover:border-black transition-colors duration-200"
```

### Loading States

```tsx
// Subtle skeleton
<div className="animate-pulse">
  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
  <div className="h-4 bg-gray-200 rounded w-1/2" />
</div>

// Minimal spinner
<div className="w-5 h-5 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
```

## Layout Principles

### Spacing Scale

```tsx
// Use consistent spacing (8px base)
space-1: 0.25rem (4px)
space-2: 0.5rem (8px)
space-4: 1rem (16px)
space-6: 1.5rem (24px)
space-8: 2rem (32px)
space-12: 3rem (48px)
space-16: 4rem (64px)
space-24: 6rem (96px)
space-32: 8rem (128px)
```

### Max Widths

```tsx
// Content containers
max-w-md: 28rem    // Forms
max-w-2xl: 42rem   // Articles
max-w-4xl: 56rem   // Standard content
max-w-6xl: 72rem   // Wide content
max-w-7xl: 80rem   // Full width
```

## Accessibility

All components meet WCAG 2.1 AA standards:

```tsx
// Text contrast
text-black on white: 21:1 (excellent)
text-gray-600 on white: 7:1 (excellent)
text-gray-400 on white: 4.5:1 (pass)

// Focus states
focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2

// Interactive elements
<button
  className="..."
  aria-label="Descriptive label"
>
  {content}
</button>
```

## Grid Layouts

```tsx
// Standard grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {items.map(item => (
    <div key={item.id}>{item.content}</div>
  ))}
</div>

// Feature grid (asymmetric)
<div className="grid grid-cols-12 gap-8">
  <div className="col-span-12 md:col-span-7">
    {mainContent}
  </div>
  <div className="col-span-12 md:col-span-5">
    {sidebar}
  </div>
</div>
```

## Icons

Use simple, outlined icons:

```tsx
// Lucide React (recommended)
import { ArrowRight, Check, X } from 'lucide-react';

<ArrowRight className="w-5 h-5 text-gray-600" />

// Icon sizing
w-4 h-4: 16px (small, inline)
w-5 h-5: 20px (standard)
w-6 h-6: 24px (large)
w-8 h-8: 32px (feature icons)
```

## When to Use

✅ **Use minimal agency design for:**
- SaaS products and platforms
- Agency websites
- Modern web applications
- Portfolio sites
- Product landing pages
- Professional services

❌ **Do NOT use for:**
- Gaming interfaces
- Editorial/magazine content
- Technical dashboards
- E-commerce with heavy imagery
- Playful consumer apps

## Examples

### Landing Page

**Request:** "Create a SaaS landing page"

**Output:** Clean hero with large headline, subtle CTA, feature grid with icons, minimal footer

### Dashboard

**Request:** "Create a minimal dashboard"

**Output:** Clean sidebar, white content area, subtle borders, organized data cards

### Pricing Page

**Request:** "Create a pricing section"

**Output:** Three-column layout, black/white cards, subtle hover states, clear CTAs

## Resources

- **Inspiration:** Apple.com, Linear.app, Stripe.com, Vercel.com
- **Font:** Inter (Google Fonts)
- **Icons:** Lucide React
- **Colors:** Tailwind gray scale + black/white

## Tailwind Configuration

```javascript
// Minimal theme config
module.exports = {
  theme: {
    extend: {
      colors: {
        accent: '#3B82F6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
      },
    },
  },
}
```

## Component Library

Recommend using:
- **Radix UI** - Unstyled, accessible components
- **Headless UI** - Tailwind-friendly primitives
- **shadcn/ui** - Pre-styled components (customize to minimal style)
