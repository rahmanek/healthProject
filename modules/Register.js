import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'
import App from './RegisterComponents/App.js'
import Form from './RegisterComponents/Form.js'
import Reschedule from './RegisterComponents/Reschedule.js'
import SelfReschedule from './RegisterComponents/selfReschedule.js'
import Cancel from './RegisterComponents/cancel.js'
console.log("sfd")
console.log(SelfReschedule);
render((

	<Router history={hashHistory}>
		<Route path="/app" component={App}>
			<Route path="/" component={Form}/>
			<Route path="/cancel" component={Cancel}/>
			<Route path="/reschedule" component={Reschedule}/>
			<Route path="/selfreschedule" component={SelfReschedule}/>
		</Route>
	</Router>
), document.getElementById('app'));
