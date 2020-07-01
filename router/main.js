//main router

module.exports = function(app, fs) {
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
        var yesID = req.body.yes_id;
        var yesPW = req.body.yes_password;
        var password = req.body.password;
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

        PythonShell.PythonShell.run('/home/node/app/parser.py', options, function(err, result){
            if(err)
                console.log(err);
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