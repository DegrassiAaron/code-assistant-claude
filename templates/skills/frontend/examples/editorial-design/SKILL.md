---
name: "editorial-design"
version: "1.0.0"
description: "Editorial magazine aesthetic with sophisticated serif typography, bold crimson accents, and elegant layouts. Use when creating editorial content, news sites, blog platforms, or content-focused websites. Do NOT use for technical dashboards or gaming interfaces."
author: "Code-Assistant-Claude"
category: "domain"

triggers:
  keywords: ["editorial", "magazine", "blog", "article", "content", "publishing"]
  patterns: ["editorial.*design", "magazine.*layout", "blog.*component"]
  filePatterns: ["*.tsx", "*.jsx"]
  commands: ["/editorial-design"]

tokenCost:
  metadata: 70
  fullContent: 3800
  resources: 600

priority: "high"
autoActivate: true
cacheStrategy: "normal"
---

# Editorial Design Skill

Create sophisticated editorial interfaces inspired by print magazines and premium publishing.

## Design Philosophy

Channel the timeless elegance of editorial design:
- **Typography-First**: Large, commanding headlines with careful type hierarchy
- **White Space**: Generous margins and breathing room
- **Readability**: Optimized line lengths (65-75 characters) and leading
- **Sophistication**: Refined color palette avoiding generic tech aesthetics

## Typography

### Font Families

```tsx
// Primary fonts
font-family:
  heading: "Playfair Display"   // Elegant, high-contrast serif
  subheading: "Crimson Pro"     // Refined serif for depth
  body: "Source Serif Pro"      // Optimized for long-form reading
  ui: "Inter"                   // Clean sans for interface elements
```

### Type Scale

```tsx
// Dramatic scale for editorial impact
text-display: 6rem (96px)      // Hero headlines
text-headline: 3rem (48px)     // Section headers
text-subheadline: 1.875rem (30px)  // Article subheaders
text-body: 1.125rem (18px)     // Body copy
text-caption: 0.875rem (14px)  // Captions, metadata
```

### Usage Guidelines

```tsx
// ✅ Good: Editorial headline
<h1 className="font-playfair text-7xl font-bold tracking-tight leading-none text-slate-900">
  The Future of Design
</h1>

// ✅ Good: Article subheader
<h2 className="font-crimson text-3xl tracking-tight text-slate-800 mt-12 mb-6">
  Understanding the Fundamentals
</h2>

// ✅ Good: Body text
<p className="font-source-serif text-lg leading-relaxed text-slate-700">
  Long-form article content flows naturally with generous line height...
</p>

// ❌ Avoid: Generic tech font
<h1 className="font-inter text-4xl">
  Generic Title
</h1>
```

## Color Palette

### Primary Colors

```tsx
colors: {
  // Editorial Crimson - Bold, authoritative
  primary: {
    50: '#FFF1F2',
    500: '#DC2626',  // Main crimson
    900: '#7F1D1D'
  },

  // Slate - Sophisticated neutrals
  secondary: {
    50: '#F8FAFC',
    300: '#CBD5E1',  // Subtle dividers
    700: '#334155',  // Secondary text
    900: '#0F172A'   // Primary text
  },

  // Gold - Accent for highlights
  accent: {
    500: '#F59E0B',
    600: '#D97706'
  },

  // Background - Warm ivory
  background: '#FFFBF5'
}
```

### Usage

```tsx
// Background: Warm ivory for sophistication
className="bg-[#FFFBF5]"

// Headlines: Deep slate, almost black
className="text-slate-900"

// Body text: Softer slate for readability
className="text-slate-700"

// Accent: Crimson for important elements
className="text-primary-500"

// Links: Underlined crimson
className="text-primary-500 underline underline-offset-4"
```

## Layout Patterns

### Article Layout

