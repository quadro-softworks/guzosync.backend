// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.MAPBOX_TOKEN = 'test-mapbox-token';

// Increase timeout for async tests
jest.setTimeout(10000); 