import uuid from 'node-uuid';
import alt from '../libs/alt';

import server from '../libs/serverurls';
import rtc from '../libs/rtc';
import kurento from 'kurento-utils';

import MediaActions from '../actions/MediaActions';

class MediaStore {
  constructor() {
    this.bindActions(MediaActions);

    this.localStream = null;
    this.remoteVideoEl = null;
    this.webRTC = null;
    this.remoteStream = null;
    this.remoteLecturer = null;

    this.studentCaptureTimestamp = 0;
    this.studentCaptureImages = [];
  }

  sendCapture({username, jpg}) {
    server.slideIO.emit('pushCapture', {username, jpg});
    // server.logIO.emit('pushCaptureSave', {username, jpg});
    this.preventDefault();
  }
  startReceiveCapture() {
    server.slideIO.on('pushCapture', ({username, jpg, timestamp}) => {
      var foundImage = false;
      var currentTime = (new Date()).getTime();
      var captureImages = this.studentCaptureImages.filter((image) => {
        if (image.timestamp < currentTime - 10000) // remove stale image > 10 seconds
          return false;
        if (image.username === username) {
          image.timestamp = currentTime;
          image.jpg = jpg;
          foundImage = true;
        }
        return true;
      });
      this.studentCaptureImages = captureImages;
      if (!foundImage) {
        captureImages.push({username: username, jpg: jpg, timestamp: currentTime});
        // console.log('receiveCapture', this.studentCaptureTimestamp, this.studentCaptureImages);
      }
      this.preventDefault();
    });
  }
  stopReceiveCapture() {
    server.slideIO.removeAllListeners('pushCapture')
  }


  startLocalStream(localStream) {
    // console.log('localStream', localStream);
    this.setState({localStream: localStream});
  }
  stopLocalStream() {
    if (this.webRTC) {
      this.webRTC.peerConnection.close();
      server.rtcIO.emit('disconnectRtc');
      server.rtcIO.removeAllListeners('connectResp');
      server.rtcIO.removeAllListeners('iceCandidate');
      server.rtcIO.removeAllListeners('disconnectRtc');
    }
    if (this.localStream) {
      console.log(this.localStream.getTracks());
      this.localStream.getTracks().forEach((track) => {
        track.stop();
      });
    }
    this.setState({webRTC:null, remoteStream: null, remoteLecturer: null});
    this.preventDefault();
  }
  connectVideo({send, user, classId, remoteVideoEl=null}) {
    if (remoteVideoEl) {
      this.setState({remoteVideoEl: options.remoteVideoEl});
    }
    this.connectWebRtc({send: send})
    .then((sdpOffer) => {
      server.rtcIO.emit('connectRtc',  {user:user, classId: classId, sdpOffer: sdpOffer});
    })
    .catch((error) => {
      console.log('connectVideo', error);
    });

    this.preventDefault();
  }
  connectWebRtc(options) {
    var webRTC;

    if (this.webRTC) {
      this.preventDefault();
      return new Promise((resolve, reject) => {
        reject();
      });
    }

    server.rtcIO.removeAllListeners('connectRtc');
    server.rtcIO.on('connectRtc', (msg) => {
      console.log('connectRtc', msg);
      if (this.webRTC && msg.sdpAnswer) {
        this.webRTC.processAnswer(msg.sdpAnswer, () => {
          this.setState({remoteStream: this.webRTC.getRemoteStream()})
        });
      }
    });

    server.rtcIO.removeAllListeners('iceCandidate');
    server.rtcIO.on('iceCandidate', (msg) => {
      // console.log('iceCandidate', msg.candidate);
      if (this.webRTC)
          this.webRTC.addIceCandidate(msg.candidate);
    });

    server.rtcIO.removeAllListeners('sender-disconnect');
    server.rtcIO.on('sender-disconnect', (msg) => {
      // console.log('iceCandidate', msg.candidate);
    });

    this.preventDefault();
    return new Promise((resolve, reject) => {
      if (options.send) {
        webRTC = kurento.WebRtcPeer.WebRtcPeerSendonly({
          videoStream: this.localStream,
          audioStream: this.localStream,
          onicecandidate: this.onIceCandidate,
          configuration: rtc.configuration
        }, function(err) {
          if (err) {
            console.log('WebRtcPeerSendonly error', err);
            return reject(err);
          }
          this.generateOffer(function(err, offerSdp) {
            if (err)
              reject(err);
            else
              resolve(offerSdp);
          });
        });
        this.setState({webRTC});
      }
      else {
        webRTC = kurento.WebRtcPeer.WebRtcPeerRecvonly({
          remoteVideo: this.remoteVideoEl,
          onicecandidate: this.onIceCandidate,
          configuration: rtc.configuration
        }, function(err) {
          if (err) {
            console.log('WebRtcPeerRecvonly error', err);
            return reject(err);
          }
          this.generateOffer(function(err, offerSdp) {
            if (err)
              reject(err);
            else
              resolve(offerSdp);
          });
        });
        this.setState({webRTC});
      }
    });
  }
  onIceCandidate = (candidate) => {
    server.rtcIO.emit('onIceCandidate', {candidate});
  }
  disconnectVideo() {
    if (this.webRTC) {
      this.webRTC.peerConnection.close();
      server.rtcIO.emit('disconnectRtc');
      server.rtcIO.removeAllListeners('connectResp');
      server.rtcIO.removeAllListeners('iceCandidate');
      server.rtcIO.removeAllListeners('disconnectRtc');
    }
    this.setState({webRTC:null, remoteStream: null, remoteLecturer: null});
  }
}

export default alt.createStore(MediaStore, 'MediaStore');
