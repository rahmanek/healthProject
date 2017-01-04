import React from 'react'
import { render } from 'react-dom'
import Modal from '../CommonComponents/modal.js'

export default React.createClass({
	getInitialState: function() {
		return {
			MedicalReference: '',
			errorMessages: [],
			SurName: '',
			isCancelling: false
		};
	},
	handleChange: function(event) {
		var changeVar = {};
		if (event.target.id == "MedicalReference") changeVar[event.target.id] = event.target.value.substring(0,10);
		else changeVar[event.target.id] = event.target.value;
		this.setState(changeVar);
	},
	componentDidMount: function(){
		var component = this;
		jQuery('#confirmModal').on('hidden.bs.modal', function () {
			component.setState(component.getInitialState());
		});
	},
	checkCancel: function(){
		// jQuery('#cancelModal').modal('show'); //DEV
		// return; //DEV
		if(!this.validateForm()) return;
		jQuery('#cancelModal').modal('show');
		return;
	},
	validateForm: function(){
		var errorMessages = [];
		if (this.props.tid == "") errorMessages.push("This URL is invalid, please contact Medumo for help")
		if(this.state.SurName == '') errorMessages.push("Last name is Required");
		if(this.state.MedicalReference == '') errorMessages.push("Medical Reference Number is Required");

		if (this.state.MedicalReference != '') {
			var referenceNumber = String(this.state.MedicalReference);
			if (referenceNumber.length != 10) errorMessages.push("Medical Reference is Invalid");
			else if(!(/^[0-9]+$/.test(referenceNumber))) errorMessages.push("Medical Reference is Invalid");
		}

		this.setState({errorMessages:errorMessages});
		if (errorMessages.length > 0) return false;
		else return true;
	},
	submitCancel: function(){
		// jQuery('#cancelModal').modal('hide'); //DEV
		// jQuery('#confirmModal').modal('show'); //DEV
		// return; //DEV
		var component = this;
		jQuery('#cancelModal').modal('hide');
		this.setState({isCancelling:true},()=>{
			var putData = {
				MedicalReferenceNumber: this.state.MedicalReference,
				PatientSurname: this.state.SurName
			};
			var ajaxRequest = {
			   url: "/api/PatientTimelineDisable?tid=" + this.props.tid,
				data: putData,
				type: 'PUT'
			}
			$.ajax(ajaxRequest).then(function(){
				jQuery('#confirmModal').modal('show');
				component.setState({isCancelling:false});
			}).fail(function(err){
				console.log(err);
				var errorMessages = ["There was a problem cancelling the patient"];
				component.setState({errorMessages:errorMessages,isCancelling:false});
				return;
			});
		});
		return;
	},
	render: function (){
		return (
			<div>
				<div className="row text-center">
					<div className="col-sm-6 col-sm-offset-3 col-xs-10 col-xs-offset-1">
						<span className="fontSize28 bold">Patient Cancellation</span>
					</div>
				</div>
				<div className="row text-center marginBottom10">
					<div className="col-sm-6 col-sm-offset-3 col-xs-10 col-xs-offset-1">
						<span className="fontSize16">{this.props.cancellationBanner}</span>
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
					<div className="col-sm-4 col-sm-offset-4 col-xs-10 col-xs-offset-1">
					{
						(this.state.isCancelling)
						?(<button id="rescheduleButton" type="button" className="col-xs-12 btn btn-primary" disabled="true">
							Cancelling...
						</button>)
						:(<button id="rescheduleButton" onClick={this.checkCancel} type="button" className="col-xs-12 btn btn-primary">
							Remove patient from program
						</button>)
					}

					</div>
				</div>
				<Modal name="cancelModal">
					<div>
						<div className="row text-center">
							<h1>Are you sure?</h1>
						</div>
						<div className="row text-center paddingTop15">
							<h4>{this.state.SurName} {this.state.MedicalReference}</h4>
							<h4>The patient above will stop receiving digital instructions</h4>
						</div>
						<div className="row marginBottom25">
							<div className="col-xs-10 col-xs-offset-1">
								<button id="newPatient" type="button" className="btn btn-tertiary col-xs-12" onClick={this.submitCancel}>
									Yes, I am sure
								</button>
							</div>
							<div className="col-xs-10 col-xs-offset-1 paddingTop15">
								<button id="newPatient" type="button" className="btn btn-primary col-xs-12" data-dismiss="modal">
									No, do not cancel patient
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
							<h4>The patient above has stopped digital instructions</h4>
						</div>
						<div className="row marginBottom25">
							<div className="col-xs-12">
								<button id="newPatient" type="button" className="btn btn-primary autoMargin" data-dismiss="modal">
									Cancel another patient
								</button>
							</div>
						</div>
					</div>
				</Modal>
			</div>

		);
	}
});
