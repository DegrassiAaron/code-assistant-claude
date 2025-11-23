---
name: "sc-design"
description: "Architecture and system design with best practices"
category: "superclaude"
version: "1.0.0"

triggers:
  exact: "/sc:design"
  aliases: ["/design", "/architect"]
  keywords: ["design", "architecture", "system design"]

requires:
  skills: ["system-architect", "design-patterns"]
  mcps: ["sequential", "serena"]

parameters:
  - name: "system"
    type: "string"
    required: true
    description: "System or component to design"
  - name: "scale"
    type: "string"
    required: false
    default: "medium"
    options: ["small", "medium", "large", "enterprise"]
  - name: "constraints"
    type: "array"
    required: false
    description: "Design constraints (cost, time, tech, etc.)"

autoExecute: false
tokenEstimate: 18000
executionTime: "30-90s"
---

# /sc:design - Architecture & System Design

Comprehensive system design with best practices, patterns, and scalability.

## Design Scales

### Small (<10K users)
- Simple architecture
- Monolithic OK
- Basic scaling
- Cost-optimized

### Medium (10K-100K users)
- Modular architecture
- Service separation
- Horizontal scaling
- Load balancing

### Large (100K-1M users)
- Microservices
- Distributed systems
- Multi-region
- Advanced caching

### Enterprise (>1M users)
- Highly distributed
- Global scale
- Fault tolerance
- Multi-cloud

## Execution Flow

### 1. Requirements Analysis
- Functional requirements
- Non-functional requirements (performance, security, etc.)
- Constraints (budget, timeline, tech stack)
- Success criteria

### 2. Architecture Design

**System Components**:
1. **Frontend Architecture**
   - Client application
   - State management
   - Routing
   - Component structure

2. **Backend Architecture**
   - API layer
   - Business logic
   - Data access
   - External integrations

3. **Data Architecture**
   - Database selection
   - Schema design
   - Caching strategy
   - Data flow

4. **Infrastructure**
   - Hosting
   - CDN
   - Load balancers
   - Monitoring

### 3. Design Patterns Application

**Architectural Patterns**:
- **Layered Architecture**: Separation of concerns
- **Microservices**: Independent services
- **Event-Driven**: Async communication
- **CQRS**: Command-query separation
- **Serverless**: Function-as-a-service

**Design Patterns**:
- **Creational**: Factory, Singleton, Builder
- **Structural**: Adapter, Decorator, Facade
- **Behavioral**: Observer, Strategy, Command

### 4. Design Document Generation

```markdown
# System Design: {system}

## Executive Summary

**System**: {system}
**Scale**: {scale}
**Users**: [Estimated concurrent users]
**Availability Target**: 99.9%
**Performance Target**: <200ms response time

---

## 1. Requirements

### Functional Requirements
1. User authentication and authorization
2. Data CRUD operations
3. Real-time notifications
4. File upload and storage
5. Search functionality

### Non-Functional Requirements
- **Performance**: <200ms API response, <2s page load
- **Scalability**: Support 100K concurrent users
- **Availability**: 99.9% uptime
- **Security**: SOC 2 compliance, encryption at rest
- **Maintainability**: <2h MTTR, modular codebase

### Constraints
- Budget: $50K/month infrastructure
- Timeline: 6 months to MVP
- Team: 5 developers
- Tech stack: Node.js, React, PostgreSQL

---

## 2. System Architecture

### High-Level Architecture

```
┌─────────────┐
│   Clients   │
│ (Web/Mobile)│
└──────┬──────┘
       │
       ▼
┌─────────────┐     ┌─────────────┐
│     CDN     │────▶│ Static Assets│
└──────┬──────┘     └─────────────┘
       │
       ▼
┌─────────────┐
│Load Balancer│
└──────┬──────┘
       │
       ▼
┌─────────────────────────────┐
│      API Gateway            │
│  (Auth, Rate Limit, Route)  │
└──────┬──────────────────────┘
       │
       ├─────────┬──────────┬──────────┐
       ▼         ▼          ▼          ▼
  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
  │Auth    │ │User    │ │Data    │ │Search  │
  │Service │ │Service │ │Service │ │Service │
  └───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘
      │          │          │          │
      └──────────┴──────────┴──────────┘
                 │
                 ▼
      ┌──────────────────┐
      │   Message Queue  │
      │   (RabbitMQ)     │
      └──────────────────┘
                 │
                 ▼
      ┌──────────────────┐     ┌──────────────┐
      │   Primary DB     │────▶│  Read Replica│
      │  (PostgreSQL)    │     │              │
      └──────────────────┘     └──────────────┘
                 │
                 ▼
      ┌──────────────────┐
      │  Cache (Redis)   │
      └──────────────────┘
