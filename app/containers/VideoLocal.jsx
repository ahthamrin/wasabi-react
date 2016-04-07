import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import rtc from '../libs/rtc';

import MediaActions from '../actions/MediaActions';
import MediaStore from '../stores/MediaStore';

export default class VideoLocal extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);

    this.state = {
      play: false
    };

    this.localStream = null;
  }

  componentWillMount() {
    this.setState({play: this.props.play});
  }
  componentDidMount() {
    this.container = ReactDOM.findDOMNode(this);
    this.canvas = ReactDOM.findDOMNode(this.refs.canvas);
    this.canvasCtx = this.canvas.getContext('2d');
    this.video = ReactDOM.findDOMNode(this.refs.video);
    // this.img = ReactDOM.findDOMNode(this.refs.img);

    this.canvasLastCaptureTimestamp = 0;

    var stream = MediaStore.getState().localStream;
    if (!stream) {
      var mediaConstraints = rtc.video320();
        if (this.props.user && this.props.user.role === 'lecturer')
          mediaConstraints = rtc.video640();

    // if (true === false)
      MediaActions.startLocalStream(mediaConstraints);
    }
    else {
      this.attachStreamToVideo(stream);
    }

    MediaStore.listen(this.handleMediaStore);
  }
  componentWillUnmount() {
    this.detachStreamFromVideo();
    MediaStore.unlisten(this.handleMediaStore);
  }
  componentWillReceiveProps(nextProps) {
    console.log('VideoLocal componentWillReceiveProps', $(this.container).attr('data-reactid'), nextProps);
    if (this.state.play !== nextProps.play) {
      this.setState({play: nextProps.play});
    }
  }

  handleMediaStore = (state) => {
    console.log('handleMediaStore', state);
    if (state.localStream && this.localStream !== state.localStream) {
      this.attachStreamToVideo(state.localStream);
    }
  }

  attachStreamToVideo(stream) {
    this.video.src = window.URL.createObjectURL(stream);
    this.localStream = stream;
    this.video.muted = true;
    this.video.onloadedmetadata = this.handlePlayUserMedia;
  }
  detachStreamFromVideo() {
    this.video.pause();
    this.video.src = null;
  }  
  handlePlayUserMedia = (event) => {
    this.video.play()
    this.video.muted = true 
    window.requestAnimationFrame(this.canvasRender);
  }
  canvasRender = (timestamp) => {
    this.canvas.width = this.video.videoWidth;
    this.canvas.height = this.video.videoHeight;

    if (this.props.user.role === 'student' && (timestamp - this.canvasLastCaptureTimestamp > 1000 )) { // in miliseconds
      if (this.state.play) {
        console.log($(this.container).attr('data-reactid'), 'sendCapture');
        this.canvasCtx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
        var captureJpg = this.canvas.toDataURL('image/jpeg', 0.3);
        MediaActions.sendCapture({username: this.props.user.username, jpg: captureJpg});
      }
      this.canvasLastCaptureTimestamp = timestamp;
    }

    if (!this.video.ended && !this.video.paused) {
      window.requestAnimationFrame(this.canvasRender);
    }
  }

  render() {
    // console.log('VideoLocal', this.props);
    return(
      <div>
        <video className={this.props.hidden ? 'media-show hidden' : 'media-show'}  muted ref='video'/>
        <div style={{display: 'none'}}>
          <canvas className='media-show' ref='canvas' />
        </div>
      </div>
    );
  }
}

VideoLocal.propTypes = {
  user: PropTypes.object.isRequired,
  sendCapture: PropTypes.bool,
  disabled: PropTypes.bool
}