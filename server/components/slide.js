module.exports = (app, mydata, socketIO) => {


  var _ = require('lodash')
    , fs = require('fs')
    , cv = require('opencv/lib/opencv')
    , async = require('async')
    ;


	var slides = mydata.slides = {
	  '100': [ 
      {
      slideId: 12340,
      slideNo: 0,
      title: 'Wasabi 1',
      url: 'ws1.jpg',
      urlThumb: 'ws1-thumb.jpg'
      },
      {
      slideId: 12341,
      slideNo: 1,
      title: 'Wasabi 2',
      url: 'ws2.jpg',
      urlThumb: 'ws2-thumb.jpg'
      },
      {
      slideId: 12342,
      slideNo: 2,
      title: 'Wasabi 3',
      url: 'ws3.jpg',
      urlThumb: 'ws3-thumb.jpg'
      },
      {
      slideId: 12343,
      slideNo: 3,
      title: 'Wasabi 4',
      url: 'ws4.jpg',
      urlThumb: 'ws4-thumb.jpg'
      },
      {
      slideId: 12344,
      slideNo: 4,
      title: 'Wasabi 5',
      url: 'ws5.jpg',
      urlThumb: 'ws5-thumb.jpg'
      }
    ]
	};

	app.get('/slides/:slideDeckId', function(req, res) {
	    res.contentType('json');
	    var s = slides[req.params.slideDeckId];
	    res.json({slideDeckData: s, slideDeckLength: s.length});
	});

	socketIO
  .on('connection', function(socket) {
    socket.mydata = socket.mydata || {};

    socket.on('subSlide', function(msg) {
      socketIO.emit('subSlide', msg);

      socket.mydata.user = msg.user;
      socket.mydata.slideRoom = 'slideDeckId/'+msg.slideDeckId;
      socket.mydata.slideDeckId = msg.slideDeckId;

      socket.join(socket.mydata.slideRoom);
      if (socket.mydata.slideRoom && socket.mydata.user.role !== 'lecturer') {
        // socket.emit('slideUpdate/'+socket.mydata.slideDeckId,{slideNo: msg.slideNo, username: socket.mydata.user.username});
      }
      mydata.db.insertOne({cmd: 'subSlide/'+socket.mydata.slideDeckId, msg: msg, timestamp: (new Date()), user: socket.mydata.user})
    });

    socket.on('unsubSlide', function(msg) {
      socketIO.emit('unsubSlide', msg);
      socket.leave(socket.mydata.slideRoom);
      socket.mydata.slideRoom = null;
      socket.mydata.slideDeckId = null;

      mydata.db.insertOne({cmd: 'subSlide/'+socket.mydata.slideDeckId, msg: msg, timestamp: (new Date()), user: socket.mydata.user})
    });
    
    socket.on('pushLocalSlide', function(msg) {
      if (socket.mydata.slideRoom && socket.mydata.user.role === 'lecturer') {
        socket.mydata.slideNo = msg.slideNo;

        socketIO.to(socket.mydata.slideRoom)
        .emit('slideUpdate/'+socket.mydata.slideDeckId,{slideNoLecturer: msg.slideNoLocal, username: socket.mydata.user.username});
      }
        mydata.db.insertOne({cmd: 'slideUpdate/'+socket.mydata.slideDeckId, msg: msg, timestamp: (new Date()), user: socket.mydata.user}, function() {
        });
          // console.log(arguments);
    });

/*
    socket.on('hi', function(msg) {
        socketIO.to(socket.mydata.slideRoom)
        .emit('hi', msg);
         mydata.db.insertOne({cmd: 'slideUpdate/'+socket.mydata.slideDeckId, msg: msg, timestamp: (new Date()), user: socket.mydata.user}, function() {
          console.log(arguments);
        });
    })
*/

    socket.on('AskQuestion', function(msg) {
      console.log('AskQuestion', msg);
        socketIO.to(socket.mydata.slideRoom)
        .emit('AskQuestion', msg);
         mydata.db.insertOne({cmd: 'AskQuestion', msg: msg, timestamp: (new Date()), user: socket.mydata.user}, function() {
        });
    })

    socket.on('AlertTeacher', function(msg) {
        socketIO.to(socket.mydata.slideRoom)
        .emit('AlertTeacher', msg);
         mydata.db.insertOne({cmd: 'AlertTeacher', msg: msg, timestamp: (new Date()), user: socket.mydata.user}, function() {
         //           if (err)
         // console.log(arguments);
        });
    })

    socket.on('ReplyQuestion', function(msg) {
        socketIO.to(socket.mydata.slideRoom)
        .emit('ReplyQuestion', msg);
         mydata.db.insertOne({cmd: 'ReplyQuestion', msg: msg, timestamp: (new Date()), user: socket.mydata.user}, function() {
          //         if (err)
          // console.log(arguments);
        });
    })

//================================================================================>> This is Changed
  socket.on('pushQuizQuestion', function(msg) {
//    if (socket.mydata.slideRoom && socket.mydata.user.role === 'student') {
        socketIO.to(socket.mydata.slideRoom)
        .emit('pushQuizQuestion', msg);
         mydata.db.insertOne({cmd: 'ReplyQuestion', msg: msg, timestamp: (new Date()), user: socket.mydata.user}, function() {
        });
//    }
    })
  socket.on('pushQuizAnswer', function(msg) {
//    if (socket.mydata.slideRoom && socket.mydata.user.role === 'student') {
        socketIO.to(socket.mydata.slideRoom)
        .emit('pushQuizAnswer', msg);
         mydata.db.insertOne({cmd: 'ReplyQuestion', msg: msg, timestamp: (new Date()), user: socket.mydata.user}, function() {
        //           if (err)
        //   console.log(arguments);
        });
//    }
    })
//================================================================================>


     socket.on('class/img', function(msg) {
        try {
        async.waterfall([
          function writeFile(callback) {
            if (msg.jpg.length) {
              // console.log(msg);
              // var tmpFilename = '/tmp/'+msg.user.username+msg.jpg.length+'.jpg';
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
              });
            }
            else
              callback('err', null);
          },
          function readImage(tmpFilename, callback) {
            cv.readImage(tmpFilename, function(err, im) {
              if (err)
                callback(err,tmpFilename);
              if (im.width() < 1 || im.height < 1)
                callback(im, tmpFilename);
              callback(null, tmpFilename, im);
            });
          },
          function detectObject(tmpFilename, im, callback) {
            im.detectObject(cv.FACE_CASCADE, {}, function(err, faces) {
              // console.log('faces',faces);
              if (faces && faces.length) {
                msg.faces = faces;
                msg.jpg = msg.jpg.length;
                mydata.db.insertOne({cmd: 'face-count', msg: msg, timestamp: (new Date()), user: socket.mydata.user});
              }
              callback(err, tmpFilename);
            });
          }
        ], function(err, result) {
          if (result) {
            // fs.unlink(result, function(err) {
            //   if (err)
            //     console.log('unlink err', err, result);
            // })
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