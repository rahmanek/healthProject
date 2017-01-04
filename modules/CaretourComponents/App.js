import React from 'react'
import { render } from 'react-dom'
import { Router, Link, hashHistory } from 'react-router'
import Header from './header.js'
import Footer from './footer.js'
import $ from 'jquery'
import 'bootstrap/js/modal'
import { getQueryVariable } from '../Utilities.js'

export default React.createClass({
	getInitialState: function() {
		var initialObject = {
			timeline:{
				Nodes:[]
			},
			ut: this.props.location.query.id,
			vid: this.props.location.query.vid,
			todayDate: '',
			formattedTodayDate: ''
		}

		return initialObject;
	},
	requestTimeline: function(ut){

		$.get("/api/PatientTimeline?id=" + ut, (data) => {
/*	$.get("http://localhost:14983/api/patienttimeline?id=c449fd5457b546be89bf599320a25d31", (data) => {*/
		var component = this;
			data.Nodes.sort(function(a,b){
				var dateA = new Date(a.NodeMilestoneDate);
				var dateB = new Date(b.NodeMilestoneDate);
				var msA = dateA.getTime();
				var msB = dateB.getTime();
				return msA - msB;

			});

			component.setState({timeline:data, ut:ut});
		return;
		}).fail( (err) => {
			console.log(err);
			return;
		});


	},
	hook: function(action){
		var postData = {
			UserToken: this.state.ut,
			Action: action
		};
		$.post("/api/UiActionStat", postData, function() {
			return;
		}).fail( (err) => {
			console.log(err);
			return;
		});
	},
	componentDidMount:function () {
		this.requestTimeline(this.state.ut);

		/* Calculate today's date so it can be used in child components*/
		var todayDate = new Date();
		/* Format in month/day....example 10/31 */
		var formattedTodayDate = (todayDate.getMonth() + 1) + "/" + (todayDate.getDate());
		this.setState({todayDate:todayDate.toString(), formattedTodayDate:formattedTodayDate});
		window.addEventListener("orientationchange", () => {
			this.hook("TriggeredRotatePhone")
		}, false);
    },

	render: function() {
		// Close modals when changing views while a modal is still open
		$('.modal').each(function(){
			jQuery(this).modal('hide');
		});
		var pass = {
			ut: this.state.ut,
			timeline:this.state.timeline,
			requestTimeline: this.requestTimeline,
			hook:this.hook,
			todayDate: this.state.todayDate,
			formattedTodayDate: this.state.formattedTodayDate,
			location: this.props.location,
			pageFields: {
				timeline: {
					header: 'We\'ll message you when you have a task to do',
					headerOptional: 'Click to browse tasks below'
				},
				step: {
					type: 'Procedure'
				},
				footerBar: {
					timeline: 'Task Timeline',
					contact: 'Contact Clinic'
				},
				info: {
					header: 'Have other questions?',
					footer: 'Dislike how you\'re receiving instructions?'
				},
				notify: {
					header: 'How would you like to receive task reminders?',
					footer: 'Save my reminder settings'
				},
			}
		}
		if (this.props.location.pathname == "/" || this.props.location.pathname == "/node" || this.props.location.pathname == "/endsession" ){
			var contentContainer =
				<div className="fullWidth fullHeight">
					<div className="contentBox caretourViews headerless">
						<div className="container-fluid fullHeight">
							<div className="row fullHeight relative overflowHidden">
								{React.cloneElement(this.props.children, pass)}
							</div>
						</div>
					</div>
				</div>
		}
		else {
			var contentContainer =
				<div className="views">
					<div className="displayTable fullHeight fullWidth">
						<div className="displayTableCellMiddle">
							<div className="container noPaddingLeft noPaddingRight">
								<div className="col-xs-12 col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3">
									{React.cloneElement(this.props.children, pass)}
								</div>
							</div>
						</div>
					</div>
					{/* <Footer ut={this.state.ut} pathname={this.props.location.pathname} pageFields={pass.pageFields}/> */}
				</div>
		}

		var pass = {
			ut: this.state.ut,
			timeline:this.state.timeline
		}
		return contentContainer;
	}
});
