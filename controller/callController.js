var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var urlencodeParser = bodyParser.urlencoded({ extended: false });
var session = require('express-session');
var flash = require('connect-flash');
var check = require('../middleware/checksSgin');
var connection = require('./db');
var { v4: uuidV4 } = require('uuid')
module.exports = function(app) {
    app.get('/room&idreceiver=:id&idsender=:id1', function(req, res, next) {
        var idreceiver = req.params.id
        var idsender = req.params.id1
        res.redirect(`/room&id=${uuidV4()}&idreceiver=${idreceiver}&idsender=${idsender}`)
    })

    app.get('/room&id=:id&idreceiver=:id2&idsender=:id3', urlencodeParser, function(req, res, next) {
        res.render('call', { roomId: req.params.id, idreceiver: req.params.id2, idsender: req.params.id3 })
    })

    app.post('/namereceiver', urlencodeParser, (req, res, next) => {
        var idreceiver = req.body.id

        var getName = `select * from user where id = ` + idreceiver + ``
        connection.query(getName, (err, result) => {
            if (err) {
                throw err
            }
            res.send(result)

        })
    })
}