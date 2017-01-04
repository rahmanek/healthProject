import React from 'react'
import { render } from 'react-dom'
import { Router, Route, hashHistory, IndexRoute } from 'react-router'
import Check from './WelcomeComponents/Check.js'
import Notify from './WelcomeComponents/Notify.js'
import Copilot from './WelcomeComponents/Copilot.js'
import Submitted from './WelcomeComponents/Submitted.js'
import App from './WelcomeComponents/App.js'

render((
	<Router history={hashHistory}>
		<Route component={App}>
			<Route path="/copilot" component={Copilot}/>
			<Route path="/" component={Notify}/>
			<Route path="/submitted" component={Submitted}/>
		</Route>
	</Router>
), document.getElementById('app'));
