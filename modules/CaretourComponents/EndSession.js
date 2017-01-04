import React from 'react'
import { render } from 'react-dom'
import $ from 'jquery'

export default React.createClass({

	componentDidMount: function(){
		this.props.hook("OpenedExit");
	},

	render: function() {

		return (
			<div>
			<div className="row marginTop75">
				<div className="col-xs-10 col-xs-offset-1 col-sm-8 col-sm-offset-2 text-center">
					<h2 className="section-h2 no-bold">Click any link we sent you if you want to return to the program</h2>
				</div>
			</div>
			</div>
		);
	}
});
