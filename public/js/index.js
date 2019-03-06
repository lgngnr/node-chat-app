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
    let li = jQuery('<li></li>');
    li.text(`${data.from}: ${data.text}`);
    jQuery('#messages').append(li);
});

/* socket.emit('createEmail', {
    to: "test@test.com",
    subject: "Test",
    text: "Hello World"
}); */

socket.emit('createMessage', {
    from: "tom",
    text: "Hello World"
}, (data) => {
        console.log('got it', data);
    });

jQuery('#message-form').on('submit', (e) => {
    e.preventDefault();
    console.log('submit');

    socket.emit('createMessage', {
        from: 'User',
        text: jQuery('[name=message]').val()
    }, () => {
        
    });
});