# Testing Guide

## Overview

This guide covers the comprehensive testing strategy for Code-Assistant-Claude, including unit tests, integration tests, E2E tests, and performance benchmarks.

## Test Coverage Goals

- **Overall Coverage**: >80%
- **Unit Tests**: >85%
- **Integration Tests**: >75%
- **E2E Tests**: Critical workflows
- **Performance**: All benchmarks passing

## Test Structure

```
tests/
├── unit/                           # Unit tests
│   ├── analyzers/                  # Project analysis
│   ├── skills/                     # Skills system
│   ├── commands/                   # Command system
│   ├── execution-engine/           # MCP code execution
│   └── utils/                      # Utilities
│
├── integration/                    # Integration tests
│   ├── execution-engine/           # Full execution flow
│   ├── skills/                     # Progressive loading
│   └── workflows/                  # Full workflows
│
├── e2e/                            # End-to-end tests
│   ├── react-project.e2e.test.ts  # React project setup
│   ├── nodejs-project.e2e.test.ts # Node.js project setup
│   └── jest.e2e.config.js         # E2E configuration
│
└── performance/                    # Performance benchmarks
    ├── benchmarks.test.ts          # General benchmarks
    └── token-reduction.bench.ts   # Token reduction tests
```

## Running Tests

### All Tests

```bash
npm test
```

### Unit Tests Only

```bash
npm run test:unit
```

### Integration Tests Only

```bash
npm run test:integration
```

### E2E Tests

```bash
npm run test:e2e
```

### With Coverage

```bash
npm run test:coverage
```

### Watch Mode

```bash
npm run test:watch
```

## Writing Tests

### Unit Test Example

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { YourComponent } from '../../../src/path/to/component';

describe('YourComponent', () => {
  let component: YourComponent;

  beforeEach(() => {
    component = new YourComponent();
  });

  it('should do something', () => {
    const result = component.doSomething();
    expect(result).toBe(expectedValue);
  });

  it('should handle errors', () => {
    expect(() => component.throwError()).toThrow();
  });
});
```

### Integration Test Example

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

describe('Full Workflow', () => {
  beforeAll(async () => {
    // Setup
  });

  afterAll(async () => {
    // Cleanup
  });

  it('should complete full workflow', async () => {
    // Test full integration
  });
});
```

### E2E Test Example

```typescript
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

describe('E2E: Project Setup', () => {
  beforeAll(async () => {
    // Setup test project
  }, 30000);

  afterAll(async () => {
    // Cleanup
  }, 30000);

  it('should initialize project', async () => {
    // Test complete flow
  }, 30000);
});
```

## Test Categories

### 1. Unit Tests

**Purpose**: Test individual components in isolation

**Coverage Areas**:
- Analyzers (project, tech stack, git workflow)
- Skills (registry, parser, loader, cache)
- Execution Engine (sandbox, security, workspace)
- Utilities (validation, file operations)

**Best Practices**:
- Mock external dependencies
- Test edge cases
- Test error handling
- Keep tests fast (<100ms)

### 2. Integration Tests

**Purpose**: Test component interactions

**Coverage Areas**:
- Full execution flows
- Progressive skill loading
- Command execution
- Workflow completion

**Best Practices**:
- Test realistic scenarios
- Minimize mocking
- Test error recovery
- Verify end-to-end behavior

### 3. E2E Tests

**Purpose**: Test real-world scenarios

**Coverage Areas**:
- React project setup
- Node.js project setup
- Python project setup
- Full configuration generation

**Best Practices**:
- Use real file system
- Test complete flows
- Verify generated artifacts
- Clean up after tests

### 4. Performance Benchmarks

**Purpose**: Ensure performance targets are met

**Coverage Areas**:
- Token reduction (>90%)
- Execution time (<5s)
- Memory usage (<512MB)
- Scalability

**Best Practices**:
- Measure consistently
- Compare against baselines
- Track trends
- Document expectations

## Coverage Requirements

### By Module

