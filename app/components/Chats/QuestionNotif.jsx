import React from 'react'

export default class QuestionNotif extends React.Component {
	render() {
		return(
			<button className='btn btn-info'
			        onClick={ this.props.handleShowModal} >
				Questions <span className='badge'>{ this.props.notifs }</span>
			</button>
		)
	}
}
