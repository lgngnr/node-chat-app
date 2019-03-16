const socket = io();

function scrollToBottom() {
    //selectors
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child');
    //height
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
        
};

socket.on('connect', () => {
    console.log('connected to server');
    var params = jQuery.deparam(window.location.search);
    socket.emit('join', params, (err) => {
        if (err) {
            alert(err);
            window.location.href = '/';
        } else {
            console.log('No error');
        }
    });
});
socket.on('disconnect', () => {
    console.log('disconnected from server');
});

socket.on('updateUserList', (users) => {
    var ol = jQuery('<ol></ol>');
    users.forEach((user) => {
        ol.append(jQuery('<li></li>').text(user)); 
    });
    jQuery('#users').html(ol);
});

socket.on('newEmail', (data) => {
    console.log('new email', data); 
});

socket.on('newMessage', (data) => {
    console.log('newMessage', data);

    var formattedTime = moment(data.createdAt).format('h:mm a');

    var template = jQuery('#message-template').html();
    var html = Mustache.render(template, {
        from: data.from,
        text: data.text,
        createdAt: formattedTime
    });
    jQuery('#messages').append(html);
    scrollToBottom();

    /* 
    let li = jQuery('<li></li>');
    li.text(`${data.from} ${formattedTime}: ${data.text}`);
    jQuery('#messages').append(li); */
});

socket.on('newLocationMessage', (data) => {
    console.log('newLocationMessage', data);
    var formattedTime = moment().format('h:mm a');
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template, {
        from: data.from,
        url: data.url,
        createdAt: formattedTime
    });
    jQuery('#messages').append(html);
    scrollToBottom();

    /* let li = jQuery('<li></li>');
    let a = jQuery(`<a target="_blank">My current location</a>`);
    li.text(`${message.from} ${formattedTime}: `);
    a.attr('href', message.url);
    li.append(a);
    jQuery('#messages').append(li); */
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