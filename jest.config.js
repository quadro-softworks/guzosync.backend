/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '**/__tests__/simplified-test.ts', 
    '**/__tests__/mock-database.test.ts',
    '**/__tests__/mocked-integration/**/*.test.ts',
    '**/__tests__/schema-mockup.test.ts'
  ],
  moduleNameMapper: {
    '^@core/(.*)$': '<rootDir>/src/core/$1',
    '^@modules/(.*)$': '<rootDir>/src/modules/$1'
  },
  collectCoverage: false, // Disable coverage for now
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testTimeout: 30000, // Increase test timeout to 30 seconds
  // Add transform for TypeScript files
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      isolatedModules: true
    }]
  }
}; 