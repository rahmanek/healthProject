import React from 'react'
import { render } from 'react-dom'
import Header from './header.js'
import Modal from '../CommonComponents/modal.js'
import $ from 'jquery'
import 'bootstrap/js/modal'
import { Link, hashHistory } from 'react-router'

export default React.createClass({
	getInitialState: function() {
		return {
		};
	},


	render: function() {
		return (
			<div id="navTop" className="col-xs-12 marginBottom30 marginTop15 headerStyle">
				<div className="col-xs-6">
					{
						(this.props.disableReturn)?
						<div></div>:
						<Link to="menu" onClick={()=>{this.props.hook("ClickedMainMenu")
							if(typeof this.props.actionOnMainMenu!= "undefined" && this.props.actionOnMainMenu!= "") this.props.hook(this.props.actionOnMainMenu)
						}}>
							<i className="fa fa-arrow-left fa-fw"/> Menu
						</Link>
					}

				</div>
				<div className="col-xs-6 align-right">
					<Link to="endsession" onClick={()=>this.props.hook("ClickedExit")}>
						Exit <i className="fa fa-times fa-fw"/>
					</Link>
				</div>
			</div>
		)
	}
});
