import React from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router'
import server from '../libs/serverurls'
import UserStore from '../stores/UserStore'
//import QuizShowAnswer from './QuizShowAnswer.jsx'

export default class QuizResult extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {prev: "none", answerIndex: null, activeUser: ""};
  	}

	componentDidMount(){
		var container = ReactDOM.findDOMNode(this);

		this.canvas = ReactDOM.findDOMNode(this.refs.canvas);
		this.img = ReactDOM.findDOMNode(this.refs.img);
		this.canvasCtx = this.canvas.getContext('2d');
		this.canvas.width = 640;
		this.canvas.height = 640;		
		
		$(ReactDOM.findDOMNode(this)).modal('show');
		$(ReactDOM.findDOMNode(this)).on('hidden.bs.modal', this.props.handleResultClose);
	}

	render() {
		//===========================================================Count each answer
		if(this.props.result.multiple){
			var A=0, B=0, C=0, D=0, E=0, correct=0, wrong=0;
			for(var user in this.props.result.answer){
					 if (this.props.result.answer.hasOwnProperty(user)) {
						if(this.props.result.answer[user] == "A"){
							A+=1;
						}
						else if(this.props.result.answer[user] == "B"){
							B+=1;
						}
						else if(this.props.result.answer[user] == "C"){
							C+=1;
						}
						 else if(this.props.result.answer[user] == "D"){
							D+=1;
						}
						 else{
						 	E+=1;
						 }
					  }
				}
			
			//===========================================================Count correct & wrong answer
			for(var user in this.props.result.answerResult){
					 if (this.props.result.answerResult.hasOwnProperty(user)) {
						if(this.props.result.answerResult[user] == true){
							correct+=1;
						}
						 else{
						 	wrong+=1;
						 }
					  }
				}
		}
		
		return(
			  <div className="modal fade" data-backdrop="static">
				<div className="modal-dialog">
				  <div className="modal-content">
					<div className="modal-header">
					  <h4 className="modal-title" id="Label">Result</h4>
					</div>
					<div className="modal-body">
					  	<form>
							<canvas style={{width: "100%", height: "auto", display: this.state.prev}} ref="canvas" />
							<div style={{display: "none"}}>
								<img ref="img" src=""/>
							</div>
							<label id="Label">Subject</label>
							<p>{this.props.result.subject}<br/></p>
							{ this.props.result.multiple ? 
								<div>
									<label id="Label">Correct Answer</label>
									<p>{this.props.result.correctAnswer}<br/></p>
									<label id="Label">Class Answer</label>
									<li>A : {A}</li>
									<li>B : {B}</li>
									<li>C : {C}</li>
									<li>D : {D}</li>
									<li>No Answer : {E}</li><br/>
			
									<li>Correct Answer : {correct}</li>
									<li>Wrong Answer : {wrong}</li><br/>
			
									<label id="Label">Student Answer</label>
									{Object.keys(this.props.result.answer).map(
										(user, i) => {
											return (
												<div key={i}>
												<li> { this.props.result.answerResult[user] ?
												<span className="glyphicon glyphicon-ok"></span>
												:
												<span className="glyphicon glyphicon-remove"></span>
												} 
												{user} --> {this.props.result.answer[user]}
												</li>
												</div>
											)
										}
									 )

									}	
								</div> 					
							: 
								null								
//for Essay Question, still working on the image
/*<div>
									<table className="table">
										<tbody >
										<tr>
											<th>Student</th>
											<th>Answer</th>
										</tr>
										<tr style={{height: "400px", overflow: "auto"}}>
											<td className="col-sm-2">
											<ul className="nav nav-pills nav-stacked">
											{Object.keys(this.props.result.answer).map(
												(user, i) => {
													return (		
														<div key={i}>
														<li>{user}{ this.props.result.answerImage[user] ?
														<span className="glyphicon glyphicon-tag pull-right"></span>
														:
														null
														}
														</li>
														</div>
														
													)
												}
											 )

											}
											</ul>
											</td>
											<td>
											</td>
										</tr>
										</tbody>
									</table>
								</div>
*/
							}
						  <button type="button" className="btn btn-danger btn-block" data-dismiss="modal">Close</button>
						</form>
					  </div>
					</div>
				  </div>
				</div>
		)
	}
}
