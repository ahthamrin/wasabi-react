import uuid from 'node-uuid';
import alt from '../libs/alt';
import QuestionActions from '../actions/QuestionActions';
import server from '../libs/serverurls';

class QuestionStore {
  constructor() {
    this.bindActions(QuestionActions);

    this.question = { sender: null, questionMsg: null};

    this.notifs = 0;
    this.alerts = 0;

    this.questions = [];

  }

  input(question) {
    this.setState({question: question, questions: this.questions.concat([question])});
  }

  send() {
    server.slideIO.emit('AskQuestion', question);
  }

  sub({slideDeckId, user}) {
    this.setState({user});

    server.slideIO.on('AskQuestion', ({sender, questionMsg}) => {
      console.log('AskQuestion', {sender, questionMsg}, this.questions);

      if (sender !== this.user.username)
        this.setState({sender: sender, questionMsg: questionMsg, questions: this.questions.concat([{sender, questionMsg}]), notifs: 1+this.notifs});
    });

    server.slideIO.on('AlertTeacher', () => {
      console.log('AlertTeacher', arguments);
      if (this.user.role === 'lecturer')
        this.setState({alerts: 1+this.alerts});
    });
  }

  unsub() {
    server.slideIO.emit('unsubSlide',{});
    server.slideIO.removeAllListeners();
  }
}

export default alt.createStore(QuestionStore, 'QuestionStore');
