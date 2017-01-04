import React from 'react'
import { render } from 'react-dom'
import { Link } from 'react-router'

export default React.createClass({
	getInitialState: function() {
		return {
			associates:[]
		};
	},
	componentDidMount: function(){
		var component = this;
		$.get("api/TimelineAssociate/" + this.props.userId, function(data) {
			component.setState({associates:data});
		}).fail(function(err){
			console.log(err);
			return;
		});
		return;
	},
	stopSharing: function(){
		console.log("Remove Copilot")
	},
	render: function() {

		return (
			<div className="row">
				<div className="col-xs-10 col-xs-offset-1">
					<Link to="/share">
						<span className="bold"> &lt; Back</span>
					</Link>
				</div>
				<div className="bold col-xs-10 col-xs-offset-1 noPaddingRight paddingTop10 lineHeightNormal">
					<span>Current list of people who can view your instructions:</span>
				</div>
				<div className="col-xs-10 col-xs-offset-1 marginTop20">
					<table className="table">
						<tr>
							<td className="paddingTop10">Ebad Rahman</td>
							<td className="paddingTop10"><button className="btn btn-primary" onClick={this.stopSharing}>Stop Sharing</button></td>
						</tr>
						<tr>
							<td className="paddingTop10">Omar Badri</td>
							<td className="paddingTop10"><button className="btn btn-primary" onClick={this.stopSharing}>Stop Sharing</button></td>
						</tr>
					</table>
				</div>
				<div className="col-xs-10 col-xs-offset-1 marginBottom15">
					<Link to="share">
						<button className="btn btn-primary marginTop20">Share with another person</button>
					</Link>
				</div>
			</div>
		)
	}
});
