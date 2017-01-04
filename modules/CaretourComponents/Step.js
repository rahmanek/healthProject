import React from 'react'
import { render } from 'react-dom'
import  { Link }  from "react-router"
import classNames from 'classnames'
import { dayOfWeekAsString } from '../Utilities.js'


export default React.createClass({

	componentDidMount() {
		$('.step a .timeline-event').first().addClass("first-step");
		$('.step a .timeline-event').last().addClass("last-step");
		var todaySteps = $('.step.current');
		// if there are no steps for today, add no-today class to the first todo (future) step
		if(todaySteps.length == 0) 	$('.step a .timeline-event.todo').first().addClass("no-today");

    },
    postUserLog: function(actionItem){
		var postData = {
			UserToken: this.props.ut,
			Action: "Timeline node clicked: " + this.props.data.Title
		};
		$.post("/api/UiActionStat", postData, function() {
		return;
		}).fail( (err) => {
			console.log(err);
			return;
		});
	},
	render: function() {

		var nodeId = this.props.nodeId;
		var step = this.props.data;
		/* Read date of Node */
		var date = new Date(Date.parse(step.NodeMilestoneDate));
		/* Read date of today */
		var todayDate = this.props.todayDate;
		/* Read date of today's m/d format (calculated once in parent component) */
		var formattedTodayDate = this.props.formattedTodayDate;
		/* Read date of procedure's m/d format*/
		var formattedProcedureDate = this.props.formattedProcedureDate;


		/* Converting nodeDate changes to UTC timezone, must adjust to user's timezone (we assume patient is in the same timezone as institution) */
		date.setTime( date.getTime() + date.getTimezoneOffset()*60*1000 );
		/* Convert nodeDate's day into readable string ==> 0 = Sunday, 1 = Monday */
		var dayOfWeek = dayOfWeekAsString(date.getDay());
		/* Format nodeDate to m/d */
		var formattedDate = (date.getMonth() + 1) + "/" + (date.getDate());

		var checkIfToday = (formattedTodayDate == formattedDate);
		var checkIfProcedureDay = (formattedDate == formattedProcedureDate);
		var procedureText = <span></span>;
		if (checkIfToday) procedureText =  <span id="procedure" className="gold">Today</span>;
		if (checkIfProcedureDay) procedureText = <span id="procedure">{this.props.pageFields.step.type}</span>
		if (checkIfToday && checkIfProcedureDay) procedureText = <span id="procedure" className="gold">{this.props.pageFields.step.type} Today</span>;

		let stepClasses = classNames(
				'step',
				{ 'current': checkIfToday }
			);
		let timelineEventClasses = classNames(
  						'timeline-event','row',
  						{
  							'today': (checkIfToday),
  							'todo': (date > todayDate)
  						}
  		);
  		let viewBtnClasses = classNames(
  						'col-xs-8', 'col-xs-offset-2', 'btn',
  						'timeline-view-btn',
  						{
  							'btn-gold': (checkIfToday),
  							'btn-primary': (!checkIfToday)
  						}
  		);
		var todayStarIcon = <i className="timeline-event-bubble fa fa-star" aria-hidden="true"></i>
		/*TODO: Make iconClass for incomplete step (that is the exclamation icon as seen in the wireframe) */
		return (
	    <div className={stepClasses}>
	    	<div className="col-xs-10 col-xs-offset-2 arrow-box">
				{(this.props.order == 0)?<div className="arrow-down"></div>:<div></div>}
			<Link to={{pathname: '/node', query:{id:step.AccessTokenValue}}} onClick={()=>this.props.hook("ClickedTimelineButton" + this.props.order)}>
				<div className={timelineEventClasses}>
				{checkIfToday ? todayStarIcon : ""}
				{checkIfToday ? todayStarIcon : ""}
				<button className={viewBtnClasses}>{formattedDate + " " + dayOfWeek}{procedureText}</button>
				</div>
			</Link>
			<div className="clearfix"></div>
			</div>
		</div>


			)
	}

});
