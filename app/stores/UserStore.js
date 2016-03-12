import uuid from 'node-uuid';
import alt from '../libs/alt';
import UserActions from '../actions/UserActions';
import server from '../libs/serverurls';

class UserStore {
  constructor() {
    this.bindActions(UserActions);

    this.loggedInUser = {};
    this.loginError = null;
  }

  send(cmd,msg) {
    server.userIO.emit(cmd,msg);
  }

  fetch(cmd) {
    return new Promise((resolve, reject) => {
      server.userIO.once(cmd, (msg) => {
        // console.log('UserStore fetch', cmd, msg);
        resolve(msg);
      });
    });
  }

  login({inputUser, inputPasswd}) {
    this.fetch('login')
    .then((msg) => {
      this.setState({
        loggedInUser: {username: msg.username, role: msg.role},
        loginError: msg.error
      });
      // console.log('UserStore login',msg, this.state);
    });
    this.send('login',{inputUser,inputPasswd});

  }
  logout() {
    this.fetch('logout',this.loggedInUser.username);
    this.setState({loggedInUser:{}});
  }
}

export default alt.createStore(UserStore, 'UserStore');
