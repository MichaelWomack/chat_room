var express = require('express');
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var io = require('socket.io')(http);
var multer = require('multer');
var fs = require('fs');

var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './public/uploads');
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + '-' + file.originalname);
    }
});

var upload = multer({ storage : storage}).single('userFile');
var clients = [{"username": "fakeUser1"}];
var latestUser;
var connected = {};
var messageList = [];
var listFiles = [];


app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/downloads/', function(req, res) {
    var uploadPath = __dirname + '/public/uploads/';
    fs.readdir(uploadPath, function(err, files) {
        listFiles = files.slice(0);
        io.emit('update files', listFiles);
    });
    console.log("Refreshed.");
});

app.get('/downloads/:fileId', function(req, res) {
    var uploadPath = __dirname + '/public/uploads/';
    var fileId = req.params.fileId;
    fs.readdir(uploadPath, function(err, files) {
        listFiles = files.slice(0);
        listFiles.forEach(function(f) {
            console.log('Files: ' + f);
        });
        var clickedFile = listFiles[fileId];
        res.download(uploadPath + clickedFile.toString());
    });
});

app.post('/uploadFile', function(req, res) {
    upload(req, res, function(err) {
        if (err) {
            console.log("Error uploading file.");
        }
        console.log("File uploaded.");
        res.redirect("back");
    });
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
});

http.listen(8000);
console.log("Listening on *:8000");
