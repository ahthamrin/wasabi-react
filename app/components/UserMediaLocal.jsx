import React from 'react';
import ReactDOM from 'react-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import rtc from '../libs/rtc';
import server from '../libs/serverurls';
import { hashHistory, Link } from 'react-router';
import io from 'socket.io-client';
import SimpleWebRTC from 'simplewebrtc';

var RTCSource = io.connect('wss://lo.jaringan.info:3000/rtc',
  {transports: [
    'websocket', 
    'polling',
    'xhr-polling', 
    'jsonp-polling', 
    'flashsocket', 
    'htmlfile'
  ]});


export default class UserMediaLocal extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  componentDidMount() {
    var container = ReactDOM.findDOMNode(this);


    this.canvas = ReactDOM.findDOMNode(this.refs.canvas);
    this.canvasCtx = this.canvas.getContext('2d');

    this.video = ReactDOM.findDOMNode(this.refs.video);
    this.remoteVideo = ReactDOM.findDOMNode(this.refs.remoteVideo);

    this.canvasLastCaptureTimestamp = 0;

    this.getUserMedia()
    .then((stream) => {
      this.video.src = window.URL.createObjectURL(stream);
      this.video.onloadedmetadata = this.handlePlayUserMedia;
      this.mediaStreamLocal = stream;

      var rtcOptions = {
        localVideo: null, // this.video,
        remoteVideo: null, // this.remoteVideo,
        connection: RTCSource,
        autoRequestMedia: true
      }
      if (this.props.recv === false) {
        rtcOptions.receiveMedia = {
          mandatory: {
              OfferToReceiveAudio: false,
              OfferToReceiveVideo: false
          }
        }
      }

      this.simplewebrtc = new SimpleWebRTC({
        localVideo: null, // this.video,
        remoteVideo: null, // this.remoteVideo,
        connection: RTCSource,
        autoRequestMedia: true
        });
      this.simplewebrtc.joinRoom('100');
      this.simplewebrtc.on('createdPeer', (peer) => {
        console.log('createdPeer', peer);
      })
      this.simplewebrtc.on('videoAdded', (video, peer) => {
        console.log('videoAdded', peer);
        this.remoteVideo.src = window.URL.createObjectURL(peer.stream);
      })

    })
    .catch((error) => {
      console.log('userMedia',error);
    });
  }
  getUserMedia() {
    return new Promise((resolve, reject) => {
      navigator.getUserMedia(
        rtc.userMediaVideoOnly,
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
    this.canvas.width = this.video.videoWidth/4;
    this.canvas.height = this.video.videoHeight/4;

    this.canvasCtx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

    if (this.props.recv && (timestamp - this.canvasLastCaptureTimestamp > 1 )) {
      server.slideIO.emit('class/img',{user:this.props.user, jpg:this.canvas.toDataURL('image/jpeg', 0.7)});
      this.canvasLastCaptureTimestamp = timestamp;
    }

    if (!this.video.ended && !this.video.paused) {
      window.requestAnimationFrame(this.canvasRender);
    }
  }
  componentWillUnmount() {
    this.video.pause();
    try {
      this.mediaStreamLocal.getTracks().forEach((track) => { track.stop()});
    }
    catch(err) {
      this.mediaStreamLocal.stop();
    }
  }
  render() {
      return (
        <div className="row">
          <canvas ref="canvas"/>
          <div style={{display:'none'}}>
          <video muted ref="video"/>
          </div>
          <video ref="remoteVideo"/>
        </div>
      );
    // }
  }
  handleInputUser = (event) => {
  }
}
