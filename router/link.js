//메인화면에서 넘겨줄때, db에서 조회해서 표시해줌.

//login시, db 조회하여서 로그인 확인하는 모듈..

module.exports = function(app){
    var express = require('express');
    var router = express.Router();
    var mariaDB = require('./mariadbConn');
    var mySQL = require('mariadb');
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
            res.render('index.html');
        }
        else{
            res.render('faqplus.html');
        }
    })
    app.get('/link/about', function(req, res){
        if(!req.session.displayName){
            res.render('index.html');
        }
        else{
            res.render('about.html');
        }
    })
    app.get('/link/logout', function (req, res) {
        if(!req.session.displayName){
            res.render('index.html');
        }
        else{
            req.session.destroy(function (err) { //세션 파괴
                console.log(err);
            })
            res.render('index.html');
        }
    });
    app.get('/link/faq', function(req, res){
        if(!req.session.displayName){
            res.render('index.html');
        }
        else{
            res.render('faq.html');
        }
    })
    app.get('/link/parsinglogin', function (req, res) {
        if(!req.session.displayName){
            res.render('index.html');
        }
        else{
            res.render('parsinglogin2.ejs');
        }
    })
    app.get('/link/graduate', function (req, res) {
        if(!req.session.displayName){
            res.render('index.html');
        }
        else{
            var sql1 = 'select sub_name, subject, score, grade from '+req.session.displayName;
            mariaDB.query(sql1, function (err, rows, fields) {
                if (!err){
                    if (rows[0]!=undefined){
                        /*
                        var value2 = rows[0][0]['sum(score)']; //총 이수학점
                        var value4 = rows[1][0]['sum(score)'];//공학학점
                        var value6 = rows[2][0]['sum(score)']; //전공기반
                        var value8 = rows[3][0]['sum(score)']; //교양
                        var value1 = rows[4][0]['total'];
                        var value3 = rows[5][0]['engineering'];
                        var value5 = rows[6][0]['major'];
                        var value7 = rows[7][0]['basic'];*/
                        console.log(rows);
                        console.log(JSON.stringify(rows));
                        value = JSON.stringify(rows);
                        res.render('graduate.ejs',{
                            results: value,
                            results2: rows
                        });
                    }
                    else{
                        console.log('no data');
                    }
                }
                else{
                    console.log('err: '+ err);
                }
            });
        }
    })
    app.get('/link/calculator', function (req, res) {
        if(!req.session.displayName){
            res.render('index.html');
        }
        else{
            res.render('calculator.ejs');
        }
    })
    app.post('/parsinglogin', function (req, res) {

        var userID = req.body.userid;
        var userPW = req.body.password;
        options.args[0] = userID;
        options.args[1] = userPW;
        PythonShell.PythonShell.run('/home/node/app/parser.py', options, function(err, result){
            if(err)
                console.log(err);
        });
        res.render('faqplus.html');

    })
    app.get('/link/score', function (req, res) {

        if(!req.session.displayName){
            res.render('index.html');
        }
        else{
            var sql1 = 'select sum(score) from '+req.session.displayName +';' +
                'select sum(score) from '+req.session.displayName+' where subject=?;' +
                'select sum(score) from '+req.session.displayName+' where subject=?;' +
                'select sum(score) from '+req.session.displayName+' where subject=? or subject =?;' +
                'select total from requirement where department=?;' +
                'select engineering from requirement where department=?;' +
                'select major from requirement where department=?;' +
                'select basic from requirement where department=?;';


            mariaDB.query(sql1,['공학전공', '전공기반', '기본소양', '교양', 5550, 5550, 5550, 5550], function (err, rows, fields) {
                if (!err){
                    if (rows[0]!=undefined){
                        var value2 = rows[0][0]['sum(score)']; //총 이수학점
                        var value4 = rows[1][0]['sum(score)'];//공학학점
                        var value6 = rows[2][0]['sum(score)']; //전공기반
                        var value8 = rows[3][0]['sum(score)']; //교양
                        var value1 = rows[4][0]['total'];
                        var value3 = rows[5][0]['engineering'];
                        var value5 = rows[6][0]['major'];
                        var value7 = rows[7][0]['basic'];

                        res.render('score.ejs',{
                            results1: value1,
                            results2: value2, //이수학점
                            results3: value3,
                            results4: value4, //공학
                            results5: value5,
                            results6: value6, //전공기반
                            results7: value7,
                            results8: value8 //교양
                        });
                    }
                    else{
                        console.log('no data');
                    }
                }
                else{
                    console.log('err: '+ err);
                    res.render('score.ejs');
                }
            });
        }
    })
    app.get('/link/status', function (req, res) {
        if(!req.session.displayName){
            res.render('index.html');
        }
        else{
            console.log(req.session.displayName);

            //mariaDB.query()
            res.render('status.ejs');
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
