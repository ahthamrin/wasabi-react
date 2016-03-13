import React from 'react';
import UserStore from '../stores/UserStore';
import UserActions from '../actions/UserActions';
import { hashHistory, Link } from 'react-router';


export default class App extends React.Component {
	componentDidMount() {
    UserStore.listen(this.userStoreChanged);
		this.setState(UserStore.getState());
	}
	componentWillReceiveProps() {
		this.setState(UserStore.getState());
	}
	render() {
		if (this.state && this.state.loggedInUser.username) {
			var ClassLink = <Link to="/student/100">Attend Class</Link>;
			var DashboardLink;
			if (this.state.loggedInUser.role === 'lecturer') {
				ClassLink = <Link  to="/lecturer/100">Lecture Class</Link>;
				DashboardLink = <Link  to="/dashboard/100">Dashboard</Link>;
			}
			return(
				<div className="container-fluid">
					<div className="row">
						WASABI App |
						{ClassLink} |
						{DashboardLink} |
						<Link  to="/about">About</Link> |
						<a href="#" onClick={this.logout} >Logout</a>
					</div>
							{this.props.children}
				</div>
			)
		}
		else {
			return(
				<div className="container-fluid">
					<div className="row">
							{this.props.children}
					</div>
				</div>
			)			
		}
	}
  userStoreChanged = (state) => {
    console.log('App userStoreChanged', state);
    this.setState(state);

    if (!state.loggedInUser) {
      hashHistory.push('/');
    }
  }
	logout() {
		UserActions.logout();
		hashHistory.push('/');

	}
}

