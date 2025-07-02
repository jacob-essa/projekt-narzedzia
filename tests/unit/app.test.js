const { createTestApp } = require('../utils/testHelpers');

describe('Express App Unit Tests', () => {
  let app, server, io;

  beforeEach(() => {
    const testApp = createTestApp();
    app = testApp.app;
    server = testApp.server;
    io = testApp.io;
  });

  afterEach(() => {
    if (server && server.listening) {
      server.close();
    }
  });

  test('should create Express app instance', () => {
    expect(app).toBeDefined();
    expect(typeof app).toBe('function');
  });

  test('should create HTTP server instance', () => {
    expect(server).toBeDefined();
    expect(server.listening).toBe(false); // Server not started yet
  });

  test('should create Socket.IO instance', () => {
    expect(io).toBeDefined();
    expect(io.constructor.name).toBe('Server');
  });

  test('should have static file middleware configured', async () => {
    // Test that static files are served correctly (functional test)
    const request = require('supertest');
    const response = await request(app).get('/css/styles.css');
    expect(response.status).toBe(200);
  });

  test('should have root route configured', async () => {
    // Test that root route works (functional test)
    const request = require('supertest');
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });
});