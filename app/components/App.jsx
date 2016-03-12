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
			var ClassLink = <Link className="nav" role="button" to="/student/100">Attend Class</Link>;
			var DashboardLink;
			if (this.state.loggedInUser.role === 'lecturer') {
				ClassLink = <Link className="nav" role="button" to="/lecturer/100">Lecture Class</Link>;
				DashboardLink = <Link className="nav" role="button" to="/dashboard/100">Dashboard</Link>;
			}
			return(
				<div className="container-fluid">
					<div className="row">
						<span className="strong">WASABI app</span>
						<span className="strong">{ClassLink}</span>
						<span className="strong">{DashboardLink}</span>
						<span className="strong"><Link className="nav" role="button" to="/about">About</Link></span>
						<span className="strong"><a href="#" type="nav" className="nav" onClick={this.logout} >Logout</a></span>
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

