var express = require('express');
var app = express();

var multer = require('multer')

var bodyParser = require('body-parser'); 
var urlencodeParser = bodyParser.urlencoded({ extended: false });
var homeController = require("./controller/homeController");
var siginController = require("./controller/siginController");
var callController = require("./controller/callController");
var chat = require("./controller/chat");
var server = require('http').createServer(app);
var io = require("socket.io")(server);
var connection = require('./controller/db');
const { urlencoded } = require('body-parser');

let {PythonShell} = require('python-shell')
var spawm = require('child_process').spawn;
const lockSystem = require('lock-system');

const { ExpressPeerServer } = require('peer');
const { send } = require('process');
const fs = require('fs');
const dir = '../DACN1/dataSet/User.1.1.jpg'; //mes
const peerServer = ExpressPeerServer(server, {
    debug: true
})

app.use('/peerjs', peerServer)

// cổng cho server
var port = 8000;

//đường dẫn public cho người dùng
app.use('/assets', express.static(__dirname + "/public"));
app.set("view engine", "ejs"); //tạo view ejs


homeController(app);
siginController(app);
callController(app)

chat(app);


app.post('/name', function(req, res) {
    // var process = spawm('python', ['./nhan-dien-khuon-mat/detect_face_video.py']);
    
    // process.stdout.on("data", (data) =>{
    //     console.log(data.toString())
    // })


    // PythonShell.run('./nhan-dien-khuon-mat/detect_face_video.py', null, function (err) {
    //     if (err) throw err;
    //     console.log('finished');
    // });

    PythonShell.run('./nhan-dien-khuon-mat/detect_face_video.py', null, function (err) {
        if (err) throw err;
        console.log('finished');
        res.send("ok")
    });
});
app.post('/recognition', function(req, res) {
    if (fs.existsSync(dir)) {
        console.log('Directory exists!');
        PythonShell.run('./nhan-dien-khuon-mat/recognitiondata.py', null, function (err) {
            if (err) throw err;
            console.log('finished');
            res.send("ok")
        });
    } else {
        console.log('Directory not found.');
        res.send("nofile")
    }
    


});

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: false }));
app.post('/auth', (req, res) => {
    var type = req.body.type; 
    // console.log(user)

    if (type == "failface")  {
        console.log("không đúng khuôn mặt")
        lockSystem();
        res.send('OK');
    } 

    if (type == "noface")  {
        console.log("không có khuôn mặt ")
        lockSystem();
        res.send('OK');
    } 
    
     // ALL GOOD
});



app.post('/detect_face', function(req, res) {
    res.render("detect_face");
})



const users = {}

io.on('connection', socket => {
    socket.on('user-connected', function(data) {
        users[data] = socket.id
        io.emit('user-connected', data)
    })

    //hiển thị nội dung tin nhán và lưu database
    socket.on('send-mes', function(data) {
        var check = `select * from chat where (idReceiver = ` + data.receiver + ` and idSender = ` + data.sender + `)
         or (idReceiver = ` + data.sender + ` and idSender = ` + data.receiver + `)`
        connection.query(check, (err, resultchat) => {
            if (err) {
                throw err
            }
            var socketId = users[data.receiver]
            io.to(socketId).emit('new-message', data)
            var date = new Date();
            var dateTime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
            if (resultchat.length == 0) {
                var addListChat = `Insert into chat (idReceiver, idSender, type, time)
                values (` + data.receiver + `, ` + data.sender + `, 'ok', '` + dateTime + `')`
                connection.query(addListChat, (err, result) => {
                    if (err) {
                        throw err;
                    }
                    var addchat = `Insert into chathistorys (idReceiver, idSender, message, idchat, time, date)
                    values (` + data.receiver + `, ` + data.sender + `, '` + data.message + `', 1, '` + data.time + `','` + data.date + `')`
                    connection.query(addchat, (err, resultchat) => {
                        if (err) {
                            throw err;
                        }
                    })

                })
            } else {
                var updateTime = `update chat set time = '` + dateTime + `' where (idReceiver = ` + data.receiver + ` and idSender = ` + data.sender + `)
                or (idReceiver = ` + data.sender + ` and idSender = ` + data.receiver + `)`
                connection.query(updateTime, (err, dataTime) => {
                    if (err) {

                    }
                    var addchat = `Insert into chathistorys (idReceiver, idSender, message, idchat, time, date)
                    values (` + data.receiver + `, ` + data.sender + `, '` + data.message + `', 1, '` + data.time + `','` + data.date + `')`
                    connection.query(addchat, (err, resultchat) => {
                        if (err) {
                            throw err;
                        }
                    })
                })
            }
        })

    })
    socket.on('send-image', function(data) {
        var socketId = users[data.receiver]
        io.to(socketId).emit('image', data)
    })

    socket.on("callInvite", data => {
        var socketId = users[data.receiver]
        io.to(socketId).emit('checkInvite', data)
    })
    socket.on('call1', (roomId, userId, idReceiver, idsender) => {
        io.to(users[idReceiver]).emit('viewcall', roomId, idReceiver, idsender)
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('join', userId)
    })

    socket.on('refuseInvite', (idreceiver, idsender) => {
        io.to(users[idsender]).emit('userRefuse', idreceiver, idsender)
    })



});