```tsx
<article className="max-w-prose mx-auto px-8 py-24">
  {/* Overline / Category */}
  <div className="mb-4">
    <span className="text-primary-500 uppercase tracking-wider text-sm font-semibold">
      Design
    </span>
  </div>

  {/* Headline */}
  <h1 className="font-playfair text-7xl font-bold tracking-tight leading-none text-slate-900 mb-6">
    The Art of Digital Typography
  </h1>

  {/* Deck / Subheader */}
  <p className="font-crimson text-2xl text-slate-600 leading-snug mb-8">
    Exploring how classic print design principles translate to modern web experiences
  </p>

  {/* Byline */}
  <div className="flex items-center gap-4 pb-8 mb-12 border-b border-slate-200">
    <img
      src={authorAvatar}
      alt={authorName}
      className="w-12 h-12 rounded-full"
    />
    <div>
      <p className="font-semibold text-slate-900">{authorName}</p>
      <p className="text-sm text-slate-600">{publishDate} · {readTime} min read</p>
    </div>
  </div>

  {/* Hero Image */}
  <figure className="mb-12 -mx-8 md:-mx-24">
    <img
      src={heroImage}
      alt={imageCaption}
      className="w-full aspect-video object-cover"
    />
    <figcaption className="mt-3 text-sm text-slate-600 text-center italic">
      {imageCaption}
    </figcaption>
  </figure>

  {/* Body Content */}
  <div className="prose prose-lg prose-slate">
    <p className="font-source-serif text-lg leading-relaxed text-slate-700 mb-6">
      <span className="float-left font-playfair text-7xl leading-none mr-2 mt-1 text-primary-500">
        T
      </span>
      ypography is the cornerstone of editorial design. It guides the reader's eye,
      establishes hierarchy, and creates the emotional tone...
    </p>
    {/* More paragraphs */}
  </div>
</article>
```

### Feature Card

```tsx
<article className="group cursor-pointer">
  {/* Image */}
  <div className="relative aspect-[4/3] overflow-hidden mb-4">
    <img
      src={image}
      alt={title}
      className="w-full h-full object-cover transition-transform duration-700
                 group-hover:scale-105"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

    {/* Category badge */}
    <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full">
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-900">
        {category}
      </span>
    </div>
  </div>

  {/* Content */}
  <div>
    <h3 className="font-crimson text-2xl font-bold text-slate-900 mb-2
                   group-hover:text-primary-500 transition-colors">
      {title}
    </h3>
    <p className="font-source-serif text-slate-600 leading-relaxed mb-4">
      {excerpt}
    </p>
    <div className="flex items-center justify-between text-sm text-slate-500">
      <span>{authorName}</span>
      <span>{publishDate}</span>
    </div>
  </div>
</article>
```

### Pull Quote

```tsx
<figure className="my-12 px-8 py-12 border-l-4 border-primary-500 bg-slate-50">
  <blockquote>
    <p className="font-crimson text-3xl leading-tight text-slate-900 mb-4">
      "{quoteText}"
    </p>
  </blockquote>
  <figcaption className="text-slate-600">
    <span className="font-semibold text-slate-900">{attribution}</span>
    {title && <span className="italic">, {title}</span>}
  </figcaption>
</figure>
```

## Animations

### Page Transitions

```tsx
// Gentle fade and slide
<motion.article
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
>
  {content}
</motion.article>
```

### Image Reveals

```tsx
// Sophisticated image loading
<motion.div
  initial={{ opacity: 0, scale: 1.05 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
>
  <img src={image} alt={alt} />
</motion.div>
```

### Staggered Content

```tsx
// Stagger article list
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

<motion.div variants={container} initial="hidden" animate="show">
  {articles.map(article => (
    <motion.article key={article.id} variants={item}>
      {/* Article card */}
    </motion.article>
  ))}
</motion.div>
```

## Backgrounds

### Clean and Subtle

```tsx
// Warm ivory base
<div className="min-h-screen bg-[#FFFBF5]">
  {content}
</div>

// With subtle texture
<div className="relative min-h-screen">
  <div className="absolute inset-0 bg-[#FFFBF5]" />
  <div className="absolute inset-0 opacity-[0.02] bg-[url('/paper-texture.png')]" />
  <div className="relative z-10">
    {content}
  </div>
</div>
```

## Navigation

### Editorial Header

```tsx
<header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-slate-200">
  <div className="max-w-7xl mx-auto px-8 py-4">
    <div className="flex items-center justify-between">
      {/* Logo */}
      <a href="/" className="font-playfair text-3xl font-bold text-slate-900">
        Publication
      </a>

      {/* Navigation */}
      <nav className="hidden md:flex items-center gap-8">
        {navItems.map(item => (
          <a
            key={item.href}
            href={item.href}
            className="text-slate-700 hover:text-primary-500 transition-colors
                       font-medium"
          >
            {item.label}
          </a>
        ))}
      </nav>

      {/* CTA */}
      <button className="px-6 py-2 bg-primary-500 text-white rounded-full
                       hover:bg-primary-600 transition-colors font-semibold">
        Subscribe
      </button>
    </div>
  </div>
</header>
```

## Forms

### Newsletter Signup

