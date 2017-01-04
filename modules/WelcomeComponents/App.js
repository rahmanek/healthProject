import React from 'react'
import { render } from 'react-dom'
import { Router, Link, hashHistory } from 'react-router'
import { getQueryVariable } from '../Utilities.js'
import $ from 'jquery'

export default React.createClass({
	
	getInitialState: function() {
		return {
			ut: this.props.location.query.id,
			vid: this.props.location.query.vid
		}
	},
	componentDidMount: function() {
		if (this.state.vid == undefined) this.setState({vid:0});
		var postData = {
			UserToken: this.state.ut,
			Action: "Activation Started",
			EntryPoint: this.state.vid
		};
		$.post("/api/UiActionStat", postData, function() {
		return;
		}).fail( (err) => {
			console.log(err);
			return;
		});
	},

	render: function() {
		var pass = {
			ut: this.state.ut,
			vid: this.state.vid,
			pageFields: {
				notify: {
					header: 'How would you like to receive instructions? Text, email, or both?',
					button: 'Save my reminder preferences'
				},
				copilot: {
					header: 'Is anyone helping you prepare for your procedure? Share your instructions.'
				},
				submitted: {
					header: 'We\'ll message you when you have tasks to complete.',
					footer: 'You can browse all the tasks we\'ll send you by clicking below',
					button: 'Optional: Browse task timeline'
				}
			}
		}
		return (
			<div className="displayTable fullHeight fullWidth">
				<div className="displayTableCellMiddle">
					<div className="container noPaddingLeft noPaddingRight">
						<div className="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3 col-lg-6 col-lg-offset-3">
							<div>{React.cloneElement(this.props.children, pass)}</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
});
