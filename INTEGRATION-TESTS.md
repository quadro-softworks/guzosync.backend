# Integration Testing Guide for Guzo Sync Backend

This document provides guidance for running and creating integration tests for the Guzo Sync backend application.

## Overview

Integration tests verify that different components of the system work together correctly. In contrast to unit tests, which test isolated components, integration tests ensure that the interactions between components function as expected.

## Test Structure

The integration tests are organized by feature domain:

```
src/__tests__/integration/
├── README.md
├── test-utils.ts
├── auth/
│   └── auth-flow.test.ts
├── bus-tracking/
│   └── real-time-tracking.test.ts
├── control-center/
│   └── operations.test.ts
└── passenger/
    └── passenger-services.test.ts
```

## Running Tests

### Running All Integration Tests

```bash
npm run test:integration
# or
pnpm test:integration
```

### Running Specific Test Files

```bash
npx jest --testMatch="**/__tests__/integration/auth/*.test.ts"
```

### Running with Coverage

```bash
npx jest --testMatch="**/__tests__/integration/**/*.test.ts" --coverage
```

## Test Environment

The integration tests use:

1. **In-memory MongoDB**: Tests use `mongodb-memory-server` to create a temporary MongoDB instance for tests.
2. **Isolated Express Server**: Each test suite spins up its own Express server.
3. **WebSocket Testing**: Real WebSocket connections are established for testing real-time features.
4. **Authentication**: Tests properly manage authentication tokens between requests.
5. **External Service Mocks**: External services like Mapbox are mocked in `src/__tests__/setup.ts`.

## Writing New Integration Tests

1. **Test File Naming**: Name your test files with the pattern `*.test.ts` or `*.spec.ts`.
2. **Use Test Utilities**: Import helper functions from `test-utils.ts`.
3. **Test Setup/Teardown**: Each test suite should:
   - Use `beforeAll()` to set up the test environment
   - Use `afterAll()` to clean up resources
   - Create any necessary test data
4. **Group Related Tests**: Use `describe()` blocks to group related tests.
5. **Test Independence**: Tests should be independent of each other.

### Example Test Structure

```typescript
import request from 'supertest';
import { setupTestApp, teardownTestApp } from '../test-utils';

describe('Feature Integration Tests', () => {
  let app, server, apiUrl;

  beforeAll(async () => {
    const setup = await setupTestApp();
    app = setup.app;
    server = setup.server;
    apiUrl = setup.apiUrl;
  });

  afterAll(async () => {
    await teardownTestApp(server);
  });

  describe('Subfeature', () => {
    it('should do something specific', async () => {
      // Test code here
    });
  });
});
```

## Best Practices

1. **Focus on Workflows**: Test complete user workflows rather than individual actions.
2. **Test Edge Cases**: Include tests for error conditions and edge cases.
3. **Clear Assertions**: Make assertions clear and specific.
4. **Clean Up Data**: Clean up any created data after tests.
5. **Realistic Data**: Use realistic test data that mirrors production scenarios.

## Dependencies

The integration tests rely on the following npm packages:

- `supertest`: For making HTTP requests to the Express app
- `mongodb-memory-server`: For creating an in-memory MongoDB server
- `socket.io-client`: For testing WebSocket communication 