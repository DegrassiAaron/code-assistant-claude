---
name: "performance-monitor"
version: "1.0.0"
description: "Continuous performance monitoring with metrics tracking, bottleneck detection, and optimization recommendations"
author: "Code-Assistant-Claude"
category: "maintenance"

triggers:
  keywords: ["performance", "monitor", "metrics", "slow", "optimize"]
  patterns: ["performance.*check", "monitor.*performance", "check.*metrics"]
  filePatterns: ["*.ts", "*.js", "*.py", "*.java", "*.go"]
  commands: ["/sc:perf-monitor", "/sc:check-performance"]

tokenCost:
  metadata: 50
  fullContent: 3400
  resources: 1200

dependencies:
  skills: ["performance-optimizer"]
  mcps: []

composability:
  compatibleWith: ["performance-optimizer", "code-reviewer"]
  conflictsWith: []

context:
  projectTypes: ["javascript", "typescript", "python", "ruby", "go", "java", "nodejs", "react", "vue", "angular"]
  minNodeVersion: "18.0.0"
  requiredTools: []

priority: "high"
autoActivate: true
cacheStrategy: "normal"
---

# Performance Monitor Skill

Continuous performance monitoring with real-time metrics tracking, bottleneck detection, trend analysis, and automated optimization recommendations.

## Performance Monitoring Layers

```markdown
📊 Multi-Layer Performance Monitoring

Layer 1: FRONTEND PERFORMANCE
├─ First Contentful Paint (FCP)
├─ Largest Contentful Paint (LCP)
├─ First Input Delay (FID)
├─ Cumulative Layout Shift (CLS)
├─ Time to Interactive (TTI)
├─ Total Blocking Time (TBT)
└─ Speed Index

Layer 2: BACKEND PERFORMANCE
├─ API response time (p50, p95, p99)
├─ Database query time
├─ External API latency
├─ Memory usage
├─ CPU utilization
├─ Throughput (req/sec)
└─ Error rate

Layer 3: DATABASE PERFORMANCE
├─ Query execution time
├─ Slow query log analysis
├─ Index usage
├─ Connection pool stats
├─ Lock contention
├─ Cache hit rate
└─ Dead tuple count

Layer 4: RESOURCE UTILIZATION
├─ Bundle size
├─ Memory leaks
├─ CPU profiling
├─ Network requests
├─ Disk I/O
└─ Cache efficiency

Layer 5: USER EXPERIENCE
├─ Page load time
├─ Interaction responsiveness
├─ Visual stability
├─ Perceived performance
└─ User satisfaction scores
```

## Performance Dashboard

