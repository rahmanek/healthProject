import React from 'react'
import { render } from 'react-dom'

export default React.createClass({
	render: function() {
		return (
			<div className="modal fade" id={this.props.name} role="dialog" aria-labelledby="myModalLabel">
				<div className="modal-dialog" role="document">
					<div className="modal-content marginTop50">
						<div className="row paddingTop35 paddingBottom35">
							<div className="col-xs-10 col-xs-offset-1">
								{this.props.children}
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
});
