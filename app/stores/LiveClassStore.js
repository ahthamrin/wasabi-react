import uuid from 'node-uuid';
import alt from '../libs/alt';
import LiveClassActions from '../actions/LiveClassActions';
import server from '../libs/serverurls';

class LiveClassStore {
  constructor() {
    this.bindActions(LiveClassActions);

    this.classId = null;
    this.user = null;

    this.slideDeckId = 0;
    this.slideDeckData = [];
    this.slideDeckLength = 0;
    this.slideDeckTimestamp = 0;
    this.slideNoLecturer = 0;
    this.slideNoLocal = 0;
    this.lecturer = null;
  }

  join({classId, user}) {
    // join class. listen to join
    this.setState({classId, user});
    console.log('LiveClassStore', classId, user);

    server.liveClassIO.on('joinClass', this.handleJoinClass);
    // a user joins class
    server.liveClassIO.on('leaveClass', this.handleLeaveClass);
    // a user leaves class
    server.liveClassIO.on('updateSlideDeck', this.handleUpdateSlideDeck);
    // update slidedeck data
    server.liveClassIO.on('updateSlideNo', this.handleUpdateSlideNo);
    // update slide number
    // server.liveClassIO.on('updateCapture', this.handleUpdateCapture);
    // student sends image capture

/*    server.liveClassIO.on('sendChat', function(msg) {
      // chat
    });

    server.liveClassIO.on('sendQuiz', function(msg) {
      // quiz problem from lecturer
    });

    server.liveClassIO.on('sendQuizResponse', function(msg) {
      // quiz response from student
    });
*/

    server.liveClassIO.on('log', function(msg) {
      // log
    });

    server.liveClassIO.emit('joinClass', {classId, user});
    this.setState({slideDeckId: classId});
    this.preventDefault();
  }

  handleJoinClass = (msg) => {
    console.log('handleJoinClass', msg);
  }

  leave({classId, user}) {
    server.liveClassIO.emit('leaveClass', {classId, user});
    // leave class. remove all listeners
    this.preventDefault();
  }

  handleLeaveClass = (msg) => {
    console.log('handleLeaveClass', msg);

  }

  setSlideDeck({slideDeckId}) {

  }

  handleUpdateSlideDeck = (msg) => {
    console.log('handleUpdateSlideDeck', msg);
    var modData = msg.slideDeckData.map((d) => {
      d.url = server.slidesUrl+this.slideDeckId+'/'+d.url;
      d.urlThumb = server.slidesUrl+this.slideDeckId+'/'+d.urlThumb;
      return d;
    });
    this.setState({
      slideNoLocal: msg.slideNoLecturer,
      slideNoLecturer: msg.slideNoLecturer,
      slideDeckData: modData,
      slideDeckLength: msg.slideDeckLength,
      slideDeckTimestamp: (new Date()).getTime()
    });
  }

  gotoSlide({slideNoLocal}) {
    this.setState({slideNoLocal});
    // console.log('changeSlideLocal', {slideNoLocal}, this.slideNoLocal);
    server.liveClassIO.emit('updateSlideNo',{slideDeckId:this.slideDeckId, slideNo:slideNoLocal});
  }

  handleUpdateSlideNo = (msg) => {
    var recvSlide = {slideNoLecturer: msg.slideNoLecturer, lecturer: msg.username};

    if (this.user.role === 'student')
      recvSlide.slideNoLocal = msg.slideNoLecturer;

    this.setState(recvSlide);
  }

  sendVideoCapture({jpg, timestamp}) {
    server.liveClassIO.emit('updateCapture', {jpg, timestamp});
    this.preventDefault();
  }

  handleUpdateCapture = (msg) => {

  }

  emit({cmd,msg}) {
    server.slideIO.emit(cmd,msg);
  }

  fetch(cmd) {
    return new Promise((resolve, reject) => {
      server.liveClassIO.once(cmd, (msg) => {
        console.log('LiveClassStore fetch', cmd, msg);
        resolve(msg);
      });
    });
  }

/*  subscribe({slideDeckId, user}) {
    server.slideIO.emit('subSlide',{slideDeckId, user});
    this.setState({slideDeckId, user});
    console.log('subSlide', this.slideDeckId);

    if (!this.slideDeckData.length) {
      this.fetchSlideDeck(slideDeckId);
    }

    server.slideIO.on('slideUpdate', ({slideNoLecturer, username}) => {
      // console.log('slideUpdate', slideUpdateId, {slideNoLecturer, username});
      var recvSlide = {slideNoLecturer: slideNoLecturer, lecturer: username};

      if (this.user.role === 'student')
        recvSlide.slideNoLocal = slideNoLecturer;

      this.setState(recvSlide);
    });
  }

  unsubscribe(slideDeckId) {
    server.slideIO.emit('unsubSlide',{slideDeckId});
    this.setState({slideDeckId: -1});

    server.slideIO.removeAllListeners();
  }

  fetchSlideDeck(slideDeckId) {
    $.getJSON(server.slideDeckUrl+slideDeckId)
    .done((data) => {
      var modData = data.slideDeckData.map((d) => {
        d.url = server.slidesUrl+this.slideDeckId+'/'+d.url;
        d.urlThumb = server.slidesUrl+this.slideDeckId+'/'+d.urlThumb;
        return d;
      });
      data.slideDeckData = modData;
      data.slideDeckTimestamp = (new Date()).getTime();
      this.setState(data);
      console.log('fetchSlideDeck', data);
      
      // [{
      //   slideId: Number,
      //   slideNo: Number,
      //   title: String,
      //   url: String,
      //   urlThumb: String
      // }...]
      
    });
  }
*/
}

export default alt.createStore(LiveClassStore, 'LiveClassStore');