```markdown
⚡ Performance Monitor Dashboard
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Monitoring Period: Last 24 hours
Environment: Production
Status: 🟡 NEEDS ATTENTION

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📱 FRONTEND METRICS

Core Web Vitals:
┌──────────────────────────────────────────────┐
│ Largest Contentful Paint (LCP)              │
│ ├─ Current: 3.2s                            │
│ ├─ Target: <2.5s                            │
│ ├─ Status: ⚠️  NEEDS IMPROVEMENT            │
│ ├─ Trend: ↗️ +0.4s (worse)                  │
│ └─ Impact: 65% of users affected            │
│                                              │
│ First Input Delay (FID)                     │
│ ├─ Current: 85ms                            │
│ ├─ Target: <100ms                           │
│ ├─ Status: ✅ GOOD                          │
│ ├─ Trend: → Stable                          │
│ └─ Impact: 5% of users affected             │
│                                              │
│ Cumulative Layout Shift (CLS)               │
│ ├─ Current: 0.18                            │
│ ├─ Target: <0.1                             │
│ ├─ Status: ⚠️  NEEDS IMPROVEMENT            │
│ ├─ Trend: ↗️ +0.05 (worse)                  │
│ └─ Impact: 45% of users affected            │
└──────────────────────────────────────────────┘

Lighthouse Scores:
├─ Performance: 72/100 ⚠️ (was 78 last week)
├─ Accessibility: 94/100 ✅
├─ Best Practices: 87/100 ✅
├─ SEO: 100/100 ✅
└─ Overall: B- (Declining)

Page Load Metrics:
┌──────────────────────────────────────────────┐
│ First Contentful Paint: 1.2s ✅              │
│ Time to Interactive: 4.5s ⚠️                 │
│ Speed Index: 3.8s ⚠️                         │
│ Total Blocking Time: 420ms ❌                │
└──────────────────────────────────────────────┘

Bundle Size Analysis:
├─ Total: 847 KB (gzipped) ⚠️
│   ├─ JavaScript: 624 KB (74%)
│   ├─ CSS: 156 KB (18%)
│   ├─ Images: 45 KB (5%)
│   └─ Fonts: 22 KB (3%)
│
├─ Growth: +124 KB since last month ⚠️
├─ Largest chunks:
│   ├─ vendor.js: 312 KB ❌ (Too large!)
│   ├─ main.js: 187 KB ⚠️
│   └─ dashboard.js: 125 KB ⚠️
└─ Recommendation: Code splitting needed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🖥️  BACKEND METRICS

API Response Times:
┌──────────────────────────────────────────────┐
│ Endpoint Performance (Last 24h)              │
├──────────────────────────────────────────────┤
│ GET /api/users                               │
│ ├─ p50: 45ms ✅                              │
│ ├─ p95: 180ms ✅                             │
│ ├─ p99: 450ms ⚠️                             │
│ ├─ Throughput: 1,234 req/min                │
│ └─ Error rate: 0.2% ✅                       │
│                                              │
│ GET /api/dashboard                           │
│ ├─ p50: 320ms ⚠️                             │
│ ├─ p95: 1,200ms ❌                           │
│ ├─ p99: 2,800ms ❌ CRITICAL                  │
│ ├─ Throughput: 456 req/min                  │
│ └─ Error rate: 1.2% ⚠️                       │
│                                              │
│ POST /api/payments                           │
│ ├─ p50: 890ms ⚠️                             │
│ ├─ p95: 2,100ms ❌                           │
│ ├─ p99: 4,500ms ❌ CRITICAL                  │
│ ├─ Throughput: 89 req/min                   │
│ └─ Error rate: 0.8% ✅                       │
└──────────────────────────────────────────────┘

Slowest Endpoints (p99):
1. POST /api/payments: 4,500ms ❌
2. GET /api/dashboard: 2,800ms ❌
3. GET /api/reports: 2,300ms ❌
4. POST /api/upload: 1,900ms ⚠️
5. GET /api/search: 1,200ms ⚠️

Server Resources:
├─ CPU Usage: 68% (avg) ⚠️
│   ├─ Peak: 92% ❌
│   └─ Trend: ↗️ Increasing
│
├─ Memory Usage: 72% (avg) ⚠️
│   ├─ Peak: 88% ⚠️
│   ├─ Trend: ↗️ Increasing
│   └─ Possible memory leak detected
│
├─ Disk I/O: 45% (avg) ✅
├─ Network: 34% (avg) ✅
└─ Open connections: 1,245 ⚠️

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🗄️  DATABASE METRICS

Query Performance:
┌──────────────────────────────────────────────┐
│ Slow Queries (>100ms)                        │
├──────────────────────────────────────────────┤
│ [1] SELECT * FROM orders WHERE...           │
│     ├─ Avg time: 1,245ms ❌                  │
│     ├─ Executions: 3,456/day                │
│     ├─ Issue: Missing index on user_id      │
│     └─ Impact: HIGH                          │
│                                              │
│ [2] SELECT * FROM products JOIN...          │
│     ├─ Avg time: 680ms ⚠️                    │
│     ├─ Executions: 8,234/day                │
│     ├─ Issue: N+1 query pattern             │
│     └─ Impact: HIGH                          │
│                                              │
│ [3] UPDATE users SET last_seen...           │
│     ├─ Avg time: 320ms ⚠️                    │
│     ├─ Executions: 45,678/day               │
│     ├─ Issue: Table lock contention         │
│     └─ Impact: MEDIUM                        │
└──────────────────────────────────────────────┘

Database Stats:
├─ Connection pool: 85/100 (85%) ⚠️
├─ Active queries: 23 (avg) ✅
├─ Slow queries: 156/hour ❌
├─ Cache hit rate: 76% ⚠️ (target: >90%)
├─ Deadlocks: 3 (last 24h) ⚠️
└─ Table bloat: 18% ⚠️

Index Usage:
├─ Total indexes: 87
├─ Unused indexes: 12 ⚠️ (wasted space)
├─ Missing indexes: 5 ❌ (performance impact)
└─ Duplicate indexes: 3 ⚠️

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 PERFORMANCE ISSUES DETECTED

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[ISSUE-001] Critical Database Query Performance
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Severity: CRITICAL
Impact: User-facing delays (2.8s p99)
Affected: GET /api/dashboard endpoint

Problem:
Query takes 1,245ms on average due to missing index.

Query:
```sql
SELECT * FROM orders
WHERE user_id = $1
  AND status IN ('pending', 'processing')
