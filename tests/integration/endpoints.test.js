const request = require('supertest');
const { createTestApp, fileExists } = require('../utils/testHelpers');
const path = require('path');

describe('HTTP Endpoints Integration Tests', () => {
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

  describe('GET /', () => {
    test('should return 200 status code', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
    });

    test('should return HTML content', async () => {
      const response = await request(app).get('/');
      expect(response.headers['content-type']).toMatch(/text\/html/);
    });

    test('should serve the template.html file', async () => {
      const templatePath = path.join(__dirname, '../../static/template.html');
      expect(fileExists(templatePath)).toBe(true);
      
      const response = await request(app).get('/');
      expect(response.text).toContain('<!DOCTYPE html>');
      expect(response.text).toContain('Simple Calculator');
    });
  });

  describe('Static file serving', () => {
    test('should serve CSS files', async () => {
      const response = await request(app).get('/css/styles.css');
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/text\/css/);
    });

    test('should serve JavaScript files', async () => {
      const response = await request(app).get('/rpn.js');
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/javascript/);
    });

    test('should return 404 for non-existent files', async () => {
      const response = await request(app).get('/non-existent-file.txt');
      expect(response.status).toBe(404);
    });

    test('should handle directory traversal attempts', async () => {
      const response = await request(app).get('/../package.json');
      expect(response.status).toBe(404);
    });
  });

  describe('Error handling', () => {
    test('should handle invalid routes', async () => {
      const response = await request(app).get('/invalid-route');
      expect(response.status).toBe(404);
    });

    test('should handle POST requests to root', async () => {
      const response = await request(app).post('/');
      expect(response.status).toBe(404);
    });
  });
});