var storage = multer.diskStorage({
    destination: function(req, file, cb) {

        if (file.mimetype === "image/jpg" || file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
            cb(null, './public/image')
        } else {
            console.log("không phù hợp")
        }
    },
    filename: function(req, file, cb) {
        var nameImage = Date.now() + file.originalname
        cb(null, nameImage)
    }

})

var upload = multer({ storage: storage }).array("myfile")


var uploadanhdaidien = multer({ storage: storage }).array("fileanh")


app.post('/uploadanhdaidien', urlencodeParser, function(req, res) {


    uploadanhdaidien(req, res, function(err) {
        if (err) {
            throw err;
        }
        var iduser = req.body.idUser1;
        console.log(iduser)
        var nameimage = req.files[0].filename
        var updateimage = `update user set image = '` + nameimage + `' where id = ` + iduser + ``
        connection.query(updateimage, (err, result) => {
            if (err) {
                throw err
            }
            res.send('OK')
        })

    })
})
app.post('/upload', urlencodeParser, function(req, res) {


    upload(req, res, function(err) {
        if (err) {
            throw err;
        }
        var idReceiver = req.body.idReceiver;
        var idSender = req.body.idSender;
        var date = req.body.date;
        var time = req.body.time;

        if (req.files.length == 1) {


            var check = `select * from chat where (idReceiver = ` + idReceiver + ` and idSender = ` + idSender + `)
            or (idReceiver = ` + idSender + ` and idSender = ` + idReceiver + `)`
            connection.query(check, (err, resultchat) => {
                if (err) {
                    throw err
                }
                var date1 = new Date();
                var dateTime = date1.getFullYear() + '-' + (date1.getMonth() + 1) + '-' + date1.getDate() + " " + date1.getHours() + ":" + date1.getMinutes() + ":" + date1.getSeconds()
                if (resultchat.length == 0) {
                    var addListChat = `Insert into chat (idReceiver, idSender, type, time)
                    values (` + idReceiver + `, ` + idSender + `, 'ok', '` + dateTime + `')`
                    connection.query(addListChat, (err, result) => {
                        if (err) {
                            throw err;
                        }
                        var arr = []
                        for (var i = 0; i < req.files.length; i++) {
                            var nameImage = req.files[i].filename
                            var obj = {
                                name: nameImage,
                                sender: idSender,
                                receiver: idReceiver
                            }
                            arr.push(obj)
                            var sql = `Insert into chathistorys (idReceiver, idSender, message, idchat, time, date)
                            values (` + idReceiver + `, ` + idSender + `, '` + nameImage + `', 1, '` + time + `','` + date + `')`
                            connection.query(sql, function(err, result) {
                                if (err) {
                                    throw err;
                                }
                            })
                        }
                        res.send(arr)
                    })
                } else {
                    var updateTime = `update chat set time = '` + dateTime + `' where (idReceiver = ` + idReceiver + ` and idSender = ` + idSender + `)
                    or (idReceiver = ` + idSender + ` and idSender = ` + idReceiver + `)`
                    connection.query(updateTime, (err, dataTime) => {
                        if (err) {

                        }
                        var arr = []
                        for (var i = 0; i < req.files.length; i++) {
                            var nameImage = req.files[i].filename
                            var obj = {
                                name: nameImage,
                                sender: idSender,
                                receiver: idReceiver
                            }
                            arr.push(obj)
                            var sql = `Insert into chathistorys (idReceiver, idSender, message, idchat, time, date)
                            values (` + idReceiver + `, ` + idSender + `, '` + nameImage + `', 1, '` + time + `','` + date + `')`
                            connection.query(sql, function(err, result) {
                                if (err) {
                                    throw err;
                                }
                            })
                        }
                        res.send(arr)
                    })
                }
            })
        } else {
            for (var j = 0; j < 1; j++) {
                var idReceiver1 = idReceiver[j];
                var idSender1 = idSender[j]
                var date2 = date[j]
                var time2 = time[j]

                var check = `select * from chat where (idReceiver = ` + idReceiver1 + ` and idSender = ` + idSender1 + `)
                or (idReceiver = ` + idSender1 + ` and idSender = ` + idReceiver1 + `)`
                connection.query(check, (err, resultchat) => {
                    if (err) {
                        throw err
                    }
                    var date1 = new Date();
                    var dateTime = date1.getFullYear() + '-' + (date1.getMonth() + 1) + '-' + date1.getDate() + " " + date1.getHours() + ":" + date1.getMinutes() + ":" + date1.getSeconds()
                    if (resultchat.length == 0) {
                        var addListChat = `Insert into chat (idReceiver, idSender, type, time)
                        values (` + idReceiver1 + `, ` + idSender1 + `, 'ok', '` + dateTime + `')`
                        connection.query(addListChat, (err, result) => {
                            if (err) {
                                throw err;
                            }
                            var arr = []
                            for (var i = 0; i < req.files.length; i++) {
                                var nameImage = req.files[i].filename
                                var obj = {
                                    name: nameImage,
                                    sender: idSender1,
                                    receiver: idReceiver1
                                }
                                arr.push(obj)
                                var sql = `Insert into chathistorys (idReceiver, idSender, message, idchat, time, date)
                                values (` + idReceiver1 + `, ` + idSender1 + `, '` + nameImage + `', 1, '` + time2 + `','` + date2 + `')`
                                connection.query(sql, function(err, result) {
                                    if (err) {
                                        throw err;
                                    }
                                })
                            }
                            res.send(arr)
                        })
                    } else {
                        var updateTime = `update chat set time = '` + dateTime + `' where (idReceiver = ` + idReceiver1 + ` and idSender = ` + idSender1 + `)
                        or (idReceiver = ` + idSender1 + ` and idSender = ` + idReceiver1 + `)`
                        connection.query(updateTime, (err, dataTime) => {
                            if (err) {

                            }
                            var arr = []
                            for (var i = 0; i < req.files.length; i++) {
                                var nameImage = req.files[i].filename
                                var obj = {
                                    name: nameImage,
                                    sender: idSender1,
                                    receiver: idReceiver
                                }
                                arr.push(obj)
                                var sql = `Insert into chathistorys (idReceiver, idSender, message, idchat, time, date)
                                values (` + idReceiver1 + `, ` + idSender1 + `, '` + nameImage + `', 1, '` + time2 + `','` + date2 + `')`
                                connection.query(sql, function(err, result) {
                                    if (err) {
                                        throw err;
                                    }
                                })
                            }
                            res.send(arr)
                        })
                    }
                })

            }
        }
    })
})

//server đang lắng nghe các request
server.listen(port, function() {
    console.log("server is listening on port: ", port);
});