import React from 'react'
import { render } from 'react-dom'
import Header from './header.js'
import Modal from '../CommonComponents/modal.js'
import $ from 'jquery'
import 'bootstrap/js/modal'
import { Link, hashHistory } from 'react-router'
import NavTop from '../CaretourComponents/navTop.js'

export default React.createClass({
	getInitialState: function() {
		return {
			info : {
				AdditionalInfo:""
			},
			userLogs: [
				"Call Tenant General Button Click",
				"Call Tenant Scheduling Button Click",
				"Map Tenant Button Click",
				"Tenant Parking Button Click"
			]
		};
	},
	componentDidMount: function(){
		var component = this;
		$.get("/api/tenant/?id=" + this.props.ut , function(data) {
	/*$.get("http://localhost:14983/api/tenant/?id=" + this.props.ut , function(data) {
	*/		component.setState({info:data});
		}).fail(function(err){
			console.log(err);
		});
		this.props.hook("OpenedContact");
		return;
	},

	render: function() {
		var info = this.state.info;
		var addressLink = "https://www.google.com/maps/place/" + info.AddressLine1 + ", " + info.AddressLine2 + ", " + info.City + ", " + info.State + " " + info.Zip;
		var formattedAddressLink = addressLink.split(' ').join('+');
		var genTelephone = "" + info.GeneralPhoneNumber;
		genTelephone = "tel:"+ genTelephone.replace(/[^\d]/g, '');
		var scheduleTelephone = "" + info.SchedulingPhoneNumber;
		scheduleTelephone = "tel:"+ scheduleTelephone.replace(/[^\d]/g, '');

		return (
				<div className="row">
					<NavTop hook={this.props.hook}/>
					<div className="col-xs-12"><div className="col-xs-12">
						<div className="col-xs-12">
							<span className="headerStyle">Need to cancel or reschedule?</span>
						</div>
						<div className="col-xs-12 paddingTop16">
								<a href={scheduleTelephone}>
									<button type="button" className="col-xs-12 btn btn-primary text-center" title="Click to Dial - Mobile Only" onClick={()=>this.props.hook("ClickedContact1")}>
										<span><i className="fa fa-phone"/></span>
										<span className="paddingLeft10">Call {info.SchedulingPhoneNumber}</span>
									</button>
								</a>
						</div>

						<div className="col-xs-12 col-sm-10 paddingTop25">
								<span className="headerStyle">{this.props.pageFields.info.header}</span>
						</div>
						<div className="col-xs-12 paddingTop16">
								<a href={genTelephone}>
									<button type="button" className="col-xs-12 btn btn-primary text-center" title="CLICK TO DIAL - Mobile Only" onClick={()=>this.props.hook("ClickedContact2")}>
										<span><i className="fa fa-phone"/></span>
										<span className="paddingLeft10">Call {info.GeneralPhoneNumber}</span>
									</button>
								</a>
						</div>


						<div className="col-xs-12 paddingTop25">
							<span className="headerStyle">Planning your visit?</span>
						</div>
						<div className="col-xs-12">
							<span className="addressInfo">
								{
									(typeof info.addressNote !== "undefined")?
									<span>{info.addressNote}<br /></span>:
									<span></span>

								}
								{info.AddressLine1} {info.AddressLine2}<br />{info.City}, {info.State} {info.Zip}</span><br/>

						</div>
						<div className="col-xs-6 marginTop16">

							<a target="_blank" href={formattedAddressLink}>
								<button type="button" className="col-xs-12 btn btn-primary" onClick={()=>this.props.hook("ClickedMaps")}>
									<span><i className="fa fa-fw fa-map-marker"/></span>
									<span className="paddingLeft10">Maps</span>
								</button>
							</a><br/>
						</div>
						<div className="col-xs-6 marginTop16">
							<button type="button" className="col-xs-12 btn btn-primary" data-toggle="modal" data-target="#parkingModal" onClick={()=>this.props.hook("ClickedParking")}>
								<span><i className="fa fa-fw fa-car"/></span>
								<span className="paddingLeft10">Parking</span>
							</button>
						</div>
					</div></div>
					{/* <div className="unsubscribeInfo col-xs-12 marginTop15">
					<span className="bold">{this.props.pageFields.info.footer}</span>
					<Link to={{pathname: "/notify", query:{id:this.props.ut,internal:"true"}}}>
						<button type="button" className="blackOutline col-xs-12 col-sm-6 col-sm-offset-3 btn btn-tertiary marginTop5">Change settings or unsubscribe</button>
					</Link>
					</div> */}

					<Modal name="parkingModal">
						<div>
							<div className="col-xs-12 paddingBottom15 text-center">
								<span className="bold">Parking</span>
							</div>
							<div className="col-xs-12 paddingBottom15 text-center">
								{
									info.AdditionalInfo.split('\n').map(function(item, key) {
										return (
											<span key={key}>
												{item}
												<br/>
											</span>
										)
									})
								}
							</div>
							<div className="col-xs-12">
								<button type="button" className="col-xs-8 col-xs-offset-2 btn btn-primary" data-dismiss="modal"  onClick={()=>this.props.hook("ClickedParkingGoBack")}>
									Go Back
								</button>
							</div>
						</div>
					</Modal>
				</div>
		)
	}
});
