import React from 'react'
import ReactDOM from 'react-dom'
//add for chat and lecture note feature

export default class QuestionModal extends React.Component {
  
  constructor(props) {
    super(props);
    props.handleAnswer
    this.chatMsg = '';
    this.repliedQuestion= '';
    this.repliedQuestionId= '';
    this.repliedPerson= '';
    //show textAreaStat used for hide/unhide text area for replying message. unhide first 
    this.state = {  
      threadChange: 0,
      textAreaStat: 'none',                 
      chatIndex: 0 
    }
    this.threadGroups=[];
  }

  componentDidMount(){
    $(ReactDOM.findDOMNode(this)).modal('show');
    $(ReactDOM.findDOMNode(this)).on('hidden.bs.modal', this.props.handleHideModal);
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.threadChange !== nextProps.threadChange){
      console.log('nextProps ', nextProps);
      this.setState({threadChange:nextProps.threadChange});
    }
    this.handleScrollDown(nextProps.threadChats);
  }

  render() {
    return(
      <div className='modal fade'>
          <div className='modal-dialog'>
            <div className='modal-content'>
              <div className='modal-header'>
                <button type='button' className='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>
                <h4 className='modal-title'>Questions</h4>
              </div>
              <div className='modal-body'>
                <div ref='modal' style={{maxHeight:'80vh',overflow:'auto'}}>
                  {this.props.threadChats.map((c, i) => { 
                    // var object = c;
                    //this.threadGroups[c.id] = this.threadGroups.concat([{object}]);
                    //console.log('tg ',this.threadGroups);
                    return(
                      <div className='question q-block' key={i}>
                        <div className='flex'>
                          <div className='question q-from stretch'>{c.original.sender}</div>
                          <div>
                            <button type='button' className='btn btn-secondary btn-sm'
                              onClick={this.expand.bind(this,c,i)} >
                              {this.handleCheckNotify(c)} <i className='fa fa-chevron-down'/>
                            </button>
                          </div>
                        </div>
                        <div className='question chat-msg' onClick={this.clickChat.bind(this, c.original, i)}>{c.original.message} <span className='question slide-no'> on slide #{c.original.slide} </span></div>
                        <div ref={c.original.id} style={{display: 'none', width:'100%',maxHeight:'100px',overflow:'auto'}}>
                          {c.replies.map((d, j) => {
                            return(
                              <div key={j} onClick={this.clickChat.bind(this, d, i)}>
                                <span className='question q-from'>{d.sender}</span> : {d.message} 
                              </div>
                              )
                            })
                          }
                        </div>
                      </div>
                    )}
                    )
                  }
                </div>
                <div className='q-reply-block' style={{display: this.state.textAreaStat}}>
                  <div className='flex'>
                    <div className='stretch'>
                      Reply to:
                    </div>
                    <div>
                      <span className='icon-pointer' onClick={this.reset} >&times;</span>
                    </div>
                  </div>
                  <div>
                    <span className='question q-from'>{this.repliedPerson}</span>
                    : {this.repliedQuestion}
                  </div>
                  <div className='flex'>
                    <textarea ref='textarea' rows='2' className='stretch' onChange={this.handleInputChange} />
                    <div>
                      <button                     
                        className='btn btn-primary'
                        onClick={this.handleSend} >
                        <span className='glyphicon glyphicon-ok'></span>
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    )
  }

  //for change background color of chat list
  handleColorValue = (value) => {
    if(value.j%2==0){
      return '#eee';
    } else {
      return '#ccc';
    }
  }

  //for checking relation between chat and the other chat
  handleCheckNotify = (threadChats) => {
    var notify = 0;
    threadChats.replies.map((e, j) => {
      console.log('recv',e.recvTime);
      console.log('msg',e.message);
      console.log('ls',threadChats.lastseen);
            if (threadChats.expand === false && (threadChats.lastseen === 0 || e.recvTime >= threadChats.lastseen)){
              notify = 1+notify;
            } else if (threadChats.expand === true){
              notify = 0;
            }
        });
    return notify;
  }


  handleInputChange = (event) => {
    this.chatMsg = event.target.value;
  }

  handleSend = (event) => {
    var timestamp = this.getTimestamp();
    var id = timestamp+this.props.username;
    var str = this.repliedQuestion;
    if(str.length > 10) str = str.substring(0,10)+'...';
    var prev = this.repliedPerson+' : '+str;
    var chat = {  id:id, 
            sender: this.props.username, 
            message: this.chatMsg, 
            time:timestamp, 
            replyTo:{ rId : this.repliedQuestionId,
                  rPreview : prev },
          };
    this.props.onSend(chat);
    this.reset();
  }

  //for scrolling down chat log while there is a new chat
  // handleScrollDown = (value) => {
  //   console.log('value',value);
  //   console.log('refs',this.refs[value]);
  //   this.refs[value].scrollTop = this.refs[value].scrollHeight+1000;
  // }

  handleScrollDown = (threadChats) => {
    threadChats.map((a, j) => {
      var refs = this.refs[a.original.id];
      if(refs!==undefined){
        this.refs[a.original.id].scrollTop = this.refs[a.original.id].scrollHeight+1000;
      } else{
        this.refs['modal'].scrollTop = this.refs['modal'].scrollHeight*2;
      }
    });
  }

  //for responding when chat's clicked 
  //the chat will use to reply form
  clickChat = (c, i) => {
    this.repliedQuestion= c.message;
    this.repliedQuestionId= c.id;
    this.repliedPerson= c.sender;
    this.setState({ textAreaStat: '',
                    chatIndex: i });
    this.refs['textarea'].value='';
  }

  //for initiatialize data and close reply's form
  reset = (event) => {
    this.refs['textarea'].value='';
    this.repliedQuestion= '';
    this.repliedQuestionId= '';
    this.repliedPerson= '';
    this.setState({ textAreaStat: 'none',
                    chatIndex: 0 });
    
  }

  //for expanding reply list
  expand = (threadChats,i) => {
    threadChats.lastseen = this.getTimestamp();
    if(this.refs[threadChats.original.id]!=null){
      var now = this.refs[threadChats.original.id].style.display;
      if (now=='none')
      {
        threadChats.expand = true;
        this.refs[threadChats.original.id].style.display='';
      } else {
        this.refs[threadChats.original.id].style.display='none';  
        threadChats.expand = false;
      }
    }
    this.handleScrollDown(this.props.threadChats);
    this.setState({
      threadChange : threadChats.original.id
    });
    this.props.threadChats[i] = threadChats;
  }

  getTimestamp = () => {
    var d = new Date();
    var timestamp = d.getFullYear()+''+d.getMonth()+''+d.getDate()+''+d.getHours()+''+d.getMinutes()+''+d.getSeconds();
    return timestamp;
  }
}

