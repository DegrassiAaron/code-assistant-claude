---
name: "sc-test"
description: "Generate comprehensive test suites for code"
category: "workflow"
version: "1.0.0"

triggers:
  exact: "/sc:test"
  aliases: ["/test", "/generate-tests"]
  keywords: ["generate tests", "create tests", "test coverage"]

requires:
  skills: ["test-generator"]
  mcps: ["serena"]

parameters:
  - name: "target"
    type: "string"
    required: true
    description: "File or function to test"
  - name: "type"
    type: "string"
    required: false
    default: "all"
    options: ["unit", "integration", "e2e", "all"]
  - name: "coverage"
    type: "number"
    required: false
    default: 80

autoExecute: false
tokenEstimate: 12000
executionTime: "20-60s"
---

# /sc:test - Test Generation

Generates comprehensive test suites with high coverage and edge case handling.

## Execution Flow

### 1. Code Analysis
- Parse target code structure
- Identify functions and methods
- Extract dependencies
- Determine edge cases
- Analyze data flows

### 2. Test Strategy Selection

**Unit Tests**:
- Test individual functions
- Mock dependencies
- Cover edge cases
- Validate error handling

**Integration Tests**:
- Test module interactions
- Real dependencies
- Data flow validation
- API contracts

**E2E Tests**:
- User workflows
- Full system integration
- Real environment
- Production scenarios

### 3. Test Generation Steps

1. **Analyze Target** (Serena MCP)
   - Understand code structure
   - Identify dependencies
   - Find edge cases
   - Determine test framework

2. **Generate Unit Tests**
   - Happy path tests
   - Error cases
   - Edge cases
   - Boundary conditions
   - Null/undefined handling

3. **Generate Integration Tests**
   - Module interactions
   - Database operations
   - API calls
   - Event flows

4. **Generate E2E Tests** (if type=e2e or all)
   - User scenarios
   - Complete workflows
   - Error recovery
   - Performance tests

5. **Generate Mocks and Fixtures**
   - Mock data
   - Stub functions
   - Test fixtures
   - Helper utilities

### 4. Quality Metrics

Target coverage: {coverage}%

**Test Quality Checks**:
- ✅ All code paths covered
- ✅ Edge cases included
- ✅ Error handling tested
- ✅ Mocks properly isolated
- ✅ Assertions meaningful
- ✅ Tests maintainable

## Examples

### Generate All Tests
```bash
/sc:test "src/services/UserService.ts" --type=all --coverage=90

# Generates:
# tests/unit/UserService.test.ts
# tests/integration/UserService.integration.test.ts
# tests/fixtures/user-fixtures.ts
# tests/mocks/user-mocks.ts
```

### Unit Tests Only
```bash
/sc:test "src/utils/calculator.ts" --type=unit

# Generates:
# tests/unit/calculator.test.ts
# - testAddition()
# - testSubtraction()
# - testEdgeCases()
# - testErrorHandling()
```

### Integration Tests
```bash
/sc:test "src/api/routes/users.ts" --type=integration

# Generates:
# tests/integration/users.api.test.ts
# - testCreateUser()
# - testGetUsers()
# - testUpdateUser()
# - testDeleteUser()
# - testErrorCases()
```

### E2E Tests
```bash
/sc:test "src/features/checkout" --type=e2e

# Generates:
# tests/e2e/checkout.e2e.test.ts
# - testCompleteCheckoutFlow()
# - testPaymentProcessing()
# - testErrorRecovery()
```

## Test Frameworks Supported

- **JavaScript/TypeScript**: Jest, Vitest, Mocha
- **React**: React Testing Library, Enzyme
- **Python**: pytest, unittest
- **Go**: testing package
- **Rust**: cargo test
- **Java**: JUnit, TestNG

## Coverage Report

```
📊 Test Coverage Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: src/services/UserService.ts
Overall Coverage: 92%

Statements:    94% (47/50)
Branches:      88% (22/25)
Functions:     100% (8/8)
Lines:         93% (45/48)

Uncovered Lines:
- Line 67: Error handling branch
- Line 123: Edge case condition
- Line 145: Rare error path

Recommendations:
✅ Add test for line 67 error case
✅ Add test for empty array input
✅ Add test for network timeout
```

## Integration

### With Skills
- test-generator: Test creation and patterns
- code-reviewer: Test quality validation

### With MCPs
- Serena: Code analysis and pattern matching
- Playwright: E2E test execution

## Configuration

`.claude/settings.json`:
```json
{
  "commands": {
    "sc-test": {
      "defaultType": "all",
      "targetCoverage": 80,
      "framework": "auto-detect",
      "includeEdgeCases": true,
      "generateMocks": true
    }
  }
}
```

## Success Metrics

- Test generation accuracy: >95%
- Coverage achievement: >90%
- False positives: <5%
- Execution time: <60s
