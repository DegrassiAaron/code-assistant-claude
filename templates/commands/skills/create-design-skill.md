---
description: "Interactive wizard to create custom frontend design skills with your unique aesthetic preferences"
---

# Create Custom Frontend Design Skill

I'll help you create a custom frontend design skill that matches your unique aesthetic preferences.

## Step 1: Define Your Aesthetic

First, let me understand your design vision:

**Questions:**
1. **What name would you like for your design skill?**
   - Example: "my-brand-design", "client-x-design", "minimal-design"
   - Format: kebab-case (lowercase with hyphens)

2. **What's the overall feeling or mood?**
   - Professional and trustworthy?
   - Creative and playful?
   - Technical and precise?
   - Warm and approachable?
   - Bold and dramatic?
   - Minimal and clean?

3. **What visual references inspire this aesthetic?**
   - Magazine layouts?
   - Developer tools?
   - Nature and organic forms?
   - Fantasy games?
   - Brutalist architecture?
   - Swiss design?
   - Something else? (describe)

## Step 2: Typography Selection

Choose your font style:

**Heading Font:**
- Serif options: Playfair Display, Crimson Pro, Lora, Merriweather
- Sans-serif options: Space Grotesk, Inter, Work Sans, Plus Jakarta
- Monospace options: IBM Plex Mono, JetBrains Mono, Fira Code
- Display options: Cinzel, Bebas Neue, Righteous
- Custom: (specify your font)

**Body Font:**
- Serif options: Source Serif Pro, Crimson Pro, Lora
- Sans-serif options: Inter, Open Sans, Roboto
- Your choice: ___________

**Why did you choose these fonts?** (helps me understand your vision)

## Step 3: Color Palette

Define your color scheme:

**Primary Color:**
- Purpose: Main brand color, CTAs, important elements
- Color: #______ (hex code) or color name (e.g., "deep purple", "warm amber")

**Secondary Color:**
- Purpose: Supporting elements, backgrounds
- Color: #______ or color name

**Accent Color:**
- Purpose: Highlights, hover states, special elements
- Color: #______ or color name

**Background:**
- Light or dark theme?
- Solid color or gradient?
- Color: #______ or description

**Color Mood:**
- Warm (reds, oranges, yellows)?
- Cool (blues, greens, purples)?
- Neutral (grays, blacks, whites)?
- Vibrant (high saturation)?
- Muted (low saturation)?

## Step 4: Animation Philosophy

How should things move?

**Animation Style:**
- [ ] High-impact (dramatic page transitions, hero reveals)
- [ ] Minimal (subtle hovers, simple fades)
- [ ] Playful (bouncy, elastic movements)
- [ ] Smooth (elegant, flowing transitions)
- [ ] None (prefer static designs)

**Animation Speed:**
- Fast (150-300ms)
- Normal (300-500ms)
- Slow (500-800ms)

**Key Interactions to Animate:**
- [ ] Page transitions
- [ ] Button hovers
- [ ] Modal entrances
- [ ] Scroll effects
- [ ] Loading states
- [ ] Form interactions

## Step 5: Background Style

How should backgrounds look?

**Preferred Approach:**
- [ ] Solid colors (clean, simple)
- [ ] Gradients (depth, atmosphere)
- [ ] Patterns/textures (visual interest)
- [ ] Layered (multiple background layers for depth)
- [ ] Minimal (white/light backgrounds)
- [ ] Dark (dark backgrounds)

**Specific Preferences:**
- Any textures? (paper, grain, fabric, etc.)
- Gradient direction? (radial, linear, mesh)
- Pattern style? (dots, lines, grid, organic)

## Step 6: Component Style

General component preferences:

**Border Radius:**
- Sharp (0px - rectangular)
- Slight (4-8px - subtle curves)
- Rounded (12-16px - modern rounded)
- Very rounded (20px+ or pill shapes)

**Shadows:**
- None (flat design)
- Subtle (soft, barely visible)
- Medium (clear depth)
- Strong (dramatic shadows)

**Spacing:**
- Compact (tight spacing)
- Normal (balanced)
- Spacious (lots of white space)

## Step 7: Review & Confirm

Based on your answers, I'll create:

```yaml
---
name: "[your-skill-name]"
description: "[Generated based on your inputs]"
typography:
  heading: "[Your heading font]"
  body: "[Your body font]"
colors:
  primary: "[Your primary color]"
  secondary: "[Your secondary color]"
  accent: "[Your accent color]"
  background: "[Your background]"
animation:
  style: "[Your animation style]"
  speed: "[Your animation speed]"
backgrounds:
  style: "[Your background style]"
components:
  borderRadius: "[Your border radius preference]"
  shadows: "[Your shadow preference]"
  spacing: "[Your spacing preference]"
---
```

**Does this look correct?** (yes/no)

## Step 8: Generation

Once confirmed, I'll:

1. ✅ Create the skill file structure
2. ✅ Generate `SKILL.md` with your preferences
3. ✅ Create `design-tokens.json` with your color palette
4. ✅ Generate Tailwind config with your theme
5. ✅ Create component examples using your aesthetic
6. ✅ Add accessibility guidelines
7. ✅ Save to `~/.claude/skills/[your-skill-name]/`

## Step 9: Testing

After generation, I'll test your skill by:

