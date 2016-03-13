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
    ],
    '101':
    [
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
      urlThumb: 'ws,3-thumb.jpg'
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
      },
      {
      slideId: 12345,
      slideNo: 5,
      title: 'Wasabi 6',
      url: 'ws6.jpg',
      urlThumb: 'ws6-thumb.jpg'
      },
      {
      slideId: 12346,
      slideNo: 6,
      title: 'Wasabi 7',
      url: 'ws7.jpg',
      urlThumb: 'ws7-thumb.jpg'
      },
      {
      slideId: 12347,
      slideNo: 7,
      title: 'Wasabi 8',
      url: 'ws8.jpg',
      urlThumb: 'ws8-thumb.jpg'
      },
      {
      slideId: 12348,
      slideNo: 8,
      title: 'Wasabi 9',
      url: 'ws9.jpg',
      urlThumb: 'ws9-thumb.jpg'
      },
      {
      slideId: 12349,
      slideNo: 9,
      title: 'Wasabi 10',
      url: 'ws10.jpg',
      urlThumb: 'ws10-thumb.jpg'
      }
    ]

    ,
    '102': [
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
    ,
    '103': [
          {
      slideId: 12340,
      slideNo: 0,
      title: 'Slide1',
      url: 'Slide1.jpg',
      urlThumb: 'Slide1-thumb.jpg'
      },
      {
      slideId: 12341,
      slideNo: 1,
      title: 'Wasabi 2',
      url: 'Slide2.jpg',
      urlThumb: 'Slide2-thumb.jpg'
      },
      {
      slideId: 12342,
      slideNo: 2,
      title: 'Wasabi 3',
      url: 'Slide3.jpg',
      urlThumb: 'Slide3-thumb.jpg'
      },
      {
      slideId: 12343,
      slideNo: 3,
      title: 'Wasabi 4',
      url: 'Slide4.jpg',
      urlThumb: 'Slide4-thumb.jpg'
      },
      {
      slideId: 12344,
      slideNo: 4,
      title: 'Wasabi 5',
      url: 'Slide5.jpg',
      urlThumb: 'Slide5-thumb.jpg'
      },
      {
      slideId: 12345,
      slideNo: 5,
      title: 'Wasabi 6',
      url: 'Slide6.jpg',
      urlThumb: 'Slide6-thumb.jpg'
      },
      {
      slideId: 12346,
      slideNo: 6,
      title: 'Wasabi 7',
      url: 'Slide7.jpg',
      urlThumb: 'Slide7-thumb.jpg'
      },
      {
      slideId: 12347,
      slideNo: 7,
      title: 'Wasabi 8',
      url: 'Slide8.jpg',
      urlThumb: 'Slide8-thumb.jpg'
      },
      {
      slideId: 12348,
      slideNo: 8,
      title: 'Wasabi 9',
      url: 'Slide9.jpg',
      urlThumb: 'Slide9-thumb.jpg'
      },
      {
      slideId: 12349,
      slideNo: 9,
      title: 'Wasabi 10',
      url: 'Slide10.jpg',
      urlThumb: 'Slide10-thumb.jpg'
      },
      {
      slideId: 12350,
      slideNo: 10,
      title: 'Wasabi 11',
      url: 'Slide11.jpg',
      urlThumb: 'Slide11-thumb.jpg'
      },
      {
      slideId: 12351,
      slideNo: 11,
      title: 'Wasabi 12',
      url: 'Slide12.jpg',
      urlThumb: 'Slide12-thumb.jpg'
      },
      {
      slideId: 12352,
      slideNo: 12,
      title: 'Wasabi 13',
      url: 'Slide13.jpg',
      urlThumb: 'Slide13-thumb.jpg'
      }
    ],
    '104': [
      {
      slideId: 12340,
      slideNo: 0,
      title: 'Title',
      url: 'g4-slide01.jpg',
      urlThumb: 'thumb/g4-slide01.jpg'
      },
      {
      slideId: 12341,
      slideNo: 1,
      title: 'Wasabi 2',
      url: 'g4-slide02.jpg',
      urlThumb: 'thumb/g4-slide02.jpg'
      },
      {
      slideId: 12342,
      slideNo: 2,
      title: 'Wasabi 2',
      url: 'g4-slide03.jpg',
      urlThumb: 'thumb/g4-slide03.jpg'
      },
      {
      slideId: 12343,
      slideNo: 3,
      title: 'Wasabi 2',
      url: 'g4-slide04.jpg',
      urlThumb: 'thumb/g4-slide04.jpg'
      },
      {
      slideId: 12344,
      slideNo: 4,
      title: 'Wasabi 2',
      url: 'g4-slide05.jpg',
      urlThumb: 'thumb/g4-slide05.jpg'
      },
      {
      slideId: 12345,
      slideNo: 5,
      title: 'Wasabi 2',
      url: 'g4-slide06.jpg',
      urlThumb: 'thumb/g4-slide06.jpg'
      },
      {
      slideId: 12346,
      slideNo: 6,
      title: 'Wasabi 2',
      url: 'g4-slide07.jpg',
      urlThumb: 'thumb/g4-slide07.jpg'
      },
      {
      slideId: 12347,
      slideNo: 7,
      title: 'Wasabi 2',
      url: 'g4-slide08.jpg',
      urlThumb: 'thumb/g4-slide08.jpg'
      },
      {
      slideId: 12348,
      slideNo: 8,
      title: 'Wasabi 2',
      url: 'g4-slide09.jpg',
      urlThumb: 'thumb/g4-slide09.jpg'
      },
      {
      slideId: 12349,
      slideNo: 9,
      title: 'Wasabi 2',
      url: 'g4-slide10.jpg',
      urlThumb: 'thumb/g4-slide10.jpg'
      },
      {
      slideId: 12350,
      slideNo: 10,
      title: 'Wasabi 2',
      url: 'g4-slide11.jpg',
      urlThumb: 'thumb/g4-slide11.jpg'
      },
      {
      slideId: 12351,
      slideNo: 11,
      title: 'Wasabi 2',
      url: 'g4-slide12.jpg',
      urlThumb: 'thumb/g4-slide12.jpg'
      },
      {
      slideId: 12352,
      slideNo: 12,
      title: 'Wasabi 2',
      url: 'g4-slide13.jpg',
      urlThumb: 'thumb/g4-slide13.jpg'
      },
      {
      slideId: 12353,
      slideNo: 13,
      title: 'Wasabi 2',
      url: 'g4-slide14.jpg',
      urlThumb: 'thumb/g4-slide14.jpg'
      },
      {
      slideId: 12354,
      slideNo: 14,
      title: 'Wasabi 2',
      url: 'g4-slide15.jpg',
      urlThumb: 'thumb/g4-slide15.jpg'
      },
      {
      slideId: 12355,
      slideNo: 15,
      title: 'Wasabi 2',
      url: 'g4-slide16.jpg',
      urlThumb: 'thumb/g4-slide16.jpg'
      },
      {
      slideId: 12356,
      slideNo: 16,
      title: 'Wasabi 2',
      url: 'g4-slide17.jpg',
      urlThumb: 'thumb/g4-slide17.jpg'
      },
      {
      slideId: 12357,
      slideNo: 17,
      title: 'Wasabi 2',
      url: 'g4-slide18.jpg',
      urlThumb: 'thumb/g4-slide18.jpg'
      },
      {
      slideId: 12358,
      slideNo: 18,
      title: 'Wasabi 2',
      url: 'g4-slide19.jpg',
      urlThumb: 'thumb/g4-slide19.jpg'
      },
      {
      slideId: 12359,
      slideNo: 19,
      title: 'Wasabi 2',
      url: 'g4-slide20.jpg',
      urlThumb: 'thumb/g4-slide20.jpg'
      },
      {
      slideId: 12360,
      slideNo: 20,
      title: 'Wasabi 2',
      url: 'g4-slide21.jpg',
      urlThumb: 'thumb/g4-slide21.jpg'
      },
      {
      slideId: 12361,
      slideNo: 21,
      title: 'Wasabi 2',
      url: 'g4-slide22.jpg',
      urlThumb: 'thumb/g4-slide22.jpg'
      },
      {
      slideId: 12362,
      slideNo: 22,
      title: 'Wasabi 2',
      url: 'g4-slide23.jpg',
      urlThumb: 'thumb/g4-slide23.jpg'
      },
      {
      slideId: 12363,
      slideNo: 23,
      title: 'Wasabi 2',
      url: 'g4-slide24.jpg',
      urlThumb: 'thumb/g4-slide24.jpg'
      },
      {
      slideId: 12364,
      slideNo: 24,
      title: 'Wasabi 2',
      url: 'g4-slide25.jpg',
      urlThumb: 'thumb/g4-slide25.jpg'
      },
      {
      slideId: 12365,
      slideNo: 25,
      title: 'Wasabi 2',
      url: 'g4-slide26.jpg',
      urlThumb: 'thumb/g4-slide26.jpg'
      }
    ],
    '105': [
      {
      slideId: 12340,
      slideNo: 0,
      title: 'Origami 1',
      url: 'Slide1.JPG',
      urlThumb: 'ws1-thumb.jpg'
      },
      {
      slideId: 12341,
      slideNo: 1,
      title: 'Origami 2',
      url: 'Slide2.JPG',
      urlThumb: 'ws2-thumb.jpg'
      },
      {
      slideId: 12342,
      slideNo: 2,
      title: 'Origami 3',
      url: 'Slide3.JPG',
      urlThumb: 'ws3-thumb.jpg'
      },
      {
      slideId: 12343,
      slideNo: 3,
      title: 'Origami 4',
      url: 'Slide4.JPG',
      urlThumb: 'ws4-thumb.jpg'
      },
      {
      slideId: 12344,
      slideNo: 4,
      title: 'Origami 5',
      url: 'Slide5.JPG',
      urlThumb: 'ws5-thumb.jpg'
      },
      {
      slideId: 12345,
      slideNo: 0,
      title: 'Origami 6',
      url: 'Slide6.JPG',
      urlThumb: 'ws1-thumb.jpg'
      },
      {
      slideId: 12346,
      slideNo: 1,
      title: 'Origami 7',
      url: 'Slide7.JPG',
      urlThumb: 'ws2-thumb.jpg'
      },
      {
      slideId: 12347,
      slideNo: 2,
      title: 'Origami 8',
      url: 'Slide8.JPG',
      urlThumb: 'ws3-thumb.jpg'
      },
      {
      slideId: 12348,
      slideNo: 3,
      title: 'Origami 9',
      url: 'Slide9.JPG',
      urlThumb: 'ws4-thumb.jpg'
      },
      {
      slideId: 12349,
      slideNo: 4,
      title: 'Origami 10',
      url: 'Slide10.JPG',
      urlThumb: 'ws5-thumb.jpg'
      },
       {
      slideId: 12350,
      slideNo: 4,
      title: 'Origami 11',
      url: 'Slide11.JPG',
      urlThumb: 'ws5-thumb.jpg'
      },
       {
      slideId: 12351,
      slideNo: 4,
      title: 'Origami 12',
      url: 'Slide12.JPG',
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

    socket.on('disconnect', function() {
      if (socket.mydata.user && socket.mydata.user.role === 'lecturer') {
        mydata.lecturerSocket = null;
      }
    })
    socket.on('subSlide', function(msg) {
      socketIO.emit('subSlide', msg);

      socket.mydata.user = msg.user;
      socket.mydata.slideRoom = 'slideDeckId/'+msg.slideDeckId;
      socket.mydata.slideDeckId = msg.slideDeckId;

      socket.join(socket.mydata.slideRoom);
      if (socket.mydata.slideRoom && socket.mydata.user.role !== 'lecturer') {
        // socket.emit('slideUpdate/'+socket.mydata.slideDeckId,{slideNo: msg.slideNo, username: socket.mydata.user.username});
      }
      mydata.db.insertOne({cmd: 'subSlide/'+socket.mydata.slideDeckId, msg: msg, timestamp: (new Date()), user: socket.mydata.user});
      if (socket.mydata.user && socket.mydata.user.role === 'lecturer') {
        mydata.lecturerSocket = socket.id;
      }
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
            if (msg.jpg && msg.jpg.length) {
              // console.log(msg);
              // var tmpFilename = '/tmp/'+msg.user.username+msg.jpg.length+'.jpg';
              if (socket.mydata.lecturerSocket)
                socketIO.to(socket.mydata.lecturerSocket)
                .emit('slideUpdate/'+socket.mydata.slideDeckId,{slideNoLecturer: msg.slideNoLocal, username: socket.mydata.user.username});
              
              mydata.db.insertOne({cmd: 'face-data', msg: msg, timestamp: (new Date()), user: socket.mydata.user});
              console.log('force error', msg.jpg.length)
              callback(1); // force error
              return;

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
               callback(1);
               return;
           im.detectObject(cv.FACE_CASCADE, {}, function(err, faces) {
              console.log('faces',err, faces, msg);
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