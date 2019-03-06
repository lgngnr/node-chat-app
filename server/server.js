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

    //socket.emit emit an event in that opened connection
    socket.emit('newMessage', {
        from: 'admin',
        text: 'Welcome to the chat app',
        createAt: new Date().getTime()
    });

    socket.on('createEmail', (email) => {
        console.log('createEmail', email);
    });
    socket.broadcast.emit('newMessage', {
        from: 'admin',
        text: 'New user join the chat app',
        createAt: new Date().getTime()
    });

    socket.on('createMessage', (msg) => {
        console.log('createMessage', msg);
        // io.emit emit the event in each connections
        io.emit('newMessage', {
            ...msg,
            createdAt: new Date().getTime()
        });
        // send message to all users except who send it
        /* socket.broadcast.emit('newMessage', {
            ...msg,
            createdAt: new Date().getTime()
        }); */
    });

    socket.on('disconnect', () => {
        console.log('client disconnected');
    });
});


server.listen(PORT, () => {
    console.log(`app started on port ${PORT}`);
});

