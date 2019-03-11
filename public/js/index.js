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

socket.on('newLocationMessage', (message) => {
    console.log('newLocationMessage', message);
    let li = jQuery('<li></li>');
    let a = jQuery('<a target="_blank">My current location</a>');
    li.text(`${message.from}: `);
    a.attr('href', message.url);
    li.append(a);
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

    var messageTextBox = jQuery('[name=message]');

    socket.emit('createMessage', {
        from: 'User',
        text: messageTextBox.val()
    }, () => {
            messageTextBox.val('');
    });
});

var locationButton = jQuery('#send-location');

locationButton.on('click', (e) => {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser');
    }
    locationButton.attr('disabled', 'disabled').text('Sending Location...');
    navigator.geolocation.getCurrentPosition((position) => {
        locationButton.removeAttr('disabled').text('Send Location');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
        console.log('send createLocationMessage');
    }, (err) => {
        locationButton.removeAttr('disabled');
        alert('unable to fetch location');
    });
});