```tsx
<div className="max-w-2xl mx-auto px-8 py-24 text-center">
  <h2 className="font-playfair text-5xl font-bold text-slate-900 mb-4">
    Stay Informed
  </h2>
  <p className="font-source-serif text-xl text-slate-600 mb-8">
    Receive our weekly digest of the best stories, directly to your inbox.
  </p>

  <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
    <input
      type="email"
      placeholder="Your email address"
      className="flex-1 px-6 py-3 border-2 border-slate-300 rounded-full
                 focus:border-primary-500 focus:outline-none transition-colors
                 font-source-serif"
    />
    <button
      type="submit"
      className="px-8 py-3 bg-primary-500 text-white rounded-full
                 hover:bg-primary-600 transition-colors font-semibold
                 whitespace-nowrap"
    >
      Subscribe
    </button>
  </form>

  <p className="mt-4 text-sm text-slate-500">
    Unsubscribe at any time. Read our <a href="/privacy" className="underline">privacy policy</a>.
  </p>
</div>
```

## Accessibility

All editorial designs must meet WCAG 2.1 AA standards:

- ✅ Text contrast: Slate 700 on ivory background = 7.2:1 (excellent)
- ✅ Large text (headlines): Slate 900 = 14.8:1 (excellent)
- ✅ Links: Underlined and colored for distinction
- ✅ Focus indicators: Visible on all interactive elements
- ✅ Line length: Max 65-75 characters for optimal readability
- ✅ Line height: 1.75 for body text (editorial standard)

```tsx
// Accessible link
<a
  href="/article"
  className="text-primary-500 underline underline-offset-4
             hover:text-primary-600 focus:ring-2 focus:ring-primary-500
             focus:ring-offset-2 rounded"
>
  Read more
</a>
```

## Component Library

### Dropcap

```tsx
<p className="font-source-serif text-lg leading-relaxed text-slate-700">
  <span className="float-left font-playfair text-7xl leading-none mr-3 mt-1
                  text-primary-500 font-bold">
    T
  </span>
  he first letter sets the tone for the entire article...
</p>
```

### Divider

```tsx
<div className="flex items-center gap-4 my-12">
  <div className="flex-1 h-px bg-slate-200" />
  <div className="w-2 h-2 rounded-full bg-primary-500" />
  <div className="flex-1 h-px bg-slate-200" />
</div>
```

### Author Bio

```tsx
<aside className="mt-16 pt-8 border-t border-slate-200">
  <div className="flex gap-6">
    <img
      src={avatar}
      alt={name}
      className="w-20 h-20 rounded-full"
    />
    <div>
      <h3 className="font-crimson text-xl font-bold text-slate-900 mb-2">
        {name}
      </h3>
      <p className="font-source-serif text-slate-600 leading-relaxed mb-3">
        {bio}
      </p>
      <div className="flex gap-4">
        {socialLinks.map(link => (
          <a
            key={link.platform}
            href={link.url}
            className="text-slate-500 hover:text-primary-500 transition-colors"
          >
            {link.icon}
          </a>
        ))}
      </div>
    </div>
  </div>
</aside>
```

## Examples

### Magazine Homepage

**Request**: "Create a magazine-style homepage"

**Output**: Grid of feature articles with large imagery, elegant typography, white space

### Article Page

**Request**: "Create an article reading experience"

**Output**: Centered column, generous margins, optimized line length, elegant type hierarchy

### Author Profile

**Request**: "Create an author profile page"

**Output**: Hero with author photo, bio, article grid, sophisticated layout

## When to Use

✅ **Use editorial design for**:
- News and magazine sites
- Blog platforms
- Content management systems
- Publishing platforms
- Long-form articles
- Portfolio sites with written content

❌ **Do NOT use for**:
- Technical dashboards
- Data visualization apps
- Gaming interfaces
- E-commerce product pages
- Mobile-first utility apps

## Resources

### Fonts
- [Playfair Display](https://fonts.google.com/specimen/Playfair+Display) - Google Fonts
- [Crimson Pro](https://fonts.google.com/specimen/Crimson+Pro) - Google Fonts
- [Source Serif Pro](https://fonts.google.com/specimen/Source+Serif+Pro) - Google Fonts

### Inspiration
- Medium.com - Editorial web design
- The New Yorker - Classic magazine aesthetic
- The Guardian - Modern editorial
- Literary Hub - Contemporary publishing

### Tailwind Config
See `resources/tailwind-configs/editorial-theme.js` for complete Tailwind configuration
