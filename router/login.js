var express = require('express');
var router = express.Router();
var mariaDB = require('./mariadbConn');
var PythonShell = require('python-shell');
var options ={
    mode: 'text',
    pythonPath: '',
    pythonOptions: '',
    scriptPath: '',
    args: []
};
router.get('/',function (req,res) {
    res.render('login.html');
    console.log('get');

});

console.log('db connect!');
router.post('/', function (req, res) {
    options.args[0]= req.body.userid;
    options.args[1]= req.body.password;
    var userID = req.body.userid;
    var userPW = req.body.password;
    console.log(options.args[0]);
    console.log(options.args[1]);

    mariaDB.query('select * from Users where id=? and password=?',[userID, userPW], function (err, rows) {
        if (!err){
            if (rows[0]!=undefined){
                console.log('success');
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
    res.render('about.html');
});
module.exports = router;