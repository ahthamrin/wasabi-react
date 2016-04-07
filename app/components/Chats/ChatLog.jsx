import React from 'react'
import ReactDOM from 'react-dom'

export default class ChatLog extends React.Component {
  constructor(props) {
    super(props);
    this.replyTo = '';
  }

  componentDidMount() {
    this.handleScrollDown();
  }

  componentDidUpdate() {
    this.handleScrollDown();
  }

  render() {
    // console.log('ChatLog', this.props);
    var chats = this.props.chats;
    var x;
    if(chats[0] && chats[0].reply){
      for (x = 0 ; x < chats[0].reply.length ; x+=1){
        chats.push(chats[0].reply[x])
      }
    }

    return(
      <div ref='container' className='chat-log'>
          { chats.map((c, i) => { 
              return(
                <div key={i} ref={c.id} className={c.sender === this.props.user.username ? 'chat-log-item self': 'chat-log-item'}>
                  <div className={c.replyTo ? 'chat-msg-reply': 'hidden'} onClick={this.scrollToReplied.bind(this, c)}>
                    {c.replyTo ? c.replyTo.rPreview : ''}
                  </div>
                  <div onClick={this.props.clickChat.bind(this, c)}>
                    <div className='chat-from'>{c.sender}</div>
                    <div className='chat-msg'>{c.message}</div>
                  </div>
                </div>
              )
            })
          }
          </div>
    )
  }

  //for change background color of chat list
  handleColorValue = (value) => {
    if(value.i%2==0){
      return "#eee";
    } else {
      return "#ccc";
    }
  }

  //for scrolling down chat log while there is a new chat
  handleScrollDown = (value) => {
    this.refs["container"].scrollTop = this.refs["container"].scrollHeight+1000;
  }

  //for scrolling to original chat (telegram style)
  scrollToReplied = (c) => {
    var EoT = this.refs[c.replyTo.rId].offsetTop;
    var EoH = this.refs[c.replyTo.rId].offsetHeight;
    var CoT = this.refs["container"].offsetTop;
    var CoH = this.refs["container"].offsetHeight;
    this.refs["container"].scrollTop = (EoH+EoT)-(CoT+CoH); 
  }

  //for get related message preview
  handleGetReplyMessage = (value) => {
    if(value==null){
      return null;
    } else {
      return value.rPreview;
    }
  }

  //for displaying related message preview
  handleDisplayRelatedMessagePreview = (value) => {
    if(value==null){
      return "none";
    } else {
      return "";
    }
  }
}