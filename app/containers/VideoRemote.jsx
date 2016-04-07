import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import AltContainer from 'alt-container';
import rtc from '../libs/rtc';
import server from '../libs/serverurls';
import { hashHistory, Link } from 'react-router';

import MediaActions from '../actions/MediaActions';
import MediaStore from '../stores/MediaStore';


export default class VideoRemote extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);

    this.state = {
      showVideo: true,
    };

    this.remoteStream = null;
  }

  componentDidMount() {
    console.log('VideoRemote componentDidMount');
    this.component = ReactDOM.findDOMNode(this);
    this.video = ReactDOM.findDOMNode(this.refs.video);

    MediaStore.listen(this.handleMediaStore);

    this.handleMediaStore(MediaStore.getState());
  }
  componentWillUnmount() {
    console.log('VideoRemote componentWillUnmount');
    this.detachStreamFromVideo();
    MediaStore.unlisten(this.handleMediaStore);
  }
  componentWillReceiveProps() {
    console.log(arguments);
  }

  handleMediaStore = (state) => {
    console.log('handleMediaStore', state);
    if (state.remoteStream && this.remoteStream !== state.remoteStream) {
      this.remoteStream = state.remoteStream;
      this.attachStreamToVideo(this.remoteStream);
    }
    if (!state.remoteStream) {
      this.detachStreamFromVideo();
    }
  }
  handleStudentUIStore = (state) => {
    this.setState({showVideo: this.props.showIfVideoLarge === state.videoLarge});
    if (this.props.showIfVideoLarge === state.videoLarge) {
      this.video.muted = false;
      if (this.remoteStream)
        this.attachStreamToVideo(this.remoteStream);
    }
    else {
      this.video.muted = true;
      this.video.src = null;
      this.video.pause();
    }
  }

  attachStreamToVideo(stream) {
    console.log('attachStreamToVideo', stream);
    this.video.src = window.URL.createObjectURL(stream);
    this.video.onloadedmetadata = this.handlePlayUserMedia;
  }
  detachStreamFromVideo() {
    this.video.pause();
    this.video.src = null;
    this.remoteStream = null;
  }  
  handlePlayUserMedia = (event) => {
    if (this.state.showVideo) {
      this.video.play()
      this.video.muted = false;
    }
  }
  render() {
    console.log('VideoRemote', this.props);
    var showVideo = '';//this.state.showVideo ? '' : 'hidden';
    return(
      <div className={showVideo}>
        <video className='media-show' ref='video' onClick={this.props.toggle}/>
      </div>
    );
  }
}

VideoRemote.propTypes = {
  // showIfVideoLarge: PropTypes.bool.isRequired,
  onClick: PropTypes.func
}
