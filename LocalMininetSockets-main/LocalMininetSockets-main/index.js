const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const cors = require('cors')
// Create an Express application
const app = express();
app.use(cors())
// Create an HTTP server and pass the Express app as a handler
const server = http.createServer(app);

// Create a new Socket.IO server and attach it to the HTTP server
const io = new Server(server);

// Listen for incoming connections on the Socket.IO server
io.on('connect', (socket) => {
    console.log('User connected');

    // Handle the 'joinTopo' event from clients
    socket.on('joinTopo', (data) => {
        console.log('User joined with data:', data);

        // Emit the 'joinTopo' event back to the client with the received data
        io.emit('send', data);
    });

    // Handle client disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Start the server and listen on port 6000, accessible from any network interface
server.listen(8080, '0.0.0.0', () => {
    console.log('Server running at http://0.0.0.0:6000');
});