---
name: "container-optimizer"
version: "1.0.0"
description: "Docker and Kubernetes optimization with image size reduction, resource tuning, and cost analysis"
author: "Code-Assistant-Claude"
category: "devops"

triggers:
  keywords: ["docker", "container", "kubernetes", "optimize container"]
  patterns: ["optimize.*docker", "optimize.*image", "k8s.*optimize"]
  filePatterns: ["Dockerfile", "docker-compose.yml", "*.yaml"]
  commands: ["/sc:container-optimize"]

tokenCost:
  metadata: 50
  fullContent: 2400
  resources: 800

dependencies:
  skills: []
  mcps: []

composability:
  compatibleWith: ["security-scanner"]
  conflictsWith: []

context:
  projectTypes: ["nodejs", "python", "go", "java"]
  minNodeVersion: "18.0.0"
  requiredTools: ["docker"]

priority: "medium"
autoActivate: true
cacheStrategy: "normal"
---

# Container Optimizer Skill

Docker and Kubernetes optimization with image size reduction (70-85%), resource tuning, security hardening, and cost analysis.

## Quick Wins

```dockerfile
# BEFORE: 1.2 GB
FROM node:18
COPY . .
RUN npm install
CMD ["npm", "start"]

# AFTER: 185 MB (85% reduction)
FROM node:18-alpine AS builder
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine
COPY --from=builder /app/node_modules ./node_modules
COPY --chown=node:node . .
USER node
CMD ["node", "server.js"]
```

## Usage

```bash
/sc:container-optimize analyze        # Full analysis
/sc:container-optimize dockerfile     # Optimize Dockerfile
/sc:container-optimize k8s           # K8s resource tuning
/sc:container-optimize costs         # Cost analysis
```

## Key Features

- 70-85% image size reduction
- 50-70% build time improvement
- 60-80% cost savings
- Security hardening (non-root, minimal base)
- Multi-stage build optimization
- Layer caching strategies
- Kubernetes resource right-sizing
