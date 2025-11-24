---
name: "nature-organic"
version: "1.0.0"
description: "Nature-inspired organic design with warm earth tones, natural textures, flowing curves, and calming aesthetics. Use for wellness brands, eco-friendly products, organic food, sustainable fashion, and mindfulness apps. Do NOT use for technical tools, gaming, or corporate finance."
author: "Code-Assistant-Claude"
category: "domain"

triggers:
  keywords: ["nature", "organic", "natural", "wellness", "eco", "sustainable"]
  patterns: ["nature.*design", "organic.*ui", "wellness.*site"]
  filePatterns: ["*.tsx", "*.jsx"]
  commands: ["/nature-design"]

tokenCost:
  metadata: 70
  fullContent: 2900
  resources: 550

priority: "high"
autoActivate: true
---

# Nature Organic Design Skill

Warm, natural design inspired by earth and wellness.

## Design Philosophy

**Natural and Calming**: Embrace organic forms and earth tones
- **Earth Tones**: Warm browns, greens, ambers, terracotta
- **Soft Curves**: Rounded corners, flowing shapes
- **Natural Textures**: Paper, linen, wood grain
- **Generous Spacing**: Breathing room, calm layouts
- **Organic Motion**: Gentle, flowing animations

## Typography & Colors

```tsx
fonts: {
  serif: "Lora"         // Warm, readable
  sans: "Inter"          // Clean, organic feel
}

colors: {
  primary: {
    amber: "#F59E0B",    // Warm amber
    terracotta: "#EA580C", // Clay/terracotta
  },
  secondary: {
    sage: "#84CC16",     // Natural green
    stone: "#78716C",    // Warm gray
  },
  background: {
    cream: "#FFFBEB",    // Warm cream
    sand: "#FEF3C7",     // Light sand
  },
  text: {
    primary: "#44403C",  // Warm dark brown
    secondary: "#78716C" // Stone
  }
}
```

## Key Components

### Hero with Natural Imagery
```tsx
<section className="relative min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-lime-50">
  {/* Organic shapes background */}
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-200/30 rounded-full blur-3xl" />
    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-lime-200/30 rounded-full blur-3xl" />
  </div>

  <div className="relative z-10 max-w-6xl mx-auto px-8 py-32">
    <motion.h1
      className="font-lora text-7xl font-bold text-stone-900 mb-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      Natural Living
      <br />
      <span className="text-amber-700">Simplified</span>
    </motion.h1>
    <p className="text-2xl text-stone-600 mb-8 max-w-2xl">
      Discover sustainable products for a mindful lifestyle
    </p>
    <button className="px-8 py-4 bg-amber-600 text-white font-semibold rounded-full
                     hover:bg-amber-700 transition-colors shadow-lg shadow-amber-600/30">
      Explore Collection
    </button>
  </div>
</section>
```

### Product Card (Organic)
```tsx
<div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
  {/* Image */}
  <div className="relative aspect-square bg-amber-50 overflow-hidden">
    <img
      src={product.image}
      alt={product.name}
      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
    />
    {product.isOrganic && (
      <span className="absolute top-4 left-4 px-3 py-1 bg-lime-600 text-white text-sm font-semibold rounded-full">
        🌿 Organic
      </span>
    )}
  </div>

  {/* Content */}
  <div className="p-6">
    <h3 className="font-lora text-xl font-bold text-stone-900 mb-2">
      {product.name}
    </h3>
    <p className="text-stone-600 mb-4">{product.description}</p>
    <div className="flex items-center justify-between">
      <span className="text-2xl font-bold text-amber-700">${product.price}</span>
      <button className="px-6 py-3 bg-amber-100 text-amber-900 font-semibold rounded-full
                       hover:bg-amber-200 transition-colors">
        Add to Cart
      </button>
    </div>
  </div>
</div>
```

### Feature Section with Icons
```tsx
<div className="grid grid-cols-3 gap-12 max-w-5xl mx-auto py-24">
  {features.map(feature => (
    <div key={feature.id} className="text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-lime-100 rounded-full
                     flex items-center justify-center mx-auto mb-6">
        <feature.icon className="w-10 h-10 text-amber-700" />
      </div>
      <h3 className="font-lora text-xl font-bold text-stone-900 mb-3">
        {feature.title}
      </h3>
      <p className="text-stone-600 leading-relaxed">
        {feature.description}
      </p>
    </div>
  ))}
</div>
```

### Newsletter Section
```tsx
<section className="bg-gradient-to-r from-amber-50 to-lime-50 py-24">
  <div className="max-w-4xl mx-auto px-8 text-center">
    <h2 className="font-lora text-5xl font-bold text-stone-900 mb-4">
      Join Our Community
    </h2>
    <p className="text-xl text-stone-600 mb-8">
      Get wellness tips and exclusive offers delivered to your inbox
    </p>

    <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
      <input
        type="email"
        placeholder="Your email"
        className="flex-1 px-6 py-4 bg-white border-2 border-amber-200 rounded-full
                 focus:outline-none focus:border-amber-500 transition-colors"
      />
      <button className="px-8 py-4 bg-amber-600 text-white font-semibold rounded-full
                       hover:bg-amber-700 transition-colors whitespace-nowrap">
        Subscribe
      </button>
    </form>

    <p className="mt-4 text-sm text-stone-500">
      🌿 100% organic content. Unsubscribe anytime.
    </p>
  </div>
</section>
```

## Animations

### Gentle Float
```tsx
<motion.div
  animate={{
    y: [0, -10, 0],
  }}
  transition={{
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut"
  }}
>
  {floatingElement}
</motion.div>
```

### Leaf Fall Effect
```tsx
{[...Array(10)].map((_, i) => (
  <motion.div
    key={i}
    className="absolute w-4 h-4 text-lime-600"
    initial={{ y: -50, x: Math.random() * window.innerWidth, opacity: 0 }}
    animate={{
      y: window.innerHeight + 50,
      x: Math.random() * window.innerWidth,
      opacity: [0, 1, 1, 0],
      rotate: [0, 360]
    }}
    transition={{
      duration: 5 + Math.random() * 5,
      repeat: Infinity,
      delay: i * 0.5
    }}
  >
    🍃
  </motion.div>
))}
```

## When to Use

✅ Wellness brands, Eco products, Organic food, Sustainable fashion, Mindfulness apps, Yoga/fitness
❌ Technical tools, Gaming, Corporate finance, E-sports, Heavy industry
