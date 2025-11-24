# Frontend Design Skill Examples

This directory contains 9 example frontend design skills demonstrating different aesthetic approaches. Use these as templates for creating your own custom design skills.

## Quick Reference

| Skill | Aesthetic | Best For | Colors |
|-------|-----------|----------|--------|
| **Minimal Agency** | Clean, Apple-like | SaaS, Agencies, Modern apps | Black/White/Blue |
| **Bold Startup** | Vibrant, energetic | Startups, Consumer apps | Purple/Pink/Orange |
| **E-commerce** | Product-focused | Online stores, Marketplaces | Blue/Green/White |
| **Corporate** | Professional, trustworthy | Banking, B2B, Enterprise | Navy/Gray/White |
| **Creative Portfolio** | Experimental, artistic | Designers, Artists, Agencies | Black/Vibrant accents |
| **Nature Organic** | Warm, natural | Wellness, Eco, Sustainable | Amber/Green/Cream |
| **Editorial** | Magazine, sophisticated | Publishing, Blogs, Content | Crimson/Slate/Ivory |
| **Technical** | Developer-focused | Dev tools, Dashboards | Cyan/Purple/Dark |
| **RPG** | Fantasy, mystical | Games, Medieval themes | Purple/Gold/Parchment |

---

## Available Examples

### 1. Minimal Agency (`minimal-agency/`)

**Aesthetic:** Clean, sophisticated, Apple/Linear/Stripe-inspired

**Best For:**
- SaaS products and platforms
- Agency websites
- Modern web applications
- Professional services
- Product landing pages

**Key Features:**
- Inter typography (clean, neutral)
- Black/white with subtle blue accents
- Generous white space
- Pixel-perfect alignment
- Subtle animations

**Preview:**
```tsx
<h1 className="text-6xl font-semibold tracking-tight text-black">
  Ship faster
</h1>
```

**Inspiration:** Apple.com, Linear.app, Stripe.com, Vercel.com

---

### 2. Bold Startup (`bold-startup/`)

**Aesthetic:** Vibrant, energetic, Spotify/Figma/Notion-inspired

**Best For:**
- Consumer-facing startups
- Creative tools and platforms
- Social media applications
- Entertainment products
- Dynamic web applications

**Key Features:**
- Inter typography (bold weights)
- Vibrant gradients (purple/pink/orange)
- Dark backgrounds for color pop
- Playful spring animations
- Glassmorphism effects

**Preview:**
```tsx
<h1 className="text-7xl font-extrabold bg-clip-text text-transparent
               bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400">
  Build the future
</h1>
```

**Inspiration:** Spotify.com, Figma.com, Notion.so

---

### 3. E-commerce (`ecommerce/`)

**Aesthetic:** Product-focused, conversion-optimized

**Best For:**
- Online stores
- Product catalogs
- Marketplace platforms
- Fashion/apparel sites
- Subscription services

**Key Features:**
- Inter + Poppins typography
- Trust blue for CTAs
- Large product images
- Reviews and ratings
- Trust badges and security indicators

**Preview:**
```tsx
<button className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl">
  Add to Cart
</button>
```

**Inspiration:** Shopify stores, Nike.com, Apple Store

---

### 4. Corporate Professional (`corporate-professional/`)

**Aesthetic:** Trustworthy, formal, business-focused

**Best For:**
- Banking and financial services
- Insurance companies
- Consulting firms
- Legal services
- B2B platforms
- Enterprise applications

**Key Features:**
- Merriweather + Inter typography
- Navy blue and gray palette
- Formal, structured layouts
- Data visualizations
- Conservative, professional

**Preview:**
```tsx
<h1 className="font-merriweather text-5xl font-bold text-slate-900">
  Enterprise Solutions You Can Trust
</h1>
```

**Inspiration:** JP Morgan, McKinsey, IBM

---

### 5. Creative Portfolio (`creative-portfolio/`)

**Aesthetic:** Experimental, artistic, bold

**Best For:**
- Designer portfolios
- Creative agency sites
- Artist showcases
- Photography portfolios
- Experimental web projects

**Key Features:**
- Archivo Black + Work Sans typography
- Asymmetric, grid-breaking layouts
- Cursor-following effects
- Scroll-triggered animations
- Bold, artistic expression

