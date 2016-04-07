import uuid from 'node-uuid';
import alt from '../libs/alt';
import LiveClassActions from '../actions/LiveClassActions';
import server from '../libs/serverurls';

class ChatStore {
  constructor() {
    // this.bindActions(ChatActions);
    this.bindListeners({
      send: LiveClassActions.SEND_CHAT,
      joinClass: LiveClassActions.JOIN,
      leaveClass: LiveClassActions.LEAVE
    });

    this.chat = { id: null, sender: null, message: null, time:null, slide: 0, replyTo:null, recvTime:null};
    this.alerts = 0;
    this.notifs = 0;
    //original chat
    this.chats = [];
    //chat with #q
    this.threadChats = [];
    this.threadChange = 0;
    this.replyChats = [];
    this.user = null;
  }

  send(chat) {
    this.setState({chat: chat, chats: this.chats.concat([chat])});
    server.liveClassIO.emit('sendChat', chat);
  }

  joinClass({classId, user}) {
    this.setState({user});
    
    server.liveClassIO.on('sendChat', (chat) => {
      console.log("user ",this.user);
      console.log('sendChat', chat);

      var rawMessage = chat.message;
      var filter = rawMessage.split(" ");
      var d = new Date();
      var timestamp = d.getFullYear()+""+d.getMonth()+""+d.getDate()+""+d.getHours()+""+d.getMinutes()+""+d.getSeconds();
      chat.recvTime = timestamp;

      if (chat.sender !== this.user.username){
        console.log("Total chats [] =  ", this.chats);
        this.chats.push(chat);
      }
        //this #q used to express that the message is question
      if (filter[0]==="#q"){
        this.setState({notifs:1+this.notifs});
        this.threadChats.push({expand:false, lastseen:0, replyNotifs:0, original:chat, replies:[]});
        console.log('new threadChats', this.threadChats);
        this.setState({threadChange:chat.id});
      }

      //this replyTo!=null used to express that the message related to another message
      else if (chat.replyTo!==null){
        if (this.user.role === "student"){
          this.setState({notifs:1+this.notifs});
        }
        this.threadChats.map((tc, j) => {
          var nested = false;
          if (tc.original.id === chat.replyTo.rId){
            tc.replies.push(chat);
            nested = true;
          }
          else {
            tc.replies.map((rc, j) => {
              if (rc.id === chat.replyTo.rId){
                tc.replies.push(chat);
                nested = true;
              }
            });
          }
          if (nested===true && tc.expand===false){
            tc.replyNotifs=tc.replyNotifs+1;
          }
        });
        this.setState({threadChange:chat.id}); 
      }
      this.setState({chat:chat});
    });
    // server.slideIO.on('AlertTeacher', () => {
    //   console.log('AlertTeacher', arguments);
    //   if (this.user.role === 'lecturer')
    //     this.setState({alerts: 1+this.alerts});
    // });
  }

  leaveClass() {
    server.liveClassIO.removeAllListeners('sendChat');
  }
}

export default alt.createStore(ChatStore, 'ChatStore');
