module.exports = function(app)
{
    app.get('/',function(req,res){
        res.render('index.html')
    });
    app.get('/register',function(req,res){
        res.render('register.html');
    });
    app.get('/login',function(req,res){
        res.render('login.html');
    });
    app.get('/forgot',function(req,res){
        res.render('forgot.html');
    });
    app.get('/password',function(req,res){
        res.render('password.html');
    });
}