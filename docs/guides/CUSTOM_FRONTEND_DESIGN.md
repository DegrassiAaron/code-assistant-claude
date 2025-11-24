# Creating Custom Frontend Design Skills

Learn how to create personalized frontend design skills that match your unique aesthetic preferences and brand guidelines.

Based on [Claude's blog post on improving frontend design through skills](https://www.claude.com/blog/improving-frontend-design-through-skills).

---

## Table of Contents

1. [Overview](#overview)
2. [Why Custom Design Skills?](#why-custom-design-skills)
3. [Quick Start](#quick-start)
4. [Design Vectors to Customize](#design-vectors-to-customize)
5. [Creating Your Skill](#creating-your-skill)
6. [Example: RPG Theme](#example-rpg-theme)
7. [Testing Your Design Skill](#testing-your-design-skill)
8. [Advanced Customization](#advanced-customization)
9. [Best Practices](#best-practices)

---

## Overview

Custom frontend design skills allow you to steer Claude away from generic aesthetics (Inter fonts, purple gradients, minimal animations) toward your unique design preferences. By creating a skill that encodes your aesthetic vision, Claude will automatically apply your design language when building frontend components.

### The Problem

Without custom design skills, Claude tends toward "distributional convergence" - safe, generic design choices that dominate training data:

- **Typography**: Inter font everywhere
- **Colors**: Purple and blue gradients
- **Motion**: Minimal or scattered animations
- **Backgrounds**: Solid colors or simple gradients

### The Solution

Create a custom skill that defines your aesthetic preferences at the right level of abstraction:

- Not too vague ("make it look good")
- Not too specific (exact hex codes and pixel values)
- Just right (fonts, color palettes, motion principles, atmospheric guidance)

---

## Why Custom Design Skills?

### Benefits

✅ **Consistency**: Every component follows your design system
✅ **Efficiency**: No need to specify aesthetic preferences on every request
✅ **Distinctiveness**: Move beyond generic patterns
✅ **Brand Alignment**: Encode your brand guidelines
✅ **Reusability**: Use across multiple projects

### Use Cases

- **Personal Projects**: Encode your unique aesthetic
- **Brand Guidelines**: Enforce company design system
- **Client Work**: Create client-specific design skills
- **Theme Variants**: Multiple skills for different moods (dark mode, high contrast, etc.)

---

## Quick Start

### Using the Command

The fastest way to create a custom frontend design skill:

```bash
# Start the creation wizard
/create-design-skill
```

This will:
1. Ask about your design preferences
2. Generate a custom skill
3. Install it in your `.claude/skills/` directory
4. Test activation

### Manual Creation

Alternatively, create manually:

```bash
# 1. Copy the base template
cp -r templates/skills/frontend/frontend-design-base ~/.claude/skills/my-design

# 2. Edit the SKILL.md file
nano ~/.claude/skills/my-design/SKILL.md

# 3. Customize the design tokens
nano ~/.claude/skills/my-design/resources/design-tokens.json
```

---

## Design Vectors to Customize

Focus on these key design vectors to create distinctive aesthetics:

### 1. Typography

Move beyond Inter with distinctive font combinations:

**Editorial Style**:
```yaml
fonts:
  heading: "Playfair Display"  # Elegant serif
  body: "Source Serif Pro"     # Readable serif
```

**Technical Style**:
```yaml
fonts:
  heading: "IBM Plex Mono"     # Monospace authority
  body: "Inter"                # Clean sans-serif
```

**Modern Geometric**:
```yaml
fonts:
  heading: "Space Grotesk"     # Geometric sans
  body: "Inter"                # Neutral body
```

### 2. Color Palette

Create distinctive color schemes:

**Warm & Organic**:
```yaml
colors:
  primary: "Amber (#F59E0B)"
  secondary: "Stone (#78716C)"
  accent: "Lime (#84CC16)"
  background: "Warm cream (#FFFBEB)"
```

**Technical & Precise**:
```yaml
colors:
  primary: "Cyan (#06B6D4)"
  secondary: "Zinc (#18181B)"
  accent: "Purple (#A855F7)"
  background: "Dark slate (#0F172A)"
```

**Editorial & Bold**:
```yaml
colors:
  primary: "Crimson (#DC2626)"
  secondary: "Slate (#64748B)"
  accent: "Gold (#F59E0B)"
  background: "Ivory (#FFFBF5)"
```

### 3. Motion & Animation

Define animation philosophy:

**High-Impact Approach**:
```yaml
animation_philosophy: |
  Focus on key moments:
  - Page transitions (smooth, elegant)
  - Hero reveals (dramatic entrance)
  - Modal animations (clear context)

  Avoid:
  - Scattered micro-interactions
  - Animating every button hover
  - Distracting loading spinners
```

**Spring Physics**:
```yaml
animation_style: "spring"
spring_config:
  stiffness: 300
  damping: 25
easing: "cubic-bezier(0.22, 1, 0.36, 1)"
```

### 4. Backgrounds

Create atmospheric depth:

**Layered Approach**:
```yaml
background_style: "layered"
layers:
  - "Base gradient (subtle colors)"
  - "Pattern or texture (low opacity)"
  - "Gradient mesh (floating orbs with blur)"
  - "Vignette (subtle darkening at edges)"
```

**Minimalist Approach**:
```yaml
background_style: "minimalist"
philosophy: "Clean, solid colors with subtle grain texture"
```

---

## Creating Your Skill

### Step 1: Define Your Aesthetic

Start by answering these questions:

1. **What feeling should the design evoke?**
   - Professional and trustworthy?
   - Creative and playful?
   - Technical and precise?
   - Warm and approachable?

2. **What visual references inspire you?**
   - Magazine layouts?
   - Developer tools?
   - Nature and organic forms?
   - Brutalist architecture?

3. **What colors represent your brand?**
   - Primary color: `______`
   - Secondary color: `______`
   - Accent color: `______`

4. **What typography style fits?**
   - Serif (editorial, sophisticated)
   - Sans-serif (modern, clean)
   - Monospace (technical, precise)
   - Display (bold, attention-grabbing)

### Step 2: Create the Skill File

Create `~/.claude/skills/my-design/SKILL.md`:

```markdown
---
name: "my-custom-design"
version: "1.0.0"
description: "[YOUR AESTHETIC DESCRIPTION] design system. Use when creating frontend components and interfaces."
author: "Your Name"
category: "domain"

triggers:
  keywords: ["frontend", "ui", "component", "design"]
  patterns: ["create.*component", "build.*ui"]
  filePatterns: ["*.tsx", "*.jsx"]
  commands: ["/design"]

tokenCost:
  metadata: 65
  fullContent: 3200
  resources: 800

priority: "high"
autoActivate: true
cacheStrategy: "normal"
---

# My Custom Design Skill

[YOUR DESIGN PHILOSOPHY]

## Typography

### Fonts
- **Heading**: [YOUR HEADING FONT]
- **Body**: [YOUR BODY FONT]

### Rationale
[Why these fonts? What feeling do they create?]

## Color Palette

### Primary Colors
- **Primary**: [COLOR] - [PURPOSE]
- **Secondary**: [COLOR] - [PURPOSE]
- **Accent**: [COLOR] - [PURPOSE]

### Usage Guidelines
[When to use each color]

## Motion & Animation

### Philosophy
[Your animation approach]

### Key Principles
1. [Principle 1]
2. [Principle 2]
3. [Principle 3]

## Backgrounds

### Approach
[Your background style]

### Implementation
```tsx
// Example background pattern
<div className="relative">
  {/* Your background layers */}
</div>
```

## Component Examples

### Button
```tsx
// Your distinctive button style
<button className="[YOUR STYLES]">
  Click Me
</button>
```

### Card
```tsx
// Your card pattern
<div className="[YOUR STYLES]">
  {content}
</div>
```

## Accessibility

- All designs must meet WCAG 2.1 AA standards
- [Your specific accessibility considerations]
```

### Step 3: Create Design Tokens

Create `~/.claude/skills/my-design/resources/design-tokens.json`:

```json
{
  "typography": {
    "fonts": {
      "heading": "Your Heading Font",
      "body": "Your Body Font"
    },
    "scale": {
      "xs": "0.75rem",
      "sm": "0.875rem",
      "base": "1rem",
      "lg": "1.125rem",
      "xl": "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem"
    }
  },
  "colors": {
    "primary": {
      "50": "#...",
      "500": "#...",
      "900": "#..."
    }
  },
  "animations": {
    "durations": {
      "fast": "150ms",
      "normal": "300ms",
      "slow": "500ms"
    },
    "easings": {
      "spring": "cubic-bezier(0.22, 1, 0.36, 1)"
    }
  }
}
```

### Step 4: Create Tailwind Config

Create `~/.claude/skills/my-design/resources/tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          // Your primary color scale
        },
        secondary: {
          // Your secondary color scale
        }
      },
      fontFamily: {
        heading: ['Your Heading Font', 'serif'],
        body: ['Your Body Font', 'sans-serif']
      }
    }
  }
}
```

---

## Example: RPG Theme

Let's create a fantasy RPG-themed design skill:

### Aesthetic Vision

**Feeling**: Mystical, adventurous, high fantasy
**Visual References**: RPG character sheets, medieval manuscripts, fantasy games
**Colors**: Deep purples, gold accents, parchment backgrounds

### SKILL.md

```markdown
---
name: "rpg-design"
version: "1.0.0"
description: "Fantasy RPG aesthetic with mystical colors, decorative typography, and adventurous design elements. Use when creating fantasy game UIs or RPG-themed websites."
author: "Your Name"
category: "domain"

triggers:
  keywords: ["rpg", "fantasy", "game ui", "mystical"]
  patterns: ["create.*rpg", "fantasy.*ui"]
  filePatterns: ["*.tsx", "*.jsx"]

tokenCost:
  metadata: 70
  fullContent: 3500
  resources: 900

priority: "high"
autoActivate: true
---

# RPG Design Skill

Create immersive fantasy RPG interfaces with mystical aesthetics.

## Design Philosophy

Transport users into a fantasy world through:
- Decorative, medieval-inspired typography
- Rich purples and gold accents
- Parchment textures and ornate borders
- Dramatic animations with magical effects

## Typography

### Fonts
- **Display**: "Cinzel Decorative" - Medieval, ornate headers
- **Heading**: "Cinzel" - Clean serif for readability
- **Body**: "Crimson Pro" - Elegant, readable text
- **UI**: "Inter" - Modern for stats and numbers

### Usage
```tsx
<h1 className="font-cinzel-decorative text-6xl text-purple-900">
  Quest Log
</h1>
<p className="font-crimson text-lg text-amber-900">
  Your adventure begins...
</p>
```

## Color Palette

### Colors
- **Primary (Mystical Purple)**: #6B21A8
  - Use for: Important actions, magical elements
- **Secondary (Parchment)**: #FEF3C7
  - Use for: Backgrounds, panels
- **Accent (Gold)**: #F59E0B
  - Use for: Highlights, rewards, borders
- **Dark (Shadow)**: #1F2937
  - Use for: Text, depth

### Gradients
```tsx
// Mystical gradient
bg-gradient-to-br from-purple-900 via-purple-600 to-indigo-900

// Parchment gradient
bg-gradient-to-b from-amber-50 via-yellow-50 to-amber-100

// Gold shimmer
bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400
```

## Component Patterns

### Character Card
```tsx
<div className="relative p-8 bg-gradient-to-b from-amber-50 to-amber-100
                rounded-xl border-4 border-amber-600 shadow-2xl overflow-hidden">
  {/* Ornate corner decorations */}
  <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-purple-600" />
  <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-purple-600" />
  <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-purple-600" />
  <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-purple-600" />

  {/* Character portrait */}
  <div className="relative mb-6">
    <div className="w-32 h-32 mx-auto rounded-full border-4 border-gold-500 overflow-hidden">
      <img src={avatar} alt={name} />
    </div>
    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1
                    bg-purple-900 text-gold-300 rounded-full text-sm font-semibold">
      Level {level}
    </div>
  </div>

  {/* Character info */}
  <h2 className="font-cinzel text-3xl text-center text-purple-900 mb-2">
    {name}
  </h2>
  <p className="font-cinzel text-center text-amber-800 mb-6">
    {characterClass}
  </p>

  {/* Stats */}
  <div className="space-y-3">
    {stats.map(stat => (
      <div key={stat.name} className="flex justify-between items-center">
        <span className="font-crimson text-amber-900">{stat.name}</span>
        <div className="flex-1 mx-4 h-3 bg-amber-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-600 to-purple-400"
            initial={{ width: 0 }}
            animate={{ width: `${stat.value}%` }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <span className="font-inter font-bold text-purple-900">{stat.value}</span>
      </div>
    ))}
  </div>
</div>
```

### Quest Button
```tsx
<motion.button
  className="relative px-8 py-4 bg-gradient-to-br from-purple-700 to-purple-900
             text-gold-300 rounded-lg font-cinzel text-lg font-semibold
             border-2 border-gold-500 shadow-lg overflow-hidden group"
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.98 }}
>
  {/* Shimmer effect */}
  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-300/20 to-transparent
                  translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

  {/* Magical glow */}
  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity
                  bg-gradient-to-r from-purple-500/50 to-indigo-500/50 blur-xl" />

  <span className="relative z-10">{text}</span>
</motion.button>
```

### Inventory Panel
```tsx
<div className="relative p-6 bg-[url('/parchment-texture.jpg')] bg-cover
                rounded-lg border-4 border-amber-700 shadow-2xl">
  {/* Title banner */}
  <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-8 py-2
                  bg-gradient-to-r from-purple-900 to-purple-700
                  border-2 border-gold-500 rounded-full shadow-lg">
    <h3 className="font-cinzel text-gold-300 text-lg">Inventory</h3>
  </div>

  {/* Item grid */}
  <div className="grid grid-cols-4 gap-4 mt-8">
    {items.map(item => (
      <motion.div
        key={item.id}
        className="relative aspect-square bg-amber-100 rounded-lg
                   border-2 border-amber-600 p-2 cursor-pointer
                   hover:border-gold-500 hover:shadow-lg transition-all"
        whileHover={{ y: -4 }}
      >
        <img src={item.icon} alt={item.name} className="w-full h-full object-contain" />

        {/* Rarity indicator */}
        <div className={`absolute top-1 right-1 w-2 h-2 rounded-full
                        ${item.rarity === 'legendary' && 'bg-gold-500 shadow-glow'}
                        ${item.rarity === 'rare' && 'bg-purple-500'}
                        ${item.rarity === 'common' && 'bg-slate-400'}`}
        />
      </motion.div>
    ))}
  </div>
</div>
```

## Animations

### Magical Reveal
```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.8, rotateY: 180 }}
  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
  transition={{
    duration: 0.8,
    ease: [0.22, 1, 0.36, 1],
    rotateY: { duration: 1 }
  }}
>
  {magicalContent}
</motion.div>
```

### Particle Effect
```tsx
{isHovered && (
  <div className="absolute inset-0 pointer-events-none">
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-gold-400 rounded-full"
        initial={{
          x: '50%',
          y: '50%',
          opacity: 1
        }}
        animate={{
          x: `${Math.random() * 100}%`,
          y: `${Math.random() * 100}%`,
          opacity: 0
        }}
        transition={{
          duration: 1 + Math.random(),
          ease: 'easeOut'
        }}
      />
    ))}
  </div>
)}
```

## Backgrounds

### Mystical Atmosphere
```tsx
<div className="relative min-h-screen overflow-hidden">
  {/* Base gradient */}
  <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900" />

  {/* Floating orbs */}
  <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" />
  <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-float"
       style={{ animationDelay: '2s' }} />

  {/* Stars/sparkles */}
  <div className="absolute inset-0 bg-[url('/stars.svg')] opacity-30" />

  {/* Content */}
  <div className="relative z-10">
    {content}
  </div>
</div>
```

## Accessibility

- Maintain 4.5:1 contrast ratio (dark purple text on light parchment)
- Provide text alternatives for all decorative elements
- Ensure keyboard navigation works with ornate buttons
- Test with screen readers - decorative elements should be hidden

## Resources

- Fonts: Google Fonts (Cinzel, Cinzel Decorative, Crimson Pro)
- Textures: High-quality parchment and leather textures
- Icons: Fantasy icon sets (swords, shields, potions, etc.)
```

---

## Testing Your Design Skill

### 1. Manual Testing

Test your skill with various component requests:

```bash
# Start Claude
claude

# Test 1: Simple component
> "Create a button using my design system"

# Test 2: Complex component
> "Create a dashboard card"

# Test 3: Full page
> "Create a landing page hero section"
```

Verify that Claude:
- Uses your specified fonts
- Applies your color palette
- Follows your animation principles
- Implements your background style

### 2. Automated Testing

Create a test suite:

```typescript
// tests/skills/my-design.test.ts
import { testSkillActivation } from '../utils/skill-tester';

describe('my-design skill', () => {
  it('should activate for frontend component requests', async () => {
    const result = await testSkillActivation({
      skillName: 'my-design',
      input: 'create a button component',
      expectedActivation: true
    });

    expect(result.activated).toBe(true);
  });

  it('should use custom fonts', async () => {
    const result = await generateComponent('button');

    expect(result.code).toContain('font-playfair');
    expect(result.code).not.toContain('font-inter');
  });

  it('should use custom color palette', async () => {
    const result = await generateComponent('card');

    expect(result.code).toContain('from-amber-');
    expect(result.code).not.toContain('from-purple-');
  });
});
```

---

## Advanced Customization

### Multiple Theme Variants

Create variants for different contexts:

```
~/.claude/skills/
  ├── my-design-light/      # Light mode
  ├── my-design-dark/       # Dark mode
  └── my-design-high-contrast/  # High contrast
```

Each can have different:
- Color palettes
- Animation speeds
- Contrast ratios
- Font weights

### Brand-Specific Skills

Create client-specific skills:

```
~/.claude/skills/
  ├── client-a-design/
  ├── client-b-design/
  └── agency-portfolio/
```

### Context-Aware Activation

Use more specific triggers:

```yaml
triggers:
  keywords: ["my-brand", "client-x"]
  filePatterns: ["projects/client-x/**/*.tsx"]
```

---

## Best Practices

### 1. Right Level of Abstraction

❌ **Too vague**: "Make it look good"
❌ **Too specific**: "Use hex color #8B5CF6 with 12px border radius"
✅ **Just right**: "Use purple as primary color, rounded corners, spring animations"

### 2. Document Rationale

Explain WHY you chose each design decision:

```markdown
### Why Playfair Display?

Playfair evokes editorial sophistication and timeless elegance.
It's distinctive enough to stand out from generic sans-serifs
while remaining highly readable at large sizes.
```

### 3. Provide Examples

Include concrete code examples:

```tsx
// ✅ Good example
<button className="px-8 py-4 bg-primary text-white rounded-lg">
  Click Me
</button>

// ❌ What to avoid
<button className="px-8 py-4 bg-blue-500 text-white">
  Generic Button
</button>
```

### 4. Keep It Focused

One skill = one aesthetic vision

Don't try to cover multiple styles in one skill.
Create separate skills for different aesthetics.

### 5. Version Control

Track changes to your design system:

```yaml
version: "2.1.0"
changelog:
  - "2.1.0: Added dark mode color palette"
  - "2.0.0: Changed primary font from Inter to Playfair"
  - "1.0.0: Initial release"
```

### 6. Test Across Contexts

Verify your skill works for:
- Simple components (buttons, inputs)
- Complex components (cards, modals)
- Full pages (landing pages, dashboards)
- Different screen sizes (mobile, tablet, desktop)

---

## Troubleshooting

### Skill Not Activating

**Problem**: Claude isn't using your custom design skill

**Solutions**:
1. Check skill is in `~/.claude/skills/` directory
2. Verify frontmatter has `autoActivate: true`
3. Test manual activation: `/skill my-design`
4. Check trigger keywords match your request

### Generic Designs Still Appearing

**Problem**: Claude is still using Inter and purple gradients

**Solutions**:
1. Be more explicit in your skill about what to avoid
2. Provide negative examples ("DO NOT use...")
3. Increase skill priority to "high"
4. Manually activate skill before making requests

### Inconsistent Application

**Problem**: Some components follow your style, others don't

**Solutions**:
1. Provide more comprehensive component examples
2. Create a component pattern library in resources
3. Be explicit about when to use each pattern
4. Test with more varied component requests

---

## Resources

### Inspiration

- [Dribbble](https://dribbble.com) - Design inspiration
- [Behance](https://www.behance.net) - Portfolio examples
- [Awwwards](https://www.awwwards.com) - Award-winning web design
- [SiteInspire](https://www.siteinspire.com) - Website showcase

### Typography

- [Google Fonts](https://fonts.google.com) - Free fonts
- [FontPair](https://www.fontpair.co) - Font combinations
- [Typewolf](https://www.typewolf.com) - Font recommendations

### Colors

- [Coolors](https://coolors.co) - Color palette generator
- [Adobe Color](https://color.adobe.com) - Color wheel
- [Tailwind Colors](https://tailwindcss.com/docs/customizing-colors) - Pre-made palettes

### Animation

- [Cubic Bezier](https://cubic-bezier.com) - Easing function editor
- [Easings](https://easings.net) - Common easing functions
- [Framer Motion](https://www.framer.com/motion/) - Animation library

---

## Next Steps

1. ✅ Define your aesthetic vision
2. ✅ Create your custom skill
3. ✅ Test with various components
4. ✅ Refine based on results
5. ✅ Document your design system
6. ✅ Share with your team

**Ready to create your custom design skill?**

Run `/create-design-skill` to get started with the interactive wizard!