**Preview:**
```tsx
<h1 className="font-archivo-black text-8xl text-white">
  CREATIVE
  <br />
  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-cyan-500">
    DIRECTOR
  </span>
</h1>
```

**Inspiration:** Designer portfolios, Awwwards winners

---

### 6. Nature Organic (`nature-organic/`)

**Aesthetic:** Warm, natural, calming

**Best For:**
- Wellness brands
- Eco-friendly products
- Organic food companies
- Sustainable fashion
- Mindfulness apps
- Yoga and fitness

**Key Features:**
- Lora + Inter typography
- Earth tones (amber, green, terracotta)
- Soft, rounded corners
- Natural textures
- Gentle, flowing animations

**Preview:**
```tsx
<h1 className="font-lora text-7xl font-bold text-stone-900">
  Natural Living
  <br />
  <span className="text-amber-700">Simplified</span>
</h1>
```

**Inspiration:** Patagonia, Headspace, Lush

---

### 7. Editorial Design (`editorial-design/`)

**Aesthetic:** Magazine-inspired, sophisticated typography

**Best For:**
- News and magazine websites
- Blog platforms
- Publishing systems
- Long-form content
- Content-focused sites

**Key Features:**
- Playfair Display + Crimson Pro
- Warm ivory backgrounds
- Crimson and slate palette
- Generous white space
- Optimized for reading

**Preview:**
```tsx
<h1 className="font-playfair text-7xl font-bold tracking-tight text-slate-900">
  The Future of Design
</h1>
```

**Inspiration:** Medium, The New Yorker, The Guardian

---

### 8. Technical Design (`technical-design/`)

**Aesthetic:** Developer-focused, monospace, dark theme

**Best For:**
- Developer tools and IDEs
- Code editors
- Technical dashboards
- API documentation
- DevOps interfaces

**Key Features:**
- IBM Plex Mono typography
- Dark slate backgrounds
- Cyan and purple accents
- Grid patterns
- Terminal-inspired components

**Preview:**
```tsx
<div className="bg-slate-900 font-mono border border-cyan-400">
  $ npm run dev
</div>
```

**Inspiration:** VS Code, GitHub, Vercel Dashboard

---

### 9. RPG Design (`rpg-design/`)

**Aesthetic:** Fantasy game, mystical, ornate

**Best For:**
- Fantasy games
- RPG character interfaces
- Medieval-themed websites
- Quest and inventory systems
- Game UIs

**Key Features:**
- Cinzel Decorative typography
- Purple and gold mystical colors
- Parchment textures
- Ornate borders
- Magical effects

**Preview:**
```tsx
<h1 className="font-cinzel-decorative text-6xl text-purple-900">
  Quest Log
</h1>
```

**Inspiration:** Fantasy RPGs, World of Warcraft, Elder Scrolls

---

## Using These Examples

### Quick Start

1. **Copy an example to your skills directory:**
   ```bash
   cp -r templates/skills/frontend/examples/minimal-agency ~/.claude/skills/
   ```

2. **Activate it:**
   ```bash
   # Auto-activates when you request frontend components
   # Or manually activate:
   /skill minimal-agency
   ```

3. **Test it:**
   ```
   "Create a hero section"
   "Create a card component"
   "Create a pricing page"
   ```

### Installation Script

Install all examples at once:

```bash
#!/bin/bash
# install-design-examples.sh

EXAMPLES_DIR="templates/skills/frontend/examples"
SKILLS_DIR="$HOME/.claude/skills"

# Create skills directory
mkdir -p "$SKILLS_DIR"

# Install all examples
for example in minimal-agency bold-startup ecommerce corporate-professional creative-portfolio nature-organic editorial-design technical-design rpg-design; do
  echo "Installing $example..."
  cp -r "$EXAMPLES_DIR/$example" "$SKILLS_DIR/"
  echo "✅ $example installed"
done

echo ""
echo "All 9 design skills installed to $SKILLS_DIR"
```

---

## Comparison Table

### By Use Case

| Use Case | Recommended Skill(s) |
|----------|---------------------|
| **SaaS Product** | Minimal Agency, Bold Startup |
| **E-commerce Store** | E-commerce |
| **Blog/Magazine** | Editorial |
| **Portfolio** | Creative Portfolio, Minimal Agency |
| **Corporate Website** | Corporate Professional |
| **Developer Tool** | Technical |
| **Game/Fantasy** | RPG |
| **Wellness/Eco** | Nature Organic |
| **Startup Landing** | Bold Startup, Minimal Agency |

