module.exports = (app, mydata, socketIO) => {


  var _ = require('lodash')
    , fs = require('fs')
    , cv = require('opencv/lib/opencv')
    , async = require('async')
    , cancelPushCapture = 0
    , pushCaptureIdx = 0
    ;


	var slides = mydata.slides = {
    '100': (function() {
      var slideList = [];
      for (var i=0; i < 9; ++i) {
        slideList.push({
          slideId: 12340+i,
          slideNo: i,
          title: 'Wasabi '+i.toString(),
          url: 'ws'+i.toString()+'.jpg',
          urlThumb: 'ws'+i.toString()+'-thumb.jpg'          
        });
      }
      return slideList;
    })()
    ,
	  '110': [ 
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

  if (!mydata.classData)
    mydata.classData = {}
  var classData = mydata.classData;

	app.get('/slide-deck/:slideDeckId', function(req, res) {
	    res.contentType('json');
	    var s = slides[req.params.slideDeckId];
	    res.json({slideDeckData: s, slideDeckLength: s.length});
	});

	socketIO
  .on('connection', function(socket) {
    socket.mydata = socket.mydata || {};

    console.log('connected', socket.id, socket.handshake.session);

    var session = socket.handshake.session;

    socket.on('disconnect', function() {
      if (socket.mydata.user && socket.mydata.user.role === 'lecturer') {
        mydata.lecturerSocket = null;
      }
    })
    socket.on('joinClass', function(msg) {
      socket.emit('joinClass', msg);

      socket.mydata.user = msg.user;
      socket.mydata.classId = msg.classId;
      socket.mydata.classRoom = 'slideDeckId/'+msg.classId;
      socket.mydata.slideDeckId = msg.classId;

      if (!classData[socket.mydata.classId]) {
        classData[socket.mydata.classId] = {
          isLive: false,
          slideDeckId: msg.classId,
          slideNoLecturer: 0
        }
      }

      socket.emit('updateSlideDeck', {
        slideDeckData: slides[classData[socket.mydata.classId].slideDeckId],
        slideDeckLength: slides[classData[socket.mydata.classId].slideDeckId].length,
        slideNoLecturer: classData[socket.mydata.classId].slideNoLecturer
      });

      socket.join(socket.mydata.classRoom);
      if (socket.mydata.classRoom && socket.mydata.user.role !== 'lecturer') {
        // socket.emit('slideUpdate/'+socket.mydata.slideDeckId,{slideNo: msg.slideNo, username: socket.mydata.user.username});
     }
      mydata.db.insertOne({cmd: 'joinClass/'+socket.mydata.slideDeckId, msg: msg, timestamp: (new Date()), user: socket.mydata.user});
      if (socket.mydata.user && socket.mydata.user.role === 'lecturer') {
        mydata.lecturerSocket = socket.id;
        classData[socket.mydata.classId].lecturer = socket.mydata.user;
        classData[socket.mydata.classId].lecturerSocket = socket.id;
 
        // testSendCaptures(socket.id);
      }

      console.log('joinClass', msg.user, session.user);
    });

    socket.on('leaveClass', function(msg) {
      socket.emit('leaveClass', msg);
      socket.leave(socket.mydata.classRoom);
      socket.mydata.classRoom = null;
      socket.mydata.slideDeckId = null;

      if (classData[socket.mydata.classId].lecturerSocket === socket.id) {
        classData[socket.mydata.classId].lecturerSocket = null;
        classData[socket.mydata.classId].lecturer = null;
      }

      clearTimeout(cancelPushCapture);

      mydata.db.insertOne({cmd: 'leaveClass/'+socket.mydata.slideDeckId, msg: msg, timestamp: (new Date()), user: socket.mydata.user})
    });
    
    socket.on('updateSlideNo', function(msg) {
      if (socket.mydata.classRoom && socket.mydata.user.role === 'lecturer') {
        socket.mydata.slideNo = msg.slideNo;
        classData[socket.mydata.classId].slideNoLecturer = msg.slideNo;
        socketIO.to(socket.mydata.classRoom)
        .emit('updateSlideNo',{slideNoLecturer: msg.slideNo, username: socket.mydata.user.username});
      }
        mydata.db.insertOne({cmd: 'slideUpdate/'+socket.mydata.slideDeckId, msg: msg, timestamp: (new Date()), user: socket.mydata.user}, function() {
        });
          // console.log(arguments);
    });

    socket.on('sendChat', function(msg) {
      if (socket.mydata.classRoom) {
        socketIO.to(socket.mydata.classRoom)
        .emit('sendChat', msg);
      }
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


   
  });

  function testSendCaptures(room) {
    var users = ['bob', 'charlie', 'dave'];

    pushCaptureIdx = ++pushCaptureIdx % 10;
    cancelPushCapture = setTimeout(function() {
      users.forEach(function(user) {
        setTimeout(function() {
          var jpgdata = fs.readFileSync('/Users/husni/Documents/Learn/face-data/'+user+'-'+(pushCaptureIdx+10)+'.jpg', 'utf-8');
          socketIO.to(room)
          .emit('updateCapture', {username: user, jpg: jpgdata, timestamp:((new Date()).getTime())});
        }, Math.random()*200);
      });

    process.nextTick(function() {
      testSendCaptures(room);
    });

    }, 1000+Math.random()*100);
  }

}