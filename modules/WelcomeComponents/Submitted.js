import React from 'react'
import { render } from 'react-dom'

export default React.createClass({
	contextTypes: {
    	router: React.PropTypes.object.isRequired
  	},
    componentDidMount: function() {
        $.post("/api/PatientTimelineActivation/?id=" + this.props.ut);
    },
	render: function (){
		var linkString = "/caretour/#/schedule?id=" + this.props.ut ;
		return (
			<div>
				<div className="row">
					<div className="col-xs-6 col-xs-offset-3">
						<div className="welcome-progress-bar">
							<div className="progress-block filled"></div>
							<div className="progress-block filled"></div>
							<div className="progress-block filled"></div>
						</div>
					</div>
				</div>
			<div className="row marginTop15">
				<div className="col-xs-12 col-md-8 col-md-offset-2 text-center">
					<h2 className="section-h2 upper-text">Thank you!</h2>
					<h2 className="section-h2 noBold">{this.props.pageFields.submitted.header}</h2>
				</div>
			</div>
			<div className="line-break marginTop15"></div>
			<div className="row marginTop15">
				<div className="col-xs-12 col-md-8 col-md-offset-2 text-center">
					<p>{this.props.pageFields.submitted.footer}</p>
				</div>
			</div>
			<div className="row marginTop15">
				<a href={linkString}>
					<button type="button" className="btn btn-tertiary autoMargin blackOutline">
						{this.props.pageFields.submitted.button}
					</button>
				</a>
			</div>
			</div>
		);
	}
});
