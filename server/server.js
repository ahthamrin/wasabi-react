
/**
 * Module dependencies.
 */

var http = require('http');
var https = require('https');
var express = require('express');
var cors = require('cors');
var path = require('path');

// var favicon = require('serve-favicon');
var logger = require('morgan');
var methodOverride = require('method-override');
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var errorHandler = require('errorhandler');

var app = express();


var io = require('socket.io');
var fs = require('fs');
var _ = require('lodash');

var 
    uuid = require('node-uuid'),
    crypto = require('crypto')
    ;

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/eba';

var publicDir = 'public';
var publicDirPath = path.join(__dirname, publicDir);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(cors());
app.options('*', cors()); // include before other routes
app.use(methodOverride());
app.use(session({ resave: true,
                  saveUninitialized: true,
                  secret: 'uwotm8' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(multer());
app.use(express.static(publicDirPath));

// error handling middleware should be loaded after the loading the routes
if ('development' == app.get('env')) {
  app.use(errorHandler());
}

var httpsOptions = {
    key: fs.readFileSync(path.join(__dirname,'https-key/lo.jaringan.info/privkey1.pem')),
    cert: fs.readFileSync(path.join(__dirname,'https-key/lo.jaringan.info/cert1.pem'))
} 
var server = https.createServer(httpsOptions, app);
// var server = http.createServer(app);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var sio = io.listen(server);

app.mydata = {}; // to store data
app.mydata = {io: sio, };
MongoClient.connect(url, function (err, db) {
	if (err) {
		console.log('mongodb err');
	}
	app.mydata.db = db.collection('experiment');
});

var userHandler = require('./components/user.js');
var userIO = sio.of('/user');
userHandler(app, app.mydata, userIO);

var slideHandler = require('./components/slide.js');
var slideIO = sio.of('/slide');
slideHandler(app, app.mydata, slideIO);

var chatHandler = require('./components/chat.js');
var chatIO = sio.of('/chat');
chatHandler(app, app.mydata, chatIO);

var logHandler = require('./components/log.js');
var logIO = sio.of('/log');
logHandler(app, app.mydata, logIO);

var rtcSignal = require('./components/rtcsignal.js');
var rtcIO = sio.of('/rtc');
rtcSignal(app, app.mydata, rtcIO);
