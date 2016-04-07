
/**
 * Module dependencies.
 */

var config = require('config')
  , http = require('http')
  , https = require('https')
  , express = require('express')
  , cors = require('cors')
  , path = require('path')

//   , favicon = require('serve-favicon')
  , logger = require('morgan')
  , methodOverride = require('method-override')
  , session = require('express-session')
  , sharedsession = require('express-socket.io-session')
  , bodyParser = require('body-parser')
  , multer = require('multer')
  , errorHandler = require('errorhandler')

  , app = express()

  , io = require('socket.io')
  , fs = require('fs')
  , _ = require('lodash')

  , uuid = require('node-uuid')
  , crypto = require('crypto')
  , MongoClient = require('mongodb').MongoClient
  , assert = require('assert')
  , ObjectId = require('mongodb').ObjectID
  , url = 'mongodb://'+config.get('Db.hostname')+':'+config.get('Db.port')+'/'+config.get('Db.name')
  , publicDir = 'public'
  , publicDirPath = path.join(__dirname, publicDir)
  ;

// all environments
app.mydata = {config: config};
app.set('port', config.get('Server.port') || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(cors());
app.options('*', cors()); // include before other routes
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(multer());

var thisSession = session({ resave: true,
                  saveUninitialized: true,
                  secret: 'uwotm8' });
app.use(thisSession);

app.get('/', function(req, res, next) {
  console.log(req.session);
  next();
});

app.use('/', express.static(path.join(__dirname, config.get('Path.build'))));
app.use('/slides', express.static(path.join(__dirname, config.get('Path.slides'))));

var server;
if ('mba' === process.env.TARGET) {
  console.log('repl.jaringan.info');
  // xxx user this for husni mba
  var httpsOptions = {

      key: fs.readFileSync(path.join('/Users/husni/Documents/Learn/letsencrypt/live/repl.jaringan.info/privkey.pem')),
      cert: fs.readFileSync(path.join('/Users/husni/Documents/Learn/letsencrypt/live/repl.jaringan.info/cert.pem'))
  }
  server = https.createServer(httpsOptions, app);
} else
if ('development' == app.get('env')) {
  // error handling middleware should be loaded after the loading the routes
  app.use(errorHandler());
  server = http.createServer(app);
}
else {
  var httpsOptions = {
      // XXX use this for running at eba.jaringan.info
      key: fs.readFileSync(path.join(__dirname,'https-key/lo.jaringan.info/privkey1.pem')),
      cert: fs.readFileSync(path.join(__dirname,'https-key/lo.jaringan.info/cert1.pem'))
      // XXX use this for running at xps1.jaringan.info
      // key: fs.readFileSync('/etc/letsencrypt/live/xps1.jaringan.info/privkey.pem'),
      // cert: fs.readFileSync('/etc/letsencrypt/live/xps1.jaringan.info/cert.pem')
  }
  server = https.createServer(httpsOptions, app);
}

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var sio = io.listen(server);
app.mydata.io = sio;

MongoClient.connect(url, function (err, db) {
	if (err) {
		console.log('mongodb err');
	}
	app.mydata.db = db.collection('experiment');
});

var userHandler = require('./components/user.js');
var userIO = sio.of('/user').use(sharedsession(thisSession, { autoSave: true}));
userHandler(app, app.mydata, userIO);

var slideHandler = require('./components/slide.js');
var slideIO = sio.of('/liveclass').use(sharedsession(thisSession, { autoSave: true}));
slideHandler(app, app.mydata, slideIO);

var chatHandler = require('./components/chat.js');
var chatIO = sio.of('/chat').use(sharedsession(thisSession, { autoSave: true}));
chatHandler(app, app.mydata, chatIO);

var logHandler = require('./components/log.js');
var logIO = sio.of('/log').use(sharedsession(thisSession, { autoSave: true}));
logHandler(app, app.mydata, logIO);

var rtcSignal = require('./components/rtcsignal.js');
var rtcIO = sio.of('/rtc').use(sharedsession(thisSession, { autoSave: true}));
rtcSignal(app, app.mydata, rtcIO);
