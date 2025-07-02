const request = require('supertest');
const path = require('path');

// Helper function to create test app without starting server
function createTestApp() {
  const express = require('express');
  const { createServer } = require('http');
  const { Server } = require('socket.io');
  
  const app = express();
  const server = createServer(app);
  const io = new Server(server);
  
  // Add static file serving
  app.use(express.static(path.join(__dirname, '../../static')));
  
  // Add main route
  app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../../static/template.html'));
  });
  
  return { app, server, io };
}

// Helper to make requests to the test app
function makeRequest(app) {
  return request(app);
}

// Helper to check if file exists
function fileExists(filePath) {
  const fs = require('fs');
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    return false;
  }
}

module.exports = {
  createTestApp,
  makeRequest,
  fileExists
};