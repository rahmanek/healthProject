import React from 'react'
import $ from 'jquery'
import 'bootstrap/js/modal'
import { render } from 'react-dom'
import { Link, hashHistory } from 'react-router'
import { getQueryVariable, isValid } from '../Utilities.js'
import Modal from '../CommonComponents/modal.js'
import { formatPhone10 } from '../Utilities.js'
export default React.createClass({
	contextTypes: {
    	router: React.PropTypes.object.isRequired
  	},
	getInitialState: function() {
		return {
			SurName: '',
			GivenName: '',
			Email: '',
			PhoneNumber: '',
			Copilots: [],
			ButtonText: "I don't need support",
			errorMessages: []
		};
	},

	handleChange: function(event) {
		var changeVar = {};
		if (event.target.id == "PhoneNumber") changeVar[event.target.id] = formatPhone10(event.target.value);
		else{
			changeVar[event.target.id] = event.target.value;
		}
		this.setState(changeVar);
	},

	validateForm: function(){
		var errorMessages = [];
		var emptyField = false;
		if(this.state.GivenName == '') emptyField = true;
		if(this.state.SurName == '') emptyField = true;
		if(this.state.PhoneNumber != '' && !isValid.phone(this.state.PhoneNumber)) errorMessages.push("Invalid cell phone number");
		if(this.state.Email != '' && !isValid.email(this.state.Email)) errorMessages.push("Invalid Email");
		if(this.state.PhoneNumber == '' && this.state.Email == '') errorMessages.push("Email or cellphone number required");
		if(emptyField) errorMessages.push("Please input copilot's full name");

		this.setState({errorMessages:errorMessages});
		if (errorMessages.length > 0) return false;
		else return true;
	},

	addCopilot: function(event){
		var component = this;
		if(!this.validateForm()) return;
		var putData = {
			User:{
				GivenName: this.state.GivenName,
				SurName: this.state.SurName
			},
			Role:"CoPilot"
		}
		if (this.state.Email != "") putData.User.Email = this.state.Email;
		if (this.state.PhoneNumber != "") putData.User.PhoneNumber = this.state.PhoneNumber;
		console.log(putData);
		var ajaxRequest = {
			url: "/api/TimelineAssociate?id=" + this.props.ut,
			data: putData,
			type: 'PUT'
		}
		$.ajax(ajaxRequest).then(function(){
			jQuery('#copilotModal').modal('show');
		}).fail(function(err){
			if(err.status == 409) var errorMessages = [ this.state.GivenName + " is already receiving your instructions"];
			else var errorMessages = ["There was a problem adding this person as your copilot."];
			component.setState({errorMessages:errorMessages});
			return;
		});

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

	copilotComplete: function() {
		jQuery('#copilotModal').modal('hide');
		this.context.router.push({ pathname: "/submitted", query: { id: this.props.ut, vid: this.props.vid} });

	},

	anotherCopilot: function() {
		jQuery('#copilotModal').modal('hide');
		this.setState({GivenName:'',SurName:'',PhoneNumber:'',Email:'',ButtonText: 'I have enough support'});
	},

	render: function (){
		return (
			<div>
				<div className="row">
					<div className="welcome-progress-bar col-xs-6 col-xs-offset-3">
						<div className="progress-block filled"></div>
						<div className="progress-block filled"></div>
						<div className="progress-block"></div>
					</div>
				</div>
			<div className="row marginTop15">
				<div className="col-xs-12 text-center">
					<h2 className="section-h2">{this.props.pageFields.copilot.header}</h2>
				</div>
				<div className="col-xs-12 marginTop15">
					<div className="input-group">
						<input type="text" id="GivenName" className="copilot-input form-control noPaddingRight" placeholder="Their first name" value={this.state.GivenName} onChange={this.handleChange} onBlur={this.handleChange}/>
						<div className="input-group-addon" onClick={this.selectInput}>
							<i className="userFontSize fa fa-user"></i>
						</div>
					</div>
					<div className="input-group marginTop15">
						<input type="text" id="SurName" className="copilot-input form-control noPaddingRight" placeholder="Their last name" value={this.state.SurName} onChange={this.handleChange} onBlur={this.handleChange}/>
						<div className="input-group-addon" onClick={this.selectInput}>
							<i className="userFontSize fa fa-user"></i>
						</div>
					</div>
					<div className="input-group marginTop15">
						<input type="text" id="Email" className="copilot-input form-control" placeholder="Their email" value={this.state.Email} onChange={this.handleChange} onBlur={this.handleChange}/>
						<div className="input-group-addon" onClick={this.selectInput}>
							<i className="emailFontSize fa fa-envelope"></i>
						</div>
					</div>
					<div className="input-group  marginTop15">
						<input type="text" id="PhoneNumber" className="copilot-input form-control" placeholder="Their cell phone" value={this.state.PhoneNumber} onChange={this.handleChange} onBlur={this.handleChange}/>
						<div className="input-group-addon" onClick={this.selectInput}>
							<i className="phoneFontSize fa fa-mobile paddingRight3"></i>
						</div>
					</div>
				</div>

				<div className="col-xs-10 col-xs-offset-1 marginTop15">
					{
						this.state.errorMessages.map(function(message, i){
							return(
									<div key={i}className="errorMessage"> {message} </div>
							)
						})
					}
				</div>
				<div className="col-xs-12">
						<button id="copilotButton" onClick={this.addCopilot} type="button" className="blackOutline col-xs-12 copilotButton btn btn-primary btn-sm autoMargin">
							Share with this person
						</button>
				</div>
				<div className="col-xs-12 marginTop15">
					<Link to={{pathname: '/submitted', query:{id:this.props.ut, vid:this.props.vid}}}>
						<button type="button" className="blackOutline col-xs-12 btn btn-primary primary-muted autoMargin">
							{this.state.ButtonText}
						</button>
					</Link>
				</div>
				<Modal name="copilotModal">
					<div className="row text-center">
						<div className="col-xs-10 col-xs-offset-1 text-center">
							<span className="bold">Great!</span>
						</div>
						<div className="col-xs-10 col-xs-offset-1 paddingTop15">
							<span>{this.state.GivenName} {this.state.SurName} will receive your procedure preparation instructions and reminders</span>
						</div>
						<div className="col-xs-10 col-xs-offset-1 paddingTop15">
							<button type="button" className="blackOutline col-xs-12 btn btn-primary autoMargin" onClick={this.anotherCopilot}>
								Share with another person
							</button>
						</div>
						<div className="col-xs-10 col-xs-offset-1 paddingTop15">
							<button type="button" className="blackOutline col-xs-12 btn btn-primary autoMargin primary-muted" onClick={this.copilotComplete}>
								I have enough support
							</button>
						</div>
					</div>
				</Modal>
			</div>
			</div>
		);
	}
});
