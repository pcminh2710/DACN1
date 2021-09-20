var mysql = require('mysql');

console.log("Dang connect")

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'doan4',
    multipleStatements: true
});

connection.connect(
    function(err){
        if(err) throw err;
        console.log("Thanh Cong")
    }
);
module.exports = connection;