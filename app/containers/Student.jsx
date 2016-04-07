import React from 'react';
import AltContainer from 'alt-container';

import LiveClassActions from '../actions/LiveClassActions';
import LiveClassStore from '../stores/LiveClassStore';
import MediaActions from '../actions/MediaActions';
import MediaStore from '../stores/MediaStore';
import StudentUIActions from '../actions/StudentUIActions';
import StudentUIStore from '../stores/StudentUIStore';

import BxSlideShow from '../components/BxSlideShow.jsx';
import VideoLocal from '../containers/VideoLocal.jsx';
import VideoRemote from '../containers/VideoRemote.jsx';
import AlertActions from '../actions/AlertActions';

import Chat from '../components/Chats/Chat.jsx';
import ChatStore from '../stores/ChatStore';

// import Quiz from '../components/Quiz.jsx';
import QuizModal from '../components/QuizModal.jsx';

export default class Student extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      videoLarge: false
    };

    this.rtcConnected = false;
    this.videoLarge = false;

    this.state = {
      videoLarge: false,
        user: {},
    quizStat: false,
    question: null,
    answer: null
    }
  
  //===========================================================Quiz Question Data for Simulation
  this.state.quiz = {
      subject: "Question 1",
      question: "Who am I ?",
      maxAnswer: "3",
      time: "3",
      multiple: true,
      a: "choice 1",
      b: "choice 2",
      c: "choice 3",
      d: "choice 4",
      jpg: "data:image/jpeg;base64,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",
      stat: false
      }
  
  }

  componentDidMount() {
    LiveClassActions.join({classId:this.props.params.classId, user: this.props.loggedInUser});

    this.connectVideo();
    MediaStore.listen(this.handleMediaStore);

    this.setState({videoLarge:StudentUIStore.getState().videoLarge});

    AlertActions.add({path: 'student.attend.start', type: 'info', 
      text: 'Click the lecturer video to toggle large/small view.',
      timeout: 2000});
  }
  componentWillUnmount() {
    // LiveClassActions.unsubscribe(this.props.params.deckId);
    MediaStore.unlisten(this.handleMediaStore);
  }

  // slides
  handleSlideChange = (oldIndex, newIndex) => {
    console.log('slidechange', oldIndex, newIndex);
    LiveClassActions.gotoSlide({slideNoLocal: newIndex});
  }
  handleSlideFirst = (event) => {
    var slideStore = LiveClassStore.getState();

    LiveClassActions.gotoSlide({slideNoLocal: 0});
  }
  handleSlideLast = (event) => {
    var slideStore = LiveClassStore.getState();
    var slideNo = slideStore.slideNoLocal;
    var slideLength = slideStore.slideDeckLength;

    LiveClassActions.gotoSlide({slideNoLocal: slideLength-1});
  }
  handleSlidePrev = (event) => {
    var slideStore = LiveClassStore.getState();
    var slideNo = slideStore.slideNoLocal;
    var slideLength = slideStore.slideDeckLength;

    LiveClassActions.gotoSlide({slideNoLocal: slideNo > 0 ? slideNo - 1 : 0 });
  }
  handleSlideNext = (event) => {
    var slideStore = LiveClassStore.getState();
    var slideNo = slideStore.slideNoLocal;
    var slideLength = slideStore.slideDeckLength;

    LiveClassActions.gotoSlide({slideNoLocal: slideNo < slideLength-1 ? slideNo + 1 : slideLength-1 });
  }

  // rtc
  handleMediaStore = (state) => {
    if (!this.rtcConnected && state.remoteLecturer && !state.webRTC) {
      window.setTimeout(() => {
        this.connectVideo();
      }, 200+Math.random()*1000)
    }
    else
    if (!state.webRTC && this.rtcConnected) {
      this.rtcConnected = false;
    }
  }
  connectVideo() {
    MediaActions.connectVideo({
      send: false,
      user: this.props.loggedInUser,
      classId: this.props.params.classId
    });
    this.rtcConnected = true;
  }
  handleRTCConnect = (event) => {
    if (!this.rtcConnected) {
      this.connectVideo();
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

  // UI
  handleToggle = (event) => {
    this.setState({videoLarge: !StudentUIStore.getState().videoLarge});
    StudentUIActions.toggleVideoSize();
  }

  //===========================================================Open Quiz Modal
  handleQuiz = (event) => {
    this.setState({quizStat: true});
    console.log("true");     
  }
   //===========================================================Close Quiz Modal
  handleCloseQuiz = (event) => {
    this.setState({quizStat: false});
    console.log("false");
  }


  render() {
    console.log('student', this.props);
    if (this.state.videoLarge)
    return(
      <div>
        <div className='row'>
          <div className='col-sm-9 col-xs-12'>
            <div className='row'>
              <div className='hidden'>
                <VideoLocal play={false} user={this.props.loggedInUser} />
              </div>
              <div className='col-xs-12'>
                <VideoRemote toggle={this.handleToggle} />
              </div>
            </div>
          </div>
          <div className='col-sm-3 col-xs-12'>
            <div className='row'>
              <div className='col-sm-12 col-xs-6'>
                <VideoLocal play={true}  user={this.props.loggedInUser} />
              </div>
              <div className='col-sm-12 col-xs-6'>
                <AltContainer
                  store={LiveClassStore}
                >
                  <BxSlideShow
                    sizeIsLarge={false}
                    showCtrlBtn={false}
                    onSlideChange={this.handleSlideChange}
                  />
                </AltContainer>
              </div>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-xs-12 chat-section'>
            <QuizModal quiz={this.state.quiz} onCloseQuiz={this.handleCloseQuiz} showQuiz={this.state.quizStat}/>
            <AltContainer
              stores={{
                chat: ChatStore,
                slide: LiveClassStore
              }}
            >
              <Chat user={this.props.loggedInUser} onSend={this.handleChatSend} />
            </AltContainer>
          </div>
        </div>
      </div>
      );
    else
    return(
      <div>
        <div className='row'>
          <div className='col-sm-3 col-xs-12'>
            <div className='row'>
              <div className='col-sm-12 col-xs-6'>
                <VideoLocal sendCapture={true} play={true} user={this.props.loggedInUser} />
              </div>
              <div className='col-sm-12 col-xs-6'>
                <VideoRemote toggle={this.handleToggle} />
              </div>
            </div>
          </div>
          <div className='col-sm-9 col-xs-12 pull-left'>
            <div className='row'>
              <div className='hidden'>
                <VideoLocal play={false}  user={this.props.loggedInUser} />
              </div>
              <div className='col-xs-12'>
                <AltContainer
                  store={LiveClassStore}
                >
                  <BxSlideShow
                    sizeIsLarge={true}
                    showCtrlBtn={false}
                    onSlideChange={this.handleSlideChange}
                  />
                </AltContainer>
              </div>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-xs-12 chat-section'>
            <QuizModal quiz={this.state.quiz} onCloseQuiz={this.handleCloseQuiz} showQuiz={this.state.quizStat}/>
            <AltContainer
              stores={{
                chat: ChatStore,
                slide: LiveClassStore
              }}
            >
              <Chat user={this.props.loggedInUser} onSend={this.handleChatSend} />
            </AltContainer>
          </div>
        </div>
      </div>
      );
/*    return(
      <div className='row'>
        <div className='col-sm-9 col-xs-12'>
        <AltContainer
          stores={{slide: SlideStore, ui: StudentUIStore}}
        >
          <BxSlideShow
            showIfSizeLarge={false}
            showCtrlBtn={false}
            onSlideChange={this.handleSlideChange}
          />
        </AltContainer>
        <VideoRemote showIfVideoLarge={true}  toggle={this.handleToggle} />
        </div>
        <div className='col-sm-3 col-xs-12'>
        <div className='row'>
        <div className='col-sm-12 col-xs-6'>
        <VideoLocal user={this.props.loggedInUser} />
        </div>
        <div className='col-sm-12 col-xs-6'>
        <VideoRemote showIfVideoLarge={false} toggle={this.handleToggle} />
        <AltContainer
          stores={{slide: SlideStore, ui: StudentUIStore}}
       >
          <BxSlideShow
            showIfSizeLarge={true}
            showCtrlBtn={false}
            onSlideChange={this.handleSlideChange}
          />
        </AltContainer>
        </div>
        </div>
        </div>
      </div>
    );
*/ 
  }
}
