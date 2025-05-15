# Testing Strategy

## Test Suite Overview

This project uses Jest for testing with the following test structure:

1. **Unit Tests**
   - Located in `src/__tests__` with `.spec.ts` suffix
   - Tests individual components in isolation

2. **Integration Tests**
   - Located in `src/__tests__/integration` with `.test.ts` suffix
   - Tests interactions between components

3. **Endpoint Tests**
   - Located in `src/__tests__/endpoints` with `.test.ts` suffix
   - Tests HTTP endpoints

## Test Setup

The test environment is configured in:
- `jest.config.js` - Jest configuration
- `jest.setup.js` - Global setup/mocks

## Mocking Strategy

### MongoDB

Instead of using `mongodb-memory-server` which can cause compatibility issues across different environments, we use:

1. **Complete mocking** of Mongoose models:
   ```typescript
   // Example from src/__tests__/mock-database.test.ts
   jest.mock('mongoose', () => ({
     connect: jest.fn().mockResolvedValue(true),
     disconnect: jest.fn().mockResolvedValue(true),
     connection: { readyState: 1 },
     Schema: jest.fn().mockImplementation(() => ({ index: jest.fn().mockReturnThis() })),
     model: jest.fn().mockImplementation((name) => ({
       findById: jest.fn().mockResolvedValue(/* mock data */),
       find: jest.fn().mockResolvedValue(/* mock data */),
       // ...other model methods
     })),
   }));
   ```

2. **Schema Type Mocking** to handle ObjectId references:
   ```typescript
   // Example from src/__tests__/schema-mockup.test.ts
   class MockSchema {
     static get Types() {
       return {
         ObjectId: 'ObjectId',
         String: String,
         Number: Number,
         // ... other types
       };
     }
   }
   ```

### Socket.IO

Websocket connections are mocked to prevent actual network activity:

```typescript
// Example from src/__tests__/integration/test-utils.ts
const mockSocket = {
  emit: jest.fn(),
  on: jest.fn().mockImplementation((event, callback) => {
    if (event === 'connect') setTimeout(() => callback(), 0);
    return mockSocket;
  }),
  // ... other socket methods
};
```

### Dependency Injection (tsyringe)

The dependency injection container is mocked to provide test doubles:

```typescript
// Example from src/__tests__/schema-mockup.test.ts
jest.mock('tsyringe', () => ({
  injectable: () => jest.fn(),
  inject: () => jest.fn(),
  container: {
    resolve: jest.fn().mockImplementation((token) => ({})),
  },
  singleton: () => jest.fn(),
}));
```

## HTTP Testing

For testing HTTP endpoints, we use Supertest with mocked Express routes:

```typescript
// Example from src/__tests__/mocked-integration/auth-flow.test.ts
app.post('/api/accounts/login', (req, res) => {
  if (req.body.email === 'test@example.com' && req.body.password === 'Password123!') {
    res.status(200).json({
      token: 'mock-jwt-token',
      user: { /* mock user data */ }
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});
```

## Running Tests

To run tests:
```
pnpm test
```

To run specific tests:
```
pnpm test -- path/to/test
```

## Troubleshooting

If tests fail with MongoDB-related errors:
1. Check the mongoose mock implementation
2. Ensure Schema.Types.ObjectId is properly mocked
3. Verify tsyringe reflection metadata is set up

For socket connection issues:
1. Check socket mocks are properly configured
2. Ensure no real connections are being attempted

## Test Coverage

Test coverage is configured in `jest.config.js` but currently disabled for simplicity. To enable coverage reports:

1. Set `collectCoverage: true` in `jest.config.js`
2. Uncomment the `coverageThreshold` section if needed 