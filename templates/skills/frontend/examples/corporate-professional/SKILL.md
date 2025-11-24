---
name: "corporate-professional"
version: "1.0.0"
description: "Corporate professional design for business, finance, and enterprise applications. Trustworthy, conservative, polished aesthetics with navy blues, professional typography, and formal layouts. Use for banking, insurance, consulting, legal, and B2B platforms. Do NOT use for consumer apps, creative portfolios, or gaming."
author: "Code-Assistant-Claude"
category: "domain"

triggers:
  keywords: ["corporate", "professional", "business", "enterprise", "formal", "banking"]
  patterns: ["corporate.*design", "professional.*ui", "business.*website"]
  filePatterns: ["*.tsx", "*.jsx"]
  commands: ["/corporate-design"]

tokenCost:
  metadata: 72
  fullContent: 2800
  resources: 500

priority: "high"
autoActivate: true
---

# Corporate Professional Design Skill

Trustworthy, polished design for business and enterprise.

## Design Philosophy

**Trust and Authority**: Professional, established, reliable
- **Conservative Colors**: Navy, gray, white
- **Formal Typography**: Professional serif or clean sans
- **Structured Layouts**: Grid-based, organized
- **Subtle Branding**: Professional, not playful
- **Data-Focused**: Charts, tables, clear information

## Typography & Colors

```tsx
fonts: {
  serif: "Merriweather"   // Formal, trustworthy
  sans: "Inter"            // Clean, professional
}

colors: {
  primary: "#1E3A8A",      // Navy blue (trust)
  secondary: "#64748B",    // Slate gray
  accent: "#0EA5E9",       // Sky blue (links)
  background: "#F8FAFC",   // Off-white
  text: {
    primary: "#0F172A",    // Near black
    secondary: "#475569"   // Medium gray
  }
}
```

## Key Components

### Professional Hero
```tsx
<section className="bg-gradient-to-br from-slate-50 to-blue-50 py-24">
  <div className="max-w-6xl mx-auto px-8">
    <h1 className="font-merriweather text-5xl font-bold text-slate-900 mb-6">
      Enterprise Solutions You Can Trust
    </h1>
    <p className="text-xl text-slate-600 mb-8 max-w-2xl">
      Over 30 years of excellence in financial services
    </p>
    <button className="px-8 py-4 bg-navy-900 text-white font-semibold rounded-lg">
      Schedule Consultation
    </button>
  </div>
</section>
```

### Data Card
```tsx
<div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
  <div className="flex items-center justify-between mb-4">
    <h3 className="font-semibold text-slate-900">{title}</h3>
    <TrendingUpIcon className="w-5 h-5 text-green-600" />
  </div>
  <div className="text-3xl font-bold text-slate-900 mb-2">{value}</div>
  <p className="text-sm text-slate-600">{description}</p>
</div>
```

### Service Card
```tsx
<div className="p-8 bg-white border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
    <Icon className="w-6 h-6 text-blue-900" />
  </div>
  <h3 className="font-merriweather text-xl font-bold text-slate-900 mb-3">{title}</h3>
  <p className="text-slate-600 leading-relaxed mb-4">{description}</p>
  <a href={link} className="text-blue-600 font-semibold hover:underline">
    Learn More →
  </a>
</div>
```

## When to Use

✅ Banking, Insurance, Consulting, Legal, B2B, Enterprise SaaS, Government
❌ Consumer apps, Creative portfolios, Gaming, Youth brands
