import React from 'react';
import { Link } from 'react-router';


export default class Quiz extends React.Component {
	render() {
				
		return(
			<div>
				<div>
					<input type="button" onClick={this.props.quizHandleQuestion} value="Quiz" />'
				</div>


				<div>
					{this.props.text}
					{this.props.questionShow}
				</div>
			

					
				<div>
					<input type="button" onClick={this.props.quizResetQuestion} value="Reset" />'
				</div>
			</div>
		  	
				
								
/*				<div>
					{this.props.answerShow.bind(this,username,answer)}
					{username} : {answer}
				</div>
*/				
/*			<div>
				<div>
					{this.props.question}
				</div>
			
				<div>
					{this.props.quizChoices.map(
					 	(c,i) => {
					 		return (
					 			<div key={i} onClick={this.props.quizHandleAnswer.bind(this,c,i)}>
								{c}
								</div>
					 		)
						}
					 )
					
					}
				</div>	
			</div>
*/

		)
	}
}
