import React from 'react'
import { render } from 'react-dom'
import { Link } from 'react-router'

export default React.createClass({
	render: function() {
		return (
			<div className="row">
				<div className="col-xs-10 col-xs-offset-1 text-center paddingTop10 ">
					<div className="marginBottom20">
						<div className="paddingTop10">
							<span>Click menu items in navigation bar or click the buttons below to explore other features</span>
						</div>
					</div>
				</div>
				<div>
					<Link to={{pathname:"/schedule", query:{internal:"true"}}}>
						<button className="btn btn-primary marginBottom20 col-xs-10 col-xs-offset-1">View your instruction schedule</button>
					</Link>
				</div>
				<div>
					<Link to={{pathname:"/share", query:{internal:"true"}}}>
						<button className="btn btn-primary marginBottom20 col-xs-10 col-xs-offset-1">Share instructions with someone</button>
					</Link>
				</div>
				<div>
					<Link to={{pathname:"/notify", query:{internal:"true"}}}>
						<button className="btn btn-primary marginBottom20 col-xs-10 col-xs-offset-1">Change reminder settings</button>
					</Link>
				</div>
			</div>
		)
	}
});
