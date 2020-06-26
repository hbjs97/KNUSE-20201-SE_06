var express = require('express');
var app = express();
var router = require('./router/main')(app);

app.use(express.static(__dirname+'/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

var server = app.listen(7890, function(){
    console.log("Express server has started on port 7890")
});

var http = require('http');

