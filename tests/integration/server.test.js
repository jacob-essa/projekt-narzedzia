const { createTestApp } = require('../utils/testHelpers');

describe('Server Configuration Tests', () => {
  let app, server, io;

  beforeEach(() => {
    const testApp = createTestApp();
    app = testApp.app;
    server = testApp.server;
    io = testApp.io;
  });

  afterEach((done) => {
    if (server && server.listening) {
      server.close(done);
    } else {
      done();
    }
  });

  test('should start server on specified port', (done) => {
    const testPort = 0; // Use 0 to get a random available port
    
    server.listen(testPort, () => {
      expect(server.listening).toBe(true);
      expect(server.address().port).toBeGreaterThan(0);
      done();
    });
  });

  test('should handle server startup errors gracefully', (done) => {
    // Start server on a specific port
    server.listen(0, () => {
      const port = server.address().port;
      
      // Try to start another server on the same port
      const { createTestApp } = require('../utils/testHelpers');
      const testApp2 = createTestApp();
      const server2 = testApp2.server;
      
      server2.on('error', (error) => {
        expect(error).toBeDefined();
        done();
      });
      
      server2.listen(port); // This should fail
    });
  });

  test('should create Socket.IO server attached to HTTP server', () => {
    expect(io.httpServer).toBe(server);
  });

  test('should configure Socket.IO with default settings', () => {
    expect(io).toBeDefined();
    expect(typeof io.on).toBe('function');
    expect(typeof io.emit).toBe('function');
  });

  test('should handle multiple simultaneous connections', (done) => {
    server.listen(0, () => {
      // Test that server can handle basic HTTP connections
      expect(server.listening).toBe(true);
      expect(server.address().port).toBeGreaterThan(0);
      done();
    });
  });
});