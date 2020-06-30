//parsinglogin page에서 사용함.

var express = require('express');
var router = express.Router();
var PythonShell = require('python-shell');
var options ={
    mode: 'text',
    pythonPath: '',
    pythonOptions: '-u',
    scriptPath: '',
    args: []
};
router.get('/',function (req,res) {
    res.render('parsinglogin.ejs');
});

router.post('/', function (req, res) {
    var userID = req.body.userid;
    var userPW = req.body.password;
    options.args[0] = userID;
    options.args[1] = userPW;
    PythonShell.PythonShell.run('/home/node/app/parser.py', options, function(err, result){
        if(err)
            console.log(err);
    });


    res.render('faq.html');
});
module.exports = router;