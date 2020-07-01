var express = require('express');
var router = express.Router();
var mariaDB = require('./mariadbConn');
var passport = require('passport');
router.get('/',function (req,res) {
    res.render('login.html');
    console.log('get');

});

console.log('db connect!');
router.post('/', function (req, res) {
    var yesID = req.body.yesID;
    var yesPW = req.body.yesPW;
    var userPW = req.body.userPW;

    mariaDB.query('insert into Users (id, password) values (?, ?)',[yesID, userPW], function (err, rows) {
        if (!err){
            if (rows[0]!=undefined){
                res.render('index.html');

            }
            else{
                console.log('no data');
            }
        }
        else{
            console.log('err: '+ err);
        }
    });

});
module.exports = router;