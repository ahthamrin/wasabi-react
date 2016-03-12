module.exports = (app, mydata, socketIO) => {

  var _ = require('lodash');


	var slides = mydata.slides = {
	  'group4': [ 
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
    ]
	};

	app.get('/slides/:slideDeckId', function(req, res) {
	    res.contentType('json');
	    var s = slides[req.params.slideDeckId];
      console.log(s);
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
        mydata.db.insertOne({cmd: 'slideUpdate/'+socket.mydata.slideDeckId, msg: msg, timestamp: (new Date()), user: socket.mydata.user}, function() {
          console.log(arguments);
        });
      }
    });

    socket.on('hi', function(msg) {
        socketIO.to(socket.mydata.slideRoom)
        .emit('hi', msg);
         mydata.db.insertOne({cmd: 'slideUpdate/'+socket.mydata.slideDeckId, msg: msg, timestamp: (new Date()), user: socket.mydata.user}, function() {
          console.log(arguments);
        });
    })

    socket.on('AskQuestion', function(msg) {
      console.log('AskQuestion', msg);
        socketIO.to(socket.mydata.slideRoom)
        .emit('AskQuestion', msg);
         mydata.db.insertOne({cmd: 'AskQuestion', msg: msg, timestamp: (new Date()), user: socket.mydata.user}, function() {
          console.log(arguments);
        });
    })

    socket.on('AlertTeacher', function(msg) {
        socketIO.to(socket.mydata.slideRoom)
        .emit('AlertTeacher', msg);
         mydata.db.insertOne({cmd: 'AlertTeacher', msg: msg, timestamp: (new Date()), user: socket.mydata.user}, function() {
          console.log(arguments);
        });
    })

    socket.on('ReplyQuestion', function(msg) {
        socketIO.to(socket.mydata.slideRoom)
        .emit('ReplyQuestion', msg);
         mydata.db.insertOne({cmd: 'ReplyQuestion', msg: msg, timestamp: (new Date()), user: socket.mydata.user}, function() {
          console.log(arguments);
        });
    })
    
   });


}