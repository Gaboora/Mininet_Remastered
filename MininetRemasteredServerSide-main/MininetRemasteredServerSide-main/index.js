require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const app = express();
const httpStatusText = require('./utils/httpStatusText');
app.use(cors())
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
const url = process.env.MONGO_URL;

mongoose.connect(url).then(() => {
    console.log('mongodb server started')
})

app.use(express.json());

const deviceRouter = require('./routes/device.route');
const topoRouter = require('./routes/topo.route');
const textRouter = require('./routes/text.route');
const linkRouter = require('./routes/link.route');
const userRouter = require('./routes/user.route');


app.use('/api/topo', topoRouter)
app.use('/api/device', deviceRouter)
app.use('/api/text', textRouter)
app.use('/api/link', linkRouter)
app.use('/api/user', userRouter)


// global middleware for not found router
app.all('*', (req, res, next) => {
    return res.status(404).json({ status: httpStatusText.ERROR, message: 'this resource is not available' })
})

// global error handler
app.use((error, req, res, next) => {
    res.status(error.statusCode || 500).json({ status: error.statusText || httpStatusText.ERROR, message: error.message, code: error.statusCode || 500, data: null });
})
app.listen(process.env.PORT || 4000, () => {
    console.log('listening on port: 4000');
});


// sockets 
const { createServer } = require('node:http');
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server)
const topoId = require("./controllers/topo.controller")
console.log("topoId ", topoId);
const rooms = {};
io.on('connect', (socket) => {
    socket.on('dataFromClient', (data) => {
        const { room } = data;
        // io.to(room).emit('message', message);
        socket.join(room);
    });
    socket.on('joinRoom', (data) => {
        const { room, user, userPhoto } = data;
        socket.join(room);
        if (!rooms[room]) {
            rooms[room] = [];
        }
        // Check if the user already exists in the room
        const userExists = rooms[room].some(existingUser => existingUser.user === user);
        if (!userExists) {
            rooms[room].push({ id: socket.id, user, userPhoto });
            console.log(`User ${user} joined room ${room}`);
            console.log(rooms);
        } else {
            // Update the socket ID for the existing user
            rooms[room] = rooms[room].map(existingUser =>
                existingUser.user === user ? { id: socket.id, user, userPhoto } : existingUser
            );
            console.log(`User ${user} reconnected to room ${room}`);
            console.log(rooms);
        }

        // Send the updated user list to the room
        io.to(room).emit('joinRoom', rooms[room]);
    });
    // Listen for mouseMove events from clients
    socket.on('mouseMove', (data) => {
        // Broadcast the mouse movement data to all connected clients except the sender
        const { room, user, x, y } = data;

        if (rooms[room]) {
            rooms[room] = rooms[room].map(existingUser =>
                existingUser.user === user ? { ...existingUser, mousePosition: { x, y } } : existingUser
            );

            // Broadcast the mouse movement data to all connected clients in the room except the sender
            socket.to(room).emit('mouseMove', data);
        }
    });
    socket.on('controllerMove', (data) => {
        const room = data.room;
        // Broadcast the mouse movement data to all connected clients except the sender
        socket.to(room).emit('controllerMove', data);
    });
    socket.on('topoChange', (data) => {
        const room = data.room;
        // Broadcast the mouse movement data to all connected clients except the sender
        io.to(room).emit('topoChange', data);
    });
    socket.on('deviceUpdate', (data) => {
        const room = data.room;
        // Broadcast the mouse movement data to all connected clients except the sender
        io.to(room).emit('deviceUpdate', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(3000, '0.0.0.0', () => {
    console.log('server running at 3000');
});