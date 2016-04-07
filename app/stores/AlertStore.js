import uuid from 'node-uuid';
import alt from '../libs/alt';
import AlertActions from '../actions/AlertActions';
import server from '../libs/serverurls';

class AlertStore {
  constructor() {
    this.bindActions(AlertActions);

    this.alerts = [
    ]
  }
  add({path, type, text, timeout=0, canDisable=false}) {

    var newId = (new Date()).valueOf();
    var newAlert = {path, text, type, timeout};
    newAlert.id = newId;
    var alertList = ([newAlert]).concat(this.alerts);
    // console.log('add alert', text, type, timeout, alertList);
    this.setState({alerts: alertList});

    if (timeout) {
      window.setTimeout(() => {
        this.remove({id: newId, click:false});
      }, timeout > 500 ? timeout : 500);
    }
  }
  remove({id, click=true}) {

    // server.logIO.emit('update', Object.assign({cmd: 'alert/remove', click: click, timestamp: (new Date()).valueOf()}, this.alerts.find((alert) => alert.id === id)));
    var alertList = this.alerts.filter((alert) => alert.id !== id);
    this.setState({alerts: alertList});
  }
  cleanup() {

  }

}

export default alt.createStore(AlertStore, 'AlertStore');
