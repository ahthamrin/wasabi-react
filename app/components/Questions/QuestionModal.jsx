import React from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router'
import Question from './Question.jsx';

export default class QuestionNotif extends React.Component {
	
  constructor(props) {
    super(props);
    props.handleAnswer
    this.state = { showTextArea: false,
                   questionIndex: 0 }    
  }

	componentDidMount(){
    $(ReactDOM.findDOMNode(this)).modal('show');
    $(ReactDOM.findDOMNode(this)).on('hidden.bs.modal', this.props.handleHideModal);
  }

  //triggered when a question is clicked
  //makes the text area appear
  clickQuestion = (c, i) => {
    this.setState({ showTextArea: true,
                    questionIndex: i })
  }

	render() {
		var icon_style = { backgroundColor: "yellow",
		              		 borderRadius:100,
		              		 height: 30,
		              		 width: 30,
		              		 float: "left",
 										   marginRight: 10 }

    var question_style = { padding: 10,
                           border: "1px #DAD9D4 solid" }
		return(
      <div className="modal fade">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 className="modal-title">Questions</h4>
            </div>
            <div className="modal-body">
              { this.state.showTextArea ? 
                <Question 
                  questionInput={this.props.questionInput}
                  clickQuestion={this.props.clickQuestion.bind(this, this.state.questionIndex)}
                  questions={[this.props.questions[this.state.questionIndex]]}/> :
                 this.props.questions.map(
                      (c, i) => {
                        return(
                          <div style={question_style} key={i} onClick={this.clickQuestion.bind(this, c, i)}>
                            <div style={ icon_style }></div>
                            <div style={{fontWeight: "bold"}}>
                              {c.sender}
                            </div>
                            <div>
                               {c.questionMsg} 
                            </div>
                          </div>
                        )}
                    )
              }
            </div>
          </div>
        </div>
      </div>
		)
	}
}
