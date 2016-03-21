var express = require('express');
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var io = require('socket.io')(http);

var clients = [{"username": "fakeUser1"}];
var latestUser;
var connected = {};
var messageList = [];

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});


app.post('/login', function (req, res) {
    var userName = req.body.username;
    if (userName.indexOf(' ') > -1) {
       res.json({message: 'Username cannot contain spaces!'});
    }
    else {
        console.log(req.body.username);
        latestUser = req.body.username;
        clients.push(req.body);
        res.json({message: "Success!"});
    }
});

io.on('connection', function (socket) {
    if (latestUser != undefined) {
        connected[latestUser] = socket;
        socket.user = latestUser;
        socket.emit('client username', latestUser);
    }

    /* Populate users and messages to new client */
    io.emit('update users', Object.keys(connected));
    io.emit('public message', messageList);

    socket.on('public message', function (message) {
        messageList.push(message);
        io.emit('public message', messageList);
    });

    socket.on('disconnect', function () {
        delete connected[this.user];
        console.log(this.user + " disconnected");
        io.emit('update users', Object.keys(connected));
    });

    /* Create nofification for when user disconnects */


    //socket.on('remove user', function(user) {
    //    console.log('connected')
    //    delete connected[user];
    //    io.emit('update users', Object.keys(connected));
    //    console.log("THis happened");
    //});

});


http.listen(8000);
console.log("Listening on *:8000");
