import React from 'react';
import { hashHistory, Link } from 'react-router';
import AltContainer from 'alt-container';
import UserActions from '../actions/UserActions';
import UserStore from '../stores/UserStore';
import SlideActions from '../actions/SlideActions';
import SlideStore from '../stores/SlideStore';
import SlideShow from './SlideShow.jsx';
import LocalVideo from './UserMediaLocal.jsx';
//THIS PART IS ADDED BY GROUP 2 FOR LECTURERNOTE FEATURE
import LecturerNote from './LecturerNote.jsx';

// GROUP 5
import Question from './Questions/Question.jsx';
import QuestionNotif from './Questions/QuestionNotif.jsx';
import QuestionModal from './Questions/QuestionModal.jsx';


export default class Lecturer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      currentNoteIndex: 0,
      currentNoteValue: null,
      noteText: [],
      alerts: 0,
      questionValue: "",
      notifs: 2,
      view: {
        showModal: false
      },
      questions: [{ sender: "dave",
                    questionMsg: "who?" },
                  { sender: "bob",
                    questionMsg: "what?" }]

    }

  }
  componentDidMount() {
    var loggedInUser = UserStore.getState().loggedInUser;
    this.setState({user: loggedInUser});

    this.setState(SlideStore.getState())
    SlideStore.listen(this.changeSlideStore);

    SlideActions.subSlide({slideDeckId:this.props.params.deckId, user: loggedInUser});
    console.log('componentDidMount', this.state, SlideStore.getState());

        var noteText = [
            '',
            '',
            '1 - One line, 2 - two line, 3 - three lines. 4 means death in japan. We celebrate when we turn 3, 5, 7. Girls celebrate when they turn 3 and 7, boy 5. 8 mean good, because it is spread ',
            'small-thin medium-bowl large-fat',
            'shake and maguro are salmon and tuna. we see these kanjis often'
        ];
        var value = noteText[0];

       this.setState({
            //THIS PART IS ADDED BY GROUP 2 FOR LECTURERNOTE FEATURE
            currentNoteIndex: 0,
            noteText: noteText,
            currentNoteValue: value
        });

  }
  componentWillUnmount() {
    SlideActions.unsubSlide(this.props.params.deckId);
    SlideStore.unlisten(this.changeSlideStore);
  }
  changeSlideStore = (state) => {
    if (state.questionMsg) {
      state.questions = [{sender:state.sender, questionMsg: state.questionMsg}].concat(this.state.questions);
    }
    console.log('change slide store', state);
    this.setState(state);
    console.log(state, this.state);
  }
  render() {
    var AlertNumber = this.state.alerts

    return (
      <div className="row">
        {this.state.view.showModal ? 
          <QuestionModal questions={this.state.questions} 
                         handleHideModal={this.handleHideModal}
                         questionInput={this.handleAnswerInput}
                         clickQuestion={this.handleAnswer}/> : null}  

        <button className="btn btn-danger">
          <span className="glyphicon glyphicon-alert" aria-hidden="true"></span>
          <span className="badge">{AlertNumber}</span>
        </button>

        <QuestionNotif 
          handleShowModal={this.handleShowModal}
          notifs={this.state.notifs}/>


        <AltContainer
          stores={{slides: SlideStore}}
        >
          <SlideShow
            onFirst={this.handleFirst}
            onPrev={this.handlePrev}
            onNext={this.handleNext}
            onLast={this.handleLast} />
        </AltContainer>

               <LecturerNote
                    noteText={this.state.noteText}
                    currentNoteIndex={this.state.currentNoteIndex}
                    currentNoteValue={this.state.currentNoteValue}
                    saveLectureNote={this.handleSaveLectureNoteClick}
                    changeLectureNote={this.handleChangeLectureNoteChange}/>
                <LocalVideo />

        <LocalVideo user={this.state.user} recv={false}/>
      </div>
    );
  }

  //shows the modal for the questions
  handleHideModal = (event) => {
    this.setState({ view: {showModal: false} })
  }

  //hides the modal for the questions
  handleShowModal = (event) => {
    this.setState({ view: {showModal: true} })
  }

  //triggered when the value of the text area changes
  handleAnswerInput = (event) => {
    this.setState({ questionValue: event.target.value });
  }

  //pushes replies to questions
  handleAnswer = (index) => {
    console.log('send to student:' + this.state.questionValue)
    
    var questions = this.state.questions;
    if (!questions[index].reply)
      questions[index].reply = []
    
    var question = { sender: this.state.user.username,
                     questionMsg: this.state.questionValue }

    questions[index].reply.push(question)
    SlideActions.emit({ cmd:'ReplyQuestion', msg: questions });
    this.setState({ questions: questions });
  }

    // THIS METHOD IS ADDED BY GROUP 2 FOR LECTURERNOTE FEATURE
    handleLectureNoteChange = (index) => {
        var content = index;
        var noteText = this.state.noteText;
        var val = noteText[index];
        this.setState(
            {
                currentNoteIndex: content,
                currentNoteValue: val
            }
        )
    }

    // THIS METHOD IS ADDED BY GROUP 2 FOR LECTURERNOTE FEATURE
    handleChangeLectureNoteChange = (event) => {
        this.setState({currentNoteValue: event.target.value})
    }

    // THIS METHOD IS ADDED BY GROUP 2 FOR LECTURERNOTE FEATURE
    handleSaveLectureNoteClick = (event) => {
        var index = this.state.currentNoteIndex;
        var noteText = this.state.noteText;
        var value = this.state.currentNoteValue;
        noteText[index] = value;
        this.setState({noteText: noteText})
    }

  handleFirst = (event) => {
    if (this.state.slideNoLocal > 0 ) {
      SlideActions.changeSlideLocal({slideNoLocal: 0});
           // THIS PART IS ADDED BY GROUP 2 FOR LECTURERNOTE FEATURE
            this.handleLectureNoteChange(0);
       console.log('handleFirst', this.state);
    }
  }
  handlePrev = (event) => {
    if (this.state.slideNoLocal > 0) {
      SlideActions.changeSlideLocal({slideNoLocal: this.state.slideNoLocal -1});
            // THIS PART IS ADDED BY GROUP 2 FOR LECTURERNOTE FEATURE
            this.handleLectureNoteChange(this.state.slideNoLocal - 1);
      console.log('handlePrev', this.state);
    }
  }
  handleNext = (event) => {
    if (this.state.slideNoLocal < this.state.slideDeckLength - 1) {
      SlideActions.changeSlideLocal({slideNoLocal: this.state.slideNoLocal + 1});
            // THIS PART IS ADDED BY GROUP 2 FOR LECTURERNOTE FEATURE
            this.handleLectureNoteChange(this.state.slideNoLocal + 1);
      console.log('handleNext', this.state);
    }
  }
  handleLast = (event) => {
     if (this.state.slideNoLocal < this.state.slideDeckLength - 1 ) {
      SlideActions.changeSlideLocal({slideNoLocal: this.state.slideDeckLength - 1});
            // THIS PART IS ADDED BY GROUP 2 FOR LECTURERNOTE FEATURE
            this.handleLectureNoteChange(this.state.slideDeckLength - 1);
      console.log('handleLast', this.state);
    }
  }
}
