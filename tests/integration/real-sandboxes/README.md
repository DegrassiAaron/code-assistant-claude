# Real Sandbox Integration Tests

These tests verify the execution engine with **real runtimes** (Python, Docker, Node.js) instead of mocks.

## Prerequisites

### Required
- **Node.js** ≥18.0.0 (for JavaScript/TypeScript execution)
- **Python** ≥3.8 (for Python execution tests)

### Optional
- **Docker** (for Docker sandbox tests)
  - Docker daemon must be running
  - User must have permissions to run Docker commands
  - Images: `python:3.11-slim`, `node:18-alpine`

## Running Tests

### All Real Integration Tests
```bash
npm run test:real
```

### Only Python Tests
```bash
npm test -- tests/integration/real-sandboxes/process-sandbox-real.test.ts
```

### Only Docker Tests (requires Docker)
```bash
npm test -- tests/integration/real-sandboxes/docker-sandbox-real.test.ts
```

### Full Workflow Tests
```bash
npm test -- tests/integration/real-sandboxes/full-workflow-real.test.ts
```

## Test Suites

### 1. `process-sandbox-real.test.ts`
Tests ProcessSandbox with real Python and JavaScript execution:
- ✅ Environment variable filtering
- ✅ Security isolation
- ✅ Error handling
- ✅ Resource limits
- ✅ Multi-language support

**Duration:** ~10-15 seconds
**Requirements:** Python 3.x, Node.js

### 2. `docker-sandbox-real.test.ts`
Tests DockerSandbox with real Docker containers:
- ✅ Container lifecycle management
- ✅ Resource limit enforcement (memory, CPU, timeout)
- ✅ Filesystem isolation
- ✅ Container cleanup
- ✅ Concurrent execution

**Duration:** ~30-60 seconds (image pulls on first run)
**Requirements:** Docker daemon running

### 3. `full-workflow-real.test.ts`
End-to-end workflow tests:
- ✅ Tool discovery
- ✅ Code generation from intent
- ✅ Security validation
- ✅ Real execution
- ✅ Token reduction verification
- ✅ Audit logging

**Duration:** ~20-40 seconds
**Requirements:** Python 3.x, Node.js

## Test Behavior

### Runtime Detection
Tests use `it.skipIf(!hasPython)` and `it.skipIf(!hasDocker)` to automatically skip tests when required runtimes are not available.

### Safe Failures
If Python or Docker is not installed:
- Tests will be skipped (not failed)
- Warning messages will be displayed
- Other tests continue normally

### Security Testing
These tests verify real security isolation:
- Environment variable filtering
- Filesystem access restrictions
- Network policy enforcement
- Resource limit enforcement

## Performance Expectations

| Test Suite | Duration | Tests | Requirements |
|------------|----------|-------|--------------|
| process-sandbox-real | ~10-15s | ~20 tests | Python, Node.js |
| docker-sandbox-real | ~30-60s | ~15 tests | Docker |
| full-workflow-real | ~20-40s | ~10 tests | Python, Node.js |

**Total:** ~60-115 seconds for complete real integration testing

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Real Integration Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      docker:
        image: docker:dind
        options: --privileged

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: npm ci

      - name: Pull Docker images
        run: |
          docker pull python:3.11-slim
          docker pull node:18-alpine

      - name: Run real integration tests
        run: npm run test:real
```

## Troubleshooting

### Python not detected
```bash
# Verify Python installation
python --version
# or
python3 --version

# Add to PATH if needed
export PATH=$PATH:/usr/local/bin
```

### Docker not accessible
```bash
# Verify Docker is running
docker ps

# Check permissions
sudo usermod -aG docker $USER
newgrp docker

# Start Docker daemon
sudo systemctl start docker
```

### Tests timing out
Increase timeout in vitest.config.ts:
```typescript
testTimeout: 30000, // 30 seconds
```

### Memory errors
Reduce memory limits in test configurations or ensure sufficient system RAM.

## Best Practices

1. **Run locally before CI/CD** - Verify tests pass on your machine
2. **Clean Docker images** - Periodically clean up test images
3. **Monitor resources** - Real tests consume actual CPU/memory
4. **Isolate from production** - Never run on production systems
5. **Parallel execution** - Limit concurrent Docker tests to avoid resource exhaustion

## Comparison: Mock vs Real Tests

| Aspect | Mock Tests (unit/) | Real Tests (integration/real-sandboxes/) |
|--------|-------------------|------------------------------------------|
| **Speed** | Fast (~5-10s) | Slower (~60-115s) |
| **Dependencies** | None | Python, Docker |
| **Coverage** | Code paths | Actual behavior |
| **CI/CD** | Always run | Optional/nightly |
| **Purpose** | Development | Pre-release validation |

**Recommendation:** Run mock tests during development, real tests before releases.
