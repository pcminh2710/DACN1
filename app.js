var express = require('express');
var app = express();

var homeController = require("./controller/homeController");
var siginController = require("./controller/siginController");
var chat = require("./controller/chat");
var server = require('http').createServer(app);
var io = require("socket.io")(server);

// cổng cho server
var port = 8000;

//đường dẫn public cho người dùng
app.use('/assets', express.static(__dirname + "/public"));
app.set("view engine", "ejs"); //tạo view ejs


homeController(app);
siginController(app);
chat(app);

const users = {}

io.on('connection', socket => {
    socket.on('user-connected', function(data) {
        users[data] = socket.id
        io.emit('user-connected', data)
    })
    socket.on('send-mes', function(data) {
        var socketId = users[data.receiver]
        io.to(socketId).emit('new-message', data)
    })

});


//server đang lắng nghe các request
server.listen(port, function() {
    console.log("server is listening on port: ", port);
});