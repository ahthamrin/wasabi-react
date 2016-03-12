import io from 'socket.io-client';

export default {

	slideIO: 
	io.connect('wss://lo.jaringan.info:3000/slide',
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
	io.connect('wss://lo.jaringan.info:3000/user',
  {transports: [
    'websocket', 
    'polling',
    'xhr-polling', 
    'jsonp-polling', 
    'flashsocket', 
    'htmlfile'
  ]})
  ,
	rtcIO:
	io.connect('wss://lo.jaringan.info:3000/rtc',
  {transports: [
    'websocket', 
    'polling',
    'xhr-polling', 
    'jsonp-polling', 
    'flashsocket', 
    'htmlfile'
  ]})
  ,
  slidesUrl: 'https://lo.jaringan.info:3000/slides/',
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