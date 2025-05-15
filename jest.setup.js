// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.MAPBOX_TOKEN = 'test-mapbox-token';

// Disable mongodb-memory-server binary download during tests
process.env.MONGOMS_DISABLE_POSTINSTALL = '1';
// Use a version of MongoDB that might be more compatible
process.env.MONGOMS_VERSION = '5.0.5';

// Increase timeout for async tests
jest.setTimeout(60000); // 60 seconds timeout

// Mock console.error to reduce noise during tests
const originalConsoleError = console.error;
console.error = (...args) => {
  // Filter out specific errors we want to ignore during tests
  const errorMessage = args.join(' ');
  if (
    errorMessage.includes('mongodb-memory-server') ||
    errorMessage.includes('libcrypto.so.1.1') ||
    errorMessage.includes('MongoMemoryServer')
  ) {
    return;
  }
  originalConsoleError(...args);
}; 