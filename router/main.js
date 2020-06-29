module.exports = function(app, fs) {
    app.get('/', function (req, res) {
        res.render('index.html')
    });
    app.get('/register', function (req, res) {
        res.render('register.html');
    });
    app.get('/faq', function (req, res) {
        res.render('faq.html');
    });
    /*
    app.post('/login', function (req, res) {
        console.log(req.body.userid);
       // console.log('in');
        res.render('about.html');




    });*/
    app.get('/about', function (req, res){
        res.render('about.html');
    });
    app.get('/forgot', function (req, res) {
        res.render('forgot.html');
    });
    app.get('/password', function (req, res) {
        res.render('password.html');
    });
}