import React from 'react'
import server from '../../libs/serverurls';
import QuestionNotif from './QuestionNotif.jsx';
import QuestionLog from './QuestionLog.jsx';
import QuestionModal from './QuestionModal.jsx';

export default class QuestionLecturer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showModal: false,
			questionValue: ''
		}
	}
	render() {
		console.log('QuestionLecturer', this.props);
		return(
			<div>
	      {this.state.showModal ? 
	        
	        <QuestionModal questions={this.props.stores.questions} 
	                       handleHideModal={this.handleHideModal}
	                       questionInput={this.handleAnswerInput}
	                       clickQuestion={this.handleAnswer}/> : null}  

	      <button className="btn btn-danger">
	        <span className="glyphicon glyphicon-alert" aria-hidden="true"></span>
	        <span className="badge">{this.props.stores.alerts}</span>
	      </button>

	      <QuestionNotif 
	        handleShowModal={this.handleShowModal}
	        notifs={this.props.stores.notifs}/>
	    </div>
		)		
	}
  //shows the modal for the questions
  handleHideModal = (event) => {
    this.setState({showModal: false})
  }

  //hides the modal for the questions
  handleShowModal = (event) => {
    this.setState({showModal: true})
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
    
    var question = { sender: this.props.user.username,
                     questionMsg: this.state.questionValue }

    questions[index].reply.push(question)
    server.slideIO.emit('ReplyQuestion', questions);
    this.setState({ questions: questions });
  }

}