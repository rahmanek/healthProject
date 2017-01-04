import React from 'react'
import { render } from 'react-dom'
import $ from 'jquery'
import { Link } from "react-router"
import  Step  from './Step.js'
import NavTop from '../CaretourComponents/navTop.js'

export default React.createClass({
	getInitialState:function () {
		return {
			scrollBelowIndicator:true
		};
	},
	componentDidMount:function () {
		console.log($("#timeline-wrapper").height(), document.getElementById("timeline-wrapper").scrollHeight);
		if(!($("#timeline-wrapper").height() + 50 < document.getElementById("timeline-wrapper").scrollHeight)){
			this.setState({scrollBelowIndicator:false})
		};
		// Refresh timeline
		this.props.requestTimeline(this.props.ut);
		this.props.hook("OpenedTimeline");
		// document.getElementsByClassName("views")[0].onscroll = ()=>{
		// 	this.props.hook("ScrolledForMoreTasks");
		// 	this.setState({scrollBelowInidcator:false})
		// }
		//  window.addEventListener('scroll', this.handleScroll);

	},
	componentWillUnmount: function(){
		window.removeEventListener('scroll', this.handleScroll);
	},
	render: function() {
		var timeline = this.props.timeline;
		var todayDate = new Date(this.props.todayDate);

		var procedureDate =  new Date(Date.parse(timeline.MilestoneDate));
		var formattedProcedureDate = (procedureDate.getMonth() + 1) + "/" + (procedureDate.getDate());

		var component = this;
		var isInstructionToday = false;
		var stepNodes = timeline.Nodes.map(function(step, i) {
			var date = new Date(Date.parse(step.NodeMilestoneDate));
			var formattedDate = (date.getMonth() + 1) + "/" + (date.getDate());
			if (formattedDate == component.props.formattedTodayDate) isInstructionToday = true;

	     	return (<Step key={i} order={i} data={step} hook={component.props.hook} formattedProcedureDate={formattedProcedureDate} formattedTodayDate={component.props.formattedTodayDate} todayDate={todayDate} pageFields={component.props.pageFields} />);
	    });


		var timelineText = (
			<div className="col-xs-12">
				<span className="bold">No tasks today!  Feel free to exit.</span><br />
				You can also scroll down and click on any date to view that day's tasks.
			</div>
		)
		if(isInstructionToday) var timelineText = (
			<div className="col-xs-12">
				<span className="bold">You have tasks to do today!</span><br />
				If you haven't already, view today's tasks (by the star) as soon as possible!
			</div>
		)

		return (
			<div>
				<div id="timeline-wrapper" className="row" onScroll={()=>{if(this.state.scrollBelowIndicator == true) this.props.hook("ScrolledForMoreTasks");this.setState({scrollBelowIndicator:false})}}>
					<div>
					<NavTop hook={this.props.hook}/>
							<div className="timelineHeaderBox col-xs-12">
								{timelineText}
							</div>
							{stepNodes}
						{
							(this.state.scrollBelowIndicator)?
							<div className="timeline-scroll-below-text">
								<p>scroll for more tasks below<i className="fa fa-arrow-circle-o-down" aria-hidden="true"></i></p>
							</div>:<div></div>
						}
					</div>
				</div>
			</div>
		);
	}
});
