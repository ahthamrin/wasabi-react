import React from 'react'
//add for chat and lecture note feature
// import QuestionNotif from './QuestionNotif.jsx';
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
	        
	        //for injecting chat data
	        <QuestionModal 	threadChats={this.props.chatStore.threadChats}
	        				replyChats={this.props.chatStore.replyChats} 
	                       	handleHideModal={this.handleHideModal}
	                       	onSend={this.props.onSend}
	                       	/> : null }  
				<button className={this.props.btnClassName}
				        onClick={ this.handleShowModal} >
					Questions <span className='badge'>{ this.props.chatStore.notifs }</span>
				</button>
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
}