### By Color Theme

| Theme | Skills |
|-------|--------|
| **Dark Mode** | Technical, Bold Startup, Creative Portfolio |
| **Light Mode** | Minimal Agency, Editorial, E-commerce, Corporate |
| **Warm Tones** | Nature Organic, Editorial |
| **Cool Tones** | Technical, Corporate Professional |
| **Vibrant** | Bold Startup, RPG, Creative Portfolio |

### By Typography

| Font Style | Skills |
|------------|--------|
| **Serif** | Editorial, Corporate Professional, Nature Organic |
| **Sans-Serif** | Minimal Agency, E-commerce, Bold Startup |
| **Monospace** | Technical |
| **Display** | Creative Portfolio, RPG |

---

## Creating Your Own

Want to create your own custom design skill?

### Option 1: Interactive Wizard
```bash
/create-design-skill
```

The wizard will ask you about:
- Design aesthetic and mood
- Typography preferences
- Color palette
- Animation style
- Background preferences
- Component styles

### Option 2: Start from Example

Copy an existing example and customize:

```bash
# Copy an example
cp -r templates/skills/frontend/examples/minimal-agency ~/.claude/skills/my-brand

# Edit the SKILL.md file
nano ~/.claude/skills/my-brand/SKILL.md

# Customize colors, fonts, components
```

### Option 3: Use Base Template

Start from scratch with the base template:

```bash
cp -r templates/skills/frontend/frontend-design-base ~/.claude/skills/my-design
```

See the [full customization guide](../../../../docs/guides/CUSTOM_FRONTEND_DESIGN.md) for detailed instructions.

---

## Tips & Best Practices

### Mixing Templates

You can combine elements from different skills:

```yaml
# Example: Technical-Minimal hybrid
fonts:
  heading: "IBM Plex Mono"    # Technical
  body: "Inter"               # Minimal
colors:
  background: "#FFFFFF"       # Minimal (light)
  accent: "#06B6D4"          # Technical (cyan)
animation: "minimal"          # Subtle animations
```

### Context-Specific Activation

Configure skills to activate for specific projects:

```yaml
# In SKILL.md frontmatter
triggers:
  keywords: ["blog", "article"]
  filePatterns: ["blog/**/*.tsx", "content/**/*.tsx"]
context:
  projectTypes: ["nextjs", "gatsby"]
```

### Creating Variants

Create light/dark variants:

```
~/.claude/skills/
├── my-brand-light/     # Light mode
├── my-brand-dark/      # Dark mode
└── my-brand-contrast/  # High contrast
```

---

## Troubleshooting

### Skill Not Activating

1. Check skill is in `~/.claude/skills/` directory
2. Verify `autoActivate: true` in frontmatter
3. Try manual activation: `/skill [skill-name]`
4. Check trigger keywords match your request

### Wrong Style Applied

1. Be specific: "Using minimal-agency design, create..."
2. Check if multiple design skills are active
3. Manually activate desired skill first

### Inconsistent Results

1. Add more component examples to SKILL.md
2. Create a pattern library in resources/
3. Test with varied component types
4. Provide more specific design guidelines

---

## Resources

### Guides
- [Custom Frontend Design Guide](../../../../docs/guides/CUSTOM_FRONTEND_DESIGN.md) - Complete customization guide
- [Creating Skills Guide](../../../../docs/guides/CREATING_SKILLS.md) - General skill creation
- [Base Design Skill](../frontend-design-base/SKILL.md) - Template starting point

### Inspiration
- [Claude Blog: Improving Frontend Design](https://www.claude.com/blog/improving-frontend-design-through-skills)
- [Awwwards](https://www.awwwards.com) - Award-winning web design
- [Dribbble](https://dribbble.com) - Design inspiration

### Tools
- [Google Fonts](https://fonts.google.com) - Free fonts
- [Coolors](https://coolors.co) - Color palette generator
- [Tailwind CSS](https://tailwindcss.com) - CSS framework

---

## Community

Share your custom design skills:

1. Create a GitHub repository
2. Share in [GitHub Discussions](https://github.com/DegrassiAaron/code-assistant-claude/discussions)
3. Submit to the skill marketplace

**Need help?** Open an issue or start a discussion!
