# Component Patterns

Reusable component patterns for building distinctive frontend designs.

## Layout Patterns

### 1. Atmospheric Container

Create depth with layered backgrounds:

```tsx
<div className="relative min-h-screen">
  {/* Layer 1: Base gradient */}
  <div className="absolute inset-0 bg-gradient-to-br from-primary via-white to-secondary" />

  {/* Layer 2: Pattern/texture */}
  <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />

  {/* Layer 3: Vignette */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />

  {/* Content */}
  <div className="relative z-10">
    {children}
  </div>
</div>
```

### 2. Asymmetric Grid

Break away from symmetric layouts:

```tsx
<div className="grid grid-cols-12 gap-8">
  {/* Main content - offset and wide */}
  <div className="col-span-12 md:col-span-8 md:col-start-2">
    {mainContent}
  </div>

  {/* Sidebar - narrow, positioned */}
  <div className="col-span-12 md:col-span-3">
    {sidebar}
  </div>
</div>
```

## Interactive Patterns

### 1. Magnetic Button

Button that follows cursor on hover:

```tsx
import { motion } from 'framer-motion';
import { useState } from 'react';

function MagneticButton({ children }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 4;
    const y = (e.clientY - rect.top - rect.height / 2) / 4;
    setPosition({ x, y });
  };

  return (
    <motion.button
      className="px-8 py-4 bg-slate-900 text-white rounded-lg font-semibold"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setPosition({ x: 0, y: 0 })}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.button>
  );
}
```

### 2. Reveal Card

Card with reveal animation on hover:

```tsx
<motion.div
  className="group relative overflow-hidden rounded-xl bg-white shadow-lg"
  whileHover={{ scale: 1.02 }}
>
  {/* Image */}
  <div className="relative h-64 overflow-hidden">
    <img
      src={image}
      className="w-full h-full object-cover transition-transform duration-700
                 group-hover:scale-110"
      alt={title}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
  </div>

  {/* Content */}
  <div className="p-6">
    <h3 className="text-2xl font-bold mb-2">{title}</h3>
    <p className="text-slate-600">{description}</p>
  </div>

  {/* Reveal overlay */}
  <motion.div
    className="absolute inset-0 bg-gradient-to-br from-primary to-secondary
               flex items-center justify-center"
    initial={{ y: '100%' }}
    whileHover={{ y: 0 }}
    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
  >
    <button className="px-6 py-3 bg-white text-primary rounded-lg font-semibold">
      View Details
    </button>
  </motion.div>
</motion.div>
```

## Typography Patterns

### 1. Editorial Headline

Large, attention-grabbing headlines:

```tsx
<h1 className="font-playfair text-7xl md:text-8xl font-bold tracking-tight leading-none">
  <span className="block">Build Something</span>
  <span className="block text-transparent bg-clip-text bg-gradient-to-r
                   from-amber-400 via-rose-400 to-purple-400">
    Extraordinary
  </span>
</h1>
```

### 2. Technical Mono

Technical, developer-focused typography:

```tsx
<div className="font-mono">
  <span className="text-cyan-400">const</span>{' '}
  <span className="text-white">result</span>{' '}
  <span className="text-slate-400">=</span>{' '}
  <span className="text-purple-400">await</span>{' '}
  <span className="text-green-400">execute</span>
  <span className="text-slate-400">()</span>
</div>
```

## Background Patterns

### 1. Gradient Mesh

Multi-stop gradient with blur:

```tsx
<div className="absolute inset-0 overflow-hidden">
  {/* Gradient orbs */}
  <div className="absolute top-0 left-1/4 w-96 h-96
                  bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
  <div className="absolute bottom-0 right-1/4 w-96 h-96
                  bg-amber-500/30 rounded-full blur-3xl animate-pulse"
       style={{ animationDelay: '1s' }} />
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                  w-96 h-96 bg-rose-500/30 rounded-full blur-3xl animate-pulse"
       style={{ animationDelay: '2s' }} />
</div>
```

### 2. Grain Texture

Add film grain for richness:

```tsx
<div className="relative">
  {/* Content */}
  <div className="relative z-10">
    {children}
  </div>

  {/* Grain overlay */}
  <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay
                  bg-[url('data:image/svg+xml;base64,...grain-pattern...')]" />
</div>
```

## Navigation Patterns

### 1. Floating Navigation

Animated nav that appears on scroll:

```tsx
import { motion, useScroll, useTransform } from 'framer-motion';

function FloatingNav() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 100], [-100, 0]);
  const opacity = useTransform(scrollY, [0, 100], [0, 1]);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 px-8 py-4
                 bg-white/80 backdrop-blur-lg border-b border-slate-200"
      style={{ y, opacity }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Logo />
        <NavItems />
      </div>
    </motion.nav>
  );
}
```

### 2. Slide-out Menu

Mobile menu with smooth animation:

```tsx
import { AnimatePresence, motion } from 'framer-motion';

function SlideMenu({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Menu */}
          <motion.div
            className="fixed top-0 right-0 bottom-0 w-80 bg-white z-50 p-8"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <nav className="space-y-6">
              {menuItems.map(item => (
                <a
                  key={item.href}
                  href={item.href}
                  className="block text-2xl font-semibold hover:text-primary transition"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

## Form Patterns

### 1. Floating Label Input

Modern input with floating label:

```tsx
function FloatingLabelInput({ label, ...props }) {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  return (
    <div className="relative">
      <input
        {...props}
        className="peer w-full px-4 pt-6 pb-2 border-2 border-slate-200 rounded-lg
                   focus:border-primary outline-none transition"
        onFocus={() => setFocused(true)}
        onBlur={(e) => {
          setFocused(false);
          setHasValue(!!e.target.value);
        }}
      />
      <label
        className={`absolute left-4 transition-all pointer-events-none
                   ${focused || hasValue
                     ? 'top-2 text-xs text-primary'
                     : 'top-4 text-base text-slate-500'}`}
      >
        {label}
      </label>
    </div>
  );
}
```

## Data Visualization Patterns

### 1. Animated Progress Bar

Progress bar with spring animation:

```tsx
import { motion } from 'framer-motion';

function AnimatedProgress({ value, label }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-slate-600">{value}%</span>
      </div>

      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-secondary"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}
```

## Loading Patterns

### 1. Skeleton Loader

Content placeholder with shimmer effect:

```tsx
function SkeletonCard() {
  return (
    <div className="p-6 bg-white rounded-xl border border-slate-200 animate-pulse">
      <div className="h-4 bg-slate-200 rounded w-3/4 mb-4" />
      <div className="h-4 bg-slate-200 rounded w-1/2 mb-6" />
      <div className="h-32 bg-slate-200 rounded mb-4" />
      <div className="h-4 bg-slate-200 rounded w-5/6" />
    </div>
  );
}
```

## Best Practices

1. **Layer for Depth**: Use multiple background layers for atmospheric designs
2. **Purposeful Animation**: Animate state changes and key interactions, not everything
3. **Consistent Spacing**: Use a spacing scale, don't use arbitrary values
4. **Typography Hierarchy**: Create clear visual hierarchy with size and weight
5. **Color with Purpose**: Each color should serve a function in your design
6. **Accessibility First**: Test keyboard navigation and screen readers
7. **Performance**: Optimize images, lazy load components, minimize bundle size
