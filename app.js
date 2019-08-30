var express = require('express');
var path = require('path');
var http = require('http');
var logger = require('morgan');

var ejs = require('ejs');

var app = express();
var router = express.Router();


// 视图引擎设置
app.engine('html',ejs.__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
// app.set("view cache",true);
// 2.注册html模板引擎：


app.use(logger('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));



router.get('/', function(req, res, next) {
  res.render('index',{
    title:'server is started'
  });
})

var port=5010;
var server=http.createServer(app);
    server.listen(port);
var io = require('socket.io')(server);
app.use('/', router);
app.use('/api', require('./interface/route')(io));

io.on('connection', function (socket) {
    console.log('链接成功。。。。。。。。。' );
});

server.on('error', function(error){
  if (error.syscall !== 'listen') {
    throw error;
  }
  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }

});

server.on('listening', function(){
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  logger('Listening on ' + bind);
});
