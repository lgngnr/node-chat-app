const express = require('express');
const path = require('path');
const socketIO = require('socket.io');
const http = require('http');

const publicPath = path.join(__dirname, '../public');
const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('new user connected');

    socket.emit('newEmail', {
        from: 'test@test.com',
        subject: 'Hello World',
        text: 'Hello World',
        createAt: 123
    });

    socket.on('createEmail', (email) => {
        console.log('createEmail', email);
    });

    socket.on('createMessage', (msg) => {
        console.log('createMessage', msg);
        socket.emit('newMessage', {msg});
    });

    socket.on('disconnect', () => {
        console.log('client disconnected');
    });
});


server.listen(PORT, () => {
    console.log(`app started on port ${PORT}`);
});

