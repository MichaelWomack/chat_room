$(document).ready(function () {
    var socket = io();
    var user;
    var users;

    socket.on('client username', function(myUsername) {
        user = myUsername;
    });

    socket.on('update users', function(connectedUsers) {
        users = connectedUsers;
        $('#friends-list').empty();
        users.forEach(function(user, index, clients) {
            addToUsers(user);
        });

        $('#friends-list li').on('click', function() {
            $(this).toggleClass('selected-user')
        });
    });


    $('form').submit(function () {
        var messageInput = $('#messageInput');
        if (messageInput.val() != "")
            socket.emit('public message', {user: user, message: messageInput.val()});
        messageInput.val('');
        return false;
    });


    socket.on('public message', function (data) {
        var newMessage = $('<li>');
        var userName = $('<strong>').text(data.user + ": ");
        var messageContent = $('<span>').text(data.message);
        newMessage.append(userName);
        newMessage.append(messageContent);
        var messageEl = $('#messages');
        messageEl.append(newMessage);
        messageEl.scrollTop(messageEl[0].scrollHeight - messageEl[0].clientHeight);
    });


});


var addToUsers = function (user) {
    var newUser = '<li class="list-group-item">' +
        '<span>' + user + '</span>' +
        '<i class="glyphicon glyphicon-user"></i>' +
        '</li>';
    $('#friends-list').append(newUser);
};