1. Creating a sample button component
2. Creating a sample card component
3. Showing you the results

**Review the test components:**
- Do they match your vision?
- Any adjustments needed?

## Step 10: Finalization

Your custom design skill is ready!

**Location:** `~/.claude/skills/[your-skill-name]/`

**To use it:**
```bash
# It will auto-activate when you request frontend components
# Or manually activate:
/skill [your-skill-name]

# Test it:
"Create a button using my design system"
"Create a landing page hero section"
```

**To share with your team:**
```bash
# Copy to project
cp -r ~/.claude/skills/[your-skill-name] ./project/.claude/skills/

# Or create a Git repository
cd ~/.claude/skills/[your-skill-name]
git init
git remote add origin [your-repo-url]
git add .
git commit -m "Add custom design skill"
git push
```

---

## Template Examples

We have **9 pre-built templates** you can use as starting points:

### 1. Minimal Agency 🎯
**Best For:** SaaS, Agencies, Modern apps
```yaml
name: "minimal-agency"
feeling: "Clean, professional, sophisticated"
inspiration: "Apple, Linear, Stripe"
fonts: { heading: "Inter", body: "Inter" }
colors: { primary: "#000000", accent: "#3B82F6", background: "#FFFFFF" }
animation: "minimal"
```

### 2. Bold Startup 🚀
**Best For:** Startups, Consumer apps
```yaml
name: "bold-startup"
feeling: "Energetic, vibrant, confident"
inspiration: "Spotify, Figma, Notion"
fonts: { heading: "Inter", body: "Inter" }
colors: { primary: "#8B5CF6", secondary: "#EC4899", accent: "#F59E0B" }
animation: "high-impact with spring physics"
backgrounds: "dark with gradient mesh"
```

### 3. E-commerce 🛒
**Best For:** Online stores, Product catalogs
```yaml
name: "ecommerce"
feeling: "Product-focused, trustworthy"
inspiration: "Shopify, Nike.com"
fonts: { heading: "Poppins", body: "Inter" }
colors: { primary: "#2563EB", success: "#10B981", background: "#FFFFFF" }
animation: "smooth transitions"
```

### 4. Corporate Professional 💼
**Best For:** Banking, B2B, Enterprise
```yaml
name: "corporate-professional"
feeling: "Trustworthy, formal, established"
inspiration: "JP Morgan, McKinsey"
fonts: { heading: "Merriweather", body: "Inter" }
colors: { primary: "#1E3A8A", secondary: "#64748B", background: "#F8FAFC" }
animation: "subtle, conservative"
```

### 5. Creative Portfolio 🎨
**Best For:** Designers, Artists, Agencies
```yaml
name: "creative-portfolio"
feeling: "Experimental, artistic, bold"
inspiration: "Awwwards winners"
fonts: { display: "Archivo Black", body: "Work Sans" }
colors: { background: "#0A0A0A", accent1: "#FF6B35", accent2: "#00D9FF" }
animation: "experimental, cursor effects"
```

### 6. Nature Organic 🌿
**Best For:** Wellness, Eco, Sustainable
```yaml
name: "nature-organic"
feeling: "Warm, natural, calming"
inspiration: "Patagonia, Headspace"
fonts: { heading: "Lora", body: "Inter" }
colors: { primary: "#F59E0B", secondary: "#84CC16", background: "#FFFBEB" }
animation: "gentle, flowing"
```

### 7. Editorial 📰
**Best For:** Publishing, Blogs, Content
```yaml
name: "editorial"
feeling: "Sophisticated, readable"
inspiration: "The New Yorker, Medium"
fonts: { heading: "Playfair Display", body: "Crimson Pro" }
colors: { primary: "#DC2626", background: "#FFFBF5" }
```

### 8. Technical ⚙️
**Best For:** Dev tools, Dashboards
```yaml
name: "technical"
feeling: "Precise, developer-focused"
inspiration: "VS Code, GitHub"
fonts: { mono: "IBM Plex Mono", sans: "Inter" }
colors: { primary: "#06B6D4", accent: "#A855F7", background: "#0F172A" }
```

### 9. RPG Fantasy ⚔️
**Best For:** Games, Medieval themes
```yaml
name: "rpg"
feeling: "Mystical, immersive, ornate"
inspiration: "World of Warcraft"
fonts: { display: "Cinzel Decorative", body: "Crimson Pro" }
colors: { primary: "#6B21A8", accent: "#F59E0B", background: "#FEF3C7" }
```

---

## Quick Start with Templates

### Option A: Use Exact Template

```bash
# Copy a template directly
cp -r templates/skills/frontend/examples/minimal-agency ~/.claude/skills/

# Activate and use
/skill minimal-agency
"Create a hero section"
```

### Option B: Customize a Template

```
"Start with bold-startup template but use serif fonts"
"Use minimal-agency but make it darker"
"Combine corporate-professional with nature-organic colors"
```

### Option C: Build from Scratch

Answer the questions above step-by-step to create a completely custom skill

---

## Ready to Start?

Please answer the questions above, and I'll create your custom design skill!

**Tip:** You can also start with an example and customize it:
- "Start with minimal-agency but use serif fonts"
- "Start with bold-startup but make it lighter"
- "Start with nature-inspired but add purple accents"

Or if you prefer, I can ask you questions one at a time interactively.

What would you like to do?
