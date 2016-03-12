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
    //var question = {this.state.question}
    var quizAnswer = prompt(state.question);
        var quizQA = {question: state.question, answer: quizAnswer}
        this.setState(quizQA);
      server.slideIO.emit('pushQuizAnswer', {username: this.state.user.username, answer: quizAnswer});
    // this.setState({quizStat: false});
    }
//================================================================================>

    this.setState(state);
  }
  render() {
    return (
      <div className="row">
        <AltContainer
          stores={{slides: SlideStore}}
        >
          <SlideShow
            onFirst={this.handleFirst}
            onPrev={this.handlePrev}
            onNext={this.handleNext}
            onLast={this.handleLast} />
        </AltContainer>
          <Alert clickAlert={this.handleAlertButton}/>
        <AltContainer
          stores={{stores:QuestionStore}}

          inject={{
            user: this.state.user
          }}
        >
          <Question
          />
        </AltContainer>
        <LocalVideo classId={this.props.params.deckId} user={this.state.user} recv={true}/>
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
