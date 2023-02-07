// Import path and url dependencies
import path from 'path';
import { fileURLToPath } from 'url';

// Import express, expressWs, and http
import express from 'express';
import expressWs from 'express-ws';
import http from 'http';

// Get the directory and file path
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const port = 3000;

// App and server
const app = express();
const server = http.createServer(app).listen(port);

// Apply expressWs
expressWs(app, server);

app.use(express.static(`${dirname}/views`));

// Get the route /
app.get('/', (req, res) => {
  res.status(200).send('Welcome to our app');
});

// This lets the server pick up the '/ws' WebSocket route
app.ws('/ws', async (ws/* , req */) => {
  // After which we wait for a message and respond to it
  ws.on('message', async (msg) => {
    // If a message occurs, we'll console log it on the server
    console.log(msg);
    // Send back some data
    ws.send(JSON.stringify({
      append: true,
      returnText: 'I am using WebSockets!',
    }));
  });
});
