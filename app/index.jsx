import 'array.prototype.findindex';
import './main.css';
// import 'jquery-touchswipe/jquery.touchSwipe.js';
// import 'jquery-mobile/dist/jquery.mobile.js';
// import 'bxslider/dist/jquery.bxslider.js';
import alt from './libs/alt';
import rtc from './libs/rtc';
import storage from './libs/storage';
import persist from './libs/persist';
import fa from 'font-awesome-webpack';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';
import UserLogin from './components/UserLogin.jsx';
import Student from './containers/Student.jsx';
import Lecturer from './containers/Lecturer.jsx';
import TestSlideShow from './containers/TestSlideShow.jsx';
import Dashboard from './components/Dashboard.jsx';
import About from './components/About.jsx';
import Quiz from './components/QuizTab.jsx';

import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router';



main();

function main() {
  // persist(alt, storage, 'app');

  ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={App}>
    	<IndexRoute component={UserLogin} />
      <Route path="test" component={TestSlideShow} />
      <Route path="about" component={About} />
      <Route path="about/:aboutId" component={About} />
      <Route path="student/:classId" component={Student} />
      <Route path="lecturer/:classId" component={Lecturer} />
      <Route path="dashboard/:classId" component={Dashboard} />
      <Route path="quiz/:classId" component={Quiz} />
      <Route path="login" component={UserLogin} />
    </Route>
  </Router>
 	,
	document.getElementById('app'));
}
