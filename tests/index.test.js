const path = require('path');
const express = require('express');

const { createServer } = require('http');
const request = require('supertest');

const hostname = 'localhost';
const port = 0;

function createApp()
{
  const app = express();
  const server = createServer(app);


  // Add this line to serve static files
  app.use(express.static(path.join(__dirname, 'static')));


  app.get('/', function(req, res)  
  {
    res.sendFile(path.join(__dirname, '/static/template.html'));
  });

  server.listen(port, hostname, () => 
  {
    console.log(`Listening on port ${port}`);
  });
  return { app, server};
}

describe('Express App', () => {
  let app, server;

  beforeEach(() => {
    const appSetup = createApp();
    app = appSetup.app;
    server = appSetup.server;
  });

  afterEach((done) =>{
    if (server && server.listening) 
    {
      server.close(done);
    }
    else
    {
      done();
    }
  });

  describe('GET /', () => {
    it('should return the template.html file', async () => {
      const response = await request(app)
        .get('/template.html')
        .expect(200);
      expect(response.headers['content-type']).toMatch(/html/);
    })
  });

  describe('404 handling', () => {
    it('should return 404 for non-existent routes', async () => {
      await request(app)
        .get('/non-existen-route')
        .expect(404);
    });
  });
});