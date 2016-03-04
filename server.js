var express = require('express');
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var io = require('socket.io')(http);

var clients = [];

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res) {
   res.sendFile(__dirname + '/login.html');
});

app.post('/login', function(req, res) {
    clients.push(req.body);
    res.json({message: "Success!"});
});

app.get('/user', function(req, res) {
    console.log(clients[clients.length - 1]);
    res.json(clients[clients.length - 1]);
});

io.on('connection', function(socket) {
    console.log(clients[clients.length - 1]);
    socket.user = clients[clients.length - 1];

    socket.on('user connected', function(user) {
        io.emit('user connected', user);
    });

    socket.on('send message', function(message) {
       io.emit('send message', message);
    });

    socket.on('disconnect', function() {
       io.emit('user disconnected', socket.user);
    });
});


http.listen(8000);
console.log("Listening on *:8000");