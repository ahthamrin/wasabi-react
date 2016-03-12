import uuid from 'node-uuid';
import alt from '../libs/alt';
import SlideActions from '../actions/SlideActions';
import server from '../libs/serverurls';

class SlideStore {
  constructor() {
    this.bindActions(SlideActions);

    this.slideDeckId = null;
    this.slideDeckData = null;
    this.slideDeckLength = 0;
    this.slideNoLecturer = 0;
    this.slideNoLocal = 0;
    this.lecturer = null;

    this.sender = null;
    this.questionMsg = null;

    this.notifs = 0;
    this.alerts = 0;
  }

  emit({cmd,msg}) {
    server.slideIO.emit(cmd,msg);
  }


  send(cmd,msg) {
    server.slideIO.emit(cmd,msg);
  }

  fetch(cmd) {
    return new Promise((resolve, reject) => {
      server.slideIO.once(cmd, (msg) => {
        console.log('SlideStore fetch', cmd, msg);
        resolve(msg);
      });
    });
  }

  subSlide({slideDeckId, user}) {
    server.slideIO.emit('subSlide',{slideDeckId, user});
    this.setState({slideDeckId});
    console.log('subSlide', this.slideDeckId);

    if (!this.slideDeckData) {
      this.fetchSlideDeck(slideDeckId);
    }

    var slideUpdateId = 'slideUpdate/'+slideDeckId;
    server.slideIO.on(slideUpdateId, ({slideNoLecturer, lecturer}) => {
      console.log('slideUpdate', slideUpdateId, {slideNoLecturer, lecturer});
      var recvSlide = {slideNoLocal: slideNoLecturer, slideNoLecturer: slideNoLecturer, lecturer: lecturer};
      this.setState(recvSlide);
    });

//================================================================================>> This is Changed
  server.slideIO.on('pushQuizQuestion', ({question}) => {
    var quiz = {quizStat: true, question: question}
    this.setState(quiz);
  });
   server.slideIO.on('pushQuizAnswer', ({username, answer}) => {
    var quizAnswer = {answStat: true, username: username, answer: answer}
    this.setState(quizAnswer);
  });
//================================================================================>


  }

  unsubSlide(slideDeckId) {
    server.slideIO.emit('unsubSlide',{slideDeckId});
    this.setState({slideDeckId: -1});

    server.slideIO.removeAllListeners();
  }

  changeSlideLocal({slideNoLocal}) {
    this.setState({slideNoLocal});
    // console.log('changeSlideLocal', {slideNoLocal}, this.state);
    server.slideIO.emit('pushLocalSlide',{slideDeckId:this.slideDeckId, slideNoLocal:slideNoLocal});
  }

  fetchSlideDeck(slideDeckId) {
    $.getJSON(server.slidesUrl+slideDeckId)
    .done((data) => {
      var modData = data.slideDeckData.map((d) => {
        d.url = server.slidesUrl+this.slideDeckId+'/'+d.url;
        d.urlThumb = server.slidesUrl+this.slideDeckId+'/'+d.urlThumb;
        return d;
      });
      data.slideDeckData = modData;
      this.setState(data);
      console.log('fetchSlideDeck', data);
      /*
      [{
        slideId: Number,
        slideNo: Number,
        title: String,
        url: String,
        urlThumb: String
      }...]
      */
    });
  }
}

export default alt.createStore(SlideStore, 'SlideStore');
