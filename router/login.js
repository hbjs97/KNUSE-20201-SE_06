var express = require('express');
var router = express.Router();
var mariaDB = require('./mariadbConn');
router.get('/',function (req,res) {
    res.render('login.html');
    console.log('get');
});
router.post('/', function (req, res) {
    var userID = req.body.userid;
    var userPW = req.body.password;
    mariaDB.query('select * from Users where id=? and password=?',[userID, userPW], function (err, rows) {
        if (!err){
            if (rows[0]!=undefined){
                console.log('success');
                console.log('id : '+ rows[0]['id']);
                console.log('pw : '+ rows[0]['password']);
            }
            else{
                console.log('no data');
            }
        }
        else{
            console.log('err: '+ err);
        }
    });
    res.render('calculator.html');
});
module.exports = router;