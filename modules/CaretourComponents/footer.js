import React from 'react'
import { render } from 'react-dom'
import { Router, Link, hashHistory } from 'react-router'
import { getQueryVariable } from '../Utilities.js'

export default React.createClass({
	getInitialState: function() {
		return {
			ut: this.props.ut,
			userLogs: [
				"Timeline Button Click",
				"Contact Clinic Button Click"
			]
		}
	},

	postUserLog: function(actionItem){
		
		var postData = {
			UserToken: this.state.ut,
			Action: this.state.userLogs[actionItem]
		};
		$.post("/api/UiActionStat", postData, function() {
		return;
		}).fail( (err) => {
			console.log(err);
			return;
		});
	},

	render: function() {

		if(this.props.pathname == "/endmodule") var exitClassName ="active-icon";
		return (
			<div id="footer" className="text-center">
				<div className="container">
					<div className="col-xs-12 col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3">
						<div className="row">
							<Link  to={{pathname: '/schedule', query:{id:this.state.ut}}} activeClassName="active-icon" onClick={this.postUserLog.bind(this, 0)}>
								<div className="col-xs-4 text-center iconBox">
										<i className="icon fa fa-calendar iconSize"></i><br/>
										<span className="bold">{this.props.pageFields.footerBar.timeline}</span>

								</div>
							</Link>
							<Link to={{pathname: '/info', query:{id:this.state.ut}}} activeClassName="active-icon" onClick={this.postUserLog.bind(this, 1)}>
								<div className="col-xs-4 text-center iconBox">
									<i className="icon fa fa-info-circle iconSize"></i><br/>
									<span className="bold">{this.props.pageFields.footerBar.contact}</span>
								</div>
							</Link>
							<Link to={{pathname: '/endsession', query:{id:this.state.ut}}} className={exitClassName}>
							<div className="col-xs-4 text-center iconBox">
									<i className="icon fa fa-times iconSize"></i><br/>
									<span className="bold">Exit Program</span>
							</div>
							</Link>
					

						</div>
					</div>
				</div>
			</div>
		)
	}
});
