module.exports = (app, mydata, socketIO) => {

  var _ = require('lodash')
    , fs = require('fs')
    , cv = require('opencv/lib/opencv')
    , async = require('async')
    ;

  socketIO
  .on('connection', function(socket) {
    socket.mydata = {};

    var session = socket.handshake.session;

    socket.on('update', function(msg) {
      msg.timestamp = (new Date()).toISOString();
      console.log(msg);
    });

    socket.on('pushCaptureSave', function(msg) {
      if (msg.jpg && msg.jpg.length > 4000) {
        // console.log(msg);
        // var tmpFilename = '/tmp/'+msg.user.username+msg.jpg.length+'.jpg';
        var tmpFilename;
        try {
          tmpFilename = '/Users/husni/Documents/Learn/face-data/'+msg.username +'-'+((new Date()).getTime())+'.jpg';
        } catch (e) {
          tmpFilename = '/tmp/image-' +msg.jpg.length+'.jpg';
        }
        var jpgData = new Buffer(msg.jpg);
        fs.writeFile(tmpFilename, jpgData, function(err) {
          if (err)
          console.log('error write', msg, err);
        });
      }
      else {
        console.log('no jpg', msg);
      }
    });

    socket.on('pushCapture', function(msg) {

    });


     socket.on('class/img', function(msg) {
        try {
        async.waterfall([
          function writeFile(callback) {
            if (msg.jpg && msg.jpg.length) {
              // console.log(msg);
              // var tmpFilename = '/tmp/'+msg.user.username+msg.jpg.length+'.jpg';
              if (socket.mydata.lecturerSocket)
                socketIO.to(socket.mydata.lecturerSocket)
                .emit('slideUpdate/'+socket.mydata.slideDeckId,{slideNoLecturer: msg.slideNoLocal, username: socket.mydata.user.username});
              
              // mydata.db.insertOne({cmd: 'face-data', msg: msg, timestamp: (new Date()), user: socket.mydata.user});
              // console.log('force error', msg.jpg.length)
              // callback(1); // force error
              // return;

              var tmpFilename;
              try {
                tmpFilename = '/tmp/'+( socket.mydata.user.username ? socket.mydata.user.username : 'user-') +msg.jpg.length+'.jpg';
              } catch (e) {
                tmpFilename = '/tmp/image-' +msg.jpg.length+'.jpg';
              }
              var jpgData = new Buffer(msg.jpg.replace(/.+base64,/,''), 'base64');
              fs.writeFile(tmpFilename, jpgData, function(err) {
                if (err)
                  tmpFilename = null;
                callback(err, tmpFilename);
                if (err) return;
              });
            }
            else {
              console.log('no jpg', msg);
              callback('err', null);
              if (err) return;
            }
          },
          function readImage(tmpFilename, callback) {
              // console.log('readImage',tmpFilename);
            cv.readImage(tmpFilename, function(err, im) {
              if (err)
                callback(err,tmpFilename);
              if (err) return;
              if (im.width() < 1 || im.height < 1)
                callback(im, tmpFilename);
              callback(null, tmpFilename, im);
            });
          },
          function detectObject(tmpFilename, im, callback) {
               console.log('detectObject',tmpFilename, im);
               // callback(1);
               // return;
           im.detectObject(cv.FACE_CASCADE, {}, function(err, faces) {
              console.log('faces',err, faces);
              if (faces && faces.length) {
                msg.faces = faces;
                msg.jpg = msg.jpg.length;
                mydata.db.insertOne({cmd: 'face-count', msg: msg, timestamp: (new Date()), user: socket.mydata.user});
              }
              callback(err, tmpFilename);
            });
          }
        ], function(err, result) {
          if (err)
            console.log('face error', err, result);
          if (result) {
            fs.unlink(result, function(err) {
              if (err)
                console.log('unlink err', err, result);
            })
          }
          msg.jpg = msg.jpg.length;
          // console.log('receive vid capture', msg);
          socket.emit('rtc-vidcap-reply',msg);
          delete msg.jpg;
        });
      }
      catch(e) { console.log('rtc-vidcap err',e); }

    });


  });
}