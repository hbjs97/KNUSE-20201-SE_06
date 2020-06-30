var mysql = require('mysql');
var pool = mysql.createConnection({
    host: 'lunapreya.ddns.net',
    port: 3307,
    user: 'software',
    password: '1q2w3e4r!',
    database: 'hbjs',
    connectionLimit: 100,
    multipleStatements: true
});
console.log('dbconn');
module.exports = pool;

