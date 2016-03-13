import React from 'react';
import ReactDOM from 'react-dom';
import UserActions from '../actions/UserActions';
import UserStore from '../stores/UserStore';
import { hashHistory, Link } from 'react-router';

export default class UserLogin extends React.Component {
  constructor(props) {
    super(props);

    this.state = UserStore.getState();
    this.state.swipe = 0;
    this.state.userAgent = navigator.userAgent;
  }
  componentDidMount() {
    UserStore.listen(this.storeChanged);

/*    // using jQuery-touchswipe plugin
    var container = ReactDOM.findDOMNode(this);
    $(container).swipe({
      tap : () => {
        this.handleSwipe('tap',arguments);
      }
    })
    .swipe({
      swipe: (event, direction, distance, duration, fingerCount, fingerData) => {
        this.handleSwipe('swipe '+direction+' '+fingerCount, arguments); 
      }
    });
*/  }
  componentWillUnmount() {
    UserStore.unlisten(this.storeChanged);
  }
  storeChanged = (state) => {
    this.setState(state);

    // if login was clicked and no error, redirect to class page
    if (state.loggedInUser.username) {
      hashHistory.push('/about');
    }
  }
  render() {
      return (
        <div className="row">
          <h3>WASABI Login</h3>
          <div><label ref="labelUsername">Username:</label> <input type="text" className="input" onBlur={this.handleInputUser} /></div>
          <div><label>Password:</label> <input type="password" className="input" onBlur={this.handleInputPasswd} /></div>
          <div><button type="button" className="btn btn-default add-note" onClick={this.userLogin}>
          Login
          </button></div>
          <div>
          {(() => {
              if (this.state.loginError) {
                return "Username and password do not match.";
              }
          })()}
          </div>
          <div id="mod">{this.state.time}</div>
        </div>
      );
    // }
  }
  handleInputUser = (event) => {
    this.setState({inputUser:event.target.value});
    // console.log('handleInputUser',this.state);
  }
  handleInputPasswd = (event) => {
    this.setState({inputPasswd:event.target.value});
    // console.log('handleInputPasswd',this.state);
  }
  handleSwipe = (event) => {
    console.log('handleSwipe', event, arguments);
    this.setState({time: event+' '+(new Date()).toString()});
  }
  userLogin = (event) => {
    // console.log('userLogin',this.state);
    UserActions.login(this.state);
  }
}
