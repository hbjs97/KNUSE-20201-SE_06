//main router

module.exports = function(app, fs) {
    var mariaDB = require('./mariadbConn');

    var PythonShell = require('python-shell');


    app.get('/', function (req, res) {
        if(!req.session.displayName){
            res.render('index.html');
        }
        else{
            res.render('faq.html');
        }
    });
    app.get('/register', function (req, res) {
        if(!req.session.displayName){
            res.render('register.html');
        }
        else{
            res.render('faqplus.html');
        }
    });
    app.post('/register', function (req, res) {
        var yesID = req.body.userID;
        var yesPW = req.body.userPW;
        var password = req.body.userPW;
        var options ={
            mode: 'text',
            pythonPath: '',
            pythonOptions: '-u',
            scriptPath: '',
            args: []
        };
        options.args[0] = yesID;
        options.args[1] = yesPW;
        options.args[2] = password;

        mariaDB.query('insert into \`Users\` (\`id\`, \`password\`) values (?, ?)',[yesID, password], function (err, rows) {
            if (!err){
                if (rows[0]!=undefined){
                    console.log(yesID);
                    console.log(password);
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
        res.render('index.html');
    });
    app.get('/faq', function (req, res) {
        if(!req.session.displayName){
            res.render('index.html');
        }
        else{
            res.render('faq.html');
        }
    });
    app.get('/about', function (req, res){
        if(!req.session.displayName){
            res.render('index.html');
        }
        else{
            res.render('about.html');
        }
    });
    app.get('/forgot', function (req, res) {
        if(!req.session.displayName){
            res.render('index.html');
        }
        else{
            res.render('forgot.html');
        }
    });
    app.get('/logout', function (req, res) {
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
    app.get('/password', function (req, res) {
        res.render('password.html');
    });
    /*app.get('/calculator', function (req, res){
        if(!req.session.displayName){
            res.render('index.html');
        }
        else{
            res.render('calculator.ejs',);
        }
    })*/
}