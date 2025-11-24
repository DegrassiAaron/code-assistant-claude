---
name: "rpg-design"
version: "1.0.0"
description: "Fantasy RPG aesthetic with ornate typography, mystical purple/gold colors, parchment textures, and dramatic effects. Use when creating fantasy games, RPG interfaces, character sheets, or medieval-themed websites. Do NOT use for modern business apps or technical tools."
author: "Code-Assistant-Claude"
category: "domain"

triggers:
  keywords: ["rpg", "fantasy", "game", "medieval", "mystical", "character"]
  patterns: ["rpg.*ui", "fantasy.*game", "character.*sheet"]
  filePatterns: ["*.tsx", "*.jsx"]
  commands: ["/rpg-design"]

tokenCost:
  metadata: 70
  fullContent: 3500
  resources: 700

priority: "high"
autoActivate: true
---

# RPG Design Skill

Immersive fantasy RPG interfaces with mystical aesthetics and ornate details.

## Design Philosophy

Transport players into a fantasy world:
- **Decorative Typography**: Medieval-inspired ornate fonts
- **Rich Colors**: Deep purples, mystical indigos, gold accents
- **Parchment & Leather**: Textured backgrounds
- **Ornate Details**: Borders, corners, decorative elements
- **Magical Effects**: Glowing elements, particle effects

## Typography

```tsx
fonts: {
  display: "Cinzel Decorative"   // Ornate, medieval headers
  heading: "Cinzel"              // Clean medieval serif
  body: "Crimson Pro"            // Readable fantasy text
  ui: "Inter"                    // Modern for stats/numbers
}

// Usage
<h1 className="font-cinzel-decorative text-6xl text-purple-900 mb-4">
  Quest Log
</h1>
```

## Colors

```tsx
colors: {
  mystical: {
    purple: "#6B21A8",     // Primary magical color
    indigo: "#4C1D95",     // Deep mystical
    gold: "#F59E0B",       // Treasure, highlights
  },
  parchment: {
    light: "#FEF3C7",      // Light parchment
    base: "#FDE68A",       // Base parchment
    dark: "#FCD34D"        // Aged parchment
  },
  leather: {
    brown: "#78350F",      // Deep leather
    tan: "#92400E"         // Light leather
  }
}
```

## Component Examples

### Character Card

```tsx
<div className="relative p-8 bg-gradient-to-b from-amber-50 to-amber-100
                rounded-xl border-4 border-amber-600 shadow-2xl">
  {/* Ornate corners */}
  <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-purple-600" />
  <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-purple-600" />
  <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-purple-600" />
  <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-purple-600" />

  {/* Character portrait */}
  <div className="relative mb-6">
    <div className="w-32 h-32 mx-auto rounded-full border-4 border-amber-500 overflow-hidden
                    shadow-lg shadow-purple-900/50">
      <img src={avatar} alt={name} className="w-full h-full object-cover" />
    </div>
    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2
                    px-4 py-1 bg-purple-900 text-amber-300 rounded-full text-sm font-semibold">
      Level {level}
    </div>
  </div>

  {/* Name and class */}
  <h2 className="font-cinzel text-3xl text-center text-purple-900 mb-2">
    {name}
  </h2>
  <p className="font-cinzel text-center text-amber-800 mb-6">
    {characterClass}
  </p>

  {/* Stats */}
  <div className="space-y-3">
    {stats.map(stat => (
      <div key={stat.name} className="flex items-center gap-3">
        <stat.icon className="w-5 h-5 text-purple-700" />
        <span className="font-crimson text-amber-900 flex-shrink-0 w-20">
          {stat.name}
        </span>
        <div className="flex-1 h-3 bg-amber-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-600 to-purple-400"
            initial={{ width: 0 }}
            animate={{ width: `${stat.value}%` }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <span className="font-inter font-bold text-purple-900 w-10 text-right">
          {stat.value}
        </span>
      </div>
    ))}
  </div>
</div>
```

### Quest Button

```tsx
<motion.button
  className="relative px-8 py-4 bg-gradient-to-br from-purple-700 to-purple-900
             text-amber-300 rounded-lg font-cinzel text-lg font-semibold
             border-2 border-amber-500 shadow-lg overflow-hidden group"
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.98 }}
>
  {/* Shimmer effect */}
  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/20 to-transparent
                  -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

  {/* Magical glow */}
  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity
                  bg-gradient-to-r from-purple-500/50 to-indigo-500/50 blur-xl -z-10" />

  <span className="relative z-10 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
    {text}
  </span>
</motion.button>
```

### Inventory Grid

```tsx
<div className="relative p-6 bg-[linear-gradient(180deg,#FEF3C7_0%,#FDE68A_100%)]
                rounded-lg border-4 border-amber-700 shadow-2xl">
  {/* Title banner */}
  <div className="absolute -top-6 left-1/2 -translate-x-1/2
                  px-8 py-2 bg-gradient-to-r from-purple-900 to-purple-700
                  border-2 border-amber-500 rounded-full shadow-lg">
    <h3 className="font-cinzel text-amber-300 text-lg drop-shadow">Inventory</h3>
  </div>

  {/* Item grid */}
  <div className="grid grid-cols-4 gap-4 mt-8">
    {items.map(item => (
      <motion.div
        key={item.id}
        className="relative aspect-square bg-amber-100 rounded-lg
                   border-2 border-amber-600 p-2 cursor-pointer
                   hover:border-amber-500 hover:shadow-lg transition-all"
        whileHover={{ y: -4 }}
      >
        <img src={item.icon} alt={item.name} className="w-full h-full object-contain" />

        {/* Rarity glow */}
        {item.rarity === 'legendary' && (
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/50 to-transparent
                         rounded-lg animate-pulse" />
        )}
      </motion.div>
    ))}
  </div>
</div>
```

## Backgrounds

### Mystical Atmosphere

```tsx
<div className="relative min-h-screen overflow-hidden bg-slate-900">
  {/* Base gradient */}
  <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900" />

  {/* Floating magical orbs */}
  <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" />
  <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-float"
       style={{ animationDelay: '2s' }} />

  {/* Stars */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:50px_50px] opacity-30" />

  <div className="relative z-10">
    {content}
  </div>
</div>
```

## Animations

### Magical Reveal

```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.8, rotateY: 180 }}
  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
>
  {content}
</motion.div>
```

### Particle Burst

```tsx
{isActive && (
  <div className="absolute inset-0 pointer-events-none">
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-amber-400 rounded-full"
        initial={{ x: '50%', y: '50%', opacity: 1 }}
        animate={{
          x: `${Math.random() * 100}%`,
          y: `${Math.random() * 100}%`,
          opacity: 0
        }}
        transition={{ duration: 1 + Math.random(), ease: 'easeOut' }}
      />
    ))}
  </div>
)}
```

## When to Use

✅ Fantasy games, RPG character interfaces, Medieval websites, Quest logs
❌ Business apps, Technical dashboards, Modern e-commerce, Professional services

## Resources

Fonts: Cinzel, Cinzel Decorative, Crimson Pro (Google Fonts)
Textures: Parchment, leather, wood grain backgrounds
Icons: Fantasy icon sets (swords, shields, potions, spells)
