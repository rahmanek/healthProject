import React from 'react'
import { render } from 'react-dom'
import Instructions from './CaretourComponents/Instructions.js'
import Menu from './CaretourComponents/Menu.js'
import Info from './CaretourComponents/Info.js'
import Schedule from './CaretourComponents/Schedule.js'
import App from './CaretourComponents/App.js'
import { Router, Route, hashHistory, Link, Redirect } from 'react-router'
import Share from './CaretourComponents/Share.js'
import Notify from './CaretourComponents/Notify.js'
import Node from './CaretourComponents/node.js'
import EndSession from './CaretourComponents/EndSession.js'
import EndModule from './CaretourComponents/EndModule.js'


render(
	<Router history={hashHistory}>
		<Route component={App}>
			<Redirect from="/" to="/Menu" />
			<Route path="/menu" component={Menu}/>
			<Route path="/schedule" component={Schedule}/>
			<Route path="/info" component={Info}/>
			<Route path="/share" component={Share}/>
			<Route path="/notify" component={Notify}/>
			<Route path="/node" component={Node}/>
			<Route path="/endmodule" component={EndModule}/>
			<Route path="/endsession" component={EndSession}/>
		</Route>
	</Router>
	, document.getElementById('app')
);
