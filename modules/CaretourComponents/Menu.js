import React from 'react'
import { render } from 'react-dom'
import Header from './header.js'
import Modal from '../CommonComponents/modal.js'
import NavTop from '../CaretourComponents/navTop.js'
import $ from 'jquery'
import 'bootstrap/js/modal'
import { Link, hashHistory } from 'react-router'
import { dayOfWeekAsString, getAMPMTime } from '../Utilities'

export default React.createClass({
	getInitialState: function() {
		return {
		};
	},
	componentDidMount: function(){
		this.props.hook("OpenedMainMenu");
	},


	render: function() {
		var disableReturn = this.props.location.pathname == "/menu"
		var procedureDate = new Date(Date.parse(this.props.timeline.MilestoneDate));
		var dateString = "";
		if (typeof this.props.timeline.MilestoneDate != "undefined"){
			var procedureDate = new Date(Date.parse(this.props.timeline.MilestoneDate));
			var time = getAMPMTime(procedureDate);

			dateString = dayOfWeekAsString(procedureDate.getDay()) + " " + (procedureDate.getMonth() + 1) + "/"
				+ procedureDate.getDate() + " " + time;
		}
		// var day = dayOfWeekAsString(procedureDate.getDay());
		// console.log(day);
		return (
			<div id="menuView" className="row">
				<NavTop disableReturn={disableReturn} hook={this.props.hook}/>
				<div className="col-xs-12">
					<div className="col-xs-12">
						<div className="marginBottom16 headerStyle">
							<span>Your procedure:</span><br/>
							<span>{dateString}</span><br/>
						</div>
						<div className="marginTop16">
							We'll message you when you have tasks to complete.
						</div>
						<div className="marginTop16">Click menu items below at any time.</div>
					</div>
					<div className="row marginLeft0 marginRight0">
						<div className="col-xs-6 marginTop16">
							<Link to="schedule" onClick={()=>this.props.hook("ClickedTimeline")}>
								<button className="col-xs-12 btn btn-primary menuButton autoHeight"><i className="fa fa-fw fa-calendar marginBottom10"/><br/>Task<br/>Timeline</button>
							</Link>
						</div>
						<div className="col-xs-6 marginTop16">
							<Link to="info" onClick={()=>this.props.hook("ClickedContact")}>
								<button className="col-xs-12 btn btn-primary menuButton autoHeight"><i className="fa fa-fw fa-info-circle marginBottom10"/><br/>Contact<br/>Clinic</button>
							</Link>
						</div>
					</div>
					<div className="row marginTop30 marginLeft0 marginRight0">
						<div className="col-xs-6">
							<Link to="share" onClick={()=>this.props.hook("ClickedCopilot")}>
							<button className="col-xs-12 btn btn-primary menuButton autoHeight"><i className="fa fa-fw fa-heart marginBottom10"/><br/>Share with<br/>Family</button>
							</Link>
						</div>
						<div className="col-xs-6">
							<Link to="notify"  onClick={()=>this.props.hook("ClickedSettings")}>
							<button className="col-xs-12 btn btn-primary menuButton autoHeight"><i className="fa fa-fw fa-cog marginBottom10"/><br/>Reminder<br/>Settings</button>
							</Link>
						</div>
					</div>
				</div>
			</div>
		)
	}
});
