//express 서버 생성
var express = require('express');
var app = express();
//module 불러오기
var fs = require('fs');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
//var mysqlDB = require('./router/mariadbConn');

//HTML 위치 설정
app.set('views', __dirname + '/views');
//EJS엔진 사용
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
//css 사용, 콜백함수.
//현재위치+/public 을 static 폴더로 지정.
app.use(express.static(__dirname+'/public'));
var port = 7890;
app.listen(port, function(){
    console.log("Express server has started on port "+port);
});

var http = require('http');


app.use(express.static('public'));
//bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
var login = require('./router/login')(app);
app.use('/login', login);
//app.use('/login', require('./router/login'));
app.use('/parser', require('./router/parser'));
app.use(session({
    secret: '1q2w3e4r!$$',
    resave: false,
    saveUninitialized: true
}));
//router
var router = require('./router/main')(app,fs);