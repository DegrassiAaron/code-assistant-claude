# Frontend Design Skill Examples

This directory contains example frontend design skills demonstrating different aesthetic approaches.

## Available Examples

### 1. Editorial Design (`editorial-design/`)

**Aesthetic:** Magazine-inspired, sophisticated typography, editorial layouts

**Best For:**
- News and magazine websites
- Blog platforms
- Publishing systems
- Long-form content
- Portfolio sites with written content

**Key Features:**
- Playfair Display + Crimson Pro typography
- Warm ivory backgrounds
- Crimson and slate color palette
- Generous white space
- Optimized for reading

**Preview:**
```tsx
<h1 className="font-playfair text-7xl font-bold tracking-tight text-slate-900">
  The Future of Design
</h1>
```

### 2. Technical Design (`technical-design/`)

**Aesthetic:** Developer-focused, monospace fonts, dark theme, precision

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

### 3. RPG Design (`rpg-design/`)

**Aesthetic:** Fantasy game, mystical colors, ornate details, immersive

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
- Ornate borders and corners
- Magical effects

**Preview:**
```tsx
<h1 className="font-cinzel-decorative text-6xl text-purple-900">
  Quest Log
</h1>
```

## Using These Examples

### Quick Start

1. **Copy an example to your skills directory:**
   ```bash
   cp -r templates/skills/frontend/examples/editorial-design ~/.claude/skills/
   ```

2. **Activate it:**
   ```bash
   # Auto-activates when you request frontend components
   # Or manually activate:
   /skill editorial-design
   ```

3. **Test it:**
   ```
   "Create a blog article layout"
   "Create a hero section"
   "Create a card component"
   ```

### Customization

Each example skill can be customized:

1. **Edit the SKILL.md** to modify design principles
2. **Update design-tokens.json** to change colors/fonts
3. **Modify tailwind.config.js** for theme adjustments

See [CUSTOM_FRONTEND_DESIGN.md](../../../../docs/guides/CUSTOM_FRONTEND_DESIGN.md) for detailed customization guide.

### Installation Script

Install all examples at once:

```bash
#!/bin/bash
# install-design-examples.sh

EXAMPLES_DIR="templates/skills/frontend/examples"
SKILLS_DIR="$HOME/.claude/skills"

# Create skills directory if it doesn't exist
mkdir -p "$SKILLS_DIR"

# Copy each example
for example in editorial-design technical-design rpg-design; do
  echo "Installing $example..."
  cp -r "$EXAMPLES_DIR/$example" "$SKILLS_DIR/"
  echo "✅ $example installed"
done

echo ""
echo "All design skills installed to $SKILLS_DIR"
echo "Run '/skill [name]' to activate any skill"
```

## Comparison Table

| Feature | Editorial | Technical | RPG |
|---------|-----------|-----------|-----|
| **Typography** | Serif (Playfair) | Mono (IBM Plex) | Decorative (Cinzel) |
| **Color Theme** | Warm ivory | Dark slate | Mystical purple/gold |
| **Background** | Solid colors | Grid patterns | Textured parchment |
| **Animation** | Elegant fades | Minimal | Dramatic effects |
| **Best Use** | Content sites | Dev tools | Fantasy games |

## Creating Your Own

Want to create your own custom design skill?

### Option 1: Interactive Wizard
```bash
/create-design-skill
```

### Option 2: Manual Creation

1. Copy the base template:
   ```bash
   cp -r templates/skills/frontend/frontend-design-base ~/.claude/skills/my-design
   ```

2. Edit `SKILL.md` with your preferences

3. Update `resources/design-tokens.json`

4. Create custom `tailwind.config.js`

See the [full guide](../../../../docs/guides/CUSTOM_FRONTEND_DESIGN.md) for step-by-step instructions.

## Tips

### Mix and Match

You can combine elements from different skills:

```yaml
# Example: Technical-Editorial hybrid
fonts:
  heading: "IBM Plex Mono"    # Technical
  body: "Crimson Pro"          # Editorial
colors:
  primary: "#06B6D4"           # Technical cyan
  background: "#FFFBF5"        # Editorial ivory
```

### Context-Specific Activation

Configure skills to activate for specific projects:

```yaml
# In SKILL.md frontmatter
triggers:
  keywords: ["blog", "article"]
  filePatterns: ["blog/**/*.tsx"]
context:
  projectTypes: ["nextjs", "gatsby"]
```

### Multiple Variants

Create variants for different modes:

```
~/.claude/skills/
├── editorial-light/     # Light mode
├── editorial-dark/      # Dark mode
└── editorial-print/     # High contrast for printing
```

## Troubleshooting

### Skill Not Activating

1. Check skill is in `~/.claude/skills/` directory
2. Verify `autoActivate: true` in frontmatter
3. Try manual activation: `/skill [skill-name]`

### Wrong Style Applied

1. Deactivate other design skills
2. Be specific in your request: "Using editorial design, create..."
3. Check trigger keywords match your request

### Inconsistent Results

1. Provide more component examples in SKILL.md
2. Create a pattern library in resources/
3. Test with varied component types

## Resources

- [Blog Post: Improving Frontend Design Through Skills](https://www.claude.com/blog/improving-frontend-design-through-skills)
- [Custom Design Skills Guide](../../../../docs/guides/CUSTOM_FRONTEND_DESIGN.md)
- [Creating Skills Guide](../../../../docs/guides/CREATING_SKILLS.md)
- [Base Design Skill](../frontend-design-base/SKILL.md)

## Community

Share your custom design skills:

1. Create a GitHub repository
2. Submit to the skill marketplace
3. Share in discussions

**Need help?** Ask in [GitHub Discussions](https://github.com/DegrassiAaron/code-assistant-claude/discussions)
