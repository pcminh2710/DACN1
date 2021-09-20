var bodyParser = require('body-parser');
var urlencodeParser = bodyParser.urlencoded({ extended: false });
var parserJson = bodyParser.json();




var connection = require('./db');

module.exports = function(app) {

    app.post('/receiver', urlencodeParser, function(req, res, next) {
        var id = req.body.userId;
        var sql = "select * from user where id = '" + id + "'";
        connection.query(sql, function(err, result) {
            if (err) {
                throw err;
            }
            res.send(result);
            // res.redirect('index' + 1)
        })
    })


    //trả vè firend trong bảng user
    app.post('/friend', urlencodeParser, function(req, res, next) {
        var id = req.body.userId;
        var sql = "select friend from user where id = '" + id + "'";
        connection.query(sql, function(err, result) {
            if (err) {
                throw err;
            }
            res.send(result);
        })
    })

    //trả về trạng thái friend trong bảng friend
    app.post('/checkFriend', urlencodeParser, function(req, res, next) {
        var idSender = req.body.idSender;
        var idReceiver = req.body.idReceiver;

        var sql = "select * from friend where (idSender = '" + idSender + "' and idReceiver = '" + idReceiver + "') or (idSender = '" + idReceiver + "' and idReceiver = '" + idSender + "')";
        connection.query(sql, function(err, result) {
            if (err) {
                throw err;
            }
            res.send(result);
        })
    })

    //add Friend
    app.post('/addFriend', urlencodeParser, function(req, res, next) {
        var idSender = req.body.idUser;
        var idReceiver = req.body.idReceiver;

        var sqlFriend = `select * from user where id = ` + idSender + ` ;
        select * from user where id = ` + idReceiver + ``
        connection.query(sqlFriend, (err, result) => {
            if (err) {
                throw err;
            }
            //lấy friend 
            var friendsSender = result[0][0].friend
            var friendsReceiver = result[1][0].friend

            //tạo chuổi friend mới
            var newFriendsSender = friendsSender + "," + idReceiver
            var newFriendsReceiver = friendsReceiver + "," + idSender

            //thêm chuổi friend mới trong database
            var sqlAdd = `update user set friend = '` + newFriendsSender + `' where id = ` + idSender + `; 
                                update user set friend = '` + newFriendsReceiver + `' where id = ` + idReceiver + ``;
            connection.query(sqlAdd, (err, result) => {
                if (err) {
                    throw err;
                }
                var date = new Date();
                var dateSend = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
                var addStatusFriend = `Insert into friend (idSender, idReceiver, status, day)
                     values (` + idSender + `, ` + idReceiver + `, 0, '` + dateSend + `')`
                connection.query(addStatusFriend, (err, result) => {
                    if (err) {
                        throw err;
                    }
                    res.send(true)
                })
            })
        })
    })


    //hủy lời mời kết bạn
    app.post('/cancelInvitation', urlencodeParser, function(req, res, next) {
        var idSender = req.body.idUser;
        var idReceiver = req.body.idReceiver;

        var sqlFriend = `select * from user where id = ` + idSender + ` ;
        select * from user where id = ` + idReceiver + ``
        connection.query(sqlFriend, (err, result) => {
            if (err) {
                throw err;
            }
            //lấy friend 
            var friendsSender = result[0][0].friend
            var friendsReceiver = result[1][0].friend

            //tạo mảng friend
            var arrFriendsSender = friendsSender.split(',')
            var arrFriendsReceiver = friendsReceiver.split(',')

            //Loại bỏ id người gởi trong mảng
            var new_arrSender = arrFriendsSender.filter(item => item !== idReceiver);
            var new_arrReceiver = arrFriendsReceiver.filter(item => item !== idSender);

            //biến mảng thành dạng String ban đầu
            var newFriendsSender = new_arrSender.join()
            var newFriendsReceiver = new_arrReceiver.join()

            //Cập nhật friends trong bảng user
            var updateFriend = `update user set friend = '` + newFriendsSender + `' where id = ` + idSender + `; 
             update user set friend = '` + newFriendsReceiver + `' where id = ` + idReceiver + ``;

            connection.query(updateFriend, (err, result) => {
                if (err) {
                    throw err;
                }

                //xóa trạng thái trong bảng friend
                var deleteStatus = `delete from friend where (idSender = ` + idSender + ` and idReceiver = ` + idReceiver + `)
                 or (idSender = ` + idReceiver + ` and idReceiver = ` + idSender + `)`
                connection.query(deleteStatus, (err, result) => {
                    if (err) {
                        throw err;
                    }
                    res.send(true)
                })
            })

        })

    })


    //chấp nhận lời mời kết bạn
    app.post('/confimInvitation', urlencodeParser, function(req, res, next) {
        var idSender = req.body.idUser;
        var idReceiver = req.body.idReceiver;

        //update trạng thái trong friend
        var updateStatus = `update friend set status = 1 where (idSender = ` + idSender + ` and idReceiver = ` + idReceiver + `)
        or (idSender = ` + idReceiver + ` and idReceiver = ` + idSender + `)`
        connection.query(updateStatus, (err, result) => {
            if (err) {
                throw err;
            }
            res.send(true)
        })
    })


    //hiển thị nội dung chat giữa 2 người
    app.post('/contentChat', urlencodeParser, function(req, res, next) {
        var idSender = req.body.idSender
        var idReceiver = req.body.idReceiver

        var getName = `select * from user where id = ` + idReceiver + ``
        connection.query(getName, (err, resultName) => {
            if (err) {
                throw err
            }
            var sqlChat = `select * from chathistorys 
            where (idReceiver = ` + idReceiver + ` and idSender = ` + idSender + `) 
            or (idReceiver = ` + idSender + ` and idSender = ` + idReceiver + `) `

            connection.query(sqlChat, (err, result) => {
                if (err) {
                    throw err;
                }
                var arr = [];
                if (result.length > 0) {
                    for (var i = 0; i < result.length; i++) {
                        var obj = {
                            name: resultName[0].name + " " + resultName[0].surname,
                            idSender: result[i].idSender,
                            idReceiver: result[i].idReceiver,
                            message: result[i].message,
                            time: result[i].time,
                            image: resultName[0].image
                        }
                        arr.push(obj)
                    }
                } else {
                    var obj = {
                        name: resultName[0].name + " " + resultName[0].surname,
                        idSender: "",
                        idReceiver: "",
                        message: "",
                        time: "",
                        image: ""
                    }
                    arr.push(obj)
                }
                res.send(arr)
            })
        })

    })


    //hiển thị listConversation
    app.post('/listConversation', urlencodeParser, function(req, res, next) {
        var idUser = req.body.idUser

        var getList = `select * from chat where idReceiver = ` + idUser + ` or idSender = ` + idUser + ` order by time DESC`
        connection.query(getList, (err, result) => {
            if (err) {
                throw err;
            }

            var arr = []
            for (var i = 0; i < result.length; i++) {
                if (result[i].idSender == idUser) {
                    var obj = {
                        idReceiver: result[i].idReceiver
                    }
                    arr.push(obj)
                } else {
                    var obj = {
                        idReceiver: result[i].idSender
                    }
                    arr.push(obj)
                }
            }

            res.send(arr)
        })
    })


    //getName conversation
    app.post('/getNameConversation', urlencodeParser, function(req, res, next) {
        var idUser = req.body.idUser
        var idReceiver = req.body.idReceiver

        var getName = `select * from user where id = ` + idReceiver + ``;
        connection.query(getName, (err, result) => {
            if (err) {
                throw err;
            }
            var getchat = `select * from chathistorys where (idReceiver = ` + idReceiver + ` and idSender = ` + idUser + `) 
            or (idReceiver = ` + idUser + ` and idSender = ` + idReceiver + `) order by id DESC limit 1`;
            connection.query(getchat, (err, resultchat) => {
                if (err) {
                    throw err
                }
                var arr = [];
                if (resultchat[0].idSender == idUser) {
                    var obj = {
                        name: result[0].name,
                        surname: result[0].surname,
                        message: "Bạn: " + resultchat[0].message,
                        image: result[0].image
                    }
                } else {
                    var obj = {
                        name: result[0].name,
                        surname: result[0].surname,
                        message: resultchat[0].message,
                        image: result[0].image
                    }
                }

                arr.push(obj)
                res.send(arr)
            })
        })
    })


    app.post('/imageShare', urlencodeParser, function(req, res, next) {
        var idSender = req.body.idSender
        var idReceiver = req.body.idReceiver

        var getImage = `select * from chathistorys where (idReceiver = ` + idReceiver + ` and idSender = ` + idSender + `) 
            or (idReceiver = ` + idSender + ` and idSender = ` + idReceiver + `) order by id DESC`;

        connection.query(getImage, function(err, result) {
            if (err) {
                throw err;
            }
            var arr = []
            for (var i = 0; i < result.length; i++) {
                var message = result[i].message
                if (message.includes(".png") || message.includes(".jpg")) {
                    var obj = {
                        image: result[i].message
                    }
                    arr.push(obj)
                }
            }
            res.send(arr)
        })

    })

}