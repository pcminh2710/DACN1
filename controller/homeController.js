var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var urlencodeParser = bodyParser.urlencoded({ extended: false });
var session = require('express-session');
var flash = require('connect-flash');
var check = require('../middleware/checksSgin');
var connection = require('./db');
module.exports = function(app) {
    app.use(session({
        secret: 'secret',
        cookie: { maxAge: 60000 },
        resave: false,
        saveUninitialized: false
    }));

    app.use(flash());

    app.use(cookieParser());

    app.get('/index', function(req, res, next) {
        //1 là id của người mún gửi tin nhắn
        res.redirect('/index&messidfriend=' + 19)
    })

    app.get('/index&messidfriend=:id', function(req, res, next) {
        if (req.cookies.user != null) {
            var idFriend = req.params.id
            var keyUser = "Select id from user"
            connection.query(keyUser, (err, result) => {
                if (err) {
                    throw err;
                }
                var arr = []
                for (var i = 0; i < result.length; i++) {
                    arr.push(result[i].id + "")
                }
                var newArr = arr
                if (newArr.indexOf(idFriend) != -1) {
                    var sql = `select * from user where id = ` + idFriend + ``
                    connection.query(sql, (err, result) => {
                        if (err) {
                            throw err;
                        }
                        if (result.length > 0) {
                            res.render("index", {
                                user: req.cookies.user[0],
                                idReceiver: result[0].id,
                                status: "OK",
                                nameReceiver: result[0].name,
                                imageReceiver: result[0].image,
                                idUser: req.cookies.user[1],
                                message: req.flash('userSigin', "bạn đã đăng nhập thành công")
                            });
                        }
                    })

                } else {
                    res.render("index", {
                        user: req.cookies.user[0],
                        idUser: req.cookies.user[1],
                        idReceiver: "",
                        status: "",
                        nameReceiver: "",
                        imageReceiver: "",
                        message: req.flash('userSigin', "bạn đã đăng nhập thành công")
                    });
                }
            })


        } else {
            res.redirect('/dangnhap');
        }
    });

    function isANumber(str) {
        return !/\D/.test(str);
    }

    app.get('/search', function(req, res, next) {
        var regex = req.query["term"];
        if (isANumber(regex)) {
            var searchName = "select * from user where phone like '%" + regex + "%'";
            connection.query(searchName, function(err, result) {
                if (err) {
                    throw err;
                }
                var data = [];
                for (var i = 0; i < result.length; i++) {
                    var obj = {
                        name: result[i].name,
                        image: result[i].image,
                        id: result[i].id,
                        friend: result[i].friend
                    };
                    data.push(obj);
                }
                res.send(data, {
                    'Content-Type': 'application/json'
                }, 200);
            });
        } else {
            var searchName = "select * from user where name like '%" + regex + "%'";
            connection.query(searchName, function(err, result) {
                if (err) {
                    throw err;
                }
                var data = [];
                for (var i = 0; i < result.length; i++) {
                    var obj = {
                        name: result[i].name,
                        image: result[i].image,
                        id: result[i].id
                    };
                    data.push(obj);
                }
                res.send(data, {
                    'Content-Type': 'application/json'
                }, 200);

            });
        }
    });

}