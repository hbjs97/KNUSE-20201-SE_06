//login시, db 조회하여서 로그인 확인하는 모듈..


var express = require('express');
var router = express.Router();
var mariaDB = require('./mariadbConn');
var session = require('express-session');
var mySQLStore = require('express-mysql-session');
var hour = 3600000;


router.get('/',function (req,res) {

    if(!req.session.displayName){
        res.render('login.html');
    }
    else{
        var userID = 'ungmo2';
        var userPW = '1234';
        mariaDB.query('select * from Users where id=? and password=?',[userID, userPW], function (err, rows, result) {
            if (!err){
                if (rows[0]!=undefined){
                    res.render('calculator.ejs', {
                        results: JSON.stringify(rows)
                    })
                    console.log(result);

                }
                else{
                    console.log('no data');
                }
            }
            else{
                console.log('err: '+ err);
            }
        });
        //res.render('calculator.html');
    }
});
router.post('/', function (req, res){
    if(!req.session.displayName){
        res.render('login.html');
    }
    else{
        res.render('calculator.ejs');
    }
})
module.exports = router;

