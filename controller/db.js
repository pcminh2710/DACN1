var mysql = require('mysql');



var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'doan4',
    multipleStatements: true
});

connection.connect();
module.exports = connection;