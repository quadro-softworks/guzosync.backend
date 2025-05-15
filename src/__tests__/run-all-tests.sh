#!/bin/bash

# Set environment to test
export NODE_ENV=test

# Run unit tests
echo "Running unit tests..."
npx jest --testMatch="**/__tests__/modules/**/*.spec.ts" --testMatch="**/__tests__/modules/**/*.test.ts"

# Run integration tests
echo "Running integration tests..."
npx jest --testMatch="**/__tests__/integration/**/*.test.ts"

# Run endpoint tests
echo "Running endpoint tests..."
npx jest --testMatch="**/__tests__/endpoints/**/*.test.ts"

# Generate coverage report
echo "Generating coverage report..."
npx jest --coverage

echo "All tests completed!" 