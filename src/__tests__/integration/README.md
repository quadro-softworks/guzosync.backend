# Integration Tests

This directory contains integration tests for the Guzo Sync backend application. These tests verify the interactions between different components of the system.

## Test Structure

- `auth/` - Authentication integration tests
- `buses/` - Bus tracking and management integration tests
- `passengers/` - Passenger service integration tests
- `drivers/` - Bus driver integration tests
- `control-center/` - Control center operation tests

## Running Tests

```bash
# Run all integration tests
npm test -- --testMatch="**/__tests__/integration/**/*.test.ts"

# Run specific integration test category
npm test -- --testMatch="**/__tests__/integration/auth/**/*.test.ts"
```

## Test Environment

The integration tests use:
- In-memory MongoDB server for database operations
- Mock implementations for external services (Mapbox, email, etc.)
- Real WebSocket server for socket.io tests 