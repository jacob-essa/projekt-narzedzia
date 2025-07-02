const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = createServer(app);
const io = new Server(server);

const hostname = "0.0.0.0"
const port = 4200

// Add this line to serve static files
app.use(express.static(path.join(__dirname, 'static')));


app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/static/template.html'));
});

server.listen(port, hostname, () => {
    console.log(`Listening on port ${port}`);
});

