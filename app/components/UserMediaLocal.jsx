import React from 'react';
import ReactDOM from 'react-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import rtc from '../libs/rtc';
import server from '../libs/serverurls';
import { hashHistory, Link } from 'react-router';
import io from 'socket.io-client';
import kurento from 'kurento-utils';
import UserStore from '../stores/UserStore';

export default class UserMediaLocal extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  componentDidMount() {
    var container = ReactDOM.findDOMNode(this);

    this.user = UserStore.getState().loggedInUser;
    this.canvas = ReactDOM.findDOMNode(this.refs.canvas);
    this.canvasCtx = this.canvas.getContext('2d');

    this.video = ReactDOM.findDOMNode(this.refs.video); 
    this.remoteVideo = ReactDOM.findDOMNode(this.refs.remoteVideo);

    this.canvasLastCaptureTimestamp = 0;

    server.rtcIO.on('joinRes', (msg) => {
      console.log('joinRes', msg);
      if (msg.sdpAnswer) {
        this.webRtc.processAnswer(msg.sdpAnswer);
      }
    });
    server.rtcIO.on('iceCandidate', (msg) => {
      console.log('iceCandidate', msg.candidate);
      this.webRtc.addIceCandidate(msg.candidate);
    });

    var mediaConstraints = { audio: true, video: { width: 240, framerate: 15 }};
    if (this.user.role === 'lecturer')
      mediaConstraints = { audio: true, video: { width: 640, framerate: 30 }};
    this.getUserMedia(mediaConstraints)
    .then((stream) => {
      console.log('stream', stream);
      this.video.src = window.URL.createObjectURL(stream);
      this.video.muted = true;
      this.video.onloadedmetadata = this.handlePlayUserMedia;
      this.mediaStreamLocal = stream;

      this.connectWebRtc()
      .then((sdpOffer) => {
        server.rtcIO.emit('joinClass', {user:this.user, classId: this.props.classId, sdpOffer:sdpOffer});
      })
      .catch((error) => {
        console.log('connectWebRtc', error)
      })
    })
    .catch((error) => {
      console.log('userMedia',error);
    });
  }
  getUserMedia(constraints) {
    return new Promise((resolve, reject) => {
      navigator.getUserMedia(
        constraints,
        (stream) => {
          resolve(stream);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
  handlePlayUserMedia = (event) => {
    this.video.play()
    this.video.muted = true 
    window.requestAnimationFrame(this.canvasRender);
  }
  canvasRender = (timestamp) => {
    // this.canvas.clientWidth = this.canvas.width = this.video.videoWidth;
    // this.canvas.clientWidth = this.canvas.width = this.video.videoWidth;
    this.canvas.width = this.video.videoWidth/2;
    this.canvas.height = this.video.videoHeight/2;

    this.canvasCtx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

    if (this.props.recv && (timestamp - this.canvasLastCaptureTimestamp > 2 )) {
      server.slideIO.emit('class/img',{user:this.props.user, jpg:this.canvas.toDataURL('image/jpeg', 0.8)});
      this.canvasLastCaptureTimestamp = timestamp;
    }

    if (!this.video.ended && !this.video.paused) {
      window.requestAnimationFrame(this.canvasRender);
    }
  }
  connectWebRtc() {
    return new Promise((resolve, reject) => {
      var self = this;
      if (this.user.role === 'lecturer')
        this.webRtc = kurento.WebRtcPeer.WebRtcPeerSendonly({videoStream: this.mediaStreamLocal, audioStream: this.mediaStreamLocal, onicecandidate: this.onIceCandidate, mode: 'send'}, function(err) {
          if (err)
            console.log('error', err);
          this.generateOffer(function(err, offerSdp){
            if (err)
              reject(err);
            else
              resolve(offerSdp);
          });
        });
      else
        this.webRtc = kurento.WebRtcPeer.WebRtcPeerRecvonly({remoteVideo: this.remoteVideo, onicecandidate: this.onIceCandidate, mode: 'recv'}, function(err) {
          if (err)
            console.log('error', err);
          this.generateOffer(function(err, offerSdp){
            if (err)
              reject(err);
            else
              resolve(offerSdp);
          });
        });

    })
  }
  onIceCandidate = (candidate) => {
    console.log('local candidate', candidate);
    server.rtcIO.emit('onIceCandidate', {candidate:candidate})
  }
  componentWillUnmount() {
    this.video.pause();
    try {
      this.mediaStreamLocal.getTracks().forEach((track) => { track.stop()});
      this.webRtc.dispose();
      server.rtcIO.emit('leaveClass');
    }
    catch(err) {
      // this.mediaStreamLocal.stop();
    }
  }
  render() {
      return (
        <div>
          <canvas style={{width: '100%'}}  ref="canvas"/>
          <div style={{display:'none'}}>
          <video style={{width: '100%'}}  controls muted ref="video"/>
          </div>
          <video style={{width: '100%'}} ref="remoteVideo"/>
        </div>
      );
    // }
  }
  handleInputUser = (event) => {
  }
}
