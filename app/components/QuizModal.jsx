import React from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router'
// import Quiz from './Quiz.jsx';
import server from '../libs/serverurls'
import UserStore from '../stores/UserStore';

export default class QuizModal extends React.Component {
	
  constructor(props) {
    super(props);
	  
	this.state = {
		file: "",
        imagePreviewUrl: "",
		prev: "none",
	    quizAnswer: {answer: "", user: ""}
	};
	
	this._handleImageChange = this._handleImageChange.bind(this);
  }

	componentDidMount(){
	var userData = UserStore.getState();
    var loggedInUser = userData.loggedInUser;
    this.setState({user: userData.loggedInUser});

	//===========================================================Canvas for Quiz Question
	var container = ReactDOM.findDOMNode(this);
	this.canvas = ReactDOM.findDOMNode(this.refs.canvas);
	this.img = ReactDOM.findDOMNode(this.refs.img);
	this.canvasCtx = this.canvas.getContext('2d');
	this.canvas.width = 640;
	this.canvas.height = 640;

	if(this.img.height < this.img.width){
			this.canvas.height = this.canvas.height*this.img.height/this.img.width;
			this.canvasCtx.drawImage(this.img, 0, 0, this.canvas.width, this.canvas.height);
			console.log('lanscape ', this.img);
		}
		else{
			this.canvas.width = this.canvas.width*this.img.width/this.img.height;
			this.canvasCtx.drawImage(this.img, 0, 0, this.canvas.width, this.canvas.height);
			console.log('potrait ', this.img);
		}
	
	//===========================================================Canvas for Image Answer from Student
	if(this.props.quiz.multiple == false ){
		this.canvasAnswer = ReactDOM.findDOMNode(this.refs.canvasAnswer);
		this.imgAnswer = ReactDOM.findDOMNode(this.refs.imgAnswer);
		this.canvasCtxAnswer = this.canvasAnswer.getContext('2d');
		this.canvasAnswer.width = 640;
		this.canvasAnswer.height = 640;
	}
    
    $(ReactDOM.findDOMNode(this)).modal('show');
    $(ReactDOM.findDOMNode(this)).on('hidden.bs.modal', this.props.onCloseQuiz);
  }

	render() {
		var image_preview_input = {
			position: 'relative',
			overflow: 'hidden',
			margin: '0px',    
			color: '#333',
			backgroundColor: '#fff',
			borderColor: '#ccc'
		}
		
		var image_preview_input_title = {
			marginLeft: '2px'
			}
		
		var image_preview_input_file = {
			position: 'absolute',
			top: '0',
			right: '0',
			margin: '0',
			padding: '0',
			fontSize: '20px',
			cursor: 'pointer',
			opacity: '0',
			filter: 'alpha(opacity=0)'
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
							<label id="Label">Picture</label>
							<canvas style={{width: "100%", height: "auto"}} ref="canvas" />
							<div style={{display: "none"}}>
							<img ref="img" src={this.props.quiz.jpg}/>
							</div>
							<label id="Label">Subject</label>
							<p>{this.props.quiz.subject}<br/></p>
							<label id="Label">Question</label>
							<p>{this.props.quiz.question}<br/></p>
							<label id="Label">Answer</label>
							{ this.props.quiz.multiple ?
								<div>
									<input type="radio" checked={this.state.quizAnswer.answer === "A"} onClick={this.handleAnswerA}> A. {this.props.quiz.a}</input><br/>
									<input type="radio" checked={this.state.quizAnswer.answer === "B"} onClick={this.handleAnswerB}> B. {this.props.quiz.b}</input><br/>
									<input type="radio" checked={this.state.quizAnswer.answer === "C"} onClick={this.handleAnswerC}> C. {this.props.quiz.c}</input><br/>
									<input type="radio" checked={this.state.quizAnswer.answer === "D"} onClick={this.handleAnswerD}> D. {this.props.quiz.d}</input><br/>
								</div> 
								:
								<div>
									<div style={{display: "none"}}>
									<img ref="imgAnswer" src={this.state.imagePreviewUrl}/>
									</div>
									<span className="glyphicon glyphicon-hand-right"></span> Add Image
									<canvas style={{width: "100%", height: "auto", display: this.state.prev}} ref="canvasAnswer" />
									<span className="input-group-btn">
										<div className="btn btn-default" style={ image_preview_input }>
											<span className="glyphicon glyphicon-folder-open"></span>
											<span style={ image_preview_input_title }>Browse</span>
											<input type="file" style={image_preview_input_file} onChange={this._handleImageChange} />
										</div>
									</span>
									<span className="glyphicon glyphicon-hand-right"></span> Input Text
									<textarea rows='5' className="form-control" onChange={this.handleAnswerChange}></textarea><br/>	
								</div>
							}
							<br/>
						  <button type="button" className="btn btn-success btn-block" onClick={this.handleAnswerQuiz} data-dismiss="modal">Submit</button>
						</form>
					  </div>
					</div>
				  </div>
				</div>
		)
	}
	//===========================================================Input Handler
	handleAnswerChange = (event) => {
		this.state.quizAnswer.answer = event.target.value;
		console.log('Answer', event.target.value);
	}
	
	handleAnswerA = (event) => {
		this.setState({quizAnswer: {answer: "A"}});
		console.log('Answer A');
	}
	
	handleAnswerB = (event) => {
		this.setState({quizAnswer: {answer: "B"}});
		console.log('Answer B');
	}
	
	handleAnswerC = (event) => {
		this.setState({quizAnswer: {answer: "C"}});
		console.log('Answer C');
	}
	
	handleAnswerD = (event) => {
		this.setState({quizAnswer: {answer: "D"}});
		console.log('Answer D');
	}
	
	//===========================================================Aswer Quiz Sent
	handleAnswerQuiz = (event) => {
		if(this.state.prev != "none"){
			var jpg = this.canvasAnswer.toDataURL('image/jpeg', 0.6);
		}
		else{
			var jpg = "";
		}
		this.state.quizAnswer.user = this.state.user.username;
		console.log('Answer ', this.state.quizAnswer, "Answer picture", jpg);
		//alert("Answer Sent!");
	}
	
	//===========================================================Canvas Handler for Student Answer Image
	_handleImageChange(e) {
		e.preventDefault();
		this.canvasCtxAnswer.clearRect(0, 0, this.canvasAnswer.width, this.canvasAnswer.height);
		this.canvasAnswer.width = 640;
		this.canvasAnswer.height = 640;
		let reader = new FileReader();
		let file = e.target.files[0];

		reader.onloadend = () => {
		  this.setState({
			file: file,
			imagePreviewUrl: reader.result,
			prev: ""
		  });
			console.log('image answer', this.state);
			if(this.imgAnswer.height < this.imgAnswer.width){
				this.canvasAnswer.height = this.canvasAnswer.height*this.imgAnswer.height/this.imgAnswer.width;
				this.canvasCtxAnswer.drawImage(this.imgAnswer, 0, 0, this.canvasAnswer.width, this.canvasAnswer.height);
				console.log('lanscape answer', this.imgAnswer);
			}
			else{
				this.canvasAnswer.width = this.canvasAnswer.width*this.imgAnswer.width/this.imgAnswer.height;
				this.canvasCtxAnswer.drawImage(this.imgAnswer, 0, 0, this.canvasAnswer.width, this.canvasAnswer.height);
				console.log('potrait answer', this.imgAnswer);
			}
		}
		reader.readAsDataURL(file)
	}
}
