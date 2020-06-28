var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mariaDB = require('./mariadbConn');
//mariaDB.connect();
router.get('/',function (req,res) {
    res.render('login.html');
    console.log('get');

});

console.log('db connect!');

router.post('/', function (req, res) {
    var userID = req.body.userid;
    var userPW = req.body.password;
    console.log(mariaDB.query('select * from Users where id=? and password=?',[userID, userPW], function (err, rows, fields) {
        if (!err){
            if (rows[0]!=undefined){
                console.log('success');
                console.log('id : '+ rows[0]['id']);
                console.log('pw : '+ rows[0]['id']);
            }
            else{
                console.log('no data');
            }
        }
        else{
            console.log('err: '+ err);
        }

    }));

    res.render('about.html');


});
/*
router.get('/', function(req, res){
    res.render('login.html');
    console.log('get');


    /*
    var userID = req.body[userID];
    var userPW = req.body[userPW];
    mariaDB.query('select * from Users where id=? and pw=?',[userID, userPW], function (err, rows, fields) {
        if(!err){
            if(rows[0]!=undefined){
                console.log('success');
                res.send('id: '+ rows[0]['id']+'<br>'+
                'pw :' + rows[0]['pw']);
            }
            else{
                res.send('no data');
            }
        }
        else{
            res.send('error : '+ err);
        }

    });
});

*/
//mariaDB.end();
module.exports = router;