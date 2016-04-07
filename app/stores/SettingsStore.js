import uuid from 'node-uuid';
import alt from '../libs/alt';
import SettingsActions from '../actions/SettingsActions';
import server from '../libs/serverurls';

class SettingsStore {
  constructor() {
    this.bindActions(SettingsActions);
  }
  set({settings}) {

  }
  get({settings}) {

  }
}

export default alt.createStore(SettingsStore, 'SettingsStore');
