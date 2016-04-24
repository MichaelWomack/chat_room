$(document).ready(function () {
    var socket = io();
    var user;
    var users;
    var files;

    //Grab the username and appends to message.
    socket.on('client username', function(myUsername) {
        user = myUsername;
        if (user == undefined) {
            window.location = '/';
        }
    });

    socket.on('update users', function(connectedUsers) {
        users = connectedUsers;
        console.log("Users: " + users.length);
        $('#friends-list').empty();
        users.forEach(function(user, index, clients) {
            addToUsers(user);
        });

        $('#friends-list li').on('click', function() {
            $(this).toggleClass('selected-user')
        });
    });

    socket.on('update files', function(listFiles) {
        console.log("Number of Files: " + listFiles.length);
        var count = 0;
        $('#uploadedFiles').empty();
        files = listFiles;
        files.forEach(function() {
            addToFileList(count, files);
            count++;
        });

    });
    

    $('input[type=file]').on('change', function() {
        var file = $(this).get(0).files[0];
        $('#status').empty().text(file.name);
    });

    $('#messageForm').submit(function () {
        var messageInput = $('#messageInput');
        var $fileInput = $('input[type=file]');
        if (messageInput.val() != "") {
            socket.emit('public message', {user: user, message: messageInput.val()});
            messageInput.val('');
        }
        
        if ($fileInput.get(0).files[0] != undefined) {
            $('#uploadForm').submit();
            $fileInput.val("");
            $('#status').empty();
        }
        return false;
    });

    socket.on('public message', function (data) {
        var messageEl = $('#messages');
        messageEl.empty();
        data.forEach(function(msg, index, msgList) {
            var newMessage = $('<li>');
            var userName = $('<strong>').text(msg.user + ": ");
            var messageContent = $('<span>').text(msg.message);
            newMessage.append(userName);
            newMessage.append(messageContent);
            messageEl.append(newMessage);
            messageEl.scrollTop(messageEl[0].scrollHeight - messageEl[0].clientHeight);
        });
    });


    $('#btn-disconnect').click(function() {
        socket.disconnect();
    });
});


var addToUsers = function (user) {
    var newUser = '<li class="list-group-item">' +
        '<i class="glyphicon glyphicon-user"></i>' +
        '<span>' + " " + user + '</span>' +
        '</li>';
    $('#friends-list').append(newUser);
};


var addToFileList = function (count, files) {
    var newFile = '<a href="/downloads/' + count + '"' + ' class="list-group-item"> ' +
        '<i class="glyphicon glyphicon-file"></i>' +
        ' ' +
        files[count] +
        '</a>';
    $('#uploadedFiles').append(newFile);
};