```

### Component Details

#### Frontend Layer
- **Framework**: React 18+ with TypeScript
- **State Management**: Redux Toolkit + RTK Query
- **Routing**: React Router v6
- **UI Library**: Material-UI / Tailwind CSS
- **Build**: Vite for fast builds
- **Testing**: Vitest + React Testing Library

#### API Gateway
- **Technology**: Express.js + TypeScript
- **Features**:
  - JWT authentication
  - Rate limiting (100 req/min per user)
  - Request validation
  - CORS handling
  - API versioning

#### Microservices

**Auth Service**:
- User registration/login
- JWT token management
- OAuth2 integration
- MFA support

**User Service**:
- User profile management
- Preferences
- Settings

**Data Service**:
- Core business logic
- CRUD operations
- Data validation
- Transaction management

**Search Service**:
- Elasticsearch integration
- Full-text search
- Faceted search
- Auto-suggestions

#### Data Layer

**Primary Database (PostgreSQL)**:
- User data
- Transactional data
- ACID compliance
- Partitioning by user_id

**Read Replicas**:
- Read-heavy operations
- Reporting queries
- Analytics

**Cache (Redis)**:
- Session storage
- Frequently accessed data
- Rate limiting counters
- Real-time features

**Message Queue (RabbitMQ)**:
- Async processing
- Email notifications
- Background jobs
- Event sourcing

---

## 3. Data Model

### Core Entities

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User Profiles
CREATE TABLE user_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  avatar_url TEXT,
  bio TEXT
);

-- Sessions
CREATE TABLE sessions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  token VARCHAR(500) UNIQUE,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(token);
```

### Caching Strategy

**Cache Layers**:
1. **Browser Cache**: Static assets (1 week)
2. **CDN Cache**: Images, CSS, JS (1 month)
3. **Application Cache (Redis)**:
   - User sessions (30 min)
   - User profiles (1 hour)
   - API responses (5 min)

**Cache Invalidation**:
- Time-based expiration
- Event-based invalidation
- Manual purge capability

---

## 4. API Design

### REST API Endpoints

```
Authentication:
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh

Users:
GET    /api/v1/users/:id
PUT    /api/v1/users/:id
DELETE /api/v1/users/:id
GET    /api/v1/users/:id/profile

Data:
GET    /api/v1/items
POST   /api/v1/items
GET    /api/v1/items/:id
PUT    /api/v1/items/:id
DELETE /api/v1/items/:id

Search:
GET    /api/v1/search?q=query&filters=...
```

### WebSocket Endpoints

```
wss://api.example.com/ws/notifications
wss://api.example.com/ws/chat
```

---

## 5. Security Design

### Authentication & Authorization
- **Authentication**: JWT with refresh tokens
- **Authorization**: Role-based access control (RBAC)
- **MFA**: TOTP-based (Google Authenticator)
- **OAuth**: Google, GitHub integration

### Data Protection
- **Encryption at rest**: AES-256
- **Encryption in transit**: TLS 1.3
- **Password hashing**: bcrypt (cost: 12)
- **Sensitive data**: Vault integration

### Security Headers
- Content-Security-Policy
- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security

### Rate Limiting
- **Anonymous**: 10 req/min
- **Authenticated**: 100 req/min
- **API Keys**: 1000 req/min
- **DDoS Protection**: Cloudflare

---

## 6. Scalability Strategy

### Horizontal Scaling
- **API Servers**: Auto-scaling (2-10 instances)
- **Workers**: Queue-based scaling
- **Database**: Read replicas (2-5)

### Vertical Scaling
- **Database**: Upgrade instance size as needed
- **Cache**: Increase Redis memory

### Performance Optimization
- **Database**:
  - Indexing strategy
  - Query optimization
  - Connection pooling
- **Caching**:
  - Multi-layer caching
  - CDN for static assets
- **Code**:
  - Lazy loading
  - Code splitting
  - Tree shaking

---

## 7. Monitoring & Observability

### Metrics
- **Application**: Response time, error rate, throughput
- **Infrastructure**: CPU, memory, disk, network
- **Business**: User signups, conversions, retention

### Logging
- **Centralized**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Levels**: Error, Warn, Info, Debug
- **Structured**: JSON format

