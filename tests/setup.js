// Test setup file
// Global test configuration and utilities

// Increase timeout for integration tests
jest.setTimeout(10000);

// Suppress console.log during tests unless needed
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

beforeAll(() => {
  if (process.env.NODE_ENV === 'test') {
    console.log = jest.fn();
    console.error = jest.fn();
  }
});

afterAll(() => {
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
});