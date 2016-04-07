import React from 'react';
import Header from './Header.jsx';
import UserStore from '../stores/UserStore';
import UserActions from '../actions/UserActions';
import { hashHistory, Link } from 'react-router';
import AltContainer from 'alt-container';
import server from '../libs/serverurls';
import MediaActions from '../actions/MediaActions';
import Alert from './Alert.jsx';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { classId: 100 }; // get from Store

  }
  componentDidMount() {
    console.log('app componentDidMount');
    // UserStore.listen(this.userStoreChanged);
    var userStoreVal = UserStore.getState();
    // if (userStoreVal.loggedInUser)
    //   this.setState(userStoreVal.loggedInUser, () => {
    //     console.log('Mounted', this.state)
    //   });
  }
  componentWillReceiveProps() {
    // var userStoreVal = UserStore.getState();
    // if (userStoreVal.loggedInUser)
    //   this.setState({user: userStoreVal.loggedInUser});
    console.log('App componentWillReceiveProps', this.state);
  }
  render() {
      console.log('render App', this.state, this.props);
    return(
      <div>
        <AltContainer
          store={UserStore}
          >
          <Header location={this.props.location} classId={this.state.classId} onLogout={this.logout}/>
        </AltContainer>
        <AltContainer
          store={UserStore}
        >
        {this.props.children}
        </AltContainer>
      </div>
    )
  }
  userStoreChanged = (state) => {
    console.log('App userStoreChanged', state);
    var userStoreVal = UserStore.getState();
    if (userStoreVal.loggedInUser)
      this.setState(userStoreVal.loggedInUser, () => {
        console.log('changed', this.state)
      });

    if (!state.loggedInUser) {
      hashHistory.push('/');
    }
  }
  logout = () => {
    // MediaActions.disconnectVideo();
    MediaActions.stopLocalStream();
    UserActions.logout();
    this.setState({user:{}});

    hashHistory.push('/');

  }
}

