var mongoose = require('mongoose');
var logger = require('morgan');
mongoose.connect('mongodb://localhost/wendao'); //连接到mongoDB的todo数据库


//该地址格式：mongodb://[username:password@]host:port/database[?options]
//默认port为27017

var db = mongoose.connection;
db.on('error', function callback() { //监听是否有异常
    console.log("Connection error");
}).once('open', function callback() { //监听一次打开
    //在这里创建你的模式和模型
    console.log('connected!');
}).on('connected', function () {
    console.log('Mongoose connection success ');
}).on('disconnected', function () {
    console.log('Mongoose connection disconnected');
});
module.exports = mongoose
