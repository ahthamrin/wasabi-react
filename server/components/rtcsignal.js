var kurento = require('kurento-client')
    , uuid = require('node-uuid')
    , async = require('async')
    ;

var wsUri = 'wss://lo.jaringan.info:8443/kurento';

var kurentoClient = null;

function getKurentoClient(callback) {
    if (kurentoClient !== null) {
        return callback(null, kurentoClient);
    }

    kurento(argv.ws_uri, function(error, _kurentoClient) {
        if (error) {
            console.log("Could not find media server at address " + argv.ws_uri);
            return callback("Could not find media server at address" + argv.ws_uri
                    + ". Exiting with error " + error);
        }

        kurentoClient = _kurentoClient;
        callback(null, kurentoClient);
    });
}

module.exports = (app, mydata, socketIO) => {

  io = mydata.io;
  var rtcData = mydata.rtcdata = {}

  socketIO.on('connection', function (socket) {
    socket.mydata = {};

    socket.on('joinClass', function(msg) {
      socket.mydata.user = msg.user;
      socket.mydata.classId = msg.classId;
      socket.mydata.iceCandidates = [];

      rtcData[msg.classId] = rtcData[msg.classId] || {};

      async.waterfall([
        function(cb) {
          getKurentoClient(cb);
        },
        function(kc, cb) { //media pipeline
          if (rtcData[msg.classId].pipeline)
            cb(rtcData[msg.classId].pipeline)
          else
            kc.create('MediaPipeline', function(err, pipeline) {
              if (err)
                cb(err);
              rtcData[msg.classId].pipeline = pipeline;
              cb(null, pipeline);
            })
        },
        function(pipeline, cb) { // media element
          pipeline.create('WebRtcEndpoint', function(err, ep) {
            if (err)
              cb(err);

            socket.mydata.endPoint = ep;

            while (socket.mydata.iceCandidates.length) {
              var candidate = socket.mydata.iceCandidates.shift();
              ep.addIceCandidate(candidate);
            }

            ep.on('OnIceCandidate', function(event) {
              var candidate = kurento.register.complexTypes.IceCandidate(event.candidate);
              socket.emit('iceCandidate', candidate);
            });

            ep.gatherCandidates(function(err) {
              if (err) {
                stop(socket);
                cb(err);
              }
            })

            ep.processOffer(msg.sdpOffer, function(err, sdpAnswer) {
              if (err) {
                stop(socket);
                cb(err);
              }
              cb(null, sdpAnswer);
            })
          })
        }
        ], function(err, sdpAnswer) {
          var resMsg = {};
          if (err) {
            resMsg.status = 'rejected';
            resMsg.error =  err;
          }
          else {
            resMsg.status = 'accepted';
            resMsg.sdpAnswer = sdpAnswer;
          }
        });
      }); // joinClass

      socket.on('onIceCandidate', function(msg) {
        if (socket.mydata.endPoint) {
          socket.mydata.endPoint.addIceCandidate(msg.candidate);
        }
        else {
          socket.mydata.iceCandidates.push(candidate);
        }
      });
      
      socket.on('leaveClass', function() {
        stop(socket);
      });

      socket.on('disconnect', function() {
        stop(socket);
      })
      
      socket.on('message', function(msg) {

      });

    });
};

function stop(socket) {
  try {
    socket.mydata.ep.release();
  }
  catch(e) {
    
  }
}

function safeCb(cb) {
    if (typeof cb === 'function') {
        return cb;
    } else {
        return function () {};
    }
}
