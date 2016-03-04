$(document).ready(function () {
    var socket = io();
    var user;
    var users;

    $.get('/user', function (userData) {
        user = {
            name: userData.name,
            username: userData.username
        };

    }).then(function() {
        socket.user = user;
    });

    $.get('/users', function(allUsers) {
        users = allUsers;
    }).then(function() {
      socket.emit('user connected', users);
    });


    socket.on('user connected', function(data) {
        $('#friends-list').empty();
        data.clients.forEach(function(user, index, clients) {
            addToUsers(user);
        });
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



    socket.on('user disconnected', function(disconnectedUser) {

         /* Repopulate with updated friends list */
         $.get('/users', function(allUsers) {
                users = allUsers;
            }).then(function() {
              socket.emit('user connected', users);
            });
    });
});


var addToUsers = function (userData) {
    var newUser = '<li class="list-group-item">' +
        '<span>' + userData.username + '</span>' +
        '<i class="glyphicon glyphicon-user"></i>' +
        '</li>';
    $('#friends-list').append(newUser);
};
