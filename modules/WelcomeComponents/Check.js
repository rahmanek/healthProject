import React from 'react'
import { render } from 'react-dom'
import { Router, Link, hashHistory } from 'react-router'
import { getQueryVariable, isValid, formatPhone10} from '../Utilities.js'

export default React.createClass({

	getInitialState: function() {
		return {
			Email: "",
			PhoneNumber: "",
			GivenName: "",
			Surname: "",
			errorMessages: []
		};
	},

	handleChange: function(event) {
		var changeVar = {};
		if (event.target.id == "PhoneNumber"){
			changeVar[event.target.id] = formatPhone10(event.target.value);
		} else {
			changeVar[event.target.id] = event.target.value;
		}
		this.setState(changeVar);
	},

	validateForm: function(){
		var errorMessages = [];
		if (this.props.vid == 1){
			if (this.state.Email == '') errorMessages.push("Email is required");
			else {
				var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
				if (!re.test(this.state.Email)) errorMessages.push("Email is invalid");
			}
		} else {
			if (this.state.PhoneNumber === "") errorMessages.push("Cell phone number is required");
			else {
				var stripPhone = this.state.PhoneNumber.replace(/\D/g,'');
				if (stripPhone.length < 10) errorMessages.push("Cell phone number is invalid");
			}
		}
		if (errorMessages.length > 0){
			this.setState({errorMessages:errorMessages});
			return false;
		} else {
			return true;
		}
	},

	updatePreferences: function(event) {
		var component = this.props.ut;
		if (!this.validateForm()) return;
		var putData = {};
		if (this.state.PhoneNumber !== "") putData.PhoneNumber = this.state.PhoneNumber;
		if (this.state.Email !== "") putData.Email = this.state.Email;
		$.ajax({
		   url: "/api/User?id=" + this.props.ut,
			data: putData,
			type: 'PUT',
			success: function(response) {
				hashHistory.push("notify");
				return;
			},
			error: function(err){
				console.log(err);
				var errorMessages = ["There was a problem rescheduling the patient"];
				component.setState({errorMessages:errorMessages});
				return;
			}
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

	render: function (){
		if (this.props.vid == 1){
			var contactInput = (<div className="col-xs-12 input-group marginTop25">
				<input type="text" id="Email" className="form-control" placeholder="Enter your email" value={this.state.Email} onChange={this.handleChange}/>
				<div className="input-group-addon" onClick={this.selectInput}>
					<i className="fa fa-envelope fa-fw"></i>
				</div>
			</div>);
			var type = "email";
		} else {
			var contactInput = (<div className="col-xs-12 marginTop25 input-group">
				<input type="text" id="PhoneNumber" className="form-control" placeholder="Enter your cell phone" value={this.state.PhoneNumber} onChange={this.handleChange}/>
				<div className="input-group-addon" onClick={this.selectInput}>
					<i className="fa fa-mobile fa-fw"></i>
				</div>
			</div>);
			var type = "cell phone number"
		}
		return (
			<div>
				<div className="row noMarginTop">
					<div className="col-xs-10 col-xs-offset-1 text-center">
						<h3 className="bold">To finish signing up to receive your instructions and reminders, please confirm your {type} below:</h3>
						{contactInput}
					</div>
					<div id="errorMessages" className="col-xs-10 col-xs-offset-1 col-sm-6 col-sm-offset-3 marginTop15">
						<ul>
						{
							this.state.errorMessages.map(function(error, i){
								return(
									<li className="errorMessage" key={i}>{ error }</li>
								)
							})
						}
						</ul>
					</div>
					<div className="col-xs-10 col-xs-offset-1">
						<button id="confirmPreferences" onClick={this.updatePreferences} type="button" className="col-xs-12 btn btn-primary blackOutline">
							Confirm my {type}
						</button>
					</div>
					<div className="col-xs-10 col-xs-offset-1">
						<Link to="/submitted">
							<button id="confirmPreferences" onClick={this.updatePreferences} type="button" className="col-xs-12 btn btn-low marginTop15 blackOutline">
								Don't confirm my {type}
							</button>
						</Link>
					</div>
				</div>
			</div>
		);
	}
});
