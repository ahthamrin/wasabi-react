import React from 'react';

export default class QuizShow extends React.Component {
  render() {
    return (
      <div>
        <div>
          <span>QUIZ</span> {this.props.question}
        </div>
        {this.props.choices.map((choice, i) => {
          return (
            <div className onClick={this.props.answer.bind(this, i)} key={i}>
              {choice}
            </div>
          );
        })}
      </div>
    );
  }
}
