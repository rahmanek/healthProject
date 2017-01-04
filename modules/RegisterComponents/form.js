import React from 'react'
import $ from 'jquery'
import 'bootstrap/js/modal'
import 'jquery-ui/datepicker'
import '../../vendor/jquery.timepicker.js'
import { render } from 'react-dom'
import { Link } from 'react-router'
import { getQueryVariable, formatPhone10,createTimeDate, getTimezoneOffset } from '../Utilities.js'
import Modal from '../CommonComponents/modal.js'

export default React.createClass({
	getInitialState: function() {
		return {
			GivenName: '',
			SurName: '',
			Email: '',
			CopilotGivenName:'',
			CopilotSurName: '',
			CopilotEmail:'',
			CopilotPhone:'',
			PhoneNumber: '',
			ProcedureDate: '',
			ProcedureTime: '',
			ProcedureId: '',
			errorMessages: [],
			MedicalReference: '',
			isRegistering: false,
			checkedAttributeList: {}
		};
	},
	componentDidMount: function(){
		var component = this;
		$("#ProcedureDate").datepicker({
			onClose:function(date){
				component.setState({ProcedureDate:date});
			},
			minDate: new Date()
		});

		$('#ProcedureTimes').on('changeTime', function(time) {
			component.setState({ProcedureTime:time.target.value});
		}).timepicker({
			step:15,
			minTime: '6:00am',
      		maxTime: '4:00pm'
		});

		jQuery('#registerModal').on('hidden.bs.modal', function () {
			//Reset data to register a new user
		  $('#timelineSelect').prop('selectedIndex',0);
			component.setState(component.getInitialState());
			$('input[name="procedure"]').each(function (){
				this.checked = false;
			});
		});
		return true;
	},
	handleChange: function(event) {
		var changeVar = {};
		if (event.target.id == "PhoneNumber" || event.target.id == "CopilotPhone") {
			if(!this.props.disableCellCheck) changeVar[event.target.id] = formatPhone10(event.target.value);
			else changeVar[event.target.id] = event.target.value;
		}
		else if (event.target.id == "MedicalReference") changeVar[event.target.id] = event.target.value.substring(0,10);
		else changeVar[event.target.id] = event.target.value;
		this.setState(changeVar);
		return;
	},
	handleCheckChange: function(index) {
		var attributeList = this.state.checkedAttributeList;

		if (attributeList[index] == undefined) {
			attributeList[index] = true;
		} else {
			attributeList[index] = !attributeList[index];
		}

		this.setState({checkedAttributeList:attributeList});
		return;
	},
	submitPatient: function() {
		// jQuery('#registerModal').modal('show'); //DEV
		// return; //DEV
		if(!this.validateForm()) return;
		var component = this;
		this.setState({isRegistering:true},function(){
			var postData = {
				UserInfo:{
					SurName: this.state.SurName,
					GivenName: this.state.GivenName,
				},
				TenantPatientRequest:{
					TenantAccountToken: this.props.tid,
					TenantId: this.props.tid,
					Identifier: this.state.MedicalReference
				},
				PatientTimelineRegisterRequest:{
				    MilestoneDate:createTimeDate(this.state.ProcedureDate, this.state.ProcedureTime),
					ProviderTimelineId:this.state.ProcedureId,
					ProviderId: this.props.tid
				}
			};
			if (this.state.Email != "") postData.UserInfo.Email = this.state.Email;
			if (this.state.PhoneNumber != "") postData.UserInfo.PhoneNumber = this.state.PhoneNumber;
			if (this.state.CopilotGivenName != "") {
				var timelineAssociate = {
					GivenName:this.state.CopilotGivenName,
					SurName:this.state.CopilotSurName,
				}
				if (this.state.CopilotEmail != "") timelineAssociate.Email = this.state.CopilotEmail;
				if (this.state.CopilotPhone != "") timelineAssociate.PhoneNumber = this.state.CopilotPhone;
				postData.PatientTimelineRegisterRequest.TimelineAssociate = timelineAssociate;
			}
			$.post("/api/PatientRegistration?tid=" + this.props.tid, postData, function(userId) {
				jQuery('#registerModal').modal('show');
				component.setState({isRegistering:false});
				return;
			}).fail(function(err){
				if(err.status == 409) var errorMessages = ["The MRN, email and/or phone number provided matches another patient in our system. Please double check and contact Medumo at (401) 527-5445 as soon as possible to resolve this issue."];
				else var errorMessages = ["There was a problem registering the user. Please contact Medumo to resolve this issue! Thank you."];
				component.setState({
					errorMessages:errorMessages,
					isRegistering:false
				});
				return;
			});
			return;
		});
		return;
	},
	validateForm: function(){
		var self = this;
		var errorMessages = [];

		if (this.props.tid == "") errorMessages.push("This URL is invalid, please contact Medumo for help.")

		if (this.state.Email != '') {
			var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if (!re.test(this.state.Email)) errorMessages.push("Email Address is Invalid");
		}
		if (this.state.PhoneNumber != '') {
			var stripPhone = this.state.PhoneNumber.replace(/\D/g,'');
			if (stripPhone.length < 10) errorMessages.push("Phone Number is Invalid");
		}

		if (this.state.MedicalReference != '') {
			var referenceNumber = String(this.state.MedicalReference);
			if (referenceNumber.length != 10) errorMessages.push("Medical Record Number is Invalid");
			else if(!(/^[0-9]+$/.test(referenceNumber))) errorMessages.push("Medical Record Number is Invalid");
		}

		if(this.state.GivenName == '') errorMessages.push("First Name is Required");
		if(this.state.SurName == '') errorMessages.push("Last Name is Required");
		if(this.state.MedicalReference == '') errorMessages.push("Medical Record Number is Required");
		if(this.state.Email == '' && this.state.PhoneNumber == '') errorMessages.push("Email or Cellphone is Required");
		if(this.state.ProcedureTime == '') errorMessages.push("Arrival Time is Required");
		if(this.state.ProcedureDate == '') errorMessages.push("Arrival Date is Required");

		this.props.registrationConsentList.map(function(attr, i) {
			if (self.state.checkedAttributeList[i] != true) {
				errorMessages.push('Indicate ' + attr);
			}
		});

		if(document.getElementById("timelineSelect").value == "") errorMessages.push("Procedure Type is Required");

		if (this.state.CopilotGivenName != "" || this.state.CopilotSurName != "" || this.state.CopilotEmail != "" || this.state.CopilotPhone != ""){

			if (this.state.CopilotPhone == '' && this.state.CopilotEmail == '') errorMessages.push("Copilot Email or Cellphone is Required");
			if (this.state.CopilotGivenName == "") errorMessages.push("Copilot First Name is Required");
			if (this.state.CopilotSurName == "") errorMessages.push("Copilot Last Name is Required");
			if (this.state.CopilotPhone != ''){
				var stripPhone = this.state.CopilotPhone.replace(/\D/g,'');
				if (stripPhone.length < 10) errorMessages.push("Copilot Phone Number is Invalid");
			}
			if (this.state.CopilotEmail != '') {
				var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
				if (!re.test(this.state.CopilotEmail)) errorMessages.push("Copilot Email Address is Invalid");
			}
		}
		//Format Names

		this.setState({errorMessages:errorMessages});
		if (errorMessages.length > 0) return false;
		else return true;
	},
	selectInput: function(event) {
		if (event.target.tagName == "DIV") {
			event.target.previousSibling.focus();
			event.target.previousSibling.select();
		} else {
			event.target.parentNode.previousSibling.focus();
			event.target.parentNode.previousSibling.select();
		}
		return;
	},
	handleSelect: function (event){
		this.setState({ProcedureId:event.target.value});
		return;
	},
	render: function() {
		var self = this;
		
		if(this.state.GivenName.length > 0)	var capitalizedName = this.state.GivenName.charAt(0).toUpperCase() + this.state.GivenName.slice(1);
		else capitalizedName = '';

		return (
			<div id="registerForm">
				<div className="row text-center">
					<div className="col-sm-6 col-sm-offset-3 col-xs-10 col-xs-offset-1">
						<span className="bold fontSize28">Patient Registration</span>
					</div>
				</div>
				<div className="row text-center marginBottom10">
					<div className="col-sm-6 col-sm-offset-3 col-xs-10 col-xs-offset-1">
						<span className="fontSize16">{this.props.registrationBanner}</span>
					</div>
				</div>
				<div className="col-xs-12 col-sm-6 col-md-5 col-md-offset-1">
					<div className="col-xs-12 col-sm-11 ">
						<div className="row">
							<div className="col-xs-12 input-group">
								<input type="text" id="GivenName" className="form-control" placeholder="Patient first name" value={this.state.GivenName} onChange={this.handleChange}/>
								<div className="input-group-addon" onClick={this.selectInput}>
									<i className="fa fa-user fa-fw"></i>
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col-xs-12 input-group">
								<input type="text" id="SurName" className="form-control" placeholder="Patient last name" value={this.state.SurName} onChange={this.handleChange}/>
								<div className="input-group-addon" onClick={this.selectInput}>
									<i className="fa fa-user fa-fw"></i>
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col-xs-12 input-group">
								<input type="text" id="MedicalReference" className="form-control col-xs-12" placeholder="Medical record number" value={this.state.MedicalReference} onChange={this.handleChange}/>
								<div className="input-group-addon" onClick={this.selectInput}>
									<i className="fa fa-medkit fa-fw"></i>
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col-xs-12 input-group">
								<input type="text" id="Email" className="form-control col-xs-12" placeholder="Email address" value={this.state.Email} onChange={this.handleChange}/>
								<div className="input-group-addon" onClick={this.selectInput}>
									<i className="fa fa-envelope fa-fw"></i>
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col-xs-12 input-group">
								<input type="text" id="PhoneNumber" className="form-control" placeholder="Cellphone number" value={this.state.PhoneNumber} onChange={this.handleChange}/>
								<div className="input-group-addon" onClick={this.selectInput}>
									<i className="fa fa-mobile fa-fw"></i>
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col-xs-6 datePadding">
								<div className="col-xs-12 input-group">
									<input id="ProcedureDate" type="text" className="form-control" placeholder="Arrival date" value={this.state.ProcedureDate}/>
									<div className="input-group-addon" onClick={this.selectInput}>
										<i className="fa fa-calendar fa-fw"></i>
									</div>
								</div>
							</div>
							<div className="col-xs-6 timePadding">
								<div className="col-xs-12 input-group">
									<input id="ProcedureTimes" type="text" className="form-control" placeholder="Arrival time" value={this.state.ProcedureTime}/>
									<div className="input-group-addon" onClick={this.selectInput}>
										<i className="fa fa-clock-o fa-fw"></i>
									</div>
								</div>
							</div>
						</div>

						<div className="row">
							<div className="col-xs-12 input-group">
								<select id="timelineSelect" className="form-control" defaultValue="" name="procedure" onChange={this.handleSelect}>
									<option className="form-control" name="procedure" value="" disabled> Procedure prep type </option>
									{
										this.props.timeline.map(function(datum, i){
											return(
												<option className="form-control" key={i} name="procedure" value={datum.TimelineId}> {datum.Title} </option>
											)
										})
									}
								</select>
							</div>
						</div>
						{
							this.props.registrationConsentList.map(function(attr, i) {
								return (
									<div className="row" key={i}>
										<div className="col-xs-12 paddingLeft0">
											<div className="funkyradio">
												<div className="funkyradio-info" onClick={() => { self.handleCheckChange(i) }}>
													<input id="attr_check_{i}" type="checkbox" checked={self.state.checkedAttributeList[i] == undefined ? false : self.state.checkedAttributeList[i]} />
													<label className="marginBottom0"><span className="nowrap">{attr}</span></label>
												</div>
											</div>
										</div>
									</div>
								) 
							})
						}
					</div>
				</div>
				<div className="col-xs-12 col-sm-6 col-md-5">
						<div className="col-xs-12 col-sm-11 ">
						<div className="row">
							<div className="col-xs-12 input-group">
								<input type="text" id="CopilotGivenName" className="form-control" placeholder="Family member first name" value={this.state.CopilotGivenName} onChange={this.handleChange}/>
								<div className="input-group-addon" onClick={this.selectInput}>
									<i className="fa fa-user fa-fw"></i>
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col-xs-12 input-group">
								<input type="text" id="CopilotSurName" className="form-control" placeholder="Family member last name" value={this.state.CopilotSurName} onChange={this.handleChange}/>
								<div className="input-group-addon" onClick={this.selectInput}>
									<i className="fa fa-user fa-fw"></i>
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col-xs-12 input-group">
								<input type="text" id="CopilotEmail" className="form-control" placeholder="Family member email" value={this.state.CopilotEmail} onChange={this.handleChange}/>
								<div className="input-group-addon" onClick={this.selectInput}>
									<i className="fa fa-envelope fa-fw"></i>
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col-xs-12 input-group">
								<input type="text" id="CopilotPhone" className="form-control" placeholder="Family member cellphone" value={this.state.CopilotPhone} onChange={this.handleChange}/>
								<div className="input-group-addon" onClick={this.selectInput}>
									<i className="fa fa-mobile fa-fw"></i>
								</div>
							</div>
						</div>
						<div className="row">
							<div id="errorMessages" className="col-xs-12 marginTop25">
								<ul id="requiredErrors">
								{
									this.state.errorMessages.map(function(error, i){
										return(
											<li className="errorMessage" key={i}>{ error }</li>
										)
									})
								}
								</ul>
							</div>
						</div>
					</div>
				</div>
				<div className="row">
					<div className="col-sm-4 col-sm-offset-4 col-xs-10 col-xs-offset-1 marginTop25 marginBottom75">
						{
							(this.state.isRegistering)
							?(<button id="registerButton" type="button" className="col-xs-12 btn-primary btn" disabled="true">
								Registering...
							</button>)
							:(<button id="registerButton" type="button" onClick={this.submitPatient} className="col-xs-12 btn-primary btn">
								Register this patient
							</button>)
						}
					</div>
				</div>
				<Modal name="registerModal">
					<div className="row text-center">
						<h2 className="bold">Thank you</h2>
					</div>
					<div className="row text-center">
						<h4>{capitalizedName} has been registered</h4>
					</div>
					<div className="row marginBottom25">
						<div className="col-xs-12">
							<button id="newPatient" type="button" className="btn btn-primary autoMargin" data-dismiss="modal">
								Register Another Patient
							</button>
						</div>
					</div>
				</Modal>
			</div>


		)
	}
});
