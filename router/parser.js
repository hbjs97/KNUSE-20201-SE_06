var express = require('express');
var router = express.Router();
var PythonShell = require('python-shell');
var options ={
    mode: 'text',
    pythonPath: '',
    pythonOptions: '',
    scriptPath: '',
    args: ['']
};


router.get('/',function (req,res) {
    res.render('login.html');
    console.log('get');

});

console.log('db connect!');
router.post('/', function (req, res) {
    var userID = req.body.userid;
    var userPW = req.body.password;
    options.args[0] = userID;
    options.args[1] = userPW;
    var test = options.args[0];

    mariaDB.query('select * from Users where id=? and password=?',[userID, userPW], function (err, rows) {
        if (!err){
            if (rows[0]!=undefined){

                console.log('success');
                console.log(test);
                console.log(options.args[1]);
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