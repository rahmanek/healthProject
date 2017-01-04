import React from 'react'
import { render } from 'react-dom'
import { Link } from "react-router"

export default React.createClass({

	render: function() {

	
		return (
			<div id="header">
				<div className="container">
			<div className="row">
				<div className="col-xs-12 col-sm-10 col-sm-offset-1">
					<Link to="/endsession">End Session</Link>
				</div>
			</div>
			</div>
			</div>
		)
	}
});
