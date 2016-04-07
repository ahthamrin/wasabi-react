import uuid from 'node-uuid';
import alt from '../libs/alt';
import UserActions from '../actions/UserActions';
import server from '../libs/serverurls';

class UserStore {
  constructor() {
    this.bindActions(UserActions);

    this.loggedInUser = {};
    this.loginError = null;

    server.userIO.on('login', (msg) => {
      this.setState({
        loggedInUser: {username: msg.username, role: msg.role},
        loginError: msg.error
      });
    });
  }
  login({inputUser, inputPasswd}) {
    server.emit(server.userIO, {cmd:'login',msg: {inputUser,inputPasswd}});
  }
  logout() {
    server.emit(server.userIO, {cmd:'logout',msg:{}});
    this.setState({loggedInUser:{}});
  }
}

export default alt.createStore(UserStore, 'UserStore');
