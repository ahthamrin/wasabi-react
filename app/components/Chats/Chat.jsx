import React from 'react';
import ReactDOM from 'react-dom';
import ChatLog from './ChatLog.jsx';

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.chatMsg = '';
    this.state = {
      repliedUser : '',
      repliedId : '',
      repliedMessage : ''
    }
    this.slide = '';
  }

  componentDidMount() {
    this.chatCollapsed = false;
    this.handleCollapseChat();
  }

  render() {
    this.replyClass = this.state.repliedId ? 'flex' : 'hidden';
    return(
      <div ref='chat-container' className='chat-container collapse'>
        <div className='chat-collapse-header'>
          <span className='chat-from'><i className='fa fa-comments-o'></i></span>
          <i onClick={this.handleCollapseChat} ref='chat-collapse-icon' className='icon-pointer fa fa-chevron-down'></i>
        </div>
        <ChatLog
          chats={this.props.chat.chats}
          user={this.props.user}
          clickChat={this.setReply} />

        <div ref='chatInput' className='chat-input'>
          <div ref='reply' className={this.replyClass}>
            <div className='icon-middle'><i className='fa fa-reply'></i></div>
            <div className='chat-from inline'>{this.state.repliedUser}</div>
            <div className='chat-msg stretch inline'>{this.state.repliedMessage}</div>
            <i className='fa fa-remove icon-pointer' onClick={this.clearReply}></i>
          </div>
          <div ref='chatMsg'>
            <div className='form-inline flex'>
            <input className='form-control stretch' type='text' ref='chatTextInput' onChange={this.handleInputChange} />
            <button type='button' className='btn btn-sm' onClick={this.handleSend}>
            Send
            </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  handleCollapseChat = (event) => {
    this.chatCollapsed = !this.chatCollapsed;
    console.log('handle collapse ', this.chatCollapsed);

    if (this.chatCollapsed) {
      this.refs['chat-container'].className='chat-container collapse';
      this.refs['chat-collapse-icon'].className='icon-pointer fa fa-chevron-down';
    }
    else {
      this.refs['chat-container'].className='chat-container expand';
      this.refs['chat-collapse-icon'].className='icon-pointer fa fa-chevron-up';
    }
  }

  handleInputChange = (event) => {
    if (this.chatMsg.length === 0 && event.target.value.length){
      this.slide = this.props.slide.slideNoLocal;
    }
    this.chatMsg = event.target.value;
  }

  handleSend = (event) => {
    if (this.chatMsg.length === 0)
      return;

    var d = new Date();
    var timestamp = parseInt(d.getFullYear()+""+d.getMonth()+""+d.getDate()+""+d.getHours()+""+d.getMinutes()+""+d.getSeconds());
    var id = timestamp.toString()+this.props.user.username;
    var chat = {
          id:id, 
          sender: this.props.user.username, 
          message: this.chatMsg, 
          time:timestamp, 
          slide:this.slide,
          replyTo: null
        };

    if (this.state.repliedId) {
      var replyShort = this.state.repliedMessage.length > 10 ? this.state.repliedMessage.substring(0,10)+'...' : this.state.repliedMessage;
      chat.replyTo = {
        rId: this.state.repliedId,
        rPreview: this.state.repliedUser + ' : ' + replyShort
      }
    }
    this.clearReply();
    this.clearInput();
    this.refs['chatTextInput'].focus();
    this.props.onSend(chat);
  }

  setReply = (reply) => {
    console.log('setReply', reply);
    this.setState({repliedId: reply.id, repliedUser: reply.sender, repliedMessage: reply.message});
    this.refs['chatTextInput'].focus();
  }

  clearReply = () => {
    this.setState({repliedUser: '', repliedId: '', repliedMessage: ''});
    this.refs['chatTextInput'].focus();
  }

  clearInput = () => {
    this.chatMsg = '';
    this.refs['chatTextInput'].value = '';
  }

}