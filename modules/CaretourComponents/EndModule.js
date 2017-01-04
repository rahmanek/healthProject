import React from 'react'
import { render } from 'react-dom'
import $ from 'jquery'
import { Link } from 'react-router'
import { dayOfWeekAsString, getAMPMTime, getQueryVariable } from '../Utilities.js'
import NavTop from '../CaretourComponents/navTop.js'

export default React.createClass({
	contextTypes: {
    	router: React.PropTypes.object.isRequired
  	},

	getInitialState: function() {
		return {
			ut: this.props.location.query.id,
			nodeDate: '',
			content: (
				<div className ="text-center paddingTop50">
					<span><i className="fa fa-spinner fa-spin fa-3x fa-fw"></i><span className="sr-only">Loading...</span></span>
				</div>
			)
		};
	},

	componentDidMount: function() {
		var component = this;
		$.get("/api/v1/patient/timeline/node/" + this.state.ut, (data) => {
			component.setState({nodeDate:data.NodeMilestoneDate});
				var nodeDate = new Date(this.state.nodeDate);
				/*nodeDate.setTime(nodeDate.getTime() + nodeDate.getTimezoneOffset()*60*1000 );*/
				var formattedNodeDate = (nodeDate.getMonth() + 1) + "/" + (nodeDate.getDate());
				/*If not viewing today's module, redirect to schedule page*/
				if(formattedNodeDate != this.props.formattedTodayDate)
					this.context.router.push({ pathname: "/schedule", query: { id: this.props.ut} });


			this.setState({content:(
				<div className="row">
					<NavTop/>
					<div className="col-xs-12">
						<div className="col-xs-12 text-center">
							<div className="headerStyle">You're done for today</div>
							<div className="marginTop16">Feel free to exit (top right button).</div>
							<div className="marginTop16">We'll message you when you have tasks to complete.</div>
							<div className="col-xs-12">
								<Link to={{pathname: '/node', query:{id:this.state.ut}}} onClick={this.props.hook("Endmodule View Tasks Again Button Click")}>
									<button type="button" className="blackOutline col-xs-12 col-sm-6 col-sm-offset-3 btn btn-primary marginTop16">View Again</button>
								</Link>
								<Link to={{pathname: '/schedule', query:{id:this.state.ut}}} onClick={this.props.hook("Endmodule Timeline Button Click")}>
									<button type="button" className="blackOutline col-xs-12 col-sm-6 col-sm-offset-3 btn btn-primary marginTop16">View Task Timeline</button>
								</Link>
							</div>
						</div>
					</div>
				</div>
			)});
		}).fail( (err) => {
			console.log(err);
			return;
		});

	},

	render: function() {

			return this.state.content;

	}
});
