import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import QuestionLecturer from './Chats/QuestionLecturer.jsx';

export default class About extends React.Component {
	render() {
		console.log('About props',this.props);
		return(
			<div>
				<button type="button" className="btn btn-success btn-block" onClick={this.props.onStartFinish}>Start Class</button>
				<div>Controls</div>
				<QuestionLecturer btnClassName='btn btn-block btn-info' chatStore={this.props.chatStore} onSend={this.props.onSend}/>
				<button type="button" className="btn btn-primary btn-block" >Quiz Results</button>
				<div>Stats</div>
			</div>
		)
	}
}
