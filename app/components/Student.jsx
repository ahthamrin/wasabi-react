import React from 'react';
import { hashHistory, Link } from 'react-router';
import AltContainer from 'alt-container';
import server from '../libs/serverurls';
import UserActions from '../actions/UserActions';
import UserStore from '../stores/UserStore';
import SlideActions from '../actions/SlideActions';
import SlideStore from '../stores/SlideStore';
import SlideShow from './SlideShow.jsx';
import LocalVideo from './UserMediaLocal.jsx';
import Alert from './Alert.jsx';
import Question from './Questions/Question.jsx';
import QuestionStore from '../stores/QuestionStore';
import QuestionActions from '../actions/QuestionActions';


export default class Student extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
    quizStat: false,
    question: null,
    answer: null
    }

  }
  componentDidMount() {
    var userData = UserStore.getState();
    var loggedInUser = userData.loggedInUser;
    this.setState({user: userData.loggedInUser});

    this.setState(SlideStore.getState())
    SlideStore.listen(this.changeSlideStore);

    SlideActions.subSlide({slideDeckId:this.props.params.deckId, user: loggedInUser});
    QuestionActions.sub({slideDeckId:this.props.params.deckId, user: loggedInUser})

    console.log('componentDidMount', this.state, SlideStore.getState());
  }
  componentWillUnmount() {
    SlideActions.unsubSlide(this.props.params.deckId);
    QuestionActions.unsub();
    SlideStore.unlisten(this.changeSlideStore);
  }
  changeSlideStore = (state) => {
    console.log('changeSlideStore');
//================================================================================>> This is Changed
  if (state.quizStat === true) {
    console.log('incoming quiz', state.quizStat);
    //var question = {this.state.question}
    var quizAnswer = prompt(state.question);
        var quizQA = {question: state.question, answer: quizAnswer}
        console.log('answer', quizAnswer);
        // this.setState(quizQA);
      server.slideIO.emit('pushQuizAnswer', {username: this.state.user.username, answer: quizAnswer});
    // this.setState({quizStat: false});
    }
  if (state.answer)
    return;
//================================================================================>

    this.setState(state);
  }
  render() {
    return (
      <div className="row">
      <div className="col-xs-12 col-md-9">
        <AltContainer
          stores={{slides: SlideStore}}
        >
          <SlideShow
            onSlideClick={this.handleSlideClick}
            onFirst={this.handleFirst}
            onPrev={this.handlePrev}
            onNext={this.handleNext}
            onLast={this.handleLast} />
        </AltContainer>
      </div>
      <div className="col-xs-12 col-md-3">
        <div className="row">
        <LocalVideo classId={this.props.params.deckId} user={this.state.user} recv={true}/>
  <div class="clearfix hidden-md-block visible-md-block"></div>
        <AltContainer
          stores={{stores:QuestionStore}}

          inject={{
            user: this.state.user,
          }}
        >
          <Question clickAlert={this.handleAlertButton}
          />
        </AltContainer>
        </div>
        </div>
      </div>
    );
  }

  //triggered when you type something
  handleQuestionInput = (event) => {
    QuestionActions.input({ questionValue: event.target.value });
  }

//triggered when the send button is clicked
  handleQuestion = (event) => {
    var questions = this.state.questions;
    var question = { sender: this.state.user.username,
                     questionMsg: this.state.questionValue }
    questions.push(question)

    this.setState({questions: questions });

    server.slideIO.emit('AskQuestion', question);
  }

  //triggered when the alert button is clicked
  handleAlertButton = (event) => {
    var user = { user: this.state.user.username }

    server.slideIO.emit('AlertTeacher', user);
    console.log('alert teacher');
  }

  handleSlideClick = (event) => {
    console.log('click',event);
  }
  handleFirst = (event) => {
    if (this.state.slideNoLocal > 0 ) {
      SlideActions.changeSlideLocal({slideNoLocal: 0});
      console.log('handleFirst', this.state);
    }
  }
  handlePrev = (event) => {
    if (this.state.slideNoLocal > 0) {
      SlideActions.changeSlideLocal({slideNoLocal: this.state.slideNoLocal -1});
      console.log('handlePrev', this.state);
    }
  }
  handleNext = (event) => {
    if (this.state.slideNoLocal < this.state.slideDeckLength - 1) {
      SlideActions.changeSlideLocal({slideNoLocal: this.state.slideNoLocal + 1});
      console.log('handleNext', this.state);
    }
  }
  handleLast = (event) => {
     if (this.state.slideNoLocal < this.state.slideDeckLength - 1 ) {
      SlideActions.changeSlideLocal({slideNoLocal: this.state.slideDeckLength - 1});
      console.log('handleLast', this.state);
    }
  }
}
