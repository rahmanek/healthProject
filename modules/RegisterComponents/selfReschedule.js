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
			errorMessages: [],
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
		changeVar[event.target.id] = event.target.value;
		this.setState(changeVar);
	},

	validateForm: function(){
		var errorMessages = [];
		if (this.props.ut == "") errorMessages.push("This URL is invalid, please contact Medumo for help")
		if(this.state.ProcedureTime == '') errorMessages.push("Arrival Time is Required");
		if(this.state.ProcedureDate == '') errorMessages.push("Arrival Date is Required");

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
				Id: this.props.ut
			};
			var ajaxRequest = {
				url: "/api/SelfReschedule",
				data: putData,
				type: 'PUT'
			}

			$.ajax(ajaxRequest).then(function(){
				jQuery('#confirmModal').modal('show');
				component.setState({isRescheduling:false});
				return;
			}).fail(function(err){
				console.log(err);
				var errorMessages = ["There was a problem with rescheduling"];
				component.setState({errorMessages:errorMessages,isRescheduling:false});
				return;
			});
		});
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
						<span className="fontSize28 bold">Reset timing of reminders</span>
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
							Resetting...
						</button>)
						:(<button id="rescheduleButton" onClick={this.checkReschedule} type="button" className="col-xs-12 btn btn-primary">
							Set reminders with this procedure time
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
							<h4>Your reminders will be sent according to your new date and time: <span className="bold">{this.state.ProcedureDate}</span> at <span className="bold">{this.state.ProcedureTime}</span></h4>
						</div>
						<div className="row marginBottom25">
							<div className="col-xs-12">
								<button id="newPatient" type="button" className="btn btn-tertiary col-xs-10 col-xs-offset-1" onClick={this.submitReschedule}>
									Yes, I am sure
								</button>
							</div>
							<div className="col-xs-12 paddingTop15">
								<button id="newPatient" type="button" className="btn btn-primary col-xs-10 col-xs-offset-1" data-dismiss="modal">
									Nope, nevermind
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
							<h4>You've reset reminder timing to your new procedure date and time</h4>
						</div>
					</div>
				</Modal>
			</div>

		);
	}
});