### Monitoring Tools
- **APM**: New Relic / Datadog
- **Uptime**: Pingdom
- **Errors**: Sentry
- **Analytics**: Google Analytics

---

## 8. Deployment Strategy

### Environments
1. **Development**: Feature testing
2. **Staging**: Pre-production validation
3. **Production**: Live system

### CI/CD Pipeline
```
Code Push → GitHub Actions
  ↓
Build & Test
  ↓
Security Scan
  ↓
Deploy to Staging
  ↓
E2E Tests
  ↓
Manual Approval
  ↓
Deploy to Production (Blue-Green)
  ↓
Health Checks
  ↓
Monitor
```

### Rollback Plan
- Blue-green deployment
- Instant rollback capability
- Database migration rollback
- Feature flags for gradual rollout

---

## 9. Cost Estimation

### Infrastructure Costs (Monthly)

| Component | Service | Cost |
|-----------|---------|------|
| API Servers | AWS EC2 (t3.large × 3) | $300 |
| Database | AWS RDS PostgreSQL | $400 |
| Cache | AWS ElastiCache Redis | $150 |
| CDN | Cloudflare Pro | $20 |
| Storage | AWS S3 | $50 |
| Monitoring | Datadog | $100 |
| **Total** | | **$1,020** |

### Scaling Costs

| Users | Monthly Cost |
|-------|--------------|
| 10K | $1,000 |
| 50K | $2,500 |
| 100K | $5,000 |
| 500K | $15,000 |

---

## 10. Risks & Mitigations

### Technical Risks
| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Database bottleneck | High | Medium | Read replicas, caching |
| Service downtime | High | Low | Auto-scaling, health checks |
| Data loss | Critical | Very Low | Automated backups, replication |

### Business Risks
| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Cost overrun | Medium | Medium | Budget monitoring, alerts |
| Slow feature delivery | Medium | Medium | Agile methodology, automation |

---

## 11. Next Steps

### Phase 1: MVP (Months 1-2)
- [ ] Set up infrastructure
- [ ] Implement auth service
- [ ] Basic CRUD operations
- [ ] Simple UI

### Phase 2: Core Features (Months 3-4)
- [ ] Search functionality
- [ ] Real-time notifications
- [ ] File uploads
- [ ] Mobile app

### Phase 3: Scale & Optimize (Months 5-6)
- [ ] Performance optimization
- [ ] Additional microservices
- [ ] Advanced monitoring
- [ ] Security hardening

---

## 12. Appendix

### Technology Choices Rationale

**Node.js + TypeScript**:
- ✅ Full-stack JavaScript
- ✅ Large ecosystem
- ✅ Type safety
- ✅ Team expertise

**PostgreSQL**:
- ✅ ACID compliance
- ✅ JSON support
- ✅ Mature ecosystem
- ✅ Strong community

**React**:
- ✅ Component reusability
- ✅ Large community
- ✅ Rich ecosystem
- ✅ Performance

### Alternative Approaches Considered

**Monolith vs Microservices**:
- Chose microservices for scalability
- Trade-off: More complex operations

**SQL vs NoSQL**:
- Chose PostgreSQL for data integrity
- Could add NoSQL for specific use cases

---

## Conclusion

This design provides a solid foundation for {system} that can:
- Handle {scale} scale effectively
- Scale horizontally as needed
- Maintain high availability (99.9%)
- Support rapid feature development
- Keep costs within budget

**Success Probability**: 90% with proper execution
```

## Examples

### E-commerce Platform
```bash
/sc:design "e-commerce platform" --scale=large --constraints=["budget: $100K/mo", "6 month timeline"]

# Generates complete system design for large-scale e-commerce
```

### Real-time Chat App
```bash
/sc:design "real-time chat application" --scale=medium

# Designs WebSocket-based chat system
```

### API Service
```bash
/sc:design "REST API for mobile app" --scale=small

# Simple API architecture
```

## Integration

### With Skills
- system-architect: Architecture patterns
- design-patterns: Software patterns
- security-engineer: Security design

### With MCPs
- Sequential: Multi-step design reasoning
- Serena: Code pattern analysis

## Configuration

`.claude/settings.json`:
```json
{
  "commands": {
    "sc-design": {
      "defaultScale": "medium",
      "includeCodeExamples": true,
      "includeCostEstimation": true,
      "includeDiagrams": true
    }
  }
}
```

## Success Metrics

- Design comprehensiveness: >95%
- Best practices compliance: >90%
- Scalability score: >8/10
- Time to design: <90s
- User satisfaction: >4.7/5
