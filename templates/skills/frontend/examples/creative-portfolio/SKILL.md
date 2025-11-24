---
name: "creative-portfolio"
version: "1.0.0"
description: "Creative portfolio design for designers, artists, and creative professionals. Experimental layouts, bold typography, artistic expression, and unique interactions. Use for designer portfolios, creative agency sites, artist showcases, and experimental web projects. Do NOT use for e-commerce, corporate sites, or technical tools."
author: "Code-Assistant-Claude"
category: "domain"

triggers:
  keywords: ["creative", "portfolio", "artist", "designer", "experimental", "artistic"]
  patterns: ["creative.*design", "portfolio.*site", "artist.*portfolio"]
  filePatterns: ["*.tsx", "*.jsx"]
  commands: ["/creative-design"]

tokenCost:
  metadata: 70
  fullContent: 3000
  resources: 600

priority: "high"
autoActivate: true
---

# Creative Portfolio Design Skill

Experimental, artistic design for creative professionals.

## Design Philosophy

**Express and Experiment**: Break conventions, showcase creativity
- **Asymmetric Layouts**: Break the grid
- **Bold Typography**: Large, dramatic type
- **Unique Interactions**: Cursor effects, scroll animations
- **Artistic Expression**: Photography, illustrations, videos
- **Personality**: Distinct, memorable, unconventional

## Typography & Colors

```tsx
fonts: {
  display: "Archivo Black"   // Bold, impactful
  heading: "Work Sans"        // Modern, geometric
  body: "Inter"               // Clean readability
}

// Creative palette (example)
colors: {
  background: "#0A0A0A",      // Rich black
  accent1: "#FF6B35",         // Vibrant orange
  accent2: "#00D9FF",         // Electric cyan
  accent3: "#FFE66D",         // Bright yellow
  text: "#FFFFFF"             // White
}
```

## Key Components

### Hero with Cursor Effect
```tsx
function CreativeHero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  return (
    <section
      className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden"
      onMouseMove={(e) => {
        const { clientX, clientY } = e;
        setMousePosition({ x: clientX, y: clientY });
      }}
    >
      {/* Gradient follows cursor */}
      <div
        className="absolute w-96 h-96 bg-gradient-to-r from-orange-500/30 to-cyan-500/30 rounded-full blur-3xl pointer-events-none"
        style={{
          transform: `translate(${mousePosition.x - 192}px, ${mousePosition.y - 192}px)`
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center">
        <motion.h1
          className="font-archivo-black text-8xl text-white mb-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
        >
          CREATIVE
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-cyan-500">
            DIRECTOR
          </span>
        </motion.h1>
        <p className="text-xl text-gray-400">Based in NYC • Available for projects</p>
      </div>
    </section>
  );
}
```

### Project Grid (Asymmetric)
```tsx
<div className="grid grid-cols-12 gap-4 p-8">
  {/* Large featured project */}
  <motion.div
    className="col-span-7 row-span-2 relative aspect-[4/3] overflow-hidden rounded-2xl group cursor-pointer"
    whileHover={{ scale: 1.02 }}
  >
    <img src={project1.image} className="w-full h-full object-cover" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
      <div className="absolute bottom-0 left-0 right-0 p-8">
        <h3 className="text-3xl font-bold text-white mb-2">{project1.title}</h3>
        <p className="text-gray-300">{project1.category}</p>
      </div>
    </div>
  </motion.div>

  {/* Smaller projects */}
  <motion.div className="col-span-5 aspect-square" whileHover={{ scale: 1.02 }}>
    <ProjectCard project={project2} />
  </motion.div>

  <motion.div className="col-span-5 aspect-square" whileHover={{ scale: 1.02 }}>
    <ProjectCard project={project3} />
  </motion.div>
</div>
```

### Scroll-Triggered Text Reveal
```tsx
<motion.h2
  className="font-archivo-black text-7xl text-white"
  initial={{ opacity: 0, x: -100 }}
  whileInView={{ opacity: 1, x: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.8 }}
>
  PROJECTS
</motion.h2>
```

### Magnetic Button
```tsx
function MagneticButton({ children }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 3;
    const y = (e.clientY - rect.top - rect.height / 2) / 3;
    setPosition({ x, y });
  };

  return (
    <motion.button
      className="px-12 py-6 bg-white text-black font-bold text-lg rounded-full"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setPosition({ x: 0, y: 0 })}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15 }}
    >
      {children}
    </motion.button>
  );
}
```

## Animations & Effects

### Page Transitions
```tsx
<AnimatePresence mode="wait">
  <motion.div
    key={router.pathname}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
</AnimatePresence>
```

### Parallax Scroll
```tsx
const { scrollYProgress } = useScroll();
const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

<motion.div style={{ y }}>
  <img src={parallaxImage} alt="" />
</motion.div>
```

## When to Use

✅ Designer portfolios, Creative agencies, Artist showcases, Experimental projects
❌ E-commerce, Corporate sites, Technical tools, Government/banking
