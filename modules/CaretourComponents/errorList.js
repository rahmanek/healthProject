import React from 'react'
import { render } from 'react-dom'

export default React.createClass({
	render: function() {

		return (
			<div>
				{
					this.props.errors.map(function(error, i){
						return (
							<div className="errorMessage" key={i}>{ error }</div>
						)
					})
				}
			</div>
		)
	}
});
