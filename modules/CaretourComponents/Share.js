import React from 'react'
import { render } from 'react-dom'
import { Link, hashHistory } from 'react-router'
import { formatPhone10} from '../Utilities.js'
import Modal from '../CommonComponents/modal.js'
import $ from 'jquery'
import 'bootstrap/js/modal'
import ErrorList from './errorList.js'
import NavTop from '../CaretourComponents/navTop.js'


export default React.createClass({
	getInitialState: function(copilotAdded = false) {
		return {
			GivenName: '',
			SurName: '',
			Email: '',
			PhoneNumber: '',
			errorMessages: [],
			disabledSubmit: false,
			copilotCount: 0,
			copilotAdded:copilotAdded
		};
	},
	handleChange: function(event) {
		var changeVar = {};
		if (event.target.id == "PhoneNumber") changeVar[event.target.id] = formatPhone10(event.target.value);
		else changeVar[event.target.id] = event.target.value;
		this.setState(changeVar);
	},
	submitCopilot: function(event){
		// jQuery('#shareModal').modal('show'); //DEV
		// return; //DEV


		if(!this.validateForm()) return;
		this.setState({ disabledSubmit: true });
		var putData = {
			User:{
				GivenName: this.state.GivenName,
				SurName: this.state.SurName
			},
			Role:"CoPilot"
		}
		if (this.state.Email != "") putData.User.Email = this.state.Email;
		if (this.state.PhoneNumber != "") putData.User.PhoneNumber = this.state.PhoneNumber;

		var ajaxRequest = {
			url: "/api/TimelineAssociate/?id=" + this.props.ut,
			data: putData,
			type: 'PUT'
		}

		$.ajax(ajaxRequest).then(function(){
			jQuery('#shareModal').modal('show');
		}).fail( (err) => {
			if(err.status == 409) var errorMessages = [ this.state.GivenName + " is already receiving your instructions"];
			else var errorMessages = ["There was a problem adding this person as your copilot."];
			this.setState({errorMessages:errorMessages});
		});
		this.setState({ disabledSubmit: false});
		return;
	},
	validateForm: function(){
		var errorMessages = [];
		if(this.state.GivenName == '') errorMessages.push("First name is required");
		if(this.state.SurName == '') errorMessages.push("Last name is required");
		if(this.state.Email == '' && this.state.PhoneNumber == '') errorMessages.push("Email or cell phone is required");

		if (this.state.Email != '') {
			var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if (!re.test(this.state.Email)) errorMessages.push("Email is invalid");
		}
		if (this.state.PhoneNumber != '') {
			var stripPhone = this.state.PhoneNumber.replace(/\D/g,'');
			if (stripPhone.length < 10) errorMessages.push("Cell phone is invalid");
		}
		this.setState({errorMessages:errorMessages});
		if (errorMessages.length > 0) return false;
		else return true;
	},
	componentDidMount: function () {
		jQuery('#shareModal').on('hidden.bs.modal', () => {
			this.setState(this.getInitialState(true));
		});
		this.props.hook("OpenedCopilot");

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
	removeCopilots: function(event){

		// jQuery('#confirmRemovalModal').modal('hide'); //Remove
		// jQuery('#removeCopilotsModal').modal('show'); //Remove
		// return; //Remove
		var ajaxRequest = {
			url: "/api/TimelineAssociate?id=" + this.props.ut,
			type: 'DELETE'
		}
		$.ajax(ajaxRequest).then(function(){
			jQuery('#confirmRemovalModal').modal('hide');
			jQuery('#removeCopilotsModal').modal('show');
		}).fail(function(err){
			console.log(err);
			return;
		});
	},
	linkToSettings: function(){
		jQuery('#shareModal').modal('hide');
		hashHistory.push("menu");
	},
	triggerRemovalModal:function(){
		jQuery('#confirmRemovalModal').modal('show');
	},
	render: function() {
		if(this.props.location.query.internal == "true") var backButton = (
			<a href="javascript:">
				<div onClick={hashHistory.goBack}>
					<span className="bold"> &lt; Back</span>
				</div>
			</a>
		);
		else var backButton = (<div></div>);
		var mainMenuAction = ""
		if(this.state.copilotAdded) mainMenuAction = "ClickedShareMainMenu"
		return (
			<div className="row">
				<NavTop actionOnMainMenu={mainMenuAction} hook={this.props.hook}/>
				{/* <div className="col-xs-11 col-xs-offset-1">
					{backButton}
				</div> */}
				<div className="col-xs-10 col-xs-offset-1 headerStyle">Want to share your reminders with a loved one?</div>

				<div className="col-xs-10 col-xs-offset-1 paddingTop16">
					<div className="col-xs-12 input-group">
						<input type="text" id="GivenName" className="form-control" placeholder="Enter their first name" value={this.state.GivenName} onChange={this.handleChange} onClick={()=>this.props.hook("ClickedCopilotFirstName")}/>
						<div className="input-group-addon" onClick={this.selectInput}>
							<i className="fa fa-user fa-fw"></i>
						</div>
					</div>
				</div>
				<div className="col-xs-10 col-xs-offset-1 paddingTop16">
					<div className="col-xs-12 input-group">
						<input type="text" id="SurName" className="form-control" placeholder="Enter their last name" value={this.state.SurName} onChange={this.handleChange} onClick={()=>this.props.hook("ClickedCopilotLastName")}/>
						<div className="input-group-addon" onClick={this.selectInput}>
							<i className="fa fa-user fa-fw"></i>
						</div>
					</div>
				</div>
				<div className="col-xs-10 col-xs-offset-1 paddingTop16">
					<div className="col-xs-12 input-group">
						<input type="text" id="Email" className="form-control" placeholder="Enter their email address" value={this.state.Email} onChange={this.handleChange} onClick={()=>this.props.hook("ClickedCopilotEmail")}/>
						<div className="input-group-addon" onClick={this.selectInput}>
							<i className="fa fa-envelope fa-fw"></i>
						</div>
					</div>
				</div>
				<div className="col-xs-10 col-xs-offset-1 paddingTop16">
					<div className="col-xs-12 input-group">
						<input type="text" id="PhoneNumber" className="form-control" placeholder="And/or their cellphone" value={this.state.PhoneNumber} onChange={this.handleChange}  onClick={()=>this.props.hook("ClickedCopilotPhone")}/>
						<div className="phoneAddonPadding input-group-addon" onClick={this.selectInput}>
							<i className="phoneFontSize fa fa-mobile fa-fw"></i>
						</div>
					</div>
				</div>
				<div className="col-xs-10 col-xs-offset-1">
					<ErrorList errors={this.state.errorMessages}/>
				</div>
				<div className="col-xs-10 col-xs-offset-1 paddingTop16">
					<button onClick={(e)=>{this.submitCopilot(e); this.props.hook("ClickedShare")}} className="col-xs-12 btn btn-primary" disabled={this.state.disabledSubmit}>Share with this person</button>
				</div>
				<div className="col-xs-10 col-xs-offset-1 paddingTop16">
					<button onClick={()=>{this.props.hook("ClickedStopSharing");this.triggerRemovalModal();}} className="col-xs-12 btn btn-primary primary-muted">Stop sharing with everyone</button>
				</div>
				{/* <div className="unsubscribeInfo col-xs-12 marginTop15 text-center">
					<span className="bold">Want to stop sharing instructions?</span>
						<button className="col-xs-12 col-sm-6 col-sm-offset-3 btn btn-tertiary marginTop15" data-toggle="modal" data-target="#confirmRemovalModal">Remove everyone</button>
					</div> */}
				<Modal name="shareModal">
					<div>
						<div className="text-center">
							<div className="headerStyle">{this.state.GivenName} will now receive your reminders as well</div>
						</div>
						<div className="row paddingTop16">
							<button type="button" className="col-xs-12 btn btn-primary" onClick={this.linkToSettings} data-dismiss="modal">
								Go to main menu
							</button>
							<button type="button" className="col-xs-12 btn btn-primary primary-muted marginTop15" onClick={()=>this.props.hook("ClickedShareWithAnother")} data-dismiss="modal">
								Share with another person
							</button>
						</div>
					</div>
				</Modal>
				<Modal name="confirmRemovalModal">
					<div>
						<div className="text-center paddingBottom15">
							<span className="headerStyle">Are you sure you want to stop sharing your instructions and reminders with everyone?</span>
						</div>
						<div className="marginBottom25">
							<div className="col-xs-12">
								<button id="newPatient" type="button" className="btn btn-primary col-xs-12" data-dismiss="modal">
									No, continue sharing
								</button>
							</div>
							<div className="col-xs-12 paddingTop15">
								<button id="newPatient" type="button" className="btn btn-primary primary-muted col-xs-12" onClick={this.removeCopilots}>
									Yes, stop sharing
								</button>
							</div>
						</div>
					</div>
				</Modal>
				<Modal name="removeCopilotsModal">
					<div>
						<div className="paddingTop15 text-center">
							<span className="bold">No family or friends can view your instructions or reminders anymore</span>
						</div>
						<div className="paddingTop15 text-center">
							<span className="marginTop15">Return to the share instructions page to add support again!</span>
						</div>
						<div className="row marginBottom15">
							<div className="col-xs-12 paddingTop25">
								<button id="newPatient" type="button" className="col-xs-12 btn btn-primary" data-dismiss="modal">
									Go back
								</button>
							</div>
						</div>
					</div>
				</Modal>
			</div>
		)
	}
});
