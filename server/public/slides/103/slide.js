module.exports = (app, mydata, socketIO) => {

  var _ = require('lodash');


	var slides = mydata.slides = {
	  '100': [ 
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
    });

    socket.on('unsubSlide', function(msg) {
      socketIO.emit('unsubSlide', msg);
      socket.leave(socket.mydata.slideRoom);
      socket.mydata.slideRoom = null;
      socket.mydata.slideDeckId = null;
    });
    
    socket.on('pushLocalSlide', function(msg) {
      if (socket.mydata.slideRoom && socket.mydata.user.role === 'lecturer') {
        socket.mydata.slideNo = msg.slideNo;

        socketIO.to(socket.mydata.slideRoom)
        .emit('slideUpdate/'+socket.mydata.slideDeckId,{slideNoLecturer: msg.slideNoLocal, username: socket.mydata.user.username});
      }
    });
  });


}