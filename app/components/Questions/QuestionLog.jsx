import React from 'react'
import { Link } from 'react-router'

export default class QuestionLog extends React.Component {
	render() {
		var questions = this.props.questions;
		var x;
		if(questions[0] && questions[0].reply){
			for (x = 0 ; x < questions[0].reply.length ; x+=1){
				questions.push(questions[0].reply[x])
			}
		}

		console.log(questions)
		return(
			<div>
	      { questions.map(
	          (c, i) => {
	            return(
	              <div key={i}>
	                {c.sender}: {c.questionMsg} 
	              </div>
	            )}
	        )}
	    </div>
		)
	}
}