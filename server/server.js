const express = require('express');
const path = require('path');
const socketIO = require('socket.io');
const http = require('http');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');

const { Users } = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('new user connected');

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
           return  callback('Name and room name are required');
        }

        socket.join(params.room);
        users.removeUser(socket.id, params.name, params.room);
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUserList', users.getUserList(params.room));

        //socket.emit emit an event in that opened connection
        socket.emit('newMessage', generateMessage('Admin', "Welcome to the chat app"));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined the room`));

        callback();
    });

    socket.on('createMessage', (msg, callback) => {
        var user = users.getUser(socket.id);
        if (user && isRealString(msg.text)) {
            io.to(user.room).emit('newMessage', generateMessage(user.name, msg.text));
        }
        // io.emit emit the event in each connections
        
        callback()
        // send message to all users except who send it
        /* socket.broadcast.emit('newMessage', {
            ...msg,
            createdAt: new Date().getTime()
        }); */
    });

    socket.on('createLocationMessage', (coords) => {
        var user = users.getUser(socket.id);
        if(user){
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }
    });

    socket.on('disconnect', () => {
        console.log('client disconnected');
        var user = users.removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
        }
    });
});


server.listen(PORT, () => {
    console.log(`app started on port ${PORT}`);
});

