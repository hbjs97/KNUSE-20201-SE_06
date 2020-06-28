var mdbConn = require('./mariadbConn.js');
var express = require('express');
var app = express();

mdbConn.getUserList()
    .then((rows) => {
        console.log(rows);
    })
    .catch((errMsg)=>{
        console.log(errMsg);
    });

