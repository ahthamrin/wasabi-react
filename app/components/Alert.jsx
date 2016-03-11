import React from 'react'
import { Link } from 'react-router'

export default class Alert extends React.Component {
  render() {
    return(
      <div>
        <button className="btn btn-danger"
          onClick={this.props.clickAlert} >
          <span className="glyphicon glyphicon-alert" aria-hidden="true"></span>
           Alert
        </button>
      </div>
    )
  }
}
