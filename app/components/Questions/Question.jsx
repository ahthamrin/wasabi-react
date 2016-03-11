import React from 'react'
import { Link } from 'react-router'
import QuestionLog from './QuestionLog.jsx';

export default class Alert extends React.Component {
	render() {
		return(
			<div>
				<QuestionLog
					questions={this.props.questions}/>
				<textarea rows="2" cols="50" onChange={this.props.questionInput}>
					{this.props.questionValue}
				</textarea>
				<button 
					className="btn btn-primary"
				  onClick={this.props.clickQuestion} >
				  <span className="glyphicon glyphicon-ok"></span>
				  Send
				</button>
			</div>
		)
	}
}