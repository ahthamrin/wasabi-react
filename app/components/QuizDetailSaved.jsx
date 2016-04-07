import React from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router'
import server from '../libs/serverurls'
import UserStore from '../stores/UserStore';

export default class QuizDetailSaved extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {prev: "none"};
  	}

	componentDidMount(){
		var userData = UserStore.getState();
		var loggedInUser = userData.loggedInUser;
		this.setState({user: userData.loggedInUser});
		
		var container = ReactDOM.findDOMNode(this);

		this.canvas = ReactDOM.findDOMNode(this.refs.canvas);
		this.img = ReactDOM.findDOMNode(this.refs.img);
		this.canvasCtx = this.canvas.getContext('2d');
		this.canvas.width = 640;
		this.canvas.height = 640;		
		
		if(this.props.jpg != ""){
			this.setState({prev: ""});
		}
		else {
			this.setState({prev: "none"});
		}
		
		if(this.img.height < this.img.width){
				this.canvas.height = this.canvas.height*this.img.height/this.img.width;
				this.canvasCtx.drawImage(this.img, 0, 0, this.canvas.width, this.canvas.height);
				console.log('lanscape ', this.img);
			}
			else {
				this.canvas.width = this.canvas.width*this.img.width/this.img.height;
				this.canvasCtx.drawImage(this.img, 0, 0, this.canvas.width, this.canvas.height);
				console.log('potrait ', this.img);
			}
		
		$(ReactDOM.findDOMNode(this)).modal('show');
		$(ReactDOM.findDOMNode(this)).on('hidden.bs.modal', this.props.handleDetailSavedClose);
	}

	render() {
		var picture;
		if(this.props.jpg != ""){
			picture = <label id="Label">Picture</label>;
		}
		else {
			picture = "";
		}
		var answer, time;
		if (this.props.quiz.maxAnswer != ""){
			answer = this.props.quiz.maxAnswer + " Person";
		}
		else{
			answer = "---";
		}
		
		if (this.props.quiz.time != ""){
			time = this.props.quiz.time + " Minute";
		}
		else{
			time = "---";
		}
		
		return(
			  <div className="modal fade" data-backdrop="static">
				<div className="modal-dialog">
				  <div className="modal-content">
					<div className="modal-header">
					  <h4 className="modal-title" id="Label">Quiz</h4>
					</div>
					<div className="modal-body">
					  	<form>
							<label id="Label">Information</label>
							<p>Max Answer : {answer}</p>
							<p>Time Limit : {time}</p>
							{picture}
							<canvas style={{width: "100%", height: "auto", display: this.state.prev}} ref="canvas" />
							<div style={{display: "none"}}>
								<img ref="img" src={this.props.jpg}/>
							</div>
							<label id="Label">Subject</label>
							<p>{this.props.quiz.subject}<br/></p>
							<label id="Label">Question</label>
							<p>{this.props.quiz.question}<br/></p>
							{ this.props.quiz.multiple ? 
								<div>
									<label id="Label">Correct Answer</label>
									<p>{this.props.quiz.correctAnswer}<br/></p>
								</div> 
							: null }
						  <button type="button" className="btn btn-danger btn-block" data-dismiss="modal">Close</button>
						</form>
					  </div>
					</div>
				  </div>
				</div>
		)
	}
}
