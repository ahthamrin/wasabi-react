import React from 'react'
import { Link } from 'react-router'
import AlertActions from '../actions/AlertActions';
import AlertStore from '../stores/AlertStore';

export default class Alert extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      alerts: []
    }
  }
  componentDidMount() {
    AlertStore.listen(this.handleAlertStore);
    // this.testTimeout();
  }
  componentWillUnmount() {
    AlertStore.unlisten(this.handleAlertStore);
    // window.clearTimeout(this.timeout);
  }

  handleAlertStore = (state) => {
    this.setState(state);
  }
  remove(id) {
    AlertActions.remove({id});
  }

  testTimeout() {
    AlertActions.add({
      type: ['success', 'info', 'warning', 'danger'][parseInt(Math.random()*4)],
      text: (new Date()).toString(),
      timeout: Math.random() > 0.8 ? parseInt(Math.random()*2000) : 0
    });

    this.timeout = window.setTimeout(() => {
      this.testTimeout();
    },3000+Math.random()*6000);
  }

  render() {
    return(
    	<div style={{zIndex: this.props.zIndex || 2, position: 'absolute'}}>
      {
        this.state.alerts.map((alert) => {
          var className = 'alert alert-dismissible alert-'+alert.type;
          return(
            <div className={className} role='alert' key={alert.id}>
              <button type='button' className='close' aria-label='Close'
              onClick={() => this.remove(alert.id)}><span aria-hidden='true'>&times;</span></button>
              {alert.text}
            </div>
          );
        })

      }
    	</div>
    )
  }
}

        // <div className="alert alert-danger alert-dismissible" role="alert">
        //   <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        //   <strong>Warning!</strong> Better check yourself, you're not looking too good.
        // </div> 
