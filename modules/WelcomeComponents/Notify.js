import React from 'react'
import { render } from 'react-dom'
import { Router, Link, browserHistory } from 'react-router'
import { getQueryVariable, formatPhone10 } from '../Utilities.js'
import Modal from '../CommonComponents/modal.js'
import $ from 'jquery'
import 'bootstrap/js/modal'
import ErrorList from './errorList.js'

export default React.createClass({
	contextTypes: {
    	router: React.PropTypes.object.isRequired
  	},
	getInitialState: function() {
		return {
			errorMessages: [],
			phoneErrorMessages: [],
			emailErrorMessages: [],
			Email:'',
			PhoneNumber:'',
			PhoneNumberNotifications: false,
			phoneOnFile: false,
			changePhone: false,
			EmailNotifications: false,
			emailOnFile: false,
			changeEmail: false,
			currentSettings:[]
		};
	},
	componentDidMount: function () {

		$.get("/api/Notification?id=" + this.props.ut, (data) => {	
			/*$.get("http://localhost:14983/api/Notification?id=" + this.props.ut , function(data) {
			*/var PhoneNumberNotifications = false;
			var EmailNotifications = false;
			var phoneOnFile = false;
			var emailOnFile = false;
			
			data.map(function(not){
				if(not.MessageType == 0){
					emailOnFile = not.DataOnFile;
					if(not.Enabled){
						document.getElementById("EmailCheck").checked = true;
						EmailNotifications = true;
					}

				}
				else if(not.MessageType == 1 ){
					phoneOnFile = not.DataOnFile;
					if(not.Enabled) {
						document.getElementById("PhoneNumberCheck").checked = true;
						PhoneNumberNotifications = true;
					}
				}
			});
			this.setState({currentState:data, PhoneNumberNotifications: PhoneNumberNotifications, EmailNotifications: EmailNotifications, phoneOnFile: phoneOnFile, emailOnFile: emailOnFile});
			return;
		}).fail((err) => {
			console.log(err);
			return;
		});
		
	},

	handleCheck: function(event){
		event.currentTarget.firstChild.checked = !event.currentTarget.firstChild.checked;
		var stateObj = {}
		stateObj[event.currentTarget.id] = event.currentTarget.firstChild.checked;
		this.setState(stateObj);
		if(event.currentTarget.id == "PhoneNumberNotifications") this.setState({changePhone: false});
		if(event.currentTarget.id == "EmailNotifications") this.setState({changeEmail: false});		
		return;
	},
	handleChange: function(event) {
		var changeVar = {};
		if (event.target.id == "PhoneNumber") changeVar[event.target.id] = formatPhone10(event.target.value);
		else changeVar[event.target.id] = event.target.value;
		this.setState(changeVar);
	},
	handleReveal: function(event){
		if (event.currentTarget.id == "changePhone") this.setState({changePhone: !this.state.changePhone});
		else if (event.currentTarget.id == "changeEmail") this.setState({changeEmail: !this.state.changeEmail});
		return;
	},
	selectInput: function(event) {
		if (event.target.tagName == "DIV") {
			event.target.previousSibling.focus();
			event.target.previousSibling.select();
		} else {
			event.target.parentNode.previousSibling.focus();
			event.target.parentNode.previousSibling.select();
		}
	},
	validateForm: function(){
		var emailMessages = [];
		var phoneMessages = [];

		if (this.state.Email != "" && this.state.EmailNotifications) {
			console.log(this.state.EmailNotifications);
			var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if (!re.test(this.state.Email)) emailMessages.push("Email is invalid");
		}
		else{
			if(!this.state.emailOnFile && this.state.EmailNotifications) emailMessages.push("Email is required");
		}


		if(this.state.PhoneNumber != "" && this.state.PhoneNumberNotifications) {
			var stripPhone = this.state.PhoneNumber.replace(/\D/g,'');
			if (stripPhone.length < 10) phoneMessages.push("Cell phone is invalid");
		}
		else{
			if(!this.state.phoneOnFile && this.state.PhoneNumberNotifications) phoneMessages.push("Cell phone is required");
		}


		this.setState({emailErrorMessages:emailMessages});
		this.setState({phoneErrorMessages:phoneMessages});
		if (emailMessages.length > 0 || phoneMessages.length > 0) return false;
		return true;
	},

	checkReminders: function(event){
		var component = this;
		if(!this.state.EmailNotifications && !this.state.PhoneNumberNotifications) jQuery('#stopModal').modal('show');
		else this.submitReminders(event);
	},
	submitReminders: function(event){
		
		//DEVSTART
		// if(event.currentTarget.id == "removal") jQuery('#removeConfirmedModal').modal('show');/
		// else jQuery('#changeModal').modal('show');
		// return;
		//DEVEND
		if (this.validateForm()){
			var phoneOnFile = this.state.phoneOnFile || (this.state.PhoneNumber != "");
			var emailOnFile = this.state.emailOnFile || (this.state.Email != "");
			var putData = {

				Preferences:[{
					MessageType:0,//Email
					Enabled:false,
					Data:this.state.Email,
					DataOnFile: emailOnFile
				},{
					MessageType:1,//SMS
					Enabled:false,
					Data: this.state.PhoneNumber,
					DataOnFile: phoneOnFile
				}]
			};

			if(this.state.EmailNotifications && this.state.PhoneNumberNotifications) {
				putData.Preferences[0].Enabled = true;
				putData.Preferences[1].Enabled = true;
			} else if(this.state.PhoneNumberNotifications) {
				putData.Preferences[1].Enabled = true;
			} else if(this.state.EmailNotifications) {
				putData.Preferences[0].Enabled = true;
			}

			var ajaxRequest = {
				url: "/api/Notification?id=" + this.props.ut,
				data: putData,
				type: 'PUT'
			};

			

			$.ajax(ajaxRequest).then( () => {
				this.context.router.push({ pathname: "/copilot", query: { id: this.props.ut, vid: this.props.vid} });
				return;
			})
			.fail( () => {
				var errorMessage;
				if(this.state.EmailNotifications && this.state.PhoneNumberNotifications) errorMessage = ["Email and cell phone required"];
				else if (this.state.EmailNotifications) errorMessage = ["Email required"];
				else if (this.state.PhoneNumberNotifications) errorMessage = ["Cell phone required"];
				else errorMessage = ["There was a problem updating your notification preferences"];
				this.setState({errorMessages:errorMessage});


			});
		}
		return;
	},
	unsubscribe: function(){
		document.getElementById("EmailCheck").checked = false;
		document.getElementById("PhoneNumberCheck").checked = false;
		this.setState({PhoneNumberNotifications:false,EmailNotifications:false}, () =>{
			this.submitReminders();
			return;
		});
		return;
	},
	render: function() {
	{/*These if statements have inverted logic since the div class added is displayNone, so these logic cases are for those (inverted) boolean values which will turn displayNone on.*/}
		if(!this.state.PhoneNumberNotifications || (!this.state.phoneOnFile || this.state.changePhone)) var phoneOnFileClasses = "displayNone";
	{/*e.g. I'd check if phoneNumberNotif was enabled, but for displayNone Im checking the disabled cases*/}
		if(this.state.phoneOnFile || !this.state.PhoneNumberNotifications) var phoneNotOnFileClasses = "displayNone";
		var phoneInputClasses = "col-xs-12 input-group marginTop10";
		if(!this.state.PhoneNumberNotifications || (!this.state.changePhone && this.state.phoneOnFile) ) phoneInputClasses += " displayNone";

		if(!this.state.EmailNotifications || (!this.state.emailOnFile || this.state.changeEmail)) var emailOnFileClasses = " displayNone";
		if(this.state.emailOnFile || !this.state.EmailNotifications) var emailNotOnFileClasses = "displayNone";
		var emailInputClasses = "col-xs-12 input-group marginTop10";
		if(!this.state.EmailNotifications || (!this.state.changeEmail && this.state.emailOnFile) ) emailInputClasses += " displayNone";

		if(!this.state.PhoneNumberNotifications) var phoneErrorClasses = "displayNone";
		if(!this.state.EmailNotifications) var emailErrorClasses = "displayNone";

		return (
			<div>
				<div className="row">
					<div className="welcome-progress-bar col-xs-6 col-xs-offset-3">
						<div className="progress-block filled"></div>
						<div className="progress-block"></div>
						<div className="progress-block"></div>
					</div>
				</div>
				<div className="row">
					<div className="col-xs-12 col-md-8 col-md-offset-2 paddingTop15">
						<h2 className="section-h2">{this.props.pageFields.notify.header}</h2>
					</div>
					{/*Phone notification Row*/}
					<div className="col-xs-10 col-xs-offset-1 paddingTop10">
						<div className="paddingRight0 paddingLeft0">
							<div className="funkyradio">
								<div id="PhoneNumberNotifications" className="funkyradio-info" onClick={this.handleCheck}>
									<input type="checkbox" value="PhoneNumber" id="PhoneNumberCheck"/>
									<label id="PhoneNumberLabel">Text Message</label>
								</div>
							</div>
						</div>
					</div>
					<div className="col-xs-10 col-xs-offset-1 paddingTop10">
						<div className={phoneOnFileClasses}>We already have your cell phone.<br /><button id="changePhone" className="btn btn-change-input" onClick={this.handleReveal}>Click here to change it</button></div>
						<div className={phoneNotOnFileClasses}>We don't have your cell phone. Please enter it below.</div>
						<div id="phone-input" className={phoneInputClasses}>
							<input type="text" id="PhoneNumber" className="form-control" placeholder="Enter your cell phone" value={this.state.PhoneNumber} onChange={this.handleChange}/>
							<div className="input-group-addon" onClick={this.selectInput}>
								<i className="fa fa-mobile fa-fw"></i>
						</div>
						</div>
					</div>
					{/*Email notification row*/}
					<div className="col-xs-10 col-xs-offset-1 paddingTop10">
						<div className="paddingLeft0 paddingRight0 paddingLeft0">
							<div className="funkyradio">
								<div id="EmailNotifications" className="funkyradio-info" onClick={this.handleCheck}>
									<input type="checkbox" value="Email" id="EmailCheck"/>
									<label id="EmailLabel">Email</label>
								</div>
							</div>
						</div>
					</div>
					<div className="col-xs-10 col-xs-offset-1 paddingTop10">
						<div className={emailOnFileClasses}>We already have your email.<br /><button id="changeEmail" className="btn btn-change-input" onClick={this.handleReveal}>Click here to change it.</button></div>
						<div className={emailNotOnFileClasses}>We don't have your email. Please enter it below.</div>
								
						<div id="email-input" className={emailInputClasses}>
						<input type="text" id="Email" className="form-control" placeholder="Enter your email here" value={this.state.Email} onChange={this.handleChange}/>
							<div className="input-group-addon" onClick={this.selectInput}>
								<i className="fa fa-envelope fa-fw"></i>
							</div>

						</div>
					</div>
					<div className="col-xs-10 col-xs-offset-1 paddingTop10">
						<ErrorList errors={this.state.errorMessages}/>
					</div>
					<div className="col-xs-10 col-xs-offset-1 paddingTop10">
						<div className={emailErrorClasses}>
						<ErrorList errors={this.state.emailErrorMessages}/>
						</div>
					</div>
					<div className="col-xs-10 col-xs-offset-1 paddingTop10">
						<div className={phoneErrorClasses}>
						<ErrorList errors={this.state.phoneErrorMessages}/>
						</div>
					</div>
					<div className="col-xs-10 col-xs-offset-1 paddingTop10">
						<button id="submitButton" onClick={this.checkReminders} className="btn btn-primary col-xs-12">{this.props.pageFields.notify.button}</button>
					</div>
				</div>
				<Modal name="stopModal">
					<div>
						<div className="row text-center paddingTop15 paddingBottom15">
							<div className="col-xs-12 paddingBottom15">
								<span className="bold">Are you sure you want to stop recieving digital instructions from your nurse and doctor?</span>
							</div>
						</div>
						<div className="row paddingBottom25">
							<div className="col-xs-12 marginTop25">
								<button type="button" className="col-xs-12 btn btn-primary" data-dismiss="modal">
									No, I want instructions
								</button>
								<button id="removal" type="button" className="col-xs-12 btn btn-tertiary marginTop15" onClick={this.submitReminders} data-dismiss="modal">
									Yes, I don't want instructions
								</button>
							</div>
						</div>
					</div>
				</Modal>

				<Modal name="removeConfirmedModal">
					<div>
						<div className="row text-center paddingTop15">
							<div className="col-xs-12">
								<span className="bold">You will no longer receive digital instructions from your nurse or doctor</span>
							</div>
						</div>
						<div className="row text-center paddingTop15">
							<div className="col-xs-12">
								<span>You may resubscribe at any point through the link in the confirmation message you will receive</span>
							</div>
						</div>
						<div className="row paddingTop15 paddingBottom15">
							<div className="col-xs-12">
								<button type="button" className="col-xs-12 btn btn-primary" data-dismiss="modal">
									Done
								</button>
							</div>
						</div>
					</div>
				</Modal>
			</div>
		)
	}
});
