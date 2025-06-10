const express = require('express');
const http = require('http');

const app = express();


app.use(express.json());

app.listen(process.env.PORT || 4000, () => {
    console.log('listening on port: 4000');
});


// sockets 
const { createServer } = require('node:http');
const server = require("http").createServer(app);
const io = require("socket.io")(server);
io.on('connect', (socket) => {
    console.log('A user connected');
    
    // Listen for mouseMove events from clients
    socket.on('mouseMove', (data) => {
        // Broadcast the mouse movement data to all connected clients except the sender
        socket.broadcast.emit('mouseMove', data);
    });
    
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(10000, () => {
    console.log('server running at 3000');
});
