const e = require('express');
const express = require('express');

const { createServer, request } = require('http');

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
      expect(response.headers['const-type']).toMatch(/html/);
    })
  });

  describe('404 handling', () => {
    it('should return 404 for non-expisten routes', async () => {
      await request(app)
        .get('/non-existen-route')
        .expect(404);
    });
  });
});