ORDER BY created_at DESC
LIMIT 20;
```

Analysis:
- Full table scan on 1.2M rows
- Missing index on user_id
- No composite index for user_id + status

Solution:
```sql
-- Add missing index
CREATE INDEX idx_orders_user_status_created
ON orders(user_id, status, created_at DESC);

-- Expected improvement: 95% faster (1,245ms → 60ms)
```

Estimated Impact:
- Response time: 2,800ms → 180ms (93% faster)
- Database load: -68%
- User satisfaction: +35%

Priority: P0 - Implement immediately

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[ISSUE-002] N+1 Query Problem in Product Listing
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Severity: HIGH
Impact: Slow page loads (680ms avg)
Affected: GET /api/products endpoint

Problem:
Loading 20 products triggers 21 database queries (1 + 20).

Current Code:
```typescript
// Initial query
const products = await Product.findAll({ limit: 20 });

// N+1: One query per product for category
for (const product of products) {
  product.category = await Category.findById(product.categoryId);
}
```

Solution:
```typescript
// Single query with eager loading
const products = await Product.findAll({
  limit: 20,
  include: [{ model: Category }]
});

// Or use DataLoader for batching
const products = await Product.findAll({ limit: 20 });
const categories = await categoryLoader.loadMany(
  products.map(p => p.categoryId)
);
```

Estimated Impact:
- Queries: 21 → 1 (95% reduction)
- Response time: 680ms → 85ms (87% faster)
- Database load: -88%

Priority: P1 - Fix this sprint

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[ISSUE-003] Large Bundle Size Impacting FCP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Severity: HIGH
Impact: Slow page load (LCP 3.2s)
Affected: All pages

Problem:
Main bundle (vendor.js) is 312 KB, causing slow initial load.

Analysis:
- moment.js: 68 KB (use date-fns instead)
- lodash: 24 KB (use lodash-es + tree-shaking)
- unused dependencies: 45 KB

Solution:
1. Replace moment.js with date-fns:
   ```bash
   npm uninstall moment
   npm install date-fns
   ```
   Savings: 68 KB → 12 KB (56 KB saved)

2. Use lodash-es with tree-shaking:
   ```typescript
   // Before
   import _ from 'lodash';

   // After
   import { debounce, throttle } from 'lodash-es';
   ```
   Savings: 24 KB → 4 KB (20 KB saved)

3. Implement code splitting:
   ```typescript
   // Lazy load routes
   const Dashboard = lazy(() => import('./Dashboard'));
   const Reports = lazy(() => import('./Reports'));
   ```

4. Analyze with webpack-bundle-analyzer:
   ```bash
   npm install --save-dev webpack-bundle-analyzer
   npm run build -- --analyze
   ```

Estimated Impact:
- Bundle size: 847 KB → 671 KB (21% reduction)
- LCP: 3.2s → 2.3s (28% faster)
- Lighthouse score: 72 → 85

Priority: P1 - Fix this sprint

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[ISSUE-004] Memory Leak in WebSocket Connection
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Severity: MEDIUM
Impact: Server memory increasing over time
Affected: WebSocket service

Problem:
Memory usage grows by ~50 MB/hour, requiring restart every 48h.

Analysis:
- Event listeners not cleaned up
- Disconnected sockets not removed from memory
- Message buffer not cleared

Solution:
```typescript
// Add proper cleanup
socket.on('disconnect', () => {
  // Remove event listeners
  socket.removeAllListeners();

  // Clear from active connections
  activeConnections.delete(socket.id);

  // Clear message buffer
  messageBuffers.delete(socket.id);

  // Nullify references
  socket = null;
});

