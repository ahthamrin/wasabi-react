import React from 'react'
import { Link } from 'react-router'
import server from '../../libs/serverurls'
import QuestionActions from '../../actions/QuestionActions';
import QuestionLog from './QuestionLog.jsx';
import Alert from '../Alert.jsx';

export default class Question extends React.Component {
	constructor(props) {
		super(props);

		this.questionMsg = '';
		
	}
	render() {
		console.log('question', this.props);
		return(
			<div>
				<QuestionLog
					questions={this.props.stores.questions}/>
				<div>
				<textarea rows="2" width="100%" onChange={this.handleInputChange}>
				</textarea>
				</div>
				<button 
					className="btn btn-primary"
				  onClick={this.handleSend} >
				  <span className="glyphicon glyphicon-ok"></span>
				  Send
				</button>
				<Alert clickAlert={this.props.clickAlert}/>

			</div>
		)
	}
	handleInputChange = (event) => {
		// this.setState({questionMsg: event.target.value});
		this.questionMsg = event.target.value;
		console.log('input', event.target.value);
	}
	handleSend = (event) => {
		var question = {questionMsg: this.questionMsg, sender: this.props.user.username};
		QuestionActions.input(question);
    server.slideIO.emit('AskQuestion', question);
	}
}