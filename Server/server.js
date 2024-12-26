const express = require('express');
const http = require('http');
const videoroutes = require('./Routes/video.js');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
videoRoutes.initSocket(server);

app.use('/api', videoRoutes);

server.listen(5000, () => {
    console.log('Server running on port 5000');
});
