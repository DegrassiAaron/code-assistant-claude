# Code Review Best Practices

## TypeScript/JavaScript

### Naming Conventions
- Use camelCase for variables and functions
- Use PascalCase for classes and types
- Use UPPER_CASE for constants
- Descriptive names (avoid abbreviations)

### Code Organization
- One component per file
- Group related functionality
- Consistent file structure
- Separate concerns (logic, UI, data)

### Error Handling
- Always handle promises (.catch() or try/catch)
- Provide meaningful error messages
- Use custom error types when appropriate
- Log errors appropriately

### Performance
- Avoid unnecessary re-renders in React
- Use memoization where beneficial
- Optimize loops and iterations
- Lazy load heavy components

### Security
- Validate all user input
- Sanitize data before display
- Use environment variables for secrets
- Implement proper authentication/authorization
