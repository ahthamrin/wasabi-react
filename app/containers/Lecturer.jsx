import React from 'react';
import AltContainer from 'alt-container';

import LiveClassActions from '../actions/LiveClassActions';
import LiveClassStore from '../stores/LiveClassStore';
import MediaActions from '../actions/MediaActions';
import MediaStore from '../stores/MediaStore';
import AlertActions from '../actions/AlertActions';

import BxSlideShow from '../components/BxSlideShow.jsx';
import VideoLocal from '../containers/VideoLocal.jsx';
import StudentCapture from '../components/StudentCapture.jsx';

import ControlBox from '../components/ControlBox.jsx';
import ChatStore from '../stores/ChatStore';


export default class Lecturer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      webRTC: false
    };

    this.rtcConnected = false;
    this.localStream = null;
  }

  componentDidMount() {
    LiveClassActions.join({classId:this.props.params.classId, user: this.props.loggedInUser});
    // MediaActions.startReceiveCapture();

    MediaStore.listen(this.handleMediaStore);

  }
  componentWillUnmount() {
    // SlideActions.unsubscribe(this.props.params.deckId);
    MediaActions.stopReceiveCapture();

    MediaStore.unlisten(this.handleMediaStore);
  }

  // slides
  handleSlideChange = (oldIndex, newIndex) => {
    console.log('slidechange', oldIndex, newIndex);
  }
  handleSlideFirst = (event) => {
    console.log('handleSlideFirst');
    var slideStore = LiveClassStore.getState();

    LiveClassActions.gotoSlide({slideNoLocal: 0});
  }
  handleSlideLast = (event) => {
    console.log('handleSlideLast');
    var slideStore = LiveClassStore.getState();
    var slideNo = slideStore.slideNoLocal;
    var slideLength = slideStore.slideDeckLength;

    LiveClassActions.gotoSlide({slideNoLocal: slideLength-1});
  }
  handleSlidePrev = (event) => {
    console.log('handleSlidePrev');
    var slideStore = LiveClassStore.getState();
    var slideNo = slideStore.slideNoLocal;
    var slideLength = slideStore.slideDeckLength;

    LiveClassActions.gotoSlide({slideNoLocal: slideNo > 0 ? slideNo - 1 : 0 });
  }
  handleSlideNext = (event) => {
    console.log('handleSlideNext');
    var slideStore = LiveClassStore.getState();
    var slideNo = slideStore.slideNoLocal;
    var slideLength = slideStore.slideDeckLength;

    LiveClassActions.gotoSlide({slideNoLocal: slideNo < slideLength-1 ? slideNo + 1 : slideLength-1 });
  }

  // rtc
  handleMediaStore = (state) => {

    if (!state.webRTC && this.state.webRTC) {
      AlertActions.add({
        path: 'lecturer.webRTC.disconnected', type: 'danger',
        text: 'Video disconnected.', timeout: 3000
      });
    }
    if (state.webRTC && !this.state.webRTC) {
      AlertActions.add({
        path: 'lecturer.webRTC.connected', type: 'success',
        text: 'Video connected.', timeout: 1000
      });
    }
    if ( (state.webRTC ? true : false) !== this.state.webRTC )
      this.setState({webRTC: state.webRTC ? true : false});

    if (state.localStream !== this.localStream
      && !this.webRTC
      && !this.rtcConnected ) {
      this.localStream = state.localStream;
      console.log('connectVideo');
      window.setTimeout(() => {
        MediaActions.connectVideo({
          send: true,
          user: this.props.loggedInUser,
          classId: this.props.params.deckId
        });
        this.rtcConnected = true;      
      }, 100);
    }
    else {
      this.rtcConnected = true;
    }
  }

  handleRTCConnect = (event) => {
    if (!this.rtcConnected) {
      MediaActions.connectVideo({
        send: true,
        user: this.props.loggedInUser,
        classId: this.props.params.deckId
      });
      this.rtcConnected = true;
    }
    else {
      MediaActions.disconnectVideo();
      this.rtcConnected = false;
    }
  }

  // chat
  handleChatSend = (msg) => {
    // console.log('handleChatSend', msg);
    LiveClassActions.sendChat(msg);
  }

  render() {
    console.log('lecturer', this.props);
    return(
      <div>
      <div className='row'>
        <div className='col-xs-12 col-sm-9'>
        <AltContainer
          store={LiveClassStore}
        >
          <BxSlideShow
            isLecturer={true}
            showCtrlBtn={true}
            onSlideChange={this.handleSlideChange}
            onFirst={this.handleSlideFirst}
            onLast={this.handleSlideLast}
            onPrev={this.handleSlidePrev}
            onNext={this.handleSlideNext}
          />
        </AltContainer>
        </div>
        <div className='col-xs-6 col-sm-3'>
        <VideoLocal user={this.props.loggedInUser} />
        <AltContainer
          stores={{chatStore:ChatStore}} >
          <ControlBox onSend={this.handleChatSend}/>
        </AltContainer>
        </div>
      </div>
      <div className='container-fluid'>
      <StudentCapture />
      </div>
      </div>
    );
  }
}
