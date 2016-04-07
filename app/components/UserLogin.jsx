import React from 'react';
import ReactDOM from 'react-dom';
import UserActions from '../actions/UserActions';
import UserStore from '../stores/UserStore';
import { hashHistory, Link } from 'react-router';

export default class UserLogin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};//Object.assign({}, UserStore.getState());
    this.state.swipe = 0;
    this.state.userAgent = navigator.userAgent;
    this.state.loggedInUser = {};
  }
  componentDidMount() {

    UserStore.listen(this.storeChanged);
    this.storeChanged(UserStore.getState());
  }
  componentWillUnmount() {
    UserStore.unlisten(this.storeChanged);
  }
  storeChanged = (state) => {
    this.setState({loggedInUser: state.loggedInUser, loginError: state.loginError});

    // if login was clicked and no error, redirect to class page
    if (state.loggedInUser.username) {
      hashHistory.push('/about');
    }
  }
  render() {
    if (!this.state.loggedInUser.username)
      return (
        <div className="container">
          <form className="form-signin">
            <h2 className="form-signin-heading">WASABI: Please sign in</h2>
            <label htmlFor="input-Email" className="sr-only">Email address</label>
            <input ref="inputUser" type="text" id="input-Email" className="form-control" placeholder="Username" required autofocus  />
            <label htmlFor="input0Password" className="sr-only">Password</label>
            <input ref="inputPasswd" type="password" id="input-Password" className="form-control" placeholder="Password" required  />
            <button className="btn btn-lg btn-primary btn-block" type="button" onClick={this.userLogin}>Sign in</button>
          </form>

          <div>
          {(() => {
              if (this.state.loginError) {
                return "Username and password do not match.";
              }
          })()}
          </div>
        </div>
      );
  else
    return(
      <div className="container">

      <h2>Welcome to WASABI App</h2>

      </div>
      );
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
    this.inputUser = ReactDOM.findDOMNode(this.refs.inputUser);
    this.inputPasswd = ReactDOM.findDOMNode(this.refs.inputPasswd);
    console.log('userLogin',this.inputUser, this.inputPasswd);
    var state = {inputUser: this.inputUser.value, inputPasswd: this.inputPasswd.value, timestamp: (new Date()).valueOf() };
    UserActions.login(state);
    return false;
  }
}
