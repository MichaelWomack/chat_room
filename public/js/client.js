$(document).ready(function () {
    var socket = io();
    var user;

    $.get('/user', function (userData) {
        user = {
            name: userData.name,
            username: userData.username
        };

    }).then(function() {
        socket.emit('user connected', user);
        socket.user = user;
    });


    /* New user joins */
    socket.on('user connected', function (user) {
        var newUser = '<li class="list-group-item">' +
            '<span>' + user.username + '</span>' +
            '<i class="glyphicon glyphicon-user"></i>' +
            '</li>';
        $('#friends-list').append(newUser);
        //addToUsers(user);
    });

    $('form').submit(function () {
        var messageInput = $('#messageInput');
        if (messageInput.val() != "")
            socket.emit('send message', messageInput.val());
        messageInput.val('');
        return false;
    });


    socket.on('send message', function (message) {
        var newMessage = $('<li>');
        var userName = $('<strong>').text(user.username + ": ");
        var messageContent = $('<span>').text(message)
        newMessage.append(userName);
        newMessage.append(messageContent);
        var messageEl = $('#messages');
        messageEl.append(newMessage);
        messageEl.scrollTop(messageEl[0].scrollHeight - messageEl[0].clientHeight);

    });
});

var addToUsers = function (user) {
    var newUser = '<li class="list-group-item">' +
        '<span>' + user.username + '</span>' +
        '<i class="glyphicon glyphicon-user"></i>' +
        '</li>';
    $('#friends-list').append(newUser);
};



