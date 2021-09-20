var bodyParser = require('body-parser'); // đọc request của người dùng
var session = require('express-session');
var flash = require('connect-flash');
const { json } = require('body-parser');
var md5 = require('md5');
var connection = require('./db');
const e = require('express');


var urlencodeParser = bodyParser.urlencoded({ extended: false }); // đọc requesst của người dùng theo kiểu form
var parserJson = bodyParser.json();




module.exports = function(app) {
    app.use(session({
        secret: 'secret',
        cookie: { maxAge: 60000 },
        resave: false,
        saveUninitialized: false
    }));
    app.use(flash());

    app.get('/dangnhap', function(req, res) {
        if (req.cookies.user != null) {
            res.redirect('/index');
        } else {
            var sql = "select phone from user";
            connection.query(sql, function(err, result) {
                if (err) {
                    throw err;
                }
                res.render("sigIn", { data: JSON.stringify(result), message: req.flash('user') });
            });
        }


    });

    app.post('/xulydangnhap', urlencodeParser, function(req, res) {
        var username = req.body.username;
        var pass = req.body.password;
        var hashPass = md5(pass);
        var sql = "select * from user where phone = '" + username + "' and password = '" + hashPass + "'";
        connection.query(sql, function(err, result) {
            if (err) {
                throw err;
            }
            if (result.length > 0) {
                res.cookie('user', [result[0].name, result[0].id, result[0].image]);
                req.flash('userSigin', "bạn đã đăng nhập thành công");
                res.redirect('/index');
            } else {
                req.flash('user', 'tài khoản đăng nhập không chính xác!');
                res.redirect('/dangnhap');
            }
        });

    });

    app.post('/xulydangky', urlencodeParser, function(req, res) {
        var surname = req.body.surname;
        var name = req.body.name;
        var phone = req.body.phone;
        var password = req.body.password;
        var hashPass = md5(password);
        var birthday = req.body.date;
        var gender = req.body.gender;
        var date = new Date();
        //ngày user tạo tài khoản
        var startdate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

        if (surname == null || name == null || phone == null || password == null || birthday == null || gender == null || startdate == null) {
            res.redirect('/index');
        } else {
            var sqlcheckphone = "select * from user where phone = '" + phone + "'";
            connection.query(sqlcheckphone, function(err, result) {
                if (err) {
                    throw err;
                }
                if (result.length > 0) {
                    res.redirect("/index");
                } else {
                    //thêm người dùng
                    var sql = "insert into user(surname, name, phone, password, gender, startdate, image, birthday) values ('" + surname + "' , '" + name + "', '" + phone + "', '" + hashPass + "', '" + gender + "', '" + startdate + "', '', '" + birthday + "')";
                    connection.query(sql, function(err, resull) {
                        if (err) {
                            throw err;
                        }
                        //thêm xong lấy dữ liệu người dùng ra lại bằng phone vừa đăng ký
                        var data = "select * from user where phone = '" + phone + "'";
                        connection.query(data, function(err, resultdata) {
                            if (err) {
                                throw err;
                            }
                            //tạo cookeie với name và id của người dùng.
                            res.cookie('user', [resultdata[0].name, resultdata[0].id, resultdata[0].image]);
                            req.flash('userSigin', "bạn đã đăng ký thành công");
                            res.redirect("/index");
                        });
                    });

                }
            });
        }







    });

}