var kurento = require('kurento-client')
    , uuid = require('node-uuid')
    , async = require('async')
    , wsUri = ''
    , kurentoClient = null
    ;

function getKurentoClient(callback) {
    if (kurentoClient !== null) {
        return callback(null, kurentoClient);
    }

    kurento(wsUri, function(error, _kurentoClient) {
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
  var rtcData = mydata.rtcdata = {};
  wsUri = 'ws://'+mydata.config.get('Kurento.hostname')+':'+mydata.config.get('Kurento.port')+'/'+mydata.config.get('Kurento.path');

  socketIO.on('connection', function (socket) {
    socket.mydata = {};
    socket.mydata.iceCandidates = [];

    var session = socket.handshake.session;

    socket.on('connectRtc', function(msg) {

      socket.mydata.user = msg.user;
      socket.mydata.classId = msg.classId;

      rtcData[msg.classId] = rtcData[msg.classId] || {};

      async.waterfall([ // start sequential process

      function createClient(cb) {
        getKurentoClient(cb);
      },

      function createMediaPipelineAndDispatcher(kc, cb) {

        if (rtcData[socket.mydata.classId].pipeline)
          cb(null, rtcData[socket.mydata.classId].pipeline)
        else
          kc.create('MediaPipeline', function(err, pipeline) {
            if (err) {
              try {
                rtcData[socket.mydata.classId].pipeline.release();
              } catch(e) {}
              delete rtcData[socket.mydata.classId].pipeline;
              cb(err);
              return;
            }
            rtcData[socket.mydata.classId].pipeline = pipeline;

            // create dispatcher one to many
            if (rtcData[socket.mydata.classId].dispatcherOtm)
              cb(null, pipeline);
            else
              pipeline.create('DispatcherOneToMany', function(err, otm) {
                if (err) {
                  delete rtcData[socket.mydata.classId].dispatcherOtm;
                  cb(err);
                  return;
                }
                rtcData[socket.mydata.classId].dispatcherOtm = otm;
                cb(null, pipeline);
              });
          })
      },

      // function createDispatcherOneToMany(pipeline, cb) {
      //   if (rtcData[socket.mydata.classId].dispatcherOtm)
      //     cb(null, pipeline);
      //   else
      //     pipeline.create('DispatcherOneToMany', function(err, otm) {
      //       if (err) {
      //         cb(err);
      //         return;
      //       }
      //       rtcData[socket.mydata.classId].dispatcherOtm = otm;
      //       cb(null, pipeline);
      //     });
      // },

      function createWebRtcEndpoint(pipeline, cb) {
        console.log('create WebRtcEndpoint');
        pipeline.create('WebRtcEndpoint', function(err, ep) {
          if (err) {
            cb(err);
            return;
          }
          socket.mydata.endPoint = ep;
          while (socket.mydata.iceCandidates.length) {
            var candidate = socket.mydata.iceCandidates.shift();
            ep.addIceCandidate(candidate);
          }

          ep.on('OnIceCandidate', function(event) {
            var candidate = kurento.register.complexTypes.IceCandidate(event.candidate);
            socket.emit('iceCandidate', {candidate:candidate});
          });

          ep.processOffer(msg.sdpOffer, function(err, sdpAnswer) {
            if (err) {
              stop(socket);
              cb(err);
              return;
            }
            cb(null, sdpAnswer);
          });
          ep.gatherCandidates(function(err) {
            if (err) {
              stop(socket);
              cb(err);
            }
          });
        });
      },

      function connectEndPointToDispatcher(sdpAnswer, cb) {
       console.log('connectEndPointToDispatcher');
       socket.mydata.sdpAnswer = sdpAnswer;

        // connect to DispatcherOneToMany
        try {
          rtcData[socket.mydata.classId].pipeline
          .create('HubPort', {hub: rtcData[socket.mydata.classId].dispatcherOtm}, function(err, hp) {
            if (err) {
              console.log('error create HubPort', err, rtcData[socket.mydata.classId].dispatcherOtm);
              stop(socket);
              cb(err);
              return;
            }
            socket.mydata.hubPort = hp;
            if (socket.mydata.user.role === 'lecturer') {
              socket.mydata.endPoint.connect(hp, function(err) {
                if (err) {
                  console.log('error connect lecturer to HubPort', err, hp);
                  stop(socket);
                  cb(err);
                  return;
                }
                rtcData[socket.mydata.classId].dispatcherOtm.setSource(hp);
              })
            }
            else {
              hp.connect(socket.mydata.endPoint, function(err) {
                if (err) {
                  console.log('error connect student to HubPort', err, hp);
                  stop(socket);
                  cb(err);
                  return;
                }
              });
            }
            cb(null)
          });

        }
        catch(err) {
          cb(err);
        }
      },

      ], // end sequential process

      // final of async.waterfall
      function(err) {
        console.log('kurento',err);
        var resMsg = {};
        if (err) {
          resMsg.status = 'rejected';
          resMsg.error =  err;
        }
        else {
          resMsg.status = 'accepted';
          resMsg.sdpAnswer = socket.mydata.sdpAnswer;
        }
        socket.emit('connectRtc', resMsg);
      }
      ); // async.waterfall


    }); // connectRtc

    socket.on('onIceCandidate', function(msg) {
      var candidate = kurento.register.complexTypes.IceCandidate(msg.candidate);
      if (socket.mydata.endPoint) {
        socket.mydata.endPoint.addIceCandidate(candidate);
      }
      else {
        socket.mydata.iceCandidates.push(candidate);
      }
    });
    
    socket.on('disconnectRtc', function() {
      stop(socket);
    });

    socket.on('disconnect', function() {
      stop(socket);
    })
    
    socket.on('message', function(msg) {

    });

  });

  function stop(socket) {
    console.log('releasing ep', socket.mydata.endPoint);
    try {
      socket.mydata.hubPort.release(function(err) {
        console.log('hubport release', err);
      });
    }
    catch(err) {
      console.log('cannot release hubport',err);
    }
    try {
      socket.mydata.endPoint.release(function(err) {
        console.log('ep release', err);
      });
    }
    catch(err) {
      console.log('cannot release ep',err);
    }
  }
};

function safeCb(cb) {
    if (typeof cb === 'function') {
        return cb;
    } else {
        return function () {};
    }
}
