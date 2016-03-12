import React from 'react'
import { Link } from 'react-router'
import Participant from './DbParticipant.jsx'

export default class About extends React.Component {
	render() {
		return(
			<div>
				<h2>DASHBOARD</h2>
				<Participant />
				{this.props.children}
			</div>
		)
	}
}
