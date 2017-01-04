import React from 'react'
import { render } from 'react-dom'
import { Router, Link, hashHistory } from 'react-router'
import { getQueryVariable } from '../Utilities.js'

export default React.createClass({
	getInitialState: function() {
		return {
			tid: (function () {
				if(getQueryVariable("tid")) return getQueryVariable("tid");
				else return "";
			})(),
			disableCellCheck: (function () {
				if(getQueryVariable("off") == true) return true;
				else return false;
			})(),
			timeline:[],
			registrationConsentList:[],
			registrationBanner:'',
			rescheduleBanner:'',
			cancellationBanner:''
		}
	},
	componentDidMount: function(){
		var component = this;
		$.get("/api/ProviderTimeline?tid=" + this.state.tid, function(data) {
			var registrationConsentList = [];
			var registrationBanner = '';
			var rescheduleBanner = '';
			var cancellationBanner = '';

			if (data.length > 0 && data[0].Tenant.Attributes.map != null) {
				data[0].Tenant.Attributes.map(function(attr) {
					if (attr.Key == 'RegistrationConsent') {
						attr.Value.split(';').map(function(val) {
							registrationConsentList.push(val);
						});
					} else if (attr.Key == 'RegistrationBanner') {
						registrationBanner = attr.Value;
					} else if (attr.Key == 'RescheduleBanner') {
						rescheduleBanner = attr.Value;
					} else if (attr.Key == 'CancellationBanner') {
						cancellationBanner = attr.Value;
					}
				});
			}

			component.setState({
				timeline:data,
				registrationConsentList,
				registrationBanner,
				rescheduleBanner,
				cancellationBanner
			});
		});
		return;
	},
	render: function() {
		var link = (
			<div>
				<div className="col-sm-5">
					<Link to="/reschedule">
						<button id="rescheduleView col-xs-6" type="button" className="btn viewSwitchButton marginTop15">
							Has a patient been rescheduled?
						</button>
					</Link>
				</div>
				<div className="col-sm-5 col-sm-offset-2">
					<Link to="/cancel">
						<button id="rescheduleView col-xs-6" type="button" className="btn viewSwitchButton marginTop15">
							Does a patient need to be cancelled?
						</button>
					</Link>
				</div>
			</div>
		);

		if (this.props.location.pathname == "/reschedule"){
			link = (
				<div>
					<div className="col-sm-5">
						<Link to="/">
							<button id="rescheduleView col-xs-6" type="button" className="btn viewSwitchButton marginTop15">
								Need to register a new patient?
							</button>
						</Link>
					</div>
					<div className="col-sm-5 col-sm-offset-2">
						<Link to="/cancel">
							<button id="rescheduleView col-xs-6" type="button" className="btn viewSwitchButton marginTop15">
								Does a patient need to be cancelled?
							</button>
						</Link>
					</div>
				</div>
			)
		} else if (this.props.location.pathname == "/cancel"){
			link = (
				<div>
					<div className="col-sm-5">
						<Link to="/">
							<button id="rescheduleView col-xs-6" type="button" className="btn viewSwitchButton marginTop15">
								Need to register a new patient?
							</button>
						</Link>
					</div>
					<div className="col-sm-5 col-sm-offset-2">
						<Link to="/reschedule">
							<button id="rescheduleView" type="button" className="btn viewSwitchButton marginTop15">
								Has a patient been rescheduled?
							</button>
						</Link>
					</div>
				</div>
			)
		}
		var pass = {
		    tid: this.state.tid,
		    ut: this.props.location.query.id,
			timeline:this.state.timeline,
			registrationConsentList: this.state.registrationConsentList,
			registrationBanner: this.state.registrationBanner,
			rescheduleBanner: this.state.rescheduleBanner,
			cancellationBanner: this.state.cancellationBanner,
			disableCellCheck: this.state.disableCellCheck
		}
		return (
			<div className="container">
				<div className="col-xs-3">
					{/* <img src="medumoLogo.png" id="logoImage"/> */}
				</div>
				<div className="col-xs-12 col-sm-8 col-sm-offset-1">
					<div>
						{ link }
					</div>
				</div>
				<div>{React.cloneElement(this.props.children, pass)}</div>
			</div>
		)
	}
});
