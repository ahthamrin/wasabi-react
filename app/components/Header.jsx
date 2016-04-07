import React, {Component, PropTypes} from 'react';
import { Link } from 'react-router';

import Alert from './Alert.jsx';

export default class Header extends Component {
	constructor(props) {
		super(props);

		this.state = {
		}

	}
	getHeaderLinks(role, classId, location) {
		var navLinks =  [
				{
					url: '/',
					text: 'Home',
					display: true
				},
				{
					url: '/lecturer/'+classId,
					text: 'Lecture '+classId,
					display: role === 'lecturer' && classId
				},
				{
					url: '/quiz/'+classId,
					text: 'Quiz '+classId,
					display: role === 'lecturer' && classId
				},
				{
					url: '/student/'+classId,
					text: 'Attend '+classId,
					display: role === 'student' && classId
				},
				{
					url: '/dashboard/'+classId,
					text: 'Dashboard',
					display: role === 'lecturer' && classId
				},
				{
					url: '/about',
					text: 'About',
					display: true
				},
				{
					url: '/test',
					text: 'Test',
					display: true
				},
				{
					url: '/',
					text: 'Logout',
					display: role !== null
				},
			];

		return location.pathname == '/' && !role ? [] : navLinks ;
	}
	render() {
		var ClassLink, DashboardLink;

		var role = null;
		var classId = 0;

		if (this.props.loggedInUser && this.props.loggedInUser.role) {
			role = this.props.loggedInUser.role;
			classId = this.props.classId;
		}

		var headerLinks = this.getHeaderLinks(role, classId, this.props.location);

		console.log('render Header');
		return(
			<div>
			<ul className='nav nav-pills'>
				{headerLinks.map((header, idx) => {
					if (header.display && header.text === 'Logout') {
						return <li className='nav-item' role='presentation' key={idx} onClick={this.props.onLogout}><a href='#'>{header.text}</a></li>;
					}
					if (header.display) {
						return <li className='nav-item' role='presentation' key={idx}><Link to={header.url}>{header.text}</Link></li>;
					}
				})
				}
			</ul>
        <Alert user={this.props.loggedInUser} zIndex={0} />
			</div>
		);
	}
}

Header.propTypes = {
	classId: PropTypes.number,
	onLogout: PropTypes.func.isRequired
}

