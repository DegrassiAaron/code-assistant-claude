---
name: "test-generator"
version: "1.0.0"
description: "Generates comprehensive unit and integration tests with high coverage"
author: "Code-Assistant-Claude"
category: "core"

triggers:
  keywords: ["generate tests", "create tests", "add tests", "test coverage"]
  patterns: ["test.*for", "write.*tests"]
  filePatterns: ["*.ts", "*.js", "*.tsx", "*.jsx"]
  commands: ["/sc:test"]

tokenCost:
  metadata: 40
  fullContent: 1800
  resources: 400

dependencies:
  skills: []
  mcps: []

composability:
  compatibleWith: ["code-reviewer"]
  conflictsWith: []

context:
  projectTypes: ["javascript", "typescript", "react", "nodejs"]
  minNodeVersion: "18.0.0"
  requiredTools: ["jest", "testing-library"]

priority: "high"
autoActivate: true
cacheStrategy: "normal"
---

# Test Generator Skill

Automatically generates comprehensive test suites for your code.

## Features

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test component interactions
- **Edge Cases**: Automatically identify and test edge cases
- **Mocking**: Generate appropriate mocks for dependencies
- **Coverage**: Aim for >80% code coverage

## Test Patterns

### React Components
```typescript
describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<ComponentName />);
    expect(screen.getByText('...')).toBeInTheDocument();
  });

  it('handles user interaction', () => {
    const onClickMock = jest.fn();
    render(<ComponentName onClick={onClickMock} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClickMock).toHaveBeenCalled();
  });
});
```

### Functions
```typescript
describe('functionName', () => {
  it('returns expected output for valid input', () => {
    expect(functionName(input)).toBe(expected);
  });

  it('throws error for invalid input', () => {
    expect(() => functionName(invalidInput)).toThrow();
  });
});
```

## Integration

Works seamlessly with:
- Jest
- React Testing Library
- Vitest
- Mocha/Chai
