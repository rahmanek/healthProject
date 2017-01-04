import React from 'react'
import { render } from 'react-dom'
import $ from 'jquery'
import 'jquery-ui/datepicker'
import '../../vendor/jquery.timepicker.js'
import { getQueryVariable, createTimeDate, getTimezoneOffset } from '../Utilities.js'
import Modal from '../CommonComponents/modal.js'

export default React.createClass({
	getInitialState: function() {
		return {
			ProcedureDate: '',
			ProcedureTime: '',
			MedicalReference: '',
			errorMessages: [],
			TimelineId: '',
			ProcedureId: '',
			SurName: '',
			isRescheduling: false
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

		$('#ProcedureTime').timepicker({
			step:15,
			minTime: '6:00am',
      		maxTime: '4:00pm'
		});
		$('#ProcedureTime').on('changeTime', function(time) {
			component.setState({ProcedureTime:time.target.value});
		});

		jQuery('#confirmModal').on('hidden.bs.modal', function () {
			component.setState(component.getInitialState());
		});
	},

	handleChange: function(event) {
		var changeVar = {};
		if (event.target.id == "MedicalReference") changeVar[event.target.id] = event.target.value.substring(0,10);
		else changeVar[event.target.id] = event.target.value;
		this.setState(changeVar);
	},

	validateForm: function(){
		var errorMessages = [];
		if (this.props.tid == "") errorMessages.push("This URL is invalid, please contact Medumo for help")
		if(this.state.SurName == '') errorMessages.push("Last name is Required");
		if(this.state.MedicalReference == '') errorMessages.push("Medical Record Number is Required");
		if(this.state.ProcedureTime == '') errorMessages.push("Arrival Time is Required");
		if(this.state.ProcedureDate == '') errorMessages.push("Arrival Date is Required");

		if (this.state.MedicalReference != '') {
			var referenceNumber = String(this.state.MedicalReference);
			if (referenceNumber.length != 10) errorMessages.push("Medical Record Number is Invalid");
			else if(!(/^[0-9]+$/.test(referenceNumber))) errorMessages.push("Medical Reference is Invalid");
		}

		this.setState({errorMessages:errorMessages});
		if (errorMessages.length > 0) return false;
		else return true;
	},

	submitReschedule: function(){
		// jQuery('#rescheduleModal').modal('hide'); //DEV
		// jQuery('#confirmModal').modal('show'); //DEV
		// return; //DEV
		var component = this;
		jQuery('#rescheduleModal').modal('hide');
		component.setState({isRescheduling:true}, ()=>{
			var timeDate = createTimeDate(this.state.ProcedureDate, this.state.ProcedureTime);
			var putData = {
				Date: timeDate,
				MedicalReferenceNumber: this.state.MedicalReference,
				PatientSurname: this.state.SurName
			};
			var ajaxRequest = {
				url: "/api/Reschedule?tid=" + this.props.tid,
				data: putData,
				type: 'PUT'
			}

			$.ajax(ajaxRequest).then(function(){
				jQuery('#confirmModal').modal('show');
				component.setState({isRescheduling:false});
				return;
			}).fail(function(err){
				console.log(err);
				var errorMessages = ["There was a problem rescheduling the patient"];
				component.setState({errorMessages:errorMessages,isRescheduling:false});
				return;
			});
		});
		return;
	},

	handleSelect: function (event){
		this.setState({ProcedureId:event.target.value});
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

	checkReschedule: function(){
		if(!this.validateForm()) return;
		jQuery('#rescheduleModal').modal('show');
		return;
	},
	render: function (){
		return (
			<div>
				<div className="row text-center">
					<div className="col-sm-6 col-sm-offset-3 col-xs-10 col-xs-offset-1">
						<span className="fontSize28 bold">Patient Rescheduling</span>
					</div>
				</div>
				<div className="row text-center marginBottom10">
					<div className="col-sm-6 col-sm-offset-3 col-xs-10 col-xs-offset-1">
						<span className="fontSize16">{this.props.rescheduleBanner}</span>
					</div>
				</div>
				<div className="row">
					<div className="col-sm-4 col-sm-offset-4 col-xs-10 col-xs-offset-1 input-group">
						<input type="text" id="SurName" className="form-control" placeholder="Patient last name" value={this.state.SurName} onChange={this.handleChange}/>
						<div className="input-group-addon" onClick={this.selectInput}>
							<i className="fa fa-user fa-fw"></i>
						</div>
					</div>
				</div>
				<div className="row">
					<div className="col-sm-4 col-sm-offset-4 col-xs-10 col-xs-offset-1 input-group">
						<input type="text" id="MedicalReference" className="form-control" placeholder="Medical record number" value={this.state.MedicalReference} onChange={this.handleChange}/>
						<div className="input-group-addon" onClick={this.selectInput}>
							<i className="fa fa-medkit fa-fw"></i>
						</div>
					</div>
				</div>
				<div className="row">
					<div className="col-sm-4 col-sm-offset-4 col-xs-10 col-xs-offset-1 input-group">
						<input type="text" id="ProcedureDate" className="form-control" placeholder="New arrival date" value={this.state.ProcedureDate}/>
						<div className="input-group-addon" onClick={this.selectInput}>
							<i className="fa fa-calendar fa-fw"></i>
						</div>
					</div>
				</div>
				<div className="row">
					<div className="col-sm-4 col-sm-offset-4 col-xs-10 col-xs-offset-1 input-group">
						<input type="text" id="ProcedureTime" className="form-control" placeholder="New arrival time" value={this.state.ProcedureTime}/>
						<div className="input-group-addon" onClick={this.selectInput}>
							<i className="fa fa-clock-o fa-fw"></i>
						</div>
					</div>
				</div>
				<div className="row">
					<div id="errorMessages" className="col-sm-4 col-sm-offset-4 col-xs-10 col-xs-offset-1">
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
					<div className="col-sm-4 col-sm-offset-4 col-xs-12">
					{
						(this.state.isRescheduling)
						?(<button id="rescheduleButton" type="button" className="col-xs-12 btn btn-primary" disabled="true">
							Rescheduling...
						</button>)
						:(<button id="rescheduleButton" onClick={this.checkReschedule} type="button" className="col-xs-12 btn btn-primary">
							Record rescheduled patient
						</button>)
					}
					</div>
				</div>
				<Modal name="rescheduleModal">
					<div>
						<div className="row text-center">
							<h1>Are you sure?</h1>
						</div>
						<div className="row text-center paddingTop15">
							<h4>{this.state.SurName} {this.state.MedicalReference}</h4>
							<h4>The patient above will be rescheduled to <span className="bold">{this.state.ProcedureDate}</span> at <span className="bold">{this.state.ProcedureTime}</span></h4>
						</div>
						<div className="row marginBottom25">
							<div className="col-xs-12">
								<button id="newPatient" type="button" className="btn btn-tertiary col-xs-10 col-xs-offset-1" onClick={this.submitReschedule}>
									Yes, I am sure
								</button>
							</div>
							<div className="col-xs-12 paddingTop15">
								<button id="newPatient" type="button" className="btn btn-primary col-xs-10 col-xs-offset-1" data-dismiss="modal">
									No, do not reschedule patient
								</button>
							</div>
						</div>
					</div>
				</Modal>
				<Modal name="confirmModal">
					<div>
						<div className="row text-center">
							<h2 className="bold">Thank you</h2>
						</div>
						<div className="row text-center">
							<h4>{this.state.SurName} {this.state.MedicalReference}</h4>
							<h4>The patient above has been rescheduled</h4>
						</div>
						<div className="row marginBottom25">
							<div className="col-xs-12">
								<button id="newPatient" type="button" className="btn btn-primary btn-lg autoMargin" data-dismiss="modal">
									Record another rescheduled patient
								</button>
							</div>
						</div>
					</div>
				</Modal>
			</div>

		);
	}
});
