import React from 'react'
import { render } from 'react-dom'
import { Link } from 'react-router'
export default React.createClass({

	render: function() {

		return (
			<div className="row views">
				<div className="contentBox">
					<div className="col-xs-12 marginTop20">
						<Link to="/settings"><div className="col-xs-12"> <i className="fa fa-arrow-left" aria-hidden="true"></i> Back</div></Link>
						<div className="bold col-xs-12 paddingTop20">Edit your contact information</div>
						<div className="col-xs-12 paddingTop20">
							<div>Email Address:</div>
							<div><input className="form-control"/></div>
						</div>
						<div className="col-xs-12 paddingTop20">
							<div>Mobile Number:</div>
							<div><input className="form-control"/></div>
						</div>
						<div className="col-xs-6">
							<button className="btn btn-sm btn-primary marginTop20">Save Contact Information</button>
						</div>
					</div>
				</div>
			</div>
		)
	}
});
