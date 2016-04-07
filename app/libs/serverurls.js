import io from 'socket.io-client';

var hostname = window.location.hostname;
var portNo = window.location.port;

// var ioHostUri = '//'+hostname+':3000/';
// var httpHostUri = '//'+hostname+':3000/';
var ioHostUri = '//'+hostname+':'+portNo+'/';
var httpHostUri = '//'+hostname+':'+portNo+'/';

var _liveClassIO;

export default {

  liveClassIO:
  io.connect(ioHostUri+'liveclass',
  {transports: [
    'websocket', 
    'polling',
    'xhr-polling', 
    'jsonp-polling', 
    'flashsocket', 
    'htmlfile'
      ],
      reconnection: false
  })
  ,
  slideIO: 
  io.connect(ioHostUri+'slide',
  {transports: [
    'websocket', 
    'polling',
    'xhr-polling', 
    'jsonp-polling', 
    'flashsocket', 
    'htmlfile'
  ]})
  ,
  userIO:
  io.connect(ioHostUri+'user',
    { transports: [
      'websocket', 
      'polling',
      'xhr-polling', 
      'jsonp-polling', 
      'flashsocket', 
      'htmlfile'
      ],
      reconnection: false
  })
  ,
  rtcIO:
  io.connect(ioHostUri+'rtc',
    { transports: [
      'websocket', 
      'polling',
      'xhr-polling', 
      'jsonp-polling', 
      'flashsocket', 
      'htmlfile'
      ],
      reconnection: false
  })
  ,
  logIO:
  io.connect(ioHostUri+'log',
  {transports: [
    'websocket', 
    'polling',
    'xhr-polling', 
    'jsonp-polling', 
    'flashsocket', 
    'htmlfile'
  ]})
  ,
  slidesUrl: httpHostUri+'slides/',
  slideDeckUrl: httpHostUri+'slide-deck/',
  emit: function (thisIO, {cmd,msg}) {
    thisIO.emit(cmd,msg);
  }
  ,
  send: function(thisIO, cmd,msg) {
    thisIO.emit(cmd,msg);
  }
  ,
  fetch: function(thisIO, cmd) {
    return new Promise((resolve, reject) => {
      thisIO.once(cmd, (msg) => {
        console.log('io fetch', cmd, msg);
        resolve(msg);
      });
    });
  }
}