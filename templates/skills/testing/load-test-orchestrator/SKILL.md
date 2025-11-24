---
name: "load-test-orchestrator"
version: "1.0.0"
description: "Load testing orchestration with scenario generation, distributed execution, and capacity planning"
author: "Code-Assistant-Claude"
category: "testing"

triggers:
  keywords: ["load test", "performance test", "stress test"]
  patterns: ["load.*test", "stress.*test", "capacity.*test"]
  filePatterns: ["**/*.test.js", "**/k6/**"]
  commands: ["/sc:load-test"]

tokenCost:
  metadata: 47
  fullContent: 2900
  resources: 1100

dependencies:
  skills: ["performance-monitor"]
  mcps: []

composability:
  compatibleWith: ["performance-monitor"]
  conflictsWith: []

context:
  projectTypes: []
  minNodeVersion: "18.0.0"
  requiredTools: []

priority: "medium"
autoActivate: true
cacheStrategy: "normal"
---

# Load Testing Orchestrator Skill

Comprehensive load testing with scenario generation, distributed execution, bottleneck identification, and capacity planning.

## Load Test Execution

```bash
/sc:load-test run checkout-flow --users=1000 --duration=10m

Load Test: checkout-flow
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Configuration:
├─ Scenario: checkout-flow
├─ Virtual Users: 1,000
├─ Duration: 10 minutes
├─ Ramp-up: 2 minutes
└─ Target: https://api.example.com

Real-time Metrics:
00:05:00 | VUs: 850/1000 | RPS: 156 | p95: 890ms | Errors: 0.8%
00:06:00 | VUs: 1000/1000 | RPS: 178 | p95: 1240ms | Errors: 1.2%
00:07:00 | VUs: 1000/1000 | RPS: 165 | p95: 1560ms | Errors: 2.1% ⚠️

Status: 🟡 Performance degradation detected
```

## Test Results

```markdown
Load Test Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PERFORMANCE METRICS:
├─ Response Time (p50): 245ms ✅
├─ Response Time (p95): 890ms ⚠️
├─ Response Time (p99): 2,340ms ❌
├─ Throughput: 156 req/sec ✅
├─ Error Rate: 0.8% ✅
└─ Success Rate: 99.2% ✅

BOTTLENECKS DETECTED:
1. Database query in /api/cart (1,200ms avg) ❌
   └─ Add index on cart_items.user_id

2. External payment API (800ms avg) ⚠️
   └─ Implement caching, async processing

CAPACITY ANALYSIS:
├─ Current: ~1,200 concurrent users
├─ Target: 5,000 concurrent users
├─ Gap: 4x scaling needed
└─ Est. Cost: +$2,400/month

RECOMMENDATIONS:
1. Add database index (immediate)
2. Implement Redis caching (1 sprint)
3. Scale from 5 to 20 pods
4. Optimize payment integration
```

## Scenario Generation

```javascript
// Auto-generated from user flow
export default function() {
  // Login
  let res = http.post('/api/auth/login', {
    email: 'test@example.com',
    password: 'password'
  });
  check(res, { 'login success': (r) => r.status === 200 });

  let token = res.json('token');

  // Browse products
  res = http.get('/api/products', {
    headers: { Authorization: `Bearer ${token}` }
  });

  // Add to cart
  res = http.post('/api/cart', {
    productId: 123,
    quantity: 1
  });

  // Checkout
  res = http.post('/api/checkout');
  check(res, { 'checkout success': (r) => r.status === 200 });
}
```

## Usage

```bash
/sc:load-test create "checkout-flow"   # Create scenario
/sc:load-test run --users=1000 --duration=10m
/sc:load-test analyze results          # Analyze results
/sc:load-test compare run1 run2        # Compare runs
/sc:load-test capacity                 # Capacity planning
```

## Success Metrics

- Bottleneck identification: 95%
- Capacity planning accuracy: ±10%
- Pre-production issue detection: 85%
- Cost optimization: 30-40%
