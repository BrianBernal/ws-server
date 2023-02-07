let socket; // This will be the socket instance

/**
 * Manage the whole connection logic
 * @returns A promise, which will wait for the socket to open
 */
function connect() {
  return new Promise((resolve, reject) => {
    // Create the link to the web socket
    const socketProtocol = (window.location.protocol === 'https:' ? 'wss:' : 'ws:');
    const port = 3000;
    const socketUrl = `${socketProtocol}//${window.location.hostname}:${port}/ws/`;

    /**
     * If you are running your websocket on localhost, you can change
     * socketUrl to 'http://localhost:3000' as we are running our websocket
     * on port 3000 from the previous websocket code.
     */
    socket = new WebSocket(socketUrl);

    // This will fire once the socket opens
    socket.onopen = (/* e */) => {
      // Send a little test data, which can be used on the server if necessary
      socket.send(JSON.stringify({ loaded: true }));
      resolve();// now we are connected
    };

    // This will fire when the server sends the user a message
    socket.onmessage = (data) => {
      console.log('Received message:', data);
      const parsedData = JSON.parse(data.data);
      if (parsedData.append) {
        const newEl = document.createElement('p');
        newEl.textContent = parsedData.returnText;
        document.getElementById('websocket-returns').appendChild(newEl);
      }
    };

    // This will fire on error
    socket.onerror = (e) => {
      console.log('error:', e);
      reject();
      connect(); // try to connect again
      /**
       * This can be an overload by recursion. DANGER!!!
       */
    };
  });
}

/**
 * Check if a websocket is open
 * @param {Object} webSocket The webSocket instance
 * @returns boolean. True is successfully open, false otherwise
 */
function isOpen(webSocket) {
  return webSocket.readyState === webSocket.OPEN;
}

// When the document has been loaded
document.addEventListener('DOMContentLoaded', () => {
  connect(); // Set up the socket instance of the webSocket connection. (first line)
  document.getElementById('websocket-button').addEventListener('click', () => {
    if (isOpen(socket)) {
      socket.send(JSON.stringify({
        data: 'this is our data to send',
        other: 'this can be in any format',
      }));
    }
  });
});
