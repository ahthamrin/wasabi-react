import uuid from 'node-uuid';
import alt from '../libs/alt';
import StudentUIActions from '../actions/StudentUIActions';
import server from '../libs/serverurls';

class StudentUIStore {
  constructor() {
    this.bindActions(StudentUIActions);

    this.videoLarge = false;

  }
  toggleVideoSize() {
    this.setState({videoLarge: !this.videoLarge});
  }
}

export default alt.createStore(StudentUIStore, 'StudentUIStore');
