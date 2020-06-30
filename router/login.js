//login시, db 조회하여서 로그인 확인하는 모듈..

module.exports = function(app){
    var express = require('express');
    var router = express.Router();
    var mariaDB = require('./mariadbConn');
    var session = require('express-session');
    var mySQLStore = require('express-mysql-session');
    var hour = 3600000;

    app.use(session({
        secret:"$$$software",
        resave: false,
        saveUninitialized: true,
        cookie:{expires: new Date(Date.now()+hour)},
        store: new mySQLStore({
            host        : 'lunapreya.ddns.net',
            port        : 3307,
            user        : 'software',
            password    : '1q2w3e4r!',
            database    : 'hbjs'
        })
    }))
    router.get('/',function (req,res) {

        if(!req.session.displayName){
            res.render('login.html');
        }
        else{
            res.render('faq.html');
        }
    });
    router.post('/', function (req, res) {
        var userID = req.body.userid;
        var userPW = req.body.password;
        mariaDB.query('select * from Users where id=? and password=?',[userID, userPW], function (err, rows) {
            if (!err){
                if (rows[0]!=undefined){
                    req.session.displayName = rows[0].id;

                    req.session.save(function(){
                        res.render('faqplus.html')
                    })
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
        //res.render('calculator.html');
    });
    return router;
}
