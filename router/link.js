//메인화면에서 넘겨줄때, db에서 조회해서 표시해줌.

//login시, db 조회하여서 로그인 확인하는 모듈..

module.exports = function(app){
    var express = require('express');
    var router = express.Router();
    var mariaDB = require('./mariadbConn');
    var session = require('express-session');
    var mySQLStore = require('express-mysql-session');
    var hour = 3600000;
    var PythonShell = require('python-shell');
    var options ={
        mode: 'text',
        pythonPath: '',
        pythonOptions: '-u',
        scriptPath: '',
        args: []
    };

    app.get('/link', function(req, res){
        if(!req.session.displayName){
            res.render('login.html');
        }
        else{
            res.render('faqplus.html');
        }
    })
    app.get('/link/about', function(req, res){
        if(!req.session.displayName){
            res.render('login.html');
        }
        else{
            res.render('about.html');
        }
    })
    app.get('/link/faq', function(req, res){
        if(!req.session.displayName){
            res.render('login.html');
        }
        else{
            res.render('faq.html');
        }
    })
    app.get('/link/parsinglogin', function (req, res) {
        if(!req.session.displayName){
            res.render('login.html');
        }
        else{
            res.render('parsinglogin2.ejs');
        }
    })
    app.post('/parsinglogin', function (req, res) {
        if(!req.session.displayName){
            res.render('login.html');
        }
        else{
            var userID = req.body.userid;
            var userPW = req.body.password;
            options.args[0] = userID;
            options.args[1] = userPW;
            PythonShell.PythonShell.run('/home/node/app/parser.py', options, function(err, result){
                if(err)
                    console.log(err);
            });
            res.render('faqplus.html');
        }
    })
    app.get('/link/score', function (req, res) {
        if(!req.session.displayName){
            res.render('login.html');
        }
        else{
            console.log(req.session.displayName);

            //mariaDB.query()
            res.render('score.ejs');
        }
    })



    /*
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
                        res.render('calculator.ejs', {
                            results: JSON.stringify(rows)
                        })
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

    */
    return router;
}