// Add memory monitoring
setInterval(() => {
  const usage = process.memoryUsage();
  if (usage.heapUsed > THRESHOLD) {
    logger.warn('High memory usage', usage);
    // Trigger cleanup or alert
  }
}, 60000);
```

Estimated Impact:
- Memory growth: 50 MB/hr → <5 MB/hr
- Uptime: 48h → continuous
- Restart frequency: Daily → Never

Priority: P2 - Fix this sprint

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Performance Summary

Issues by Severity:
├─ 🔴 CRITICAL: 1 (Database query)
├─ 🟠 HIGH: 2 (N+1 queries, Bundle size)
├─ 🟡 MEDIUM: 1 (Memory leak)
└─ 🟢 LOW: 0

Estimated Improvements (if all fixed):
├─ API response time: -68% (p99)
├─ Page load time: -42%
├─ Database load: -55%
├─ Memory usage: Stable
└─ User satisfaction: +45%

Recommended Actions:
1. ❌ Add database index (ISSUE-001) - 30 min
2. ❌ Fix N+1 queries (ISSUE-002) - 2 hours
3. ❌ Reduce bundle size (ISSUE-003) - 4 hours
4. ⏳ Fix memory leak (ISSUE-004) - 3 hours

Total Effort: 9.5 hours
Expected ROI: Very High

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 Performance Trends (Last 30 Days)

Response Time Trend:
3.5s │                              ●
3.0s │                          ●   ●
2.5s │                      ●   ●
2.0s │              ●   ●   ●
1.5s │      ●   ●   ●
1.0s │  ●   ●
     └─────────────────────────────────
     W1  W2  W3  W4  W5  W6  W7  W8

Status: 📈 DEGRADING (↗️ +45% slower)

Bundle Size Trend:
900KB │                              ●
800KB │                      ●   ●   ●
700KB │              ●   ●
600KB │      ●   ●
500KB │  ●
      └─────────────────────────────────
      W1  W2  W3  W4  W5  W6  W7  W8

Status: 📈 GROWING (↗️ +24% larger)

Error Rate Trend:
2.0% │
1.5% │          ●
1.0% │      ●       ●
0.5% │  ●       ●       ●   ●   ●   ●
0.0% └─────────────────────────────────
     W1  W2  W3  W4  W5  W6  W7  W8

Status: ✅ STABLE

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 Performance Budget

Current vs Budget:
├─ LCP: 3.2s / 2.5s ❌ OVER BUDGET (+28%)
├─ FID: 85ms / 100ms ✅ WITHIN BUDGET
├─ CLS: 0.18 / 0.1 ❌ OVER BUDGET (+80%)
├─ Bundle: 847KB / 700KB ❌ OVER BUDGET (+21%)
├─ API p99: 2.8s / 1.0s ❌ OVER BUDGET (+180%)
└─ DB queries: 21 / 5 ❌ OVER BUDGET (+320%)

Budget Violations: 5/6 metrics ⚠️
Action Required: IMMEDIATE

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Next Monitoring Check: {{next_check_time}}
Alert Threshold: Response time >3s for >5 min
```

## Automated Performance Testing

```yaml
# Performance test on every PR
name: Performance Test

on:
  pull_request:
    branches: [main]

jobs:
  performance-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Run Lighthouse CI
        run: |
          npm run build
          lhci autorun

      - name: Performance budget check
        run: /sc:perf-monitor --budget-check

      - name: Compare with baseline
        run: /sc:perf-monitor --compare-baseline

      - name: Comment on PR
        if: failure()
        run: /sc:comment-pr --perf-regression
```

## Configuration

`.claude/settings.json`:
```json
{
  "skills": {
    "performance-monitor": {
      "monitoring": {
        "continuous": true,
        "interval": "5m",
        "retention": "30d"
      },
      "alerts": {
        "lcp": 2500,
        "fid": 100,
        "cls": 0.1,
        "apiP99": 1000,
        "errorRate": 0.01
      },
      "budgets": {
        "bundle": "700KB",
        "lcp": "2.5s",
        "apiP99": "1s"
      }
    }
  }
}
```

## Usage

```bash
# Full performance check
/sc:perf-monitor

# Monitor specific area
/sc:perf-monitor --type=frontend
/sc:perf-monitor --type=backend
/sc:perf-monitor --type=database

# Generate report
/sc:perf-monitor --report --format=pdf

# Compare with baseline
/sc:perf-monitor --compare

# Auto-optimize
/sc:perf-monitor --optimize
```

## Success Metrics

- LCP: <2.5s (>75% of loads)
- FID: <100ms (>95% of interactions)
- CLS: <0.1 (>75% of sessions)
- API p99: <1s
- Error rate: <0.5%
