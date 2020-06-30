//main router

module.exports = function(app, fs) {

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
            res.render('faq.html');
        }
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