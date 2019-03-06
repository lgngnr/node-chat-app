const socket = io();
socket.on('connect', () => {
    console.log('connected to server');
});
socket.on('disconnect', () => {
    console.log('disconnected from server');
});

socket.on('newEmail', (data) => {
    console.log('new email', data); 
});

socket.on('newMessage', (data) => {
    console.log('newMessage', data);
});

/* socket.emit('createEmail', {
    to: "test@test.com",
    subject: "Test",
    text: "Hello World"
}); */

/* socket.emit('createMessage', {
    from: "tom",
    text: "Hello World"
}); */