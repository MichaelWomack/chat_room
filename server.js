var express = require('express');
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var io = require('socket.io')(http);

var clients = [{"username": "fakeUser1"}];
var latestUser;
var connected = {};

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/login.html');
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
    connected[latestUser] = socket;
    socket.user = latestUser;

    //Only emit it to that socket
    socket.emit('client username', latestUser);


    io.emit('update users', Object.keys(connected));

    socket.on('public message', function (message) {
        io.emit('public message', message);
    });

    socket.on('disconnect', function () {
        if (socket.user) {
            console.log(socket.user.username + ' disconnected');
            delete connected[socket.user.username];
        }
        io.emit('user connected', Object.keys(connected));
    });


});


http.listen(8000);
console.log("Listening on *:8000");