| Module | Target Coverage |
|--------|----------------|
| Analyzers | >85% |
| Skills | >85% |
| Commands | >80% |
| Execution Engine | >80% |
| Security | >90% |
| Utilities | >85% |

### Coverage Commands

```bash
# Generate coverage report
npm run test:coverage

# View coverage in browser
open coverage/index.html

# Check coverage thresholds
npm run test:coverage -- --coverage.thresholds.lines=80
```

## CI/CD Integration

### GitHub Actions Workflows

1. **CI Workflow** (`.github/workflows/ci.yml`)
   - Runs on push and PR
   - Type checking
   - Linting
   - Unit tests
   - Integration tests
   - Coverage reporting
   - Build verification

2. **E2E Workflow**
   - Runs after CI passes
   - Full E2E test suite
   - Multiple project types

3. **Security Workflow**
   - Security audit
   - License checking
   - Vulnerability scanning

4. **Performance Workflow**
   - Performance benchmarks
   - Token reduction validation

### Coverage Reporting

Coverage is automatically uploaded to Codecov on CI runs:

```yaml
- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/coverage-final.json
```

## Performance Benchmarks

### Token Reduction Targets

- MCP Code Execution: >98%
- Progressive Skills: >90%
- Symbol Compression: 30-50%
- Overall: >90%

### Execution Time Targets

- Initialization: <2s
- Command Execution: <5s
- Skill Loading: <1s
- Project Analysis: <3s

### Running Benchmarks

```bash
# All benchmarks
npm run benchmark

# Token reduction
npm run benchmark:token-reduction

# Execution engine
npm run benchmark:execution-engine
```

## Debugging Tests

### Using VS Code Debugger

1. Set breakpoint in test
2. Run "Debug Test" from test explorer
3. Inspect variables and stack

### Using Console Logs

```typescript
it('should debug test', () => {
  console.log('Debug info:', someVariable);
  expect(result).toBe(expected);
});
```

### Using Test Timeouts

```typescript
it('should handle long operation', async () => {
  // Test code
}, 30000); // 30 second timeout
```

## Best Practices

### 1. Test Naming

- Use descriptive names
- Follow pattern: "should [expected behavior] when [condition]"
- Group related tests with `describe`

### 2. Test Organization

- One test file per source file
- Mirror source directory structure
- Use meaningful describe blocks

### 3. Test Independence

- Tests should not depend on each other
- Clean up after each test
- Use `beforeEach`/`afterEach` for setup/teardown

### 4. Mocking

- Mock external dependencies
- Use real implementations for integration tests
- Document mock behavior

### 5. Assertions

- One logical assertion per test
- Use specific matchers
- Test positive and negative cases

### 6. Error Testing

```typescript
// Test error throwing
expect(() => functionThatThrows()).toThrow(ExpectedError);

// Test async errors
await expect(asyncFunction()).rejects.toThrow();
```

## Troubleshooting

### Tests Timing Out

```bash
# Increase timeout
npm run test -- --testTimeout=30000
```

### Coverage Below Threshold

```bash
# Identify uncovered lines
npm run test:coverage
# Check coverage/index.html for details
```

### Flaky Tests

- Check for race conditions
- Ensure proper cleanup
- Use deterministic test data
- Avoid time-based assertions

### Memory Issues

```bash
# Run tests with more memory
NODE_OPTIONS=--max_old_space_size=4096 npm test
```

## Continuous Improvement

### Adding New Tests

1. Identify untested code
2. Write failing test
3. Implement feature
4. Verify test passes
5. Check coverage

### Maintaining Tests

- Update tests when code changes
- Remove obsolete tests
- Refactor test code
- Keep tests fast

### Performance

- Monitor test execution time
- Parallelize when possible
- Use focused tests during development
- Run full suite in CI

## Resources

- [Vitest Documentation](https://vitest.dev)
- [Jest Documentation](https://jestjs.io)
- [Testing Best Practices](https://testingjavascript.com)
- [Coverage Reports](./coverage/index.html)

## Support

For testing issues:
1. Check this guide
2. Review test examples
3. Check CI logs
4. Create issue with test failure details
